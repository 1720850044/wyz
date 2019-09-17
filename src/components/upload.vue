<template>
    <div class="upload-file-container">
        <div class="uploadContainer">
            <slot name="upload" :listLenght="uploadFileList">
                <!--<Spin size="large" class="spinSty" v-if="!uploadSuccess"></Spin>-->
                <div class="uploading-loading" v-if="!uploadSuccess">
                <span class="waiting-icon">
                    <Icon type="load-c"></Icon>
                    <label>正在上传中，请稍后...</label>
                </span>
                </div>
                <div style="height: 100%;width: 100%" v-else>
                    <button :id="id" class="browse"></button>
                    <div class="title_all">
                        <p class='iconfonts icon-ymy-upload-copy font_class uploadPublicSty'></p>
                        <!--<p class="prompt_title">点击上传任务文件</p>-->
                        <p class="prompt_title_last">图片及贴图暂时支持jpg、gif、png、tga、dds格式文件</p>
                        <p class="prompt_title_last">3D暂时支持fbx、obj、json、stl、3ds格式文件，其余格式正在努力完善中...</p>
                    </div>
                </div>
            </slot>
            <!--<ul class="filesList" v-if="isShowProgress">-->
            <!--<li v-for="(i,index) in uploadFileList" :key="index">-->
            <!--<span>{{i.name}}<Icon type="ios-close" @click.native="delUploadFile(index)"></Icon></span>-->
            <!--<p>-->
            <!--<i class="uploadStatus" v-bind:style="{width:i.percent+'%'}"></i>-->
            <!--</p>-->
            <!--</li>-->
            <!--</ul>-->
        </div>
        <!-- Upload progress -->
        <div class="file-upload-progress" v-if="showUploadProgress">
            <span class="current-file-name" :title="currentFileName">{{currentFileName}}</span>
            <div class="total-percent">
                <div class="uploaded-percent" :style="{width: uploadPercent}">
                    <span>{{uploadPercent}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //    import 'plupload/js/plupload.full.min.js'
    import qs from 'querystring';
    import {mapState, mapMutations} from 'vuex';
    import plupload from 'plupload/js/plupload.min.js';
    import global from '../global/Global';

    /**     传入参数:
     *  ids                     :   用来命名的id
     *  id                      :   dom的id 默认browse
     *  parameter               :   oss接口参数
     *  fileType                :   允许的文件类型
     *  maxFileSize             :   文件大小限制
     *  preventDuplicates       :   是否允许重复文件名
     *  flash_swf_url           :   swf文件
     *  silverlight_xap_url     :   xap文件
     *
     *  slot 插槽 点击按钮一定要加id: browse
     *
     *  FileUploadedSuccess   上传成功回调
     *  UploadProgress        选择文件并确定回调
     *
     * */

    export default {
        props: {
            ids: {
                type: Object,
                default: () => ({
                    taskId: '0',
                    projectId: '0',
                    stageId: '0'
                })
            },
            parameter: {
                type: Object,
                default: () => ({type: 'upload'})
            },
            fileType: {
                type: Array,
                default: () => [
                    {
                        title: "Image files",
                        extensions: "psd,tga,tif,dds,exr,hdr,ktx,pvrtc,jpg,gif,png,bmp,jpeg, mtl"
                    },
                        {title: "Zip files", extensions: "zip,rar,7zip"},
                    {
                        title: "files",
                        extensions: "mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv,fbx,3ds,max,lw,mb,dxf,json,obj,mmd,stl,vtk,dds, mtl"
                    },
                ]
            },
            isShowProgress: {
                type: Boolean
            },
            id: {
                type: String,
                default: 'browse'
            },
            maxFileSize: {
                type: String,
                default: '520mb'
            },
            preventDuplicates: {
                type: Boolean,
                default: true
            },
            flash_swf_url: {
                type: String,
                default: 'js/Moxie.swf'
            },
            silverlight_xap_url: {
                type: String,
                default: 'js/Moxie.xap'
            }
        },
        created() {
        },
        mounted() {

            /*图片上传*/
            this.upload();

            /*清空上传列表*/
            this.$bus.on('clearUploadList', () => {
                this.clearUploadList();
            });
        },

        data() {
            return {
                uploadKey: null,
                imgsrc: null,
                files: null,
                num: 0,
                uploadFileList: [],
                uploadSuccess: true,
                uploadPercent: '0%',
                currentFileName: '',
                showUploadProgress: false,
                randomNumber: ''
            };
        },
        methods: {
            ...mapMutations(['setfileUrl', 'clearfileUrl', 'setFilenum', 'delFile']),
            // 获取秘钥
            getImgkey() {
                let _this = this;
                let url = this.GLOBAL.baseRouter+this.$GLOBALAPI.file_oss;
                return new Promise((resolve, reject) => {
                    if (this.uploadKey === null) {
                        this.$axios.post(url, this.parameter).then(data => {
                            this.uploadKey = data.data;
                            _this.$emit('getOSS', data.data);
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            },
            // 判断文件格式加入不同的权限
            judgeFileExtension (fileName) {
                let ext = fileName && fileName.length > 0 ? fileName.slice(-4).toLowerCase() : null;
                let readWriteType = 'public-read';
                if (ext) {
                    switch (ext) {
                        case '.fbx':
                        case '.obj':
                        case '.3ds':
                        case '.stl':
                        case '.json':
                        case '.max':
                            readWriteType = 'private';
                            break;
                        default:
                            readWriteType = 'public-read';
                            break;
                    }
                }
                return readWriteType;
            },
            upload() {
                let _this = this;
                this.randomNumber = this.$PublicFuns.randomRange(5, 10);
                if (_this.parameter.type === 'avatar') {
                    this.randomNumber = '';
                } else {
                    _this.randomNumber += '/';
                }
                window.uploader = new plupload.Uploader({
                    browse_button: this.id, // 触发文件选择对话框的按钮，为那个元素id
                    runtimes: 'html5, flash, silverlight, html4',
                    url: global.apiDomain, // 服务器端的上传页面地址
                    flash_swf_url: this.flash_swf_url, // swf文件，当需要使用swf方式进行上传时需要配置该参数
                    max_file_size: this.maxFileSize, // 限制为520MB
                    silverlight_xap_url: this.silverlight_xap_url, // silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
                    filters: {
                        mime_types: this.fileType,
                        max_file_size: this.maxFileSize //最大只能上520MB的文件
                        // prevent_duplicates: this.preventDuplicates //不允许选取重复文件
                    },
                    // chunk_size: 1048576,  // 分块上传 1Mb （后台不支持分块，暂时取消）
                    init: {
                        Error: function (up, err) {
                            if (err.code == -200 || err.code === -601) {
                                // alert("文件格式错误，请检查后重新上传!");
                                _this.$Message.error('文件格式错误，请检查后重新上传!');
                            }
                            if (err.code == -600) {
                                // alert("文件太大，请重新选择！");
                                _this.$Message.warning('文件太大，请重新选择!');
                            }
                        }
                    }
                });
                // 初始化
                uploader.init();

                //上传文件进度条
                uploader.bind('UploadProgress', (uploader, file) => {
                    _this.currentFileName = file.name;
                    _this.showUploadProgress = true;
                    _this.uploadPercent = file.percent + '%';
                    _this.uploadFileList.forEach(function (current, index, arr) {
                        if (current.id == file.id) {
                            // current.percent = file.percent;
                            // _this.uploadPercent = file.percent + '%';
                        }
                    });
                });

                /*上传*/
                uploader.bind('FilesAdded', (uploader, files) => {
                    let _this = this;
                    _this.uploadSuccess = false;
                    _this.files = files;
                    _this.num = 0;
                    //添加的文件信息 用于展示上传文件进度
                    files.forEach(function (creen, index, arr) {
                        _this.uploadFileList.push({
                            name: creen.name,
                            size: creen.size,
                            percent: creen.percent,
                            status: creen.status,
                            type: creen.type,
                            id: creen.id
                        });
                    });

                    _this.setFilenum(files.length);
                    _this.clearUploadList();

                    _this.getImgkey()
                        .then(() => {
                            let configure = {
                                'url': _this.uploadKey.host,
                                'multipart_params': {
                                    'key': _this.uploadKey.dir + _this.randomNumber + files[0].name,
                                    'policy': _this.uploadKey.policy,
                                    'OSSAccessKeyId': _this.uploadKey.accessid,
                                    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                                    'callback': _this.uploadKey.callback,
                                    'signature': _this.uploadKey.signature,
                                    // 'x-oss-object-acl': _this.judgeFileExtension(files[0].name)
                                }
                            };
                            uploader.setOption(configure);  //传入签名
                            uploader.start(); // 实例化上传
                        });
                    _this.$emit("UploadProgress", {uploader, files});
                });

                // 图片上传成功回调
                uploader.bind('FileUploaded', (uploader, files, data) => {
                    let configure = null;
                    if (_this.files.length > 1) {
                        _this.num += 1;
                        let name = _this.files[_this.num] ? _this.files[_this.num].name : _this.files[_this.num - 1];
                        configure = {
                            'url': _this.uploadKey.host,
                            'multipart_params': {
                                'key': _this.uploadKey.dir + _this.randomNumber + name,
                                'policy': _this.uploadKey.policy,
                                'OSSAccessKeyId': _this.uploadKey.accessid,
                                'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                                'callback': _this.uploadKey.callback,
                                'signature': _this.uploadKey.signature,
                                // 'x-oss-object-acl': _this.judgeFileExtension(name)
                            }
                        };
                    } else {
                        configure = {
                            'url': _this.uploadKey.host,
                            'multipart_params': {
                                'key': _this.uploadKey.dir + _this.randomNumber + files.name,
                                'policy': _this.uploadKey.policy,
                                'OSSAccessKeyId': _this.uploadKey.accessid,
                                'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                                'callback': _this.uploadKey.callback,
                                'signature': _this.uploadKey.signature,
                                // 'x-oss-object-acl': _this.judgeFileExtension(files.name)
                            }
                        };
                    }

                    uploader.setOption(configure);  //传入签名
                    let obj = {uploader: uploader, files: files, data: data};
                    _this.imgsrc = JSON.parse(data.response);
                    _this.setfileUrl(obj);
                    _this.$bus.emit("FileUploaded", data);
                    _this.$emit("FileUploadedSuccess", data);
                });

                // 当队列中的file全部上传完成后
                uploader.bind('UploadComplete', (uploader, files) => {
                    _this.$emit("fileUploadComplete");
                    _this.showUploadProgress = false;
                    _this.uploadSuccess = true;
                });
            },
            //清空上传文件列表
            clearUploadList () {
                this.uploadFileList = [];
                this.clearfileUrl();
            },
            //删除上传文件
            delUploadFile(index) {
                //先删除文件列表
                this.uploadFileList.splice(index, 1);
                //再删除vuex中的文件
                this.delFile(index);
            }
        },
        computed: {},
        components: {}
    };
</script>

<style lang="less">
    .upload-file-container {
        position: relative;
        width: 100%;
        height: 100%;
        .uploadContainer {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            .spinSty {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                background: rgba(0, 0, 0, .1);
                border-radius: 3px;
                overflow: hidden;
            }

            .uploading-loading {
                position: relative;
                width: 100%;
                height: 100%;
                > span.waiting-icon {
                    display: block;
                    width: 145px;
                    height: 66px;
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    margin: auto;
                    > i {
                        font-size: 38px;
                        color: @base;
                        animation: rotate-infinity 1s linear infinite;
                    }
                    > label {
                        display: block;
                        line-height: 30px;
                        color: #777;
                    }
                    @keyframes rotate-infinity {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                }
            }

            .title_all {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .uploadPublicSty {
                    font-size: 40px;
                    color: @base
                }
                .prompt_title_last {
                    color: #bbb;
                    line-height: 24px;
                }
            }
            .browse {
                width: 100%;
                height: 100%;
                opacity: 0;
                outline: none;
                cursor: pointer;
            }
            .button {
                position: absolute;
                top: 0;
                left: 0;
                width: 120px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                background: #39f;
                color: #fff;
                border-radius: 4px;
            }
            .filesList {
                li {
                    padding: 5px 0;
                    text-align: left;
                    span {
                        font-size: 13px;
                        i {
                            font-size: 15px;
                            margin-left: 50px;
                            cursor: pointer
                        }
                    }
                    p {
                        background: #e2e6e6;
                        position: relative;
                        height: 2px;
                        i {
                            position: absolute;
                            top: 0;
                            left: 0;
                            bottom: 0;
                            display: inline-block;
                            border: 0;
                            height: 2px;
                            background: #17ceb1;
                        }
                    }
                }
            }
        }

        /* Upload progress */
        .file-upload-progress {
            position: absolute;
            width: 100%;
            height: 8px;
            bottom: -18px;
            left: 0;
            margin-bottom: 5px;
            > span.current-file-name {
                float: left;
                width: 19%;
                font-size: 13px;
                color: #777;
                display: block;
                overflow: hidden;
                -ms-text-overflow: ellipsis;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-top: -7px;
                text-align: left;
            }
            > .total-percent {
                float: right;
                position: relative;
                width: 80%;
                height: 8px;
                margin: auto;
                top: 5px;
                right: 0;
                bottom: 0;
                left: 0;
                background: #eee;
                -webkit-border-radius: 15px;
                -moz-border-radius: 15px;
                border-radius: 15px;
                > .uploaded-percent {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 8px;
                    -webkit-border-radius: 15px;
                    -moz-border-radius: 15px;
                    border-radius: 15px;
                    background: @base;
                    > span {
                        float: right;
                        margin-right: -25px;
                        line-height: 6px;
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
        }
    }
</style>
