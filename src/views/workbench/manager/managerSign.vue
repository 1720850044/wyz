<template>
    <div class="sign_all">
        <div class="clearfix sign_head">
            <p class="sign_head_msg">{{$t('workbench.work_contract')}}</p>
            <!-- <p class="sign_head_but iconfonts icon-shenglve-"></p> -->
        </div>
        <div class="sign_main">
            <!-- <div class="sign_main_details"> -->
            <div class="sign_details_money">
                <p class="sign_money_title">{{$t('workbench.work_totalSum')}}</p>
                <p>
                    <span class="money_head">￥</span>
                    <span class="money_num">{{total}}</span>
                    <span class="money_footer">{{$t('workbench.work_thousand')}}</span>
                    <b class="rise iconfonts icon-xiangshang01"></b>
                    <span class="rise_title">+{{add}}</span>
                    <span class="money_head">({{$t('workbench.work_lastYear')}})</span>
                </p>
            </div>
            <div class="year_bx">
                <Dropdown trigger="click">
                    <a href="javascript:void(0)" class="xia_style">
                        {{yearName}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="(item, index) in constobj" :key="index" @click.native="getYear(index)">
                            {{item.year}}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <!-- </div> -->
            <!-- <div class="sign_main_left">
              <div class="sign_left_head">
                <span class="sign_baifen">￥{{total}}</span>
                <span class="sign_wan">万</span>
              </div>
              <p class="sign_lefe_alt"><span>去年同比</span><span class="sign_left_title"><i class="iconfonts icon-xiangshang01"/>+{{add}}</span></p>
             </div> -->
            <div class="sign_main_right" id="sign_box">
            </div>
            <!-- <ul class="year_bx">
              <li v-for="(item, index) in constobj" :key="index">
                <p @click="getYear(index)" :class="item.backClass">{{item.year}}</p>
              </li>
            </ul> -->
        </div>
    </div>
</template>
<script>
    export default {
        props:
            ['contList'],
        data() {
            return {
                // yearList: [
                //   {year: 2018, backClass: 'yearClass'},
                //   {year: 2017, backClass: ''},
                //   {year: 2016, backClass: ''}
                // ],
                constobj: [],
                yearName: 0,
                total: '',
                add: ''
            };
        },
        watch: {
            contList: function (e) {
                this.constobj = e;
                this.getYear(0);

                //  console.log('数据', e)
            }
        },
        mounted() {
            // this.getYear(0)
            //  console.log('数据', this.contList)
        },
        methods: {
            // 点击事件
            numbers(e) {
                // console.log('数据', e)
            },
            // 获取数据
            getYear(index) {
                const list = this.constobj;
                list.forEach((item, idx) => {
                    if (index === idx) {
                        item.backClass = 'yearClass';
                    } else {
                        item.backClass = '';
                    }
                });
                // console.log('数据ss', list[index])
                const yearList = list[index];
                this.yearName = yearList.year;
                this.total = yearList.total;
                this.add = yearList.add;
                // this.constobj = list

                this.$PublicFuns.drawEchart(() => {
                    this.$nextTick(() => {
                        this.getEcharts(yearList);
                    });
                });
            },
            // echarts 数据图
            getEcharts(list) {
                let echarts = require('echarts');
                const lists = list.list;
                const myCharts = echarts.init(document.getElementById('sign_box'), 'echartTheme');
                const yearName = this.yearName;
                const bidNum = []; // 合同数量
                const bidMeng = []; // 合同金额
                for (let i in lists) {
                    const num = lists[i].num;
                    const price = lists[i].price / 10000;
                    bidNum.push(num);
                    bidMeng.push(price);
                }
                // const littt = [1,5,6,8,0,2,3,0]
                const maxNum = Math.max.apply(null, bidNum);
                const maxMeng = Math.ceil(Math.max.apply(null, bidMeng));
                let textMsg = function (parames) {
                    const tempStr = parames + "\n" + yearName;
                    return tempStr;
                    // console.log('数据', parames)
                };
                myCharts.setOption({
                    color: ['#4fdcc5', '#91cafe'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#bdbdbd'
                            }
                        }
                    },
                    grid: {
                        left: '25px',
                        right: '25px',
                        top: '80px',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        icon: 'stack',
                        right: '10%',
                        top: '10px',
                        textStyle: {color: '#bdbdbd', fontSize: '12px'},
                        data: [i18n.t('workbench.work_contractNum'), i18n.t('workbench.work_contractMoney')]
                    },
                    xAxis: [{
                        type: 'category',
                        axisLabel: {
                            formatter: textMsg,
                            textStyle: {color: '#bdbdbd', fontSize: '12px'},
                        },
                        axisTick: { //x轴刻度线
                            show: false,
                        },
                        axisLine: { //x轴
                            show: false,
                        },
                        textStyle: {color: '#bdbdbd', fontSize: '12px'},
                        data: [i18n.t('workbench.work_january'), i18n.t('workbench.work_february'), i18n.t('workbench.work_march'), i18n.t('workbench.work_april'), i18n.t('workbench.work_may'), i18n.t('workbench.work_june'), i18n.t('workbench.work_july'), i18n.t('workbench.work_august'), i18n.t('workbench.work_september'), i18n.t('workbench.work_october'), i18n.t('workbench.work_november'), i18n.t('workbench.work_december')],
                    }],
                    yAxis: [{
                        type: 'value',
                        name: i18n.t('workbench.work_order'),
                        nameLocation: 'start',
                        min: 0,
                        max: maxNum,
                        splitLine: {
                            show: false,
                        },
                        interval: maxNum / 2,
                        axisLabel: {
                            formatter: '{value}',
                            color: '#bdbdbd'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#bdbdbd',
                            }
                        }
                    },
                    {
                        type: 'value',
                        name: i18n.t('workbench.work_money'),
                        nameLocation: 'start',
                        splitLine: {
                            show: false,
                        },
                        min: 0,
                        max: maxMeng,
                        interval: maxMeng / 2,
                        axisLabel: {
                            color: '#bdbdbd',
                            formatter: '{value}'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#bdbdbd'
                            }
                        }
                    }],
                    series: [
                        {
                            name: i18n.t('workbench.work_contractNum'),
                            type: 'line',
                            yAxisIndex: 0,
                            symbol: 'circle',
                            //拐点样式
                            symbolSize: 7,
                            //拐点大小
                            // itemStyle: {
                            //     normal: {
                            //         color: '#3bceb6',
                            //         lineStyle: {
                            //             width: 2,
                            //             type: 'solid' //'dotted'虚线 'solid'实线
                            //         }
                            //     }
                            // },
                            data: bidNum
                        }, {
                            name: i18n.t('workbench.work_contractMoney'),
                            type: 'bar',
                            yAxisIndex: 1,
                            // itemStyle: {
                            //     normal: {
                            //         color: '#2196F3',
                            //     }
                            // },
                            data: bidMeng
                        }]
                });
            }
        }
    };
</script>
<style lang='less'>
    .sign_all {
        .base-card;
        .sign_head_msg {
            .base-card-operation-head;
        }
        .sign_head_but {
            .base-card-operation-icon;
        }
    }

    .sign_main {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .sign_main_left {
        float: left;
    }

    .sign_main_right {
        float: right;
        height: 90%;
        width: 100%;
    }

    .sign_lefe_alt {
        font-size: 16px;
    }

    .sign_left_head {
        height: 120px;
    }

    .sign_baifen {
        font-size: 40px;
        color: rgb(24, 191, 164);
        font-weight: 400;
    }

    .sign_left_title {
        color: rgb(255, 51, 0);
        margin-left: 10px;
    }

    .sign_wan {
        font-size: 16px;
        color: rgb(215, 215, 215);
        margin-left: 5px;
    }

    .xia_style {
        color: #bdbdbd;
    }

    .sign_details_money {
        position: absolute;
        top: 10px;
        left: 20px;
        height: 100%;
    }

    .sign_money_title {
        font-size: 12px;
        color: #bdbdbd;
    }

    .money_head {
        font-size: 13px;
        color: #bdbdbd;
    }

    .money_num {
        font-size: 20px;
        color: #3bceb6;
    }

    .money_footer {
        font-size: 13px;
        color: #3bceb6;
    }

    .rise {
        font-size: 13px;
        font-weight: bold;
        color: rgb(255, 51, 0);
    }

    .rise_title {
        font-size: 13px;
        color: rgb(255, 51, 0);
    }

    .year_bx {
        position: absolute;
        right: 20px;
        top: 10px;
        z-index: 9;
        border: 1px solid #eaeaea;
        border-radius: 13px;
        padding: 2px 15px;
    }

    .year_bx > li {
        float: left;
        margin-right: 10px;
        font-size: 16px;
        cursor: pointer;
        color: rgb(210, 210, 210);
    }

    .yearClass {
        color: rgb(24, 191, 164);
    }
</style>

