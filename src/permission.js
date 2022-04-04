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
        // async 函数所return的内容，await可以接收到
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        // actions是做异步操作的
        const { roles } = await store.dispatch('user/getUserInfo')
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) // 筛选得到当前用户可用的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes  必须 用 next(地址) 不能用next()
        router.addRoutes(routes) // 添加动态路由到路由表  铺路
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        next()
      }
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
