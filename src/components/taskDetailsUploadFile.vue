<template>
    <!-- 上传界面 -->
    <div class="upload_outer">
        <div class="upload_page2">
            <a class="ivu-modal-close" @click="$emit('closeUploadPop')"><i
                    class="ivu-icon ivu-icon-ios-close-empty"></i></a>
            <div class="upload_page_header">
                <span class="upload_header_title">{{taskName}}</span>
                <span v-if="Test" class="testTask">{{$t('workbench.work_taskTestTips')}}</span>
            </div>

            <div class="upload_page_main">
                <p class="Choice_page_title global-input-notice" v-if="!Test">{{$t('project.pro_selectUploadTask')}}</p>
                <ul class="choice_page_ul global-importentColor" v-if="!Test" id="choice_page_ul">
                    <li class="ivu-icon ivu-icon-arrow-right-a"
                        :class="{'choice_page_active':currentStageNumber == item.stage,'choice_page_select':item.stage < currentStageNumber}"
                        v-for="(item,index) in stage" :key="index">
                        <div @click="currentStageNumber = item.stage">
                            <span style="letter-spacing: 5px"> {{item.stage_name}} </span>
                        </div>
                    </li>
                </ul>
                <div class="testTaskDiv">
                    <div class="testTaskLeft" v-if="!Test">
                        <span class="tipsText">{{$t('project.pro_submissionSpecification')}}</span>
                        <p class="choice_title_Stand" v-for="(item,index) in standard" :key="index">
                            <span>{{item.name}}</span>
                            <span>{{item.values}}</span>
                        </p>
                        <div>
                            <file-detection v-if="mainFileData" :mainFileData="mainFileData"></file-detection>
                        </div>
                    </div>
                    <div class="testTaskLeft" v-else>
                        <span class="tipsText global-input-notice">{{$t('project.pro_testTaskRequirements')}}</span>
                        <dl>
                            <dt>{{$t('project.pro_deliveryRequirements')}}</dt>
                            <dd>
                                <p style="max-height: 100px;overflow: auto">{{testTaskInfo.description}}</p>
                            </dd>
                            <dt>{{$t('project.pro_manuscriptSpecifications')}}</dt>
                            <dd>
                                <p v-if="testTaskInfo.fileRequire">{{JSON.parse(testTaskInfo.fileRequire).spec || $t('project.pro_notAvailable')}}</p>
                            </dd>
                            <dt>{{$t('project.pro_manuscriptFormat')}}</dt>
                            <dd>
                                <p v-if="testTaskInfo.fileRequire">{{JSON.parse(testTaskInfo.fileRequire).format || $t('project.pro_notAvailable')}}</p>
                            </dd>
                            <dt>{{$t('project.pro_refAttachment')}}</dt>
                            <dd>
                                <div style="height: 245px;overflow: auto">
                                    <p class="uploadFileSty" v-for="(img,index) in testTaskInfo.file" :key='index'>{{img.name | substring}}
                                        <a :href="img.file_url+'?response-content-type=application%2Foctet-stream'" download>
                                            <i class="icon iconfonts icon-xiazai"></i>
                                        </a>
                                    </p>
                                </div>
                            </dd>
                            <!--<dt>其它说明</dt>-->
                            <!--<dd>-->
                                <!--<span>{{testTaskInfo.description}}</span>-->
                            <!--</dd>-->
                        </dl>
                    </div>


                    <div class="testTaskright">
                        <p class="tipsText">
                            <span>{{$t('project.pro_selectUploadFile')}}</span>
                        </p>
                        <div class="contenerFile">
                            <Spin size="large" v-if="uploadStatus.status" class="spinPop"></Spin>
                            <div class="upload_box">
                                <new-upload v-if="!fileinfos.flag" @fileUploadComplete="fileUploadComplete" @FileUploadedSuccess="FileUploadedSuccess"></new-upload>
                                <!--<upload-box v-if="!fileinfos.flag" id="uploadTask"-->
                                    <!--v-on:fileUploadComplete="fileUploadComplete"-->
                                    <!--v-on:FileUploadedSuccess="FileUploadedSuccess"></upload-box>-->
                                <div class='all_upload_page' v-if="fileinfos.flag">
                                    <div class="yu_lan" id="yu_lan">
                                        <img :src="fileinfos.Src" v-if="fileinfos.type === 1 " id="yulanimg"/>
                                        <video :src="fileinfos.Src" width="100%" height="100%" v-if="fileinfos.type === 2 " controls="controls" controlsList="nodownload" oncontextmenu="return false">
                                            your browser does not support the video tag
                                        </video>
                                        <audio class="upload-audio-player" v-if="fileinfos.type === 4" :src="fileinfos.Src" controls="controls" controlsList="nodownload" oncontextmenu="return false"></audio>
                                        <model-preview v-if="fileinfos.type === 3 && fileType"></model-preview>
                                        <div class="unknown-file-show" v-if="fileinfos.type === 'unknown'">
                                            <p>{{$t('project.pro_formatUnsupported')}}</p>
                                        </div>
                                        <!--<three-module v-if="fileinfos.type == 3" :height="340" :isPreview="true"></three-module>-->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="selectMainMaxDiv" v-if="fileinfos.Src">
                            <div class="yulan_span">
                                <div class="file-display-list">
                                    <span class="yulanBacks" :class="{'yulanBack':item.selectSty}"
                                          @click="setMainFileFun(item)" v-for="(item,index) in UploadfileList" :key="index"><i
                                            v-if="item.isMain">{{$t('project.pro_main')}}.</i>{{item.name | substring}}</span>
                                </div>
                                <div class="operation-btn-groups">
                                    <button class="settingBtnOk" v-if="fileinfos.isMain && false">
                                        <i class="iconfonts icon-ymy-xuanzhong-copy upload_gou"></i>{{$t('project.pro_masterFileIsSet')}}
                                    </button>
                                    <button class="settingMainFile" v-if="!fileinfos.isMain"
                                            @click="setMainFileFun('setMain')">{{$t('project.pro_masterFileIsSet')}}
                                    </button>
                                    <button class="againFileBtn" @click="againUpload">{{$t('project.pro_anewUpload')}}</button>
                                </div>
                            </div>
                            <p class="tipsUpload" v-if="false">
                                <Icon style="font-size: 15px" type="ios-information-outline"></Icon>
                                {{$t('project.pro_setDefaultFileConvenience')}}
                            </p>
                        </div>
                        <div class="actionBtn">
                            <button class="caell" @click="$emit('closeUploadPop')">{{$t('lang.lang_cancel')}}</button>
                            <button class="ok" @click="uploadAction">{{uploadStatus.uploadStatusText}}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapState} from 'vuex';
    import api from 'api';
    import ModelPreview from "./uploadAndPreview/tdModulePreview";
    import NewUpload from "./uploadAndPreview/newUpload";
    import FileDetection from "./uploadAndPreview/fileDetection";

    export default {
        name: "task-details-upload-file",
        props: {
            taskID: {
                type: String,
            },
            isTest: {
                type: Number,
            },
            currentStage: {
                type: String,
            }
        },
        components: {
            FileDetection,
            NewUpload,
            ModelPreview
        },
        data() {
            return {
                Test: this.isTest ? parseInt(this.isTest) : 0,
                currentStageNumber: this.currentStage || null,   //只有普通任务才有阶段上传
                stage: [],
                standard: [],
                taskName: null,
                fileinfos: {
                    flag: false,
                    type: null,
                    fileID: null,
                    name: null,
                    Src: null,
                    isMain: false,
                    selectSty: false
                },
                Src: null,
                UploadfileList: [],
                uploadStatus: {
                    status: false,
                    uploadStatusText: i18n.t('project.pro_startUpload')
                },
                testTaskInfo: {
                    file: [],
                    description: null,
                    fileRequire: null
                },
                uploadAllUrl: [],
                allUploadData: [],
                randomStr: '',
                fileType: null,
                mainFileData: null
            };
        },
        methods: {
            ...mapMutations(['changeComponentFileURl', 'setUploadFileUrlList', 'setFileExtension']),
            async initTaskInfo(taskID) {
                if (!this.Test) {
                    let res = await api.getTaskdetailInfo({id: taskID});
                    if (res.data.err_code === 0) {
                        this.taskName = res.data.name;
                        this.stage = res.data.stage || [];
                        this.standard = res.data.standard || [];
                        this.mainFileData = res.data;
                    }
                } else {
                    let res = await api.getTestTaskInfo(taskID);
                    if (res.data.err_code === 0) {
                        this.taskName = res.data.test_name;
                        this.testTaskInfo.description = res.data.description;
                        this.testTaskInfo.fileRequire = res.data.file_require;
                        this.mainFileData = res.data;
                        // if (res.data.file) {
                        //     let file = res.data.file;
                        //     file.map(function (creent) {
                        //         creent.response = JSON.parse(creent.response);
                        //         return creent;
                        //     });
                        this.testTaskInfo.file = res.data.file;
                        // }
                    }
                }
            },
            FileUploadedSuccess(data) {
                this.UploadfileList.push({
                    flag: false,
                    fileID: data.fid,
                    Src: data.file_url,
                    name: data.name,
                    type: this.checkFeilType(data),
                    isMain: false,
                    selectSty: false,
                    ext: data.ext
                });
                this.UploadfileList[0].selectSty = true;
                this.fileinfos = this.UploadfileList[0];
            },
            fileUploadComplete() {
                this.fileinfos.flag = true;
                this.fileinfos = this.UploadfileList[0];
                this.fileinfos.isMain = true;
                this.UploadfileList[0].selectSty = true;
                let fileUrlList = this.UploadfileList.map(item => ({file: item.Src}));

                if (this.fileinfos.type === 3) {
                    this.fileType = '3d';
                }
                this.setUploadFileUrlList(fileUrlList);
                this.changeComponentFileURl(this.fileinfos.Src);
                this.setFileExtension(this.fileinfos.ext);

                let len = this.UploadfileList[0].Src.split('/').length;
                this.randomStr = this.UploadfileList[0].Src.split('/')[len-2];

                if (this.UploadfileList && this.UploadfileList.length) {

                }
            },
            checkFeilType(data) {
                let fileName = data.name;
                let start = fileName.lastIndexOf('.');
                const names = fileName.substring(start + 1).toLowerCase();
                let filesStatus = null;
                if (names === 'jpg' || names === 'png' || names === 'gif' || names === 'bmp') {
                    filesStatus = 1;
                } else if (names === 'mp4' || names === 'avi' || names === 'mpg' || names === 'rmvb') {
                    filesStatus = 2;
                } else if (names === 'fbx' || names === 'obj' || names === 'json' || names === 'stl' || names === '3ds') {
                    filesStatus = 3;
                } else if (names === 'mp3' || names === 'm4a' || names === 'ogg' || names === 'wav') {
                    filesStatus = 4;
                } else {
                    filesStatus = 'unknown';
                }
                return filesStatus;
            },
            setMainFileFun(item) {
                this.fileType = null;
                setTimeout(() => {
                    if (item === 'setMain') {
                        this.UploadfileList.forEach((creent, index) => {
                            creent.isMain = false;
                        });
                        this.fileinfos.isMain = true;
                    } else {
                        this.fileinfos = item;
                        this.UploadfileList.forEach((creent, index) => {
                            creent.flag = false;
                            creent.selectSty = false;
                        });
                        item.selectSty = true;
                        item.flag = true;
                        if (item.type === 3) {
                            this.changeComponentFileURl(item.Src);
                        }
                        this.setFileExtension(item.ext);
                    }
                    this.fileType = '3d';
                }, 600);
            },
            againUpload() {
                this.UploadfileList = [];
                this.fileinfos = {
                    flag: false,
                    fileID: null,
                    type: null,
                    name: null,
                    Src: null,
                    isMain: false,
                    selectSty: false
                };
            },
            uploadAction() {
                if (!this.Test) {
                    if (this.currentStageNumber == null) {
                        this.$Message.info(i18n.t('project.pro_selectUploadStage'));
                        return false;
                    }
                }

                let hasMainFile = this.UploadfileList.filter(item => item.isMain);
                if (this.UploadfileList.length <= 0) {
                    this.$Message.info(i18n.t('project.pro_addUploadFile'));
                } else if (hasMainFile && hasMainFile.length <= 0) {
                    this.$Message.info(i18n.t('project.pro_setDefaultFile'));
                } else {
                    let thumb = null;
                    this.uploadStatus.status = true;
                    this.uploadStatus.uploadStatusText = i18n.t('project.pro_upload')+'...';
                    //只截取 3D 缩略图   视频缩略图由后端生成  切记！！！
                    if (this.fileinfos.type == 3) {
                        this.$PublicFuns.getOssKey().then((OssKey => {
                            this.$PublicFuns.getHtml2canvas('yu_lan').then((base64) => {
                                this.$PublicFuns.uploadOss(base64, OssKey, this.randomStr).then((imgUrl) => {
                                    // let randomNumber = this.$PublicFuns.randomRange(5, 15);
                                    // thumb = imgUrl + '?' + randomNumber;
                                    thumb = imgUrl;
                                    this.uploadCommon(thumb);
                                });
                            });
                        }));
                    } else {
                        this.uploadCommon(thumb);
                    }
                }
            },
            uploadCommon(thumb){
                let feilArr = [];
                let items = {};
                this.UploadfileList.forEach((creent, index) => {
                    feilArr.push({
                        fid: creent.fileID,
                        file: creent.Src,
                        is_main: creent.isMain,
                        thumb: creent.isMain && creent.type !== 3 ? creent.Src : creent.isMain && creent.type === 3 ? thumb : !creent.isMain && creent.type !== 3 ? creent.Src : null,
                        type: creent.type === 1 ? 'image' : creent.type === 2 ? 'video' : creent.type === 3 ? '3D' : creent.type === 4 ? 'audio' : 'unknown'
                    });
                });

                if (!this.Test) {
                    items = {
                        task_id: this.taskID,           //任务id
                        stage: this.currentStageNumber, //上传阶段
                        file: JSON.stringify(feilArr)   //json字符串
                    };
                } else {
                    items = {
                        bid_id: this.taskID,
                        file: JSON.stringify(feilArr)
                    };
                }
                this.uploadPublicFun(items);
            },
            async uploadPublicFun(data) {
                let Upload = null;
                if (!this.Test) {
                    Upload = await api.StageUpload(data);
                } else {
                    Upload = await api.uploadTestHttp(data);
                }
                if (Upload.data.err_code == 0) {
                    this.uploadStatus.status = false;
                    this.uploadStatus.uploadStatusText = i18n.t('project.pro_uploadCompleted');

                    /*
                    * callbackFun
                    * 上传完成后需要执行的回调操作方法
                    * */
                    this.$emit('callbackFun');
                    this.$Message.success(i18n.t('project.pro_uploadSuccessful'));
                } else {
                    this.uploadStatus.status = false;
                    this.uploadStatus.uploadStatusText = i18n.t('project.pro_anewUpload');
                    this.$Message.error(i18n.t('project.pro_failToUpload') + Upload.data.err_message);
                }
            }
        },
        mounted() {
            this.initTaskInfo(this.taskID);
        },
        filters: {
            substring: function (val) {
                return val.length > 30 ? '...' + val.substring(val.length, 15) : val;
            }
        }
    };
</script>
<style lang="less" scoped>
    .upload_outer {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 999;
    }

    .upload_page2 {
        position: absolute;
        width: 880px;
        top: 10%;
        left: 50%;
        margin-left: -440px;
        background: #ffffff;
        z-index: 999;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        .upload_page_header {
            width: 100%;
            height: 60px;
            line-height: 60px;
            background: url('../assets/images/upload.png');
            background-size: 100% 100%;
            border-bottom: 1px solid rgb(228, 228, 228);
            .upload_header_title {
                /*line-height: 60px;*/
                font-weight: lighter;
                margin-left: 20px;
                color: @white;
                font-size: 15px;
            }
        }
        .testTask {
            line-height: 60px;
            font-size: 12px;
            border: 1px solid #fff;
            padding: 1px 5px;
            border-radius: 3px;
            color: #fff;
            margin-left: 10px;
        }
        .upload_page_main {
            width: 100%;
            padding: 20px 30px;
            .Choice_page_title {
                color: #bdbdbd;
            }
            .choice_page_ul {
                display: flex;
                justify-content: space-between;
                margin: 20px 0px;
            }
            .choice_page_ul li {
                position: relative;
                width: 100%;
                text-align: center;
                &:before {
                    position: absolute;
                    color: #bdbdbd;
                    font-size: 18px;
                    line-height: 34px;
                    left: -7.5px;
                }
                &:nth-child(1):before {
                    display: none;
                }
                &.choice_page_active > div {
                    border: 1px solid #3bceb6 !important;
                    background: #e9f9f7;

                }
                &.choice_page_active {
                    &:before {
                        color: #3bceb6 !important
                    }
                }
            }
            .choice_page_ul li > .JTsty {
                position: absolute;
                left: -30%;
                top: 5px;
                color: #bdbdbd;
                &:before {
                    font-size: 20px
                }
            }
            .choice_page_ul li > div {
                height: 34px;
                line-height: 34px;
                width: 70%;
                text-align: center;
                display: inline-block;
                cursor: pointer;
                color: @black_2;
                border-radius: 4px;
                border: 1px dashed rgb(215, 215, 215);
                overflow: hidden;
            }
        }
        .testTaskDiv {
            display: flex;
            justify-content: space-between;
            .testTaskLeft {
                width: 240px;
                .tipsText {
                    color: #bdbdbd;
                    font-size: 13px;
                    display: inline-block;
                    margin-bottom: 15px;
                }
                .choice_title_Stand {
                    font-size: 13px;
                    color: @black_2;
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 10px 5px 0;
                }
                //測試任務要求樣式dl
                dl {
                    dt {
                        font-size: 13px;
                        font-weight: lighter;
                    }
                    dd {
                        margin: 15px 0;
                        font-size: 13px;
                        color: #ccc;
                        padding-right: 15px;
                        .uploadFileSty {
                            padding: 5px 0;
                            a {
                                color: #3bceb6;
                                margin-left: 10px;
                                &:hover {
                                    text-decoration-line: underline;
                                }
                            }
                        }
                    }
                }

            }
            .testTaskright {
                width: 600px;
                .tipsText {
                    width: 100%;
                    font-size: 13px;
                    color: #bdbdbd;
                    display: inline-block;
                    margin-bottom: 20px;
                }
                .contenerFile {
                    width: 100%;
                    height: 342px;
                    border-radius: 3px;
                    position: relative;
                    /*border: 1px solid #f3f1f1;*/
                    .upload_box {
                        margin: 0;
                        height: 342px;
                        .all_upload_page {
                            height: 100%;
                        }
                        .uploadContainer {

                        }
                        .yu_lan {
                            position: relative;
                            border-radius: 3px;
                            text-align: center;
                            height: 100%;
                            width: 100%;
                            overflow: hidden;
                            border: 1px solid #f3f1f1;
                            img {
                                max-height: 342px;
                                max-width: 600px;
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                margin: auto;
                            }
                            > .unknown-file-show {
                                width: 100%;
                                height: 100%;
                                > p {
                                    font-size: 15px;
                                    color: #888;
                                    text-align: center;
                                    margin-top: 158px;
                                }
                            }
                            .upload-audio-player {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                    .spinPop {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: rgba(0, 0, 0, .5);
                        z-index: 2;
                    }
                }
                .selectMainMaxDiv {
                    .yulan_span {
                        width: 100%;
                        background: #fff;
                        padding: 10px 0 5px;
                        overflow: hidden;
                        margin: 15px 0 0;
                        display: flex;
                        justify-content: space-between;
                        .yulanBacks {
                            display: inline-block;
                            padding: 4px;
                            background: #fff;
                            border: 1px dashed #bdbdbd;
                            position: relative;
                            cursor: pointer;
                            border-radius: 4px;
                            margin-bottom: 10px;
                            margin-right: 10px;
                            i {
                                font-style: normal
                            }
                        }
                        .yulanBack {
                            background: #c8f9f3 !important;
                            color: #17ceb1;
                            border: 1px solid #c8f9f3 !important;
                            .precond {
                                color: @base;
                            }
                        }
                        button {
                            float: right;
                            margin-left: 10px
                        }
                        .settingBtnOk {
                            border: 0;
                            background: #fff;
                            color: @base;
                            outline: none;
                            height: 30px;
                            line-height: 30px
                        }
                        .againFileBtn, .settingMainFile {
                            border: 1px solid @base;
                            color: @base;
                            background: #fff;
                            border-radius: 3px;
                            outline: none;
                            margin-left: 10px;
                            height: 30px;
                            line-height: 30px;
                            &:hover {
                                cursor: pointer;
                                background: @base;
                                color: #fff
                            }
                        }

                        .file-display-list {
                            width: 74%;
                            max-height: 138px;
                            overflow-x: hidden;
                            overflow-y: auto;
                        }
                        .operation-btn-groups {
                            width: 26%;
                        }
                    }
                    .tipsUpload {
                        text-align: right;
                        color: rgb(252, 196, 74);
                        font-size: 12px;
                        background: #fff;
                    }
                }
                .actionBtn {
                    text-align: right;
                    margin-top: 20px;
                    button {
                        cursor: pointer;
                        border-radius: 3px;
                        padding: 0px 15px;
                        border: 0;
                        font-size: 13px;
                        margin-left: 15px;
                        line-height: 40px;
                        height: 40px;
                        width: 110px;
                        outline: none;
                        &.caell {
                            color: @black_2;
                            background: #f3f3f3;

                        }
                        &.ok {
                            color: @white;
                            background: @base;
                        }
                    }

                }
            }
        }
    }
</style>
