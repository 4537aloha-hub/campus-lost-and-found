<script setup>
import { reactive, ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  checkStudentId,
  sendForgetEmailCode,
  verifyForgetEmailCode,
  resetPassword
} from '@/api/user'

const router = useRouter()
const formRef = ref(null)
const currentStep = ref(0)
const loading = ref(false)
const countDown = ref(0)
let timer = null

const form = reactive({
  student_id: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const maskedEmail = ref('')

const stepLabels = ['验证学号', '验证邮箱', '校验验证码', '重置密码']
const stepDescriptions = [
  '请输入您注册时使用的学号',
  '请输入账号绑定的邮箱，发送验证码',
  '输入邮箱收到的验证码进行验证',
  '设置新密码并完成找回'
]

const emailStatusText = computed(() => {
  return maskedEmail.value ? `系统已识别绑定邮箱：${maskedEmail.value}` : '验证学号后自动显示绑定邮箱'
})

const startCountdown = () => {
  countDown.value = 60
  timer = setInterval(() => {
    if (countDown.value > 0) {
      countDown.value -= 1
    } else {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const validateStudentId = () => {
  if (!form.student_id.trim()) {
    ElMessage.warning('请输入学号')
    return false
  }
  return true
}

const validateEmail = () => {
  if (!form.email.trim()) {
    ElMessage.warning('请输入邮箱')
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    ElMessage.warning('请输入正确的邮箱格式')
    return false
  }
  return true
}

const validateCode = () => {
  if (!form.code.trim()) {
    ElMessage.warning('请输入验证码')
    return false
  }
  return true
}

const validatePassword = () => {
  if (!form.password) {
    ElMessage.warning('请输入新密码')
    return false
  }
  if (form.password.length < 6 || form.password.length > 20) {
    ElMessage.warning('密码长度为6-20位')
    return false
  }
  if (form.password !== form.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return false
  }
  return true
}

const handleCheckStudentId = async () => {
  if (!validateStudentId()) return

  loading.value = true
  try {
    const res = await checkStudentId({ student_id: form.student_id })
    if (res.status === 0) {
      maskedEmail.value = res.data.email
      currentStep.value = 1
      ElMessage.success('学号校验通过，请输入绑定邮箱发送验证码')
    } else {
      ElMessage.error(res.message || '学号校验失败')
    }
  } catch (err) {
    ElMessage.error(err.message || '学号校验失败')
  } finally {
    loading.value = false
  }
}

const handleSendCode = async () => {
  if (!validateEmail()) return

  loading.value = true
  try {
    const res = await sendForgetEmailCode({
      student_id: form.student_id,
      email: form.email
    })
    if (res.status === 0) {
      startCountdown()
      currentStep.value = 2
      ElMessage.success('验证码已发送，请注意查收')
    } else {
      ElMessage.error(res.message || '验证码发送失败')
    }
  } catch (err) {
    ElMessage.error(err.message || '验证码发送失败')
  } finally {
    loading.value = false
  }
}

const handleVerifyCode = async () => {
  if (!validateCode()) return

  loading.value = true
  try {
    const res = await verifyForgetEmailCode({
      student_id: form.student_id,
      email: form.email,
      code: form.code
    })
    if (res.status === 0) {
      currentStep.value = 3
      ElMessage.success('验证码校验通过，请输入新密码')
    } else {
      ElMessage.error(res.message || '验证码校验失败')
    }
  } catch (err) {
    ElMessage.error(err.message || '验证码校验失败')
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!validatePassword()) return

  loading.value = true
  try {
    const res = await resetPassword({
      student_id: form.student_id,
      email: form.email,
      code: form.code,
      password: form.password,
      confirmPassword: form.confirmPassword
    })
    if (res.status === 0) {
      ElMessage.success('密码修改成功，正在跳转登录页')
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } else {
      ElMessage.error(res.message || '密码修改失败')
    }
  } catch (err) {
    ElMessage.error(err.message || '密码修改失败')
  } finally {
    loading.value = false
  }
}

const handleNext = async () => {
  if (currentStep.value === 0) {
    await handleCheckStudentId()
  } else if (currentStep.value === 1) {
    await handleSendCode()
  } else if (currentStep.value === 2) {
    await handleVerifyCode()
  } else {
    await handleResetPassword()
  }
}

const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value -= 1
  }
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <div class="forget-password">
    <div class="welcome-box">
      <div class="welcome-message">忘记密码</div>
      <div class="welcome-subtitle">按照步骤完成身份校验，安全重置登录密码</div>
    </div>

    <div class="form-box">
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step v-for="(label, index) in stepLabels" :key="index" :title="label" :description="stepDescriptions[index]" />
      </el-steps>

      <div class="card-box">
        <el-form ref="formRef" :model="form" label-position="top" status-icon>
          <template v-if="currentStep === 0">
            <el-form-item label="学号">
              <el-input v-model="form.student_id" placeholder="请输入学号" class="input-custom" />
            </el-form-item>
          </template>

          <template v-else-if="currentStep === 1">
            <el-form-item label="绑定邮箱">
              <el-input v-model="form.email" placeholder="请输入绑定邮箱" class="input-custom" />
            </el-form-item>
            <div class="hint-text">{{ emailStatusText }}</div>
          </template>

          <template v-else-if="currentStep === 2">
            <el-form-item label="邮箱验证码">
              <el-input v-model="form.code" placeholder="请输入邮件验证码" class="input-custom" />
            </el-form-item>
            <div class="hint-text">验证码已发送到：{{ maskedEmail }}</div>
          </template>

          <template v-else>
            <el-form-item label="新密码">
              <el-input v-model="form.password" placeholder="请输入新的登录密码" type="password" show-password class="input-custom" />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="form.confirmPassword" placeholder="请再次输入新密码" type="password" show-password class="input-custom" />
            </el-form-item>
          </template>
        </el-form>

        <div class="actions">
          <el-button plain @click="handlePrev" :disabled="currentStep === 0">上一步</el-button>
          <el-button type="primary" :loading="loading" @click="handleNext">
            <template v-if="currentStep === 0">下一步</template>
            <template v-else-if="currentStep === 1">发送验证码</template>
            <template v-else-if="currentStep === 2">校验验证码</template>
            <template v-else>完成并重置</template>
          </el-button>
        </div>

        <div class="send-code-row" v-if="currentStep === 1">
          <el-button type="text" :disabled="countDown > 0 || loading" @click="handleSendCode">
            {{ countDown > 0 ? `重新发送(${countDown}s)` : '重新发送验证码' }}
          </el-button>
        </div>
      </div>

      <div class="tips-box">
        <p>• 请使用您注册时绑定的邮箱完成验证，避免账号泄露。</p>
        <p>• 验证码 5 分钟内有效，未收到请检查垃圾邮箱。</p>
        <p>• 找回成功后将自动跳转登录页。</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.forget-password {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f4f7fb;
  padding: 0 20px;
}

.welcome-box {
  text-align: center;
  margin-bottom: 24px;
}

.welcome-message {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.welcome-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.form-box {
  width: 500px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  padding: 32px;
}

.card-box {
  margin-top: 24px;
  padding: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.input-custom {
  --el-input-height: 48px;
  border-radius: 10px;
}

.hint-text {
  margin-top: 12px;
  color: #6b7280;
  font-size: 13px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 28px;
}

.el-button {
  min-width: 140px;
}

.send-code-row {
  margin-top: 12px;
  text-align: right;
}

.tips-box {
  margin-top: 18px;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.8;
}
</style>
