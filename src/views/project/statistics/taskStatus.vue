<!--statistics.vue 项目统计页-->

<template>
    <div>
    <Row :gutter="30"  >
        <Col span="24" class-name='bgw' v-if="isshow">
            <div class="itemBox base-card">
              <div class="base-card-head" >
                <div class="base-card-operation-head" >任务状态统计</div>
                <div class="base-card-operation-icon" @click="goTaskComp" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
                <!-- <div style="clear:both"></div> -->
              </div>
              <company-echars v-if="objData.data"
                :objData="objData"
                :isTitle = "false"
                :starEndDate = "starEndDate"
                :projectId = "project_id"
                :timeRange = "'timeRange'"
                :formatter = "'任务状态统计'"
                :accToken="powerToken"
                :censusType = "'heap'"
                :echarsUrl="echarsUrl">
             </company-echars>
             <template v-else>
                <div style="height: 720px">
                    <loading></loading>
                </div>
            </template>
              <!-- <div class="itemBox-CheckboxGroup">
                <RadioGroup v-model="taskStatusData.nowType" type="button" @on-change="renderChart">
                    <Radio label="每日数据"></Radio>
                    <Radio label="每周数据"></Radio>
                </RadioGroup>
              </div>
              <div id='getTaskStatusDayChart' class="itemBox-chartBox" ></div> -->
            </div>
        </Col>
    </Row>


    </div>
</template>
<script>
    import CompanyEchars from "../../../components/CompanyEchars.vue";
    import { onlyAPI } from "../../../axios/apiConfig"
    import api from "api";
    import {statisticsByProject, statisticsCount, statisticsTaskCount} from '@/axios/modules/project/projectStatistics.js';
// var qs = require("querystring");
    import mainNative from "../../main-components/mainNative.vue";
    export default {
        components: {
            CompanyEchars,
            mainNative
        },

        beforeMount() {},
        data() {
            return {
                objData: {},
                echarsUrl: '',
                starEndDate: [],
                powerToken: '',
                project_id: 0,
                countData: {
                    delay: {},
                    quality: {},
                    schedule: {}
                },
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
            this.project_id = sessionStorage.getItem('projectID');
            this.initFun().then(() => {
                this.getDataInfo();
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
                if (res.data.err_code == 0) {
                    this.powerToken = res.data.data.acc_token;
                } else {
                    this.$Message.error(res.data.err_message);
                }
                return this.powerToken;
            },
            getDataInfo () {
                var self = this;
                this.echarsUrl = this.GLOBAL.baseRouter + this.$GLOBALAPI.project_task_status;
                this.$axios.post(this.echarsUrl,{
                    'project_id': sessionStorage.getItem('projectID'),
                    'acc_token': self.powerToken
                }).then(this.getDataSuess);
            },
            getDataSuess (res) {
                this.objData = res.data.data;
                this.starEndDate = res.data.data.particle_range_most.split(',');
                //console.log(res.data.data)
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
            async getProjectData(id) {
                let {data} = await statisticsCount({project_id: id});
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
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            label: "hehe",
                            data: this.taskStatusData.week.not_beginData
                        },
                        {
                            name: "正在制作的任务",
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            label: "hehe",
                            data: this.taskStatusData.week.workData
                        },
                        {
                            name: "暂停的任务",
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            label: "hehe",
                            data: this.taskStatusData.week.pauseData
                        },
                        {
                            name: "完成的任务",
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            label: "hehe",
                            data: this.taskStatusData.week.completeData
                        },
                        {
                            name: "已内审的次数",
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            label: "hehe",
                            data: this.taskStatusData.week.inside_auditData
                        },
                        {
                            name: "已外审的次数",
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
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
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            
                            label: "hehe",
                            data: this.taskStatusData.day.not_beginData
                        },
                        {
                            name: "正在制作的任务",
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            label: "hehe",
                            data: this.taskStatusData.day.workData
                        },
                        {
                            name: "暂停的任务",
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            
                            label: "hehe",
                            data: this.taskStatusData.day.pauseData
                        },
                        {
                            name: "完成的任务",
                            
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            label: "hehe",
                            data: this.taskStatusData.day.completeData
                        },
                        {
                            name: "已内审的次数",
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            
                            label: "hehe",
                            data: this.taskStatusData.day.inside_auditData
                        },
                        {
                            name: "已外审的次数",
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
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
<style>
.ivu-col-span-6 {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
</style>

<style lang="less" scoped>
.base-card-head {
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin: 0 !important;
}
.itemBox {
  position: relative;
}
</style>

