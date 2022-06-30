# DAY05

## 0 今日目标

- 判断登录状态

- 响应拦截器统一处理状态码
- 商品模块
  - 商品分类
  - 商品添加

## 1 判断登录状态

### 1.1 路由全局前置守卫

```js
#语法
router.beforeEach((to, from, next)=>{
    #from 从哪儿来
    #to 到哪儿去
    #next 放行 next()
})
```

- router/index.js

```js
#路由全局前置守卫
router.beforeEach((to, from, next) => {
  #获取token 
  const token = window.localStorage.getItem('t_k');
  #判断是否有token 有才放行
  if (token) {
    next()
  } else {
    #如果没有token、 就跳转到登录页面

    #判断是否进入登录页 如果是就放行 如果不是就跳登录页
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
```



## 2 优化代码： 封装操作本地存储的local

- utils/local.js

```js
/**
 * 操作本地存储
 */

const local = {
    set(key, val) {
        window.localStorage.setItem(key, JSON.stringify(val))
    },
    get(key) {
        return JSON.parse(window.localStorage.getItem(key))
    },
    remove(key) {
        window.localStorage.removeItem(key)
    },
    clear() {
        window.localStorage.clear()
    }
}

export default local
```



## 3 响应拦截器，统一处理状态码

- request.js

```js
#单独使用element-ui的信息组件
import { Message } from 'element-ui';

//配置响应拦截器
axios.interceptors.response.use(response => {
    //解构数据 
    let { code, msg } = response.data;
	
    #code的值为0  注意！！！ 在判断中0会隐式转换为false 1会变成true
    
    #配置全局 提示信息 
    if (code === 0) {
        Message({
            type: 'success',
            message: msg
        });
    }
    #如果解构有code 且 code的值为1 或者5001 给错误提示
    if (code && code === 1 || code === 5001) {
        Message.error(msg)
    }
    return response
}, err => {
    #错误信息和正确信息的提示 是产品需求 和 后端沟通的结果！！！ 
    #后台手动把错误信息code 返给前端，让前端进行显示
    let { code, msg } = err.response.data
    if (code === 401) {
        Message.error(msg)
    }

    //后台打酱油 前端直接拿错误信息渲染
    if (!code) {
        Message.error(err.message)
    }

    // if (err.response.status === 404) {
    //     Message.error('404错误！')
    // }
    return Promise.reject(err)
})

```



## 4 商品分类实现

- GoodsCate

```js
<template>
  <div class="goods-cate">
    <el-card>
      <div slot="header"><span>商品分类</span></div>
      <div class="content">
        <!-- 表格 -->
        <el-table class="table" :data="tableData" :style="{ width: w + 'px' }">
          <!-- 序号 -->
          <el-table-column type="index" label="序号"></el-table-column>
          <!-- 分类名称 -->
          <el-table-column label="分类名称">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.cateName }}</span>
              <el-input
                v-else
                type="text"
                size="small"
                v-model="scope.row.cateName"
              ></el-input>
            </template>
          </el-table-column>
          <!-- 是否启用 -->
          <el-table-column label="是否启用">
            <template slot-scope="scope">
              <el-switch
                :disabled="!scope.row.isEdit"
                v-model="scope.row.state"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                size="mini"
                :type="scope.row.isEdit ? 'success' : ''"
                @click="handleEdit(scope.row)"
                >{{ scope.row.isEdit ? "完成" : "编辑" }}</el-button
              >
              <el-popconfirm
                @confirm="handleDelete(scope.row)"
                @cancel="$message({ type: 'info', message: '取消删除' })"
                title="这个分类确定删除吗？"
              >
                <el-button
                  class="btn-delete"
                  type="danger"
                  size="mini"
                  slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination
          :total="total"
          background
          :page-size="pageSize"
          :current-page="currentPage"
          layout="total,prev, pager, next, jumper"
          class="pagination"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCateList, editCate, delCate } from "@/api/goods";
export default {
  //数据先行
  data() {
    return {
      //表格数据
      tableData: [],
      //当前页
      currentPage: 1,
      //每页几条
      pageSize: 4,
      //总页数
      total: 0,
      //table宽度
      w: 0
    }
  },
  //函数
  methods: {
    //获取数据
    async getData() {
      let res = await getCateList({ currentPage: this.currentPage, pageSize: this.pageSize })
      //解构数据
      let { data, total } = res.data;
      //处理数据
      data.forEach(v => {
        //如果state值为1 给他赋值true 反之false
        v.state = v.state === 1 ? true : false
        //新增一个可编辑字段
        v.isEdit = false;
      })

      //赋值
      this.total = total;
      this.tableData = data;

      //如果当前页不等与1 且获取数据为空数组， 就拉取上一页数据 
      if (this.currentPage !== 1 && this.tableData.length === 0) {
        this.currentPage -= 1;
        //重新拉取数据
        this.getData()
      }
    },
    //编辑
    async handleEdit(row) {
      //修改当前行的可编辑状态
      row.isEdit = !row.isEdit

      //只有两种状态 如果不清楚逻辑可以去试
      if (!row.isEdit) {
        //解构需要的数据

        let { id, cateName, state } = row;
        //处理数据格式
        state = state ? 1 : 0
        let res = await editCate({ id, cateName, state });
      }
    },
    //删除
    async handleDelete(row) {
      let { id } = row;
      let res = await delCate({ id });
      let { code } = res.data;
      if (code === 0) {
        //成功之后拉取数据
        this.getData()
      }
    },
    //改变页码触发
    handleCurrentChange(val) {
      //把val赋值给当前页
      this.currentPage = val;
      //重新拉取数据
      this.getData()
    },
    //设置table宽度
    setTableWidth() {
      this.w = document.body.clientWidth - 280;
    }
  },
  //生命周期
  created() {
    this.getData()
  },
  #生命周期mounted 操作dom
  mounted() {
    this.setTableWidth();
    window.addEventListener('resize', this.setTableWidth)
  },
  beforeDestroy() {
    #在销毁组件前  把window上挂着的方法也销毁掉
    window.removeEventListener('resize', this.setTableWidth)
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 20px;
}
.btn-delete {
  margin-left: 10px;
}
</style>
```



## 5 添加商品

## 6 前端跨域配置 【扩展】

- vue.config.js

```js
module.exports = {
  configureWebpack: config => {
    return {
      devServer: {
        port: 3000, //端口号
        open: true, //是否热启动
        proxy: {
          '/api': { //相当把 http://localhost:3000/api/xxxxx 变成http://localhost:5000/api/xxxxx
            target: 'http://localhost:5000', //把/api前面的替换为当前地址
            ws: true,
            changOrigin: true, //是否跨域
            pathRewrite: {
              '^/api': '/' //最后把/api重新为/
            }
          },
        }
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



- request.js 

```js
axios.defaults.baseURL = '/api' //默认服务器地址 
```























