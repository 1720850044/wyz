<!--statisProject.vue 公司统计->项目统计-->
<template>
    <div>
    <Row :gutter="30"  >
        <Col span="24" class-name='bgw' id="ProjectTaskChart">
            <div class="itemBox base-card" >
              <div class="base-card-head">
                <div class="base-card-operation-head" >项目任务资源</div>
                <div class="base-card-operation-icon" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px" @click="ProjectTaskChartObj.ShowFlag = !ProjectTaskChartObj.ShowFlag" v-if="!isShow"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
              </div>
              <div id='getProjectTaskChart' class="itemBox-chartBox bigChartBox" style="height:450px">
                <nothink type="project" text="暂无数据" v-if="isShow"></nothink>
              </div>
                <!--<previewlist :propsData="ProjectTaskChartObj" @closeSlide="ProjectTaskChartObj.ShowFlag = !ProjectTaskChartObj.ShowFlag"></previewlist>-->
            </div>
        </Col>
        <Col span="24" class-name='bgw' id="PassValueChart">
            <div class="itemBox base-card" style="margin-top:30px;">
              <div class="base-card-head">
                <div class="base-card-operation-head" >项目通过率</div>
                <div class="base-card-operation-icon" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px" @click="PassValueChartObj.ShowFlag = !PassValueChartObj.ShowFlag" v-if="!isShow"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
              </div>
                <div id='getPassValueChart' class="itemBox-chartBox bigChartBox" style="height:450px">
                  <nothink type="project" text="暂无数据" v-if="isShow"></nothink>
                </div>
                <!--<previewlist :propsData="PassValueChartObj" @closeSlide="PassValueChartObj.ShowFlag = !PassValueChartObj.ShowFlag"></previewlist>-->
            </div>
        </Col>
    </Row>


    </div>
</template>
<script>
export default {
    data() {
        return {
            apiData: {},
            ProjectTaskChartObj: {
                screenshotID: 'ProjectTaskChart',
                tabName: 'statisProject',
                ShowFlag: false
            },
            PassValueChartObj: {
                screenshotID: 'PassValueChart',
                tabName: 'statisProject',
                ShowFlag: false
            },
            isShow: false
        };
    },

    created() {
    //this.getData();
        this.getSourceData();
        this.getPassData();
    },
    mounted() {},
    updated(){
        this.getSourceData();
        this.getPassData();
    },
    methods: {
        getSourceData() {
            this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_count, {type: "project_resource"}).then(res => {
          //this.memberTaskNumData
                if (res.data.err_code == 0) {
            //console.log("公司------项目任务资源统计返回结果：", JSON.stringify(res.data));
                    if (res.data.length <= 0) {return false;}
                    if (res.data.data == "") {return false;}
                    if (res.data.data.options == null ) {this.isShow = true; return false;}
                    let legendArr = ['任务数量', '资源组数量'];
                    let newOptions = res.data.data.options.map((item, index)=>{
               //获取options
                        let oneOption = {};
                        let series = [];
                        for (var key in item.series){
                            let str = '';
                            if (key == 'task_num') {
                              str = '任务数量';
                          } else {
                              str = '资源组数量';
                          }
                            let one = {name: str, type: 'bar', data: []};
                            one.data = item.series[key];
                            series.push(one);

                        }
                        if (series.length<=0){
                            legendArr.forEach(item=>{
                              series.push({name: item, type: 'bar', data: ['0', '0']});
                          });
                        }
                        oneOption.series = series;
                        oneOption.title = {text: res.data.data.time_m[index]+'月  '};
                        oneOption.xAxis = item.xAxis;
                        oneOption.legend = {x: 'right', show: false, data: legendArr};
                        return oneOption;
                    });
                    let apiData = {};
                    apiData.options = newOptions;
                    apiData.timelineData = res.data.data.time_m;
            //console.log("this.apiData", JSON.stringify(apiData));
                    this.$nextTick(() => {
                        this.$PublicFuns.drawEchart(()=>{
                            this.getProjectTaskChart('getProjectTaskChart', apiData);
                        });

                    });
                } else {
                    console.log("投标数据错误：", res.data.err_message);
                }
            });
        },

    //通过率
        getPassData() {
            this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_count, {type: "project_pass"}).then(res => {
          //this.memberTaskNumData
                if (res.data.err_code == 0) {
            //console.logconsole.log("公司------项目任务通过率统计返回结果：", JSON.stringify(res.data));
                    if (res.data.length <= 0) {return false;}
                    if (res.data.data == "") {return false;}
                    if (res.data.data.options == null ) {return false;}
                    let legendArr = ['外部通过率', '内部通过率'];
                    let newOptions = res.data.data.options.map((item, index)=>{
                        let oneOption = {};
                        let series = [];
               //console.log('------',item.series);
                        for (var key in item.series){
                            let str = '';
                            if (key == 'outside_pass') {
                              str = '外部通过率';
                          } else {
                              str = '内部通过率';
                          }
                            let one = {name: str, type: 'line', data: []};
                            one.data = item.series[key].map(item=>item.replace('%', ''));
                 //console.log('one.datas.................', one.data)
                            series.push(one);

                        }
                        if (series.length<=0){
                            legendArr.forEach(item=>{
                              series.push({name: item, type: 'bar', data: ['0', '0']});
                          });
                        }
                        oneOption.series = series;
                        oneOption.title = {text: res.data.data.time_m[index]+'月'};
                        oneOption.xAxis = item.xAxis;
                        oneOption.legend = {x: 'right', show: false, data: legendArr};
                        return oneOption;
                    });
                    let apiData = {};
                    apiData.options = newOptions;
                    apiData.timelineData = res.data.data.time_m;
            //console.log("this.apiData", JSON.stringify(apiData));
                    this.$nextTick(() => {
                        this.$PublicFuns.drawEchart(()=>this.getPassValueChart('getPassValueChart', apiData));
                    });
                } else {
                    console.log("通过率数据错误：", res.data.err_message);
                }
            });
        },

    //项目任务资源组数量
        getProjectTaskChart(idName, apidata) {
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
                        left: 'center',
                        text: "任务数量与资源数量",
                        subtext: "任务数量与资源数量"
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    legend: {
                        x: "right",
                        data: apidata.legend,
                        show: false
                    },
                    calculable: true,
                    dataZoom: [{
                        type: 'slider',
                        xAxisIndex: [0],
                        endValue: 7,
                        bottom: 70
                    }],
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
                            axisLabel: { interval: 0 },
                            data: apidata.xAxisData,
                            splitLine: { show: false }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "金额(元)",
                        }
                    ],
                    series: [
            { name: "任务数量", type: "bar" },
            { name: "资源组数量", type: "bar" },
                    ]
                },
                options: apidata.options
            };
            numChart.setOption(option);
        },

    //x轴为交易行为
        getPassValueChart(idName, apidata) {
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
                        left: 'center',
                        text: "项目通过率",
                        subtext: "项目通过率"
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
                    legend: {
                        x: "right",
                        data: apidata.legend,
                        show: false
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
                            axisLabel: { interval: 0 },
                            data: apidata.xAxisData,
                            splitLine: { show: false }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "通过率",
                            axisLabel: {
                                formatter: "{value}%",
                            }
                        }
                    ],
                    series: [
            { name: "资源组外部通过率", type: "bar" },
            { name: "资源组内部通过率", type: "bar" },
                    ]
                },
                options: apidata.options
            };
            numChart.setOption(option);
        },

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

