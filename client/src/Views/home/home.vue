<script setup>
// 导入组件
import HomeBanner from '@/Views/home/components/HomeBanner.vue'
import HomePanel from '@/Views/home/components/HomePanel.vue'
import ItemCard from '@/Views/home/components/ItemCard.vue'
// 导入获取物品列表接口
import { getItems } from '@/api/home'
// 导入Vue的响应式数据和挂载生命周期函数
import { ref,onMounted } from 'vue'

const foundList = ref([])
const lostList = ref([])

// 定义获取物品列表的异步函数
const getData = async () => {

const res = await getItems()

foundList.value = res.filter(i => i.type === 'found')

lostList.value = res.filter(i => i.type === 'lost')

}

onMounted(() => {

getData()

})

</script>

<template>
  <HomeBanner />

  <HomePanel title="最新招领">

    <ItemCard
    v-for="item in foundList.slice(0, 4)"
    :key="item.id"
    :item="item"
    />

  </HomePanel>

  <HomePanel title="最新失物">

    <ItemCard
    v-for="item in lostList.slice(0, 4)"
    :key="item.id"
    :item="item"
    />

  </HomePanel>

</template>
