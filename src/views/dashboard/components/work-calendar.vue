<template>
 <!-- 工作日历 -->
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <!-- 年   用组件定一个日期，日期获取年，年取前五年 + 后五年 -->
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="dateChange">
        <!-- 循环 -->
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="dateChange">
         <!-- 循环 -->
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
    </el-row>
    <!-- 放置一个日历组件 -->
    <el-calendar v-model="currentDate">
      <!-- date单元格的日期   data是对象，对象里有要显示的day -->
      <template v-slot:dateCell="{ date, data }" class="content">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay (value) {
      // 2021-08-08  2021-08-18
      const day = value.split('-')[2] // 08  18
      return day.startsWith('0') ? day.substr(1) : day // 8 18
    }
  },
  props: {
    // 告诉我当前是哪一年
    startDate: {
      type: Date,
      // 回调函数式的返回值
      default: () => new Date() // 如果没有传递startDate，就取当前时间
    }
  },
  data () {
    return {
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null,
      yearList: [] // 要遍历的年的数组
    }
  },
  //   初始化事件
  created () {
    //    处理起始时间
    // 组件要求起始时间必须是 周一开始 以一个月为开始
    this.currentMonth = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    // 根据当前的年 生成可选年份 前后各加5年
    this.yearList = Array.from(Array(11), (value, index) => this.currentYear + index - 5)
    this.dateChange()
  },
  methods: {
    // 是否是休息日
    isWeek (value) {
      // 计算 当年当月的第一个周一 再加上 四周之后的一个月月份
      return value.getDay() === 6 || value.getDay() === 0
    },
    // 年月份改变之后
    dateChange () {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`) // 以当前月的1号为起始
    }
  }
}
</script>

<style  scoped>
   .el-calendar-day {
  height:  auto;
 }
   .el-calendar-table__row td,.el-calendar-table tr td:first-child,.el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 .el-calendar__header {
   display: none
 }
</style>

