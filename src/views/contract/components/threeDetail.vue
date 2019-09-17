<template>
    <div class="threeDetailBox">
        <template v-if="!isEditFlag">
            <div class="oneBox">
                <span class="logBtn" @click="showLogFlag = !showLogFlag">
                    操作日志<i class="iconfonts icon-fangxiangxia rotateSty" :class="{'down':!showLogFlag,'up':showLogFlag}"></i>
                </span>
                <button v-if="companyType" @click="orderModalFlag = true">查看已交付</button>
                <button v-if="!companyType && contraceID" @click="resorcePay">资源交付</button>
            </div>
            <div class="listBox">
                <div class="logBox" v-if="creentObj && creentObj.record" :style="{height:showLogFlag ? (((creentObj.record.length + 1) * 50)+2) + 'px' : '0px',marginBottom:showLogFlag?'20px':'0'}">
                    <div class="logList">
                        <ul class="logHead">
                            <li style="text-align: left">操作人</li>
                            <li style="text-align: center">操作时间</li>
                            <li style="text-align: right">操作方式</li>
                        </ul>
                        <ul class="logBody">
                            <li v-for="item in creentObj.record">
                                <span style="text-align: left">{{item.user}}</span>
                                <span style="text-align: center">{{item.create_time}}</span>
                                <span style="text-align: right">{{item.action_type}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="orderBox" v-if="creentObj">
                    <div class="orderTop">
                        <div class="orderLeft">
                            <span>{{creentObj.group_name}}</span>
                            <span>创建时间：{{creentObj.create_time}}</span>
                        </div>
                        <div class="orderRight" v-if="!companyType && creentObj.status == 0">
                            <span class="iconfonts icon-bianji" @click="EditerFun"></span>
                            <span class="iconfonts icon-shanchu" @click="isDeleteFlag = true"></span>
                        </div>
                        <div class="orderRight" v-if="!companyType && creentObj.status > 0 && creentObj.is_update == 1">
                            <span class="iconfonts icon-bianji" @click="EditerFun"></span>
                        </div>
                    </div>
                    <order-list :list="creentObj.list"></order-list>
                </div>
            </div>
        </template>

        <template v-else>
            <edit-order-list @sendOK="editerCallback" @saveAndrefresh="$emit('saveAndrefresh')" :priceIndex="priceIndex"></edit-order-list>
        </template>



        <Modal v-model="orderModalFlag" title="清单结算" width="800px">
            <div class="deliverModal">
                <div class="modalTable">
                    <ul class="deliverModalHead">
                        <li><Checkbox v-model="selectAll" @on-change="selectAllfun(selectAll)">资源名称</Checkbox></li>
                        <li>类型</li>
                        <li>单位</li>
                        <li>单价/元</li>
                        <li>天数</li>
                        <li>资源数量</li>
                        <li>完成时间</li>
                        <li>小计</li>
                    </ul>
                    <ul class="deliverModalBody">
                        <li v-for="item in orderListArr">
                            <span><Checkbox :disabled="item.inputNum <= 0 ? true : false" v-model="item.selectFlag" @on-change="countNum(item.selectFlag)">{{item.key}}</Checkbox></span>
                            <span>{{item.ability_name}}</span>
                            <span>{{item.unit == 1 ? '单人/天' : '个'}}</span>
                            <span>{{item.unitprice}}</span>
                            <span>{{item.day}}</span>
                            <span><InputNumber :min="0" :max="item.count" :disabled="item.inputNum <= 0 ? true : false" v-model="item.inputNum" style="width: 80px"></InputNumber></span>
                            <span>{{item.finish_date}}</span>
                            <span>￥{{Math.floor(item.subtotal).toFixed(2)}}</span>
                        </li>
                    </ul>
                    <div class="deliverModalFooter">
                        <span>
                            交付资源数量：<em>{{num}}</em>
                        </span>
                                <span>
                            清单总金额：<em>￥{{Math.floor(money).toFixed(2)}}</em>
                        </span>
                    </div>
                </div>
            </div>
            <div slot="footer" style="padding: 0 10px">
                <button class="submitBtn" @click="conrimPay">确认交付</button>
            </div>
        </Modal>
        <Modal v-model="isDeleteFlag" title="删除清单" :footer-hide="true" width="355">
            <div class="deleteModalTips">
                <span>请确认是否删除整个清单信息？</span>
                <p>
                    <button @click="confirmDel">确认删除</button>
                    &nbsp;&nbsp;&nbsp;
                    <button @click="isDeleteFlag = false">再考虑一下</button>
                </p>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {newContractApi} from 'api';
    import Cookies from 'js-cookie';
    import orderList from './orderList';
    import editOrderList from './editOrderList';
    export default {
        name: "three-detail",
        props: {
            // creent: {
            //     type: Object,
            //     default: ()=>({})
            // },
            priceIndex: {
                type: Number
            }
        },
        components: {
            orderList,
            editOrderList
        },
        computed: {
            saveContractData(){
                return this.$store.state.contract.contractData;
            },
            contraceID(){
                return this.$store.state.contract.contractData.ID;
            },
            priceList(){
                return this.$store.state.contract.contractData.price;
            }
        },
        data(){
            return {
                companyType: Cookies.get('company') ? JSON.parse(Cookies.get('company')).type : null,
                showLogFlag: false,
                orderModalFlag: false,
                selectAll: false,
                isEditFlag: false,
                isDeleteFlag: false,
                orderListArr: [],
                num: 0,
                money: 0,

                creentObj: {},
                selectNum: 0
            };
        },
        watch: {
            priceIndex(newIndex){
                this.creentObj = this.priceList[newIndex];
            }
        },
        methods: {
            resorcePay(){
                this.getPricePayList();
                this.orderModalFlag = true;
                this.selectAll = false;
            },
            EditerFun(){
                this.$store.commit('copyPrice');
                this.$nextTick(()=>{
                    this.isEditFlag = true;
                });
            },
            async getPricePayList(){
                let parms = {
                    contract_id: this.contraceID,
                    order: this.creentObj.order
                };
                let {data} = await newContractApi.getPricePayList(parms);
                if (data.err_code == 0){
                    let dataList = data.data;
                    let num = 0;
                    let money = 0;
                    dataList.forEach(function (creent) {
                        creent.selectFlag = false;
                        creent.inputNum = creent.count;
                        num += creent.count;
                        money += creent.subtotal;
                    });
                    this.num = num;
                    this.money = money;
                    this.orderListArr = dataList;
                }
            },
            editerCallback(){
                this.creentObj = this.priceList[this.priceIndex];
                this.isEditFlag = false;
            },
            selectAllfun(flag){
                this.orderListArr.forEach(function (creent) {
                    creent.selectFlag = flag;
                });
            },
            countNum(flag){
                if (flag){
                    this.selectNum ++;
                } else {
                    this.selectAll = false;
                }
            },
            async conrimPay(){
                if (this.selectNum > 0){
                    let payArr = this.orderListArr.filter(function (item) {
                        if (item.selectFlag == true){
                            return item;
                        }
                    });
                    let list = [];
                    payArr.forEach(function (item) {
                        list.push({
                            order: item.order,
                            count: item.inputNum
                        });
                    });

                    let parms = {
                        contract_id: this.saveContractData.ID,
                        order: this.creentObj.order,
                        list: JSON.stringify(list)
                    };
                    let {data} = await newContractApi.orderPay(parms);
                    if (data.err_code == 0){
                        this.$store.dispatch("getContractInfo").then((res)=>{
                            this.$Message.success('资源交付成功！');
                            this.creentObj = this.priceList[this.priceIndex];
                            this.getPricePayList();
                            this.orderModalFlag = false;
                        });
                    }
                } else {
                    this.$Message.warning('请选择资源！');
                }
            },
            confirmDel(){
                this.$store.commit('deleteOrder', this.priceIndex);
                this.$nextTick(()=>{
                    this.$bus.emit('saveContractData');
                    this.$nextTick(() => {
                        this.$store.dispatch("saveContractAction", false).then((res)=>{
                            this.$store.dispatch("getContractInfo").then((res)=>{
                                this.$bus.emit('addList');
                                this.isDeleteFlag = false;
                            });
                        });
                    });
                });
            }
        },
        mounted(){
            this.creentObj = this.priceList[this.priceIndex];
            let _this = this;
            this.$bus.on('colseEdit', function () {
                _this.editerCallback();
            });
        }
    };
</script>
<style lang="less" scoped>
    .threeDetailBox{
        /*padding: 30px;*/
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .oneBox{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .logBtn{
                font-size: 13px;
                display: flex;
                align-items: center;
                color: @black_2;
                &:hover{
                    cursor: pointer;
                    color: @base;
                }
                .icon-fangxiangxia{
                    margin-left: 3px;
                    transition: all .5s;
                    &.rotateSty{
                        transform: rotate(0deg);
                    }
                    &.up{
                        transform: rotate(180deg);
                    }
                    &.down{
                        transform: rotate(0deg);
                    }
                }
            }
            button{
                width: 102px;
                height: 38px;
                line-height: 38px;
                background: #3cd2b4;
                color: #ffffff;
                border-radius: 4px;
                border: none;
                outline: none;
                &:hover{
                    background: @base_dark;
                    cursor: pointer;
                }
            }
        }
        .listBox{
            margin-top: 20px;
            .logBox{
                overflow: hidden;
                transition: all .3s;
                margin-bottom: 20px;
                .logList{
                    border: 1px solid #ececec;
                    .logHead{
                        height: 50px;
                        line-height: 50px;
                        padding: 0 30px;
                        display: flex;
                        justify-content: space-between;
                        background: #fbfbfb;
                        font-size: 13px;
                        color: #888;
                        li{
                            flex: 1;
                        }
                    }
                    .logBody{

                        background: @white;
                        li{
                            height: 50px;
                            line-height: 50px;
                            display: flex;
                            justify-content: space-between;
                            padding: 0 30px;
                            border-top: 1px solid #ececec;
                            span{
                                flex: 1;
                            }
                        }
                    }
                }
            }
            .orderBox{
                border: 1px solid #ececec;
                .orderTop{
                    display: flex;
                    justify-content: space-between;
                    padding: 20px 30px;
                    .orderLeft{
                        span{
                            &:first-child{
                                font-size: 16px;
                                /*font-weight: bold;*/
                            };
                            &:last-child{
                                margin-left: 40px;
                                font-size: 13px;
                            }
                        }
                    }
                    .orderRight{
                        span{
                            font-size: 20px;
                            margin-left: 20px;
                            &:first-child{
                                &:hover{
                                    cursor: pointer;
                                    color: @base;
                                }
                            }
                            &:last-child{
                                &:hover{
                                    cursor: pointer;
                                    color: red;
                                }
                            }
                        }
                    }
                }

            }
        }
    }
    .deliverModal{
        .modalTable{
            border: 1px solid #ececec;
            .deliverModalHead{
                display: flex;
                justify-content: space-between;
                height: 40px;
                line-height: 40px;
                background: #fbfbfb;
                border-bottom: 1px solid #ececec;
                li{
                    flex: 1;
                    text-align: center;
                    font-size: 13px;
                    color: #888;
                }
            }
            .deliverModalBody{
                height: 350px;
                overflow-y: auto;
                li{
                    display: flex;
                    justify-content: space-between;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #ececec;
                    span{
                        flex: 1;
                        text-align: center;
                    }
                }
            }
            .deliverModalFooter{
                background: #fbfbfb;
                border-top: 1px solid #ececec;
                height: 40px;
                line-height: 40px;
                text-align: right;
                padding: 0 20px;
                span{
                    font-size: 14px;
                    color: #bdbdbd;
                    &:first-child{
                        margin-right: 30px;
                    }
                    em{
                        font-style: normal;
                        color: @base;
                        font-size: 16px;
                    }
                }
            }
        }
    }
    .submitBtn{
        width: 102px;
        height: 38px;
        line-height: 38px;
        background: #3cd2b4;
        color: #ffffff;
        border-radius: 4px;
        border: none;
        outline: none;
        &:hover{
            cursor: pointer;
            background: @base_dark;
        }
    }


    .deleteModalTips{
        padding-top: 20px;
        text-align: center;
        span{
            font-size: 15px;
            color: #888;
        }
        p{
            margin-top: 50px;
            button{
                width: 90px;
                height: 35px;
                line-height: 35px;
                background: #3cd2b4;
                color: #ffffff;
                border-radius: 4px;
                border: none;
                outline: none;
                &:hover{
                    cursor: pointer;
                    background: @base_dark;
                }
            }
        }
    }
</style>
