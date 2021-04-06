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
                        <el-tag effect="dark" :type="props.row.pay_status === '0' ? 'danger':''" size="mini">{{props.row.order_pay === '0' ? '未付款':'已付款'}}</el-tag>
                    </el-table-column>
                    <el-table-column prop="is_send" label="是否发货"></el-table-column>
                    <el-table-column prop="create_time" label="下单时间"></el-table-column>
                    <el-table-column label="操作" v-slot="props">
                        <el-tooltip class="item" effect="dark" content="修改订单地址" placement="top" :enterable="false">
                            <el-button type="primary" size="mini" @click="openEditAddress(props.row)" icon="el-icon-edit"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="物流信息" placement="top" :enterable="false">
                            <el-button type="success" size="mini"  icon="el-icon-s-marketing" @click="openExpress(props.row)"></el-button>
                        </el-tooltip>
                    </el-table-column>
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
            <!-- ========================================修改地址======================================== -->
            <el-dialog
            title="提示"
            :visible.sync="editAddressDialogVisible"
            width="50%"
            :before-close="editAddressDialogClose">
                <el-form :model="addressForm" :rules="addressRules" ref="addressForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="省市区/县" prop="address1">
                        <el-cascader
                            :options="cityOptions"
                            v-model="addressForm.address1"
                        >
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="addressForm.address2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editAddressDialogClose">取 消</el-button>
                    <el-button type="primary" @click="confirmEditAddress">确 定</el-button>
                </span>
            </el-dialog>
            <!-- ========================================修改地址======================================== -->
            <!-- ========================================物流信息======================================== -->
            <el-dialog
            title="提示"
            :visible.sync="expressInfoDialogVisible"
            width="50%"
            :before-close="expressInfoDialogClose">
                <el-timeline :reverse="reverse">
                    <el-timeline-item
                    v-for="(info, index) in expressInfo"
                    :key="index"
                    :timestamp="info.time">
                    {{info.context}}
                    </el-timeline-item>
                </el-timeline>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="expressInfoDialogClose">取 消</el-button>
                    <el-button type="primary" @click="confirmExpress">确 定</el-button>
                </span>
            </el-dialog>
            <!-- ========================================物流信息======================================== -->
        </div>
  </div>
</template>

<script>
import cityOptions from '../../assets/js/city_data2017_element.js'
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
      total: 0, // 所有订单的数据
      // 编辑地址相关变量
      editAddressDialogVisible: false, // 编辑地址的dialog是否显示,
      cityOptions,
      addressForm: {
        order_id: 0,
        address1: '',
        address2: ''
      },
      addressRules: {
        address1: [
          { required: true, message: '请输入所在地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入所在地址', trigger: 'blur' }
        ]
      },
      // 快递物流信息相关变量
      expressInfoDialogVisible: false, // 显示快递信息
      reverse: false, // 时间线正序还是倒序，正为false，倒为true
      expressInfo: [] // 快递信息
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
    // 分页相关方法================================================
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
    },
    // 编辑地址窗口================================================
    /**
     * 编辑地址窗口关闭时
     */
    editAddressDialogClose() {
      this.$refs.addressForm.resetFields()
      this.editAddressDialogVisible = false
    },
    /**
     * 获取编辑地址窗口相关信息
     */
    openEditAddress(item) {
      console.log('获取编辑地址')
      // id获取，并赋值
      this.addressForm.order_id = item.order_id
      this.editAddressDialogVisible = true
    },
    /**
     * 确认编辑地址
     */
    async confirmEditAddress() {
      console.log('确认编辑地址')
      const value = await this.$refs.addressForm.validate()
      // this.editAddressDialogVisible = false
      console.log(value)
      if (value) {
        console.log(this.addressForm)
      }
    //   this.editAddressDialogClose()
    },
    changeProvince() {},
    /**
     * 快递信息关闭时
     */
    expressInfoDialogClose() {
      this.expressInfoDialogVisible = false
    },
    /**
     * 打开快递信息窗口
     */
    async openExpress(item) {
      this.expressInfo = []
      const data = await this.$axios.get('/kuaidi/' + item.order_id)
      if (data.data.meta.status === 200) {
        this.expressInfoDialogVisible = true
        this.expressInfo = data.data.data
      }
    },
    confirmExpress() {
      this.expressInfoDialogVisible = false
    }
  }

}
</script>

<style>
.searchOrder{
    width: 300px !important;
}

</style>
