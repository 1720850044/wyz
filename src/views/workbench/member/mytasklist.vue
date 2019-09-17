<template>
    <div class="myTaskTab">
        <p class="tabTitle">{{$t('workbench.work_myTaskTitle')}}</p>
        <ul class="SwitchTab">
            <li :class="{'checkedSty':tabsInfo.creentIndex == index}" @click="switchTab(index,item.status)"
                v-for="(item,index) in tabsInfo.tabs">
                <p>{{item.count || 0}}</p>
                <span>{{item.tab}}</span>
            </li>
        </ul>

        <div v-if="loadingFlag" style="height: 600px;">
            <loading ></loading>
        </div>
        <ul class="creentTab" v-else-if="!loadingFlag && (taskData && taskData.length > 0)">
            <li v-for="item in taskData" @click="goTaskDetails(item)">
                <span>{{item.name}}</span>
                <span v-if="item.is_test != '1'">{{item.create_time | timeCover}}~{{item.start_time | timeCover}}</span>
                <span v-else>{{item.create_time | timeCover}}~{{item.bid_end_time | timeCover}}</span>
                <span>{{item.project_name}}</span>

                <span :class="{'doingSty':
                item.is_test ==0 && item.status == 2 ||
                item.is_test ==0 && item.status == 3 ||
                item.is_test ==1 && item.status == 0
                ,'waitSty':
                item.is_test ==0 && item.status == 1 }">
                    <!--{{item.is_test}}-->
                    {{item.statusStr}}
                    <!--{{item.status}}-->
                </span>
            </li>
        </ul>
        <div v-else-if="!loadingFlag && taskData.length == 0" style="min-height: 600px;position: relative">
            <nothink type="task"></nothink>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import api from 'api';

    export default {
        name: "mytasklist",
        data() {
            return {
                tabsInfo: {
                    creentIndex: 0,
                    tabs: [
                        {tab: i18n.t('workbench.work_AllTaskTitle'), status: 'all', count: 0},
                        {tab: i18n.t('workbench.work_complete'), status: 'over', count: 0},
                        {tab: i18n.t('workbench.work_conducting'), status: 'doing', count: 0},
                        {tab: i18n.t('workbench.work_noBegin'), status: 'wait', count: 0}
                    ]
                },
                taskData: [],
                loadingFlag: true
            };
        },
        methods: {
            ...mapMutations(['setDetailAll']),
            goTaskDetails(item) {
                if (item.is_test == 0) {
                    this.$router.push({
                        path: "/project/details",
                        query: {project: item.project_id, id: item.task_id, navTitle: i18n.t('workbench.work_workCountTitle')}
                    });
                } else {
                    this.$router.push({
                        path: "/epibol/ManageDetails",
                        query: {enteredID: item.task_id, TestID: item.project_id, type: 'new', navTitle: i18n.t('workbench.work_workCountTitle')}
                    });
                }
            },
            switchTab(index, status) {
                this.tabsInfo.creentIndex = index;
                this.getAllTaskList(status);
            },
            getAllTaskList(status) {
                this.loadingFlag = true;
                api.getAllTaskListData({status: status}).then((res) =>{
                    this.loadingFlag = false;
                    if (res.data.err_code == 0) {
                        let data = res.data.data;
                        if (data.length > 0) {
                            data.forEach((creent) => {
                                if (creent.is_test === '0') {
                                    if (creent.status === '1') {
                                        creent.statusStr = i18n.t('workbench.work_noBegin');
                                    } else if (creent.status === '2' || creent.status === '3') {
                                        creent.statusStr = i18n.t('workbench.work_conducting');
                                    } else if (creent.status === '4') {
                                        creent.statusStr = i18n.t('workbench.work_complete');
                                    }
                                } else {
                                    if (creent.status === '0') {
                                        creent.statusStr = i18n.t('workbench.work_conducting');
                                    } else if (creent.status > 0) {
                                        creent.statusStr = i18n.t('workbench.work_complete');
                                    }
                                }
                            });
                        }
                        this.taskData = data || [];

                        // console.log(this.taskData)

                        this.tabsInfo.tabs[0].count = res.data.count.all;
                        this.tabsInfo.tabs[1].count = res.data.count.over;
                        this.tabsInfo.tabs[2].count = res.data.count.doing;
                        this.tabsInfo.tabs[3].count = res.data.count.wait;
                    }
                });

            }
        },
        mounted() {
            this.getAllTaskList('all');
        },
        filters: {
            timeCover: function (val) {
                let day = new Date(val * 1000);
                return day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
            },
            statusTxt: function (val) {
                let str = '';
                if (val == 1) {
                    str = i18n.t('workbench.work_noBegin');
                } else if (val == 2 || val == 3) {
                    str = i18n.t('workbench.work_conducting');
                } else if (val == 4) {
                    str = i18n.t('workbench.work_complete');
                }
                return str;
            }
        }
    };
</script>

<style lang="less">
    .myTaskTab {
        .base-card;
        min-width: 420px;
        .tabTitle {
            font-size: 16px;
            padding: 0px 0px 0px 0px;
        }
        .SwitchTab {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e8e8e8;
            padding: 30px 20px;
            li {
                display: flex;
                text-align: center;
                flex-direction: column;
                align-items: center;
                p {
                    width: 45px;
                    height: 45px;
                    line-height: 45px;
                    text-align: center;
                    border-radius: 100%;
                    color: @base;
                    background: @white;
                    font-size: 15px;
                    border: 1px solid #d0d1d2;
                }
                span {

                    display: inline-block;
                    margin-top: 10px;
                    font-size: 13px;
                    color: #d0d1d2;
                }
                &:hover {
                    cursor: pointer;
                    p {
                        background: @base !important;
                        color: @white !important;
                        border: 1px solid @base;
                    }
                    span {
                        color: @base !important;
                    }
                }
                &.checkedSty {
                    p {
                        background: @base !important;
                        color: @white !important;
                        border: 1px solid @base;
                    }
                    span {
                        color: @base !important;
                    }
                }
            }
        }
        .creentTab {
            height: 600px;
            padding: 10px 10px;
            overflow: auto;
            &::-webkit-scrollbar {
                width: 3px !important;
            }
            /*max-height: 620px;*/
            li {
                display: flex;
                justify-content: space-between;
                padding: 20px 0;
                cursor: pointer;
                border-bottom: 1px solid #f3f3f3;
                span {
                    &:nth-child(1) {
                        width: 100px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    &:nth-child(2), &:nth-child(3) {
                        color: @black_4;
                    }
                    &:nth-child(3) {
                        width: 100px;
                        text-align: center;
                    }
                    &:nth-child(4) {
                        // width: 60px;
                        color: @white;
                        background: @base;
                        text-align: center;
                        border-radius: 3px;
                        display: block;
                        padding: 3px 5px;
                        width: 60px;
                        height: 26px;
                        line-height: 20px;
                        overflow: hidden;
                        -ms-text-overflow: ellipsis;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        &.doingSty {
                            background: #9ED3FD !important;
                        }
                        &.waitSty {
                            background: #ffbe37 !important;
                        }
                    }

                }

            }

        }
    }
</style>
