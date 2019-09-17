<template>
    <div>
       <span v-show='flag'>{{series}}</span>
        <div id="echartStyle"></div>
    </div>
</template>
<script>
  export default{
      data(){
          return {
              projectID: 0,
              series: [],
              data: [],
              flag: false,
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
          dataGet(){
              let _this=this;
              let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_work_time_rate+'&project_id='+this.projectID;
              _this.$axios.get(url).then((msg)=>{
                  let Mdata=msg.data.data;
                  _this.series=Mdata.series;
                  _this.data=Mdata.data;

              });
          },
          autoHeight(){
              let getH=document.body.clientHeight-200;
              document.getElementById("echartStyle").style.height=getH+"px";
          },
          myCharts(){
              var echarts = require('echarts');
              var myChart = echarts.init(document.getElementById('echartStyle'), 'ehcartTheme');
        // 绘制图表
              myChart.setOption({
                  color: ['#37a2da', "#67e0e3", "#ffdb5c", "#ff9f7f", "#e062ae"],
                  tooltip: {
                      trigger: 'item',
                      formatter: "{a} <br/>{b} : {c} ({d}%)"
                  },
                  legend: {
                      orient: 'vertical',
                      left: 'left'
                  },
                  series: [
                      {
                          name: this.series.name,
                          type: 'pie',
                          radius: '66%',
                          center: ['50%', '60%'],
                          data: this.data,
                          itemStyle: {
                              emphasis: {
                                  shadowBlur: 10,
                                  shadowOffsetX: 0,
                                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                              }
                          }
                      }
                  ]
              });
          }
      }
  };

</script>

