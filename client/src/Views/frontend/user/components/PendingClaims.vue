<script setup>
import PageContainer from '@/Views/components/PageContainer.vue';
import { getPendingClaims, approveClaim, rejectClaim } from '@/api/user.js';
import { onMounted, ref } from 'vue';
import { Check, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/Views/components/Pagination.vue';
// 引入日期格式化函数
import timeFormat from '@/utils/deteFormat.js'

const claims = ref([]);
const total = ref(0)

const FetchPendingClaims = async () => {
  const res = await getPendingClaims();
  claims.value = res.data.list;
  total.value = res.data.total;
  console.log("待处理认领申请:",claims.value);
};

const claimStatusMap = {
  unclaimed: '待认领',
  claimed: '已认领',
  pending: '待处理',
  approved: '已通过',
  rejected: '已拒绝'
}

const params = ref({
  pageNum: 1,
  pageSize: 15,
})

// 切换分页功能
const onPageChange = (pageNum) => {
  params.value.pageNum = pageNum
  FetchPendingClaims()
}

// 处理通过认领申请
const handleApprove = async (row) => {
  // 确认通过认领申请
  try {
    const confirm = await ElMessageBox.confirm('确认通过该认领申请吗？', '确认通过', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    if (confirm) {
      await approveClaim(row.id);
      FetchPendingClaims();
      ElMessage.success('通过成功');
    }
  } catch (error) {
    ElMessage.error('操作取消');
  }
}

// 处理拒绝认领申请
const handleReject = async (row) => {
  // 确认拒绝认领申请
  try {
    const confirm = await ElMessageBox.confirm('确认拒绝该认领申请吗？', '确认拒绝', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    if (confirm) {
      await rejectClaim(row.id);
      FetchPendingClaims();
      ElMessage.success('拒绝成功');
    }
  } catch (error) {
    ElMessage.error('操作取消');
  }
}

onMounted(() => {
  FetchPendingClaims();
});

</script>
<template>
  <PageContainer title="待认领申请处理">
    <template #table>
      <el-table :data="claims">
        <el-table-column prop="title" label="物品名称"></el-table-column>
        <el-table-column label="物品图片">
          <template #default="scope">
            <img v-if="scope.row.picture" :src="scope.row.picture" style="width: 50px; height: 50px; object-fit: cover;" />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="申请用户"></el-table-column>
        <el-table-column prop="created_at" label="申请时间">
          <template #default="scope">
            {{ timeFormat(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="handleApprove(scope.row)" :icon="Check" circle plain type="primary" size="mini" />
            <el-button @click="handleReject(scope.row)" :icon="Close" circle plain type="danger" size="mini" />
          </template>
        </el-table-column>
      </el-table>
    <!-- 分页组件 -->
   <Pagination
    :total="total"
    :params="params"
    @page-change="onPageChange"
    class="pagination-wrapper"
   />
    </template>
  </PageContainer>
</template>
<style scoped lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
