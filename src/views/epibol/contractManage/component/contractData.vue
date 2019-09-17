<template>
    <div class="offline-contract-container">
        <div class="second-navigation-bar">
            <a @click="goContractList()">{{$route.query.navTitle||'合同'}}</a>
            <Icon class="icon" type="ios-arrow-right"></Icon>
            <a class="second-nav-title" v-if="type === 'add'">新增合同</a>
            <a class="second-nav-title" v-else-if="type === 'edit'">合同详情</a>
        </div>
        <div class="newContractData">
            <main-native>
                <div class="main-header-style ">
                    <span class="iconfonts main-header-title">{{$route.meta.title}}<div></div></span>
                </div>
            </main-native>
            <ul class="stepList" v-if="!lineFlag">
                <!--changeNav(index)-->
                <li v-for="(item,index) in stepList" @click="changePage(index)" :key="index"

                    :class="{'active':nIndex === index}">{{item}}
                    <Icon v-if="index !== 0&&(nIndex+1 !== index)&&(nIndex !== index)" class="icon"
                          type="ios-arrow-right"></Icon>
                    <i v-if="index !== 0" :class="[{'triangle':nIndex+1 === index},'icon1']"></i>
                </li>
            </ul>
            <!--<div class="contractNav" v-if="!lineFlag">-->
            <!--<span :class="[nIndex==0?'spanOne':'']"><s>1</s>基本信息</span>-->
            <!--<span :class="[nIndex==1?'spanTwo':'']"><s>2</s>费用及付款</span>-->
            <!--<span :class="[nIndex==2?'spanTwo':'']"><s>3</s>确认合同</span>-->
            <!--<div class="clear"></div>-->
            <!--</div>-->
            <div class="detailsNav" v-else>
                <span @click="nIndex=0" :class="[nIndex==0?'show':'']">基本信息</span>
                <span @click="nIndex=1" :class="[nIndex==1?'show':'']">费用及付款</span>
                <span @click="nIndex=2" :class="[nIndex==2?'show':'']">确认合同</span>
            </div>
            <keep-alive>
                <basic-info v-if="nIndex==0" :needGuideData="needGuideData" ref="editContract"
                            v-on:changeIsSubmit="changeIsSubmit"
                            data-start="2" data-last="5" data-step="1" data-disable-interaction="1"
                            :data-intro="guideSteps.step2"></basic-info>
                <contract-cost v-if="nIndex==1" :contractCostData="contractCostData"
                               v-on:changeIsSubmit="changeIsSubmit" ref="costData"
                               data-start="3" data-last="5" data-step="1" data-disable-interaction="1"
                               :data-intro="guideSteps.step3"></contract-cost>
                <confir-contract v-if="nIndex==2" :filesData="filesData" ref="confir"
                                 v-on:changeIsSubmit="changeIsSubmit"
                                 data-start="4" data-last="5" data-step="1" data-disable-interaction="1"
                                 :data-intro="guideSteps.step4"></confir-contract>

                <!--<component  data-start="2" data-last="4" data-step="1" data-disable-interaction="1" :data-intro="guideSteps.step2" class="contract-guide-info1"  v-if="nIndex=='0'" :is="isModule" ref="moduleInfo"></component>-->
                <!--<component   data-start="3" data-last="4" data-step="1" data-disable-interaction="1" :data-intro="guideSteps.step3" class="contract-guide-info2" v-else-if="nIndex=='1'" :is="isModule" ref="moduleInfo"></component>-->
                <!--<component  data-start="4" data-last="4" data-step="1" data-disable-interaction="1" :data-intro="guideSteps.step4" class="contract-guide-info3" v-else-if="nIndex=='2'" :is="isModule" ref="moduleInfo"></component>-->


            </keep-alive>
        </div>
        <div class="nextRow" v-if="!lineFlag">
            <Button type="success" @click.native="saveColse">保存并关闭</Button>
            <Button type="success" v-show="nIndex==1||nIndex==2?true:false" @click.native="changePage(nIndex-1)">上一步
            </Button>
            <Button type="success" v-show="nIndex==2?false:true" :disabled="Bdisabled"
                    @click.native="changePage(nIndex+1)">下一步
            </Button>
            <!--<Button type="warning" v-show="contrateButton&&nIndex==2" @click="commitContract('img')">保存合同</Button>-->
            <Button type="warning" v-show="nIndex==2" @click="commitContract('img')">保存合同</Button>
        </div>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex';
    import Cookie from 'js-cookie';
    import {contractApi} from 'api';
    import basicInfo from './contractData/basicInfo';
    import contractCost from './contractData/contractCost';
    import confirContract from './contractData/confirContract';
    import mainNative from '@/views/main-components/mainNative.vue';

    const stepList = ['基础信息', '费用及付款', '确认合同'];

    export default {
        data() {
            return {
                needGuideData: false,
                guideSteps: {
                    step5: '',
                    step4: '',
                    step2: '',
                    step3: '',
                },
                is_over: null,
                stepList: stepList,
                isSubmit: false,
                newData: {}, //basicInfo
                newCost: {}, //contractCost
                newFileLoad: [], //contractFile
                nIndex: 0,
                componentId: 'basic-info',
                addInfo: '',
                contractCostData: [],
                basicInfoData: {},
                filesData: [],
                Bdisabled: false,
                type: 'add',
                companyType: JSON.parse(Cookie.get('company')).type,

                creentIndex: 0,
                targetIndex: 0
            };
        },
        watch: {
            nIndex(newVal, oldVal) {
                this.creentIndex = oldVal;
                this.targetIndex = newVal;
            }
        },
        components: {
            mainNative: mainNative,
            basicInfo: basicInfo,
            contractCost: contractCost,
            confirContract: confirContract
        },
        computed: {
            contrateButton() {
                return this.$store.state.paySkip.contrateButton;
            },
            contractID() {
                return this.$store.state.paySkip.contractID;
            },
            lineFlag() {
                return this.$store.state.paySkip.enterContractFlag;
            },
            storeJudgeType() {
                return this.$store.state.contract.judgeType;
            }
        },
        destroyed() {
            this.$store.commit('getContractServerButton', false);
        },
        mounted() {
            this.$bus.on('addContractData', (val) => {
                this.newData = val;
            });
            this.$bus.on('addContractCost', (val) => {
                this.newCost = val;
            });
            this.$bus.on('ContractUploadFile', (val) => {
                this.newFileLoad = val;
            });

            this.$bus.on('Bdisabled', val => {
                this.Bdisabled = val;
            });
            this.initGuide();
            this.getContractType();
        },
        methods: {
            ...mapMutations(['setInfo']),
            // 初始化
            async initGuide() {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_contract_aeindex;
                // let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_outsource_contract_infoindex;
                this.$PublicFuns.guideInitInterface(url)
                    .then(result => {
                        if (JSON.stringify(result.guideSteps) !== "{}") {
                            this.needGuideData = true;
                        }
                        this.init();
                        if (JSON.stringify(result.guideSteps) !== "{}") {
                            _this.guideSteps = result.guideSteps;
                            setTimeout(() => {
                                _this.$guide().setOptions(this.$CONSTANT.guideOptions).start().oncomplete((ele) => {
                                    this.nIndex = 1;
                                    _this.$guide().exit();
                                    setTimeout(() => {
                                        _this.$guide().setOptions(this.$CONSTANT.guideOptions).goToStep(2).start().onskip(() => {
                                            // debugger
                                            this.$router.back(-1);
                                        }).oncomplete((ele) => {
                                            this.nIndex = 2;
                                            _this.$guide().exit();
                                            setTimeout(() => {
                                                _this.$guide().setOptions(this.$CONSTANT.guideOptions).goToStep(3).start().onskip(() => {
                                                    // debugger
                                                    this.$router.back(-1);
                                                }).oncomplete((domData) => {
                                                    this.$PublicFuns.completePageGuide('collContractLast');
                                                    this.$router.push({path: '/epibol/contractManage', });
                                                });
                                            }, 100);
                                        });
                                    }, 100);
                                }).onskip(() => {
                                    this.$router.back(-1);
                                });
                            }, 200);
                        }
                    });
            },
            //0.9.1 优化
            //初始化接口
            async init() {
                let {data} = await contractApi.contractInit();
                if (data.err_code == 0) {
                    if (this.contractID != null || this.needGuideData) {
                        this.contractInfo();
                    }
                } else {
                    // this.$Message.error(data.err_message);
                    this.$router.back(-1);
                }
            },
            //切换面板
            changePage(page) {
                if (!this.contractID) {
                    if (!this.newData.contract_name) {
                        this.$Message.error('合同名称为必填项！');
                    } else {
                        this.nIndex = page;
                        this.$nextTick(function () {
                            // console.log('当前页' + this.creentIndex)
                            // console.log('目标页' + this.targetIndex)
                            if (this.creentIndex == 0) {
                                this.publicFirstSetp('add');
                            }
                        });
                    }
                } else {
                    if (!this.newData.contract_name) {
                        this.$Message.error('合同名称为必填项！');
                    } else {
                        this.nIndex = page;
                        this.$nextTick(function () {
                            // console.log('当前页' + this.creentIndex)
                            // console.log('目标页' + this.targetIndex)
                            if (this.creentIndex == 0) {
                                this.publicFirstSetp('updata');
                            } else if (this.creentIndex == 1) {
                                this.publicTwoSetp();
                            } else if (this.creentIndex == 2) {
                                this.publicThreeSetp();
                            }
                        });
                    }
                }
            },
            //保存并关闭
            async saveColse() {
                if (!this.contractID) {
                    if (!this.newData.contract_name) {
                        this.$Message.error('合同名称为必填项！');
                    } else {
                        // console.log('当前页' + this.creentIndex)
                        // console.log('目标页' + this.targetIndex)
                        if (this.targetIndex == 0) {
                            this.publicFirstSetp('add', true);
                        }
                    }
                } else {
                    if (!this.newData.contract_name) {
                        this.$Message.error('合同名称为必填项！');
                    } else {
                        // console.log('当前页' + this.creentIndex)
                        // console.log('目标页' + this.targetIndex)
                        if (this.targetIndex == 0) {
                            this.publicFirstSetp('updata', true);
                        } else if (this.targetIndex == 1) {
                            this.publicTwoSetp(true);
                        } else if (this.targetIndex == 2) {
                            this.publicThreeSetp('close');
                        }
                    }
                }
            },
            //第一步
            async publicFirstSetp(type, save) {
                let contractID = this.contractID;
                let contractData = this.newData;
                let basicList = {
                    contract_name: contractData.contract_name,
                    customer_name: contractData.customer_name,
                    customer_id: contractData.customer_id,
                    customer_people: contractData.customer_people,
                    customer_phone: contractData.customer_phone,
                    business_people: contractData.business_people,
                    manager: contractData.manager,
                    start_time: contractData.start_time,
                    end_time: contractData.end_time
                };

                if (type == 'add') {
                    let parms = {
                        basic_list: JSON.stringify(basicList),
                    };
                    this.sendHttp(parms, 1, save);
                } else {
                    let parms = {
                        basic_list: JSON.stringify(basicList),
                        contract_id: contractID
                    };
                    this.sendHttp(parms, 0, save);
                }
            },
            async sendHttp(parms, type, save) {
                let {data} = await contractApi.firstStepHttp(parms);
                if (data.err_code == 0) {
                    if (save) {
                        this.$Message.success('保存成功！');
                        this.$router.back(-1);
                    } else {
                        if (type) {
                            this.$Message.success('合同创建成功！');
                            this.$store.commit('getContractIDCommit', data.data.contract_id);
                        } else {
                            console.log('第111步编辑成功');
                            // this.$Message.success('合同编辑成功！')
                        }
                    }
                } else {
                    // this.$Message.error(data.err_message);
                }
            },
            //第二步
            async publicTwoSetp(type) {
                let contractID = this.contractID;
                let contractData = this.newCost;
                let parms = {
                    price_list: JSON.stringify(contractData.price_list),
                    step_list: JSON.stringify(contractData.step_list),
                    contract_id: contractID
                };
                let {data} = await contractApi.twoStepHttp(parms);
                if (data.err_code == 0) {
                    if (type) {
                        this.$Message.success('保存成功！');
                        this.$router.back(-1);
                    } else {
                        console.log('第222步编辑成功');
                        // this.$Message.success('合同编辑成功！')
                    }
                } else {
                    // this.$Message.error(data.err_message);
                }
            },
            //第三步
            async publicThreeSetp(type) {
                let contractID = this.contractID;
                let contractData = this.newFileLoad;
                let parms = {
                    files_list: JSON.stringify(contractData),
                    contract_id: contractID
                };
                let {data} = await contractApi.threeStepHttp(parms);
                if (data.err_code == 0) {
                    if (type == 'close') {
                        this.$Message.success('保存成功！');
                        this.$router.back(-1);
                    } else if (type == 'save') {
                        this.$Message.success('保存成功！');
                    } else {
                        console.log('第三步编辑成功');
                        // this.$Message.success('合同编辑成功！')
                    }
                } else {
                    // this.$Message.error(data.err_message);
                }
            },

            /*修改nav*/
            // changeNav(index){
            //     // this.nIndex = index
            //     if(this.nIndex === 0&&index === 1){
            //         // 下
            //         this.nextStep()
            //     }else if(this.nIndex === 1){
            //      if(index === 0){
            //          // 上
            //          this.lastStep()
            //
            //      } else if (index === 2) {
            //          // 下
            //          this.nextStep()
            //      }
            //     }else if(this.nIndex === 2&&index === 1){
            //         // 上
            //         this.lastStep()
            //     }
            // },
            getContractType() {
                this.type = this.storeJudgeType;
            },
            goContractList() {
                this.$router.back(-1);
            },
            async contractInfo() {
                this.$Loading.start();
                let params = {
                    contract_id: this.contractID,
                    needGuideData: this.needGuideData ? true : null
                };
                let {data} = await contractApi.contractInfo(params);
                if (data.err_code == 0) {
                    this.$Loading.finish();
                    this.contractCostData = [];
                    let contractCost = [
                        {
                            'price_list': data.price_list,
                            'step_list': data.step_list
                        }
                    ];

                    this.is_over = data.is_over;
                    this.setInfo(data.data);
                    // 清单及付款
                    this.contractCostData = contractCost;

                    //附件
                    this.filesData = data.files;

                    // 基本信息
                    this.basicInfoData = data;
                    delete this.basicInfoData.price_list;
                    delete this.basicInfoData.step_list;
                    this.$refs.editContract.editContract(this.basicInfoData);
                } else {
                    this.$router.back(-1);
                    // this.$Message.error(data.err_message);
                    // this.$Loading.error();
                }

                // let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_contract_info;
                // let params = {
                //     contract_id: this.contractID
                // };
                // if(this.needGuideData){
                //     params.needGuideData = true
                // }
                // this.$axios.post(url, params).then(msg => {
                //     this.$Loading.finish();
                //     this.contractCostData = [];
                //     let contractCost = [
                //         {
                //             'price_list': msg.data.price_list,
                //             'step_list': msg.data.step_list
                //         }
                //     ];
                //
                //     this.is_over = msg.data.is_over
                //     this.setInfo(msg.data);
                //     // 清单及付款
                //     this.contractCostData = contractCost;
                //
                //     //附件
                //     this.filesData = msg.data.files;
                //
                //     // 基本信息
                //     this.basicInfoData = msg.data;
                //     delete this.basicInfoData.price_list;
                //     delete this.basicInfoData.step_list;
                //     this.$refs.editContract.editContract(this.basicInfoData);
                //
                // }, () => {
                //     this.$Message.error('请求失败!');
                //     this.$Loading.error();
                // });
            },
            commitContract(type) {
                // 0.9.1优化
                this.publicThreeSetp('save');

                // 没有修改的时候不能提交
                // if (!this.isSubmit) {
                //     return;
                // }

                // if (this.newData) {
                //     this.newData.network = 1; //传统合同1
                // }
                // let parms = {
                //     basic_list: JSON.stringify(this.newData),
                // };
                // 输入甲方公司需要等待转换成id

//                 if (this.contractID !== null) {
//                     // 未设置关联项目时要删除
//                     if (!this.newData.project_id) {
//                         delete this.newData.project_id;
//                     }
//                     // 修改过的付款信息 或者info直接获取的付款信息 否则为空
//                     let price = this.contractCostData[0] ? this.contractCostData[0].price_list : '';
//                     let step = this.contractCostData[0] ? this.contractCostData[0].step_list : '';
//                     // 默认传输字段
//                     parms = {
//                         contract_id: this.contractID,
//                         basic_list: JSON.stringify(this.newData),
//                         price_list: JSON.stringify(this.newCost.price_list ? this.newCost.price_list : price),
//                         step_list: JSON.stringify(this.newCost.step_list ? this.newCost.step_list : step),
//                         step:this.nIndex+1
//                     };
//                     // 修改线下合同
//
//                     console.log(this.filesData)
//                     if (this.filesData && this.filesData.length !== 0) {
//                         parms.files_list = JSON.stringify(this.filesData);
//                     }
//                     //线下合同单独上传文件
//                     if (type === 'img') {
//                         parms.files_list = this.filesData && this.filesData.length>0? JSON.stringify(this.filesData):JSON.stringify(this.newFileLoad);
//                     }
// //                     第一步的创建和修改删除付款信息
// //                     if (this.contractCostData[0] && this.contractCostData[0].price_list.length === 0&&!this.newCost.price_list) {
// //                         delete  parms.price_list;
// //                     }
// //
// //                     if (this.contractCostData[0] && this.contractCostData[0].step_list.length === 0&&!this.newCost.step_list) {
// //                         delete  parms.step_list;
// //                     }
//
//                 }
//                 if(this.contractID !== null){
//                    return this.editContract(parms,type)
//                 }else{
//                    return this.addContract(parms,type)
//                 }

            },
            // async addContract(parms){
            //     let {data} = await api.addContract(parms)
            //     if(data.err_code === 0){
            //         this.isSubmit = false;
            //         this.$store.commit('getContractIDCommit', data.err_message.data.id);//传contrac_ID
            //         return true
            //     }else{
            //         this.$Message.error(data.err_message);
            //     }
            // },
            // async editContract(parms,type){
            //     let {data} = await api.editContract(parms)
            //     if(data.err_code === 0){
            //         this.isSubmit = false;
            //                // 必须是第二步更新
            //                 if (this.newCost) {
            //                     // this.is_over = 1;
            //                 }
            //                 if (type === 'img') {
            //                     this.$router.push('/epibol/contractManage');
            //
            //                 }
            //                 return true
            //     }else{
            //         this.$Message.error(data.err_message);
            //     }
            // },
            // checkNext(){
            //     if (this.nIndex >= 0 && this.nIndex < 2) {
            //         this.nIndex++;
            //     }
            // },
            // next
            // async nextStep() {
            // // 基础信息进入下一步
            // if (this.nIndex === 0) {
            //     if (this.firstSub()) {
            //         return;
            //     } else if (this.newData.customer_id === '0') {
            //         this.$Message.info('请等待公司验证');
            //         return;
            //     } else if (!await this.commitContract()) {
            //         return
            //     }
            // }
            // // 付款进入下一步
            // if (this.nIndex === 1) {
            //     if (await this.costUpload()) {
            //         return;
            //     } else {
            //         if (!await this.commitContract()) {
            //             return true
            //         }
            //     }
            // }
            //
            // if (this.nIndex >= 0 && this.nIndex < 2) {
            //     this.nIndex++;
            // }
            // if (this.nIndex == 1) {
            //     this.$nextTick(() => {
            //         this.$refs.costData.priceChange();
            //     });
            // }

            // temporary
            // },
            // last
            // lastStep () {
            // if (this.nIndex > 0) {
            //     this.nIndex--;
            // }
            // if (this.nIndex < 1) {
            //     this.Bdisabled = false;
            // }
            // },
            // 判断基础信息是否完成
            // firstSub () {
            //     let contractName = this.$refs.editContract.contractName;
            //     let contractTime = this.$refs.editContract.contractTime;
            //     let agentUser = this.$refs.editContract.agentUser;
            //     let projectUser = this.$refs.editContract.projectUser;
            //     let companyA = this.$refs.editContract.companyA;
            //     let oneAccess = this.$refs.editContract.oneAccess;
            //     let contact = this.$refs.editContract.contact;
            //     if (!contractName || !contractTime || !agentUser || !projectUser || !projectUser || !companyA || !oneAccess || !contact) {
            //         this.$Message.error('请先完善信息');
            //         return true;
            //     }
            // },
            async costUpload() {
                // console.log(77)
                let flag = false;
                let costData = this.$refs.costData.priceData;
                let contractPayDate = this.$refs.costData.contractPayDate;
                let isdata = !(costData && costData.length > 0 && contractPayDate && contractPayDate.length > 0);
                costData.forEach((creent, index, arr) => {
                    if (creent.unit == 1 && !creent.unitprice || creent.unit == 1 && !creent.day) {
                        flag = true;
                    } else if (creent.unit == 2 && !creent.unitprice || creent.unit == 2 && !creent.count) {
                        flag = true;
                    }
                    if (!creent.key && !creent.finish_date) {
                        flag = true;
                    }
                });
                contractPayDate.forEach((creent, index, arr) => {
                    if (creent.num == 0 || creent.amount == 0) {
                        flag = true;
                    }
                });

                if (flag || isdata) {
                    this.$Message.error('请先完善信息');
                    return true;
                }
            },
            changeIsSubmit() {
                this.isSubmit = true;

            },
        }

    };

</script>
<style lang="less">
    .offline-contract-container {
        // padding-top: 30px;
        .second-navigation-bar {
            margin-bottom: 10px;
            overflow: hidden;
            > a {
                float: left;
                font-size: 13px;
                color: @black_2;
                padding: 0 2px;
                border-bottom: 2px solid @baseboard;
                &.second-nav-title {
                    // border-bottom: 2px solid #3bceb6;
                    font-size: 14px;
                    margin-top: -1px;
                    color: @black_2;
                }
                &:hover {
                    border-bottom: 2px solid @base;
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
    }

    .newContractData {
        em {
            font-style: normal;
        }
        background: #fff;
        padding: 20px;
        .stepList {
            display: flex;
            .active {
                color: @base;
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
        .contractNav {
            background: #f2f2f2;
            display: block;
            span {
                margin-left: -19px;
                height: 37px;
                line-height: 36px;
                font-size: 14px;
                color: #666;
                width: 252px;
                text-align: center;
                display: inline-block;
                background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAlCAYAAACgc9J8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplNzczMDkxMi1kOGVmLTlkNGMtYmUzYi01YjFmMjA1ODViYWEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkJCMDA5Q0Q4OTkxMTFFOEJCNTRGODBEODY0Njk2QTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkJCMDA5Q0M4OTkxMTFFOEJCNTRGODBEODY0Njk2QTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmU3NzMwOTEyLWQ4ZWYtOWQ0Yy1iZTNiLTViMWYyMDU4NWJhYSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplNzczMDkxMi1kOGVmLTlkNGMtYmUzYi01YjFmMjA1ODViYWEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4u1vl+AAAAtUlEQVR42qzUbQ7AEAwGYN77uP89ONAWki1mPtq+9UNQeZKiYs75CiHE4NCQUqrQ5YLVzgvEM/AA0U9YEOMCA2K2aAWxClhA7IJaEKcNGhCSTVIQ0hQkIDQHfAKhvf4dCMvjXIGwls4MBFPYIwj22+lBGutBF6yU0r5+eEF0mj1EYSNkxmaQCVtBamwHqbATJMYkkAiTQkdMA20xLbTELNAUs0I/jIE+GAu9mAfUMC+otluAAQAGt13A/bESZgAAAABJRU5ErkJggg==') no-repeat right;
                float: left;
                s {
                    background: #c3c3c3;
                    border-radius: 100%;
                    line-height: 20px;
                    width: 20px;
                    display: inline-block;
                    text-align: center;
                    color: #fff;
                    text-decoration-line: none;
                    margin-right: 8px;
                }
                &:nth-of-type(1) {
                    margin-left: 0px;
                }
            }

            .spanOne {
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAAAlCAYAAABmmoSAAAAACXBIWXMAAAsTAAALEwEAmpwYAAA5lWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxOC0wNy0xN1QxMTozMToxMyswODowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE4LTA3LTE3VDE2OjE1OjQ2KzA4OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxOC0wNy0xN1QxNjoxNTo0NiswODowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo1MTM5ZTk0Yy1lYTExLWJlNDItOWEyOC1mOWVkMzEwN2U1ZmQ8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6REI1MTA2REI4OTcxMTFFOEI0QUZFMTNBQjgwRDdDQkY8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpEZXJpdmVkRnJvbSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgIDxzdFJlZjppbnN0YW5jZUlEPnhtcC5paWQ6REI1MTA2RDg4OTcxMTFFOEI0QUZFMTNBQjgwRDdDQkY8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6REI1MTA2RDk4OTcxMTFFOEI0QUZFMTNBQjgwRDdDQkY8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDpEQjUxMDZEQjg5NzExMUU4QjRBRkUxM0FCODBEN0NCRjwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NTEzOWU5NGMtZWExMS1iZTQyLTlhMjgtZjllZDMxMDdlNWZkPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTA3LTE3VDE2OjE1OjQ2KzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4yNTI8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+Mzc8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PtrcDIwAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAANBJREFUeNrs1rENwlAQBcH7NOYWIHGPJnELUJlpgsDSzhTwgpNWuvX8HNcAt3Zu+/rHzsMp4f5e3/cleBC94EH0god89IKHUPSCh1D0godQ9IKHUPSCh1D0godQ9IKHUPSCh1D0godQ9IKHUPSCh1D0godQ9IKHUPSCh1D0goeIc9uX4CESu5ceQrELHkKxCx5CsQseQrELHkKxCx5CsQseQrELHkKxCx5CsQseQrELHkKxCx5CsQseQrELHkKxCx5CsQseQrHPzPwAAAD//wMAVSxMR0CCRUwAAAAASUVORK5CYII=');
                font-weight: bold;
                color: #fff;
                s {
                    color: #50c0a9;
                    background: #fff;
                }
            }
            .spanTwo {
                &:extend(.newContractData .contractNav .spanOne);
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAAAlCAYAAABmmoSAAAAACXBIWXMAAAsTAAALEwEAmpwYAAA5lWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxOC0wNy0xN1QxMTozODo1NyswODowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE4LTA3LTE3VDE2OjE1OjEwKzA4OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxOC0wNy0xN1QxNjoxNToxMCswODowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDowZmRiYWU2MS04YWRmLWQwNDUtOTc1My0wMTU1MDJiNjE1ZWI8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6RUZCNTIwNkY4OTcyMTFFOEE0MDE5MzIyMjE2QkNBQkQ8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpEZXJpdmVkRnJvbSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgIDxzdFJlZjppbnN0YW5jZUlEPnhtcC5paWQ6RUZCNTIwNkM4OTcyMTFFOEE0MDE5MzIyMjE2QkNBQkQ8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6RUZCNTIwNkQ4OTcyMTFFOEE0MDE5MzIyMjE2QkNBQkQ8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDpFRkI1MjA2Rjg5NzIxMUU4QTQwMTkzMjIyMTZCQ0FCRDwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MGZkYmFlNjEtOGFkZi1kMDQ1LTk3NTMtMDE1NTAyYjYxNWViPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTA3LTE3VDE2OjE1OjEwKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4yNTI8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+Mzc8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pj08o/8AAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAUNJREFUeNrs2MlNxFAQRdHvIhuSaJEBbDpH2HQKEAIRmR0SogeP0q/yOUvbervraXj9fB8b0LXL6TxssRNbDQH7efv62OTBHFvePYC+o4+tXxmAfqOPPb4TgD6jj71+DgD9RR/XDooeakYft06IHupFH/dOih5qRR+PLhA91Ik+plwkeqgRfUwdEz3kjz7mjIkeckcfc8dED3mjjyVjooec0cfSMdFDvuhjzZjoIVf0sXZM9JAn+mEcx00HgX6F2OEYLqfzEGKHY8S++gkvdsgT+6rgxQ65Yl8cvNghX+yLghc75Ix9dvBih7yxzwpe7JA79snBix3yxz4peLFDjdgfBi92qBP73eDFDrVivxm82KFe7FeDFzvUjP1f8GKHurH/CV7sUDv23+DFDvVjb621p++XZ7HDAWJvrbUfAAAA//8DAPOzlX+AKGUqAAAAAElFTkSuQmCC');
                s {
                    &:extend(.newContractData .contractNav .spanOne s);
                }
            }
        }
        .detailsNav {
            height: 37px;
            line-height: 36px;
            margin-top: 30px;
            span {
                margin: 0px 30px;
                font-size: 16px;
                color: #bcbcbc;
                cursor: pointer;
                transition: all .3s;
                float: left;
                &:hover {
                    color: #31bb9f
                }
            }
            .show {
                color: #31bb9f;
                transform: scale(1.2);
            }
        }
        .basicInfo {
            float: left;
            width: 500px;
            ul {
                li {
                    padding: 8px 0px;
                    display: block;
                    font-size: 12px;
                    .span {
                        width: 48%;
                        display: inline-block;
                        float: left;
                        &:nth-of-type(1) {
                            margin-right: 4%;
                        }
                    }
                    .ivu-select-input {
                        font-size: 13px;
                    }
                }
                .ivu-select-item {
                    padding: 8px;
                }
                .line {
                    border-bottom: 1px solid #ddd;
                    margin-bottom: 5px;
                    font-size: 14px;
                    color: #000;
                }
            }
        }
        .contractSchedle {
            margin-left: 530px;
            padding: 20px;
            overflow: auto;
            text-align: center;
            .Flex {
                width: 400px;
                display: inline-block;
                text-align: left;
                h1 {
                    font-weight: normal;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .schedle {
                    li {
                        span {
                            width: 60px;
                            height: 60px;
                            padding: 12px 2px;
                            display: inline-block;
                            border-radius: 100%;
                            text-align: center;
                            line-height: 36px;
                            overflow: hidden;
                            border: 1px solid #a6a6a6;
                            background: #fff;
                            float: left;
                        }
                        .state {
                            background: @base;
                            border-color: @base;
                            color: #fff;
                        }
                        .statusInfo {
                            float: left;
                            margin-left: 30px;
                            width: 200px;
                            line-height: 18px;
                            color: #c9c9c9;
                            margin-top: 10px;
                            .Constate {
                                color: @base;
                                font-size: 14px;
                                display: line-block;
                                font-weight: bold;
                            }
                        }
                        p {
                            margin: 10px 29px;
                            height: 42px;
                            width: 2px;
                            display: inline-block;
                            overflow: hidden;
                            background: #e1e1e1;
                            em {
                                position: absolute;
                                margin-left: 10px;
                                color: @orange;
                                width: 10px;
                                margin-top: -5px;
                            }
                        }
                        &:nth-last-of-type(1) {
                            p {
                                display: none;
                            }
                        }
                    }
                }
            }
        }
        .autoHeight {
            overflow: auto;
        }
        .contractCost {
            h1 {
                font-size: @fs14;
                color: @black_2;
                margin: 10px 0px;
                font-weight: normal;
            }
            .priceList {
                // max-width: 1300px;
                position: relative;
                margin: 10px 0;
                font-size: 13px;

                //.span {
                //  width: 200px;
                //  display: inline-block;
                //  line-height: 30px;
                //  height: 30px;
                //  float: left;
                //  padding: 0px 20px;
                //  &:nth-of-type(2) {
                //    width: 240px;
                //  }
                //  &:nth-of-type(3) {
                //    width: 140px;
                //    .ivu-input {
                //      padding-left: 15px;
                //    }
                //  }
                //  &:nth-of-type(4) {
                //    width: 200px;
                //  }
                //  &:nth-of-type(5) {
                //    text-align: right;
                //  }
                //}
                .ellipsis {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-top: 8px;
                    margin-left: 10px;
                }
                .amountList {
                    text-align: right;
                    font-size: 12px;
                    border: 1px solid @baseboard;
                    border-top: 1px solid transparent;
                }
                .priceTile {
                    display: flex;
                    border: 1px solid @baseboard;
                    .span {
                        flex: 1;
                        text-align: left;
                        color: @black_3;
                        font-size: 14px;
                        &:nth-of-type(1) {
                            margin-left: 20px;
                        }
                    }

                }
                .valueList {
                    display: flex;
                    font-size: 13px;
                    border: 1px solid @baseboard;
                    border-top: 1px solid transparent;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .span {
                        flex: 1;
                        /*margin-right: 10%;*/
                        /*margin-left:10px;*/
                        &:nth-of-type(1) {
                            margin-left: 10px;
                        }
                    }

                    .ivu-input {
                        font-size: 13px;
                        /*border: 1px solid transparent !important;*/
                        outline: none !important;
                    }
                    &:hover {
                        .deletPrice {
                            /*display: block;*/
                        }
                    }

                }
                .costLine {
                    position: relative;
                    height: 6px;
                    padding: 0 40px;
                    margin-top: 50px;
                    background: @base;
                    .green {
                        color: @base;
                    }
                    .icon {
                        padding: 0 2px;
                        color: #bdbdbd;
                        cursor: pointer;
                    }
                    .ivu-input-icon + .ivu-input {
                        padding-right: 0;
                    }
                    .costLineNode {
                        position: absolute;
                        top: -65px;
                        min-width: 165px;
                        text-align: center;
                        transform: translateX(-50px);
                        .sign {
                            position: absolute;
                            top: 55px;
                            left: 56px;
                            display: block;
                            width: 3px;
                            height: 3px;
                            color: #3bceb6;
                            font-size: 16px;
                            transform: rotate(138deg);
                        }
                    }
                }

                .bigFont {
                    font-size: 22px;
                    color: #444;
                }
                li {
                    padding: 8px 0px;
                    &:hover .deletPrice {
                        opacity: 1;
                    }

                }
                //.line {
                //  &:extend(.newContractData .basicInfo ul .line);
                //}
                .addPrice {
                    display: inline-block;
                    position: absolute;
                    top: -42px;
                    right: 0;
                    width: 120px;
                    height: 36px;
                    line-height: 36px;
                    font-style: normal;
                    text-align: center;
                    cursor: pointer;
                    color: @white;
                    background: @base;
                    border-radius: 4px;
                    &:hover {
                        background: @base_dark;
                    }
                }
                .deletPrice {
                    color: @black_3;
                    font-size: 16px;
                    cursor: pointer;
                    /*opacity: 0;*/
                    /*margin: 10px 20px 0 0;*/
                    &:hover {
                        color: @red;
                    }
                }
            }
            .contractPay {
                .span {
                    &:nth-of-type(2) {
                        .ivu-input {
                            padding-right: 80px;
                            padding-left: 10px;
                            font-size: 14px;
                        }
                        em {
                            color: @black_3;
                            /*width: 70px;*/
                            /*display: inline-block;*/
                            /*text-align: left;*/
                            /*float: right;*/
                            /*position: relative;*/
                            z-index: 99;
                            /*margin-bottom: -30px;*/
                            /*padding-top: 10px;*/
                        }
                    }
                    &:nth-of-type(3) {
                        width: 400px;
                        text-align: left;
                        .ivu-input {
                            text-align: left;
                            padding-right: 10px;
                            font-size: 14px;
                        }
                    }
                }
                .deletPrice {
                    margin-top: 8px;
                }
            }
        }
        .confirContract {
            height: 100%;
            margin: 0px -20px;
            border-style: solid;
            border-width: 1px 1px 1px 1px;
            border-color: @gray;
            .offlineContract {
                border-right: 1px solid @gray;
                .offineUpLoad {
                    color: @base;
                    margin-top: 15%;
                    margin-left: 40%;
                    cursor: pointer;
                    background: @red;
                    .offupLoad {
                        position: absolute;
                        width: 230px;
                        height: 65px;
                        display: inline-block;
                    }
                    & > .ivu-icon {
                        float: left;
                    }
                    & > p {
                        font-size: 18px;
                        font-weight: bold;
                        float: left;
                        margin-left: 15px;
                        & > em {
                            font-size: 12px;
                            font-weight: lighter;
                        }
                    }
                    &:hover {
                        color: @base_dark;
                    }
                }
            }
            .lineContract {
                float: left;
                width: 50%;
                .success {
                    margin-top: 30%;
                    margin-left: 40%;
                    height: 50px;
                    width: 172px;
                    display: inline-block;
                    text-align: center;
                    background: #31bb9f;
                    border: 0px;
                    font-size: 16px;
                }
            }
            .title {
                line-height: 22px;
                color: #444;
                padding: 20px;
                font-size: 18px;
                font-weight: bold;
                & > .iconfonts {
                    font-size: 20px;
                    margin-right: 5px;
                }
                & > p {
                    font-size: 12px;
                    color: #999;
                    font-weight: normal;
                    margin-top: 5px;
                    margin-left: 26px;
                }
            }
            .lookContract {
                .contractIndex {
                    width: 150px;
                    float: left;
                    padding: 10px 4px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    span {
                        position: relative;
                        padding: 2px;
                        border: 2px solid #ddd;
                        display: inline-block;
                        width: 126px;
                        text-align: center;
                        margin-bottom: 10px;
                        img {
                            width: 100%;
                        }
                        &:hover .delete {
                            display: inline-block;
                        }
                    }
                    .selet {
                        position: relative;
                        border: 2px solid #09bb07;
                    }
                    .ageUpload {
                        background: #f2f2f2;
                        border-width: 2px;
                        border-color: #e4e4e4;
                        border-style: solid;
                        width: 126px;
                        height: 163px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #aaa;
                        cursor: pointer;
                        transition: all 0.3s;
                        &:hover {
                            border-color: #50b595;
                            color: #50b595;
                        }
                    }
                    .delete {
                        position: absolute;
                        margin-left: 92px;
                        color: #fff;
                        background: rgba(0, 0, 0, 0.3);
                        padding: 1px 4px;
                        border-radius: 2px;
                        margin-top: 3px;
                        display: none;
                        cursor: pointer;
                    }
                }
                .contract {
                    margin-left: 160px;
                    overflow-y: auto;
                    img {
                        max-width: 98%;
                        display: block;
                        margin: 0 auto;
                    }
                    .restContractStyle {
                        background: rgba(49, 189, 159, .5);
                        color: #fff;
                        padding: 5px 20px;
                        cursor: pointer;
                        width: 140px;
                        position: absolute;
                        z-index: 11;
                        &:hover {
                            background: rgba(49, 189, 159, .8);
                        }
                    }
                }
            }
        }
    }

    .nextRow {
        margin: 10px 0px;
        text-align: right;
    }
</style>
