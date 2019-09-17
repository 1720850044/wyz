<template>
    <div class="settlementBox">
        <div class="settlementTable">
            <ul class="settlementHead">
                <li>结算标题</li>
                <li>结算金额</li>
                <li>结算时间</li>
                <li v-if="companyType">支付人</li>
                <li v-else>结算人员</li>
                <li>操作</li>
            </ul>
            <ul class="settlementBody" v-if="stepList && stepList.length > 0">
                <li v-for="item in stepList">
                    <span>{{item.key}}</span>
                    <span>{{item.amount}}</span>
                    <span>{{item.time}}</span>
                    <span>{{item.action_user || '--'}}</span>
                    <span>
                        <em @click="getPayDetails(item.id)">查看明细</em>
                        &nbsp;&nbsp;&nbsp;
                        <em v-if="companyType">支付</em>
                        <em v-else>确认收款</em>
                    </span>
                </li>
            </ul>
            <template v-else>
                <div style="position: relative;height: 400px;border: 1px solid #ececec;border-top: none">
                    <nothink type="project" text="暂无数据"></nothink>
                </div>
            </template>
            <div class="settlementFooter" v-if="!companyType && ContractID">
                <button @click="addPay">添加结算</button>
            </div>
        </div>
        <Modal v-model="addSettlementFlag" title="清单结算" :footer-hide="true" width="800px">
            <group-table :groupData="orderList" :addSettlementFlag="addSettlementFlag" @colseModal="addSettlementFlag = false"></group-table>
        </Modal>
        <Modal v-model="orderDetailFlag" title="清单明细" :footer-hide="true" width="800px">
            <group-table :detaliList="detaliList"></group-table>
        </Modal>
    </div>
</template>

<script>
    import {newContractApi} from 'api';
    import Cookies from 'js-cookie';
    import orderList from '../components/orderList';
    import GroupTable from "../components/groupTable";

    export default {
        name: "four",
        props: {
            contractInfo: {
                type: Object,
                default: (() => ({}))
            }
        },
        components: {
            GroupTable,
            orderList
        },
        computed: {
            ContractID() {
                return this.$store.state.contract.contractData.ID;
            },
            stepList() {
                return this.$store.state.contract.contractData.step;
            }
        },
        data() {
            return {
                companyType: Cookies.get('company') ? JSON.parse(Cookies.get('company')).type : null,
                addSettlementFlag: false,
                orderDetailFlag: false,
                orderList: {},
                detaliList: {}
            };
        },
        methods: {
            async addPay() {
                let parms = {
                    contract_id: this.ContractID
                };
                let {data} = await newContractApi.getPayList(parms);
                if (data.err_code == 0) {
                    this.orderList = data.data;
                }
                this.addSettlementFlag = true;
            },
            async getPayDetails(id) {
                let parms = {
                    contract_id: this.ContractID,
                    id: id
                };
                let {data} = await newContractApi.getPayDetails(parms);
                if (data.err_code == 0) {
                    this.detaliList = data.data;
                }
                this.orderDetailFlag = true;
            }
        }
    };
</script>

<style lang="less" scoped>
    .settlementBox {
        padding: 20px 30px;
        height: 100%;
        width: 100%;
        overflow: auto;
        .settlementTable {
            height: 100%;
            .settlementHead {
                display: flex;
                justify-content: space-between;
                height: 50px;
                line-height: 50px;
                background: #fbfbfb;
                border: 1px solid #ececec;
                li {
                    flex: 1;
                    font-size: 13px;
                    text-align: center;
                    color: #888;
                }
            }
            .settlementBody {
                max-height: calc(~"100% - 100px");
                /*min-height: 350px;*/
                /*height: calc(~"100% - 50px");*/
                overflow-y: auto;
                border: 1px solid #ececec;
                border-top: none;
                li {
                    display: flex;
                    justify-content: space-between;
                    border-top: 1px solid #ececec;
                    &:first-child {
                        border-top: none !important;
                    }
                    span {
                        height: 60px;
                        line-height: 60px;
                        flex: 1;
                        text-align: center;
                        em {
                            font-style: normal;
                            &:hover {
                                cursor: pointer;
                                color: @base;
                            }
                        }
                    }
                }
            }
            .settlementFooter {
                margin-top: 20px;
                text-align: right;
                button {
                    width: 102px;
                    height: 38px;
                    line-height: 38px;
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
    }
    .orderDetailBox {
        border: 1px solid #ececec;
        .orderHead {
            height: 50px;
            line-height: 50px;
            padding: 0 30px;
            display: flex;
            justify-content: space-between;
            background: #fbfbfb;
            font-size: 13px;
            color: #888;
            border-bottom: 1px solid #ececec;
            li {
                flex: 1;
                text-align: center;
            }
        }
        .orderBody {
            max-height: 350px;
            overflow-y: auto;
            li {
                height: 50px;
                line-height: 50px;
                padding: 0 30px;
                display: flex;
                justify-content: space-between;
                background: @white;
                font-size: 13px;
                color: #888;
                border-bottom: 1px solid #ececec;
                &:last-child {
                    border: none;
                }
                span {
                    text-align: center;
                    flex: 1;
                }
            }
        }
        .orderFooter {
            background: #fbfbfb;
            border-top: 1px solid #ececec;
            height: 50px;
            line-height: 50px;
            text-align: right;
            padding: 0 30px;
            span {
                font-size: 14px;
                color: #bdbdbd;
                &:first-child {
                    margin-right: 30px;
                }
                em {
                    font-style: normal;
                    color: @base;
                    font-size: 16px;
                }
            }
        }
    }
</style>
