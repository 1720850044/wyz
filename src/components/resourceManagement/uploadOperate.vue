<template>
    <div class="upload-operate">
        <div class="operate-container">
            <div class="enter-upload-tab" v-show="initUploadParams.type === 'upload'">
                <a :id="uploadId" class="operate-btn">
                    <span><Icon type="upload"></Icon>{{$t('upload.upload_upload')}}</span>
                    <i class="down-triangle"></i>
                </a>
                <div class="choose-upload-type">
                    <div class="slide-down" v-show="showChooseUploadType">
                        <i class="up-triangle"></i>
                        <p class="upload-tips"><i class="iconfonts icon-jingao"></i>{{$t('upload.upload_uploadForbiddenTips')}}</p>
                        <ul>
                            <li :id="uploadId + 'Files'">
                                <Icon type="upload"></Icon>
                                <p>{{$t('upload.upload_upload')}}{{$t('lang.lang_file')}}</p>
                            </li>
                            <li :id="uploadId + 'Folder'">
                                <i class="iconfonts icon-source-upload-file"></i>
                                <p>{{$t('upload.upload_upload')}}{{$t('lang.lang_folder')}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="downloadIcon" class="enter-download-tab" v-if="initUploadParams.type !== 'upload'" >
                <label @click="enterDownloadTab()">
                    <a class="enter-download-icon">
                        <i class="iconfonts icon-download"></i>
                    </a>
                    <!--<a class="left-icon">-->
                        <!--<span class="line-vertical"></span>-->
                        <!--<span class="line-rotate"></span>-->
                    <!--</a>-->
                    <!--<a class="right-icon">-->
                        <!--<span class="line-vertical"></span>-->
                        <!--<span class="line-rotate"></span>-->
                    <!--</a>-->
                    <span class="number" v-if="(totalDownloadingNum + totalUploadingNum) > 0">{{totalDownloadingNum + totalUploadingNum}}</span>
                </label>
            </div>
        </div>
        <upload-download-modal v-if="showUploadContainer"
               :initModalParams="uploadParams" :uploadFilesData="addedFileList" :uploadSuccessData="uploadSuccessData"
               @closeModal="closeModalList" @deleteFlowObject="deleteFlowInstanceFile" @cancelUploadingFile="cancelUploadingFile">
        </upload-download-modal>
    </div>
</template>

<script>
    /**
     * 上传及下载组件说明：
     * 组件名称: uploadOperate
     * 所需参数：
     *      1. 如果在同个页面需要同时使用多个该组件，需传入各自的 String 类型的 uploadId ；
     *      2. 默认显示按钮为 “上传”，如果需要显示下载，需传入 Object 类型的 uploadParams => {type: 'download'} ;
     *      3. 默认为多文件上传，如只需但文件上传，需传入 Boolean 类型的 singleFile ;
     *      4.上传默认为从根目录(0) 开始，如需指定路径，需传入 Number 类型的 parentFolder ;
     *      5. (可选择返回本次上传的所有文件，只需在组件外调用方法 @returnSuccessData 即可) .
     */

    import {mapMutations} from 'vuex';
    import Flow from '../../../static/flow';
    import global from '../../global/Global';
    import UploadDownloadModal from "./uploadDownloadModal";

    export default {
        name: "uploadOperate",
        components: {UploadDownloadModal},
        props: {
            skyDrive: {
                type: Array,
                default: ()=>[]
            },
            uploadId: {
                type: String,
                default: 'uploadButton'
            },
            uploadParams: {
                type: Object,
                default: () => ({
                    type: 'upload'
                })
            },
            singleFile: {
                type: Boolean,
                default: false
            },
            parentFolder: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                initUploadParams: {},
                toggleUploadBtnStyle: false,
                uploadRandomFolder: null,
                uploadKey: null,
                parameter: {
                    type: 'normal-upload'
                },
                flowInstance: null,
                showChooseUploadType: false,
                noSupportUpload: false,
                uploadBegin: false,
                addedFileList: [],
                uploadSuccessData: [],
                showUploadContainer: false,
                fileIndex: 0,
                totalDownloadingNum: 0,
                totalUploadingNum: 0
            };
        },
        computed: {
            getDownloadingNum () {
                return this.$store.state.totalDownloadingNum;
            },
            getUploadingNum () {
                return this.$store.state.totalUploadingNum;
            }
        },
        mounted () {
            this.initParams();
            if (this.initUploadParams.type === 'upload') {
                this.initFlow();
                this.uploadRandomFolder = this.$PublicFuns.randomRange(5, 10);
            }
        },
        watch: {
            getDownloadingNum (num) {
                this.totalDownloadingNum = num > 0 ? num : 0;
            },
            getUploadingNum (num) {
                this.totalUploadingNum = num > 0 ? num : 0;
            }
        },
        methods: {
            ...mapMutations(['setDownloadingNum', 'setUploadingNum']),
            initParams () {
                this.initUploadParams = Object.assign({}, this.initUploadParams, this.uploadParams);
            },
            // 获取秘钥
            getSecretKey () {
                let _this = this;
                let url = _this.GLOBAL.baseRouter + "/file/oss/oss";
                this.parameter.fdir = this.parentFolder;
                return _this.$axios.post(url, _this.parameter)
                    .then(data => {
                        if (data.data.err_code !== 0) {
                            _this.$Message.warning(data.data.err_message);
                            return false;
                        } else {
                            _this.uploadKey = data.data;
                            return true;
                        }
                    });
            },
            enterDownloadTab () {
                this.showUploadContainer = true;
            },
            // 转换路径中的中英文 ’,' ，号为 ‘-’
            switchSymbolToLine (str) {
                if (str.indexOf(',') !== -1 || str.indexOf('，') !== -1) {
                    str = str.replace(/,/g, '-');
                    str = str.replace(/，/g, '-');
                }
                return str;
            },
            // 上传初始化接口
            initUploading (filePath) {
                let path = this.GLOBAL.baseRouter + this.$GLOBALAPI.file_dir_bc;
                let params = {
                    path: filePath,
                    fdir: this.parentFolder
                };
                return this.$axios.post(path, params)
                    .then(result => {
                        if (result.data.err_code === 0) {
                            return true;
                        }
                    });
            },
            initFlow () {
                let _this = this;
                let option = {
                    target: global.apiDomain,
                    chunkSize: 10737418240,
                    singleFile: false,
                    testChunks: false,
                    simultaneousUploads: 1,
                    query: {}
                };
                option.singleFile = _this.singleFile;
                let flow = new Flow(option);
                _this.flowInstance = flow;
                if (!flow.support) {
                    _this.noSupportUpload = true;
                }
                if (flow.supportDirectory) {
                    _this.showChooseUploadType = true;
                }
                function byteSizeConversion (bytes) {
                    let unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
                    if (bytes <= 0) {
                        return '0Byte';
                    } else {
                        let e = Math.floor(Math.log(bytes) / Math.log(1024));
                        return (bytes / Math.pow(1024, e)).toFixed(2) + unit[e];
                    }
                }

                function secondsToStr (temp) {
                    function numberEnding (number) {
                        return (number > 1) ? 's' : '';
                    }

                    let years = Math.floor(temp / 31536000);
                    if (years) {
                        return years + ' year' + numberEnding(years);
                    }
                    let days = Math.floor((temp %= 31536000) / 86400);
                    if (days) {
                        return days + ' day' + numberEnding(days);
                    }
                    let hours = Math.floor((temp %= 86400) / 3600);
                    if (hours) {
                        return hours + ' hour' + numberEnding(hours);
                    }
                    let minutes = Math.floor((temp %= 3600) / 60);
                    if (minutes) {
                        return minutes + ' minute' + numberEnding(minutes);
                    }
                    let seconds = temp % 60;
                    return seconds + ' second' + numberEnding(seconds);
                }

                // 注册上传事件
                if (this.skyDrive && this.skyDrive.length > 0){
                    flow.assignBrowse(document.getElementById(_this.skyDrive[0]), false, _this.singleFile);
                    flow.assignBrowse(document.getElementById(_this.skyDrive[1]), true, _this.singleFile);
                } else {
                    flow.assignBrowse([document.getElementById(_this.uploadId), document.getElementById(_this.uploadId + 'Files')], false, _this.singleFile);
                    flow.assignBrowse(document.getElementById(_this.uploadId + 'Folder'), true, _this.singleFile);
                }
                flow.on('fileAdded', function (file, event) {
                    _this.uploadBegin = true;
                });
                flow.on('filesAdded', function (files, event) {
                    if (files && files.length > 0) {
                        let filesAddedList = files.map(item => {
                            item.name = _this.switchSymbolToLine(item.name);
                            item.relativePath = _this.switchSymbolToLine(item.relativePath);
                            item.totalSize = byteSizeConversion(item.size);
                            item.uploadStatus = i18n.t('upload.upload_waitUpload') + '...';
                            item.uploadedSize = byteSizeConversion(0);
                            item.uploadSpeed = '0Byte/s';
                            item.percent = '0%';
                            return item;
                        });
                        let uploadingFile = _this.addedFileList.filter(item => item.percent !== '100%');
                        _this.addedFileList = uploadingFile.concat(filesAddedList);
                        let currentUploadingFiles = _this.addedFileList.filter(item => item.percent !== '100%');
                        _this.setUploadingNum(currentUploadingFiles.length);
                    } else {
                        _this.uploadBegin = false;
                        _this.$Message.warning({
                            content: i18n.t('upload.upload_fileIsExist') + '！',
                            duration: 5
                        });
                    }
                });
                flow.on('filesSubmitted', function (files) {
                    if (files && files.length > 0) {
                        let filePath = files[0].relativePath;
                        let fileName = files[0].name;
                        fileName = _this.switchSymbolToLine(fileName);
                        filePath = _this.switchSymbolToLine(filePath);
                        _this.getSecretKey()
                            .then(flag => {
                                if (flag) {
                                    _this.showUploadContainer = true;
                                    _this.uploadQuery = {
                                        name: fileName,
                                        key: _this.uploadKey.dir + _this.uploadRandomFolder + '/' + filePath,
                                        policy: _this.uploadKey.policy,
                                        OSSAccessKeyId: _this.uploadKey.accessid,
                                        success_action_status: '200',
                                        callback: _this.uploadKey.callback,
                                        signature: _this.uploadKey.signature
                                    };
                                    flow.opts.target = _this.uploadKey.host;
                                    flow.opts.query = _this.uploadQuery;
                                    _this.initUploading(filePath)
                                        .then(flag => {
                                            if (flag) {
                                                flow.upload();
                                            }
                                        });
                                } else {
                                    flow.cancel();
                                }
                            });
                    }
                });
                flow.on('uploadStart', function () {
                    console.log('upload start');
                });
                flow.on('fileProgress', function (file) {
                    if (file.flowObj.opts.singleFile) {
                        _this.addedFileList = _this.addedFileList.filter(item => item.name === file.name);
                    } else {
                        _this.addedFileList.forEach(item => {
                            if (item.relativePath === file.relativePath) {
                                let percent = Math.floor(file.progress() * 100) + '%';
                                let uploadSpeed = byteSizeConversion(file.averageSpeed) + '/s';
                                item.uploadedSize = byteSizeConversion(file.size * file.progress());
                                item.uploadSpeed = uploadSpeed;
                                item.percent = percent;
                                item.uploadStatus = i18n.t('upload.upload_uploading');
                            }
                        });
                    }
                });
                flow.on('fileError', function (file, message) {
                    console.log(file, message);
                });
                flow.on('fileSuccess', function (file, message) {
                    let responseData = JSON.parse(message);
                    responseData.name = file.name;
                    // 判断上一个上传完成的文件位置
                    _this.addedFileList.forEach((item, index) => {
                        if (item.relativePath === file.relativePath) {
                            item.uploadStatus = i18n.t('upload.upload_uploadDone');
                            _this.fileIndex = index;
                            _this.fileIndex ++;
                        }
                    });
                    let uploadingNum = _this.addedFileList.filter(item => item.percent !== '100%').length;
                    _this.setUploadingNum(uploadingNum);
                    let filePath = _this.addedFileList[_this.fileIndex] ? _this.addedFileList[_this.fileIndex].relativePath : null;
                    if (filePath) {
                        let fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
                        fileName = _this.switchSymbolToLine(fileName);
                        filePath = _this.switchSymbolToLine(filePath);
                        _this.uploadQuery.name = fileName;
                        _this.uploadQuery.key = _this.uploadKey.dir + _this.uploadRandomFolder + '/' + filePath;
                        flow.pause();
                        _this.initUploading(filePath)
                            .then(flag => {
                                if (flag) {
                                    flow.resume();
                                }
                            });
                    }
                    _this.uploadSuccessData.push(responseData);
                });
                flow.on('complete', function () {
                    _this.uploadBegin = false;
                    _this.flowInstance.files = [];
                    // _this.uploadRandomFolder = _this.$PublicFuns.randomRange(5, 10);
                    _this.returnUploadedData();
                });
            },
            resumePauseFile (file) {
                this.addedFileList.forEach(item => {
                    if (item.relativePath === file.relativePath) {
                        item.paused ? item.resume() : item.pause();
                    }
                });
            },
            removeFile (file) {
                this.addedFileList.forEach((item, index) => {
                    if (item.relativePath === file.relativePath) {
                        item.cancel();
                        this.addedFileList.splice(index, 1);
                    }
                });
            },
            deleteFlowInstanceFile (file) {
                if (this.initUploadParams.type === 'upload') {
                    this.flowInstance.files.forEach((item, index) => {
                        if (item.relativePath === file.relativePath) {
                            this.flowInstance.files.splice(index, 1);
                        }
                    });
                }
            },
            deleteViewFile (file) {
                this.deleteFlowInstanceFile(file);
            },
            cancelUploadingFile (file) {
                this.removeFile(file);
            },
            returnUploadedData () {
                // console.log(this.uploadSuccessData);
                this.$emit('returnSuccessData', this.uploadSuccessData);
            },
            closeModalList () {
                if (this.initUploadParams.type === 'upload') {
                    // let filterUploadingList = this.addedFileList.filter(item => item.percent !== '100%') || [];
                    // if (filterUploadingList.length > 0) {
                    //     this.$Modal.confirm({
                    //         title: '关闭上传窗口提示',
                    //         content: '有文件还在上传中，确定关闭将中断上传！',
                    //         onOk: () => {
                    //             this.showUploadContainer = false;
                    //             this.addedFileList = [];
                    //             this.uploadSuccessData = [];
                    //             this.flowInstance.cancel();
                    //         }
                    //     });
                    // } else {
                    this.showUploadContainer = false;
                        // this.addedFileList = [];
                        // this.uploadSuccessData = [];
                        // this.flowInstance.cancel();
                    // }
                } else {
                    this.showUploadContainer = false;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .upload-operate {
        float: left;
        .operate-container {
            position: relative;
            z-index: 9;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
            > .enter-upload-tab {
                float: left;
                &:hover {
                    .choose-upload-type {
                        display: block;
                        opacity: 1;
                        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
                        filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
                    }
                }
                > a.operate-btn {
                    position: relative;
                    display: block;
                    width: 96px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    background: @base;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    > span i {
                        display: block;
                        position: absolute;
                        left: 8px;
                        margin-top: 8px;
                        font-size: 23px;
                        color: #fff;
                    }
                    > i.down-triangle {
                        position: absolute;
                        width: 0;
                        height: 0;
                        top: 17px;
                        right: 8px;
                        padding: 0;
                        border-width: 6px 5px 0 5px;
                        border-style: solid;
                        border-color: rgba(255, 255, 255, 0.95) transparent transparent;
                    }
                    > span {
                        font-size: 14px;
                        color: #fff;
                    }
                }
                > .choose-upload-type {
                    display: none;
                    position: absolute;
                    top: 38px;
                    right: 0;
                    width: 250px;
                    padding-top: 15px;
                    opacity: 0;
                    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
                    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
                    > .slide-down {
                        position: relative;
                        border: 1px solid #eee;
                        border-top: none;
                        -webkit-border-radius: 5px;
                        -moz-border-radius: 5px;
                        border-radius: 5px;
                        background: #fff;
                        -webkit-box-shadow: 0 0 3px 1px rgba(60, 210, 180, 0.6);
                        -moz-box-shadow: 0 0 3px 1px rgba(60, 210, 180, 0.6);
                        box-shadow: 0 0 3px 1px rgba(60, 210, 180, 0.6);
                        > i.up-triangle {
                            position: absolute;
                            top: -12px;
                            right: 38px;
                            border-width: 0 8px 15px 8px;
                            border-style: solid;
                            border-color: transparent transparent rgba(255, 255, 255, 1);
                            &:after {
                                content: '';
                                position: absolute;
                                top: -3px;
                                left: -9px;
                                border-width: 0 9px 16px 9px;
                                border-style: solid;
                                border-color: transparent transparent rgba(60, 210, 180, 0.6);
                                filter: blur(2px);
                                z-index: -1;
                            }
                        }
                        > .upload-tips {
                            text-align: center;
                            line-height: 40px;
                            color: #fb0;
                            margin: 0 20px;
                            border-bottom: 1px solid #eee;
                            > i {
                                font-size: 14px;
                                margin-right: 5px;
                            }
                        }
                        > ul {
                            overflow: hidden;
                            display: flex;
                            justify-content: space-around;
                            padding: 10px 0 15px;
                            > li {
                                float: left;
                                width: 100%;
                                text-align: center;
                                color: #666;
                                cursor: pointer;
                                -webkit-transition: all 0.3s;
                                -moz-transition: all 0.3s;
                                -ms-transition: all 0.3s;
                                -o-transition: all 0.3s;
                                transition: all 0.3s;
                                > i {
                                    font-size: 30px;
                                    color: #aaa;
                                    &.icon-source-upload-file {
                                        display: block;
                                        font-size: 23px;
                                        margin: 3px 0 4px;
                                    }
                                }
                                > p {
                                    color: #888;
                                    font-size: 13px;
                                }
                                &:hover {
                                    > i, > p {
                                        color: @base;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            > .enter-download-tab {
                padding-top: 8px;
                margin-right: 12px;
                > label {
                    position: relative;
                    display: block;
                    width: 30px;
                    height: 24px;
                    &:hover {
                        > a > i {
                            color: @base;
                        }
                    }
                    > a {
                        display: block;
                        float: left;
                        line-height: 18px;
                        margin-top: -2px;
                        > i {
                            font-size: 28px;
                            margin: 0;
                            padding: 0;
                        }
                    }
                    /*> a.right-icon {*/
                        /*-webkit-transform: rotate(180deg);*/
                        /*-moz-transform: rotate(180deg);*/
                        /*-ms-transform: rotate(180deg);*/
                        /*-o-transform: rotate(180deg);*/
                        /*transform: rotate(180deg);*/
                        /*margin-top: 4px;*/
                        /*margin-left: -6px;*/
                    /*}*/
                    > .number {
                        position: absolute;
                        top: -5px;
                        left: 15px;
                        display: block;
                        width: 20px;
                        height: 14px;
                        background: @red;
                        color: #fff;
                        text-align: center;
                        line-height: 13px;
                        -webkit-border-radius: 20px;
                        -moz-border-radius: 20px;
                        border-radius: 20px;
                        -webkit-transform: scale(0.9);
                        -moz-transform: scale(0.9);
                        -ms-transform: scale(0.9);
                        -o-transform: scale(0.9);
                        transform: scale(0.9);
                    }
                }
            }
        }
    }
</style>
