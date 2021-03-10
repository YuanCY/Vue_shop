<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="userContent">
            <!-- ====================================搜索栏 + 新增用户按钮==================================== -->
            <el-row>
                <el-input class="searchUser" placeholder="请输入内容">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="primary" @click="addDialogVisible = true">新增用户</el-button>
            </el-row>
            <!-- ====================================搜索栏 + 新增用户按钮==================================== -->
            <!-- ==========================================用户栏=========================================== -->
            <el-row>
                <template>
                <el-table :data="usersList" border style="width: 100%">
                    <el-table-column prop="username" label="用户名"></el-table-column>
                    <el-table-column prop="mobile" label="手机"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="role_name" label="用户角色"></el-table-column>
                    <el-table-column prop="mg_state" label="状态">
                        <template v-slot:default="userData">
                            <el-switch v-model="userData.row.mg_state" @change="changeUserState(userData.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180px">
                        <!-- =====================修改信息 + 删除用户 + 设置权限===================== -->
                        <el-button type="primary" size="mini" class="el-icon-edit"></el-button>
                        <el-button type="warning" size="mini" class="el-icon-setting"></el-button>
                        <el-button type="danger" size="mini" class="el-icon-delete"></el-button>
                        <!-- =====================修改信息 + 删除用户 + 设置权限===================== -->
                    </el-table-column>
                </el-table>
                </template>
            </el-row>
            <!-- ==========================================用户栏=========================================== -->
            <!-- ==========================================分页栏=========================================== -->
            <el-pagination
            @size-change="pageSizeChange"
            @current-change="pageCurrentChange"
            :current-page="getUsersConfig.pagenum"
            :page-sizes="[5, 10]"
            :page-size="getUsersConfig.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
            <!-- ==========================================分页栏=========================================== -->
            <!-- ========================================新增用户窗口======================================== -->
            <el-dialog
            :before-close="addUserDilogClose"
            title="新增用户"
            :visible.sync="addDialogVisible"
            width="50%">
            <!-- ===============新增用户表格=============== -->
            <el-form :model="addUserDetail" :rules="rules" ref="addUserDetail" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserDetail.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserDetail.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserDetail.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserDetail.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- ===============新增用户表格=============== -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUserDilogClose">取 消</el-button>
                <el-button type="primary" @click="addUserInfo">确 定</el-button>
            </span>
            </el-dialog>
            <!-- ========================================新增用户窗口======================================== -->
            <!-- ========================================修改用户窗口======================================== -->
            <!-- ========================================修改用户窗口======================================== -->
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询用户数据组====================================
      // 用于存放从后端获取的用户list
      usersList: [],
      // 用于向后台搜索用户列表时传递的参数
      getUsersConfig: {
        query: '', // 查询参数，可以为空
        pagenum: 1, // 当前页码，不能为空
        pagesize: 5 // 每页显示条数，不能为空
      },
      // users的数量
      total: 0,
      // 新增用户数据组====================================
      // 新增用户窗口是否显示
      addDialogVisible: false,
      // 新增页面数据
      addUserDetail: {
        username: '憨憨',
        password: '123321',
        email: '1233@qq.com',
        mobile: '13333336666'
      },
      // 新增数据校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^1[35789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    /**
     * 通过后台提供api接口，获取用户列表。==================================================
     */
    getUserList() {
      this.$axios.get('users', { params: this.getUsersConfig }).then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.usersList = res.data.data.users
          this.total = res.data.data.total
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /**
     * 用户状态switch开关，点击切换状态功能。================================================
     */
    changeUserState(userData) {
    //   console.log(userData.mg_state)
      this.$axios.put(`users/${userData.id}/state/${userData.mg_state}`).then(res => {
        console.log(res)
        if (res.data.meta.status === 200) { // 若发出axios消息后，返回值为200，则表示设置成功。
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /**
     * 当页面下方页码栏的一页显示数量发生变化时，需要改变getUsersConfig里面的参数，并刷新页码========
     */
    pageSizeChange(val) {
      this.getUsersConfig.pagesize = val
      this.getUserList()
    },
    /**
     * 当页面下方页码栏页数发生改变时，需要改变里面的参数，并刷新页面===============================
     */
    pageCurrentChange(val) {
      this.getUsersConfig.pagenum = val
      this.getUserList()
    },
    /**
     * 增：新增用户=========================================================================
     */
    addUserInfo() {
      this.$refs.addUserDetail.validate(val => {
        // val为true就表示表格的内容是ok的。
        if (val) {
          this.$axios.post('users', this.addUserDetail).then(res => {
            if (res.data.meta.status === 201) {
              this.$message.success(res.data.meta.msg)
              this.getUserList()
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        }
      })
      this.addUserDilogClose() // 关闭窗口，并将窗口内容进行reset
    },
    /**
     * 删：删除用户=========================================================================
     */
    deleteUserInfo() {},
    /**
     * 改：修改用户信息======================================================================
     */
    editUserInfo() {},
    /**
     * 查：查询用户信息======================================================================
     */
    searchUserInfo() {},
    /**
     * 当新建窗口关闭的时候，调用此函数。只有用户手动点击“取消”时，数据被清空
     */
    addUserDilogClose() {
      this.addDialogVisible = false
      this.$refs.addUserDetail.resetFields()
    }
  }
}
</script>

<style scoped>
.el-breadcrumb{
    margin-bottom: 15px;
}
.userContent{
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
}
.searchUser{
    width: 300px;
    margin-right: 20px;
    margin-bottom: 20px;
}
.el-pagination{
    margin-top: 20px;
}
</style>
