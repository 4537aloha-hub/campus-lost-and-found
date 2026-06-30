import {defineStore} from 'pinia'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { getCategoryTree } from '@/api/category'
import { getLostItemsByCategoryId } from '@/api/home'

export const useCategoryStore = defineStore('category', () => {
  const route = useRoute()

  // 定义分类数据

  // 1.分类标题
  const categories = ref([])// 获取物品分类树
  const subCategories = ref([])
  // 2.物品数据
  const items = ref([])
  // 3.根据type区分物品数据
  const publishItems = ref([])
  const lostItems = ref([])

  // 5.添加静态锁 防止重复请求
  let currentRequestId = 0

  // 是否已搜索或分类选择
  const hasSearched = ref(false)

  // 获取物品分类树
  const getCategories = async () => {
    const res = await getCategoryTree()
    console.log('获取物品分类树成功', res);
    categories.value = res.data
  }

  // 选中分类功能
  const activeCategoryId = ref(null) // null = 空/全部
  const activeSubCategoryId = ref(null) // null = 空/全部


  // 按照物品的type属性过滤物品数据 用以渲染不同页面(失物招领和失物中心)获取的物品数据
  // 无需向外暴露该方法 仅在内部使用
  const filterItemsByType = () => {
    // 为publishItems和lostItems赋值 (由items.value通过filter方法按照type属性进行筛选)
    publishItems.value = items.value.filter(item => item.type === 'found')
    lostItems.value = items.value.filter(item => item.type === 'lost')
  }

  // 获取物品数据
  const getItems = async () => {

    const requestId = ++currentRequestId


    const params = {
      categoryId: activeCategoryId.value,
      subCategoryId: activeSubCategoryId.value,
    }

      const res = await getLostItemsByCategoryId(params)
      // 如果不是最新请求 直接丢弃
      if(requestId !== currentRequestId) return
      console.log('获取物品数据成功', res);
      items.value = res.data
      filterItemsByType()
      hasSearched.value = true

  }

  // 选择一级分类功能
  const selectCategory = async (category) => {
    activeCategoryId.value = category ? category.id : null
    activeSubCategoryId.value = null // 重置二级分类为全部
    subCategories.value = category ? category.children : []
    hasSearched.value = true
    await getItems()
  }

  // 选择二级分类功能
  const selectSubCategoty = async (subCategory) => {
    activeSubCategoryId.value = subCategory ? subCategory.id : null
    hasSearched.value = true
    await getItems()
  }

  // 重置分类选中状态
  const resetCategory = () => {
    activeCategoryId.value = null
    activeSubCategoryId.value = null
    subCategories.value = []
    hasSearched.value = false
  }

  return {
    categories,
    subCategories,
    activeCategoryId,
    activeSubCategoryId,
    publishItems,
    lostItems,
    hasSearched,
    selectCategory,
    selectSubCategoty,
    getItems,
    getCategories,
    resetCategory,
  }
})
