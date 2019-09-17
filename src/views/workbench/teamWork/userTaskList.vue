<template>
    <div class="userTaskList">
        <ul class="userSwitchTab">

            <li v-for="(item,index) in tabsInfo.tabs" :class="{'selectSty':tabsInfo.creentIndex == index}"
                @click="switchTab(index,item.status)">
                <p>{{item.count}}</p>
                <span>{{item.tab}}</span>
            </li>
        </ul>
        <ul class="taskListUl">
            <li style="height: 220px" v-if="loadingFlag">
                <loading></loading>
            </li>
            <li v-for="(item,index) in taskDataList" @click="goTaskDetails(item)" v-if="!loadingFlag && (taskDataList && taskDataList.length > 0)">
                <div class="name-date-box">
                    <div class="tab-name">{{item.name}}</div>
                    <div class="tab-date" v-if="item.is_test != '1'">
                        <span>{{item.create_time | timeCover}}</span>
                        <span v-if="item.start_time!='0'">~{{item.start_time | timeCover}}</span>
                    </div>
                    <span v-else>{{item.create_time | timeCover}}~{{item.bid_end_time | timeCover}}</span>
                </div>

                <span>{{item.project_name}}</span>
                <span :class="{'doingSty':
                item.is_test ==0 && item.status == 2 ||
                item.is_test ==0 && item.status == 3 ||
                item.is_test ==1 && item.status == 0
                ,'waitSty':
                item.is_test ==0 && item.status == 1 }">
                {{item.statusStr}}
                </span>
            </li>
            <li v-if="!loadingFlag && taskDataList.length == 0" style="position: relative;min-height: 220px">
                <nothink type="project" :text="$t('tip.tip_noData')"></nothink>
            </li>
        </ul>
    </div>
</template>

<script>
    import {teamWorkDemand} from 'api';

    export default {
        props: ['creentUser'],
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
                taskDataList: [],
                loadingFlag: true
            };
        },
        mounted() {
            this.getUsertask('all');
        },
        methods: {
            async getUsertask(status) {
                this.loadingFlag = true;
                let parms = {
                    id: this.creentUser,
                    status: status
                };
                let {data} = await teamWorkDemand.getUserTaskList(parms);
                if (data.err_code == 0) {
                    this.loadingFlag = false;
                    let list = data.data;
                    if (list.length > 0) {
                        list.forEach((creent) => {
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
                    this.taskDataList = list;
                    this.tabsInfo.tabs[0].count = data.count.all || 0;
                    this.tabsInfo.tabs[1].count = data.count.over || 0;
                    this.tabsInfo.tabs[2].count = data.count.doing || 0;
                    this.tabsInfo.tabs[3].count = data.count.wait || 0;
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            goTaskDetails(item){
                if (item.is_test == 0){
                    this.$router.push({ path: "/project/details", query: { project: item.project_id, id: item.task_id, navTitle: i18n.t('workbench.work_workCountTitle')}});
                } else {
                    this.$router.push({ path: "/epibol/ManageDetails", query: { enteredID: item.task_id, TestID: item.project_id, type: 'new', navTitle: i18n.t('workbench.work_workCountTitle')}});
                }
            },
            switchTab(index, status){
                this.tabsInfo.creentIndex = index;
                this.getUsertask(status);
            },
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

<style lang="less" scoped>
    .userTaskList {
        .userSwitchTab {
            display: flex;
            justify-content: space-between;
            li {
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                p {
                    height: 45px;
                    width: 45px;
                    line-height: 45px;
                    border: 1px solid #ccc;
                    border-radius: 100%;
                    color: @base;
                }
                span {
                    display: inline-block;
                    margin-top: 5px;
                    font-size: 13px;
                    color: #d0d1d2;
                }
                &:hover {
                    cursor: pointer;
                    p {
                        border: 1px solid @base;
                        background: @base;
                        color: @white;
                    }
                    span {
                        color: @base;
                    }
                }
                &.selectSty {
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
        .taskListUl {
            border-top: 1px solid #f3f3f3;
            margin-top: 20px;
            min-height: 220px;
            max-height: 500px;
            overflow: auto;
            padding: 0 5px 0 0;
            &::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 3px;
                background: rgba(0, 0, 0, 0.2);
            }
            &::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                border-radius: 0;
                background: rgba(0, 0, 0, 0.1);
            }
            &::-webkit-scrollbar {
                width: 3px !important;
                background: #f5f5f5;
            }
            .name-date-box{
                display: flex;
                width: 320px;
                justify-content: space-between;
                .tab-name{
                    min-width: 100px;
                }
                .tab-date{
                    min-width: 100px;
                    text-align: center;
                    color: #bdbdbd ;
                }
            }

            li {
                display: flex;
                justify-content: space-between;
                padding: 20px 0;
                border-bottom: 1px solid #f3f3f3;
                cursor: pointer;
                &:hover{
                    background: #fbfbfb;
                }
                span {
                    /*width: 25%;*/
                    /*flex: 1;*/
                    &:nth-child(1) {

                    }
                    &:nth-child(2), &:nth-child(3) {
                        color: #bdbdbd;
                        /*width: 150px;*/
                        /*text-align: center;*/
                    }
                    &:nth-child(4) {
                        color: #ffffff;
                        background: #3cd2b4;
                        text-align: center;
                        border-radius: 3px;
                        display: inline-block;
                        padding: 0 5px;
                        /*text-align: right;*/
                        &.waitSty{
                            background: #ffbe37 !important;
                        }
                        &.doingSty{
                            background: #9ED3FD !important;
                        }
                    }
                }

            }
        }
    }
</style>
