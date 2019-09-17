<template>
    <!--<transition name="fade">-->
        <div class="file-detection-mask" v-if="showDetectionModal">
            <div class="detection-tips-container">
                <h1 class="detection-header">
                    <span>{{$t('tip.tip_detectionTip')}}</span>
                    <!--<a class="close-tips-btn" @click="closeFileDetectionModal()">-->
                        <!--<Icon type="close-round"></Icon>-->
                    <!--</a>-->
                </h1>
                <div class="detection-body">
                    <h2>{{$t('tip.tip_nearlyFileInformation')}}:</h2>
                    <p :title="fileDetectionData.fileName">{{$t('lang.lang_file')}}{{$t('lang.lang_name')}}: {{fileDetectionData.fileName}}</p>
                    <p>{{$t('lang.lang_file')}}{{$t('lang.lang_type')}}: {{fileDetectionData.displayType}}</p>
                    <p v-if="fileDetectionData.fileType === 'img'">{{$t('lang.lang_picture')}}{{$t('lang.lang_measure')}}: {{fileDetectionData.fileSize}}</p>
                    <p v-if="fileDetectionData.fileType === 'video'">{{$t('main.main_videoPixels')}}：{{fileDetectionData.pixels}}</p>
                    <p v-if="fileDetectionData.fileType === 'video'">{{$t('main.main_videoDuration')}}：{{fileDetectionData.duration}}</p>
                    <p>{{$t('main.main_stage')}}: {{$t('project.pro_di')}} {{fileDetectionData.stage}} {{$t('main.main_stage')}} - {{fileDetectionData.stageName}}</p>
                </div>
            </div>
        </div>
    <!--</transition>-->
</template>

<script>
    export default {
        name: "fileDetection",
        props: {
            mainFileData: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                showDetectionModal: false,
                fileDetectionData: {
                    fileName: null,
                    displayType: null,
                    fileType: null,
                    fileSize: null,
                    pixels: null,
                    duration: null,
                    stage: null,
                    stageName: null
                },
                fileTypes: [
                    {
                        type: ['.jpg', '.png', '.jpeg', '.bmp', '.gif'],
                        displayType: i18n.t('lang.lang_picture')
                    },
                    {
                        type: ['.mp4', '.rmvb', '.avi', '.mkv'],
                        displayType: i18n.t('lang.lang_video')
                    },
                    {
                        type: ['.fbx', '.3ds', '.stl', '.json', '.obj'],
                        displayType: i18n.t('lang.lang_3dModule')
                    }
                ]
            };
        },
        mounted () {
            this.fileDetectionInit();
        },
        methods: {
            fileDetectionInit () {
                let _this = this;
                if (this.mainFileData && this.mainFileData.stage_file && this.mainFileData.stage_file.trim().length > 0) {
                    let mainFileData = this.mainFileData;
                    let filterFileData = {
                        projectName: mainFileData.project_name,
                        fileUrl: mainFileData.stage_file,
                        stageList: this.$PublicFuns.sortByKey(mainFileData.stage_list, 'time'),
                        stage: mainFileData.stage
                    };
                    this.getFileProperties(filterFileData.fileUrl)
                        .then(() => {
                            let lastStage = filterFileData.stageList[filterFileData.stageList.length - 1];
                            let matchedStage = filterFileData.stage.filter(item => item.stage === lastStage.stage);
                            _this.fileDetectionData.stage = matchedStage[0].stage;
                            _this.fileDetectionData.stageName = matchedStage[0].stage_name;
                            _this.showDetectionModal = true;
                            // _this.autoCloseModal();
                        });
                }
            },
            getFileProperties (fileUrl) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    let displayType = null;
                    let fileName = '';
                    let ext = '';
                    let start = fileUrl.lastIndexOf('/');
                    let end = fileUrl.lastIndexOf('.');
                    let hasSymbol = fileUrl.lastIndexOf('?');
                    if (hasSymbol !== -1) {
                        ext = fileUrl.substring(end, hasSymbol - 1).toLowerCase();
                        fileName = fileUrl.substring(start + 1, hasSymbol - 1);
                    } else {
                        ext = fileUrl.substring(end).toLowerCase();
                        fileName = fileUrl.substring(start + 1);
                    }
                    if (_this.fileTypes[0].type.includes(ext)) {
                        _this.getImageProperty(fileUrl)
                            .then(size => {
                                _this.fileDetectionData.fileSize = size;
                                displayType = _this.fileTypes[0].displayType;
                                _this.fileDetectionData.fileType = 'img';
                                _this.fileDetectionData.displayType = displayType;
                                _this.fileDetectionData.fileName = fileName;
                                resolve(_this.fileDetectionData);
                            });
                    } else if (_this.fileTypes[1].type.includes(ext)) {
                        _this.getVideoProperty(fileUrl)
                            .then(videoInfo => {
                                displayType = _this.fileTypes[1].displayType;
                                _this.fileDetectionData.fileType = 'video';
                                _this.fileDetectionData.duration = videoInfo.duration;
                                _this.fileDetectionData.pixels = videoInfo.pixels;
                                _this.fileDetectionData.displayType = displayType;
                                _this.fileDetectionData.fileName = fileName;
                                resolve(_this.fileDetectionData);
                            });
                    } else if (_this.fileTypes[2].type.includes(ext)) {
                        displayType = _this.fileTypes[2].displayType;
                        _this.fileDetectionData.fileType = '3d';
                        _this.fileDetectionData.displayType = displayType;
                        _this.fileDetectionData.fileName = fileName;
                        resolve(_this.fileDetectionData);
                    } else {
                        displayType = ext.toUpperCase();
                        _this.fileDetectionData.displayType = displayType;
                        _this.fileDetectionData.fileName = fileName;
                        resolve(_this.fileDetectionData);
                    }
                });
            },
            getImageProperty (url) {
                return new Promise((resolve, reject) => {
                    if (url && url.length > 0) {
                        let size = '';
                        let image = new Image();
                        image.src = url;
                        image.onload = () => {
                            size = image.width + ' * ' + image.height;
                            resolve(size);
                        };
                    }
                });
            },
            getVideoProperty (url) {
                let _this = this;
                let el = document.createElement('video');
                let duration = 0;
                let videoProperty = {};
                return new Promise((resolve, reject) => {
                    if (el) {
                        el.src = url;
                        setTimeout(() => {
                            duration = _this.$PublicFuns.calculationTime(el.duration || 0);
                            videoProperty = {
                                duration: duration,
                                pixels: el.videoWidth + ' * ' + el.videoHeight
                            };
                            resolve(videoProperty);
                        }, 1000);
                    }
                });
            },
            closeFileDetectionModal () {
                this.showDetectionModal = false;
            },
            autoCloseModal () {
                let timeClock = setTimeout(() => {
                    this.showDetectionModal = false;
                    clearInterval(timeClock);
                    timeClock = null;
                }, 5000);
            }
        }
    };
</script>

<style lang="less" scoped>
    .file-detection-mask {
        /*position: fixed;*/
        width: 100%;
        height: 100%;
        /*top: 0;*/
        /*left: 0;*/
        /*background: rgba(0, 0, 0, 0.28);*/
        /*z-index: 9999;*/
        > .detection-tips-container {
            /*position: absolute;*/
            /*width: 430px;*/
            /*top: 50px;*/
            /*left: 50%;*/
            padding: 0 10px 0 0;
            /*margin-left: -250px;*/
            background: #fff;
            /*-webkit-border-radius: 5px;*/
            /*-moz-border-radius: 5px;*/
            /*border-radius: 5px;*/
            /*-webkit-box-shadow: 0 0 6px 2px #cfcfcf;*/
            /*-moz-box-shadow: 0 0 6px 2px #cfcfcf;*/
            /*box-shadow: 0 0 6px 2px #cfcfcf;*/
            overflow: hidden;
            > h1 {
                width: 100%;
                /*height: 50px;*/
                /*line-height: 50px;*/
                padding: 0;
                font-weight: normal;
                font-size: 13px;
                color: #bdbdbd;
                /*<!--background: url("https://static.banbooyun.com/public/img/headBarBGimg.png") no-repeat left top / cover;-->*/
                > a.close-tips-btn {
                    float: right;
                    color: #fff;
                    > i {
                        font-weight: normal;
                    }
                }
            }
            > .detection-body {
                width: 100%;
                padding: 20px 0;
                > h2 {
                    font-weight: normal;
                    font-size: 13px;
                    margin-bottom: 10px;
                }
                > p {
                    padding: 0;
                    line-height: 30px;
                    font-size: 13px;
                    overflow: hidden;
                    -ms-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
</style>
