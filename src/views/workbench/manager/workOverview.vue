<template>
    <div>
        <!--卡片-->
        <ul class="com-worobench-tab-box">
            <li v-for="(item,index) in tabList" :key="index" class="com-worobench-tab"
                :class="{active:tabIndex === index}" @click="changeTab(item,index)">
                <div class="worobench-tab-left">
                    <div class="text"><span class="title" :class="{'activeTitle':tabIndex === index}">{{item.name}}</span>
                        <Tooltip :content="item.tipName" placement="top-start">
                            <Icon type="help-circled"></Icon>
                        </Tooltip>
                    </div>
                    <div class="rateNumber" :class="{activeColor:tabIndex === index}">{{item.percent}}%</div>
                </div>

                <div class="worobench-tab-right" :class="{'margin-top':item.detailsInfo.length <= 2 ? true:false}">
                    <div class="worobench-text" v-for="(info,idx) in item.detailsInfo">
                        <span>{{info.name}}</span>
                        <span>{{item[info.type]}}</span>
                    </div>

                </div>
            </li>
        </ul>
        <!--表格-->
        <div class="table-box" v-if="initComponent">
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
                <p class="tableTitle">{{$t('workbench.work_halfStoppingRate')}}</p>
                <free  :position = "true" :department = "true" apiUrl="workbench_statistics_short_period" key="1"></free>
            </div>
            <div v-if="tabIndex == 1">
                <p class="tableTitle">{{$t('workbench.work_saturationFactor')}}</p>
                <free apiUrl="workbench_work_member_saturated"></free>
            </div>
            <div v-else-if="tabIndex == 2">
                <p class="tableTitle">{{$t('workbench.work_customerGrowth')}}</p>
                <free apiUrl="workbench_statistics_client_add" key="2"></free>
            </div>

        </div>
    </div>
</template>

<script>
    /** 工作概述 */
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
                initComponent:false,
                tabList: [
                    {
                        name: i18n.t('workbench.work_halfStoppingRate'),
                        tipName: i18n.t('workbench.work_halfStoppingRate'),
                        detailsInfo: [
                            {name: i18n.t('workbench.work_halfStopping'), type: 'today'},
                            {name: i18n.t('workbench.work_nextHalfStoppingNum'), type: 'this_week'},
                            {name: i18n.t('workbench.work_halfStoppingNum'), type: 'next_week'},
                        ]
                    },
                    {
                        name: i18n.t('workbench.work_saturationFactor'),
                        tipName: i18n.t('workbench.work_saturationFactor'),
                        detailsInfo: [
                            {name: i18n.t('workbench.work_remainingItems'), type: 'today_num'},
                            {name: i18n.t('workbench.work_sevenDaysRemainingItems'), type: 'next_num'},]

                    },
                    {
                        name: i18n.t('workbench.work_customerGrowth'),
                        tipName: i18n.t('workbench.work_customerGrowth'),
                        detailsInfo: [
                            {name: i18n.t('workbench.work_thisWeekTestPass'), type: 'bid'},
                            {name: i18n.t('workbench.work_thisWeekNewAddTast'), type: 'all_bid'},
                            {name: i18n.t('workbench.work_thisWeekNewAddProject'), type: 'project'},
                        ]

                    },
                ],
                tabIndex: 0,
            }
        },
        methods: {
            async init() {
                // 初始化接口
                await api.workbenchStatisticsIndex();
                this.getStopContinuousRate();
            },
            // 获取卡片信息
            async getStopContinuousRate() {
                let {data} = await api.workbenchStatisticsTag();
                if (data && data.data) {
                    this.initComponent = true;
                    // this.tabList = [[],data.data.add_child]
                    this.tabList[0] = {...this.tabList[0],...data.data.short_period}
                    this.$set(this.tabList,1,{...this.tabList[1],...data.data.saturated})
                    this.$set(this.tabList,2,{...this.tabList[2],...data.data.add_child})
                }
            },
            // 点击卡片切换表格
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
