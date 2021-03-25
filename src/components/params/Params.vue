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
                <el-tabs type="border-card" v-model="activeForm.attr_sel" @tab-click="tabsClick">
                    <el-tab-pane label="动态参数" name="many">
                    <!-- ====================动态参数设置==================== -->
                    <el-button type="primary" size="small" :disabled="btnDisabled" @click="openActiveDialog = true">添加参数</el-button>
                    <!-- ==========表格========== -->
                    <el-table :data="activeAttrForm" border style="width: 100%">
                        <el-table-column type="expand"  v-slot="item">
                            <el-form label-position="left" inline>
                                <el-form-item>
                                    <el-tag
                                    :key="index"
                                    v-for="(tag,index) in item.row.attr_vals"
                                    closable
                                    :disable-transitions="false"
                                    @close="deleteTag(tag, item.row)">
                                    {{tag}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="item.row.inputTagVisible"
                                    v-model="item.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="addTag(item.row)"
                                    @blur="addTag(item.row)"
                                    ></el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(item.row)">+ New Tag</el-button>
                                </el-form-item>
                            </el-form>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作" v-slot="props">
                          <el-button type="primary" size="mini"  icon="el-icon-edit" @click="editOpenDialog(props.row)">修改</el-button>
                          <el-button type="danger" size="mini"  icon="el-icon-delete" @click="deleteAttr(props.row)">删除</el-button>
                        </el-table-column>
                    </el-table>
                    <!-- ==========表格========== -->
                    <!-- ====================动态参数设置==================== -->
                    </el-tab-pane>
                    <el-tab-pane label="静态属性" name="only">
                        <!-- ====================静态属性设置==================== -->
                        <el-button type="primary" size="small" :disabled="btnDisabled" @click="openActiveDialog = true">添加属性</el-button>
                        <!-- ==========表格========== -->
                        <el-table :data="staticAttrForm" border style="width: 100%">
                            <el-table-column type="expand" v-slot="item">
                                <el-form label-position="left" inline>
                                  <!-- ================================== -->
                                  <el-form-item>
                                    <el-tag
                                    :key="index"
                                    v-for="(tag,index) in item.row.attr_vals"
                                    closable
                                    :disable-transitions="false"
                                    @close="deleteTag(tag, item.row)">
                                    {{tag}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="item.row.inputTagVisible"
                                    v-model="item.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="addTag(item.row)"
                                    @blur="addTag(item.row)"
                                    ></el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(item.row)">+ New Tag</el-button>
                                </el-form-item>
                                  <!-- ================================== -->
                                </el-form>
                            </el-table-column>
                            <el-table-column type="index" label="#"></el-table-column>
                            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                            <el-table-column label="操作" v-slot="props">
                              <el-button type="primary" size="mini"  icon="el-icon-edit" @click="editOpenDialog(props.row)">修改</el-button>
                              <el-button type="danger" size="mini"  icon="el-icon-delete" @click="deleteAttr(props.row)">删除</el-button>
                            </el-table-column>
                        </el-table>
                        <!-- ==========表格========== -->
                        <!-- ====================静态属性设置==================== -->
                    </el-tab-pane>
                </el-tabs>
                <!-- ============================添加动态参数dialog============================ -->
                <el-dialog
                  :title="'添加' + titleName()"
                  :visible.sync="openActiveDialog"
                  width="50%"
                  :before-close="closeActiveDialog">
                  <!-- ====== -->
                  <el-form :model="activeForm" :rules="rules" ref="activeRuleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="titleName()" prop="attr_name">
                      <el-input v-model="activeForm.attr_name"></el-input>
                    </el-form-item>
                  </el-form>
                  <!-- ====== -->
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="closeActiveDialog">取 消</el-button>
                    <el-button type="primary" @click="addActiveAttr">确 定</el-button>
                  </span>
                </el-dialog>
                <!-- ============================添加dialog============================ -->
                <!-- ============================编辑dialog============================ -->
                <el-dialog
                  :title="'编辑' + titleName()"
                  :visible.sync="openEditDialog"
                  width="50%"
                  :before-close="closeEditDialog">
                  <!-- ====== -->
                  <el-form :model="editForm" :rules="rules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="titleName()" prop="attr_name">
                      <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                  </el-form>
                  <!-- ====== -->
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="closeEditDialog">取 消</el-button>
                    <el-button type="primary" @click="editAttr">确 定</el-button>
                  </span>
                </el-dialog>
                <!-- ============================编辑dialog============================ -->
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
      cascaderValue: '', // id
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
      staticAttrForm: [],
      // activeName: 'many', // 默认是在动态数据标签
      // 打开添加动态参数窗口
      openActiveDialog: false,
      // 打开修改参数｜属性窗口
      openEditDialog: false,
      // 添加
      activeForm: {
        attr_name: '',
        attr_sel: 'many'
      },
      // 编辑
      editForm: {},
      rules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
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
        this.getGoodInfo(this.cascaderValue, this.activeForm.attr_sel)
      } else {
        this.cascaderValue = ''
        this.cascaderValues = []
        this.$message.error('只允许为三级分类设置参数！')
      }
    },
    /**
     * 通过id获取该商品种类的具体静态/动态数据，基本属性等，放到上方集联选择器中，sel参数传入many动态数据，only静态数据
     */
    getGoodInfo(id, sel) {
      this.$axios.get(`categories/${id}/attributes`, { params: { sel: sel } }).then(res => {
        if (res.data.meta.status === 200) {
          res.data.data.forEach(item => {
            if (item.attr_vals === '') {
              item.attr_vals = []
            } else {
              item.attr_vals = item.attr_vals.split(',')
            }
            item.inputTagVisible = false
            item.inputValue = ''
          })
          if (sel === 'many') {
            this.activeAttrForm = res.data.data // 将返回动态数据储存到动态参数表格中
          } else if (sel === 'only') {
            this.staticAttrForm = res.data.data // 将返回静态数据，储存到动态参数表格中
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 点击tab栏，切换获取数据
     */
    tabsClick(tab) {
      this.getGoodInfo(this.cascaderValue, tab.name)
    },
    /**
     * 添加动态属性
     */
    addActiveAttr() {
      this.$refs.activeRuleForm.validate(valid => {
        if (valid) {
          this.$axios.post(`categories/${this.cascaderValue}/attributes`, this.activeForm).then(res => {
            if (res.data.meta.status === 201) {
              // 上传服务器成功后
              this.closeActiveDialog()
              this.$message.success(res.data.meta.msg)
              this.getGoodId()
            } else {
              this.$message.error(res.data.meta.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
      // this.openActiveDialog = false
    },
    /**
     * 关闭动态参数添加窗口
     */
    closeActiveDialog() {
      this.$refs.activeRuleForm.resetFields()
      this.openActiveDialog = false
    },
    /**
     * 添加静态属性
     */
    // ===========================tag相关===========================
    /**
     * 获取tag，并将tag由字符串转换为数组
     */
    addTag(item) {
      if (item.inputValue) {
        item.attr_vals.push(item.inputValue)
        // 需要将参数传送上去
        this.saveAttr(item)
      }
      item.inputTagVisible = false
      item.inputValue = ''
    },
    /**
     * 储存并发送网络请求
     */
    saveAttr(item) {
      const attrVals = item.attr_vals.join(',')
      this.$axios.put(`categories/${this.cascaderValue}/attributes/${item.attr_id}`, {
        attr_name: item.attr_name,
        attr_sel: item.attr_sel,
        attr_vals: attrVals
      }).then(res => {
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 删除tag
     */
    deleteTag(tag, item) {
      item.attr_vals.splice(item.attr_vals.indexOf(tag), 1)
      this.saveAttr(item)
    },
    /**
     * 使得输入tag变为input框
     */
    showInput(item) {
      item.inputTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // ===========================tag相关===========================
    // ===========================添加参数相关===========================
    /**
     * 通过切换不同tabs面板，显示不同的title名字
     */
    titleName() {
      if (this.activeForm.attr_sel === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
    // ===========================添加参数相关===========================
    // ===========================修改属性===========================
    /**
     * 点击获取属性信息，展示在dialog窗口
     */
    editOpenDialog(item) {
      // console.log(item.attr_id) // attr_id
      // 通过id获取数据。
      this.$axios.get(`categories/${this.cascaderValue}/attributes/${item.attr_id}`, { attr_sel: this.activeForm.attr_sel }).then(res => {
        if (res.data.meta.status === 200) {
          this.editForm = res.data.data
          this.openEditDialog = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 修改属性信息。点击确定
     */
    editAttr() {
      this.$refs.editRuleForm.validate(valid => {
        if (valid) {
          this.$axios.put(`categories/${this.cascaderValue}/attributes/${this.editForm.attr_id}`, this.editForm).then(res => {
            this.closeEditDialog()
            this.$message.success(res.data.meta.msg)
            this.getGoodId()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    /**
     * 关闭编辑dialog
     */
    closeEditDialog() {
      this.$refs.editRuleForm.resetFields()
      this.openEditDialog = false
    },
    // ===========================修改属性===========================
    // ===========================删除属性===========================
    deleteAttr(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`categories/${this.cascaderValue}/attributes/${item.attr_id}`).then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.getGoodId()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
    // ===========================删除属性===========================

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
