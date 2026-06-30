<script setup>

import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getPublishItemsByCategoryId } from '@/api/home'

import Category from '@/Views/components/Category.vue'
import SearchItem from '@/Views/components/SearchItem.vue'
import ItemListCard from '@/Views/components/ItemListCard.vue'

import { useCategoryStore } from '@/stores/modules/categorydata'

// 骨架屏物品卡片组件
import SkeletonItemListCard from '@/Views/components/SkeletonItemListCard.vue'

// 导入分页组件
import Pagination from '@/Views/components/Pagination.vue'

// 骨架屏包裹组件
import SkeletonWrapper from '@/Views/components/Skeleton/SkeletonWrapper.vue'

const categoryData = useCategoryStore()
// 页面本地状态，避免与另一个页面共享 items 导致耦合
const { publishItems: storePublishItems } = storeToRefs(categoryData)

const activeCategoryId = ref(null)
const activeSubCategoryId = ref(null)
const publishItems = ref([])
const hasSearched = ref(false)

// 骨架屏长度缓存
const displayLength = ref(6)

const total = ref(0)

// 提供分页对象组
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

// 是否显示骨架（核心）
const showSkeleton = computed(() => publishItems.value.length === 0 && !hasSearched.value)

// 骨架数组（自适应）
const skeletonList = computed(() => Array.from({ length: displayLength.value }, (_, i) => ({ id: i })))


const updateList = (items) => {
  // 更新骨架数量
  if(items && items.length > 0 && items.type === 'found') {
    displayLength.value = items.length
  }

  // 搜索结果只返回found类型物品
  const filterItems = items.filter(item => item.type === 'found')

  publishItems.value = filterItems

}

const handleUpdateItemList = (items) => {
  updateList(items)
}

const fetchItems = async () => {
  const res = await getPublishItemsByCategoryId({
    categoryId: activeCategoryId.value,
    subCategoryId: activeSubCategoryId.value,
    pageNum: params.value.pageNum,
    pageSize: params.value.pageSize
  })
  const list = (res.data?.list || []).filter(i => i.type === 'found' && i.audit_status === 1)

  publishItems.value = list
  total.value = res.data?.total || 0

  hasSearched.value = true

  // 更新骨架数量
  displayLength.value = params.value.pageSize
  return res
}

// 页面初始化：本地重置后请求
activeCategoryId.value = null
activeSubCategoryId.value = null
onMounted(async () => {
  await fetchItems()
  if (publishItems.value.length > 0) {
    displayLength.value = publishItems.value.length
  }
})

watch([activeCategoryId, activeSubCategoryId], () => {
  fetchItems()
})

</script>

<template>

  <SearchItem @update-itemList="handleUpdateItemList" />

  <Category v-model:activeCategoryId="activeCategoryId" v-model:activeSubCategoryId="activeSubCategoryId" />

  <div class="list-container">

  <div v-if="publishItems.length === 0 && hasSearched" class="no-data">
    暂无该物品信息
  </div>

  <div v-else class="list-grid">
    <SkeletonWrapper :loading="showSkeleton">

      <template #default>
        <ItemListCard
          v-for="item in publishItems"
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

  <!-- 分页组件 -->
  <Pagination
  :total="total"
  :params="params"
  @page-change="onPageChange"
  class="pagination-wrapper"
  />
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

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
