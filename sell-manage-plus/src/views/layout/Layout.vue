<template>
  <div class="layout">
    <!-- 左侧使用菜单组件 -->
    <left-menu class="left-menu"></left-menu>
    <!-- 右侧内容部分 -->
    <div class="right-main">
      <!-- 右侧头部 -->
      <right-header class="right-header"></right-header>
      <div class="content">
        <!-- 二级路由出口 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
//引入组件
import LeftMenu from './LeftMenu.vue'
import RightHeader from './RightHeader.vue'
export default {
  // 注册组件
  components: {
    LeftMenu,
    RightHeader
  },
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100%;
}
.left-menu {
  flex: none;
  width: 200px;
}
.right-main {
  flex: auto;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  .right-header {
    flex: none;
    width: 100%;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 1px 4px #e2e2e2;
  }
  .content {
    flex: auto;
    padding: 10px;
    overflow-y: auto;
  }
}
</style>