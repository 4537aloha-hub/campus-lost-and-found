<script setup>
// 引入分类仓库
import { useCategoryStore } from '@/stores/modules/categorydata';
import { onMounted } from 'vue'
// 需要 storeToRefs 来保持从仓库中获取的响应式数据
import { storeToRefs } from 'pinia';
const categoryStore = useCategoryStore();

// 结构响应式数据
const {
  categories,
  subCategories,
  activeCategoryId,
  activeSubCategoryId,
} = storeToRefs(categoryStore);

// 结构函数功能
const {
  selectCategory,
  selectSubCategoty,
  getCategories,
} = categoryStore;

onMounted(()=>{
  getCategories();
})

</script>

<template>
    <div class="container">
    <!-- 一级分类 -->
     <!-- 绑定active -->
    <ul class="category">
      <li
      :class="{active: activeCategoryId === null}"
      @click="selectCategory(null)"
      >全部</li>
      <li
      v-for="item in categories" :key="item.id"
      :class="{active: activeCategoryId === item.id}"
      @click="selectCategory(item)"
      >
        {{ item.name }}
      </li>
    </ul>
    <!-- 二级分类 -->
     <ul class="sub-category">
      <li
      :class="{active: activeSubCategoryId === null}"
      @click="selectSubCategoty(null)"
      >全部</li>
      <li
      v-for="sub in subCategories" :key="sub.id"
      :class="{active: activeSubCategoryId === sub.id}"
      @click="selectSubCategoty(sub)"
      >{{ sub.name }}</li>
     </ul>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 1240px;
  margin: 0 auto;
  // 一级标题样式
  .category {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0;
  list-style: none;
  padding: 0;

  li {
    padding: 6px 16px;
    border-radius: 20px;
    background: #f4f4f5;
    cursor: pointer;

      &.active {
        background: #409eff;
        color: #fff;
      }
    }
  }

    // 二级标题样式
  .sub-category {
    display: flex;
    gap: 10px;
    margin-bottom:20px;
    list-style: none;
    padding: 0;

    li {
      padding: 4px 12px;
      border-radius: 14px;
      font-size: 13px;
      background: #f7f8fa;
      cursor: pointer;

      &.active {
        color: #409eff;
        background: rgba(64,158,255,.15);
      }
    }
  }
}</style>
