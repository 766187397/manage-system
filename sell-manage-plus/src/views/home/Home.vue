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
            smooth: true,  //丝滑
            // stack: 'Total', //数据堆叠
            data: amountData,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgba(1, 191, 236)'
                }
              ])
            },
          },
          {
            name: '订单数据',
            type: 'line',
            smooth: true,
            // stack: 'Total',
            data: orderData,
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