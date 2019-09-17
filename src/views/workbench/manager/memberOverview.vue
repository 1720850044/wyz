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
                    <div class="rateNumber" :class="{activeColor:tabIndex === index}">{{item.percent > 0 ? '+'+item.percent : item.percent}}%</div>
                </div>

                <div class="worobench-tab-right" :class="{'margin-top':item.detailsInfo.length <= 2 ? true:false}">
                    <div class="worobench-text" v-for="(info,idx) in item.detailsInfo">
                        <span>{{info.name}}</span>
                        <span>{{item[info.type]}}  <span v-if="info.isPercent">%</span></span>

                    </div>

                </div>
            </li>
        </ul>
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
                <p class="tableTitle">{{$t('workbench.work_scheduleSaturation')}}</p>
                <saturated name="saturated" :position = "true" :department = "true" apiUrl="workbench_work_member_schedule" key="1"></saturated>
            </div>
            <div v-if="tabIndex == 1">
                <p class="tableTitle">{{$t('workbench.work_efficiency')}}</p>
                <client name="efficiency" apiUrl="workbench_work_member_efficiency"></client>
            </div>
            <div v-if="tabIndex == 2">
                <p class="tableTitle">{{$t('project.pro_quality')}}</p>
                <saturated name="quality" apiUrl="workbench_work_member_quality" key="2"></saturated>
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
                initComponent:false,
                tabList: [
                    {
                        name: i18n.t('workbench.work_scheduleSaturation'),
                        tipName: i18n.t('workbench.work_scheduleSaturation'),
                        detailsInfo: [
                            {name: i18n.t('workbench.work_lastWeekScheduleSaturation'), type: 'last_week',isPercent:true},
                            {name: i18n.t('workbench.work_thisWeekScheduleSaturation'), type: 'this_week',isPercent:true},
                        ]
                    },
                    {
                        name: i18n.t('workbench.work_efficiency'),
                        tipName: i18n.t('workbench.work_efficiency'),
                        detailsInfo: [
                            {name: i18n.t('workbench.work_lastWeekTaskDelay'), type: 'last_count'},
                            {name: i18n.t('workbench.work_thisWeekTaskDelay'), type: 'this_count'},
                        ]
                    },
                    {
                        name: i18n.t('workbench.work_qualityTrend'),
                        tipName: i18n.t('workbench.work_qualityTrend'),
                        detailsInfo: [
                            {name: i18n.t('workbench.work_lastWeekPassRate'), type: 'last',isPercent:true},
                            {name: i18n.t('workbench.work_thisWeekPassRate'), type: 'this',isPercent:true},
                        ]
                    },
                ],
                tabIndex: 0,
            }
        },
        methods: {
            async init() {
                await api.workbenchWorkMemberIndex();
                this.getStopContinuousRate();
            },
            async getStopContinuousRate() {
                let {data} = await api.workbenchWorkMemberTag();
                if (data && data.data) {
                    this.initComponent = true;
                    // data.data.quality.percent = data.data.quality.trend;
                    // data.data.efficiency.percent = data.data.efficiency.percent;
                    this.$set(this.tabList, 0, {...this.tabList[0], ...data.data.short_period});
                    this.$set(this.tabList, 1, {...this.tabList[1], ...data.data.efficiency});
                    this.$set(this.tabList, 2, {...this.tabList[2], ...data.data.quality});
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
