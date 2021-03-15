<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="userContent">
            <!-- ============================================添加角色============================================ -->
            <el-row>
                <el-button type="primary" @click="rolesDialogVisible = true">添加角色</el-button>
            </el-row>
            <!-- ============================================添加角色============================================ -->
            <!-- ============================================角色表格============================================ -->
            <el-row>
                <template>
                    <el-table :data="rolesList" border style="width: 100%">
                        <!-- ============================展开行============================ -->
                        <el-table-column type="expand">
                            <template v-slot:default="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <!-- ========表中表======== -->
                                      <el-row v-for="item1 in props.row.children" :key="item1.id" class="itemRoles vcenter">
                                        <!-- 第一行 -->
                                        <el-col :span="5">
                                          <el-tag effect="dark" closable @close="deleteItemRoles(props.row, item1.id)">{{ item1.authName }}</el-tag><i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <el-col :span="19">
                                          <el-row v-for="item2 in item1.children" :key="item2.id" class="item2Roles vcenter">
                                            <el-col :span="6">
                                              <el-tag type="success" effect="dark" closable @close="deleteItemRoles(props.row, item2.id)">{{ item2.authName }}</el-tag><i class="el-icon-caret-right"></i>
                                            </el-col>
                                            <el-col :span="18" class="itemRow">
                                                <el-col class="item3Roles">
                                                  <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" effect="dark" closable @close="deleteItemRoles(props.row, item3.id)">{{ item3.authName }}</el-tag>
                                                </el-col>
                                            </el-col>
                                          </el-row>
                                        </el-col>
                                      </el-row>
                                    <!-- ========表中表======== -->
                                </el-form>
                            </template>
                        </el-table-column>
                        <!-- ============================展开行============================ -->
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="roleName" label="角色名称"></el-table-column>
                        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                        <el-table-column label="操作" width="300">
                          <template v-slot:default="props">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="getRolesInfo(props.row)">编辑</el-button>
                            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showRight(props.row)">分配权限</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRoles(props.row)">删除</el-button>
                          </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-row>
            <!-- ============================================角色表格============================================ -->
            <!-- ==========================================添加角色表格=========================================== -->
            <el-dialog
              title="提示"
              :visible.sync="rolesDialogVisible"
              width="50%"
              :before-close="addRolesClose">
              <!-- =========================表格========================= -->
              <el-form ref="addRolesInfoRef" :model="addRolesInfo" label-width="100px" :rules="rules">
                <el-form-item label="添加角色" prop="roleName">
                  <el-input v-model="addRolesInfo.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="addRolesInfo.roleDesc"></el-input>
                </el-form-item>
              </el-form>
              <!-- =========================表格========================= -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="addRolesClose">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
              </span>
            </el-dialog>
            <!-- ==========================================添加角色表格=========================================== -->
            <!-- ==========================================编辑角色表格=========================================== -->
            <el-dialog
              title="提示"
              :visible.sync="editRolesDialogVisible"
              width="50%"
              :before-close="editRolesClose">
              <!-- =========================表格========================= -->
              <el-form ref="editRolesInfoRef" :model="editRolesInfo" label-width="100px" :rules="rules">
                <el-form-item label="添加角色" prop="roleName">
                  <el-input v-model="editRolesInfo.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="editRolesInfo.roleDesc"></el-input>
                </el-form-item>
              </el-form>
              <!-- =========================表格========================= -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesClose">取 消</el-button>
                <el-button type="primary" @click="editRoles()">确 定</el-button>
              </span>
            </el-dialog>
            <!-- ==========================================编辑角色表格=========================================== -->
            <!-- ==========================================修改权限表格=========================================== -->
            <el-dialog
              title="提示"
              :visible.sync="changeRolesDialogVisible"
              width="50%"
              :before-close="changeRolesClose">
              <!-- =========================表格========================= -->
              <el-tree
                :data="changeRolesTree"
                show-checkbox
                ref="changeRolesRef"
                node-key="id"
                :default-checked-keys="defKeys"
                :props="defaultProps"
                default-expand-all>
              </el-tree>
              <!-- =========================表格========================= -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="changeRolesClose">取 消</el-button>
                <el-button type="primary" @click="changeRoles()">确 定</el-button>
              </span>
            </el-dialog>
            <!-- ==========================================修改权限表格=========================================== -->
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rolesList: [],
      // 修改权限时，被点击的那个id
      roleId: '',
      // 添加权限列表
      addRolesInfo: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑权限列表
      editRolesInfo: {
        roleName: '',
        roleDesc: ''
      },
      // 默认tree中默认选中
      defKeys: [],
      // 配置选项，label指定节点标签为节点对象的某个属性，children指定子树为节点对象的某个属性值
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 所有权限列表tree数据
      changeRolesTree: [],
      // 添加角色规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ]
      },
      // 是否显示添加窗口
      rolesDialogVisible: false,
      // 是否显示编辑按钮
      editRolesDialogVisible: false,
      // 是否显示分配权限列表
      changeRolesDialogVisible: false
    }
  },
  methods: {
    /**
     * 获取权限列表==============================================
     */
    getRoles() {
      this.$axios.get('roles').then(res => {
        if (res.data.meta.status === 200) {
          this.rolesList = res.data.data
          // console.log(res.data.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 添加权限角色==============================================
     */
    addRoles() {
      this.$refs.addRolesInfoRef.validate(val => {
        if (val) {
          this.$axios.post('roles', this.addRolesInfo).then(res => {
            // console.log(res)
            if (res.data.meta.status === 201) {
              this.$message.success(res.data.meta.msg)
              this.rolesDialogVisible = false
              this.getRoles()
            } else {
              this.$message.error(res.data.meta.msg)
            }
            this.$refs.addRolesInfoRef.resetFields()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    /**
     * 关闭添加角色的dialog页面，需要重置表单===================================
     */
    addRolesClose() {
      this.rolesDialogVisible = false
      this.$refs.addRolesInfoRef.resetFields()
    },
    /**
     * 通过id获取角色信息，并打开编辑按钮===================================
     */
    getRolesInfo(item) {
      // console.log(item.id)
      this.$axios.get('roles/' + item.id).then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.editRolesInfo = res.data.data
          this.editRolesDialogVisible = true
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 关闭编辑角色的dialog页面，需要重置表单===================================
     */
    editRolesClose() {
      this.editRolesDialogVisible = false
      this.$refs.editRolesInfoRef.resetFields()
    },
    /**
     * 编辑角色信息===================================
     */
    editRoles() {
      this.$refs.editRolesInfoRef.validate(val => {
        if (val) {
          this.$axios.put('roles/' + this.editRolesInfo.roleId, { roleName: this.editRolesInfo.roleName, roleDesc: this.editRolesInfo.roleDesc }).then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.getRoles()
              this.editRolesDialogVisible = false
            } else {
              this.$message.error(res.data.meta.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    /**
     * 删除角色
     */
    deleteRoles(item) {
      this.$axios.delete('roles/' + item.id).then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.getRoles()
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 传入id进去，返回该角色，第三层的id=======这个地方使用递归会比较方便
     */
    // setDefaultRoles(id) {
    //   for (const key in this.rolesList) {
    //     if (this.rolesList[key].id === id) {
    //       console.log(this.rolesList[key].children)
    //       const idArray = []
    //       for (const i in this.rolesList[key].children) {
    //         // console.log(this.rolesList[key].children[i].id) // 第一层的children
    //         for (const j in this.rolesList[key].children[i].children) {
    //           // console.log(this.rolesList[key].children[i].children[j]) // 第二层的children
    //           for (const n in this.rolesList[key].children[i].children[j].children) {
    //             // console.log(this.rolesList[key].children[i].children[j].children[n].id) // 第三层的children
    //             idArray.push(this.rolesList[key].children[i].children[j].children[n].id)
    //           }
    //         }
    //       }
    //       // console.log(idArray)
    //       return idArray
    //     }
    //   }
    // },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    setDefaultRoles(node, arr) {
      // 如果当前节点不包括children属性，则是三级节点
      if (!node.children) { // 如果该节点没有children属性，则将该节点id值放在arr中。
        return arr.push(node.id)
      }
      // 递归重要代码，如果有children属性，那么就将该node的children做为forEach的对象，
      // 将forEach中每一项（item）做为参数进入一个匿名函数，该函数调用自己，并将item做为node的参数传入。实现递归。
      node.children.forEach(item => {
        this.setDefaultRoles(item, arr)
      })
    },
    /**
     * 展示所有权限tree
     */
    showRight(item) {
      this.roleId = item.id
      this.$axios.get('rights/tree').then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          // 先展示所有权限。
          this.changeRolesTree = res.data.data
          // 再将个人权限选中。
          this.setDefaultRoles(item, this.defKeys)
          // console.log(this.defKeys)
          this.changeRolesDialogVisible = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 改变分配权限
     */
    // TODO:
    changeRoles() {
      const key1 = this.$refs.changeRolesRef.getCheckedKeys()
      const halfKey1 = this.$refs.changeRolesRef.getHalfCheckedKeys()
      // 将两个数组拼接起来，有两种方法，1、MSDN推荐的。key1.push.apply(key1, halfKey1)
      /* 1、MSDN推荐的。key1.push.apply(key1, halfKey1)
      key1.push.apply(key1, halfKey1)
      console.log(key1)
      */
      /**
      * 2、使用ES6语法
      */
      key1.push(...halfKey1)
      this.$axios.post(`roles/${this.roleId}/rights`, { rids: key1.toString() }).then(res => {
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.getRoles()
          this.defKeys = []
          this.changeRolesDialogVisible = false
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 分配权限表格关闭时，重置
     */
    changeRolesClose() {
      this.defKeys = []
      this.changeRolesDialogVisible = false
    },
    /**
     * 删除用户指定权限
     */
    deleteItemRoles(role, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`roles/${role.id}/rights/${rightId}`).then(res => {
          // console.log(res)
          // 此时我们不能刷新页面，这样会导致页面重新渲染。
          role.children = res.data.data
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
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
  },
  created() {
    this.getRoles()
  }
}
</script>

<style scoped>
.itemRoles{
  border: 1px solid #ccc;
  border-bottom: 0;
  /* text-align: center; */
}
.itemRoles:nth-last-child(1){
  border-bottom: 1px solid #ccc;
}
.item2Roles{
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.item2Roles:nth-last-child(1){
  border-bottom: 0;
}
.el-tag{
  margin: 5px;
}
.el-button{
  margin-bottom: 15px;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
