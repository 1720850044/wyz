<template>
    <div class="main-guide-layer">
        <div class="main-guide-container">
            <div class="outside-container">
                <a class="close-guide-btn" @click="closeGuidePopup()">
                    <i class="iconfonts icon-closes"></i>
                </a>
                <div class="left-bg">
                    <div class="guide-progress-bar" v-if="userRole === '3'">
                        <div class="overflow-layout">
                            <div class="progress-item start-task-icon">
                                <!--<i class="iconfonts icon-pause1"></i>-->
                            </div>
                            <p>开始任务</p>
                        </div>
                        <span class="right-arrow-item">
                            <label></label>
                            <i></i>
                        </span>
                        <div class="overflow-layout">
                            <div class="progress-item make-task-icon"></div>
                            <p>制作任务</p>
                        </div>
                        <span class="right-arrow-item">
                            <label></label>
                            <i></i>
                        </span>
                        <div class="overflow-layout">
                            <div class="progress-item upload-audit-icon"></div>
                            <p>上传审核</p>
                        </div>
                        <span class="right-arrow-item">
                            <label></label>
                            <i></i>
                        </span>
                        <div class="overflow-layout">
                            <div class="progress-item audit-passed-icon"></div>
                            <p>审核通过</p>
                        </div>
                        <span class="right-arrow-item">
                            <label></label>
                            <i></i>
                        </span>
                        <div class="overflow-layout">
                            <div class="progress-item task-over-icon"></div>
                            <p>任务完成</p>
                        </div>
                    </div>

                    <div class="guide-progress-bar" v-if="userRole === '1' || userRole === '2' || userRole === '99999'">
                        <div class="overflow-layout">
                            <div class="progress-item project-bid-icon"></div>
                            <p v-if="userType.type === 0">项目投标</p>
                            <p v-else>项目招标</p>
                        </div>
                        <span class="right-arrow-item">
                            <label></label>
                            <i></i>
                        </span>
                        <div class="overflow-layout">
                            <div class="progress-item signed-contract-icon"></div>
                            <p>签定合同</p>
                        </div>
                        <span class="right-arrow-item">
                            <label></label>
                            <i></i>
                        </span>
                        <div class="overflow-layout">
                            <div class="progress-item project-manage-icon"></div>
                            <p>外包项目管理</p>
                        </div>
                    </div>
                </div>
                <div class="right-bg">
                    <h1 class="new-user-guide-title">新手引导</h1>
                    <ul class="guide-list">
                        <li v-for="(item, index) in guideList" :key="index" :title="item.name" @click="jumpGuideItem(item)">{{item.name}}<i class="iconfonts icon-pause1"></i></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';

    export default {
        name: "mainGuide",
        props: ['guideList'],
        data () {
            return {
                userRole: null,
                userType: null
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.userRole = Cookies.get('post_id');
                let company = Cookies.get('company');
                this.userType = JSON.parse(company);
            },
            jumpGuideItem (item) {
                let _this = this;
                this.$PublicFuns.resetPageGuide(item.key)
                    .then(result => {
                        if (result) {
                            _this.$emit('nextGuide', item.route);
                        }
                    });
            },
            closeGuidePopup () {
                this.$emit('nextGuide', false);
            }
        }
    };
</script>

<style lang="less" scoped>
    .main-guide-layer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99999999999;
        .main-guide-container {
            width: 846px;
            height: 380px;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            z-index: 100000000000;
            .outside-container {
                position: relative;
                width: 100%;
                height: 380px;
                .close-guide-btn {
                    position: absolute;
                    right: -58px;
                    top: -58px;
                    > i {
                        font-size: 30px;
                        color: #fff;
                    }
                }
                .left-bg {
                    position: relative;
                    float: left;
                    width: 580px;
                    height: 380px;
                    background: url("../../assets/images/welcome/guide-popup-left-bg.png") no-repeat left top;
                    .guide-progress-bar {
                        position: absolute;
                        left: 0;
                        bottom: 4px;
                        padding: 25px 60px 25px 35px;
                        width: 100%;
                        height: 130px;
                        display: flex;
                        justify-content: space-around;
                        .overflow-layout {
                            min-width: 70px;
                            max-width: 100px;
                            height: 80px;
                            text-align: center;
                            .progress-item {
                                position: relative;
                                width: 50px;
                                height: 50px;
                                border: 1px solid @black_4;
                                -webkit-border-radius: 50%;
                                -moz-border-radius: 50%;
                                border-radius: 50%;
                                text-align: center;
                                margin: 0 auto;
                                > i {
                                    font-size: 30px;
                                    line-height: 48px;
                                    color: @base;
                                }
                                &.start-task-icon {
                                    background: url("../../assets/images/welcome/step1-1-icon.png") no-repeat center / 58%;
                                }
                                &.make-task-icon {
                                    background: url("../../assets/images/welcome/step1-2-icon.png") no-repeat center / 56%;
                                }
                                &.upload-audit-icon {
                                    background: url("../../assets/images/welcome/step1-3-icon.png") no-repeat center / 56%;
                                }
                                &.audit-passed-icon {
                                    background: url("../../assets/images/welcome/step1-4-icon.png") no-repeat center / 56%;
                                }
                                &.task-over-icon {
                                    background: url("../../assets/images/welcome/step1-5-icon.png") no-repeat center / 56%;
                                }
                                &.project-bid-icon {
                                    background: url("../../assets/images/welcome/step2-1-icon.png") no-repeat center / 56%;
                                }
                                &.signed-contract-icon {
                                    background: url("../../assets/images/welcome/step2-2-icon.png") no-repeat center / 56%;
                                }
                                &.project-manage-icon {
                                    background: url("../../assets/images/welcome/step2-3-icon.png") no-repeat center / 56%;
                                }
                            }
                            p {
                                font-size: 15px;
                                color: #666;
                                margin: 10px 0 0;
                            }
                        }
                        .right-arrow-item {
                            position: relative;
                            float: left;
                            display: block;
                            width: 20px;
                            height: 15px;
                            margin: 17.5px 0;
                            > label {
                                float: left;
                                display: block;
                                width: 12px;
                                height: 7px;
                                margin: 4px 0;
                                background: #ddd;
                            }
                            > i {
                                display: block;
                                position: absolute;
                                top: 0;
                                right: 0;
                                width: 0;
                                height: 0;
                                border-width: 7.5px 0 7.5px 10px;
                                border-style: solid;
                                border-color: transparent transparent transparent #ddd;
                            }
                        }
                    }
                }
                .right-bg {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 292px;
                    height: 380px;
                    padding: 58px 40px 0 60px;
                    background: url("../../assets/images/welcome/guide-popup-right-bg.png") no-repeat right top;
                    .new-user-guide-title {
                        padding: 0 0 0 35px;
                        background: url("../../assets/images/welcome/new-user-guide-title-icon.png") no-repeat left center;
                        font-size: 18px;
                        font-style: italic;
                        color: #1569df;
                    }
                    .guide-list {
                        margin: 20px 0 0;
                        transform: skewX(-6deg);
                        height: 250px;
                        overflow-y: auto;
                        > li {
                            position: relative;
                            width: 100%;
                            height: 35px;
                            line-height: 35px;
                            font-size: 15px;
                            color: #666;
                            padding: 0 30px 0 0;
                            -webkit-transition: all 0.3s;
                            -moz-transition: all 0.3s;
                            -ms-transition: all 0.3s;
                            -o-transition: all 0.3s;
                            transition: all 0.3s;
                            overflow: hidden;
                            -ms-text-overflow: ellipsis;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                           i {
                               position: absolute;
                               top: 8px;
                               right: 10px;
                               font-size: 20px;
                               color: #999;
                               -webkit-transition: all 0.3s;
                               -moz-transition: all 0.3s;
                               -ms-transition: all 0.3s;
                               -o-transition: all 0.3s;
                               transition: all 0.3s;
                           }
                            &:hover {
                                color: @base;
                                cursor: pointer;
                                i {
                                    color: @base;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
