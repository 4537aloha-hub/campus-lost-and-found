<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, ref } from 'vue'
import { sendEmailCode, verifyEmailCode } from '@/api/user'
import { ElMessage } from 'element-plus'
import Breadcrumbs from '@/Views/components/Breadcrumbs.vue';
import { useUserStore } from '@/stores/modules/userstore'
const userStore = useUserStore()
const { userInfo } = userStore

// 导入路由
const route = useRoute();
const router = useRouter();

const email = ref('')
const disabled = computed(() => !Code.value)

const Code = ref('')

const sendCode = async () => {
  email.value = userInfo.email
  try {
    const res= await sendEmailCode({
      email: email.value,
      type: 'verify'
    })
    console.log('发送的验证码是', res);
    ElMessage.success('验证码发送成功')
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const nextStep = async () => {
  if (!Code.value) {
    ElMessage.error('请输入验证码')
    return
  }
  try {
    const res= await verifyEmailCode({
      email: email.value,
      code: Code.value,
      type: 'verify'
    })

    if(res.status === 1) {
      ElMessage.error("验证码错误")
      return
    }

    ElMessage.success('验证成功')
    // 设置验证步骤为1（旧邮箱验证通过）
    userStore.setUpdateEmailStep(1)
    // 使用 replace 替换当前历史记录，防止后退
    router.replace({ name: 'updateemail' })
  } catch (error) {
    ElMessage.error('验证码错误', error.message)
  }
}

</script>
<template>
  <div class="container">

    <div class="set-email">
      <Breadcrumbs v-if="route.meta?.breadcrumb" />
      <div class="set-email-title">验证邮箱</div>
      <div class="common-flow-info">当前你正在修改登陆邮箱, 请先验证原邮箱</div>
      <div class="common-flow-cnt">
        <el-input
          v-model="Code"
          placeholder="请输入原邮箱验证码" />
      </div>
      <div class="verify-send-btn" @click="sendCode">获取验证码</div>
      <div class="common-flow-btn">
        <el-button
        @click="nextStep"
        :class="{ active: !disabled }"
        :disabled="disabled" type="primary"
        style="width: 100%;">
        下一步
        </el-button>
        </div>
      </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  background: #fff;
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  max-width: 1240px;
  .set-email {
    width: 340px;
    padding: 80px 0 120px;
    margin: 0 auto;

    .set-email-title {
      margin-top: 52px;
      font-size: 22px;
      line-height: 31px;
      font-weight: 600;
    }
    .common-flow-info {
      margin-top: 12px;
      color: #61666d;
      font-size: 12px;
      line-height: 21px;
      font-weight: 400;
    }
    .common-flow-cnt {
      margin-top: 24px;

      .el-input {
        position: relative;
        font-size: 14px;
      }
    }

    .verify-send-btn {
      margin-top: 12px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #00aeec;
      cursor: pointer;
    }

    .common-flow-btn {
      width: 100%;
      margin-top: 40px;

      .el-button {
        color: #fff;
        background-color: #80d7f6;
        border-color: #80d7f6;
      }
      .el-button.active {
        background-color: #409eff;
        border-color: #409eff;
      }
    }
  }
}
</style>
