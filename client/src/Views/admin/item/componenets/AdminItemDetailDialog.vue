<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'closed'])

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    unclaimed: '未认领',
    claimed: '已认领',
    completed: '已完成'
  }
  return statusMap[status] || status
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    unclaimed: 'warning',
    claimed: 'info',
    completed: 'success'
  }
  return typeMap[status] || 'default'
}

// 获取类型文本
const getTypeText = (type) => {
  return type === 'lost' ? '失物' : '招领'
}

// 获取类型对应的tag类型
const getTypeTagType = (type) => {
  return type === 'lost' ? 'danger' : 'success'
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="物品详情"
    width="700px"
    @close="handleClose"
    @closed="() => emit('closed')"
  >
    <div v-if="item && Object.keys(item).length" class="item-detail-content">
      <!-- 图片展示 -->
      <div class="detail-image" v-if="item.picture">
        <img :src="item.picture" alt="物品图片" />
      </div>
      <div class="detail-image empty" v-else>
        <div class="no-image">暂无图片</div>
      </div>

      <!-- 基本信息网格 -->
      <div class="detail-grid">
        <!-- 第一行：标题 -->
        <div class="grid-item full-width">
          <div class="label">物品名称</div>
          <div class="value title">{{ item.title }}</div>
        </div>

        <!-- 第二行：类型、状态、ID -->
        <div class="grid-item">
          <div class="label">
            <span>物品类型:</span>
            <span class="item-label">
              <el-tag :type="getTypeTagType(item.type)">
              {{ getTypeText(item.type) }}
              </el-tag>
            </span>
          </div>
        </div>
        <div class="grid-item">
          <div class="label">
            <span>认领状态:</span>
            <span class="item-label">
              <el-tag :type="getStatusType(item.status)">
                {{ getStatusText(item.status) }}
              </el-tag>
            </span>
          </div>
        </div>
        <div class="grid-item">
          <div class="label">物品ID</div>
          <div class="value">{{ item.id }}</div>
        </div>

        <!-- 第三行：地点、联系方式 -->
        <div class="grid-item">
          <div class="label">📍 地点</div>
          <div class="value">{{ item.location || '未指定' }}</div>
        </div>
        <div class="grid-item">
          <div class="label">📞 联系方式</div>
          <div class="value">{{ item.contact || '未提供' }}</div>
        </div>

        <!-- 第四行：发布人、发布时间 -->
        <div class="grid-item">
          <div class="label">发布人</div>
          <div class="value">{{ item.username || '未知' }}</div>
        </div>
        <div class="grid-item">
          <div class="label">发布时间</div>
          <div class="value">
            {{ dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>

        <!-- 第五行：类别（如果有） -->
        <div class="grid-item full-width" v-if="item.category_id || item.category">
          <div class="label">物品类别</div>
          <div class="value">{{ item.category }}</div>
        </div>

        <!-- 第六行：描述 -->
        <div class="grid-item full-width">
          <div class="label">物品描述</div>
          <div class="value description">
            {{ item.description || '无描述' }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.item-detail-content {
  padding: 16px 0;
}

.detail-image {
  width: 100%;
  height: 300px;
  background: #f0f2f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  &.empty {
    background: #fafafa;
    border: 1px dashed #d9d9d9;

    .no-image {
      color: #999;
      font-size: 14px;
    }
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: 1 / -1;
  }

  .label {
    font-weight: 600;
    color: #606266;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    .item-label {
      margin-left: 8px;
    }
  }

  .value {
    color: #333;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;

    &.title {
      font-size: 16px;
      font-weight: 600;
      color: #222;
    }

    &.description {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 4px;
      border-left: 3px solid #409eff;
      min-height: 60px;
    }
  }
}
</style>
