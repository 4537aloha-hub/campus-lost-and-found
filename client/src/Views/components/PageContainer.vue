<script setup>
defineProps({
  title:{
    required:true,
    type:String
  }
})
</script>
<template>
  <el-card class="page-container" shadow="never">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="button">
          <!-- 存放按钮插槽 /发布物品招领/ 发布物品遗失 -->
          <slot name="button"></slot>
        </div>
      </div>
    </template>
    <!-- 存放内容区域 -->
    <div class="table-content">
      <slot name="table"></slot>
    </div>
  </el-card>
</template>
<style scoped lang="scss">
.page-container {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .table-content {
      width: 100%;
      overflow-x: auto;
    }
}

@media (max-width: 480px) {
  .page-container {
    :deep(.el-card__header),
    :deep(.el-card__body) {
      padding: 12px;
    }
    .header {
      gap: 12px;
      font-size: 14px;
    }
    .table-content {
      -webkit-overflow-scrolling: touch;
    }
  }
}

</style>
