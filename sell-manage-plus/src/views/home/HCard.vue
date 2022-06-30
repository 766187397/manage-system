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