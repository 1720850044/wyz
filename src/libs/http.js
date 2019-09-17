import axios from 'axios'

const http = axios.create({
  baseURL: 'http://192.168.2.19/index.php?r=',
  timeout: 100000,
  withCredentials: true,
  data: {},
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //   // 'Content-Type': 'application/json;charset=UTF-8',
  //   Accept: 'application/json'
  // }
  // proxy: {
  //   host: '192.168.19.2',
  //   port: 8080,
  //   auth: {
  //     username: 'mikeymike',
  //     password: 'rapunz3l'
  //   }
  // }
});

// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// http.interceptors.request.use( config => {
//   // config.headers([
//     // 设置请求体和携带token信息
//   // ])
//   return config
// })

http.interceptors.response.use(response => {
  // 判断后台返回数据携带的请求码
  if(response.data.retcode === 200 || response.data.retcode === '200') {
    return response.data.data || response.data
  } else {
    // 非200请求报错
    throw Error(response.data.msg || '服务异常')
  }
})

export default http