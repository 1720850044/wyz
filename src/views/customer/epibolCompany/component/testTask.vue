<template>
    <div style="height: 90%">
        <template v-if="loading">
            <div style="height: 720px">
                <loading></loading>
            </div>
        </template>
        <template v-else-if="!loading && (testTaskData && testTaskData.length > 0)">
            <div class="bidListShit">
                <div class="tableHeade">
                    <span>测试任务</span>
                    <span>测试费用(元)</span>
                    <span>项目预计总额(元)</span>
                    <span class="shit4">报名服务商</span>
                    <span>报名/报价截止</span>
                    <span>交稿截止</span>
                    <span>状态</span>
                    <span>操作</span>
                </div>
                <dl>
                    <dd v-for="(item,index) in testTaskData" :key="item.id">
                        <span>
                            <em>
                                {{item.test_name}}
                            </em>
                        </span>
                        <span>
                            <em v-if="item.test_price">￥{{item.test_price}}</em>
                            <em v-else>服务商报价</em>
                        </span>
                        <span>
                            ￥{{item.project_max_price}}
                        </span>
                        <span class="shit4">
                            {{item.join_num}} 家
                        </span>
                        <span>
                            {{item.bid_end_time}}
                        </span>
                        <span>
                            {{item.end_time}}
                        </span>
                        <span>
                            {{item.status_text}}
                        </span>
                        <span>
                            <i data-step="3" data-disable-interaction="3" data-last="6" :data-intro="guideSteps.step3"
                               @click="details(item)" class="ivu-icon ivu-icon-clipboard"></i>&nbsp;
                            <i v-if="item.shengyuDay > 0"
                               @click="deleteObj.deleteTaskModel = true;deleteObj.deleteID = item.id;"
                               class="iconfonts icon-shanchu"></i>
                            <i v-if="item.status==0" class="goPay" @click="goPayFun(item)" :id="'payBtn' + index">支付</i>
                        </span>
                    </dd>
                </dl>
            </div>
        </template>
        <template v-else-if="!loading && testTaskData.length == 0">
            <div style="min-height: 720px;position: relative">
                <nothink type="project" text="暂无任务"></nothink>
            </div>
        </template>
        <!-- Modal组件 -->
        <!-- 新增测试任务优化0.9.1 -->
        <Modal class="addTestingTasksModal" v-model="applModal" id="jwc" title="增加测试任务" width="800px"
               :styles="{top: '50px'}" :footer-hide="true" :mask-closable="false">
            <add-test-task ref="addTestTask" style="padding-bottom:45px;" @publishTestTask='publishTestTask'></add-test-task>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="deleteObj.deleteTaskModel" title="删除测试任务" width="350px" @on-ok="deleteTask">
            <p style="font-size: 15px">您确定要删除该任务吗？</p>
        </Modal>
        <Page v-if="page.total > page.page_size"
              class-name="pageSty"
              :current=page.creentPage
              :total="page.total"
              :show-total=false
              :page-size="page.page_size"
              @on-change="onChangePage"
        >
        </Page>
    </div>
</template>
<script>
    import taskDeatails from "./taskDetails.vue";
    import addEpibolCom from "./addEpibolCom.vue";
    import addTestTask from "./addTestTask.vue";
    import api from "api";

    const moment = require("moment");
    export default {
        props: ["stateData", "searchData"],
        data() {
            return {
                loading: true,
                applModal: false,
                addDate: {
                    postData: {},
                    animalStatus: null
                },
                animalStatus: null,
                testTitle: "",
                deleteObj: {
                    deleteTaskModel: false,
                    deleteID: null
                },
                testTaskData: [],
                page: {
                    total: 0,
                    creentPage: 1,
                    page_size: 20
                },
                //引导数据
                guideSteps: {
                    step1: "",
                    step2: "",
                    step3: ""
                },
                needGuideData: null,
                payBtnId: null,
            };
        },
        components: {
            addEpibol: addEpibolCom,
            taskDeatails: taskDeatails,
            addTestTask
        },
        mounted() {
            this.initGuide();

            this.$bus.on("emitAddData", (data, status) => {
                this.addDate.postData = data;
                this.addDate.animalStatus = status;
            });
        },
        methods: {
            //   新增测试任务（优化后的）
            publishTestTask(childData, offerRadioStatus, is_publicNum) {
                // console.log(110,"发布测试任务",childData,is_publicNum);
                let _this = this;
                if (localStorage.acc_token) {
                    childData.acc_token = JSON.parse(localStorage.acc_token);
                }
                if (childData.invite && childData.invite.length > 0) {
                    childData.invite = childData.invite.join(",");
                }
                if (childData.file && childData.file.length > 0) {
                    childData.file = JSON.stringify(childData.file);
                }
                if (offerRadioStatus == 2) {
                    if (!childData.test_price) {
                        _this.$Message.error("请填写测试费用");
                    } else if (isNaN(childData.test_price)) {
                        _this.$Message.error("金额必须为数字");
                    } else if (childData.test_price <= 0) {
                        _this.$Message.error("请输入>0的测试费用");
                    } else {
                        check();
                    }
                } else if (offerRadioStatus == 1){
                    check();
                }
                function check() {
                    if (!childData.test_name) {
                        _this.$Message.error("请填写任务名称");
                    } else if (!childData.expect_price) {
                        _this.$Message.error("请填写项目预计金额");
                    } else if (isNaN(childData.expect_price)) {
                        _this.$Message.error("项目预计金额必须为数字");
                        childData.expect_price = null;
                    } else if (childData.expect_price <= 0) {
                        _this.$Message.error("请输入>0的项目预计金额");
                        childData.expect_price = null;
                    } else if (!childData.bid_end_time) {
                        _this.$Message.error("请选择报名截止日期");
                    } else if (childData.bid_end_time) {
                        let dateBegin = new Date(
                            childData.bid_end_time.replace(/-/g, "/")
                        );
                        let dateEnd = new Date();
                        let dataDiff = dateEnd.getTime() - dateBegin.getTime();
                        let dayDiff = Math.floor(dataDiff / (24 * 3600 * 1000)); //计算出相差天数
                        if (dayDiff == 0) {
                            _this.$Message.error("报名截止日期最低选择明天");
                            childData.bid_end_time = null;
                        } else {
                            if (!childData.submit_time) {
                                _this.$Message.error("请选择投稿截止日期");
                            } else if ( parseInt(new Date(childData.submit_time).getTime()) <= parseInt(new Date(childData.bid_end_time).getTime())
                            ) {_this.$Message.error("交稿时间不能小于报名时间");
                                childData.submit_time = null;
                            } else if (!childData.task_type) {
                                _this.$Message.error("请选择项目类型");
                            } else if ( !childData.project_start_time || !childData.project_end_time ) {
                                _this.$Message.error("请选择项目预计周期");
                            } else if (!childData.spec) {
                                _this.$Message.error("请填写稿件规格");
                            } else if (!childData.format) {
                                _this.$Message.error("请填写稿件格式");
                            } else if (!childData.description) {
                                _this.$Message.error("请填写测试任务补充说明");
                            } else if (!childData.num) {
                                _this.$Message.error("请输入稿件数量");
                            } else if (isNaN(childData.num)) {
                                _this.$Message.error("输入的稿件数量必须为数字");
                            } else if (childData.num <= 0) {
                                _this.$Message.error("请输入>0的稿件数量");
                            } else {
                                let httpData = {
                                    acc_token: childData.acc_token,
                                    name: childData.test_name,
                                    ability: childData.task_type,
                                    test_price: childData.test_price,
                                    expect_price: childData.expect_price,
                                    project_start_time: childData.project_start_time,
                                    project_end_time: childData.project_end_time,
                                    bid_end_time: childData.bid_end_time,
                                    description: childData.description,
                                    file: childData.file,
                                    spec: childData.spec,
                                    format: childData.format,
                                    resource_num: childData.num,
                                    test_end_time: childData.submit_time,
                                    is_public: is_publicNum,
                                    invite: childData.invite
                                };
                                _this.submitData(httpData);
                            }
                        }
                    }
                }
            },
            // 提交测试任务数据
            submitData(httpData) {
                api.addTestTask(httpData).then(({data}) =>{
                    if (data.err_code == 0) {
                        this.$Message.success(data.err_message);
                        this.applModal = false;
                        this.$refs.addTestTask.clearData();
                        this.testTaskGet();
                    } else {
                        this.applModal = true;
                    }
                });
            },
            async initGuide() {
                let _this = this;

                let url = this.GLOBAL.baseRouter + this.$interface.guidePaths.guideTestIndex;
                this.$PublicFuns.guideInitInterface(url).then(result => {
                    localStorage.setItem("acc_token", JSON.stringify(result.acc_token));
                    if (JSON.stringify(result.guideSteps) !== "{}" && result.guideKey == "tenderTask") {
                        _this.needGuideData = true;
                        _this.guideSteps = result.guideSteps;
                        _this.$emit("guideSteps", result.guideSteps);
                        _this.testTaskGet().then(response => {
                            _this.$guide().exit();
                            setTimeout(() => {
                                _this
                                    .$guide()
                                    .setOptions(_this.$CONSTANT.guideOptions)
                                    .onchange(function (el) {
                                        let step = el.getAttribute("data-step");
                                        if (step == 2) {
                                            _this.applModal = true;
                                            _this.$nextTick(() => {
                                                _this.$guide().exit();
                                            });
                                        }
                                    })
                                    .onafterchange(function (el) {
                                        let step = el.getAttribute("data-step");
                                        if (step == 2) {
                                            setTimeout(() => {
                                                _this
                                                    .$guide()
                                                    .setOptions(
                                                        Object.assign({}, _this.$CONSTANT.guideOptions, {
                                                            overlayOpacity: 0
                                                        }),
                                                        _this.$CONSTANT.guideOptions
                                                    )
                                                    .goToStepNumber(2)
                                                    .start()
                                                    .onskip(function () {
                                                        _this.applModal = false;
                                                        _this.needGuideData = "";
                                                        _this.testTaskGet();
                                                    })
                                                    .onchange(function (el) {
                                                        let step = el.getAttribute("data-step");
                                                        if (step == 3) {
                                                            _this.applModal = false;
                                                            _this.$nextTick(() => {
                                                                _this.$guide().exit();
                                                            });
                                                        }
                                                    })
                                                    .onafterchange(function (el) {
                                                        let step = el.getAttribute("data-step");
                                                        if (step == 3) {
                                                            setTimeout(() => {
                                                                _this
                                                                    .$guide()
                                                                    .setOptions(_this.$CONSTANT.guideOptions)
                                                                    .goToStepNumber(3)
                                                                    .start()
                                                                    .onskip(function () {
                                                                        _this.needGuideData = "";
                                                                        _this.testTaskGet();
                                                                    })
                                                                    .oncomplete(function () {
                                                                        _this.$guide().exit();
                                                                        _this.$PublicFuns
                                                                            .completePageGuide(result.guideKey)
                                                                            .then(res => {
                                                                                _this.$router.push({
                                                                                    path: "/customer/testTaksDetails",
                                                                                    query: {
                                                                                        id: response[0].id,
                                                                                        navTitle: "测试任务"
                                                                                    }
                                                                                });
                                                                            });
                                                                    });
                                                            }, 200);
                                                        }
                                                    });
                                                $("#jwc .ivu-modal-wrap").removeClass(
                                                    "introjs-fixParent"
                                                );
                                                $(".introjs-helperLayer").css(
                                                    "background-color",
                                                    "rgba(255, 255, 255, 0)"
                                                );
                                            }, 200);
                                        }
                                    }, 200)
                                    .start()
                                    .onskip(function () {
                                        _this.needGuideData = "";
                                        _this.testTaskGet();
                                    });
                            });
                        });
                    } else if (
                        JSON.stringify(result.guideSteps) !== "{}" &&
                        result.guideKey == "tenderKey"
                    ) {
                        _this.needGuideData = true;
                        _this.testTaskGet().then(() => {
                            this.bubbleGuide();
                        });
                    } else {
                        _this.testTaskGet();
                    }
                });
            },
            // 气泡引导
            bubbleGuide() {
                let index = this.getMatchedStatus();
                if (index >= 0) {
                    let guideOptions = [
                        {
                            id: "payBtn" + index,
                            position: "left-top",
                            title: "支付",
                            content: "您已选择了中标服务商，快去完成支付吧！",
                            relative: "body"
                        }
                    ];
                    this.$bubble(guideOptions, step => {
                        this.needGuideData = null;
                        this.testTaskGet();
                    });
                }
            },
            getMatchedStatus() {
                for (let index in this.testTaskData) {
                    if (this.testTaskData[index].status == 0) {
                        this.payBtnId = index;
                        return this.payBtnId;
                    }
                }
            },
            onChangePage(val) {
                this.page.creentPage = val;
                this.testTaskGet();
            },
            //  测试任务数据
            testTaskGet() {
                return new Promise(async (resolve, reject) => {
                    let params = {
                        create_demand: 1,
                        status: this.stateData,
                        search: this.searchData,
                        page: this.page.creentPage,
                        page_size: this.page.page_size,
                        needGuideData: this.needGuideData ? true : null
                    };
                    let {data} = await api.getTestList(params);
                    if (data.err_code == 0) {
                        this.loading = false;
                        let htttpData = data.data;
                        this.page.total = parseInt(data.page.count);
                        let nowTime = new Date();
                        for (let i = 0; i < htttpData.length; i++) {
                            let endStr = new Date(htttpData[i].bid_end_time).getTime();
                            let dateDiff = endStr - nowTime.getTime();
                            htttpData[i].shengyuDay = Math.round(
                                dateDiff / (24 * 3600 * 1000)
                            );
                        }
                        this.testTaskData = htttpData;
                        resolve(htttpData);
                    } else {
                        this.loading = false;
                        this.$Message.error(data.err_message);
                        reject();
                    }
                });
            },
            newAdd() {
                let _this = this;
                _this.applModal = true;
                _this.$refs.addTestTask.clearData();
            },
            //招标详情
            details(item) {
                this.$router.push({
                    path: "/customer/testTaksDetails",
                    query: {id: item.id, navTitle: "测试任务"}
                });
            },
            //删除
            deleteTask() {
                let ID = this.deleteObj.deleteID;
                api.deleteTest({id: ID})
                .then(({data}) =>{
                    if (data.err_code == 0) {
                        this.$Message.success(data.err_message);
                        this.testTaskGet();
                    } else {
                        this.$Message.error("删除失败");
                    }
                });
            },

            //支付
            async goPayFun(item) {
                const pay = await api.paytoyi({id: item.id});
                if (pay.data.err_code == 0) {
                    this.$Message.success(pay.data.err_message);
                    this.testTaskGet();
                } else {
                    this.$Message.error("支付失败");
                }
            }
        },
        beforeDestroy() {
            this.$bus.off("todoSth");
        }
    };
</script>
<style lang="less" scoped>
    @import "../style/tableStyle.less";

    .addTestingTasksModal {
        /* 设置滚动条的样式 */
        ::-webkit-scrollbar {
            width: 4px;
        }
        /* 滚动槽 */
        ::-webkit-scrollbar-track {
            /*-webkit-box-shadow:inset006pxrgba(0,0,0,0.3);*/
            /*border-radius:10px;*/
        }
        /* 滚动条滑块 */
        ::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: #ccc;
            -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
        }
        ::-webkit-scrollbar-thumb:window-inactive {
            background: #ccc;
        }
        .addBtn:hover {
            background: #35ab93 !important;
        }
    }

    .ivu-page-item-jump-next:after,
    .ivu-page-item-jump-prev:after {
        display: inline-block;
    }

    .pageSty {
        margin-top: 10px;
        text-align: center;
        margin-bottom: 30px;
    }
</style>
