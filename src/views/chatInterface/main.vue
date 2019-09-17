<template >
    <div id="chatMsg"  v-if="MsgFlag.MsgIsShow" :style="{height:chatMsgBoxHeight + 'px'}"  @contextmenu="whichButton($event)" @click="EventListener($event)">
        <!-- 2019.05.27 隐藏聊天框内【消息】图标 -->
        <!-- <div class="msg_button_fix" id='drag_msg' @mousedown="downs">消息<span class="showNumbers" v-if="allNum">{{allNum}}</span></div> -->
        <div class="real_all" >
            <div class="clearfix real_header_box" @mousedown="mousedown" @mouseup="mouseup">
                <div class="header_project" id="chatMessage"  :class="{'project_is_actice':MsgFlag.MsgTabIndex==0}" @click="MsgFlag.MsgTabIndex = 0;settingFlag=false">
                    <p class="chat_image_father">
                        <img src='../../assets/images/chat-icon.png' class='header_project_image'/>
                        <!--<span class='msg-identifi' v-if="nums"></span>-->
                    </p>
                    <p class="header_chat_name">项目沟通</p>
                </div>
                <div class="header_project" id="header_project"  :class="{'project_is_actice':MsgFlag.MsgTabIndex==1}" @click="MsgFlag.MsgTabIndex = 1;settingFlag=false">

                    <Badge :count="noticeNum.total">
                        <p class="chat_image_father">
                            <img src='../../assets/images/chat-icon1.png' class='header_project_image'/>
                            <!--<span class='msg-identifi' v-show="MsgIdx"></span>-->
                        </p>
                        <p class="header_chat_name">消息提醒</p>
                    </Badge>
                </div>
                <ul class="left-option">
                    <li @click="settingFlag=!settingFlag" v-if="MsgFlag.MsgTabIndex == 1">
                        <i class="iconfonts icon-ymy-setup-copy"></i>
                    </li>
                    <li @click="closeMsg">
                        <i class="iconfonts icon-ymy-reduction-copy"></i>
                    </li>
                </ul>
            </div>
            <real-message :chatMsgBoxHeight="chatMsgBoxHeight" v-if="MsgFlag.MsgTabIndex == 0"></real-message>
            <remind v-else :chatMsgBoxHeight="chatMsgBoxHeight" :settingFlag="settingFlag" ></remind>
        </div>
    </div>
</template>
<script>
    import 'jquery.caret/dist/jquery.caret.min.js'; // caret插件
    import './jquery-sina-emotion.min.js'; // 新浪表情js
    import 'jquery-sina-emotion/dist/jquery-sina-emotion.min.css'; // 新浪表情css
    import realMessage from './realMessage.vue';
    import remind from './remindMsg.vue';
    import {mapState, mapMutations} from 'vuex';
    import api from 'api';
    export default {
        props: {
            MsgFlag: {
                type: Object,
                default: {
                    MsgIsShow: false,
                    MsgTabIndex: null
                }
            },
            chatMsgBoxHeight: {
                type: Number,
                default: 0
            },
            chatMsgBoxWidth: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                isShow: this.MsgFlag.MsgIsShow,
                allNum: 0,
                nums: 0,
                MsgIdx: 0,
                search: '',
                settingFlag: false,
                startX: null,
                startY: null,
                left: null,
                top: null
            };
        },
        components: {
            realMessage,
            remind
        },
        computed: {
            ...mapState({
                noticeNum(app){
                    return app.notice.noticeNum;
                }
            }),

            getList () {
                return this.$store.state.nums;
            },
            getNum () {
                return this.$store.state.msgNum;
            },
            getUseList () {
                return this.$store.state.useList;
            },
            getNotic () {
                return this.$store.state.noticeList;
            },
            getStateList () {
                return this.$store.state.app.searchStred;
            }
        },
        watch: {
            totalNumber(){
                console.log(999);
            },
            getList (e) {
                const nums = e;
                var index = 0;
                for (let i in nums) {
                    index+= Number(nums[i]);
                }
                this.nums = index;
            },
            getUseList (e) {
                this.getAllMsg();
            },
            getNotic (e) {
                this.getAllMsg();
            },
            getNum (e) {
                this.MsgIdx = JSON.parse(e);
            },
            getStateList (e) {
                this.search = '';
            }
        },
        mounted () {
            this.unreadMsg();
            //  切换聊天框显隐
            this.$bus.on('MsgIsShowTrue', ()=>{
                this.$store.state.MsgIsShow = !this.$store.state.MsgIsShow;
                // 打开聊天框
                if ( localStorage.msg_data){
                    this.$bus.emit('msg_data');
                }
            });
        },
        methods: {
            ...mapMutations(['setIsSetShow']),
            whichButton(event){
                if (window.event) {
                    event = window.event; //处理兼容性，获得事件对象
                    event.returnValue = false;
                } else {
                    event.preventDefault();
                }
            },
            EventListener(event){
                event.stopPropagation();
            },
            // getSou
            getSou () {
                this.$bus.emit('msg', this.search);
            },
            // 获取总数
            getAllMsg (){
                const list = this.$store.state.useList;
                var index = 0;
                var length = 0;
                if (localStorage.numList) {
                    const numForm = JSON.parse(localStorage.numList);
                    for (let i in numForm) {
                        index+=numForm[i];
                    }
                }
                if (localStorage.noticeList) {
                    length = JSON.parse(localStorage.noticeList).length;
                }
                if (!this.isShow) {
                    this.allNum = list.length - index + length;
                } else {
                    this.allNum = 0;
                }
            },
            // 获取未读消息
            async unreadMsg () {
                const list = this.$store.state.noticeList;
                var leng = 1;
                if (list.length) {
                    leng = list.length - 1;
                }
                const items = {
                    index: leng,
                    size: 30,
                };
                let {data} = await api.getChartUnreadMsgList(items);
                if (data.err_code == 0){
                    const userList = data.data;
                    const list = this.$store.state.noticeList;
                    var lists = [];
                    if (list) {
                        lists = userList.concat(list);
                    }
                    const listFrom = {};
                    var index = 0;
                    lists.forEach(items => {
                        if (items.state === '0') {
                            if (!listFrom[items.type]) {
                                listFrom[items.type] = 0;
                            }
                            listFrom[items.type]+= 1;
                        }
                    });
                    for (let i in listFrom) {
                        index+= listFrom[i];
                    }
                    this.MsgIdx = index;
                }
            },
            downs (e) {
                const windHight = $(window).height(); // 获取当前可视化窗口高度
                const windWidth = $(window).width(); // 获取当前可视化窗口宽度
                const elements = document.getElementById('drag_msg');
                const odivHeight = elements.clientHeight; // 获取元素高度
                const odivWidth = elements.clientWidth; // 获取元素宽度
                const firstTime = new Date().getTime(); // 定义一个开始时间
                let odiv = e.target;  // 获取目标元素
                // 算出鼠标相对元素的位置
                let disX = e.clientX - odiv.offsetLeft;
                let disY = e.clientY - odiv.offsetTop;
                const fun = function(e) {
                    // 鼠标按下并移动的事件
                    // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    var left = e.clientX - disX;
                    var top = e.clientY - disY;
                    if (windWidth - e.clientX - odivWidth < 5) {
                        left = windWidth - odivWidth;
                    } else if (e.clientX - disX< 0) {
                        left = 0;
                    }
                    if (windHight - e.clientY - odivHeight < 5) {
                        top = windHight - odivHeight;
                    } else if (e.clientY - disY < 0) {
                        top = 0;
                    }
                    // 移动当前元素
                    odiv.style.left = left + 'px';
                    odiv.style.top = top + 'px';
                };
                const that = this;
                const upFun = function(e) {
                    const lastTime = new Date().getTime();
                    if (lastTime - firstTime < 200) {
                        document.onclick = that.geMsg();
                    }
                    document.removeEventListener('mousemove', fun, false);
                    document.removeEventListener('mouseup', fun, false);
                };
                document.addEventListener('mousemove', fun, false);
                document.addEventListener('mouseup', upFun, false);

            },
            // 关闭信息
            geMsg () {
                this.isShow = true;
                this.allNum = 0;
            },
            // 关闭
            closeMsg () {
                this.$store.commit('setMsgIsShow', false);
                // this.$store.state.MsgIsShow = false;
                // this.MsgFlag.MsgIsShow = false;
                // this.$store.commit('setGroupKey',item.group_key);
            },
            mousedown(e){
                let _this = this;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.left = document.getElementById('chatMsg').offsetLeft;
                this.top = document.getElementById('chatMsg').offsetTop;

                document.body.addEventListener('mousemove', _this.mouseMove);
            },
            mouseMove(e){
                let _this = this;
                let moveX = (e.clientX - _this.startX + _this.left) + 'px';
                let moveY = (e.clientY - _this.startY + _this.top) + 'px';
                $('#chatMsg').css({
                    left: moveX,
                    top: moveY,
                });
            },
            mouseup(){
                let _this = this;
                document.body.removeEventListener('mousemove', _this.mouseMove);
            }
        }
    };
</script>
<style lang="less">
    .msg_button_fix{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        color: #ffffff;
        text-align: center;
        font-size: 16px;
        line-height: 50px;
        background: rgb(24,191,164);
        cursor: pointer;
        position:fixed;
        bottom: 200px;
        right: 20px;
        margin-bottom: -25px;
        z-index: 999;
        box-shadow: 0px 2px 19px rgb(231,231,231);
    }
    /*.msg_button_fix:hover {*/
    /*animation: myfix 2s ease-in-out 0s 1 alternate forwards;*/
    /*}*/
    .msg-identifi{
        display: inline-block;
        width: 8px;
        height: 8px;
        background: @red;
        border-radius: 50%;
        position:absolute;
        top: 5px;
        right: 20px;
    }
    @keyframes myfix {
        0% {
            opacity: .5;
            width: 50px;
            height: 50px;
        }
        50%{
            opacity: .6;
            width: 55px;
            height: 55px;
            line-height: 55px;
        }
        100%{
            opacity: 1;
            width: 50px;
            height: 50px;
            line-height: 50px;
        }
    }
    #chatMsg{
        border-radius: 3px;
        /*overflow: hidden;*/
        box-shadow: -4px 4px 10px 1px #9E9E9E;
        position: fixed;
        top: 52px;
        right: 30px;
        height: auto;
        /*height: 875px;*/
        width: 808px;
        z-index: 999;
        background: #ffffff;
        transition: right .3s linear;
    }
    .real_header_box{
        width: 100%;
        height: 70px;
        background:url('../../assets/images/chat.png');
        background-size: 100% 100%;
        cursor: move;
    }
    .header_project{
        float: left;
        font-size: 16px;
        height: 70px;
        text-align: center;
        width: 80px;
        margin-left: 20px;
        cursor: pointer;
        color: #ffffff;
    }
    .chat_image_father{
        width: 100%;
        height: 23px;
        margin-top: 10px;
        position: relative;
    }
    .header_project_image{
        width: 20px;
        height:23px;
    }
    .header_chat_name{
        width: 100%;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        margin-top: 5px;
    }
    .project_is_actice{
        background: rgb(50,195,171);
    }

    .left-option{
        display: flex;align-items: center;float: right;height: 100%;margin-right:16px;
        li{
            padding:0 10px;height: 100%;display: flex;align-items: center;
            i{font-size: 20px;color: #ffffff;cursor: pointer;font-style: normal};
            .searchText{margin-right: 10px;width: 150px;
                // transition: width 2s;
            }
        }
    }

    .newLiClass{
        background: rgb(133,207,173);
    }
    .showNumbers{
        display: block;
        height: 30px;
        width: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 50%;
        background: rgba(255,153,0,1);
        color: #ffffff;
        position: absolute;
        top: -13px;
        right: -13px;
    }
    .inputHidden {
        /*width: 0;*/
        /*height: 45px;*/
        /*position: absolute;*/
        /*right: 40px;*/
        /*top: 0;*/
        /*overflow: hidden;*/
        /*transition: width 2s;*/
        /*-moz-transition: width 2s;	!* Firefox 4 *!*/
        /*-webkit-transition: width 2s;	!* Safari 和 Chrome *!*/
        /*-o-transition: width 2s;	!* Opera *!*/
    }
    .inputClass {
        width: 250px;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
    }
    .realTime_message,.realTime_message_own{
        box-sizing: border-box;
        width: 100%;
        height: 30px;
    }
    .realTime_message{
        padding-left: 10px;
    }
    .realTime_message_own{
        padding-right: 10px;
        color: #bdbdbd;
    }
    .chats-image-left,
    .chats-image-right{
        /*width: 40px;*/
        /*height: 40px;*/
        /*margin-top: 5px;*/
        /*border-radius: 50%;*/
        /* float: left; */
    }
    .chats-image-left{
        float: left;
    }
    .chats-image-right{
        /*float: right;*/
    }
    .ko{
        margin-bottom: 10px;
    }
    .chat-msg-left{
        float: left;
        margin-top: 5px;
    }
    .chat-msg-right{
        float: right;
        margin-top: 5px;
    }
    .realTime_message>p{
        float: left;
        line-height: 30px;
    }
    .realTime_message_own>p{
        float: right;
        line-height: 30px;
    }
    .realTime_time{
        font-size: 13px;
        color: #bdbdbd;
    }
    .realTime_time_text{
        font-size: 13px;

        margin: 0 5px;
        color: #777;
    }
    /* .triangle_type,
    .triangle_type_own{
      width: 0;
      height: 0;
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
    } */
    .triangle_type{
        color: rgb(248,249,250);
        margin: 8px 0 0 5px;
        font-size: 8px;
        float: left;
    }
    .triangle_type_own{
        float: right;
        color: #3bceb6;
        font-size: 8px;
        margin: 8px 5px 0 0;
    }
    .Send_content{
        /*display: inline-block;*/
        /*padding:10px;*/
        /*border-radius: 4px;*/
        /*font-size: 12px;*/
        /* min-height: 50px; */
    }
    .is_own_float{
        float: right;
    }
    .chat-own-no {
        float: left;
    }
    .is_own_no{
        background: rgb(248,249,250);
    }
    .chat-own{
        float: right;
    }
    .is_own{
        background: #3bceb6;
        color: #ffffff;
    }
    .clearfix:after{
        content:"";
        height:0;
        line-height:0;
        display:block;
        visibility:hidden;
        clear:both;
    }
    .img_screenshot{
        width: 200px;
    }

</style>
<style lang='less'>
    .inputHidden>div{
        width: 100%;
        height: 100%;
        & .ivu-input{
            width: 100%;
            height: 100%;
        }
    }
</style>

