import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Roles from '../components/roles/Roles.vue'
import Rights from '../components/rights/Rights.vue'
import FormTest from '../components/FormTest'
import Categories from '../components/categories/Categories.vue'

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
      { path: '/test', name: 'test', component: FormTest },
      { path: '/categories', name: 'categories', component: Categories }
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
