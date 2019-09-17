<template>
    <div class="real_time_room" :style="{height:(chatMsgBoxHeight-70)+'px'}">

        <template v-if="groupMembership">
            <!--左侧列表界面-->
            <div class="header_realTime_room">
                <div class="groupMembership">
                    <span class="iconfonts icon-jiahao addIcon" title="新建聊天" @click="accessGroup"></span>
                    <span id="starMessage" style="cursor: default;">
                        <Icon style="margin-right: 10px;" class="yellow" @click.native="getChatStarList" title="查看收藏的消息"
                              type="star" size="16"></Icon>
                        <span @click="tonoticeListShow" class='atstyle' title="查看@我的消息"
                              :class="{'redNoticeSign':msg_data&&msg_data!=='false'}">
                            @
                        </span>
                   </span>
                </div>
                <!-- 项目聊天列表 -->
                <ul class="memberList" @dragover="dragover($event)" @drop="drop($event)" :style="{height:(chatMsgBoxHeight-70-60)+'px'}">
                    <li draggable="true" @dragstart="drag($event)" v-for='(item, index) in chatMemberList'
                        :class="{'chatActive':active == index}" :key="index"
                        @click="memberActive(item,index)">
                        <!-- 未读消息标记 -->
                        <i v-if="item.unread > 0" id="messageNotice" class="signCount"></i>

                        <img v-if="item.type === 'user'"
                             :src="`${GLOBAL.imgDomain}/index.php?r=system/user/get-headimage&id=${item.user_id}`"
                             alt="">
                        <img v-else-if="item.type === 'group'" src="../../assets/images/groupHead.png" alt="">
                        <p class="text" :title="item.name">{{item.name||'--'}}</p>
                        <!-- 群设置 -->
                        <span v-if="item.master" class="exitChatGroup iconfonts icon-seting"
                              @click="accessGroup('seting',item.name,item)" :id="index === 0 ?'chatSeting':''"
                              title="设置"></span>
                        <!-- 退群 -->
                        <span v-else class="exitChatGroup iconfonts icon-toright" @click="leaveGroup(item)"
                              title="退出群组"></span>
                    </li>
                </ul>
            </div>
            <div class="body_realTime_room" :class="{'starAndNotice':starAndNotice}">
                <!-- 收藏 @列表 -->
                <div v-if="starAndNotice">
                    <div style="text-align: right;padding: 5px 10px" @click="starAndNotice = null">
                    <span style="padding: 5px 10px;cursor: pointer;">
                        <Icon type="chevron-left" style="margin-right: 5px;"></Icon>返回
                    </span>
                    </div>
                    <span  class="chat_load" v-if="starAndNotice.type === 'star'&&starAndNotice.length>=19"
                           @click="getMoreStar">
                        查看更多收藏
                    </span>
                    <div class="otherMsgSty" v-for="(item,index) in starAndNotice" :key="index"  >
                        <div>
                            <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id" class="chats-image"/>
                        </div>
                        <div class="W100" :class="{'messageBorder':starAndNotice.type === 'star'}"
                             @click="starToMsgList(item,index)"   >
                            <h5 v-if="starAndNotice.type !== 'star'">群：{{getGroupName(item)}}</h5>
                            <P class="mySelfDivSty">
                                <span class="mySelfName">{{item.user_name}}</span>
                                <span v-if="item.type === 'notice'" class="timeDate">{{item.date}}</span>
                                <span v-else class="timeDate">{{item.data?JSON.parse(item.data).date:''}}</span>

                            </P>
                            <div class="mySelfMsgBox"  >
                                <div class="Send_content iconfonts" v-html="item.message"></div>
                            </div>
                        </div>

                    </div>

                </div>
                <!--右侧聊天界面-->
                <template v-else >
                    <real-ymy  v-if="active == index"  v-for="(item, index) in chatMemberList" :key="index"
                               :group_key='group_key' :groupMaster="item" :starToMsgShow="starToMsgShow"
                               v-on:changGroup_key="changGroupKey"
                               :chatMsgBoxHeight="chatMsgBoxHeight"
                               @turnToNotice="turnNoticeFun" ></real-ymy>
                </template>

            </div>
        </template>

        <!--管理界面-->
        <group-membership  ref="groupMembership" :seting="is_seting" :isProject="isProject"
                           :currentGourpName="currentGourpName"
                           :turnToNoticeObj="turnToNoticeObj"
                           v-on:getChatMemberList="getChatMemberList"
                           v-on:groupMembershipShow="accessGroup"  v-else></group-membership>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex';
    import api from 'api';
    import realYmy from './realTime.vue';
    import groupMembership from './components/groupMembership';

    export default {
        props: {
            chatMsgBoxHeight: {
                type: Number,
                default: null
            },
            chatMsgBoxWidth: {
                type: Number,
                default: null
            }
        },
        data() {
            return {
                isProject: true,
                needGuideData: '',
                starPage: 2,
                starAndNotice: null,
                nowGroupInfo: null,
                msg_data: false, // @列表提示
                masterList: null,
                is_seting: false,
                chatMemberList: null,
                active: 0,
                headerList: [],
                group_key: null,
                group_id: null,
                nums: {},
                groupMembership: true,
                turnToNoticeObj: {},
                starToMsgShow: false,
                currentGourpName: null,
                DOM: null
            };
        },
        components: {
            realYmy,
            groupMembership
        },
        mounted(){
            this.bubbleChat();

            /* @消息触发 */
            this.$bus.on('msg_data', () => {
                this.msg_data = true;
                localStorage.msg_data_show = true;
            });

            /* 群已经被删 */
            this.$bus.on('groupRefreshList', () => {
                this.$Message.error('该群已被删除!');

                this.getChatMemberList();
            });
            // 群数量判断
            this.$bus.on('groupNumChange', (data) => {
                // let isNumChange = this.chatMemberList.some(item => item.group_key == data.group_key);
                // if (!isNumChange) {
                //     this.getChatMemberList();
                // }
            });

            /* 根据本地数据显示@ */
            this.localStorageNoticeShow();

        },
        computed: {
            ...mapState({
                unreadMessagesCount(value){
                    return value.unreadMessagesCount;
                }
            }),
            getList() {
                return this.$store.state.useList;
            },
            getGroupKey() {
                return this.$store.state.groupKey;
            },
            getUnreadList(){
                return this.$store.state.UnreadMsgList;
            }
        },
        watch: {
            getList(e) {
                this.getNewList(e);
                this.setUnreadGroupTag(e);
            },

            /* 星标 */
            unreadMessagesCount(value){
                this.chatMemberList.map((item, index)=>{
                    let is_sign_add = item.group_key === value.group_key&&item.user_id === value.user_id&&this.group_key !==value.group_key;
                    if (is_sign_add&&!item.sign) {
                        this.$set(item, 'sign', 1);
                    } else if ( is_sign_add&&item.sign ){
                        this.$set(item, 'sign', ++item.sign);
                    }
                });
            },
            getGroupKey(key){
                this.updataGroupKey(key);
            },
            group_id(value){
                //返回给后端最后一次聊天时间
                this.getVisit(value);
            }
        },
        methods: {
            ...mapMutations(['groupInfo', 'unreadMsgList']),
            async bubbleChat() {
                let {data} = await api.bubbleChat();
                if (data.err_code === 0) {
                    if (data.guide && data.guide === 'chat'){
                        this.needGuideData = true;
                    }


                    /* 加载群列表 */
                    await this.getChatMemberList();
                    if (data.guide && data.guide === 'chat') {
                        this.bubble();
                    }
                }
            },
            bubble() {
                let text = this.$lau.bubble.chatMessage;
                let defaultOptions = [
                    {
                        id: 'chatMessage',
                        position: 'right',
                        title: text[0].title,
                        content: text[0].content,
                        relative: 'body',
                    },
                    {
                        id: 'starMessage',
                        position: 'right',
                        title: text[1].title,
                        content: text[1].content,
                        relative: 'body',
                    },
                    {
                        id: 'chatSeting',
                        position: 'right',
                        title: text[2].title,
                        content: text[2].content,
                        relative: 'body',
                    },
                    {
                        id: 'messageNotice',
                        position: 'right',
                        title: text[3].title,
                        content: text[3].content,
                        relative: 'body',
                    },
                ];
                let fn = ((item) => {
                    if (item.id === 'messageNotice'){
                        this.chatMemberList = [];
                        this.needGuideData = '';
                        this.getChatMemberList();
                    }
                });
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$bubble(defaultOptions, fn);
                    });
                });
            },
            //拖动
            drag(e){
                this.DOM = e.currentTarget;
                e.dataTransfer.setData("Text", e.target.id);
            },
            dragover(e){
                e.stopPropagation();
                e.preventDefault();
            },
            drop(e){
                e.stopPropagation();
                e.preventDefault();
                let parentEL = null;
                if (e.target.nodeName == 'UL' && e.target.className == 'memberList'){
                    e.target.appendChild(this.DOM);
                    parentEL = e.target;
                } else {
                    let endIndex = null;
                    let endTarget = e.target;
                    let startIndex = e.dataTransfer.getData("Text");
                    if (e.target.tagName != 'LI'){endTarget = e.target.parentNode;}
                    endIndex = parseInt(endTarget.id);
                    parentEL = endTarget.parentNode;
                    if (startIndex > endIndex){
                        parentEL.insertBefore(this.DOM, parentEL.children[endIndex]);
                    } else if (startIndex < endIndex){
                        parentEL.insertBefore(this.DOM, parentEL.children[endIndex+1]);
                    }
                }
                let liArr = parentEL.getElementsByTagName('li');
                for (let i=0;i<liArr.length;i++){
                    liArr[i].id = i;
                }
            },
            //群列表
            getChatMemberList() {
                if (localStorage.client_id) {
                    return new Promise(async (resolve, reject) => {
                        let {data} = await api.chatInit({client_id: localStorage.client_id, needGuideData: this.needGuideData});
                        // console.log('getchatMemberList:',JSON.stringify(data))
                        if (data.err_code === 0 && data.data) {
                            if (data.data.length > 0) {
                                data.data.forEach((Acreent, index, arr) => {
                                    this.getUnreadList.forEach((Bcreent, index, arr) => {
                                        if (Acreent.group_id == Bcreent.group_id) {
                                            Acreent.unread = Bcreent.unread;
                                        }
                                    });
                                });
                                this.chatMemberList = data.data;

                                this.groupInfo(data.data[0]);
                                this.nowGroupInfo = data.data[0];
                                this.getChatMasters();
                                if (this.getGroupKey) {
                                    this.updataGroupKey(this.getGroupKey);
                                } else {
                                    this.updataGroupKey(data.data[0].group_key);
                                }
                                resolve();
                            }
                        }
                    });
                }
            },
            // 群管理列表
            async getChatMasters(){
                let {data} = await api.getChatMasters();
                if (data.err_code === 0){
                    this.masterList = data.data;
                    data.data.forEach((master, index)=>{
                        if (this.chatMemberList){
                            this.chatMemberList.map((item, idx) => {
                                if (master.group_id === item.group_id && master.is_master == 1){
                                    this.$set(item, 'master', true);
                                }
                            });
                        }
                    });
                }
            },
            //消息转通知
            turnNoticeFun(data){
                if (data){
                    this.turnToNoticeObj = {
                        message_id: data.chat_id,
                        group_id: data.group_id,
                        users: []
                    };
                }
                this.groupMembership = !this.groupMembership;
            },
            // 进入群设置
            accessGroup(type, name, item) {
//                if(!this.seting&&item){
//                    this.memberActive(item,index)
//                }
                this.groupMembership = !this.groupMembership;
                if (item && item.project_id){
                    this.isProject = false;
                } else if (item){
                    this.isProject = true;
                }
                // 设置或创建
                if (type === 'seting'){
                    this.is_seting = true;
                    this.currentGourpName = name;
                } else {
                    this.is_seting = false;
                }
            },

            /* 点击收藏群 */
            starToMsgList(item){

                if (this.starAndNotice.type ==='star'){
                    this.starAndNotice.type ='msg';
                    this.changGroupKey(item);
                }
            },

            /* 进入收藏群 */
            changGroupKey(item){
                this.starAndNotice = null;
                this.group_key = null;
                this.group_key = JSON.parse(item.data).group_key;
                this.chatMemberList.map((items, index) => {
                    if (items.group_key === this.group_key){
                        this.memberActive(items, index, 'star');
                    }
                });
                this.starToMsgShow = item; // 触发右侧事件
            },

            /* 添加更多收藏 */
            async getMoreStar() {
                //
                // console.log(this.starAndNotice.num,777)
                // if (!this.starAndNotice.num) {
                //     this.starAndNotice.num = 2
                // } else {
                //     this.starAndNotice.num = this.starAndNotice.num + 1
                //
                // }

                let {data} = await api.getChatStarList({page: this.starPage});
                if (data.err_code === 0 && data.data && data.data.length > 0) {
                    this.starAndNotice = data.data.concat(this.starAndNotice);
                    this.starAndNotice.type = 'star';
                    this.starPage += 1;
                }
            },
            // 数据更新，更新类容最前
            getNewList(e) {
                const lt = e.length - 1;
                const obj = e[lt];
                const list = this.headerList;
                const headOne = list[0];
                if (obj) {
                    list.forEach((item, index) => {
                        const objName = `project_${item.id}`;
                        if (objName === obj.group_id) {
                            if (index > 0) {
                                list.splice(index, 1);
                                list.splice(0, 1);
                                list.unshift(item);
                                list.unshift(headOne);
                            }
                        }
                    });
                }
                this.$set(this, 'headerList', list);
            },

            /* 离开群 */
            async leaveGroup(item){
                let {data} = await api.quitChatGroup({group_id: item.group_id});
                if (data.err_code === 0){

                    this.getChatMemberList();
                }
            },

            /*member列表active效果*/
            memberActive(item, index, star) {
                this.starToMsgShow = false;
                //当前群组未读消息置空
                item.unread = 0;
                // vuex存储点击的群组信息
                this.groupInfo(item);

                // 修改key 子组件监听key
                this.group_key = item.group_key;
                this.group_id = item.group_id;
                this.active = index;
                this.nowGroupInfo = item;
                this.checkUnreadMessage();

            },
            //检查全局是否有未读消息  额点问题再说
            checkUnreadMessage(){
                let unReadMessage = false;
                this.chatMemberList.forEach((item, index)=>{
                    if (item.unread && item.unread != 0) {
                        unReadMessage = true;
                       // console.log(index+JSON.stringify(item)+'flag:'+unReadMessage);
                        //break
                    }
                });
                !unReadMessage &&　(this.$store.state.unreadMessagesCount = null);

            },
            //打开某聊天群组页面记录
            async getVisit(groupID){
                if (this.needGuideData){
                    return;
                }
                let {data} = await api.getVisitGroup({group_id: groupID});
                if (data.err_code == 0){
                    // console.log(data)
                }
            },
            // 获取收藏列表
            //更新groupKey
            updataGroupKey(key){
                let dataArr = this.chatMemberList;
                //转发 重新设置groupKey  默认第一个
                if (dataArr.length > 0){
                    for (let i=0;i<dataArr.length;i++){
                        if (dataArr[i].group_key == key){
                            this.active = i;
                            this.group_key = key;
                            this.group_id = dataArr[i].group_id;
                            break;
                        }
                    }
                }

            },
            // 收藏列表
            async getChatStarList(){
                this.starPage = 2;
                let {data} = await api.getChatStarList();
                if (data.err_code === 0 ){
//                    this.$bus.emit('getChatStarList',data)
                    this.starAndNotice = data.data;
                    this.starAndNotice.type = 'star';
                }
            },

            /* 进入@列表 */
            tonoticeListShow(){
//                this.$bus.emit('noticeListShow')

                this.msg_data = false;
                localStorage.msg_data_show = false;
                this.noticeListShow();

            },

            /* 具体展示 */
            noticeListShow(){
                if (localStorage.msg_data){
                    let msg_data = JSON.parse(localStorage.msg_data);
                    msg_data.map((item, index) => {
                        item.type = 'notice';
                    });
                    this.starAndNotice = msg_data;
                    // console.log(997,msg_data)
                    this.starAndNotice.type = 'notice';

                }
            },

            /* 读取本地存储的@ */
            localStorageNoticeShow(){

                this.msg_data = localStorage.msg_data_show;

             /*   const user_id = sessionStorage.userId
               if(localStorage.msg_data){
                   JSON.parse(localStorage.msg_data).map((items) => {
                       if(items.msg_data){
                           items.msg_data.map((item,index) => {
                               if(user_id === item.user_id){
                                   this.msg_data = true
                               }
                           })
                       }

                   })
               }*/
            },

            /*有新消息时 设置未读标识*/
            setUnreadGroupTag(e){
                let newMsg = e[e.length-1];
                this.chatMemberList.forEach((creent, index, arr)=>{
                    if (newMsg.group_id == this.group_id && creent.group_id == this.group_id){
                        creent.unread = 0;
                    } else if (creent.group_id == newMsg.group_id){
                        creent.unread = 1;
                    }
                });
            },
            getGroupName(item){
                let {name} = this.chatMemberList.find(chat=>chat.group_key === item.group_key);
                return name;
            }
        }
    };
</script>
<style lang="less" scoped>
    .real_time_room {
        width: 100%;
        /*height: 805px;*/
        display: flex;
        .header_realTime_room {
            width: 24%;
            .groupMembership {
                display: flex;
                height: 60px;
                padding: 0 20px 0 30px;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #efefef;

                .addIcon{
                    color: @base;
                    cursor: pointer;
                }
                .yellow{
                    color: @yellow;
                    cursor: pointer;
                }
                .atstyle{
                    color: @black_3;
                    font-size:16px;
                    cursor: pointer;
                }

            }
            .memberList {
                /*height: 90%;*/
                overflow: auto;
                li {
                    position: relative;
                    display: flex;
                    height: 55px;
                    padding: 0 20px 0 30px;
                    align-items: center;
                    justify-content: space-around;
                    cursor: default;
                    img {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                    }
                    .signCount {
                        position: absolute;
                        left: 13px;
                        display: block;
                        width: 8px;
                        height: 8px;
                        background: #ff5252;
                        border-radius: 100%;
                    }
                    .iconfonts{
                        &:hover{
                            color: @base;
                            cursor: pointer;
                        }
                    }
                    .exitChatGroup{
                        visibility: hidden;
                    }
                    &:hover {
                        background: #f8f9fa;
                    }
                }
                .chatActive {
                    background: #f8f9fa;
                    .exitChatGroup{
                        visibility: visible;
                    }
                }
                .text{
                    width: 100px;
                    padding: 0 5px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }

            }

            /*过去的项目群列表*/
            .projectList {
                /*height: 100%;*/
                overflow: auto;
                li {
                    width: 100%;
                    height: 75px;
                    line-height: 75px;
                    color: @black_2;
                    font-size: 14px;
                    text-align: center;
                    cursor: pointer;
                    &.ymy_is_active {
                        color: #000000 !important;
                        background: #f8f9fa;
                    }
                }
            }
        }
        .body_realTime_room {
            width: 76%;
            border-left: 1px solid #efefef;
        }
        .starAndNotice{
            overflow-y: auto;
        }
    }

    .message_style {
        position: absolute;
        top: 28px;
        right: 20px;
        padding: 0 5px;
        height: 20px;
        line-height: 20px;
        background: @red;
        border-radius: 10px;
        color: #ffffff;
        align-items: center;
    }

</style>
