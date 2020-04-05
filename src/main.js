import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入全局样式表
import './assets/css/global.css'

// 导入字体图标
import './assets/font/iconfont.css'

// 导入路由进度条第三方包
import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css'

import axios from 'axios'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  Nprogress.start()
  return config
})

axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
}, err => {
  const { config, code, message, sal } = err
  console.info(code)
  console.error(message)
  if (err.code === 'ECONNABORTED' || err.message === 'Network Error' || err.response.status == 404) {
    Nprogress.done()
    return {
      data: {
        meta: 'error'
      }
    }
  }
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

// axios.defaults.baseURL = 'http://192.168.199.233:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://api.tp5.com/api/v1/'
axios.defaults.baseURL = 'http://api.eilen.top:8081/api/v1/'
// 设置连接服务器超时时间,单位毫秒
axios.defaults.timeout = 5000

Vue.config.productionTip = false

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getMonth() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
