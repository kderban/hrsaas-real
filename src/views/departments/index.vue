<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容-头部 -->
      <el-card class="tree-card">
        <!-- 缺少treeNode -->
        <!-- :is-root="true" 是根结点 -->
        <tree-tools
          :tree-node="company"
          :is-root="true"
          @addDepts="addDepts"
        />

        <!-- 放置一个属性   这里的props和我们之前学习的父传子 的props没关系 -->
        <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
        <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
          />

        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件  -->
    <add-dept :show-dialog="showDialog" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'

import { getDepartments } from '@/api/departments'

import { tranListToTreeData } from '@/utils'

import AddDept from './components/add-dept' // 引入新增部门组件
export default {
  components: {
    TreeTools,
    AddDept
  },
  data () {
    return {
      company: {}, // 头部的数据结构
      departs: [],
      defaultProps: {
        label: 'name' // 从这个属性显示内容
      },
      showDialog: false, // 默认不显示窗体
      node: null // 记录当前点击的node节点
    }
  },
  created () {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments () {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      // 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
      this.departs = tranListToTreeData(result.depts, '')
      console.log(result)
    },
    // 监听tree-tools中触发的 点击添加子部门的事件
    addDepts (node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来
      this.node = node
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

