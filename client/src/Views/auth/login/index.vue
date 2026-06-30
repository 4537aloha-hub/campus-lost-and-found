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
  // 简单校验
  if (!form.student_id || !form.password) {
    ElMessage.warning('请输入账号和密码');
    return;
  }

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
  } else {
    ElMessage.error(res.message);
  }
}
</script>

<template>
  <div class="account-box">
    <!-- 欢迎语 -->
    <div class="welcome-box">
      <div class="welcome-message">欢迎来到校园失物招领系统</div>
      <div class="welcome-subtitle">登录后可使用完整功能</div>
    </div>

    <div class="form-box">
      <div class="title">
        <span>登录</span>
      </div>

      <div class="form">
        <el-form>
          <!-- 忘记密码 -->
          <div class="forgot-password">
            <RouterLink to="/forgetpassword">忘记密码？</RouterLink>
          </div>

          <!-- 账户输入框 -->
          <el-form-item>
            <el-input
              v-model="form.student_id"
              placeholder="请输入账号"
              class="input-custom"
            ></el-input>
          </el-form-item>

          <!-- 密码输入框 -->
          <el-form-item>
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              type="password"
              show-password
              class="input-custom"
            ></el-input>
          </el-form-item>

          <!-- 登录按钮 -->
          <div class="btn-item">
            <el-button @click="handleLogin" class="btn-login"><span>登录</span></el-button>
          </div>

          <!-- 注册链接 -->
          <div class="register-item">
            <span>还没有账号？<RouterLink to="/register">去注册</RouterLink></span>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f4f7fb;
  padding: 20px;
}

.welcome-box {
  margin-bottom: 22px;
  text-align: center;
}

.welcome-message {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.form-box {
  width: min(460px, 100%);
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  padding: 36px;
}

.title {
  text-align: center;
  margin-bottom: 22px;

  span {
    font-size: 30px;
    font-weight: 700;
    color: #111827;
  }
}

.form {
  width: 100%;

  .input-custom {
    --el-input-height: 48px;
    border-radius: 12px;
  }
}

.forgot-password {
  text-align: right;
  margin-bottom: 18px;

  a {
    font-size: 13px;
    color: #2563eb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.btn-item {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;

  .btn-login {
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-radius: 14px;
    border: none;
  }
}

.register-item {
  text-align: center;
  font-size: 13px;
  color: #6b7280;

  a {
    color: #2563eb;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
