<template>
  <div>
      <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="userContent">
            <el-row>
                <!-- ====================搜索框==================== -->
                    <el-input class="searchOrder" placeholder="请输入内容" v-model="searchOrderValue" @change="searchOrders">
                        <el-button slot="append" icon="el-icon-search" @click="searchOrders"></el-button>
                    </el-input>
                <!-- ====================搜索框==================== -->
            </el-row>
            <el-row>
                <el-table :data="orderList" border style="width: 100%">
                        <el-table-column
                        type="index"
                        width="50">
                        </el-table-column>
                    <el-table-column prop="order_number" label="订单编号" width="230"></el-table-column>
                    <el-table-column prop="order_price" label="订单价格"></el-table-column>
                    <el-table-column v-slot="props" label="是否付款">
                        <el-tag effect="dark" :type="props.row.order_pay === '0' ? 'danger':''">{{props.row.order_pay === '0' ? '未付款':'已付款'}}</el-tag>
                    </el-table-column>
                    <el-table-column prop="is_send" label="是否发货"></el-table-column>
                    <el-table-column prop="create_time" label="下单时间"></el-table-column>
                    <el-table-column label="操作"></el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <!-- ------分页功能------ -->
                <el-pagination
                @size-change="ordersSizeChange"
                @current-change="ordersCurrentChange"
                :current-page="getOrderConfig.pagenum"
                :page-sizes="[10, 15, 20]"
                :page-size="getOrderConfig.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
                <!-- ------分页功能------ -->
            </el-row>
        </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索相关变量
      searchOrderValue: '', // 搜索框中输入的值
      // 获取订单内容相关变量
      orderList: [],
      getOrderConfig: {
        query: '', // 查询参数
        pagenum: 1,
        pagesize: 10
      },
      total: 0 // 所有订单的数据
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单内容=======================================
    /**
     * 在created中服务器获取订单数据，并将订单数据储存到orderList中
     */
    getOrderList() {
      this.$axios.get('orders', { params: this.getOrderConfig }).then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.orderList = res.data.data.goods
          this.total = res.data.data.total
          console.log(this.orderList)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 搜索相关方法=======================================
    /**
     * 点击按钮搜索数据。
     */
    searchOrders() {
      console.log('search')
    //   this.searchOrderValue = this.getOrderConfig.query
    //   this.getOrderList()
    },
    // 分页相关方法=====
    /**
     * 分页页码改变
     */
    ordersSizeChange(val) {
      this.getOrderConfig.pagesize = val
      this.getOrderList()
    },
    ordersCurrentChange(val) {
      this.getOrderConfig.pagenum = val
      this.getOrderList()
    }
  }

}
</script>

<style>
.searchOrder{
    width: 300px !important;
}

</style>
