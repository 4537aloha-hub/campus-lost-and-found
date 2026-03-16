<script setup>
// 导入路由
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/userstore';
import { reactive } from 'vue';

import { postLogin } from '@/api/user';
import { ElMessage } from 'element-plus';
// 导入连接WebSocket服务器的函数
import { connectSocket } from '@/utils/socket';

// 导入路由
const router = useRouter();
const route = useRoute();

const userStore = useUserStore();

// 提供注册表单数据
const form = reactive({
  student_id: '',
  password: ''
})

// 提供登录方法
const handleLogin = async () => {

  // 调用登录接口
  const res = await postLogin({

    // 登录接口需要的参数
    student_id: form.student_id,
    password: form.password

  });

  if (res.status === 0) {

    ElMessage.success(res.message);
    console.log('登录成功,返回数据为:', res);

    // 保存token
    userStore.setToken(res.token);

    // 保存用户信息
    userStore.UserInfo(res.userInfo);

    // 连接WebSocket服务器
    connectSocket(userStore.userInfo);

    // 从查询参数中获取 redirect 路径
    const redirect = route.query.redirect || '/';
    router.push(redirect);


  }else {
    ElMessage.error(res.message);
  }

}

</script>
<template>
  <div class="account-box">
    <div class="form-box">
      <div class="title">
        <span>登录</span>
      </div>
    <div class="form">
      <el-form
      >
        <!-- 账户 -->
        <el-form-item label="账户">
          <el-input
          v-model="form.student_id"
          placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
         <el-form-item label="密码">
          <el-input
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
          show-password
          ></el-input>
         </el-form-item>
         <!-- 注册 -->
         <div class="register-item">
          <span>还没有账号? 去<RouterLink to="/register">注册</RouterLink></span>
         </div>
        <!-- 登录按钮 -->
          <div class="btn-item">
            <el-button @click="handleLogin">点击登录</el-button>
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
        .register-item {
          display: flex;
          justify-content: flex-end;
          span {
            font-size: 12px;
          }
        }

        .btn-item {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
      }
    }
  }
</style>
