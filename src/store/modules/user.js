import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
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
  },
  async getUserInfo (context) {
    const result = await getUserInfo() // 获取返回值
    // 获取用户的详情   用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations
    return result // 这里给后期做权限的时候，留下的伏笔
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
