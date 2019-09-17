<template>
    <div>
        <ul class="orderHead">
            <li>资源名称</li>
            <li>类型</li>
            <li>单位</li>
            <li>单价/元</li>
            <li>天数</li>
            <li>资源数量</li>
            <li>完成时间</li>
            <li>小计</li>
        </ul>
        <ul class="orderBody">
            <li v-for="item in list">
                <span>{{item.key}}</span>
                <span>{{item.ability_name}}</span>
                <span>{{item.unit == 1 ? '单人/天' : '个'}}</span>
                <span>{{item.unitprice}}</span>
                <span>{{item.day > 0 ? item.day : '--'}}</span>
                <span>{{item.count}}</span>
                <span>{{item.finish_date}}</span>
                <span>￥{{Math.floor(item.subtotal).toFixed(2)}}</span>
            </li>
        </ul>
        <div class="orderFooter">
            <span>
                交付资源数量：<em>{{num}}</em>
            </span>
            <span>
                清单总金额：<em>￥{{money.toFixed(2)}}</em>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "order-list",
        props: {
            list: {
                type: Array,
                default: ()=>[]
            }
        },
        data(){
            return {
                num: 0,
                money: 0
            };
        },
        methods: {
            countNumber(list){
                let num = 0;
                let money = 0;
                list.forEach(function (creent) {
                    num += parseInt(creent.count);
                    money += Math.floor(creent.subtotal);
                });
                this.num = num;
                this.money = money;
            }
        },
        watch: {
            list(val){
                this.countNumber(val);
            }
        },
        mounted(){
            this.countNumber(this.list);
        }
    };
</script>

<style lang="less" scoped>
    .orderHead{
        height: 50px;
        line-height: 50px;
        padding: 0 30px;
        display: flex;
        justify-content: space-between;
        background: #fbfbfb;
        font-size: 13px;
        color: #888;
        border-top: 1px solid #ececec;
        li{
            flex: 1;
            text-align: center;
        }
    }
    .orderBody{
        li{
            height: 50px;
            line-height: 50px;
            padding: 0 30px;
            display: flex;
            justify-content: space-between;
            background: @white;
            font-size: 13px;
            color: #888;
            border-top: 1px solid #ececec;
            span{
                text-align: center;
                flex: 1;
            }
        }
    }
    .orderFooter{
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
</style>
