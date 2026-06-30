import axios from "axios";
import { useUserStore} from "@/stores/modules/userstore";
import { useAdminStore } from "@/stores/modules/adminstore";

const request = axios.create({
  baseURL:'http://localhost:3000',
  timeout:5000,
})
// 请求拦截器
request.interceptors.request.use(config=>{
  // 在发送请求之前做些什么
  // 从本地存储中获取token
  const userStore = useUserStore()
  const adminStore = useAdminStore()

  // 优先使用管理员 token，其次使用普通用户 token
  const rawToken = adminStore.adminToken || userStore.token
  if (rawToken) {
    // 有些地方（后端登录返回）已经包含了 'Bearer ' 前缀，避免重复添加
    const authHeader = rawToken.startsWith && rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`
    config.headers.Authorization = authHeader
  }

  return config
},error=>{
  return Promise.reject(error)
})
// 响应拦截器
request.interceptors.response.use(response=>{
  return response.data
},error=>{

  return Promise.reject(error)
})
export default request;
