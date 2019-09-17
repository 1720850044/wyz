<template>
   <div class="tem_all">
     <div class="clearfix tem_head">
        <p class="tem_head_msg">团队</p>
        <p class="tem_head_but iconfonts icon-shenglve-"></p>
    </div>
    <div class="tem_main">
      <div>
         <div id="rader"></div>
         <p class="canvas_msg">成员能力分布</p>
      </div>
      <div>
         <div id="free"></div>
         <p class="canvas_msg">成员平均空闲率</p>
       </div>
    </div>
   </div>
</template>
<script>
export default {
    props: ['teamList'],
    data () {
        return {
            ability: {},
            free: 0
        };
    },
    mounted() {
    // this.getRadar()
    // this.getFree()
    },
    watch: {
        teamList: function(e) {
            this.ability = e.ability;
            this.free = e.average_free.split('%')[0];
            this.$PublicFuns.drawEchart(()=>{
                this.getRadar();
                this.getFree();
            });
      // console.log('团队', average_free)
        }
    },
    methods: {
    // 获取雷达图
        getRadar () {
            let echarts = require('echarts');
            var myCharts = echarts.init(document.getElementById('rader'), 'ehcartTheme');
            const list = this.ability;
            const data = [];
            const textList = [];
            for (let i in list) {
                data.push(list[i].count);
                textList.push({
                    text: list[i].name,
                    color: list[i].color
                });
            }
            myCharts.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                radar: [
                    {
                        indicator: textList,
                        center: ['50%', '60%'],
                        radius: 50
                    },
                ],
                series: [
                    {
                        type: 'radar',
                        tooltip: {
                          trigger: 'item'
                      },
                        itemStyle: {
                          normal: {
                            color: '#9fe7db',
                            areaStyle: {
                               type: 'default'
                           }
                        }
                      },
                        data: [
                          {
                              value: data,
                          }
                      ]
                    },
                ]
            });
        },
    // 获取饼图
        getFree () {
            const echarts = require('echarts');
            var myCharts = echarts.init(document.getElementById('free'), 'ehcartTheme');
            const free = this.free;
            const data = [
         {value: free, name: '空闲率'},
         {value: 100 - free, name: '工作率'},
            ];
            myCharts.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} {d}%"
                },
                color: ['#3bceb6', '#cef2ec'],
                series: [
                    {
                        name: '空闲率',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        label: {
                          normal: {
                            formatter: '{c|{c}} {b|%\n\n{b}}  ',
                            rich: {
                               c: {
                                 fontSize: 18
                             },
                               b: {
                                 color: '#777777'
                             }
                           }
                        }
                      },
                        data: data,
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
<style lang='less'>
.tem_all{
  .base-card;
  .tem_head{
    .tem_head_msg{
      .base-card-operation-head;
    }
    .tem_head_but{
      .base-card-operation-icon;
    }
  }
}
.tem_main{
  width: 100%;
  height: 220px;
  position: relative;
}
.tem_main>div{
  width: 50%;
  height: 100%;
  float: left;
}
.canvas_msg{
  font-size: 12px;
  text-align: center;
    color: @black_2;
}
#rader,
#free{
  width: 100%;
  height: 200px;
  float: left;
  margin-bottom: 10px;
}
</style>
