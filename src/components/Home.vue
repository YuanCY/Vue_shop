<template>
  <div id="homePage">
    <el-container>
      <el-header>
        <span class="title">后台管理系统</span>
        <el-button type="info" round class="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- ==============================================侧边栏start============================================== -->
          <el-row class="tac">
            <el-col :span="12">
              <el-menu unique-opened router>
                <el-submenu :index="item.path.toString()" v-for="item in asideList" :key="item.id">
                  <template slot="title">
                    <i :class="asideListIcon[item.id]"></i>
                    <span>{{ item.authName }}</span>
                  </template>
                    <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                      <i class="el-icon-menu"></i>
                      {{ subItem.authName }}
                    </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
          <!-- ==============================================侧边栏end============================================== -->
        </el-aside>
        <el-main>
          <!-- ==============================================main start============================================== -->
          <router-view></router-view>
          <!-- ==============================================main end================================================ -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asideList: [],
      asideListIcon: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-lock_fill',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  created() {
    // 在数据被创建时，获取左边aside的列表
    this.getAsideList()
  },
  methods: {
    /**
     * 退出登陆============================================================
     */
    exitLogin() {
      window.sessionStorage.clear() // 清除sessionStorage里面的token
      this.$router.push('/login') // 将路由推送至登陆界面
    },
    /**
     * 获取列表list  menus=================================================
     */
    getAsideList() {
      this.$axios.get('menus').then(res => {
        if (res.data.meta.status === 200) {
          this.asideList = res.data.data
          // console.log(this.asideList)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
#homePage{
  height: 100%;
}
.el-header{
  position: relative;
  line-height: 60px;
  background-color: #c4e5d7;
}
.el-aside{
  background-color: #ffffff;
}
.el-main{
  background-color: #e0f1ea;
}
.logout{
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}
.el-row,
.el-col,
.el-menu{
  width: 100%;
}
.el-submenu i{
  margin-right: 5px;
}
</style>
