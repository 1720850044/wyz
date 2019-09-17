<!--公司 = 统计 = 投标-->

<template>
    <div>
    <Row :gutter="30"  >
        <Col span="24" class-name='bgw' id="FailRemarksChart">
            <div class="itemBox base-card">
              <div class="base-card-head">
                <div class="base-card-operation-head" >落标原因</div>
                <div class="base-card-operation-icon" >
                    
                </div>
              </div>
              <!-- <div id='getFailRemarksChart' class="itemBox-chartBox" >
                  <nothink type="project" text="暂无数据" v-if="isShow"></nothink>
              </div> -->
                  <tender-echars v-if="MemberObjData.data"
                    :objData="MemberObjData" 
                    :accToken="powerToken"
                    :censusType = "'bar'"
                    :starEndDate = "starEndDate"
                    :echarsId = "'taskRate11'"
                    :stack = "true"
                    :echarsUrl="MemberEcharsUrl">
                </tender-echars>
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
import tenderEchars from "../../../../components/tenderEchars.vue";
import { onlyAPI } from "../../../../axios/apiConfig"
import api from "api";
export default {
    data() {
        return {
    //   chartConfig:{
    //     colors:this.GLOBAL.echartCFG.colors,
    //   },
            MemberObjData: {},
            MemberEcharsUrl: '',
            starEndDate: [],
            powerToken: '',
            isShow: false,
            objData: {},
            changeObjData: {},
            starEndDate: [],
            changeStarEndDate: [],
            powerToken: '',
            echarsUrl: '',
            yAxis: [
                {name: '投标数量',type: 'value',min: 0,interval: 1},
                {name: '中标率',type: 'value',min: 0,
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
        tenderEchars
    },
    created() {
    //成员任务数量
        //this.$PublicFuns.drawEchart(()=>this.getTenderData());
        this.initFun().then(() => {
            this.getMemberInfo();
        });
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
        getMemberInfo () {
            var self = this;
            this.MemberEcharsUrl = this.GLOBAL.baseRouter + onlyAPI.company_bid_fail;//onlyAPI.project_member_work_time
            this.$axios.post(this.MemberEcharsUrl,{
                'acc_token': self.powerToken
            }).then(this.getMemberSuccess);
        },
        getMemberSuccess (res) {
            this.MemberObjData = res.data.data;
            //console.log(res.data.data)
            this.starEndDate = res.data.data.particle_range_most.split(',');
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


