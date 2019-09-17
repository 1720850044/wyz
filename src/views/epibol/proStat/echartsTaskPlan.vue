<template>
    <div>
        <h2>项目任务进度<span v-show="flag">{{date}}</span></h2>
        <div id="echartLine"></div>
    </div>
</template>
<script>
  export default{
      data(){
          return {
              projectID: 0,
              date: [],
              flag: false,
              dateName: [],
              EchData: []
          };
      },
      mounted(){
          this.projectID=sessionStorage.projectID;
          this.dataGet();
          this.autoHeight();
          this.myCharts();
      },
      updated(){
          this.myCharts();
      },
      activated(){
          this.myCharts();
      },
      methods: {
          dataGet(){
              let _this=this;
              let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_total_status_by_all+"&project_id="+this.projectID;
              _this.$axios.get(url).then(msg=>{
                  let msgData=msg.data;
                  if (msgData.err_code==0){
                      _this.date=msgData.data.data;
                      if (msgData.data.series!=undefined){
                          let dateName=msgData.data.series.map(val=>({
                              "name": val.name
                          }));
                          _this.dateName=dateName;
                          let EchData=msgData.data.series.map(val=>({
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
                          _this.EchData=EchData;
                      }
                  }
              });

          },
          autoHeight(){
              let getH=document.body.clientHeight-200;
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
                  color: ['#828282', '#18bfa4', '#ff9900', '#2d8cf0'],
                  legend: {
                      x: 'right',
                      data: this.dateName,

                  },
                  grid: {
                      left: '22px',
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
                      data: this.date
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
                      start: 10,
                      end: 90,
                      fillerColor: "rgba(190,221,216,0.8)",

                  }],
                  series: this.EchData
              });
          }
      }
  };

</script>

