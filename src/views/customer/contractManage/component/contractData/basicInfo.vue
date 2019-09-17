<template>
    <div class="newContractData autoHeight">
        <!-- basicInfo -->
        <div class="basicInfo">
            <ul>
                <template v-if="myProject">
                    <!--<li>合同关联项目</li>-->
                    <!--<li class="line">-->
                        <!--{{myProject}}-->
                    <!--</li>-->
                </template>
                <li>合同名称</li>
                <li class="line">
                    {{contractName}}
                </li>
                <li>合同时间</li>
                <li class="line">
                    {{contractTime[0]}}~{{contractTime[1]}}
                </li>
                <li>
                    <span class="span">经办人</span><span class="span">联系方式</span>
                    <div class="clear"></div>
                </li>
                <li class="line">
                        <span class="span">
                              {{oneAccess}}
                        </span>
                    <span class="span">
                         {{contact}}
                        </span>
                    <div class="clear"></div>
                </li>
                <li>乙方公司名称</li>
                <li class="line">
                    {{companyA}}
                </li>
                <li>
                    <span class="span">负责人</span><span class="span">联系方式</span>
                    <div class="clear"></div>
                </li>
                <li class="line">
                        <span class="span">
                        {{agentUserName}}
                        </span>
                    <span class="span">
                            {{agentUser}}
                        </span>
                    <div class="clear"></div>
                </li>
            </ul>
        </div>
        <!-- contractSchedle -->
        <div v-if="stepShow" class="contractSchedle">
            <div class="Flex">
                <h1>合同进度</h1>
                <div class="schedle">
                    <ul>
                        <li v-for="(item,index) in contractStatus" :key="index">
                            <div>
                                <span :class="[item.status==1?'state':'']" :title="item.key">{{item.key}}</span>
                                <em class="statusInfo">
                                    <em class="Constate">{{item.status == 1 ? '已完成' : ''}}</em><br/>
                                    <em>{{item.action_time}}</em>
                                </em>
                                <div class="clear"></div>
                            </div>
                            <p>
                                <em v-if="index==Iindex&&contractStatus.length!=index+1">实施中</em>
                            </p>

                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="clear"></div>
    </div>
</template>
<script>
    export default {
        props: {
            stepShow: {

                type: Boolean
            }
        },
        data() {
            return {
                myProject: '', //关联合同项目
                contractName: '', //合同名称
                contractStartTime: '', //合同开始时间
                contractEndTime: '', //合同结束时间
                agentUser: '', //商务代表
                projectUser: '', //项目负责人
                companyA: '', //甲方公司
                companyAID: '', //甲方公司ID
                oneAccess: '', //对接人
                contact: '', //联系方式
                contractTime: [],
                contractStatus: [],
                Iindex: null,
                agentUserName: '',
                projectUserName: '',
            };
        },
        mounted() {
            this.autoHeight();
        },
        methods: {
            // autoH
            autoHeight() {
                $(".newContractData .autoHeight").height($(window).height() - 270);
                $(".contractSchedle").height($(window).height() - 310);
            },
            // contractInfo
            editContract(data) {

                this.myProject = data.project_name;
                this.contractName = data.contract_name;
                this.companyA = data.customer_name;
                this.companyAID = data.customer_id;
                this.oneAccess = data.customer_people;
                this.contact = data.customer_phone;
                this.agentUser = data.business_people_phone;
                this.agentUserName = data.business_people;
                this.projectUser = data.manager_id;
                this.projectUserName = data.manager;
                this.contractStartTime = data.start_time;
                this.contractEndTime = data.end_time;
                this.contractTime[0] = data.start_time;
                this.contractTime[1] = data.end_time;
                this.contractStatus = data.status_list;

                let Iindex = null;
                for (let i = 0; i < this.contractStatus.length; i++) {
                    if (this.contractStatus[i].status == 1) {
                        Iindex = i;
                    }
                }
                this.Iindex = Iindex;
            },
        }
    };
</script>

<style scoped>

</style>
