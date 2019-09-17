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
    export default {
        props: {
            taskNum: {
                type: Object,
                default: ()=>({
                    mouthData: {},
                    yearData: {}
                })
            }
        },
        data() {
            return {
                creentTabIndex: 0
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
            DrawTaskTrendEMounthEchart() {
                let _this = this;
                let numChart = echarts.init(document.getElementById('TaskTrend'), 'ehcartTheme');
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            return i18n.t('workbench.work_allocatedTaskNumber')+' : ' + params[0].value + i18n.t('workbench.work_geTag');
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
                        data: _this.taskNum.mouthData.mounth,
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
                            formatter: function (val) {
                                return val + i18n.t('workbench.work_teamWorkMonthTag') + "\n" + _this.taskNum.mouthData.year;
                            }
                        }
                    },
                    series: [
                        {
                            type: 'line',
                            data: _this.taskNum.mouthData.taskNum,
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
                            return i18n.t('workbench.work_allocatedTaskNumber')+' : '+params[0].value + i18n.t('workbench.work_geTag');
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
                        data: _this.taskNum.yearData.year,
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
                        max: _this.taskNum.yearData.yearMax,
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
                        data: _this.taskNum.yearData.taskNum,
                        barWidth: '30%',
                        itemStyle: {
                            color: '#3cd2b4'
                        }
                    }
                };
                myChart.setOption(option, true);
            }
        },
        mounted() {
            this.$PublicFuns.drawEchart(() => {
                this.DrawTaskTrendEMounthEchart();
            });
        }
    };
</script>

<style lang="less" scoped>
    #RtaskTJDiv{
        .base-card;
        background: @white;
        /*border: 1px solid #efefef;*/
        margin-bottom: 15px;
        .taskTongji{
            display: flex;
            justify-content: space-between;
            span{
                font-size: 15px;
            }
            button{
                border: 0;
                float: left;
                padding: 2px 10px;
                cursor: pointer;
                color: @white;
                border-radius: 2px;
                outline: none;
                background: @black_4;
                &.creentTabSty{
                    background: @base !important;
                    color: @white;
                };
            }

        }
        .TaskTrend{width: 100%;height: 220px}
    }
</style>
