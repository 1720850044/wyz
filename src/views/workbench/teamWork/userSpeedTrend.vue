<template>
    <div id="RtaskTJDiv">
        <div class="taskTongji">
            <span>{{$t('workbench.work_speedTrend')}}</span>
            <div>
                <button @click="creentTabIndex = 0" :class="{'creentTabSty':creentTabIndex == 0}">{{$t('workbench.work_teamWorkMonthTag')}}</button>
                <button @click="creentTabIndex = 1" :class="{'creentTabSty':creentTabIndex == 1}">{{$t('workbench.work_teamWorkYaerTag')}}</button>
            </div>
        </div>
        <div class="TaskTrend TaskSpeed">
            <div class="allTaskAverageTime">
                <p>
                    <b>{{AverageTime}}</b> <i>{{$t('workbench.work_hoursText')}}</i>
                </p>
                <span>{{$t('workbench.work_allTaskAverageTime')}}</span>
            </div>
            <div id="speedTrend"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            taskSpeed: {
                type: Object,
                default: () => ({
                    mouthData: {},
                    yearData: {}
                })
            }
        },
        data() {
            return {
                creentTabIndex: 0,
                AverageTime: 0
            };
        },
        watch: {
            creentTabIndex(value){
                if (value){
                    this.DrawSpeedReendYearEchart();
                    this.AverageTime = this.taskSpeed.yearData.AverageTime;
                } else {
                    this.DrawSpeedTrendMounthEchart();
                    this.AverageTime = this.taskSpeed.mouthData.AverageTime;
                }
            }
        },
        methods: {
            DrawSpeedTrendMounthEchart() {
                let _this = this;
                let myChart = echarts.init(document.getElementById('speedTrend'), 'ehcartTheme');
                let option = {
                    title: {
                        // text: '任务走势',
                        // subtext:'testTile',
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            return i18n.t('workbench.work_taskAverageTime')+' : ' + params[0].value + i18n.t('workbench.work_hoursText');
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
                            show: false,
                            lineStyle: {
                                color: '#f44336'
                            }
                        },
                        axisTick: {
                            show: false,
                        }
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        // name:'商品类型',
                        data: _this.taskSpeed.mouthData.mounth,
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
                                return val + i18n.t('workbench.work_teamWorkMonthTag') + "\n" + _this.taskSpeed.mouthData.year;
                            }
                        }
                    },
                    series: [
                        {
                            type: 'line',
                            data: _this.taskSpeed.mouthData.taskTime,
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
                myChart.setOption(option, true);
            },
            DrawSpeedReendYearEchart() {
                let _this = this;
                let myChart = echarts.init(document.getElementById('speedTrend'), 'ehcartTheme');
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            return i18n.t('workbench.work_taskAverageTime')+' : ' + params[0].value + i18n.t('workbench.work_hoursText');
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
                        data: _this.taskSpeed.yearData.year,
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
                        max: _this.taskSpeed.yearData.yearMax,
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
                        data: _this.taskSpeed.yearData.taskTime,
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
            this.AverageTime = this.taskSpeed.mouthData.AverageTime;
            let yearMax = 10;
            this.taskSpeed.yearData.taskTime.forEach((creent, index, arr) => {
                if (creent > yearMax) {
                    yearMax = creent;
                }
            });
            this.taskSpeed.yearData.yearMax = yearMax;
            this.$PublicFuns.drawEchart(() => {
                this.DrawSpeedTrendMounthEchart();
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
        .TaskSpeed{
            display: flex;
            justify-content: space-between;
            .allTaskAverageTime{
                width: 25%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                p{
                    width: 95px;
                    height: 95px;
                    line-height: 95px;
                    border-radius: 100%;
                    background: #36d2b25c;
                    text-align: center;
                    margin-bottom: 20px;
                    b{color: #33c3a1bf;font-size: 20px}
                    i{color: #6d636396;font-style: normal}
                }
            };
            #speedTrend{
                width: 75%;
                background: @white;
            }
        }
        #speedTrend{
            width: 100%;
            height: 100%;
        }
    }
</style>

