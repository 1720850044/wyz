<template>
  <div class="statisticalTime">
    <Poptip :content="payEndDate" placement="left" trigger="hover">
      <span class="iconfonts icon-jingao"></span>{{$t('companyProject.com_dataStatistics')}}{{statisticalTime}}
    </Poptip>
  </div>
</template>
<script>
import api from "api";
var qs = require("querystring");
export default {
    data() {
        return {
            isShow: false,
            payEndDate: i18n.t('companyProject.com_payEndDate'),
            statisticalTime: null // 统计时间
        };
    },
    components: {},
    mounted() {
        this.getNowFormatDate();
    },
    methods: {
    // 获取当前时间
        getNowFormatDate() {
            let _this = this;
            let currentdate = new Date().getTime();
            let toDay = 24 * 60 * 60 * 1000;
            let beginTime = new Date(currentdate - 1 * toDay);
            let endTime = new Date(currentdate);
            _this.statisticalTime =
        beginTime.getFullYear() +
        "-" +
        (beginTime.getMonth() + 1) +
        "-" +
        beginTime.getDate();
      // let currentTime = (endTime.getFullYear()) + "-" + (endTime.getMonth() + 1) + "-" + (endTime.getDate());
        }
    }
};
</script>
<style lang="less" scoped>
// 统计时间提示

.statisticalTime {
  color: #818181;
  text-align: right;
  margin-bottom: 8px;
  letter-spacing: 1px;
  .iconfonts {
    margin-right: 5px;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
