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
    // console.log(`this.menus`, this.menus)
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