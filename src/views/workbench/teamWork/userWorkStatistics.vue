<template>
    <div class="userWorks">
        <ul class="headNav">
            <li v-for="(item,index) in tabsInfo.tabsArr" :class="{'selectSty':tabsInfo.creentIndex == index}"
                @click="tabsInfo.creentIndex = index">{{item}}
            </li>
        </ul>
        <div class="content">
            <usertasklist v-if="tabsInfo.creentIndex == 0" :creentUser="creentUser"></usertasklist>
            <usertasktrend v-if="tabsInfo.creentIndex == 1" :taskNum="taskNum"></usertasktrend>
            <userspeedtrend v-if="tabsInfo.creentIndex == 2" :taskSpeed="taskSpeed"></userspeedtrend>
            <userqualitytrend v-if="tabsInfo.creentIndex == 3" :taskQuality="taskQuality"></userqualitytrend>
        </div>
    </div>
</template>

<script>
    import {teamWorkDemand} from 'api';
    import usertasklist from "./userTaskList";
    import usertasktrend from "./userTaskTrend";
    import userspeedtrend from "./userSpeedTrend";
    import userqualitytrend from "./userQualityTrend";

    export default {
        props: ['creentUser'],
        components: {
            userspeedtrend,
            usertasktrend,
            usertasklist,
            userqualitytrend
        },
        data() {
            return {
                tabsInfo: {
                    tabsArr: [i18n.t('workbench.work_myTaskTitle'), i18n.t('workbench.work_taskTrend'), i18n.t('workbench.work_speedTrend'), i18n.t('workbench.work_qualityTrend')],
                    creentIndex: 0
                },
                taskNum: {},
                taskQuality: {},
                taskSpeed: {}
            };
        },
        mounted() {
            teamWorkDemand.getUsertaskTrend({id: this.creentUser}).then(({data}) => {
                if (data.err_code == 0) {
                    this.taskNum = data.task_num;
                    this.taskQuality = data.task_quality;
                    this.taskSpeed = data.task_speed;
                } else {
                    this.$Message.error(data.err_message);
                }
            });
        }
    };
</script>

<style lang="less" scoped>
    .userWorks {
        .headNav {
            display: flex;
            font-size: 14px;
            position: absolute;
            left: 0;
            width: 100%;
            top: 60px;
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #ececec;
            padding: 0px 30px;
            color: #949494;
            li {
                margin-left: 30px;
                &.selectSty {
                    color: @base;
                }
                &:first-child {
                    margin-left: 0 !important;
                }
                &:hover {
                    cursor: pointer;
                    color: @base;
                }
            }
        }
        .content {
            margin-top: 50px;
        }
    }
</style>
