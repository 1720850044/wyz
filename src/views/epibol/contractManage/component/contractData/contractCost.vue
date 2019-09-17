<template>
    <div class="newContractData autoHeight">
        <div class="contractCost">
            <h1>价格清单</h1>
            <div class="priceList">
                <ul>
                    <li class="priceTile">
                        <span class="span">资源名称</span>
                        <span class="span">类型</span>
                        <span class="span">完成时间</span>
                        <span class="span">单位</span>
                        <span class="span">单价/元</span>
                        <span class="span">天数</span>
                        <span class="span">资源数量</span>
                        <span class="span">小计/元</span>
                    </li>
                    <li v-if="lineFlag" class="valueList" v-for="(item,index) in priceData" :key="index">
                        <span class="span line">{{item.key || '--'}}</span>
                        <span class="span">
                            <Select v-model="item.ability_id" style="width:100px" disabled>
                                <Option :value="o.id" :key="index" v-for="o in abilityList">{{o.name}}</Option>
                            </Select>
                        </span>
                        <span class="span line">{{item.finish_date || '00:00:00'}}</span>
                        <span class="span line">{{item.unit === 1 ? '单人/天' : '个'}}</span>
                        <span class="span line">￥{{item.unitprice || '0.00'}}</span>
                        <span class="span line">{{item.day ? item.day +'天' : '---'  || '0'}}</span>
                        <span class="span line">{{item.count || '0'}}</span>
                        <span class="span line bigFont">￥{{item.money || '0.00'}}</span>
                    </li>

                    <li v-if="!lineFlag" class="valueList" v-for="(item,index) in priceData" :key="index">
                        <span class="span">
                            <Input v-model="item.key" placeholder="文件类型名称" style="" @on-change="upDate"></Input>
                        </span>
                        <span class="span">
                            <Select v-model="item.ability_id" style="width:100px" placeholder="请选择">
                                <Option :value="o.id" :key="index" v-for="o in abilityList">{{o.name}}</Option>
                            </Select>
                        </span>
                        <span class="span">
                            <DatePicker type="date" :value="item.finish_date" :options="dateTime" placeholder="完成时间"
                                        style="width: 115px" @on-change="finishDate"
                                        @click.native="changeDate(index)"></DatePicker>
                        </span>
                        <span class="span">
                            <Select v-model="item.unit" style="width:100px" @on-change="checkSelect(item,$event)">
                                <Option :value="o.value" :key="o.value" v-for="o in selectUnit">{{o.label}}</Option>
                            </Select>
                        </span>
                        <span class="span">
                            <InputNumber :min="0" v-model="item.unitprice" placeholder="0.00" style="width: 100px"
                                         @on-change="upDate"></InputNumber>
                        </span>
                        <span class="span">
                            <InputNumber :min="0" v-model="item.day" :disabled="item.unit===2" style="width: 100px"
                                         @on-change="item.defualtNum = item.day;upDate "
                                         @on-blur="changeNumber(item,'day')"></InputNumber>
                        </span>
                        <span class="span">
                            <InputNumber :min="0" v-model="item.count" style="width: 100px" @on-change="upDate(item)"
                                         @on-blur="changeNumber(item,'count')"></InputNumber>
                        </span>
                        <span class="span" :title="(item.unitprice*item.count).toFixed(2)">
                            <span class="ellipsis" v-if="item.unit == 1">￥ {{item.money = (item.unitprice *item.count* item.day).toFixed(2)}}</span>
                            <span class="ellipsis"
                                  v-else>￥ {{item.money = (item.unitprice * item.count).toFixed(2)}}</span>
                            <Icon type="trash-a" style="margin-left: 20px" class="deletPrice"
                                  @click.native="deletPrice(index)" @on-change="upDate"></Icon>

                        </span>
                    </li>
                    <li v-if="!lineFlag" class="amountList">
                        <span class="span"><em class="addPrice" @click="addPriceList">
                                <Icon type="ios-plus-outline"></Icon> 增加清单项
                            </em></span>
                        <span class="span">&nbsp;</span>
                        <span class="span">&nbsp;</span>
                        <span class="span">交付资源数量： <em class=""
                                                       style="color: #ff4c4c;font-size: 14px;">{{fileCount}}</em></span>
                        <span class="span">合同总额： <em class="" style="color: #ff4c4c;font-size: 14px;">￥ {{(priceNum).toFixed(2)}}</em></span>
                    </li>
                </ul>
            </div>
            <h1 style="margin-top:30px">合同付款</h1>
            <div class="priceList contractPay">
                <ul>
                    <li class="priceTile">
                        <span class="span">付款阶段</span>
                        <span class="span">交付资源数量</span>
                        <span class="span">支付款项</span>
                        <span class="span">支付时间</span>
                        <!--<div class="clear"></div>-->
                    </li>
                    <div v-if="lineFlag">
                        <li class="valueList" v-for="(item,index) in contractPayDate" :key="index">
                            <span class="span line">{{item.key}}</span>
                            <span class="span line">{{item.num}}</span>
                            <span class="span line bigFont">￥{{item.amount}}</span>
                            <span class="span line bigFont">{{item.end}}</span>
                            <!--<div class="clear"></div>-->
                        </li>
                    </div>

                    <div v-if="!lineFlag">
                        <li class="valueList" v-for="(item,index) in contractPayDate" :key="index">
                            <span class="span">
                                <Input style="width: 50%;min-width: 100px;" v-model="item.key" placeholder="输入付款阶段"
                                       @on-change="upDate"></Input>
                            </span>
                            <span class="span" style="position: relative">
                                <em>({{item.num ? Math.round((item.num / fileCount) * 100) : 0}}%)</em>
                                <InputNumber :min="0" style="width: 50%;min-width: 100px;" v-model="item.num"
                                             placeholder="文件数量" @on-change="upDate"
                                             @on-blur="changeNumber(item,'num')"></InputNumber>
                            </span>
                            <span class="span">
                                <InputNumber :min="0" style="width: 50%;min-width: 100px;" v-model="item.amount"
                                             placeholder="输入该阶段支付合同款" class="payAmount"
                                             @on-change="upDate"></InputNumber>
                            </span>
                            <span class="span">
                               <DatePicker type="date" :value="item.end" placeholder="请选择支付时间" @on-change="payDate"
                                           @click.native="changePayDate(index)"
                                           style="width: 50%;min-width: 100px;"></DatePicker>

                                <Icon style="margin-left: 10px" type="trash-a" class="deletPrice"
                                      @click.native="deletPay(index)" @on-change="upDate"></Icon>

                            </span>
                        </li>
                        <li style="margin-top:10px;">
                            <span class="span"><em class="addPrice" @click="addPay">
                                    <Icon type="ios-plus-outline"></Icon> 增加付款阶段
                                </em></span>
                            <!--<div class="clear"></div>-->
                        </li>

                        <!-- 新版进度条 -->
                        <!--<ul class="costLine" ref="costLine">-->
                        <!--<template v-if="costLineLenght">-->
                        <!--<li v-for="(items,index) in contractPayDate" :key="index" class="costLineNode"  :style="{'left':items.num ? Math.round((items.num / fileCount*costLineLenght) )+'px' : 0+'px'}"  >-->

                        <!--<Icon class="sign"   type="ios-pricetag"></Icon>-->
                        <!--<template v-if="fileEditShow">-->
                        <!--<p>完成文件 <span class="green">{{items.num?items.num:0}}</span> 个({{items.num ? Math.round((items.num / fileCount) * 100) : 0}}%) <Icon type="edit" @click.native="fileEditShow = !fileEditShow" class="icon"></Icon>-->
                        <!--<Icon type="trash-a" @click.native="deletPay(index)" class="icon"></Icon>-->
                        <!--</p>-->
                        <!--<p>{{items.key}}( <span class="green">{{items.amount?items.amount:0}}</span> )</p>-->
                        <!--</template>-->

                        <!--<template v-else>-->
                        <!--<p>完成文件   <InputNumber :max="fileCount" :min="0" :step="1" placeholder="文件数量" @on-change="upDate" v-model="items.num"  style="width:40px;"></InputNumber> 个({{items.num ? Math.round((items.num / fileCount) * 100) : 0}}%) <Icon type="edit" @click.native="fileEditShow = !fileEditShow" class="icon"></Icon> </p>-->
                        <!--<p>首付款(-->
                        <!--<Input v-model="items.amount" placeholder="输入该阶段支付合同款" class="payAmount" @on-change="upDate" style="width:80px;"></Input>)-->
                        <!--</p>-->
                        <!--</template>-->
                        <!--</li>-->
                        <!--</template>-->
                        <!--</ul> -->

                    </div>
                </ul>
            </div>
        </div>
    </div>

</template>
<script>
    // import api from 'api'
    import {contractApi} from 'api';

    export default {
        data() {
            return {
                fileEditShow: true,
                costLineLenght: null,
                dateTime: {
                    disabledDate(date) {
//          return date && date.valueOf() < Date.now() - 86400000
                    }
                },
                priceData: [
                    {
                        key: '',
                        finish_date: null,
                        unit: 1,
                        unitprice: 0,
                        day: 1,
                        count: 1,
                        defualtNum: 0,
                        money: 0,
                        ability_id: 0,
                    }
                ],
                contractPayDate: [
                    {
                        key: '一笔款',
                        num: 0,
                        amount: 0,
                        end: null,

                    }
                ],
                // ------------
                fileCount: 1,
                priceNum: 0,

                contFileConunt: 1,
                // ------------
                amount: 0,
                dateIndex: 0,
                payIndex: 0,
                // -----------
                selectUnit: [
                    {value: 1, label: '单人/天'},
                    {value: 2, label: '个'}
                ],
                abilityList: [],

            };
        },
        computed: {
            lineFlag() {
                return this.$store.state.paySkip.enterContractFlag;
            },
            numeral() {
                let payNum = '';
                switch (this.contractPayDate.length) {
                    case 0:
                        payNum = '一';
                        break;
                    case 1:
                        payNum = '二';
                        break;
                    case 2:
                        payNum = '三';
                        break;
                    case 3:
                        payNum = '四';
                        break;
                    case 4:
                        payNum = '五';
                        break;
                    case 5:
                        payNum = '六';
                        break;
                    case 6:
                        payNum = '七';
                        break;
                    case 7:
                        payNum = '八';
                        break;
                    case 8:
                        payNum = '九';
                        break;
                    case 9:
                        payNum = '十';
                        break;

                    default:
                        payNum = 'N';
                }
                return payNum;
            },
        },
        props: {
            contractCostData: {
                type: Array
            }
        },
        mounted() {
            this.autoHeight();
            this.editContractData();
            // this.priceChange()
            this.contractAbilityList();

//    this.costLineLenght = this.$refs.costLine.offsetWidth
        },
        methods: {

            /* 获取类型列表 */
            async contractAbilityList() {
                let {data} = await contractApi.contractAbilityList();
                if (data.err_code === 0 && data.data) {
                    this.abilityList = data.data;
                    this.priceData[0].ability_id = data.data[0].id;
                }
            },
            //
            checkSelect(item, val) {
                if (val == 2) {
                    item.defualtNum = parseInt(item.day);
                    item.day = null;
                } else {
                    item.day = parseInt(item.defualtNum);
                }
                this.upDate();
            },
            // editContract
            editContractData() {
                // let contractPayDate = [
                //     {
                //         key: '一笔款',
                //         num: 0,
                //         amount: 0,
                //         end: '',
                //     }
                // ];
                // let priceData = [
                //     {
                //         key: '',
                //         finish_date: 0,
                //         unit: 1,
                //         unitprice: 0,
                //         day: 1,
                //         count: 1,
                //         defualtNum: 0,
                //         money: 0,
                //         ability_id: 0,
                //     }
                // ];
                if (this.contractCostData.length > 0) {
                    let _this = this;
                    if (this.contractCostData[0].price_list && this.contractCostData[0].price_list.length > 0) {
                        this.priceData = [];
                        this.contractPayDate = [];
                    }

                    this.contractCostData[0].price_list.forEach(function (creent) {
                        _this.priceData.push({
                            key: creent.key,
                            finish_date: Number(creent.finish_date) > 0 ? new Date(creent.finish_date * 1000) : null,
                            unit: Number(creent.unit),
                            unitprice: Number(creent.unitprice),
                            day: Number(creent.day) || null,
                            count: Number(creent.count),
                            defualtNum: 0,
                            money: creent.unit == 1 ? Number(creent.unitprice) * Number(creent.day) : Number(creent.unitprice) * Number(creent.count),
                            ability_id: Number(creent.ability_id),
                        });
                    });
                    this.contractCostData[0].step_list.forEach(function (creent) {
                        _this.contractPayDate.push({
                            key: creent.key,
                            amount: Number(creent.amount),
                            num: Number(creent.num),
                            end: Number(creent.end) > 0 ? new Date(creent.end * 1000) : null,
                        });
                    });
                }
            },
            updateCost() {
                let constArr = {
                    price_list: [],
                    step_list: []
                };

                constArr.price_list = this.priceData;
                constArr.step_list = this.contractPayDate;
                this.$bus.emit('addContractCost', constArr);
            },

            // autoH
            autoHeight() {
                $('.newContractData .autoHeight').height($(window).height() - 397);
            },
            // GetPriceIndex
            changeDate(index) {
                this.dateIndex = index;
            },
            changePayDate(index) {
                this.payIndex = index;
            },
            payDate(date) {
                this.contractPayDate[this.payIndex].end = date;
            },
            // changeDate
            finishDate(date) {
                this.priceData[this.dateIndex].finish_date = date;
                this.upDate();
            },
            // addPrice
            addPriceList() {
                let obj = {
                    key: '',
                    finish_date: null,
                    unit: 1,
                    unitprice: 0,
                    day: 1,
                    count: 1,
                    defualtNum: 0,
                    money: 0,
                    ability_id: this.abilityList[0].id,
                };
                this.priceData.push(obj);
            },
            // deletePrice
            deletPrice(index) {
                if (this.priceData.length > 1) {
                    this.priceData.splice(index, 1);
                } else {
                    this.priceData.splice(index, 1, {
                        key: '',
                        finish_date: null,
                        unit: 1,
                        unitprice: 0,
                        day: 1,
                        count: 1,
                        defualtNum: 0,
                        money: 0,
                        ability_id: null,
                    });
                }
            },
            // addPay
            addPay() {
                let obj = {
                    key: this.numeral + '笔款',
                    num: 0,
                    amount: 0
                };

                this.contractPayDate.splice(
                    this.contractPayDate.length === 0
                        ? 0
                        : this.contractPayDate.length === 1
                        ? 1
                        : this.contractPayDate.length,
                    0,
                    obj
                );
            },
            // deletePay
            deletPay(index) {
                this.contractPayDate.splice(index, 1);
                if (this.contractPayDate) {
                    let payNum = '';
                    this.contractPayDate.map((item, index) => {
                        switch (index) {
                            case 0:
                                payNum = '一';
                                break;
                            case 1:
                                payNum = '二';
                                break;
                            case 2:
                                payNum = '三';
                                break;
                            case 3:
                                payNum = '四';
                                break;
                            case 4:
                                payNum = '五';
                                break;
                            case 5:
                                payNum = '六';
                                break;
                            case 6:
                                payNum = '七';
                                break;
                            case 7:
                                payNum = '八';
                                break;
                            case 8:
                                payNum = '九';
                                break;
                            case 9:
                                payNum = '十';
                                break;

                            default:
                                payNum = 'N';
                        }
                        item.key = payNum + '笔款';
                    });
                }
            },
            // priceChange
            priceChange() {
                let sum = 0;
                let amsum = 0;
                let csum = 0;
                let camsum = 0;

                for (let i = 0; i < this.priceData.length; i++) {
                    sum += Number(this.priceData[i].count);
                    amsum += Number(this.priceData[i].money);
                }
                this.fileCount = sum;
                this.priceNum = amsum;

                for (let j = 0; j < this.contractPayDate.length; j++) {
                    csum += Number(this.contractPayDate[j].num);
                    camsum += Number(this.contractPayDate[j].amount);
                    if (this.contractPayDate[j].num > sum) {
                        // this.contractPayDate[j].num = 0;
                        this.$Message.error('对不起,文件数大于合同文件数据！');
                    }
                    if (this.contractPayDate[j].amount > amsum) {
                        // this.contractPayDate[j].amount = 0;
                        this.$Message.error('对不起,金额大于合同金额！');
                    }
                    // if (csum > sum) {
                    //     this.$Message.error('对不起,文件数大于合同文件数据！')
                    //     this.$bus.emit('Bdisabled', true)
                    // } else if (camsum > amsum) {
                    //     this.$Message.error('对不起,金额大于合同金额123123！')
                    //     this.$bus.emit('Bdisabled', true)
                    // } else {
                    //     this.$bus.emit('Bdisabled', false)
                    // }
                }

            },
            upDate(item) {

//        item.count = parseInt(item.count)

                this.$emit('changeIsSubmit');
                this.lineLeft();
            },
            lineLeft(percent) {

//    if(index === this.contractPayDate.length-1 ){
//        tailor = -40
//    }else if(index === 0){
//        tailor = 40
//    }
//      return  percent*this.fileCount * this.costLineLenght
            },
            changeNumber(item, type) {
                this.$set(item, type, parseInt(item[type]));
            },

        },

        updated() {
            this.priceChange();
            this.updateCost();
        }
    };
</script>
