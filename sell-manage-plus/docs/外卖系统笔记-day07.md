# DAY07

## 0 代码思路总结

- 数据先行 请求数据

```js
import { 接口函数 } from '@/api/对应接口模块'
export default {
    #数据占位
    data(){
        return {
            #数据类型 通过接口文档来查 或者请求接口之后定义
            数据占位{
            	对应的数据1:'',
            	对应的数据2:[],
                对应的数据3:{}
        	}
        }
    },
    methods:{
        #初始化请求数据
       asnyc getData(){
            let res = await 接口函数({参数对象});
            #res.data 后台响应的数据
           	console.log(res.data) 
		}
    },
    #生命周期 created初始化调用一次 
    created(){
        #获取数据
        this.getData()
    }
}

#其他业务逻辑 根据实际业务写

#在图片上传中 
1. 后端返回的图 如果地址不全 需要 手动拼全 【服务器地址+相对路径+图片名称】

#图片上传分两步 
1. 图片上传到服务器 得到响应的图片地址
2. 把需要格式的图片 发给数据库存起来
```



## 1 今日目标

- 首页
  - 卡片组件封装（插槽）
  - echarts
- 销售统计
  - echarts
- 权限
- 打包上线

## 2 卡片组件封装

- 子组件 HCard.vue

```js
<template>
  <div class="h-card">
    <!-- 图片 -->
    <slot name="img"><img src="../../assets/imgs/t1.png" alt="" /></slot>
    <slot>
      <div class="info">
        <div class="title">总订单</div>
        <div class="num">5445141</div>
      </div>
    </slot>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.h-card {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: space-between;
  img {
    width: 50px;
    margin-left: 10%;
  }
  .info {
    margin-right: 10%;
    text-align: center;
  }
  .title {
    color: #aaa;
    font-size: 14px;
  }
  .num {
    margin-top: 2px;
    font-size: 12px;
  }
}
</style>
```

- 父组件 Home.vue

```js
<template>
  <div class="home">
    <!-- 首页卡片 -->
    <div class="card-box">
      <h-card v-for="item in cardData" :key="item.title" class="h-card">
        <img slot="img" :src="item.imgUrl" alt="" />
        <div class="info">
          <div class="title">{{ item.title }}</div>
          <div class="num">{{ item.num | numFormat }}</div>
        </div>
      </h-card>
    </div>
  </div>
</template>

<script>
import HCard from './HCard.vue'
export default {
  components: {
    HCard,
  },
  data() {
    return {
      cardData: [
        {
          imgUrl: require('../../assets/imgs/logo.gif'),
          title: '总订单',
          num: 46513641
        },
        {
          imgUrl: require('../../assets/imgs/logo.gif'),
          title: '总销售额',
          num: 121231
        },
        {
          imgUrl: require('../../assets/imgs/logo.gif'),
          title: '今日订单数',
          num: 46513641
        },
        {
          imgUrl: require('../../assets/imgs/logo.gif'),
          title: '今日销售额',
          num: 123123
        },
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.card-box {
  display: flex;
  justify-content: space-between;
  .h-card {
    width: 24%;
    background-color: #fff;
  }
}
</style>
```



## 3 echarts

### 3.1 安装

```js
#npm
npm install echarts --save

#yarn
yarn add echarts 
```



### 3.2 引入

```js
//引入echarts
import * as echarts from 'echarts';
```



### 3.3 使用

```js
#1 找到一个容器 设置高度

#2 初始化这个容器
let myChart =  echarts.init(容器dom);

#3 写入配置项
myChart.setOption({配置项})

#配置项 在文档里面配置项手册里面查
```



### 3.4 首页charts

- Home.vue

```js
<template>
  <div class="home">
    <!-- 首页卡片 -->
    <div class="card-box">
      <h-card v-for="item in cardData" :key="item.title" class="h-card">
        <img slot="img" :src="item.imgUrl" alt="" />
        <div class="info">
          <div class="title">{{ item.title }}</div>
          <div class="num">{{ item.num | numFormat }}</div>
        </div>
      </h-card>
    </div>

    <!-- 数据统计图标 -->
    <div class="myChart" ref="myChart"></div>
  </div>
</template>

<script>
import HCard from './HCard.vue'
import { getTotalData } from "@/api/order";
//引入echarts
import * as echarts from 'echarts';
export default {
  components: {
    HCard,
  },
  data() {
    return {
      cardData: [
        {
          imgUrl: require('../../assets/imgs/logo.gif'),
          title: '总订单',
          num: 46513641
        },
        {
          imgUrl: require('../../assets/imgs/logo.gif'),
          title: '总销售额',
          num: 121231
        },
        {
          imgUrl: require('../../assets/imgs/logo.gif'),
          title: '今日订单数',
          num: 46513641
        },
        {
          imgUrl: require('../../assets/imgs/logo.gif'),
          title: '今日销售额',
          num: 123123
        },
      ]
    }
  },
  methods: {
    async getData() {
      //1 获取数据
      let res = await getTotalData();
      //解构数据
      let { amountData, orderData, xData } = res.data;
      //2 传入数据 渲染图表
      this.renderChart(xData, amountData, orderData)
    },
    //渲染图片方法
    renderChart(xData, amountData, orderData) {
      //初始化盒子 创建一个echarts的实例对象
      this.myChart = echarts.init(this.$refs.myChart);
      //配置项
      let option = {
        //标题组件
        title: {
          text: '数据统计',
          left: 15,
          top: 15,
          //标题样式
          textStyle: {
            color: '#333'
          }
        },
        //提示框组件。
        tooltip: {
          trigger: 'axis',
          axisPointer: { //指示器类型
            type: 'cross'
          }
        },
        //图例组件。
        legend: {
          top: 15,
          //data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        //直角坐标系
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        //工具栏
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        //x轴
        xAxis: {
          type: 'category',
          boundaryGap: false,// 留白策略
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        //核心数据
        series: [
          {
            name: '金额数据',
            type: 'line',
            // stack: 'Total', //数据堆叠
            data: amountData
          },
          {
            name: '订单数据',
            type: 'line',
            // stack: 'Total',
            data: orderData
          },

        ]
      };
      //写入配置项
      this.myChart.setOption(option)
      //3 动态改变窗口 渲染图表 !!!注意同步异步
      window.addEventListener('resize', this.myChart.resize)
    }
  },
  //mounted 生命周期 渲染图表
  mounted() {
    this.getData();
  },
  //4 销毁resize
  beforeDestroy() {
    window.removeEventListener('resize', this.myChart.resize)
  }

}
</script>

<style lang="scss" scoped>
.card-box {
  display: flex;
  justify-content: space-between;
  .h-card {
    width: 24%;
    background-color: #fff;
  }
}
.myChart {
  margin-top: 50px;
  height: 350px;
  background-color: #fff;
}
</style>
```



### 3.5 订单echarts

- TotalOrder.vue

```js
<template>
  <div class="total-goods">
    <!-- 日期查询 -->
    <div class="search-box">
      <el-date-picker
        v-model="date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        size="small"
      >
      </el-date-picker>
      <!-- 操作 -->
      <el-button @click="search" size="small" class="btn" type="primary"
        >查询</el-button
      >
    </div>
    <!-- 数据统计图标 -->
    <div class="myChart" ref="myChart"></div>
  </div>
</template>

<script>
import { getOrderTotal } from "@/api/order";
//引入工具函数处理时间
import { normalizeYmdHms } from '@/utils/tool'
//引入echarts
import * as echarts from 'echarts';
export default {
  data() {
    return {
      date: [], //查询时间
    }
  },
  methods: {
    async getData() {
      //处理数据格式
      let date = JSON.stringify(this.date)
      let res = await getOrderTotal({ date });
      let { data } = res.data;
      //提取数据 组装成数组
      let orderAmount = data.map(v => v.orderAmount); //提取y轴数据
      let orderTime = data.map(v => normalizeYmdHms(v.orderTime)); //提取x轴数据
      //插入数据 渲染图表 
      this.renderChart(orderTime, orderAmount)
    },
    //渲染图片方法
    renderChart(xData, amountData) {
      //初始化盒子 创建一个echarts的实例对象
      this.myChart = echarts.init(this.$refs.myChart);
      //配置项
      let option = {
        //标题组件
        title: {
          text: '商品统计',
          left: 15,
          top: 15,
          //标题样式
          textStyle: {
            color: '#333'
          }
        },
        //提示框组件。
        tooltip: {
          trigger: 'axis',
          axisPointer: { //指示器类型
            type: 'cross'
          }
        },
        //图例组件。
        legend: {
          top: 15,
          //data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        //直角坐标系
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        //工具栏
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        //x轴
        xAxis: {
          type: 'category',
          boundaryGap: false,// 留白策略
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        //核心数据
        series: [
          {
            name: '商品统计',
            type: 'line',
            // stack: 'Total', //数据堆叠
            data: amountData
          },
        ]
      };
      //写入配置项
      this.myChart.setOption(option)
      //3 动态改变窗口 渲染图表 !!!注意同步异步
      window.addEventListener('resize', this.myChart.resize)
    },
    //查询
    search() {
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.myChart.resize)
  }
}
</script>

<style lang="scss" scoped>
.total-goods {
  .search-box {
    display: flex;
    align-items: center;
  }
  .btn {
    margin-left: 20px;
  }
}
.myChart {
  margin-top: 50px;
  height: 350px;
  background-color: #fff;
}
</style>
```



## 4.权限【理解】

权限划分：前端权限【非必做】和后端权限【必做】 ，不同角色对应不同的权限。

- 后端权限： 通过接口实现，什么人能调什么接口
- 前端权限： 不同角色展示不同页面， 显示不同按钮。【当前项目 --前端权限】

### 4.1 登录成功，后端返回用户角色

- Login.vue

```js
 //把角色存入本地
 local.set('role', role);
```

### 4.2 角色权限划分

- 超级管理员 【super】 【所有页面都可以看】
- 普通管理员  【normal】
  - 后台首页
  - 订单管理
  - 商品管理
    - 商品列表 
    - 商品分类
  - 账号管理
    - 修改密码
    - 个人中心

### 4.3 配置路由

#### 4.3.1 路由一分为三

```js
#路由一分为3 【1 静态路由【所有人都可以看】 2动态路由【需要计算权限的】 3错误路由【地址出错进入】】

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
#没有配置roles 字段的路由 所有角色都可以看； 配置了roles字段的路由，其数组包含的角色才可以看
const dynamicRoutes = [
  /* 订单管理 */
  {
    path: '/order',
    component: Layout,
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

```



### 4.4 写3个函数【创建路由，计算动态路由，单个路由是否有权限】，得到权限路由

#### 4.4.1 写在 router/indexjs中

```js
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

  //获取token 
  const token = local.get('t_k');
  //判断是否有token 有才放行
  if (token) {
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
```



#### 4.4.2 调用两次 【计算路由】

- router/index.js 调用一次  刷新调用&初始化调用
- Login.vue 登录成功调用一次

### 4.5 计算菜单 

- LeftMenu.vue

```js
<template>
  <div class="left-menu">
    <!-- logo -->
    <div class="logo">
      <img width="50" src="../../assets/imgs/logo.png" alt="" />
      外卖商家中心
    </div>
    <!-- text-color文字颜色 -->
    <!-- background-color背景色 -->
    <!-- default-active默认激活菜单 -->
    <!-- unique-opened 是否只保持一个子菜单的展开 -->
    <!-- router 以 index 作为 path 进行路由跳转 -->
    <el-menu
      text-color="#eeeeee"
      background-color="#304156"
      :default-active="$route.path"
      unique-opened
      router
      class="menu"
    >
      <template v-for="item in menus">
        <!-- 没儿子的菜单 -->
        <el-menu-item
          :index="item.meta.path"
          v-if="item.children.length === 1"
          :key="item.meta.path"
        >
          <i class="iconfont icon-home"></i>
          <span slot="title">{{ item.meta.title }}</span>
        </el-menu-item>
        <!-- 有儿子的菜单 -->
        <el-submenu :index="item.meta.path" v-else :key="item.meta.title">
          <template slot="title">
            <i class="iconfont icon-total"></i>
            <span>{{ item.meta.title }}</span>
          </template>
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.meta.path"
            :index="subItem.meta.path"
            >{{ subItem.meta.title }}</el-menu-item
          >
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data() {
    return {
      menus: [] //菜单
    }
  },
  created() {
    //初始化获取本地菜单 赋值
    this.menus = local.get('menus');
    console.log(`this.menus`, this.menus)
  }
}
</script>

<style lang="scss" scoped>
.left-menu {
  background-color: $bg;
}
.el-menu {
  border-right: none;
}
.menu {
  width: 200px;
}
.logo {
  display: flex;
  height: 60px;
  padding-left: 10px;
  align-items: center;
  color: white;
  font-weight: 500;
  img {
    margin-right: 5px;
  }
}
.iconfont {
  margin-right: 5px;
}
// ::v-deep 可以穿透子组件的scoped属性 这是scss写法. less 是/deep/
.el-submenu {
  ::v-deep .el-menu--inline {
    .el-menu-item {
      background: darken($bg, 5%) !important;
      &:hover {
        background: darken($bg, 10%) !important;
      }
    }
  }
}
</style>
```



### 4.6 解决切换账号bug

- router/index.js

```js
//路由全局前置守卫 
router.beforeEach((to, from, next) => {

  # 在退出的时候 刷新页面 重新计算路由 解决切换用户的bug
  if (to.path === '/login' && from.path !== '/') {
    window.location.reload()
  }

  //获取token 
  const token = local.get('t_k');
  //判断是否有token 有才放行
  if (token) {
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

```



### 4.7 动态渲染菜单 【同左侧菜单渲染】

## 5 打包上线

```js
# yarn 
yarn build

#npm 
npm run build
```



- vue.config.js

```js
//分析js插件
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  productionSourceMap: false, //去掉打包的时候生成的map文件
  assetsDir: 'static', //静态资源目录名称
  publicPath: './', //打包后的位置(如果不设置这个静态资源会报404)
  configureWebpack: config => {
    return {
      // plugins:[
      //     new BundleAnalyzerPlugin()
      // ],
      //配置index.html外部全局变量 引入js
      // externals: {
      //   "echarts": "echarts",
      //   'element-ui': 'ELEMENT', //'后面ELEMENT是全局变量 被引进webpack'
      //   'vue': 'Vue',
      //   'vue-router': 'VueRouter',
      // },
      devServer: {
        port: config.port || 8080,
        open: true, //是否热启动
        // proxy: {
        //   '/api': { //相当把 http://localhost:3000/api/xxxxx 变成http://localhost:888/api/xxxxx
        //     target: 'http://localhost:888', //把/api前面的替换为当前地址
        //     ws: true,
        //     changOrigin: true, //是否跨域
        //     pathRewrite: {
        //       '^/api': '/' //最后把/api重新为/
        //     }
        //   },
        // }
      },
    }
  },

  css: { //css处理器
    loaderOptions: {
      sass: {
        //prependData: `@import "~@/assets/scss/_setting.scss";`, 前面加不加~都行 也可以混合
        prependData: `@import "@/assets/scss/_setting.scss";@import "~@/assets/scss/_mixin.scss";`,
      },
    },
  },

}
```



​	
