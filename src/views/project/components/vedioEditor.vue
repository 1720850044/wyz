<template>
    <div>
        <div class="videoM">
            <div class="file-property" :class="{'show-property': isToggleDown}" v-if="showVideoProperty" @mouseleave="isToggleDown=false">
                <div class="toggle-bar" @mouseenter="isToggleDown=true">
                    <i class="toggle-icon-down" :class="{'toggle-icon-up': isToggleDown}"></i>
                </div>
                <ul>
                    <li><label>{{$t('lang.lang_name')}}：</label><span :title="videoProperty.name">{{videoProperty.name}}</span></li>
                    <li><label>{{$t('lang.lang_format')}}：</label><span>{{videoProperty.extension}}</span></li>
                    <li><label>{{$t('lang.lang_duration')}}：</label><span>{{video.duration | dateType}}</span></li>
                </ul>
            </div>
            <section class="canvasContainer">

                <!--视频-->
                <video id="video" style="width:100%;object-fit:fill;height:660px;">
                    <source :src="videoUrl+'?'+$PublicFuns.randomRange(6,10)" type="video/mp4">
                </video>
                <!--进度条-->
                <div class="controls">
                    <!--移动小圆点-->
                    <span v-show="!isCanvas" id="circle" class="circleSign" @mousedown="pictureMove" @mouseup="pictureRemove" >
                        <span id="circleSpot" class="circleSpot"></span>
                    </span>
                    <span v-show="!isCanvas" class="progressBar" @click="pictureJump" ></span>
                    <i v-show="!isCanvas" class="strip"></i>
                    <!--canvas标注-->
                    <ul v-show="!isCanvas" class="progressSignUl">
                        <li v-if="item.left && item.width" v-for="(item,index) in timeList" class="progressSign"
                            :style="{'width':item.width+'px','left':(item.left<0?-1*item.left:item.left)+'px'}"
                            :class="labelHighlight===index && editCas?'highlight':''" :key="index">
                            <p class="progressSignText" @click="editCanvasDate(item,index)">
                                {{labelHighlight === index && editCas ? $t('project.pro_saveButton') : $t('project.pro_signButton')}}
                            </p>
                            <p v-if="labelHighlight===index && editCas" class="progressSignText"
                               @click="delCanvas(item)" type="text">{{$t('project.pro_deleteButton')}}
                            </p>
                        </li>
                    </ul>
                    <!--刻度-->
                    <ul v-show="!isCanvas" class="scaleUl">
                        <li v-for="(item,index) in articleScale" class="scale" :key="index"></li>
                    </ul>
                    <!--时间显示和视频开关-->
                    <Icon v-show="switchIcon&&!isCanvas" @click.native.prevent="videoStart" class="startButton"
                          type="play"></Icon>
                    <Icon v-show="!switchIcon&&!isCanvas" @click.native.prevent="pauseButton" class="startButton"
                          type="pause"></Icon>
                    <span v-if="video"
                          class="controlsTime">{{currnt_time | dateType}}/{{video.duration | dateType}}</span>
                </div>

                <!--video画布-->
                <canvas v-show="isCanvas" id="myCanvas" :width="videoWidth" :height="videoHeight" class="videoCanvas"
                        style="border:1px solid #d3d3d3;">
                </canvas>

                <!--画板画布-->
                <canvas id="cav1" class="drawMain" :width="videoWidth" :height="videoHeight"
                        :style="[isCanvas?{'z-index':'113'}:{},hideSign?{'opacity':0}:{'opacity':1}]"
                        @click.stop="drawText" @mousedown.prevent="paletteInit"
                        style="border:1px solid #d3d3d3;opacity: 0">
                </canvas>

                <!--move画布-->
                <canvas v-show="isCanvas" id="cav2" class="drawTrans" :width="videoWidth" :height="videoHeight" @mousedown="changeBegin()" @mouseup="changeEnd()"
                        style="border:1px solid #d3d3d3;">
                </canvas>
                <div class="sign-img">
                    <img v-if="img" id="imgOpacity" :src="img" crossOrigin="anonymous" style="opacity:0;position:absolute;top:0;"   alt="">
                </div>

                <div v-show="!switchIcon&&!isCanvas" class="masking" @click="pauseButton"></div>
                <input v-show="drawTextShow" @blur="drawText" v-model="drawTextValue" type="text" class="textInput" :style="{'top':top+'px','left':left+'px'}">
            </section>
            <!--操作按钮权限-->
            <!--{{userPost.type}}-->
            <!--{{is_collaboration}}-->
            <!--
                        标注判断逻辑

                        判断是不是协作任务 ？ 判断是不是甲方 ？ 如果是甲方 当前用户不能是成员 且 当前任务不是内部审核 :否则为乙方 当前用户不能是成员 且 当前任务是内部审核 : 不是协作任务 当前用户不能是成员 且当前任务是内部审核
                    -->

            <div class="canvasEdit" v-if="is_collaboration ?
                                  userPost.type ?
                                  (userPost.postId != '3' && taskInfos.status != '1') && (userPost.postId != '3' && taskInfos.status != '3') && (userPost.postId != '3' && taskInfos.status != '4') && (userPost.postId != '3' && taskInfos.status != '5')
                                  :
                                  userPost.postId != '3' && taskInfos.status == '1'
                                  :
                                  userPost.postId != '3' && taskInfos.status == '1'
                                        ">
                <i class="project_instrument tagimage"></i>
                <p class="canvasEditText">{{$t('project.pro_auditorHelper')}}</p>
                <Icon @click.native="updateFrame('before')" type="skip-backward" class="videoicon"
                      :title="$t('project.pro_previousFrame')"></Icon>
                <Icon @click.native="updateFrame('after')" type="skip-forward"
                      class="videoicon" :title="$t('project.pro_nextFrame')"></Icon>
                <!--v-show="taskInfos.status === '1'"-->
                <Icon @click.native="startCanvas" type="paintbrush" class="videoicon"
                      :title="$t('project.pro_modifyTheTag')"></Icon>
                <template v-if="isCanvas">
                    <Icon @click.native=" isRect = false;isLine = true;isText = false" type="edit"
                          :class="[{'editHover':isLine},'edit','videoicon']" :title="$t('project.pro_brush')"></Icon>

                    <i @click="changeText" :class="[{'textHover':isText},'text','videoicon']">A</i>
                    <span class="canvasicon" @click="changelineWidth(1)" > <i class="little " ></i></span>
                    <span class="middleBox" @click="changelineWidth(5)" > <i class="middle " ></i></span>
                    <span class="bigBox" @click="changelineWidth(8)" > <i class="big " ></i></span>

                    <span class="canvasicon" @click="changeColor('#fff')"> <i class="fff"></i></span>
                    <span class="canvasicon" @click="changeColor('black')">  <i class="black "></i></span>
                    <span class="canvasicon" @click="changeColor('#ff512e')"> <i class="red "></i></span>
                    <span class="canvasicon" @click="changeColor('#66DAFF')">  <i class="blue "></i></span>
                    <span class="canvasicon" @click="changeColor('#FFB14D')"><i class="orange "></i></span>
                </template>
                <Icon v-show="hideSign" @click.native="hideSign = !hideSign" type="eye" class="videoicon"
                      :title="$t('project.pro_showLabel')"></Icon>
                <Icon v-show="!hideSign" @click.native="hideSign = !hideSign" type="eye-disabled" class="videoicon"
                      :title="$t('project.pro_hideMark')"></Icon>
                <span class="saveButton" v-show="isCanvas" @click="saveCanvas">{{$t('lang.lang_save')}}</span>
                <span class="saveButton" v-show="isCanvas" @click="clearCanvas">{{$t('lang.lang_cancel')}}</span>

            </div>
        </div>

        <!--<img id="img1" :src="img" width="200" height="200" alt="">-->

        <!--<Modal-->
        <!--v-model="saveCanvasShow"-->
        <!--title="画布保存"-->
        <!--width="300"-->
        <!--@on-ok="saveCanvas"-->
        <!--@on-cancel="clearCanvas"-->
        <!--&gt;-->
        <!--<p>是否保存画布?</p>-->
        <!--</Modal>-->
    </div>
</template>
<script>
    import PublicFuns from '@/libs/PublicFuns';
    import api from 'api';
    // import feedbackInfo from './feedbackInfo.vue'
    import {mapState} from 'vuex';
    import Cookies from 'js-cookie';
    export default {
        name: 'video-editor',
        props: {

            /*重构开始*/
            taskInfos: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            is_collaboration: {
                type: Number
            }

            /*重构结束*/
        },
        watch: {
            taskInfos(val){
                this.taskInfos = val;
                this.init();
            }
        },
        data() {
            return {
                sumSign: 0,
                newImg: null,
                base64: null,
                signTime: null,
                videoTime: null,
                casTime: null,
                stateTime: null,
                // ossKey:null,
                newDate: null,
                fileId: null,
                highlightSign: null,
                hideSign: false,
                labelHighlight: null,
                editCas: false,  //标注编辑
                articleScale: [],  // 刻度
                saveCanvasWindow: true, // 保存弹窗
                saveCanvasShow: false,
                videoWidth: null,  //canvas 宽度
                videoHeight: null,  //canvas 宽度
                switchIcon: true, //开始暂停按钮
                editArray: null, //接口数据
                timeList: [], //进度条标注
                img: null, //canvas二进制
                stage_id: null, // 阶段id
                percentage: '', // 百分比
                drawTextValue: '', // canvas文字
                drawTextShow: false,
                isCanvas: false, // 画布开关
                video: null, // 视频dom
                videoCas: null, // 视频层canvas
                ctx: null, // 画板canvas
                canvas: null,
                canDraw: false,
                currnt_time: 0,  //当前播放时间
                color: 'black', // 画板颜色
                lineWidth: 5,  //画板粗细
                x: null,  //起始x
                y: null,
                newX: null,  //更新x
                newY: null,
                minx: null,
                miny: null,
                maxx: null,
                maxy: null,
                isRect: false,  //画矩形
                isLine: true, // 画线
                isText: false,
                top: null,
                left: null,
                // timeId: '',
                /*上面是标注*/
                data: [],
                StateFeedBack: 0,
                IMGlist: [],
                insTime: 0,
                cliTiem: 0,
                insDate: 0,
                cliDate: 0,
                liIndex: 0,
                VideoURL: '',
                fileID: 0,
                stageID: 0,
                FeedbackValue: '',
                showVideoProperty: false,
                isToggleDown: false,
                videoProperty: {},

                /*重构开始*/
                videoUrl: null,
                randomNum: null,
                userPost: {
                    postName: '',
                    postId: null,
                    type: null
                }
            };
        },
        mounted() {
            this.init();
            this.userInfos();
        },
        beforeDestroy() {
            clearInterval(this.videoTime);
            clearInterval(this.casTime);
            clearInterval(this.stateTime);
        },
        methods: {
            changeBegin () {
                this.canDraw = true;
            },
            changeEnd () {
                this.canDraw = false;
            },

            /*canvas初始化*/
            init() {
                this.$store.commit('calculateSignSum', 0);
                let fileList = this.taskInfos.file;
                let fileUrl = fileList.filter((creent) =>creent.is_main === '1');
                this.videoUrl = fileUrl[0].file;

                this.getVideoProperty(fileUrl[0].file);
                this.getTaskData();

                this.video = document.getElementById("video");    // 视频

                this.showVideoSign();

                // let img = document.querySelector('#imgOpacity');
                // img.setAttribute("crossOrigin",'Anonymous');

                this.videoCas = document.getElementById("myCanvas");    // 获取视频图像的画布
                this.canvas = document.getElementById("cav1");            // 画板
                this.canvasTans = document.getElementById("cav2");       // 矩形move画板

                this.video.volume = 0;  // 音量为0 方便调试
                let width = this.video.offsetWidth;
                let height = this.video.offsetHeight;
                this.videoWidth = width;
                this.videoHeight = height;
                this.videoCas.style.width = '100%';
                this.videoCas.style.height = '100%';
                this.canvas.style.width = '100%';
                this.canvas.style.height = '100%';
                // img.style.width = width + 'px';
                // img.style.height = height + 'px';
                this.canvasTans.style.width = '100%';
                this.canvasTans.style.height = '100%';

                this.videoCtx = this.videoCas.getContext('2d');
                this.ctx = this.canvas.getContext('2d');
                this.ctxTans = this.canvasTans.getContext('2d');

                document.body.addEventListener('mouseup', this.beyondArea);

                // /*点击开启画布*/
                // this.video.pause();
                // this.casTime = setInterval(() => {
                //     this.videoCtx.drawImage(this.video, 0, 0, this.videoWidth, height);
                // }, 25);
            },
            getVideoProperty (url) {
                let start = url.lastIndexOf('/');
                let end = url.lastIndexOf('.');
                this.videoProperty.name = url.substring(start + 1);
                this.videoProperty.extension = url.substring(end + 1).toUpperCase();
                let el = document.getElementById('video');
                if (el) {
                    this.videoProperty.duration = PublicFuns.calculationTime(el.duration || 0);
                    if (this.videoProperty) {
                        this.showVideoProperty = true;
                    }
                }
            },

            getTaskData() {
                let fileList = this.taskInfos.file;
                let mainFile = fileList.filter((creent) =>creent.is_main === '1');
                let tag = [];
                if (mainFile[0].tag){
                    if (this.taskInfos.isTestTask){
                        tag = JSON.parse(mainFile[0].tag);
                    } else {
                        tag = mainFile[0].tag;
                    }
                } else {
                    tag = [];
                }
                this.data = tag;
                sessionStorage.setItem('videoTime', JSON.stringify(tag));
                this.editArray = tag;

                this.sumSign = tag.length;
                this.newImg = null;
            },

            userInfos () {
                let Infos = JSON.parse(Cookies.get('company'));
                this.userPost.type = Infos.type;
                switch (Infos.post_id) {
                    case '1':
                        this.userPost.postName = i18n.t('project.pro_manager');
                        this.userPost.postId = '1';
                        break;
                    case '2':
                        this.userPost.postName = i18n.t('project.pro_groupLeader');
                        this.userPost.postId = '2';
                        break;
                    case '3':
                        this.userPost.postName = i18n.t('lang.lang_member');
                        this.userPost.postId = '3';
                        break;
                }
            },

            /*启动视频*/
            videoStart() {
                this.switchIcon = false;
                this.video.play();
                this.videoInit();
            },

            /*暂停*/
            pauseButton() {
                this.switchIcon = true;
                this.video.pause();
            },

            /*进度条*/
            timeNum() {
                if (this.video.readyState > 0) {
                    let zhen = parseFloat(this.video.duration);
                    this.percentage = this.video.currentTime / zhen;
                    document.querySelector('#circle').style.width = this.percentage * (this.videoWidth - 10) + 'px';
                    document.querySelector('#circleSpot').style.left = this.percentage * (this.videoWidth - 10) - 7 + 'px';
                }
            },

            /*开启画布*/
            startCanvas() {
                this.video.pause();
                this.switchIcon = !this.switchIcon; // 暂停按钮

                this.isCanvas = !this.isCanvas;
                // this.init();
                // clearInterval(this.timeId);
//                this.timeNum();
                this.isRect = false;
                this.isLine = true;
                this.isText = false;
            },

            /*删除画布*/
            delCanvas(item) {
                this.editArray.map((item, index, arr) => {
                    if (this.highlightSign.time[0] === item.time[0] && this.highlightSign.time[1] === item.time[1]) {
                        arr.splice(index, 1);
                        this.showVideoSign();
                        this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
                        sessionStorage.setItem('videoTime', JSON.stringify(this.editArray));
                        this.editCas = !this.editCas;
                        this.sumSign = this.editArray?this.editArray.length:0;
                    }
                });
            },

            /*进入编辑标注模式*/
            editCanvasDate(item, index) {
                this.highlightSign = item;
                this.editCas = !this.editCas;
                this.labelHighlight = index;
            },

            /*进度条拖拽*/
            pictureMove() {
//                document.querySelector('.progressBar').addEventListener("mousemove", this.pictureJump);

            },
            pictureRemove(){
//                document.querySelector('.progressBar').removeEventListener("mousemove", this.pictureJump);

            },

            /*画面跳转*/
            pictureJump(e) {
                let time = this.video.duration * e.offsetX / (this.videoWidth - 10);

                /*编辑进度条*/
                if (!this.editCas) {
                    // this.getVasList();
                    // this.videoInit(true);
                    this.video.currentTime = time;

                    /*暂停时跳转后暂停*/
                    this.currnt_time = time;
                    this.timeNum();
                }

                /*编辑标注*/
                else {
                    this.editTag(time);
                }
            },

            /*编辑标注*/
            editTag(time) {
                let newTime = null;

                let average = (this.highlightSign.time[0] + this.highlightSign.time[1]) / 2;

                /*点击标记左边*/
                if (time < average) {
                    this.highlightSign.time[0] = time;
                    newTime = this.highlightSign.time;
                }

                /*点击标记右边*/
                else if (time > average) {
                    this.highlightSign.time[1] = time;
                    newTime = this.highlightSign.time;
                }
                this.editArray.map((item, index, arr) => {
                    if (this.highlightSign.time[0] === item.time[0] && this.highlightSign.time[1] === item.time[1]) {
                        item.time = newTime;
                        this.timeNum();
                        this.showVideoSign();
                        sessionStorage.setItem('videoTime', JSON.stringify(this.editArray));
                    }
                });
            },

            /*播放插入标注*/
            videoInit(isPictureJump) {
                this.currnt_time = this.video.currentTime;
                // this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
                this.randomNum = this.$PublicFuns.randomRange(5, 10);
                this.videoTime = setInterval(() => {
                    this.currnt_time = this.video.currentTime;

                    /*暂停播放*/
                    if (isPictureJump || this.switchIcon || this.isCanvas) {
                        clearInterval(this.videoTime);
                    }

                    /*播放完停止*/
                    if (this.currnt_time >= this.video.duration) {
                        this.currnt_time = this.video.duration;
                        clearInterval(this.videoTime);
                        this.switchIcon = !this.switchIcon;
                    }

                    /*进度条*/
                    this.timeNum();
                    this.getVasList();
                }, 25);

            },

            /* 显示进度条标注 */
            showVideoSign() {
                this.signTime = setInterval(() => {
                    if (this.video.readyState > 0) {
                        this.timeList = this.editArray;
                        if (this.timeList){
                            this.timeList.map((item, index) => {
                                if (item.time ){
                                    item.left = parseFloat(item.time[0] / this.video.duration * (this.videoWidth - 10));
                                    item.width = parseFloat((item.time[1] - item.time[0]) / this.video.duration * (this.videoWidth - 10));
                                }
                            });
                        }
                        this.articleScaleList();
                        clearInterval(this.signTime);
                    }
                }, 25);
            },

            /*刻度*/
            articleScaleList() {
                this.articleScale = Array.from(new Array(parseInt(this.video.duration) + 1));
//                this.articleScale
            },

            /*body鼠标离开触发*/
            beyondArea() {
                // this.canvas.removeEventListener("mousemove", this._move);
                if (document.querySelector('.progressBar')) {
                    document.querySelector('.progressBar').removeEventListener("mousemove", this.pictureJump);
                }
            },

            /*点击矩形*/
            changeRect() {
                this.isRect = true;
                this.isLine = false;
                this.isText = false;
            },

            /*点击文字*/
            changeText() {
                this.isText = true;
                this.isLine = false;
                this.isRect = false;
            },

            /*点击改变大小*/
            changelineWidth(lineWidth) {
                this.lineWidth = lineWidth;
            },

            /*点击改变颜色*/
            changeColor(color) {
                this.color = color;
            },

            /*画板初始化*/
            paletteInit(e) {
                if (!this.isCanvas) {
                    return false;
                }
                //鼠标点击在canvas中的位置
                this.x = e.offsetX;
                this.y = e.offsetY;

                //记录旧的点
                this.newX = this.x - 1;
                this.newY = this.y - 1;

                if (this.isText) {
                    this.canDraw = false;
                    // this.canvas.removeEventListener("mouseup", this._up);
                }

                //画笔功能
                if (this.isLine) {
                    this.canDraw = true;
                    if (this.canDraw) {
                        this.drawLine();
                        this.canvas.addEventListener("mousemove", this._move);
                    }
                    this.canvas.addEventListener("mouseup", this._up);
                } else if (this.isText && !this.drawTextShow) {
                    this.top = this.y;
                    this.left = this.x;
                    this.drawTextShow = true;

                } else if (this.isRect) {

                    this.canvas.addEventListener("mousemove", this._drawRectTans);
                    this.canvas.addEventListener("mouseup", this._drawRect);
                }
            },

            /*canvas画笔功能*/
            drawLine() {
                // console.log(this.canDraw);
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.color;
                //线的宽度
                this.ctx.lineWidth = this.lineWidth;
                //线的样式
                this.ctx.lineCap = "round";
                this.ctx.moveTo(this.x, this.y);
                this.ctx.lineTo(this.newX, this.newY);
                this.ctx.stroke();
                this.ctx.closePath();
            },

            /*canvas文字*/
            drawText() {
                this.drawTextShow = false;
                this.ctx.font = this.lineWidth === 1?"14px Arial":this.lineWidth === 5?'22px Arial' :this.lineWidth === 8?'35px Arial':'18px Arial';
                this.ctx.fillStyle = this.color ;
                this.ctx.fillText(this.drawTextValue, this.left + 8, this.top + 12);
                this.drawTextValue = '';
            },

            /*渲染二进制图片*/
            getVasList() {
                let _this = this;
                if (this.editArray) {
                    let show = true;
                    this.editArray.map((item) => {

                        /*渲染画布 时间段*/
                        if (item.time&&_this.currnt_time >= item.time[0] && _this.currnt_time <= item.time[1]) {
                            show = false;
                            _this.img = null;
                            _this.img = item.image + '?' + _this.randomNum;
                            if (_this.img) {
                                setTimeout(() => {
                                    _this.ctx.drawImage(document.querySelector('#imgOpacity'), 0, 0, _this.videoWidth, _this.videoHeight);
                                }, 30);
                            }
                        }
                    });
                    if (show) {
                        this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
                    }
                }
            },

            /*保存*/
            async saveCanvas() {
                let _this = this;
                this.showVideoSign();
                if (this.saveCanvasShow) {
                    this.saveCanvasShow = false;
                }
                let isExist = true;
                let base64 = this.canvas.toDataURL("image/png");
                this.$PublicFuns.getOssKey().then((OssData) =>{
                    _this.$PublicFuns.uploadOss(base64, OssData).then((imgSrc) =>{
                        let json = {
                            "time": [_this.currnt_time - 0.05, _this.currnt_time + 0.05],
                            "image": imgSrc
                        };

                        /*添加*/
                        if (isExist) {
                            _this.editArray.push(json);
                            _this.sumSign = _this.editArray ? _this.editArray.length : 0;
                        }
                        sessionStorage.setItem('videoTime', JSON.stringify(_this.editArray));
                        _this.$store.commit('calculateSignSum', _this.editArray.length);
                        // _this.isCanvas = !_this.isCanvas;
                        _this.showVideoSign();
                        _this.clearCanvas();
                    });
                });
            },

            /*清空画布*/
            clearCanvas() {
                this.isCanvas = !this.isCanvas;
                this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
            },

            /*鼠标移动画矩形*/
            _drawRectTans(e) {
                let width = this.newX - this.x,
                    height = this.newY - this.y;
                this.newX = e.offsetX;
                this.newY = e.offsetY;
                this.ctxTans.clearRect(0, 0, this.canvasTans.clientWidth, this.canvasTans.clientHeight);
                this.ctxTans.strokeRect(this.x, this.y, width, height);
            },

            /*鼠标离开画矩形*/
            _drawRect(e) {
                let width = this.newX - this.x,
                    height = this.newY - this.y;
                this.newX = e.offsetX;
                this.newY = e.offsetY;
                this.ctxTans.clearRect(0, 0, this.canvasTans.clientWidth, this.canvasTans.clientHeight);
                this.ctx.strokeRect(this.x, this.y, width, height);

                this.canvas.removeEventListener("mousemove", this._drawRectTans);
            },

            /*画笔移动*/
            _move(e) {
                // console.log('move ... ', this.canDraw);
                this.x = e.offsetX;
                this.y = e.offsetY;

                if (e.offsetX < this.minx || !this.minx) {
                    this.minx = e.offsetX;
                }
                if (e.offsetY < this.miny || !this.miny) {
                    this.miny = e.offsetY;
                }
                if (e.offsetX > this.maxx || !this.maxx) {
                    this.maxx = e.offsetX;
                }
                if (e.offsetY > this.maxy || !this.maxy) {
                    this.maxy = e.offsetY;
                }

                //画笔功能
                if (this.canDraw) {
                    this.drawLine();
                }
                this.newX = this.x;
                this.newY = this.y;

            },

            /*鼠标离开*/
            _up() {
                this.canDraw = false;
                // this.canvas.removeEventListener("mousemove", this._move);
            },

            /*视频上一帧 下一帧*/
            updateFrame(type) {
                if (type === 'after') {
                    this.currnt_time += 0.05;
                } else if (type === 'before') {
                    this.currnt_time -= 0.05;
                }
                this.video.currentTime = this.currnt_time;
                this.currnt_time = this.video.currentTime;
                setTimeout(() => {
                    this.getVasList();
                }, 50);
            },
        },
        filters: {
            dateType(time) {
                return time.toFixed(2);
            }
        }
    };
</script>
<style lang="less" scoped>
    .videoM {
        position: relative;
        overflow: hidden;
        height: 100%;
        .file-property {
            position: absolute;
            right: 0;
            top: -95px;
            width: 138px;
            height: auto;
            padding: 10px;
            background: rgba(0, 0, 0, 0.5);
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            z-index: 2;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
            &.show-property {
                top: 0;
            }
            .toggle-bar {
                position: absolute;
                bottom: -10px;
                left: 44px;
                width: 50px;
                height: 10px;
                -webkit-border-radius: 0 0 3px 3px;
                -moz-border-radius: 0 0 3px 3px;
                border-radius: 0 0 3px 3px;
                background: rgba(0, 0, 0, 0.5);
                cursor: pointer;
                > i.toggle-icon-down {
                    display: block;
                    margin: 2px auto 0;
                    width: 0;
                    height: 0;
                    border-width: 6px 8px 0 8px;
                    border-style: solid;
                    border-color: #fff transparent transparent;
                    &.toggle-icon-up {
                        border-width: 0 8px 6px 8px;
                        border-color: transparent transparent #fff;
                    }
                }
            }

            > ul {
                > li {
                    color: #fff;
                    line-height: 25px;
                    overflow: hidden;
                    -ms-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

    .canvasContainer {
        position: relative;
        text-align: center;
        height: 95%;
        border: 1px solid #ccc;
        overflow: hidden;
        .controls {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 45px;
            padding: 0 5px;
            z-index: 112;
            text-align: left;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6));
            /*<!--box-shadow: 0px -10px 79px 0 @black_1 inset;-->*/
            .progressBar {
                display: block;
                position: absolute;
                top: -6px;
                left: 0;
                width: 100%;
                height: 25px;
                margin-top: -10px;
                z-index: 160;
            }
            .strip {
                display: block;
                width: 100%;
                height: 4px;
                margin-top: -1px;
                background: #746d68;
            }
            .progressSignUl {
                width: 100%;
                .progressSign {
                    position: absolute;
                    top: -1px;
                    width: 12px;
                    height: 4px;
                    background: #22d7bb;
                    z-index: 300;
                    .progressSignText {
                        width: 14px;
                        height: 14px;
                        margin: 4px 0 0 -5px;
                        line-height: 14px;
                        text-align: center;
                        font-size: 12px;
                        color: @white;
                        /*<!--background: @base;-->*/
                        /*border-radius: 50%;*/
                    }
                }
                .highlight {
                    top: -10px;
                    padding: 10px 0;
                    z-index: 149;
                }
            }
            .scaleUl {
                display: flex;
                padding-left: 2px;
                margin-bottom: 5px;
                justify-content: space-between;
                .scale {
                    width: 2px;
                    height: 4px;
                    background: #ccc;
                }
            }
            .circleSign {
                display: block;
                position: absolute;
                top: -1px;
                width: 8px;
                height: 4px;
                background: #4a4949;
                .circleSpot {
                    position: absolute;
                    top: -4px;
                    left: -3px;
                    display: block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: @white ;
                    z-index: 301;
                }
            }
            .startButton {
                margin: 0 6px;
                font-size: 18px;
                color: @white;
                vertical-align: middle;
            }
            .controlsTime {
                font-size: 16px;
                color: #fff;
                vertical-align: middle;
            }
        }
        .video-js {

        }
        .videoCanvas {
            position: absolute;

            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 104;

        }
        .drawMain {
            position: absolute;

            top: 0;
            left: 50%;
            transform: translateX(-50%);
            // z-index: 10 !important;

        }
        .textContainer{
            position: relative;
            background: @red;
        }
        .drawTrans {
            position: absolute;

            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 105;
        }
        .sign-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
        .masking {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 420px;
            text-align: center;
            z-index: 167;
        }
        .textInput {
            position: absolute;
            width: 70px;
            z-index: 999;
            background: transparent;
            border: 1px solid transparent;
            border-bottom: 2px solid #ff512e;
            outline: none;
        }

    }

    .project_instrument {
        background: url("../../../assets/images/project_instrument.png") no-repeat;
    }

    .project_opinion {
        background: url("../../../assets/images/project_opinion.png") no-repeat;
    }

    .tagimage {
        display: block;
        width: 28px;
        height: 28px;
        background-size: 28px;
    }

    .canvasEdit {
        display: flex;
        margin: 0;
        align-items: center;
        .canvasEditText {
            height: 34px;
            line-height: 34px;
            margin: 0 20px;
            color: #868788;
        }

        .videoicon {
            padding: 5px 10px;
            font-size: 18px;
            color: #27b39c;
            background: #fff;
            z-index: 500;

        }
        .videoicon, .canvasicon, .middleBox, .bigBox {
            &:hover {
                border: 1px solid #ccc;
            }
        }
        .canvasicon {
            padding: 7px 8px;
            font-size: 18px;
            color: #27b39c;
            background: #fff;

        }
        .edit {
            padding: 5px;
            font-size: 18px;
        }
        .text {
            padding: 0 10px;
            font-weight: bold;
            font-size: 18px;
            cursor: default;
        }
        .editHover, .textHover {
            border: 1px solid #ccc;
        }
        .middleBox {
            padding: 5px 6px;
            background: #fff
        }
        .bigBox {
            padding: 3px 4px;
            background: #fff
        }
        .saveButton {
            padding: 5px 6px;
            background: #fff;
            cursor: default;
        }
        .little, .middle, .big {
            display: block;
            margin: 5px;
            background: black;
            border-radius: 50%;

        }
        .little {
            width: 4px;
            height: 4px;
        }
        .middle {
            width: 8px;
            height: 8px;
        }
        .big {
            width: 12px;
            height: 12px;
        }
        .black, .red, .blue, .orange, .fff {
            display: block;
            width: 14px;
            height: 14px;
            border: 1px solid #e6e6e6;

        }
        .fff {
            background: #fff;
        }
        .black {
            background: black;
        }
        .red {
            background: @red;
        }
        .blue {
            background: @blue;
        }
        .orange {

            background: @orange;
        }
    }
</style>
