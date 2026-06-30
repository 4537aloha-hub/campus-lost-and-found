<script setup>
import { reactive, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import {
  postRegister,
  sendRegisterEmailCode,
  verifyRegisterEmailCode
} from '@/api/user'

const router = useRouter()

const formRef = ref()

const codeLoading = ref(false)
const countDown = ref(0)

let timer = null

const form = reactive({
  student_id: '',
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  code: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  student_id: [
    {
      required: true,
      message: '请输入学号',
      trigger: 'blur'
    }
  ],

  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],

  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 20,
      message: '密码长度为6-20位',
      trigger: 'blur'
    }
  ],

  confirmPassword: [
    {
      validator: validateConfirmPassword,
      trigger: 'blur'
    }
  ],

  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '邮箱格式不正确',
      trigger: 'blur'
    }
  ],

  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }
  ]
}

// 发送验证码
const handleSendCode = async () => {
  if (!form.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }

  codeLoading.value = true

  try {
    const res = await sendRegisterEmailCode({
      email: form.email,
      type: 'register'
    })

    if (res.code === 0) {
      ElMessage.success('验证码已发送')

      countDown.value = 60

      timer = setInterval(() => {
        countDown.value--

        if (countDown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      ElMessage.error(res.message || '验证码发送失败')
    }
  } catch (err) {
    ElMessage.error('验证码发送失败')
  } finally {
    codeLoading.value = false
  }
}

// 注册
const handleRegister = async () => {
  try {
    await formRef.value.validate()

    // 后端负责验证码校验通过后 走注册接口
    const registerRes = await postRegister({
      student_id: form.student_id,
      username: form.username,
      password: form.password,
      email: form.email,
      code: form.code
    })

    if (registerRes.status === 0) {
      ElMessage.success('注册成功')

      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } else {
      ElMessage.error(
        registerRes.message || '注册失败'
      )
    }
  } catch (err) {
    console.log(err)
  }
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="account-box">
    <!-- 欢迎语 -->
    <div class="welcome-box">
      <div class="welcome-message">欢迎来到校园失物招领系统</div>
      <div class="welcome-subtitle">注册账号后即可登录账号,使用完整功能</div>
    </div>


    <div class="form-box">
      <div class="title">
        <span>注册</span>
      </div>

      <div class="form">
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-position="top"
        >
          <el-form-item label="学号" prop="student_id">
            <el-input
              v-model="form.student_id"
              placeholder="请输入学号"
              class="input-custom"
            />
          </el-form-item>

          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              class="input-custom"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              type="password"
              show-password
              class="input-custom"
            />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              placeholder="请确认密码"
              type="password"
              show-password
              class="input-custom"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱"
              class="input-custom"
            />
          </el-form-item>

          <el-form-item label="验证码" prop="code">
            <div class="code-row">
              <el-input
              v-model="form.code"
              placeholder="请输入验证码"
              class="input-custom"
            ></el-input>

            <el-button
              :loading="codeLoading"
              :disabled="countDown > 0"
              @click="handleSendCode"
            >
              {{
                countDown > 0
                  ? `${countDown}s后重发`
                  : '发送验证码'
              }}
            </el-button>
            </div>

          </el-form-item>

          <div class="btn-item">
            <el-button @click="handleRegister" class="btn-register">
              <span>注册</span>
            </el-button>
          </div>

          <div class="login-item">
            <span>已有账号？<RouterLink to="/login">去登录</RouterLink></span>
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
  width: min(520px, 100%);
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

  .code-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-input {
      flex: 1;
      height: 40px;
    }
  }
}

.btn-item {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;

  .btn-register {
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

.login-item {
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
