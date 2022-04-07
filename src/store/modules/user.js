import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(), // 设置token为共享状态。初始化vuex的时候，就先从缓存中读取
  userInfo: {} // 定义一个空的对象 不是null 因为后边要开发userInfo的属性给别人用  userInfo.name
}
// 修改状态
const mutations = {
  setToken (state, token) {
    state.token = token // 将数据设置给vuex
    setToken(token) // vuex和 缓存数据的同步
  },
  removeToken (state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  setUserInfo (state, result) {
    // 更新一个对象
    state.userInfo = result
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login (context, data) {
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 拿到token，说明登录成功了
    setTime() // 设置当前的时间戳
  },
  async getUserInfo (context) {
    const result = await getUserInfo() // 获取返回值
    // 获取用户的详情   用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations
    return result // 这里给后期做权限的时候，留下的伏笔
  },
  // 登出操作
  logout (context) {
    // 删除token
    context.commit('removeToken') // 不仅删除vuex中的，也删除缓存中的
    // 删除用户资料
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    // 三个参数: mutations名称，payload载荷，{}
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块

    // 重置多页签
    context.dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
