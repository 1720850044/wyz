<template>
    <div>
        <div id="EPie"></div>
    </div>
</template>
<style>
    #EPie{height:350px;padding-top:10px;}
</style>
<script>
  export default{
      data(){
          return {
              Edate: [],
              EchData: []
          };
      },
      props: ["EpieData"],
      mounted(){
          this.echarts2();
      },
      methods: {
          EchaData(){
              this.Edate=this.EpieData.data;
              if (this.EpieData.series==undefined){
           
              } else {
                  let EchData=this.EpieData.series.map(val=>({
                      name: val.name,
                      type: 'line',
                      symbol: 'circle',
                      itemStyle: {
                        emphasis: {
                        symbol: 'circle',
                    }
                    },
                      symbolSize: [8, 8],
                      data: val.data,
                  }));
                  this.EchData=EchData;
                  this.EchData.push({
                      type: 'bar',
                      barWidth: '1',
                      data: this.EpieData.bar,
                      color: '#48b',
                  });
                  console.log(this.EchData);
              }
        
          },
          echarts2(){
              var echarts = require('echarts');
              var echartHours =echarts.init(document.getElementById('EPie'), 'ehcartTheme');
        // 绘制图表
              echartHours.setOption({
//        backgroundColor: '#ffffff',
                  name: 'a',
                  tooltip: {
                      trigger: 'axis', //按x轴显示
                      show: true,
                      axisPointer: {
                        lineStyle: {
                          color: 'none', //不显示线条
                      },
                    },
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      textStyle: {
                        align: 'left',
                        fontSize: 12,
                        color: '#333333',
                    },
                      extraCssText: 'box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2)' //添加阴影
                  },
                  color: ['#0580f2', '#faa732', '#e1575d'],
                  grid: {
                      left: '0%',
                      right: '10%',
                      top: '12%',
                      bottom: '12%',
                      containLabel: true
                  },
                  legend: {
                      show: true,
                      icon: 'circle',
                      x: 'center',
                      y: 'top',
                      itemWidth: 10,
                      itemHeight: 10,
           // data: ['制作进度', '内部审核', '客户审核']
                  },
                  xAxis: {
                      show: true,
                      type: 'category',
                      axisTick: {
                        show: false
                    },
                      axisLine: {
                        show: false,
                        lineStyle: {
                          color: '#eeeeee',
                      }
                    },
                      axisLabel: {
                        textStyle: {
                          fontSize: 14,
                          color: '#999999'
                      }
                    },
                      data: this.Edate
                  },
                  yAxis: {
                      show: false,
                      type: 'value',
                      axisTick: {
                        show: false
                    },
                      axisLine: {
                        show: false,
                    },
                      splitLine: {
                        show: true,
                        lineStyle: {
                          color: '#f2f3f7'
                      }
                    },
                      axisLabel: {
                        textStyle: {
                          fontSize: 12,
                          color: '#999999'
                      }
                    }
                  },
                  series: this.EchData
              });

          }
      }
  };
</script>

