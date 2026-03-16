<script setup>
import { getItemsByName } from "@/api/home";
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";

// 定义emit事件触发 通知父组件更新搜索结果
const emit = defineEmits(['update-itemList'])

// 使用路由
const router = useRouter()

// 提供一个搜索表单 返回的是一个物品列表
const searchItemNameRef = ref(null);

// 接收搜索后返回的物品列表
const itemList = ref([])
// 搜索物品的点击事件功能
const searchItemName = async () => {

 // 调用搜索物品接口

 const res = await getItemsByName({

  title: searchItemNameRef.value

 })

 console.log('搜索结果:', res);

 // 将搜索结果赋值给itemList

 itemList.value = res.data
 // 触发事件 通知父组件更新搜索结果

 emit('update-itemList', itemList.value)

}
</script>
<template>
    <div class="search">
      <input
      v-model="searchItemNameRef"
      type="text"
      @keyup.enter="searchItemName"
      placeholder="搜索物品名称">
    </div>
</template>
<style scoped lang="scss">
.search {
  width: 1240px;
  margin: 20px auto;
  input {
    width: 170px;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #ccc;
    border-radius: 20px;
  }
}
</style>
