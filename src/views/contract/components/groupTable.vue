<template>
    <div class="addSettlementModal">
        <div class="modalTable">
            <ul class="addSettlementHead">
                <li v-if="showType">
                    <Checkbox v-model="selectAll" @on-change="selectAllFun(selectAll)">资源名称</Checkbox>
                </li>
                <li v-else>资源名称</li>
                <li>类型</li>
                <li>单位</li>
                <li>单价/元</li>
                <li>天数</li>
                <li>资源数量</li>
                <li>完成时间</li>
                <li>小计</li>
            </ul>
            <div style="max-height: 300px;overflow-y: auto">
                <template v-if="groupList && groupList.length > 0">
                    <dl class="addSettlementBody" v-for="item in groupList">
                        <dt @click="item.flag = !item.flag"><em class="iconfonts icon-fangxiangshang" :class="{'open':item.flag}"></em><span>{{item.group_name}}</span></dt>
                        <dd v-for="(C,index) in item.child" v-if="item.flag">
                            <span v-if="showType"><Checkbox v-model="C.selectFlag" @on-change="selectFun(C,index)">{{C.key}}</Checkbox></span>
                            <span v-else>{{C.key}}</span>
                            <span>{{C.ability_name}}</span>
                            <span>{{C.unit == 1 ? '单人/天' : '个'}}</span>
                            <span>{{C.unitprice}}</span>
                            <span>{{C.day == 0 ? '--' : C.day}}</span>
                            <span v-if="showType"><InputNumber :min="0" :max="C.count_re" v-model="C.count" @on-change="countNum(C)" style="width: 80px"></InputNumber></span>
                            <span v-else>{{C.count}}</span>
                            <span>{{C.finish_date}}</span>
                            <span>￥{{C.subtotal.toFixed(2)}}</span>
                        </dd>
                    </dl>
                </template>

                <template v-else>
                    <div style="position: relative;height: 300px;border: 1px solid #ececec;border-top: none">
                        <nothink type="project" text="暂无数据"></nothink>
                    </div>
                </template>
            </div>
            <div class="addSettlementFooter">
                        <span>
                            交付资源数量：<em>{{total_count}}</em>
                        </span>
                <span>
                            清单总金额：<em>￥{{total_price.toFixed(2)}}</em>
                        </span>
            </div>
        </div>
        <div class="modalTable2" v-if="showType">
            <ul class="payHead">
                <li>结算标题</li>
                <li>结算资源数量</li>
                <li>结算金额</li>
                <li>操作</li>
            </ul>
            <ul class="payBody">
                <li>
                    <label>
                        <Input v-model="orderTitle" placeholder="输入付款标题"></Input>
                    </label>
                    <label>
                        <span>{{selectNum}}&nbsp;&nbsp;</span>
                        <!--Math.floor(selectNum/total_count*100)-->
                        <em style="font-style: normal"> ({{total_count > 0 ? Math.floor(selectNum/total_count*100) : 0}}%)</em>
                    </label>
                    <label>
                        <InputNumber :min="0" v-model="selectMoney" style="width: 100px" placeholder="输入结算金额"></InputNumber>
                    </label>
                    <label>
                        <button class="conrimBtn" @click="confrimFun">确认结算</button>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {newContractApi} from 'api';
    export default {
        name: "group-table",
        props: {
            groupData: {
                type: Object,
                default: ()=>{}
            },
            detaliList: {
                type: Object,
                default: ()=>{}
            },
            addSettlementFlag: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            groupData: {
                handler(value){
                    this.groupList = value.list;
                    this.total_count = value.total_count;
                    this.total_price = value.total_price;
                    this.showType = true;
                },
                deep: true
            },
            detaliList: {
                handler(value){
                    this.groupList = value.list;
                    this.total_count = value.total_count;
                    this.total_price = value.total_price;
                    this.showType = false;
                },
                deep: true
            },
            addSettlementFlag(flag){
                this.resetData();
            }
        },
        computed: {
            ContractID() {
                return this.$store.state.contract.contractData.ID;
            }
        },
        data(){
            return {
                groupList: [],
                selectAll: false,
                total_count: 0,
                total_price: 0,
                selectNum: 0,
                selectMoney: 0,
                orderTitle: null,
                selectOrderList: [],

                showType: false
            };
        },
        methods: {
            selectAllFun(flag) {
                let orderlist = this.groupList;
                if (flag) {
                    this.selectNum = this.total_count;
                    this.selectMoney = this.total_price;
                    this.selectOrderList = [];
                    let _this = this;
                    orderlist.forEach(function (creent) {
                        creent.child.forEach(function (item) {
                            _this.selectOrderList.push({
                                id: item.id,
                                count: item.count
                            });
                        });
                    });
                } else {
                    this.selectNum = 0;
                    this.selectMoney = 0;
                    this.selectOrderList = [];
                }
                orderlist.forEach(function (creent) {
                    creent.child.forEach(function (item) {
                        item.selectFlag = flag;
                    });
                });
            },
            selectFun(item, index) {
                if (item.selectFlag) {
                    this.selectNum += item.count;
                    this.selectMoney += item.subtotal;
                    this.selectOrderList.push({
                        id: item.id,
                        count: item.count
                    });
                } else {
                    this.selectAll = false;
                    this.selectNum -= item.count;
                    this.selectMoney -= item.subtotal;
                    let _this = this;
                    this.selectOrderList.forEach(function (creent, index) {
                        if (creent.id == item.id){
                            _this.selectOrderList.splice(index, 1);
                        }
                    });
                }
            },
            async confrimFun() {
                if (this.orderTitle) {
                    if (this.selectMoney > 0){
                        let parms = {
                            contract_id: this.ContractID,
                            key: this.orderTitle,
                            num: this.selectNum,
                            amount: this.selectMoney,
                            list: JSON.stringify(this.selectOrderList)
                        };
                        let {data} = await newContractApi.PayStep(parms);
                        if (data.err_code == 0){
                            this.$Message.success('添加成功！');
                            this.$store.dispatch("getContractInfo").then(()=>{
                                this.$store.dispatch("getContractInfo").then(()=>{
                                    this.$emit('colseModal');
                                });
                            });
                        }
                    } else {
                        this.$Message.warning('结算金额不能为0！');
                    }
                } else {
                    this.$Message.warning('请输入付款标题！');
                }
            },
            resetData(){
                this.selectNum = 0;
                this.selectMoney = 0;
                this.orderTitle = null;
                this.selectOrderList = [];
            },
            countNum(C){
                let num = 0;
                let _this = this;
                this.groupList.forEach(function (creent) {
                    creent.child.forEach(function (item) {
                        if (item.selectFlag){
                            num += item.count;
                        }
                    });
                });
                this.selectNum = num;

                this.selectOrderList.forEach(function (creent, index) {
                    if (creent.id == C.id){
                        creent.count = C.count;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .addSettlementModal {
        .modalTable {
            border: 1px solid #ececec;
            .addSettlementHead {
                display: flex;
                justify-content: space-between;
                height: 40px;
                line-height: 40px;
                background: #fbfbfb;
                border-bottom: 1px solid #ececec;
                li {
                    flex: 1;
                    text-align: center;
                    font-size: 13px;
                    color: #888;
                }
            }
            .addSettlementBody {
                max-height: 250px;
                overflow-y: auto;
                &:last-child {
                    dd {
                        &:last-child {
                            border-bottom: none;
                        }
                    }
                }
                dt {
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #ececec;
                    display: flex;
                    align-items: center;
                    &:hover {
                        cursor: pointer;
                        background: rgba(17, 183, 243, 0.1);
                    }
                    em {
                        margin-left: 10px;
                        margin-right: 25px;
                        display: inline-block;
                        transition: all .5s;
                        transform: rotate(90deg);
                        &.open {
                            transform: rotate(0deg);
                        }
                    }
                }
                dd {
                    height: 50px;
                    line-height: 50px;
                    display: flex;
                    border-bottom: 1px solid #ececec;
                    &:hover {
                        cursor: pointer;
                        background: #fbfbfb;
                    }
                    span {
                        flex: 1;
                        text-align: center;
                    }
                }
            }
            .addSettlementFooter {
                background: #fbfbfb;
                border-top: 1px solid #ececec;
                height: 40px;
                line-height: 40px;
                text-align: right;
                padding: 0 20px;
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
        .modalTable2 {
            border: 1px solid #ececec;
            margin-top: 30px;
            .payHead {
                display: flex;
                justify-content: space-between;
                height: 40px;
                line-height: 40px;
                background: #fbfbfb;
                border-bottom: 1px solid #ececec;
                li {
                    flex: 1;
                    text-align: center;
                    font-size: 13px;
                    color: #888;
                }
            }
            .payBody {
                max-height: 250px;
                overflow-y: auto;
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #ececec;
                    padding: 0 15px;
                    &:last-child {
                        border: none;
                    }
                    label {
                        flex: 1;
                        text-align: center;
                        .conrimBtn {
                            width: 102px;
                            height: 38px;
                            line-height: 38px;
                            background: #3cd2b4;
                            color: #ffffff;
                            border-radius: 4px;
                            border: none;
                            outline: none;
                        }
                    }
                }
            }
        }
    }
</style>
