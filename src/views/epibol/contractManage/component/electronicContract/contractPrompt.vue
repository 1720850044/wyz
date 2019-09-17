<template>
    <div class="contractPromptContainer">
        <section class="promptHead">
            <Icon type="android-volume-up" class="icon" style=""></Icon>
            <span>合同小助手</span>
        </section>
        <ul class="validation">
            <li v-for="(item,index) in waitingCompany" :key="index">
                <p v-if="index===0" class="sign">引导签约</p> 等待{{item}}{{waitingText}}
            </li>
        </ul>
        <section class="promptBody">
            <p class="title"><i class="icon">!</i>为了保障电子合同顺利签署，双方需完善/认证以下资料。</p>
            <p class="name">{{currentCompanyName}}</p>
            <ul class="attestationList">
                <li><span>完成公司认证</span>
                    <Icon :class="{'green':currentConpanyList.is_confirm}" type="checkmark-circled"></Icon>
                </li>
                <li>完善公司电子签名资料
                    <Icon :class="{'green':currentConpanyList.is_sign}" type="checkmark-circled"></Icon>
                </li>
                <li>指定公司“签章人”
                    <Icon :class="{'green':currentConpanyList.is_signer}" type="checkmark-circled"></Icon>
                </li>
                <!--<li v-if="currentConpanyShow">完成合同经办人1-->
                <!--<Icon :class="{'green':currentConpanyList[3]}" type="checkmark-circled"></Icon>-->
                <!--</li>-->
                <!--<li v-if="currentConpanyShow">完成合同经办人1-->
                <!--<Icon :class="{'green':currentConpanyList[4]}" type="checkmark-circled"></Icon>-->
                <!--</li>-->
            </ul>
        </section>
        <section v-if="currentConpanyShow" class="promptBody">
            <p class="name">{{otherCompanyName}}</p>
            <ul class="attestationList">
                <li><span>完成公司认证</span>
                    <Icon :class="{'green':otherConpanyList.is_confirm}" type="checkmark-circled"></Icon>
                </li>
                <li>完善公司电子签名资料
                    <Icon :class="{'green':otherConpanyList.is_sign}" type="checkmark-circled"></Icon>
                </li>
                <li>指定公司“签章人”
                    <Icon :class="{'green':otherConpanyList.is_signer}" type="checkmark-circled"></Icon>
                </li>
                <!--<li v-if="otherConpanyShow">完成合同经办人1-->
                <!--<Icon :class="{'green':otherConpanyList[3]}" type="checkmark-circled"></Icon>-->
                <!--</li>-->
                <!--<li v-if="otherConpanyShow">完成合同经办人1-->
                <!--<Icon :class="{'green':otherConpanyList[4]}" type="checkmark-circled"></Icon>-->
                <!--</li>-->
            </ul>
        </section>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import api from 'api';
    import {mapState, mapMutations} from 'vuex';

    export default {
        created() {

        },

        mounted() {
            this.$bus.on('initPrompt', () => {
                this.initPrompt();
            });
            this.changePrompt(this.nameKey);

//            this.initPrompt()
        },
        props: {
            nameKey: {  // 引导
                type: Number,
                default: 0,
            }
        },
        data() {
            return {
                waitingCompany: [],
                waitingText: '',
                companyType: null,
                currentCompanyName: '',
                otherCompanyName: '',
                currentConpanyShow: true,
                otherConpanyShow: true,
                currentConpanyList: {},
                otherConpanyList: {},
            };
        },
        methods: {
            ...mapMutations(['setPromptInfo']),
            changePrompt(nameKey) {
                // console.log(666, nameKey);
                if (Cookies.get('company')) {
                    this.companyType = JSON.parse(Cookies.get('company')).type;
                    // 0 乙 1 甲
                    if (nameKey !== 0) {
                        this.currentConpanyShow = true;
                        this.otherConpanyShow = true;
                    } else if (this.companyType === 1) {
                        this.currentConpanyShow = false;
                    } else if (this.companyType === 0) {

                        this.otherConpanyShow = false;
                    }

                }
            },
            // 获取通知列表信息
            async initPrompt(type) {
                // console.log(777, type);
                let obj = null;
                if (!type) {
                    obj = {contract_id: this.contractId};
                }
                let {data} = await api.getValid(obj);
                if (data.err_code === 0) {
                    this.setPromptInfo(data);
                    if (type) {
                        // 没有对方公司信息的情况 is_over !== 1
                        this.currentCompanyName = data.name;
                        this.currentConpanyList.is_confirm = data.is_confirm;
                        this.currentConpanyList.is_sign = data.is_sign;
                        this.currentConpanyList.is_signer = data.is_signer;

                        this.currentConpanyShow = false;
                    } else {
                        // 有对方公司信息的情况
                        this.waitingCompany = data.notice;
                        this.waitingText = data.status === 0 ? '确认合同' : '完成合同签章';
                        if (this.companyType === 1) {
                            // 甲
                            this.currentCompanyName = data.confirm[1].name;
                            this.otherCompanyName = data.confirm[0].name;
                            this.currentConpanyList = data.confirm[1];
                            this.otherConpanyList = data.confirm[0];
                        } else {
                            // 乙
                            this.currentCompanyName = data.confirm[0].name;
                            this.otherCompanyName = data.confirm[1].name;
                            this.currentConpanyList = data.confirm[0];
                            this.otherConpanyList = data.confirm[1];
                        }
                        //传到签章页面用于提示

                        this.currentConpanyShow = true;
                    }

                }

            }
        },
        computed: {
            ...mapState({
                contractId(value) {
                    return value.paySkip.contractID;
                }
            })
        },
        components: {}
    };
</script>

<style lang="less" scoped>
    .contractPromptContainer {
        @gold: @orange;
        border: 1px solid @gold;
        border-radius: 4px;
        background: #fefaf2;
        .promptHead {
            height: 50px;
            padding: 0 25px;
            line-height: 50px;
            font-size: 14px;
            border-bottom: 1px solid #fddf9e;
            .icon {
                font-size: 20px;
                color: @gold;
                vertical-align: middle;
            }
            span {
                margin-left: 8px;
                font-size: 14px;
                vertical-align: middle;
            }

        }
        .validation {
            line-height: 50px;
            padding: 0 25px;
            color: #bdbdbd;
            li {
                display: flex;
                align-items: center;
                .sign {
                    height: 22px;
                    padding: 2px 4px;
                    margin-right: 17px;
                    text-align: center;
                    line-height: 16px;
                    color: #ffb31d;
                    background: #fef3de;
                    border: 1px solid @orange;
                    border-radius: 4px;
                }
            }
        }
        .promptBody {
            /*padding: 0 25px;*/
            .title {
                min-width: 370px;
                height: 30px;
                padding: 0 25px;
                line-height: 30px;
                font-size: 12px;
                color: @gold;
                background: #fef3de;
                .icon {
                    display: inline-block;
                    width: 13px;
                    height: 13px;
                    border: 1px solid @gold;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 13px;
                    /*background: red;*/
                }
            }
            .name {
                padding: 0 25px;
                margin: 20px 0;
                font-size: 14px;
                color: #777777;
            }
            .attestationList {
                padding: 0 25px;
                color: #bdbdbd;
                font-size: 13px;
                li {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    .green {
                        color: #3bceb6;
                    }
                    i {
                        font-size: 16px;
                    }
                }
            }

        }
    }
</style>
