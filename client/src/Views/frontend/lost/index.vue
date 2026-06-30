<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getLostItemsByCategoryId } from "@/api/home"
import Category from '@/Views/components/Category.vue'
import SearchItem from '@/Views/components/SearchItem.vue'
import ItemListCard from '@/Views/components/ItemListCard.vue'
import SkeletonWrapper from '@/Views/components/Skeleton/SkeletonWrapper.vue'
import SkeletonItemListCard from '@/Views/components/SkeletonItemListCard.vue'
import Pagination from '@/Views/components/Pagination.vue'

import { useCategoryStore } from '@/stores/modules/categorydata'

const categoryData = useCategoryStore()
// 只使用 store 的分类树，页面自行管理选中与数据，降低耦合
const { lostItems: storeLostItems } = storeToRefs(categoryData) // kept for reference if needed

// 页面本地状态（独立于全局 store）
const activeCategoryId = ref(null)
const activeSubCategoryId = ref(null)
const lostItems = ref([])
const hasSearched = ref(false)

// 分页数据总数
const total = ref(0)

// 准备分页参数对象
const params = ref({
  pageNum: 1,
  pageSize: 9,
  categoryId: '',
  subCategoryId: ''
})

// 分页页码改变时触发
const onPageChange = (page) => {
  params.value.pageNum = page
  fetchItems()
}



// 骨架数量缓存（核心）
const displayLength = ref(6)

// 是否显示骨架（只看数据）
const showSkeleton = computed(() => lostItems.value.length === 0 && !hasSearched.value)

// 骨架列表
const skeletonList = computed(() =>
  Array.from({ length: displayLength.value }, (_, i) => ({ id: i }))
)

// 统一数据更新入口（页面本地处理）
const updateList = (items) => {
  if (!items) return
  if (items && items.length > 0) {
    displayLength.value = items.length
  }
  const filterItems = items.filter(item => item.type === 'lost' && item.audit_status === 1)
  lostItems.value = filterItems
}

// 搜索触发
const handleUpdateItemList = (items) => {
  updateList(items)
}

// 本地请求函数
const fetchItems = async () => {
  const res = await getLostItemsByCategoryId({
    categoryId: activeCategoryId.value,
    subCategoryId: activeSubCategoryId.value,
    pageNum: params.value.pageNum,
    pageSize: params.value.pageSize,
  })

  const list = (res.data?.list || []).filter(i => i.type === 'lost' && i.audit_status === 1)

  lostItems.value = list
  total.value = res.data?.total || 0

  hasSearched.value = true

  // 更新骨架数量
  displayLength.value = params.value.pageSize
  return res
}

// 页面初始化：重置本地选中并请求数据（避免修改全局 store）
activeCategoryId.value = null
activeSubCategoryId.value = null

onMounted(async () => {
  const res = await fetchItems()
  if (lostItems.value.length > 0) {
    displayLength.value = lostItems.value.length
  }
})

// 当分类变化时重新获取数据（由 Category 组件 emit 触发）
watch([activeCategoryId, activeSubCategoryId], () => {
  params.value.pageNum = 1
  fetchItems()
})
</script>

<template>

  <SearchItem @update-itemList="handleUpdateItemList" />

  <Category v-model:activeCategoryId="activeCategoryId" v-model:activeSubCategoryId="activeSubCategoryId" />

  <div class="list-container">

  <div v-if="lostItems.length === 0 && hasSearched" class="no-data">
    暂无该物品信息
  </div>

  <div v-else class="list-grid">
    <SkeletonWrapper :loading="showSkeleton">

      <template #default>
        <ItemListCard
          v-for="item in lostItems"
          :key="item.id"
          :item="item"
        />
      </template>

      <template #skeleton>
        <SkeletonItemListCard
          v-for="(item, index) in skeletonList"
          :key="index"
        />
      </template>

    </SkeletonWrapper>
  </div>

  <div class="pagination-wrapper" v-if="lostItems.length > 0">
    <Pagination
    :total="total"
    :params="params"
    @page-change="onPageChange"
    />
  </div>
</div>
</template>

<style scoped lang="scss">

.list-container{
  max-width:1200px;
  margin:30px auto;
}

/* 正常列表 */
.list-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(360px,1fr));
  gap:20px;
}

/* 空状态居中 */
.no-data {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;
  color: #999;
  font-size: 16px;
}

.pagination-wrapper{
  display:flex;
  justify-content:center;
  margin-top:20px;
}
</style>
