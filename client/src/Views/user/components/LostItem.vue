<script setup>
import PageContainer from '@/Views/components/PageContainer.vue';
import { useUserStore } from '@/stores/modules/userstore';
import { onMounted, ref } from 'vue';
// 导入Elmenet-plus图标
import { Delete, Edit } from '@element-plus/icons-vue';
// 导入弹窗组件
import PublishItem from '@/Views/user/components/PublishItems.vue'
// 确保能够获取响应式数据
import { storeToRefs } from 'pinia';
// 引入日期格式化函数
import timeFormat from '@/utils/deteFormat.js'

const userStore = useUserStore();

const dialogVisible = ref();

// 解构响应式数据
const {
  itemLost,
} = storeToRefs(userStore);
// 解构函数方法
const { getLostItemList } = userStore;

// 点击展示弹窗的函数
const handleClick = () => {
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
  <page-container title="我丢失的">
  <template #button>
    <el-button @click="handleClick">点击发布</el-button>
  </template>
  <!-- 表格区 -->
   <template #table>
    <el-table :data="itemLost">
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
      <el-table-column prop="description" label="物品描述"></el-table-column>
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
   </template>
</page-container>
<!-- 发布丢失物品弹窗 -->
<PublishItem ref="dialogVisible" />
</template>
<style scoped lang="scss">
</style>
