// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store' // 引入store实例，和组件中的this.$store是一样的
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式
// 不需要导出,因为只需要让代码执行即可

// 导航的前置守卫
// next是前置守卫必须执行的钩子函数，如果不执行页面就不行了
// next()         放过
// next(false)    跳转终止
// next(地址)      跳转到某个地址
const whiteList = ['/login', '/404'] // 定义白名单
router.beforeEach(async (to, from, next) => {
  nprogress.start() // 开启进度条的意思
  if (store.getters.token) {
    // 有token的情况下，才能获取资料
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是登录页
      next('/') // 跳到主页
    } else {
      // 只有放过的时候，才去获取用户资料
      // 如果当前vuex中有用户的资料的id，表示已经有资料了不需要获取，没有id的话才需要获取
      if (!store.getters.userId) {
        // 如果后续需要根据用户资料获取数据的话，这里必须改成同步
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    // 没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址 在白名单
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  nprogress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 导航的后置守卫
router.afterEach(() => {
  nprogress.done() // 关闭进度条
})
