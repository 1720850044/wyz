<template>
<div>
    <div :id="biddingColor.echartID" class="echartLine"></div>
    <span v-show="cFlag">{{biddingData}}</span>
</div>
</template>
<script>
export default {
    data(){
        return {
            cData: [],
            cTime: [],
            cFlag: false,
            cTitle: '',
            lengendTitle: '',
            //unit:'' //单位
        };
    },
    props: ['biddingColor', 'biddingData'],
    computed: {
        unit(){
            switch (this.cTitle) {
                case '中标率':
                    this.lengendTitle = '中标率'; 
                    return '%';
                    break;
                case '收入走势' :
                    this.lengendTitle = '实际收入'; 
                    return '元';
                    break;
                case '承接项目走势':
                    this.lengendTitle = '承接项目'; 
                    return '个';    
                case '质量走势':
                    this.lengendTitle = '平均评价'; 
                    return '分';
                    break;   
                case '成员空闲走势':
                    this.lengendTitle = '平均空闲'; 
                    return '小时';
                    break;  
                default:
                    return '';    
                    break;
            }
        }
    },
    mounted(){
            // console.log('图表数据',JSON.stringify(this.cData));
            // console.log('单位是'+this.unit)
        this.$PublicFuns.drawEchart(()=>{
            this.myCharts(this.biddingColor.Cstart, this.biddingColor.Cend, this.biddingColor.Cline, this.biddingColor.echartID);
        });
        
    },
    updated(){
        this.cData=this.biddingData.data;
        this.cTime=this.biddingData.time;
        this.cTitle=this.biddingColor.cTitle;

        this.$PublicFuns.drawEchart(()=>{
            this.myCharts(this.biddingColor.Cstart, this.biddingColor.Cend, this.biddingColor.Cline, this.biddingColor.echartID);
        });
        
    },
    methods: {
        
        myCharts(Cstart, Cend, Cline, echartID){
            // console.log('图表数据',JSON.stringify(this.cData));
            // console.log('单位是'+this.unit)
            let _this=this;
            let echarts = require('echarts');
            let myChart = echarts.init(document.getElementById(echartID), 'echartTheme');
            // 绘制图表
            myChart.setOption({
                
                tooltip: {
                    trigger: 'axis',
                    formatter: ' {b0}<br/>{a0}:{c0}'+this.unit,
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            // formatter: function (params) {
                            //     return params.value
                            //        // + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            // }
                        }
                    }
                   // backgroundColor: 'rgba(92,201,173,0.8)'  // 工具提示背景
                },
                grid: {
                    left: '2%',
                    right: '1%',
                    bottom: '2%',
                    top: '5%',
                    containLabel: true
                },
                toolbox: {},
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: _this.cTime,
                    axisLabel: {
                        inside: false,
                        textStyle: {
                            color: '#9f9f9f',
                            padding: [5, 10, 0, 0]
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,

                    },
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {

                            width: 1,
                        }
                    },
                    axisLabel: {
                        inside: false,
                        textStyle: { // Y轴文字颜色,距离
                            color: '#9f9f9f',
                            padding: [0, 10, 0, 0]
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitNumber: 3 // Y轴刻度值
                },
                series: [
                    {
                        name: _this.lengendTitle,
                        type: 'line',
                        stack: '总量',
                        data: _this.cData,
                        // color:Cline, // 折线颜色
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: Cstart // 渐变开始颜色
                                }, {
                                    offset: 1,
                                    color: Cend // 渐变结束颜色
                                }])
                            }
                        },
                    },
                ]
                // echartEnd
            });
        }
    }
};
</script>
<style>
    .echartLine{
        height:200px;
    }
</style>

