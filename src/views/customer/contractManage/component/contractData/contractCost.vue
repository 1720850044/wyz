<template>
    <div class="newContractData autoHeight">
        <div class="contractCost">
            <h1>价格清单</h1>
            <div class="priceList">
                <ul>
                    <li class="priceTile">
                        <span class="span">资源名称</span>
                        <span class="span">完成时间</span>
                        <span class="span">单位</span>
                        <span class="span">单价/元</span>
                        <span class="span">天数</span>
                        <span class="span">资源数量</span>
                        <span class="span">小计/元</span>
                    </li>
                    <li class="valueList" v-for="(item,index) in priceData" :key="index">
                        <span class="span line">{{item.key || '--'}}</span>
                        <span class="span line">{{item.finish_date || '00:00:00'}}</span>
                        <span class="span line">{{item.unit === 1 ? '单人/天' : '个'}}</span>
                        <span class="span line">￥{{item.unitprice || '0.00'}}</span>
                        <span class="span line">{{item.day ? item.day +'天' : '---'  || '0'}}</span>
                        <span class="span line">{{item.count || '0'}}</span>
                        <span class="span line bigFont">￥{{item.money || '0.00'}}</span>
                    </li>
                </ul>
                <div style="text-align: right">
                    <span class="span">交付资源数量： <em class="bigFont" style="color: #ff4c4c;" >{{fileCount}}</em></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span class="span">合同总额： <em class="bigFont ellipsis" style="color: #ff4c4c;" >￥ {{(priceNum).toFixed(2)}}</em></span>
                </div>
            </div>
            <h1 style="margin-top:30px">合同付款</h1>
            <div class="priceList contractPay">
                <ul>
                    <li class="priceTile">
                        <span class="span">付款阶段</span>
                        <span class="span">交付资源数量</span>
                        <span class="span">支付款项</span>
                        <div class="clear"></div>
                    </li>
                    <div>
                        <li  class="valueList" v-for="(item,index) in contractPayDate" :key="index">
                            <span class="span line">{{item.key}}</span>
                            <span class="span line">{{item.num}}</span>
                            <span class="span line bigFont">￥{{item.amount}}</span>
                            <div class="clear"></div>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            priceData: [],
            contractPayDate: [],
            fileCount: 1,
            priceNum: 0,
        };
    },
    props: {
        contractCostData: {
            type: Array
        }
    },
    mounted(){
        this.autoHeight();
        this.editContractData();
    },
    methods: {
        // autoH
        autoHeight(){
            $(".newContractData .autoHeight").height($(window).height()-230);
            $(".contractSchedle").height($(window).height()-280);
        },
        // editContract
        editContractData(){
            let _this = this;
            if (this.contractCostData.length>0){
                let price_list = this.contractCostData[0].price_list;
                price_list.forEach(function (creent) {
                    _this.priceData.push({
                        key: creent.key,
                        finish_date: creent.finish_date,
                        unit: Number(creent.unit),
                        unitprice: Number(creent.unitprice),
                        day: Number(creent.day)||null,
                        count: Number(creent.count),
                        defualtNum: 0,
                        money: creent.unit ==1 ? Number(creent.unitprice)*Number(creent.day) : Number(creent.unitprice)*Number(creent.count)
                    });
                });
                this.contractPayDate=this.contractCostData[0].step_list;
            }
        },
        // priceChange
        priceChange(){
            let sum=0;
            let amsum=0;
            let jsum=0;
            let jamsum=0;
            for (let i=0;i<this.priceData.length;i++){
                if (this.priceData.length==1){
                    sum=Number(this.priceData[i].count);
                    amsum=Number(this.priceData[i].unitprice)*sum;
                } else {
                    sum+=Number(this.priceData[i].count);
                    amsum+=Number(this.priceData[i].unitprice)*this.priceData[i].count;
                }

            }
            this.fileCount=sum;
            this.priceNum=amsum;
        }
    },
    updated(){
        this.priceChange();
    }

};
</script>
<style>

</style>
