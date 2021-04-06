<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="userContent">
      <div id="main" style="width: 750px; height: 400px"></div>
    </div>
  </div>
</template>

<script>
// 新版需要这样按需导入echarts
import * as echarts from 'echarts'
export default {
  data() {
    return {
      reportsData: {}
    }
  },
  created() {

  },
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$axios.get('reports/type/1')
    myChart.setOption(res.data)
  },
  methods: {
    // /**
    //  * 获取销量数据
    //  */
    // async getReportsInfo() {
    //   const { data: res } = await this.$axios.get('reports/type/1')
    //   // console.log(res.data)
    //   this.reportsData = res.data
    //   console.log(this.reportsData)
    // }
  }
}
</script>

<style>
</style>
