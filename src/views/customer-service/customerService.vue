<template>
    <div @click="EventListener($event)">
        <div v-show="showOrhideFlag" id="customerMain" class="customerMain" @contextmenu="whichButton($event)">
            <div class="chatHead">
                <span class="title">在线客服</span>
                <span class="iconfonts icon-cuowu close" @click="closeCustomer" title="结束当前会话"></span>
            </div>
            <div class="chatContent">
                <div class="CustomerMsg" id="CustomerMsg">
                    <p class="SeeMore" v-if="showMoreFlag" @click="getChatMsgLog">查看更多历史记录</p>
                    <ul v-for="(msg,index) in creentClientMsgList" :key="index">
                        <!--文本样式-->
                        <li class="mySelfMsgSty" v-if="msg.action === 'service-chat' && msg.msg_type === 'text' && msg.type === 'user'">
                            <div class="msgInfo">
                                <span class="timeDate">{{msg.time}}</span>
                                <span style="font-size: 13px">我</span>
                                <div class="mySelfMsgBox">
                                    <div class="Send_content iconfonts">
                                    <pre style="margin: 0px; white-space: normal; line-height: 20px;">
                                        {{msg.message}}
                                    </pre>
                                    </div>
                                </div>
                            </div>
                            <div class="headImg"><img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+msg.client_user_id"></div>
                        </li>
                        <li class="otherMsgSty" v-else-if="msg.action === 'service-chat' && msg.msg_type === 'text' && msg.type === 'service'">
                            <div class="headImg"><img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+msg.service_user_id"></div>
                            <div class="msgInfo">
                                <span style="font-size: 13px">客服</span>
                                <span class="timeDate">{{msg.time}}</span>
                                <div class="otherMsgBox">
                                    <div class="Send_content iconfonts">
                                    <pre style="margin: 0px; white-space: normal; line-height: 20px;">
                                        {{msg.message}}
                                    </pre>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <!--图片样式-->
                        <li class="mySelfMsgSty" v-if="msg.action === 'service-chat' && msg.msg_type === 'image' && msg.type === 'user'">
                            <div class="msgInfo">
                                <span class="timeDate">{{msg.time}}</span>
                                <span style="font-size: 13px">我</span>
                                <div class="mySelfMsgBox">
                                    <div class="Send_content iconfonts" @click="EnlargementFun($event)">
                                    <pre style="margin: 0px; white-space: normal;">
                                        <img style="max-width: 260px; max-height: 140px; border-radius: 4px;cursor: pointer" :src="msg.message"/>
                                    </pre>
                                    </div>
                                </div>
                            </div>
                            <div class="headImg"><img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+msg.client_user_id"></div>
                        </li>
                        <li class="otherMsgSty" v-else-if="msg.action === 'service-chat' && msg.msg_type === 'image' && msg.type === 'service'">
                            <div class="headImg"><img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+msg.service_user_id"></div>
                            <div class="msgInfo">
                                <span style="font-size: 13px">客服</span>
                                <span class="timeDate">{{msg.time}}</span>
                                <div class="otherMsgBox">
                                    <div class="Send_content iconfonts" @click="EnlargementFun($event)">
                                    <pre style="margin: 0px; white-space: normal;">
                                        <img style="max-width: 260px; max-height: 140px; border-radius: 4px;cursor: pointer" :src="msg.message"/>
                                    </pre>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <!--文件样式-->
                        <li class="mySelfMsgSty" v-if="msg.action === 'service-chat' && msg.type === 'user' && msg.msg_type === 'file'">
                            <div class="msgInfo">
                                <span class="timeDate">2019-03-22 14:25:50</span>
                                <span style="font-size: 13px">我</span>
                                <div class="mySelfMsgBox">
                                    <div class="Send_content iconfonts fileUploadDiv">
                                        <div class="fileUploadSty">
                                            <div class="fileName">
                                                <em class="iconfonts icon-uniE914"></em>
                                                <span>{{JSON.parse(msg.msg_data).fileName}}</span>
                                                <span>{{JSON.parse(msg.msg_data).fileSize}}</span>
                                            </div>
                                            <div class="fileStatus">
                                                <span class="sendStatus">已发送</span>
                                                <span><a :href="msg.message">下载</a></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="headImg"><img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+msg.client_user_id"></div>
                        </li>

                        <li class="otherMsgSty" v-else-if="msg.action === 'service-chat' && msg.type === 'service' && msg.msg_type === 'file'">
                            <div class="headImg"><img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+msg.service_user_id"></div>
                            <div class="msgInfo">
                                <span style="font-size: 13px">客服asdsadad</span>
                                <span class="timeDate">{{msg.time}}</span>
                                <div class="otherMsgBox">
                                    <div class="Send_content iconfonts fileUploadDiv">
                                        <div class="fileUploadSty">
                                            <div class="fileName">
                                                <em class="iconfonts icon-uniE914"></em>
                                                <span>{{JSON.parse(msg.msg_data).fileName}}</span>
                                                <span>{{JSON.parse(msg.msg_data).fileSize}}</span>
                                            </div>
                                            <div class="fileStatus">
                                                <span class="sendStatus">已发送</span>
                                                <span><a :href="msg.message">下载</a></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <!--系统消息样式-->
                        <li class="SysMsgSty" v-if="
                    (msg.action === 'service-chat' && msg.type === 'user' && msg.message === '客服已接入') ||
                    (msg.action === 'service-chat' && msg.status === 'fail') ||
                    (msg.action === 'service-chat' && msg.type === 'user' && msg.service_user_id == 0 && msg.msg_type == null) ||
                    (msg.action === 'service-chat' && msg.type === 'user' && msg.message === '服务已结束')
                    ">
                            <div class="headImg" style="width: 40px;height: 40px"></div>
                            <div class="msgInfo">
                                <P class="mySelfDivSty">
                                    <span class="mySelfName"> 系统消息</span>
                                    <span class="timeDate"> {{msg.time}} </span>
                                </P>
                                <div class="mySelfMsgBox">
                                    <div class="Send_content">
                                        {{msg.message}}
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!--要使用表情必须用Form标签  我日-->
                <form onsubmit="return false">
                    <div class="chatInputBox">
                        <div class="chatToolBar">
                    <span class="pace">
                        <i class="iconfonts icon-biaoqing1" style="font-size: 20px;"/>
                    </span>
                            <span>
                        <i class="iconfonts icon-tupian1" style="font-size: 20px;"/>
                        <uploader ids='file'></uploader>
                    </span>
                            <span>
                        <i class="iconfonts icon-wenjianjia" style="font-size: 20px;" />
                        <uploader ids="wenjian"></uploader>
                    </span>
                            <span>
                        <Icon type="scissors" size="18" @click.native="openScreenshot"></Icon>
                    </span>
                        </div>
                        <div class="chatInput">
                            <div id="sendInputBox" class="sendInputBox" contenteditable="true" @keyup.enter="sendMsg($event)"></div>
                            <button @click="sendMsg">回车发送</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <popup v-show="modalObj.thisFlag" :thisSrc="modalObj"></popup>
    </div>

</template>

<script>
    import '../chatInterface/jquery-sina-emotion.min.js'; // 新浪表情js
    import 'jquery-sina-emotion/dist/jquery-sina-emotion.min.css'; // 新浪表情css
    import Popup from '../chatInterface/popup';
    import {customerApi} from 'api';
    export default {
        name: "customer-service",
        data(){
            return {
                modalObj: {
                    thisFlag: false,
                    thisSrc: null
                },
                userInfo: JSON.parse(localStorage.userMsg),
                creentClientMsgList: [],
                firstMsgID: null,
                showMoreFlag: true,
                showOrhideFlag: true
            };
        },
        components: {
            Popup
        },
        mounted(){
            let _this = this;
            this.init();
            // 注册scroll事件并监听
            $("#CustomerMsg").scroll(function(){
                _this.loadMore();
            });
        },
        computed: {
            getImg() {
                return this.$store.state.img;
            },
            getFile() {
                return this.$store.state.file;
            },
            getMsgList(){
                return this.$store.state.customerMsg.customerMsgList;
            },
            getServiceID(){
                return this.$store.state.customerMsg.serviceUserID;
            },
            customerShowOrHidenShow(){
                return this.$store.state.customerShowOrHidenFlag;
            }
        },
        watch: {
            getImg(newImg){
                this.sendImg(newImg);
            },
            getFile(newFile){
                this.sendFile(newFile);
            },
            getMsgList(){
                let tempMsgList = this.getMsgList;
                this.creentClientMsgList = tempMsgList || [];
            },
            customerShowOrHidenShow(flag){
                this.showOrhideFlag = flag;
            }

        },
        updated() {
            this.geyEmoji();
        },
        methods: {
            init(){
                this.customerInit();
                //绑定表情事件
                $('.pace').click(function(event){
                    $(this).sinaEmotion($('#sendInputBox'));
                    event.stopPropagation();
                });
            },
            //客服接入
            customerInit(){
                customerApi.clientChatInit().then(({data}) =>{
                    if (data.err_code == 0){
                        // console.log('客服已接入');
                    } else {
                        this.$Message.error(data.err_message);
                    }
                });
            },
            //发送数据
            sendMsg(){
                let Msg = $('#sendInputBox').text();
                if (Msg){
                    let send = JSON.stringify({
                        "action": "service-chat",
                        "user_id": this.getServiceID,
                        "msg": Msg,
                        "msg_type": "text",
                        "msg_data": null
                    });
                    console.log(send);
                    webSocket.send(send);
                    $('#sendInputBox').html('');
                    this.scrollToBottom();
                } else {
                    this.$Message.error('消息不能为空！');
                    $('#sendInputBox').html('');
                }
            },
            //发送图片
            sendImg(url){
                let send = JSON.stringify({
                    "action": "service-chat",
                    "user_id": this.getServiceID,
                    "msg": url,
                    "msg_type": "image",
                    "msg_data": null
                });
                // console.log(send);
                webSocket.send(send);
                this.scrollToBottom();
            },
            //发送文件
            sendFile(fileObj){
                let send = JSON.stringify({
                    "action": "service-chat",
                    "user_id": this.getServiceID,
                    "msg": fileObj.fileDown,
                    "msg_type": "file",
                    "msg_data": JSON.stringify({
                        fileName: fileObj.fileName,
                        fileSize: fileObj.fileSize
                    })
                });
                // console.log(send);
                webSocket.send(send);
                this.scrollToBottom();
            },
            //滚动到底部
            scrollToBottom(){
                let CustomerMsg = document.getElementById('CustomerMsg');
                setTimeout(()=>{
                    CustomerMsg.scrollTop = CustomerMsg.scrollHeight;
                }, 200);
            },
            //识别表情
            geyEmoji(){
                $('.Send_content').each(function () {
                    const elems = $(this).html();
                    $(this).html(elems).parseEmotion();
                });
            },
            //查看图片
            EnlargementFun(event){
                if (event.target.nodeName === 'IMG'){
                    if (event.target.className != "sina-emotion"){
                        this.modalObj.thisFlag = true;
                        this.modalObj.thisSrc = event.target.src;
                    }
                }
            },
            //关闭聊天窗口
            closeCustomer(){
                this.closeChat();
                this.$store.state.customerMsg.customerMsgList = [];
                this.$store.commit('setCustomerServiceIsShow', false);    //主开关 开启调用接口
                this.$store.commit('setCustomerShowOrHiden', true);      //副开关 显示隐藏不会调用接口
                this.$store.commit('setCustomerEnterFlag', true);       //入口开关
            },
            //加载更多历史记录
            loadMore(){
                let scrollTop = $('#CustomerMsg').scrollTop();
                if (scrollTop == 0){
                    console.log('到顶部啦');
                    this.getChatMsgLog();
                }
            },
            getChatMsgLog(){
                this.showMoreFlag = false;
                let parms = {
                    user_id: this.userInfo.id,
                    type: 'less',
                    id: this.firstMsgID,
                    size: 10
                };
                customerApi.getChatLog(parms).then(({data}) =>{
                    if (data.err_code == 0){
                        let reverseArr = data.data.reverse();
                        this.firstMsgID = reverseArr[0].id;
                        this.$store.commit('resetCustomerMsg', reverseArr.concat(this.creentClientMsgList));
                        this.$nextTick(()=>{
                            let CustomerMsg = document.getElementById('CustomerMsg');
                            setTimeout(()=>{
                                CustomerMsg.scrollTop = (CustomerMsg.scrollHeight * 15) / 100;
                                // CustomerMsg.scrollTop = CustomerMsg.scrollHeight/2;
                            }, 200);
                        });

                    } else {
                        this.$Message.error(data.err_message);
                    }
                });
            },
            //
            /* 截图 */
            openScreenshot(){
                // 关闭聊天窗口
                this.$store.commit('setCustomerShowOrHiden', false);      //副开关 显示隐藏不会调用接口
                // 截图初始化
                this.$bus.emit('screenshotInit', this.userInfo.id+'-'+this.getServiceID, 'customer');
            },
            //关闭会话
            closeChat(){
                customerApi.closeChat().then(({data})=>{
                    if (data.err_code == 0){
                        this.$Message.success('结束本次会话！');
                    } else {
                        this.$Message.error(data.err_message);
                    }
                });
            },
            EventListener(event){
                event.stopPropagation();
            },
            //不允许右键点击
            whichButton(event){
                if (window.event) {
                    event = window.event; //处理兼容性，获得事件对象
                    event.returnValue = false;
                } else {
                    event.preventDefault();
                }
            },
        }
    };
</script>

<style scoped lang="less">
    .customerMain{
        width: 615px;
        /*width: 808px;*/
        height: 795px;
        position: fixed;
        top: 80px;
        right: 30px;
        z-index: 9;
        box-shadow: 0px 0px 10px 1px #ccc;
        border-right: 1px solid #eef1f2;
        border-left: 1px solid #eef1f2;
        background: #fff;
        overflow: hidden;
        z-index: 999;
        border-radius: 5px;
        .chatHead{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 70px;
            line-height: 70px;
            padding: 0 20px;
            background: @base;
            /*background: url("../../assets/images/chat.png");*/
            background-size: 100% 100%;
            color: @white;
            .title{
                font-size: 16px;
            }
            .close{
                font-size: 13px;
                &:hover{
                    cursor: pointer;
                    color:red;
                }
            }
        }
        .chatContent{
            height: 725px;
            /*.chatMain{*/
                /*height: 100%;*/
                /*border-left: 1px solid #efefef;*/
                .CustomerMsg{
                    height: 78%;
                    overflow-y: auto;
                    padding: 0 10px;
                    /* 设置滚动条的样式 */
                    &::-webkit-scrollbar {
                        width:5px;
                        height: 5px;
                    }
                    /* 滚动槽 */
                    &::-webkit-scrollbar-track {
                        -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
                        border-radius:2px;
                    }
                    /* 滚动条滑块 */
                    &::-webkit-scrollbar-thumb {
                        border-radius:2px;
                        background:rgba(0,0,0,0.3);
                        -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
                    }
                    .SeeMore{
                        font-size: 12px;
                        color: @base;
                        text-align: center;
                        padding: 2px 0;
                        &:hover{
                            cursor: pointer;
                            text-decoration: underline;
                        }
                    }
                    ul{
                        li{
                            display: flex;
                            &.mySelfMsgSty , &.otherMsgSty , &.SysMsgSty{
                                .msgInfo{
                                    width: 80%;
                                    padding: 10px;
                                    .timeDate{
                                        color: #bdbdbd;
                                        font-size: 12px;
                                    }
                                    .mySelfMsgBox , .otherMsgBox{
                                        margin-top: 5px;
                                        .fileUploadDiv{
                                            width: 100%;
                                        }
                                        .Send_content{
                                            position: relative;
                                            border-radius: 3px;
                                            font-size: 13px;
                                            display: inline-block;
                                            padding: 5px 10px;
                                            word-break: break-all;
                                            text-align: left;
                                            &:after{
                                                position: absolute;
                                                font-size: 10px;
                                                top: 8px;
                                            }
                                            .fileUploadSty{
                                                .fileName{
                                                    padding-bottom: 10px;
                                                    em{font-size: 35px}
                                                    span{margin-left: 10px}
                                                }
                                                .fileStatus{
                                                    padding-top: 10px;
                                                    display: flex;
                                                    justify-content: space-between;
                                                    a{
                                                        margin-right: 10px;
                                                        &:hover{
                                                            cursor: pointer;
                                                            text-decoration: underline;
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                    }
                                }
                                .headImg{
                                    padding: 10px 0;
                                    img{
                                        width: 40px;
                                        height: 40px;
                                        border-radius:100% ;
                                    }
                                }
                            }
                            &.mySelfMsgSty{
                                justify-content: flex-end;
                                .msgInfo{
                                    text-align: right;
                                    .timeDate{
                                        margin-right: 10px;
                                    }
                                    .mySelfMsgBox{
                                        .Send_content{
                                            background: #17ceb1;
                                            color: #fff;
                                            &:after {
                                                content: '\E74B';
                                                color: #17ceb1;
                                                right: -10px;
                                            }
                                            .fileUploadSty{
                                                .fileName{
                                                    border-bottom: 1px solid @white;
                                                }
                                                .fileStatus{
                                                    a{
                                                        color: @white;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            &.otherMsgSty{
                                .msgInfo{
                                    text-align: left;
                                    .timeDate{
                                        margin-left: 10px;
                                    }
                                    .otherMsgBox{
                                        .Send_content{
                                            background: #f8f9fa;
                                            color: #616161;
                                            &:after {
                                                content: '\E74C';
                                                color: #f8f9fa;
                                                left: -10px;
                                            }

                                            .fileUploadSty{
                                                background: @white;
                                                padding: 5px!important;
                                                .fileName{
                                                    border-bottom: 1px solid @black_4;
                                                    em{color: @yellow}
                                                }
                                                .fileStatus{
                                                    a{
                                                        color: @base;
                                                    }
                                                }
                                            }

                                        }

                                    }
                                }
                            }
                            &.SysMsgSty{
                                .mySelfDivSty{
                                    .timeDate{
                                        margin-left: 10px;
                                    }
                                    .mySelfName:before{
                                        content: '';
                                        background: url("../../assets/images/icoimg.png");
                                        height: 15px;
                                        width: 25px;
                                        display: inline-block;
                                        background-position: -352px 0;
                                        vertical-align: text-bottom;
                                    }
                                }
                                .mySelfMsgBox{
                                    .Send_content{
                                        background: #f8f9fa;border-radius: 3px;width: 100%;padding: 10px;
                                    }
                                }
                            }
                        }
                    }
                }
                .chatInputBox{
                    border-top: 1px solid #efefef;
                    height: 20%;
                    .chatToolBar{
                        height: 40px;
                        line-height: 40px;
                        -moz-user-select:none;/*火狐*/
                        -webkit-user-select:none;/*webkit浏览器*/
                        -ms-user-select:none;/*IE10*/
                        -khtml-user-select:none;/*早期浏览器*/
                        user-select:none;
                        span{
                            position: relative;
                            display: inline-block;
                            margin-left: 15px;
                            overflow: hidden;
                            &:hover{
                                cursor: pointer;
                                color: @base;
                            }
                        }
                    }
                    .chatInput{
                        text-align: right;
                        .sendInputBox{
                            text-align: left;
                            height: 75px;
                            width: 100%;
                            outline: none;
                            font-size: 14px;
                            color: #616161;
                            overflow-y: auto;
                            padding: 4px 8px;
                            border: none;
                            &:empty:before {
                                content: '请输入沟通内容...';
                                color: #bbb;
                                font-size: 13px;
                            }
                            &:focus:before {
                                content: none;
                            }
                        }
                        button{
                            /*float: right;*/
                            width: 90px;
                            height: 32px;
                            text-align: center;
                            line-height: 32px;
                            color: #ffffff;
                            border-radius: 4px;
                            font-size: 13px;
                            margin-right: 10px;
                            background: rgba(24, 191, 164, 0.8);
                            outline: none;
                            border: none;
                            &:hover{
                                cursor: pointer;
                                background: @base;
                            }
                        }
                    }
                }
            /*}*/
        }
    }

</style>
