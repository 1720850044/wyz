<template>
    <div class="contractBase">
        <!-- BaseInfo -->
        <div class="baseInfo">
            <div class="infoTitle">{{baseData.contract_name}}</div>
            <div class="cost"><span>￥</span>{{baseData.contract_price}}</div>
            <div class="list">
                <dl>
                    <!--<dd>-->
                    <!--<span>合同关联项目</span>-->
                    <!--<p class="listP">{{baseData.project_name?baseData.project_name:'暂未关联合同'}}</p>-->
                    <!--</dd>-->
                    <dd>
                        <span>项目时间</span>
                        <p class="listP">{{baseData.start_time|coverTime}} - {{baseData.end_time|coverTime}}</p>
                    </dd>
                    <dd v-if="companyType === 0">
                        <span>项目负责人</span>
                        <p class="listP">{{baseData.manager}}</p>
                    </dd>
                    <dd>
                        <!-- 甲方公司 -->
                        <div class="companyInfo">
                            <p>甲方</p>
                            <p><i class="iconfonts icon-loudong"></i> {{baseData.customer_name}}</p>
                            <p><i class="iconfonts icon-icon21"></i> 负责人：{{baseData.customer_people}}</p>
                            <p><i class="iconfonts icon-lianxifangshi"></i> 联系电话： {{baseData.customer_phone}}</p>
                        </div>
                        <!-- 乙方公司 -->
                        <div class="companyInfo">
                            <p>乙方</p>
                            <p><i class="iconfonts icon-loudong"></i> {{baseData.company_name}}</p>
                            <p><i class="iconfonts icon-icon21"></i> 负责人：{{baseData.manager}}</p>
                            <p><i class="iconfonts icon-lianxifangshi"></i> 联系电话：
                                {{baseData.manage_phone==null?'---':baseData.manage_phone}}</p>
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
        <!-- //BaseInfoEnd -->
        <!-- contractSchedle -->
        <div class="contractSchedle" v-show="contractStatus.length!=0">
            <div class="Flex">
                <div class="schedle">
                    <ul>
                        <li v-for="(item,index) in contractStatus" :key="index">
                            <p class="Pline"></p>
                            <!-- 偶数 -->
                            <div v-if="index%2==0?true:false" class="lineFather">
                                <span :class="[item.action_time==''?'notLine':'']"></span>
                                <em :class="[item.action_time==''?'Sline notSline':'Sline']"></em>
                                <em class="statusInfo">
                                    <button v-if="item.get == 1" class="gathering-button" @click="gatheringFun(item)">
                                        确认收款
                                    </button>
                                    <button v-if="item.pay == 1" class="pay-button" @click="paymentFun(item)">支付
                                    </button>
                                    <em :class="[item.action_time==''?'text blueText':'text']">
                                        {{item.key}}
                                    </em>
                                    <p>{{item.action_time}}</p>
                                </em>
                                <div class="clear"></div>
                            </div>
                            <!-- 奇数 -->
                            <div v-if="index%2!=0?true:false" class="leftSatus">
                                <em class="statusInfo">
                                    <button v-if="item.get == 1" class="gathering-button" @click="gatheringFun(item)">
                                        确认收款
                                    </button>
                                    <button v-if="item.pay == 1" class="pay-button" @click="paymentFun(item)">支付
                                    </button>
                                    <em :class="[item.action_time==''?'text blueText':'text']">
                                        {{item.key}}
                                    </em>
                                    <p>{{item.action_time}}</p>
                                </em>
                                <em :class="[item.action_time==''?'Sline notSline':'Sline']"></em>
                                <span :class="[item.action_time==''?'notLine':'']"></span>
                                <div class="clear"></div>
                            </div>
                        </li>
                        <p class="Pline"></p>
                    </ul>
                </div>
            </div>
        </div>
        <!-- //contractSchedleEnd -->
        <div class="clear"></div>
    </div>
</template>
<script>
    import api from 'api';
    import Cookies from 'js-cookie';
    import {mapGetters, mapState} from 'vuex';

    export default {
        data() {
            return {
                baseData: Array,
                contractStatus: Array,
                Iindex: null,
                companyType: null,
                user_type: JSON.parse(Cookies.get('company')).type,
            };
        },
        props: ['acc_token'],
        computed: {
            ...mapState({
                contractID: state => state.paySkip.contractID,
            })
        },
        mounted() {
            this.getCompanyType();
            // this.getAccToken()
        },
        methods: {
            // 组件数据
            moduleData(data) {
                this.baseData = data;
                this.contractStatus = data.status_list;
                let Iindex = null;
                for (let i = 0; i < this.contractStatus.length; i++) {
                    if (this.contractStatus[i].status == 1) {
                        Iindex = i;
                    }
                }
                this.Iindex = Iindex;
            },
            getCompanyType() {
                if (Cookies.get('company')) {
                    this.companyType = JSON.parse(Cookies.get('company')).type;
                }
            },
            // 合同详情支付
            async paymentFun(item) {
                let params = {
                    "step_id": Number(item.step_id),
                    "contract_id": Number(this.contractID),
                    "acc_token": this.acc_token
                };
                let {data} = await api.demandContractPay(params);
                if (data.err_code == 0){
                    this.updateData();
                }
            },
            // 合同详情确认收款
            async gatheringFun(item) {
                let params = {
                    "step_id": Number(item.step_id),
                    "contract_id": Number(this.contractID),
                    "acc_token": this.acc_token
                };
                let {data} = await api.outsourceContracGathering(params);
                if (data.err_code == 0){
                    this.updateData();
                }
            },
            async updateData() {
                let params = {
                    'contract_id': this.contractID,
                };
                let {data} = await api.contractInfo(params);
                if (data.err_code == 0){
                    this.contractStatus = data.status_list;
                }
            }
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

