
<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, ref, onMounted } from 'vue'
import { verifyEmailCode } from '@/api/user'
import { useUserStore } from '@/stores/modules/userstore'
import { ElMessage } from 'element-plus'
import Breadcrumbs from '@/Views/components/Breadcrumbs.vue';

const userStore = useUserStore()

// 导入路由
const route = useRoute();
const router = useRouter();

const email = computed(() => route.query.email || '')
const code = ref('')
const disabled = computed(() => !code.value)

onMounted(() => {
  // 检查步骤状态，如果没有完成新邮箱输入，强制返回
  if (userStore.updateEmailStep < 2) {
    ElMessage.warning('请先完成前面的步骤')
    router.replace({ name: 'verifyoldemail' })
    return
  }

  if (!email.value) {
    ElMessage.error('未找到新邮箱，请返回重新获取验证码')
    router.replace({ name: 'updateemail' })
  }
})

const verifyCode = async () => {
  if (!code.value) {
    ElMessage.error('请输入验证码')
    return
  }
  if (!email.value) {
    ElMessage.error('未找到新邮箱，请返回重新获取验证码')
    return
  }
  try {
    const res= await verifyEmailCode({
      email: email.value,
      code: code.value,
      type: 'bind'
    })

    if(res.status === 1) {
      ElMessage.error("验证码错误")
      return
    }

    ElMessage.success('验证成功')
    // 重置邮箱验证步骤
    userStore.resetUpdateEmailStep()
    // 使用 replace 替换当前历史记录，防止后退
    router.replace({ name: 'usersecurity' })
  } catch (error) {
    ElMessage.error('验证码错误', error.message)
  }
}
</script>
<template>
  <div class="container">

    <div class="set-email">
      <Breadcrumbs v-if="route.meta?.breadcrumb" />
      <div class="set-email-title">新邮箱验证</div>
      <div class="common-flow-info">当前你正在修改登陆邮箱, 请输入验证码</div>
      <div class="common-flow-cnt">
        <el-input
          v-model="code"
          placeholder="请输入验证码" />
      </div>
      <div class="common-flow-btn">
        <el-button :class="{ active: !disabled }" :disabled="disabled" type="primary" style="width: 100%;" @click="verifyCode">下一步</el-button>
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
