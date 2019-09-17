<!--进度-->
<template>
    <div style="height:100%">
        <div class="taskTip"><span>任务数量：<b>{{data.all_task_num}}</b> </span><span>已完成：<b>{{data.complete_task_num}}</b> </span><span>剩作：<b>{{data.surplus_task_num}}</b> </span><span>待审文件：<b>{{data.wait_review}}</b></span></div>
        <div id="echartLine"></div>
        <span v-show="flag">{{EcherDate}}</span>
    </div>
</template>

<script>
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
          this.myCharts();
      },
      updated(){
          this.myCharts();
      },
      methods: {
          getData(){
              let _this=this;
              let projectID=sessionStorage.projectID;
              let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_task_progress_chart+"&project_id="+projectID;
              _this.$axios.get(url).then(msg=>{
                  let MsgData=msg.data.data;
                  console.log("msgData233f", MsgData);
                  _this.data=MsgData;
                  _this.EcherDate=MsgData.data;
                  if (!MsgData.series){
                      MsgData.series = [];
                  }
                  let EchartData=MsgData.series.map(val=>({
                      name: val.name,
                      type: 'line',
                      data: val.data,
                      itemStyle: {normal: {
                          lineStyle: {
                            type: 'dotted'
                        },
                          borderWidth: 4
                      }
                      }
                  }));
                  _this.EchartData=EchartData;

                  MsgData.series.forEach(val => {
                      _this.EcherName.push({"name": val.name});
                  });

              });
          },
          autoHeight(){
              let getH=document.body.clientHeight-420;
              document.getElementById("echartLine").style.height=getH+"px";
          },
          myCharts(){
              var echarts = require('echarts');
              var myChart = echarts.init(document.getElementById('echartLine'), 'ehcartTheme');
        // 绘制图表
              myChart.setOption({
                  tooltip: {
                      trigger: 'item',
                      backgroundColor: 'rgba(255,255,255,1)',
                      borderColor: '#d6d6d6',
                      borderWidth: 1,
                      padding: 12,
                      textStyle: {
                          color: '#000'
                      },
                      formatter: '时间 ：{b0}<br />{a} : {c}'
                  },
                  color: ['#828282', '#18bfa4', '#ff9900'],
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
<style>
    .taskTip{position:absolute;margin-top:5px;margin-left:40px;}
    .taskTip span{margin-right:20px;}
    .taskTip span b{color:#ff9900;}
</style>
