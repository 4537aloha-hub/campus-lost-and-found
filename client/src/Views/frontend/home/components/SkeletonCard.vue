<script setup>
import SkeletonRect from '@/Views/components/Skeleton/SkeletonRect.vue'
import SkeletonLine from '@/Views/components/Skeleton/SkeletonLine.vue'
</script>

<template>
  <div class="item-card">
    <!-- tag -->
    <div class="tag">
      <SkeletonRect w="60px" h="18px" :radius="4" />
    </div>

    <!-- img -->
    <SkeletonRect w="100%" h="220px" :radius="0" />

    <div class="content">

      <!-- 物品 -->
      <p class="row">
        <span class="label">
          <SkeletonLine w="40px" h="14px" />
        </span>
        <span class="value">
          <SkeletonLine w="60%" h="14px" />
        </span>
      </p>

      <!-- 描述 -->
      <p class="row">
        <span class="label">
          <SkeletonLine w="40px" h="14px" />
        </span>
        <span class="value desc">
          <SkeletonLine w="90%" h="14px" />
          <SkeletonLine w="70%" h="14px" style="margin-top:4px;" />
        </span>
      </p>

      <!-- 地点 -->
      <p class="row">
        <span class="label">
          <SkeletonLine w="40px" h="14px" />
        </span>
        <span class="value">
          <SkeletonLine w="50%" h="14px" />
        </span>
      </p>

      <!-- 日期 -->
      <p class="row">
        <span class="label">
          <SkeletonLine w="40px" h="14px" />
        </span>
        <span class="value">
          <SkeletonLine w="40%" h="14px" />
        </span>
      </p>

      <!-- 联系 -->
      <p class="row">
        <span class="label">
          <SkeletonLine w="40px" h="14px" />
        </span>
        <span class="value">
          <SkeletonLine w="50%" h="14px" />
        </span>
      </p>

      <!-- 状态 -->
      <p class="row">
        <span class="label">
          <SkeletonLine w="40px" h="14px" />
        </span>
        <span class="status">
          <SkeletonLine w="30%" h="14px" />
        </span>
      </p>

    </div>
  </div>
</template>

<style scoped lang="scss">

.item-card {
  position: relative;
  display: block;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  transition: .25s;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}

.tag {
  position: absolute;

}

.content {
  padding: 12px;
}

.row {
  display: flex;
  margin-bottom: 6px;
  font-size: 14px;
}

.label {
  width: 70px;
  flex-shrink: 0;
}

.value {
  flex: 1;
}

.status {
  flex: 1;
}

.desc {
  display: flex;
  flex-direction: column;
}

</style>
