<template>
    <div class="conctractInfoBox">
        <div class="topBox">
            <p class="contractName">祖先项目合同</p>
            <p class="contractPrice">
                <em>￥</em><span>500000.00</span>
            </p>
        </div>
        <div class="centerBox">
            <div>
                <p>合同时间</p>
                <input type="text" value="2019-05-18 ~ 2019-06-18"/>
            </div>
            <div style="margin-top: 20px">
                <p>项目预计启动时间</p>
                <input type="text" value="2019-05-18"/>
            </div>
        </div>
        <div class="bottomBox">
            <div class="left">
                <p>甲方</p>
                <p class="iconfonts">有限公司</p>
                <p class="iconfonts">
                    <span>负责人 :</span>&nbsp;&nbsp;
                    <Select v-model="model1" style="width:100px">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </p>
                <p class="iconfonts">
                    <span>联系电话 :</span>&nbsp;
                    <input type="text" placeholder="请输入手机号码"/>
                </p>
            </div>
            <div class="right">
                <p>乙方</p>
                <p class="iconfonts">有限公司</p>
                <p class="iconfonts">商务 : 张三</p>
                <p class="iconfonts">联系电话 : 13800138000</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "party-a",
        data(){
            return {
                model1: null,
                cityList: []
            };
        }
    };
</script>
<style lang="less">
    .conctractInfoBox{
        .bottomBox{
            .left{
                p{
                    &:nth-child(3){
                        .ivu-select-single .ivu-select-selection{
                            height: 30px;
                        }
                        .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
                            height: 30px;
                            line-height: 30px;
                        }
                    }
                }
            }
        }
    }
</style>
<style lang="less" scoped>
    .conctractInfoBox{
        width: 95%;
        .topBox{
            text-align: center;
            padding: 15px 0;
            .contractName{
                font-size: 19px;
                color: @black_2;
            }
            .contractPrice{
                margin-top: 10px;
                em{
                    font-style: normal;
                    font-size: 13px;
                    color: #888;
                }
                span{
                    color: @base;
                    font-size: 30px;
                    font-weight: lighter;
                }
            }
        }
        .centerBox{
            margin-top: 40px;
            p{
                font-size: 13px;
                color: #ccc;
            }
            input{
                width: 100%;
                border: none;
                border-bottom: 1px solid #ececec;
                outline: none;
                height: 40px;
                box-shadow: none;
                font-size: 16px;
                color: #888;
            }
        }
        .bottomBox{
            display: flex;
            margin-top: 50px;
            .left,.right{
                .iconfonts{
                    font-size: 14px;
                    color: #888;
                }
                p{
                    height: 35px;
                    line-height: 35px;
                    margin-bottom: 5px;
                    &:nth-child(1){
                        font-size: 16px;
                        color: #888;
                        padding-left: 20px;
                    }
                    &:nth-child(2){
                        &:before{
                            content: '\e615';
                            font-size: 18px;
                            margin-right: 5px;
                            color: @black_3;
                        }
                    }
                    &:nth-child(3){
                        &:before{
                            content: '\e602';
                            font-size: 16px;
                            margin-right: 8px;
                            color: @black_3;
                        }
                    }
                    &:nth-child(4){
                        &:before{
                            content: '\e628';
                            font-size: 16px;
                            margin-right: 8px;
                            color: @black_3;
                        }
                    }
                }
            }
            .left{
                width: 50%;
                border-right: 1px dashed #ececec;
                /*padding-right: 50px;*/
                p{
                    &:nth-child(3){
                        display: flex;
                        align-items: center;
                    }
                    &:nth-child(4){
                        input{
                            border: 1px solid #ececec;
                            box-shadow: none;
                            height: 30px;
                            line-height: 30px;
                            border-radius: 4px;
                            padding: 0 5px;
                            color: #888;
                            width: 130px;
                            &:hover{
                                border-color: @base;
                            }
                            &::placeholder{
                                color: #ccc;
                            }
                        }
                    }
                }
            }
            .right{
                width: 50%;
                padding-left: 20px;
            }
        }
    }
</style>
