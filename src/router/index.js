import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Roles from '../components/roles/Roles.vue'
import Rights from '../components/rights/Rights.vue'
import Categories from '../components/categories/Categories.vue'
import Params from '../components/params/Params.vue'
import Goods from '../components/goods/Goods.vue'
import AddGood from '../components/goods/AddGood.vue'
import Orders from '../components/orders/Orders.vue'
import Reports from '../components/reports/Reports.vue'
import Test from '../components/test/Test.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login' // redirect重新定向
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    redirect: '/welcome',
    name: 'home',
    component: Home,
    children: [
      { path: '/welcome', name: 'welcome', component: Welcome },
      { path: '/users', name: 'users', component: Users },
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/categories', name: 'categories', component: Categories },
      { path: '/params', name: 'params', component: Params },
      { path: '/goods', name: 'goods', component: Goods },
      { path: '/goods/addgood', name: 'addgood', component: AddGood },
      { path: '/test', name: 'test', component: Test },
      { path: '/orders', name: 'orders', component: Orders },
      { path: '/reports', name: 'reports', component: Reports }
    ]
  }

]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next 是一个函数，表示方行 next()放行，或者next('/login')
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    next('/login')
  } else {
    next()
  }
})

export default router
