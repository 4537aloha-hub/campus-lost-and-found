<script setup>
import SkeletonRect from "@/Views/components/Skeleton/SkeletonRect.vue";
import SkeletonLine from "@/Views/components/Skeleton/SkeletonLine.vue";
</script>

<template>
  <div class="detail-page">
    <div class="detail-container">

      <div class="detail-main">

        <!-- 左 -->
        <div class="left">
          <SkeletonRect w="100%" h="100%" :radius="8" />
        </div>

        <!-- 右 -->
        <div class="right">

          <!-- 标题 -->
          <SkeletonLine w="50%" h="20px" style="margin-bottom:10px;" />

          <!-- 标签 -->
          <div class="item-container">
            <SkeletonLine w="70px" h="18px" :radius="12" />
          </div>

          <!-- 信息 -->
          <div class="info">
            <SkeletonLine w="60%" h="14px" style="margin-top:10px;" />
            <SkeletonLine w="40%" h="14px" style="margin-top:10px;" />
          </div>

          <!-- 联系 -->
          <div class="contact">
            <SkeletonLine w="55%" h="14px" style="margin-top:10px;" />
          </div>

          <!-- 描述（只做两行，和真实一致） -->
          <div class="desc">
            <SkeletonLine w="80px" h="16px" />
            <SkeletonLine w="300px" h="14px" style="margin-top:8px;" />
          </div>

          <!-- 按钮 -->
          <div class="actions">
            <SkeletonRect w="120px" h="32px" :radius="16" />
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-page {
  background: #f5f7fa;
  padding: 30px 0;
}

.detail-container {
  max-width: 1240px;
  margin: 0 auto;
}

.detail-main {
  display: flex;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.left {
  width: 420px;
  height: 420px;
  background: rgba(224, 225, 224, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.right {
  flex: 1;
  padding-top: 40px;
  padding-left: 100px;
  position: relative;
}

.title {
  font-size: 20px;
  margin-bottom: 10px;
}

.item-container {
  display: flex;

  .tags span {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
  }

  .lost {
    background: #fde2e2;
    color: #f56c6c;
  }
}

.desc {
  position: absolute;
  bottom: 40px;
  display: flex;
  flex-direction: column;

  :first-child {
    font-weight: 600;
    margin-bottom: 6px;
  }
}

.actions {
  position: absolute;
  bottom: 0;
  right: 10px;
}
</style>
