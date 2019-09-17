<template>
    <div>
        <ul class="com-worobench-tab-box">
            <li v-for="(item,index) in tabList" :key="index" class="com-worobench-tab"
                :class="{active:tabIndex === index}" @click="changeTab(item,index)">
                <div class="worobench-tab-left">
                    <div class="text"><span class="title" :class="{'activeTitle':tabIndex === index}">{{item.name}}</span>
                        <Tooltip :content="item.tipName" placement="top-start">
                            <Icon type="help-circled"></Icon>
                        </Tooltip>
                    </div>
                    <div class="rateNumber" :class="{activeColor:tabIndex === index}">{{item.percent}}</div>
                </div>

                <div class="worobench-tab-right" :class="{'margin-top':item.detailsInfo.length <= 2 ? true:false}">
                    <div class="worobench-text" v-for="(info,idx) in item.detailsInfo">
                        <span>{{info.name}}</span>
                        <span>{{item[info.type]}}</span>
                    </div>

                </div>
            </li>
        </ul>
        <div class="table-box">
            <!--<div v-if="tabIndex == 0">-->
            <!--<free></free>-->
            <!--</div>-->
            <!--<div v-if="tabIndex == 1">-->
            <!--<saturated></saturated>-->
            <!--</div>-->
            <!--<div v-if="tabIndex == 2">-->
            <!--<client></client>-->
            <!--</div> -->
            <div v-if="tabIndex == 0">
                <p class="tableTitle">{{$t('workbench.work_incomeIncrease')}}</p>
                <free apiUrl="workbench_statistics_client_add_table"></free>
            </div>
            <div v-if="tabIndex == 1">
                <p class="tableTitle">{{$t('workbench.work_costIncrease')}}</p>
                <free apiUrl="workbench_statistics_client_add_table"></free>
            </div>
            <div v-if="tabIndex == 2">
                <p class="tableTitle">{{$t('workbench.work_profitIncrease')}}</p>
                <free apiUrl="workbench_statistics_client_add_table"></free>
            </div>
        </div>
    </div>
</template>

<script>
    /** 财务概述 */
    import free from "./free.vue";
    import client from "./client.vue";
    import saturated from "./saturated.vue";
    import {onlyAPI} from "../../../axios/apiConfig"
    import api from 'api'

    export default {
        created() {

        },
        mounted() {
            this.init()
        },
        data() {
            return {
                tabList: [
                    {
                        name: i18n.t('workbench.work_incomeIncrease'),
                        tipName: i18n.t('workbench.work_halfStoppingRate'),
                        detailsInfo: [
                            {name: i18n.t('workbench.work_lastWeekOfficialReceipts'), type: 'bid'},
                            {name: i18n.t('workbench.work_thisWeekOfficialReceipts'), type: 'bid'},
                        ]
                    }, {
                        name: i18n.t('workbench.work_costIncrease'),
                        tipName: i18n.t('workbench.work_saturationFactor'),
                        detailsInfo: [
                            {name: i18n.t('workbench.work_lastWeekCost'), type: 'bid'},
                            {name: i18n.t('workbench.work_anticipatedThisWeekCost'), type: 'bid'},]

                    }, {
                        name: i18n.t('workbench.work_profitIncrease'),
                        tipName: i18n.t('workbench.work_customerGrowth'),
                        detailsInfo: [
                            {name: i18n.t('workbench.work_lastWeekProfit'), type: 'bid'},
                            {name: i18n.t('workbench.work_anticipatedThisWeekProfit'), type: 'all_bid'},
                        ]

                    },
                ],
                tabIndex: 0,
            }
        },
        methods: {
            async init() {
                await api.workbenchStatisticsIndex();
                this.getStopContinuousRate('workbenchStatisticsClientAddTable',0);
                this.getStopContinuousRate('workbenchStatisticsClientAddTable',1);
                this.getStopContinuousRate('workbenchStatisticsClientAddTable',2);
            },
            async getStopContinuousRate(url,index) {
                let {data} = await api[url]();
                if (data) {
                    this.$set(this.tabList, index, {...this.tabList[index], ...data.data});
                }
            },
            changeTab(item, index) {
                this.tabIndex = index
            }
        },
        computed: {},
        components: {
            free,
            client,
            saturated
        }
    }
</script>

<style lang="less" scoped>
    .com-worobench-tab-box {
        display: flex;
        height: 130px;
        .com-worobench-tab:nth-of-type(3) {
            margin-right: 0;
        }
        .active {
            border: 1px solid @base;
            border-bottom: 10px solid @base;
        }
    }
    .table-box{
        padding: 20px 0 30px 0;
        margin-top: 20px;
        background: @white;
        .tableTitle{
            margin:0 0 0 30px;
            font-size: 18px;
            font-weight: 600;
        }
    }
</style>
