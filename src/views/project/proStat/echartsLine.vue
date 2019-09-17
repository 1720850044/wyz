<template>
    <div class="echartContainer" style="height:100%;">
        <!--list栏-->
        <div class="taskTip">
            <span>{{$t('project.pro_taskNumber')}}<b>{{data.all_task_num}}</b> </span>
            <span>{{$t('workbench.work_complete')}}<b>{{data.complete_task_num}}</b> </span>
            <span>{{$t('project.pro_production')}}<b>{{data.surplus_task_num}}</b> </span>
            <span>{{$t('project.pro_pendingFiles')}}<b>{{data.wait_review}}</b></span></div>
       <!--图-->
        <div id="echartLine" class="taskEchartLine"></div>
        <!--日期-->
        <span v-show="flag">{{EcherDate}}</span>
    </div>
</template>
<script>
    import {pjTaskChart} from '@/axios/modules/project/projectTask';
    export default{
        data(){
            return {
                EchartData: [],
                EcherName: [],
                EcherDate: [],
                flag: false,
                data: []
            };
        },
        mounted(){
            this.getData();
            this.autoHeight();
      //  this.$PublicFuns.drawEchart(()=>{
      //   this.myCharts();
      //  })

        },
        updated(){
            this.$PublicFuns.drawEchart(()=>{
                this.myCharts();
            });
        },
        methods: {
            async getData(){
                let _this=this;
                let projectID=sessionStorage.projectID;

                let {data} = await pjTaskChart({project_id: projectID});

                let MsgData=data;
                _this.data=MsgData;
                _this.EcherDate=MsgData.data;

            //console.log('222222',MsgData)
                if (!MsgData.series){
                    MsgData.series = [];
                }
                let EchartData=MsgData.series.map(val=>
                //alert((2).toFixed(1));
                  ({
                      name: val.name,
                      type: 'line',
                      data: val.data, //.map((item,index)=>{return item.toFixed(1)}),
                      itemStyle: {normal: {
                          borderWidth: 4
                      }
                      },
                      areaStyle: {normal: {
                          opacity: 0.2
                      }}
                  }));
                _this.EchartData=EchartData;
                MsgData.series.forEach(val => {
                    _this.EcherName.push({"name": val.name});
                });

            },
            autoHeight(){
                let getH=document.body.clientHeight-170;
                document.getElementById("echartLine").style.height=getH+"px";
            },
            myCharts(){
                var echarts = require('echarts');
                var myChart = echarts.init(document.getElementById('echartLine'), 'echartTheme');

                console.log(JSON.stringify(this.EchartData));
        // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(255,255,255,1)',
                        borderColor: '#d6d6d6',
                        borderWidth: 1,
                        padding: 12,
                        textStyle: {
                            color: '#000',
                        },
                        formatter: i18n.t('lang.lang_time')+' ：{b0}<br />{a} : {c}'
                    },
          // color:['#3dcfb7','#fff','@orange'],
                    legend: {
                        x: 'right',
                        data: this.EcherName,
                    },
                    grid: {
                        left: '20px',
                        right: '40px',
                        bottom: '50px',
                        top: '30px',
                        containLabel: true
                    },

            /*X轴*/
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        splitLine: {
                            show: true,
                            lineStyle: {
                              color: '#ccc',
                              width: 1,
                              type: 'dotted'
                          }
                        },
                        splitArea: {
                            show: true,
                            areaStyle: {
                              color: ['rgba(234,244,237,0.2)']
                          }
                        },
                        axisLine: {
                            lineStyle: {
                              color: '#18bfa4'
                          }
                        },
                        data: this.EcherDate
                    },

            /*Y轴*/
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                              color: '#ccc',
                              width: 1,
                              type: 'dotted',
                          }

                        },
                        axisLine: {
                            lineStyle: {
                              color: '#18bfa4'
                          }
                        },
                    },
                    dataZoom: [{
                        height: 30,
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,

                        fillerColor: "rgba(190,221,216,0.8)",

                    }],
                    series: this.EchartData
                });
            }
        }
    };

</script>
<style lang="less">
    .taskTip{position:absolute;margin-top:10px;margin-bottom:10px;margin-left:40px;}
    .taskTip span{margin-right:40px;color:@black_3;}
    .taskTip span b{color:#ff9900;}
    .echartContainer{
        // position: relative;
        // height: 100%;
    }
    .taskEchartLine{

    }
</style>

