<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserList, forbidUser } from '@/api/admin.js'
import dayjs from 'dayjs'
// 搜索关键词
const searchKeyword = ref('')

// 表格数据
const tableData = ref([])

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 定义用户id和状态（局部使用，无需响应式共享）

// 加载用户列表
const loadUserList = async () => {
  try {
    const response = await getUserList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchKeyword.value,
    })
    if (response.data) {
      tableData.value = response.data.list || response.data
      total.value = response.data.total || tableData.value.length
      console.log('获取用户列表成功:', response.data);
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 分页改变
const handlePageChange = (page) => {
  currentPage.value = page
  loadUserList()
}

// 每页条数改变
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadUserList()
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadUserList()
}

// 封禁/解封用户
const handleForbidUser = async (id, newStatus) => {
  try {
    const res = await forbidUser(id, newStatus)
    ElMessage.success(newStatus === 0 ? '用户封禁成功' : '用户解封成功')
    loadUserList()
  } catch (error) {
    console.error('封禁/解封失败:', error)
    ElMessage.error(error?.message || '操作失败')
  }
}

// 初始化加载
onMounted(() => {
  loadUserList()
})
</script>

<template>
  <div class="admin-page">
    <div class="admin-page-header">
      <div>
        <h2>用户管理</h2>
        <p class="page-desc">管理系统用户，支持搜索、权限设置与封禁操作。</p>
      </div>
    </div>

    <div class="user-table-container">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f8fafc' }"
      >
        <el-table-column prop="id" label="ID" width="120" align="center">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200">
        </el-table-column>
        <el-table-column prop="role" label="角色" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'warning' : 'primary'">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间">
          <template #default="scope">
            {{ dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200" align="center">
          <template #default="scope">
            {{ scope.row.status === 0 ? '该账号封禁中' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              @click="handleForbidUser(scope.row.id, scope.row.status === 0 ? 1 : 0)"
              size="small"
              :type="scope.row.status === 0 ? 'success' : 'danger'"
              plain
            >
              {{ scope.row.status === 0 ? '解封' : '封禁' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
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
}
.user-table-container {
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
    overflow-x: auto;
  }

  .pagination-container .el-pagination {
    min-width: 320px;
    max-width: 100%;
    width: auto;
    flex-wrap: wrap;
    justify-content: center;
  }

  @media screen and (max-width: 480px) {
    .pagination-container {
      padding: 12px 8px;
    }

    .pagination-container .el-pagination {
      min-width: 400px;
    }
  }
</style>
