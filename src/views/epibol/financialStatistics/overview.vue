<template>
    <div class="income-overview">

        <div class="content">
            <tips></tips>
            <div class="overall-situation">
                <!-- 总合计 -->
                <template v-if="totalData">
                    <div class="total" >
                        <div class="total-receivables">
                            <div class="left-img">
                                <img src="../../../assets/images/two.png"/>
                            </div>
                            <div class="income-box">
                                <p class="amount">
                                    <span>{{$t('companyProject.com_totleIncome')}}</span>
                                    <span>￥</span>
                                    <span>{{totalData.total.total}}</span>
                                </p>
                                <div style="display: flex;">
                                    <div class="amount-inpreyears">
                                        <span>￥</span>
                                        <span>{{totalData.total.years_ago}}</span>
                                        <p>{{$t('companyProject.com_pastIncome')}}</p>
                                    </div>
                                    <div class="amount-thisyears">
                                        <span>￥</span>
                                        <span>{{totalData.total.this_year}}</span>
                                        <p>{{$t('companyProject.com_todaytIncome')}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="gross-proceeds">
                            <div class="left-img">
                                <img src="../../../assets/images/three.png"/>
                            </div>
                            <div class="income-box">
                                <p class="amount">
                                    <span>{{$t('companyProject.com_actualReceipts')}}</span>
                                    <span style="color: #ff7b7e;">￥</span>
                                    <span style="color: #ff7b7e;">{{totalData.income.total}}</span>
                                </p>
                                <div style="display: flex;">
                                    <div class="project-amount">
                                        <span>￥</span>
                                        <span>{{totalData.income.project}}</span>
                                        <p>{{$t('companyProject.com_projectContract')}}</p>
                                    </div>
                                    <div class="test-cost">
                                        <span>￥</span>
                                        <span>{{totalData.income.test}}</span>
                                        <p>{{$t('projectHall.pro_testingCost')}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="total-outstanding">
                            <div class="left-img">
                                <img src="../../../assets/images/four.png"/>
                            </div>
                            <div class="income-box">
                                <p class="amount">
                                    <span>{{$t('workbench.work_uncollected')}}</span>
                                    <span style="color: #ffb617;">￥</span>
                                    <span style="color: #ffb617;">{{totalData.balance.total}}</span>
                                </p>
                                <div style="display: flex;">
                                    <div class="amount-inpreyears">
                                        <span>￥</span>
                                        <span>{{totalData.balance.not_overdue}}</span>
                                        <p>{{$t('companyProject.com_notOverdue')}}</p>
                                    </div>
                                    <div class="amount-thisyears">
                                        <span>￥</span>
                                        <span>{{totalData.balance.overdue}}</span>
                                        <p>{{$t('companyProject.com_overdue')}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="total-expenditure">
                            <div class="left-img">
                                <img src="../../../assets/images/one.png"/>
                            </div>
                            <div class="income-box">
                                <p class="amount">
                                    <span>{{$t('workbench.work_expenditure')}}</span>
                                    <span style="color: #7cbefc;">￥</span>
                                    <span style="color: #7cbefc;">{{totalData.pay.total}}</span>
                                </p>
                                <div style="display: flex;">
                                    <div class="amount-inpreyears">
                                        <span>￥</span>
                                        <span>{{totalData.pay.wages}}</span>
                                        <p>{{$t('companyProject.com_fixedExpenditure')}}</p>
                                    </div>
                                    <div class="amount-thisyears">
                                        <span>￥</span>
                                        <span>{{totalData.pay.other}}</span>
                                        <p>{{$t('companyProject.com_additionalExpenditure')}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template>
                    <div class="stage-income">
                        <!-- 月收入 -->
                        <div class="annual-quarter" v-if="monthIncome">
                            <div class="title">
                                <p class="income-date">{{nowMonth}}{{$t('companyProject.com_monthlyIncome')}}
                                  <i class="iconfonts icon-jingao" @mouseover="hoverStyle('income')"  @mouseout="outStyle('income')"></i>
                                  <span v-if="isShowTips" class="tips">{{$t('companyProject.com_deadline')}}</span>
                                </p>
                                <p class="switch-month" @click="switchLastMonth(incom,monthIncomeText)">{{monthIncomeText}}<i class="iconfonts icon-source-move"></i></p>
                            </div>
                            <div class="income-detailsbox">
                                <div class="income-row-box">
                                    <p class="income-num">
                                        <span>￥</span>
                                        <span>{{monthIncome.total}}</span>
                                    </p>
                                    <P class="income-text">{{$t('companyProject.com_monthTotalIncome')}}</p>
                                </div>

                                <div class="income-row-box">
                                    <p class="income-nums">
                                        <span>{{monthIncome.count}}</span>
                                        <span>{{$t('companyProject.com_count')}}</span>
                                    </p>
                                    <P class="income-text">{{$t('companyProject.com_monthIncomeCount')}}</p>
                                </div>

                                <div class="income-row-box">
                                    <p class="income-num">
                                        <span >￥</span>
                                        <span>{{monthIncome.balance}}</span>
                                    </p>
                                    <P class="income-text">{{$t('companyProject.com_monthNotIncom')}}</p>
                                </div>

                            </div>
                        </div>
                        <!-- 月支出 -->
                        <div class="year-month" v-if="monthPay">
                            <div class="title">
                                <p class="income-date">{{lastMonth}}{{$t('companyProject.com_monthPay')}}
                                  <i class="iconfonts icon-jingao" @mouseover="hoverStyle('pay')"  @mouseout="outStyle('pay')"></i>
                                  <span v-if="isPrompt" class="tips">{{$t('companyProject.com_payLine')}}</span>
                                </p>
                                <p class="switch-month" @click="switchLastMonth(pay,monthPayText)" style='switch-month:hover:#f44336'>{{monthPayText}}<i class="iconfonts icon-source-move"></i></p>
                            </div>
                            <div class="income-detailsbox">
                                <div class="income-row-box">
                                    <p class="income-num">
                                        <span style="color:#7cbefc;">￥</span>
                                        <span style="color:#7cbefc;">{{monthPay.total}}</span>
                                    </p>
                                    <P class="income-text">{{$t('companyProject.com_monthTotalPay')}}</p>
                                </div>

                                <div class="income-row-box">
                                    <p class="income-nums">
                                        <span style="color:#7cbefc;">{{monthPay.count}}</span>
                                        <span>{{$t('companyProject.com_count')}}</span>
                                    </p>
                                    <P class="income-text">{{$t('companyProject.com_monthPayCount')}}</p>
                                </div>

                                <div class="income-row-box">
                                    <p class="income-num">
                                        <span style="color:#7cbefc;">￥</span>
                                        <span style="color:#7cbefc;">{{monthPay.wages}}</span>
                                    </p>
                                    <P class="income-text">{{$t('companyProject.com_monthFixedPay')}}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </template>
                <!-- 未收款提醒 -->
                <template >
                    <div class="nopayment-reminder">
                        <div class="left-reminder">
                            <i class="iconfonts icon-mynotice"></i>
                            <div class="left">
                                <p class="text">
                                    {{$t('companyProject.com_overdueReminder')}}
                                </p>
                            </div>
                        </div>
                        <div class="center">
                          <!-- {{nopaymentData}} -->
                            <p class="text" v-if="nopaymentData">{{$t('companyProject.com_overdue')}} <span >{{nopaymentData.overdue_count || 0 }}</span> {{$t('companyProject.com_count')}}，{{$t('companyProject.com_totalSum')}} <span>{{nopaymentData.overdue_sum || 0}}</span> {{$t('projectHall.pro_yuan')}}。</p>
                        </div>
                        <div class="right">
                            <p class="text" id="viewDetails" @click="toViewDetails">{{$t('companyProject.com_viewDetails')}}</p>
                        </div>
                    </div>
                </template>
                <!-- 查看详情对话框 -->
                <Modal v-model="showDetails" class="view-details" width="1130" footer-hide>
                    <div slot="header" style='font-size: 16px !important;color: #fff !important;font-weight: 100 !important;'>{{$t('companyProject.com_overdueDetails')}}</div>
                    <Scroll :on-reach-bottom="handleReachBottom" :loading-text='loadingText' height='600'>
                        <unpayments-tab :uncollectedList='uncollectedList' :operation="editListData" @add-comment="appendComment"></unpayments-tab>
                    </Scroll>
                    <div slot="footer"></div>
                </Modal>
                <Modal v-model="deleteModal" title="delete" width="350px" @on-ok="deleteUncollectedDtail">
                  <p style="font-size: 15px">{{$t('companyProject.com_delete')}}</p>
                </Modal>
                <!-- 收入趋势图表 -->
                <template>
                    <div class="income-trend">
                        <!-- esharts图  :isShowTable='true' -->
                        <div class="trend-map">
                            <p>{{$t('companyProject.com_incomeTrend')}}</p>
                            <div v-if="objData.data">
                              <finance-echars
                                :objData="objData"
                                :starEndDate="starEndDate"
                                :echarsUrl="echarsUrl"
                                :granularity = "true"
                                :censusType = "'line'"
                                :sort = "true"
                                :formatter = "'finance'"
                                :accToken="powerToken">
                              </finance-echars>
                            </div>
                            <template v-else>
                                <div style="height: 720px;">
                                    <loading></loading>
                                </div>
                            </template>
                        </div>
                        <!-- 表 -->
                        <!-- <everyDayDataTab v-show="activeIndex ===0" :tenderNumData='tenderNumData'></everyDayDataTab>
                        <monthDataTab v-show="activeIndex === 1" :tenderNumData='tenderNumData'></monthDataTab>
                        <yearDataTab v-show="activeIndex === 2" :tenderNumData='tenderNumData'></yearDataTab> -->
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import statis from "../../../components/statis.vue";
import FinanceEchars from "../../../components/FinanceEchars.vue";
import unpaymentsTab from "./components/unpaymentsTab.vue";
import monthDataTab from "./components/monthDataTab.vue";
import yearDataTab from "./components/yearDataTab.vue";
import everyDayDataTab from "./components/everyDayDataTab.vue";
import { onlyAPI } from "../../../axios/apiConfig"
import tips from "./components/tips.vue";
import api from "api";
export default {
    data() {
        return {
            page: {
                creentPage: 1, // 当前页数
                total: 0, // 初始化信息总条数
                page_size: 10 // 每页显示10条数据
            },
            objData: {},
            echarsUrl: '',
            starEndDate: [],
            loadingText: i18n.t('companyProject.com_loadMore'),
            powerToken: "",
            incom: i18n.t('workbench.work_income'),
            pay: i18n.t('workbench.work_expenditure'),
            monthIncomeText: i18n.t('companyProject.com_switchOldMonth'),
            monthPayText: i18n.t('companyProject.com_switchOldMonth'),
            nowMonth: null, // 当前月份
            lastMonth: null, // 上月月份
            monthIncome: null, //月份收入统计
            monthPay: null, //月份支出统计
            isShowTips: false, // 是否显示提示语(shou)
            isPrompt: false, // 是否显示提示语(zhi)
            activeIndex: 0,
            totalData: null, // 总览合计
            nopaymentData: null, // 未收款提醒数据总览
            uncollectedList: [], //未收款详情列表
            deleteModal: false, // 确认删除对话框
            deleteID: null, // 确认删除ID
            showDetails: false,
            chartOption: null,
            tenderNumData: null,
            screeningType: null, // 图标筛选类型（年 月 日 ）
            sliderData: { start: null, end: null, areaStart: null, areaEnd: null },
            timeInterval: [], // 时间
            legendSign: [],
        };
    },
    components: {
        unpaymentsTab,
        everyDayDataTab,
        monthDataTab,
        yearDataTab,
        statis,
        FinanceEchars,
        tips
    },
    created() {
        this.initFun();
    },
    mounted() {
        //console.log('多语言!')
        //console.log(i18n.t('companyProject.com_switchOldMonth'))
    },
    methods: {
      // 气泡引导
      getDataInfo () {
        var self = this;
        this.echarsUrl = this.GLOBAL.baseRouter + onlyAPI.company_trend; // onlyAPI.company_trend"
        this.$axios.post(this.echarsUrl,{
            'acc_token': self.powerToken
        }).then(this.getDataSuess);
      },
      getDataSuess (res) {
          this.objData = res.data.data;
          this.starEndDate = res.data.data.particle_range_most.split(',');
      },
        async bubbleFinance(){
            let {data} = await api.getNopaymentReminderData({acc_token: this.powerToken});
            if (data.err_code === 0 && data.guide && data.guide === 'balance'){
                this.bubble();
            }
        },
        bubble(){
            let text = this.$lau.bubble.balance;
            let defaultOptions = [
                {
                    id: 'financialNav',
                    position: 'bottom',
                    title: text[0].title,
                    content: text[0].content,
                    relative: 'body',
                },
                {
                    id: 'viewDetails',
                    position: 'left',
                    title: text[1].title,
                    content: text[1].content,
                    relative: 'body',
                },
            ];
            this.$bubble(defaultOptions);
        },
    // 逾期详情无限滚动
        handleReachBottom() {
            let newAry = [];
            return new Promise(resolve => {
                setTimeout(() => {
                    this.page.creentPage++;
                    let _this = this;
                    let url = this.GLOBAL.baseRouter+this.$GLOBALAPI.company_financelist;
                    let param = {
                        limit: this.page.page_size,
                        page: this.page.creentPage,
                        acc_token: this.powerToken
                    };
                    this.$axios.post(url, param).then(result => {
                        if (result.data.err_code === 0) {
                          newAry = result.data.data.data;
                          if (newAry.length > 0){
                            this.loadingText = i18n.t('companyProject.com_loadMore');
                            newAry.forEach(element => {
                              this.uncollectedList.push(element);
                          });
                        } else {
                            this.loadingText = i18n.t('companyProject.com_toEnd');
                        }

              // const last = this.uncollectedList[this.uncollectedList.length - 1];
              // for (let i = 1; i < 5; i++) {
              //     this.uncollectedList.push(last + i);
              // }
                      } else {
                          this.$Message.error(result.data.err_message);
                      }
                    });
                    resolve();
                }, 2000);
            });
        },
        hoverStyle(types) {
            if (types == "income") {
                this.isShowTips = true;
            } else if (types == "pay") {
                this.isPrompt = true;
            }
        },
        outStyle(types) {
            if (types == "income") {
                this.isShowTips = false;
            } else if (types == "pay") {
                this.isPrompt = false;
            }
        },
    // 切换上月

    async switchLastMonth(value, text) {
      if (text == i18n.t('companyProject.com_switchOldMonth')) {
        let res = await api.getTotalData({ acc_token: this.powerToken });
        if (value == i18n.t('workbench.work_income')) {
          if (res.data.err_code == 0) {
            this.monthIncome = res.data.data.last_month.income;
            this.nowMonth = res.data.data.last_month.now_month;
            this.monthIncomeText = i18n.t('companyProject.com_switchMonth');
          } else {
            this.$Messages.error(res.data.err_message);
          }
        } else if (value == i18n.t('workbench.work_expenditure')) {
          if (res.data.err_code == 0) {
            this.monthPay = res.data.data.last_month.pay;
            this.lastMonth = res.data.data.last_month.now_month;
            this.monthPayText = i18n.t('companyProject.com_switchMonth');
          } else {
            this.$Messages.error(res.data.err_message);
          }
        }
      } else if (text == i18n.t('companyProject.com_switchMonth')) {
        this.getTotalDataInit();
        this.monthIncomeText = i18n.t('companyProject.com_switchOldMonth');
        this.monthPayText = i18n.t('companyProject.com_switchOldMonth');
      }
    },

        async initFun() {
            const res = await api.totalInitInterface();
            if (res.data.err_code == 0) {
                this.powerToken = res.data.data.acc_token;
                this.getDataInfo();
        //this.getChartInitData();
                this.getTotalDataInit();
                this.bubbleFinance();
            } else {
                this.$Message.error(res.data.err_message);
            }
        },
    
        async getChartInitData(types) {
            let parameter = {
                type: this.screeningType,
                begin: this.timeInterval[0],
                end: this.timeInterval[1],
                acc_token: this.powerToken
            };
            if (parameter.type == "month") {
                if (parameter.begin && parameter.end) {
                    parameter.begin =
            parameter.begin.split("-")[0] + "-" + parameter.begin.split("-")[1];
                    parameter.end =
            parameter.end.split("-")[0] + "-" + parameter.end.split("-")[1];
                }
            } else if (parameter.type == "year") {
                if (parameter.begin && parameter.end) {
                    parameter.begin = parameter.begin.split("-")[0];
                    parameter.end = parameter.end.split("-")[0];
                }
            }
            let { data } = await api.getIncomeTrendData(parameter);
            if (data.err_code === 0 && data.data) {
                this.tenderNumData = data.data;
                if ( this.sliderData.areaStart == null || this.sliderData.areaEnd == null ) {
                    this.sliderData = {
                        start: this.tenderNumData.default_time.begin,
                        end: this.tenderNumData.default_time.end,
                        areaStart: this.tenderNumData.default_time.begin,
                        areaEnd: this.tenderNumData.default_time.end
                    };
                    let obj = {
                        type: this.screeningType,
                        begin: this.sliderData.start,
                        end: this.sliderData.end,
                        acc_token: this.powerToken
                    };
                    this.getEveryDayData(obj);
                }
                // if (types == "月"){
                //     this.getChartDataInit(this.tenderNumData.time, this.tenderNumData.total, this.tenderNumData.pay_arr, this.tenderNumData.gain);
                // } else {
                //     this.getChartDataInit(this.tenderNumData.time, this.tenderNumData.total, this.tenderNumData.pay_arr);
                // }

            } else {
                this.$Message.error(data.err_message);
            }
        },
    //  日
        async getEveryDayData(obj) {
            let { data } = await api.getIncomeTrendData(obj);
            if (data.err_code == 0) {
                this.tenderNumData = data.data;
            } else {
                this.$Message.error(data.err_message);
            }
        },

    
    // 总计
        async getTotalDataInit() {
            let res = await api.getTotalData({ acc_token: this.powerToken });
            if (res.data.err_code == 0) {
                this.totalData = res.data.data;
                this.monthIncome = res.data.data.this_month.income;
                this.monthPay = res.data.data.this_month.pay;
                this.nowMonth = res.data.data.this_month.now_month;
                this.lastMonth = res.data.data.this_month.now_month;
                this.nopaymentData = res.data.data.balance_warming;
                let date = new Date();
                let currentMonth = date.getMonth() + 1;
                currentMonth = currentMonth < 10 ? "0" + currentMonth : currentMonth;
                if (this.nowMonth == currentMonth) {
                    this.nowMonth = i18n.t('companyProject.com_book');
                }
                if (this.lastMonth == currentMonth) {
                    this.lastMonth = i18n.t('companyProject.com_book');
                }
            } else {
                this.$Messages.error(res.data.err_message);
            }
        },
    // 查看详情对话框
        toViewDetails() {
            this.showDetails = true;
            this.getNopaymentDataInit();
        },
    // 未收款详情列表
        async getNopaymentDataInit() {
            let _this = this;
            const res = await api.getNopaymentReminderData({
                acc_token: this.powerToken
            });
            if (res.data.err_code == 0) {
                _this.uncollectedList = res.data.data.data;
            } else {
                _this.$Messages.error(res.data.err_message);
            }
        },
    // 筛选
    // 操作（编辑、删除）
        editListData(value) {
            this.deleteModal = true;
            this.deleteID = value;
        },
        async deleteUncollectedDtail() {
            let res = await api.delNopaymentData({
                id: this.deleteID,
                acc_token: this.powerToken
            });
            if (res.data.err_code == 0) {
                this.getNopaymentDataInit();
                this.getTotalDataInit();
                this.$Message.success(res.data.err_message);
            } else {
                this.$Message.error(res.data.err_message);
            }
        },
    // 编辑
        async appendComment(item, params) {
            params.acc_token = this.powerToken;
            if (isNaN(params.balance)) {
                this.$Message.error(i18n.t('companyProject.com_mustNumber'));
            } else if (!params.balance) {
                this.$Message.error(i18n.t('companyProject.com_edit'));
            } else if (params.balance <= 0) {
                this.$Message.error(i18n.t('companyProject.com_editMoney'));
            } else {
                let data = await api.editNopaymentData(params);
                if (data.data.err_code == 0) {
                  this.$Message.success(i18n.t('companyProject.com_editSueccs'));
                  this.getNopaymentDataInit();
              } else {
                  this.$Message.error(data.data.err_message);
              }
            }
        }
    }
};
</script>
<style lang="less">
.income-overview {
  .content {
    //   总体情况
    .overall-situation {
      // 总合计
      .total {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        .total-receivables,
        .gross-proceeds,
        .total-outstanding,
        .total-expenditure {
          display: flex;
          align-items: center;
          width: 23.5%;
          padding: 16px 20px;
          border-radius: 3px;
          background: #ffffff;
          box-shadow: @boxShadow;
          .left-img {
            padding-right: 35px;
            img {
              width: 60px;
              height: 60px;
            }
          }
          .income-box {
            .amount {
              padding-bottom: 12px;
              text-align: center;
              span:nth-child(1) {
                font-size: 14px;
                color: #dbdbdb;
              }
              span:nth-child(2) {
                font-size: 12px;
                color: #3cd2b4;
              }
              span:nth-child(3) {
                font-size: 20px;
                color: #3cd2b4;
              }
            }
            .amount-inpreyears,
            .project-amount {
              padding-right: 20px;
              border-right: 1px dashed #e0e0e0;
              color: #818181;
              span:nth-child(1) {
                font-size: 12px;
              }
              span:nth-child(2) {
                font-size: 16px;
              }
              p {
                font-size: 12px;
                color: #dbdbdb;
                text-align: center;
                padding-top: 12px;
              }
            }
            .amount-inpreyears,
            .amount-thisyears {
              text-align: center;
            }
            .amount-thisyears,
            .test-cost {
              color: #818181;
              padding-left: 20px;
              span:nth-child(1) {
                font-size: 12px;
              }
              span:nth-child(2) {
                font-size: 16px;
              }
              p {
                font-size: 12px;
                color: #dbdbdb;
                text-align: center;
                padding-top: 12px;
              }
            }
          }
        }
      }
      // 阶段收入
      .stage-income {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        .annual-quarter,
        .year-month {
          width: 49%;
          padding: 16px 20px;
          border-radius: 3px;
          background: #ffffff;
          box-shadow: @boxShadow;
          .title {
            display: flex;
            justify-content: space-between;
            color: #818181;
            margin: 0px 0px 15px 0px;
            align-items: center;
            .income-date {
              font-size: 16px;
            }
            .switch-month {
              font-size: 10px;
              cursor: pointer;
            }
            .iconfonts {
              font-size: 12px;
              color: #bdbdbd;
              padding-left: 5px;
              cursor: pointer;
            }
            .tips {
              margin-left: 5px;
              color: #818181;
              font-size: 12px;
            }
          }

          .income-detailsbox {
            display: flex;
            justify-content: space-around;
            text-align: center;
            .income-row-box {
              min-width: 140px;
              border-right: 1px dashed #e0e0e0;
              padding-right: 60px;
              &:last-child {
                border-right: none;
                padding-right: 0px;
              }
              .income-num {
                margin: 0px 0px 15px 0px;
                span:nth-child(1) {
                  font-size: 12px;
                  color: #3cd2b4;
                }
                span:nth-child(2) {
                  font-size: 20px;
                  color: #3cd2b4;
                }
              }
              .income-nums {
                margin: 0px 0px 15px 0px;
                span:nth-child(1) {
                  font-size: 20px;
                  color: #3cd2b4;
                }
                span:nth-child(2) {
                  font-size: 14px;
                  color: #dbdbdb;
                }
              }
              .income-text {
                font-size: 12px;
                color: #818181;
              }
            }
          }
        }
      }
      // 未收提醒
      .nopayment-reminder {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        border-radius: 3px;
        background: rgb(255, 255, 255);
        box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px 0px;
        padding: 16px 20px;
        align-items: center;
        .left-reminder {
          display: flex;
          align-items: center;
          .iconfonts {
            font-size: 24px;
            color: #ffb617;
            margin-right: 10px;
          }
          .left {
            .text {
              font-size: 13px;
              color: #818181;
              text-align: center;
            }
          }
        }
        .center {
          .text {
            font-size: 13px;
            color: #818181;
            span {
              color: #ffb617;
            }
          }
        }
        .right {
          .text {
              position: relative;
              width: 100%;
            font-size: 13px;
            color: #3cd2b4;
            cursor: pointer;
          }
        }
      }
      // 收入趋势
      .income-trend {
        width: 100%;
        background-color: #fff;
        border-radius: 3px;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px 0px;
        .trend-map {
          p {
            padding: 16px 20px;
            padding-bottom: 10px;
            padding-right: 0px;
            font-size: 16px;
            color: #818181;
          }
          .commonStatic {
            .itemBox-CheckboxGroup {
              margin-left: 20px;
              display: flex;
              align-items: center;
              .ivu-radio-group {
                margin-right: 20px;
              }
              .itemBox-talbetxt {
                color: #777;
                font-size: 12px;
              }
            }
            .itemBox-chartBox {
              margin-left: 20px;
              // margin-right: 20px;
              padding-right: 20px;
              div{
                canvas{
                  margin-top: -20px !important;
                }
              }
            }
            .sliderContainer{
              margin: 0 20px;
              margin-top: -30px;
            }
            .tableContainer {
              margin: 20px;
              margin-bottom: 0px;
            }
          }
        }
      }
    }
  }
}
</style>
