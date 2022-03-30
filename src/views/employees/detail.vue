<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userForm"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
            >
              <el-form-item
                label="姓名:"
                prop="username"
              >
                <el-input
                  style="width:300px"
                  v-model="userInfo.username"
                />
              </el-form-item>
              <el-form-item
                label="密码:"
                prop="password2"
              >
                <el-input
                  style="width:300px"
                  type="password"
                  v-model="userInfo.password2"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="saveUser"
                >更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <!-- component可以是任何组件,动态组件可以切换，is必须是变量 -->
            <component :is="UserComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置岗位详情 -->
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'

import { saveUserDetailById } from '@/api/employees'

import UserInfo from './components/user-info'

import JobInfo from './components/job-info'

export default {
  components: {
    UserInfo,
    JobInfo
  },
  // 组件状态值
  data () {
    return {
      UserComponent: 'user-info',
      JobComponent: 'job-info',
      userId: this.$route.params.id, // 这样可以直接将路由中的参数赋值给data中的属性
      userInfo: {
        // 专门存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getUserDetailById()
  },
  // 组件方法
  methods: {
    async getUserDetailById () {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUser () {
      try {
        // 校验
        await this.$refs.userForm.validate()
        // 123456  sdfsdfsdf23342134234
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 }) // 将新密码的值替换原密码的值
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}

</script>

<style scoped lang="less">
</style>
