<script setup>
import {  ref, defineExpose, defineEmits } from 'vue'
// 导入消息提示
import { ElMessage } from 'element-plus'

// 定义弹窗是否显示 默认false
const dialogVisible = ref(false)
// 定义头像预览
const avatarUrl = ref('')
// 定义选择的文件
const selectedFile = ref(null)

// 定义emit事件
const emit = defineEmits(['avatar-selected'])

// 打开弹窗
const open = () => {
  dialogVisible.value = true
}

// 处理文件选择
const handleFileChange = (file) => {
  // 本地预览
  if (file.raw) {
    avatarUrl.value = URL.createObjectURL(file.raw)
    selectedFile.value = file.raw
  }
}

// 确认选择头像
const confirmAvatar = () => {
  if (selectedFile.value) {
    // 通知父组件头像已选择
    emit('avatar-selected', selectedFile.value, avatarUrl.value)
    ElMessage.success('头像选择成功')
    console.log('selectedFile.value:',selectedFile.value);
    console.log('avatarUrl:', avatarUrl.value);

    // 关闭弹窗
    dialogVisible.value = false
  } else {
    ElMessage.warning('请选择头像')
  }
}

// 取消选择
const cancelAvatar = () => {
  avatarUrl.value = ''
  selectedFile.value = null
  dialogVisible.value = false
}

// 暴露方法
defineExpose({
  open
})
</script>
<template>
  <el-dialog
  v-model="dialogVisible"
  title="选择头像"
  @close="cancelAvatar"
  >
    <el-upload
    class="avatar-uploader"
    :auto-upload="false"
    :on-change="handleFileChange"
    :show-file-list="false"
  >
    <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
    <el-button v-else size="small" type="primary">点击选择</el-button>
  </el-upload>
  <template #footer>
    <el-button @click="cancelAvatar">取消</el-button>
    <el-button type="primary" @click="confirmAvatar">确认</el-button>
  </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.avatar-uploader {
  // 垂直居中
  display: flex;
  align-items: center;
  justify-content: center;
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      object-fit: cover;
    }
    .el-upload {
      width: 278px;
      height: 278px;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
  }
}
</style>
