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
    import api from 'api';
    export default {
        name: "quality",
        data(){
            return {
                creentTabIndex: 0,
                dataList: {
                    mouthData: {},
                    yearData: {},
                    // mounthData: {
                    //     year:'2018',
                    //     mounth:[1,2,3,4,5,6,7,8,9,10,11,12],
                    //     feedback:[5,20,15,6,53,25,3,58,76,95,24,1],
                    //     score:[2,3,3.5,3.8,4,2.5,2,5,4.5,2.6,4.5,3]
                    // },
                    // yearData:{
                    //     year:['2010','2011','2012','2013','2014','2015','2016','2017','2018'],
                    //     feedback:[200,190,180,170,160,150,190,180,170],
                    //     score:[4,4.5,4.8,4.9,5,4.8,3,4,2]
                    // }
                },
                feedback: [200, 190, 180, 170, 160, 150, 190, 180, 170, 250]
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
                            max: _this.dataList.mouthData.moutMax,
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
                        data: _this.dataList.mouthData.mounth,
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
                                return val+i18n.t('workbench.work_teamWorkMonthTag')+"\n"+_this.dataList.mouthData.year;
                            }
                        }
                    },
                    series: [
                        {
                            type: 'line',
                            data: _this.dataList.mouthData.feedback,
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
                            data: _this.dataList.mouthData.score,
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
                            max: _this.dataList.yearData.yearMax,
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
                        data: _this.dataList.yearData.year,
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
                            data: _this.dataList.yearData.feedback,
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
                            data: _this.dataList.yearData.score,
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
            async getMemberChartTaskQuality(){
                let res = await api.getMemberChartTaskQualityData();
                if (res.data.err_code == 0){
                    this.dataList.mouthData = res.data.data.mouthData;
                    this.dataList.yearData = res.data.data.yearData;
                    let moutMax=10;let yearMax = 10;
                    res.data.data.mouthData.feedback.forEach((creent, index, arr)=>{
                        if (creent > moutMax){
                            moutMax = creent;
                        }
                    });
                    res.data.data.yearData.feedback.forEach((creent, index, arr)=>{
                        if (creent > yearMax){
                            yearMax = creent;
                        }
                    });
                    this.dataList.mouthData.moutMax = moutMax;
                    this.dataList.yearData.yearMax = yearMax;
                    this.$PublicFuns.drawEchart(()=>{
                        this.qualityTrendMounthEcharts();
                    });
                }
            }
        },
        mounted(){
            this.getMemberChartTaskQuality();

        }
    };
</script>

<style scoped>

</style>
