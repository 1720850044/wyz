<template>
    <div class="newContractData contDetails">
        <!-- ContractNav -->
        <div class=" statusNav">
            <span @click="nIndex=0" :class="[nIndex=='0'?'show':'nextshow']">基本信息</span>
            <span @click="nIndex=1" :class="[nIndex=='1'?'show':'',nIndex=='2'?'nextshow':'']">费用及付款</span>
            <span @click="nIndex=2" :class="[nIndex=='2'?'show':'']">确认合同</span>
        </div>
        <!-- ContractComponent -->
        <keep-alive>
            <basic-info v-if="nIndex==0" :stepShow="stepShow" ref="ContractInfo"></basic-info>
            <contract-cost v-if="nIndex==1" :contractCostData="contractCostData"></contract-cost>
            <confir-contract v-if="nIndex==2" :filesData="filesData"></confir-contract>
        </keep-alive>
        <!-- 隐藏合同支付弹窗及后续页面 -->
        <!-- <div class="enterContract" v-if="ContractCtatus==0">
            <div>
                <span>
                    <Icon type="information-circled" size="20" color="#f19000"></Icon>&nbsp;&nbsp;确认合同无误请仔细核对合同信息！ </span>
                <em>
                    <Button type="error" @click.native="setContractStatus">确认合同无误</Button>
                </em>
            </div>

        </div>
        <Modal v-model="payModel" width="360">
            <div style="text-align:center">
                <p style="color:#00cc00;font-size:22px;font-weight:blod;">
                    <Icon type="checkmark-circled"></Icon> 合同确认成功</p>
                <p style="font-size:16px;color:#ff6600;margin-top:10px;">请立即支付首付款</p>
            </div>
            <div slot="footer">
                <Button type="success" size="large" long @click="immPay">立即支付</Button>
            </div>
        </Modal> -->
    </div>
</template>
<script>
    import api from 'api';
    import basicInfo from './contractData/basicInfo';
    import contractCost from './contractData/contractCost';
    import confirContract from './contractData/confirContract';

    import { mapGetters, mapState } from 'vuex';
    export default {
        data() {
            return {
                nIndex: 0,
                basicInfoData: [],
                ContractCtatus: null,
                payModel: false,
                filesData: [],
                stepShow: true,
            };
        },
        computed: {
            ...mapState({
                contractID: state => state.paySkip.contractID,

            })
        },
        components: {
            basicInfo: basicInfo,
            contractCost: contractCost,
            confirContract: confirContract
        },
        mounted() {
            this.contractInfo();
        },
        methods: {
            async contractInfo() {
                if (this.contractID == null) {
                    this.$router.go(-1);
                }
                this.$Loading.start();
                let params = {
                    "contract_id": this.contractID
                };
                let {data} = await api.demandContractInfo(params);
                if (data.err_code == 0){
                    this.$Loading.finish();
                    this.contractCostData = [];
                    let contractCost = [
                        {
                            "price_list": data.price_list,
                            "step_list": data.step_list
                        }
                    ];
                    this.ContractCtatus = data.status;
                    // 清单及付款
                    this.contractCostData = contractCost;
                    if (data.status == 0) {
                        this.stepShow = false;
                    }
                    //附件
                    this.filesData = Array.isArray(data.files) ? data.files : [];
                    // 基本信息
                    this.basicInfoData = data;
                    delete this.basicInfoData.price_list;
                    delete this.basicInfoData.step_list;
                    this.$refs.ContractInfo.editContract(this.basicInfoData);
                } else {
                    this.$Loading.error();
                }
            },
            // <!-- 隐藏合同支付弹窗及后续页面 -->
            // setContractStatus() {
            //     this.$Loading.start();
            //     this.payModel = true;
            //     let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_set_contract_status;
            //     let params = {
            //         "contract_id": this.contractID,
            //         "status": 0
            //     }
            //     this.$axios.post(url, params).then(msg => {
            //         this.$Loading.finish();
            //         if (msg.data.err_code == 0) {

            //         } else {
            //             this.$Message.error(msg.data.err_message)
            //         }
            //     })

            // },
            // immPay() {
            //     this.$router.push('/customer/payManage/' + this.contractID)
            // }

        }
    };
</script>
<style lang="less">
    .enterContract {
        position: relative;
        z-index: 11;
        bottom: 0px;
        background: #fff3c5;
        width: 100%;
        height: 50px;
        line-height: 50px;
        span {
            padding-left: 10px;
        }
        em {
            float: right;
            padding-right: 10px;
        }
    }
</style>
