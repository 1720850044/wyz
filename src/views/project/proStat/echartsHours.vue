<template>
    <div>
        <span v-show="flag">{{xAxis}}</span>
        <div id="EHours"></div>
    </div>
</template>
<script>
  // 基于准备好的dom，初始化echarts实例
    export default{
        data(){
            return {
                flag: false,
                projectID: 0,
                date: [],
                xAxis: [],
                legend: [],
                seriesData: [],
                seriesDataTwo: []
            };
        },
        mounted(){
            this.projectID=sessionStorage.projectID;
            this.autoHeight();
            this.dataGet();
            this.echarts2();
        },
        updated(){
            this.echarts2();
        },
        activated(){
            this.echarts2();
        },
        methods: {
            dataGet(){
                let _this=this;
                let url=_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_total_member_work_time+"&project_id="+this.projectID;
                _this.$axios.get(url).then(msg=>{
                    let MsgData=msg.data.data;
                    _this.xAxis=MsgData.xAxis.data;
                    _this.legend=MsgData.xAxis.legend;

                    _this.seriesData=MsgData.series[0].data;
                    _this.seriesDataTwo=MsgData.series[1].data;
                    console.log(MsgData);

                }, ()=>{
                    console.log("请求失败！");
                });
            },
            autoHeight(){
                let getH=document.body.clientHeight-200;
                document.getElementById("EHours").style.height=getH+"px";
            },
            echarts2(){
                var echarts = require('echarts');
                var echartHours =echarts.init(document.getElementById('EHours'), 'ehcartTheme');
          // 绘制图表
                echartHours.setOption({
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(255,255,255,1)',
                        borderColor: '#d6d6d6',
                        borderWidth: 1,
                        padding: 12,
                        textStyle: {
                            color: '#000'
                        },
                    },
                    grid: {
                        left: '0px',
                        right: '0px',
                        bottom: '55px',
                        top: '30px',
                        containLabel: true
                    },
                    color: ['#d7d7d7', '#00cc00'],
                    xAxis: {
                        data: this.xAxis,
                        axisTick: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#18bfa4'
                            }
                        },
                    },
                    legend: this.legend,
                    yAxis: {
                        splitLine: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#18bfa4'
                            }
                        },
                    },
                    animationDurationUpdate: 100,
                    dataZoom: [{
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,
                        fillerColor: "rgba(190,221,216,0.8)",
                        height: 30
                    }],

                    series: [

                        {
                            name: '预定工时',
                            type: 'bar',
                            silent: true,
                            barWidth: 40,
                            barGap: '-100%',
                            data: this.seriesData
                        },
                        {
                            name: '已用工时',
                            type: 'bar',
                            barWidth: 40,
                            z: 10,
                            data: this.seriesDataTwo,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: 'black'
                                    }
                                }
                            }
                        }
                    ],
                });

            }
        }
    };
</script>

