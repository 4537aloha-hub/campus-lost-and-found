<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { postRegister } from '@/api/user';
import { ElMessage } from 'element-plus';

// 导入路由
const router = useRouter();

// 提供注册表单数据
const form = reactive({
  account: '',
  password: ''
})

// 提供注册方法
const handleRegister = async () => {
  const res = await postRegister({
    account: form.account,
    password: form.password
  });
  if(res.code === 0) {
    console.log('注册成功!', res);
    router.push('/login');
  }else {
    ElMessage.error(res.msg || '注册失败');
  }
}


</script>
<template>
  <div class="account-box">
    <div class="form-box">
      <div class="title">
        <span>注册</span>
      </div>
    <div class="form">
      <el-form
      >
        <!-- 账户 -->
        <el-form-item label="账户">
          <el-input
          v-model="form.account"
          placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
         <el-form-item label="密码">
          <el-input
          v-model="form.password"
          placeholder="请输入密码"
          ></el-input>
         </el-form-item>
        <!-- 登录按钮 -->
          <div class="btn-item">
            <el-button @click="handleRegister">点击注册</el-button>
          </div>
      </el-form>
    </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .account-box {
    min-height: 100vh;
    display: flex;
    margin-top: 200px;
    .form-box {
      width: 300px;
      margin: 0 auto;
      height: 240px;
      background: rgb(156, 196, 208, 0.8);
      border-radius: 15px;
      .title {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 30px;
        span {
          font-size: 20px;
          font-weight: 600;
        }
      }
      .form {
        margin: 0 auto;
        width: 250px;
        padding: 0;

        .btn-item {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
      }
    }
  }
</style>
