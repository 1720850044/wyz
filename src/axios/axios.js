"use strict";
import router from "../router";
import axios from "axios";
import Cookies from "js-cookie";
import iView from "iview";
import store from "../store";

let qs = require("querystring");
let localHost = window.location.host;
let hostParams = {from: localHost};
let hostUrl = "https://www.banbooyun.com/hostroute.php";
let baseURL = "https://www.banbooyun.com";

if (!Cookies.get("hostName")) {
    if (document.domain === 'localhost') {
        baseURL = "https://dev.banbooyun.com";
    } else {
        baseURL = "https://" + document.domain;
    }
    Cookies.set("hostName", baseURL);
} else {
    baseURL = Cookies.get("hostName");
}

// 配置不同环境请求地址
baseURL = window.location.host.indexOf("banbooyun.com") !== -1 ? window.location.protocol + "//" + window.location.host : "https://dev.banbooyun.com";
if (window.location.host.indexOf("dev3.banbooyun.com") !== -1) {
    baseURL = "https://dev.banbooyun.com";
}
let Axios = axios.create({
    timeout: 30000,
    baseURL: baseURL,
    withCredentials: false
});
Axios.defaults.baseURL = baseURL;

//请求request拦截
Axios.interceptors.request.use(
    config => {
        // Show loading
        store.state.isLoading = true;
        //封装post
        if (config.method === "post") {
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    err => {
        // Hide loading
        store.state.isLoading = false;
        console.log("axios request error:", err);
    }
);

// http response 拦截器
Axios.interceptors.response.use(
    response => {
        // Hide loading
        store.state.isLoading = false;
        if (response.data.err_code === 0) {
            if (response.data.data && response.data.data.hasOwnProperty('acc_token')) {
                sessionStorage.accToken = response.data.data.acc_token;
            }
            return response;
        } else {
            iView.Message.warning(response.data.err_message);
            return response;
        }
    },
    error => {
        // Hide loading
        store.state.isLoading = false;
        if (error.response) {
            let code = error.response.status;
            switch (code) {
                case 600:
                    if (router.currentRoute.path !== '/login') {
                        Cookies.remove('user');
                        Cookies.remove('company');
                        Cookies.remove('post_id');
                        Cookies.remove('hostName');
                        sessionStorage.clear();
                        localStorage.clear();
                        if (window.websocket) {
                            window.websocket.close(1000, 'nothing....');
                            window.websocket = null;
                        }
                        //如果当前不是登录页或其主页
                        if (router.currentRoute.path !== "/index" && router.currentRoute.path !== "/login") {
                            router.push({path: '/login', query: {ref: 'admin'}});
                        }
                    }
                    break;
                case 403:
                    router.replace({
                        path: '/403'
                    });
                    break;
                default:
                    // iView.Message.error(code);
                    break;
            }
            return Promise.reject(error.response.data); // 返回接口返回的错误信息
        } else {
            iView.Message.error(error.message);
        }
    }
);

export default Axios;
