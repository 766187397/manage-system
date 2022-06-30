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
    //渲染图表方法
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
            data: amountData,
            smooth: true,  //丝滑
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(0, 221, 255)'
                },
                {
                  offset: 1,
                  color: 'rgba(77, 119, 255)'
                }
              ])
            },
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