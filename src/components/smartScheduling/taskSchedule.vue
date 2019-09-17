<template>
    <div class="task-schedule-container">
        <dl class="task-layout" @mousedown="slideSchedule" onselectstart="return false;">
            <!--<dt class="schedule-date-header">-->
                <!--&lt;!&ndash;<ul class="schedule-list-header">&ndash;&gt;-->
                    <!--&lt;!&ndash;<li v-for="(date, index) in dateList" :key="index">{{date.m}}月{{date.d}}日</li>&ndash;&gt;-->
                <!--&lt;!&ndash;</ul>&ndash;&gt;-->
            <!--</dt>-->
            <dd class="task-schedule-detail">
                <div v-if="!showAllProject && projectId && filterCurrentProjectData.length > 0" class="out-side" v-for="(tasks, index) in filterCurrentProjectData" :key="index" :style="{height: tasks.taskData.length > 1 ? `${tasks.taskData.length * 24}px` : '48px'}">
                    <ul class="schedule-list">
                        <li v-for="(task, index) in tasks.taskData" :key="index" :style="{top: `${index * 24}px`}">
                            <span v-for="(item, index) in task" :key="index" :style="setTaskStyle(item)"></span>
                            <!--<span v-if="showAllProject" v-for="(item, index) in task" :key="index" :style="setTaskStyle(item)" :class="{'other-bg': item.project !== projectId}"></span>-->
                        </li>
                    </ul>
                </div>
                <div v-if="showAllProject && projectId" class="out-side" v-for="(tasks, index) in taskScheduleData" :key="index" :style="{height: tasks.task_data.length > 1 ? `${tasks.task_data.length * 24}px` : '48px'}">
                    <ul class="schedule-list">
                        <li v-for="(task, index) in tasks.task_data" :key="index" :style="{top: `${index * 24}px`}">
                            <!--<span v-if="item.project === projectId && !showAllProject" v-for="(item, index) in task" :key="index" :style="setTaskStyle(item)"></span>-->
                            <span v-if="showAllProject" v-for="(item, index) in task" :key="index" :style="setTaskStyle(item)" :class="{'other-bg': item.project !== projectId}"></span>
                        </li>
                    </ul>
                </div>
            </dd>
        </dl>
    </div>
</template>

<script>
    const moment = require('moment');
    export default {
        name: "taskSchedule",
        props: {
            dateList: {
                type: Array,
                default: () => []
            },
            taskScheduleData: {
                type: Array,
                default: () => []
            },
            showAllProject: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                projectId: null,
                filterCurrentProjectData: []
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.projectId = sessionStorage.projectID;
                let filterCurrentProjectData = this.taskScheduleData.map(item => {
                    item.taskData = [];
                    for (let i = 0; i < item.task_data.length; i++) {
                        let task = item.task_data[i];
                        let filterTask = task.filter(pro => pro.project === this.projectId);
                        if (filterTask.length > 0) {
                            item.taskData.push(filterTask);
                        }
                    }
                    return item;
                });
                this.filterCurrentProjectData = filterCurrentProjectData;
            },
            setTaskStyle (task) {
                let diffDays = this.calculateDiffDays(task.start_date, task.end_date);
                let startDiffDays = this.calculateDiffDays(this.dateList[0].date, task.start_date);
                let style = {
                    width: `${80 * (diffDays + 1)}px`,
                    left: `${80 * startDiffDays}px`
                };
                return style;
            },
            // 计算相差的天数
            calculateDiffDays (startDate, endDate) {
                let start = startDate.split('-');
                let end = endDate.split('-');
                let begin = moment([start[0], start[1] - 1, start[2]]);
                let last = moment([end[0], end[1] - 1, end[2]]);
                let diffDays = last.diff(begin, 'days', true);
                return diffDays;
            },
            slideSchedule (e) {
                e.preventDefault();
                e.stopPropagation();
                const scheduleLay = document.querySelector('.task-layout');
                // const scheduleHeader = document.querySelector('.schedule-list-header');
                const scheduleHeader = document.querySelector('.date-header-list ul');
                const scheduleList = document.querySelectorAll('.schedule-list');

                let clientX = e.clientX;
                let defaultLeft = Number(scheduleHeader.style.left.split('px')[0]);
                scheduleLay.onmousemove = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    scheduleHeader.onselectstart = null;
                    let newClientX = event.clientX;
                    let slideSize = newClientX - clientX;
                    let distance = defaultLeft + slideSize;
                    if (distance <= 0 && (scheduleLay.offsetWidth - scheduleHeader.offsetWidth) <= distance) {
                        scheduleHeader.style.left = distance + 'px';
                        if (scheduleList && scheduleList.length > 0) {
                            for (let i = 0; i < scheduleList.length; i++) {
                                scheduleList[i].style.left = distance + 'px';
                            }
                        }
                    }
                };
                document.body.onmouseup = () => {
                    scheduleLay.onmousemove = null;
                };
            }
        }
    };
</script>

<style lang="less" scoped>
    .task-schedule-container {
        width: 100%;
        min-height: 318px;
        padding: 0 0 5px 0;
        overflow: hidden;
        .task-layout {

            .schedule-date-header {
                width: 100%;
                height: 48px;
                background: rgba(60, 210, 180, 0.5);
                position: relative;
                ul {
                    display: flex;
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 48px;
                    li {
                        display: block;
                        float: left;
                        width: 80px;
                        line-height: 48px;
                        text-align: center;
                        font-size: 13px;
                        color: #666;
                    }
                }
            }
            .task-schedule-detail {
                width: 100%;
                min-height: 314px;
                position: relative;
                div.out-side {
                    /*margin: 0 0 5px;*/
                }
                ul {
                    position: relative;
                    li {
                        position: absolute;
                        /*left: 0;*/
                        display: flex;
                        padding: 8px 0 0;
                        height: 28px;
                        width: 100%;
                        span {
                            position: absolute;
                            display: block;
                            width: 100px;
                            height: 20px;
                            -webkit-border-radius: 10px;
                            -moz-border-radius: 10px;
                            border-radius: 10px;
                            background: @base;
                            &.default-bg {}
                            &.other-bg {
                                background: #7cbefc;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
