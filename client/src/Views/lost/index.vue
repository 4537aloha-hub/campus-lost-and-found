<script setup>

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import Category from '@/Views/components/Category.vue'
import SearchItem from '@/Views/components/SearchItem.vue'
import ItemListCard from '@/Views/components/ItemListCard.vue'

import { useCategoryStore } from '@/stores/modules/categorydata'

const categoryData = useCategoryStore()
const { lostItems } = storeToRefs(categoryData)
const { getItems } = categoryData
const handleUpdateItemList = (items)=>{
  lostItems.value = items
}

onMounted(()=>{
  getItems()
})

</script>

<template>

<SearchItem @update-itemList="handleUpdateItemList" />

<Category />

  <div class="list-container">

    <ItemListCard
      v-for="item in lostItems"
      :key="item.id"
      :item="item"
    />

  </div>

</template>

<style scoped>

.list-container{

  max-width:1200px;
  margin:30px auto;
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(360px,1fr));
  gap:20px;
}

</style>
