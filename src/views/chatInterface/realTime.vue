<template>
    <div class="real_time_box">
        <!--:style="{height:(chatMsgBoxHeight - 70 - 161) +'px'}"-->
        <div class="load_real" :class="{'load_real_auto':keywordMsg}"
             :style="{height:(chatMsgBoxHeight - 70 - 161) +'px'}">
            <template v-if="!keywordMsg">
                <div class="setTopMsg" v-show="setTopData">
                    <span v-html="setTopData"></span>
                </div>
                <!--置顶消息-->
                <GeminiScrollbar class="crollbar" style="height: 100%">
                    <div class="realTime_interface" @mousewheel="getScoller">
                        <span class="chat_load" @click="getMoreMsg">查看更多消息</span>
                        <div v-for="(item, index) in datalist" :key="index" class="ko">
                            <!--对方聊天样式-->
                            <div class="otherMsgSty"
                                 v-if="item.user_id != userMsg.user_id && item.action == 'group-chat'&& item.status !='fail'">
                                <div>
                                    <img
                                        :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id"
                                        class="chats-image"/>
                                </div>
                                <div class="W100">
                                    <P class="mySelfDivSty">
                                        <!--{{item}}-->
                                        <span class="mySelfName">{{item.user_name || '用户_'+item.user_id}}</span>
                                        <span class="timeDate">{{item.date}}</span>
                                        <Icon v-if="item.star" class="star" type="ios-star"/>
                                    </P>
                                    <div class="mySelfMsgBox">
                                        <div class="Send_content iconfonts fileUploadDiv"
                                             :class="{'VIPexclusiveSty':AssembleGroupList[item.user_id] ? AssembleGroupList[item.user_id].type == 2 : false}"
                                             v-if="item.msg_type == 'file'" v-html="item.message"></div>
                                        <div class="Send_content iconfonts"
                                             :class="{'VIPexclusiveSty':AssembleGroupList[item.user_id] ? AssembleGroupList[item.user_id].type == 2 : false}"
                                             v-else @click="EnlargementFun($event)">
                                            <pre style="margin: 0;white-space: normal;;line-height: 20px"
                                                 v-html="item.message"></pre>
                                        </div>
                                        <ul class="operationBar">
                                            <li>
                                                <span v-if="item.msg_type != 'file' && !item.star"
                                                      class="iconfonts icon-addfloder"
                                                      @click="addChatsStar(item,index)">收藏</span>
                                                <span v-if="item.msg_type != 'file' && item.star"
                                                      class="iconfonts icon-addfloder Collection"
                                                      @click="cancelChatsStar(item,index)">取消收藏</span>
                                            </li>
                                            <!--groupMaster.master是否是该群组管理员-->
                                            <li>
                                                <span v-if="item.msg_type == 'text' && groupMaster.master"
                                                      class="iconfonts icon-source-upload-b"
                                                      @click="SetTop(item)">置顶</span>
                                            </li>
                                            <!--群组和文字信息才能转通知-->
                                            <li>
                                                <span v-if="item.group_id != null && item.msg_type == 'text'"
                                                      class="iconfonts icon-back" @click="$emit('turnToNotice',item)">转为通知</span>
                                            </li>
                                            <li>
                                                <span
                                                    v-if="item.group == 'group_'+item.group_id && item.msg_type != 'file'"
                                                    class="iconfonts icon-noticeme" @click="ReplyFun(item)">回复</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!--自己聊天样式-->
                            <div class="mySelfMsgSty"
                                 v-else-if="item.user_id == userMsg.user_id && item.action == 'group-chat' && item.status !='fail'">
                                <div class="W100">
                                    <P class="mySelfDivSty">
                                        <span class="timeDate">{{item.date}}</span>
                                        <span class="mySelfName">我</span>
                                    </P>
                                    <div class="mySelfMsgBox">
                                        <!--普通聊天-->
                                        <!--{{item.message}}-->
                                        <div class="Send_content iconfonts fileUploadDiv" v-if="item.msg_type == 'file'"
                                             v-html="item.message"></div>
                                        <div class="Send_content iconfonts" v-else @click="EnlargementFun($event)">
                                            <pre style="margin: 0;white-space: normal;line-height: 20px"
                                                 v-html="item.message"></pre>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <img :src="cureenHeadImg" class="chats-image"/>
                                </div>
                            </div>
                            <!--系統消息樣式-->
                            <div class="SysMsgSty"
                                 v-if="item.action == 'group-notice' || item.action == 'group-chat' && item.status =='fail'">
                                <div style="width: 40px;height: 40px"><!--<img class="chats-image"/>--></div>
                                <div class="W100">
                                    <P class="mySelfDivSty">
                                        <span class="mySelfName"> 系统消息</span>
                                        <span class="timeDate"> {{ item.date }} </span>
                                    </P>
                                    <div class="mySelfMsgBox">
                                        <div class="Send_content iconfonts">
                                            <!--{{item}}-->
                                            <!--<span v-if="item.route == 'quit-group-chat' || item.route == 'join-chat-group'"> {{ item.data.user_name || '用户_'+item.data.user_id }}&nbsp;</span>-->
                                            {{item.message}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </GeminiScrollbar>
            </template>
            <!-- 收藏 -->
            <template v-else>
                <!--消息查找-->

                <div class="returnBtn" @click="keywordMsg = null">
                    <span>
                        <Icon class="btn" type="chevron-left"></Icon>返回
                    </span>
                </div>
                <template v-if="keywordMsg.length>0">
                    <span class="chat_load" @click="getUpFindList">查看更多消息</span>
                    <div :class="{'otherMsgStyBox':keywordMsg}">
                        <div class="otherMsgSty" v-for="(item,index) in keywordMsg" :key="index">
                            <div>
                                <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id"
                                     class="chats-image"/>
                            </div>
                            <div class="W100" :class="{'messageBorder':keywordMsg.type === 'star'}"
                                 @click="starToMsgList(item,index)">
                                <P class="mySelfDivSty">
                                    <span class="mySelfName">{{item.user_name}}</span>
                                    <span v-if="item.type === 'notice'" class="timeDate">{{item.date}}</span>
                                    <span v-else class="timeDate">{{item.data?JSON.parse(item.data).date:''}}</span>

                                </P>
                                <div class="mySelfMsgBox">
                                    <div class="Send_content iconfonts" v-html="item.message"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <span class="chat_load" @click="getDownFindList()">查看更多消息</span>
                </template>
                <template v-else>
                    <div class="vacancyBox">
                        <p class="vacancy">未找到消息...</p>
                    </div>
                </template>
            </template>
        </div>
        <form class="send_information_box" :style="{height:(chatMsgBoxHeight - 70 - 644) + 'px'}" v-show="!keywordMsg"
              onsubmit="return false">
            <div id='file_id'>
                <span class="pace button">
                    <i class="iconfonts icon-biaoqing1" style="font-size: 20px;"/>
                </span>
                <span class="file_class_father button" @click.self.stop="true">
                    <i class="iconfonts icon-tupian1" style="font-size: 20px;"/>
                    <uploader :ids='file'></uploader>
                </span>
                <span class="button">
                    <i class="iconfonts icon-wenjianjia" style="font-size: 20px;"/>
                    <uploader :ids="wenjian"></uploader>
                </span>
                <span class="button">
                    <!-- 截屏 -->
                    <Icon type="scissors" size="18" @click.native="openScreenshot"></Icon>
                </span>
                <!-- 聊天搜索 -->
                <div class="searchBox">
                    <template v-if="searchShow">
                        <Select v-model="searchDateValue" class="searchDateList">
                            <Option v-for="item in searchDate" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                        <Input v-model="searchText" icon="ios-search" placeholder="成员/关键字" style="width: 125px"
                               @keyup.enter.native="handleSearch"></Input>
                    </template>
                    <span class="iconfonts icon-sousuo externalSousuo"
                          @click="searchShow = !searchShow;searchText = null;searchDateValue = -1;"
                          style="font-size: 18px;"></span>
                </div>
            </div>
            <div class="send_message_remind">
                <div class="send_input" contenteditable="true" id="testInput"
                     @keyup.enter="submit" @keydown="keyIn($event)">
                </div>
                <div class="clearfix send_message_children" v-show="isShowMessage">
                    <p>有<span class="message_num" v-show="isLook">{{readNum}}</span><span
                        :class="!isLook ? 'message_num':'message_nums' "><span v-show="isLook"
                                                                               class="message_numed">/</span>{{messageNum}}</span>条您的消息未读
                    </p>
                    <p @click="closeMessage">x</p>
                    <p @click="getSee" v-if="!isLook">查看</p>
                    <p @click="getSeed" v-else>下一条</p>
                </div>
            </div>
            <!-- @人员框 -->
            <div class="send_information_person" :style="personPosi" v-show="sendShow">
                <ul class="send_ul_style">
                    <li v-for='(item, index) in useList' :key="index" @click="personDone(item)">{{item.realname}}
                    </li>
                </ul>
            </div>
            <div class="clearfix send_Function_button">
                <p class="button_send" @click="submit">回车发送</p>
            </div>
        </form>
        <popup v-show="modalObj.thisFlag" :thisSrc="modalObj"></popup>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import api from 'api';
    import dateClass from '@/global/dateTool'; // 时间类
    import screenShot from '@/components/screenshot';
    import {screenshot} from './screenshot.js';
    import Popup from './popup';

    export default {
        components: {Popup, screenShot},
        props: ['group_key', 'groupMaster', 'starToMsgShow', 'chatMsgBoxHeight'],
        data() {
            return {
                isOneGetchat: null, // 第一次获取聊天记录
                testInput: null, // 保存截图内容
                is_all: false,
                noticeArray: [],
                is_collection: false, // true为收藏 false为查找
                starList: null,
                keywordMsg: null, // 关键字聊天记录
                chatRecordList: null, // 聊天记录
                searchShow: false,
                searchText: '',
                searchDateValue: -1,
                searchDate: [
                    {label: '最近一个月', value: -1},
                    {label: '最近三个月', value: -3},
                    {label: '最近一年', value: -12},
                    {label: '全部', value: 'all'},
                ],
                value: '',
                datalist: [],
                messageNum: 0,
                sendShow: false,
                isLook: false,
                loading: false,
                readNum: 0,
                file: 'file',
                wenjian: 'wenjian',
                websock: null,
                isShowMessage: false,
                scollArray: [],
                personPosi: {
                    left: '',
                    top: ''
                },
                userMsg: {},
                lastSelection: {},
                useList: [],
                configure: {},
                modalObj: {
                    thisFlag: false,
                    thisSrc: null
                },
                cureenHeadImg: this.GLOBAL.imgDomain + '/index.php?r=system/user/get-headimage&id=' + sessionStorage.getItem('userId'),
                ReplyObj: {
                    Questioner: null,
                    QuestionTime: null,
                    Question: null,
                    Answer: null
                },
                isReplyFlag: false,
                setTopData: null,
                AssembleGroupList: []
            };
        },
        mounted() {
            this.getPjUser();
            this.userMsge();
            this.init();
            screenshot();
            this.getName();
//            this.getMoreMsg()
            /* 设置截图 */
            // this.$bus.on('messageSendImg', (url) => {
            //     this.sendImg(url);
            // });

            /*收藏*/
            this.$bus.on('getChatStarList', (data) => {
                this.keywordMsg = data.data;
                this.keywordMsg.type = 'star';
            });

            /* 显示@列表 */
            /*  this.$bus.on('noticeListShow',() => {
                  this.noticeListShow()
              })*/

            if (this.starToMsgShow) {
                this.collectionSearch(this.starToMsgShow);
            }

        },
        updated() {
            this.geyEmoji();
        },
        computed: {
            ...mapState({
                groupInfo(value) {
                    return value.message.groupInfo;
                },
            }),
            getList() {
                return this.$store.state.useList;
            },
            getImg() {
                return this.$store.state.img;
            },
            getFile() {
                return this.$store.state.file;
            },
            SysPushMsg() {
                return this.$store.state.SysPushMsg;
            }
        },
        watch: {
            SysPushMsg: {
                handler(newVal) {
                    this.filterSetTopList();
                },
                deep: true
            },
            getList(e) {
                this.submitMsg(e);
            },
            getImg(e) {
                const blob = this.$store.state.blob;
                if (!blob) {
                    let imgs = null;
                    if (e.indexOf('#href') > 0) {
                        imgs = `<img src = '${e}' style='max-width: 400px; max-height:215px; border-radius: 4px;cursor: pointer'></img>`;
                        let config = {
                            obj: imgs,
                            msg_type: 'image'
                        };
                        this.getSong(config);
                    } else if (e.indexOf('#screen') > 0) {
                        this.sendImg(e);
                    } else {
                        imgs = `<img src = '${e}' style='max-width: 260px; max-height: 140px; border-radius: 4px;cursor: pointer'></img>`;
                        let config = {
                            obj: imgs,
                            msg_type: 'image'
                        };
                        this.getSong(config);
                    }

                } else {
                    const url = e;
                    $('.send_input').find('img').last().attr('src', url);
                }
            },
            getFile(e) {
                const files = `<div class="fileUploadSty"><div class="fileName"><em class="iconfonts icon-uniE914"></em><span>${e.fileName}</span><span>${e.fileSize}</span></div><div class="fileStatus"><span class="sendStatus">已发送</span><span><a href="${e.fileDown}">下载</a></span></div></div>`;
                let config = {
                    obj: files,
                    msg_type: 'file'
                };
                this.getSong(config);
            },
            group_key: function (e) {
                this.submitMsg(this.getList);
            }
        },
        methods: {

            /* 截图 */
            openScreenshot() {
                // 关闭弹窗
                this.$bus.emit('MsgIsShowTrue');
                // 截图初始化
                this.$bus.emit('screenshotInit', this.groupInfo.group_id, 'chat');
            },

            /* 保存到聊天框 */
            async sendImg(url) {
                let testInput = $('#testInput');
                let imageValue = `<img src="${url}" style="max-width: 260px; max-height: 140px; border-radius: 4px;" >`;
                // alert(imageValue)
                testInput.html(imageValue);
                this.testInput = imageValue;
            },

            /* 获取聊天记录 */
            async handleSearch() {
                this.searchShow = false;
                const formData = {
                    group: this.groupInfo.group_key,
                    search: this.searchText, // 搜索关键字
                };
                // 搜索时间
                if (this.searchDateValue !== 'all') {
                    const begin_Time = dateClass.getNowDate(null, this.searchDateValue);
                    const end_time = dateClass.getNowDate();
                    formData.begin_time = begin_Time;
                    formData.end_time = end_time;
                }
                let {data} = await api.getChatRecord(formData);
                if (data.err_code === 0 && data.data) {
                    this.keywordMsg = data.data.reverse();
                    this.keywordMsg.type = 'msg';
                }
            },
            // 根据收藏获取查找
            async collectionSearch(item) {
//                const lessformData = {
//                    group:JSON.parse(item.data).group_key,
//                    id:item.id,
//                    type:'less'
//                }
                const moreformData = {
                    group: JSON.parse(item.data).group_key,
                    id: item.id,
                    type: 'more'
                };
//                let lessData = await api.getChatRecord(lessformData)
                let moreData = await api.getChatRecord(moreformData);
//               if(lessData.data.err_code === 0){
//                   this.keywordMsg = lessData.data.data.reverse()
//               }
                if (moreData.data.err_code === 0) {
                    this.keywordMsg = this.keywordMsg ? this.keywordMsg.concat(moreData.data.data) : [].concat(moreData.data.data);
                }
            },

            /* 添加收藏 */
            async addChatsStar(item) {
                let {data} = await api.addChatsStar({chat_id: item.chat_id || item.id});
                if (data.err_code === 0) {
                    this.$set(item, 'star', true);
                    localStorage.useList = JSON.stringify(this.datalist);
                }
            },

            /* 取消收藏 */
            async cancelChatsStar(item) {
                let {data} = await api.cancelChatsStar({chat_id: item.chat_id});
                if (data.err_code === 0) {
                    this.$set(item, 'star', false);
                    localStorage.useList = JSON.stringify(this.datalist);
                }
            },

            /* 向上获取更多查找消息  */
            async getUpFindList() {
                let id = null;
                id = this.keywordMsg[0].id;
                const formData = {
                    group: this.groupInfo.group_key,
                    type: 'less',
                    id: id,
                };
                let {data} = await api.getChatRecord(formData);
                if (data.err_code === 0 && data.data) {
                    this.keywordMsg = data.data.reverse().concat(this.keywordMsg);
                    this.keywordMsg.type = 'msg';
                }
            },

            /* 向下获取信息 */
            async getDownFindList() {
                let id = null;
                id = id = this.keywordMsg[this.keywordMsg.length - 1].id;
                const formData = {
                    group: this.groupInfo.group_key,
                    id: parseInt(id) + 1,
                    type: 'more'
                };
                let {data} = await api.getChatRecord(formData);
                if (data.err_code === 0 && data.data) {
                    this.keywordMsg = this.keywordMsg.concat(data.data);
                    this.keywordMsg.type = 'msg';
                }
            },

            //消息置顶
            async SetTop(item) {
                let obj = {
                    chat_id: item.chat_id,
                    group_id: item.group_id
                };
                let {data} = await api.setMsgTop(obj);
                if (data.err_code == 0) {
                    this.filterSetTopList();
                }
            },
            filterSetTopList() {
                let list = localStorage.SysPushMsg ? JSON.parse(localStorage.SysPushMsg) : [];
                list.forEach((creent, index, arr) => {
                    if (creent.group == this.group_key) {
                        this.setTopData = creent.message;
                    }
                });
            },
            //回复消息
            ReplyFun(item) {
                this.isReplyFlag = true;
                let msg = item.message;
                let type = 'text';
                //输入框获得焦点
                if (item.message.indexOf('img') > 0) {
                    type = 'image';
                }
                document.getElementById('testInput').focus();
                if (item.message.indexOf('ReplyAnswer') > 0) {
                    let creatEl = document.createElement('div');
                    creatEl.innerHTML = item.message;
                    msg = creatEl.getElementsByClassName('ReplyAnswer')[0].innerHTML;
                }
                this.ReplyObj = {
                    QuestionerUserName: item.user_name || '--',
                    QuestionTime: item.date,
                    Question: msg,
                    Answer: null,
                    type: type
                };
            },
            //放大图片 点击图片跳转对应路由
            EnlargementFun(e) {

                let imgSrc = e.target.currentSrc;
                if (e.target.tagName == 'IMG') {
                    if (imgSrc.indexOf('#href') > 0) {
                        let obj = {};
                        let splitSrc = imgSrc.split('#')[1];
                        let itemStr = splitSrc.split(',');
                        itemStr.forEach((creent, index, arr) => {
                            obj[creent.split(':')[0]] = creent.split(':')[1];
                        });
                        if (obj.project) {
                            sessionStorage.projectID = obj.project;
                        }
                        switch (obj.href) {
                            case '/epibol/projectManage':
                                //更新导航
                                this.$bus.emit('changeMenuList', obj.id);
                                sessionStorage.projectID = obj.id;
                                this.$router.push('/project/task');
                                break;
                            case '/epibol/bidManage/singUp':
                                this.$router.push({
                                    path: '/epibol/ManageDetails',
                                    query: {enteredID: obj.id, TestID: obj.task, type: obj.type, navTitle: '已报名'}
                                });
                                break;
                            case '/epibol/bidManage/Invitation':
                                this.$router.push({path: '/epibol/bidManage', query: {tab: 1}});
                                break;
                            case '/epibol/contractManage':
                                this.$store.commit('getContractIDCommit', obj.contractID);
                                this.$router.push({path: '/epibol/contractDetails'});
                                break;
                            case '/customer/contractManage':
                                if (obj.network === '2') {
                                    if (Number(obj.status) <= 0 || (obj.status == 1 && (!obj.company_signServiceId || !obj.customer_signServiceId))) {
                                        this.$store.commit('getContractIDCommit', obj.id);
                                        this.$router.push('/epibol/addElectronicContract');
                                        this.$store.commit('setIsEdit', true);
                                    } else {
                                        this.$store.commit('getContractType', 2);
                                        this.$store.commit('getContractIDCommit', obj.id);
                                        this.$store.commit('getContractType', obj.network);
                                        this.$router.push({path: '/epibol/contractDetails'});
                                    }
                                } else {
                                    this.$store.commit('getContractIDCommit', obj.id);
                                    this.$store.commit('getContractType', obj.network);
                                    this.$router.push({path: '/epibol/contractDetails'});
                                }
                                break;
                            case '/epibol/statistics':
                                this.$router.push({name: 'eStatistics', params: {nowComp: obj.tabName}});
                                break;
                            case '/project/task':
                                this.$router.push({
                                    path: '/project/details',
                                    query: {project: obj.project, id: obj.id}
                                });
                                break;
                        }
                        //关闭对话框
                        this.$store.state.MsgIsShow = false;

                    } else if (e.target.className != "sina-emotion") {
                        this.modalObj.thisFlag = true;
                        this.modalObj.thisSrc = e.target.src;
                    }
                }
            },
            // 发送
            getSong(config) {
                const imgMsg = {
                    action: 'group-chat',
                    group_key: this.group_key,
                    group_id: this.groupInfo.group_id,
                    msg: config.obj,
                    user_id: JSON.parse(localStorage.userMsg).id,
                    remark_name: JSON.parse(localStorage.userMsg).realname || '--',
                    date: this.getTime(),
                    msg_type: config.msg_type
                };
                webSocket.send(JSON.stringify(imgMsg));
            },
            getFiles() {
                this.$store.state.blob = false;
            },
            getImage() {
                this.$store.state.blob = false;
            },
            // 获取历史信息
            async getMoreMsg() {
                let formData = {
                    group: this.group_key,
                    type: 'less'
                };
                if (this.datalist.length !== 0) {
                    formData.id = this.datalist[0].id;
                }
                let {data} = await api.getChatRecord(formData);
                if (data.err_code === 0 && data.data && data.data.length > 0) {
                    const lists = this.$store.state.useList;
                    let oldList = null;
                    oldList = data.data.reverse();
                    oldList.forEach(items => {
                        items.isRead = true;
                    });
                    if (this.isOneGetchat) {
                        this.$store.state.useList = oldList.concat(this.datalist);

                    } else {
                        this.$store.state.useList = oldList;
                    }
                    this.isOneGetchat = true;
                }
            },
            // 获取群成员
            async getPjUser() {
                let {data} = await api.getChatGroupUser({group_id: this.groupInfo.group_id});
                if (data.err_code === 0) {
                    data.data.push({realname: '全部', user_id: 'all'});
                    this.useList = data.data;
                    data.data.forEach((creent, index, arr) => {
                        if (creent.user_id == JSON.parse(localStorage.userMsg).id) {
                            this.userMsg = creent;
                        }
                        this.AssembleGroupList[creent.user_id] = creent;
                    });
                }
            },
            // 获取用户信息
            userMsge() {
                this.userMsg = JSON.parse(localStorage.userMsg);
                const obj = this.$store.state.useList;
                this.submitMsg(obj);
            },
            init() {
                $('.pace').click(function (event) {
                    $(this).sinaEmotion($('#testInput'));
                    event.stopPropagation();
                });
            },
            // 显示表情
            // 滚动到底模块
            // 滚动到底
            scrollToBottom() {
                // var times = setTimeout(() => {
                // 滚动条长度
                const documents = document.getElementsByClassName('realTime_interface')[0];
                const dcment = document.getElementsByClassName('gm-scroll-view')[0];
                let cententHeught = null;
                let scrollHeights = null;
                let currentDistance = null;
                if (dcment && documents) {
                    scrollHeights = documents.scrollHeight;
                    cententHeught = dcment.clientHeight;
                    currentDistance = scrollHeights - cententHeught;
                }

                // 当前滚动条距离顶部的距离
                var currentScrollY = null;
                if (dcment) {
                    currentScrollY = dcment.scrollTop;
                }
                if (currentDistance > 0 && currentDistance > currentScrollY) {
                    currentScrollY = Math.ceil((currentDistance - currentScrollY)) + currentScrollY;
                    currentScrollY = currentScrollY > currentDistance ? currentDistance : currentScrollY;
                    dcment.scrollTop = currentScrollY;
                    // this.scrollToBottom()
                }
            },
            // 鼠标滑轮事件
            getScoller() {
                const dcment = document.getElementsByClassName('gm-scroll-view')[0];
                const documents = document.getElementsByClassName('realTime_interface')[0];
                const cententHeught = dcment.clientHeight;
                const scrollHeights = documents.scrollHeight;
                const currentDistance = scrollHeights - cententHeught;
                const currentScrollY = dcment.scrollTop;
                if (currentDistance > 0) {
                    if (currentScrollY === 0) {
                        this.getMoreMsg();
                        this.$nextTick(() => {
                            dcment.scrollTop = 200;
                        });
                    }
                }
            },
            // 按下按钮所做的事
            keyIn(event) {
                var selection = getSelection();
                var ele = $('#testInput');
                this.sendShow = false;
                const e = window.event || event;
                if (e.code === 'Digit2' && e.shiftKey) {

                    // 保存光标信息
                    this.lastSelection = {
                        range: selection.getRangeAt(0),
                        offset: selection.focusOffset,
                        selection: selection
                    };
                    this.sendShow = true;
                    this.$nextTick(() => {
                        const contentsHeight = document.getElementsByClassName('send_information_person')[0].clientHeight;
                        const offset = ele.caret('position');
                        this.personPosi = {
                            left: offset.left + 'px',
                            top: offset.top - contentsHeight + 'px'
                        };
                    });

                } else if (e.code === 'Backspace') {

                    // 删除逻辑
                    // 1 ：由于在创建时默认会在 @xxx 后添加一个空格，
                    // 所以当得知光标位于 @xxx 之后的一个第一个字符后并按下删除按钮时，
                    // 应该将光标前的 @xxx 给删除
                    // 2 ：当光标位于 @xxx 中间时，按下删除按钮时应该将整个 @xxx 给删除。
                    const range = selection.getRangeAt(0);
                    const romoveParents = document.getElementById('testInput');
                    var removeNode = null;
                    if (range.startOffset <= 1 && range.startContainer.parentElement.className !== 'at-text') {
                        removeNode = range.startContainer.previousElementSibling;
                    }
                    if (range.startContainer.parentElement.className === 'at-text') {

                        removeNode = range.startContainer.parentElement;
                    }
                    // 删除@
                    if (removeNode) {
                        romoveParents.removeChild(removeNode);
                        let removeName = removeNode.innerText.substr(1, removeNode.innerText.length - 1);

                        if (this.is_all && removeName === '全部') {
                            // 删除所有
                            this.noticeArray = [];
                        } else {
                            // 删除@中成员
                            this.noticeArray = this.noticeArray.filter((item) => item.realname !== removeName);
                        }

                    }
                }
            },
            // @人员选择
            personDone(e) {
                if (e.user_id === 'all') {
                    this.is_all = true;
                    //  @全部 添加所有
                    const current_user_id = sessionStorage.userId;
                    const useList = this.useList.filter((item) => item !== current_user_id);
                    this.noticeArray = useList;
                } else {
                    this.is_all = false;
                    // @列表添加个人
                    this.noticeArray.push(e);
                }

                const person = e.realname;
                const personId = `person_${e.user_id}`;
                this.sendShow = false;
                document.getElementById('testInput').focus(); // 可编辑div获取光标
                // 获取之前保留下来的信息
                const lastSelection = this.lastSelection;
                const selection = lastSelection.selection;
                const range = lastSelection.range;
                const textNode = range.startContainer;
                // 删除@符号
                range.setStart(textNode, range.endOffset);
                range.setEnd(textNode, range.endOffset + 1);
                range.deleteContents();
                // 生成显示内容
                const spanNode = document.createElement('span');
                const spanNode1 = document.createElement('span');
                spanNode.setAttribute('style', 'color:#2196F3;');
                spanNode.className = 'at-text';
                spanNode.id = personId;
                spanNode.innerHTML = '@' + person;
                spanNode1.innerHTML = '&nbsp;';
                // 将生成内容打包放在 Fragment 中，并获取生成内容的最后一个节点，也就是空格。
                const frag = document.createDocumentFragment();
                var node;
                var lastNode;
                frag.appendChild(spanNode);
                while ((node = spanNode1.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                // 将 Fragment 中的内容放入 range 中，并将光标放在空格之后。
                range.insertNode(frag);
                selection.extend(lastNode, 1);
                selection.collapseToEnd();
            },
            // @查找
            getName() {
                if (this.messageNum !== 0) {
                    this.isShowMessage = true;
                } else {
                    this.isShowMessage = false;
                }
            },
            // 查看
            getSee() {
                this.isLook = true;
                this.getLook();
            },
            getSeed() {
                const index = this.messageNum;
                this.getLook();
            },
            getLook() {
                const list = Array.from(this.scollArray);
                // const firstScoll = list[index].offset
                this.readNum += 1;
                const useList = this.$store.state.useList;
                const listLocal = JSON.parse(localStorage.useList); // 获取本地储存数据
                useList.forEach((items, index) => {
                    if (items.isRead == false) { // 设有未读的
                        if (index == (list[this.readNum - 1])) { // 当前的数据index和储存@下标相同
                            items.isRead = true; // store里面 设为true
                            listLocal[index].isRead = true; // localstore 设为true
                        }
                    }
                });
                localStorage.useList = JSON.stringify(listLocal);
                const num = list[this.readNum - 1];
                const firstScoll = $('.Send_content').eq(num).offset().top;
                const dcment = document.getElementsByClassName('gm-scroll-view')[0];
                dcment.scrollTop = firstScoll;
                if (this.readNum > list.length - 1) {
                    this.isShowMessage = false;
                    this.readNum = 1;
                }
            },
            // 关闭标签
            closeMessage() {
                this.isShowMessage = false;
            },
            // 提交内容
            submit() {
                this.keywordMsg = null; // 关闭消息记录
                // this.sendMessageNotice()
                // $('.send_input').find('div').remove()
                this.sendShow = false; // 发送关闭@框
                let sendData = null;
                let elements = null;

                if ($('.send_input').html().includes('<img') && $('.send_input').html().includes('shanghai.aliyuncs.com')) {
                    elements = $('.send_input').html();
                } else {
                    elements = $('.send_input').html().replace(/<\/?.+?>/g, "");
                }
                if (elements != '') {
                    let msg_type = this.ReplyObj.type || 'text';
                    if (this.isReplyFlag) {
                        sendData = '<div class="ReplyQusetion"><p>' + this.ReplyObj.QuestionerUserName + '<span class="ReplyTime">' + this.ReplyObj.QuestionTime + '</span></p><p class="Replycontext">' + this.ReplyObj.Question + '</p></div><div class="ReplyAnswer">' + elements + '</div>';
                    } else {
                        sendData = elements;
                    }
                    const shuju = JSON.stringify({
                        action: 'group-chat',
                        group_key: this.group_key,
                        group_id: this.groupInfo.group_id,
                        msg: sendData,
                        user_id: JSON.parse(localStorage.userMsg).id,
                        realname: JSON.parse(localStorage.userMsg).realname || '--',
                        date: this.getTime(),
                        msg_type: msg_type,
                        msg_data: this.noticeArray || '',
                    });

                    this.$nextTick(() => {
                        webSocket.send(shuju);
                        this.scrollToBottom();
                        this.isReplyFlag = false;
                        this.testInput = null;
                        this.testInput = null;
                        $('.send_input').html('');
                    });
                } else {
                    this.$Message.error('消息不能为空！');
                    this.testInput = null;
                    $('.send_input').html('');
                }

            },
            // @功能
            sendMessageNotice() {
//                let obj = {
//                    active:'msg_data',
//                    noticeArray:this.noticeArray,
//                    type:'@'
//                }
//                webSocket.send(JSON.stringify(obj))
            },

            // 获取时间
            getTime() {
                const now = new Date(Date.now());
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                month = month < 10 ? ('0' + month) : month;
                var date = now.getDate();
                date = date < 10 ? ('0' + date) : date;
                var hour = now.getHours();
                hour = hour < 10 ? ('0' + hour) : hour;
                var minute = now.getMinutes();
                var second = now.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return year + '/' + month + '/' + date + ' ' + hour + ':' + minute + ':' + second;
            },

            /* 获取聊天列表 */
            submitMsg(list) {
                var newList = [];
                list.forEach((elements, index) => {
                    if (this.group_key === elements.group_key || this.group_key === elements.group) {
                        newList.push(elements);
                    }
                });
                // 把item.star = undefined 赋值false  避免修改值的时候list刷新导致滚动条回到最底部
                this.datalist = newList.map(item => {
                    if (!item.star) {
                        this.$set(item, 'star', false);
                    }
                    return item;
                });
//                this.datalist = newList
//                this.datalist = this.datalist.concat(list) ;
                this.filterSetTopList();
                this.getName();
                const that = this;
                this.$nextTick(() => {
                    that.scrollToBottom();
                });
            },
            // 获取字符串位置
            searchSubStr(str, subStr) {
                var positions = [];
                var pos = str.indexOf(subStr);
                while (pos > -1) {
                    positions.push(pos);
                    pos = str.indexOf(subStr, pos + 1);
                }
                return positions;
            },
            geyEmoji() {
                $('.Send_content').each(function () {
                    const elems = $(this).html();
                    $(this).html(elems).parseEmotion();
                });
            },
            isLogin() {
                if (localStorage.token) {
                    const msgData = JSON.stringify({
                        action: 'login',
                        token: localStorage.token
                    });
                }
            },

        }
    };
</script>
<style lang="less">
    .setTopMsg {
        background: #f8f9fa;
        height: 40px;
        line-height: 40px;
        padding-left: 27px;
        overflow: hidden;
        white-space: nowrap;
        span {
            margin-left: 5px
        }
        &:before {
            content: '';
            display: inline-block;
            width: 15px;
            height: 15px;
            background: url("../../assets/images/icoimg.png");
            background-position: 0 0;
            vertical-align: middle;
        }
    }

    .mySelfMsgSty {
        justify-content: flex-end;
        .W100 {
            text-align: right;
            margin-right: 10px;
        }
        .mySelfMsgBox {
            .Send_content {
                background: #17ceb1;
                color: #fff;
                &:after {
                    content: '\E74B';
                    position: absolute;
                    color: #17ceb1;
                    top: 8px;
                    right: -10px;
                    font-size: 10px;
                }
            }
            .operationBar {
                i {
                    margin-left: 5px;
                }
            }
        }
    }

    .otherMsgStyBox {
        min-height: calc(~"100% - 94px");
    }

    .otherMsgSty {
        justify-content: flex-start;
        .W100 {
            text-align: left;
            margin-left: 10px;
        }
        .messageBorder {
            border: 1px solid @gray;
            border-radius: 3px;
        }
        .mySelfMsgBox {
            .Send_content {
                background: #f8f9fa;
                color: @black_2;
                &:after {
                    content: '\e74c';
                    position: absolute;
                    color: #f8f9fa;
                    top: 8px;
                    left: -10px;
                    font-size: 10px;
                }
                .ReplyQusetion {
                    border-bottom: 1px solid #969696 !important;
                    padding-bottom: 2px;
                }
            }
            .VIPexclusiveSty {
                background: rgb(255, 233, 166) !important;
                color: @black_2 !important;
                &:after {
                    color: rgb(255, 233, 166) !important;
                }
            }
            .fileUploadDiv {
                .fileUploadSty {
                    background: @white;
                    padding: 5px !important;
                    .fileName {
                        border-bottom: 1px solid @black_4 !important;
                        .sendStatus {
                            opacity: 0 !important;
                        }
                        em {
                            color: @yellow
                        }
                    }
                    .fileStatus {
                        a {
                            color: @base !important;
                            &:hover {
                                cursor: pointer;
                                text-decoration: underline;
                            }
                        }
                    }
                }
            }
        }
    }

    .ReplyMsgSty {
        .mySelfMsgBox {
            .Send_content {
                background: #ffe9a6;
                color: @black_2;
                border: 1px solid #f7d059;
                &:after {
                    content: '\e74c';
                    position: absolute;
                    color: #ffe9a6;
                    top: 8px;
                    left: -10px;
                    font-size: 10px;
                }
                .ReplyQusetion {
                    border-bottom: 1px solid #f7d059;
                    padding-bottom: 2px;
                }
                .Replycontext {
                    padding: 5px 0;
                }
                .ReplyAnswer {
                    padding-top: 5px;
                }
            }
        }
    }

    .SysMsgSty {
        .mySelfDivSty {
            .mySelfName:before {
                content: '';
                background: url("../../assets/images/icoimg.png");
                height: 15px;
                width: 25px;
                display: inline-block;
                background-position: -352px 0;
                vertical-align: text-bottom;
            }
        }
        .mySelfMsgBox {
            .Send_content {
                background: #f8f9fa;
                border-radius: 3px;
                width: 100%;
            }
        }
    }

    .mySelfMsgSty, .otherMsgSty, .ReplyMsgSty, .SysMsgSty {
        display: flex;
        align-items: flex-start;
        margin-bottom: 25px;
        &:hover .operationBar {
            opacity: 1 !important;
        }
        .W100 {
            margin-top: 10px;
            width: 80%
        }
        .mySelfDivSty {
            font-size: 13px;
            .timeDate {
                color: #bdbdbd;
                margin-right: 10px;
                font-size: 12px
            }
            .star {
                color: @yellow;
                font-size: 14px;
            }
        }
        .mySelfMsgBox {
            .Send_content {
                position: relative;
                border-radius: 3px;
                font-size: 13px;
                display: inline-block;
                padding: 10px;
                margin-top: 5px;
                word-break: break-all;
                text-align: left;
                /*line-height: 20px;*/
                &:hover + .operationBar {
                    opacity: 1 !important;
                }
                .ReplyQusetion {
                    border-bottom: 1px solid #fff;
                    padding-bottom: 2px;
                    .Replycontext {
                        padding: 5px 0
                    }
                    .ReplyTime {
                        font-size: 12px !important;
                        margin-left: 10px
                    }
                }
                .ReplyAnswer {
                    padding-top: 5px;
                }
            }
            .fileUploadDiv {
                width: 100%;
                .fileUploadSty {
                    width: 100%;
                    .fileName {
                        border-bottom: 1px solid #fff;
                        padding-bottom: 10px;
                        em {
                            font-size: 35px
                        }
                        span {
                            margin-left: 10px
                        }
                    }
                    .fileStatus {
                        padding-top: 10px;
                        display: flex;
                        justify-content: space-between;
                        a {
                            color: #fff;
                            margin-right: 10px;
                            &:hover {
                                cursor: pointer;
                                text-decoration: underline;
                            }
                        }
                    }
                }
            }
            .operationBar {
                padding: 5px 0;
                opacity: 0;
                display: flex;
                li {
                    display: flex;
                    align-items: center;
                    margin-right: 15px;
                    span {
                        font-size: 12px;
                        color: #ccc;
                        display: flex;
                        align-items: center;
                        &.icon-addfloder {
                            &:before {
                                font-size: 18px;
                                margin-right: 0 !important;
                            }
                        }
                        &.Collection {
                            &:before {
                                color: #FFEB3B !important;
                            }
                        }
                        &:before {
                            margin-right: 3px;
                        }
                        &:hover {
                            cursor: pointer;
                            color: #a5a5a5 !important;
                        }
                    }
                }
            }
        }
        .chats-image {
            width: 40px;
            height: 40px;
            border-radius: 100%;
        }
    }

    .real_time_box {
        position: relative;

        width: 100%;
        height: 100%;
        .load_real {
            /*height: 80%;*/
            width: 100%;
            .vacancyBox {
                position: relative;
                width: 100%;
                height: 90%;
                .vacancy {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate3D(-50%, -50%, 0);
                }
            }
        }
        .load_real_auto {
            overflow-y: auto;
        }
        .send_information_box {
            /*height: 20%;*/
        }
        .realTime_interface {
            box-sizing: border-box;
            position: relative;
            width: 100%;
            padding: 10px;
            min-height: 100%;
        }
        .chat_load {
            display: inline-block;
            width: 100%;
            text-align: center;
            color: rgba(24, 191, 164, .8);
            cursor: pointer;
        }
    }

    .returnBtn {
        text-align: right;
        padding: 5px 10px;
        span {
            padding: 5px 10px;
            cursor: pointer;
            &:hover {
                cursor: pointer;
                color: @base;
            }
            .btn {
                margin-right: 5px;
            }
        }
    }

    .send_information_box,
    .send_information_emoji {
        position: relative;
        width: 100%;
        height: 100px;
    }

    .send_information_box {
        border-top: 1px solid @baseboard;
    }

    .send_message_remind {
        position: relative;
        width: 100%;
        height: 70px;
    }

    .send_message_children {
        position: absolute;
        top: -50px;
        left: 0;
        width: 100%;
        height: 50px;
        background: rgba(247, 247, 199, 1);
        z-index: 98;
    }

    .send_message_children > p:nth-child(1) {
        color: rgb(51, 51, 51);
        font-size: 14px;
        margin-left: 10px;
        line-height: 50px;
        float: left;
    }

    .send_message_children > p:nth-child(2) {
        color: rgb(255, 0, 0);
        font-size: 16px;
        float: right;
        font-weight: bold;
        line-height: 50px;
        margin-right: 16px;
        cursor: pointer;
    }

    .send_message_children > p:nth-child(3) {
        height: 30px;
        padding: 0 10px;
        line-height: 30px;
        border-radius: 10px;
        color: #ffffff;
        font-size: 14px;
        background: rgb(24, 191, 164);
        float: right;
        margin: 10px 80px 0 0;
        cursor: pointer;
    }

    .message_num {
        color: rgb(255, 0, 0);
        padding: 0 3px;
    }

    .message_nums {
        color: rgb(177, 177, 168);
    }

    .message_numed {
        padding-right: 3px;
    }

    .send_input {
        /* line-height: 0; */
        outline: none;
        border: none;
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: @black_2 !important;
        overflow-y: auto;
        text-indent: 0em;
        line-height: 20px;
        padding: 4px 8px;
        pre {
            color: @black_2 !important;
        }
    }

    .send_input:empty:before {
        content: '请输入沟通内容（@可指定接受消息人员）';
        color: #bbb;
    }

    .send_input:focus:before {
        content: none;
    }

    /*.send_Function_button {*/
    /*width: 100%;*/
    /*height: 50px;*/
    /*}*/

    .button_send {
        float: right;
        width: 90px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #ffffff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        /* pointer-events: none; */
        /*margin: 30px 10px 0 0;*/
        margin-right: 10px;
        background: rgba(24, 191, 164, .8)
    }

    .disable {
        pointer-events: none;
        background: rgba(231, 231, 231, .5);
    }

    .button_send:hover {
        background: rgba(24, 191, 164, 1)
    }

    .send_Function_button i {
        font-size: 18px;
        line-height: 20px;
        /* margin-left: 5px; */
        cursor: pointer;
    }

    .send_Function_button > div {
        float: left;
        margin-left: 5px;
    }

    .file_class_father {
        position: relative;
    }

    .file_class {
        opacity: 0;
        width: 18px;
        height: 18px;
        overflow: hidden;
        filter: alpha(opacity=0);
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        cursor: pointer;
    }

    #file_id {
        width: 100%;
        height: 40px;
        .searchBox {
            display: flex;
            position: absolute;
            top: 5px;
            right: 25px;
            padding-right: 30px;
            .searchDateList {
                width: 100px;
                margin-top: 1px;
                margin-right: 15px;
            }
            .externalSousuo {
                position: absolute;
                top: 7px;
                right: 0;
                &:hover {
                    color: @base !important;
                    cursor: pointer;
                }
            }
            p {
                margin-right: 25px;
            }
        }

    }

    #file_id .button {
        display: block;
        width: 20px;
        height: 20px;
        float: left;
        margin-top: 15px;
        margin-left: 15px;
        position: relative;
        &:hover {
            cursor: pointer;
            .iconfonts, .ivu-icon-scissors {
                color: @base !important;
            }
        }
    }

    .send_information_person {
        position: absolute;
        width: 100px;
        max-height: 200Px;
        z-index: 999999;
        overflow-y: auto;
        background: #ffffff;
        box-shadow: 0px 0px 16px #333333;
    }

    .scollr_person {
        height: 200px;
    }

    .send_ul_style {
        width: 100%;
        height: 100%;
    }

    .send_ul_style > li {
        width: 100%;
        height: 30px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #dddddd;
        background-clip: padding-box;
        min-height: 28px;
    }

</style>
