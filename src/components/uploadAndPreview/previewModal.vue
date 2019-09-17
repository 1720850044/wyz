<template>
    <!-- preview start-->
    <div class="preview-mask" v-if="isShowPreview">
        <div class="preview-container">
            <h1 class="close-preview">
                <label>{{$t('upload.upload_preview')}}</label>
                <a @click="closePreview($event)">
                    <Icon type="close-round"></Icon>
                </a>
            </h1>
            <div class="display-container">
                <div class="preview-loading" v-if="previewLoading">
                <span class="waiting-icon">
                    <Icon type="load-c"></Icon>
                    <label>{{$t('tip.tip_waitLoading')}}...</label>
                </span>
                </div>
                <div class="img-display" v-if="previewType.pic">
                    <Carousel
                        v-model="slideSetting.currentIndex"
                        :height="slideSetting.height"
                        :autoplay="slideSetting.autoplay"
                        :autoplay-speed="slideSetting.autoplaySpeed"
                        :dots="slideSetting.dots"
                        :trigger="slideSetting.trigger"
                        :arrow="slideSetting.arrow">
                        <Carousel-item v-for="(opt, index) in previewImgData" :key="index">
                            <div class="demo-carousel">
                                <img :src="opt.file_url" @click="stopDefault($event)"/>
                            </div>
                        </Carousel-item>
                    </Carousel>
                </div>
                <!--<img-preview v-if="previewType.pic" :currentFileData="currentFileData" @hideLoading="previewLoading=false"></img-preview>-->
                <video-preview v-if="previewType.video" :currentFileData="currentFileData" @hideLoading="previewLoading=false"></video-preview>
                <div class="td-preview" v-if="previewType.td">
                    <model-preview></model-preview>
                </div>
                <div class="not-support-preview" v-if="previewType.notSupport">
                    <p>{{$t('tip.tip_fileNotSupportPreview')}}!</p>
                </div>
            </div>
        </div>
    </div>
    <!-- preview end-->
</template>

<script>
    import {mapMutations} from 'vuex';
    import videoPreview from "./videoPreview";
    import imgPreview from "./imagePreview";
    import ModelPreview from "./tdModulePreview";

    export default {
        name: 'preview-modal',
        props: {
            uploadSuccessData: {
                type: Array,
                default: () => {
                }
            },
            currentFileData: {
                type: Object,
                default: () => {
                }
            }
        },
        data () {
            return {
                previewLoading: true,
                isShowPreview: false,
                slideSetting: {
                    currentIndex: 0,
                    height: 593,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    dots: 'none',
                    trigger: 'click',
                    arrow: 'hover'
                },
                previewImgData: [],
                previewType: {
                    pic: false,
                    video: false,
                    td: false,
                    notSupport: false
                }
            };
        },
        created () {

        },
        computed: {},
        mounted () {

        },
        watch: {},
        methods: {
            ...mapMutations(['setUploadFileUrlList', 'changeComponentFileURl']),
            init (currentFileData) {
                this.previewLoading = true;
                this.isShowPreview = true;
                this.previewType = {
                    pic: false,
                    video: false,
                    td: false
                };
                let type = currentFileData.fileType;
                if (type) {
                    switch (type) {
                        case 'img':
                            this.showPicPopup(currentFileData);
                            break;
                        case 'video':
                            this.showVideoPopup();
                            break;
                        case '3d':
                            this.showTdPopup(currentFileData);
                            break;
                        case 'unknown':
                            this.notSupportPreview(currentFileData);
                            break;
                    }
                }
            },
            showPicPopup (currentFile) {
                this.previewLoading = false;
                this.previewType.pic = true;
                this.previewImgData = this.uploadSuccessData.filter(item => {
                    let type = item.fileType;
                    if (type === 'img') {
                        return item;
                    }
                });
                this.previewImgData.forEach((item, index) => {
                    if (currentFile.name === item.name) {
                        this.slideSetting.currentIndex = index;
                    }
                });
            },
            showVideoPopup () {
                this.previewType.video = true;
            },
            showTdPopup (currentFile) {
                this.previewLoading = false;
                this.previewType.td = true;
                let storeFileList = this.uploadSuccessData.map(item => ({
                    file: item.file_url
                }));
                this.setUploadFileUrlList(storeFileList);
                this.changeComponentFileURl(currentFile.file_url);
            },
            notSupportPreview (currentFile) {
                this.previewLoading = false;
                this.previewType.notSupport = true;
            },
            closePreview (event) {
                this.stopDefault(event);
                this.isShowPreview = false;
            },
            stopDefault (e) {
                e.stopPropagation();
            }
        },
        components: {
            ModelPreview,
            imgPreview,
            videoPreview
        }
    };
</script>

<style lang="less" scoped>
    /*preview*/
    .preview-mask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        background: rgba(55, 55, 55, .6);
        z-index: 99;
    }

    .preview-container {
        position: absolute;
        width: 960px;
        height: 628px;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        padding: 0;
        background: rgba(255, 255, 255, .88);
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        overflow: hidden;
        -webkit-box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.1);
        -moz-box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.1);
        > h1.close-preview {
            position: relative;
            float: left;
            width: 100%;
            height: 35px;
            -webkit-box-shadow: 0 1px 5px #ccc;
            -moz-box-shadow: 0 1px 5px #ccc;
            box-shadow: 0 1px 5px #ccc;
            display: block;
            background: #fff;
            z-index: 10;
            font-weight: normal;
            > label {
                font-size: 15px;
                line-height: 35px;
                float: left;
                margin-left: 10px;
            }
            > a {
                display: block;
                position: relative;
                z-index: 99;
                > i {
                    float: right;
                    font-size: 16px;
                    color: #999;
                    line-height: 35px;
                    margin: 0 10px 0 0;
                    -webkit-transition: all 0.5s;
                    -moz-transition: all 0.5s;
                    -ms-transition: all 0.5s;
                    -o-transition: all 0.5s;
                    transition: all 0.5s;
                    &:hover {
                        color: @base;
                    }
                }
            }
        }

        > .display-container {
            position: relative;
            width: 100%;
            height: 100%;
            padding-top: 35px;
            > .preview-loading {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                z-index: 9;
                .waiting-icon {
                    display: block;
                    width: 145px;
                    height: 66px;
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    margin: auto;
                    text-align: center;
                    > i {
                        font-size: 38px;
                        color: @base;
                        animation: rotate-infinity 2s linear infinite;
                    }
                    > label {
                        display: block;
                        line-height: 30px;
                        color: #fff;
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
            > .img-display {
                position: absolute;
                width: 100%;
                height: 593px;
                > .ivu-carousel {
                    width: 100%;
                    .ivu-carousel-track {
                        .ivu-carousel-item {
                            .demo-carousel {
                                position: relative;
                                width: 100%;
                                height: 100%;
                                img {
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    bottom: 0;
                                    left: 0;
                                    margin: auto;
                                    max-width: 100%;
                                    max-height: 100%;
                                    cursor: pointer;
                                    /*&:hover {*/
                                    /*cursor: url("../assets/images/scale-small.cur"), pointer;*/
                                    /*}*/
                                }
                            }
                        }
                    }
                }
            }
            > .td-preview {
                position: relative;
                width: 100%;
                height: 100%;
            }

            > .not-support-preview {
                width: 100%;
                line-height: 100px;
                font-size: 14px;
                color: #888;
                text-align: center;
            }
        }
    }
</style>
