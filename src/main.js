import Vue from 'vue';
import i18n from './locale/index';  // 国际化
import {onlyAPI} from './axios/apiConfig.js';
import iView from 'iview';
import 'babel-polyfill';  //处理IE11打开空白问题
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import axios from './axios/axios';
import 'iview/dist/styles/iview.css';
import vueEventCalendar from '../src/views/main-components/calend/vue-event-calendar/dist/index'
import Bus from './plugins/bus';
import notice from './plugins/notice/index.js'; // 通知类
import './plugins/notice/style.css'; // 全局通知样式
import GeminiScrollbar from 'vue-gemini-scrollbar'; // 美化滚动条
import 'plupload/js/plupload.full.min.js'; // plupload 上传
import plupload from './plugins/plupload/plupload.js'; //
import soket from './views/chatInterface/websoket.js';
import checkForm from './libs/checkForm.js';
import PublicFuns from './libs/PublicFuns.js';
import global from './global/Global'; //引用全局变量文件
import VueAwesomeSwiper from 'vue-awesome-swiper';
import language from './global/zh_cn.js';

Vue.use(VueAwesomeSwiper, /* { default global options } */);

// 引导相关组件
const guide = require('../static/intro');
require('intro.js/introjs.css');
require('intro.js/themes/introjs-modern.css');
import CONSTANT from '@/libs/constant';

// 气泡引导插件
const bubble = require('../static/bubble');
//throw '测试 报错日志 只在www线上才使用 影响本地测试调试';
let nowDomain = window.location.host;
if (nowDomain.indexOf('www.banbooyun.com') !== -1) {
    Raven.config('https://3556e27045ef4cf5b305e6746f967faf@sentry.io/1301771').install();
    Vue.config.errorHandler = (err, vm, info) => {
        Raven.captureException(err);
    };
}

//设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪
Vue.config.performance = true;

//全局配置
Vue.prototype.$axios = axios;
Vue.$axios = axios;             // Vue.$axios 调用
Vue.prototype.$checkForm = checkForm;
Vue.prototype.$PublicFuns = PublicFuns;
Vue.prototype.GLOBAL = global;
Vue.prototype.$connectSoket = soket;
Vue.prototype.$guide = guide;
Vue.prototype.$bubble = bubble;
Vue.prototype.$CONSTANT = CONSTANT;
Vue.prototype.$lau = language;
Vue.$lau = language;// Vue.$lau 调用,
Vue.prototype.$GLOBALAPI = onlyAPI;
Vue.$GLOBALAPI = onlyAPI;

/**
 * 统一接口路径
 * @type {{generalPaths, guidePaths}}
 */

import interfacePaths from './axios/interfacePaths';

Vue.prototype.$interface = interfacePaths;
Vue.$interface = interfacePaths;

if (localStorage.token) {
    axios.defaults.headers.common['token'] = localStorage.token;
}

localStorage.pid = 1;
Vue.use(vueEventCalendar, {locale: 'zh'});
Vue.use(iView);
Vue.use(Bus);
Vue.use(notice);
Vue.use(plupload);
Vue.use(GeminiScrollbar);

Vue.directive('scroll', {
    bind: function (el, binding) {
        window.addEventListener('scroll', function () {
            if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
                let loadData = binding.value;
                loadData();
            }
        });
    }
});
// 导航守卫
router.beforeEach((to, from, next) => {
    next();
});

new Vue({
    el: '#app',
    i18n: i18n,
    router: router,
    store: store,
    render: h => h(App),
    created () {
    },
    mounted() {
        if (localStorage.token) {
            // this.$store.dispatch('createNav');
        }
    },
});
