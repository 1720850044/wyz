<!--member.vue 项目统计->任务状态统计 -->
<template>
    <div>
        <Row :gutter="30"  >

            <Col span="24" class-name='bgw'>
                <div class="itemBox base-card" >
                    <div class="base-card-head">
                        <div class="base-card-operation-head" >任务用时</div>
                        <div class="base-card-operation-icon"  ><!--p class="iconfonts icon-shenglve-"></p--></div>
                        <div style="clear:both"></div>
                    </div>
                    <!-- <div id='taskTimeChart' class="itemBox-chartBox" style="position:relative">
                        <nothink type="project" text="暂无数据" v-if="taskTimeData.isNull == true"></nothink>

                    </div> -->
                    <task-echars v-if="MemberObjData.data"
                        :objData="MemberObjData" 
                        :isDate = "false"
                        :isRadio = "false" 
                        :isTitle = "false"
                        :isRoll = "false"
                        :accToken="powerToken"
                        :formatter = "'task'"
                        :censusType = "'bar'"
                        :dataZoom = "dataZoom"
                        :dataZoomRoll = "dataZoomRoll"
                        :echarsId = "'taskRate22'"
                        :stack = "true"
                        :chain = "true"
                        :projectId = "project_id"
                        :echarsUrl="MemberEcharsUrl">
                    </task-echars>
                   <template v-else>
                        <div style="height: 720px">
                            <loading></loading>
                        </div>
                    </template>
                </div>
            </Col>
        </Row>

    </div>
</template>
<script>
    import {statisticsWorkByProject, statisticsAuditRate} from '@/axios/modules/project/projectStatistics.js';
    import TaskEchars from "../../../components/TaskEchars.vue";
    import { onlyAPI } from "../../../axios/apiConfig"
    import api from "api";
    export default {
        data() {
            return {
                objData: {},
                MemberObjData: {},
                echarsUrl: '',
                MemberEcharsUrl: '',
                powerToken: '',
                project_id: 0,
                taskTimeData: {
                    legend: ['制作小时数', '反馈小时数', '修改小时数'],
                    tasktype_name: [], //任务反馈分布
                    seriesData: [],
                    isNull: false
                },
                yAxis: [
                    {name: '审核数量',type: 'value',min: 0},
                    {name: '通过率',type: 'value',min: 0,
                        interval: 100,   //  平均分为5份
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                dataZoomRoll: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        handleSize: 0, //滑动条的 左右2个滑动条的大小
                        height: 20, //组件高度
                        bottom: 5, //右边的距离
                        handleColor: '#CBBCDB', //h滑动图标的颜色
                        handleStyle: {
                            borderColor: "#CBBCDB",
                            borderWidth: "1",
                            shadowBlur: 2,
                            background: "#CBBCDB",
                            shadowColor: "#CBBCDB",
                        },
                        fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                            //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                        //给第一个设置0，第四个设置1，就是垂直渐变
                        offset: 0,
                        color: '#ddd'
                        }, {
                            offset: 1,
                            color: '#ddd'
                        }]),
                        backgroundColor: '#F2F2F2', //两边未选中的滑动条区域的颜色
                        showDataShadow: false, //是否显示数据阴影 默认auto
                        showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
                        handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                        filterMode: 'filter',
                    }
                ],
                dataZoom: [
                    {
                        start: 0, //默认为0
                        end: 20, //默认为100
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        handleSize: 0, //滑动条的 左右2个滑动条的大小
                        height: 20, //组件高度
                        bottom: 5, //右边的距离
                        handleColor: '#CBBCDB', //h滑动图标的颜色
                        handleStyle: {
                            borderColor: "#CBBCDB",
                            borderWidth: "1",
                            shadowBlur: 2,
                            background: "#CBBCDB",
                            shadowColor: "#CBBCDB",
                        },
                        fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                            //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                        //给第一个设置0，第四个设置1，就是垂直渐变
                        offset: 0,
                        color: '#797979'
                        }, {
                            offset: 1,
                            color: '#797979'
                        }]),
                        backgroundColor: '#F2F2F2', //两边未选中的滑动条区域的颜色
                        showDataShadow: false, //是否显示数据阴影 默认auto
                        showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
                        handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                        filterMode: 'filter',
                    }
                ],
                taskPassData: {
                    tasktype_name: [],
                    legend: ['内审通过率', '客户审核通过率'],
                    neiSheng: [],  //内审通过率
                    custCheck: [],  //客户审核通过率
                    isNull: false
                }
            };
        },
        components: {
            TaskEchars
        },
        created() {
            this.initFun().then(() => {
                //this.getTaskTimeInfo();
                this.getMemberInfo();
            });
            let id = sessionStorage.projectID;
            this.$PublicFuns.drawEchart(()=>{
                //this.taskTime(id);
                //this.taskPass(id);
            });

        },
        mounted() {},
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
            getMemberInfo () {
                var self = this;
                this.MemberEcharsUrl = this.GLOBAL.baseRouter + onlyAPI.project_task_work_time;
                this.$axios.post(this.MemberEcharsUrl,{
                    'project_id':self.project_id,
                    'status': null,
                    'project_child_id': null,
                    'tasktype_id':null,
                    'acc_token': self.powerToken
                }).then(this.getMemberSuccess);
            },
            getMemberSuccess (res) {
                this.MemberObjData = res.data.data;
            },
            getTaskTimeInfo () {
                var self = this;
                this.echarsUrl = this.GLOBAL.baseRouter + onlyAPI.project_pt_feedback;
                this.$axios.post(this.echarsUrl,{
                    'project_id':self.project_id,
                    'acc_token': self.powerToken
                }).then(this.getTaskTimeSuccess);
            },
            getTaskTimeSuccess (res) {
                this.objData = res.data.data;
            },
            //任务用时分布
            async taskTime(id) {
                let {data} = await statisticsWorkByProject({project_id: id});
                let res = {data};
                if (res.data.data.length <= 0 || res.data.data == null){
                    this.taskTimeData.isNull = true;
                    return false;
                }
                this.taskTimeData.tasktype_name = res.data.data.map((item, index)=>item.tasktype_name);
                this.taskTimeData.work_time = res.data.data.map((item, index)=>[item.tasktype_name, parseInt(item.work_time)]);
                this.taskTimeData.stage_time = res.data.data.map((item, index)=>[item.tasktype_name, parseInt(item.stage_time)]);
                this.taskTimeData.edit_time = res.data.data.map((item, index)=>[item.tasktype_name, parseInt(item.edit_time)]);
                // console.log('taskTimeData:',JSON.stringify(this.taskTimeData));
                this.$nextTick(()=>{
                    this.getTaskTimeChart('taskTimeChart');
                });
            },

            //截止到统计时 项目任务反馈通过率
            async taskPass(id){
                let {data} = await statisticsAuditRate({project_id: id});
                let res = {data};
                if (res.data.data.length<=0){
                    this.taskPassData.isNull = true;
                    return false;
                }
                this.taskPassData.tasktype_name = res.data.data.map(item=>item.task_name);
                this.taskPassData.neiSheng = res.data.data.map((item, index)=>[item.task_name, Number(item.inside_pass_rate)*100]);
                this.taskPassData.custCheck = res.data.data.map((item, index)=>[item.task_name, Number(item.client_pass_rate)*100]);
                //console.log('项目通过率转换数据：',JSON.stringify(this.taskPassData))
                this.$nextTick(()=>{
                    // this.getTaskPassChart('taskPassChart');
                });

            },
            //通过率
            getTaskPassChart(idName){
                let echarts = require('echarts');
                let passChart = echarts.init(document.getElementById(idName), 'echartTheme');
                passChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params){
                            console.log(params);
                            var relVal = params[0].data[0];
                            for ( var i = 0; i < params.length; i++) {
                                // console.log(params)
                                if (params[i].value ==0) {continue;}
                                relVal += '<div class="circle" ><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span><span>'+params[i].seriesName+': '+params[i].value[1]+'%</span></div>';
                            }
                            return relVal;
                        },
                        axisPointer: {
                            type: 'shadow',
                        }
                    },
                    xAxis: {
                        name: '任务名',
                        data: this.taskPassData.tasktype_name||'暂无数据'
                    },
                    yAxis: {
                        name: '通过率',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    },
                    legend: {data: this.taskPassData.legend},
                    grid: {
                        left: this.GLOBAL.echartCFG.gridLeft,
                        right: this.GLOBAL.echartCFG.gridRight,
                        bottom: "3%",
                        containLabel: true
                    },

                    series: [{
                        name: this.taskPassData.legend[0],
                        symbolSize: 8,
                        data: this.taskPassData.neiSheng,
                        type: 'scatter'
                    }, {
                        name: this.taskPassData.legend[1],
                        symbolSize: 8,
                        data: this.taskPassData.custCheck,
                        type: 'scatter'
                    }
                    ]
                });

            },
            //任务用时分布
            getTaskTimeChart(idName){
                let echarts = require('echarts');
                let TimeChart = echarts.init(document.getElementById(idName), 'echartTheme');
                TimeChart.setOption({

                    legend: {data: this.taskTimeData.legend},
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                        }
                    }, grid: {
                        left: '10',
                        right: this.GLOBAL.echartCFG.gridRight,
                        bottom: 80,
                        containLabel: true
                    }, dataZoom: [{
                        type: 'slider',
                        // start: 0,
                        // end: 12,
                        xAxisIndex: [0],
                    }],
                    xAxis: {
                        name: '任务名',
                        data: this.taskTimeData.tasktype_name
                    },
                    yAxis: {name: '小时'},
                    series: [{
                        name: '制作小时数',
                        symbolSize: 6,
                        data: this.taskTimeData.work_time,
                        type: 'scatter'
                    },
                    //     {
                    //     name: '反馈时间小时数',
                    //     symbolSize: 8,
                    //     data: this.taskTimeData.stage_time,
                    //     type: 'scatter'
                    // },
                    {
                        name: '修改小时数',
                        symbolSize: 8,
                        data: this.taskTimeData.stage_time,
                        type: 'scatter'
                    }]

                });
            },

            goTaskComp() {
                //console.log("gotaskcomp");
                this.$emit("goComp", "task");
            }
        }
    };
</script>
<style lang="less" >
.base-card-head{
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin: 0 !important;
}
</style>
