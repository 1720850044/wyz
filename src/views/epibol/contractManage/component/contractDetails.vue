<template>
    <div class="contDetails">
        <!--<div class="second-navigation-bar">-->
            <!--<a @click="backToList()">{{this.$route.meta.title}}</a>-->
            <!--<Icon class="icon" type="ios-arrow-right"></Icon>-->
            <!--<a class="second-nav-title">{{this.$route.meta.subTitle}}</a>-->
        <!--</div>-->
        <!-- statusNav -->
        <div class="statusNav">
            <span :class="[nIndex=='0'?'show':'nextshow']" @click="changNav('0')">1、基本信息</span>
            <span :class="[nIndex=='1'?'show':'',nIndex=='2'?'nextshow':'']" @click="changNav('1')">2、金额及付款</span>
            <span :class="[nIndex=='2'?'show':'']" @click="changNav('2')">3、合同详情</span>

        </div>
        <!-- contractContent -->
        <div class="contContent">
            <component data-start="2" data-last="4" data-step="1" data-disable-interaction="1"
                       :data-intro="guideSteps.step2" class="contract-guide-info1" v-if="nIndex=='0'" :is="isModule"
                       ref="moduleInfo" :acc_token='acc_token'></component>
            <component data-start="3" data-last="4" data-step="1" data-disable-interaction="1"
                       :data-intro="guideSteps.step3" class="contract-guide-info2" v-else-if="nIndex=='1'"
                       :is="isModule" ref="moduleInfo" :acc_token='acc_token'></component>
            <component data-start="4" data-last="4" data-step="1" data-disable-interaction="1"
                       :data-intro="guideSteps.step4" class="contract-guide-info3" v-else-if="nIndex=='2'"
                       :is="isModule" ref="moduleInfo" :acc_token='acc_token'></component>
        </div>
        <!-- 隐藏合同支付弹窗及后续页面 -->
        <div class="enterContract" v-if="user_type== 1 && (ContractCtatus==0||needGuideData)">
            <div>
                <span><Icon type="information-circled" size="20"
                            color="#f19000"></Icon>&nbsp;&nbsp;确认合同无误请仔细核对合同信息！ </span>
                <em>
                    <Button type="error" @click.native="setContractStatus" class="error-btn">确认合同无误</Button>
                </em>
            </div>
        </div>
        <!--<Modal v-model="payModel" width="360">-->
        <!--<div style="text-align:center">-->
        <!--<p style="color:#00cc00;font-size:22px;font-weight:bold;">-->
        <!--<Icon type="checkmark-circled"></Icon>-->
        <!--合同确认成功-->
        <!--</p>-->
        <!--<p style="font-size:16px;color:#ff6600;margin-top:10px;">请立即支付首付款</p>-->
        <!--</div>-->
        <!--<div slot="footer">-->
        <!--<Button type="success" size="large" long @click="immPay">立即支付</Button>-->
        <!--</div>-->
        <!--</Modal>-->
    </div>
</template>
<script>
    import api from 'api';
    import Cookie from 'js-cookie';
    import {mapState} from 'vuex';
    import mainNative from '../../../main-components/mainNative.vue';
    import contractBase from './contractDetails/contractBase';
    import contractCost from './contractDetails/contractCost';
    import contractDeta from './contractDetails/contractDeta';

    export default {
        components: {
            mainNative
        },
        data() {
            return {
                guideSteps: {
                    step5: '',
                    step4: '',
                    step2: '',
                    step3: '',
                },
                needGuideData: false,
                nIndex: '0',
                isModule: contractBase,
                contractCostData: Array, //金额及付款
                filesData: Array, //附件
                basicInfoData: Array, //基本信息
                ContractCtatus: null,
                payModel: false,
                user_type: JSON.parse(Cookie.get('company')).type,
                acc_token: null,
            };
        },
        computed: {
            ...mapState({
                //    合同ID
                contractID(data) {
                    return data.paySkip.contractID;
                }
            })
        },
        mounted() {
            this.autoH();
            this.initGuide();
            // this.contractInfo();

        },
        methods: {
            // 初始化获取是否引导
            async initGuide() {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$interface.guidePaths.demandContractInfo;
                if (this.user_type == 0) {
                    url = this.GLOBAL.baseRouter + this.$interface.guidePaths.outsourceContractInfo;
                }
                this.$PublicFuns.guideInitInterface(url)
                    .then(result => {
                        this.acc_token = result.acc_token;
                        if (JSON.stringify(result.guideSteps) !== "{}") {
                            this.needGuideData = true;
                        }
                        this.contractInfo();
                        if (JSON.stringify(result.guideSteps) !== "{}") {
                            _this.guideSteps = result.guideSteps;
                            setTimeout(() => {
                                _this.$guide().setOptions(this.$CONSTANT.guideOptions).start().onskip(() => {
                                    this.$router.back(-1);
                                }).oncomplete((ele) => {
                                    _this.changNav('1');
                                    _this.$guide().exit();
                                    setTimeout(() => {
                                        _this.$guide().setOptions(this.$CONSTANT.guideOptions).goToStep(2).start().onskip(() => {
                                            this.$router.back(-1);
                                        }).oncomplete((ele) => {
                                            _this.changNav('2');
                                            _this.$guide().exit();
                                            setTimeout(() => {
                                                _this.$guide().setOptions(this.$CONSTANT.guideOptions).goToStep(3).start().onskip(() => {
                                                    this.$router.back(-1);
                                                }).oncomplete((domData) => {
                                                    if (this.user_type == 1) {
                                                        this.$router.push({path: '/customer/contractManage', });
                                                    } else if (this.user_type == 0) {
                                                        this.$PublicFuns.completePageGuide('collContractLast');
                                                        this.$router.push({path: '/epibol/contractManage', });
                                                    }
                                                });
                                            }, 100);
                                        });
                                    }, 100);
                                });
                            }, 200);
                        }
                    });
            },
            backToList() {
                if (this.user_type == 1) {
                    this.$router.push('/customer/contractManage');
                } else if (this.user_type == 0) {
                    this.$router.push('/epibol/contractManage');
                }

            },
            autoH() {
                let H = document.documentElement.clientHeight;
                let CH = document.getElementsByClassName('contContent')[0];
                CH.style.height = H - 218 + 'px';
            },
            toStep() {
                if (this.$route.query) {
                    if (this.$route.query.type === 1) {
                        this.changNav('1');
                    }
                }
            },
            //    切换组件
            changNav(nmber) {
                this.nIndex = nmber;
                if (nmber == '0') {
                    // 基本信息
                    this.isModule = contractBase;
                    setTimeout(() => {
                        this.$refs.moduleInfo.moduleData(this.basicInfoData);
                    }, 100);
                } else if (nmber == '1') {
                    // 清单及付款
                    this.isModule = contractCost;
                    setTimeout(() => {
                        this.$refs.moduleInfo.moduleData(this.contractCostData);
                    }, 100);
                } else if (nmber == '2') {
                    // 附件
                    this.isModule = contractDeta;
                    setTimeout(() => {
                        console.log(this.filesData);
                        this.$refs.moduleInfo.moduleData(this.filesData);
                    }, 100);
                }
            },
            // 合同数据
            async contractInfo() {
                if (this.contractID != null) {
                    this.$Loading.start();
                    let params = {
                        contract_id: this.contractID,
                        needGuideData: this.needGuideData ? true : null
                    };
                    let {data} = await api.contractInfo(params);
                    if (data.err_code == 0){
                        this.$Loading.finish();
                        let contractCost = [
                            {
                                'price_list': data.price_list,
                                'step_list': data.step_list
                            }
                        ];
                        this.ContractCtatus = data.status;
                        // 清单及付款
                        this.contractCostData = contractCost;
                        // 附件
                        this.filesData = data.files;
                        // 基本信息
                        this.basicInfoData = data;
                        // 传递数据
                        this.$refs.moduleInfo.moduleData(this.basicInfoData);
                        this.toStep();
                    } else {
                        this.$Loading.error();
                    }
                } else {
                    this.$router.go(-1);
                }
            },
            //隐藏合同支付弹窗及后续页面
            //甲方确认合同
            async setContractStatus() {
                this.$Loading.start();
                this.payModel = true;
                let params = {
                    'contract_id': this.contractID,
                    'status': 0
                };
                let {data} = await api.comfirmContract(params);
                if (data.err_code == 0){
                    this.$Loading.finish();
                    this.$Message.success('合同确认成功！');
                    this.$router.push({path: '/customer/contractManage'});
                } else {
                    this.$Loading.error();
                }
            },
            // 进入支付页面
            immPay() {
                this.$router.push('/customer/payManage/' + this.contractID);
            },
        }
    };
</script>
<style lang="less">
    @import '../style/contractDetails.less';

    .contDetails {
        margin-top: 30px;
    }
</style>
