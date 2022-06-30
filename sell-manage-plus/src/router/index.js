import Vue from 'vue'
import VueRouter from 'vue-router'
//引入存储工具函数
import local from '@/utils/local'

//阻止原地跳转的错误提示
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err)
}
//引入页面级别组件  首屏只加载必要的两个页面级别组件 登录&框架
import Login from '@/views/login/Login.vue'
import Layout from '@/views/layout/Layout.vue'

Vue.use(VueRouter)


//路由一分为3 【1 静态路由【所有人都可以看】 2动态路由【需要计算权限的】 3错误路由【地址出错进入】】

/* 静态路由 */
const routes = [  //每一个配置对象代表一个一级路由
  /* 登录 */
  {
    path: '/login',
    component: Login
  },
  /* 后台首页 */
  {
    path: '/',
    meta: { path: '/home', title: '后台首页' },
    isMenu: true,
    component: Layout, //首页的父级是框架组件
    redirect: '/home',
    children: [ //二级路由 儿子才是自己的组件
      {
        path: '/home',
        component: () => import('@/views/home/Home.vue') //懒加载 ：输入路由地址之后才加载
      }
    ]
  }
]

/* 动态路由 */
// 没有配置roles 字段的路由 所有角色都可以看； 配置了roles字段的路由，其数组包含的角色才可以看
const dynamicRoutes = [
  /* 订单管理 */
  {
    path: '/order',
    component: Layout,
    isMenu: true,
    meta: { path: '/order', title: '订单管理' },
    children: [
      {
        path: '',
        component: () => import('@/views/order/Order.vue')
      }
    ]
  },
  /* 商品管理 */
  {
    path: '/goods',
    component: Layout,
    isMenu: true,
    redirect: '/goods/goods-list',
    meta: { path: '/goods', title: '商品管理' },
    children: [
      {
        meta: { path: '/goods/goods-list', title: '商品列表' },
        path: '/goods/goods-list', //带【/】地址一定要拼全！！！
        component: () => import('@/views/goods/GoodsList.vue')
      },
      {
        meta: { path: '/goods/goods-add', title: '商品添加', roles: ['super'] },
        path: '/goods/goods-add',
        component: () => import('@/views/goods/GoodsAdd.vue')
      },
      {
        meta: { path: '/goods/goods-cate', title: '商品分类' },
        path: '/goods/goods-cate',
        component: () => import('@/views/goods/GoodsCate.vue')
      },
    ]
  },
  /* 店铺管理 */
  {
    path: '/shop',
    component: Layout,
    isMenu: true,
    meta: { path: '/shop', title: '店铺管理', roles: ['super'] },
    children: [
      {
        path: '',
        component: () => import('@/views/shop/Shop.vue')
      }
    ]
  },
  /* 账号管理 */
  {
    path: '/account',
    component: Layout,
    isMenu: true,
    meta: { path: '/account', title: '账号管理' },
    redirect: '/account/account-list',
    children: [
      {
        meta: { path: '/account/account-list', title: '账号列表', roles: ['super'] },
        path: '/account/account-list',
        component: () => import('@/views/account/AccountList.vue')
      },
      {
        meta: { path: '/account/account-add', title: '账号添加', roles: ['super'] },
        path: '/account/account-add',
        component: () => import('@/views/account/AccountAdd.vue')
      },
      {
        meta: { path: '/account/password-modify', title: '修改密码' },
        path: '/account/password-modify',
        component: () => import('@/views/account/PasswordModify.vue')
      },
      {
        meta: { path: '/account/person', title: '个人中心' },
        path: '/account/person',
        component: () => import('@/views/account/Person.vue')
      }
    ]
  },
  /* 销售统计 */
  {
    path: '/total',
    isMenu: true,
    meta: { path: '/total', title: '销售统计', roles: ['super'] },
    component: Layout,
    redirect: '/total/total-goods',
    children: [
      {
        meta: { path: '/total/total-goods', title: '商品统计' },
        path: '/total/total-goods',
        component: () => import('@/views/total/TotalGoods.vue')
      },
      {
        meta: { path: '/total/total-order', title: '订单统计' },
        path: '/total/total-order',
        component: () => import('@/views/total/TotalOrder.vue')
      },
    ]
  }
]

/* 错误路由 */
const errorRoutes = [
  {
    path: '*',
    redirect: '/error404'
  },
  {
    path: '/error404',
    component: () => import('@/views/error404/Error404.vue')
  }
]

/* 筛选出属于菜单的路由 */
const isMenu = routes => routes.filter(v => v.isMenu)


/* 判断一个路由对象是否有权限 */
const hasPermission = (role, route) => {
  //判断当前路由对象 里面的meta属性里面 有roles属性 且 roles的值不为空数组
  if (route.meta && route.meta.roles && route.meta.roles.length !== 0) {
    //如果配了roles字段 且包含角色 才有权限，否则 没权限
    return route.meta.roles.includes(role)
  } else {
    //如果没有配 roles字段 则所有人都可以看，所以 有权限
    return true
  }
}


/* 计算动态路由函数 */
const calcDynamicRoutes = (role, routes) => {
  //temp 初始化为空数组 后面装上符合条件的路由
  let temp = []

  //filter方法 筛选路由 【有权限 return true 反正return false】
  temp = routes.filter(v => {
    if (hasPermission(role, v)) {
      //如果一级路由有儿子，且儿子不为空 继续递归计算
      if (v.children && v.children.length !== 0) {
        v.children = calcDynamicRoutes(role, v.children)
      }
      return true
    } else {
      return false
    }
  })
  return temp
}

/* 创建路由函数 */
export const createRoutes = () => {
  //获取用户角色
  const role = local.get('role')

  //如果没有获取到用户角色 不执行后面的计算路由方法
  if (!role) return

  // 计算出动态路由 【传入角色 & 动态路由 计算符合条件的动态路由】
  const accessRoutes = calcDynamicRoutes(role, dynamicRoutes);

  //添加路由  把 计算出结果的动态路由 错误路由添加至路由。现在就可以访问了！
  router.addRoutes([...accessRoutes, ...errorRoutes]);

  //把属于菜单的路由 存入本地
  let menus = isMenu([...routes, ...accessRoutes])

  local.set('menus', menus)
}


const router = new VueRouter({
  routes
})


//初始化调用一次 【刷新时候调用一次】
createRoutes()

//路由全局前置守卫 
router.beforeEach((to, from, next) => {

  // 在退出的时候 刷新页面 重新计算路由 解决切换用户的bug
  if (to.path === '/login' && from.path !== '/') {
    window.location.reload()
  }

  //获取token  判断是否登录
  const isLogin = local.get('t_k') ? true : false;
  //判断是否有token 有才放行
  if (isLogin) {
    next()
  } else {
    //如果没有token、 就跳转到登录页面

    //判断是否进入登录页 如果是就放行 如果不是就跳登录页
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
