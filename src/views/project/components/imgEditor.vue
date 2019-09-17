<template>
    <div class="newImgEditor" style="width: 100%;height: 100%;margin-bottom: 20px">
        <div class="file-property" :class="{'show-property': isToggleDown}" v-if="showImageProperty" @mouseleave="isToggleDown=false">
            <div class="toggle-bar" @mouseenter="isToggleDown=true">
                <i class="toggle-icon-down" :class="{'toggle-icon-up': isToggleDown}"></i>
            </div>
            <ul>
                <li><label>{{$t('lang.lang_name')}}：</label><span :title="imageProperty.name">{{imageProperty.name}}</span></li>
                <li><label>{{$t('lang.lang_format')}}：</label><span>{{imageProperty.extension}}</span></li>
                <li><label>{{$t('lang.lang_measure')}}：</label><span>{{imageProperty.size}}</span></li>
            </ul>
        </div>
        <div class="imgEditorCom" style="height: 100%;width: 100%">
            <div class="imgFocus" :class="{'max-screen': isMaxScreen, 'full-screen': isFullScreen}" style="height: 100%">
                <!-- 加载中... -->
                <common-loading id="onload"></common-loading>
                <!-- 控制canvas -->
                <!--<div v-if="isShowSignEnter" :class="[canvasSign?'controlCanvas showCanvas':'controlCanvas hideCanvas']">-->
                    <!--<span @click="canvasHidden"><s class="iconfonts icon-tuichu"></s>退出标注</span>-->
                <!--</div>-->
                <!-- 标注层 -->
                <div class="sginCanvas" id="signx">
                    <div id="clipScreenCanvas">
                        <!-- 修改编辑层 -->
                        <div class="editSginDiv">
                            <textarea id="sginText"></textarea>
                            <div class="signButton">
                                <span class="sginEditCommit">{{$t('lang.lang_modify')}}</span>
                                <span class="editSignbox">{{$t('lang.lang_cancel')}}</span>
                            </div>
                        </div>
                        <!-- 画布层 -->
                        <canvas id="cav" width="1400" height="750" v-show="hiddenSign">
                            <span>{{$t('project.pro_browserNotSupportCaslab')}}o(╯□╰)o</span>
                        </canvas>
                        <!-- 控件层 -->
                        <div id="ctrlPanel" class="oControl"></div>
                        <!-- 图片层 -->
                        <img v-show="url" :src="url" class="ImgOnlod" id="oImg"  crossorign="anonymous"/>
                    </div>
                </div>
                <!--{{userPost.type}}-->
                <!--{{is_collaboration}}-->
                <!--{{taskInfos.status}}-->
                <!--{{taskInfos.status == 1 || taskInfos.status == 5 || taskInfos.status == 2 ? true : false}}-->
                <!--{{(userPost.postId != '3' && taskInfos.status != '5') && (userPost.postId != '3' && taskInfos.status != '1')}}-->
                <!-- 工具条 -->
                <div class="toolBar img-tools-bar">

                    <!--
                        标注判断逻辑

                        判断是不是协作任务 ？ 判断是不是甲方 ？ 如果是甲方 当前用户不能是成员 且 当前任务不是内部审核 :否则为乙方 当前用户不能是成员 且 当前任务是内部审核 : 不是协作任务 当前用户不能是成员 且当前任务是内部审核
                    -->

                    <div v-if="is_collaboration ?

                                  userPost.type ?

                                  (userPost.postId != '3' && taskInfos.status != '1') && (userPost.postId != '3' && taskInfos.status != '3') && (userPost.postId != '3' && taskInfos.status != '4') && (userPost.postId != '3' && taskInfos.status != '5')
                                  :
                                  userPost.postId != '3' && taskInfos.status == '1'
                                  :
                                  userPost.postId != '3' && taskInfos.status == '1'
                            ">

                        <div>
                            <span :class="[canvasSign?'barLeft barselet':'barLeft']" @click="canvasHidden"><Icon type="edit" class="add"></Icon>{{barText}}</span>
                            <span class="clearCanvas" @click="clearCanvas" v-show="canvasSign"><s class="iconfonts icon-qingchu"></s>{{$t('project.pro_clearLabel')}}</span>
                        </div>
                        <div class="barRight">
                            <div class="screen-operate">
                                <a class="default-screen" :title="$t('workbench.work_reduction')" v-if="isMaxScreen || isFullScreen" @click="backToDefault()">
                                    <Icon type="ios-browsers-outline"></Icon>
                                </a>
                                <a class="full-max-screen" :title="$t('project.pro_maximization')" v-if="!isMaxScreen || isFullScreen" @click="clickToMax()">
                                    <i class="iconfonts icon-fullscreen1"></i>
                                </a>
                                <a class="default-full-screen" :title="$t('project.pro_fullScreen')" v-if="isMaxScreen || !isFullScreen" @click="clickToFull()">
                                    <i class="iconfonts icon-full_screen"></i>
                                </a>
                            </div>
                            <!-- color pick -->
                            <div class="color-pick-box" @click="showPicker()" v-if="mutuallyExclusive">
                                <a class="pick-color" :title="$t('project.pro_getColor')">
                                    <i class="iconfonts icon-straw"></i>
                                </a>
                                <div class="color-showing" v-if="enterPickerColor">
                                    <i class="triangle-color-icon"></i>
                                    <span></span>
                                    <b>#FFFFFF</b>
                                </div>
                            </div>
                            <div class="eye-item" @click="signHidden" :class="{'switch-color': !hiddenSign}" v-if="mutuallyExclusive">
                                <a>
                                    <i class="iconfonts icon-yincang" :class="{'switch-color': !hiddenSign}" :title="hiddenSignText"></i>
                                </a>
                            </div>
                            <div class="compare-item" v-if="mutuallyExclusive">
                                <a>
                                    <i class="iconfonts icon-qimai-guanjiancizhishuduibi" :title="$t('project.pro_checkTheLastFeedback')"></i>
                                </a>
                            </div>
                            <!-- Add helper line -->
                            <div class="add-helper-line">
                                <a class="add-line" @click="addRulerLine()" v-if="!mutuallyExclusive" :title="$t('project.pro_addGuides')">
                                    <i class="iconfonts icon-asix"></i>
                                </a>
                                <a class="show-ruler" @click="displayRuler()" v-if="mutuallyExclusivePicker">
                                    <i class="iconfonts icon-333" :title="displayText"></i>
                                </a>
                                <a class="scale-big" @click="scalePanelBigOrSmall('big')">
                                    <i class="iconfonts icon-find" :title="$t('project.pro_zoomIn')"></i>
                                </a>
                                <a class="scale-small" @click="scalePanelBigOrSmall('small')">
                                    <i class="iconfonts icon-iconfont_" :title="$t('project.pro_reduceInScale')"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from 'vuex';
    import commonLoading from './common_loading.vue';
    import {imgSign} from './imgEditorTwo/imgSign.js';
    import {imgCanvas} from './imgEditorTwo/imgCanvas.js';
    import {canvasControl} from './imgEditorTwo/imgControl.js';
    import {AutoResizeImage} from './imgEditorTwo/autoResizeImage.js';
    import {pickerImgColor} from './imgEditorTwo/pickerColor.js';
    import {canvasRuler} from './imgEditorTwo/canvasRuler.js';
    import feedbackInfo from './feedbackInfo.vue';
    import Cookies from 'js-cookie';
    import api from 'api';

    export default {
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

            /*重构开始*/
            taskInfos (val){
                this.taskInfos = val;
                this.initImgEditor();
            },

            /*重构结束*/

            storeSignSum (newVal) {
                this.sumSign = newVal;
            }
        },
        components: {
            commonLoading: commonLoading,
            feedbackInfo: feedbackInfo
        },
        data () {
            return {
                newDate: null,
                fileId: null,
                data: [],
                IMGdata: [],
                url: '',
                TID: 80,
                TaskID: 0,
                IMGlist: [],
                AllowEditRow: false,
                SataeInfo: false,
                StateFeedBack: 0,
                insTime: 0,
                cliTiem: 0,
                insDate: 0,
                cliDate: 0,
                liIndex: 0,
                FeedbackValue: '',
                onload: true,
                fileID: 0,
                stageID: 0,
                AllowEdit: false, //是否允许标注
                barText: i18n.t('project.pro_withFeedback'),
                hiddenSign: true,
                canvasSign: false,
                hiddenSignText: i18n.t('project.pro_hideMark'),
                userPost: {
                    postName: '',
                    postId: null,
                    type: null
                },
                OSSdata: {},
                sumSign: 0,
                clickCount: 0,
                enterPickerColor: false,
                isMaxScreen: false,
                isFullScreen: false,
                imgCanvasWH: [],
                displayText: i18n.t('project.pro_showRulers'),
                mutuallyExclusive: true,
                mutuallyExclusivePicker: true,
                isShowSignEnter: false,
                imageProperty: {},
                showImageProperty: false,
                isToggleDown: false
                // returnSignIndex: []
            };
        },
        filters: {
            filtStat (val) {
                if (val == 1) {
                    return i18n.t('project.pro_internalPending');
                } else if (val == 2) {
                    return i18n.t('project.pro_customerPending');
                } else if (val == 3) {
                    return i18n.t('project.pro_internalFeedback');
                } else if (val == 4) {
                    return i18n.t('project.pro_customerFeedback');
                } else if (val == 5) {
                    return i18n.t('project.pro_passAudit');
                } else {
                    return '--';
                }
            }
        },
        mounted () {
            this.initImgEditor();
            this.userInfos();
        },
        computed: {
            storeSignSum () {
                return this.$store.state.ImgVedioStatus.sumSign;
            }
        },
        methods: {
            ...mapMutations(['calculateSignSum']),
            initImgEditor () {
                this.clearSession();
                this.url = null;
                let randomNum = this.randomRange(5, 10);
                let mainFile = this.taskInfos.file.filter((creent) =>creent.is_main === '1');
                //初始化文件地址 优先取标注图
                if (mainFile[0].label) {
                    this.url = mainFile[0].label + '?' + randomNum;
                } else {
                    this.switchImgToBase64(mainFile[0].file, (returnUrl) => {
                        this.url = returnUrl;
                    });
                }
                //初始化话文件标记
                let tag = mainFile[0].tag || mainFile[0].tag != '' ? this.taskInfos.isTestTask ? JSON.parse(mainFile[0].tag) : mainFile[0].tag : null;
                this.data = tag;
                //初始化文件信息
                this.getImageProperty(mainFile[0].file);
                // this.loadWH();
                pickerImgColor('img');
                canvasRuler(this, '.imgFocus');
                this.changeState(this.taskInfos.status);
                this.defue();
                this.imgdef(null);
                this.sumSignChange();
                this.onLoad();
            },
            getImageProperty (url) {
                if (url && url.length > 0) {
                    let start = url.lastIndexOf('/');
                    let end = url.lastIndexOf('.');
                    this.imageProperty.name = url.substring(start + 1);
                    this.imageProperty.extension = url.substring(end + 1);
                    let image = new Image();
                    image.src = url;
                    image.onload = () => {
                        this.imageProperty.size = image.width + '*' + image.height;
                        if (this.imageProperty && this.imageProperty.size) {
                            this.showImageProperty = true;
                        }
                    };
                }
            },
            // 浏览器全屏
            enterFullScreenSize () {
                let docEle = document.documentElement;
                //W3C
                if (docEle.requestFullscreen) {
                    docEle.requestFullscreen();
                }
                //FireFox
                else if (docEle.mozRequestFullScreen) {
                    docEle.mozRequestFullScreen();
                }
                //Chrome等
                else if (docEle.webkitRequestFullScreen) {
                    docEle.webkitRequestFullScreen();
                }
                //IE11
                else if (docEle.msRequestFullscreen) {
                    docEle.msRequestFullscreen();
                }
            },
            // 退出浏览器全屏
            exitFullScreenSize () {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            },
            // 最大化
            clickToMax () {
                this.exitPickerColor();
                if (this.isFullScreen) {
                    this.exitFullScreenSize();
                    this.isFullScreen = false;
                    this.isMaxScreen = true;
                } else {
                    let imgFocusEle = document.querySelector('.imgFocus');
                    let beginWidth = imgFocusEle.clientWidth;
                    let beginHeight = imgFocusEle.clientHeight;
                    this.imgCanvasWH = [beginWidth, beginHeight];
                    this.isMaxScreen = true;
                }
            },
            // 全屏
            clickToFull () {
                this.exitPickerColor();
                this.enterFullScreenSize();
                this.isFullScreen = true;
                this.isMaxScreen = false;
            },
            // 还原
            backToDefault () {
                this.exitPickerColor();
                this.exitFullScreenSize();
                let imgFocusEle = document.querySelector('.imgFocus');
                imgFocusEle.style.width = this.imgCanvasWH[0];
                imgFocusEle.style.height = this.imgCanvasWH[1];
                this.isFullScreen = false;
                this.isMaxScreen = false;
            },
            sumSignChange () {
                let getImgData = sessionStorage.ImgData;
                let sessionSign = getImgData ? JSON.parse(getImgData).length : 0;
                this.calculateSignSum(sessionSign);
                this.sumSign = this.storeSignSum;
            },
            // clearSession
            clearSession () {
                sessionStorage.removeItem('ImgData');//存图片标注信息
                sessionStorage.removeItem('totalNum');//存图片放大缩小信息
            },
            // clearCanvas
            clearCanvas () {
                this.$Modal.confirm({
                    title: i18n.t('project.pro_clearLabel'),
                    content: i18n.t('project.pro_confirmClearCanvas'),
                    onOk: () => {
                        this.$Message.info(i18n.t('project.pro_clearSuccess')+'└(^o^)┘');
                        imgCanvas('true');
                        $.sign.clearSign(true);
                        imgCanvas(false, this);
                        this.clearSession();
                        this.sumSignChange();
                        // $.sign.loadingSign(null);
                    }
                });
            },
            // hideSgin
            canvasHidden () {
                this.exitPickerColor();
                let cav = document.getElementById('cav');
                if (this.canvasSign) {
                    this.barText = i18n.t('project.pro_withFeedback');
                    cav.style.zIndex = '12';
                    this.canvasSign = !this.canvasSign;
                } else {
                    this.barText = i18n.t('project.pro_exitLabelEdit');
                    cav.style.zIndex = '100';
                    this.canvasSign = !this.canvasSign;
                }
            },
            signHidden () {
                this.exitPickerColor();
                if (this.hiddenSign) {
                    $('.signIndex').css('display', 'none');
                    this.hiddenSign = !this.hiddenSign;
                    this.hiddenSignText = i18n.t('project.pro_showLabel');
                } else {
                    $('.signIndex').css('display', 'block');
                    this.hiddenSign = !this.hiddenSign;
                    this.hiddenSignText = i18n.t('project.pro_hideMark');
                }
            },
            // Picker color
            showPicker () {
                this.clickCount ++;
                let option = {
                    callback: (data) => {
                        $('.color-showing span').css('background', 'rgba(' + data + ', 1)');
                        $('.color-showing b').text(this.rgbColorToHex(data));
                    }
                };
                this.clickCount % 2 === 1 ? this.showPickerColor(option) : this.exitPickerColor();
            },
            showPickerColor (option) {
                this.enterPickerColor = true;
                this.mutuallyExclusivePicker = false;
                $('#clipScreenCanvas img#oImg').css('z-index', '101');
                $('#clipScreenCanvas img').pickerColor(option);
            },
            exitPickerColor () {
                this.clickCount = 0;
                this.enterPickerColor = false;
                this.mutuallyExclusivePicker = true;
                $('#clipScreenCanvas img#oImg').css('z-index', '1');
                $('#canvasPickerColor').remove();
            },
            // RGB —> 16进制
            rgbColorToHex (color) {
                let rgb = color.split(',');
                let r = parseInt(rgb[0]);
                let g = parseInt(rgb[1]);
                let b = parseInt(rgb[2]);
                let hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                hex = '#' + hex.toUpperCase();
                return hex;
            },
            // 标尺功能
            displayRuler () {
                $.pageRulerToggle();
                $.lineToggle();
                this.displayText = this.displayText === i18n.t('project.pro_showRulers') ? i18n.t('project.pro_hideRulers'): i18n.t('project.pro_showRulers');
                if (this.displayText === i18n.t('project.pro_showRulers')) {
                    this.mutuallyExclusive = true;
                    document.getElementById('zxxScaleBox').style.zIndex = '0';
                } else {
                    document.getElementById('zxxScaleBox').style.zIndex = '3';
                    this.mutuallyExclusive = false;
                }
            },

            // 按比例缩小或放大方法
            scalePanelBigOrSmall (type) {
                let currentContainer = document.getElementById('signx');
                let ctrlPanel = document.getElementById('ctrlPanel');
                let currentPanel = document.getElementById('cav');
                let currentImg = document.getElementById('oImg');
                let containerFocus = document.querySelector('.imgFocus');
                let signIndexNode = document.getElementsByClassName('signIndex');
                let focusWidth = containerFocus.clientWidth;
                let focusHeight = containerFocus.clientHeight;
                let panelSize = [currentContainer.clientWidth, currentContainer.clientHeight];
                let SCALE = 0.1;
                let scaleWidth, scaleHeight;
                if (type === 'big') {
                    scaleWidth = panelSize[0] + (panelSize[0] * SCALE);
                    scaleHeight = panelSize[1] + (panelSize[1] * SCALE);
                    for (let num = 0; num < signIndexNode.length; num++) {
                        signIndexNode[num].style.left = parseFloat(signIndexNode[num].style.left) + (parseFloat(signIndexNode[num].style.left) * SCALE) + 'px';
                        signIndexNode[num].style.top = parseFloat(signIndexNode[num].style.top) + (parseFloat(signIndexNode[num].style.top) * SCALE) + 'px';
                    }
                } else {
                    scaleWidth = panelSize[0] - (panelSize[0] * SCALE);
                    scaleHeight = panelSize[1] - (panelSize[1] * SCALE);
                    for (let num = 0; num < signIndexNode.length; num++) {
                        signIndexNode[num].style.left = parseFloat(signIndexNode[num].style.left) - (parseFloat(signIndexNode[num].style.left) * SCALE) + 'px';
                        signIndexNode[num].style.top = parseFloat(signIndexNode[num].style.top) - (parseFloat(signIndexNode[num].style.top) * SCALE) + 'px';
                    }
                }
                currentContainer.style.left = (focusWidth - scaleWidth) / 2 + 'px';
                currentContainer.style.top = (focusHeight - scaleHeight) / 2 + 'px';
                currentContainer.style.marginLeft = 'auto';
                currentContainer.style.marginTop = 'auto';
                currentContainer.style.width = scaleWidth + 'px';
                currentContainer.style.height = scaleHeight + 'px';
                ctrlPanel.style.width = scaleWidth + 'px';
                ctrlPanel.style.height = scaleHeight + 'px';
                currentPanel.style.width = scaleWidth + 'px';
                currentPanel.style.height = scaleHeight + 'px';
                currentImg.style.width = scaleWidth + 'px';
                currentImg.style.height = scaleHeight + 'px';
            },

            // 添加标尺辅助线
            addRulerLine () {
                $.addRulerLine();
            },
            //colseWindow
            InfoRefresh () {
                this.$bus.emit('InfoRefresh');
            },

            // image 转 base64
            switchImgToBase64(url, callback) {
                let canvas = document.createElement("canvas");   //创建canvas DOM元素
                let ctx = canvas.getContext("2d");
                let img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = url + '?' + this.randomRange(5, 10);
                let ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
                img.onload = function () {
                    canvas.height = img.height; //指定画板的高度,自定义
                    canvas.width = img.width; //指定画板的宽度，自定义
                    ctx.drawImage(img, 0, 0, img.width, img.height); //参数可自定义
                    let dataURL = canvas.toDataURL("image/" + ext);
                    callback.call(this, dataURL); //回掉函数获取Base64编码
                    canvas = null;
                };
            },
            GetImgInfo (width, height) {
                let arrWH = [width, height];
                this.$store.commit('getImgEditorWH', arrWH);
            },
            onLoad (cControl = 'false') {
                let el = document.getElementsByClassName('ImgOnlod')[0];
                let signxEle = document.getElementsByClassName('sginCanvas')[0];
                let el2 = document.getElementById('onload');
                let resourceRatio, fixedRatio;
                let returnWH;
                el2.style.display = 'block';
                el.onload = () => {
                    el = document.getElementById('oImg');
                    let controlDiv = document.getElementsByClassName('oControl')[0];
                    let imgFocus = document.getElementsByClassName('imgFocus')[0];
                    el2.style.display = 'none';
                    let maxH = parseInt(imgFocus.offsetHeight - 36);
                    let maxW = parseInt(imgFocus.offsetWidth - 18);
                    this.GetImgInfo(el.naturalWidth, el.naturalHeight);

                    // New image resize calculation
                    resourceRatio = el.naturalWidth / el.naturalHeight;
                    fixedRatio = maxW / maxH;

                    if (resourceRatio > fixedRatio) {
                        returnWH = AutoResizeImage(maxW, 0, el);
                    }
                    if (resourceRatio < fixedRatio) {
                        returnWH = AutoResizeImage(0, maxH, el);
                    }
                    if (resourceRatio === fixedRatio) {
                        returnWH = AutoResizeImage(maxW, maxH, el);
                    }

                    el.style.width = returnWH.width + 'px';
                    el.style.height = returnWH.height + 'px';

                    signxEle.style.width = returnWH.width + 'px';
                    signxEle.style.height = returnWH.height + 'px';
                    signxEle.style.left = '50%';
                    signxEle.style.top = '50%';
                    signxEle.style.marginTop = -parseInt(returnWH.height / 2) + 'px';
                    signxEle.style.marginLeft = -parseInt(returnWH.width / 2) + 'px';

                    let canvasW = parseInt(el.style.width);
                    let canvasH = parseInt(el.style.height);
                    let canID = document.getElementById('cav');

                    //  controlDiv
                    controlDiv.style.width = canvasW + 'px';
                    controlDiv.style.height = canvasH + 'px';

                    // canvasDiv
                    canID.width = canvasW;
                    canID.height = canvasH;

                    imgCanvas(cControl, this);
                    canvasControl();
                };
            },
            loadWH () {
                // if (this.hiddenToolBar) {
                //     //根据父极元素大小 定宽高
                //     let sw = $('.imgEditorCom').parent('.newImgEditor').width();
                //     let sh = $('.imgEditorCom').parent('.newImgEditor').height();
                //     $('.imgFocus').height(sh - 18);//先注解
                //     $('.imgEditorCom').width(sw + 2);//先注解
                //     $('.imgFocus').width(sw - 18);//先注解
                // } else {
                //     //根据父极元素大小 定宽高
                //     let sw = $('.imgEditorCom').parent('.newImgEditor').width();
                //     let sh = $('.imgEditorCom').parent('.newImgEditor').height() - 200;
                //     // let sw = $(".single-page-con").width() - 500;
                //     // let sh = $(".single-page-con").height() - 200;
                //     // $('.imgFocus').height(sh - 18);//先注解
                //     $('.imgEditorCom').width(sw + 2);//先注解
                //     // $('.imgFocus').width(sw - 18);//先注解
                //     $('.toolBar').css('margin-top', sh + 5);//先注解
                // }
            },
            defue () {
                // sign
                imgSign(this.AllowEdit, this);
            },
            imgdef (startLocation) {
                $.sign.bindSign('#signx', startLocation);
                $.sign.loadingSign(this.data);
            },
            changeState (state) {
                //  controlImgSign
                if (state == '1' || state == '2') {
                    this.AllowEditRow = true;
                    this.SataeInfo = false;
                    this.AllowEdit = true;
                } else if (state == '3' || state == '4' || state == '5') {
                    this.AllowEditRow = false;
                    this.SataeInfo = true;
                    this.AllowEdit = false;
                } else {
                    this.AllowEditRow = false;
                    this.SataeInfo = false;
                    this.AllowEdit = false;
                }
            },
            randomRange(min, max){
                let returnStr = "",
                    range = (max ? Math.round(Math.random() * (max-min)) + min : min),
                    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

                for (let i = 0; i < range; i++){
                    let index = Math.round(Math.random() * (arr.length - 1));
                    returnStr += arr[index];
                }
                return returnStr;
            },
            //getUserInfo
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
        }
    };
</script>
<style lang='less'>
    @import './imgEditorTwo/style/imgEditor.less';
    @import './imgEditorTwo/style/canvas_ruler.less';
</style>
