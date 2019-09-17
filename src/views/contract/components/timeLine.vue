<template>
    <div class="timeContent">
        <div class="overflowSty">
            <div class="timeBox">
                <ul :class="{'constractComplete':disableFlag}">
                    <li v-for="(item,index) in progressList">
                        <i class="nodeTag"></i>
                        <div class="stepTag">
                            <div class="stepBody">{{item.name}}</div>
                            <p class="stepTime">{{item.time}}</p>
                        </div>
                    </li>
                </ul>
                <button :disabled="disableFlag" @click="completFlag = true" v-if="progressList && progressList.length > 0 && !disableFlag" class="confirmContractBtn">合同完成</button>
            </div>
        </div>
        <Modal v-model="completFlag" title="合同完成" @on-ok="contractOver" @on-cancel="completFlag = false">
            <p style="padding: 20px 0;font-size: 13px">确认合同完成后，该合同将无法再次操作！</p>
        </Modal>
    </div>
</template>

<script>
    import {newContractApi} from "api";
    export default {
        name: "time-line",
        props: {
            logList: {
                type: Array,
                default: ()=>[]
            }
        },
        computed: {
            progressList() {
                return this.$store.state.contract.contractData.progress;
            },
            ContractInfo(){
                return this.$store.state.contract.contractData;
            },
            disableFlag(){
                return this.$store.state.contract.contractData.disableFlag;
            },
            ID(){
                return this.$store.state.contract.contractData.ID;
            }
        },
        data(){
            return {
                disabledStatus: '999',
                completFlag: false
            };
        },
        methods: {
            contractOver(){
                this.$bus.emit('saveContractData');
                this.$nextTick(()=> {
                    let _this = this;
                    let baseInfo = this.ContractInfo.base;
                    if (!baseInfo.contract_name) {
                        this.$Message.warning('合同名称不能为空！');
                    } else if (!baseInfo.start_time || !baseInfo.end_time) {
                        this.$Message.warning('请选择合同时间！');
                    } else if (!baseInfo.contract_price) {
                        this.$Message.warning('预计总金额不能为空！');
                    } else if (!baseInfo.project_expect_time) {
                        this.$Message.warning('请选择项目预计启动时间！');
                    } else if (!baseInfo.manager) {
                        this.$Message.warning('请选择合同经办人！');
                    } else if (!baseInfo.business_people) {
                        this.$Message.warning('请选择商务对接人！');
                    } else if (baseInfo.customer_id == null) {
                        this.$Message.warning('甲方公司不能为空！');
                    } else {
                        this.$store.dispatch("saveContractAction").then(async()=>{
                            let parms = {contract_id: this.ID};
                            let {data} = await newContractApi.completConstract(parms);
                            if (data.err_code == 0) {
                                this.$store.dispatch("getContractInfo").then(async()=>{
                                    _this.$Message.success('合同完成！');
                                    // _this.disabledStatus = '999';
                                });
                            }
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .timeContent{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        /*overflow-x: hidden;*/
        .overflowSty{
            height: 100%;
            width: 100%;
            overflow-y: auto;
            padding-top: 30px;
            .timeBox{
                width: 50%;
                height: auto;
                position: relative;
                ul{
                    /*border-right: 1px dashed #ccc;*/
                    li{
                        width: 100%;
                        position: relative;
                        height: 90px;
                        .nodeTag{
                            position: absolute;
                            width: 18px;
                            height: 18px;
                            display: inline-block;
                            border-radius: 100%;
                            border: 1px solid @base;
                            background: #fff;
                            &:after{
                                content: '';
                                display: inline-block;
                                width: 45px;
                                border-top: 1px solid @base;
                                position: absolute;
                                top: 8px;
                            }
                        };
                        .stepTag{
                            position: absolute;
                            top: -25px;
                            text-align: center;
                            .stepBody{
                                height: 40px;
                                line-height: 40px;
                                width: 180px;
                                background: @base;
                                color: @white;
                                border-radius: 30px;
                            }
                            .stepTime{
                                margin-top: 2px;
                            }
                        }
                        &:nth-child(2n + 1){
                            border-right: 1px dashed #ccc;
                            .nodeTag{
                                top: -15px;
                                right: -10px;
                                &:after{
                                    right: 16px;
                                }
                            }
                            .stepTag{
                                right: 50px;
                            }
                        }
                        &:nth-child(2n){
                            border-left: 1px dashed #ccc;
                            margin-left: 100% !important;
                            .nodeTag{
                                top: -15px;
                                left: -10px;
                                &:after{
                                    left: 16px;
                                }
                            }
                            .stepTag{
                                left: 50px;
                            }
                        }

                    }
                }
                .constractComplete{
                    li{
                        &:last-child{
                            border: none;
                        }
                    }
                }
                .confirmContractBtn{
                    position: absolute;
                    right: -50px;
                    bottom: -5px;
                    padding: 10px 25px;
                    border-radius: 5px;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    background: @base;
                    color: @white;
                    &:hover{
                        cursor: pointer;
                        background: @base_dark;
                        color: @white;
                    }
                    &:disabled{
                        cursor: not-allowed;
                    }
                }
            }
        }
    }
</style>
