import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import '@/styles/index.scss' // global css
// 自定义主题
import './styles/element-variables.scss';
import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

import Permission from '@/common/component/Permission'
import CityPicker from '@/common/component/CityPicker'
import DatePicker from '@/common/component/DatePicker'

Vue.component('city-picker', CityPicker);
Vue.component('date-picker', DatePicker);

Vue.use(Permission);
Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

// 配置全局过滤器
import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;

// 自定义localStorage
import AiStore from '@/utils/store';
Vue.prototype['AiStore'] = AiStore;


new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
})