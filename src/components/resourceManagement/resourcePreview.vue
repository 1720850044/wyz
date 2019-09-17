<template>
    <div class="resource-preview-mask">
        <div class="resource-preview-modal">
            <div class="preview-header">
                <span>{{displayProjectData.fileName}}</span>
                <a class="close-preview-btn" @click="closePreviewModal()">
                    <Icon type="close-round"></Icon>
                </a>
            </div>
            <div class="preview-body">
                <img-preview v-if="showFileType === 'img'" :currentFileData="{file_url: displayProjectData.fileUrl}"></img-preview>
                <video-preview v-if="showFileType === 'video'" :currentFileData="{file_url: displayProjectData.fileUrl}"></video-preview>
                <model-preview v-if="showFileType === '3d'" @screenshotCanvas="screenshotCanvas"></model-preview>
            </div>
            <div class="preview-footer">
                <ul>
                    <li class="project-item">
                        <label>
                            <span v-if="displayProjectData.projectName">{{$t('upload.upload_producer')}}：</span>
                            <span v-else>{{$t('upload.upload_uploader')}}：</span>
                            <span class="user-head-img"><img :src="displayProjectData.headImg"/></span><span>{{displayProjectData.producer}}</span></label>
                        <label><span>{{$t('lang.lang_update')}}{{$t('lang.lang_date')}}：</span><span>{{displayProjectData.updateDate}}</span></label>
                        <label v-if="displayProjectData.projectName"><span>{{$t('lang.lang_project')}}：</span><span>{{displayProjectData.projectName}}</span></label>
                    </li>
                    <li class="operation-item">
                        <a class="download-item-btn" @click="toDownloadPage()"><i class="iconfonts icon-xiazai1"></i>{{$t('upload.upload_download')}}</a>
                        <a class="move-item-btn" @click="moveCurrentFile()"><i class="iconfonts icon-source-move"></i>{{$t('lang.lang_move')}}</a>
                        <a class="copy-item-btn" @click="copyCurrentFile()"><i class="iconfonts icon-sourceCope"></i>{{$t('lang.lang_copy')}}</a>
                        <a class="delete-item-btn" @click="deleteCurrentFile()"><i class="iconfonts icon-sourceDel"></i>{{$t('lang.lang_delete')}}</a>
                    </li>
                </ul>
            </div>
        </div>
        <upload-download-modal v-if="showDownloadPage" :initModalParams="toDownloadParams" @closeModal="showDownloadPage=false"></upload-download-modal>
    </div>
</template>

<script>
    /**
     * 资源预览组件说明：
     * 组件名称：resourcePreview
     * 传参说明：
     *      Require Parameter：needShowParams => Object {
     *          id => String / Number      当前预览文件 id
     *          fileName => String      文件名称
     *          producer => String      制作人（上传者）
     *          headImg => String      制作人头像
     *          updateDate => String      时间
     *          projectName => String      项目名称
     *          fileUrl => String      主文件地址
     *          fileList => Array => [{file: fileUrl}]      贴图文件地址（可包含主文件地址）
     *      }
     *      此参数为必传.
     *      fileUrl 和 fileList 说明：如果预览的文件为 image 或 video，只传 fileUrl ；如果预览文件为 3d ，则需传 fileUrl 和 fileList .
     */

    import {mapMutations} from 'vuex';
    import UploadDownloadModal from "./uploadDownloadModal";
    import ImgPreview from "../uploadAndPreview/imagePreview";
    import VideoPreview from "../uploadAndPreview/videoPreview";
    import ModelPreview from "../uploadAndPreview/tdModulePreview";

    export default {
        name: "resourcePreview",
        props: {
            needShowParams: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                showDownloadPage: false,
                toDownloadParams: {
                    type: 'download'
                },
                showFileType: '',
                displayProjectData: {}
            };
        },
        mounted () {
            this.initPreview();
        },
        components: {ModelPreview, VideoPreview, ImgPreview, UploadDownloadModal},
        methods: {
            ...mapMutations(['changeComponentFileURl', 'setUploadFileUrlList']),
            initPreview () {
                this.displayProjectData = Object.assign({}, this.displayProjectData, this.needShowParams);
                if (this.displayProjectData && this.displayProjectData.fileUrl) {
                    let index = this.displayProjectData.fileUrl.lastIndexOf('.');
                    let ext = this.displayProjectData.fileUrl.substring(index).toLowerCase();
                    switch (ext) {
                        case '.jpg':
                        case '.png':
                        case '.jpeg':
                        case '.bmp':
                        case '.gif':
                            this.showFileType = 'img';
                            break;
                        case '.mp4':
                        case '.rmvb':
                        case '.avi':
                            this.showFileType = 'video';
                            break;
                        case '.fbx':
                        case '.3ds':
                        case '.obj':
                        case '.json':
                        case '.stl':
                            this.showFileType = '3d';
                            this.changeComponentFileURl(this.displayProjectData.fileUrl);
                            this.setUploadFileUrlList(this.displayProjectData.fileList);
                            break;
                        default:
                            this.showFileType = 'unknown';
                            break;
                    }
                }
            },
            // Interface for Bale
            async downloadBeforeBale () {
                let _this = this;
                let path = _this.GLOBAL.baseRouter + this.$GLOBALAPI.company_pick_zip;
                let params = {
                    type: 'file',
                    id: this.needShowParams.id,
                    acc_token: this.needShowParams.accToken
                };
                return this.$axios.post(path, params)
                    .then(result => {
                        if (result.data.err_code === 0) {
                            return true;
                        } else {
                            this.$Message.error(result.data.err_message);
                        }
                    });
            },
            toDownloadPage () {
                this.showDownloadPage = true;
                this.downloadBeforeBale()
                    .then(flag => {
                        if (flag) {
                            // this.showDownloadPage = true;
                        }
                    });
            },
            copyCurrentFile (file) {
                console.log('Copy...');
                // console.log(this.needShowParams)
                this.$emit('copyCurrentFile', event);
            },
            moveCurrentFile (file) {
                console.log('Move...');
                this.$emit('moveCurrentFile', event);
            },
            deleteCurrentFile (file) {
                console.log('Delete...');
                this.$emit('deleteCurrentFile');
            },
            closePreviewModal () {
                this.$emit('closePreviewModal');
            },
            //canvas截图
            screenshotCanvas(){
                if (!this.needShowParams.isThumb){
                    this.$PublicFuns.getHtml2canvas('tdCanvasArea').then((base64) =>{
                        this.$PublicFuns.getOssKey().then((OSSdata) =>{
                            this.$PublicFuns.uploadOss(base64, OSSdata).then((imgUrl) =>{
                                this.$emit('Skyscreenshot', {url: imgUrl, fileID: this.needShowParams.id});
                            });
                        });
                    });
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .resource-preview-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        .resource-preview-modal {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            width: 960px;
            height: 695px;
            background: #fff;
            overflow: hidden;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            > .preview-header {
                width: 100%;
                height: 60px;
                border-bottom: 1px solid #dfdfdf;
                padding: 0 20px;
                line-height: 60px;
                background: url("https://static.banbooyun.com/public/img/headBarBGimg.png") no-repeat center / cover;
                > span {
                    font-size: 16px;
                    color: #fff;
                }
                > a.close-preview-btn {
                    float: right;
                    > i {
                        font-size: 18px;
                        color: #fff;
                        -webkit-transition: all 0.3s;
                        -moz-transition: all 0.3s;
                        -ms-transition: all 0.3s;
                        -o-transition: all 0.3s;
                        transition: all 0.3s;
                    }
                }
            }
            > .preview-body {
                position: relative;
                width: 100%;
                height: 540px;
                margin-top: 15px;
                padding: 0 20px;
            }
            > .preview-footer {
                width: 100%;
                height: 40px;
                margin-top: 20px;
                padding: 0 20px;
                > ul {
                    display: flex;
                    justify-content: space-between;
                    > li {
                        line-height: 40px;
                        label {
                            display: block;
                            float: left;
                            margin-right: 20px;
                            font-size: 14px;
                            overflow: hidden;
                            > span {
                                float: left;
                            }
                            > span.user-head-img {
                                position: relative;
                                display: block;
                                width: 28px;
                                height: 28px;
                                margin: 5px 5px 0 0;
                                -webkit-border-radius: 100%;
                                -moz-border-radius: 100%;
                                border-radius: 100%;
                                overflow: hidden;
                                /*border: 1px solid #e0e0e0;*/
                                > img {
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    bottom: 0;
                                    left: 0;
                                    margin: auto;
                                    width: 100%;
                                    height: 100%;
                                    /*max-width: 100%;*/
                                    /*max-height: 100%;*/
                                }
                            }
                        }
                        &.project-item {
                            width: 62%;
                        }
                        &.operation-item {
                            > a {
                                display: inline-block;
                                font-size: 14px;
                                height: 26px;
                                line-height: 26px;
                                padding: 0 15px;
                                margin-left: 3px;
                                text-align: center;
                                color: @base;
                                -webkit-border-radius: 3px;
                                -moz-border-radius: 3px;
                                border-radius: 3px;
                                -webkit-transition: all 0.3s;
                                -moz-transition: all 0.3s;
                                -ms-transition: all 0.3s;
                                -o-transition: all 0.3s;
                                transition: all 0.3s;
                                > i {
                                    font-size: 14px;
                                    margin-right: 3px;
                                }
                                &.delete-item-btn {
                                    color: #f30;
                                    &:hover {
                                        background: #f30;
                                    }
                                }
                                &:hover {
                                    background: @base;
                                    color: #fff;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
