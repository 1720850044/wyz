<template>
    <div class="message_remind_all">
        <div class="message_remind_left" v-if="typeShow">
            <div class="msg_title_all">
                <!--{{objList}}-->
                <ul>
                    <li v-for="(item, index) in objList" :key="index" :class="{'activeNav':activeIndex == index}"
                        @click="activeIndex = index;ID = item.id">
                        <span :class="item.bojectStyle" :title="item.name">{{item.name}}</span>
                        <i :id="index === 0?'msg_sign':''" v-show="item.cnt" class='msgStyle'>{{item.cnt}}</i>
                    </li>
                </ul>
            </div>
        </div>
        <div class="message_remind_right">
            <div class="all-sign-button">
                <span  @click="allMsgSigned">全部标记已读</span>
            </div>
            <div class="msg_sign" v-for="(items, index) in msgList" :key="index">
                <div class="msg_sign_box">
                    <p><span v-if="items.type=='chat_message'"> {{items.title}} </span>{{items.message}}</p>
                    <p class="timeSty">{{items.date}}</p>
                </div>
                <div class="msg_sign_button">
                    <button class="look_sign" @click="lookDetail(items,index)">查看</button>
                    <button class="read_sign" v-show="items.state == 1">已读</button>
                        <button class='sign-end' v-show="items.state == 0" @click="setSigned(items,index)">标识已读</button>
                </div>
            </div>
            <!--<div class="message_sign">-->
            <!--<button v-show="msgList.length > 1 && tabIndex != 2"  >全部标识</button>-->
            <!--</div>-->
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import api from 'api';

    export default {
        props: ['tabIndex'],
        data() {
            return {
                needGuideData: '',
                tabType: 'other',
                activeIndex: 0,
                objList: [],
                msgList: [],
                ID: null
            };
        },
        mounted() {
            this.bubbleMessage();
        },
        methods: {
            ...mapActions(['vuexProjectPost', 'getMsgNoticeNum']),
            async bubbleMessage() {
                let {data} = await api.bubbleMessage();
                if (data.err_code === 0) {
                    if (data.guide && data.guide === 'message') {
                        this.needGuideData = true;
                    }
                    // await this.getSysNotice();
                    await this.getUnreadMsgList(0);
                    if (data.guide && data.guide === 'message') {
                        this.bubble();
                    }
                }
            },
            bubble() {
                let text = this.$lau.bubble.message;
                let defaultOptions = [
                    {
                        id: 'header_project',
                        position: 'right',
                        title: text[0].title,
                        content: text[0].content,
                        relative: 'body',
                    },
                    {
                        id: 'msg_sign',
                        position: 'right',
                        title: text[1].title,
                        content: text[1].content,
                        relative: 'body',
                    },
                ];
                let fn = (item) => {
                    if (item.id === "msg_sign") {
                        this.needGuideData = '';
                        this.getProjectList();
                    }
                };
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$bubble(defaultOptions, fn);
                    }, 300);
                });
            },
            // 获取合同列表
            getContractList() {
                return new Promise(async (resolve, reject) => {
                    let {data} = await api.geTnoticeContract();
                    if (data.err_code === 0 && data.data) {
                        this.objList = data.data;
                        if (data.data.length > 0) {
                            this.ID = data.data[0].id;
                        }
                        resolve();
                    }
                });

            },
            // 获取系统消息列表
            async getSysNotice() {
                let {data} = await api.getChartUnreadMsgList({type: 'other'});
                if (data.err_code === 0 && data.data) {
                    this.msgList = data.data;
                }
            },
            // 获取合作列表
            async getBidNotice() {
                let {data} = await api.getChartUnreadMsgList({type: 'bid'});
                if (data.err_code === 0 && data.data) {
                    this.msgList = data.data;
                }
            },
            clearId(){
              this.ID = null;
            },
            //  获取项目列表
            getProjectList() {
                return new Promise(async (resolve, reject) => {
                    const items = {
                        search: this.searchStr,
                        index: 0,
                        state: -1,
                        size: 30,
                        needGuideData: this.needGuideData,
                    };
                    let {data} = await api.getChartMsgProjectList(items);
                    if (data.err_code == 0) {
                        this.objList = data.data || [];
                        if (data.data.length > 0) {
                            this.ID = data.data[0].id;
                        }
                        resolve();
                    }
                });
            },
//      根据ID获取未读消息
            async getUnreadMsgList(ID) {
                const items = {
                    search: '',
                    index: 0,
                    state: -1,
                    size: 30,
                    id: ID,
                    type: this.tabType
                };
                let {data} = await api.getChartUnreadMsgList(items);
                if (data.err_code == 0) {
                    this.msgList = data.data || [];
                }
            },
//        获取任务列表
            getTaskList(type, is_link) {
                return new Promise(async (resolve, reject) => {
                    let {data} = await api.getChartTaskList();
                    if (data.err_code == 0) {
                        this.objList = data.data || [];
                        if (data.data.length > 0 && !is_link) {
                            this.ID = data.data[0].id;
                        }
                        resolve();
                    }
                });

            },
            // 单个标记已读
            async setSigned(item, index) {
                item.state = 1;
                let lists = this.msgList[index];
                let items = {
                    id: lists.msg_id
                };
                let {data} = await api.SetChartReadMsg(items);
                if (data.err_code == 0) {
                    if (this.objList[this.activeIndex] && this.objList[this.activeIndex].cnt>=1){
                        this.objList[this.activeIndex].cnt--;
                    }
                    this.getMsgNum();
                }
            },
            //全部标识已读
            async allMsgSigned() {
                let Obj = {
                    type: this.tabType,
                    id: this.ID
                };

                let {data} = await api.setAllMsgSigned(Obj);
                if (data.err_code == 0) {
                    this.objList.forEach((creent, index, arr) => {
                        if (creent.id == Obj.id) {
                            creent.cnt = 0;
                        }
                    });
                    this.msgList.forEach((creent, index, arr) => {
                        creent.state = 1;
                    });
                    this.getMsgNum();
                }
            },
            async getMsgNum(){
                this.getMsgNoticeNum();
            },
            // 查看详情
            async lookDetail(items, index) {
                if (items.type === 'project') {
                    this.$router.push({path: items.href});
                    sessionStorage.projectID = items.id;
                } else if (items.type === 'task') {
                    this.$router.push({path: items.href});
                } else if (items.type === 'contract') {

                    this.$store.commit('getContractIDCommit', items.id);
                    this.$store.commit('getContractType', '1');

                    this.$router.push({path: items.href, query: {type: 1}});
                } else if (items.type === 'other') {
                    this.$router.push({path: items.href, query: {type: 1}});
                } else if (items.type === 'bid') {
                    await this.vuexProjectPost();

                    this.$store.commit('getContractType', '1');
                    this.$router.push({path: items.href});
                }
                this.setSigned(items, index);
            },
        },
        computed: {
            typeShow() {
                return !(this.tabType === 'other' || this.tabType === 'bid');
            },
            // getList() {
            //     return localStorage.noticeList ? JSON.parse(localStorage.noticeList) : [];
            // },
            noticeList() {
                return this.$store.state.noticeList;
            }
        },
        watch: {
            tabIndex(value) {
                this.objList = [];
                this.msgList = [];
                switch (value) {
                    case 0:
                        this.tabType = 'other';
                        this.getSysNotice();
                        // this.msgList = localStorage.noticeList ? JSON.parse(localStorage.noticeList):[]
                        break;
                    case 1:
                        this.tabType = 'bid';
                        this.getUnreadMsgList(0);
                        break;
                    case 2:
                        this.tabType = 'contract';
                        this.getContractList().then((res) => {
                            if(this.ID){
                                this.getUnreadMsgList(this.ID);
                            }
                        });
                        break;
                    case 3:
                        this.tabType = 'project';
                        this.getProjectList('project').then((res) => {
                            if(this.ID){
                                this.getUnreadMsgList(this.ID);
                            }
                        });
                        break;
                    case 4:
                        this.tabType = 'task';
                        this.getTaskList('task').then((res) => {
                            if(this.ID){
                                this.getUnreadMsgList(this.ID);
                            }
                        });
                        break;
                }
            },
            ID(value) {
                this.getUnreadMsgList(value);
            }
        },

    };
</script>
<style lang="less" scoped>
    .message_remind_all {
        width: 100%;
        height: 100%;
        display: flex;
        .message_remind_left {
            width: 20%;
            height: 100%;
            .msg_title_all {
                height: 100%;
                overflow: auto;
                ul {
                    li {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 20px 15px;
                        cursor: pointer;
                        font-size: 13px;
                        border-bottom: 1px solid #f7f5f5;
                        span {
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        i {
                            font-size: 12px;
                            font-style: normal;
                            width: 18px;
                            height: 18px;
                            line-height: 18px;
                            text-align: center;
                            border-radius: 100%;
                            background: #dc310f;
                            color: #ffffff;
                        }
                        &.activeNav {
                            background: #f7f7f7;
                            overflow: hidden
                        }
                        &:hover {
                            background: #f7f7f7;
                        }
                    }
                }
            }
        }
        .message_remind_right {
            .all-sign-button {
                height: 60px;
                padding-right: 10px;
                text-align: right;
                line-height: 60px;
                font-size: 14px;
                color: @orange;
                cursor: pointer;
            }
            width: 100%;
            height: 100%;
            border-left: 1px solid @baseboard;
            overflow: auto;
            .msg_sign {
                min-height: 60px;
                padding: 10px;
                border-bottom: 1px solid @baseboard;
                display: flex;
                justify-content: space-between;
                .msg_sign_box {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    p {
                        font-size: 13px;
                    }
                    .timeSty {
                        font-size: 12px;
                        color: @baseFont;
                    }
                    &:last-child {
                        font-size: 14px;
                        color: rgb(215, 215, 215);
                    }
                }
                .msg_sign_button {
                    display: flex;
                    align-items: center;
                    .look_sign {
                        background: @base;
                        border: 1px solid @base;
                    }
                    button {
                        border: 1px solid #fff;
                        border-radius: 3px;
                        padding: 3px 10px;
                        background: #fff;
                        width: 75px;
                        margin-left: 10px;
                        cursor: pointer;
                        font-size: 13px;
                        outline: none;
                        &.read_sign {
                            background: #f1f1f1;
                            color: @baseFont;
                            border-color: #e0e0e0
                        }
                        &.sign-end {
                            border-color: @orange;
                            color: @orange;
                        }
                        &.sign-see {
                            color: #3bceb6;
                            border-color: #3bceb6;
                        }
                        &.look_sign {
                            background: @white;
                            color: @base;
                            border-color: @base;
                        }

                    }
                }
            }
            .message_sign {
                text-align: right;
                padding: 10px 0;
                button {
                    border: 1px solid @orange;
                    color: @orange;
                    border-radius: 3px;
                    padding: 3px 10px;
                    background: #fff;
                    margin-right: 10px;
                    cursor: pointer;
                    font-size: 13px;
                }
            }
        }
    }
</style>
