<template>
    <div class="audio-container">
        <div class="audio-player-bg" :class="{'rotate-bg-icon': setRotateClass}"></div>
        <audio id="myAudio" class="audio-label" crossorigin="anonymous" :src="audioFilePath" loop>
            Your browser did not support audio label.
        </audio>
        <canvas :id="audioCanvasId" class="audio-canvas"></canvas>
        <div class="audio-control">
            <div class="operate-control">
                <a class="play-pause-btn" @click="operatePlayOrPause">
                    <i class="iconfonts icon-bofang" v-if="myAudio.paused"></i>
                    <i class="iconfonts icon-pause" v-else></i>
                </a>
                <div class="progress-area" @mousemove="mouseMove($event)" @mouseup="mouseUp()" onselectstart="return false">
                    <div class="total-duration-area" @mousedown="jumpPlayHere($event)">
                        <div class="played-duration-area" :style="{width: `${audioProperties.played}` + '%'}">
                            <span class="drag-point" @mousedown="mouseDown($event)"></span>
                        </div>
                    </div>
                </div>
                <div class="audio-info-area">
                    <ul>
                        <li>
                            <label>{{audioProperties.currentTime}}</label>
                            <span>/</span>
                            <label>{{audioProperties.duration}}</label>
                        </li>
                    </ul>
                    <div class="audio-volume">
                        <a class="audio-volume-btn" @mouseenter="enterVolume()" @mouseleave="leaveVolume()">
                            <label @click.stop="setQuietSounds()">
                                <Icon type="android-volume-up" v-if="audioProperties.volume > 0"></Icon>
                                <Icon type="android-volume-off" v-else></Icon>
                            </label>
                            <div class="out-volume-area" v-if="showVolumeSlide">
                                <span class="down-icon"></span>
                                <div class="adjust-audio-volume" @mousemove="mouseMoveVolume($event)" @mouseup="mouseUpVolume()" @mouseleave="mouseUpVolume()" onselectstart="return false">
                                    <div class="range-slide" ref="slideRange" @mousedown="jumpVolumeHere($event)">
                                        <a class="slide-block" ref="slideBlock" @mousedown="mouseDownVolume($event)">
                                            <div class="percent-tip">
                                                <span class="right-icon"></span>
                                                {{audioProperties.volume}}%
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "audioPlayer",
        props: ['audioCanvasId', 'taskInfo', 'isCollaboration', 'audioPath'],
        data () {
            return {
                audioFilePath: null,
                myAudio: {},
                audioProperties: {
                    duration: '00:00',
                    currentTime: '00:00',
                    played: 0,
                    volume: 0.5
                },
                oCtx: null,
                audioSrc: null,
                analyser: null,
                animationFrame: null,
                isDrag: false,
                isDropVolumeSlide: false,
                showVolumeSlide: false,
                setRotateClass: false
            };
        },
        mounted () {
            this.filterMainFile();
        },
        methods: {
            filterMainFile () {
                if (this.taskInfo && this.taskInfo.file && this.taskInfo.file.length > 0) {
                    let mainFile = this.taskInfo.file.filter(item => item.is_main === '1')[0];
                    this.audioFilePath = mainFile.file;
                }
                if (this.audioPath) {
                    this.audioFilePath = this.audioPath;
                }
                this.init();
            },
            init () {
                let _this = this;
                window.cancelAnimationFrame(this.animationFrame);
                let audio = document.getElementById('myAudio');
                audio.load();
                audio.oncanplay = function () {
                    _this.audioProperties.duration = _this.$PublicFuns.calculationTime(audio.duration);
                    _this.audioProperties.currentTime = _this.$PublicFuns.calculationTime(audio.currentTime);
                    _this.myAudio = audio;
                    _this.myAudio.volume = 0.5;
                    _this.audioProperties.volume = _this.myAudio.volume * 100;
                    _this.audioAnalyser();
                };
            },
            enterVolume () {
                this.showVolumeSlide = true;
            },
            leaveVolume () {
                this.showVolumeSlide = false;
            },
            mouseDownVolume (e) {
                e.stopPropagation();
                this.isDropVolumeSlide = true;
            },
            mouseMoveVolume (e) {
                if (this.isDropVolumeSlide) {
                    this.jumpVolumeHere(e);
                }
            },
            mouseUpVolume () {
                this.isDropVolumeSlide = false;
            },
            jumpVolumeHere (e) {
                this.isDropVolumeSlide = true;
                let slideRange = this.$refs.slideRange;
                let slideRangeRect = slideRange.getBoundingClientRect();
                let percent = parseFloat(Math.abs(1 - ((e.clientY - slideRangeRect.top + 5) / 88))).toFixed(2);
                this.myAudio.volume = percent <= 0 ? 0 : percent >= 1 ? 1 : percent;
                this.audioProperties.volume = parseInt(this.myAudio.volume * 100);
            },
            setQuietSounds () {
                this.myAudio.volume = this.audioProperties.volume > 0 ? 0 : 0.5;
            },
            operatePlayOrPause () {
                let oAudio = this.myAudio;
                if (oAudio.paused) {
                    oAudio.play();
                } else {
                    oAudio.pause();
                }
            },
            mouseDown (e) {
                e.stopPropagation();
                this.isDrag = true;
                document.body.onmouseup = () => {
                    this.isDrag = false;
                };
            },
            mouseUp () {
                this.isDrag = false;
            },
            jumpPlayHere (e) {
                this.isDrag = true;
                let durationEle = document.querySelector('.total-duration-area');
                let pos = durationEle.getBoundingClientRect();
                this.myAudio.currentTime = (e.pageX - pos.left + 7) * this.myAudio.duration / durationEle.offsetWidth;
            },
            mouseMove (e) {
                if (this.isDrag) {
                    this.jumpPlayHere(e);
                }
            },
            audioAnalyser () {
                window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
                let _this = this;
                let oAudio = this.myAudio;
                oAudio.play();
                // 创建音频上下文对象
                if (!this.oCtx) this.oCtx = new AudioContext();
                // oCtx.resume();
                // 创建媒体源,除了audio本身可以获取，也可以通过oCtx对象提供的api进行媒体源操作
                if (!this.audioSrc) this.audioSrc = this.oCtx.createMediaElementSource(oAudio);
                // 创建分析机
                if (!this.analyser) this.analyser = this.oCtx.createAnalyser();
                // 媒体源与分析机连接
                this.audioSrc.connect(this.analyser);
                // 输出的目标：将分析机分析出来的处理结果与目标点（耳机/扬声器）连接
                this.analyser.connect(this.oCtx.destination);

                /**
                 * 绘制音频图
                 * 根据分析音频的数据去获取音频频次界定音频图的高度
                 * 放在与音频频次等长的8位无符号字节数组
                 * Uint8Array:初始化默认值为1024
                 */
                // 利用 canvas 渐变进行音频绘制
                let canvas = document.getElementById(this.audioCanvasId);
                let ctx = canvas.getContext('2d');
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                let oW = canvas.width;
                let oH = canvas.height;
                let colorUp = ctx.createLinearGradient(oW / 2, oH / 2 - 8, oW / 2, oH / 2 - 58);
                let colorDown = ctx.createLinearGradient(oW / 2, oH / 2 + 8, oW / 2, oH / 2 + 58);
                colorUp.addColorStop(0, '#3cd2b470');
                colorUp.addColorStop(0.4, '#3cd2b490');
                colorUp.addColorStop(1, '#3cd2b4');
                colorDown.addColorStop(0, '#3cd2b470');
                colorDown.addColorStop(0.4, '#3cd2b490');
                colorDown.addColorStop(1, '#3cd2b4');
                // 音频图的条数
                let count = 128;
                // 缓冲区:进行数据的缓冲处理，转换成二进制数据
                let voiceHeight = new Uint8Array(this.analyser.frequencyBinCount);

                function draw () {
                    if (_this.myAudio.duration) {
                        _this.audioProperties.duration = _this.$PublicFuns.calculationTime(_this.myAudio.duration);
                    }
                    _this.audioProperties.currentTime = _this.$PublicFuns.calculationTime(_this.myAudio.currentTime);
                    _this.audioProperties.played = _this.myAudio.currentTime / _this.myAudio.duration * 100;
                    let slideBlock = _this.$refs.slideBlock;
                    if (slideBlock) {
                        slideBlock.style.bottom = (_this.myAudio.volume - 0.06) * 100 + '%';
                        _this.audioProperties.volume = parseInt(_this.myAudio.volume * 100);
                    }
                    _this.setRotateClass = !_this.myAudio.paused;
                    // 将当前的频率数据复制到传入的无符号字节数组中，做到实时连接
                    _this.analyser.getByteFrequencyData(voiceHeight);
                    // 自定义获取数组里边数据的频步
                    let step = Math.round(voiceHeight.length / count);
                    ctx.clearRect(0, 0, oW, oH);
                    for (let i = 0; i < count; i++) {
                        let audioHeight = voiceHeight[step * i];
                        ctx.fillStyle = colorUp;  // 绘制向上的线条
                        ctx.fillRect(oW / 2 + (i * 12), oH / 2, 6, -audioHeight - 1);
                        ctx.fillRect(oW / 2 - (i * 12), oH / 2, 6, -audioHeight - 1);
                        ctx.fillStyle = colorDown;  // 绘制向下的线条
                        ctx.fillRect(oW / 2 + (i * 12), oH / 2, 6, audioHeight + 1);
                        ctx.fillRect(oW / 2 - (i * 12), oH / 2, 6, audioHeight + 1);
                    }
                    _this.animationFrame = window.requestAnimationFrame(draw);
                }
                draw();
            }
        },
        destroyed () {
            window.cancelAnimationFrame(this.animationFrame);
        }
    };
</script>

<style lang="less" scoped>
    .audio-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: radial-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.18));
        &:hover {
            .audio-control {
                bottom: 0;
            }
        }
        .audio-player-bg {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            width: 200px;
            height: 200px;
            background: url("../../assets/images/icon/audio-music-icon.png") no-repeat center / cover;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
            &.rotate-bg-icon {
                animation: rotate-infinity 2.8s linear infinite;
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
        .audio-label {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9;
        }
        .audio-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 3;
        }
        .audio-control {
            position: absolute;
            bottom: -45px;
            left: 0;
            width: 100%;
            height: 40px;
            background: rgba(0, 0, 0, 0.38);
            z-index: 10;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
            .operate-control {
                position: relative;
                width: 100%;
                height: 40px;
                display: flex;
                justify-content: space-between;
                .play-pause-btn {
                    display: block;
                    /*float: left;*/
                    width: 25px;
                    height: 30px;
                    margin: 5px 10px;
                    i {
                        font-size: 18px;
                        line-height: 28px;
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
                .progress-area {
                    position: relative;
                    width: 100%;
                    height: 40px;
                    .total-duration-area {
                        position: absolute;
                        left: 0;
                        top: 17px;
                        width: 100%;
                        height: 5px;
                        background: #fff;
                        -webkit-border-radius: 3px;
                        -moz-border-radius: 3px;
                        border-radius: 3px;
                        cursor: pointer;
                        .played-duration-area {
                            position: relative;
                            min-width: 10px!important;
                            height: 5px;
                            background: linear-gradient(to right, rgba(80, 210, 160, 0.38), rgba(80, 210, 160, 1));
                            .drag-point {
                                display: block;
                                position: absolute;
                                width: 12px;
                                height: 12px;
                                right: 0;
                                top: -4px;
                                border: 2px solid @base;
                                background: #fff;
                                -webkit-border-radius: 50%;
                                -moz-border-radius: 50%;
                                border-radius: 50%;
                                -webkit-transition: all 0.3s;
                                -moz-transition: all 0.3s;
                                -ms-transition: all 0.3s;
                                -o-transition: all 0.3s;
                                transition: all 0.3s;
                                &:hover {
                                    background: @base;
                                    border-color: #fff;
                                }
                            }
                        }
                    }
                }
                .audio-info-area {
                    width: 155px;
                    height: 40px;
                    margin-left: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    ul {
                        /*float: left;*/
                        li {
                            font-size: 13px;
                            color: #fff;
                            line-height: 38px;
                        }
                    }
                    .audio-volume {
                        /*float: left;*/
                        margin-right: 15px;
                        .audio-volume-btn {
                            position: relative;
                            display: block;
                            > label > i {
                                cursor: pointer;
                                font-size: 20px;
                                color: #fff;
                            }
                            .out-volume-area {
                                position: absolute;
                                bottom: 18px;
                                left: -8px;
                                width: 28px;
                                padding: 0 0 20px;
                                .down-icon {
                                    position: absolute;
                                    width: 0;
                                    height: 0;
                                    bottom: 12px;
                                    right: 8px;
                                    padding: 0;
                                    border-width: 8px 6px 0 6px;
                                    border-style: solid;
                                    border-color: rgba(0, 0, 0, 0.5) transparent transparent;
                                }
                            }
                            .adjust-audio-volume {
                                position: relative;
                                width: 28px;
                                height: 108px;
                                background: rgba(0, 0, 0, 0.5);
                                -webkit-border-radius: 3px;
                                -moz-border-radius: 3px;
                                border-radius: 3px;
                                -webkit-transition: all 0.1s;
                                -moz-transition: all 0.1s;
                                -ms-transition: all 0.1s;
                                -o-transition: all 0.1s;
                                transition: all 0.1s;
                                .range-slide {
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    bottom: 0;
                                    left: 0;
                                    margin: auto;
                                    width: 4px;
                                    height: 88px;
                                    background: #fff;
                                    -webkit-border-radius: 3px;
                                    -moz-border-radius: 3px;
                                    border-radius: 3px;
                                    -webkit-transition: all 0.1s;
                                    -moz-transition: all 0.1s;
                                    -ms-transition: all 0.1s;
                                    -o-transition: all 0.1s;
                                    transition: all 0.1s;
                                    .slide-block {
                                        display: block;
                                        position: absolute;
                                        left: -3px;
                                        width: 10px;
                                        height: 10px;
                                        background: #fff;
                                        border: 2px solid @base;
                                        -webkit-border-radius: 50%;
                                        -moz-border-radius: 50%;
                                        border-radius: 50%;
                                        -webkit-transition: all 0.1s;
                                        -moz-transition: all 0.1s;
                                        -ms-transition: all 0.1s;
                                        -o-transition: all 0.1s;
                                        transition: all 0.1s;
                                        &:hover {
                                            cursor: pointer;
                                            /*.percent-tip {*/
                                                /*display: block;*/
                                            /*}*/
                                        }
                                        .percent-tip {
                                            position: relative;
                                            display: block;
                                            width: 38px;
                                            height: 26px;
                                            background: rgba(0, 0, 0, 0.5);
                                            margin: -10px 0 0 -55px;
                                            color: #fff;
                                            text-align: center;
                                            line-height: 26px;
                                            -webkit-border-radius: 3px;
                                            -moz-border-radius: 3px;
                                            border-radius: 3px;
                                            .right-icon {
                                                position: absolute;
                                                width: 0;
                                                height: 0;
                                                top: 7px;
                                                right: -6px;
                                                padding: 0;
                                                border-width: 6px 0 6px 6px;
                                                border-style: solid;
                                                border-color: transparent rgba(0, 0, 0, 0.5) transparent;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
