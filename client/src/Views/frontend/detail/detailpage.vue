<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getItemDetail } from "@/api/home";

import ItemDetail from "./components/ItemDetail.vue";
import SkeletonDetail from "./components/SkeletonDetail.vue";

const route = useRoute();

const item = ref(null);

// 是否显示骨架
const showSkeleton = computed(() => !item.value);

// 获取数据
const getItemData = async () => {
  const res = await getItemDetail(route.params.id);
  item.value = res;
};

onMounted(() => {
  getItemData();
});
</script>

<template>
  <SkeletonDetail v-if="showSkeleton" />
  <ItemDetail v-else :item="item" />
</template>
