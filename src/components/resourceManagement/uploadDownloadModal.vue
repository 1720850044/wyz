<template>
    <div role="modal">
        <div class="upload-download-mask" @click="closeModal()"></div>
        <div class="upload-download-modal">
            <div class="upload-modal-header">
                <ul>
                    <li :class="{'item-active': tab.selected}" v-for="tab in headerTabs" @click="toggleTab(tab)">{{tab.name}}</li>
                </ul>
                <div class="header-operate">
                    <a class="clear-all-files" v-if="headerTabs[0].selected" @click="batchDeleteUploadedFiles()">{{$t('upload.upload_batchDeleteRecord')}}</a>
                    <a class="clear-all-files" v-if="headerTabs[1].selected" @click="batchDeleteDownloadFiles()">{{$t('upload.upload_batchDeletePackagedRecord')}}</a>
                    <a class="close-modal-btn" @click="closeModal()">
                        <Icon type="close-round"></Icon>
                    </a>
                </div>
            </div>
            <div class="upload-modal-body">
                <div class="upload-part" v-if="headerTabs[0].selected">
                    <div class="table-header">
                        <ul>
                            <li class="file-name-item">{{$t('upload.upload_fileName')}}</li>
                            <li class="file-size-item">{{$t('upload.upload_size')}}</li>
                            <li class="file-progress-item">{{$t('upload.upload_progress')}}</li>
                            <li class="file-operate-item">{{$t('lang.lang_operating')}}</li>
                        </ul>
                    </div>

                    <div class="file-list-container com-scrollbar">
                        <div class="upload-file-list">
                            <ul>
                                <li class="file-item" v-for="item in uploadFilesData">
                                    <div class="file-name" :title="item.name">
                                        <i class="iconfonts icon-source-file"></i>
                                        {{item.name}}
                                    </div>
                                    <div class="file-size">{{item.totalSize}}</div>
                                    <div class="file-progress">{{item.uploadStatus}}<span class="uploading-percent" v-if="item.percent !== '100%' && item.percent !== '0%'">（{{item.percent}}）</span></div>
                                    <div class="file-operate">
                                        <a class="cancel-upload-btn" :title="$t('upload.upload_cancelUpload')" v-if="item.percent !== '100%'" @click="cancelUploadFile(item)">{{$t('upload.upload_cancelUpload')}}</a>
                                        <a class="clear-file" :title="$t('lang.lang_clear')" v-else @click="deleteUploadedFile(item, 'new')">{{$t('lang.lang_clear')}}</a>
                                    </div>
                                    <div class="progress-bar" :style="{width: item.percent}"></div>
                                </li>
                                <!-- Uploaded files records list -->
                                <li class="file-item" v-for="item in uploadedList">
                                    <div class="file-name" :title="item.realname">
                                        <i class="iconfonts icon-source-file"></i>
                                        {{item.name}}
                                    </div>
                                    <div class="file-size">{{item.totalSize}}</div>
                                    <div class="file-progress">{{$t('upload.upload_uploadDone')}}</div>
                                    <div class="file-operate">
                                        <a class="clear-file" :title="$t('lang.lang_clear')" @click="deleteUploadedFile(item, 'old')">{{$t('lang.lang_clear')}}</a>
                                    </div>
                                    <div class="progress-bar" style="width: 100%"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="download-part" v-else>
                    <div class="table-header">
                        <ul>
                            <li class="file-name-item">{{$t('upload.upload_fileName')}}</li>
                            <li class="file-status-opt">{{$t('lang.lang_status')}}</li>
                            <li class="file-size-opt">{{$t('upload.upload_size')}}</li>
                            <li class="file-operate-item">{{$t('lang.lang_operating')}}</li>
                        </ul>
                    </div>
                    <div class="file-list-container com-scrollbar">
                        <div class="upload-file-list">
                            <ul>
                                <li class="file-item" v-for="item in downloadList">
                                    <div class="file-name">{{item.title}}</div>
                                    <div class="file-bale-status" v-if="item.status==='0'" :class="{'packaging': true}">{{$t('upload.upload_balePackaging')}}...</div>
                                    <div class="file-bale-status" v-if="item.status==='1'" :class="{'packaged': true}">{{$t('upload.upload_balePackaged')}}</div>
                                    <div class="file-bale-status" v-if="item.status==='2'" :class="{'packaged-failure': true}">{{$t('upload.upload_balePackagedFailure')}}</div>
                                    <div class="file-size">{{item.totalSize}}</div>
                                    <div class="file-operate">
                                        <a class="cancel-packaging-btn" v-if="item.status === '0'" @click="deleteDownloadFile(item)">{{$t('lang.lang_cancel')}}</a>
                                        <a class="download-btn" v-if="item.status === '1'" @click="downloadFile(item)">{{$t('upload.upload_download')}}</a>
                                        <a class="clear-file-btn" v-if="item.status !== '0'" @click="deleteDownloadFile(item)">{{$t('lang.lang_clear')}}</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';

    export default {
        name: "uploadDownloadModal",
        props: {
            initModalParams: {
                type: Object,
                default: () => ({
                    type: 'upload'
                })
            },
            uploadFilesData: {
                type: Array,
                default: () => []
            },
            uploadSuccessData: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                headerTabs: [
                    {name: i18n.t('upload.upload_upload'), selected: false},
                    {name: i18n.t('upload.upload_download'), selected: false}
                ],
                autoRefresh: null,
                uploadedList: [],
                downloadList: []
            };
        },
        mounted () {
            this.initModal();
        },
        methods: {
            ...mapMutations(['setDownloadingNum']),
            getUploadList () {
                let _this = this;
                let path = this.GLOBAL.baseRouter + this.$GLOBALAPI.file_upload_list;
                return this.$axios.post(path, {page: 1, page_size: 999})
                    .then(result => {
                        if (result.data.err_code === 0) {
                            _this.uploadedList = result.data.data;
                            _this.uploadedList.forEach(item => {
                                let start = item.realname.lastIndexOf('/');
                                let name = item.realname.substring(start + 1);
                                item.name = name;
                                item.totalSize = _this.$PublicFuns.byteSizeConversion(item.size);
                            });
                            return true;
                        }
                    });
            },
            getDownloadList () {
                let _this = this;
                let path = this.GLOBAL.baseRouter + this.$GLOBALAPI.file_download_list;
                return this.$axios.post(path, {page: 1, page_size: 999})
                    .then(result => {
                        if (result.data.err_code === 0) {
                            _this.downloadList = result.data.data;
                            _this.downloadList.forEach(item => {
                                item.totalSize = _this.$PublicFuns.byteSizeConversion(item.size);
                            });
                            let packagingNum = _this.downloadList.filter(item => item.status === '0').length;
                            _this.setDownloadingNum(packagingNum);
                            return true;
                        }
                    });
            },
            initModal () {
                this.initModalParams.type === 'upload' ? this.headerTabs[0].selected = true : this.headerTabs[1].selected = true;
                if (this.initModalParams.type !== 'upload') {
                    this.getDownloadList();
                    this.autoRefresh = setInterval(() => {
                        this.getDownloadList();
                    }, 3000);
                } else {
                    this.getUploadList();
                }
            },
            toggleTab (tab) {
                if (tab.selected) {
                    return;
                }
                this.headerTabs.forEach(item => item.selected = false);
                tab.selected = true;
                if (this.headerTabs[0].selected) {
                    let index = this.uploadFilesData.length;
                    while (index--) {
                        if (this.uploadFilesData[index].percent === '100%') {
                            this.$emit('deleteFlowObject', this.uploadFilesData[index]);
                            this.uploadFilesData.splice(index, 1);
                        }
                    }
                    clearInterval(this.autoRefresh);
                    this.autoRefresh = null;
                    this.getUploadList();
                } else {
                    this.getDownloadList();
                    this.autoRefresh = setInterval(() => {
                        this.getDownloadList();
                    }, 3000);
                }
            },
            clearUploadedRecord (id) {
                if (id !== 'all') {
                    this.uploadedList.forEach((item, index) => {
                        if (parseInt(item.id) === id) {
                            this.uploadedList.splice(index, 1);
                        }
                    });
                } else {
                    this.uploadedList = [];
                }
            },
            clearDownloadRecord (id) {
                if (id !== 'all') {
                    this.downloadList.forEach((item, index) => {
                        if (parseInt(item.id) === id) {
                            this.downloadList.splice(index, 1);
                        }
                    });
                } else {
                    this.downloadList.filter(item => item.status === '0');
                }
            },
            deleteUploadedRecords (params) {
                let _this = this;
                let path = _this.GLOBAL.baseRouter + this.$GLOBALAPI.file_clear_upload_list;
                return _this.$axios.post(path, params)
                    .then(result => {
                        if (result.data.err_code === 0) {
                            if (params.type === 'all') {
                                _this.clearUploadedRecord('all');
                            } else {
                                _this.clearUploadedRecord(params.log_id);
                            }
                            return true;
                        } else {
                            return false;
                        }
                    });
            },
            deleteDownloadRecords (params) {
                let _this = this;
                let path = _this.GLOBAL.baseRouter + this.$GLOBALAPI.file_clear_logs;
                return _this.$axios.post(path, params)
                    .then(result => {
                        if (result.data.err_code === 0) {
                            if (params.type === 'all') {
                                _this.clearDownloadRecord('all');
                            } else {
                                _this.clearDownloadRecord(params.log_id);
                            }
                            return true;
                        } else {
                            return false;
                        }
                    });
            },
            deleteUploadedFile (file, type) {
                let _this = this;
                let params = {
                    log_id: parseInt(file.id),
                    type: 'unit'
                };
                if (type === 'new') {
                    _this.uploadSuccessData.forEach((item, index) => {
                        if (item.file_path.indexOf(file.relativePath) !== -1) {
                            params.log_id = item.log_id;
                        }
                    });
                }
                _this.deleteUploadedRecords(params)
                    .then(flag => {
                        if (flag) {
                            _this.uploadFilesData.forEach((item, index) => {
                                if (item.relativePath === file.relativePath) {
                                    _this.uploadFilesData.splice(index, 1);
                                }
                            });
                            _this.$emit('deleteFlowObject', file);
                        }
                    });
            },
            batchDeleteUploadedFiles () {
                let _this = this;
                let params = {
                    type: 'all'
                };
                _this.deleteUploadedRecords(params)
                    .then(flag => {
                        if (flag) {
                            let index = _this.uploadFilesData.length;
                            while (index--) {
                                if (_this.uploadFilesData[index].percent === '100%') {
                                    _this.$emit('deleteFlowObject', _this.uploadFilesData[index]);
                                    _this.uploadFilesData.splice(index, 1);
                                }
                            }
                        }
                    });
            },
            cancelUploadFile (file) {
                this.$emit('cancelUploadingFile', file);
            },
            // Download
            downloadFile (file) {
                let $downloadForm = $("<form id='downloadForm' method='get'></form>");
                $downloadForm.attr("action", file.url);
                $(document.body).append($downloadForm);
                $downloadForm.submit();
                $('#downloadForm').remove();
            },
            deleteDownloadFile (file) {
                let _this = this;
                let params = {
                    log_id: parseInt(file.id),
                    type: 'unit'
                };
                _this.deleteDownloadRecords(params)
                    .then(flag => {
                        if (flag) {}
                    });
            },
            batchDeleteDownloadFiles () {
                let _this = this;
                let params = {
                    type: 'all'
                };
                _this.deleteDownloadRecords(params)
                    .then(flag => {
                        if (flag) {
                            this.getDownloadList();
                        }
                    });
            },
            closeModal () {
                clearInterval(this.autoRefresh);
                this.autoRefresh = null;
                this.$emit('closeModal');
            }
        }
    };
</script>

<style lang="less" scoped>
    .upload-download-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
    .upload-download-modal {
        position: fixed;
        width: 700px;
        height: 525px;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        background: #fff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        overflow: hidden;
        z-index: 9999;
        > .upload-modal-header {
            width: 100%;
            height: 60px;
            background: #f0f0f0;
            -webkit-box-shadow: 0 1px 3px #ddd;
            -moz-box-shadow: 0 1px 3px #ddd;
            box-shadow: 0 1px 3px #ddd;
            padding: 0 20px;
            background: url("https://static.banbooyun.com/public/img/headBarBGimg.png") no-repeat center / cover;
            > ul {
                > li {
                    float: left;
                    line-height: 58px;
                    margin-right: 20px;
                    color: #fff;
                    font-size: 16px;
                    padding: 0 5px;
                    /*border-bottom: 2px solid #f0f0f0;*/
                    cursor: pointer;
                    &.item-active {
                        border-bottom: 2px solid #fff;
                    }
                }
            }
            > .header-operate {
                float: right;
                height: 60px;
                line-height: 58px;
                > a {
                    font-size: 14px;
                    margin-left: 20px;
                    &.clear-all-files {
                        color: #fff;
                        &:hover{
                            cursor: pointer;
                            color: @red;
                        }
                    }
                    &.close-modal-btn {
                        > i {
                            font-size: 16px;
                            color: #fff;
                            font-weight: normal;
                            line-height: 58px;
                            padding: 0;
                            margin: 0;
                            -webkit-transition: all 0.3s;
                            -moz-transition: all 0.3s;
                            -ms-transition: all 0.3s;
                            -o-transition: all 0.3s;
                            transition: all 0.3s;
                        }
                    }
                }
            }
        }
        > .upload-modal-body {
            width: 100%;
            /*height: 465px;*/
            > .upload-part, > .download-part {
                > .table-header {
                    width: 100%;
                    height: 40px;
                    padding: 0 20px;
                    border-bottom: 1px solid #eee;
                    > ul {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        > li {
                            line-height: 40px;
                            font-size: 14px;
                            color: #999;
                            text-align: left;
                            &.file-name-item {
                                width: 35%;
                            }
                            &.file-size-item {
                                width: 25%;
                            }
                            &.file-progress-item {
                                width: 20%;
                            }
                            &.file-operate-item {
                                width: 20%;
                                text-align: right;
                            }
                            &.file-status-opt {
                                width: 25%;
                            }
                            &.file-size-opt {
                                width: 20%;
                            }
                        }
                    }
                }
                > .file-list-container {
                    width: 700px;
                    height: 424px;
                    overflow: hidden;
                    > .upload-file-list {
                        width: 700px;
                        height: 100%;
                        overflow-x: hidden;
                        overflow-y: auto;
                        padding-top: 10px;
                        > ul {
                            width: 700px;
                            > li {
                                position: relative;
                                width: 100%;
                                height: 40px;
                                background: #fafafa;
                                line-height: 40px;
                                padding: 0 20px;
                                font-size: 12px;
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 10px;
                                > div {
                                    text-align: left;
                                    -webkit-user-select: none;
                                    -moz-user-select: none;
                                    -ms-user-select: none;
                                    user-select: none;
                                    color: #696969;
                                    overflow: hidden;
                                    -ms-text-overflow: ellipsis;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    &.file-name {
                                        width: 35%;
                                        padding-right: 10px;
                                        z-index: 9;
                                        > i {
                                            float: left;
                                            display: block;
                                            font-size: 18px;
                                            margin: 10px 3px 0 0;
                                        }
                                    }
                                    &.file-bale-status {
                                        width: 25%;
                                        padding-right: 10px;
                                        z-index: 9;
                                        &.packaging {
                                            color: @base;
                                        }
                                        &.packaged {
                                            color: #666;
                                        }
                                        &.packaged-failure {
                                            color: @red;
                                        }
                                    }
                                    &.file-size {
                                        width: 25%;
                                        padding-right: 10px;
                                        z-index: 9;
                                    }
                                    &.file-progress {
                                        width: 20%;
                                        padding-right: 10px;
                                        z-index: 9;
                                        > .uploading-percent {
                                            color: @base;
                                        }
                                    }
                                    &.file-operate {
                                        width: 20%;
                                        text-align: right;
                                        z-index: 9;
                                        > a {
                                            font-size: 13px;
                                            color: #696969;
                                            margin-left: 10px;
                                            -webkit-user-select: none;
                                            -moz-user-select: none;
                                            -ms-user-select: none;
                                            user-select: none;
                                            &.cancel-upload-btn, &.clear-file {
                                                color: @red;
                                            }
                                            &.cancel-packaging-btn {
                                                color: @red;
                                            }
                                            &.download-btn {
                                                color: @base;
                                            }
                                            &.clear-file-btn {
                                                color: @red;
                                            }
                                            /*&:hover {
                                                color: #f00;
                                            }*/
                                        }
                                    }
                                    &.progress-bar {
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 0;
                                        height: 40px;
                                        background: linear-gradient(to right, rgba(60, 210, 180, 0.15), rgba(60, 210, 180, 0.38));
                                        -webkit-transition: all 0.1s;
                                        -moz-transition: all 0.1s;
                                        -ms-transition: all 0.1s;
                                        -o-transition: all 0.1s;
                                        transition: all 0.1s;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            > .download-part > .upload-file-list {
                li.file-item {
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                    &:hover {
                        background: rgba(60, 210, 180, 0.28);
                    }
                }
            }
        }
    }
</style>
