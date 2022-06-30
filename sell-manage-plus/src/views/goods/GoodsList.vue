<template>
  <div>
    <h3>商品列表</h3>
    <div v-for="item in tableData" :key="item.id">
      <img :src="API + item.imgUrl" alt="" />
    </div>
  </div>
</template>

<script>
//
import { getGoodsList } from "@/api/goods";
export default {
  data() {
    return {
      //主机地址
      API: 'http://localhost:5000',
      //表格数据
      tableData: [],
      //当前页
      currentPage: 1,
      //每页几条
      pageSize: 20,
      //总条数
      total: 0,
    }
  },
  methods: {
    //获取数据
    async getData() {
      let res = await getGoodsList({ currentPage: this.currentPage, pageSize: this.pageSize });
      let { data, total } = res.data;
      this.tableData = data;
      this.total = total
    }
  },
  created() {
    //初始化发生请求
    this.getData();
  },
}
</script>

<style lang="scss" scoped>
</style>