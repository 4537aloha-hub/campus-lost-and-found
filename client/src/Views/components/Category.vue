<script setup>
// 引入分类仓库
import { useCategoryStore } from '@/stores/modules/categorydata';
import { onMounted } from 'vue'
// 需要 storeToRefs 来保持从仓库中获取的响应式数据
import { storeToRefs } from 'pinia';
const categoryStore = useCategoryStore();

// 结构响应式数据（只获取分类树）
const { categories } = storeToRefs(categoryStore);
const { getCategories } = categoryStore;

// 组件为无状态展示组件：接收父组件传入的选中 id 并通过事件通知父组件变更
const props = defineProps({
  activeCategoryId: { type: [Number, null], default: null },
  activeSubCategoryId: { type: [Number, null], default: null },
})

const emit = defineEmits(['update:activeCategoryId', 'update:activeSubCategoryId'])

// 计算当前一级分类对应的二级分类（基于分类树，不改变 store）
import { computed } from 'vue'
const localSubCategories = computed(() => {
  if (props.activeCategoryId == null) return []
  const node = categories.value.find(c => c.id === props.activeCategoryId)
  return node && node.children ? node.children : []
})

onMounted(()=>{
  getCategories();
})

// 当用户点击一级/二级分类时，通过事件将选择告知父组件，由父组件控制数据请求和选中状态
const selectCategory = (category) => {
  emit('update:activeCategoryId', category ? category.id : null)
  // 切换一级分类时重置二级分类为全部
  emit('update:activeSubCategoryId', null)
}

const selectSubCategoty = (sub) => {
  emit('update:activeSubCategoryId', sub ? sub.id : null)
}

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
      v-for="sub in localSubCategories" :key="sub.id"
      :class="{active: activeSubCategoryId === sub.id}"
      @click="selectSubCategoty(sub)"
      >{{ sub.name }}</li>
     </ul>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  max-width: 1240px;
  padding: 0 16px;
  margin: 0 auto;
  box-sizing: border-box;
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
