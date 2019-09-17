<template>
    <div class="contractCost">
        <div class="costTitle">价格清单</div>
        <div class="costContent">
             <ul>
                 <li class="title">
                     <span class="span">资源名称</span>
                     <span class="span">类型</span>
                     <span class="span">完成时间</span>
                     <span class="span">单位</span>
                     <span class="span">单价/元</span>
                     <span class="span">天数</span>
                     <span class="span">资源数量</span>
                     <span class="span">小计/元</span>
                 </li>
                 <li v-for="(item,index) in priceList" :key="index">
                     <span class="span line">{{item.key || '--'}}</span>
                     <span class="span">
                            <Select v-model="item.ability_id" style="width:100px" disabled >
                                <Option  :value="o.id" :key="index" v-for="o in abilityList">{{o.name}}</Option>
                            </Select>
                        </span>
                     <span class="span line">{{item.finish_date | coverTime}}</span>
                     <span class="span line">{{item.unit === 1 ? '单人/天' : '个'}}</span>
                     <span class="span line">￥{{item.unitprice || '0.00'}}</span>
                     <span class="span line">{{item.day ? item.day +'天' : '---'  || '0'}}</span>
                     <span class="span line">{{item.count || '0'}}</span>
                     <span class="span line bigFont">￥{{item.money || '0.00'}}</span>
                 </li>
             </ul>
            <div class="fooder">
                交付资源数量：<em>{{contractFile || '0'}}个</em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                合同总额：<em>￥{{Number(contractTotal).toFixed(2) || '0.00'}}</em>
            </div>
        </div>
        <div class="costTitle">合同付款</div>
        <div class="costContent payContent">
             <ul>
                 <li class="title">
                     <span class="span">付款阶段</span>
                     <span class="span">交付资源数量</span>
                     <span class="span">支付款项</span>
                     <span class="span">支付时间</span>

                 </li>
                 <li v-for="(item,index) in stepList">
                     <span class="span">{{item.key}}</span>
                     <span class="span">
                         <Progress :percent="Math.round((Number(item.num)/contractFile)*100)>101?99.99:Math.round((Number(item.num)/contractFile)*100)" status="active" :stroke-width="6">
                             <span>
                                 <span class="num">{{item.num}}</span>个({{Math.round((Number(item.num)/contractFile)*100)}}%)
                             </span>
                         </Progress>
                     </span >
                     <span class="span">￥{{item.amount}}</span>
                     <span class="span">{{item.end | coverTime}}</span>

                 </li>
             </ul>
        </div>
    </div>
</template>
<script>
    // import api from 'api'
    import {contractApi} from 'api';
    export default {
        data(){
            return {
                ability_id: '',
                abilityList: [],
                priceList: [],
                stepList: Array,
                contractFile: Number,
                contractTotal: Number
            };
        },
        mounted(){
            this.contractAbilityList();
        },
        methods: {
        // 组件数据
            moduleData(data){
                let _this = this;
                let count=0;
                let amount=0;
                let total=0;
                data[0].price_list.forEach(function (creent) {
                    creent.money = creent.unit ==1 ? Number(creent.unitprice)*Number(creent.day)*Number(creent.count) : Number(creent.unitprice)*Number(creent.count);
                    _this.priceList.push({
                        key: creent.key,
                        ability_id: Number(creent.ability_id),
                        finish_date: creent.finish_date,
                        unit: Number(creent.unit),
                        unitprice: Number(creent.unitprice),
                        day: Number(creent.day)||null,
                        count: Number(creent.count),
                        defualtNum: 0,
                        money: creent.money
                    });

                    count+=Number(creent.count);
                    amount+=Number(creent.amount);
                    total+=Number(creent.money);
                });

                this.contractFile=count;
                this.contractTotal=total;

                this.stepList=data[0].step_list;

            },

        /* 获取类型列表 */
            async contractAbilityList(){
                let {data} = await contractApi.contractAbilityList();
                if (data.err_code === 0 && data.data){
                    this.abilityList = data.data;
                }
            },
        },
        filters: {
            coverTime(date){
                if (date){
                    let time = new Date(date * 1000);
                    let yaer = time.getFullYear();
                    let month = (time.getMonth()+1) > 10 ? (time.getMonth()+1) : '0'+(time.getMonth()+1);
                    let day = time.getDate();
                    return yaer+'-'+month+'-'+day;
                } else {
                    return '00:00:00';
                }
            }
        }
    };
</script>

