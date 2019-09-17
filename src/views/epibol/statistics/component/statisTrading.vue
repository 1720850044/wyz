<!--member.vue 项目统计->交易统计-->
<template>
    <div>
    <Row :gutter="30"  >
        <!-- <Col span="24" class-name='bgw' >
            <div class="itemBox base-card" >
              <div class="base-card-head">
                <div class="base-card-operation-head" >交易数量与价格</div>
                <div class="base-card-operation-icon" ><p class="iconfonts icon-shenglve-"></p></div>
              </div>
              <div id='getProjectChart' class="itemBox-chartBox"  ></div>
            </div>
        </Col> -->
        <Col span="24" class-name='bgw' id="PayChart">
            <div class="itemBox base-card">
              <div class="base-card-head">
                <div class="base-card-operation-head" >客户转化</div>
                <div class="base-card-operation-icon" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px" @click="PayChartObj.ShowFlag = !PayChartObj.ShowFlag" v-if="!isShow"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
              </div>
              <finance-echars v-if="objData.data"
                    :objData="objData"
                    :isRadio = "false"
                    :isTitle = "false"
                    :position = "true"
                    :department = "true"
                    :percentage = "'change_rate'"
                    :starEndDate="starEndDate"
                    :formatter = "'statisTrading'"
                    :accToken="powerToken"
                    :yAxis = "yAxis"
                    :dataZoom = "dataZoom"
                    :dataZoomRoll = "dataZoomRoll"
                    :isRoll = "false"
                    :censusType = "'barLine'"
                    :styleCss = "'margin: 20px 55px 0;'"
                    :echarsId = "'merchantChart'"
                    :echarsUrl="echarsUrl">
                </finance-echars>
                <template v-else>
                    <div style="height: 720px">
                        <loading></loading>
                    </div>
                </template>
            </div>
        </Col>
    </Row>
    </div>
</template>
<script>
import FinanceEchars from "../../../../components/FinanceEchars.vue";
import { onlyAPI } from "../../../../axios/apiConfig"
import api from "api";
export default {
    data() {
        return {
      // chartConfig: {
      //   colors: this.GLOBAL.echartCFG.colors
      // },
            objData: {},
            taskObjData: {},
            starEndDate: [],
            echarsUrl: '',
            taskEcharsUrl: '',
            powerToken: '',
            apiData: {
                timelineData: [],
                options: []
            },
            yAxis: [
                {name: '数量(个)',type: 'value',min: 0,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {name: '转化率',type: 'value',min: 0,
                    max: 100,        // 计算最大值
                    interval: 20,   //  平均分为5份
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            TansctionChartObj: {
                screenshotID: "TansctionChart",
                tabName: "statisTrading",
                ShowFlag: false
            },
            PayChartObj: {
                screenshotID: "PayChart",
                tabName: "statisTrading",
                ShowFlag: false
            },
            dataZoomRoll: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    handleSize: 0, //滑动条的 左右2个滑动条的大小
                    height: 20, //组件高度
                    bottom: 5, //右边的距离
                    handleColor: '#CBBCDB', //h滑动图标的颜色
                    handleStyle: {
                        borderColor: "#CBBCDB",
                        borderWidth: "1",
                        shadowBlur: 2,
                        background: "#CBBCDB",
                        shadowColor: "#CBBCDB",
                    },
                    fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                        //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                    //给第一个设置0，第四个设置1，就是垂直渐变
                    offset: 0,
                    color: '#ddd'
                    }, {
                        offset: 1,
                        color: '#ddd'
                    }]),
                    backgroundColor: '#F2F2F2', //两边未选中的滑动条区域的颜色
                    showDataShadow: false, //是否显示数据阴影 默认auto
                    showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
                    handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                    filterMode: 'filter',
                }
            ],
            dataZoom: [
                {
                    start: 0, //默认为0
                    end: 20, //默认为100
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    handleSize: 0, //滑动条的 左右2个滑动条的大小
                    height: 20, //组件高度
                    bottom: 5, //右边的距离
                    handleColor: '#CBBCDB', //h滑动图标的颜色
                    handleStyle: {
                        borderColor: "#CBBCDB",
                        borderWidth: "1",
                        shadowBlur: 2,
                        background: "#CBBCDB",
                        shadowColor: "#CBBCDB",
                    },
                    fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                        //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                    //给第一个设置0，第四个设置1，就是垂直渐变
                    offset: 0,
                    color: '#797979'
                    }, {
                        offset: 1,
                        color: '#797979'
                    }]),
                    backgroundColor: '#F2F2F2', //两边未选中的滑动条区域的颜色
                    showDataShadow: false, //是否显示数据阴影 默认auto
                    showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
                    handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                    filterMode: 'filter',
                }
            ],
            isShow: false
        };
    },

    created() {
        this.initFun().then(() => {
            this.getMerchantChartInfo();
            // this.getTaskTimeInfo();
        })
        this.$PublicFuns.drawEchart(() => {
            //this.getData();
            //this.getPayData();
        });
    },
    components: {
        FinanceEchars
    },
    mounted() {},
    methods: {
        async initFun() {
            const res = await api.getCustomerInfo();
            if (res.data.err_code == 0) {
                this.powerToken = res.data.data.acc_token;
            } else {
                this.$Message.error(res.data.err_message);
            }
            return this.powerToken;
        },
        getTaskTimeInfo () {
            var self = this;
            this.taskEcharsUrl = this.GLOBAL.baseRouter + onlyAPI.company_customer_add;
            this.$axios.post(this.taskEcharsUrl, {
                'acc_token': self.powerToken
            }).then(this.getTaskTimeSuccess);
        },
        getTaskTimeSuccess (res) {
            this.taskObjData = res.data.data;
        },
        getMerchantChartInfo () {
            var self = this;
            this.echarsUrl = this.GLOBAL.baseRouter + onlyAPI.company_client_change_rate;
            this.$axios.post(this.echarsUrl,{
                'acc_token': self.powerToken
            }).then(this.getMerchantChartSuccess);
        },
        getMerchantChartSuccess (res) {
            this.objData = res.data.data;
            this.starEndDate = res.data.data.particle_range_most.split(',');
        },
        getData() {
            this.$axios
        .post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_count, {
            type: "transaction_project"
        })
        .then(res => {
            if (res.data.err_code == 0) {
            //console.log("公司交易统计返回结果：", JSON.stringify(res.data));
                if (res.data.length <= 0) {return false;}
                if (res.data.data == "") {return false;}
                if (res.data.data.options == null) {this.isShow = true; return false;}
                let legendArr = [];
                let newOptions = res.data.data.options.map((item, index) => {
              //获取lengend
                    if (index == 0) {
                        for (var key in item.series) {
                            legendArr.push(key + "价格");
                            legendArr.push(key + "数量");
                        }
                    }
                    let oneOption = {};
                    let series = [];

                    for (var key in item.series) {
                        let countData = { name: "", type: "bar", data: [] };
                        countData.data = item.series[key].count;
                        countData.name = key + "数量";
                        series.push(countData);
                        let price = { name: "", type: "bar", yAxisIndex: 1, data: [] };
                        price.data = item.series[key].unitprice;
                        price.name = key + "价格";
                //console.log(price);
                        series.push(price);
                    }
                    if (series.length <= 0) {

                        legendArr.forEach(item => {
                            series.push({ name: item, type: "bar", data: ["0", "0"] });
                        });
                    }
                    oneOption.series = series;
                    oneOption.title = { text: item.title.substring(7, 10) };
                    oneOption.xAxis = item.xAxis;
                    oneOption.legend = { x: "right", show: false, data: legendArr };

                    return oneOption;
                });
                let apiData = {};
                apiData.options = newOptions;
                apiData.timelineData = res.data.data.time_m;
            //console.log("this.apiData", JSON.stringify(apiData));
                this.$nextTick(() => {
                    this.getTansctionChart("getTansctionChart", apiData);
                });
            } else {
                console.log("投标数据错误：", res.data.err_message);
            }
        });
        },

        getPayData() {
            this.$axios
        .post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_count, {
            type: "transaction_details"
        })
        .then(res => {
          //this.memberTaskNumData
            if (res.data.err_code == 0) {
            //console.log("公司------交易统计返回结果：", JSON.stringify(res.data));
                if (res.data.length <= 0) {return false;}
                if (res.data.data == "") {return false;}
                if (res.data.data.options == null) {this.isShow = true;return false;}
                let legendArr = ["收入总金额", "待收入总金额"];
                let newOptions = res.data.data.options.map((item, index) => {
              //获取options
                    let oneOption = {};
                    let series = [];
                    for (var key in item.series) {
                        let str = "";
                        key == "income" ? (str = "收入总金额") : (str = "待收入总金额");
                        let one = { name: str, type: "bar", data: [] };
                        one.data = item.series[key];
                        series.push(one);
                    }
                    if (series.length <= 0) {
                        item.xAxis = {
                            type: "category",
                            data: ["没有数据"]
                        };
                        legendArr.forEach(item => {
                            series.push({ name: item, type: "bar", data: ["0"] });
                        });
                    }
                    oneOption.series = series;
                    oneOption.title = { text: res.data.data.time_m[index] + "月  " };
                    oneOption.xAxis = item.xAxis;
                    oneOption.legend = { x: "right", show: false, data: legendArr };
                    return oneOption;
                });
                let apiData = {};
                apiData.options = newOptions;
                apiData.timelineData = res.data.data.time_m;
                this.$nextTick(() => {
              //this.getTansctionChart("getTansctionChart",apiData);
                    this.getPayChart("getPayChart", apiData);
                });
            } else {
                console.log("投标数据错误：", res.data.err_message);
            }
        });
        },

    //成效项目总数
        getProjectChart(idName) {
            let echarts = require("echarts");
            let numChart = echarts.init(document.getElementById(idName), 'echartTheme');
            let option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ["成交总数", "成交总金额"]
                },
                dataZoom: [
                    {
                        type: "slider",
                        start: 0,
                        end: 12,
                        xAxisIndex: [0]
                    }
                ],
                dataZoom: [
                    {
                        type: "slider",
                        xAxisIndex: [0],
                        endValue: 7,
                        bottom: 70
                    }
                ],
                xAxis: [
                    {
                        type: "category",
                        data: this.apiData.time_m
                    }
                ],
                yAxis: [
                    {
                        type: "value"
                    }
                ],
                series: [
                    {
                        name: "成交总数",
                        type: "bar",
                        data: this.apiData.transaction_count
                    },
                    {
                        name: "成交总金额",
                        type: "bar",
                        data: this.apiData.transaction_price
                    }
                ]
            };
            numChart.setOption(option);
        },

    //x轴为交易行为
        getTansctionChart(idName, apidata) {
            let echarts = require("echarts");
            let numChart = echarts.init(document.getElementById(idName), 'echartTheme');
            let option = {
                baseOption: {
                    timeline: {
                        axisType: "category",
                        autoPlay: false,
                        playInterval: 2000,
                        data: apidata.timelineData
                    },
                    title: {
                        left: "center",
                        text: "成交项目",
                        subtext: "成交项目"
                    },
                    dataZoom: [
                        {
                            type: "slider",
                            xAxisIndex: [0],
                            endValue: 7,
                            bottom: 70
                        }
                    ],
                    tooltip: {
                        trigger: "axis",
                        formatter: function(params) {
              //console.log(params);
                            let unit = "元";
                            var relVal = "项目金额："; //params[0].name;
                            let allPrice = 0;
                            params.forEach((item, index) => {
                                if (index % 2 == 0) {
                                    if (parseInt(item.value) !== 0) {
                                        allPrice +=
                      parseInt(item.value) * parseInt(params[index + 1].value);
                                    }
                                }
                            });
                            relVal += allPrice + "元";
                            for (var i = 0; i < params.length; i++) {
                //console.log('xxxxxxxxxx',i%2);
                                i % 2 == 1 ? (unit = "元") : (unit = "个");
                                if (params[i].value == 0) {continue;}
                                if (i % 2 == 1) {
                                    relVal +=
                    '<span style="background:' +
                    params[i].color +
                    '"></span>' +
                    params[i].value +
                    unit +
                    "</div>";
                                } else {
                                    relVal +=
                    '<div class="circle" ><span style="background:' +
                    params[i].color +
                    '"></span>' +
                    params[i].seriesName.replace(/数量/, "") +
                    " : " +
                    params[i].value +
                    unit +
                    " ";
                                }
                            }
                            return relVal;
                        },
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    calculable: true,
                    grid: {
                        left: this.GLOBAL.echartCFG.gridLeft,
                        right: this.GLOBAL.echartCFG.gridRight,
                        top: 80,
                        bottom: 150,
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: "category",
                            axisLabel: { interval: 0 }
              // //data: apidata.xAxisData,
              // splitLine: { show: false }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "数量"
                        },
                        {
                            type: "value",
                            name: "价格"
                        }
                    ]
                },
                options: apidata.options
            };
            numChart.setOption(option);
        },

    //交易财务
        getPayChart(idName, apidata) {
            let echarts = require("echarts");
            let numChart = echarts.init(document.getElementById(idName), 'echartTheme');
            let option = {
                baseOption: {
                    timeline: {
                        axisType: "category",
                        autoPlay: false,
                        playInterval: 2000,
                        data: apidata.timelineData
                    },
                    title: {
                        left: "center",
                        text: "交易财务",
                        subtext: "交易财务"
                    },
                    dataZoom: [
                        {
                            type: "slider",
                            xAxisIndex: [0],
                            endValue: 7,
                            bottom: 70
                        }
                    ],
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    calculable: true,
                    grid: {
                        left: this.GLOBAL.echartCFG.gridLeft,
                        right: this.GLOBAL.echartCFG.gridRight,
                        top: 80,
                        bottom: 150,
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: "category",
                            axisLabel: { interval: 0 }
              //data: apidata.xAxisData,
              //splitLine: { show: false }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "金额"
                        }
                    ]
                },
                options: apidata.options
            };
            numChart.setOption(option);
        }
    }
};
</script>
<style>
.ivu-col-span-6 {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
</style>

<style lang="less" scoped>
.base-card-head {
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin: 0 !important;
}
.itemBox {
  position: relative;
}
</style>

