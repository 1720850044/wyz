<template>
    <div class="trend-map">
        <p>{{$t('companyProject.com_totalExpenditure')}}</p>
        <div v-if="objData.data">
          <finance-echars 
            :objData="objData" 
            :starEndDate="starEndDate" 
            :echarsUrl="echarsUrl"
            :granularity = "true"
            :censusType = "'line'"
            :formatter = "'finance'"
            :sort = "true"
            :financeType = "active"
            :accToken="powerToken">
          </finance-echars>
        </div>
        <template v-else>
            <div style="height: 720px;width:1250px;">
                <loading></loading>
            </div>
        </template>
    </div>
</template>
<script>
import FinanceEchars from "../../../../components/FinanceEchars.vue";
import { onlyAPI } from "../../../../axios/apiConfig"
import api from "api";
export default {
  data() {
    return {
      objData: {},
      echarsUrl: '',
      starEndDate:[],
      active: 'pay',
      powerToken: "",
    };
  },
  components: {
    FinanceEchars,
  },
  created() {
    this.initFun();
  },
  methods: {
      changeStatue () {
        this.getDataInfo();
      },
      changeMenu (name) {
        this.active = name;
      },
      // 气泡引导
      getDataInfo () {
        var self = this;
        this.echarsUrl = this.GLOBAL.baseRouter + onlyAPI.company_statistics;
        var params = {
          'type': self.active,
          'acc_token': self.powerToken
        }
        this.$axios.post(this.echarsUrl,params).then(this.getDataSuess);
      },
      getDataSuess (res) {
          this.objData = res.data.data;
          this.starEndDate = res.data.data.particle_range_most.split(',');
      },
    async initFun() {
      const res = await api.totalInitInterface();
      if (res.data.err_code == 0) {
        this.powerToken = res.data.data.acc_token;
        this.getDataInfo();
      } else {
        this.$Message.error(res.data.err_message);
      }
    },
  }
};
</script>
<style>
.ivu-menu-submenu {
    background: #fff;
}
</style>
