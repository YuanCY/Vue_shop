<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="userContent">
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon effect="dark"></el-alert>
            <el-row>
                <span>选择商品分类：</span><el-cascader v-model="cascaderValues" :options="goodsForm" :props='cascaderProps' @change="getGoodId"></el-cascader>
            </el-row>
            <el-row>
                <el-tabs type="border-card">
                    <el-tab-pane label="动态参数">
                    <!-- ====================动态参数设置==================== -->
                    <el-button type="primary" size="small" :disabled="btnDisabled">添加参数</el-button>
                    <!-- ==========表格========== -->
                    <el-table :data="activeAttrForm" border style="width: 100%">
                        <el-table-column type="expand" v-slot="props">
                            <el-form label-position="left" inline>
                                <el-form-item>
                                    <el-tag :key="index" v-for="(tag, index) in (props.row.attr_vals.split(','))" v-show="props.row.attr_vals" closable :disable-transitions="false" @close="closeTag(props.row,index)">{{tag}}</el-tag>
                                    <el-input class="input-new-tag" v-if="tagInputVisible" v-model="inputTagValue" ref="saveTagInput" size="small" @keyup.enter.native="(tagInputConfirm(props.row))" @blur="tagInputConfirm(props.row)" ></el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                                </el-form-item>
                            </el-form>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作"></el-table-column>
                    </el-table>
                    <!-- ==========表格========== -->
                    <!-- ====================动态参数设置==================== -->
                    </el-tab-pane>
                    <el-tab-pane label="静态属性">静态属性</el-tab-pane>
                </el-tabs>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表数据获取的配置表
      getGoodConfig: {
        query: ''
      },
      // 获取的商品类别
      goodsForm: [],
      // 选择的商品分类
      cascaderValues: [],
      cascaderValue: '',
      // 商品集联选择器配置表
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 按钮是否启用，true为不能按，false为可以按下
      btnDisabled: true,
      // 动态数据
      activeAttrForm: [],
      // taginput是否显示
      tagInputVisible: false,
      // 输入tag的内容
      inputTagValue: ''
    }
  },
  created() {
    this.getGoodForm()
  },
  methods: {
    /**
     * 获取所有商品分类，储存在goodsForm中
     */
    getGoodForm() {
      this.$axios.get('categories', { params: this.getGoodConfig }).then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.goodsForm = res.data.data
          // console.log(res.data.data)
          // console.log(this.goodsForm)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 获取集联选择器的变化，1、获取最终选择的商品的id。2、校验选择的是第几层选项，如果非第三层则提示用户选择第三级
     */
    getGoodId() {
      // 1、获取最终选择的商品的id
      this.cascaderValue = this.cascaderValues[this.cascaderValues.length - 1]
      // 2、校验选择的是第几层选项，如果非第三层则提示用户选择第三级
      if (this.cascaderValues.length === 3) {
        // 校验通过后
        // console.log(this.cascaderValue) // id
        this.btnDisabled = false // 校验完成后，该按钮应当允许按下
        this.getGoodInfo(this.cascaderValue, 'many')
      } else {
        this.cascaderValue = ''
        this.cascaderValues = []
        this.$message.error('只允许为三级分类设置参数！')
      }
    },
    /**
     * 通过id获取该商品种类的具体静态数据，基本属性等，放到上方集联选择器中
     */
    getGoodInfo(id, sel) {
      this.$axios.get(`categories/${id}/attributes`, { params: { sel: sel } }).then(res => {
        if (res.data.meta.status === 200) {
          console.log(res.data.data)
          this.activeAttrForm = res.data.data // 将返回动态数据储存到动态参数表格中
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 添加动态属性
     */
    /**
     * 添加静态属性
     */
    // ===========================tag相关===========================
    /**
     * 删除tag
     */
    closeTag(item, index) {
      console.log(item.attr_vals)
      const valsArr = item.attr_vals.split(',')
      console.log(valsArr)
      valsArr.splice(index, 1) // 删除了数据的数组
      console.log(valsArr)
      item.attr_vals = valsArr.join(',')
      console.log(item.attr_vals)
      this.$axios.put(`categories/${item.cat_id}/attributes/${item.attr_id}`, item).then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        //   console.log(res.data.data)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 新增tag
     */
    tagInputConfirm(item) {
      const inputTagValue = this.inputTagValue
      if (inputTagValue) {
        if (item.attr_vals === '') {
          item.attr_vals = inputTagValue
        } else {
          item.attr_vals += ',' + inputTagValue
        }
        this.$axios.put(`categories/${item.cat_id}/attributes/${item.attr_id}`, item).then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            // console.log(res.data.data)
          } else {
            this.$message.error(res.data.meta.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
      this.tagInputVisible = false
      this.inputTagValue = ''
    },
    showInput() {
      this.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
        // console.log(this)
      })
    }
    // ===========================tag相关===========================
  }
}
</script>

<style scoped>
.el-table,
.el-row{
    margin-top: 15px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

</style>
