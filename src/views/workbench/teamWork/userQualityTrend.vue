<template>
    <div id="RtaskTJDiv">
        <div class="taskTongji">
            <span>{{$t('workbench.work_qualityTrend')}}</span>
            <div>
                <button @click="creentTabIndex = 0" :class="{'creentTabSty':creentTabIndex == 0}">{{$t('workbench.work_teamWorkMonthTag')}}</button>
                <button @click="creentTabIndex = 1" :class="{'creentTabSty':creentTabIndex == 1}">{{$t('workbench.work_teamWorkYaerTag')}}</button>
            </div>
        </div>
        <div class="TaskTrend" id="qualityTrend">

        </div>
    </div>
</template>

<script>
    export default {
        props: {
            taskQuality: {
                type: Object,
                default: ()=>({
                    mouthData: {},
                    yearData: {}
                })
            }
        },
        data(){
            return {
                creentTabIndex: 0
            };
        },
        watch: {
            creentTabIndex(value){
                if (value){
                    this.qualityTrendYearEcharts();
                } else {
                    this.qualityTrendMounthEcharts();
                }
            }
        },
        methods: {
            qualityTrendMounthEcharts(){
                let _this = this;
                let myChart = echarts.init(document.getElementById('qualityTrend'), 'ehcartTheme');
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            return `<span>${i18n.t('workbench.work_averageFeedback')} : ${params[0].value} ${i18n.t('workbench.work_ciText')}</br>${i18n.t('workbench.work_averageNumber')} ：${params[1].value} ${i18n.t('workbench.work_fenText')}</span>`;
                            // return '<span>平均反馈：'+params[0].value+' 次</br>平均分数：'+params[1].value+' 分</span>';
                        }
                    },
                    grid: {
                        top: '40px',
                        left: '15px',
                        right: '15px',
                        bottom: '0',
                        containLabel: true
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: i18n.t('workbench.work_feedBackNumber'),
                            nameLocation: 'end',
                            min: 0,
                            max: _this.taskQuality.mouthData.moutMax,
                            splitLine: {
                                show: false,
                            },
                            // interval: 100 / 2,
                            axisLabel: {
                                formatter: '{value}',
                                color: '#bdbdbd',
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#bdbdbd',
                                }
                            }
                        },
                        {
                            type: 'value',
                            name: i18n.t('workbench.work_taskScore'),
                            nameLocation: 'end',
                            min: 0,
                            max: 5,
                            splitLine: {
                                show: false,
                            },
                            interval: 5 / 2,
                            axisLabel: {
                                formatter: '{value}',
                                color: '#bdbdbd'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#bdbdbd',
                                }
                            }
                        }
                    ],
                    xAxis: {
                        // boundaryGap:false,
                        type: 'category',
                        data: _this.taskQuality.mouthData.mounth,
                        axisTick: {       //y轴刻度线
                            show: false
                        },
                        splitLine: {     //网格线
                            show: false,
                        },
                        axisLine: {       //y轴
                            show: false
                        },
                        axisLabel: {
                            align: 'center',
                            color: '#7a7a7a',
                            fontWeight: 'lighter',
                            formatter: function(val) {
                                return val+i18n.t('workbench.work_teamWorkMonthTag')+"\n"+_this.taskQuality.mouthData.year;
                            }
                        }
                    },
                    series: [
                        {
                            type: 'line',
                            data: _this.taskQuality.mouthData.feedback,
                            yAxisIndex: 0,
                            lineStyle: {
                                type: 'dashed',
                                color: '#FF9800',
                                width: 1
                            },
                            itemStyle: {
                                color: '#f44336'
                            }
                        },
                        {
                            type: 'bar',
                            data: _this.taskQuality.mouthData.score,
                            yAxisIndex: 1,
                            barWidth: '30%',
                            itemStyle: {
                                color: '#3cd2b4'
                            }
                        },
                    ]
                };
                myChart.setOption(option, true);
            },
            qualityTrendYearEcharts(){
                let _this = this;
                let myChart = echarts.init(document.getElementById('qualityTrend'), 'ehcartTheme');
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            return `<span>${i18n.t('workbench.work_averageFeedback')} : ${params[0].value} ${i18n.t('workbench.work_ciText')}</br>${i18n.t('workbench.work_averageNumber')} ：${params[1].value} ${i18n.t('workbench.work_fenText')}</span>`;

                            // return '<span>平均反馈：'+params[0].value+' 次</br>平均分数：'+params[1].value+' 分</span>';
                        }
                    },
                    grid: {
                        top: '40px',
                        left: 0,
                        right: 0,
                        bottom: '0',
                        containLabel: true
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: i18n.t('workbench.work_feedBackNumber'),
                            min: 0,
                            max: _this.taskQuality.yearData.yearMax,
                            nameLocation: 'end',
                            splitLine: {
                                show: false,
                            },
                            // interval: 200 / 2,
                            axisLabel: {
                                formatter: '{value}',
                                color: '#bdbdbd',
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#bdbdbd',
                                }
                            }
                        },
                        {
                            type: 'value',
                            name: i18n.t('workbench.work_taskScore'),
                            min: 0,
                            max: 5,
                            nameLocation: 'end',
                            splitLine: {
                                show: false,
                            },
                            interval: 5 / 2,
                            axisLabel: {
                                formatter: '{value}',
                                color: '#bdbdbd'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#bdbdbd',
                                }
                            }
                        }
                    ],
                    xAxis: {
                        // boundaryGap:false,
                        type: 'category',
                        data: _this.taskQuality.yearData.year,
                        axisTick: {       //y轴刻度线
                            show: false
                        },
                        splitLine: {     //网格线
                            show: false,
                        },
                        axisLine: {       //y轴
                            show: false
                        },
                        axisLabel: {
                            align: 'center',
                            color: '#7a7a7a',
                            fontWeight: 'lighter',
                            // formatter:function(val) {
                            //     return val+'月'+"\n"+_this.dataList.mounthData.year
                            // }
                        }
                    },
                    series: [
                        {
                            type: 'line',
                            data: _this.taskQuality.yearData.feedback,
                            yAxisIndex: 0,
                            lineStyle: {
                                type: 'dashed',
                                color: '#FF9800',
                                width: 1
                            },
                            itemStyle: {
                                color: '#f44336'
                            }
                        },
                        {
                            type: 'bar',
                            data: _this.taskQuality.yearData.score,
                            yAxisIndex: 1,
                            barWidth: '30%',
                            itemStyle: {
                                color: '#3cd2b4'
                            }
                        },
                    ]
                };
                myChart.setOption(option, true);
            }
        },
        mounted(){

            let moutMax=10;let yearMax = 10;
            this.taskQuality.mouthData.feedback.forEach((creent, index, arr)=>{
                if (creent > moutMax){
                    moutMax = creent;
                }
            });
            this.taskQuality.yearData.feedback.forEach((creent, index, arr)=>{
                if (creent > yearMax){
                    yearMax = creent;
                }
            });
            this.taskQuality.mouthData.moutMax = moutMax;
            this.taskQuality.yearData.yearMax = yearMax;
            this.$PublicFuns.drawEchart(()=>{
                this.qualityTrendMounthEcharts();
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
