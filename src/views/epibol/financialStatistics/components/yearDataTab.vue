<template>
      <!-- v-if="tenderNumData.length > 0" -->
        <div class="show-list">
            <div class="yearList">
              <p>日期</p>
              <p v-for="(item,index) in timeArr" :key='index'>{{item}}</p>
            </div>
            <div class="yearList">
              <p>总收入</p>
              <p v-for="(item,index) in totalArr" :key='index'>{{item}}</p>
            </div>
            <div class="yearList">
              <p>实收款</p>
              <p v-for="(item,index) in incomeArr" :key='index'>{{item}}</p>
            </div>
            <div class="yearList">
              <p>未收款</p>
              <p v-for="(item,index) in balanceArr" :key='index'>{{item}}</p>
            </div>
            <div class="yearList">
              <p>年收入同比</p>
              <p v-for="(item,index) in yearOnYearArr" :key='index'>{{item}}</p>
            </div>
            <div class="yearList">
              <p>支出</p>
              <p v-for="(item,index) in payArr" :key='index'>{{item}}</p>
            </div>
            <!-- <div class="yearList">
              <p>盈利</p>
              <p v-for="(item,index) in timeArr" :key='index'>{{item}}</p>
            </div> -->
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
            yearOnYearArr: null,
            payArr: null,
            totalArr: null
        };
    },
    props: {
        tenderNumData: {
            type: Object
        }
    },
    created() {},
    mounted() {},
    watch: {
        tenderNumData(val) {
            if (val.pay_arr && val.income_arr && val.total && val.balance_arr && val.time && val.year_on_year) {
                this.incomeArr = (val.income_arr.split(",")).reverse();
                this.balanceArr = (val.balance_arr.split(",")).reverse();
                this.timeArr = (val.time.split(",")).reverse();
                this.yearOnYearArr = (val.year_on_year.split(",")).reverse();
                this.payArr = (val.pay_arr.split(",")).reverse();
                this.totalArr = (val.total.split(",")).reverse();
            }

        }
    },
    methods: {}
};
</script>
<style lang="less" scoped>
@import "./style/tableCommonStyle.less";
</style>

