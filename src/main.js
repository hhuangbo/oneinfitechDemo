// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import App from './App'
import router from './router'
import store from './store'

import 'element-ui/lib/theme-chalk/index.css';

import 'animate.css'

import './common/css/updateElementcss.scss';
import './common/css/global.scss'
//高德地图组件
import AMap from 'vue-amap'
Vue.use(AMap)

import axios from 'axios'
Vue.prototype.$http = axios
Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
