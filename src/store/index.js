import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import project from './modules/project';
import member from './modules/member';
import paySkip from './modules/paySkip';
import ImgVedioStatus from './modules/ImgVedioStatus';
import typelib from './modules/typelib';
import contract from './modules/contract';
import message from './modules/message';
import notice from './modules/notice';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        unreadMessagesCount: null,
        msgShow: !localStorage.msgShow ? false : true,
        useList: [],
        customerMsg: {
            customerMsgList: [],
            serviceUserID: null,
            NewClientUserID: null,
            NewClientUserName: null,
            isJoinClient: false,
            serviceMsgList: {},
        },
        groupKey: null,
        noticeList: [],
        SysPushMsg: [],
        SystemMsg: [],
        // absold: true,
        nums: 0,
        tabNum: 2,
        img: '',
        blob: false,
        file: {},
        msgNum: !localStorage.msgNum ? '0' : localStorage.msgNum,
        downloadStatus: false,
        downComplateArr: [],
        MsgIsShow: false,
        customerServiceIsShow: false,
        customerShowOrHidenFlag: false,
        customerEnterFlag: true,
        UnreadMsgList: [],
        breakJumpFlag: false,
        headImg: null,
        companyMembers: '',
        totalDownloadingNum: 0,
        totalUploadingNum: 0,
        guideStatus: '0',
        isLoading: false
    },
    mutations: {
        resetArr (state, falg) {
            state.downComplateArr.splice(0, 1);
        },
        setImg (state, data) {
            state.img = data;
        },
        setCustomerServiceIsShow (state, flag) {
            state.customerServiceIsShow = flag;
        },
        setCustomerShowOrHiden (state, flag) {
            state.customerShowOrHidenFlag = flag;
        },
        setCustomerEnterFlag (state, flag) {
            state.customerEnterFlag = flag;
        },
        setMsgIsShow (state, falg) {
            state.MsgIsShow = falg;
        },
        setGroupKey (state, data) {
            state.MsgIsShow = true;
            state.groupKey = data;
        },
        setbreakJump (state, flag) {
            state.breakJumpFlag = flag;
        },
        autoChangeHeadImg (state, url) {
            state.headImg = url;
        },
        getCompanyMembers (state, data) {
            state.companyMembers = data;
        },
        setDownloadingNum (state, num) {
            state.totalDownloadingNum = 0;
            state.totalDownloadingNum = num;
        },
        setUploadingNum (state, num) {
            state.totalUploadingNum = 0;
            state.totalUploadingNum = num;
        },
        setGuideStatus (state, status) {
            state.guideStatus = status;
        },
        setCustomerMsg (state, msg) {
            state.customerMsg.customerMsgList.push(msg);
            if (
                (msg.action === 'service-chat' && msg.type === 'user' && msg.service_user_id != null && msg.message === '客服已接入') ||
                (msg.action === 'service-chat' && msg.type === 'user' && msg.service_user_id != null && msg.message === '客服已接入(等待)')
            ) {
                let firstMsg = msg;
                state.customerMsg.customerMsgList = [];
                state.customerMsg.customerMsgList.push(firstMsg);
                state.customerMsg.serviceUserID = msg.service_user_id;
            }

            if (msg.action === 'service-chat' && msg.client_user_id) {
                if (state.customerMsg.serviceMsgList[ msg.client_user_id ]) {
                    state.customerMsg.serviceMsgList[ msg.client_user_id ].push(msg);
                } else {
                    state.customerMsg.serviceMsgList = Object.assign(state.customerMsg.serviceMsgList, {[ msg.client_user_id ]: [ msg ]});
                }
            }
        },
        resetCustomerMsg (state, msg) {
            state.customerMsg.customerMsgList = msg;
        },
        resetCustomerServiceMsg (state, data) {
            state.customerMsg.serviceMsgList[ data.client_user_id ] = [];
            state.customerMsg.serviceMsgList[ data.client_user_id ] = data.msg;
        },
        deleteCustomerServiceCreentClient (state, clientMsg) {
            delete state.customerMsg.serviceMsgList[ clientMsg ];
        }
    },
    actions: {},
    modules: {
        app,
        user,
        project,
        member,
        paySkip,
        ImgVedioStatus,
        typelib,
        contract,
        message,
        notice,
    },
});

export default store;
