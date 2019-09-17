'use strict'
import router from '../router'
import axios from 'axios'
import Cookies from 'js-cookie';

let qs=require('querystring');
let localHost=window.location.host;
let hostParams={'from':localHost};
let hostUrl='http://106.14.150.55:8081/hostroute.php';

axios.post(hostUrl,qs.stringify(hostParams)).then(msg=>{
  Cookies.set('hostName',msg.data.host)
});

let Axios = axios.create({
  timeout:30000,
  baseURL: Cookies.get('hostName'),
  withCredentials: false
});
// http request 拦截器
// Axios.interceptors.request.use(
//   config => {
//     if (localStorage.token) {
//       config.headers.token = `${localStorage.token}`;
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   });

Axios.interceptors.request.use((config) => config, (err) => {
  // console.log(err);
});

// http response 拦截器
Axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // console.log(error.response, '----------------------');
    if (error.response) {
      if(error.response.status == '600') {
         // console.log('request.js','600');
        Cookies.remove('user');
        localStorage.removeItem('token');
        router.push('/login');
      }
      // console.log(error)
      // router.push('/500')
      // switch (error.response.status) {
      //   case 600:
      //     router.push('/login')
      // }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });

 export default Axios
