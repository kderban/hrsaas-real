import axios from 'axios'

import store from '@/store'

import { Message } from 'element-ui'

// 创建实例
const service = axios.create({
  // 当执行npm run dev的时候，.env.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // 当执行 npm run build =>  /prod-api
  timeout: 5000 // 设置超时时间
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入token
  if (store.getters.token) {
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须要返回config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // axios 默认加了一层data
  const { success, message, data } = response.data
  // 要根据 success 的成功与否，决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入 catch
})
export default service // 导出axios实例
