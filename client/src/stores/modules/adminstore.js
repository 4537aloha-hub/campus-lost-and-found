import { defineStore } from "pinia";
import { ref } from "vue";

export const useAdminStore = defineStore("admin", () => {

    const adminInfo = ref(null)
    const adminToken = ref('')

    // 获取用户信息
    const FetAdminInfo = async () => {
      const res = await getUserInfo();
      console.log('用户信息获取成功', res);
      userInfo.value = res.data
    }

    const setAdminToken = (tokenValue) => {
      adminToken.value = tokenValue
    }

    // 保存用户信息
    const setAdminInfo = (data) => {
      adminInfo.value = data
    }

    return {
      adminInfo,
      adminToken,
      setAdminToken,
      setAdminInfo,
      FetAdminInfo,
    }
})
