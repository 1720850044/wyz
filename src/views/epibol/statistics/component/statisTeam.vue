<!--satatisTeam.vue 项目统计->团队能力-->
<template>
    <div>
    <Row :gutter="30"  >
        <Col span="24" class-name='bgw' id="TeamWtChart">
            <div class="itemBox base-card" >
              <div class="base-card-head">
                <div class="base-card-operation-head" >成员工时</div>
                <div class="base-card-operation-icon" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px" @click="TeamWtChartObj.ShowFlag = !TeamWtChartObj.ShowFlag" v-if="!isShow"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
              </div>
              <div id='getTeamWtChart' class="itemBox-chartBox itemBox-bigChartBox"  style="height:420px">
                <nothink type="project" text="暂无数据" v-if="isTeamShow"></nothink>
              </div>
                <!--<previewlist :propsData="TeamWtChartObj" @closeSlide="TeamWtChartObj.ShowFlag = !TeamWtChartObj.ShowFlag"></previewlist>-->
            </div>
        </Col>
        <Col span="24" class-name='bgw' id="TimeChart">
            <div class="itemBox base-card" style="margin-top:30px;">
              <div class="base-card-head">
                <div class="base-card-operation-head" >类型平均用时和平均误时</div>
                <div class="base-card-operation-icon" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px" @click="TimeChartObj.ShowFlag = !TimeChartObj.ShowFlag" v-if="!isShow"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
              </div>
              <div id='getUseTimeChart' class="itemBox-chartBox itemBox-bigChartBox"  style="height:420px" >
                <nothink type="project" text="暂无数据" v-if="isTimeShow"></nothink>
              </div>
                <!--<previewlist :propsData="TimeChartObj" @closeSlide="TimeChartObj.ShowFlag = !TimeChartObj.ShowFlag"></previewlist>-->
            </div>
        </Col>
        <Col span="24" class-name='bgw' id="PassChart">
            <div class="itemBox base-card" style="margin-top:30px">
              <div class="base-card-head">
                <div class="base-card-operation-head" >类型平均通过率</div>
                <div class="base-card-operation-icon" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px" @click="PassChartObj.ShowFlag = !PassChartObj.ShowFlag" v-if="!isShow"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
              </div>
              <div id='getPassChart' class="itemBox-chartBox itemBox-bigChartBox" style="height:420px" >
                <nothink type="project" text="暂无数据" v-if="isPassShow"></nothink>
              </div>
                <!--<previewlist :propsData="PassChartObj" @closeSlide="PassChartObj.ShowFlag = !PassChartObj.ShowFlag"></previewlist>-->
            </div>
        </Col>

        <!--Col span="24" class-name='bgw'>
            <div class="itemBox base-card" style="margin-top:30px">
              <div class="base-card-head">
                <div class="base-card-operation-head" >个人能力等级</div>
                <div class="base-card-operation-icon" ><p class="iconfonts icon-shenglve-"></p></div>
              </div>
              <div id='getPowerChart' class="itemBox-chartBox itemBox-bigChartBox" ></div>

            </div>
        </Col>

        <Col-- span="24" class-name='bgw'>
            <div class="itemBox base-card" style="margin-top:30px">
              <div class="base-card-head">
                <div class="base-card-operation-head" >公司能力</div>
                <div class="base-card-operation-icon" ><p class="iconfonts icon-shenglve-"></p></div>
              </div>
              <div id='getCompanyPowerChart' class="itemBox-chartBox itemBox-bigChartBox" ></div>

            </div>
        </Col-->
    </Row>
    </div>
</template>
<script>
export default {
    data() {
        return {
      // chartConfig: {
      //   colors: this.GLOBAL.echartCFG.colors
      // },
            apiData: {
                timelineData: [],
                options: []
            },
            TeamWtChartObj: {
                screenshotID: 'TeamWtChart',
                tabName: 'statisTeam',
                ShowFlag: false
            },
            TimeChartObj: {
                screenshotID: 'TimeChart',
                tabName: 'statisTeam',
                ShowFlag: false
            },
            PassChartObj: {
                screenshotID: 'PassChart',
                tabName: 'statisTeam',
                ShowFlag: false
            },
            isShow: false,
            isTeamShow: false,
            isTimeShow: false,
            isPassShow: false
        };
    },
    created() {
        this.getTeamWtData();
        this.getTeamHoursData(); //类型平均用时 和 类型平均通过率
        this.getTeamPassData();
    //console.log("---------------",this.GLOBAL)
    // this.getTeamPowerData(); //个人能力
    // this.getCompanyPowerData(); //公司能力
    },
    mounted() {},
    methods: {
        getTeamWtData() {
            this.$axios
            .post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_count, { type: "team_wt" }).then(res => {
                if (res.data.err_code == 0) {
                //console.log("公司team_wt工时返回结果：", JSON.stringify(res.data));
                    if (res.data.length <= 0) {return false;}
                    if (res.data.data == "") {return false;}
                    if (!res.data.data.options) {this.isTeamShow = true; return;}
                    // if (res.data.data.options == null ) {return false;}
                    let legendArr = ["成员工时"];
                    let newOptions = res.data.data.options.map((item, index) => {
                  //获取options
                        let oneOption = {};
                        let series = [];

                        for (var key in item.series) {
                            let a = res.data.data.time_avg[index];
                            let one = {
                                name: "成员工时",
                                type: "bar",
                                data: [],
                                markLine: { data: [{ name: "平均值", yAxis: a }] }
                            };
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
                        oneOption.title = { text: res.data.data.time_m[index] + "月" };
                        oneOption.xAxis = { type: "category", data: item.members };
                        return oneOption;
                    });
                    let apiData = {};
                    apiData.options = newOptions;
                    apiData.timelineData = res.data.data.time_m;
                //console.log("this.apiData", JSON.stringify(apiData));
                    this.$nextTick(() => {
                        this.$PublicFuns.drawEchart(()=>this.getTeamWtChart("getTeamWtChart", apiData));
                    });
                } else {
                    console.log("投标数据错误：", res.data.err_message);
                }
            });
        },

    //平均用时和误工
        getTeamHoursData() {
            this.$axios
        .post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_count, {
            type: "team_hours"
        })
        .then(res => {
          //this.memberTaskNumData
            if (res.data.err_code == 0) {
            //console.log("公司---getTeamHoursData 统计返回结果：", JSON.stringify(res.data));
                if (res.data.length <= 0) {return false;}
                if (res.data.data == "") {return false;}
                if (!res.data.data.options) {this.isTimeShow = true; return;}
                // if (res.data.data.options == null ) {return false;}
                let legendArr = ["平均用时", "平均延时"];
                let newOptions = res.data.data.options.map((item, index) => {
              //获取options
                    let oneOption = {};
                    let series = [];
                    for (var key in item.series) {
                        let str = "";
                        key == "finish" ? (str = "平均用时") : (str = "平均延时");
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
                    oneOption.xAxis = item.xAxis; //{type : 'category',data : res.data.data.xAxisData };
                    oneOption.legend = { x: "right", show: false, data: legendArr };
                    return oneOption;
                });
                let apiData = {};
                apiData.options = newOptions;
                apiData.timelineData = res.data.data.time_m;
            //console.log("this.apiData 平均用时", JSON.stringify(apiData));
                this.$nextTick(() => {
                    this.$PublicFuns.drawEchart(()=>this.getUseTimeChart("getUseTimeChart", apiData));
                });
            } else {
                console.log("平均用时和误工错误：", res.data.err_message);
            }
        });
        },

    //个人能力等级
        getTeamPowerData() {
            this.$axios
        .post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_user_count, {})
        .then(res => {
          //this.memberTaskNumData
            if (res.data.err_code == 0) {
            //console.log("公司---getTeamPowerData 统计返回结果：", JSON.stringify(res.data));
                if (res.data.length <= 0) {return false;}
                if (res.data.data == "") {return false;}
                let levelTypes = ["制作等级", "设计等级", "质量等级", "沟通等级"];
                let powerTypes = ["能力类型"];
                let radarData = [];
                let barData = [];
                res.data.data.values.forEach(item => {
                    barData.push(item.value[0]);
                    let one = {
                        value: [
                            item.value[1],
                            item.value[2],
                            item.value[3],
                            item.value[4]
                        ],
                        name: item.name,
                        symbol: "rect",
                        symbolSize: 5,
                        lineStyle: {
                            normal: {
                                type: "dashed"
                            }
                        }
                    };
                    radarData.push(one);
                });
                let apiData = {
                    radarData: radarData,
                    members: res.data.data.members,
                    barData: barData
                };
            //console.log("this.apiData 平均用时", JSON.stringify(apiData));
                this.$nextTick(() => {
                    this.$PublicFuns.drawEchart(()=>this.getPowerChart("getPowerChart", apiData));
                });
            } else {
                console.log("个人能力等级报错：", res.data.err_message);
            }
        });
        },

    //公司能力
        getCompanyPowerData() {
            this.$axios
        .post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_company_count, {})
        .then(res => {
          //this.memberTaskNumData
            if (res.data.err_code == 0) {
                if (res.data.length <= 0) {return false;}
                if (res.data.data == "") {return false;}
                let apiData = res.data.data.map((item, index) => {
                    let myData = {
                        name: item.name,
                        itemStyle: {
                            color: "#a87b64"
                        },
                        children: []
                    };
                    myData.children = item.tasktype.map((item2, index2) => ({
                        name: item2.name,
                        value: item2.lv,
                        itemStyle: { color: "#c89f83" }
                    }));
                    return myData;
                });

                this.$nextTick(() => {
                    this.$PublicFuns.drawEchart(()=>this.getCompanyPowerChart("getCompanyPowerChart", apiData));
                });
            } else {
                console.log("公司能力等级", res.data.err_message);
            }
        });
        },

    //通过率数据获取
        getTeamPassData() {
            this.$axios
        .post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_count, {
            type: "team_pass"
        })
        .then(res => {
          //this.memberTaskNumData
            if (res.data.err_code == 0) {
            //console.log("公司---getTeamPassData 统计返回结果：", JSON.stringify(res.data));
                if (res.data.length <= 0) {return false;}
                if (res.data.data == "") {return false;}
                if (!res.data.data.options) {this.isPassShow = true; return;}
                // if (res.data.data.options == null ){this.isShow = true; return false;}
                let legendArr = ["平均通过率"];
                let newOptions = res.data.data.options.map((item, index) => {
              //console.log(JSON.stringify(legendArr));
              //获取options
                    let oneOption = {};
                    let series = [];
                    for (var key in item.series) {
                        let one = { name: "平均通过率", type: "bar", data: [] };
                        one.data = item.series[key];
                //添加内部、外部通过率
                // one.data.unshift(res.data.data.inside_pass[index]);
                // one.data.unshift(res.data.data.outside_pass[index]);
                        series.push(one);
                    }

                    let seriesOne = { name: "内部平均通过率", tooltip: {formatter: '{b0}: {c0}%'}, radius: '30%', center: ['82%', '50%'], z: 500, zlevel: 0, type: "pie", data: [{name: '内部平均通过率', value: res.data.data.inside_pass[index]}, {name: '外部平均通过率', value: res.data.data.outside_pass[index]}] };
                    series.push(seriesOne);

              // let seriesTwo = { name: "外部平均通过率", type: "pie", data: [res.data.data.outside_pass[index],res.data.data.outside_pass[index],res.data.data.outside_pass[index],res.data.data.outside_pass[index]] };
              // series.push(seriesTwo);

              //空数据的处理
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
                    oneOption.title = { text: item.title };
              //console.log(item.xAxis);
              // item.xAxis.data.unshift("内部平均通过率");
              // item.xAxis.data.unshift("外部平均通过率");
                    oneOption.xAxis = item.xAxis;
                    oneOption.legend = { x: "right", show: false, data: legendArr };
                    return oneOption;
                });
                let apiData = {};
                apiData.options = newOptions;
                apiData.timelineData = res.data.data.time_m;
            //console.log("this.apiData 平均用时", JSON.stringify(apiData));
                this.$nextTick(() => {
                    this.$PublicFuns.drawEchart(()=>this.getPassChart("getPassChart", apiData));
                });
            } else {
                console.log("类型平均通过率api异常", res.data.err_message);
            }
        });
        },

    //成员平均工时
        getTeamWtChart(idName, apidata) {
      //console.log("getTeamWtChartgetTeamWtChartgetTeamWtChart");
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
                        text: "成员工时",
                        subtext: "成员工时"
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        }
                    }, dataZoom: [{
                        type: 'slider',
                        xAxisIndex: [0],
                        endValue: 7,
                        bottom: 80
                    }],
                    grid: {
                        left: this.GLOBAL.echartCFG.gridLeft,
                        right: this.GLOBAL.echartCFG.gridRight,
                        top: 80,
                        bottom: 150,
                        containLabel: true
                    },
                    xAxis: [{type: "category"}],
                    yAxis: [
                        {
                            type: "value",
                            name: "小时",
                            axisLabel: {
                                formatter: "{value}小时"
                            }
                        }
                    ]
                },
                options: apidata.options
            };
            numChart.setOption(option);
        },

    //类型平均用时和误时
        getUseTimeChart(idName, apidata) {
            let echarts = require("echarts");
            let numChart = echarts.init(document.getElementById(idName), 'echartTheme');
            let option = {
                baseOption: {
                    timeline: {
                        axisType: "category",
                        autoPlay: false,
                        playInterval: 2000,
                        bottom: 0,
                        data: apidata.timelineData
                    },
                    title: {
                        left: "center",
                        text: "成交项目",
                        subtext: "成交项目"
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    dataZoom: [{
                        type: 'slider',
                        xAxisIndex: [0],
                        endValue: 7,
                        bottom: 70
                    }],
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
                            type: "category"
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "小时",
                            axisLabel: {
                                formatter: "{value}小时"
                            }
                        }
                    ]
                },
                options: apidata.options
            };
            numChart.setOption(option);
        },

    //类型平均通过率
        getPassChart(idName, apidata) {
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
                        text: "类型平均通过率",
                        subtext: "类型平均通过率"
                    },
                    tooltip: {
                        trigger: "item",
                        axisPointer: {
                            type: "shadow"
                        },
                        formatter: ' {b0}<br/>{a0}:{c0}'+'%',
                    }, dataZoom: [{
                        type: 'slider',
                        xAxisIndex: [0],
                        endValue: 7,
                        bottom: 70
                    }],
                    calculable: true,
                    grid: {
                        left: this.GLOBAL.echartCFG.gridLeft,
                        right: 400,
                        top: 80,
                        bottom: 150,
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: "category"
              //axisLabel: { interval: 0,rotal:40 },
              // //data: apidata.xAxisData,
              // splitLine: { show: false }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "通过率",
                            axisLabel: {
                                formatter: "{value}%"
                            }
                        }
                    ]
                },
                options: apidata.options
            };
            numChart.setOption(option);
        },

    //公司能力
        getCompanyPowerChart(idName, apidata) {
            let echarts = require("echarts");
            let numChart = echarts.init(document.getElementById(idName), 'echartTheme');
            let option = {
        // title: {
        //     text: 'WORLD COFFEE RESEARCH SENSORY LEXICON',
        //     subtext: 'Source: https://worldcoffeeresearch.org/work/sensory-lexicon/',
        //     textStyle: {
        //         fontSize: 14,
        //         align: 'center'
        //     },
        //     subtextStyle: {
        //         align: 'center'
        //     },
        //     sublink: 'https://worldcoffeeresearch.org/work/sensory-lexicon/'
        // },
                grid: {
                    bottom: "0%",
                    top: "0%",
                    containLabel: true
                },
                series: {
                    type: "sunburst",
                    highlightPolicy: "ancestor",
                    data: apidata,
                    radius: [0, "95%"],
                    sort: null,
                    levels: [
            {},
                        {
                            r0: "5%", //最内层圆圈
                            r: "35%",
                            itemStyle: {
                                borderWidth: 1
                            },
                            label: {
                                rotate: "tangential"
                            }
                        },
                        {
                            r0: "35%",
                            r: "100%",
                            label: {
                                align: "right"
                            }
                        },
                        {
                            r0: "70%",
                            r: "72%",
                            label: {
                                position: "outside",
                                padding: 3,
                                silent: false
                            },
                            itemStyle: {
                                borderWidth: 3
                            }
                        }
                    ]
                }
            };
            numChart.setOption(option);
        },

    //公人能力等级
        getPowerChart(idName, apidata) {
            let echarts = require("echarts");
            let numChart = echarts.init(document.getElementById(idName), 'echartTheme');
            let option = {
        // title: {
        //     text: '个人能力等级'
        // },
                legend: {
                    data: apidata.members
                },
                grid: {
                    left: "3%",
                    right: "40%",
                    bottom: "3%",
                    top: "20%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        data: apidata.members,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "category"
                    }
                ],
                radar: [
                    {
                        indicator: [
              { text: "制作等级" },
              { text: "设计等级" },
              { text: "质量等级" },
              { text: "沟通等级" }
                        ],
                        center: ["80%", "50%"],
                        radius: 120,
                        startAngle: 90,
                        splitNumber: 4,
                        shape: "circle",
                        name: {
                            formatter: "【{value}】",
                            textStyle: {
                                color: "#72ACD1"
                            }
                        },
                        splitArea: {
                            areaStyle: {
                                color: [
                                    "rgba(114, 172, 209, 0.2)",
                                    "rgba(114, 172, 209, 0.4)",
                                    "rgba(114, 172, 209, 0.6)",
                                    "rgba(114, 172, 209, 0.8)",
                                    "rgba(114, 172, 209, 1)"
                                ],
                                shadowColor: "rgba(0, 0, 0, 0.3)",
                                shadowBlur: 10
                            }
                        },
            // axisLine: {
            //   lineStyle: {
            //     color: "rgba(255, 255, 255, 0.5)"
            //   }
            // },
            // splitLine: {
            //   lineStyle: {
            //     color: "rgba(255, 255, 255, 0.5)"
            //   }
            // }
                    }
                ],
                series: [
                    {
                        name: "雷达图",
                        type: "radar",
                        itemStyle: {
                            emphasis: {
                // color: 各异,
                                lineStyle: {
                                    width: 4
                                }
                            }
                        },
                        data: apidata.radarData
                    },
                    {
                        name: "能力类型",
                        type: "bar",
                        barWidth: "60%",
                        data: apidata.barData //[10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            };
            numChart.setOption(option);
        }
    }
};
</script>
<style lang="less" scoped>
    .base-card-head{
        width: 100%;
        height: 30px;
        line-height: 30px;
        margin: 0 !important;
    }
    .itemBox{position: relative}
</style>

