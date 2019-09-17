<template>
    <div class="electronicContractContainer">
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{$route.meta.title}}<div></div></span>
            </div>
        </main-native>
        <div class="second-navigation-bar">
            <a @click="goContractList()">{{$route.query.navTitle||'合同'}}</a>
            <Icon class="icon" type="ios-arrow-right"></Icon>
            <a class="second-nav-title" v-if="type === 'add'">新增合同</a>
            <a class="second-nav-title" v-else-if="type === 'edit'">合同详情</a>
        </div>
        <div class="contractContainer">
            <ul class="stepList">
                <li v-for="(item,index) in stepList" :key="index" @click="selectStep(index,'nav')"
                    :class="{'active':nameKey === index}">{{item}}
                    <Icon v-if="index !== 0&&(nameKey+1 !== index)&&(nameKey !== index)" class="icon"
                          type="ios-arrow-right"></Icon>
                    <i v-if="index !== 0" :class="[{'triangle':nameKey+1 === index},'icon1']"></i>
                </li>
            </ul>
            <div class="contract">
                <section class="contractMain">
                    <div style="height: 90%;">
                        <keep-alive>
                            <basic-info v-if="nameKey==0" ref="editContract"
                                        v-on:changeIsSubmit="changeIsSubmit"></basic-info>
                            <contract-cost v-if="nameKey==1" :contractCostData="contractCostData"
                                           v-on:changeIsSubmit="changeIsSubmit"
                                           ref="costData"></contract-cost>
                            <confirm-contract :aCertified="aCertified" :bCertified="bCertified"
                                              v-on:showSigna="showSignaShow" ref="contract"
                                              v-on:changeButton="changeButton"
                                              v-if="nameKey==2"></confirm-contract>
                            <contract-signed ref="signed" v-on:showSigna="showSignaShow"
                                             v-if="nameKey==3"></contract-signed>
                        </keep-alive>
                    </div>

                </section>
                <section class="contractPrompt">
                    <contract-prompt ref="prompt" :nameKey="nameKey"></contract-prompt>
                </section>
            </div>
        </div>

        <div class="submitButton">
            <Button v-if="nameKey===1" type="primary" style="margin-top: 10px" @click="nameKey = 0">上一步</Button>
            <Button v-if="nameKey===0||nameKey===1" type="primary" style="margin-top: 10px"
                    @click="selectStep(nameKey+1)">下一步
            </Button>
            <!--确认合同-->
            <Button v-if="nameKey===2 && confirmButton&&is_operator" type="primary" style="margin-top: 10px"
                    @click="confirmContract">确认合同
            </Button>

            <!--签章-->
            <div v-if="nameKey===3" class="sign">
                <Button v-if="confirmInfo&&!confirmInfo.signer_name&&!is_singer">无签章权限</Button>
                <template v-else-if="showSigna">
                    <i class="icon">!</i><span>双方确认签章后该合同将有具有法律效应，请仔细确认合同条款</span>
                    <Button type="primary" @click="showSignature">确认签章</Button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import qs from 'querystring';
    import Cookies from 'js-cookie';
    import {mapState, mapMutations, mapActions} from 'vuex';
    import api from 'api';
    import mainNative from '@/views/main-components/mainNative.vue';
    import basicInfo from '@/views/epibol/contractManage/component/contractData/basicInfo';
    import contractCost from '@/views/epibol/contractManage/component/contractData/contractCost';
    import confirmContract from './confirmContract';     // 确认
    import contractSigned from './contractSigned';       // 签章
    import contractPrompt from './contractPrompt';
    const stepList = ['基础信息', '费用及付款', '确认合同', '合同签章'];       // 提示

    export default {
        created() {

        },
        mounted() {
            this.$bus.on('addContractData', (val) => {
                this.newData = val;
            });
            this.$bus.on("addContractCost", (val) => {
                this.newCost = val;
            });
            this.contractInfo();
            this.getCompanyType();
            this.refresh();
            this.getconfirmInfo(); // 获取签章信息
            this.getNowTsign();
            this.judgeContractType();
            this.is_return = true;
        },
        data() {
            return {
                is_return: true,
                isSubmit: false,
                showSigna: true,
                companyType: null, // 公司甲乙  0 乙 1甲
                basicInfoData: {},
                contractCostData: [],
                nameKey: 0,
                stepList: stepList,     //步骤条
                guide: false,            //提示引导
                newData: null,
                newCost: null,
                is_over: null,
                aCertified: false,
                bCertified: false,
                is_operator: 0,         // 当前用户是该合同经办人
                is_singer: 0,           // 当前用户是该合同签章人
                type: ''
            };
        },
        methods: {
            ...mapActions(['getconfirmInfo']),
            ...mapMutations(['setContractId', 'setInfo']),
            // 获取类型判断是新增还是详情编辑等
            judgeContractType () {
                this.type = this.storeJudgeType;
            },
            goContractList () {
                this.$router.push('/epibol/contractManage');
            },
            //确认公司甲乙
            getCompanyType() {
                if (Cookies.get('company')) {
                    this.companyType = JSON.parse(Cookies.get('company')).type;
                }
            },
            // 合同info
            contractInfo() {
                if (this.contractID != null) {
                    this.$Loading.start();
                    let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_contract_info;
                    let params = {
                        "contract_id": this.contractID
                    };
                    this.$axios.post(url, params).then(msg => {
                        this.$Loading.finish();
                        this.contractCostData = [];
                        this.setInfo(msg.data);

                        let contractCost = [
                            {
                                "price_list": msg.data.price_list,
                                "step_list": msg.data.step_list
                            }
                        ];
                        // 清单及付款
                        this.contractCostData = contractCost;
                        // 基本信息
                        this.basicInfoData = msg.data;
                        delete this.basicInfoData.price_list;
                        delete this.basicInfoData.step_list;

                        // 1信息已完善 0未完善
                        this.is_over = msg.data.is_over;
                        // 信息完善
                        if (this.is_over === 1) {
                            this.$refs.prompt.initPrompt();
                        } else {

                            this.$refs.prompt.initPrompt();
                        }

                        this.activeButton(msg);

                        this.activeNav(msg.data);

                        this.$refs.editContract.editContract(this.basicInfoData);

                    }, () => {
                        this.$Message.error("请求失败!");
                        this.$Loading.error();
                    });
                } else {
                    this.$refs.prompt.initPrompt(true);
                }

            },

            // 确认合同
            async confirmContract() {

                if (this.companyType === 0) {
                    // 乙
                    let {data} = await api.getConfirmContract({contract_id: this.contractID});
                    if (data.err_code === 0) {
                        // 成功
                        this.contractInfo();
                        this.bCertified = true;
                        this.$refs.contract.getTsignPdf(); // 修改pdf
                        this.$refs.prompt.initPrompt();
                    }
                } else {
                    // 甲
                    this.setContractStatus();
                }

            },
            //  默认进入第几步
            activeNav(data) {
                if (data.is_over === 0) {
                    this.nameKey = 0;
                } else if (data.status >= 1 || data.company_signServiceId || data.customer_signServiceId) {
                    this.nameKey = 3;
                } else if (data.status < 1) {
                    this.nameKey = 2;
                }

            },
            // 合同和签章按钮状态
            activeButton(msg) {
                // 根据状态是否可编辑
                if (this.companyType === 1) {
                    this.$store.commit('changContractStatus', true);

                } else if (msg.data.status === 1) {
                    this.$store.commit('changContractStatus', true);
                }

                // 乙方
                if (msg.data.company_text === '确认合同') {

                    this.bCertified = true;
//                    this.$refs.contract.changeCertified(0, true)
                }
                // 甲方
                if (msg.data.customer_text === '合同已确认') {
                    this.aCertified = true;
//                    this.$refs.contract.changeCertified(1, true)
                }

                // 签章
                if ((msg.data.company_signServiceId && this.companyType === 0) || (msg.data.customer_signServiceId && this.companyType === 1)) {
                    this.showSigna = false;
                }

            },

            showSignaShow() {

                this.showSigna = false;
            },
            refresh() {
                if (this.companyType === 1 && !this.contractID) {
                    this.$router.back(-1);
                }
            },
            // 用户权限
            async getNowTsign() {
                if (this.contractID) {
                    let {data} = await api.getNowTsign({contract_id: this.contractID});
                    if (data.err_code === 0) {
                        this.is_operator = data.data.is_operator;
                        this.is_singer = data.data.is_singer;
                    }
                }
            },

            // 缺少电子签名
            showSignature() {

                // 信息未认证
                if (!this.confirmInfo.legal_area && !this.confirmInfo.organ_type) {
                    this.$refs.signed.modal2 = true; //弹窗提示
                    return false;
                }
                this.$refs.signed.showSignature();
            },
            // 下一步
            async selectStep(index, type) {

                if (type === 'nav' && !this.is_over && (index === 2 || index === 3)) {
                    return false;
                }

                // 基础信息进入下一步
                if (this.nameKey === 0 && index === 1 ) {

                    // 有修改表单
                    if ( this.isSubmit){
                        // 信息不完善
                        if (this.isPerfect()) {
                            return;
                        }
                        // 公司没验证
                        else if (this.newData.customer_id === '0') {
                            this.$Message.info('请等待公司验证');
                            return;
                        }
                        // ajax提交失败
                        else if (!await this.commitContract()) {
                            return;
                        }
                        this.is_return = false;
                    }
                    // 新建的时候必须填表单，编辑的时候可以不填
                    else if (this.is_over === null&&this.is_return){
                        this.$Message.info('请填写信息');

                        return;
                    }
                }

                // 付款进入下一步
                if (this.nameKey === 1 && index === 2 ) {
                    if ( this.isSubmit){
                        if (this.costUpload()) {
                            return;
                        } else if (!await this.commitContract()) {
                            return;
                        }

                    } else if (this.is_over === null){
                        this.$Message.info('请填写信息');
                        return;
                    }
                }

                if (index === 3 && (!this.bCertified || !this.aCertified)) {
                    return;
                }
                this.nameKey = index;

            },
            // 基本信息完善信息
            isPerfect() {
                let contractName = this.$refs.editContract.contractName;
                let contractStartTime = this.$refs.editContract.contractStartTime;
                let contractEndTime = this.$refs.editContract.contractEndTime;
                let agentUser = this.$refs.editContract.agentUser;
                let projectUser = this.$refs.editContract.projectUser;
                let companyA = this.$refs.editContract.companyA;
                let oneAccess = this.$refs.editContract.oneAccess;
                let contact = this.$refs.editContract.contact;
                let is_perfect = !contractName || !contractStartTime|| !contractEndTime|| !agentUser || !projectUser || !projectUser || !companyA || !oneAccess || !contact;
                if (is_perfect) {
                    this.$Message.error('请先完善信息');
                    return true;
                }

            },
            // 付款信息完善信息
            costUpload() {
                let flag = false;
                let costData = this.$refs.costData.priceData;

                costData.forEach(function (creent, index, arr) {
                    if (creent.unit == 1 && !creent.unitprice || creent.unit == 1 && !creent.day){
                        flag = true;
                    } else if (creent.unit == 2 && !creent.unitprice || creent.unit == 2 && !creent.count ){
                        flag = true;
                    }
                    if (!creent.key && !creent.finish_date){
                        flag = true;
                    }
                });
                if (flag||costData.length===0){
                    this.$Message.error('请先完善信息');
                    return true;
                }
            },
            //添加合同和新增
            commitContract() {
                // 甲方不能修改
                if (this.companyType === 1 || (this.basicInfoData && this.basicInfoData.status >= 1)) {
                    return;
                }
                // // 没有修改的时候不能提交
                // if (!this.isSubmit) {
                //     return
                // }

                this.$Loading.start();
                if (this.newData) {
                    this.newData.network = 2; //电子合同2
                }

                // 添加
                if (this.contractID === null) {
                    return this.addContract();
                }

                // 更新
                else if (this.contractID !== null) {
                    return this.editContract();
                }

            },
            // 添加
            async addContract() {
                let {data} = await api.addContract({basic_list: JSON.stringify(this.newData)});
                if (data.err_code === 0) {
                    this.isSubmit = false;
                    this.$store.commit('getContractIDCommit', data.err_message.data.id);//传contrac_ID
                    this.$refs.prompt.initPrompt();
                    return true;
                }
            },
            // 更新
            async editContract() {
                // 未设置关联项目时要删除
                if (!this.newData.project_id) {
                    delete this.newData.project_id;
                }
                let basic = this.contractCostData[0] ? this.contractCostData[0].basic_list : '';
                let price = this.contractCostData[0] ? this.contractCostData[0].price_list : '';
                let step = this.contractCostData[0] ? this.contractCostData[0].step_list : '';
                let parms = {
                    contract_id: this.contractID,
                    basic_list: JSON.stringify(this.newData ? this.newData : basic),
                    price_list: JSON.stringify(this.newCost ? this.newCost.price_list : price),
                    step_list: JSON.stringify(this.newCost ? this.newCost.step_list : step),
                    step: this.nameKey+1,
                };
                let {data} = await api.editContract(parms);
                if (data.err_code === 0) {
                    if (this.newCost) {
                        this.is_over = 1;
                        this.$refs.prompt.initPrompt();
                        if (this.$refs.contract) {
                            this.$refs.contract.getTsignPdf();
                        }
                        this.getNowTsign();
                    }
                    return true;
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            changeIsSubmit() {

                this.isSubmit = true;
            },
            // 甲方确认合同
            setContractStatus() {
                this.$Loading.start();
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_set_contract_status;
                let params = {
                    "contract_id": this.contractID,
                    "status": 0
                };
                this.$axios.post(url, params).then(msg => {
                    this.$Loading.finish();
                    if (msg.data.err_code == 0) {
                        // 甲成功
                        this.contractInfo();
                        this.aCertified = true;
                        this.$refs.contract.getTsignPdf(); // 修改pdf
                        this.$refs.prompt.initPrompt();

                    } else {
                        this.$Message.error(msg.data.err_message);
                    }
                });

            },
            changeButton() {
                this.showSigna = false;
            },
            lastStep() {
                this.nameKey--;
            }, nextStep() {
                this.nameKey++;
            },
        },
        computed: {
            ...mapState({
                // 公司认证信息
                confirmInfo(value) {
                    return value.paySkip.confirmInfo;
                }
            }),
            // 合同id
            contractID() {
                return this.$store.state.paySkip.contractID;
            },
            storeJudgeType () {
                return this.$store.state.contract.judgeType;
            },
            // 已确认按钮
            confirmButton() {
                // 甲
                if (this.companyType === 1 && this.aCertified) {
                    return false;
                } else if (this.companyType === 0 && this.bCertified) {
                    return false;
                }
                return true;
            }

        },
        components: {
            mainNative,
            basicInfo,
            contractCost,
            contractPrompt,
            confirmContract,
            contractSigned,

        }
    };
</script>


<style lang="less" scoped>
    .electronicContractContainer {

        height: 100%;
        /*padding-bottom: 30px;*/
        // padding-top: 30px;

        .second-navigation-bar {
            margin-bottom: 10px;
            overflow: hidden;
            > a {
                float: left;
                font-size: 13px;
                color: #3bceb6;
                padding: 0 2px;
                border-bottom: 2px solid @baseboard;
                &.second-nav-title {
                    border-bottom: 2px solid #3bceb6;
                    font-size: 14px;
                    margin-top: -1px;
                }
                &:hover {
                    border-bottom: 2px solid #3bceb6;
                    -webkit-transition: border-bottom-color 0.2s;
                    -moz-transition: border-bottom-color 0.2s;
                    -ms-transition: border-bottom-color 0.2s;
                    -o-transition: border-bottom-color 0.2s;
                    transition: border-bottom-color 0.2s;
                }
            }
            > .icon {
                float: left;
                margin: 0 5px;
                font-size: 18px;
                color: @black_2;
            }

        }

        .contractContainer {
            .base-card;
            height: 92%;
            padding: 30px;
            background: #fff;
            /*overflow: hidden;*/
            .stepList {
                display: flex;
                margin-bottom: 30px;
                .active {
                    color: #48d0b9;
                    background: #d2f2ec;
                    .icon1 {
                        background: #d2f2ec;
                    }
                }
                .triangle {

                    border-left: 20px solid #d2f2ec !important;

                }
                li {
                    position: relative;
                    flex: 1;
                    height: 35px;
                    line-height: 35px;
                    text-align: center;
                    color: #777777;
                    background: @baseboard;
                    .icon {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        font-size: 50px;
                        color: #fff;
                        transform: translateY(-50%);
                        z-index: 3;
                    }
                    .icon1 {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 0;
                        height: 0;
                        border-top: 18px solid transparent;
                        border-left: 20px solid @baseboard;
                        border-right: 20px solid transparent;
                        border-bottom: 17px solid transparent;
                        color: #dcdcdc;
                        background: @baseboard;
                        /*transform: translateY(-50%);*/
                    }
                }
            }
            .contract {
                display: flex;
                height: 90%;
                overflow: auto;
                .contractMain {

                    flex: 7;
                    height: 100%;
                    margin-right: 1%;

                }
                .contractPrompt {

                    flex: 3;
                }

            }

        }
        .submitButton {
            /*margin-top: 2%;*/
            text-align: right;

        }
        .sign {
            span {
                margin: 0 12px;
                color: #fd989c;

            }
            .icon {
                display: inline-block;
                width: 13px;
                height: 13px;
                color: #fd989c;
                border: 1px solid #fd989c;
                border-radius: 50%;
                text-align: center;
                line-height: 13px;
                /*background: red;*/
            }
        }

    }
</style>
