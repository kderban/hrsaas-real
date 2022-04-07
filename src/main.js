import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import Component from '@/components'

// * 把所有的都拿过来
import * as directives from '@/directives'

import * as filters from '@/filters' // 引入工具类

import checkPermission from '@/mixin/checkPermission'

import i18n from '@/lang'

import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 设置element为当前的语言
Vue.use(ElementUI, {
  // 此时i18n会根据local属性，去寻找对应的显示内容
  i18n: (key, value) => i18n.t(key, value) // t方法会根据语言包显示对应的内容
})

Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

Vue.use(Component) // 注册自己的插件

Vue.mixin(checkPermission) // 全局混入检查对象，表示所有的组件都拥有了检查的方法

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
