<script setup>
// 导入面包屑组件
import Breadcrumbs from '@/Views/components/Breadcrumbs.vue';
import { ref, onMounted } from 'vue';
// 导入默认头像
import defaultAvatar from '@/assets/imgs/avatar.jpg';
// 导入storeToRefs 方法
import { storeToRefs } from 'pinia';
// 导入更新用户接口
import { updateUserInfo } from '@/api/user';
// 导入上传头像接口
import { uploadAvatar } from '@/api/user';
// 导入上传头像弹窗组件
import UploadAvatar from '@/Views/frontend/user/components/edit_userinfo_components/UploadAvatar.vue'

// 导入路由
import { useRoute } from 'vue-router';

// 导入用户仓库
import {  useUserStore } from '@/stores/modules/userstore';
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

// 获取路由实例
const route = useRoute();

// 控制子组件(上传头像)的弹窗显示
const dialogVisible = ref();

// 用户头像
const avatarUrl = ref('');
// 选择的头像文件
const avatarFile = ref(null);

// 打开弹窗点击事件
const handleEditAvatar = () => {
  dialogVisible.value.open()
};

// 处理头像选择
const handleAvatarSelected = (file, previewUrl) => {
  // 保存选择的文件和预览URL
  avatarFile.value = file;
  avatarUrl.value = previewUrl;

  console.log('上传的头像文件:',avatarFile.value);
  console.log('打印avatarUrl的值', avatarUrl.value);

  // 更新表单的头像预览
  userInfoForm.value.avatar = previewUrl;
};

// 提交更新用户的信息表单 提供给接口
const userInfoForm = ref({
  avatar: userInfo.value.avatar || '',
  username: userInfo.value.username || '',
  email: userInfo.value.email || '',
  grade: userInfo.value.grade || '',
  major: userInfo.value.major || '',
})

// 提交按钮操作函数
const submitUserInfoForm = async () => {
  // 前端判断用户是否存在
  if(userInfo.value.student_id) {
    console.log('该用户存在可以进行下一步操作');
  }else {
    // 提示用户信息不存在
    ElMessage.error('用户信息不存在');
    return;
  }

  try {
    if(avatarFile.value) {
      // axios 上传头像必须使用formdata
      const formData = new FormData();
      formData.append('file', avatarFile.value);
      // 上传头像
      const res = await uploadAvatar(formData);

      // 判断接口返回状态码是否为0 否则返回报错信息
      if(res.status !== 0){
        ElMessage.error(res.message);
        return;
      }

      // 获取上传成功的头像URL
      const avatarUrl = res.url;
      console.log('获取上传成功的头像URL', avatarUrl);

      // 更新用户信息表单的avatar字段
      userInfoForm.value.avatar = res.url;
    }

    // 更新用户信息
    const res = await updateUserInfo(userInfoForm.value);

    // 判断接口返回状态码是否为0 不是返回报错信息
    if(res.status !== 0){
      ElMessage.error(res.message);
      return;
    }

    if(res.status === 0) {
      await userStore.FetUserInfo();
      userInfoForm.value = {...userStore.userInfo}
      // 提示用户信息更新成功
      ElMessage.success('更新用户信息成功');
    }

  }catch (error) {
    console.log(error);
    ElMessage.error('更新用户信息失败');
  }
}

onMounted(()=> {
  // 初始化用户信息表单
  userInfoForm.value = {
    avatar: userInfo.value.avatar || '',
    username: userInfo.value.username || '',
    grade: userInfo.value.grade || '',
    major: userInfo.value.major || '',
  }
  console.log('用户信息表单:', userInfoForm.value);
})

</script>
<template>
  <div class="container">
    <!-- 面包屑组件 -->
    <div class="breadcrumb-container">
      <Breadcrumbs v-if="route.meta?.breadcrumb" />
    </div>
    <!-- 头像区域 -->
    <div @click="handleEditAvatar" class="avatar">
      <el-avatar :src="userStore.userInfo?.avatar === '/default-avatar.png' ? defaultAvatar : userStore.userInfo?.avatar" :size="100"></el-avatar>
    </div>
    <!-- 学号 -->
     <div class="student-id"><span>学号:{{ userInfo.student_id }}</span></div>
    <!-- el-form表单 修改用户信息区 -->
     <el-form
     label-width="100px"
     class="form"
     >
      <!-- 用户名 -->
       <el-form-item label="用户名:" prop="username">
        <el-input v-model="userInfoForm.username" placeholder="请输入用户名" style="width: 300px;"></el-input>
      </el-form-item>
      <!-- 年级 -->
       <el-form-item label="年级:" prop="grade">
        <el-input v-model="userInfoForm.grade" placeholder="请输入年级" style="width: 300px;"></el-input>
      </el-form-item>
      <!-- 专业 -->
       <el-form-item label="专业:" prop="major">
        <el-input v-model="userInfoForm.major" placeholder="请输入专业" style="width: 300px;"></el-input>
      </el-form-item>
     </el-form>
      <!-- 修改按钮 -->
      <el-button type="primary" @click="submitUserInfoForm">修改信息</el-button>
  </div>
  <!-- 上传头像弹窗 -->
  <UploadAvatar ref="dialogVisible" @avatar-selected="handleAvatarSelected"/>
</template>
<style scoped lang="scss">
.container{
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  justify-content: flex-start;
}

.breadcrumb-container {
  width: 420px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.avatar {
  margin-bottom: 20px;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}

.student-id {
  margin-bottom: 20px;
  font-size: 14px;
}

.form {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-form-item {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
}
</style>
