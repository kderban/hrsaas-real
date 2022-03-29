<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮  Excel导入 Excel导出 新增员工-->
        <template #after>
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
          >excel导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportData"
          >excel导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table
          border
          :data="list"
        >
          <!-- sortable 可排序的 -->
          <el-table-column
            type="index"
            label="序号"
            sortable=""
          />
          <el-table-column
            label="姓名"
            sortable=""
            prop="username"
          />
          <el-table-column
            label="工号"
            sortable=""
            prop="workNumber"
          />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column
            label="部门"
            sortable=""
            prop="departmentName"
          />
          <!-- 作用域插槽 + 过滤器 -->
          <el-table-column
            label="入职时间"
            sortable=""
            prop="timeOfEntry"
          >
            <template v-slot="{ row }">
              <!-- 将时间进行格式化 -->
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            sortable=""
            prop="enableState"
          >
            <template v-slot="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
          >
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
              >转正</el-button>
              <el-button
                type="text"
                size="small"
              >调岗</el-button>
              <el-button
                type="text"
                size="small"
              >离职</el-button>
              <el-button
                type="text"
                size="small"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置新增组件 -->
    <!-- sync修饰符作用到属性的后方，子组件去改变父组件数据的语法糖 -->
    <add-employee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'

// 引入员工的枚举对象
import EmployeeEnum from '@/api/constant/employees'

import AddEmployee from './components/add-employee'

import { formatDate } from '@/filters'

export default {
  components: {
    AddEmployee
  },
  data () {
    return {
      list: [], // 接收数组
      page: {
        page: 1,
        size: 10,
        total: 0 // 分页的总数
      },
      loading: false, // 显示遮罩层
      showDialog: false // 默认是关闭的
    }
  },
  created () {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList () {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage (newPage) {
      this.page.page = newPage // 赋值最新的页码
      this.getEmployeeList() //  重新拉取数据
    },
    // 格式化聘用形式
    formatEmployment (row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee (id) {
      try {
        await this.$confirm('确定删除该员工吗?')
        // 点击了确认
        await delEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList() // 重新拉取数据
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel数据
    exportData () {
      //  做操作
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        // 要转化数据结构，还要和表头的数据对应上，要求转出的标题是中文
        // 获取员工的接口，页码 每页条数
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // [["张三", "13811"，"2018","1", "2018", "10002"],["李思", "139811"，"2018","1", "2018", "10002"],...]
        const data = this.formatJson(headers, rows) // 要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        // excel是引入文件的导出对象
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merges // 合并选项
          // autoWidth: true,
          // bookType: 'xlsx'
        })
      })
    },
    // 该方法负责将数组转化成二维数组
    formatJson (headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map(item => {
        // item是一个对象 Object是key
        // ['姓名','手机号',...]
        return Object.keys(headers).map(key => {
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]] // => ["张三", "13811"，"2018","1", "2018", "10002"]
        })
        // ["132", '张三’， ‘’，‘’，‘’d]
      })
    }
  }
}
</script>

<style>
</style>

