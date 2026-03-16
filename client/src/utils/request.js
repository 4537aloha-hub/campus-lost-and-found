import axios from "axios";
import { useUserStore } from "@/stores/modules/userstore";
const request = axios.create({
  baseURL:'http://localhost:3000',
  timeout:5000,
})
// 请求拦截器
request.interceptors.request.use(config=>{
  // 在发送请求之前做些什么
  // 从本地存储中获取token
  const userStore = useUserStore()
  if(userStore.token){
    // 如果token存在，将其添加到请求头中
    config.headers.Authorization = userStore.token
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
