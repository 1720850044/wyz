// import notice from '@/plugins/notice/notice.js' // 通知类
// import store from '@/store/index'
// import globalData from '../../global/Global'
//
// let wsurl = globalData.wsurl;
// console.log('wsurl:',wsurl);
// function connectSocket(msgData,vm) {
//     // console.log(666,msgData);
//
//     window.webSocket = new WebSocket(wsurl)
//     /*建立连接*/
//     webSocket.onopen = evt => {
//         webSocket.send(msgData)
//     }
//     /*连接关闭*/
//     webSocket.onclose = evt => {
//         console.log("webSocket连接关闭")
//     }
//     /*接收服务器推送消息*/
//     webSocket.onmessage = evt => {
//         //console.log('webSocket 接收服务器推送消息',evt.data)
//         let data = JSON.parse(evt.data)
//         if (data.action === 'ping') {
//             const data = JSON.stringify({
//                 action: 'ping'
//             })
//             webSocket.send(data)
//         }
//         if (data.action === 'login') {
//             localStorage.userMsg = JSON.stringify(data)
//         }
//         // if (data.action === 'message') {
//         //     if(data){
//         //         localStorage.client_id = data.client_id
//         //         api.chatInit({client_id:localStorage.client_id}).then((initChatData)=>{
//         //             if(initChatData.data.err_code == 0){
//         //                 api.getUnread().then((UnreadData)=>{
//         //                     if(UnreadData.data.err_code == 0){
//         //                         store.state.UnreadMsgList = UnreadData.data.data
//         //                     }
//         //                 })
//         //             }
//         //         })
//         //     }
//         // }
//         if (data.action === 'notice') {
//             let msg = data.message;
//             if(data.message.indexOf('ReplyQusetion') > 0){
//                 let creatEl =  document.createElement( 'div' );
//                 creatEl.innerHTML = data.message;
//                 msg = creatEl.getElementsByClassName('ReplyAnswer')[0].innerHTML;
//                 data.message = msg;
//             }
//             if(localStorage.noticeList){
//                 let localist = JSON.parse(localStorage.noticeList);
//                 localist.push(data);
//                 localStorage.noticeList = JSON.stringify(localist);
//             }else {
//                 localStorage.noticeList = JSON.stringify([data]);
//             }
//             store.state.noticeList = localStorage.noticeList;
//
//             // 浏览器是否支持Notification
//             if (!window.Notification) {
//                 alert("该浏览器不支持桌面通知！")
//             } else {
//                 // 是否已被允许使用Notification
//                 if (Notification.permission === "granted") {
//                     notice.ymywindow({
//                         title: '提示',
//                         message: msg
//                     })
//                 } else if (Notification.permission !== "denied") {
//                     // 请求用户授权
//                     Notification.requestPermission(function (permission) {
//                         if (permission === "granted") {
//                             notice.ymywindow({
//                                 title: '提示',
//                                 message: msg
//                             })
//                         }
//                     })
//                 }
//             }
//         }
//         if (data.action === 'group-chat') {
//             store.state.unreadMessagesCount= data
//             var list = store.state.useList;
//             list.push(data);
//             store.state.useList =list;
//             if(localStorage.useList){
//                 let localist = JSON.parse(localStorage.useList);
//                 localist.push(data);
//                 localStorage.useList = JSON.stringify(localist);
//             }else {
//                 localStorage.useList = JSON.stringify([data]);
//             }
//             // @通知消息
//             if(data.msg_data){
//                 // 通知里面是否有自己 有就触发事件
//                 userIsNotice(data,vm)
//             }
//             // 删群的通知
//             if(data.type === 'group_not_exist'){
//                vm.$bus.emit('groupRefreshList')
//             }
//         }
//
//
//
//         if (data.action === 'download_url') {
//             if (data.download_url) {
//                 if (data.busi_type == 'task') {
//                     store.state.downComplateArr.push({
//                         id: data.busi_id,
//                         type: data.busi_type,
//                         status: false
//                     })
//                 } else {
//                     store.state.downloadStatus = true;
//                 }
//                 var a = document.createElement('a');
//                 a.href = data.download_url;
//                 a.click();
//             }
//         }
//         if(data.action === 'refresh'){
//          vm.$store.dispatch('createNav');
//         }
//         if(data.action === 'group-notice'){
//             //置顶信息
//             if(data.route == 'top-chat'){
//                 if(localStorage.SysPushMsg){
//                     let localist = JSON.parse(localStorage.SysPushMsg);
//                     localist.forEach((creent,index,arr)=>{
//                         if(creent.group == data.group){
//                             localist.splice(index, 1);
//                         }
//                     })
//                     localist.push(data);
//                     localStorage.SysPushMsg = JSON.stringify(localist);
//                 }else {
//                     localStorage.SysPushMsg = JSON.stringify([data]);
//                 }
//                 store.state.SysPushMsg = localStorage.SysPushMsg;
//             } else {
//                 //系统信息
//                 if(localStorage.useList){
//                     let localist = JSON.parse(localStorage.useList);
//                     localist.push(data);
//                     localStorage.useList = JSON.stringify(localist);
//                 }else {
//                     localStorage.useList = JSON.stringify([data]);
//                 }
//                 store.state.useList =JSON.parse(localStorage.useList);
//             }
//         }
//     }
//     /*连接发生错误时*/
//     webSocket.onerror = (evt, e) => {
//         console.log('连接发送失败')
//     }
// }
// // 通知里面是否有自己 有就触发事件
// function  userIsNotice (data,vm) {
//     const user_id = sessionStorage.userId
//     let is_notice = false
//
//    let msg_data =  []
// if(localStorage.msg_data){
//     msg_data =  JSON.parse(localStorage.msg_data)
// }
//     data.msg_data.map((item,index) => {
//         if(user_id === item.user_id){
//
//             is_notice = true
//         }
//
//     })
//     if(is_notice){
//         vm.$bus.emit('msg_data')
//         localStorage.msg_data = JSON.stringify(msg_data.concat(data))
//
//     }
//
// }
//
// export default {
//     connectSocket
// }
