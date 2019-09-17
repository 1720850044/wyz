<template>
    <div class="trend-map">
        <p>{{$t('companyProject.com_financialStatisticsProject')}}</p>
        <div v-if="objData.data">
          <finance-echars 
            :objData="objData" 
            :starEndDate="starEndDate" 
            :echarsUrl="echarsUrl"
            :granularity = "true"
            :censusType = "'line'"
            :isRadio = "false"
            :financeType = "active"
            :dataZoom = "dataZoom"
            :dataZoomRoll = "dataZoomRoll"
            :isRoll = "false"
            :formatter = "'finance'"
            :statue = "true"
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
      active: 'project',
      powerToken: "",
      dataZoomRoll: [
          {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              handleSize: 0, //滑动条的 左右2个滑动条的大小
              height: 20, //组件高度
              bottom: 5, //右边的距离
              handleColor: '#CBBCDB', //h滑动图标的颜色
              handleStyle: {
                  borderColor: "#CBBCDB",
                  borderWidth: "1",
                  shadowBlur: 2,
                  background: "#CBBCDB",
                  shadowColor: "#CBBCDB",
              },
              fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
              //给第一个设置0，第四个设置1，就是垂直渐变
              offset: 0,
              color: '#ddd'
              }, {
                  offset: 1,
                  color: '#ddd'
              }]),
              backgroundColor: '#F2F2F2', //两边未选中的滑动条区域的颜色
              showDataShadow: false, //是否显示数据阴影 默认auto
              showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
              handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
              filterMode: 'filter',
          }
      ],
      dataZoom: [
            {
                start: 0, //默认为0
                end: 20, //默认为100
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                handleSize: 0, //滑动条的 左右2个滑动条的大小
                height: 20, //组件高度
                bottom: 5, //右边的距离
                handleColor: '#CBBCDB', //h滑动图标的颜色
                handleStyle: {
                    borderColor: "#CBBCDB",
                    borderWidth: "1",
                    shadowBlur: 2,
                    background: "#CBBCDB",
                    shadowColor: "#CBBCDB",
                },
                fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                    //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                //给第一个设置0，第四个设置1，就是垂直渐变
                offset: 0,
                color: '#797979'
                }, {
                    offset: 1,
                    color: '#797979'
                }]),
                backgroundColor: '#F2F2F2', //两边未选中的滑动条区域的颜色
                showDataShadow: false, //是否显示数据阴影 默认auto
                showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
                handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                filterMode: 'filter',
            }
        ],
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
        this.echarsUrl = this.GLOBAL.baseRouter + onlyAPI.company_project_statistics;
        var params = {
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
