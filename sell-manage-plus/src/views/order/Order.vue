<template>
  <el-card class="order">
    <div slot="header"><span>订单管理</span></div>
    <div class="content">
      <!-- form -->
      <el-form class="search-form" inline :model="formData" size="mini">
        <!-- 订单号 -->
        <el-form-item label="订单号">
          <el-input type="text" v-model="formData.orderNo"></el-input>
        </el-form-item>
        <!-- 收货人 -->
        <el-form-item label="收货人">
          <el-input type="text" v-model="formData.consignee"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号">
          <el-input type="text" v-model="formData.phone"></el-input>
        </el-form-item>
        <!-- 订单状态 -->
        <el-form-item label="订单状态">
          <el-select v-model="formData.orderState" placeholder="请选择订单状态">
            <el-option label="派送中" value="派送中"></el-option>
            <el-option label="已受理" value="已受理"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <!-- 选择时间 -->
        <!-- format 显示数据格式  -->
        <!-- value-format 获取值的数据格式 -->
        <el-form-item>
          <el-date-picker
            v-model="formData.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 操作 -->
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- table -->
      <el-table
        :data="tableData"
        border
        class="table"
        :style="{ width: w + 'px' }"
      >
        <!-- 订单号 -->
        <el-table-column prop="orderNo" label="订单号"> </el-table-column>
        <!-- 下单时间 -->
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.orderTime | normalizeHms }}
          </template>
        </el-table-column>
        <!-- 手机号 -->
        <el-table-column prop="phone" label="手机号" width="120">
        </el-table-column>
        <!-- 收货人 -->
        <el-table-column prop="consignee" label="收货人"> </el-table-column>
        <!-- 配送地址 -->
        <el-table-column prop="deliverAddress" width="160" label="配送地址">
        </el-table-column>
        <!-- 送达时间 -->
        <el-table-column label="送达时间">
          <template slot-scope="scope">
            {{ scope.row.deliveryTime | normalizeHms }}
          </template>
        </el-table-column>
        <!-- 用户备注 -->
        <el-table-column prop="remarks" width="180" label="用户备注">
        </el-table-column>
        <!-- 订单金额 -->
        <el-table-column prop="orderAmount" label="订单金额"> </el-table-column>
        <!-- 订单状态 -->
        <el-table-column prop="orderState" label="订单状态"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页pagination -->
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
// consignee: "赵子龙"
// deliverAddress: "天府新谷3"
// deliveryTime: "2020-04-23T02:30:00.000Z"
// id: 3
// orderAmount: 100.88
// orderNo: "11015"
// orderState: "派送中"
// orderTime: "2020-04-08T02:30:01.000Z"
// phone: "18181358998"
// remarks: "微辣"

import { getOrderList } from "@/api/order";
export default {
  //数据
  data() {
    return {
      formData: {},//查询表单数据
      tableData: [],
      searchForm: {}, //存储查询的表单
      //当前页
      currentPage: 1,
      //每页几条
      pageSize: 3,
      //总条数
      total: 0,
      //table宽度
      w: 0
    }
  },
  //函数
  methods: {
    async getData(searchForm = {}) {
      //如果有查询数据 把查询数据添加到数据里
      let res = await getOrderList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...searchForm
      });
      //解构数据
      let { total, data } = res.data;
      //赋值
      this.total = total;
      this.tableData = data;
    },
    //当前页改变触发
    handleCurrentChange(val) {
      //当前页 赋值给 currentPage
      this.currentPage = val;

      //分页时 如果searchForm有值 就分页查询列表，如果没值查询所有数据
      this.getData({ ...this.searchForm })
    },
    //查询
    search() {
      //初始化页码为第一页
      this.currentPage = 1;

      //处理格式
      let date = JSON.stringify({ ...this.formData }.date);
      //把formData的数据 拷贝一份 存进查询searchForm里面
      this.searchForm = { ...this.formData, date }
      this.getData({ ...this.searchForm })
    },
    //设置table宽度
    setTableWidth() {
      this.w = document.body.clientWidth - 280;
    }
  },
  created() {
    this.getData()
  },
  //生命周期mounted 操作dom
  mounted() {
    this.setTableWidth();
    window.addEventListener('resize', this.setTableWidth)
  },
  beforeDestroy() {
    //在销毁组件前  把window上挂着的方法也销毁掉
    window.removeEventListener('resize', this.setTableWidth)
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 20px;
}
</style>