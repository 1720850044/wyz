<template>
    <!-- preview video start-->
    <div id="videoPreview" class="video-preview">
        <a class="play-video-center" @click="playPauseVideo()">
            <Icon type="play" v-if="videoParams.isPaused"></Icon>
            <Icon type="pause" v-if="!videoParams.isPaused"></Icon>
        </a>
        <video id="videoPlayer" autoplay :src="videoPreview.src" style="width: 100%; height: 100%;"></video>
        <div class="video-controls-bar" v-if="videoParams && videoParams.totalTime" @mousemove="mouseEnterMove($event)" @mouseup="mouseEnterUp($event)">
            <div class="progress-bar" @mousedown="jumpClickTime($event)">
                <div class="played-progress-bar" :style="{width: playProgressStyle.width}">
                    <label class="slide-point" @mousedown="mouseEnterDown($event)"></label>
                </div>
            </div>
            <div class="play-pause-bar">
                <a :title="videoParams.playPauseTitle" @click="playPauseVideo()">
                    <Icon type="play" v-if="videoParams.isPaused"></Icon>
                    <Icon type="pause" v-if="!videoParams.isPaused"></Icon>
                </a>
                <!--<a v-else title="暂停" @click="playPauseVideo()"><Icon type="pause"></Icon></a>-->
            </div>
            <div class="video-info-bar">
                <span class="played-time">{{videoParams.playedTime}}</span>
                <label>/</label>
                <span class="total-times">{{videoParams.totalTime}}</span>
            </div>
            <div class="options-bar">
                <a class="full-screen-btn" :title="$t('project.pro_fullScreen')" @click="enterFullScreenSize()">
                    <Icon type="arrow-expand" v-if="!videoParams.isFullScreen"></Icon>
                    <Icon type="arrow-shrink" v-else></Icon>
                </a>
                <a :class="{'volume-btn': videoParams.showVolumeRange}" :title="$t('lang.lang_volume')"
                   @mouseleave="videoParams.showVolumeRange=false">
                    <span @click="changeVideoVolume()">
                        <Icon type="android-volume-up" v-if="videoParams.isOpenVolume"></Icon>
                        <Icon type="android-volume-off" v-else></Icon>
                    </span>
                    <div class="volume-range" v-if="videoParams.showVolumeRange" onselectstart="return false">
                        <Slider v-model="volumeValue" :tip-format="format"></Slider>
                    </div>
                </a>
            </div>
        </div>
    </div>
    <!-- preview video end-->
</template>

<script>
    /**
     * Component parameters
     * Required parameter is {currentFileData}
     * If you need to LOADING before playing video, you need to join callback function @hideLoading to control the LOADING.
     */
    export default {
        name: 'video-preview',
        props: {
            currentFileData: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                videoPreview: {
                    src: ''
                },
                videoParams: {
                    playPauseTitle: i18n.t('lang.lang_pause'),
                    isPaused: false,
                    isFullScreen: false,
                    isOpenVolume: true,
                    showVolumeRange: false,
                    totalTime: '00:00',
                    playedTime: '00:00'
                },
                videoPlayer: null,
                intervalFlag: null,
                playProgressStyle: {
                    width: 0
                },
                volumeValue: 50,
                ctrlDragProgress: false
            };
        },
        created () {

        },
        computed: {},
        mounted () {
            this.init();
        },
        watch: {},
        methods: {
            init () {
                let currentFile = this.currentFileData;
                this.videoPreview.src = currentFile.file_url;
                setTimeout(() => {
                    let videoPlayer = document.getElementById("videoPlayer");
                    this.initVideoInfo(videoPlayer);
                    this.$emit('hideLoading');
                }, 1000);
            },
            calculationTime (videoSeconds) {
                if (videoSeconds <= 0) {
                    return '00:00';
                }
                if (videoSeconds > 0 && videoSeconds < 60) {
                    return '00:' + (Array(2).join("0") + parseInt(videoSeconds)).slice(-2);
                }
                if (videoSeconds >= 60 && videoSeconds < 3600) {
                    let minutes = (Array(2).join("0") + (parseInt(videoSeconds / 60))).slice(-2);
                    let seconds = (Array(2).join("0") + (parseInt(videoSeconds % 60))).slice(-2);
                    return minutes + ':' + seconds;
                }
                if (videoSeconds >= 3600) {
                    let hours = (Array(2).join("0") + (parseInt(videoSeconds / 3600))).slice(-2);
                    let minutes = (Array(2).join("0") + (parseInt((videoSeconds % 3600) / 60))).slice(-2);
                    let seconds = (Array(2).join("0") + (parseInt(videoSeconds % 60))).slice(-2);
                    return hours + ':' + minutes + ':' + seconds;
                }
            },
            initVideoInfo (video) {
                this.intervalFlag = null;
                this.videoPlayer = video;
                this.videoPlayer.volume = 0.5;
                if (video) {
                    this.videoParams.totalTime = this.calculationTime(video.duration);
                    this.videoParams.playedTime = this.calculationTime(video.currentTime);
                    this.intervalFlag = setInterval(this.getPlayProgress, 1);
                }
            },
            playPauseVideo () {
                let video = this.videoPlayer;
                this.videoParams.isPaused = !video.paused;
                if (video.paused || video.ended) {
                    if (video.ended) {
                        video.currentTime = 0;
                    }
                    video.play();
                    this.videoParams.playPauseTitle = i18n.t('lang.lang_pause');
                    this.intervalFlag = setInterval(this.getPlayProgress, 1);
                } else {
                    video.pause();
                    this.videoParams.playPauseTitle = i18n.t('lang.lang_play');
                    clearInterval(this.intervalFlag);
                    this.intervalFlag = null;
                }
            },
            mouseEnterDown (e) {
                this.ctrlDragProgress = true;
            },
            mouseEnterMove (e) {
                if (this.ctrlDragProgress) {
                    this.jumpClickTime(e);
                }
            },
            mouseEnterUp (e) {
                this.ctrlDragProgress = false;
            },
            jumpClickTime (e) {
                this.ctrlDragProgress = true;
                if (this.videoPlayer.paused || this.videoPlayer.ended) {
                    this.playPauseVideo();
                }
                let offsetContainer = document.querySelector('.video-preview');
                let pos = offsetContainer.getBoundingClientRect();
                clearInterval(this.intervalFlag);
                this.intervalFlag = null;
                let length = e.pageX - pos.left + 6;
                let percent = length / offsetContainer.offsetWidth;
                this.videoPlayer.currentTime = percent * this.videoPlayer.duration;
                this.intervalFlag = setInterval(this.getPlayProgress, 1);
            },
            getPlayProgress () {
                let percent = this.videoPlayer.currentTime / this.videoPlayer.duration;
                this.videoParams.playedTime = this.calculationTime(this.videoPlayer.currentTime);
                this.playProgressStyle.width = (percent * 100) + '%';
                if (this.videoPlayer.currentTime >= this.videoPlayer.duration) {
                    this.videoParams.isPaused = true;
                    this.videoParams.playPauseTitle = i18n.t('lang.lang_play');
                } else {
                    this.videoParams.isPaused = false;
                    this.videoParams.playPauseTitle = i18n.t('lang.lang_pause');
                }
            },
            changeVideoVolume () {
                this.videoParams.showVolumeRange = true;
            },
            format (value) {
                this.volumeValue = value;
                let video = this.videoPlayer;
                let videoVolume = parseFloat(value / 100);
                video.volume = videoVolume;
                if (value <= 0) {
                    video.muted = true;
                    this.videoParams.isOpenVolume = !video.muted;
                } else {
                    video.muted = false;
                    this.videoParams.isOpenVolume = !video.muted;
                }
                return value;
            },
            enterFullScreenSize () {
                this.videoParams.isFullScreen = !this.videoParams.isFullScreen;
                let videoContainer = document.getElementById('videoPreview');
                if (this.videoParams.isFullScreen) {
                    let docEle = document.documentElement;
                    //W3C
                    if (videoContainer.requestFullscreen) {
                        videoContainer.requestFullscreen();
                    }
                    //FireFox
                    else if (videoContainer.mozRequestFullScreen) {
                        videoContainer.mozRequestFullScreen();
                    }
                    //Chrome等
                    else if (videoContainer.webkitRequestFullScreen) {
                        videoContainer.webkitRequestFullScreen();
                    }
                    //IE11
                    else if (videoContainer.msRequestFullscreen) {
                        videoContainer.msRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
            }
        },
        destroyed () {
            clearInterval(this.intervalFlag);
            this.intervalFlag = null;
        },
        components: {}
    };
</script>

<style lang="less">
    /*preview*/
    .video-preview {
        width: 100%;
        height: 100%;
        position: relative;
        background: rgba(0, 0, 0, 0.38);
        overflow: hidden;
        > a.play-video-center {
            position: absolute;
            display: block;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            width: 58px;
            height: 58px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            text-align: center;
            background: rgba(0, 0, 0, 0.2);
            z-index: 9;
            -webkit-transition: all 0.5s;
            -moz-transition: all 0.5s;
            -ms-transition: all 0.5s;
            -o-transition: all 0.5s;
            transition: all 0.5s;
            opacity: 0;
            > i {
                font-size: 35px;
                color: #cfcfcf;
                line-height: 58px;
                -webkit-transition: all 0.5s;
                -moz-transition: all 0.5s;
                -ms-transition: all 0.5s;
                -o-transition: all 0.5s;
                transition: all 0.5s;
            }
            &:hover {
                background: rgba(0, 0, 0, 0.5);
                > i {
                    color: #fff;
                }
            }
        }
        > video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .video-controls-bar {
            position: absolute;
            width: 100%;
            height: 36px;
            bottom: -45px;
            padding: 3px 10px;
            /*overflow: hidden;*/
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8));
            -webkit-transition: bottom 0.5s;
            -moz-transition: bottom 0.5s;
            -ms-transition: bottom 0.5s;
            -o-transition: bottom 0.5s;
            transition: bottom 0.5s;
            > .progress-bar {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: #eee;
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                border-radius: 5px;
                cursor: pointer;
                > .played-progress-bar {
                    position: relative;
                    width: 80%;
                    height: 3px;
                    -webkit-border-radius: 5px;
                    -moz-border-radius: 5px;
                    border-radius: 5px;
                    background: linear-gradient(to right, #38f3ce, #3cd2b4);
                    cursor: pointer;
                    > .slide-point {
                        position: absolute;
                        display: block;
                        top: -4px;
                        right: 0;
                        width: 12px;
                        height: 12px;
                        border: 3px solid #fff;
                        -webkit-border-radius: 50%;
                        -moz-border-radius: 50%;
                        border-radius: 50%;
                        -webkit-box-shadow: 0 0 1px 1px #ddd;
                        -moz-box-shadow: 0 0 1px 1px #ddd;
                        box-shadow: 0 0 1px 1px #ddd;
                        background: @base;
                        -webkit-transition: all 0.3s;
                        -moz-transition: all 0.3s;
                        -ms-transition: all 0.3s;
                        -o-transition: all 0.3s;
                        transition: all 0.3s;
                        &:hover {
                            background: #fff;
                            border-color: @base;
                            cursor: pointer;
                        }
                    }
                }
            }
            > .play-pause-bar {
                float: left;
                width: 30px;
                height: 20px;
                border-right: 1px solid #9f9f9f;
                text-align: left;
                margin-top: 6px;
                padding-left: 5px;
                > a > i {
                    font-size: 20px;
                    line-height: 22px;
                    color: #fff;
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                    &:hover {
                        color: @base;
                        cursor: pointer;
                    }
                }
            }
            > .video-info-bar {
                float: left;
                width: 120px;
                height: 30px;
                margin-left: 10px;
                line-height: 33px;
                > span {
                    float: left;
                    font-size: 13px;
                    color: #fff;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                > label {
                    float: left;
                    font-size: 15px;
                    margin: -1px 3px 0;
                    color: #fff;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            }
            > .options-bar {
                float: right;
                width: auto;
                height: 30px;
                line-height: 30px;
                padding-right: 5px;
                > a {
                    position: relative;
                    display: block;
                    float: right;
                    margin-left: 20px;
                    width: 15px;
                    text-align: left;
                    -webkit-transition: all 0.5s;
                    -moz-transition: all 0.5s;
                    -ms-transition: all 0.5s;
                    -o-transition: all 0.5s;
                    transition: all 0.5s;
                    i {
                        font-size: 20px;
                        color: #fff;
                        line-height: 33px;
                        -webkit-transition: all 0.3s;
                        -moz-transition: all 0.3s;
                        -ms-transition: all 0.3s;
                        -o-transition: all 0.3s;
                        transition: all 0.3s;
                        &:hover {
                            color: @base;
                            cursor: pointer;
                        }
                        &.ivu-icon-arrow-shrink {
                            font-size: 18px;
                        }
                    }
                    &.volume-btn {
                        width: 130px;
                        > .volume-range {
                            position: absolute;
                            top: 1px;
                            left: 28px;
                            width: 100px;
                            height: 32px;
                            padding-right: 8px;
                            .ivu-slider-wrap {
                                height: 3px;
                                margin: 14px 0;
                                .ivu-slider-bar {
                                    height: 3px;
                                    background: @base;
                                }
                                .ivu-slider-button-wrap {
                                    top: -6px;
                                    .ivu-slider-button {
                                        border-color: @base;
                                        background: #fff;
                                        &:hover {
                                            border-color: #fff;
                                            background: @base;
                                            transform: scale(1.2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        &:hover {
            .video-controls-bar {
                bottom: 0;
            }
            .play-video-center {
                opacity: 1;
            }
        }
    }
</style>
