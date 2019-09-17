// const wsurl = 'ws:' + (Cookies.get('hostName') ? Cookies.get('hostName').split(':')[1] + ':8282' : null)
//const wsurl = 'ws://106.14.150.55:8282'; //dev.banbooyun.com 的IP
//const wsurl = 'ws://59.111.95.148:8282';   //www.banbooyun.com 的IP

let nowDomain = window.location.host;
const wsurl = nowDomain.indexOf('www.banbooyun.com') != -1 ? 'wss://ws.banbooyun.com/websocket' : 'wss://dev.banbooyun.com/websocket'; //长连接地址  wss://www.banbooyun.com/websocket
const baseRouter = 'index.php?r=';                //接口除域名之外的公共部分
const tongJiId = '1275034586';                  //友盟统计Id
const apiDomain = window.location.host.indexOf('banbooyun.com') !== -1 ? window.location.protocol + '//' + window.location.host : 'https://dev.banbooyun.com';//nowDomain.indexOf('www.banbooyun.com')  != -1 ? 'https://www.banbooyun.com' :'https://dev.banbooyun.com';  //api接口域名 暂无用 从cookie中获取
//const apiDomain = "https://dev.banbooyun.com";
const imgDomain = nowDomain.indexOf('www.banbooyun.com') !== -1 ? 'https://www.banbooyun.com' : 'https://dev.banbooyun.com';   //静态资源域名
const uploadDomain = nowDomain.indexOf('www.banbooyun.com') !== -1 ? 'https://www.banbooyun.com' : 'https://dev.banbooyun.com';  //上传域名
const ossUploadDomain = nowDomain.indexOf('www.banbooyun.com') !== -1 ? 'https://yhc-www.oss-cn-shanghai.aliyuncs.com' : 'https://yhc-1.oss-cn-shanghai.aliyuncs.com';
//有chart相关配置
const echartCFG = {
    colors: ['#4ea397', '#22c3aa', '#7bd9a5', '#d0648a', '#f58db2', '#f2b3c9'],//['#7cb5ec','#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'] , //通用颜色组
    xColor: '#333333',     //x轴颜色
    xFontColor: '#9f9f9f', //x轴文字颜色
    yColor: '#444444',     //x轴颜色
    yFontColor: '#9f9f9f', //Y轴字体颜色
    gridLeft: '0%',        //左边距离
    gridRight: '0%'       //右边距离
};
//echart配置项

console.log('ossUploadDomain', ossUploadDomain);
console.log('nowDomain:', nowDomain);
console.log('数据socket URL:', wsurl);

export default {
    baseRouter,  //接口除域名之外的公共部分
    tongJiId,
    wsurl,
    apiDomain,
    imgDomain,
    uploadDomain,
    ossUploadDomain,
    echartCFG,  //echart 图标配置参数
    // token,//用户token身份
    // serverSrc,//服务器地址
    // hasEnter,//用户登录状态
}
