<script setup>
import PageContainer from '@/Views/components/PageContainer.vue';
// 导入user仓库 用于获取物品列表
import { useUserStore } from '@/stores/modules/userstore';
import { onMounted, ref } from 'vue';
import { Delete, Edit } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
// 导入发布物品弹窗组件
import PublishItem from '@/Views/user/components/PublishItems.vue'
// 导入删除物品接口
import {deleteItem} from '@/api/user'
// 引入日期格式化函数
import timeFormat from '@/utils/deteFormat.js'

// 定义弹窗组件的引用
const dialogVisible = ref()
// 确保能够获取响应式数据
import { storeToRefs } from 'pinia';
const userStore = useUserStore();
// 解构响应式数据
const {
  itemFound,
} = storeToRefs(userStore);
// 解构函数方法
const { getItemList } = userStore;

// 功能函数区

// 点击发布按钮开启弹窗显示
const handleClick = () => {
  if (!userStore.token) {
    ElMessage.warning('请先登录');
    return;
  }
  // 传递空对象开启弹窗 用于添加物品 空对象会触发添加物品功能 如果不传递对象 默认会触发编辑物品功能
  dialogVisible.value.open({});
};

// 接收子组件发送发布物品成功后的数据
const onSuccess = () => {
  // 当子组件发布成功以后 重新刷新页面数据
  getItemList();
};

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

// 页面加载时获取数据
onMounted(() => {
  if (userStore.token) {
    getItemList();
  }
});
</script>
<template>
  <page-container title="我发布的">
  <template #button>
    <el-button @click="handleClick">点击发布</el-button>
  </template>
  <!-- 表格区 -->
   <template #table>
    <div v-if="!userStore.token" class="login-tip">
      <el-empty description="请先登录" />
    </div>
    <el-table v-else :data="itemFound">
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
      <el-table-column prop="status" label="物品状态"></el-table-column>
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
   <!-- 弹窗区 -->
   <publish-item
   ref="dialogVisible"
   @success="onSuccess"
   ></publish-item>
</template>
<style scoped lang="scss">
.login-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  border-radius: 8px;
}
</style>
<style scoped lang="scss">
</style>
