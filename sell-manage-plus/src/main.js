import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

//注册全局过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach(v => {
  // 注册
  Vue.filter(v, filters[v])
})

//中央事件总线$bus
Vue.prototype.$bus = new Vue()

//载入字体图标 @代表src工程文件夹目录
import '@/assets/fonts/iconfont.css'

//引入重置样式
import '@/assets/css/reset.css'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
