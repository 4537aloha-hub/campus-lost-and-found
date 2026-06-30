<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { auditPass, auditReject } from '@/api/audit'
import { getItemData } from '@/api/admin'
import noItemImg from '@/assets/imgs/noItemImg.jpg'

const activeTab = ref('pending')

// 数据
const items = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 状态映射
const statusMap = {
  pending: 0,
  approved: 1,
  rejected: 2
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    0: '待审核',
    1: '已通过',
    2: '未通过'
  }
  return map[status]
}

// 获取状态样式
const getStatusClass = (status) => {
  const map = {
    0: 'pending',
    1: 'approved',
    2: 'rejected'
  }
  return map[status]
}

// 获取物品类型
const getItemTypeText = (type) => {
  return type === 'lost' ? '失物' : '招领'
}

// 加载数据
const loadItems = async () => {
  try {
    const res = await getItemData({
      page: currentPage.value,
      size: pageSize.value,
      audit_status: statusMap[activeTab.value]
    })

    if (res.status === 0) {
      items.value = res.data.list
      total.value = res.data.total
    }
  } catch (err) {
    console.error(err)
  }
}

// 审核通过
const approveClaim = async (id) => {
  try {
    const res = await auditPass(id)
    ElMessageBox.confirm('确认通过吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (res.status === 0) {
        loadItems()
      }
    })
  } catch (err) {
    console.error(err)
  }
}

// 审核拒绝
const rejectClaim = async (id) => {
  try {
    const res = await auditReject(id)
    ElMessageBox.confirm('确认拒绝吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (res.status === 0) {
        loadItems()
      }
    })
  } catch (err) {
    console.error(err)
  }
}

// 标签切换
const handleTabChange = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
  loadItems()
}

// 页码切换
const handlePageChange = (page) => {
  currentPage.value = page
  loadItems()
}

// 页大小切换
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadItems()
}

onMounted(() => {
  loadItems()
})
</script>

<template>
	<div class="admin-page">
		<div class="admin-page-header">
			<div>
				<h2>认领审核</h2>
				<p class="page-desc">处理用户提交的认领请求，支持审核通过或拒绝。</p>
			</div>
			<div class="tabs">
				<button :class="['tab-btn', { active: activeTab === 'pending' }]" @click="handleTabChange('pending')">待审核</button>
				<button :class="['tab-btn', { active: activeTab === 'approved' }]" @click="handleTabChange('approved')">已通过</button>
				<button :class="['tab-btn', { active: activeTab === 'rejected' }]" @click="handleTabChange('rejected')">未通过</button>
			</div>
		</div>

		<div class="claim-list">
			<div class="claim-card" v-for="item in items" :key="item.id">
				<div class="claim-header">
					<span class="claim-id">#{{ item.id }}</span>
					<span :class="['claim-status', getStatusClass(item.audit_status)]">{{ getStatusText(item.audit_status) }}</span>
				</div>
				<div class="claim-content">
					<div class="claim-item">
						<img :src="item.picture ? item.picture : noItemImg" class="item-thumb" alt="">
						<div class="item-info">
							<div class="item-name">{{ item.title }}</div>
							<div class="item-meta">{{ getItemTypeText(item.type) }} · {{ item.location }}</div>
						</div>
					</div>
					<div class="claim-divider"></div>
					<div class="claim-user">
						<span class="user-label">发布人：</span>
						<span class="user-name">{{ item.username }}</span>
					</div>
					<div class="claim-desc">
						<span class="desc-label">物品描述：</span>
						<span class="desc-text">{{ item.description || '暂无描述' }}</span>
					</div>
				</div>
				<div class="claim-footer">
					<span class="claim-time">发布时间：{{ dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
					<div class="claim-actions" v-if="item.audit_status === 0">
						<button class="btn-approve" @click="approveClaim(item.id)">通过</button>
						<button class="btn-reject" @click="rejectClaim(item.id)">拒绝</button>
					</div>
				</div>
			</div>
		</div>

		<div class="empty-state" v-if="items.length === 0">
			<div class="empty-icon">📭</div>
			<div class="empty-text">暂无{{ activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '已通过' : '未通过' }}的认领请求</div>
		</div>

		<!-- 分页组件 -->
		<div class="pagination-container">
			<el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:page-sizes="[10, 20, 50]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				@current-change="handlePageChange"
				@size-change="handleSizeChange"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.admin-page-header {
	flex-wrap: wrap;
	gap: 16px;

	.tabs {
		display: flex;
		gap: 8px;

		.tab-btn {
			padding: 8px 16px;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		background: #fff;
		color: #4a5568;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s;

		&.active {
			background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
			color: #fff;
			border-color: transparent;
		}

		&:hover:not(.active) {
			background: #f7fafc;
		}
	}
}
}

.claim-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.claim-card {
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	overflow: hidden;
}

.claim-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14px 16px;
	background: #f8fafc;

	.claim-id {
		font-size: 14px;
		font-weight: 600;
		color: #4a5568;
	}

	.claim-status {
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 500;

		&.pending {
			background: #fffaf0;
			color: #dd6b20;
		}

		&.approved {
			background: #f0fff4;
			color: #48bb78;
		}

		&.rejected {
			background: #fff5f5;
			color: #fc8181;
		}
	}
}

.claim-content {
	padding: 16px;

	.claim-item {
		display: flex;
		gap: 14px;

		.item-thumb {
			width: 80px;
			height: 80px;
			border-radius: 8px;
			background: #f7fafc;
			object-fit: cover;
			font-size: 32px;
		}

		.item-info {
			flex: 1;

			.item-name {
				font-size: 15px;
				font-weight: 600;
				color: #2d3748;
			}

			.item-meta {
				font-size: 13px;
				color: #718096;
				margin-top: 4px;
			}
		}
	}

	.claim-divider {
		height: 1px;
		background: #f0f2f5;
		margin: 14px 0;
	}

	.claim-user, .claim-desc {
			display: flex;
			gap: 8px;
			margin-bottom: 8px;

			.label {
				font-size: 14px;
				color: #718096;
				font-weight: 500;
			}

			.user-name {
				font-size: 14px;
				color: #2d3748;
				font-weight: 500;
			}

			.desc-text {
				flex: 1;
				font-size: 14px;
				color: #4a5568;
				line-height: 1.5;
			}
		}
	}


.claim-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 16px;
	background: #fafafa;

	.claim-time {
		font-size: 13px;
		color: #a0aec0;
	}

	.claim-actions {
		display: flex;
		gap: 8px;

		button {
			padding: 8px 16px;
		border: none;
		border-radius: 6px;
		font-size: 13px;
		cursor: pointer;
		transition: all 0.2s;
		}

		.btn-approve {
			background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
			color: #fff;

			&:hover {
				transform: translateY(-1px);
				box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
			}
		}

		.btn-reject {
			background: #fff5f5;
			color: #fc8181;

			&:hover {
				background: #fed7d7;
			}
		}
	}
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;

	.empty-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}

	.empty-text {
		font-size: 15px;
		color: #a0aec0;
	}
}
.pagination-container {
  margin-top: 20px;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f2f5;
  display: flex;
  justify-content: flex-end;
}
</style>
