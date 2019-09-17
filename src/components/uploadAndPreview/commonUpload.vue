<template>
    <div class="popup-mask" v-if="showUploadParams.popup">
        <div class="upload-container" :class="{'all-info-false': !showOtherInfos.fieldLabel && !showOtherInfos.styleLabel && !showOtherInfos.fileDescribe}">
            <!--{'field-label-false': !showOtherInfos.fieldLabel && showOtherInfos.styleLabel && showOtherInfos.fileDescribe,-->
            <!--'style-label-false': !showOtherInfos.styleLabel && showOtherInfos.fieldLabel && showOtherInfos.fileDescribe,-->
            <!--'file-desc-false': !showOtherInfos.fileDescribe && showOtherInfos.styleLabel && showOtherInfos.fieldLabel}-->
            <div class="upload-bar">
                <div class="upload-file-ext-tips">
                    <p><label>{{$t('upload.upload_upload')}}{{$t('lang.lang_tip')}}:</label>{{initUploadTips.uploadTips}}</p>
                </div>
                <div class="upload-file-type">
                    <label>{{$t('upload.upload_uploadFileType')}}:</label>
                    <ul>
                        <li :class="{'selected-type': item.selected}" v-for="(item, index) in uploadFileType" :key="index" @click="selectUploadFileType(item)">{{item.name}}</li>
                    </ul>
                </div>
                <div id="dropArea" class="upload-area">
                    <div class="upload-content" v-show="!uploadBegin">
                        <div class="upload-btn">
                            <a id="uploadBtn" class="outside-option">
                                <Icon type="upload"></Icon>
                                {{initUploadTips.selectBtnText}}
                            </a>
                            <div class="choose-upload-type" v-show="showChooseUploadType">
                                <ul>
                                    <li id="uploadFiles">{{$t('upload.upload_uploadFile')}}</li>
                                    <li id="uploadFolder">{{$t('upload.upload_uploadFolder')}}</li>
                                </ul>
                            </div>
                        </div>
                        <p class="upload-file-profile">
                            <span>{{$t('upload.upload_chooseOrDragFileHereTip')}}</span>
                        </p>
                    </div>
                    <div class="upload-list" v-show="uploadBegin">
                        <ul>
                            <li v-for="(item, index) in addedFileList" :key="index">
                                <label :title="item.name">{{item.name}}</label>
                                <div class="progress-bar">
                                    <span class="upload-status" v-if="showUploadStatus">{{item.uploadStatus}}（{{item.percent}}）</span>
                                    <div class="progress-uploaded" :style="{width: item.percent}"></div>
                                    <div class="file-details">
                                        <div class="upload-progress-details">
                                            <ul>
                                                <li>{{$t('upload.upload_uploaded')}}: {{item.uploadedSize}}({{item.percent}})</li>
                                                <li>{{$t('upload.upload_speed')}}: {{item.uploadSpeed}}</li>
                                                <li>{{$t('upload.upload_size')}}: {{item.totalSize}}</li>
                                            </ul>
                                        </div>
                                        <!--<div class="operate-items">-->
                                        <!--<ul>-->
                                        <!--<li @click="resumePauseFile(item)">-->
                                        <!--<Icon type="play" v-if="item.paused"></Icon>-->
                                        <!--<Icon type="pause" v-else></Icon>-->
                                        <!--</li>-->
                                        <!--<li @click="removeFile(item)">-->
                                        <!--<Icon type="close-round"></Icon>-->
                                        <!--</li>-->
                                        <!--</ul>-->
                                        <!--</div>-->
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="show-support-error" v-if="noSupportUpload">
                        <p>{{$t('upload.upload_browserNotSupportUpload')}}！</p>
                    </div>
                </div>
            </div>

            <div class="uploaded-show-list">
                <h1>{{$t('upload.upload_uploaded')}}{{uploadSuccessResponse.length}}{{$t('lang.lang_ge')}}{{$t('lang.lang_file')}}:</h1>
                <ul>
                    <li v-for="(item, index) in uploadSuccessResponse" :key="index" @click.stop="setMainFile(item)" :class="{'is-main-file-bg': item.isMain}">
                        <div class="file-main-label" v-if="item.isMain">{{$t('upload.upload_mainFile')}}</div>
                        <label v-if="item.fileType === 'img'" :title="$t('tip.tip_clickScaleBigger')" @click.stop="showPreview(item)"><img :src="item.file_url"/></label>
                        <label class="video-file" v-if="item.fileType === 'video'" :title="$t('tip.tip_clickPlay')" @click.stop="showPreview(item)"></label>
                        <label class="td-file" v-if="item.fileType === '3d'" :title="$t('tip.tip_clickPreview')" @click.stop="showPreview(item)"><i class="iconfonts icon-D"></i></label>
                        <label class="unknow-file" v-if="item.fileType === 'unknown'" :title="$t('tip.tip_notSupportPreview')" @click.stop="showPreview(item)"></label>
                        <span :title="item.name">{{item.name}}</span>
                        <a :title="$t('lang.lang_delete')" class="delete-file" @click.stop="deleteViewFile(item)">
                            <Icon type="close-round"></Icon>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="file-label-mark" v-if="showOtherInfos.fieldLabel">
                <h1 class="label-title">{{$t('upload.upload_fieldTag')}}:</h1>
                <ul>
                    <li :class="{'label-selected': item.selected}" v-for="(item, index) in fieldLabelLists" :key="index" @click="selectFieldLabel(item)">{{item.name}}</li>
                </ul>
            </div>

            <div class="file-label-mark" v-if="showOtherInfos.styleLabel">
                <h1 class="label-title">{{$t('upload.upload_styleTag')}}:</h1>
                <ul>
                    <li :class="{'label-selected': item.selected}" v-for="(item, index) in styleLabelLists" :key="index" @click="selectStyleLabel(item)">{{item.name}}</li>
                </ul>
            </div>

            <div class="file-profile-area" v-if="showOtherInfos.fileDescribe">
                <h1 class="profile-title">{{$t('upload.upload_fileDescribe')}}:</h1>
                <textarea class="file-describe" maxlength="180" :placeholder="$t('upload.upload_enterProfileTips')" v-model="uploadParams.describe" @keyup="calculationWords()"></textarea>
                <label class="enter-desc-counts"><a>{{enterWordCount}}</a><span>/</span><a>180</a></label>
            </div>

            <!-- Close Button-->
            <div class="upload-footer">
                <a class="confirm-btn" @click="confirmUpload()">{{$t('lang.lang_confirm')}}</a>
                <a class="cancel-btn" @click="hideUploadContainer()">{{$t('lang.lang_cancel')}}</a>
            </div>
        </div>
        <preview-modal :currentFileData="currentFileData" :uploadSuccessData="uploadSuccessResponse" ref="preview"></preview-modal>
    </div>
</template>

<script>
    /**
     * Component parameters
     *  必要的参数 showUploadParams {popup: default false, style: default true},
     *  可选showOtherInfos{fieldLabel: default true, styleLabel: default true, fileDescribe: default true}
     */
    import {mapState, mapMutations} from 'vuex';
    import Flow from '../../../static/flow';
    import global from '../../global/Global';
    import previewModal from "./previewModal";
    import i18n from '../../locale';

    export default {
        name: 'common-upload',
        props: {
            initPageParams: {
                type: Object,
                default: () => {}
            },
            showUploadParams: {
                type: Object,
                default: () => {}
            },
            singleFile: {
                type: Boolean,
                default: false
            },
            showOtherInfos: {
                type: Object,
                default: () => ({
                    fieldLabel: true,
                    styleLabel: true,
                    fileDescribe: true
                })
            },
            fieldLabelList: {
                type: Array,
                default: () => []
            },
            styleLabelList: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                initUploadTips: {
                    smallBtnText: i18n.t('upload.upload_uploadWork'),
                    selectBtnText: i18n.t('upload.upload_chooseFile'),
                    uploadTips: i18n.t('upload.upload_uploadFileTypeTips')
                },
                uploadFileType: [
                    {id: 'img', name: i18n.t('lang.lang_picture'), selected: true},
                    {id: 'video', name: i18n.t('lang.lang_video'), selected: false},
                    {id: '3d', name: i18n.t('lang.lang_3dModule'), selected: false}
                ],
                uploadKey: null,
                flowInstance: null,
                noSupportUpload: false,
                showChooseUploadType: false,
                uploadBegin: false,
                addedFileList: [],
                showUploadStatus: true,
                uploadQuery: {},
                parameter: {
                    type: 'upload'
                },
                uploadRandomFolder: '',
                uploadSuccessResponse: [],
                previewParams: false,
                currentFileData: {},
                fieldLabelLists: [
                    {id: 'f1', name: '原画', selected: true},
                    {id: 'f2', name: 'UI', selected: false},
                    {id: 'f3', name: '角色', selected: false},
                    {id: 'f4', name: '场景', selected: false},
                    {id: 'f5', name: '动作', selected: false},
                    {id: 'f6', name: '特效', selected: false},
                    {id: 'f7', name: '角色设计', selected: false},
                    {id: 'f8', name: '场景设计', selected: false},
                    {id: 'f9', name: '概念设计', selected: false},
                    {id: 'f10', name: '宣传设计', selected: false},
                    {id: 'f11', name: 'ICON设计', selected: false},
                    {id: 'f12', name: 'LOGO设计', selected: false},
                    {id: 'f13', name: '其他', selected: false}
                ],
                styleLabelLists: [
                    {id: 's1', name: '仙侠', selected: true},
                    {id: 's2', name: '魔幻', selected: false},
                    {id: 's3', name: '现代', selected: false},
                    {id: 's4', name: '朋克', selected: false},
                    {id: 's5', name: '三国', selected: false},
                    {id: 's7', name: '西游', selected: false},
                    {id: 's8', name: '日系', selected: false},
                    {id: 's9', name: '动漫', selected: false},
                    {id: 's10', name: '生化', selected: false},
                    {id: 's11', name: '吸血鬼', selected: false},
                    {id: 's12', name: '狼人', selected: false},
                    {id: 's13', name: '鬼神', selected: false},
                    {id: 's14', name: '战争', selected: false},
                    {id: 's15', name: '萌系', selected: false},
                    {id: 's16', name: '萌系', selected: false},
                    {id: 's17', name: '其他', selected: false}
                ],
                uploadParams: {},
                enterWordCount: 0
            };
        },
        created () {

        },
        computed: {},
        mounted () {
            this.initSomeParams();
            this.initFlow();
        },
        methods: {
            initSomeParams () {
                this.fieldLabelLists = this.fieldLabelList && this.fieldLabelList.length > 0 ? this.fieldLabelList : this.fieldLabelLists;
                this.styleLabelLists = this.styleLabelList && this.styleLabelList.length > 0 ? this.styleLabelList : this.styleLabelLists;
                this.uploadRandomFolder = this.$PublicFuns.randomRange(5, 10);
            },
            // 获取秘钥
            getSecretKey () {
                let _this = this;
                let url = _this.GLOBAL.baseRouter + "/file/oss/oss";
                return new Promise((resolve, reject) => {
                    if (_this.uploadKey === null) {
                        _this.$axios.post(url, _this.parameter).then(data => {
                            _this.uploadKey = data.data;
                            // _this.$emit('getOSS', data.data);
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            },
            selectUploadFileType (item) {
                this.uploadFileType.forEach(opt => {
                    opt.selected = false;
                });
                item.selected = true;
            },
            initFlow () {
                this.initUploadTips = Object.assign({}, this.initUploadTips, this.initPageParams);
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

                // 注册上传事件
                flow.assignBrowse([document.getElementById('uploadBtn'), document.getElementById('uploadFiles')]);
                flow.assignBrowse(document.getElementById('uploadFolder'), true);
                flow.assignDrop(document.getElementById('dropArea'));
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
                    _this.addedFileList = _this.addedFileList.concat(filesAddedList);
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
                    console.log('upload start');
                });
                flow.on('fileProgress', function (file) {
                    if (file.flowObj.opts.singleFile) {
                        _this.addedFileList = _this.addedFileList.filter(item => item.name === file.name);
                    } else {
                        _this.addedFileList.forEach(item => {
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
                    responseData.isMain = false;
                    _this.addedFileList.forEach((item, index) => {
                        if (item.relativePath === file.relativePath) {
                            _this.addedFileList.splice(index, 1);
                        }
                    });
                    let filePath = _this.addedFileList[0] ? _this.addedFileList[0].relativePath : null;
                    if (filePath) {
                        _this.uploadQuery.name = filePath.substring(filePath.lastIndexOf('/') + 1);
                        _this.uploadQuery.key = _this.uploadKey.dir + _this.uploadRandomFolder + '/' + filePath;
                    }
                    // 判断上传的文件类型
                    _this.uploadSuccessResponse.push(responseData);
                    _this.uploadSuccessResponse.forEach(opt => {
                        let index = opt.name.lastIndexOf('.');
                        let ext = opt.name.substring(index).toLowerCase();
                        if (ext) {
                            switch (ext) {
                                case '.jpg':
                                case '.jpeg':
                                case '.png':
                                case '.bmp':
                                case '.gif':
                                    opt.fileType = 'img';
                                    break;
                                case '.mp4':
                                case '.rmvb':
                                case '.avi':
                                case '.mpg':
                                case '.mkv':
                                    opt.fileType = 'video';
                                    break;
                                case '.fbx':
                                case '.3ds':
                                case '.obj':
                                case '.json':
                                case '.stl':
                                    opt.fileType = '3d';
                                    break;
                                default:
                                    opt.fileType = 'unknown';
                                    break;
                            }
                        }
                    });
                    _this.uploadSuccessResponse.forEach(item => {
                        if (item.file_url === responseData.file_url && item.fileType === 'img') {
                            let fileUrl = item.file_url;
                            let index = fileUrl.lastIndexOf('.');
                            let ext = fileUrl.substring(index).toLowerCase();
                            if (ext !== '.gif') {
                                item.file_url += '?x-oss-process=style/tw';
                            }
                        }
                    });
                });
                flow.on('complete', function () {
                    // 默认第一个文件为主文件
                    let hasMainFile = _this.uploadSuccessResponse.filter(item => item.isMain);
                    if (hasMainFile && hasMainFile.length > 0) {
                        _this.uploadSuccessResponse.forEach(item => {
                            !!item.isMain;
                        });
                    } else {
                        _this.uploadSuccessResponse[0].isMain = true;
                    }
                    _this.uploadBegin = false;
                    _this.addedFileList = [];
                });
            },
            resumePauseFile (file) {
                this.addedFileList.forEach(item => {
                    if (item.name === file.name) {
                        item.paused ? item.resume() : item.pause();
                    }
                });
            },
            removeFile (file) {
                this.addedFileList.forEach((item, index) => {
                    if (item.name === file.name) {
                        item.cancel();
                        this.addedFileList.splice(index, 1);
                    }
                });
            },
            deleteFlowInstanceFile (file) {
                this.flowInstance.files.forEach((item, index) => {
                    if (item.name === file.name) {
                        this.flowInstance.files.splice(index, 1);
                    }
                });
            },
            deleteViewFile (file) {
                let len = this.uploadSuccessResponse.length;
                this.uploadSuccessResponse.forEach((item, index) => {
                    if (item.name === file.name) {
                        if (file.isMain) {
                            if ((index - 1) >= 0) {
                                this.uploadSuccessResponse[index - 1].isMain = true;
                            } else if ((index + 1) < len) {
                                this.uploadSuccessResponse[index + 1].isMain = true;
                            }
                        }
                        this.uploadSuccessResponse.splice(index, 1);
                    }
                });
                this.deleteFlowInstanceFile(file);
            },
            showPreview (file) {
                this.previewParams = true;
                this.currentFileData = file;
                if (file.fileType !== 'unknown') {
                    this.$refs.preview.init(file);
                } else {
                    this.$Message.warning(i18n.t('tip.tip_fileNotSupportPreview') + '!');
                }
            },
            selectFieldLabel (label) {
                if (this.fieldLabelLists) {
                    this.fieldLabelLists.map((item) => {
                        item.selected = false;
                    });
                }
                label.selected = !label.selected;
            },
            selectStyleLabel (style) {
                style.selected = !style.selected;
            },
            calculationWords () {
                this.enterWordCount = this.uploadParams.describe ? this.uploadParams.describe.length : 0;
            },
            setMainFile (file) {
                this.uploadSuccessResponse.forEach((item) => {
                    item.isMain = false;
                });
                file.isMain = !file.isMain;
            },
            hideUploadContainer () {
                this.showUploadParams.popup = false;
                this.addedFileList = [];
                this.uploadSuccessResponse = [];
                this.flowInstance.files = [];
            },
            confirmUpload () {
                let fieldLabel = this.fieldLabelLists.filter(item => item.selected);
                let styleLabel = this.styleLabelLists.filter(item => item.selected);
                this.uploadParams.fieldLabel = fieldLabel;
                this.uploadParams.styleLabel = styleLabel;
                let fileType = this.uploadFileType.filter(item => item.selected)[0].id;
                this.uploadSuccessResponse.forEach(item => {
                    if (item.fileType === 'img' && item.file_url.indexOf('?x-oss-process=style/tw') !== -1) {
                        let index = item.file_url.indexOf('?x-oss-process=style/tw');
                        item.file_url = item.file_url.substring(0, index);
                    }
                });
                let returnData = {fileType: fileType, params: this.uploadParams, response: this.uploadSuccessResponse};
                console.log(returnData);
                // 返回上传文件数组以及标签描述等信息
                this.$bus.$emit('confirmUpload', returnData);
                this.hideUploadContainer();
            }
        },
        components: {previewModal}
    };
</script>

<style lang="less" scoped>
    .popup-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.6);
        > .upload-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            padding: 20px;
            width: 800px;
            height: 728px;
            border: 1px solid #eee;
            background: #fff;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            -webkit-box-shadow: 0 0 3px #fff;
            -moz-box-shadow: 0 0 3px #fff;
            box-shadow: 0 0 3px #fff;
            > .upload-bar {
                position: relative;
                float: left;
                width: 42%;
                > .upload-file-ext-tips {
                    width: 100%;
                    height: 85px;
                    margin-bottom: 15px;
                    > p {
                        text-align: justify;
                        color: #888;
                        line-height: 22px;
                        font-size: 12px;
                        /*background: #f8f8f8;*/
                        > label {
                            font-weight: bold;
                        }
                    }
                }
                > .upload-file-type {
                    width: 100%;
                    height: 35px;
                    margin-bottom: 5px;
                    > label {
                        line-height: 32px;
                        font-size: 13px;
                        float: left;
                        margin-right: 10px;
                    }
                    > ul {
                        display: flex;
                        justify-content: flex-start;
                        > li {
                            margin-top: 2px;
                            margin-right: 10px;
                            padding: 3px 10px;
                            border: 1px solid #dfdfdf;
                            -webkit-border-radius: 3px;
                            -moz-border-radius: 3px;
                            border-radius: 3px;
                            font-size: 12px;
                            -webkit-transition: all 0.3s;
                            -moz-transition: all 0.3s;
                            -ms-transition: all 0.3s;
                            -o-transition: all 0.3s;
                            transition: all 0.3s;
                            cursor: pointer;
                            &.selected-type, &:hover {
                                border-color: @base;
                                background: @base;
                                color: #fff;
                            }
                        }
                    }
                }
                > .upload-area {
                    position: relative;
                    float: left;
                    width: 100%;
                    height: 154px;
                    border: 1px dashed #dfdfdf;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    background: #fff;
                    text-align: center;
                    /*padding: 70px 0 0;*/
                    &:hover {
                        border: 1px dashed @base;
                        -webkit-transition: all 0.5s;
                        -moz-transition: all 0.5s;
                        -ms-transition: all 0.5s;
                        -o-transition: all 0.5s;
                        transition: all 0.5s;
                    }
                    .upload-content {
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        margin: auto;
                        padding: 45px 0;
                        cursor: pointer;
                        .upload-btn {
                            position: relative;
                            display: block;
                            width: 108px;
                            height: 32px;
                            padding: 0 15px;
                            background: @base;
                            line-height: 32px;
                            text-align: center;
                            color: #fff;
                            font-size: 12px;
                            -webkit-border-radius: 3px;
                            -moz-border-radius: 3px;
                            border-radius: 3px;
                            margin: 0 auto;
                            a.outside-option {
                                font-size: 12px;
                                color: #fff;
                            > i {
                                float: left;
                                font-size: 24px;
                                color: #fff;
                                    margin: 4px 5px 0 0;
                                }
                            }
                            .choose-upload-type {
                                position: absolute;
                                left: 0;
                                top: 31px;
                                width: 108px;
                                height: 53px;
                                border-right: 1px solid #eee;
                                border-bottom: 1px solid #eee;
                                border-left: 1px solid #eee;
                                background: #fff;
                                -webkit-border-radius: 0 0 3px 3px;
                                -moz-border-radius: 0 0 3px 3px;
                                border-radius: 0 0 3px 3px;
                                -webkit-box-shadow: 0 0 2px #dfdfdf;
                                -moz-box-shadow: 0 0 2px #dfdfdf;
                                box-shadow: 0 0 2px #dfdfdf;
                                overflow: hidden;
                                -webkit-transition: all 0.68s;
                                -moz-transition: all 0.68s;
                                -ms-transition: all 0.68s;
                                -o-transition: all 0.68s;
                                transition: all 0.68s;
                                opacity: 0;
                                -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
                                filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
                                > ul {
                                    li {
                                        line-height: 26px;
                                        color: @base;
                                        &:hover {
                                            background: rgba(60, 210, 180, 0.18);
                                        }
                                    }
                                }
                            }
                            &:hover {
                                .choose-upload-type {
                                    opacity: 1;
                                    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
                                    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
                                }
                            }
                        }
                        .upload-file-profile {
                            margin-top: 10px;
                            text-align: center;
                            > span {
                                display: block;
                                color: #999;
                                line-height: 20px;
                            }
                        }
                    }
                    .upload-list {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        padding: 10px;
                        overflow-y: auto;
                        > ul {
                            > li {
                                position: relative;
                                width: 100%;
                                height: 68px;
                                /*background: #fff;*/
                                -webkit-border-radius: 3px;
                                -moz-border-radius: 3px;
                                border-radius: 3px;
                                margin-bottom: 10px;
                                > label {
                                    position: relative;
                                    display: block;
                                    float: left;
                                    width: 108px;
                                    height: 68px;
                                    line-height: 68px;
                                    color: #777;
                                    text-align: left;
                                    /*border: 1px solid #eee;*/
                                    -webkit-border-radius: 3px;
                                    -moz-border-radius: 3px;
                                    border-radius: 3px;
                                    overflow: hidden;
                                    -ms-text-overflow: ellipsis;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    > img {
                                        position: absolute;
                                        max-width: 68px;
                                        max-height: 68px;
                                        top: 0;
                                        right: 0;
                                        bottom: 0;
                                        left: 0;
                                        margin: auto;
                                        -webkit-border-radius: 3px;
                                        -moz-border-radius: 3px;
                                        border-radius: 3px;
                                        display: block;
                                    }
                                }

                                .progress-bar {
                                    position: relative;
                                    margin-left: 118px;
                                    height: 68px;
                                    background: #fbfbfb;
                                    -webkit-border-radius: 3px;
                                    -moz-border-radius: 3px;
                                    border-radius: 3px;
                                    overflow: hidden;
                                    > .upload-status {
                                        position: absolute;
                                        line-height: 68px;
                                        left: 0;
                                        right: 0;
                                        color: #999;
                                    }
                                    > .progress-uploaded {
                                        width: 0;
                                        height: 68px;
                                        -webkit-border-radius: 3px 0 0 3px;
                                        -moz-border-radius: 3px 0 0 3px;
                                        border-radius: 3px 0 0 3px;
                                        background: linear-gradient(to right, rgba(60, 210, 180, 0.2), rgba(60, 210, 180, 0.5));
                                        -webkit-transition: all 0.3s;
                                        -moz-transition: all 0.3s;
                                        -ms-transition: all 0.3s;
                                        -o-transition: all 0.3s;
                                        transition: all 0.3s;
                                    }
                                    .file-details {
                                        position: absolute;
                                        top: 100px;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                        background: rgba(0, 0, 0, 0.3);
                                        -webkit-transition: all 0.3s;
                                        -moz-transition: all 0.3s;
                                        -ms-transition: all 0.3s;
                                        -o-transition: all 0.3s;
                                        transition: all 0.3s;
                                        .upload-progress-details {
                                            float: left;
                                            width: 100%;
                                            height: 68px;
                                            text-align: left;
                                            padding: 0 0 0 20px;
                                            > ul {
                                                display: flex;
                                                flex-direction: column;
                                                align-content: center;
                                                > li {
                                                    line-height: 23px;
                                                    color: #fff;
                                                    font-size: 12px;
                                                }
                                            }
                                        }
                                        .operate-items {
                                            float: right;
                                            width: 20%;
                                            padding: 0 20px 0 0;
                                            > ul {
                                                display: flex;
                                                justify-content: space-between;
                                                > li {
                                                    line-height: 64px;
                                                    color: #fff;
                                                    > i {
                                                        font-size: 20px;
                                                        line-height: 68px;
                                                        &:hover {
                                                            color: @base;
                                                            cursor: pointer;
                                                            -webkit-transition: all 0.5s;
                                                            -moz-transition: all 0.5s;
                                                            -ms-transition: all 0.5s;
                                                            -o-transition: all 0.5s;
                                                            transition: all 0.5s;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    &:hover {
                                        > .file-details {
                                            top: 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                > .show-support-error {
                    width: 100%;
                    height: 100%;
                    line-height: 80px;
                    text-align: center;
                }
            }

            > .uploaded-show-list {
                position: relative;
                float: right;
                width: 56%;
                height: 294px;
                border: 1px solid #dfdfdf;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                text-align: center;
                padding: 10px 0;
                overflow-y: auto;
                > h1 {
                    font-size: 14px;
                    color: #696969;
                    font-weight: normal;
                    text-align: left;
                    padding: 0 10px 10px;
                    border-bottom: 1px solid #ededed;
                }
                > ul {
                    > li {
                        position: relative;
                        width: 100%;
                        height: 90px;
                        overflow: hidden;
                        margin: 10px 0;
                        padding: 10px;
                        -webkit-border-radius: 3px;
                        -moz-border-radius: 3px;
                        border-radius: 3px;
                        > div.file-main-label {
                            position: absolute;
                            top: 4px;
                            left: -34px;
                            width: 100px;
                            height: 22px;
                            line-height: 22px;
                            background: @base;
                            color: #fff;
                            font-size: 12px;
                            z-index: 8;
                            -webkit-transform: rotate(-45deg);
                            -moz-transform: rotate(-45deg);
                            -ms-transform: rotate(-45deg);
                            -o-transform: rotate(-45deg);
                            transform: rotate(-45deg);
                        }
                        > label {
                            position: relative;
                            display: block;
                            float: left;
                            width: 80px;
                            height: 70px;
                            border: 1px solid #eee;
                            -webkit-border-radius: 3px;
                            -moz-border-radius: 3px;
                            border-radius: 3px;
                            overflow: hidden;
                            cursor: pointer;
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
                            &.video-file {
                                background: url("../../assets/images/file-video-icon.png") no-repeat center / 50%;
                            }
                            &.unknow-file {
                                background: url("../../assets/images/file-unknow-icon.png") no-repeat center / 60%;
                            }
                            &.td-file {
                                > i {
                                    font-size: 45px;
                                    line-height: 70px;
                                    color: #898989;
                                }
                            }
                            /*&:hover {*/
                            /*cursor: url("../assets/images/scale-big.cur"), pointer;;*/
                            /*}*/
                        }
                        > span {
                            float: left;
                            display: block;
                            line-height: 70px;
                            font-size: 14px;
                            color: #777;
                            margin: 0 10px;
                            max-width: 260px;
                            overflow: hidden;
                            -ms-text-overflow: ellipsis;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        > a.delete-file {
                            display: block;
                            float: right;
                            margin-right: 10px;
                            > i {
                                font-size: 16px;
                                color: #999;
                                line-height: 70px;
                                &:hover {
                                    color: @base;
                                    -webkit-transition: all 0.5s;
                                    -moz-transition: all 0.5s;
                                    -ms-transition: all 0.5s;
                                    -o-transition: all 0.5s;
                                    transition: all 0.5s;
                                }
                            }
                        }
                        &:hover {
                            cursor: pointer;
                            -webkit-box-shadow: 0 0 3px  #eee;
                            -moz-box-shadow: 0 0 3px  #eee;
                            box-shadow: 0 0 3px  #eee;
                            background: #f8f8f8;
                            -webkit-transition: all 0.5s;
                            -moz-transition: all 0.5s;
                            -ms-transition: all 0.5s;
                            -o-transition: all 0.5s;
                            transition: all 0.5s;
                        }
                        &.is-main-file-bg {
                            background: rgba(60, 210, 180, 0.2);
                        }
                    }
                }
            }
            > .file-label-mark {
                float: left;
                width: 100%;
                height: auto;
                margin: 15px 0 0;
                > h1.label-title {
                    font-weight: bold;
                    font-size: 14px;
                    color: #777;
                    text-align: left;
                }
                > ul {
                    overflow: hidden;
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                    > li {
                        float: left;
                        padding: 3px 15px;
                        margin: 10px 10px 0 0;
                        color: #696969;
                        font-size: 12px;
                        border: 1px solid #dfdfdf;
                        -webkit-border-radius: 15px;
                        -moz-border-radius: 15px;
                        border-radius: 15px;
                        -webkit-transition: all 0.5s;
                        -moz-transition: all 0.5s;
                        -ms-transition: all 0.5s;
                        -o-transition: all 0.5s;
                        transition: all 0.5s;
                        &:hover {
                            border: 1px solid @base;
                            background: rgba(60, 210, 180, 0.2);
                            cursor: pointer;
                        }
                        &.label-selected {
                            border: 1px solid @base;
                            background: @base;
                            color: #fff;
                        }
                    }
                }
            }
            > .file-profile-area {
                position: relative;
                float: left;
                width: 100%;
                height: auto;
                margin: 15px 0 0;
                > h1.profile-title {
                    font-weight: bold;
                    font-size: 14px;
                    color: #777;
                    text-align: left;
                }
                > textarea.file-describe {
                    outline: none;
                    width: 100%;
                    height: 72px;
                    border: 1px solid #dfdfdf;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    padding: 3px 8px;
                    margin: 10px 0 0;
                    color: #696969;
                    font-size: 14px;
                    text-align: justify;
                    resize: none;
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                    &:focus, &:hover {
                        border: 1px solid @base;
                    }
                    &::-webkit-input-placeholder {
                        color: #aaa;
                    }
                    :-moz-placeholder {
                        color:#aaa;
                    }
                    ::-moz-placeholder {
                        color:#aaa;
                    }
                    :-ms-input-placeholder {
                        color:#aaa;
                    }
                }
                > .enter-desc-counts {
                    font-size: 12px;
                    position: absolute;
                    bottom: 6px;
                    right: 6px;
                    > a {
                        float: left;
                        color: #999;
                    }
                    > span {
                        float: left;
                        color: #999;
                        margin: -1px 2px 0;
                    }
                }
            }

            > .upload-footer {
                position: absolute;
                width: 100%;
                padding: 20px;
                bottom: 0;
                right: 0;
                > a {
                    display: block;
                    float: right;
                    right: 20px;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    font-size: 14px;
                    min-width: 100px;
                    text-align: center;
                    padding: 6px 15px;
                    margin-left: 20px;
                    &.confirm-btn {
                        background: @base;
                        color: #fff;
                    }
                    &.cancel-btn {
                        background: #dfdfdf;
                        color: #777;
                    }
                }
            }
            &.all-info-false {
                height: 388px;
            }
            &.field-label-false {

            }
        }
    }
</style>
