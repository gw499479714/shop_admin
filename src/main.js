/* eslint-disable eol-last */
/* eslint-disable indent */
// import Vue from '../node_modules/vue/dist/vue.esm'
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/common.css'
import axios from 'axios'

Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    // 添加请求拦截器
    // axios.interceptors.request.use(function(config) {
    //     // 在发送请求之前做些什么
    //     config.baseURL = 'http://localhost:8888/api/private/v1/'
    //     config.headers.Authorization = localStorage.getItem('token')
    //     return config
    // }, function(error) {
    //     // 对请求错误做些什么
    //     return Promise.reject(error)
    // })

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})