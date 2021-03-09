<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <!-- 头像区 -->
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区 -->              <!-- 这里的:model就是父传子的model，将父组件的form传递给子组件 -->
            <el-form ref="loginFormRef" label-width="0" class="login_form" :model="loginForm" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名" prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" show-password></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登陆</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [ // 注意，⚠️这里的rules命名需要于return中的变量一致，才能进行判断。
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '输入 6 到 15 位密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      // console.log(this.loginForm.username, this.loginForm.password)
      this.$refs.loginFormRef.validate((valid) => {
        // console.log(valid)
        if (valid) {
          // console.log('发起网络请求')
          this.$axios.post('login', this.loginForm).then((res) => {
            // console.log(res.data.meta)
            if (res.data.meta.status !== 200) {
              // console.log('登陆失败')
              this.$message({
                message: '登陆失败,' + res.data.meta.msg,
                type: 'warning'
              })
            } else {
              // console.log('登陆成功')
              this.$message({
                message: '恭喜你，登陆成功',
                type: 'success'
              })
              // console.log(res.data.data.token)
              window.sessionStorage.setItem('token', res.data.data.token)
              this.$router.push('/home')
            }
          }, (err) => {
            console.log('请求失败:' + err)
          })
        }
      })
    },
    resetForm () {
      // 这个方法是element-ui中resetFields方法，对整个表单进行重置，将所有字段值重置为初始值并移除整个校验结果。
      // 为什么不直接this.属性=''？？因为如果表单数据很多，那么一个一个等于空就很麻烦。所以用element-ui提供的方法。
      // console.log(this.$refs.loginFormRef)
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    /* margin: 100px auto; */
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.avatar_box{
    position: absolute;
    background-color: #fff;
    width: 130px;
    height: 130px;
    border:1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    left: 50%;
    transform: translate(-50%,-50%);
}
.avatar_box img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
