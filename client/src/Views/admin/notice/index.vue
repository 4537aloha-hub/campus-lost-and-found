<script setup>
import { ref, reactive, onMounted } from 'vue'
import { addAnnouncement, getAnnouncementList, updateAnnouncement, deleteAnnouncement,topAnnouncement, hideAnnouncement} from '@/api/annoucement.js'
import {ElMessage, ElMessageBox} from 'element-plus'

// 弹窗状态
const showAddModal = ref(false)
const showEditModal = ref(false)

// 表单数据
const newNotice = reactive({
  title: '',
  priority: 'normal',
  content: ''
})

const editNotice = reactive({
  id: '',
  title: '',
  priority: 'normal',
  content: ''
})

// 公告列表
const notices = ref([])

// 优先级映射
const priorityMap = {
  normal: '普通',
  important: '重要',
  urgent: '紧急'
}

// 状态映射
const statusMap = {
  0: 'hidden',
  1: 'published'
}

// 获取状态文本
const getStatusText = (status) => {
  return status === 1 ? '已发布' : '已隐藏'
}

// 获取状态类名
const getStatusClass = (status) => {
  return status === 1 ? 'published' : 'hidden'
}

// 加载公告列表
const loadNotices = async () => {
  try {
    const response = await getAnnouncementList()
      notices.value = response.data.list.map(item => ({
        ...item,
        priorityText: priorityMap[item.priority] || '普通',
        statusText: getStatusText(item.status),
        statusClass: getStatusClass(item.status)
      }))
    console.log("notices的值",response.data.list);
  } catch (error) {
    console.error('获取公告列表失败:', error)
  }
}

// 新增公告
const addNotice = async () => {
  try {
    const response = await addAnnouncement({
      title: newNotice.title,
      priority: newNotice.priority,
      content: newNotice.content
    })
    if (response.status === 0) {
      await loadNotices()
      showAddModal.value = false
      resetForm(newNotice)
    }
  } catch (error) {
    console.error('新增公告失败:', error)
  }
}

// 编辑公告
const openEditModal = (notice) => {
  editNotice.id = notice.id
  editNotice.title = notice.title
  editNotice.priority = notice.priority
  editNotice.content = notice.content
  showEditModal.value = true
}

const saveEdit = async () => {
  try {
    const response = await updateAnnouncement({
      id: editNotice.id,
      title: editNotice.title,
      priority: editNotice.priority,
      content: editNotice.content
    })
    if (response.status === 0) {
      await loadNotices()
      showEditModal.value = false
      resetForm(editNotice)
    }
  } catch (error) {
    console.error('修改公告失败:', error)
  }
}

// 置顶公告
const topNotice = async (id) => {
  try {
    ElMessageBox.confirm('确定要置顶这条公告吗？', '置顶确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const response = await topAnnouncement(id)
      if (response.status === 0) {
        await loadNotices()
      }
    })
  } catch (error) {
    console.error('置顶公告失败:', error)
  }
}

// 删除公告
const deleteNotice = async (id) => {
  try {
    ElMessageBox.confirm('确定要删除这条公告吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const response = await deleteAnnouncement(id)
      if (response.status === 0) {
        await loadNotices()
      }
    })
  } catch (error) {
    console.error('删除公告失败:', error)
  }
}

// 隐藏/显示公告
const toggleNotice = async (id, currentStatus) => {
  try {
    ElMessageBox.confirm(`确定要${currentStatus === 1 ? '隐藏' : '显示'}这条公告吗？`, `切换确认`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const response = await hideAnnouncement(id)
      if (response.status === 0) {
        await loadNotices()
      }
    })
  } catch (error) {
    console.error('切换公告状态失败:', error)
  }
}

// 重置表单
const resetForm = (form) => {
  form.id = ''
  form.title = ''
  form.priority = 'normal'
  form.content = ''
}

// 初始化
onMounted(() => {
  loadNotices()
})
</script>
<template>
	<div class="admin-page">
		<div class="admin-page-header">
			<div>
				<h2>公告管理</h2>
				<p class="page-desc">发布、编辑与管理站内公告信息。</p>
			</div>
			<button class="btn-primary" @click="showAddModal = true">
				<span>+</span> 发布公告
			</button>
		</div>

		<div class="notice-list">
			<div class="notice-card" v-for="notice in notices" :key="notice.id">
				<div class="notice-header">
					<span :class="['notice-tag', notice.priority]">{{ notice.priorityText }}</span>
					<span class="notice-time">{{ notice.createTime }}</span>
				</div>
				<h3 class="notice-title">{{ notice.title }}</h3>
				<p class="notice-content">{{ notice.content }}</p>
				<div class="notice-footer">
						<span class="notice-author">发布人：管理员</span>
						<span :class="['notice-status', notice.statusClass]">{{ notice.statusText }}</span>
						<div class="notice-actions">
							<button class="btn-edit" @click="openEditModal(notice)">编辑</button>
							<button class="btn-delete" @click="deleteNotice(notice.id)">删除</button>
							<button class="btn-top" @click="topNotice(notice.id)">置顶</button>
							<button v-if="notice.status === 1" class="btn-hide" @click="toggleNotice(notice.id, notice.status)">隐藏</button>
							<button v-else class="btn-show" @click="toggleNotice(notice.id, notice.status)">显示</button>
						</div>
					</div>
			</div>
		</div>

		<!-- 发布公告弹窗 -->
		<div class="modal-overlay" v-if="showAddModal" @click.self="showAddModal = false">
			<div class="modal-content">
				<h3>发布公告</h3>
				<form @submit.prevent="addNotice">
					<div class="form-group">
						<label>公告标题</label>
						<input v-model="newNotice.title" type="text" placeholder="请输入公告标题" required>
					</div>
					<div class="form-group">
						<label>优先级</label>
						<select v-model="newNotice.priority">
							<option value="normal">普通</option>
							<option value="important">重要</option>
							<option value="urgent">紧急</option>
						</select>
					</div>
					<div class="form-group">
						<label>公告内容</label>
						<textarea v-model="newNotice.content" placeholder="请输入公告内容" rows="6" required></textarea>
					</div>
					<div class="modal-actions">
						<button type="button" class="btn-cancel" @click="showAddModal = false">取消</button>
						<button type="submit" class="btn-submit">发布</button>
					</div>
				</form>
			</div>
		</div>

		<!-- 编辑公告弹窗 -->
		<div class="modal-overlay" v-if="showEditModal" @click.self="showEditModal = false">
			<div class="modal-content">
				<h3>编辑公告</h3>
				<form @submit.prevent="saveEdit">
					<div class="form-group">
						<label>公告标题</label>
						<input v-model="editNotice.title" type="text" placeholder="请输入公告标题" required>
					</div>
					<div class="form-group">
						<label>优先级</label>
						<select v-model="editNotice.priority">
							<option value="normal">普通</option>
							<option value="important">重要</option>
							<option value="urgent">紧急</option>
						</select>
					</div>
					<div class="form-group">
						<label>公告内容</label>
						<textarea v-model="editNotice.content" placeholder="请输入公告内容" rows="6" required></textarea>
					</div>
					<div class="modal-actions">
						<button type="button" class="btn-cancel" @click="showEditModal = false">取消</button>
						<button type="submit" class="btn-submit">保存</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.admin-page-header {
	flex-wrap: wrap;
	gap: 16px;

	.btn-primary {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 20px;
		background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
		color: #fff;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;

		&:hover {
			transform: translateY(-1px);
			box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
		}

		span {
			font-size: 18px;
		}
	}
}

.notice-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.notice-card {
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	padding: 20px;
	border-left: 4px solid #e2e8f0;

	&:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}

	&:has(.notice-tag.urgent) {
		border-left-color: #fc8181;
	}

	&:has(.notice-tag.important) {
		border-left-color: #dd6b20;
	}
}

.notice-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;

	.notice-tag {
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 500;

		&.normal {
			background: #ebf8ff;
			color: #3182ce;
		}

		&.important {
			background: #fffaf0;
			color: #dd6b20;
		}

		&.urgent {
			background: #fff5f5;
			color: #fc8181;
		}
	}

	.notice-time {
		font-size: 13px;
		color: #a0aec0;
	}
}

.notice-title {
	font-size: 16px;
	font-weight: 600;
	color: #2d3748;
	margin: 0 0 10px 0;
}

.notice-content {
	font-size: 14px;
	color: #4a5568;
	line-height: 1.6;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}

.notice-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 16px;
	padding-top: 12px;
	border-top: 1px solid #f0f2f5;

	.notice-author {
		font-size: 13px;
		color: #718096;
	}

	.notice-status {
		padding: 4px 10px;
		border-radius: 10px;
		font-size: 12px;
		font-weight: 500;

		&.published {
			background: #f0fff4;
			color: #48bb78;
		}

		&.hidden {
			background: #f7fafc;
			color: #a0aec0;
		}
	}

	.notice-actions {
		display: flex;
		gap: 8px;

		button {
			padding: 6px 12px;
		border: none;
		border-radius: 6px;
		font-size: 12px;
		cursor: pointer;
		transition: all 0.2s;
		}

		.btn-edit {
			background: #e6fffa;
			color: #319795;

			&:hover {
				background: #b2f5ea;
			}
		}

		.btn-delete {
			background: #fff5f5;
			color: #fc8181;

			&:hover {
				background: #fed7d7;
			}
		}

		.btn-hide {
			background: #f7fafc;
			color: #718096;

			&:hover {
				background: #edf2f7;
			}
		}

		.btn-show {
				background: #ebf8ff;
				color: #3182ce;

				&:hover {
					background: #bee3f8;
				}
			}

		.btn-top {
				background: #fffaf0;
				color: #dd6b20;

				&:hover {
					background: #feebc8;
				}
			}
		}
	}


/* 弹窗样式 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-content {
	background: #fff;
	border-radius: 12px;
	padding: 24px;
	width: 90%;
	max-width: 500px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

	h3 {
		font-size: 18px;
		font-weight: 600;
		color: #1a202c;
		margin: 0 0 20px 0;
	}
}

.form-group {
	margin-bottom: 16px;

	label {
		display: block;
		font-size: 13px;
		font-weight: 500;
		color: #4a5568;
		margin-bottom: 6px;
	}

	input, select, textarea {
		width: 100%;
		padding: 10px 14px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 14px;
		box-sizing: border-box;
		transition: border-color 0.2s;

		&:focus {
			outline: none;
			border-color: #3498db;
		}
	}

	select {
		cursor: pointer;
	}

	textarea {
		resize: vertical;
	}
}

.modal-actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 20px;

	button {
		padding: 10px 20px;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-cancel {
		background: #f7fafc;
		color: #718096;

		&:hover {
			background: #edf2f7;
		}
	}

	.btn-submit {
		background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
		color: #fff;

		&:hover {
			transform: translateY(-1px);
		}
	}
}
</style>
