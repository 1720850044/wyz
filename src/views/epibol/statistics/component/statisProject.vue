<!--statisProject.vue 公司统计->项目统计-->
<template>
    <div>
    <Row :gutter="30"  >
        <Col span="24" class-name='bgw' id="ProjectTaskChart">
            <div class="itemBox base-card" >
              <div class="base-card-head">
                <div class="base-card-operation-head" >{{$t('companyStatistics.company_projectStatus')}}</div>
                <div class="base-card-operation-icon" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px" @click="ProjectTaskChartObj.ShowFlag = !ProjectTaskChartObj.ShowFlag" v-if="!isShow"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
              </div>
              <!-- <div id='getProjectTaskChart' class="itemBox-chartBox bigChartBox" style="height:450px">
                <nothink type="project" text="暂无数据" v-if="isShow"></nothink>
              </div> -->
              <company-echars v-if="objData.data"
                :objData="objData"
                :isTitle = "false"
                :starEndDate = "starEndDate"
                :total = "true"
                :granularity = "false"
                :accToken="powerToken"
                :formatter = "'statisProject'"
                :censusType = "'heap'"
                :echarsUrl="echarsUrl">
             </company-echars>
             <template v-else>
                <div style="height: 720px">
                    <loading></loading>
                </div>
            </template>
                <!--<previewlist :propsData="ProjectTaskChartObj" @closeSlide="ProjectTaskChartObj.ShowFlag = !ProjectTaskChartObj.ShowFlag"></previewlist>-->
            </div>
        </Col>
    </Row>


    </div>
</template>
<script>
import FinanceEchars from "../../../../components/FinanceEchars.vue";
import CompanyEchars from "../../../../components/CompanyEchars.vue";
import api from "api";
export default {
    data() {
        return {
            apiData: {},
            objData: {},
            echarsUrl: '',
            starEndDate: [],
            powerToken: '',
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
    components: {
        FinanceEchars,
        CompanyEchars
    },
    created() {
    //this.getData();
        //this.getSourceData();
        //this.getPassData();
        this.initFun().then(() => {
            this.getDataInfo();
        });
    },
    mounted() {

    },
    updated(){
        //this.getSourceData();
        //this.getPassData();
    },
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
        getDataInfo () {
            var self = this;
            this.echarsUrl = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_count_project;
            this.$axios.post(this.echarsUrl,{
                'acc_token': self.powerToken
            }).then(this.getDataSuess);
        },
        getDataSuess (res) {
            this.objData = res.data.data;
            this.starEndDate = res.data.data.particle_range_most.split(',');
            //console.log(res.data.data)
        },
        getSourceData() {
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_count, {type: "project_resource"}).then(res => {
          //this.memberTaskNumData
                if (res.data.err_code == 0) {
            //console.log("公司------项目任务资源统计返回结果：", JSON.stringify(res.data));
                    if (res.data.length <= 0) {return false;}
                    if (res.data.data == "") {return false;}
                    if (res.data.data.options == null ) {this.isShow = true; return false;}
                    let legendArr = [i18n.t('project.pro_taskNumber'), i18n.t('companyStatistics.company_resourceGroups')];
                    let newOptions = res.data.data.options.map((item, index)=>{
               //获取options
                        let oneOption = {};
                        let series = [];
                        for (var key in item.series){
                            let str = '';
                            if (key == 'task_num') {
                                str = i18n.t('project.pro_taskNumber');
                            } else {
                                str = i18n.t('companyStatistics.company_resourceGroups');
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
                        oneOption.title = {text: res.data.data.time_m[index] + i18n.t('lang.lang_month')};
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
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_count, {type: "project_pass"}).then(res => {
          //this.memberTaskNumData
                if (res.data.err_code == 0) {
            //console.logconsole.log("公司------项目任务通过率统计返回结果：", JSON.stringify(res.data));
                    if (res.data.length <= 0) {return false;}
                    if (res.data.data == "") {return false;}
                    if (res.data.data.options == null ) {return false;}
                    let legendArr = [i18n.t('companyStatistics.company_externalThroughput'), i18n.t('project.pro_interiorPassRate')];
                    let newOptions = res.data.data.options.map((item, index)=>{
                        let oneOption = {};
                        let series = [];
               //console.log('------',item.series);
                        for (var key in item.series){
                            let str = '';
                            if (key == 'outside_pass') {
                                str = i18n.t('companyStatistics.company_externalThroughput');
                            } else {
                                str = i18n.t('project.pro_interiorPassRate');
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
                        oneOption.title = {text: res.data.data.time_m[index] + i18n.t('lang.lang_month')};
                        oneOption.xAxis = item.xAxis;
                        oneOption.legend = {x: 'right', show: false, data: legendArr};
                        return oneOption;
                    });
                    let apiData = {};
                    apiData.options = newOptions;
                    apiData.timelineData = res.data.data.time_m;
            //console.log("this.apiData", JSON.stringify(apiData));
                    this.$nextTick(() => {
                        // this.$PublicFuns.drawEchart(()=>this.getPassValueChart('getPassValueChart', apiData));
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
                        text: i18n.t('companyStatistics.company_taskResourcesNum'),
                        subtext: i18n.t('companyStatistics.company_taskResourcesNum')
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
                            name: i18n.t('companyStatistics.company_priceY'),
                        }
                    ],
                    series: [
            { name: i18n.t('project.pro_taskNumber'), type: "bar" },
            { name: i18n.t('companyStatistics.company_resourceGroups'), type: "bar" },
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
                        text: i18n.t('companyStatistics.company_projectPassRate'),
                        subtext: i18n.t('companyStatistics.company_projectPassRate')
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
                            name: i18n.t('companyStatistics.company_passRate'),
                            axisLabel: {
                                formatter: "{value}%",
                            }
                        }
                    ],
                    series: [
            { name: i18n.t('companyStatistics.company_externalPassRate'), type: "bar" },
            { name: i18n.t('companyStatistics.company_insidePassRate'), type: "bar" },
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

