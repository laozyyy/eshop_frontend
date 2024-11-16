//axios的基础封装
import axios from "axios";
// import { ElMessage } from 'element-plus'
// import { useUserStore } from '@/stores/userStore'

//创建一个axios实例
const httpInstance = axios.create({
  baseURL:'http://127.0.0.1:4523/m1/5464517-0-default',
  timeout:5000
})


//拦截器
// axios请求拦截器
httpInstance.interceptors.request.use(config => {
  return config
},e => Promise.reject(e))
// httpInstance.interceptors.request.use(config => {
//   // 1. 从pinia获取token数据
//   const userStore = useUserStore()
//   // 2. 按照后端的要求拼接token数据
//   const token = userStore.userInfo.token
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// }, e => Promise.reject(e))

// axios响应式拦截器
httpInstance.interceptors.response.use(
  res => res.data, e => {
    return Promise.reject(e)
  }
)
// httpInstance.interceptors.response.use(res => res.data, e => {
//   // 统一错误提示
//   ElMessage({
//     type: 'warning',
//     message: e.response.data.message
//   })
//   return Promise.reject(e)
// })


export default httpInstance
