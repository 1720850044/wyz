<template>
    <div id="RtaskTJDiv">
        <div class="taskTongji">
            <span>{{$t('workbench.work_taskTrend')}}</span>
            <div>
                <button @click="creentTabIndex = 0" :class="{'creentTabSty':creentTabIndex == 0}">{{$t('workbench.work_teamWorkMonthTag')}}</button>
                <button @click="creentTabIndex = 1" :class="{'creentTabSty':creentTabIndex == 1}">{{$t('workbench.work_teamWorkYaerTag')}}</button>
            </div>
        </div>
        <div id="TaskTrend" class="TaskTrend"></div>
    </div>
</template>

<script>
    import api from 'api';
    export default {
        name: "task",
        data(){
            return {
                creentTabIndex: 0,
                dataList: {
                    mouthData: {},
                    yearData: {}
                    // mouthData: {
                    //     year:'2018',
                    //     mounth:[1,2,3,4,5,6,7,8,9,10,11,12],
                    //     taskNum:[10,20,30,40,50,60,70,80,90,100,110,120]
                    // },
                    // yearData:{
                    //     year:['2010','2011','2012','2013','2014','2015','2016','2017','2018'],
                    //     taskNum:[100,150,200,250,300,350,400,450,500]
                    // }
                },
            };
        },
        watch: {
            creentTabIndex(value){
                if (value){
                    this.DrawTaskTrendYearEchart();
                } else {
                    this.DrawTaskTrendEMounthEchart();
                }
            }
        },
        methods: {
            DrawTaskTrendEMounthEchart(){
                let _this = this;
                let numChart = echarts.init(document.getElementById('TaskTrend'), 'ehcartTheme');
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            return i18n.t('workbench.work_allocatedTaskNumber')+' : '+params[0].value+i18n.t('workbench.work_geTag');
                        }
                    },
                    grid: {
                        top: '20px',
                        left: '15px',
                        right: '15px',
                        bottom: '0',
                        containLabel: true
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: _this.dataList.mouthData.mounth,
                        axisTick: {       //y轴刻度线
                            show: false
                        },
                        splitLine: {     //网格线
                            show: true,
                            lineStyle: {
                                color: '#e5e5e5'
                            }
                        },
                        axisLine: {       //y轴
                            show: false
                        },
                        axisLabel: {
                            align: 'center',
                            color: '#7a7a7a',
                            fontWeight: 'lighter',
                            formatter: function(val) {
                                return val+i18n.t('workbench.work_teamWorkMonthTag')+"\n"+_this.dataList.mouthData.year;
                            }
                        }
                    },
                    series: [
                        {
                            type: 'line',
                            data: _this.dataList.mouthData.taskNum,
                            lineStyle: {
                                type: 'dashed',
                                color: '#FF9800',
                                width: 1
                            },
                            itemStyle: {
                                color: '#f44336'
                            }
                        },
                    ]
                };
                numChart.setOption(option, true);
            },
            DrawTaskTrendYearEchart(){
                let _this = this;
                let myChart = echarts.init(document.getElementById('TaskTrend'), 'ehcartTheme');
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            return i18n.t('workbench.work_allocatedTaskNumber')+' : '+params[0].value+' 个';
                        }
                    },
                    grid: {
                        top: '20px',
                        left: _this.GLOBAL.echartCFG.gridLeft,
                        right: _this.GLOBAL.echartCFG.gridRight,
                        bottom: '0',
                        containLabel: true
                    },
                    xAxis: {
                        data: _this.dataList.yearData.year,
                        axisTick: {       //X轴刻度线
                            show: false,
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#b9b9b9'
                            }
                        },
                    },
                    yAxis: {
                        max: _this.dataList.yearData.yearMax,
                        axisTick: {       //y轴刻度线
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#b9b9b9'
                            }
                        },
                    },
                    series: {
                        type: 'bar',
                        data: _this.dataList.yearData.taskNum,
                        barWidth: '30%',
                        itemStyle: {
                            color: '#3cd2b4'
                        }
                    }
                };
                myChart.setOption(option, true);
            },
            async getMemberChartTaskNum(){
                let res = await api.getMemberChartTaskData();
                if (res.data.err_code == 0){
                    this.dataList.mouthData = res.data.data.mouthData;
                    this.dataList.yearData = res.data.data.yearData;
                    let yearMax = 10;
                    res.data.data.yearData.taskNum.forEach((creent, index, arr)=>{
                        if (creent > yearMax){
                            yearMax = creent;
                        }
                    });
                    this.dataList.yearData.yearMax = yearMax;
                    // console.log(this.dataList.yearData)
                    this.$PublicFuns.drawEchart(()=>{
                        this.DrawTaskTrendEMounthEchart();
                    });
                }
            }
        },
        mounted(){
            this.getMemberChartTaskNum();
        }
    };
</script>

<style lang="less" scoped></style>
