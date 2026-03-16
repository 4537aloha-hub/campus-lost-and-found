import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// 导入获取用户物品信息的api
import { getItemByUserId } from '@/api/user'
import { getUserInfo } from '@/api/user'
// 导入路由
import router from '@/router'

export const useUserStore = defineStore("user", () => {
  const token = ref('')
  const userInfo = ref(null)

  // 获取用户信息
  const FetUserInfo = async () => {
  // 页面加载时获取用户信息
  const res = await getUserInfo();
  console.log('用户信息获取成功', res);
  // 存储用户信息（只存储data部分）
  userInfo.value = res.data
}


  //区分物品数据(发布的物品招领数据/丢失物物品数据)
 const itemFound = ref([])
 const itemLost = ref([])

  // 获取用户我发布的物品数据
  const getItemList = async () => {
    const res = await getItemByUserId({type: 'found'})
    console.log('获取我发布的物品数据成功', res);
    itemFound.value = res.data
  }

  // 获取用户我丢失的物品数据
  const getLostItemList = async () => {
    const res = await getItemByUserId({type: 'lost'})
    console.log('获取我丢失的物品数据成功', res);
    itemLost.value = res.data
  }


  const setToken = (tokenValue) => {
    token.value = tokenValue
  }

  // 保存用户信息
  const UserInfo = (data) => {
    // 这里的data代表的是用户信息中data的对象
    userInfo.value = data
  }

  // 清除用户信息 / 退出登录 / 清除本地token信息
  const loginOut = () => {
    // 清空token的值
    token.value = ''
    // 清空用户信息
    userInfo.value = null
    // 跳转登录页
    router.push('/login')
  }

  // 导出方法和函数
  return {
    token,
    userInfo,
    itemFound,
    itemLost,
    setToken,
    UserInfo,
    loginOut,
    FetUserInfo,
    getItemList,
    getLostItemList
  }
},
// 本地持久化
{
  persist: {
    key: 'user',
    paths: ['token', 'userInfo']
  }
});
