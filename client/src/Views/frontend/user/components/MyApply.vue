<script setup>
import PageContainer from '@/Views/components/PageContainer.vue';
import { getMyClaims } from '@/api/user.js';
import { onMounted, ref } from 'vue';
import Pagination from '@/Views/components/Pagination.vue';
// 引入日期格式化函数
import timeFormat from '@/utils/deteFormat.js'
const historyClaims = ref([]);
const total = ref(0)

const FetchClaimHistory = async () => {
  const res = await getMyClaims();
  historyClaims.value = res.data.list;
  total.value = res.data.total;
  console.log("我的认领申请:",historyClaims.value);
};

const params = ref({
  pageNum: 1,
  pageSize: 15,
})

// 切换分页功能
const onPageChange = (pageNum) => {
  params.value.pageNum = pageNum
  FetchClaimHistory()
}

const claimStatusMap = {
  unclaimed: '待认领',
  claimed: '已认领',
  pending: '待处理',
  approved: '已通过',
  rejected: '已拒绝'
}

const itemTypeMap = {
  found: '招领',
  lost: '遗失'
}

onMounted(() => {
  FetchClaimHistory();
});

</script>
<template>
  <PageContainer title="我的认领申请记录">
    <template #table>
      <el-table :data="historyClaims">
        <el-table-column prop="title" label="物品名称"></el-table-column>
        <el-table-column label="物品图片">
          <template #default="scope">
            <img v-if="scope.row.picture" :src="scope.row.picture" style="width: 50px; height: 50px; object-fit: cover;" />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            {{ itemTypeMap[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="物品描述"></el-table-column>
        <el-table-column prop="created_at" label="申请时间">
          <template #default="scope">
            {{ timeFormat(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            {{ claimStatusMap[scope.row.status] }}
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
