<template>
  <div class="right-header">
    <!-- 面包屑导航 -->
    <el-row>
      <el-col class="breadcrumb" :span="12" :md="8"
        ><el-breadcrumb>
          <el-breadcrumb-item
            v-for="item in breadList2"
            :key="item.path"
            :to="item.path"
            >{{ item.title }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-col>
      <el-col :span="12" :md="16" class="right">
        <!-- 下拉菜单 -->
        <el-dropdown @command="handleDropDown">
          <span class="el-dropdown-link">
            欢迎你,{{ form.account
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="person">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 头像 -->
        <el-avatar :size="40" :src="form.imgUrl"></el-avatar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user";
//引入存储工具函数
import local from '@/utils/local'
export default {
  //数据
  data() {
    return {
      //面包屑导航数据
      breadList1: [],
      //个人信息
      form: {
        account: "",
        ctime: "",
        id: '',
        imgUrl: "",
        userGroup: "",
      },
    }
  },
  //函数
  methods: {
    //计算面包屑方法
    calcBread() {
      let temp = [{ path: '/', title: '首页' }]
      //便利matched找到meta获取需要的数据
      this.$route.matched.forEach(v => {
        //判断当前路由对象里面是否有meta 且有path title值
        if (v.meta.path && v.meta.title) {
          temp.push(v.meta)
        }
      })
      //计算出来的面包屑导航复制给breadList1
      this.breadList1 = temp
    },
    //获取数据
    async getData() {
      let res = await getUserInfo();
      this.form = res.data;
      //把个人信息储存到本地
      local.set('userInfo', { ...this.form })

    },
    //下拉触发
    handleDropDown(val) {
      if (val === 'person') {
        this.$router.push('/account/person')
      }
      if (val === 'logout') {
        //注销 清理本地数据 跳转到登录页、
        local.clear()
        this.$message({
          type: 'success',
          message: '退出登录'
        })
        this.$router.push('/login')
      }
    }
  },
  //生命周期
  created() {
    //初始化计算一次 方式1
    this.calcBread();
    //初始化获取用户信息
    this.getData();

    //中央事件总线 接受数据
    this.$bus.$on('uploadImg', () => {
      this.getData()
    })
  },
  //侦听器 
  watch: {
    '$route.path'() {
      //改变路由地址时，再计算一次面包屑导航 方式1
      this.calcBread()
    }
  },
  //计算属性 方式2
  computed: {
    breadList2() {
      let temp = [{ path: '/', title: '首页' }]
      //便利matched找到meta获取需要的数据
      this.$route.matched.forEach(v => {
        //判断当前路由对象里面是否有meta 且有path title值
        if (v.meta.path && v.meta.title) {
          temp.push(v.meta)
        }
      })
      return temp
    }
  }
}
</script>

<style lang="scss" scoped>
.right-header {
  width: 100%;

  padding: 0 10px;
}
.el-row {
  height: 100%;
}
.breadcrumb {
  height: 100%;
}
.el-col {
  height: 100%;
  display: flex;
  align-items: center;
}
.right {
  justify-content: flex-end;
}
.el-avatar {
  margin: 0 5px;
}
.el-dropdown-link {
  cursor: pointer;
}
</style>