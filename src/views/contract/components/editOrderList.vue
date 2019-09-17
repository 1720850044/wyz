<template>
    <div class="addListBox">
        <div class="addTool">
            <Input style="width: 30%" v-model="creent.group_name" placeholder="输入该笔清单名称"></Input>
            <div class="rightTool">
                <button @click="addListFun">
                    <i class="iconfonts icon-jia1"></i>
                    添加清单项
                </button>
            </div>
        </div>
        <div class="tableList">
            <ul class="tableHead">
                <li>资源名称</li>
                <li>类型</li>
                <li>单位</li>
                <li>单价/元</li>
                <li>天数</li>
                <li>资源数量</li>
                <li>完成时间</li>
                <li>小计</li>
            </ul>
            <ul class="tableBody">
                <li class="tableTr" v-for="(item,index) in creent.list">
                    <dl>
                        <dd>
                            <Input v-model="item.key" placeholder="输入资源名称"></Input>
                        </dd>
                        <dd>
                            <Select v-model="item.ability_id" style="width: 100px" :label-in-value="true" @on-change="item.ability_id = $event.value;item.ability_name = $event.label">
                                <Option v-for="item in abilityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </dd>
                        <dd>
                            <Select v-model="item.unit" style="width: 100px">
                                <Option v-for="item in selectUnit" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </dd>
                        <dd>
                            <InputNumber :min="0" v-model="item.unitprice" style="width: 100px" placeholder="输入单价金额"></InputNumber>
                        </dd>
                        <dd>
                            <InputNumber :min="0" v-model="item.unit == 2 ? item.day = 0 :item.day" :disabled="item.unit === 2" style="width: 100px" placeholder="输入天数"></InputNumber>
                        </dd>
                        <dd>
                            <InputNumber :min="0" v-model="item.count" style="width: 100px" placeholder="输入资源数量"></InputNumber>
                        </dd>
                        <dd>
                            <DatePicker type="date" :value="item.finish_date" placeholder="选择完成时间" @on-change="item.finish_date = $event"></DatePicker>
                        </dd>
                        <dd>
                            <span>￥{{(item.subtotal = item.unit == 2 ? item.unitprice * item.count : item.unitprice * item.day * item.count).toFixed(2)}}</span>
                            <i @click="deleteList(index)" class="iconfonts icon-sourceDel"></i>
                        </dd>
                    </dl>
                </li>
            </ul>
            <div class="tableFooter">
                <span>
                    交付资源数量：<em>{{num}}</em>
                </span>
                <span>
                    清单总金额：<em>￥{{money.toFixed(2)}}</em>
                </span>
            </div>
        </div>
        <div class="submitBtn">
            <button @click="submitEdit">提交修改</button>
        </div>
    </div>
</template>

<script>
    import {newContractApi} from 'api';
    export default {
        name: "add-list",
        props: {
            priceIndex: {
                type: Number
            }
        },
        data(){
            return {
                abilityList: [],
                selectUnit: [
                    {value: 1, label: '单人/天'},
                    {value: 2, label: '个'}
                ],
                num: 0,
                money: 0
            };
        },
        computed: {
            saveContractData(){
                return this.$store.state.contract.contractData;
            },
            copyPrice(){
                return this.$store.state.contract.contractData.copyPrice;
            },
            creent(){
                return this.$store.state.contract.contractData.copyPrice[this.priceIndex];
            }
        },
        methods: {
            addListFun(){
                let obj = {
                    key: null,
                    ability_id: null,
                    ability_name: null,
                    unit: null,
                    unitprice: 0,
                    day: 1,
                    count: 1,
                    finish_date: null,
                    subtotal: '0.00'
                };
                this.creent.list.push(obj);
            },
            deleteList(index){
                this.creent.list.splice(index, 1);
            },
            async contractAbilityList() {
                let {data} = await newContractApi.contractAbilityList();
                if (data.err_code == 0) {
                    this.abilityList = data.data;
                }
            },
            submitEdit(){
                let _this = this;
                let submit = false;
                if (this.creent.group_name) {
                    if (this.creent.list.length > 0){
                        this.creent.list.forEach(function (item) {
                            if (!item.key) {
                                submit = false;
                                _this.$Message.warning('请填写资源名称！');
                            } else if (!item.ability_id) {
                                submit = false;
                                _this.$Message.warning('请选择类型！');
                            } else if (!item.unit) {
                                submit = false;
                                _this.$Message.warning('请选择单位！');
                            } else if (!item.finish_date) {
                                submit = false;
                                _this.$Message.warning('请选择完成时间！');
                            } else {
                                submit = true;
                            }
                        });

                        if (submit) {
                            this.$store.commit('updataPrice', this.copyPrice);
                            this.$nextTick(()=>{
                                this.$bus.emit('saveContractData');
                                this.$nextTick(() => {
                                    this.$store.dispatch("saveContractAction", true).then((res)=>{
                                        this.$store.dispatch("getContractInfo").then((res)=>{
                                            this.$store.commit('setMenuChildActice', this.priceIndex);
                                            this.$emit('sendOK');
                                        });
                                    });
                                });
                            });
                        }
                    } else {
                        this.$Message.warning('清单列表不能为空！');
                        this.addListFun();
                    }

                } else {
                    this.$Message.warning('清单名称不能为空！');
                }
            }
        },
        mounted(){
            this.contractAbilityList();
        },
        updated() {
            // let num = 0;
            // let money = 0;
            // this.creent.list.forEach(function (creent) {
            //     num += creent.count;
            //     money += creent.subtotal;
            // });
            // this.num = num;
            // this.money = money;
            // this.$store.commit('setEditFlag', true);
        },
    };
</script>

<style lang="less" scoped>
    .addListBox{
        height: 100%;
        overflow: hidden;
        .addTool{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .rightTool{
                display: flex;
                align-items: center;
                span{
                    color: @base;
                    font-size: 14px;
                    margin-right: 25px;
                    &:hover{
                        color: @base_dark;
                        cursor: pointer;
                    }
                }
                button{
                    height: 38px;
                    line-height: 38px;
                    width: 100px;
                    background: @base;
                    border: 0;
                    border-radius: 3px;
                    color: @white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    outline: none;
                    &:hover{
                        cursor: pointer;
                        background: @base_dark;
                    }
                    .icon-jia1{
                        margin-right: 5px;
                        font-size: 14px;
                    }
                }
            }
        }
        .tableList{
            margin-top: 20px;
            border: 1px solid #ececec;
            .tableHead{
                height: 50px;
                line-height: 50px;
                display: flex;
                justify-content: space-between;
                background: #fbfbfb;
                padding: 0 30px;
                li{
                    flex: 1;
                    text-align: center;
                    font-size: 13px;
                    color: #888;
                }
            }
            .tableBody{
                max-height: 470px;
                overflow: auto;
                .tableTr{
                    border-top: 1px solid #ececec;
                    padding: 20px 30px;
                    dl{
                        display: flex;
                        dd{
                            flex: 1;
                            text-align: center;
                            &:last-child{
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                span{
                                    font-size: 13px;
                                }
                                .icon-sourceDel{
                                    font-size: 13px;
                                    margin-left: 15px;
                                    color: #b9b9b9;
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
            .tableFooter{
                background: #fbfbfb;
                border-top: 1px solid #ececec;
                height: 50px;
                line-height: 50px;
                text-align: right;
                padding: 0 30px;
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
        .submitBtn{
            margin-top: 30px;
            text-align: right;
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
    }
</style>
