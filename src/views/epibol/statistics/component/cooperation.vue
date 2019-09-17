<template>
<div>
    <Row :gutter="30"  >
        <Col span="24" class-name='bgw'>
            <div class="itemBox base-card" >
                <div class="base-card-head">
                    <div class="base-card-operation-head" >成交项目</div>
                    <div class="base-card-operation-icon" >
                        
                    </div>
                </div>
                <bid-echars v-if="objData.data"
                    :objData="objData" 
                    :isTitle = "false"
                    :starEndDate="starEndDate" 
                    :accToken="powerToken"
                    :formatter = "'cooperation'"
                    :sort = "true"
                    :yAxis = "yAxis"
                    :echarsUrl="echarsUrl">
                </bid-echars>
                <!-- :yAxis = "yAxis" -->
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
import BidEchars from "../../../../components/BidEchars.vue";
import CompanyEchars from "../../../../components/CompanyEchars.vue";
import FinanceEchars from "../../../../components/FinanceEchars.vue";
import { onlyAPI } from "../../../../axios/apiConfig"
import api from "api";
export default {
    data() {
        return {
            objData: {},
            FinanceObjData: {},
            starEndDate: [],
            powerToken: '',
            echarsUrl: '',
            FinanceEcharsUrl: '',
            yAxis: [
                {name: '成交数量',type: 'value',min: 0},
                {name: '成交金额',type: 'value',min: 0,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            dataZoom: [
                {
                    // xAxisIndex: 0,
                    // height: '20px',
                    // filterMode: 'empty',
                    show: true,
                    xAxisIndex: 0,
                    height: 10,
                    bottom: 10,
                    start: 0,
                    end: 30
                    // handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    // handleSize: '100%'
                    // startValue:10
                },
                {zoomLock:true}
            ]
        };
    },
    components: {
        FinanceEchars,
        CompanyEchars,
        BidEchars
    },
    created() {
    //成员任务数量
        this.initFun().then(() => {
            this.getCooperation();
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
            return this.powerToken;
        },
        getCooperation () {
            var self = this;
            this.echarsUrl = this.GLOBAL.baseRouter+onlyAPI.company_success_project;
            this.$axios.post(this.echarsUrl,{
                'acc_token': self.powerToken
            }).then(this.getCooperationSuccess);
        },
        getCooperationSuccess (res) {
            this.objData = res.data.data;
            this.starEndDate = res.data.data.particle_range_most.split(',');
        }
    //js 数组去重
    }
};
</script>

<style lang="less" scoped>
.base-card-head{
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin: 0 !important;
}
</style>

