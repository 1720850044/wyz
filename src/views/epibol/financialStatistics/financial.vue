<template>
    <div class="financial-income-overview">
        <div class="financial-content">
            <div class="financial-ivu-div">
                <div v-on:click="exportCompanyStatistics" class="financial-title"><Icon type="archive" style="font-size: 15px;padding-left:235px;padding-right:10px;"></Icon>导出公司统计</div>
                <Menu @on-select="changeMenu" :theme="theme2" active-name="income" :open-names="['1']" width="360px" mode="vertical">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-paper" />
                            {{$t('companyProject.com_financialStatistics')}}
                        </template>
                        <MenuItem name="income" active-name>{{$t('companyProject.com_totalIncome')}}</MenuItem>
                        <MenuItem name="pay">{{$t('companyProject.com_totalExpenditure')}}</MenuItem>
                        <MenuItem name="balance">{{$t('companyProject.com_totalProfit')}}</MenuItem>
                        <MenuItem name="project">{{$t('companyProject.com_financialStatisticsProject')}}</MenuItem>
                        <MenuItem name="department">{{$t('companyProject.com_financialStatisticsPost')}}</MenuItem>
                    </Submenu>
                </Menu>
            </div>  
            <div class="financial-overall-situation">
                <!-- 收入趋势图表 -->
                <template>
                    <div class="income-trend">
                        <!-- esharts图  :isShowTable='true' -->
                        <div v-if="active == 'income'">
                            <total-financial></total-financial>
                        </div>
                        <div v-if="active == 'pay'">
                            <pay-financial></pay-financial>
                        </div>
                        <div v-if="active == 'balance'">
                            <balance-financial></balance-financial>
                        </div>
                        <div v-if="active == 'department'">
                            <department-financial></department-financial>
                        </div>
                        <div v-if="active == 'project'">
                            <project-financial></project-financial>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import totalFinancial from "./components/totalFinancial.vue";
import payFinancial from "./components/payFinancial.vue";
import balanceFinancial from "./components/balanceFinancial.vue";
import departmentFinancial from "./components/departmentFinancial.vue";
import projectFinancial from "./components/projectFinancial.vue";
import Cookies from 'js-cookie';
export default {
    data() {
      return {
        objData: {},
        echarsUrl: '',
        starEndDate: [],
        active: 'income',
        theme2: 'light',
        powerToken: "",
    };
  },
    components: {
      totalFinancial,
      payFinancial,
      balanceFinancial,
      departmentFinancial,
      projectFinancial
  },
    created() {
    //this.initFun();
  },
    methods: {
      changeMenu (name) {
          this.active = name;
      },
      exportCompanyStatistics(){
          let url = this.GLOBAL.baseRouter + "task/excel/export-company";
          let hostName = Cookies.get("hostName");
          let download = hostName + '/'+url + "&token=" + this.token;
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.href = download;
          a.click(); //点击触发下载
      },
      // 气泡引导
  }
};
</script>
<style>
.ivu-menu-submenu {
    background: #fff;
}
.ivu-menu-vertical {
  width: 360px;
}
</style>

<style lang="less">
.financial-income-overview {
  .financial-content {
    display: flex;
    .financial-ivu-div {
      width: 360px;
      background: #fff;
      height: 420px;
      .financial-title{
        height: 50px;
        line-height: 50px;
      }
    }
    //   总体情况
    .financial-overall-situation {
      padding: 0 40px;
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
