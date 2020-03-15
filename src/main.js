import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 导入全局样式表
import './assets/css/global.css'

// 导入字体图标
import './assets/font/iconfont.css'

import axios from 'axios'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(null, err => {
  if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
    return {
      data: {
        meta: 'error'
      }
    }
  }
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
axios.defaults.baseURL = 'http://192.168.199.233:8888/api/private/v1/'
// 设置连接服务器超时时间,单位毫秒
axios.defaults.timeout = 5000

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
