<template>
    <!-- preview img start-->
    <div class="image-preview">
        <img :src="imgPreview.src" @click="toScaleImageBigger()"/>
        <div class="image-operate-bar">
            <a class="scale-bigger-default" @click="toScaleImageBigger()">
                <Icon type="arrow-expand" v-if="true" :title="$t('tip.tip_clickScaleBigger')"></Icon>
                <!--<Icon type="arrow-shrink" v-if="true"></Icon>-->
            </a>
        </div>
        <!-- 放大图片 -->
        <div class="preview-bigger" v-if="showBiggerImage" @click="closePreviewImage()">
            <div class="bigger-container">
        <img :src="imgPreview.src"/>
    </div>
        </div>
    </div>
    <!-- preview img end-->
</template>

<script>
    /**
     * Component parameters
     * Required parameter is {currentFileData}
     * If you need to LOADING before playing video, you need to join callback function @hideLoading to control the LOADING.
     */
    export default {
        name: 'img-preview',
        props: {
            currentFileData: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                imgPreview: {
                    src: ''
                },
                showBiggerImage: false
            };
        },
        mounted () {
            this.init();
        },
        watch: {
            currentFileData(val) {
                if (val) {
                    this.init();
                }
            }
        },
        methods: {
            init () {
                let currentFile = this.currentFileData;
                this.imgPreview.src = currentFile.file_url;
                this.$emit('hideLoading');
            },
            toScaleImageBigger () {
                this.showBiggerImage = true;
            },
            closePreviewImage () {
                this.showBiggerImage = false;
            }
        }
    };
</script>

<style lang="less">
    /*preview*/
    .image-preview {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.28);
        > img {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            max-width: 100%;
            max-height: 100%;
            cursor: pointer;
        }
        > .image-operate-bar {
            position: absolute;
            bottom: -45px;
            width: 100%;
            height: 34px;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6));
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
            > .scale-bigger-default {
                float: right;
                display: block;
                height: 34px;
                padding: 4px 15px;
                > i {
                    font-size: 20px;
                    color: #fff;
                    line-height: 26px;
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                    &:hover {
                        color: @base;
                    }
                    &.ivu-icon-arrow-shrink {
                        font-size: 18px;
                    }
                }
            }
        }

        > .preview-bigger {
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999;
            > .bigger-container {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                width: 1280px;
                height: 720px;
                > img {
                    position: absolute;
                    max-width: 100%;
                    max-height: 100%;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    margin: auto;
                    cursor: pointer;
                    -webkit-box-shadow: 0 0 15px 3px #494949;
                    -moz-box-shadow: 0 0 15px 3px #494949;
                    box-shadow: 0 0 15px 3px #494949;
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                    &:hover {
                        -webkit-box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.78);
                        -moz-box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.78);
                        box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.78);
                    }
                }
            }
        }
        &:hover {
            > .image-operate-bar {
                bottom: 0;
            }
        }
    }
</style>
