<template>
    <div>
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span>
            </div>
        </main-native>
        <div class="teamWorkContainer">
            <template>
                <section class="memberTable">
                    <div class="chart" v-if="echartData&&actions.memberfreetrend">
                        <p class="title">{{$t('workbench.work_teamWorkTitle')}}</p>
                        <div class="chartInfo">
                            <div class="info">
                                <span>{{$t('workbench.work_memberCountNumber')}} ：<span class="number">{{echartData.member}}</span>人</span>
                                <span><Icon type="ios-help-outline" :title="$t('workbench.work_teamWorkIntroduceTitle')" size="16"
                                            style="margin-right: 5px;"></Icon>{{$t('workbench.work_teamWorkAverageFree')}} ：<span class="number">{{echartData.free_rate}}%</span></span>
                            </div>
                            <div class="select">

                                <Select v-model="abilityVal" style="width:200px;margin:0 10px;" clearable
                                        @on-change="changeSelec"
                                        :placeholder="$t('workbench.work_teamWorkAllPosition')">
                                    <Option v-for="(item,index) in ability" :value="item.id" :key="index">{{ item.name }}
                                    </Option>
                                </Select>
                                <Select v-model="departmentVal" style="width:200px;margin: 0 10px;" clearable
                                        @on-change="changeSelec"
                                        :placeholder="$t('workbench.work_teamWorkAllDepartment')">
                                    <Option v-for="(item,index) in department" :value="item.id" :key="index">{{
                                        item.name }}
                                    </Option>
                                </Select>
                            </div>
                        </div>
                        <template v-if="initData&&timeData&&timeData[0]&&timeData[1]">
                            <statis v-if="chartOption"

                                    :tablecontrols="false"
                                    :sliderData="{start:initData.search_begin_time,end:initData.search_end_time,areaStart:timeData[0],areaEnd:timeData[1]}"
                                    :chartOption="chartOption"
                                    :dateTypes="[$t('workbench.work_teamWorkDayTag'),$t('workbench.work_teamWorkMonthTag'),$t('workbench.work_teamWorkYaerTag')]" :currentDateType="$t('workbench.work_teamWorkMonthTag')" :isShowNull="true"
                                    @onDateTypeChange="onDateTypeChange"
                                    :chartStyle="{height: '300px',marginBottom:'20px'}"
                                    @onSliderChange="onSliderChange"
                            ></statis>
                        </template>
                    </div>
                    <div class="my-table-box">
                        <Table class="my-table" v-if="actions.memberwork" :height="tableHeight"  @on-row-click="showModal" :columns="homeTable"
                               :data="homeTableData"
                               @on-sort-change="sortData" key="home"></Table>
                    </div>
                </section>
                <ul class="taskListBox" v-if="actions.company">
                    <p class="title">{{$t('workbench.work_teamWorkCompanyWork')}}</p>
                    <li class="taskList" v-if="companyShow(item,index)" v-for="(item,index) in taskTypeArr"
                        @click="toTable(item,index)" :key="index">
                        <div class="center">
                            <p><span :class="'number'+index">{{rightInfoNumber(index)}}</span><span>个</span></p>
                            <p class="name">
                                <Icon v-if="index===2" type="ios-help-outline" :title="$t('workbench.work_teamWorkContractTips')" size="16"
                                      style="margin-right: 5px;vertical-align: bottom;"></Icon>
                                {{item.name}}
                            </p>
                            <button :class="'button'+index">{{$t('workbench.work_teamWorkDetailsTag')}}</Button>
                        </div>
                    </li>
                </ul>
            </template>

            <Modal v-model="teamWorkShow" footer-hide :title="$t('workbench.work_teamWorkCompanyWorkSurvey')" width="1200px">
                <div class="teamWorkProjectModal">
                    <span slot="header"></span>
                    <div class="head">
                        <ul class="projectTitleUl">
                            <li class="titleList" v-if="companyShow(item,index)" v-for="(item,index) in taskTypeArr "
                                @click="changeTable(item,index)"
                                :class="{'active':index === activeIndex}" :key="index">
                                {{item.name}}
                            </li>
                        </ul>
                        <div class="filter">
                            <template v-if="activeIndex === 1">
                                <Select v-model="task.member" clearable style="width:130px;margin-left: 10px;"
                                        @on-change="getTaskTable" :placeholder="$t('workbench.work_teamWorkAllProducer')">
                                    <Option v-for="item in taskMember" :value="item.id" :key="item.value"
                                            :title="`${item.realname}(${item.cnt})`">{{ item.realname }}({{item.cnt}})
                                    </Option>
                                </Select>
                                <Select v-model="task.project" clearable style="width:130px;margin-left: 10px;"
                                        @on-change="getTaskTable" :placeholder="$t('workbench.work_teamWorkAllProject')">
                                    <Option v-for="item in projectData" :value="item.id" :key="item.value"
                                            :title="`${item.name}(${item.cnt})`">{{ item.name }}({{item.cnt}})
                                    </Option>
                                </Select>
                            </template>
                            <template v-if="activeIndex === 3">
                                <Select v-model="testTask.status" clearable style="width:130px;margin-left: 10px;"
                                        @on-change="getTestTaskTable" :placeholder="$t('workbench.work_teamWorkAllStatus')">
                                    <Option v-for="item in bid_status" :value="item.value" :key="item.value">{{ item.key
                                        }}
                                    </Option>
                                </Select>
                                <Select v-model="testTask.execute" clearable style="width:130px;margin-left: 10px;"
                                        @on-change="getTestTaskTable" :placeholder="$t('workbench.work_teamWorkAllProducer')">
                                    <Option v-for="item in bid_execute_member" :value="item.execute_user"
                                            :key="item.value"
                                            :title="`${item.realname}(${item.cnt})`">{{ item.realname }}({{item.cnt}})
                                    </Option>
                                </Select>
                                <Select v-model="testTask.leader" clearable style="width:130px;margin-left: 10px;"
                                        @on-change="getTestTaskTable" :placeholder="$t('workbench.work_teamWorkAllCharge')">
                                    <Option v-for="item in bid_leader_member" :value="item.leader_user"
                                            :key="item.value"
                                            :title="`${item.realname}(${item.cnt})`">{{ item.realname }}({{item.cnt}})
                                    </Option>
                                </Select>
                            </template>
                        </div>
                        <!--<Icon class="closeIcon" @click.native="closeModal" type="android-contract"></Icon>-->
                    </div>
                    <ul class="tableList">
                        <Table v-show="activeIndex === 0" :columns="projectTable" :data="projectTableData"
                               @on-sort-change="sortProject"
                               key="modal"></Table>
                        <Table v-show="activeIndex === 1" :columns="taskTable" :data="taskTableData"
                               @on-sort-change="sortTask"
                               key="modal"></Table>
                        <Table v-show="activeIndex === 2" :columns="contractTable" :data="contractTableData"
                               key="modal"></Table>
                        <Table v-show="activeIndex === 3" :columns="testTaskTable" :data="testTaskTableData"
                               key="modal"></Table>
                    </ul>
                    <!-- 三个分页根据 activeIndex 不同activeIndex获取不同total  这里total根据接口获取 -->
                    <div
                        v-if="(activeIndex === 0?count.project: activeIndex === 1 ? count.task : activeIndex === 2 ? count.contract : activeIndex === 3 ? count.test : 0)>10"
                        style="text-align: right;padding:10px 0;">
                        <!--<Page :current="page"-->
                        <!--:total=""-->
                        <!--@on-change="changePage" simple/>-->
                        <Page :current="page"
                              :total="activeIndex === 0?count.project: activeIndex === 1 ? count.task : activeIndex === 2 ? count.contract : activeIndex === 3 ? count.test : 0"
                              @on-change="changePage" show-elevator></Page>
                    </div>
                </div>
            </Modal>

            <Modal v-model="lookUpInfo.showMoadlFlag" footer-hide :title="lookUpInfo.modalTitle+$t('workbench.work_teamWorkCompanyCount')" width="800px">
                <userworkstatistics v-if="lookUpInfo.showMoadlFlag" :creentUser="lookUpInfo.creentUserID"></userworkstatistics>
            </Modal>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapActions} from "vuex";
    import {teamWorkDemand} from "api";
    import Statis from "../../../components/statis.vue";
    import MainNative from "../../main-components/mainNative.vue";
    import userworkstatistics from "./userWorkStatistics";

    const taskTypeArr = [
        {name: i18n.t('workbench.work_ongoingProjects'), index: 0},
        {name: i18n.t('workbench.work_unfinishedTasks'), index: 1},
        {name: i18n.t('workbench.work_unfinishedContract'), index: 2},
        {name: i18n.t('workbench.work_biddingTestTask'), index: 3}
    ];
    export default {
        mounted() {
            this.init();
            let memberTable = document.querySelector(".memberTable");
            this.tableHeight = memberTable.offsetHeight - 475;
        },
        beforeDestroy() {
            this.$bus.off();
        },
        data() {
            return {
                tableHeight: 0,
                actions: {},
                task: {
                    member: "",
                    project: ""
                },
                testTask: {
                    status: "",
                    execute: "",
                    leader: ""
                },
                taskMember: [],
                projectData: [],
                bid_status: [],
                bid_execute_member: [],
                bid_leader_member: [],
                producer: null,
                count: {},
                page: 1,
                pageSize: 10,
                homeOrder_by: null,
                homeOrder: null,
                ability: [],
                abilityVal: "",
                department: [],
                departmentVal: "",
                unitData: "month",
                timeData: null,
                echartData: null,
                initData: null,
                rightInfo: {},
                projectTableData: [],
                taskTableData: [],
                testTaskTableData: [],
                contractTableData: [],
                dateList: null,
                chartOption: null,
                model1: "",
                teamWorkShow: false,
                activeIndex: 0,
                taskTypeArr: taskTypeArr,
                homeTable: [
                    {
                        title: i18n.t('workbench.work_menberName'),
                        render: (h, params) => h(
                            "div",
                            {
                                style: {
                                    display: "flex",
                                    marginLeft: "10px",
                                    justifyContent: "flex-start"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        src: ` ${
                                            this.GLOBAL.imgDomain
                                            }/index.php?r=system/user/get-headimage&id=${
                                            params.row.id
                                            }`,
                                        style: "display:block;margin-right:10px;width:30px;height:30px;border-radius:50%;border:1px solid #fffcee;"
                                    }
                                }),
                                h(
                                    "div",
                                    {
                                        attrs: {
                                            title: params.row.realname,
                                            style: "line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;"
                                        }
                                    },
                                    params.row.realname
                                )
                            ]
                        )
                    },
                    {
                        title: i18n.t('workbench.work_PositionTitle'),
                        key: "ability_name",
                        render: (h, params) => h(
                            "span",
                            {},
                            params.row.ability_name ? params.row.ability_name : i18n.t('workbench.work_unallocatedPosition')
                        )
                    },
                    {
                        title: i18n.t('workbench.work_subordinateDepartments'),
                        key: "department_name",
                        render: (h, params) => h(
                            "span",
                            {},
                            params.row.department_name
                                ? params.row.department_name
                                : i18n.t('workbench.work_unallocatedDepartments')
                        )
                    },
                    {
                        title: i18n.t('workbench.work_taskNumberTitle'),
                        key: "task_count",
                        sortable: "custom"
                    },
                    {
                        title: i18n.t('workbench.work_participationProjects'),
                        key: "array",
                        width: 270,
                        render: (h, params) => {
                            let projectArray = null;
                            if (params.row.project) {
                                projectArray = params.row.project.map(item => h(
                                    "li",
                                    {
                                        attrs: {title: item.project_name}
                                    },
                                    item.project_name
                                ));
                                return h(
                                    "ul",
                                    {
                                        class: "tableProjectUl"
                                    },
                                    projectArray
                                );
                            }
                        }
                    },
                    {
                        title: i18n.t('workbench.work_endTaskLastTime'),
                        key: "last_task_date",

                    },
                    {
                        key: "free_day",
                        width: 180,
                        sortable: "custom",
                        renderHeader: (h, params) => h(
                            "span",
                            {
                                attrs: {
                                    title: i18n.t('workbench.work_teamWorkIntroduceTitle')
                                }
                            },
                            [
                                [
                                    h("Icon", {
                                        props: {
                                            type: "ios-help-outline",
                                            size: "18"
                                        },
                                        style: {
                                            verticalAlign: "bottom",
                                            marginRight: "5px"
                                        }
                                    }),
                                    h("strong", i18n.t('workbench.work_FreeNumber'))
                                ]
                            ]
                        ),
                        render: (h, params) => h(

                            "Progress",
                            {
                                props: {
                                    percent: params.row.free_day
                                        ? Number(params.row.free_day.split("%")[0])
                                        : 0
                                },
                                style: {
                                    textAlign: "left",
                                    marginLeft: "20px"
                                }
                            },
                            `${
                                params.row.free_day
                                    ? Number(params.row.free_day.split("%")[0])
                                    : 0
                                }%`
                        )
                    }
                ],
                homeTableData: [],
                detailTableData: [],

                //0.9.1优化
                lookUpInfo: {
                    showMoadlFlag: false,
                    modalTitle: null,
                    creentUserID: null
                }

            };
        },
        methods: {
            showModal(creentRowData){
                this.lookUpInfo = {
                    showMoadlFlag: true,
                    modalTitle: creentRowData.realname,
                    creentUserID: creentRowData.id
                };
                // console.log(creentRowData);
            },
            ...mapMutations(["setDetailAll"]),
            ...mapActions(["vuexGetUserInfo", "vuexProjectPost"]),
            async init() {
                await this.initIndex();
                await this.getTimeData();
                this.companyMemberWork();
                this.initEchart();
                this.initNumber();
            },
            // 页面初始化接口
            initIndex() {
                return new Promise(async (resolve, reject) => {
                    let {data} = await teamWorkDemand.companyWorkIndex();
                    if (data.err_code === 0) {
                        this.initData = data;
                        this.initData.search_begin_time = this.$_getOneTime(
                            data.search_begin_time * 1000
                        );
                        this.initData.search_end_time = this.$_getOneTime(
                            data.search_end_time * 1000
                        );
                        this.ability = data.ability;
                        this.department = data.department;
                        this.taskMember = data.task_member;
                        this.projectData = data.project_data;
                        this.bid_status = data.bid_status;
                        this.bid_execute_member = data.bid_execute_member;
                        this.bid_leader_member = data.bid_leader_member;
                        this.actions = data.actions;
                        if (data.guide && data.guide === "teamwork") {
                            this.bubble();
                        }
                        resolve();
                    }
                });
            },
            bubble() {
                let text = this.$lau.bubble.teamwork;
                this.$nextTick(() => {
                    let defaultOptions = [
                        {
                            id: "menuContainer",
                            position: "right",
                            title: text[0].title,
                            content: text[0].content,
                            relative: "body",
                            subClassName: "ivu-menu-item-selected"
                        },
                        {
                            id: "sliderContainer",
                            position: "bottom",
                            title: text[1].title,
                            content: text[1].content,
                            relative: "body"
                        }
                    ];
                    this.$bubble(defaultOptions);
                });
            },
            // 获取时间 如  2019-1-2 -- 2019-2-2 或  2019-1-31 -- 2019-2-28
            getTimeData() {
                return new Promise((resolve, reject) => {
                    function getDaysInOneMonth(year, month) {
                        month = parseInt(month, 10) + 1;
                        let d = new Date(year, month, 0);
                        return d.getDate();
                    }

                    let year = new Date().getFullYear();
                    let month = new Date().getMonth() + 1;
                    let day = new Date().getDate();
                    let maxDay = getDaysInOneMonth(year, month);
                    let startDate = `${year}-${month > 9 ? month : "0" + month}-${
                        day < 10 ? "0" + day : day
                        }`;
                    let endDate = `${month + 1 === 13 ? year + 1 : year}-${
                        month + 1 === 13
                            ? "0" + 1
                            : month + 1 > 9 ? month + 1 : "0" + (month + 1)
                        }-${day > maxDay ? maxDay : day < 10 ? "0" + day : day}`;
                    this.timeData = [startDate, endDate];
                    resolve();
                });
            },
            // 初始化echart配置
            async initEchart() {
                let objForm = {
                    ability_id: this.abilityVal,
                    department_id: this.departmentVal,
                    begin_time: this.timeData[0],
                    end_time: this.timeData[1],
                    type: this.unitData
                };
                if (!this.abilityVal) {
                    delete objForm.ability_id;
                }
                if (!this.departmentVal) {
                    delete objForm.department_id;
                }

                let {data} = await teamWorkDemand.companyFreeTrend(objForm);
                if (data.err_code === 0 && data.data) {
                    this.echartData = data.data;
                    if (this.echartData.time) {
                        this.echartData.time.map((item, index, arr) => {
                            if (item.split("-").length === 3) {
                                this.$set(
                                    arr,
                                    index,
                                    `${item.split("-")[0]}\n${item.split("-")[1]}-${
                                        item.split("-")[2]
                                        }`
                                );
                            }
                        });
                    }
                    this.setOptions(
                        this.echartData.time ? this.echartData.time : [],
                        this.echartData.free ? this.echartData.free : []
                    );
                }
            },
            // 设置echart的options项
            setOptions(data, xData) {
                this.chartOption = {
                    // "color": ["#3BCEB6", "#f44336", "#9ACFFF", "#fcc44a", "#78c97c"],
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {type: "cross"},
                        formatter: `{b0}<br /><p class="tooltopIcon" ></p>${i18n.t('workbench.work_FreeNumber')}: {c0}%`
                    },
                    grid: {
                        left: "20",
                        right: "50",
                        top: "100",
                        bottom: "15",
                        containLabel: true
                    },
                    dataZoom: {
                        realtime: true, //拖动滚动条时是否动态的更新图表数据
                        height: 25, //滚动条高度
                        start: 40, //滚动条开始位置（共100等份）
                        end: 65 //结束位置（共100等份）
                    },
                    xAxis: [
                        {
                            nameTextStyle: {
                                color: "#f44336"
                            },
                            boundaryGap: false,
                            axisPointer: {
                                show: true,
                                type: "line",
                                label: {
                                    show: false
                                },
                                lineStyle: {
                                    width: 0.5
                                }
                            },
                            type: "category",
                            axisTick: {alignWithLabel: true},
                            data: data,
                            axisLabel: {
                                formatter: "{value}",
                                //                            "formatter": `${value.split('-').length === 2?`${value.split('-')[0]}-${value.split('-')[1]}-`:`{value}`}`,
                                interval: "auto",
                                textStyle: {
                                    color: "#818181",
                                    padding: [15, 0, 0, 0]
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: "#dcdcdc"
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            scale: true,
                            name: i18n.t('workbench.work_IdleTrend'),
                            nameTextStyle: {
                                color: "#818181",
                                padding: [5, 80, 15, 0]
                            },
                            max: 100,
                            min: 0,
                            boundaryGap: [0.2, 0.2],
                            axisLabel: {
                                show: true,
                                interval: "auto",
                                formatter: "{value} %",
                                textStyle: {
                                    color: "#818181",
                                    padding: [0, 15, 0, 0]
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: "#818181"
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: i18n.t('workbench.work_FreeNumber'),
                            type: "line",
                            yAxisIndex: 0,
                            areaStyle: {
                                color: {
                                    type: "linear",
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: "#bbf2e9" // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: "#f9fefd" //  100% 处的颜色
                                        }
                                    ],
                                    globalCoord: false // 缺省为 false
                                }
                            },
                            data: xData,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: "top",
                                        formatter: "{c}%"
                                    }
                                }
                            }
                        }
                    ]
                };
            },
            async companyMemberWork() {
                let objForm = {
                    ability_id: this.abilityVal,
                    department_id: this.departmentVal,
                    begin_time: this.timeData[0],
                    end_time: this.timeData[1],
                    order_by: this.homeOrder_by,
                    order: this.homeOrder
                };
                if (!this.abilityVal) {
                    delete objForm.ability_id;
                }
                if (!this.departmentVal) {
                    delete objForm.department_id;
                }
                if (
                    !this.homeOrder_by ||
                    !this.homeOrder ||
                    this.homeOrder === "normal"
                ) {
                    delete objForm.order_by;
                    delete objForm.order;
                }

                let {data} = await teamWorkDemand.companyMemberWork(objForm);
                if (data.err_code === 0 && data.data) {
                    this.homeTableData = data.data;
                }
            },

            changeSelec() {
                this.refresh();
            },
            async initNumber() {
                let {data} = await teamWorkDemand.companyWorkCompany();
                if (data.err_code === 0 && data.data) {
                    this.rightInfo = data.data;
                }
            },
            // 右侧列表数字
            rightInfoNumber(index) {
                return index === 0
                    ? this.rightInfo.project_count
                    : index === 1
                        ? this.rightInfo.task_count
                        : index === 2
                            ? this.rightInfo.contract_count
                            : index === 3 ? this.rightInfo.bid_count : "";
            },
            onSliderChange(data) {
                this.timeData = data;
                this.refresh();
            },
            onDateTypeChange(data) {
                this.unitData = data === i18n.t('workbench.work_teamWorkYaerTag') ? "year" : data === i18n.t('workbench.work_teamWorkDayTag') ? "day" : "month";
                this.refresh();
            },
            // 刷新
            refresh() {
                this.initEchart();
                this.companyMemberWork();
            },
            companyShow(item, index) {
                let obj =
                    (index === 0 && this.actions.workingproject) ||
                    (index === 1 && this.actions.workingtask) ||
                    (index === 2 && this.actions.workingcontract) ||
                    (index === 3 && this.actions.workingbidtest);
                return obj;
            },
            // 进入table
            toTable(item, index) {
                this.teamWorkShow = true;
                this.activeIndex = item.index;
                this.homeOrder_by = null;
                this.homeOrder = null;
                this.getProjectTable();
                this.getTaskTable();
                this.getContractTable();
                this.getTestTaskTable();
            },
            async getProjectTable() {
                let objForm = {
                    order_by: this.homeOrder_by,
                    order: this.homeOrder,
                    page_size: 8,
                    page: this.page,
                };
                if (
                    !this.homeOrder_by ||
                    !this.homeOrder ||
                    this.homeOrder === "normal"
                ) {
                    delete objForm.order_by;
                    delete objForm.order;
                }

                let {data} = await teamWorkDemand.companyProjectWork(objForm);
                if (data.err_code === 0 && data.data) {
                    this.projectTableData = data.data;
                    this.count.project = Number(data.page.count);
                }
            },
            async getTaskTable() {
                let objForm = {
                    run_uid: this.task.member,
                    project_id: this.task.project,
                    page: this.page,
                    page_size: 8,
                    order_by: this.homeOrder_by,
                    order: this.homeOrder
                };

                if (!this.task.member) {
                    delete objForm.user_id;
                }
                if (!this.task.project) {
                    delete objForm.project_id;
                }
                if (
                    !this.homeOrder_by ||
                    !this.homeOrder ||
                    this.homeOrder === "normal"
                ) {
                    delete objForm.order_by;
                    delete objForm.order;
                }
                let {data} = await teamWorkDemand.companyTaskWork(objForm);
                if (data.err_code === 0 && data.data) {
                    this.taskTableData = data.data;
                    this.count.task = Number(data.page.count);
                }
            },
            async getTestTaskTable() {
                let objForm = {
                    page: this.page,
                    page_size: 8,
                    status: this.testTask.status,
                    leader_user: this.testTask.leader,
                    execute_user: this.testTask.execute
                };

                if (!this.testTask.leader) {
                    delete objForm.leader_user;
                }
                if (!this.testTask.execute) {
                    delete objForm.execute_user;
                }
                if (!this.testTask.status && this.testTask.status !== 0) {
                    delete objForm.status;
                }
                if (
                    !this.homeOrder_by ||
                    !this.homeOrder ||
                    this.homeOrder === "normal"
                ) {
                    delete objForm.order_by;
                    delete objForm.order;
                }
                let {data} = await teamWorkDemand.companyTestTaskWork(objForm);
                if (data.err_code === 0 && data.data) {
                    this.testTaskTableData = data.data;
                    this.count.test = Number(data.page.count);
                }
            },
            async getContractTable() {
                let objForm = {
                    page: this.page,
                    page_size: 8
                };
                let {data} = await teamWorkDemand.companyContractWork(objForm);
                if (data.err_code === 0 && data.data) {
                    this.contractTableData = data.data;
                    this.count.contract = Number(data.page.count);
                }
            },
            // 切换table
            changeTable(item, index) {
                this.activeIndex = item.index;
                this.homeOrder_by = null;
                this.homeOrder = null;
                this.page = 1;
                this.changePage(this.page);
            },

            /* 分页切换 */
            changePage(page) {
                this.page = page;
                if (this.activeIndex === 0) {
                    this.getProjectTable();
                } else if (this.activeIndex === 1) {
                    this.getTaskTable();
                } else if (this.activeIndex === 2) {
                    this.getContractTable();
                } else if (this.activeIndex === 3) {
                    this.getTestTaskTable();
                }
            },
            sortData({key, order}, type) {
                this.homeOrder_by = key;
                this.homeOrder = order;
                this.companyMemberWork();
            },
            sortProject({key, order}, type) {
                this.homeOrder_by = key;
                this.homeOrder = order;
                this.getProjectTable();
            },
            sortTask({key, order}, type) {
                this.homeOrder_by = key;
                this.homeOrder = order;
                this.getTaskTable();
            },
            // 查看详情
            toDetail(type, {row}) {
                if (type === "project") {
                    this.toProject({id: row.id});
                } else if (type === "task") {
                    this.toTask({id: row.id, projectId: row.project});
                } else if (type === "contract") {
                    this.toContract({id: row.id, network: row.network});
                } else if (type === "testTask") {
                    this.toTestTask({id: row.id, testId: row.test_id});
                }
            },
            toProject({id}) {
                sessionStorage.projectID = id;
                this.$router.push({path: "/project"});
                this.$bus.emit("changeMenuList", id);
            },
            toTask({id, projectId}) {
                sessionStorage.projectID = projectId;
                sessionStorage.TaskID = id;
                const item = {id: id};
                this.setDetailAll(item);
                this.$router.push({
                    path: "/project/details",
                    query: {project: projectId, id: id, navTitle: i18n.t('workbench.work_teamWorkTitle')}
                });
                // this.$bus.emit('changeMenuList', projectId);
            },
            async toContract({id, network}) {
                this.$store.commit("getContractIDCommit", id);
                this.$store.commit("getContractType", network);
                await this.vuexGetUserInfo();
                await this.vuexProjectPost();
                if (network == 1) {
                    this.$router.push({
                        path: "/epibol/contractData",
                        query: {navTitle: i18n.t('workbench.work_teamWorkTitle')}
                    });
                } else if (network == 2) {
                    this.$router.push({
                        path: "/epibol/addElectronicContract",
                        query: {navTitle: i18n.t('workbench.work_teamWorkTitle')}
                    });
                }
            },
            toTestTask({id, testId}) {
                this.$router.push({
                    path: "/epibol/ManageDetails",
                    query: {
                        enteredID: id,
                        TestID: testId,
                        type: "new",
                        navTitle: i18n.t('workbench.work_teamWorkTitle')
                    }
                });
            },
            // 切换home和table
            closeModal() {
                this.teamWorkShow = false;
            },
            // join 方法
            $_arrJoin(array, interval) {
                let arr = "";
                if (array) {
                    arr = array.filter(item => item).join(interval);
                }
                return arr;
            },
            // 根据时间戳获取时间
            $_timeTostring(startTime, endTime) {
                let start = this.$_getOneTime(startTime);
                let end = this.$_getOneTime(endTime);
                if (start) {
                    start = start.includes("~") ? start.split("~")[0] : start;
                }
                if (end) {
                    end = end.includes("~") ? end.split("~")[0] : end;
                }
                return `${start}~<br/>${end}`;
            },
            $_getOneTime(time) {
                if (!time) {
                    return;
                }
                return new Date(parseInt(time)).toLocaleDateString().replace(/\//g, "-");
            },
            // 根据时间戳转换天数
            $_getDay(startTime, endTime) {
                return `${(endTime - startTime) / (24 * 3600)}${i18n.t('workbench.work_teamWorkDateTag')}`;
            },
            // 根据结束时间获取状态  当前时间超过end就是待交稿 没有就是等待选稿
            $_getStatus(endTime) {
                return new Date().getTime() > endTime ? {text: i18n.t('workbench.work_waitingManuscript'), status: 1} : {text: i18n.t('workbench.work_ProductionManuscript'), status: 2};
            }
        },
        computed: {
            // 合同table
            contractTable() {
                return [
                    {
                        title: i18n.t('workbench.work_contractName'),
                        key: "contract_name"
                    },
                    {
                        title: i18n.t('workbench.work_statusTitle'),
                        width: "80px",
                        key: "status_text",
                        render: (h, params) => h(
                            "div",
                            {
                                class: params.row.status === "1" ? "baseStatusColor" : "orgStatusColor"
                            },
                            params.row.status_text
                        )
                    },
                    {
                        title: i18n.t('workbench.work_contractTime'),
                        render: (h, params) => h(
                            "div",
                            {
                                domProps: {
                                    innerHTML: this.$_timeTostring(
                                        params.row.start_time * 1000,
                                        params.row.end_time * 1000
                                    )
                                }
                            }
                        )
                    },
                    {
                        title: i18n.t('workbench.work_personCharge'),
                        render: (h, params) => h(
                            "div",
                            {
                                style: {
                                    display: "flex",
                                    marginLeft: "10px",
                                    justifyContent: "center"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        src: `${this.GLOBAL.imgDomain}/index.php?r=system/user/get-headimage&id=${params.row.business_people}`,
                                        style: "margin-right:10px;width:30px;height:30px;border-radius:50%;"
                                    }
                                }),
                                h(
                                    "div",
                                    {
                                        attrs: {
                                            title: params.row.business_name,
                                            style: "line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;width:60px;"
                                        }
                                    },
                                    params.row.business_name
                                )
                            ]
                        )
                    },
                    {
                        title: i18n.t('workbench.work_associatedProject'),
                        key: "project_name",
                        render: (h, params) => h(
                        "span",
                        params.row.status === "1"
                                ? params.row.project_name
                                : "-"
                        )
                    },
                    {
                        title: i18n.t('workbench.work_completeSchedule'),
                        width: "180px",
                        render: (h, params) => {
                            if ( params.row.status !== "1") {
                                return h("span", "-");
                            } else if ( params.row.status === "1") {
                                return h(
                                    "Progress",
                                    {
                                        props: {
                                            percent: params.row.complete_rate
                                                ? params.row.complete_rate
                                                : 0
                                        },
                                        style: {
                                            textAlign: "left",
                                            marginLeft: "20px"
                                        }
                                    },
                                    `${params.row.complete_rate ? params.row.complete_rate : 0}%`
                                );
                            }
                        }
                    },
                    {
                        title: i18n.t('workbench.work_surplusWorkDay'),
                        render: (h, params) => h(
                            "span",
                            this.$_getDay(params.row.start_time, params.row.end_time)
                        )
                    },
                    {
                        title: i18n.t('workbench.work_ActualNumberOfParticipants'),
                        width: "100px",
                        key: "member_count",
                        render: (h, params) => h(
                        "span",
                            params.row.status === "1"
                                    ? params.row.member_count
                                    : "-"
                            )
                    },
                    {
                        title: i18n.t('workbench.work_deliverResourcesType'),
                        render: (h, params) => h("span", this.$_arrJoin(params.row.price, "、"))
                    },
                    {
                        title: i18n.t('workbench.work_operationTag'),
                        width: "80px",
                        render: (h, params) => h(
                            "span",
                            {
                                on: {
                                    click: () => {
                                        this.toDetail("contract", params);
                                    }
                                },
                                class: "toDetailButton"
                            },
                            i18n.t('workbench.work_lookOverTag')
                        )
                    }
                ];
            },
            // 测试任务
            testTaskTable() {
                return [
                    {
                        title: i18n.t('workbench.work_biddingTestTask'),
                        key: "test_name"
                    },
                    {
                        title: i18n.t('workbench.work_statusTitle'),
                        render: (h, params) => h(
                            "span",
                            {
                                class:
                                    this.$_getStatus(params.row.end_time * 1000).status === "2"
                                        ? "orgStatusColor"
                                        : ""
                            },
                                this.$_getStatus(params.row.end_time * 1000).text
                            )
                    },

                    {
                        title: i18n.t('workbench.work_producer'),
                        key: "name",
                        render: (h, params) => h(
                            "div",
                            {
                                style: {
                                    display: "flex",
                                    marginLeft: "10px",
                                    justifyContent: "center"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        src: `${
                                            this.GLOBAL.imgDomain
                                            }/index.php?r=system/user/get-headimage&id=${
                                            params.row.execute_user
                                            }`,
                                        style:
                                            "margin-right:10px;width:30px;height:30px;border-radius:50%;"
                                    }
                                }),
                                h(
                                    "div",
                                    {
                                        attrs: {
                                            title: params.row.execute_name
                                                ? params.row.execute_name
                                                : i18n.t('workbench.work_nullStatus'),
                                            style:
                                                "line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;width:60px;"
                                        }
                                    },
                                    params.row.execute_name ? params.row.execute_name : i18n.t('workbench.work_nullStatus')
                                )
                            ]
                        )
                    },
                    {
                        title: i18n.t('workbench.work_ChargeMember'),
                        key: "name",
                        render: (h, params) => h(
                            "div",
                            {
                                style: {
                                    display: "flex",
                                    marginLeft: "10px",
                                    justifyContent: "center"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        src: `${
                                            this.GLOBAL.imgDomain
                                            }/index.php?r=system/user/get-headimage&id=${
                                            params.row.leader_user
                                            }`,
                                        style:
                                            "margin-right:10px;width:30px;height:30px;border-radius:50%;"
                                    }
                                }),
                                h(
                                    "div",
                                    {
                                        attrs: {
                                            title: params.row.leader_name
                                                ? params.row.leader_name
                                                : i18n.t('workbench.work_nullStatus'),
                                            style:
                                                "line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;width:60px;"
                                        }
                                    },
                                    params.row.leader_name ? params.row.leader_name : i18n.t('workbench.work_nullStatus')
                                )
                            ]
                        )
                    },
                    {
                        title: i18n.t('workbench.work_SubmitManuscriptsEndTime'),
                        render: (h, params) => h(
                            "span",
                            new Date(parseInt(params.row.end_time * 1000))
                                .toLocaleDateString()
                                .replace(/\//g, "-")
                        )
                    },
                    {
                        title: i18n.t('workbench.work_projectEstimate'),
                        key: "project_max_price"
                    },
                    {
                        title: i18n.t('workbench.work_operationTag'),
                        render: (h, params) => h(
                            "span",
                            {
                                on: {
                                    click: () => {
                                        this.toDetail("testTask", params);
                                    }
                                },
                                class: "toDetailButton"
                            },
                            i18n.t('workbench.work_lookOverTag')
                        )
                    }
                ];
            },
            // 项目
            projectTable() {
                return [
                    {
                        title: i18n.t('workbench.work_projectName'),
                        width: '120px',
                        key: "name"
                    },
                    {
                        title: i18n.t('workbench.work_projectChargeMember'),

                        render: (h, params) => h(
                            "div",
                            {
                                style: {
                                    display: "flex",
                                    marginLeft: "10px",
                                    justifyContent: "center"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        src: `${
                                            this.GLOBAL.imgDomain
                                            }/index.php?r=system/user/get-headimage&id=${
                                            params.row.leader
                                            }`,
                                        style:
                                            "margin-right:10px;width:30px;height:30px;border-radius:50%;"
                                    }
                                }),
                                h(
                                    "div",
                                    {
                                        attrs: {
                                            title: params.row.leader_name,
                                            style:
                                                "line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;width:60px;"
                                        }
                                    },
                                    params.row.leader_name
                                )
                            ]
                        )
                    },
                    {
                        title: i18n.t('workbench.work_projectTime'),
                        render: (h, params) => h(
                            "span",
                            {
                                domProps: {
                                    innerHTML: this.$_timeTostring(
                                        params.row.start_time * 1000,
                                        params.row.end_time * 1000
                                    )
                                }
                            }
                        )
                    },
                    {
                        title: i18n.t('workbench.work_projectComplete'),
                        width: "180px",
                        key: "complete",
                        sortable: "custom",
                        render: (h, params) => h(
                            "Progress",
                            {
                                props: {
                                    percent: params.row.project_comlete_rate
                                        ? Number(params.row.project_comlete_rate.split("%")[0])
                                        : 0,
                                    hideInfo: false
                                },
                                style: {
                                    textAlign: "left",
                                    marginLeft: "20px"
                                }
                            },
                            `${
                                params.row.project_comlete_rate
                                    ? Number(params.row.project_comlete_rate.split("%")[0])
                                    : 0
                                }%`
                        )
                    },
                    {
                        title: i18n.t('workbench.work_SurplusTask'),
                        width: '100px',
                        key: "left_task"
                    },
                    {
                        title: i18n.t('workbench.work_participateNumber'),
                        width: '100px',
                        key: "member_count"
                    },
                    {
                        title: i18n.t('workbench.work_InvolvePosition'),
                        width: '100px',
                        render: (h, params) => h("span", this.$_arrJoin(params.row.job, "、"))
                    },
                    {
                        title: i18n.t('workbench.work_operationTag'),
                        width: '100px',
                        render: (h, params) => h(
                            "span",
                            {
                                on: {
                                    click: () => {
                                        this.toDetail("project", params);
                                    }
                                },
                                class: "toDetailButton"
                            },
                            i18n.t('workbench.work_lookOverTag')
                        )
                    }
                ];
            },
            // 任务
            taskTable() {
                return [
                    {
                        title: i18n.t('workbench.work_taskName'),
                        key: "task_name",
                        width: '150px'
                    },
                    {
                        title: i18n.t('workbench.work_producerTag'),
                        width: '150px',
                        render: (h, params) => h(
                            "div",
                            {
                                style: {
                                    display: "flex",
                                    marginLeft: "10px",
                                    justifyContent: "center"
                                }
                            },
                            [
                                h("img", {
                                    attrs: {
                                        src: `${
                                            this.GLOBAL.imgDomain
                                            }/index.php?r=system/user/get-headimage&id=${
                                            params.row.run_uid
                                            }`,
                                        style:
                                            "margin-right:10px;width:30px;height:30px;border-radius:50%;"
                                    }
                                }),
                                h(
                                    "div",
                                    {
                                        attrs: {
                                            title: params.row.realname,
                                            style:
                                                "line-height:30px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;width:60px;"
                                        }
                                    },
                                    params.row.realname
                                )
                            ]
                        )
                    },
                    {
                        title: i18n.t('workbench.work_taskEstimateTime'),
                        width: "200px",
                        render: (h, params) => h(
                            "span",
                            `${params.row.expect_start_date.split(" ")[0]}~${params.row.expect_end_date.split(" ")[0]}`
                        )
                    },
                    {
                        title: i18n.t('workbench.work_taskTimeProgress'),
                        width: "180px",
                        key: "time_rate",
                        sortable: "custom",
                        render: (h, params) => h(
                            "Progress",
                            {
                                props: {
                                    percent: params.row.time_rate
                                        ? Number(params.row.time_rate)
                                        : 0
                                },
                                style: {
                                    textAlign: "left",
                                    marginLeft: "20px"
                                }
                            },
                            `${params.row.time_rate ? Number(params.row.time_rate) : 0}%`
                        )
                    },
                    {
                        title: i18n.t('workbench.work_CompletedPhase'),
                        width: '180px',
                        key: "stage_name"
                    },
                    {
                        title: i18n.t('workbench.work_ascriptionProject'),
                        key: "project_name"
                    },
                    {
                        title: i18n.t('workbench.work_operationTag'),
                        width: '100px',
                        render: (h, params) => h(
                            "span",
                            {
                                on: {
                                    click: () => {
                                        this.toDetail("task", params);
                                    }
                                },
                                class: "toDetailButton"
                            },
                            i18n.t('workbench.work_lookOverTag')
                        )
                    }
                ];
            }
        },
        components: {
            userworkstatistics,
            MainNative,
            Statis
        }
    };
</script>

<style lang="less">
    .teamWorkContainer {
        display: flex;
        justify-content: space-between;
        // height: 100% !important;
        // vertical-align: middle;
        // color: #777777;
        .ivu-icon-android-contract {
            &:hover {
                cursor: pointer;
            }
        }
        .memberTable {
            flex: 1;
            min-width: 1200px;
            box-shadow: @boxShadow;
            border-radius: @borderRadius3;
            background: @white;
            padding: 20px 30px;
            .chart {
                // height: 550px;
                //.base-card;
                height: auto;
                /*padding: 16px 20px 16px 20px;*/
                background: @white;
                .title {
                    margin-bottom: 12px;
                    font-size: 16px;
                }
                .chartInfo {
                    display: flex;
                    justify-content: space-between;
                    .info {
                        width: 270px;
                        display: flex;
                        justify-content: space-between;
                        color: #c6c6c6;
                        .number {
                            color: #fcc44a;
                            font-size: 20px;
                        }
                    }
                }
            }
        }
        .taskListBox {
            // display: flex;
            // flex-direction: column;
            width: 240px;
            margin-left: 30px;
            height: 100%;
            // float:right;
            // align-content: space-around;
            /*min-height: 975px;*/
            background: @white;
            box-shadow: @boxShadow;
            border-radius: 3px;
            .title {
                margin: 16px 0 0 20px;
                font-size: 16px;
            }
            .taskList {
                flex: 1;
                display: flex;
                align-items: center;
                /*padding: 60px 100px 50px 100px;*/
                /*height: 215px;*/
                text-align: center;
                border-bottom: 1px dashed #e0e0e0;
                color: #818181;

                .number0,
                .number1,
                .number2,
                .number3 {
                    font-size: 26px;
                    margin-right: 5px;
                }
                .number0 {
                    color: @base;
                }
                .number1,
                .number2 {
                    color: #fcc44a;
                }
                .number3 {
                    color: #7cbefc;
                }
                .name {
                    margin: 16px 0;
                }
                .button0 {
                    .detailButton();
                }
                .button1,
                .button2 {
                    .detailButton(#fcc44a);
                }
                .button3 {
                    .detailButton(#7cbefc);
                }
                button {
                    cursor: pointer;
                }
            }
        }
        .detailButton(@c:@base) {
            width: 75px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            color: @c;
            border: 1px solid @c;
            background: @white;
            border-radius: 4px;
            &:hover {
                opacity: 0.8;
            }
        }
    }
</style>
<style lang="less">
    .teamWorkContainer {
        .ivu-progress-bg {
            background: @base;
        }
        .ivu-progress-text {
            color: @base;
        }
        .baseStatusColor {
            color: @base;
        }
        .orgStatusColor {
            color: @orange;
        }
        .tooltopIcon {
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-right: 10px;
            background: @base_dark;
            border-radius: 50%;
            vertical-align: middle;
        }
        .my-table {
            table {
                width: 100% !important;
            }
        }
        .my-table-box {
            /*height: calc(~"100% - 475px");*/
            /*overflow: auto;*/
        }
        display: flex;
        .tableProjectUl {
            width: 250px;
            padding-bottom: 10px;
            display: flex;
            /*justify-content: space-between;*/
            flex-wrap: wrap;
            overflow: auto;
            li {
                margin: 5px 0 0 8px;
                padding: 0 10px;
                width: 75px;
                height: 24px;
                line-height: 22px;
                color: @base;
                background: @white;
                text-align: center;
                font-size: 12px;
                border-radius: 2px;
                border: 1px solid @base;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .top,
        .bottom {
            text-align: center;
        }
        .center {
            width: 300px;
            margin: 10px auto;
            overflow: hidden;
        }
        .center-left {
            float: left;
        }
        .center-right {
            float: right;
        }
    }

    .teamWorkProjectModal {
        width: 100%;
        color: #777777;
        .ivu-modal-header {
            display: none;
        }
        .ivu-modal-body {
            padding: 0;
        }
        .tableList {
            text-align: right;
        }
        .ivu-modal {
            width: 90% !important;
        }
        .head {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #e9eaec;
            border-bottom: 0;
            .projectTitleUl {
                display: flex;
                height: 60px;
                padding: 16px 0;
                line-height: 28px;

                .titleList {
                    padding: 0 10px;
                    margin: 0 30px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .active {
                    color: @white;
                    background: @base;
                    border-radius: 4px;
                }
            }
            .filter {
                margin-right: 20px;
                /*position: absolute;*/
                /*right: 90px;*/
                /*top: 15px;*/
            }
            .closeIcon {
                font-size: 20px;
                position: absolute;
                top: 20px;
                right: 30px;
            }
        }
    }

    .teamWorkProjectModal,
    .teamWorkContainer {
        .ivu-icon-ios-close {
            z-index: 666;
            background: @white;
        }
        .ivu-table th {
            height: 45px;
            text-align: center;
            background: #fafbfb;
            color: #bdbdbd;
            font-weight: normal;
        }
        .ivu-table td {
            height: 60px;
            text-align: center;
            color: #777777;
        }
        .toDetailButton {
            &:hover {
                color: @base;
                cursor: pointer;
            }
        }
        .ivu-progress-inner {
            width: 90px;
            height: 17px;
            line-height: 17px;
            border-radius: 2px;
        }

        .ivu-progress-bg {
            border-radius: 2px;
            height: 17px !important;
        }
        .ivu-select-placeholder,
        .ivu-select,
        .ivu-select-single .ivu-select-selection {
            height: 30px !important;
            line-height: 30px !important;
            color: #8c8c8c;
        }
        .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
        .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
            height: 30px !important;
            line-height: 30px !important;
        }
        .ivu-progress-success .ivu-progress-bg {
            background: @base !important;
        }
        .ivu-progress-success .ivu-progress-text {
            color: @base !important;
        }
    }
</style>
