// Polyfill
import '@babel/polyfill';

import Vue from 'vue';
import App from './App.vue';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import Antd from 'ant-design-vue'; // 加载 JS
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

import './main.scss';

Vue.config.productionTip = false;
new Vue({
    render: h => h(App),
}).$mount('#app');
