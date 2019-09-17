<template>
    <div class="contractBody">
        <div class="head" v-if="headFlag">{{title}}</div>
        <div class="body" :style="{ height : headFlag ? 'calc(100% - 75px)' : '100%' }">
            <keep-alive>
                <component v-bind:is="currentTabComponent" :threeDetailFlag="threeDetailFlag" :priceIndex="priceIndex"></component>
            </keep-alive>
        </div>
        <div class="footer">
            <div class="jia" v-if="companyType">
                <span>
                    <i class="iconfonts icon-cuowu1"></i>
                    确认合同无误前，请仔细核对合同信息！（Ps：特别主语合同修改部分内容哦！）
                </span>
                <button>确认合同无误</button>
            </div>
            <div class="yi" v-else>
                <button @click="saveContract">保存合同</button>
                <button @click="checkContarct()">发送合同</button>
            </div>
        </div>
        <Modal v-model="sendContractModalFlag" title=" " :footer-hide="true" width="355">
            <div class="sendContractTips">
                <span>请确认本次合同提交是否与甲方同步？</span>
                <p>
                    <button @click="confrimSend">确认同步</button>
                    &nbsp;&nbsp;&nbsp;
                    <button @click="cancelSend">不发送</button>
                </p>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {newContractApi} from "api";
    import Cookies from 'js-cookie';
    import one from '../page/one';
    import two from '../page/two';
    import three from '../page/three';
    import four from '../page/four';

    export default {
        name: "contract-body",
        props: ['creentMenu'],
        components: {
            one,
            two,
            three,
            four
        },
        data() {
            return {
                title: '基础信息',
                currentTabComponent: 'one',
                headFlag: true,
                sendContractModalFlag: false,
                companyType: Cookies.get('company') ? JSON.parse(Cookies.get('company')).type : null,
                threeDetailFlag: false,
                priceIndex: null
            };
        },
        computed: {
            contractInfo(){
                return this.$store.state.contract.contractData;
            }
        },
        watch: {
            creentMenu: {
                handler(creentTab){
                    if (creentTab.creent == 'one'){
                        this.headFlag = true;
                        this.currentTabComponent = 'one';
                        this.title = '基础信息';
                    } else if (creentTab.creent == 'two'){
                        this.headFlag = true;
                        this.currentTabComponent = 'two';
                        this.title = '上传合同扫描件';
                    } else if (creentTab.parent == 'three' && creentTab.creent != 'addBtn' && creentTab.creent != null){
                        this.headFlag = true;
                        this.currentTabComponent = 'three';
                        this.threeDetailFlag = true;
                        this.priceIndex = creentTab.creent;
                        this.title = '资源及金额';
                    } else if (creentTab.parent == 'three' && creentTab.creent == 'addBtn'){
                        this.headFlag = false;
                        this.currentTabComponent = 'three';
                        this.threeDetailFlag = false;
                        this.title = '资源及金额';
                    } else if (creentTab.creent == 'four'){
                        this.headFlag = true;
                        this.currentTabComponent = 'four';
                        this.title = '结算清单';
                    }
                    console.log(creentTab);
                },
                deep: true
            },
        },
        methods: {
            async saveContract() {
                this.$bus.emit('saveContractData');
                this.$nextTick(() => {
                    this.$store.dispatch("saveContractAction", true);
                });
            },
            checkContarct(){
                this.$bus.emit('saveContractData');
                this.$nextTick(()=>{
                    let baseInfo = this.contractInfo.base;
                    if (!baseInfo.contract_name){
                        this.$Message.warning('合同名称不能为空！');
                    } else if (!baseInfo.start_time || !baseInfo.end_time){
                        this.$Message.warning('请选择合同时间！');
                    } else if (!baseInfo.contract_price){
                        this.$Message.warning('预计总金额不能为空！');
                    } else if (!baseInfo.project_expect_time){
                        this.$Message.warning('请选择项目预计启动时间！');
                    } else if (!baseInfo.manager){
                        this.$Message.warning('请选择合同经办人！');
                    } else if (!baseInfo.business_people){
                        this.$Message.warning('请选择商务对接人！');
                    } else if (baseInfo.customer_id == null){
                        this.$Message.warning('甲方公司不能为空！');
                    } else {
                        this.sendContractModalFlag = true;
                    }
                });
            },
            confrimSend(){
                this.$store.dispatch("saveContractAction").then(async(res)=>{
                    let parms = {contract_id: this.contractInfo.ID};
                    let {data} = await newContractApi.sendContract(parms);
                    if (data.err_code == 0){
                        this.$Message.success('合同发送成功！');
                        this.sendContractModalFlag = false;
                    }
                });
            },
            async cancelSend(){
                // this.updataContract();
                // this.sendContractModalFlag = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    .contractBody {
        position: relative;
        margin-left: 390px;
        background: @white;
        height: 90%;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
        /*padding: 0 30px;*/
        .head {
            height: 75px;
            line-height: 75px;
            border-bottom: 1px dashed #ccc;
            background: #fff;
            font-size: 15px;
            padding: 0 30px;
        }
        .body {
            height: calc(~"100% - 75px");
            background: #fff;
        }
        .footer {
            position: absolute;
            text-align: right;
            bottom: -55px;
            right: 0;
            display: flex;
            button {
                width: 102px;
                height: 38px;
                line-height: 38px;
                background: @base;
                color: @white;
                border-radius: 4px;
                border: none;
                outline: none;
                &:hover {
                    cursor: pointer;
                    background: @base_dark;
                }
            }
            .jia {
                display: flex;
                align-items: center;
                span {
                    color: #ff898e;
                    display: flex;
                    align-items: center;
                    /*.icon-cuowu1{*/
                    /*margin-top: 2px;*/
                    /*}*/
                }

            }
        }
    }

    .sendContractTips {
        padding-top: 20px;
        text-align: center;
        span {
            font-size: 15px;
            color: #888;
        }
        p {
            margin-top: 50px;
            button {
                width: 90px;
                height: 35px;
                line-height: 35px;
                background: #3cd2b4;
                color: #ffffff;
                border-radius: 4px;
                border: none;
                outline: none;
                &:hover {
                    cursor: pointer;
                    background: @base_dark;
                }
            }
        }
    }
</style>
