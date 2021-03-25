<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="userContent">
            <!-- ============================================添加商品============================================ -->
            <el-row>
                <el-button type="primary" @click="openAddCat">添加商品</el-button>
            </el-row>
            <!-- ============================================添加商品============================================ -->
            <!-- ============================================商品表格============================================ -->
            <el-row>
                <el-table :data="goodsForm" border style="width: 100%" row-key="cat_id" :default-expand-all="false" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column width="50"></el-table-column>
                    <el-table-column label="分类名称" prop="cat_name"></el-table-column>
                    <el-table-column label="是否有效" v-slot="item">
                        <i :class="item.row.cat_deleted ? 'el-icon-error' : 'el-icon-success'" :style="item.row.cat_deleted ? 'color: #e47470':'color: #6aca51'"></i>
                    </el-table-column>
                    <el-table-column label="排序" v-slot="item">
                        <!-- <el-tag :type="goodLevel[item.row.cat_level].tagType" size="mini" effect="dark">{{ goodLevel[item.row.cat_level].tagName }}</el-tag> -->
                        <el-tag size="mini" effect="dark" v-if="item.row.cat_level === 0">一级</el-tag>
                        <el-tag type="success" size="mini" effect="dark" v-else-if="item.row.cat_level === 1">二级</el-tag>
                        <el-tag type="warning" size="mini" effect="dark" v-else>三级</el-tag>
                    </el-table-column>
                    <el-table-column label="操作" width="180" v-slot="props">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditDialog(props.row)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCat(props.row)">删除</el-button>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="getGoodConfig.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="getGoodConfig.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </el-row>
            <!-- ============================================商品表格============================================ -->
            <!-- ============================================添加商品类别============================================ -->
            <el-dialog
            title="添加商品分类"
            :visible.sync="addCatDialogVisible"
            width="50%"
            :before-close="addCatClose">
            <!-- 添加商品分类表格 -->
            <el-form :model="addCatForm" :rules="rules" ref="addCatFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCatForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader :options="addCatOption" :props="addCatPropsConfig" clearable v-model="addCatForm.cat_pid"></el-cascader>
                </el-form-item>
            </el-form>
            <!-- 添加商品分类表格 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatClose">取 消</el-button>
                <el-button type="primary" @click="addCatSubmit">确 定</el-button>
            </span>
            </el-dialog>
            <!-- ============================================添加商品类别============================================ -->
            <!-- ============================================修改商品类别============================================ -->
            <el-dialog
            title="修改商品分类"
            :visible.sync="editCatDialogVisible"
            width="50%"
            :before-close="editCatClose">
            <!-- 修改商品分类表格 -->
            <el-form :model="editCatForm" :rules="rules" ref="editCatFormRef" label-width="100px">
                <el-form-item label="分类名称">
                    <el-input v-model="editCatForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 修改商品分类表格 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCatClose">取 消</el-button>
                <el-button type="primary" @click="editCatSubmit">确 定</el-button>
            </span>
            </el-dialog>
            <!-- ============================================修改商品类别============================================ -->
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表数据获取的配置表
      getGoodConfig: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 所有商品分类数目
      total: 0,
      // 商品数据表格，给商品表格展示用的。
      goodsForm: [],
      // 商品的排序层级
      goodLevel: {
        0: { tagType: '', tagName: '一级' },
        1: { tagType: 'success', tagName: '二级' },
        2: { tagType: 'warning', tagName: '三级' }
      },
      // 是否显示添加商品类别
      addCatDialogVisible: false,
      // 是否显示修改商品类别列表
      editCatDialogVisible: false,
      // 添加商品分类列表
      addCatForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editCatForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加商品分类的规则
      rules: {
        cat_name: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 储存商品分类数据
      addCatOption: [],
      // 储存商品分类数据
      editCatOption: [],
      // 集联选择器中props配置
      addCatPropsConfig: {
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      editCatPropsConfig: {
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }

    }
  },
  created() {
    this.getGoodForm()
  },
  methods: {
    /**
    * 获取商品表格数据
    */
    getGoodForm() {
      this.$axios.get('categories', { params: this.getGoodConfig }).then(res => {
        if (res.data.meta.status === 200) {
          console.log(res)
          this.goodsForm = res.data.data.result
          this.total = res.data.data.total
        //   console.log(res.data.data)
        //   console.log(this.goodsForm)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // ============================================底部页码栏============================================
    /**
     * 当需要渲染的数量发生变化时，重新获取数据
     */
    handleSizeChange(val) {
      this.getGoodConfig.pagesize = val
      this.getGoodForm()
    },
    /**
     * 当当前页面发生变化时，重新获取数据
     */
    handleCurrentChange(val) {
      this.getGoodConfig.pagenum = val
      this.getGoodForm()
    },
    // ============================================底部页码栏============================================
    // ============================================添加商品分类栏============================================
    /**
     * 关闭添加商品分类关闭窗口
     */
    addCatClose() {
      this.$refs.addCatFormRef.resetFields()
      this.addCatForm = {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      }
      this.addCatDialogVisible = false
    },
    /**
     * 打开添加商品分配窗口
     */
    openAddCat() {
      this.addCatDialogVisible = true
      // 打开窗口后，要获取所有一级二级商品分类，并存储
      this.$axios.get('categories', { params: { type: 2 } }).then(res => {
        if (res.data.meta.status === 200) {
          this.addCatOption = res.data.data
        //   console.log(this.addCatOption)
        //   console.log(this.goodsForm)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 点击确定生成分类
     */
    addCatSubmit() {
      if (this.addCatForm.cat_pid === 0) {
        this.addCatForm.cat_level = 0
      } else {
        const arrLength = this.addCatForm.cat_pid.length
        this.addCatForm.cat_pid = this.addCatForm.cat_pid[arrLength - 1]
        this.addCatForm.cat_level = arrLength
      }
      this.$axios.post('categories', this.addCatForm).then(res => {
        // console.log(res)
        if (res.data.meta.status === 201) {
          this.addCatClose()
          this.$message.success(res.data.meta.msg)
          this.getGoodForm()
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // ============================================添加商品分类栏============================================
    // ============================================修改商品分类栏============================================
    /**
     * 打开编辑按钮，传送id过来，使用api接口查询信息。
     */
    openEditDialog(item) {
      this.$axios.get('categories/' + item.cat_id).then(res => {
        if (res.data.meta.status === 200) {
          this.editCatForm = res.data.data
          this.editCatDialogVisible = true
          // 打开窗口
        //   console.log(this.editCatForm)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 当修改列表关闭时
     */
    editCatClose() {
      this.$refs.editCatFormRef.resetFields()
      this.editCatForm = {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      }
      this.editCatDialogVisible = false
    },
    /**
     * 当修改内容确认提交时
     */
    editCatSubmit() {
      this.$refs.editCatFormRef.validate(val => {
        if (val) {
          this.$axios.put('categories/' + this.editCatForm.cat_id, { cat_name: this.editCatForm.cat_name }).then(res => {
            if (res.data.meta.status === 200) {
              this.editCatClose()
              this.getGoodForm()
              this.$message.success(res.data.meta.msg)
            } else {
              this.$message.error(res.data.meta.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    // ============================================修改商品分类栏============================================
    // ============================================删除商品分类栏============================================
    deleteCat(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('categories/' + item.cat_id).then(res => {
          if (res.data.meta.status === 200) {
            this.getGoodForm()
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
    // ============================================删除商品分类栏============================================

  }
}
</script>

<style scoped>
.el-table{
    margin-top: 15px;
}

</style>
