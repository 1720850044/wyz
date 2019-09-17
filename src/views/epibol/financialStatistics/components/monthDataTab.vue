<template>
      <!-- v-if="tenderNumData.length > 0" -->
      <!-- <div class="incomeList">
            <table class="first-half-year" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:40px;">
                <tr>
                    <td rowspan="2">时间范围</td>
                </tr>
                <tr>
                    <td v-for="(item,index) in timeArr" :key='index' >{{item}}</td>
                </tr>
                <tr>
                    <td>收入总额（元）</td>
                    <td v-for="(item,index) in incomeArr" :key='index' >{{item}}</td>
                </tr>
                <tr>
                    <td>未收款（元）</td>
                    <td v-for="(item,index) in balanceArr" :key='index'>{{item}}</td>
                </tr>
                <tr>
                    <td>同比(%)</td>
                    <td v-for="(item,index) in yearOnYearArr" :key='index'>{{item}}</td>
                </tr>
                <tr>
                    <td>环比(%)</td>
                    <td v-for="(item,index) in monthToMonth" :key='index'>{{item}}</td>
                </tr>
            </table>
      </div> -->
      <!-- <div class="table-list">
          <div class="table-head">
              <span>日期</span>
              <span>总收入</span>
              <span>实收款</span>
              <span>未收款</span>
              <span>月收入同比</span>
              <span>月收入环比</span>
              <span>支出</span>
              <span>盈利</span>
          </div>
          <div class="table-body">
            <dl>
                <dd>
                    <span v-for="(item,index) in timeArr" :key='index'>{{item}}</span>
                    <span v-for="(item,index) in timeArr" :key='index'>{{item}}</span>
                    <span v-for="(item,index) in timeArr" :key='index'>{{item}}</span>
                    <span v-for="(item,index) in timeArr" :key='index'>{{item}}</span>
                    <span v-for="(item,index) in timeArr" :key='index'>{{item}}</span>
                </dd>
            </dl>
        </div>
    </div> -->
        <div class="show-list">
            <div class="monthList">
              <p>日期</p>
              <p v-for="(item,index) in timeArr" :key='index'>{{item}}</p>
            </div>
            <div class="monthList">
              <p>总收入</p>
              <p v-for="(item,index) in totalArr" :key='index'>{{item}}</p>
            </div>
            <div class="monthList">
              <p>实收款</p>
              <p v-for="(item,index) in incomeArr" :key='index'>{{item}}</p>
            </div>
            <div class="monthList">
              <p>未收款</p>
              <p v-for="(item,index) in balanceArr" :key='index'>{{item}}</p>
            </div>
            <div class="monthList">
              <p>月收入同比</p>
              <p v-for="(item,index) in yearOnYearArr" :key='index'>{{item}}</p>
            </div>
            <div class="monthList">
              <p>月收入环比</p>
              <p v-for="(item,index) in monthToMonth" :key='index'>{{item}}</p>
            </div>
            <div class="monthList">
              <p>支出</p>
              <p v-for="(item,index) in payArr" :key='index'>{{item}}</p>
            </div>
            <div class="monthList">
              <p>盈利</p>
              <p v-for="(item,index) in gainArr" :key='index'>{{item}}</p>
            </div>
        </div>
</template>
<script>
import api from "api";
export default {
    data() {
        return {
            incomeArr: null,
            balanceArr: null,
            timeArr: null,
            monthToMonth: null,
            yearOnYearArr: null,
            payArr: null,
            totalArr: null,
            gainArr: null
        };
    },
    props: {
        tenderNumData: {
            type: Object
        }
    },
    mounted() {},
    watch: {
        tenderNumData(val) {
            if (
        val.gain &&
        val.pay_arr &&
        val.income_arr &&
        val.balance_arr &&
        val.time &&
        val.month_to_month &&
        val.year_on_year
      ) {
                this.payArr = (val.pay_arr.split(",")).reverse();
                this.totalArr = (val.total.split(",")).reverse();
                this.incomeArr = (val.income_arr.split(",")).reverse();
                this.balanceArr = (val.balance_arr.split(",")).reverse();
                this.timeArr = (val.time.split(",")).reverse();
                this.monthToMonth = (val.month_to_month.split(",")).reverse();
                this.yearOnYearArr = (val.year_on_year.split(",")).reverse();
                this.gainArr = (val.gain.split(",")).reverse();
            }
        }
    },
    methods: {}
};
</script>
<style lang="less" scoped>
@import "./style/tableCommonStyle.less";
</style>

