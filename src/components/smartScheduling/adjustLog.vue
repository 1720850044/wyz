<template>
    <div class="adjust-log-modal-outer">
        <div class="adjust-log-modal">
            <span class="up-triangle-icon"></span>
            <div class="log-header">
                <h1>
                    <Icon type="ios-information-outline"></Icon>
                    {{$t('project.pro_adjustLog')}}
                    <!--<a class="close-adjust-log-btn" @click="closeLogModal()"><Icon type="android-close"></Icon></a>-->
                </h1>
            </div>
            <div class="log-body">
                <ul v-if="logParams && logParams.length > 0">
                    <li v-for="log in logParams" :key="log.id">
                        <label>{{log.date || '-'}}</label>
                        <div>
                            <b>{{log.realname || ''}}</b>{{log.action}}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "adjustLog",
        props: {
            logParams: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {

            };
        },
        methods: {
            closeLogModal () {
                this.$emit('closeLogModal');
            }
        }
    };
</script>

<style lang="less" scoped>
    .adjust-log-modal-outer {
        position: absolute;
        width: 500px;
        height: 418px;
        top: 18px;
        left: -118px;
        padding: 18px 0 0;
        margin: auto;
        z-index: 99;
    }
    .adjust-log-modal {
        position: relative;
        width: 100%;
        height: 400px;
        margin: auto;
        background: #fff;
        border: 1px solid rgba(60, 210, 180, 0.5);
        -webkit-box-shadow: 0 0 10px 2px rgba(60, 210, 180, 0.38);
        -moz-box-shadow: 0 0 10px 2px rgba(60, 210, 180, 0.38);
        box-shadow: 0 0 10px 2px rgba(60, 210, 180, 0.38);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        span.up-triangle-icon {
            position: absolute;
            top: -12px;
            left: 138px;
            border-width: 0 8px 12px 8px;
            border-style: solid;
            border-color: transparent transparent rgba(255, 255, 255, 1);
            /*z-index: 9;*/
            &:after {
                content: '';
                position: absolute;
                top: -4px;
                left: -10px;
                border-width: 0 10px 20px 10px;
                border-style: solid;
                border-color: transparent transparent rgba(60, 210, 180, 0.6);
                filter: blur(2px);
                z-index: -1;
            }
        }
        > .log-header {
            width: 100%;
            height: 50px;
            padding: 0 20px;
            /*background: url("../../assets/images/headBarBGimg.png") no-repeat center / cover;*/
            > h1 {
                font-size: 16px;
                color: #fb0;
                font-weight: normal;
                line-height: 50px;
                border-bottom: 1px solid #ededed;
                > i {
                    float: left;
                    margin: 14px 8px 0 0;
                    font-size: 22px;
                    -webkit-transform: rotate(180deg);
                    -moz-transform: rotate(180deg);
                    -ms-transform: rotate(180deg);
                    -o-transform: rotate(180deg);
                    transform: rotate(180deg);
                }
                > a.close-adjust-log-btn {
                    float: right;
                    color: #fb0;
                    > i {
                        font-size: 24px;
                        line-height: 50px;
                    }
                }
            }
        }
        > .log-body {
            width: 100%;
            height: 330px;
            padding: 20px 20px 0;
            overflow-x: hidden;
            overflow-y: auto;
            > ul {
                li {
                    width: 100%;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    margin: 0 0 8px;
                    color: #888;
                    label {
                        width: 20%;
                        margin: 0 10px 0 0;
                        line-height: 22px;
                        color: #aaa;
                    }
                    div {
                        width: 80%;
                        line-height: 22px;
                        text-align: justify;
                        > b {
                            color: @base;
                            font-weight: normal;
                            margin: 0 5px 0 0;
                        }
                    }
                }
            }
        }
    }
</style>
