
import store from '@/store'

// 做一个混入对象
export default {
  // 混入对象是组件的选项对象
  methods: {
    // 检查权限   key是要检查的点
    checkPermission (key) {
      const { userInfo } = store.state.user
      // 去用户的信息里面找points中有没有key，如果有key 则认为有权限，否则就不能点击
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false // 如果没有进入if，说明没有权限
    }
  }
}

