<template>
    <div class="details">
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span>
            </div>
        </main-native>
        <div class="second-navigation-bar">
            <a @click="backTest()">{{this.$route.query.navTitle || '测试任务'}}</a>
            <Icon class="icon" type="ios-arrow-right"></Icon>
            <a class="second-nav-title">详情</a>
        </div>
        <div style="display: flex;justify-content: space-between;height: 90%;overflow: hidden">
            <!-- 基本信息 -->
            <div class="taskInfo" data-start="4" data-step="1" data-last="6" data-disable-interaction="4"
                 :data-intro="guideSteps.step4">
                <dl>
                    <dt>基本信息</dt>
                    <dd>
                        <span>任务名称</span><em>{{itemData.test_name || '--'}}</em>
                    </dd>
                    <dd v-if="itemData.test_price">
                        <span>测试费用</span><em>￥{{itemData.test_price || '0.00'}}</em>
                    </dd>
                    <dd>
                        <span>项目预计总额</span><em>￥{{itemData.project_max_price || '0.00'}}</em>
                    </dd>
                    <dd>
                        <span>报名截止时间</span><em>{{itemData.bid_end_time | timeCover}}</em>
                    </dd>
                    <dd>
                        <span>交稿截止时间</span><em>{{itemData.end_time | timeCover}}</em>
                    </dd>
                    <dd>
                        <span>任务类型</span><em class="taskTyle">{{itemData.task_type || '--'}}</em>
                    </dd>

                    <dd v-if="itemData.description" style="flex-direction: column;align-items: flex-start;">
                        <span>稿件要求补充说明</span>
                        <p class="leilYq">{{itemData.description}}</p>
                    </dd>
                    <dd v-else>
                        <span>文件要求</span><i class="noFiled">暂无</i>
                    </dd>
                    <!--稿件格式 稿件规格-->
                    <dd v-if="itemData.file_require">
                        <span>稿件格式</span><em>{{itemData.file_require.format}}</em>
                    </dd>
                    <dd v-else>
                        <span>稿件格式</span><i class="noFiled">暂无</i>
                    </dd>
                    <!--                    -->
                    <dd v-if="itemData.file_require">
                        <span>稿件规格</span><em>{{itemData.file_require.spec}}</em>
                    </dd>
                    <dd v-else>
                        <span>稿件规格</span><i class="noFiled">暂无</i>
                    </dd>
                    <!--<dt>参考附件</dt>-->
                    <dd v-if="itemData.file && itemData.file.length > 0"
                        style="flex-direction: column;align-items: flex-start;">
                        <span>参考附件</span>
                        <ul>
                            <li v-for="(item,index) in itemData.file">
                                <a v-if="item.response"
                                   :href="JSON.parse(item.response).file_url+'?response-content-type=application%2Foctet-stream'"
                                   download>{{item.name | substring}} <i class="icon iconfonts icon-xiazai"></i></a>
                                <a v-else :href="item.file_url+'?response-content-type=application%2Foctet-stream'"
                                   download>{{item.name | substring}} <i class="icon iconfonts icon-xiazai"></i></a>
                            </li>
                        </ul>
                    </dd>

                    <dd v-else>
                        <span>参考附件</span><i class="noFiled">暂无</i>
                    </dd>
                    <!--<dt>其他说明</dt>-->
                    <!--<dd>-->
                    <!--<span>其他说明 : </span><em>{{itemData.description || '暂无'}}</em>-->
                    <!--</dd>-->
                </dl>
            </div>
            <div class="ListDiv">
                <div class="ListTitle">
                    <span>报名服务商({{joinList?joinList.length: 0}})</span>
                    <!--小于0表示已过期  大于等于0 表示未过期-->
                    <!--报名时间剩余 ：{{itemData.bid_end_days}} 天-->
                    <!--截稿时间剩余 ：{{itemData.end_days}} 天-->
                    <!--金额 ：{{itemData.test_price || '服务商报价'}}-->
                    <div>
                        <!--投稿时间已截止且是我方报价任务-->
                        <button v-if="itemData.end_days < 0 && itemData.test_price && itemData.status == 1"
                                class="notAll" @click="notAll">都不满意?
                        </button>
                        <!--服务商报价-->
                        <!--投稿时间已截止 且是 报价测试任务 且 该任务状态待选标-->
                        <button v-if="itemData.end_days < 0 && !itemData.test_price && itemData.status == 1"
                                class="notAll" @click="notAll">都不满意?
                        </button>
                        <!--报名时间已截止 且是 报价测试任务 且 该任务待选择报价-->
                        <button v-if="itemData.bid_end_days < 0 && !itemData.test_price && itemData.status == 4"
                                class="qrbjBtn" @click="lookModa2 = true" :class="{'noNum':social.length<=0}"
                                :disabled="social.length<=0">确认报价
                        </button>
                    </div>
                </div>
                <!-- 服务商列表 -->
                <div class="ykjList" v-show="itemData.test_price">
                    <!-- 列表信息 -->
                    <div class="tableHead">
                        <span>服务商</span>
                        <span>报名时间</span>
                        <span>稿件</span>
                        <span>上传时间</span>
                        <span>招标结果</span>
                        <span>操作</span>
                    </div>
                    <div class="bidList" v-show="joinList && joinList.length > 0">
                        <ul data-start="5" data-step="2" data-last="6" data-disable-interaction="5"
                            :data-intro="guideSteps.step5" data-position="bottom-right-aligned">
                            <li v-for="item in joinList">
                                <span>{{item.company}}</span>
                                <span>{{item.apply_time  | timeCover}}</span>
                                <span v-if="item.file" class="Winningbid">已上传</span>
                                <span v-else class="outbidding">未上传</span>
                                <span v-if="item.file">{{item.file.upload_time | timeCover}}</span>
                                <span v-else>---</span>
                                <span
                                    :class="{'outbidding':item.status == 2,'Winningbid':item.status== 1 || item.status == 4}">{{item.status_text}}</span>
                                <span v-if="item.file"><i @click.stop="lookOver(item,itemData.end_days)"
                                                          class="ivu-icon ivu-icon-clipboard"></i></span>
                                <span v-else>---</span>
                            </li>
                        </ul>
                    </div>
                    <template v-if="!joinList || joinList.length <= 0">
                        <div style="min-height: 500px;position: relative">
                            <nothink type="project" text="暂无报名"></nothink>
                        </div>
                    </template>
                </div>
                <!-- 报价商列表 -->
                <div class="baojiaList" v-if="!itemData.test_price && itemData.status == 4">
                    <div class="tableHead">
                        <span>服务商</span>
                        <span>测试报价</span>
                        <span>报价时间</span>
                    </div>
                    <template v-if="joinList && joinList.length > 0">
                        <CheckboxGroup v-model="social">
                            <ul class="baojiaUl">
                                <li v-for="item in joinList">
                                    <span v-if="itemData.bid_end_days < 0 && itemData.status == 4"><Checkbox
                                        :label="item.id">{{item.company}}</Checkbox></span>
                                    <span v-else>{{item.company}}</span>
                                    <span>￥{{item.bid_price}}</span>
                                    <span>{{item.apply_time | timeCover}}</span>
                                </li>
                            </ul>
                        </CheckboxGroup>
                    </template>
                    <template v-else>
                        <div style="min-height: 500px;position: relative">
                            <nothink type="project" text="暂无报名"></nothink>
                        </div>
                    </template>
                </div>
                <!-- 已选择报价 -->
                <div class="haveChosenList" v-if="!itemData.test_price && itemData.status != 4">
                    <div class="tableHead">
                        <span>服务商</span>
                        <span>报价</span>
                        <span>报价时间</span>
                        <span>稿件</span>
                        <span>上传时间</span>
                        <span>招标结果</span>
                        <span>操作</span>
                    </div>
                    <ul>
                        <li v-for="item in joinList">
                            <span>{{item.company}}</span>
                            <span>￥{{item.bid_price}}</span>
                            <span>{{item.apply_time | timeCover}}</span>
                            <span v-if="item.file" class="Winningbid">已上传</span>
                            <span v-else class="outbidding">未上传</span>
                            <span v-if="item.file">{{item.file.upload_time | timeCover}}</span>
                            <span v-else>---</span>
                            <span :class="{'outbidding':item.status == 2,'Winningbid':item.status== 1 || item.status== 4}">{{item.status_text}}</span>
                            <span v-if="item.file"><i @click.stop="lookOver(item,itemData.end_days)" class="ivu-icon ivu-icon-clipboard"></i></span>
                            <span v-else>---</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- Modal组件 -->
        <div class="ykjPop">
            <Modal id="look" v-model="lookModal" :transfer="false" width="900px" :mask-closable="false">
                <look-over :lookDate="lookDate" :guideSteps="guideSteps" :needGuideData="needGuideData"
                           @chanageStatu="chanageStatu"></look-over>
                <div slot="header"><span style="font-size:16px;color:#fff;font-weight:lighter;">查看详情</span></div>
                <div slot="footer"></div>
            </Modal>
        </div>
        <div class="baojiPop">
            <Modal
                v-model="lookModa2"
                :transfer="false"
                width="400px"
                @on-ok="oKcomfirmFun">
                <div slot="header" style="padding:5px 0px;"><span style="font-size:16px;color:#fff;">确认 {{social.length}} 家服务商报价</span>
                </div>
                <div class="contentText"><br/>确认后服务商将开始制作测试稿件!<br/><br/></div>
            </Modal>
        </div>
    </div>
</template>
<script>
    import lookOver from './lookOver';
    import mainNative from '../../../main-components/mainNative.vue';
    import upLoad from '../../../project/components/onLoad';
    import api from 'api';

    export default {
        data() {
            return {
                social: [],
                lookModal: false,
                lookModa2: false,
                lookDate: Object,
                id: null,
                Tid: null,
                joinList: [],
                itemData: {},
                isFile: false,
                //引导数据
                guideSteps: {
                    step4: '',
                    step5: '',
                    step6: ''
                },
                needGuideData: null
            };
        },
        mounted() {
            this.id = this.$route.query.id;
            this.initGuide();

        },
        components: {
            mainNative: mainNative,
            upLoad: upLoad,
            lookOver: lookOver
        },
        methods: {
            // 初始化获取是否引导
            async initGuide() {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_test_infoindex;
                this.$PublicFuns.guideInitInterface(url).then(result => {
                    if (JSON.stringify(result.guideSteps) !== "{}") {
                        _this.needGuideData = true;
                        _this.guideSteps = result.guideSteps;
                        _this.taskDetaGet().then((response) => {
                            _this.$guide().exit();
                            setTimeout(() => {
                                _this.$guide().setOptions(this.$CONSTANT.guideOptions).onchange(function (el) {
                                    let step = el.getAttribute('data-step');
                                    if (step == 3) {
                                        _this.lookOver(response, -1);
                                        _this.$nextTick(() => {
                                            _this.$guide().exit();
                                        });
                                    }
                                }).onafterchange(function (el) {
                                    let step = el.getAttribute('data-step');
                                    if (step == 3) {
                                        setTimeout(() => {
                                            _this.$guide().setOptions(Object.assign({}, _this.$CONSTANT.guideOptions, {overlayOpacity: 0}), _this.$CONSTANT.guideOptions).goToStepNumber(3).start()
                                                .onskip(function () {
                                                    this.lookModal = false;
                                                    _this.$router.push({path: "/customer/epibolCompany"});
                                                })
                                                .oncomplete(function () {
                                                    _this.lookModal = false;
                                                    _this.$guide().exit();
                                                    _this.$router.push({path: "/customer/epibolCompany"});
                                                });
                                            $('#look .ivu-modal-wrap').removeClass('introjs-fixParent');
                                            $('.introjs-helperLayer').css('background-color', 'rgba(255, 255, 255, 0)');
                                        }, 200);
                                    }
                                }).start().onskip(function () {
                                    _this.$router.push({path: "/customer/epibolCompany"});
                                });
                            }, 200);
                        });
                    } else {
                        _this.taskDetaGet();
                    }
                });
            },
            // 获取详情数据
            async taskDetaGet() {
                return new Promise((resolve, reject) => {
                    api.getTaskDetail({
                        id: this.id,
                        needGuideData: this.needGuideData ? true : null
                    }).then(taskDetail => {
                        if (taskDetail.data.err_code == 0) {
                            let data = taskDetail.data;
                            if (data.file) {
                                data.file = JSON.parse(data.file);
                            }
                            let bidArr = data.bid;
                            bidArr.forEach((creent) => {
                                switch (creent.status) {
                                    case '1':
                                    case '8':
                                    case '9':
                                        creent.status_text = '中标';
                                        break;
                                    case '2':
                                        creent.status_text = '落标';
                                        break;
                                    case '7':
                                        creent.status_text = '报价未通过';
                                        break;
                                    case '4':
                                        creent.status_text = '--';
                                        break;
                                    default:
                                        creent.status_text = '--';
                                        break;
                                }
                            });
                            this.itemData = data;
                            this.itemData.file_require = JSON.parse(this.itemData.file_require);
                            this.joinList = data.bid;
                            this.Tid = data.id;
                            resolve(data);
                        } else {
                            this.$Message.error(taskDetail.data.err_message);
                            reject();
                        }
                    });
                });
            },
            chanageStatu() {
                this.lookModal = false;
                this.taskDetaGet();
            },
            backTest() {
                this.$router.go(-1);
            },
            //  全都不满意
            notAll() {
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_all_out;
                this.$axios.post(url, {test_id: this.Tid}).then(() => {
                    this.$Message.success("提交成功!");
                    this.taskDetaGet();
                }, () => {
                    this.$Message.error("提交失败!");
                });
            },
            //清空列表
            clearList() {
                this.lookModal = false;
            },
            // 查看
            lookOver(item, end_days) {
                item.end_days = end_days;
                this.lookDate = item;
                this.lookModal = true;
            },
            //甲方选择确认报价
            oKcomfirmFun() {
                let _this = this;
                (async function () {
                    let obj = {
                        id: _this.id,
                        bid_id: JSON.stringify(_this.social)
                    };
                    const choiceData = await api.choiceBidPrice(obj);
                    if (choiceData.data.err_code == 0) {
                        //更新页面数据
                        _this.$Message.success(choiceData.data.err_message);
                        _this.taskDetaGet(_this.id);
                    } else {
                        _this.$Message.error('请求失败！');
                    }
                })();
            },
        },
        filters: {
            substring: function (val) {
                return val.length > 30 ? '...' + val.substring(val.length, 15) : val;
            },
            timeCover: function (val) {
                if (val) {
                    let day = new Date(val * 1000);
                    let year = day.getFullYear();
                    let month = (day.getMonth() + 1) < 10 ? '0' + (day.getMonth() + 1) : day.getMonth() + 1;
                    let date = day.getDate() < 10 ? '0' + day.getDate() : day.getDate();
                    return year + '-' + month + '-' + date;
                } else {
                    return '00:00:00';
                }

            }
        }
    };
</script>
<style type="text/css" lang="less">
    .second-navigation-bar {
        margin-bottom: 20px;
        overflow: hidden;

        > a {
            float: left;
            font-size: 13px;
            color: #777777;
            padding: 0 2px;
            border-bottom: 2px solid @baseboard;

            &.second-nav-title {
                border-bottom: 2px solid #3bceb6;
                font-size: 14px;
                margin-top: -1px;
            }

            &:hover {
                border-bottom: 2px solid #3bceb6;
                -webkit-transition: border-bottom-color 0.2s;
                -moz-transition: border-bottom-color 0.2s;
                -ms-transition: border-bottom-color 0.2s;
                -o-transition: border-bottom-color 0.2s;
                transition: border-bottom-color 0.2s;
            }
        }

        > .icon {
            float: left;
            margin: 0 5px;
            font-size: 18px;
            color: @black_2;
        }

    }

    .taskInfo {
        background: @white;
        border-radius: @r4;
        width: 23%;
        min-width: 335px;
        padding: 16px 20px 16px 20px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);

        h1 {
            font-size: @fs16;
            font-weight: 400;
            margin-bottom: @p10;
        }

        em {
            font-style: normal;

            img {
                max-height: 85px;
                border-radius: @r4;
            }

            a {
                color: @black_2;
            }
        }

        dt {
            font-size: 14px;
            padding: @p15 0px;
        }

        dd {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0px;
            color: #9e9e9e;

            span {
                font-size: 13px;
                color: #bdbdbd
            }

            em {
                font-size: 15px;
                color: @base;

                &.taskTyle {
                    border: 1px solid @base;
                    color: @base;
                    font-size: 12px;
                    padding: 0 15px;
                    border-radius: 4px;
                }
            }

            i {
                font-style: normal;
                font-size: 13px;
            }

            .leilYq {
                height: 100px;
                width: 100%;
                border: 1px solid #ccc;
                margin-top: 10px;
                border-radius: 4px;
                padding: 0 5px;
                overflow: auto;
            }

            ul {
                margin-top: 15px;
                max-height: 110px;
                overflow: auto;

                ::-webkit-scrollbar {
                    width: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background: #ccc;
                    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
                }

                ::-webkit-scrollbar-thumb:window-inactive {
                    background: #ccc;
                }

                li {
                    margin-bottom: 7px;

                    a {
                        display: inline-block;
                        vertical-align: middle;
                        color: #7d7d7d;

                        &:hover {
                            color: @base !important;
                        }
                    }

                    i {
                        color: @base;
                        margin-left: 25px;
                        font-size: 14px;
                    }
                }
            }

        }
    }

    .details {
        height: 100%;

        .ykjPop {
            .ivu-modal-footer {
                display: none !important;
            }
        }

        .baojiPop {
            .contentText {
                font-size: 15px;
            }

            .ivu-modal-footer {
                display: block !important;
            }
        }

        .ListDiv {
            width: 75%;
            min-width: 660px;
            background: #fff;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
            border-radius: 4px;

            .ListTitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;

                span {
                    font-size: 14px
                }

                button {
                    padding: 5px 10px;
                    border-radius: 3px;
                    background: #fff;
                    cursor: pointer;
                    color: #fff;
                    border: 0;

                    &.notAll {
                        background: #ff4653;
                    }

                    &.qrbjBtn {
                        background: #3bceb6;
                    }

                    &.noNum {
                        background: #cfcfcf;
                    }
                }
            }

            .ykjList {
                min-height: 92%;
                position: relative;
            }
        }

        .tableHead {
            color: #bdbdbd;
            height: 46px;
            line-height: 46px;
            font-weight: lighter;
            background-color: #fdfdfd;
            border-top: 1px solid #e8e8e8;
            border-bottom: 1px solid #e1e1e1;
            margin-bottom: 0;
            font-size: 14px;
            display: flex;
            justify-content: space-between;

            span {
                flex: 1;
                text-align: center;

                &:first-child {
                    text-align: left;
                    padding-left: 20px;
                    flex: 2;
                }

                &:last-child {
                    text-align: right;
                    padding-right: 20px;
                }
            }
        }

        .ykjList, .baojiaList, .haveChosenList {
            ul {
                max-height: 655px;
                overflow: auto;

                li {
                    display: flex;
                    border-bottom: 1px solid #e1e1e1;
                    font-weight: lighter;
                    padding: 5px 0;
                    line-height: 35px;

                    span {
                        flex: 1;
                        font-size: 13px;
                        text-align: center;

                        &:first-child {
                            text-align: left;
                            padding-left: 20px;
                            flex: 2;
                        }

                        &:last-child {
                            text-align: right;
                            padding-right: 20px;
                        }

                        i {
                            font-style: normal;
                            font-size: 18px;

                            &:hover {
                                cursor: pointer;
                                color: @base;
                            }
                        }

                        &.outbidding {
                            color: @red;
                        }

                        &.Winningbid {
                            color: @base;
                        }
                    }
                }
            }
        }

        .baojiaList {
            .baojiaUl {
                li {
                    .ivu-checkbox-checked .ivu-checkbox-inner {
                        border-color: #3bceb6;
                        background-color: #3bceb6;
                    }
                }
            }
        }
    }

</style>
