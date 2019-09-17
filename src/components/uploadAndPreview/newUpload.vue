<template>
    <div class="single-upload-container">
        <div id="dropUpload" class="single-upload-content" v-show="!uploadBegin && !uploadComplete">
            <h1 class="upload-production">
                <div class="upload-btn-groups">
                    <a class="normal-btn" :style="initUploadTips.definedBtnStyle">
                        <span :id="uploadId">
                            <Icon type="upload" :style="initUploadTips.definedIconStyle"></Icon>{{initUploadTips.selectBtnText}}
                        </span>
                        <dl class="upload-slide-down" v-if="initUploadTips.needUploadFolder">
                            <dd :id="uploadId + 'FileBtn'">{{$t('upload.upload_uploadFile')}}</dd>
                            <dd :id="uploadId + 'FolderBtn'">{{$t('upload.upload_uploadFolder')}}</dd>
                        </dl>
                    </a>
                </div>

                <p>{{initUploadTips.uploadTips[0]}}</p>
                <p>{{initUploadTips.uploadTips[1]}}</p>
                <p>{{initUploadTips.uploadTips[2]}}</p>
                <p>{{initUploadTips.uploadTips[3]}}</p>
            </h1>
        </div>
        <div class="single-upload-progress" v-show="uploadBegin">
            <ul>
                <li class="file-uploading-bar" v-for="uploadFile in fileUploadList">
                    <div class="single-progress-bar">
                        <p class="upload-status">
                            <label>{{uploadFile.name}}</label>
                            <span>{{uploadFile.uploadStatus}}（{{uploadFile.percent}}）</span>
                        </p>
                        <div class="uploaded-progress" :style="{width: uploadFile.percent}"></div>
                        <div class="upload-file-details">
                            <ul>
                                <li>{{$t('upload.upload_uploaded')}}: {{uploadFile.uploadedSize}}({{uploadFile.percent}})</li>
                                <li>{{$t('upload.upload_speed')}}: {{uploadFile.uploadSpeed}}</li>
                                <li>{{$t('upload.upload_size')}}: {{uploadFile.totalSize}}</li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    /**
     * Component parameters
     *  如果在同一个页面使用多个上传组件，则必须传入各自的 uploadId；
     *  如果需要自定义 {文件格式提示} {按钮的内容及图标样式}，传入initSingleParams 对象所对应的字段：
     *  selectBtnText：按钮内容
     *  uploadTips：上传文件格式提示
     *  definedBtnStyle：按钮样式
     *  definedIconStyle：上传图标样式
     *  singleFile: 上传方式默认为 多文件上传，若是单文件上传，需传入 singleFile 字段为 true;
     *  needUploadFolder: 默认支持文件夹上传，如不需要则可传入 needUploadFolder 字段为 false
     */

    import Flow from '../../../static/flow';
    import global from '../../global/Global';
    import previewModal from "./previewModal";

    export default {
        name: 'new-upload',
        props: {
            uploadId: {
                type: String,
                default: () => 'singleUpload'
            },
            initSingleParams: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                initUploadTips: {
                    selectBtnText: i18n.t('upload.upload_chooseFile'),
                    // uploadTips: '可支持上传的文件类型及格式分别有：图片：.jpg, .png, .gif, .bmp；视频：.mp4, .avi, .rmvb；3D模型：.fbx, .obj, .json, .stl, .3ds；3D模型贴图：.dds, .png, .jpg, .tga。其他支持格式正在努力完善中...',
                    uploadTips: [i18n.t('tip.tip_previewOnlineExt'), i18n.t('lang.lang_picture') + ': .jpg, .png, .gif, .bmp', i18n.t('lang.lang_video') + ': .mp4, .avi, .rmvb', i18n.t('lang.lang_3dModule') + ': .fbx, .obj, .json, .stl, .3ds(' + i18n.t('lang.lang_texture') + ': .dds, .png, .jpg, .tga)'],
                    definedBtnStyle: '',
                    definedIconStyle: '',
                    needUploadFolder: true,
                    singleFile: false
                },
                uploadKey: null,
                flowInstance: null,
                noSupportUpload: false,
                uploadBegin: false,
                uploadComplete: false,
                uploadQuery: {},
                parameter: {
                    type: 'upload'
                },
                uploadSuccessResponse: [],
                fileUploadList: []
            };
        },
        created () {

        },
        computed: {},
        mounted () {
            this.initFlow();
        },
        methods: {
            // 获取秘钥
            getSecretKey () {
                let _this = this;
                let url = _this.GLOBAL.baseRouter + "/file/oss/oss";
                return new Promise((resolve, reject) => {
                    if (_this.uploadKey === null) {
                        _this.$axios.post(url, _this.parameter).then(data => {
                            _this.uploadKey = data.data;
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            },
            initFlow () {
                this.initUploadTips = Object.assign({}, this.initUploadTips, this.initSingleParams);
                this.uploadRandomFolder = this.$PublicFuns.randomRange(5, 10);
                let _this = this;
                let option = {
                    target: global.apiDomain,
                    chunkSize: 10737418240,
                    singleFile: true,
                    testChunks: false,
                    simultaneousUploads: 1,
                    query: {}
                };
                option.singleFile = _this.initUploadTips.singleFile;
                let flow = new Flow(option);
                _this.flowInstance = flow;
                if (!flow.support) {
                    _this.noSupportUpload = true;
                }

                function readablizeBytes (bytes) {
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

                flow.assignBrowse(document.getElementById(_this.uploadId));
                if (_this.initUploadTips.needUploadFolder) {
                    flow.assignBrowse(document.getElementById(_this.uploadId + 'FileBtn'));
                    flow.assignBrowse(document.getElementById(_this.uploadId + 'FolderBtn'), _this.initUploadTips.needUploadFolder);
                }
                flow.assignDrop(document.getElementById('dropUpload'));
                flow.on('fileAdded', function (file, event) {
                    _this.uploadBegin = true;
                });
                flow.on('filesAdded', function (files, event) {
                    let filesAddedList = files.map(item => {
                        item.totalSize = readablizeBytes(item.size);
                        item.uploadStatus = i18n.t('upload.upload_waitUpload') + '...';
                        item.uploadedSize = readablizeBytes(0);
                        item.uploadSpeed = '0Byte/s';
                        item.percent = '0%';
                        return item;
                    });
                    _this.fileUploadList = _this.fileUploadList.concat(filesAddedList);
                });
                flow.on('filesSubmitted', function (files) {
                    _this.getSecretKey()
                        .then(() => {
                            _this.uploadQuery = {
                                name: files[0].name,
                                key: _this.uploadKey.dir + _this.uploadRandomFolder + '/' + files[0].relativePath,
                                policy: _this.uploadKey.policy,
                                OSSAccessKeyId: _this.uploadKey.accessid,
                                success_action_status: '200',
                                callback: _this.uploadKey.callback,
                                signature: _this.uploadKey.signature
                            };
                            flow.opts.target = _this.uploadKey.host;
                            flow.opts.query = _this.uploadQuery;
                            flow.upload();
                        });
                });
                flow.on('uploadStart', function () {
                    // console.log('upload start');
                });
                flow.on('fileProgress', function (file) {
                    if (file.flowObj.opts.singleFile) {
                        _this.fileUploadList = _this.fileUploadList.filter(item => item.name === file.name);
                    } else {
                        _this.fileUploadList.forEach(item => {
                            if (item.name === file.name) {
                                let percent = Math.floor(file.progress() * 100) + '%';
                                let uploadSpeed = readablizeBytes(file.averageSpeed) + '/s';
                                item.uploadedSize = readablizeBytes(file.size * file.progress());
                                item.uploadSpeed = uploadSpeed;
                                item.percent = percent;
                                item.uploadStatus = i18n.t('upload.upload_uploading') + '...';
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
                    _this.fileUploadList.forEach((item, index) => {
                        if (item.name === file.name) {
                            _this.fileUploadList.splice(index, 1);
                        }
                    });
                    let filePath = _this.fileUploadList[0] ? _this.fileUploadList[0].relativePath : null;
                    if (filePath) {
                        _this.uploadQuery.name = filePath.substring(filePath.lastIndexOf('/') + 1);
                        _this.uploadQuery.key = _this.uploadKey.dir + _this.uploadRandomFolder + '/' + filePath;
                    }
                    // // 判断上传的文件类型
                    // _this.uploadSuccessResponse.push(responseData);
                    // _this.uploadSuccessResponse.forEach(opt => {
                    //     let index = opt.name.lastIndexOf('.');
                    //     let ext = opt.name.substring(index).toLowerCase();
                    //     if (ext) {
                    //         switch (ext) {
                    //             case '.jpg':
                    //             case '.jpeg':
                    //             case '.png':
                    //             case '.bmp':
                    //             case '.gif':
                    //                 opt.fileType = 'img';
                    //                 break;
                    //             case '.mp4':
                    //             case '.rmvb':
                    //             case '.avi':
                    //             case '.mpg':
                    //             case '.mkv':
                    //                 opt.fileType = 'video';
                    //                 break;
                    //             case '.fbx':
                    //             case '.3ds':
                    //             case '.obj':
                    //             case '.json':
                    //             case '.stl':
                    //                 opt.fileType = '3d';
                    //                 break;
                    //             default:
                    //                 opt.fileType = 'unknown';
                    //                 break;
                    //         }
                    //     }
                    // });
                    // _this.uploadSuccessResponse.forEach(item => {
                    //     if (item.file_url === responseData.file_url && item.fileType === 'img') {
                    //         let fileUrl = item.file_url;
                    //         let index = fileUrl.lastIndexOf('.');
                    //         let ext = fileUrl.substring(index).toLowerCase();
                    //         if (ext !== '.gif') {
                    //             item.file_url += '?x-oss-process=style/tw';
                    //         }
                    //     }
                    // });
                    _this.$emit("FileUploadedSuccess", responseData);
                });
                flow.on('complete', function () {
                    _this.uploadBegin = false;
                    _this.fileUploadList = [];
                    _this.flowInstance.files = [];
                    _this.$emit("fileUploadComplete");
                });
            }
        },
        components: {previewModal}
    };
</script>

<style lang="less" scoped>
    .single-upload-container {
        width: 100%;
        height: 100%;
        position: relative;
        border: 1px dashed #dfdfdf;
        background: #fff;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -ms-transition: all 0.3s;
        -o-transition: all 0.3s;
        transition: all 0.3s;
        &:hover {
            border: 1px dashed @base;
        }
        > .single-upload-content {
            position: absolute;
            width: 100%;
            height: 100%;
            &:hover {
                cursor: pointer;
                p.file-tips {
                    bottom: 0;
                }
            }
            .upload-production {
                position: absolute;
                width: 100%;
                height: 86px;
                top: 100px;
                right: 0;
                /*bottom: 0;*/
                left: 0;
                margin: auto;
                text-align: center;
                font-weight: normal;
                > .upload-btn-groups {
                    margin-bottom: 20px;
                    > a.normal-btn {
                        position: relative;
                        width: 118px;
                        height: 32px;
                        line-height: 32px;
                        -webkit-border-radius: 3px;
                        -moz-border-radius: 3px;
                        border-radius: 3px;
                        background: @base;
                        font-weight: normal;
                        color: #fff;
                        margin: 0 auto;
                        font-size: 14px;
                        > span {
                            display: flex;
                            justify-content: center;
                            i {
                                display: block;
                                font-size: 22px;
                                margin: 5px 5px 0 0;
                            }
                        }
                        &:hover {
                            > .upload-slide-down {
                                opacity: 1;
                                -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
                                filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
                            }
                        }
                        > .upload-slide-down {
                            position: absolute;
                            width: 116px;
                            height: 58px;
                            top: 31px;
                            left: 1px;
                            color: #777;
                            background: #fff;
                            border: 1px solid #ededed;
                            -webkit-border-radius: 0 0 3px 3px;
                            -moz-border-radius: 0 0 3px 3px;
                            border-radius: 0 0 3px 3px;
                            overflow: hidden;
                            -webkit-box-shadow: 0 0 2px 1px #e0e0e0;
                            -moz-box-shadow: 0 0 2px 1px #e0e0e0;
                            box-shadow: 0 0 2px 1px #e0e0e0;
                            opacity: 0;
                            -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
                            filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
                            -webkit-transition: all 0.3s;
                            -moz-transition: all 0.3s;
                            -ms-transition: all 0.3s;
                            -o-transition: all 0.3s;
                            transition: all 0.3s;
                            border-top: none;
                            > dd {
                                font-size: 13px;
                                line-height: 29px;
                                &:hover {
                                    background: rgba(60, 210, 180, 0.3);
                                }
                            }
                        }
                    }
                }
                > p {
                    font-size: 13px;
                    color: #999;
                    line-height: 22px;
                    text-align: left;
                    padding: 3px 20px 3px 110px;
                }
            }
            > p.file-tips {
                position: absolute;
                bottom: -40px;
                left: 0;
                font-size: 12px;
                width: 100%;
                padding: 5px 10px;
                text-align: center;
                background: rgba(0, 0, 0, 0.3);
                color: #fff;
                -webkit-transition: all 0.3s;
                -moz-transition: all 0.3s;
                -ms-transition: all 0.3s;
                -o-transition: all 0.3s;
                transition: all 0.3s;
            }
        }
        > .single-upload-progress {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            > ul {
                > li.file-uploading-bar {
                    width: 100%;
                    height: 68px;
                    overflow: hidden;
                    margin-bottom: 10px;
                    .single-progress-bar {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        background: rgba(210, 210, 210, 0.18);
                        > .upload-status {
                            position: absolute;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            left: 0;
                            margin: auto;
                            width: 100%;
                            height: 30px;
                            line-height: 30px;
                            text-align: center;
                            > label {
                                position: absolute;
                                padding-left: 20px;
                                display: block;
                                max-width: 185px;
                                overflow: hidden;
                                -ms-text-overflow: ellipsis;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            > span {
                                display: block;
                                width: 100%;
                                text-align: center;
                            }
                        }
                        > .uploaded-progress {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 0;
                            height: 100%;
                            background: linear-gradient(to right, rgba(60, 210, 180, 0.2), rgba(60, 210, 180, 0.5));
                        }
                        > .upload-file-details {
                            position: absolute;
                            top: -100%;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.4);
                            -webkit-transition: all 0.3s;
                            -moz-transition: all 0.3s;
                            -ms-transition: all 0.3s;
                            -o-transition: all 0.3s;
                            transition: all 0.3s;
                            > ul {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-around;
                                li {
                                    width: 100%;
                                    padding-left: 20px;
                                    color: #fff;
                                }
                            }
                        }
                        &:hover {
                            > .upload-file-details {
                                top: 0;
                            }
                        }
                    }
                }
            }
        }
        > .image-position {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            > img {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                max-width: 100%;
                max-height: 100%;
            }
            > .reupload-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9;
                opacity: 0;
                -webkit-transition: all 0.5s;
                -moz-transition: all 0.5s;
                -ms-transition: all 0.5s;
                -o-transition: all 0.5s;
                transition: all 0.5s;
                > p {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    > a > i {
                        font-size: 30px;
                        color: #fff;
                        -webkit-transition: all 0.3s;
                        -moz-transition: all 0.3s;
                        -ms-transition: all 0.3s;
                        -o-transition: all 0.3s;
                        transition: all 0.3s;
                        &:hover {
                            color: @base;
                        }
                    }
                }
            }
            &:hover {
                .reupload-image {
                    opacity: 1;
                }
            }
        }
    }
</style>
