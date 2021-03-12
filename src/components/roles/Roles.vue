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
                                      <el-row v-for="item1 in props.row.children" :key="item1.id" class="itemRoles">
                                        <!-- 第一行 -->
                                        <el-col :span="5">
                                          <el-tag effect="dark" closable>{{ item1.authName }}</el-tag><i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <el-col :span="19">
                                          <el-row v-for="item2 in item1.children" :key="item2.id" class="item2Roles">
                                            <el-col :span="6">
                                              <el-tag type="success" effect="dark" closable>{{ item2.authName }}</el-tag><i class="el-icon-caret-right"></i>
                                            </el-col>
                                            <el-col :span="18" class="itemRow">
                                                <el-col class="item3Roles">
                                                  <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" effect="dark" closable>{{ item3.authName }}</el-tag>
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
                            <el-button type="warning" size="mini" icon="el-icon-setting">分配权限</el-button>
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
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rolesList: [],
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
      editRolesDialogVisible: false
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
  text-align: center;
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
</style>
