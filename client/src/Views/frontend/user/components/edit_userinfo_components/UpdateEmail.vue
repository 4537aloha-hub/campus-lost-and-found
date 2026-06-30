<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, ref, onMounted } from 'vue'
import { sendEmailCode } from '@/api/user'
import { useUserStore } from '@/stores/modules/userstore'
import { ElMessage } from 'element-plus'
import Breadcrumbs from '@/Views/components/Breadcrumbs.vue';

const userStore = useUserStore()

// 导入路由
const route = useRoute();
const router = useRouter();

const email = ref('')
const disabled = computed(() => !email.value)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 页面加载时检查是否已经完成旧邮箱验证
onMounted(() => {
  // 如果用户没有完成旧邮箱验证，强制跳转到验证页面
  if (userStore.updateEmailStep < 1) {
    ElMessage.warning('请先验证原邮箱')
    router.replace({ name: 'verifyoldemail' })
  }
})

const sendCode = async () => {
  if (!emailPattern.test(email.value)) {
    ElMessage.error('请输入正确的邮箱格式')
    return
  }

  try {
    await sendEmailCode({
      email: email.value,
      type:'bind'
    })
    // 设置步骤为2（新邮箱输入完成）
    userStore.setUpdateEmailStep(2)
    ElMessage.success('验证码发送成功')
    // 使用 replace 替换当前历史记录，防止后退
    router.replace({ name: 'newemailverify', query: { email: email.value } })
  } catch (error) {
    ElMessage.error(error.message)
  }
}
</script>
<template>
  <div class="container">

    <div class="set-email">
      <Breadcrumbs v-if="route.meta?.breadcrumb" />
      <div class="set-email-title">新邮箱设置</div>
      <div class="common-flow-info">当前你正在修改登陆邮箱, 请先输入新的邮箱</div>
      <div class="common-flow-cnt">
        <el-input
          v-model="email"
          placeholder="请输入新邮箱" />
      </div>
      <div class="common-flow-btn">
        <el-button :class="{ active: !disabled }" :disabled="disabled" type="primary" style="width: 100%;" @click="sendCode">获取验证码</el-button>
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
