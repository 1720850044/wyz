<template>
    <div>
        <h2>成员任务统计 <span v-show='flag'>{{eData}}</span></h2>
        <div id="echartTask"></div>
    </div>
</template>
<style>
    #echartTask{margin-top:10px;}
</style>
<script>
  export default{
      data () {
          return {
              eData: [],
              tData: [],
              nData: [],
              flag: false,
              projectID: 0
          };
      },
      mounted(){
          this.projectID=sessionStorage.projectID;
          this.autoHeight();
          this.dataGet();
          this.myCharts();
      },
      updated(){
          this.myCharts();
      },
      activated(){
          this.myCharts();
      },
      methods: {
          autoHeight(){
              let getH=document.body.clientHeight-200;
              document.getElementById("echartTask").style.height=getH+"px";
          },
          dataGet(){
              let _this=this;
              let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_task_total+'&project_id='+this.projectID;
              _this.$axios.get(url).then((msg)=>{
                  let Mdata=msg.data.data;
                  _this.eData=Mdata.data;
                  _this.tData=Mdata.series[0].data;
                  _this.nData=Mdata.series[1].data;

              });
          },
          myCharts(){
              var echarts = require('echarts');
              var myChart = echarts.init(document.getElementById('echartTask'), 'ehcartTheme');
        // 绘制图表
              myChart.setOption({

                  color: ['#37a2da', '#67e0e3', '#ffdb5c', '#a768b9', '#ff9f7f', '#fb7293', '#e7bcf3', '#8378ea', '#96bfff', '#37a2da'],
                  tooltip: {
                      trigger: 'item',
                      formatter: "{a} <br/>{b}: {c} ({d}%)"
                  },
                  legend: {
                      orient: 'vertical',
                      x: 'left',
                      data: this.eData
                  },
                  series: [
                      {
                          name: '任务类型',
                          type: 'pie',
                          selectedMode: 'single',
                          radius: [0, '30%'],

                          label: {
                              normal: {
                                position: 'inner'
                            }
                          },
                          labelLine: {
                              normal: {
                                show: false
                            }
                          },
                          data: this.tData
                      },
                      {
                          name: '统计',
                          type: 'pie',
                          radius: ['40%', '55%'],
                          label: {
                              normal: {
                                show: true,
                                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                backgroundColor: '#eee',
                                borderColor: '#aaa',
                                borderWidth: 1,
                                borderRadius: 4,
                                rich: {
                                  a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                  hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                  b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                  per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                              }
                            }
                          },
                          data: this.nData
                      }
                  ]

              });
          }
      }
  };

</script>

