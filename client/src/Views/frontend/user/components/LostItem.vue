<script setup>
import PageContainer from '@/Views/components/PageContainer.vue';
import { useUserStore } from '@/stores/modules/userstore';
import { onMounted, computed, ref } from 'vue';
// 导入Elmenet-plus图标
import { Delete, Edit } from '@element-plus/icons-vue';
// 导入弹窗组件
import PublishItem from '@/Views/frontend/user/components/PublishItems.vue'
// 引入日期格式化函数
import timeFormat from '@/utils/deteFormat.js'
// 导入分页组件
import Pagination from '@/Views/components/Pagination.vue';
// 查询lost物品列表
import { getItemListByUserIdLost } from '@/api/user'

const userStore = useUserStore();

const dialogVisible = ref();

// 定义丢失物品列表响应式数据
 const itemLost = ref([])

// 定义loading状态
const loading = computed(() => userStore.token && !itemLost.value)

const total = ref(0)

const params = ref({
  pageNum: 1,
  pageSize: 15,
})

// 切换分页功能
const onPageChange = (pageNum) => {
  params.value.pageNum = pageNum
  getLostItemList()
}

// 获取用户我丢失的物品数据
const getLostItemList = async () => {
  // 将params.value传递给后端用于同步分页数据
  const res = await getItemListByUserIdLost(params.value)
  console.log('获取我丢失的物品数据成功', res);
  itemLost.value = res.data
  // 将当前的总数据量赋值给total响应式数据
  total.value = res.data.total
}

// 点击展示弹窗的函数
const handleClick = () => {
  if (!userStore.token) {
    ElMessage.warning('请先登录');
    return;
  }
  // 传递空对象开启弹窗 用于添加物品 空象会触发添加物品功能 如果不传递对象 认会触发编辑物品功能
  dialogVisible.value.open({})
}

// 删除物品功能函数
const handleDelete = async(row) => {
  if (!userStore.token) {
    ElMessage.warning('请先登录');
    return;
  }

  await ElMessageBox.confirm('确认删除该物品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  // 调用删除物品接口
  try {
    const res = await deleteItem(row.id);
    if(res.status !== 0){
      ElMessage.error(res.message)
      return
    }
    ElMessage({type:'success', message:'删除成功'})
    // 刷新物品列表
    getItemList();
  } catch (error) {
    console.error('删除物品失败:', error)
    ElMessage.error('删除失败')
  }
}

// 编辑物品功能函数
const handleEdit = (row) => {
  if (!userStore.token) {
    ElMessage.warning('请先登录');
    return;
  }
  console.log('点击编辑按钮', row);
  dialogVisible.value.open(row);
}

onMounted(() => {
  getLostItemList();
});
</script>
<template>
  <page-container title="我丢失的" v-loading="loading">
  <template #button>
    <el-button @click="handleClick">点击发布</el-button>
  </template>
  <!-- 表格区 -->
   <template #table>
        <div v-if="!userStore.token"  class="login-tip">
        <el-empty description="请先登录" />
      </div>
    <el-table v-else :data="itemLost.list">
      <el-table-column label="序号" width="60px" template="scope">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="物品图片" width="100px">
        <template #default="scope">
          <img v-if="scope.row.picture" :src="scope.row.picture" style="width: 50px; height: 50px; object-fit: cover;" />
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="物品名称" width="200px"></el-table-column>
      <el-table-column prop="description" label="物品描述">
        <template #default="scope">
          {{ scope.row.description || '暂无描述' }}
        </template>
      </el-table-column>
      <el-table-column prop="audit_status" label="审核状态">
        <template #default="scope">
          {{ scope.row.audit_status === 0 ? '审核中' : scope.row.audit_status === 1 ? '通过审核' : '拒绝审核' }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="发布时间">
        <template #default="scope">
          {{ timeFormat(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button @click="handleDelete(row)" :icon="Delete" circle plain type="danger" ></el-button>
          <el-button @click="handleEdit(row)" :icon="Edit" circle plain type="primary"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
   <Pagination
   v-if="userStore.token"
   :total="total"
    :params="params"
    @page-change="onPageChange"
    class="pagination-wrapper"
   />
   </template>
</page-container>
<!-- 发布丢失物品弹窗 -->
<PublishItem ref="dialogVisible" />
</template>
<style scoped lang="scss">
.login-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  border-radius: 8px;
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
