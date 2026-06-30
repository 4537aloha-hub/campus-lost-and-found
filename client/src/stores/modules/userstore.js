import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserInfo } from '@/api/user'
import router from '@/router/fronted'

export const useUserStore = defineStore("user", () => {
  const token = ref('')
  const userInfo = ref(null)
  const updateEmailStep = ref(0) // 0: 未开始, 1: 旧邮箱验证通过, 2: 新邮箱输入完成

  // 获取用户信息
  const FetUserInfo = async () => {
    const res = await getUserInfo();
    console.log('用户信息获取成功', res);
    userInfo.value = res.data
  }

  const setToken = (tokenValue) => {
    token.value = tokenValue
  }

  // 保存用户信息
  const UserInfo = (data) => {
    userInfo.value = data
  }

  // 退出登录
  const loginOut = () => {
    token.value = ''
    userInfo.value = null
    updateEmailStep.value = 0 // 退出清空换邮箱状态
    router.push('/login')
  }

  // 设置邮箱验证步骤
  const setUpdateEmailStep = (step) => {
    updateEmailStep.value = step
  }

  // 重置邮箱验证步骤
  const resetUpdateEmailStep = () => {
    updateEmailStep.value = 0
  }

  return {
    token,
    userInfo,
    updateEmailStep,
    setToken,
    UserInfo,
    loginOut,
    FetUserInfo,
    setUpdateEmailStep,
    resetUpdateEmailStep,
  }
},
{
  persist: {
    key: 'user',
    paths: ['token', 'userInfo'] // updateEmailStep不持久化，刷新页面重置流程
  }
});
