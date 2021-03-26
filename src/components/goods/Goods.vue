<template>
  <div>
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="userContent">
            <el-row>
                <!-- ====================搜索框==================== -->
                    <el-input class="searchGood" placeholder="请输入内容" v-model="searchGoodValue" @change="searchGoods">
                        <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
                    </el-input>
                    <el-button type="primary" @click="addGood">添加商品</el-button>
                <!-- ====================搜索框==================== -->
            </el-row>
            <el-row>
                <el-table :data="goodsForm" border style="width: 100%">
                        <el-table-column
                        type="index"
                        width="50">
                        </el-table-column>
                    <el-table-column prop="goodsForm.goods_name" label="商品名称" width="500"></el-table-column>
                    <el-table-column prop="goodsForm.goods_price" label="商品价格"></el-table-column>
                    <el-table-column prop="goodsForm.goods_weight" label="商品重量"></el-table-column>
                    <el-table-column prop="goodsForm.add_time" label="创建时间"></el-table-column>
                    <el-table-column label="操作"></el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <!-- ------分页功能------ -->
                <el-pagination
                @size-change="goodsSizeChange"
                @current-change="goodsCurrentChange"
                :current-page="goodsConfig.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="goodsConfig.pagesize"
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
      // 搜索相关变量=============
      searchGoodValue: '', // 搜索栏中输入的内容
      // 商品表格相关变量=============
      goodsForm: [],
      goodsConfig: { // 商品请求获取时的参数
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0

    }
  },
  created() {
    this.getGoodsInfo()
  },
  methods: {
    // =============================================获取列表功能点
    /**
    * 获取所有数据列表
    */
    getGoodsInfo() {
      this.$axios.get('goods', { params: this.goodsConfig }).then(res => {
        if (res.data.meta.status === 200) {
          console.log(res.data.data)
          this.goodsForm = res.data.data.goods
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // =============================================分页相关功能点
    /**
     * 分页页码改变
     */
    goodsSizeChange(val) {
      this.goodsConfig.pagenum = val
    },
    /**
     * 分页数字改变
     */
    goodsCurrentChange(val) {
      this.goodsConfig.pagesize = val
    },
    // =============================================搜索相关功能点
    /**
     * 搜索框功能
     */
    searchGoods() {
      console.log(this.searchGoodValue)
      this.goodsConfig.query = this.searchGoodValue
      this.getGoodsInfo()
    },
    /**
     * 增加商品
     */
    addGood() {
      this.$router.push('/goods/addgood')
    }
  }
}
</script>

<style>
.searchGood {
    width: 300px !important;
    margin-right: 15px;
}
.el-table,
.el-pagination{
    margin-top: 15px;
}

</style>
