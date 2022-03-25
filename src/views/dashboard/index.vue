<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
       <!--插槽的两种方式   slot="名称" 或者 v-slot:名称 -->
      <!-- <span slot="before">我想你们</span> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
