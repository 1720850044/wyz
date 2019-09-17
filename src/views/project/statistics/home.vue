<!--statistics.vue 项目统计页-->

<template>
    <div>
    <Row :gutter="30"  >
        <Col span="24" class-name='bgw'>
            <div class="itemBox base-card">
                <div class="itemBox-top-title">
                    <span>进度</span>
                    <!--<em class="icon iconfonts icon-backs"></em>-->
                </div>
                <div class="itemBox-chars">
                    <div class="charSty charsLeft">
                        <p>任务</p>
                        <!--<p>任务<i></i></p>-->
                        <i-circle :percent="countData.schedule.tasks_complete_rate || 0" :size="102" stroke-color="#3bceb6" trail-color="#d0f3ee">
                            <b>{{countData.schedule.tasks_complete_rate || 0}}</b><i>%</i>
                        </i-circle>
                        <div class="numbers numbersSty">
                            <span style="color: #3bceb6">{{countData.schedule.tasks_complete || 0}}</span><i>/{{countData.schedule.tasks_count || 0}}</i>
                        </div>
                    </div>
                    <div class="charSty charsRight">
                        <p>时间</p>
                        <i-circle :percent="countData.schedule.sy_rate || 0" :size="102" stroke-color="@orange" trail-color="#fef1d4">
                            <b>{{countData.schedule.sy_rate || 0}}</b><i>%</i>
                        </i-circle>
                        <div class="numbersSty">
                            剩余<span style="color: @orange">{{countData.schedule.sy_time || 0 }}</span>个工作日
                        </div>
                    </div>
                </div>
            </div>
        </Col>
        <Col span="24" class-name='bgw'>
            <div class="itemBox base-card">
                <div class="itemBox-top-title">
                    <span>延期</span>
                    <!--<em class="icon iconfonts icon-backs"></em>-->
                </div>
                <div class="itemBox-charsCenter">
                    <!--{{countData}}-->
                    <i-circle
                            :size="102"
                            :trail-width="13"
                            :stroke-width="15"
                            :percent="countData.delay.tasks_delay_rate || 0"
                            stroke-linecap="square"
                            trail-color="#ffe1e3"
                            stroke-color="#f44336">
                        <div class="demo-Circle-custom">
                            <span>{{countData.delay.tasks_delay_rate || 0}}</span><i>%</i>
                            <p>任务延期率</p>
                        </div>
                    </i-circle>
                    <div class="charsBottom">
                        <div class="left charSty">
                            <p><span>{{countData.delay.tasks_delay || 0}}</span>个</p>
                            <p><i>已延期</i></p>
                        </div>
                        <div class="right charSty">
                            <p><span>{{countData.delay.tasks_expect_delay || 0}}</span>个</p>
                            <p><i>预估延期</i></p>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
        <Col span="24" class-name='bgw'>
            <div class="itemBox base-card">
                <div class="itemBox-top-title">
                    <span>质量</span>
                    <!--<em class="icon iconfonts icon-backs"></em>-->
                </div>
                <div class="itemBox-chars">
                    <div class="charSty charsLeft">
                        <div class="adopat">内部通过率</div>
                        <!--<p>任务<i></i></p>-->
                        <i-circle :percent="countData.quality.inside_pass || 0" :size="102" stroke-color="#3bceb6" trail-color="#d0f3ee">
                            <b>{{countData.quality.inside_pass || 0}}</b><i>%</i>
                        </i-circle>
                        <div class="numbersSty">
                            内部待审资源<span style="color: #4CAF50"> {{countData.quality.inside_wait || 0}} </span>个
                        </div>
                    </div>
                    <div class="charSty charsRight">
                        <div class="adopat">客户通过率</div>
                        <i-circle :percent="countData.quality.outside_pass || 0" :size="102" stroke-color="#FF9800" trail-color="#fef1d4">
                            <b>{{countData.quality.outside_pass || 0}}</b><i>%</i>
                        </i-circle>
                        <div class="numbersSty">
                            外部待审资源<span style="color: #4CAF50"> {{countData.quality.outside_wait || 0}} </span>个
                        </div>
                    </div>
                </div>
            </div>
        </Col>
        <Col span="24" class-name='bgw' v-if="false">
            <div class="itemBox base-card" style="margin-top:30px">
              <div class="base-card-head" >
                <div class="base-card-operation-head" >任务状态分布</div>
                <div class="base-card-operation-icon" @click="goTaskComp" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
                <div style="clear:both"></div>
              </div>
              <div class="itemBox-CheckboxGroup">
                <RadioGroup v-model="taskStatusData.nowType" type="button" @on-change="renderChart">
                    <Radio label="每日数据"></Radio>
                    <Radio label="每周数据"></Radio>
                </RadioGroup>
              </div>
              <div id='getTaskStatusDayChart' class="itemBox-chartBox" ></div>
            </div>
        </Col>
        <Col span="24" class-name='bgw' v-if="false">
            <div class="itemBox base-card" style="margin-top:30px">
              <div class="base-card-head">
                <div class="base-card-operation-head" >成员任务数量</div>
                <div class="base-card-operation-icon" @click="goMemberComp" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
                <div style="clear:both"></div>
              </div>

                <div id='memberTaskNum' class="itemBox-chartBox" ></div>
            </div>
        </Col>
    </Row>


    </div>
</template>
<script>
    import {statisticsByProject, statisticsCount, statisticsTaskCount} from '@/axios/modules/project/projectStatistics.js';
// var qs = require("querystring");
    import { onlyAPI } from "../../../axios/apiConfig"
    import mainNative from "../../main-components/mainNative.vue";
    import api from "api";
    export default {
        components: {
            mainNative
        },

        beforeMount() {},
        data() {
            return {
                countData: {
                    delay: {},
                    quality: {},
                    schedule: {}
                },
                powerToken: '',
                projectUsers: [], //成员
                echartStatusDays: [], //日期
                echartStatusWeeks: [],
                taskStatusArr: [
                    "未开始的任务",
                    "正在制作的任务",
                    "暂停的任务",
                    "完成的任务",
                    "已内审的次数",
                    "已外审的次数"
                ],
                taskStatus: {
                    not_begin: "未开始的任务", //当天未开始的任务
                    work: "正在制作的任务", //当天正在制作的任务
                    pause: "暂停的任务", //当天暂停的任务
                    complete: "完成的任务", //当天完成的任务
                    inside_audit: "已内审的次数", //当天已内审的次数
                    client_audit: "已外审的次数" //当天已外审的次数
                },
                taskStatusData: {
                    nowType: '每日数据',
                    day: {
                        dayData: [],
                        not_beginData: [],
                        workData: [],
                        pauseData: [],
                        completeData: [],
                        inside_auditData: [],
                        client_auditData: []
                    },
                    week: {
                        weekData: [],
                        not_beginData: [],
                        workData: [],
                        pauseData: [],
                        completeData: [],
                        inside_auditData: [],
                        client_auditData: []
                    }
                },
                memberTaskNumData: {
                    xAxis: [],
                    task_num: [],
                    total_task: 5
                },
                isshow: true
            };
        },

        created() {
            let id = sessionStorage.projectID;
            this.initFun().then(() => {
                this.getProjectData(id,this.powerToken);
            });
        },
        mounted() {
            let id = sessionStorage.projectID;
            this.$PublicFuns.drawEchart(()=>{
          //项目数量统计
                //this.getProjectData(id);
          //任务状态
                //this.getStatus(id);
          //成员任务数量
                //this.getMemberTaskNum(id);
            });
        },
        methods: {
            async initFun() {
                const res = await api.getProjectIndex();
                this.project_id = sessionStorage.getItem('projectID')-0;
                if (res.data.err_code == 0) {
                    this.powerToken = res.data.data.acc_token;
                } else {
                    this.$Message.error(res.data.err_message);
                }
                return this.powerToken;
            },
            renderChart(){
                this.taskStatusData.nowType == '每周数据' ? this.getTaskStatusWeekChart('getTaskStatusDayChart') : this.getTaskStatusDayChart('getTaskStatusDayChart');
            },
    //成员状态
            async getStatus(id) {
      //任务状态
      //console.log("project_id=", id);
                let {data} = await statisticsByProject({ project_id: id });
                let _this = this;
                let res = {data};
                if (res.data.length <= 0) {
                    this.isshow = false;
                    return false;
                } else {
            // 天 相关
                    this.taskStatusData.day.dayData = res.data.day.map((item, index) => item.stat_date);
                    this.taskStatusData.day.not_beginData = res.data.day.map((item, index) => item.not_begin);
                    this.taskStatusData.day.workData = res.data.day.map((item, index) => item.work);
                    this.taskStatusData.day.pauseData = res.data.day.map((item, index) => item.pause);
                    this.taskStatusData.day.completeData = res.data.day.map((item, index) => item.complete);
                    this.taskStatusData.day.inside_auditData = res.data.day.map((item, index) => item.inside_audit);
                    this.taskStatusData.day.client_auditData = res.data.day.map((item, index) => item.client_audit);
            //周 统计
                    this.taskStatusData.week.weekData = res.data.week.map((item, index) => '第'+item.week_day+'周');
                    this.taskStatusData.week.not_beginData = res.data.week.map((item, index) => item.not_begin);
                    this.taskStatusData.week.workData = res.data.week.map((item, index) => item.work);
                    this.taskStatusData.week.pauseData = res.data.week.map((item, index) => item.pause);
                    this.taskStatusData.week.completeData = res.data.week.map((item, index) => item.complete);
                    this.taskStatusData.week.inside_auditData = res.data.week.map((item, index) => item.inside_audit);
                    this.taskStatusData.week.client_auditData = res.data.week.map((item, index) => item.client_audit);
                    this.$nextTick(() => {
                        this.getTaskStatusDayChart("getTaskStatusDayChart");
                    });
                }
            },

    //成员任务数量
            async getMemberTaskNum(id) {
                let {data} = await statisticsTaskCount({project_id: id});
        // console.log('项目统计->成员数量：',JSON.stringify(res.data.data))
                let _this = this;
                let res = {data};
                res.data.data.forEach((item, index) => {
                    _this.memberTaskNumData.xAxis.push(item.realname||'暂无数据');
                    _this.memberTaskNumData.task_num.push(item.task_num);
                    _this.memberTaskNumData.total_task = item.total_task;
                });
        // console.log('newdata',JSON.stringify(_this.memberTaskNumData));
                this.$nextTick(function() {
                    this.getMemberTaskNumChart("memberTaskNum");
                });
            },
    //项目数据
            async getProjectData(id,acc_token) {
                var self = this;
                var params = {
                    'project_id': id,
                    'acc_token': self.powerToken
                }
                let {data} = await this.$axios.post(this.GLOBAL.baseRouter + onlyAPI.project_project_count,params);
                let res = {data};
                this.countData.delay = res.data.data.delay || {};
                this.countData.quality = res.data.data.quality || {};
                this.countData.schedule = res.data.data.schedule || {};
            },
      //状态图表
            getTaskStatusWeekChart(idName) {
                let echarts = require("echarts");
                let bbChart = echarts.init(document.getElementById(idName), 'echartTheme');
      //console.log('weekdata',JSON.stringify(this.taskStatusData.week.weekData))
                bbChart.clear();
                bbChart.setOption({
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
                        type: "line" // 默认为直线，可选为：'line' | 'shadow'
                    }
                    },
                    legend: {
                        top: 15,
                        data: this.taskStatusArr
                    },
                    grid: {
                        left: this.GLOBAL.echartCFG.gridLeft,
                        right: this.GLOBAL.echartCFG.gridRight,
                        bottom: "15%",
                        containLabel: true
                    },

                    xAxis: [
                        {
                            type: "category",
                            data: this.taskStatusData.week.weekData
                        }
                    ], dataZoom: [{
                    type: 'slider',
                // start: 0,
                // end: 12,
                    xAxisIndex: [0],
                }],
                    yAxis: [
                        {
                            type: "value",
                            axisLabel: {
                            formatter: "{value}",
                            color: "#bdbdbd"
                        }
                        }
                    ], //:['当天未开始的任务','当天正在制作的任务','当天暂停的任务','当天完成的任务','当天已内审的次数','当天已外审的次数'
                    series: [
                        {
                            name: "未开始的任务",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.week.not_beginData
                        },
                        {
                            name: "正在制作的任务",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.week.workData
                        },
                        {
                            name: "暂停的任务",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.week.pauseData
                        },
                        {
                            name: "完成的任务",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.week.completeData
                        },
                        {
                            name: "已内审的次数",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.week.inside_auditData
                        },
                        {
                            name: "已外审的次数",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.week.client_auditData
                        }
                    ]
                });
            },
    //状态图表
            getTaskStatusDayChart(idName) {
                let echarts = require("echarts");
                let bbChart = echarts.init(document.getElementById(idName), 'echartTheme');
                bbChart.clear();
                bbChart.setOption({

                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
                        type: "line" // 默认为直线，可选为：'line' | 'shadow'
                    }
                    },
                    legend: {
                        top: 15,
                        data: this.taskStatusArr
                    },
                    grid: {
                        left: this.GLOBAL.echartCFG.gridLeft,
                        right: this.GLOBAL.echartCFG.gridRight,
                        bottom: "15%",
                        containLabel: true
                    }, dataZoom: [{
                    type: 'slider',
                // start: 0,
                // end: 12,
                    xAxisIndex: [0],
                }],
                    xAxis: [
                        {
                            type: "category",
                            data: this.taskStatusData.day.dayData
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            axisLabel: {
                            formatter: "{value}",
              // color: "#bdbdbd"
                        }
                        }
                    ], //:['当天未开始的任务','当天正在制作的任务','当天暂停的任务','当天完成的任务','当天已内审的次数','当天已外审的次数'
                    series: [
                        {
                            name: "未开始的任务",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.day.not_beginData
                        },
                        {
                            name: "正在制作的任务",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.day.workData
                        },
                        {
                            name: "暂停的任务",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.day.pauseData
                        },
                        {
                            name: "完成的任务",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.day.completeData
                        },
                        {
                            name: "已内审的次数",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.day.inside_auditData
                        },
                        {
                            name: "已外审的次数",
                            type: "bar",
                            barWidth: "10%",
                            label: "hehe",
                            data: this.taskStatusData.day.client_auditData
                        }
                    ]
                });
            },
    //生成成员任务数量图表
            getMemberTaskNumChart(idName) {
                let echarts = require("echarts");
                let numChart = echarts.init(document.getElementById(idName), 'echartTheme');
                numChart.setOption({

                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    },
                        formatter: function(params){

                        var relVal = '';
                        for ( var i = 0; i < params.length; i++) {
                  // console.log(params[i])
                  // if(params[i].value ==0) continue
                          relVal += '<div class="circle" ><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+';"></span><span>'+params[i].seriesName+': '+params[i].value+(i?'%':'个')+'</span></div>';
                      }
                        return relVal;
                    },
                    },
                    legend: {
                        data: ["任务数量", "百分比"]
                    },
                    grid: {
                        left: this.GLOBAL.echartCFG.gridLeft,
                        right: this.GLOBAL.echartCFG.gridRight,
                        bottom: "50",
                        containLabel: true
                    }, dataZoom: [{
                    type: 'slider',
                // start: 0,
                // end: 12,
                    xAxisIndex: [0],
                }],
                    xAxis: [
                        {
                            type: "category",
                            data: this.memberTaskNumData.xAxis,
                            axisTick: {
                            alignWithLabel: true
                        }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            min: 0,
                            max: 100
                        },
                        {
                            type: "value",
                            name: "百分比",
                            min: 0,
                            max: 100,
                            position: "right",
                            offset: 0,
                            axisLabel: {
                            formatter: "{value}%",
              // color: "#bdbdbd"
                        },
                        }
                    ],
                    series: [
                        {
                            name: "任务数量",
                            type: "bar",
                            barWidth: "60%",
                            label: "hehe",
                            data: this.memberTaskNumData.task_num
                        },
                        {
                            name: "任务占比",
                            data: this.memberTaskNumData.task_num.map(item =>
              parseInt((item / this.memberTaskNumData.total_task) * 100)
            ),
                            type: "line"
                        }
                    ]
                });
            },
            goTaskComp() {
                this.$emit("goComp", "task");
            },
            goMemberComp() {
                this.$emit("goComp", "member");
            }
        }
    };
</script>
<style scoped>
.itemBox-chars .charSty p {
    right: 40%;
}
.itemBox-charsCenter .charsBottom .charSty{
    margin-top:15px;
}
.itemBox-chars .charsLeft {
    margin-left:100px;
}
.itemBox-top-title{
    position: absolute;
    top: 50px;
    left: 60px;
}
.itemBox-chars {
    margin-top: 35px;
}
.itemBox-charsCenter {
    /* margin-left:100px; */
    clear: both;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: inherit;
}
</style>


