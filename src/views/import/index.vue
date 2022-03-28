<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  // 组件状态值
  data () {
    return {

    }
  },
  // 组件方法
  methods: {
    async success ({ header, results }) {
      // header，result里面的数据是中文
      // 和新增员工的属性是一致的
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // map 函数 通过指定函数处理数组的每个元素，并返回处理后的数组。
      // map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
      var newArr = results.map(item => {
        var userInfo = {}
        // Object.keys(item) 数组里面是属性，中文的key
        // item[key] 原来的数据结构，中文
        Object.keys(item).forEach(key => {
          // key是当前的中文名 找到对应的英文名
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 后端接口 限制了，不能是字符串，要求转化时间类型
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // new Date(只有这样, 才能入库
          } else {
            userInfo[userRelations[key]] = item[key] // 将原来中文的值赋值给原来中文的值
          }
        })
        // 最终userInfo变成了全是英文
        return userInfo
      })
      await importEmployee(newArr) // 接收一个数组
      this.$message.success('导入excel成功')
      this.$router.back() // 回到上一个页面
    },
    // 转化excel的日期格式
    formatDate (numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped lang="less">
</style>
