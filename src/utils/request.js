import axios from 'axios'

import store from '@/store'

import router from '@/router'

import { Message } from 'element-ui'

import { getTime } from '@/utils/auth'

const TimeOut = 36000 // 定义超时时间

// 创建实例
const service = axios.create({
  // 当执行npm run dev的时候，.env.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // 当执行 npm run build =>  /prod-api
  timeout: 50000 // 设置超时时间
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入token
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      store.dispatch('user/logout') // 登出操作
      router.push('/login') // 退出登录了，就跳转到登录页
      // 如果它为true，表示超时了
      return Promise.reject(new Error('token超时了'))
    }
    // 只有在 有token的情况下才有必要去检查时间戳是否超时
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
  // error 信息 里面 response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入 catch
})
// 设置超时时间
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut () {
  var currentTime = new Date() // 当前时间戳
  var time = getTime() // 缓存时间戳
  return (currentTime - time) / 1000 > TimeOut
}
export default service // 导出axios实例
