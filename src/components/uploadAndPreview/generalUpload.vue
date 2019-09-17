<template>
    <div class="general-upload-container">
        <div class="small-upload-btn" v-if="showUploadParams.style">
            <a @click="showUploadPopup()" :style="pageParams.definedBtnStyle">
                <Icon type="upload" :style="pageParams.definedIconStyle"></Icon>
                <span>{{pageParams.smallBtnText}}</span>
            </a>
        </div>
        <common-upload :fieldLabelList="fieldLabelList" :styleLabelList="styleLabelList"  :showUploadParams="showUploadParams" v-if="showUploadParams.popup" :showOtherInfos="showOtherInfos" :initPageParams="pageParams"></common-upload>
    </div>
</template>

<script>
    /**
     * 组件说明：
     * initParams：初始化参数，可自定义 上传按钮样式（definedBtnStyle）、上传图标大小（definedIconStyle）、按钮文字内容（smallBtnText）等，如不传则为默认样式及内容；
     * fieldLabelList：领域标签字段，为Json对象；
     * styleLabelList：风格标签字段，为Json对象；
     * showOtherInfos：控制是否显示各标签字段及作品简介内容字段，默认为显示（true），为Object对象，{fieldLabel: true, styleLabel: true, fileDescribe: true}
     */
    import commonUpload from "./commonUpload";

    export default {
        name: 'general-upload',
        props: {
            initParams: {
                type: Object,
                default: () => {}
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
                pageParams: {
                    smallBtnText: i18n.t('upload.upload_uploadWork'),
                    definedBtnStyle: null,
                    definedIconStyle: null
                },
                showUploadParams: {
                    style: true,
                    popup: false
                }
            };
        },
        created () {

        },
        computed: {

        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.pageParams = Object.assign({}, this.pageParams, this.initParams);
            },
            showUploadPopup () {
                this.showUploadParams.popup = true;
            }
        },
        components: {commonUpload}
    };
</script>

<style lang="less">
    .general-upload-container {
        position: relative;
        width: 100%;
        height: 100%;
        > .small-upload-btn {
            display: flex;
            height: 35px;
            margin: 0 auto;
            > a {
                display: flex;
                background: @base;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                line-height: 35px;
                color: #fff;
                text-align: center;
                font-size: 14px;
                cursor: pointer;
                margin: 0 auto;
                padding: 0 20px;
                > i {
                    font-size: 24px;
                    color: #fff;
                    margin: 5px 3px 0 0;
                }
                > span {
                    color: #fff;
                }
            }
        }
    }
</style>
