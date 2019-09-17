<template>
    <div class="logBox">
        <p class="activeTime">
            <span>操作日期：</span>
            <span>{{logList.time}}</span>
            <span style="margin-left: 10px">
                <em class="iconfonts icon-jingao" style="font-size: 13px"></em>
                <span class="Tips"> 括号内部分为修改前数据，红色部分为新增数据</span>
            </span>
        </p>
        <div class="logBoxTable">
            <ul class="deliverModalHead">
                <li>资源名称</li>
                <li>类型</li>
                <li>单位</li>
                <li>单价/元</li>
                <li>天数</li>
                <li>资源数量</li>
                <li>完成时间</li>
                <li>小计</li>
            </ul>
            <ul class="deliverModalBody" v-if="logList.list && logList.list.length > 0">
                <li v-for="item in logList.list" :class="{'redSty':item.type == 'add'}">
                    <span>{{item.key}}</span>
                    <span>{{item.ability_name}}</span>
                    <span>{{item.unit == 1 ? '单人/天' : '个'}}</span>
                    <span>{{item.unitprice}}</span>
                    <span>{{item.day}}</span>
                    <span>{{item.count}}</span>
                    <span>{{item.finish_date}}</span>
                    <span>￥{{item.subtotal}}</span>
                </li>
            </ul>
            <template v-else>
                <div style="position: relative;height: 350px">
                    <nothink type="project" text="暂无数据"></nothink>
                </div>
            </template>
            <div class="deliverModalFooter">
                <span>
                    交付资源数量：<em>{{logList.num}}</em>
                </span>
                    <span>
                    清单总金额：<em>￥{{logList.moeny > 0 ? logList.moeny.toFixed(2) : '0.00'}}</em>
                </span>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "log-table",
        props: {
            logList: {
                type: Object,
                default: ()=>({})
            }
        }
    };
</script>

<style lang="less" scoped>
    .logBox{
        .activeTime{
            margin-bottom: 10px;
            .icon-jingao{
                cursor: pointer;
                &:hover +.Tips{
                    display: inline-block;
                }
            }
            .Tips{
                display: none;
            }
        }
        .logBoxTable{
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
                    &.redSty{
                        color: red;
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
</style>
