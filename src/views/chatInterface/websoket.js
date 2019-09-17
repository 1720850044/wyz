import notice from '@/plugins/notice/notice.js'; // 通知类
import store from '@/store/index';
import Cookies from 'js-cookie';
import globalData from '../../global/Global';
import api from 'api';
import iView from 'iview';
let wsurl = globalData.wsurl;
async function refreshCollaboration(data, vm) {
    await vm.$store.dispatch('getCollaborationAndNav');
}

//创建websorket
let ws;
let reconnectNum = 0;
let t = 0;
function createWebSocket(vm) {
    try {
        if ('WebSocket' in window){
            ws = new WebSocket(wsurl);
        } else if ('MozWebSocket' in window){
            ws = new MozWebSocket(wsurl);
        } else {
            alert('您的浏览器不支持websocket协议,建议使用新版谷歌、火狐等浏览器，请勿使用IE10以下浏览器，360浏览器请使用极速模式，不要使用兼容模式！');
        }
        window.webSocket = ws;
        initEventHandle(vm);
    } catch (e){
        reconnect(wsurl, vm);
        console.log(e);
    }
    t= 0;
}

function initEventHandle(vm) {
    ws.onclose = function () {
        if (localStorage.token){
            reconnect(wsurl);
        }
        console.log('ws连接关闭!');
    };
    ws.onerror = function () {
        reconnect(wsurl);
        console.log('ws连接错误!');
    };
    ws.onopen = function () {
        if (reconnectNum > 0){
            // iView.Message.success({content: "重新连接成功！", duration: 2});
            reconnectNum = 0; //连接成功 重置连接次数
        }
        heartCheck.reset().start();      //心跳检测重置
        console.log('ws连接成功!');
        let sendData = JSON.stringify({
            action: 'login',
            token: localStorage.token,
        });
        ws.send(sendData);
    };
    ws.onmessage = function (event) {    //如果获取到消息，心跳检测重置
        heartCheck.reset().start();      //拿到任何消息都说明当前连接是正常的
        // console.log("ws收到消息啦:" , event.data);
        let data = JSON.parse(event.data);
        if (data.action === 'ping') {
            const data = JSON.stringify({action: 'ping'});
            webSocket.send(data);
        }
        if (data.action === 'login') {
            localStorage.userMsg = JSON.stringify(data);
        }
        if (data.action === 'message') {
            if (data && Cookies.get('user')){
                localStorage.client_id = data.client_id;
                api.chatInit({client_id: data.client_id}).then((initChatData)=>{
                    if (initChatData.data.err_code == 0){
                        api.getUnread().then((UnreadData)=>{
                            if (UnreadData.data.err_code == 0){
                                // console.log('未读消息',JSON.stringify(UnreadData.data.data))
                                store.state.UnreadMsgList = UnreadData.data.data;
                            }
                        });
                    } else {
                        iView.Message.error({content: '服务器连接失败', duration: 2});
                    }
                });
            }
        }
        if (data.action === 'notice') {
            vm.$store.dispatch('getMsgNoticeNum');
            let msg = data.message;
            if (data.message.indexOf('ReplyQusetion') > 0){
                let creatEl = document.createElement( 'div' );
                creatEl.innerHTML = data.message;
                msg = creatEl.getElementsByClassName('ReplyAnswer')[0].innerHTML;
                data.message = msg;
            }
            if (localStorage.noticeList){
                let localist = JSON.parse(localStorage.noticeList);
                localist.push(data);
                localStorage.noticeList = JSON.stringify(localist);
            } else {
                localStorage.noticeList = JSON.stringify([ data ]);
            }
            store.state.noticeList = localStorage.noticeList;

            // 浏览器是否支持Notification
            if (!window.Notification) {
                alert('该浏览器不支持桌面通知！');
            } else {
                if (data.window === 0){
                    return;
                }
                // 是否已被允许使用Notification
                if (Notification.permission === 'granted') {
                    notice.ymywindow({
                        // title: '提示',
                        title: data.title,
                        message: msg,
                    }, vm, data);
                } else if (Notification.permission !== 'denied') {
                    // 请求用户授权
                    Notification.requestPermission( (permission) => {
                        if (permission === 'granted') {
                            notice.ymywindow({
                                // title: '提示',
                                title: data.title,
                                message: msg,
                            });
                        }
                    });
                }
            }
        }
        if (data.action === 'group-chat') {
            store.state.unreadMessagesCount= data;
            console.log('store.state.unreadMessagesCount', store.state.unreadMessagesCount);
            var list = store.state.useList;
            list.push(data);
            store.state.useList =list;
            if (localStorage.useList){
                let localist = JSON.parse(localStorage.useList);
                localist.push(data);
                localStorage.useList = JSON.stringify(localist);
            } else {
                localStorage.useList = JSON.stringify([ data ]);
            }
            // @通知消息
            if (data.msg_data){
                // 通知里面是否有自己 有就触发事件
                userIsNotice(data, vm);
            }
            // 删群的通知
            if (data.type === 'group_not_exist'){
                vm.$bus.emit('groupRefreshList');
            }

            vm.$bus.emit('groupNumChange',data.group_key);

        }
        if (data.action === 'download_url') {
            if (data.download_url) {
                if (data.busi_type == 'task') {
                    store.state.downComplateArr.push({
                        id: data.busi_id,
                        type: data.busi_type,
                        status: false,
                    });
                } else {
                    store.state.downloadStatus = true;
                }
                var a = document.createElement('a');
                a.href = data.download_url;
                a.click();
            }
        }
        if (data.action === 'refresh'){
            vm.$store.dispatch('createNav');
        }
        if (data.action === 'group-notice'){
            //置顶信息
            if (data.route == 'top-chat'){
                if (localStorage.SysPushMsg){
                    let localist = JSON.parse(localStorage.SysPushMsg);
                    localist.forEach((creent, index, arr)=>{
                        if (creent.group == data.group){
                            localist.splice(index, 1);
                        }
                    });
                    localist.push(data);
                    localStorage.SysPushMsg = JSON.stringify(localist);
                } else {
                    localStorage.SysPushMsg = JSON.stringify([ data ]);
                }
                store.state.SysPushMsg = localStorage.SysPushMsg;
            } else {
                //系统信息
                if (localStorage.useList){
                    let localist = JSON.parse(localStorage.useList);
                    localist.push(data);
                    localStorage.useList = JSON.stringify(localist);
                } else {
                    localStorage.useList = JSON.stringify([ data ]);
                }
                store.state.useList =JSON.parse(localStorage.useList);
            }
        }
        if (data.action === 'refreshCollaboration'){
            refreshCollaboration(data, vm);
        }

        if (data.action === 'service-chat'){
            store.commit('setCustomerMsg', data);
        }
    };
}
// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口。
window.onbeforeunload = function() {
    ws.close();
};

function reconnect(wsurl, vm) {
    if (t > 0){
        return;
    }
    t = 1;
    let set = setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        if (reconnectNum >= 10){
            clearTimeout(set);
            // iView.Message.error({content: "已与服务器断开连接，请稍后再试！", duration: 2});
        } else {
            reconnectNum ++;
            // iView.Message.error({content: "已与服务器断开连接，正在尝试第 "+ reconnectNum +" 次连接！", duration: 2});
            createWebSocket(wsurl, vm);
        }
    }, 5000);
}
//心跳检测
var heartCheck = {
    timeout: 540000,        //9分钟发一次心跳
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            ws.send('ping');
            console.log('ping!');
            self.serverTimeoutObj = setTimeout(function(){ //如果超过一定时间还没重置，说明后端主动断开了
                ws.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout);
        }, this.timeout);
    },
};

// 通知里面是否有自己 有就触发事件
function userIsNotice(data, vm) {
    const user_id = sessionStorage.userId;
    let is_notice = false;
    let msg_data = [];
    if (localStorage.msg_data) {
        msg_data = JSON.parse(localStorage.msg_data);
    }
    data.msg_data.map((item, index) => {
        if (user_id === item.user_id) {
            is_notice = true;
        }
    });
    if (is_notice) {
        vm.$bus.emit('msg_data');
        localStorage.msg_data = JSON.stringify(msg_data.concat(data));
    }
}

export default {
    createWebSocket,
    // connectSocket
};

