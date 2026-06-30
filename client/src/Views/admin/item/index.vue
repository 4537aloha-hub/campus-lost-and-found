<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getItemData, deleteItem, restoreItem } from '@/api/admin.js'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminItemDetailDialog from './componenets/AdminItemDetailDialog.vue'

// 分页参数
const currentPage = ref(1)
const pageSize = ref(20) // 默认每页20条
const total = ref(0)

// 筛选条件
const filters = reactive({
  type: '',
  status: '',
  search: '',
  is_deleted: ''
})

// 表格数据
const tableData = ref([])

// 弹窗相关
const detailDialogVisible = ref(false)
const selectedItem = ref(null)

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    unclaimed: '未认领',
    claimed: '已认领',
    completed: '已完成',
    is_deleted: '已删除'
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

// 删除恢复或删除物品（管理员）
const handleDeleteOrRestore = async (item) => {
  try {

    const isRestore = item.is_deleted == 1

    await ElMessageBox.confirm(
      isRestore
        ? '确定恢复该物品吗？'
        : '确定删除该物品吗？',
      isRestore ? '恢复物品' : '删除物品',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    let res

    if (isRestore) {
      res = await restoreItem(item.id)
    } else {
      res = await deleteItem(item.id)
    }

    if (res.status !== 0) {
      return ElMessage.error(res.message)
    }

    ElMessage.success(res.message)

    loadItemList()

  } catch (err) {

    if (err !== 'cancel' && err !== 'close') {
      ElMessage.error(err.message || '操作失败')
    }

  }
}

// 获取物品列表
const loadItemList = async () => {
  try {
    // 构建查询参数
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    // 添加筛选条件
    if (filters.type) {
      params.type = filters.type
    }
    if (filters.status) {
      params.status = filters.status
    }
    if (filters.search) {
      params.keyword = filters.search
    }
    if (filters.is_deleted) {
      params.is_deleted = filters.is_deleted
    }

    const response = await getItemData(params)
    if (response.data) {
      tableData.value = response.data.list || response.data
      total.value = response.data.total || tableData.value.length
    }
  } catch (error) {
    console.error('获取物品列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadItemList()
}

// 分页改变
const handlePageChange = (page) => {
  currentPage.value = page
  loadItemList()
}

// 每页条数改变
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadItemList()
}

// 打开物品详情弹窗
const handleShowDetail = (item) => {
  selectedItem.value = item
  detailDialogVisible.value = true
}

// 关闭弹窗
const handleCloseDialog = () => {
  detailDialogVisible.value = false
}

// 初始化加载
onMounted(() => {
  loadItemList()
})
</script>
<template>
  <div class="admin-page">
    <div class="admin-page-header">
      <div>
        <h2>物品管理</h2>
        <p class="page-desc">管理失物招领物品，支持搜索、筛选、导出与批量操作。</p>
      </div>
    </div>

    <div class="filter-bar">
      <el-select
        v-model="filters.type"
        placeholder="全部类型"
        clearable
        style="width: 120px;"
        @change="handleSearch"
      >
        <el-option label="失物" value="lost"></el-option>
        <el-option label="招领" value="found"></el-option>
      </el-select>
      <el-select
        v-model="filters.status"
        placeholder="全部状态"
        clearable
        style="width: 120px;"
        @change="handleSearch"
      >
        <el-option label="未认领" value="unclaimed"></el-option>
        <el-option label="已认领" value="claimed"></el-option>
      </el-select>
      <el-select
        v-model="filters.is_deleted"
        placeholder="删除状态"
        clearable
        style="width: 120px;"
        @change="handleSearch"
      >
        <el-option label="未删除" value="0"></el-option>
        <el-option label="已删除" value="1"></el-option>
      </el-select>
      <el-input
        v-model="filters.search"
        placeholder="搜索物品名称"
        style="width: 200px;"
        @keyup.enter="handleSearch"
        clearable
      >
        <template #append>
          <el-icon @click="handleSearch"><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <div class="item-table-container">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f8fafc' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center">
        </el-table-column>
        <el-table-column prop="title" label="物品名称" min-width="150">
        </el-table-column>
        <el-table-column label="类型" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'lost' ? 'danger' : 'success'">
              {{ scope.row.type === 'lost' ? '失物' : '招领' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="地点" width="150">
          <template #default="scope">
            {{ scope.row.location || '暂无地点' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="发布时间" width="180">
          <template #default="scope">
            {{ dayjs(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="发布人" width="120">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" plain @click="handleShowDetail(scope.row)">详情</el-button>
            <el-button @click="handleDeleteOrRestore(scope.row)" size="small" :type="scope.row.is_deleted == 1 ? 'success' : 'danger'" plain>{{ scope.row.is_deleted == 1 ? '恢复' : '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 物品详情弹窗 -->
    <AdminItemDetailDialog
      :visible="detailDialogVisible"
      :item="selectedItem"
      @close="handleCloseDialog"
    />
  </div>
</template>


<style scoped lang="scss">
.admin-page {
  padding: 20px;
}

.admin-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;

  h2 {
    margin: 0 0 4px 0;
    font-size: 20px;
    font-weight: 600;
    color: #2d3748;
  }

  .page-desc {
    margin: 0;
    font-size: 14px;
    color: #a0aec0;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
  }
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.item-table-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>
