<template>
    <div>
        <span v-show="flag">{{NameData}}</span>
        <div id="echartState"></div>
    </div>
</template>
<script>
  export default{
      data(){
          return {
              projectID: 0,
              NameData: [],
              EchData: [],
              flag: false,
          };
      },
      mounted(){
          this.projectID=sessionStorage.projectID;
          this.aotuHeight();
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
          getData(labelOption){
              let _this=this;
              let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_total_by_type+'&project_id='+this.projectID;
              _this.$axios.get(url).then(msg=>{
                  let Mdata=msg.data;
                  if (Mdata.err_code==0){
                      let NameData=Mdata.data.map(val=>val.name);
                      _this.NameData=NameData;
                      let EchData=Mdata.data.map(val=>({
                          "name": val.name,
                          "type": 'bar',
                          "label": labelOption,
                          "data": val.data,
                      }));
                      _this.EchData=EchData;
                  }
              });
          },
          aotuHeight(){
              let getH=document.body.clientHeight-200;
              document.getElementById("echartState").style.height=getH+"px";
          },
          myCharts(){
              var echarts = require('echarts');
              var myChart = echarts.init(document.getElementById('echartState'), 'ehcartTheme');
              var app = {};
              var posList = [
                  'left', 'right', 'top', 'bottom',
                  'inside',
                  'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
                  'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
              ];

              app.configParameters = {
                  rotate: {
                      min: -90,
                      max: 90
                  },
                  align: {
                      options: {
                          left: 'left',
                          center: 'center',
                          right: 'right'
                      }
                  },
                  verticalAlign: {
                      options: {
                          top: 'top',
                          middle: 'middle',
                          bottom: 'bottom'
                      }
                  },
                  position: {
                      options: echarts.util.reduce(posList, function (map, pos) {
                          map[pos] = pos;
                          return map;
                      }, {})
                  },
                  distance: {
                      min: 0,
                      max: 100
                  }
              };

              app.config = {
                  rotate: 0,
                  align: 'center',
                  verticalAlign: 'bottom',
          // position: 'insideBottom',
                  distance: 20,
                  onChange: function () {
                      var labelOption = {
                          normal: {
                              rotate: app.config.rotate,
                              align: app.config.align,
                              verticalAlign: app.config.verticalAlign,
                              position: app.config.position,
                              distance: app.config.distance
                          }
                      };
                      myChart.setOption({
                          series: [{
                              label: labelOption
                          }, {
                              label: labelOption
                          }, {
                              label: labelOption
                          }, {
                              label: labelOption
                          }]
                      });
                  }
              };

              var labelOption = {
                  normal: {
                      show: true,
                      position: app.config.position,
                      distance: app.config.distance,
                      align: app.config.align,
                      verticalAlign: app.config.verticalAlign,
                      rotate: app.config.rotate,
                      formatter: '{c}',
            //formatter: '{c}  {name|{a}}',
                      rich: {
                          name: {
//		                textBorderColor: '#000',
                              color: '#333'
                          }
                      },
                      textStyle: {          // 直线指示器样式设置
                          color: '#333',
                          fontSize: 12
                      },
                  }
              };

              this.getData(labelOption);

              myChart.setOption({
                  color: ['#99cccc', '#f4e5ce', '#ffcccc', '#e7bcf3', '#ff9f7f', '#fb7293', '#67e0e3'],
                  tooltip: {
                      trigger: 'item',
                      axisPointer: {
                          type: 'shadow'
                      },
                  },
                  legend: {
                      data: this.NameData
                  },
                  toolbox: {
                      show: true,
                      orient: 'vertical',
                      left: 'right',
                      top: 'center',
                      feature: {
                          mark: {show: false},
                          dataView: {show: false, readOnly: false},
                          magicType: {show: false, type: ['line', 'bar', 'stack', 'tiled']},
                          restore: {show: false},
                          saveAsImage: {show: false}
                      }
                  },
                  grid: {
                      left: '22px',
                      right: '40px',
                      bottom: '50px',
                      top: '40px',
                      containLabel: true
                  },
                  calculable: true,
                  xAxis: {
                      type: 'category',
                      axisTick: {show: false},
                      data: ['等待开始', '进行中', '暂停', '已完成'],
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
                      show: true,
                      realtime: true,
                      start: 10,
                      end: 90,
                      fillerColor: "rgba(190,221,216,0.8)",
                      height: 30
                  }],
                  series: this.EchData

              });
          }
      }
  };

</script>

