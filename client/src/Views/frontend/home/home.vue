<script setup>
// 组件
import HomeBanner from '@/Views/frontend/home/components/HomeBanner.vue'
import HomePanel from '@/Views/frontend/home/components/HomePanel.vue'
import ItemCard from '@/Views/frontend/home/components/ItemCard.vue'
import SkeletonCard from '@/Views/frontend/home/components/SkeletonCard.vue'
import SkeletonWrapper from '@/Views/components/Skeleton/SkeletonWrapper.vue'
import FrontendNotice from '@/Views/frontend/home/components/FrontendNotice.vue'


// API
import { getItems } from '@/api/home'

import { ref, onMounted, computed } from 'vue'

// 数据
const foundList = ref([])
const lostList = ref([])

// 骨架数量缓存（关键）
const foundLength = ref(4)
const lostLength = ref(4)

// 是否显示骨架（核心）
const showFoundSkeleton = computed(() => foundList.value.length === 0)
const showLostSkeleton = computed(() => lostList.value.length === 0)

// 骨架数组（自适应）
const foundSkeletonList = computed(() =>
  Array.from({ length: foundLength.value }, (_, i) => ({ id: i }))
)

const lostSkeletonList = computed(() =>
  Array.from({ length: lostLength.value }, (_, i) => ({ id: i }))
)

// 获取数据
const getData = async () => {
  const res = await getItems()

  const found = res.filter(i => i.type === 'found').slice(0, 4)
  const lost = res.filter(i => i.type === 'lost').slice(0, 4)

  // 先记录长度（防闪）
  if (found.length > 0) {
    foundLength.value = found.length
  }
  if (lost.length > 0) {
    lostLength.value = lost.length
  }

  foundList.value = found
  lostList.value = lost
}

onMounted(() => {
  getData()
})
</script>

<template>
  <!-- 通知栏 -->
  <FrontendNotice />

  <!-- 轮播图 -->
  <HomeBanner />

  <!-- 招领 -->
  <HomePanel title="最新招领">
    <SkeletonWrapper :loading="showFoundSkeleton">

      <!-- 骨架 -->
      <template #skeleton>
        <SkeletonCard
          v-for="(item, index) in foundSkeletonList"
          :key="index"
        />
      </template>

      <!-- 内容 -->
      <template #default>
        <ItemCard
          v-for="item in foundList"
          :key="item.id"
          :item="item"
        />
      </template>

    </SkeletonWrapper>
  </HomePanel>

  <!-- 失物 -->
  <HomePanel title="最新失物">
    <SkeletonWrapper :loading="showLostSkeleton">

      <!-- 骨架 -->
      <template #skeleton>
        <SkeletonCard
          v-for="(item, index) in lostSkeletonList"
          :key="index"
        />
      </template>

      <!-- 内容 -->
      <template #default>
        <ItemCard
          v-for="item in lostList"
          :key="item.id"
          :item="item"
        />
      </template>

    </SkeletonWrapper>
  </HomePanel>
</template>
