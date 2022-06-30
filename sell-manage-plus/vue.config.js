module.exports = {
  productionSourceMap: false, //去掉打包的时候生成的map文件
  assetsDir: 'static', //静态资源目录名称
  publicPath: './', //打包后的位置(如果不设置这个静态资源会报404)
  configureWebpack: config => {
    return {
      devServer: {
        port: 3000, //端口号
        open: true, //是否热启动
        // proxy: {
        //   '/': { //相当把 http://localhost:3000/api/xxxxx 变成http://localhost:5000/api/xxxxx
        //     target: 'http://localhost:5000', //把/api前面的替换为当前地址
        //     ws: true,
        //     changOrigin: true, //是否跨域
        //     pathRewrite: {
        //       '^/': '/' //最后把/api重新为/
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