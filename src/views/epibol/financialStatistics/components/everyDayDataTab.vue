<template>

      <!-- v-if="tenderNumData.length > 0" -->
      <!-- <div class="incomeList">
        {{incomeArr}}
        {{balanceArr}}
        {{timeArr}}
            <table class="first-half-year" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:40px;">
                <tr >
                    <td rowspan="2">时间范围</td>
                </tr>
                <tr>
                    <td v-for="(item,index) in timeArr" :key='index'>{{item}}</td>
                </tr>
                <tr>
                    <td>实收款（元）</td>
                    <td v-for="(item,index) in incomeArr" :key='index'>{{item}}</td>
                </tr>
                <tr>
                    <td>未收款（元）</td>
                    <td v-for="(item,index) in balanceArr" :key='index'>{{item}}</td>
                </tr>
            </table>
      </div> -->
        <!-- <div class="table-list">
          <div class="table-head">
              <span>日期</span>
              <span>总收入</span>
              <span>实收款</span>
              <span>未收款</span>
              <span>支出</span>
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
            <div class="dayList">
              <p>日期</p>
              <p v-for="(item,index) in timeArr" :key='index'>{{item}}</p>
            </div>
            <div class="dayList">
              <p>总收入</p>
              <p v-for="(item,index) in totalArr" :key='index'>{{item}}</p>
            </div>
            <div class="dayList">
              <p>实收款</p>
              <p v-for="(item,index) in incomeArr" :key='index'>{{item}}</p>
            </div>
            <div class="dayList">
              <p>未收款</p>
              <p v-for="(item,index) in balanceArr" :key='index'>{{item}}</p>
            </div>
            <div class="dayList">
              <p>支出</p>
              <p v-for="(item,index) in payArr" :key='index'>{{item}}</p>
            </div>
        </div>
</template>
<script>
import api from "api";
export default {
    data() {
        return {
            totalArr: null,
            incomeArr: null,
            balanceArr: null,
            timeArr: null,
            payArr: null,
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
            if (val.total && val.income_arr && val.balance_arr && val.time) {
                this.totalArr = (val.total.split(",")).reverse();
                this.incomeArr = (val.income_arr.split(",")).reverse();
                this.balanceArr = (val.balance_arr.split(",")).reverse();
                this.timeArr = (val.time.split(",")).reverse();
                this.payArr = (val.pay_arr.split(",")).reverse();
            }
        }
    },
    methods: {}
};
</script>
<style lang="less" scoped>
@import "./style/tableCommonStyle.less";

</style>

