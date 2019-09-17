<!--公司 = 统计 = 投标-->

<template>
    <div>
    <Row :gutter="30"  >
       
        <Col span="24" class-name='bgw'>
            <div class="itemBox base-card">
              <div class="base-card-head">
                <div class="base-card-operation-head" >转化</div>
                <div class="base-card-operation-icon" >
                    <!--<em class="icon iconfonts icon-backs" style="font-size: 18px" @click="TenderChartObj.ShowFlag = !TenderChartObj.ShowFlag" v-if="!isShow"></em>-->
                    <!--<p class="iconfonts icon-shenglve-"></p>-->
                </div>
              </div>
              <bid-echars v-if="changeObjData.data"
                :objData="changeObjData"
                :censusType = "'bar,line'"
                :starEndDate="changeStarEndDate"
                :accToken="powerToken"
                :formatter = "'转化'"
                :sort = "true"
                :yAxis = "yAxis"
                :percentage = "'change_rate'"
                :echarsId = "'TenderChangeChart'"
                :echarsUrl="changeEcharsUrl">
             </bid-echars>
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
import BidEchars from "../../../../components/BidEchars.vue";
import { onlyAPI } from "../../../../axios/apiConfig"
import api from "api";
export default {
    data() {
        return {
    //   chartConfig:{
    //     colors:this.GLOBAL.echartCFG.colors,
    //   },
            tenderNumData: {
                time_m: [],
                total_bid: [],       //中标投标总数
                win_bid: [],         //中标总数
                fail_remarks: [],    //一段时间内的投标行为总数,包含：失败原因（暂无）
                bid_rate: [],          //中标率(中标总数/投标总数)
                notStandard_num: [], //测试任务质量不达标
	            CustomerCancel_num: [], //客户取消数量
                timeConflict_num: [],     //时间周期冲突数量
                percentage: [0, 0, 0]       //饼图
            },
            TenderChartObj: {
                screenshotID: 'TenderChart',
                tabName: 'statisTender',
                ShowFlag: false
            },
            FailRemarksChartObj: {
                screenshotID: 'FailRemarksChart',
                tabName: 'statisTender',
                ShowFlag: false
            },
            isShow: false,
            objData: {},
            changeObjData: {},
            starEndDate: [],
            changeStarEndDate: [],
            powerToken: '',
            echarsUrl: '',
            yAxis: [
                {name: '中标数量',type: 'value',min: 0,interval: 1},
                {name: '转化率',type: 'value',min: 0,
                    max: 100,        // 计算最大值
                    interval: 20,   //  平均分为5份
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
              ],
            changeEcharsUrl: ''
        };
    },
    components: {
        BidEchars
    },
    created() {
    //成员任务数量
        this.initFun().then(() => {
            this.getTenderChangeChart();
        });
        // this.$PublicFuns.drawEchart(()=>this.getTenderData());
    },
    mounted() {
    },
    methods: {
        async initFun() {
            const res = await api.getCustomerInfo();
            if (res.data.err_code == 0) {
                this.powerToken = res.data.data.acc_token;
            } else {
                this.$Message.error(res.data.err_message);
            }
        },
    //js 数组去重
        uniquess(arr) {
            var hash = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr.indexOf(arr[i]) == i) {
                    hash.push(arr[i]);
                }
            }
            return hash;
        },
        getTenderChangeChart () {
            var self = this;
            this.changeEcharsUrl = this.GLOBAL.baseRouter + onlyAPI.company_bid_change_rate;
            this.$axios.post(this.changeEcharsUrl,{
                'acc_token': self.powerToken
            }).then(this.getTenderChangeChartSuccess);
        },
        getTenderChangeChartSuccess (res) {
            this.changeObjData = res.data.data;
            this.changeStarEndDate = res.data.data.particle_range_most.split(',');
        },
        getTenderData() {
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_count, {type: 'bid'}).then(res => {
          //this.memberTaskNumData
                if (res.data.err_code == 0) {
            // console.log('公司投标统计返回结果：',JSON.stringify(res.data));
                    if (res.data.length <= 0) {return false;}
                    if (res.data.data == '') {return false;}
                    this.tenderNumData = res.data.data;
                    let notStandard_all = 0;
                    let CustomerCancel_all = 0;
                    let timeConflict_all = 0;
                    if (res.data.data.notStandard_num == null){
                        console.log("当前数据为空!");
                        this.isShow = true;
                        return false;
                    } else if (res.data.data.CustomerCancel_num == null){
                        this.isShow = true;
                        return false;
                    } else if (res.data.data.timeConflict_num == null){
                        this.isShow = true;
                        return false;
                    }
                    res.data.data.notStandard_num.forEach(item=>{notStandard_all += parseInt(item);});
                    res.data.data.CustomerCancel_num.forEach(item=>{CustomerCancel_all += parseInt(item);});
                    res.data.data.timeConflict_num.forEach(item=>{timeConflict_all += parseInt(item);});
                    this.tenderNumData.percentage = [notStandard_all, CustomerCancel_all, timeConflict_all];
                    this.$nextTick(()=>{
                        this.getDataInfo();
                        //this.getTenderChart('getTenderChart');
                        this.getTenderChangeChart();
                        this.getFailRemarksChart('getFailRemarksChart');
                    });
                } else {
                    console.log("投标数据错误：", res.data.err_message);
                }
            });
        },

    //投标行为总数
        getTenderChart(idName) {
            let echarts = require("echarts");
            let numChart = echarts.init(document.getElementById(idName), 'echartTheme');
            let option = {
                tooltip: {
                    trigger: 'axis',
              //formatter:'{b0}<br/>{a0}:{c0}'+this.unit,
                    formatter: function(params){
                //console.log(params);
                        let unit = '个';
                        var relVal = params[0].name+'月2';
                        for (var i = 0; i < params.length; i++) {
                            if (params[i].seriesName == '中标率') {unit = '%';}
                            relVal += '<div class="circle" ><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + params[i].value+unit+"</div>";
                        }
                        return relVal;
                    },
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    left: this.GLOBAL.echartCFG.gridLeft,
                    right: this.GLOBAL.echartCFG.gridRight,
                    containLabel: true
                },
                legend: {
                    data: ['中标总数', '投标总数', '中标率']
                },
                xAxis: [
                    {

                        type: 'category',
                //   min: 1,
                //   max: 4,
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: this.tenderNumData.timelineData,
                        axisLabel: {
                            formatter: '{value}月',
                            interval: 'auto',
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '数量',
                        position: 'left',
                        offset: 0,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '中标率',
                        min: 0,
                        max: 100,
                        position: 'right',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                dataZoom: [{
                    type: 'slider',
                // start: 8,
                // end: 12,
                // startVale:'8',
                // endValue:'12',
                    xAxisIndex: [0],
                }],
                series: [
                    {
                        name: '中标总数',
                        type: 'bar',
                        data: this.tenderNumData.win_bid.split(',')
                    },
                    {
                        name: '投标总数',
                        type: 'bar',
                        yAxisIndex: 0,
                        data: this.tenderNumData.total_bid.split(',')
                    },
                    {
                        name: '中标率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.tenderNumData.bid_rate.split(',')
                    }
                ]
            };
            numChart.setOption(option, true);
        },

    //行为fail_remarks 暂无数据可以测试  假的
        getFailRemarksChart(idName) {
            let echarts = require("echarts");
            let aumChart = echarts.init(document.getElementById(idName), 'echartTheme');
            let option = {
                tooltip: {
                    formatter: '{a0}<br/>{b0}月:{c0}个',
                    trigger: 'item',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: ['客户取消数量', '测试任务质量不达标', '时间周期冲突数量']
                }, grid: {
                    left: this.GLOBAL.echartCFG.gridLeft,
                    right: "50%",
                    bottom: "17%",
                    top: "20%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: this.tenderNumData.timelineData,
                        axisLabel: {
                            formatter: '{value}月'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '数量',
                        position: 'left',
                        axisLabel: {
                            formatter: '{value}个'
                        },

                    }
                ],
                dataZoom: [{
                    type: 'slider',
                    start: 0,
                    end: 12,
                    xAxisIndex: [0],
                }],
                series: [
                    {
                        name: '客户取消数量',
                        type: 'bar',
                        data: this.tenderNumData.CustomerCancel_num
                    }, {
                        name: '测试任务质量不达标',
                        type: 'bar',
                        data: this.tenderNumData.notStandard_num
                    },, {
                        name: '时间周期冲突数量',
                        type: 'bar',
                        data: this.tenderNumData.timeConflict_num
                    }, {
                        name: '公司项目失败原因',
                        center: ['75%', '50%'],
                        radius: '50%',
                        type: 'pie',
                        data: [
                      {value: this.tenderNumData.percentage[0], name: '客户取消总数'},
                      {value: this.tenderNumData.percentage[1], name: '测试任务质量不达标总数'},
                      {value: this.tenderNumData.percentage[2], name: '时间周期冲突总数'},
                        ]

                    },

                ]
            };
            aumChart.setOption(option);
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
        //333
    }
    .itemBox{position: relative}
</style>
<style>
.ivu-col-span-6 {
    width: 28%;
}
</style>


