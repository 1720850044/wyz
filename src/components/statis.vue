<!--统计-->
<template>
  <div class="commonStatic">
    <div class="itemBox-CheckboxGroup">
      <RadioGroup v-model="nowDateType" type="button" @on-change="changeDateType">
        <Radio v-for="(item,index) in dateTypes" :label="item" :key="index"></Radio>
      </RadioGroup>
      <span v-if="tablecontrols == true">
        <span class="itemBox-talbetxt">表格:</span>
        <i-switch v-model="isShowTab" size="small">
          <!--span slot="open">开</span>
          <span slot="close">关</span-->
        </i-switch>
      </span>
    </div>
    <div id="ChartDiv" class="itemBox-chartBox" :style="chartStyles">
      <nothink type="project" text="暂无数据" v-if="isShowNullDiv"></nothink>
    </div>
    <div class="sliderContainer" :style="sliderContainerStyle"
      v-if="this.sliderData &&　this.sliderData.start && this.sliderData.end && this.sliderData.areaStart && this.sliderData.areaEnd && sliderAttr.data != null && sliderAttr.data.length>0"
    >
      <vue-slider
              id="sliderContainer"
        ref="slider4"
        v-bind="sliderAttr"
        v-model="sliderAttr.value"
        :disabled="sliderDisabled"
        @drag-end="dragEnd"
        @callback="sliderChange"
      ></vue-slider>
    </div>
    <!-- <button @click="changessss">set Value</button> -->
    <div class='tableContainer'>
      <slot v-if="isShowTab"></slot>
    </div>

  </div>
</template>
<script>
/**
 *
 * chartOption:图表数据
 * dateTypes：当前刻度（日，月，年）
 * currentDateType：月
 * isShowNull：是否显示图表暂无数据
 * chartStyle  图表外层div样式
 * sliderData  {start:null, end:null, areaStart:null, areaEnd:null }  //开始时间  结束时间  区间开始时间  区间结束时间
 * sliderDisabled 是否禁用滑块
 * sliderContainerStyle slider容器样式
 * onDateTypeChange 刻度改变事件  返回当前刻度
 * onSliderChange 滑块改变事件
 * tablecontrols  是否显示表格控件
 *
 *  外部修改当前时间间隔
 *
 */
import vueSlider from "./vue-slider";
export default {
    name: "statis",
    data() {
        return {
            chartConfig: {
                colors: this.GLOBAL.echartCFG.colors
            },
            nowDateType: this.currentDateType,
            isShowTab: this.isShowTable,
            isShowNullDiv: this.isShowNull,
            chartStyles: {
                height: "400px",
                marginBottom: "50px",
        //border:'1px solid red',
                ...this.chartStyle
            },
            sliderAttr: {
                value: [],
                width: "100%",
                height: 12,
                dotSize: 14,
                min: 1,
                max: 336,
                interval: 3,
                tooltip: "always", //'always'
        //disabled: false,
                show: true,
                clickable: true,
        //piecewise: true,
                data: null,
                style: {
                    marginLeft: "0",
                    marginRight: "15px"
          //"backgroundColor":'#ff0000'
                },
                bgStyle: {
                    backgroundColor: "#eef1f2"
                },
                piecewiseStyle: {
                    backgroundColor: "#EEF1F2",
                    visibility: "visible"
          // "width": "12px",
          // "height": "14px"
                },
                piecewiseActiveStyle: {
                    backgroundColor: "#3CD2B4"
                },
                labelActiveStyle: {
                    color: "#3CD2B4"
                },
        //拖动按钮
                sliderStyle: {
                    backgroundColor: "#fcc44a",
          // backgroundColor: "#3CD2B4",
                    borderRadius: "3px",
                    width: "30px",
          // boxShadow: "0.5px 0.5px 2px 1px #fcc44a"
                },
                tooltipStyle: [
                    {
                        backgroundColor: "transparent",
                        marginLeft: "50px",
                        borderColor: "transparent",
                        fontSize: "12px",
                        color: "#666666"
                    },
                    {
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                        fontSize: "12px",
                        color: "#666666",
                        marginRight: "20px"
                    }
                ], //提示气泡样式
                processStyle: {
          //进度区间背景颜色
                    backgroundColor: "#fff2d7",
          // backgroundColor: "#C2F3EC"
                }
            }
        };
    },
    computed: {},
    components: { vueSlider },
    props: {
        sliderData: {
            type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
            default: function() {
                return null;
            }
        },
        chartOption: {
            type: Object,
            required: true
        },
        dateTypes: {
            type: Array,
            default: () => ["日", "周", "月", "年"]
        },
        sliderContainerStyle: {
            type: Object,
            default: null
        },
        currentDateType: {
            type: String,
            default: "月"
        },
        currentDate: {
            type: String
        },
        isShowNull: {
            type: Boolean,
            default: false
        },
        isShowTable: {
            type: Boolean,
            default: true
        },
        chartStyle: {
            type: Object
        },
        sliderDisabled: {
            type: Boolean,
            default: false
        },
        tablecontrols: {
            type: Boolean,
            default: true
        }
    },
    created() {
        if (this.sliderData !== null) {
            console.log("有默认值");
            this.$nextTick(() => {
                this.sliderAttr.data = this.getTimesArray();
                this.changessss([this.sliderData.areaStart, this.sliderData.areaEnd]);
            });
        }
    },
    mounted() {
        this.renderChart();
    },
    watch: {
        chartOption(oldValue, newValue) {
            this.renderChart();
        },

        sliderData(oldValue, newValue) {
      // console.log("监听 sliderData改变了 ", this.sliderData);
            if (this.sliderData !== null) {
                this.$nextTick(() => {
                    this.sliderAttr.data = this.getTimesArray();
                    this.changessss([this.sliderData.areaStart, this.sliderData.areaEnd]);
                });
            }
        }
    },
    methods: {
    //初始起始时间
        initSiderStartEnd() {
            let startAndEnd = [];
            startAndEnd = [this.sliderData.start, this.sliderData.end];
            return startAndEnd;
        },

    //传递['startTime','endTime']
        changessss(dateArr) {
            this.$set(this.sliderAttr.value, 0, dateArr[0]);
            this.$set(this.sliderAttr.value, 1, dateArr[1]);
      //this.$refs.slider4.refresh();
        },
    //滑块时时监听
        sliderChange(params) {

        },
    //滑块结束
        dragEnd(params) {
      // console.log("滑块结束，dragEnd:", this.$refs.slider4.getValue());
            this.$emit("onSliderChange", this.$refs.slider4.getValue());
        },
    //获取时间数组  如['2018-09-09','2018-09-09']
        getTimesArray() {
            let dateArr = this.initSiderStartEnd();
            let dateList = this.getDateList(
        new Date(dateArr[0]),
        new Date(dateArr[1])
      );
      //console.log("生成的时间范围", dateList);
            return dateList;
        },
    //获取日期列表
        getDateList(startDate, endDate) {
            const dateList = [];
            dateList.push(this.fmtDate(startDate));
            while (true) {
                startDate.setDate(startDate.getDate() + 1);
                if (startDate.getTime() < endDate.getTime()) {
                    dateList.push(this.fmtDate(startDate));
                } else {
                    break;
                }
            }
            dateList.push(this.fmtDate(endDate));
            return dateList;
        },
    //转2018-03-09
        fmtDate(date) {
      //var date =  new Date(obj);
            var y = 1900 + date.getYear();
            var m = "0" + (date.getMonth() + 1);
            var d = "0" + date.getDate();
            return (
        y +
        "-" +
        m.substring(m.length - 2, m.length) +
        "-" +
        d.substring(d.length - 2, d.length)
            );
        },
    //当前刻度改变 向父级传递数据
        changeDateType(currentDateType) {
            this.$emit("onDateTypeChange", currentDateType);
        },
    //监听改变 刷新图表
        renderChart() {
            this.$PublicFuns.drawEchart(() => {
                this.$nextTick(() => {
                    this.getChart("ChartDiv");
                });
            });
        },
        getChart(idName) {
      // console.log('this.chartOption',this.chartOption);
            if (this.chartOption == false || JSON.stringify(this.chartOption) == "{}" ||this.chartOption == null) {
                this.isShowNullDiv = true;
                return false;
            }
            let echarts = require('echarts');
            let chartDom = echarts.init(document.getElementById(idName), 'echartTheme');
            let option = {
        // color: this.chartOption.color || this.chartConfig.colors,
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross"
                    },
                    ...this.chartOption.tooltip
                },
                grid: {
                    left: "0", //this.GLOBAL.echartCFG.gridLeft,
                    right: "0", //this.GLOBAL.echartCFG.gridRight,
                    top: "23%",
                    bottom: "0",
                    containLabel: true,
                    ...this.chartOption.grid
                },
                legend: {
                    data: [],
                    x: "right",
                    y: 16,
                    ...this.chartOption.legend
                },
                xAxis: this.chartOption.xAxis || [
                    {
                        type: "category",
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#F8F9F9"
                            }
                        },
                        data: [],
                        axisLabel: {
                            formatter: "{value}月"
                        },
                    }
                ],
                yAxis: this.chartOption.yAxis || [
                    {
                        type: "value",
            //name: '数量',
                        position: "left",
                        offset: 0,
                        axisLabel: {
                            formatter: "{value}个"
                        }
                    },
                    {
                        type: "value",
            //name: '中标率',
                        min: 0,
                        max: 100,
                        position: "right",
                        axisLabel: {
                            formatter: "{value}%"
                        }
                    }
                ],
        // dataZoom: this.chartOption.dataZoom || [
        //   {
        //     type: "slider",
        //     // start: 0,
        //     // end: 12,
        //     xAxisIndex: [0],
        //   }
        // ],
                series: this.chartOption.series || []
            };

            let XaxisLine = {
                lineStyle: {
                    color: '#ADBDDF'
                }
            };
            let YaxisLine = {
                lineStyle: {
                    color: '#ADBDDF',
                    width: 0
                }
            };

            option.yAxis[0] && (!option.yAxis[0].axisLine && (option.yAxis[0].axisLine=YaxisLine));
            option.yAxis[1] && (!option.yAxis[1].axisLine && (option.yAxis[1].axisLine=YaxisLine));
            option.xAxis[0] && (!option.xAxis[0].axisLine && (option.xAxis[0].axisLine=XaxisLine));
            option.xAxis[1] && (!option.xAxis[1].axisLine && (option.xAxis[1].axisLine=XaxisLine));
      //baseOption 如果有时间线  则使用原始配置项
            if (this.chartOption.options || this.chartOption.baseOption) {
                option = this.chartOption;
                if ((option.options == null || option.options.length <= 0)) {
                    this.isShowNullDiv = true;
                    return false;
                }
            } else if (option.series == null || option.series.length <= 0) {
                this.isShowNullDiv = true;
                return false;
            }
      // console.log('option----',JSON.stringify(option));
            chartDom.setOption(option);
      // chartDom.on("datazoom", function(params) {
      //   console.log(params);
      //   var opt = chartDom.getOption();
      //   var dz = opt.dataZoom[0];
      //   var tstart = opt.xAxis[0].data[dz.startValue];
      //   var tend = opt.xAxis[0].data[dz.endValue];
      //   //console.log(tstart + "" + tend);
      // });
        },
        getBaseOption(){

        }
    }
};
</script>
<style lang="less" scoped>
.commonStatic {
  position: relative;
  .itemBox-CheckboxGroup {
    position: absolute;
    left: 0px;
    text-align: left;
    top: 10px;
    z-index: 500;
    width: 300px;
    border: 0px solid @red;
    margin-bottom: 0px;
    .ivu-radio-group-button .ivu-radio-wrapper:hover {
      color: @base;
    }
    .ivu-radio-wrapper-checked {
      background-color: @base;
      color: #ffffff;
      border-color: @base;
      box-shadow: -1px 0 0 0 @base;
      &:hover {
        color: #ffffff !important;
      }
    }
  }

  .itemBox-chartBox {
    margin-bottom: 0px;
    border: 0px solid @red;
  }
  .itemBox-talbetxt{
    display: inline-block;
    margin-left:20px;
  }
  .custom-tooltip {
    width: 90px;
  }

  .sliderContainer{
    padding-right:18px
  }
  .tableContainer{
    margin-top:15px;
  }
}

.itemBox .sliderContainer{
  border:0px solid @red;
  margin-bottom: 30px;
}
</style>

