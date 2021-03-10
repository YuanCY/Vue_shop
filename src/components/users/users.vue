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
                <el-button type="primary">新增用户</el-button>
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
                    <el-table-column label="操作" width="180px"></el-table-column>
                </el-table>
                </template>
            </el-row>
            <!-- ==========================================用户栏=========================================== -->
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 用于存放从后端获取的用户list
      usersList: [],
      // 用于向后台搜索用户列表时传递的参数
      getUsersConfig: {
        query: '', // 查询参数，可以为空
        pagenum: 1, // 当前页码，不能为空
        pagesize: 5 // 每页显示条数，不能为空
      },
      // users的数量
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    /**
     * 通过后台提供api接口，获取用户列表。
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
     * 用户状态switch开关，点击切换状态功能。
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

</style>
