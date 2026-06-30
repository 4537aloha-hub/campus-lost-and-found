<script setup>
import SkeletonRect from '@/Views/components/Skeleton/SkeletonRect.vue'
import SkeletonLine from '@/Views/components/Skeleton/SkeletonLine.vue'
</script>

<template>
  <div class="item-card">

    <!-- 图片 -->
    <SkeletonRect w="120px" h="120px" :radius="4" />

    <!-- 右侧内容 -->
    <div class="info">

      <!-- 标题 -->
      <SkeletonLine
        w="70%"
        h="16px"
        style="margin-bottom:10px;"
      />

      <!-- 日期 -->
      <SkeletonLine w="60%" h="13px" />

      <!-- 地点 -->
      <SkeletonLine
        w="50%"
        h="13px"
        style="margin-top:6px;"
      />

      <!-- 联系 -->
      <SkeletonLine
        w="55%"
        h="13px"
        style="margin-top:6px;"
      />

    </div>

  </div>
</template>

<style scoped>

.item-card{
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px;
  background:#fff;
  border-radius:6px;
  box-shadow:0 1px 4px rgba(0,0,0,.08);
}

.info{
  flex:1;
}
</style>
