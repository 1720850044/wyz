<!--
公司 团队能力
-->
<template>
    <div>
        <main-native>
            <div class="main-header-style">
        <span class="main-header-title">
          {{this.$route.meta.title}}
          <div></div>
        </span>
            </div>
        </main-native>
        <div>
            <div class="content-box">
                <!--左边-->
                <div class="base-card content-box-left" style="padding-left:0;padding-right:0">
                    <!--head-->
                    <div class="base-card-head clearfix" style="padding-left:16px;margin-bottom:4px;">
                        <div class="base-card-operation-head">公司能力助手</div>
                        <div class="base-card-operation-icon" style="margin-right:20px">
                            <Tooltip>
                                <em class="icon iconfonts icon-uniE901" style="font-size:20px"></em>
                                <div slot="content">
                                    <div class="notice-head">
                                        <em class="icon iconfonts icon-jingao"
                                            style="font-size:14px;margin-right:8px;"></em>字段帮助
                                    </div>
                                    <div class="notice-content">
                                        <p>
                                            <span>平均制作工时：</span>截止到昨天，该成员任务的平均制作工时。
                                            <span class="green">【任务总工时/任务数量】</span>
                                        </p>
                                        <p>
                                            <span>平均反馈通过率：</span>截止到昨天，该成员任务的平均反馈通过率，包括内外审核。
                                            <span class="green">【任务反馈通过次数/任务反馈总次数】</span>
                                        </p>
                                        <p>
                                            <span>制作评分：</span>该数据由公司负责人手动填写，评估该成员该工作类型制作能力。
                                        </p>
                                        <p>
                                            <span>设计评分：</span>该数据由公司负责人手动填写，评估该成员该工作类型设计能力。
                                        </p>
                                        <p>
                                            <span>沟通评分：</span>该数据由公司负责人手动填写，评估该成员综合沟通能力。
                                        </p>
                                        <p>
                                            <span>评价评分：</span>该数据由系统生成，为用户或负责人对任务的评分平均值。
                                            <span class="green">【任务评分总分/任务评分总次数】</span>
                                        </p>
                                    </div>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <!--筛选-->
                    <div class="select-box">
                        <Input v-model="selectKeyWord" icon="ios-search" style="width:150px;" placeholder="输入姓名"
                               @keyup.enter.native="changeTable"></Input>
                        <Select
                            v-model="selectDuty"
                            placeholder="所有类型"
                            @on-change="changeTable"
                            style="width:150px;margin-right:20px;"
                        >
                            <Option value="">所有类型</Option>
                            <Option v-for="item in dutyList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                        <Select
                            v-model="selectDepartment"
                            placeholder="所有部门"
                            @on-change="changeTable"
                            style="width:150px"
                        >
                            <Option value="">所有部门</Option>
                            <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </div>
                    <!--表格-->
                    <Table
                        :loading="tableLoding"
                        @on-row-click="rowClick"
                        size="large"
                        :columns="tableData.columns"
                        :data="tableData.data"
                        class="teamPowerList"
                    ></Table>
                    <!--分页-->
                    <div class="content-box-page">
                        <Page
                            :total="parseInt(this.tableData.page.count)"
                            size="small"
                            :page-size="tableData.page.page_size"
                            @on-change="onPageChange"
                        ></Page>
                    </div>
                </div>
                <div class="base-card content-box-right" style="width:400px;min-height:400px;height:auto">
                    <div class="base-card-head clearfix">
                        <div class="base-card-operation-head">公司整体数据</div>
                        <div class="right">
                            <RadioGroup v-model="nowtype" style="float:right;line-height:24px;">
                                <Radio label="按部门" size="large"></Radio>
                                <Radio label="按类型" size="large"></Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div class="info">
                        <div class="column infoHead">
                            <div></div>
                            <div>制作<br>人数</div>
                            <div>平均<br>成本</div>
                            <div>平均<br>制作用时</div>
                            <div>平均<br>通过率</div>
                        </div>
                        <div class="column allnum">
                            <div>总计</div>
                            <div>{{tableData.total.member_count}}</div>
                            <div>{{tableData.total.wages}}</div>
                            <div>{{tableData.total.make_time}}</div>
                            <div>{{tableData.total.pass}}</div>
                        </div>
                        <div class="column" v-for="(item,index) in tableData.total.child" :key="index">
                            <div v-if="nowtype=='按部门'">{{item.name||'未分配部门'}}</div>
                            <div v-else>{{item.name||'未命名'}}</div>
                            <div>{{item.count}}</div>
                            <div>{{item.wages}}</div>
                            <div>{{item.make_time}}</div>
                            <div>{{item.pass}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal v-model="alerts" title="能力详细" width="1000px" @on-ok="ok" ok-text="关闭" cancel-text=""
                   @on-cancel="cancel">
                <div class="power-modals clearfix">
                    <div class="lefts">
                        <div class="headInfo">
                            <Avatar icon="person" size="large" :src="this.modals.user.headImage"/>
                            <p class="uName">{{modals.user.name}}</p>
                            <p>
                                <span>{{modals.user.job}}</span>
                            </p>
                            <!-- <p>{{modals.user.joinTime}}加入</p> -->
                            <p>{{modals.user.department}}</p>
                        </div>
                        <div class="money">
                            <div>
                                <span>薪资：</span>
                                <input
                                    type="text"
                                    v-model="modals.user.wages"
                                    placeholder
                                    @blur="changeSelectInfo('wages',$event)"
                                >
                            </div>
                            <div>
                                <span>人天：</span>
                                <input
                                    type="text"
                                    v-model="modals.user.price"
                                    placeholder
                                    @blur="changeSelectInfo('per_day',$event)"
                                >
                            </div>
                            <div>
                                <span>评级：</span>
                                <Select
                                    v-model="modals.user.level"
                                    size="small"
                                    placeholder="请选择"
                                    @on-change="changeTable"
                                    style="width:140px"
                                >
                                    <!-- <Option  value="">所有类型</Option> -->
                                    <Option v-for="(item,index) in modals.user.levelData" :value="item.id" :key="index">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                                <!-- <Select v-model="modals.user.level" @change="changLeve" size="small" >
                                  <option
                                    v-for="(item,index) in modals.user.levelData"
                                    :value="item.id"
                                    :key="index"
                                  >{{item.name}}</option>

                                </Select> -->
                            </div>
                        </div>
                        <ul class="historyFinish">
                            <li>
                                <div>历史任务</div>
                                <div></div>
                            </li>
                            <li>
                                <div>项目</div>
                                <div>{{modals.user.project}}</div>
                            </li>
                            <li>
                                <div>任务</div>
                                <div>{{modals.user.task}}</div>
                            </li>
                            <li>
                                <div>测试任务</div>
                                <div>{{modals.user.test}}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="rights">
                        <div class="charts">
                            <div class="charts-text" id="teamChartsText">
                                <div :class="{actives:modals.nowChart==0}" @click="checkChart(0)">能力评分</div>
                                <div :class="{actives:modals.nowChart==1}" @click="checkChart(1)">薪资统计</div>
                                <div :class="{actives:modals.nowChart==2}" @click="checkChart(2)">效率统计</div>
                            </div>
                            <div class="charts-chart">
                                <div id="charBox" class="charts-chartBox" style="width:630px;height:250px; ">
                                    <!--nothink type="project" text="暂无数据" v-if="modals.isShowChart"></nothink-->
                                </div>
                            </div>
                        </div>
                        <ul class="score">
                            <template v-if="modals.nowChart==0 && modals.chartData.length>0">
                                <li v-for="(item,index) in modals.chartData[0].datas" :key="index">
                                    <span>{{modals.chartData[0].legend[index]}}</span>
                                    <div>
                                        <input
                                            type="number"
                                            v-for="(score,index2) in item"
                                            :value="modals.chartData[0].datas[index][index2]"
                                            @input="handleInput($event,0,index,index2)"
                                            @blur="changeScore(modals.nowChart,index,index2,$event)"
                                            :key="index2"
                                        >
                                    </div>
                                </li>
                            </template>
                            <template v-if="modals.nowChart==1 && modals.chartData.length>0">

                                <li v-for="(item,index) in modals.chartData[1].datas" :key="index">
                                    <span>{{modals.chartData[1].legend[index]}}</span>
                                    <div>
                                        <span></span>
                                        <input
                                            v-for="(score,index2) in item"
                                            v-model="modals.chartData[1].datas[index][index2]"

                                            @blur="changeScore(modals.nowChart,index,index2,$event)"
                                            :key="index2"
                                        >
                                    </div>
                                </li>
                            </template>

                            <template v-if="modals.nowChart==2 && modals.chartData.length>0">
                                <li v-for="(item,index) in modals.chartData[2].datas" :key="index">
                                    <span>{{modals.chartData[2].legend[index]}}</span>
                                    <div>
                                        <p v-for="(score,index2) in item" :key="index2">{{score}}</p>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
</template>
<script>
    import mainNative from "../main-components/mainNative.vue";
    import api from "api";
    import {mapGetters} from "vuex";
    import Cookies from "js-cookie";

    export default {
        name: 'teamPower',
        data() {
            return {
                acc_token: null,
                alerts: false,
                nowtype: "按类型",
                tableLoding: false,
                pageSzie: 20,
                selectKeyWord: "",
                selectDuty: "",
                selectDepartment: "",
                dutyList: [],
                modals: {
                    user: {
                        user_id: "947",
                        name: "xwxw",
                        job: "无",
                        department: "研发部",
                        wages: 0,
                        price: 0,
                        make_time: 0,
                        pass: 0,
                        project: "0",
                        task: "0",
                        test: "0",
                        make_score: 0,
                        design_score: 0,
                        communicate_score: 0,
                        comprehensive_score: 0,
                        level: "",
                        headImage: "",
                        levelData: []
                    },
                    nowChart: 0,
                    isShowChart: false,
                    chartData: []
                },

                tableData: {
                    total: {
                        member_count: 2,
                        wages: 0,
                        pass: 0,
                        make_time: 0,
                        child: [
                            {
                                name: null,
                                count: "1",
                                wages: 0,
                                make_time: 0,
                                pass: 0
                            },
                            {
                                name: "研发部",
                                count: "1",
                                wages: 0,
                                make_time: 0,
                                pass: 0
                            }
                        ]
                    },
                    page: {},
                    columns: [],
                    data: []
                }
            };
        },
        components: {
            mainNative
        },
        mounted() {

        },
        created() {
            api.getTeamPowerInitApi().then(res => {
                // console.log('初始化数据：', JSON.stringify(res))
                if (res.data.err_code == 0) {
                    this.acc_token = res.data.data.acc_token;
                    this.getTeamPowerData(1);
                    this.deptListData();
                    this.dutyListData();
                    //this.getbeGoodAtFun();
                }
            });
            return false;
        },
        computed: {
            ...mapGetters({
                deptList: "getDeptList",
                //dutyList: "getDutyList"
            })
        },
        methods: {
            //过滤
            handleInput(e, cIndex, index, index2) {
                if (e.target.value > 5) {
                    this.$Message.error("修改失败,评分不能大于5");
                    e.target.value = this.modals.chartData[0].datas[index][index2];
                } else {
                    this.modals.chartData[0].datas[index][index2] = e.target.value;
                }
            },
            //获取组页面数据
            async getTeamPowerData(page) {
                let result = await api.getTeamPowerData(this.addAccToken({page: page, limit: 10}));
                if (result.data.err_code == 0) {
                    result.data.data.columns = result.data.data.columns.filter(
                        (item, index) => {
                            if (item.key != "level" && item.key != "user_id") {
                                return item;
                            }
                        }
                    );

                    if (page == 1 && this.selectKeyWord == '' && this.selectDepartment == '' && this.selectDuty == '') {
                        this.tableData = this.changeZero(result.data.data);
                    } else {
                        this.tableData.columns = this.changeZero(result.data.data).columns;
                        this.tableData.data = this.changeZero(result.data.data).data;
                    }

                    // console.log('result.data.data',JSON.stringify(result.data.data));
                } else {
                    // console.log(" 获取表格数据错误", result.data.err_code);
                }
            },

            //0.0 转换成 0  什么鬼需求
            changeZero(data) {
                data.data = data.data.map((item, index) => {
                    item.make_score == '0.0' && (item.make_score = 0);
                    item.design_score == '0.0' && (item.design_score = 0);
                    item.communicate_score == '0.0' && (item.communicate_score = 0);
                    return item;
                });
                return data;
            },

            //获取评级列表
            async getLevelList(user_id) {
                let result = await api.getUserLevelList(this.addAccToken({user_id: user_id}));
                //   console.log("getLevelList", JSON.stringify(result));
                return result.data.err_code == 0 ? result.data.data : [];
                //result.data.err_code == 0
            },
            //表格单行点击
            async rowClick(user) {
                // alert(JSON.stringify(user))
                this.modals.user = user;
                this.alerts = true;
                this.modals.user.levelData = await this.getLevelList(
                    this.modals.user.user_id
                );
                // console.log('this.modals.user.levelData',this.modals.user.levelData);
                if (this.modals.user.levelData.length > 0) {
                    this.modals.user.levelData.forEach((item, index) => {
                        if (item.name == this.modals.user.level) {
                            this.modals.user.level = item.id;
                        }
                    });
                }
                this.getUserInfoById(this.modals.user.user_id);
                this.getChartData();

            },
            bubble() {
                let text = this.$lau.bubble.teamAide;
                this.$nextTick(() => {
                    let defaultOptions = [
                        {
                            id: 'teamChartsText',
                            position: 'right',
                            title: text[0].title,
                            content: text[0].content,
                            relative: 'body',
                        },
                    ];
                    setTimeout(() => {
                        this.$bubble(defaultOptions);
                    }, 300);
                });
            },
            //分页切换
            onPageChange(currentPage) {
                this.getTeamPowerData(currentPage);
            },
            //展示提示信息
            showPageInfo() {
                // console.log('展示提示信息');
            },
            //select change
            async changeTable() {
                // console.log('this.selectDuty',this.selectDuty)
                let param = {
                    page: 1,
                    limit: 10,
                    select: this.selectKeyWord,
                    department: this.selectDepartment,
                    job: this.selectDuty
                };

                if (param.department === '') {
                    delete param.department;
                }
                if (param.job === '') {
                    delete param.job;
                }
                // console.log('changeTable:',JSON.stringify(param))
                let result = await api.getTeamPowerData(this.addAccToken(param));
                if (result.data.err_code == 0) {
                    result.data.data.columns = result.data.data.columns.filter(
                        (item, index) => {
                            if (item.key != "level" && item.key != "user_id") {
                                return item;
                            }
                        }
                    );
                    this.tableData.columns = this.changeZero(result.data.data).columns;
                    this.tableData.data = this.changeZero(result.data.data).data;
                } else {
                    // console.log(" 获取表格数据错误", result.data.err_code);
                }
            },

            /**
             * 部门列表
             */
            deptListData() {
                let data = {
                    company_id: JSON.parse(Cookies.get("company")).company_id //company_id1
                };
                this.$store.dispatch("fetchDeptList", data);
                // console.log('deptList',this.deptList)
            },

            /**
             * 职位列表
             */
            dutyListData() {
                api.beGoodAtFun({}).then(res => {
                    if (res.data.err_code == 0) {
                        this.dutyList = res.data.data;
                        // console.log('dutyList',JSON.stringify(res.data.data))
                    }
                });
                // let data = {
                //   company_id: JSON.parse(Cookies.get("company")).company_id // company_id1
                // };
                // this.$store.dispatch("fetchDutyList", data);
            },

            //修改用户信息
            async changeSelectInfo(type, e) {
                let param = {
                    type: type,
                    user_id: this.modals.user.user_id,
                    value: e.target.value
                };

                this.updateUserInfo(param);
            },
            //修改等级
            async changLeve() {
                //   console.log("评分正在改变：", this.modals.user.level);
                let param = {
                    type: "level_id",
                    user_id: this.modals.user.user_id,
                    value: this.modals.user.level
                };
                this.updateUserInfo(param);
            },
            //同步数据到table
            asyncUserDataTotable() {
                this.tableData.data = this.tableData.data.map((item, index) => {
                    if (item.user_id == this.modals.user.user_id) {
                        this.tableData.data[index] = this.modals.user;
                    }
                    return this.tableData.data[index];
                });

            },
            //修改评分
            async changeScore(nowChart, index, index2, e) {
                //   console.log("e", e.target.value);
                let name = this.modals.chartData[nowChart].legend[index];
                // console.log("失去焦点:"+name, nowChart + "1" + index + "1" + index2);
                name == '薪资' && (name = '历史薪资');
                let type = this.getType(name);
                let param = {
                    user_id: this.modals.user.user_id,
                    type: type,
                    value: e.target.value,
                    time: this.modals.chartData[nowChart].mouths[index2]
                };
                //this.updateUserInfo(param);
                //修改评分
                await api.updateUserScore(this.addAccToken(param)).then(res => {
                    if (res.data.err_code == 0) {
                        this.$Message.info("修改成功");
                        if (param.type == "level_id" || param.type == "per_day" || param.type == "wages") {
                            this.asyncUserDataTotable();
                        } else {
                            // console.log('this.tableData.data',JSON.stringify(this.tableData.columns))
                            //如果是知错评分 设计评分 沟通评分  则替换表格内容
                            this.tableData.data = this.tableData.data.map((item, indexT) => {
                                if (item.user_id == this.modals.user.user_id && index2 == 5) {
                                    let newVal = parseFloat(e.target.value);
                                    let arrV = (newVal + '').split('.');
                                    arrV[1] == '0' && (newVal = parseInt(arrV[0]));
                                    this.tableData.data[indexT][type] = newVal;
                                    // console.log('this.tableData.data[indexT]',this.tableData.data[indexT]);
                                    //求综合评分
                                    // console.log('3',parseFloat(this.tableData.data[indexT]['make_score']));
                                    let newScore =
                                        ((parseFloat(this.tableData.data[indexT].make_score) +
                                            parseFloat(this.tableData.data[indexT].communicate_score) +
                                            parseFloat(this.tableData.data[indexT].design_score)) / 3).toFixed(1);
                                    let arr = (newScore + '').split('.');
                                    arr[1] == '0' && (newScore = parseInt(arr[0]));
                                    this.tableData.data[indexT].comprehensive_score = newScore;
                                }
                                // console.log('综合',this.tableData.data[indexT]['comprehensive_score']);
                                return this.tableData.data[indexT];
                            });
                            this.drawChart();
                        }
                    } else {
                        this.$Message.error(res.data.err_message);
                    }

                });
            },
            //获取用户信息
            getUserInfoById(id) {

                this.modals.user.headImage = "https://yhc-1.oss-cn-shanghai.aliyuncs.com/avatar/" + id;
                // console.log('id:',id)
                // api.getUserInfoById(id).then(res => {
                //   console.log()
                //   if (res.data.err_code == 0) {
                //     this.modals.user.headImage = res.data.headimage;
                //   }
                //   console.log("userinfo........", JSON.stringify(res.data.headimage));
                // });
            },
            //修改字段
            async updateUserInfo(param) {
                //   console.log("修改字段参数：", JSON.stringify(param));
                await api.updateUserScore(this.addAccToken(param)).then(res => {
                    res.data.err_code == 0
                        ? this.$Message.info("修改成功")
                        : this.$Message.error("修改失败：" + res.data.err_message);
                    if (param.type == "level_id" || param.type == "per_day" || param.type == "wages") {
                        this.asyncUserDataTotable();
                    } else {
                        this.drawChart();
                    }
                });
            },
            getType(inval) {
                let type = "";
                switch (inval) {
                    case "待级ID":
                        type = "level_id";
                        break;
                    case "人天":
                        type = "per_day";
                        break;
                    case "薪资":
                        type = "wages";
                        break;
                    case "制作评分":
                        type = "make_score";
                        break;
                    case "设计评分":
                        type = "design_score";
                        break;
                    case "沟通评分":
                        type = "communicate_score";
                        break;
                    case "评论评分":
                        type = "evaluate_score";
                        break;
                    case "历史薪资":
                        type = "wages_history";
                        break;
                    default:
                        break;
                }
                return type;
            },
            ok() {
                //this.$Message.info('Clicked ok');
            },
            cancel() {
                //this.$Message.info('Clicked cancel');
            },
            addAccToken(data) {
                let newData = Object.assign(data, {acc_token: this.acc_token});
                return newData;
            },
            //选择图表
            checkChart(index) {

                this.modals.nowChart = index;
                this.$PublicFuns.drawEchart(() => this.drawChart());
            },
            //获取图表数据
            async getChartData() {
                let result = await api.getTeamPowerChartData(this.addAccToken({
                    user_id: this.modals.user.user_id
                }));
                if (result.data.err_code == 0) {
                    this.modals.chartData = result.data.data;
                    this.$PublicFuns.drawEchart(() => this.drawChart());
                    if (result.data.guide === 'teamAide') {
                        this.bubble();
                    }
                } else {
                    // console.log("获取图表数据出错 err_code", result.data.err_code);
                }
            },
            drawChart() {
                let echarts = require("echarts");
                let lengths = this.modals.chartData[this.modals.nowChart].legend.length;
                let numChart = echarts.init(document.getElementById("charBox"), 'ehcartTheme');
                let option = {
                    color: this.GLOBAL.echartCFG.colors,
                    tooltip: {
                        trigger: "axis",
                        formatter: "{b0}<br/>{a0}:{c0}", //+ this.unit,
                        formatter: function (params) {
                            let unit = "分";
                            var relVal = params[0].name + "月";
                            // console.log(JSON.stringify(params))
                            for (var i = 0; i < params.length; i++) {
                                //if(i == 2) unit = '%'
                                relVal +=
                                    '<div class="circle" ><span style="background:' +
                                    '#333333' +
                                    '"></span>' +
                                    params[i].seriesName +
                                    " : " +
                                    params[i].value +
                                    unit +
                                    "</div>";
                            }
                            return relVal;
                        },
                        axisPointer: {
                            type: "cross"
                        }
                    },
                    grid: {
                        left: "0%",
                        right: "0%",
                        bottom: "0%",
                        top: "30",
                        containLabel: true
                    },
                    legend: {
                        data: this.modals.chartData[this.modals.nowChart].legend, //['能力评分','薪资评分','效率评分'],
                        x: "right"
                        //y: 16,
                    },
                    xAxis: [
                        {
                            type: "category",
                            axisTick: {
                                alignWithLabel: true
                            },
                            data: this.modals.chartData[this.modals.nowChart].mouths,
                            axisLine: {
                                lineStyle: {
                                    color: "#9E9E9E"
                                }
                            },
                            axisLabel: {
                                formatter: "{value}"
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "分",
                            position: "left",
                            offset: 0,
                            axisLine: {
                                lineStyle: {
                                    color: "#9E9E9E"
                                }
                            },
                            axisLabel: {
                                formatter: "{value}"
                            }
                        }
                    ],

                    series: this.modals.chartData[this.modals.nowChart].datas.map(
                        (item, index) => {
                            let seriesOne = {
                                name: this.modals.chartData[this.modals.nowChart].legend[index],
                                type: "line",
                                data: item
                            };

                            return seriesOne;
                        }
                    )
                };
                //   console.log(JSON.stringify(option));
                numChart.setOption(option, true);
            }
        },
        watch: {
            async nowtype(newVal, oldVal) {
                let params = {};
                newVal == "按部门" && (params = {type: "department"});
                let result = await api.getTeamPowerData(this.addAccToken(params));
                if (result.data.err_code == 0) {
                    this.tableData.total = result.data.data.total;
                    // this.deptList.map((item,index)=>{
                    //     let has = false;
                    //     console.log('333',result.data.data.total)
                    //     result.data.data.total.child.forEach((item2,index2)=>{
                    //       console.log(item2.name)
                    //       if(item2.name == item.name){
                    //         has = true
                    //       }
                    //     })
                    //     if(!has && newVal == "按部门" && item.name != '未分配部门' ){
                    //       console.log('item.name',item.name)
                    //       let noDepart = {
                    //         "name": item.name,
                    //         "count": "0",
                    //         "wages": 0,
                    //         "make_time": 0,
                    //         "pass": 0
                    //       }
                    //       this.tableData.total.child.push(noDepart);
                    //     }
                    // })

                    //console.log(' this.tableData.total',JSON.stringify(this.tableData.total));
                } else {
                    // console.log(" getTeamPowerData error", result.data.err_code);
                }
            }
        },
        filters: {
            ckSocer: function (value) {
                // console.log('cksocer')
                if (value < 5) {
                    // alert('评分不能大于5');
                    return 9;
                } else {
                    return value;
                }
            }
        }
    };
</script>
<style lang="less">
    .select-box {
        margin: 8px 16px;
        width: 100%;
        .ivu-input {
            height: 39px !important;
            font-size: 13px !important;
        }
        .ivu-input-group-append .ivu-icon {
            font-size: @fs20;
            margin-top: 4px;
        }

        .ivu-select-selection {
            // border: 1px solid #eef1f2 !important;
        }
    }

    .content-box {
        color: @black_3;
        position: relative;
        min-width: 1500px;
        margin-bottom: 30px;
        &-left {
            .ivu-tooltip-popper[x-placement^="bottom"] .ivu-tooltip-arrow {
                border-bottom-color: #ffffff;
                width: 0;
                height: 0;
                border-width: 5px;
                position: relative;
                border-style: solid;
                top: -1px;
                z-index: 1;
                border-color: transparent transparent #71e2d0 transparent;
            }
            .ivu-tooltip-inner {
                z-index: 300;
                background-color: #ffffff;
                color: @black_3;
                max-width: 700px;
                line-height: 26px;
                padding: 15px 15px;
                box-shadow: 0 1px 6px rgba(113, 226, 208, 0.9);
                font-size: 13px;

                .notice-head {
                    color: #fccd64;
                    padding-bottom: 15px;
                    border-bottom: 1px solid @black_4;
                    .iconfonts {
                        color: #fccd64;
                    }
                }
                .notice-content {
                    line-height: 50px;
                    color: @black_2;
                    span {
                        color: @black_3;
                    }
                    .green {
                        color: @base;
                    }
                }
            }
            .ivu-table {
                color: @black_3;
            }
            .ivu-table th {
                background-color: #fafbfb;
                font-size: 12px;
                font-weight: 500;
            }
            .ivu-table-wrapper {
                border-top: 1px solid #dddee1;
                border-left: 0px;
            }
            .ivu-table:after {
                background-color: transparent;
            }
            margin-right: 430px;

            min-height: 810px !important;
            overflow: hidden;
            width: auto !important;
            background-color: #ffffff;
        }
        &-page {
            margin: 15px 15px;
            float: right;
            .ivu-page-item-jump-next:after,
            .ivu-page-item-jump-prev:after {
                display: inline-block;
            }
        }

        &-right {
            overflow: hidden;
            width: 400px;
            position: absolute;
            right: 0;
            top: 0;
            background-color: #ffffff;
            .ivu-radio-checked .ivu-radio-inner {
                border-color: @base;
            }
            .ivu-radio-inner:after {
                background-color: @base;
            }
            .info {
                display: flex;
                justify-content: space-around;
                flex-flow: column wrap;
                .column {
                    border-bottom: 1px solid @black_4;
                    display: flex;
                    font-size: 14px;
                    color: @black_2;
                    justify-content: flex-start;
                    flex-flow: row nowrap;
                    line-height: 50px;
                    height: 50px;
                    div {
                        flex: 1;
                        text-align: center;
                    }
                }
                .column.infoHead {
                    color: @black_3;
                    border: 1px solid #f2f9f9;
                    line-height: 20px;
                    height: 65px;
                    padding-top: 10px;
                    font-size: 15px;
                    border-radius: 6px;
                    text-align: center;
                    div {
                        border-right: 1px solid #f2f9f9;
                    }
                }
                .column.allnum {
                    font-size: 18px;
                    color: @black_1;
                }
                .column div:nth-child(1) {
                    color: @black_3;
                    font-size: 14px;
                }
            }
        }
        .content-box-left{
            min-width: 1000px;
        }
    }

    .power-modals {
        color: @black_3;
        .lefts {
            float: left;
            text-align: center;
            width: 220px;
            border-right: 1px solid #f2f2f2;
            padding-right: 30px;
            select {
                direction: rtl;
            }
            select option {
                direction: ltr;
            }
            .headInfo {

                .ivu-avatar-large.ivu-avatar-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 30px;
                    font-size: 40px;
                    line-height: 50px;
                    margin: 15px auto;
                    margin-bottom: 5px;
                }
                p {
                    line-height: 30px;
                    span {
                        border: 1px solid @black_4;
                        border-radius: 2px 2px;
                        padding: 3px 10px;
                    }
                }
                p.uName {
                    font-size: 14px;
                    color: @black_1;
                }
            }
            .money {
                width: 100%;
                border: 0px solid @red;
                text-align: left;
                font-size: 14px;
                vertical-align: bottom;
                div {
                    margin-top: 15px;
                    margin-bottom: 15px;
                    span {
                        color: @black_2;
                    }
                    input {
                        border: 0;
                        border-bottom: 1px solid @black_4;
                        width: 140px;
                        text-align: right;
                        color: @black_2;
                    }

                    .ivu-select-small {
                        margin: 0 0;
                        .ivu-select-selection {
                            margin: 0 0;
                            border: 0;
                            border-bottom: 1px solid @black_4
                        }
                        .ivu-select-dropdown {
                            margin: 0 0;
                        }
                        .ivu-select-arrow {
                            right: 1px;
                        }

                        .ivu-select-selected-value {
                            line-height: 24px !important;
                            height: 24px !important;
                        }

                    }
                    // select {
                    //   border: 0;
                    //   border-bottom: 1px solid @black_4;
                    //   width: 140px;
                    //   margin: 0px 0px;
                    //   float: right;
                    //   color: @black_2;
                    //   option{
                    //     background-color:@base;
                    //     :focus{
                    //       background-color:@base;
                    //       color:red;
                    //     }
                    //   }
                    // }
                }
            }

            ul.historyFinish {
                li {
                    display: flex;
                    justify-content: space-between;
                    flex-flow: row nowrap;
                    line-height: 36px;
                    div:nth-child(2) {
                        color: #999999;
                        font-size: 16px;
                    }
                }
            }
        }

        .rights {
            width: 690px;
            float: right;
            // border:1px solid #f2f2f2;
            .charts {
                width: 100%;
                display: flex;
                // height: 230px;
                overflow: hidden;
                justify-content: space-between;
                &-text {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    margin-right: 25px;
                    font-size: 16px;
                    width: 65px;
                    div {
                        cursor: pointer;
                        margin: 20px 0;
                        width: 32px;
                    }
                    .actives {
                        color: @base;
                        border-bottom: 2px solid @base;
                    }
                }
                &-chart {
                    // flex: 1;
                    &-chartBox {
                    }
                }
            }

            ul.score {
                // border:1px solid red;
                margin-top: 35px;
                li {
                    margin-top: 28px;
                    display: flex;
                    justify-content: space-between;

                    span {
                        font-size: 13px;
                        display: inline-block;
                        margin-right: 20px;
                    }
                    div {
                        border-bottom: 1px solid @black_4;

                        width: 609px;
                        display: flex;
                        justify-content: space-around;
                        input {
                            width: 103px;
                            border: 0;
                            border-bottom: 0px solid @black_4;
                            margin: 0 0;
                            color: @black_2;
                            text-align: center;
                            font-size: 16px;
                        }
                        p {
                            width: 103px;
                            border: 0;
                            border-bottom: 0px solid @black_4;
                            margin: 0 0;
                            color: @black_2;
                            text-align: center;
                            font-size: 16px;
                        }
                    }
                }
            }
        }
    }

    .teamPowerList {

    }
</style>
