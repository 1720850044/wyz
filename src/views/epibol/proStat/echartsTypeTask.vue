<template>
    <div>
        <h2>任务类型工时统计<span v-show="flag">{{xAxis}}</span></h2>
        <div id="echartTypeTask"></div>
    </div>
</template>
<style>
</style>
<script>
  export default{
      data(){
          return {
              flag: false,
              xAxis: [],
              series: []
          };
      },
      mounted(){
          this.autoHeight();
          this.getData();
          this.myCharts();
      },
      updated(){
          this.myCharts();
      },
      activated(){
          this.myCharts();
      },
      methods: {
          getData(){
              let _this=this;
              let projectID=sessionStorage.projectID;
              let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_task_type_work_time_total+'&project_id='+projectID;
              _this.$axios.get(url).then(msg=>{
                  let MsgData=msg.data.data;
                  this.xAxis=MsgData.xAxis.data;
                  this.series=MsgData.series.data;
              });
          },
          autoHeight(){
              let getH=document.body.clientHeight-200;
              document.getElementById("echartTypeTask").style.height=getH+"px";
          },
          myCharts(){
              var echarts = require('echarts');
              echarts.dataTool = require("echarts/extension/dataTool");
              var myChart = echarts.init(document.getElementById('echartTypeTask'), 'ehcartTheme');
              var data = echarts.dataTool.prepareBoxplotData(this.series);
              myChart.setOption({
                  color: ['#006555'],
                  title: {
                      x: 'center',
                      y: 20,
                      textStyle: {
                          color: '#3259B8',
                          fontSize: 16,
                          fontWeight: 'normal',
                      },
                  },
                  tooltip: {
                      trigger: 'item',
                      axisPointer: {
                          type: 'shadow'
                      }
                  },
                  grid: {
                      left: '40',
                      right: '10',
                  },
                  xAxis: {
                      type: 'category',
                      data: this.xAxis,
                      nameTextStyle: {
                          color: '#3259B8',
                          fontSize: 14,

                      },
                      axisTick: {
                          show: false,
                      },
                      axisLine: {
                          lineStyle: {
                            color: '#18bfa4'
                        }
                      },
                      splitLine: {
                          show: false
                      }
                  },

                  yAxis: {
                      type: 'value',
                      nameTextStyle: {
                          color: '#3259B8',
                          fontSize: 14,
                      },
                      axisLabel: {
                          formatter: '{value}'
                      },
                      axisTick: {
                          show: false,
                      },
                      axisLine: {
                          lineStyle: {
                            color: '#18bfa4'
                        }
                      },
                      splitLine: {
                          lineStyle: {
                            color: '#18bfa4',
                            type: 'dotted'
                        },
                      }

                  },
                  series: [{
                      name: 'boxplot',
                      type: 'boxplot',
                      data: data.boxData,
                      itemStyle: {
                          normal: {
                            borderColor: {
                              type: 'linear',
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [{
                                offset: 0,
                                color: '#F02FC2' // 0% 处的颜色
                            }, {
                              offset: 1,
                              color: '#3EACE5' // 100% 处的颜色
                          }],
                              globalCoord: false // 缺省为 false
                          },
                            borderWidth: 2,
                            color: {
                              type: 'linear',
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [{
                                offset: 0,
                                color: 'rgba(240,47,194,0.7)'  // 0% 处的颜色
                            }, {
                              offset: 1,
                              color: 'rgba(62,172,299,0.7)' // 100% 处的颜色
                          }],
                              globalCoord: false // 缺省为 false
                          },
                        }
                      },
                      tooltip: {
                          formatter: function(param) {
                            return [
                              ' ' + param.name + ': ',
                              '最高工时: ' + param.data[1],
                              '最低工时: ' + param.data[2],
                              '平均工时: ' + param.data[3]
                          ].join('<br/>');
                        }
                      }
                  },
                  {
                      name: 'outlier',
                      type: 'scatter',
                      data: data.outliers
                  }
                  ]

              });

          }
      }
  };
</script>
