<template>
  <div>
      <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="userContent">
            <el-row>
                <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
            </el-row>
            <el-row>
                <!-- =======步骤条======= -->
                <el-steps :active="active" finish-status="success">
                    <el-step title="基本信息"></el-step>
                    <el-step title="商品参数"></el-step>
                    <el-step title="商品属性"></el-step>
                    <el-step title="商品图片"></el-step>
                    <el-step title="商品内容"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
                <!-- =======步骤条======= -->
            </el-row>
            <el-row>
                <!-- ======tab栏====== -->
                <el-form :model="goodInfo" :rules="goodRules" ref="goodInfoRuleForm" label-width="100px" class="demo-ruleForm">
                    <el-tabs :tab-position="tabPosition" v-model="tabsValue" @tab-click="tabsClick">
                            <el-tab-pane label="基本信息">
                                <!-- -------基本信息------- -->
                                    <el-form-item label="商品名称" prop="goods_name">
                                        <el-input v-model="goodInfo.goods_name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品价格" prop="goods_price">
                                        <el-input v-model.number="goodInfo.goods_price"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品重量" prop="goods_weight">
                                        <el-input v-model.number="goodInfo.goods_weight"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品数量" prop="goods_number">
                                        <el-input v-model.number="goodInfo.goods_number"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品分类" prop="goods_cat">
                                        <!-- 商品分类 -->
                                            <el-cascader
                                            :options="catForm"
                                            :props="cascaderCfg"
                                            clearable
                                            @change="changeGoodCat"
                                            v-model="goodInfo.goods_cat">
                                            </el-cascader>
                                        <!-- 商品分类 -->
                                    </el-form-item>
                                <!-- -------基本信息------- -->
                                <el-button type="primary" @click="nextStep">下一步</el-button>
                            </el-tab-pane>
                            <el-tab-pane label="商品参数">
                                <el-form-item :label="item.attr_name" v-for="(item) in goodCatMany" :key="item.attr_id">
                                    <el-checkbox-group v-model="item.attr_vals" size="small">
                                        <el-checkbox :label="subItem" border v-for="(subItem,index) in item.attr_checklist" :key="index"></el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-button type="primary" @click="nextStep">下一步</el-button>
                            </el-tab-pane>
                            <el-tab-pane label="商品属性">商品属性</el-tab-pane>
                            <el-tab-pane label="商品图片">
                                <el-upload
                                :action="uploadUrl"
                                list-type="picture-card"
                                :on-success="uploadPicture"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :headers="headersObj">
                                <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </el-tab-pane>
                            <el-tab-pane label="商品内容">商品内容</el-tab-pane>
                    </el-tabs>
                </el-form>
                <!-- ======tab栏====== -->
            </el-row>
        </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条相关变量---------------------------
      active: 0, // 设置当前激活步骤
      tabPosition: 'left', // 左边tab栏
      tabsValue: '', // tabs栏的值
      // 添加商品相关变量---------------------------
      goodInfo: {
        goods_name: '荣耀',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: []
      },
      goodRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字值' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { type: 'number', message: '重量必须为数字值' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字值' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 获取分类变量
      catForm: [], // 存储从服务器获取到的分类列表
      cascaderCfg: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      goodCatId: '', // 储存选中类型的id
      goodInfoCatLength: 0, // 数组长度
      // 添加商品相关变量---------------------------
      // 获取参数、属性-------------
      goodCatMany: [],
      goodCatOnly: [],
      // 添加图片上传地址
      uploadUrl: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      // 添加图片相关属性
      dialogVisible: false,
      dialogImageUrl: '',
      // 由于element-ui的upload使用的不是我们的axios发起的请求，所以不带token，导致上传失败
      // 所以我们用element-ui的属性header传入
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    /**
     * 校验表格是否完成填写
     */
    // beforeLeave(activeName, oldActiveName) {
    //   if (oldActiveName === '0' && this.goodInfoCatLength !== 3) {
    //     this.$message.error('请填写完整！')
    //     return false
    //   }
    // },
    /**
     * 获取分类列表
     */
    getCatList() {
      this.$axios.get('categories').then(res => {
        if (res.data.meta.status === 200) {
          this.catForm = res.data.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /**
     * 下一步按钮
     */
    nextStep() {
      console.log(this.active)
      if (this.active === 0) {
        // 设置
        this.$refs.goodInfoRuleForm.validate(valid => {
          if (valid) {
            this.active = 1
            // this.tabsClick()
          } else {
            this.$message.warning('表格填写错误')
          }
        })
      } else if (this.active === 1) {
        // 在动态属性界面
        this.active = 2
      } else if (this.active === 3) {
        // 在图片界面
      }
      this.tabsValue = this.active.toString()
      this.tabsClick()
    },
    /**
     * 点击获取数据，驱动获取数据
     */
    tabsClick() {
      console.log(this.tabsValue)
      if (this.tabsValue === '1') {
        console.log('商品参数')
        this.getGoodAttr('many')
      } else if (this.tabsValue === '2') {
        console.log('商品属性')
        this.getGoodAttr('only')
      } else if (this.tabsValue === '3') {
        console.log('商品图片')
      } else if (this.tabsValue === '4') {
        console.log('商品内容')
      }
    },
    /**
     * 改变商品总类时，校验是否值为3个
     */
    changeGoodCat() {
      if (this.goodInfo.goods_cat.length === 3) {
        this.goodCatId = this.goodInfo.goods_cat[2]
        this.goodInfoCatLength = this.goodInfo.goods_cat.length // 将数组长度存储
        this.goodInfo.goods_cat = this.goodInfo.goods_cat.join(',')
        return this.goodInfo.goods_cat
      } else {
        this.$message.warning('只能选择三级商品分类！')
        this.goodInfo.goods_cat = []
      }
    },
    /**
     * 获取商品的动态｜静态属性
     */
    getGoodAttr(catSel) {
      if (catSel === 'only' || catSel === 'many') {
        this.$axios.get(`categories/${this.goodCatId}/attributes`, { params: { sel: catSel } }).then(res => {
          if (res.data.meta.status === 200) {
            res.data.data.forEach(item => {
              item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
            //   console.log(item)
            })
            if (catSel === 'many') {
              this.goodCatMany = res.data.data
              // console.log(typeof (this.goodCatMany)) // object
              this.goodCatMany.forEach(item => {
                item.attr_checklist = item.attr_vals
              })
            } else if (catSel === 'only') {
              this.goodCatOnly = res.data.data
              console.log(this.goodCatOnly)
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    /**
     * 图片预览
     */
    handlePictureCardPreview() {
      this.dialogVisible = true
    },
    uploadPicture(res) {
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
        this.dialogImageUrl = res.data.url
        // pics是个数组，数组中接收的是对象。
        // 1、先拼凑出对象，然后push进pics
        const picInfo = { pic: res.data.tmp_path }
        this.goodInfo.pics.push(picInfo)
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    /**
     * 关闭remove
     */
    handleRemove(file) {
      /**
       * 1、获取将要删除的图片的临时路径。
       * 2、从pics中找到索引，然后splice方法删除
       */
      // console.log(file)
      // console.log(file.response.data.tmp_path)
      const fileTmpPath = file.response.data.tmp_path
      // 使用findindex的回调函数属性，获取每一个pics中的
      const index = this.goodInfo.pics.findIndex(item => item.pic === fileTmpPath)
      // console.log(index)
      this.goodInfo.pics.splice(index, 1)
    //   console.log(this.goodInfo.pics)
    }
  }

}
</script>

<style>
.el-steps{
    padding: 0 70px;
}
.el-steps,
.el-tabs{
    margin-top: 15px;
}
.hotpink{
    background-color: hotpink;
}

</style>
