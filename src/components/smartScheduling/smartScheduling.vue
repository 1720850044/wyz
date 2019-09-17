<template>
    <div class="smart-scheduling-modal-wrap" v-if="showScheduleModal">
        <div class="smart-scheduling-modal">
            <!--<div class="schedule-header">-->
                <!--<h1>智能排期<a class="close-adjust-schedule-btn" @click="closeScheduleModal()"><Icon type="android-close"></Icon></a></h1>-->
            <!--</div>-->
            <div class="schedule-body">
                <h1 class="schedule-header-title">{{$t('project.pro_scheduleHelper')}}</h1>
                <div class="schedule-top-part">
                    <div class="project-details">
                        <h2>
                            <span>{{$t('project.pro_needDetail')}}</span>
                            <a class="adjust-date-status" @click="adjustDateStatus()">{{$t('project.pro_timeAndTypeAdjust')}}</a>
                            <a class="adjust-log" @mouseenter="showAdjustLog=true" @mouseleave="showAdjustLog=false">
                                {{$t('project.pro_adjustLog')}}
                                <!-- 调整日志组件 -->
                                <adjust-log v-if="showAdjustLog" :logParams="adjustLogData"></adjust-log>
                            </a>
                        </h2>
                        <ul class="project-produce" id="projectProduce">
                            <li>
                                <label>{{$t('project.pro_needTime')}}</label>
                                <span v-if="projectDetailData">{{projectDetailData.startDate}} ~ {{projectDetailData.endDate}}</span>
                                <span v-else>-</span>
                            </li>
                            <li>
                                <label>{{$t('project.pro_needSource')}}</label>
                                <div class="demand-source">
                                    <span v-if="projectDetailData"><Icon type="ios-book" />{{projectDetailData.contract_name}}</span>
                                    <span v-else><Icon type="ios-book" />-</span>
                                    <span v-if="projectDetailData"><Icon type="ios-paper" />{{projectDetailData.company_name}}</span>
                                    <span v-else><Icon type="ios-paper" />-</span>
                                </div>
                            </li>
                            <li>
                                <label>{{$t('project.pro_needDetail')}}</label>
                                <div class="detail-table">
                                    <dl>
                                        <dt>
                                            <label>{{$t('lang.lang_category')}}</label>
                                            <label>{{$t('lang.lang_quantity')}}</label>
                                            <label>{{$t('lang.lang_duration')}}</label>
                                            <label class="price">{{$t('lang.lang_unitPrice')}}</label>
                                            <!--<label>优先级</label>-->
                                        </dt>
                                        <dd>
                                            <div>
                                                <ul v-if="projectDetailData">
                                                    <li v-if="projectDetailData && projectDetailData.price && projectDetailData.price.length > 0" v-for="item in projectDetailData.price" :key="item.id">
                                                        <span>{{item.name}}</span>
                                                        <span>{{item.count}}{{$t('lang.lang_ge')}}</span>
                                                        <span>{{item.day || 0}}{{$t('lang.lang_day')}}</span>
                                                        <span class="price-num">{{item.unitprice}}/{{item.unit_text}}</span>
                                                        <!--<span>高</span>-->
                                                    </li>
                                                </ul>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                                <p class="total-statistics">
                                    <label>{{$t('project.pro_categroyAotal')}}:<span v-if="projectDetailData && projectDetailData.price">{{projectDetailData.price.length}}</span><span v-else>-</span></label>
                                    <label>{{$t('project.pro_resourceAotal')}}:<span v-if="projectDetailData">{{projectDetailData.count_resource || 0}}</span><span v-else>-</span></label>
                                    <label>{{$t('project.pro_timeAotal')}}:<span v-if="projectDetailData">{{projectDetailData.count_day || 0}}天</span><span v-else>-</span></label>
                                    <label>{{$t('project.pro_priceAotal')}}:<span v-if="projectDetailData">{{projectDetailData.total_price}}</span><span v-else>-</span></label>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div class="team-details">
                        <h2>
                            <span>{{$t('project.pro_teamOutline')}}</span>
                            <!--<a class="adjust-team" @click="adjustTeam()">调整团队</a>-->
                        </h2>
                        <div class="team-info-container" id="teamInfoContainer">
                            <div class="team-info-table">
                                <dl>
                                    <dt>
                                        <span class="th1">{{$t('lang.lang_member')}}</span>
                                        <span class="th2">{{$t('lang.lang_position')}}</span>
                                        <span class="th3">{{$t('lang.lang_grade')}}</span>
                                        <span class="th4">{{$t('lang.lang_unitPrice')}}</span>
                                        <span class="th5">{{$t('project.pro_taskNumber')}}</span>
                                        <span class="th6">{{$t('project.pro_budgetTime')}}</span>
                                        <span class="th7">{{$t('project.pro_taskContinueTime')}}</span>
                                        <span class="th8">{{$t('lang.lang_production')}}</span>
                                        <span class="th9">{{$t('lang.lang_design')}}</span>
                                        <span class="th10">{{$t('lang.lang_communication')}}</span>
                                        <span class="th11">{{$t('lang.lang_synthesize')}}</span>
                                    </dt>
                                    <dd>
                                        <div class="team-table">
                                            <ul v-if="teamData">
                                                <li v-for="team in teamData.user_data" :key="team.id">
                                                    <p class="td1">
                                                        <label><img :src="team.headImg"/></label>
                                                        <span :title="team.realname">{{team.realname || '-'}}</span>
                                                    </p>
                                                    <p class="td2" :title="team.job">{{team.job || '-'}}</p>
                                                    <p class="td3" v-if="team.level">{{team.level}}</p>
                                                    <p class="td3" v-else>-</p>
                                                    <p class="td4">{{team.per_day || 0}}{{$t('lang.lang_person')}}/{{$t('lang.lang_day')}}</p>
                                                    <p class="td5">{{team.task_count || 0}}{{$t('lang.lang_ge')}}</p>
                                                    <p class="td6">{{team.work_day || 0}}{{$t('lang.lang_day')}}</p>
                                                    <p class="td7" :title="team.taskDate">{{team.taskDate || '-'}}</p>
                                                    <p class="td8">{{team.make_score}}</p>
                                                    <p class="td9">{{team.design_score}}</p>
                                                    <p class="td10">{{team.communicate_score}}</p>
                                                    <p class="td11">{{team.avg_score}}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        <p class="total-statistics">
                            <label>{{$t('project.pro_memberTotal')}}:<span>{{teamData.count_people || 0}}</span></label>
                            <label>{{$t('project.pro_costTotal')}}:<span>{{teamData.count_cost || 0}}</span></label>
                            <label>{{$t('project.pro_manHourTotal')}}:<span>{{teamData.count_work_day || 0}}{{$t('lang.lang_day')}}</span></label>
                            <label>{{$t('project.pro_taskLastTime')}}:<span>{{teamData.endDate || 0}}</span></label>
                        </p>
                    </div>
                    <div class="calendar-details">
                        <h2>
                            <span>{{$t('project.pro_scheduleOutline')}}</span>
                            <a class="adjust-team" @click="switchCalendarView()" v-if="defaultShowMonth">{{$t('project.pro_yearView')}}</a>
                            <a class="adjust-team" @click="switchCalendarView()" v-else>{{$t('project.pro_monthView')}}</a>
                        </h2>
                        <div class="calendar-view" id="calendarView">
                            <full-calendar :events="fcEvents" :lang="'zh'" v-if="defaultShowMonth"></full-calendar>
                            <div class="year-view" v-else>
                                <div class="year-header">
                                    <a class="prev-year" @click="goPrevYear()"></a>
                                    <span>{{currentYear}}{{$t('lang.lang_year')}}</span>
                                    <a class="next-year" @click="goNextYear()"></a>
                                </div>
                                <div class="year-months">
                                    <ul>
                                        <li v-for="item in yearList" :key="item.month">
                                            <span>{{item.month}}{{$t('lang.lang_month')}}</span>
                                            <p class="month-bg" v-if="item.year === currentYear" :class="{'is-start': item.isStart, 'is-end': item.isEnd}" :style="{width: item.width + '%', 'left': item.left + '%'}"></p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="schedule-view">
                    <h1 class="schedule-title">
                        <span>{{$t('project.pro_planResult')}}</span>
                        <a @click="chooseOtherProjectTask()">
                            <Icon type="android-checkbox-outline-blank" v-if="!showOtherProjectTask"></Icon>
                            <Icon type="android-checkbox-outline" v-else></Icon>
                            <span>{{$t('project.pro_showOtherTask')}}</span>
                        </a>
                    </h1>
                    <div class="schedule-container" id="scheduleContainer">
                        <!--此处为排期组件-->
                        <div class="schedule-table-header">
                            <h1 class="title-bar">
                                <span>{{$t('upload.upload_producer')}}</span>
                                <span>{{$t('project.pro_nowProject')}}<br/>{{$t('project.pro_taskTotal')}}</span>
                                <span>{{$t('project.pro_scheduleHelper')}}<br/>{{$t('project.pro_taskTotal')}}</span>
                                <span>{{$t('lang.lang_project')}}<br/>{{$t('project.pro_vacancyRate')}}</span>
                            </h1>
                            <div class="date-header-list">
                                <ul>
                                    <li v-for="(date, index) in dateList" :key="index">{{date.m}}{{$t('lang.lang_month')}}{{date.d}}{{$t('lang.lang_day')}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="schedule-table-body">
                            <div class="schedule-left-content">
                                <!--<h1 class="title-bar">-->
                                <!--<span>制作人</span>-->
                                <!--<span>当前项目<br/>任务总数</span>-->
                                <!--<span>其他项目<br/>任务总数</span>-->
                                <!--<span>项目<br/>空闲率</span>-->
                                <!--</h1>-->
                                <div class="producer-list">
                                    <ul>
                                        <li v-if="!showOtherProjectTask" v-for="item in filterProducerList" :key="item.id" :style="{height: item.taskData.length > 1 ? item.taskData.length * 24 + 'px' : '48px'}">
                                            <div class="producer-cell">
                                                <label>
                                                    <img :src="item.headImg" />
                                                </label>
                                                <span>{{item.realname}}</span>
                                            </div>
                                            <div class="producer-cell">{{item.now_task_count}}</div>
                                            <div class="producer-cell">{{item.other_task_count}}</div>
                                            <div class="producer-cell">{{item.free_rate + '%' || '0%'}}</div>
                                        </li>
                                        <li v-if="showOtherProjectTask" v-for="item in producerList" :key="item.id" :style="{height: item.task_data.length > 1 ? item.task_data.length * 24 + 'px' : '48px'}">
                                            <div class="producer-cell">
                                                <label>
                                                    <img :src="item.headImg" />
                                                </label>
                                                <span>{{item.realname}}</span>
                                            </div>
                                            <div class="producer-cell">{{item.now_task_count}}</div>
                                            <div class="producer-cell">{{item.other_task_count}}</div>
                                            <div class="producer-cell">{{item.free_rate + '%' || '0%'}}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="schedule-comp-content">
                                <!--<timeline v-if="showScheduleTimeLine&& projectScheduleData && dateList" :type="'smart'" :id="'smartSchedule'" :showAllProject="showOtherProjectTask" :dateList="dateList" :taskFormat="projectScheduleData"></timeline>-->
                                <task-schedule v-if="showScheduleTimeLine && projectScheduleData && dateList" :showAllProject="showOtherProjectTask" :dateList="dateList" :taskScheduleData="projectScheduleData"></task-schedule>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 排期时间状态修改组件 -->
        <adjust-project-schedule v-if="showUpdateSchedule" :projectBaseData="projectBaseData" @closeAdjustSchedule="showUpdateSchedule=false" @saveAdjustRequest="saveAdjustRequest"></adjust-project-schedule>
    </div>
</template>

<script>
    import api from 'api';
    import adjustProjectSchedule from "./adjustProjectSchedule";
    import AdjustLog from "./adjustLog";
    import FullCalendar from "vue-fullcalendar";
    // import langSet from "vue-fullcalendar/src/dataMap/langSets.js";
    import Timeline from "../timeline";
    import TaskSchedule from "./taskSchedule";
    export default {
        name: "smartScheduling",
        components: {TaskSchedule, Timeline, FullCalendar, AdjustLog, adjustProjectSchedule},
        props: {
            accToken: {
                type: Object,
                default: ()=> {}
            }
        },
        data () {
            return {
                showScheduleModal: true,
                showOtherProjectTask: false,
                showUpdateSchedule: false,
                showAdjustLog: false,
                defaultShowMonth: true,
                showScheduleTimeLine: false,
                projectId: null,
                fcEvents: [],
                yearList: [
                    {month: 1, count: 31, width: 0, left: 0},
                    {month: 2, count: 28, width: 0, left: 0},
                    {month: 3, count: 31, width: 0, left: 0},
                    {month: 4, count: 30, width: 0, left: 0},
                    {month: 5, count: 31, width: 0, left: 0},
                    {month: 6, count: 30, width: 0, left: 0},
                    {month: 7, count: 31, width: 0, left: 0},
                    {month: 8, count: 31, width: 0, left: 0},
                    {month: 9, count: 30, width: 0, left: 0},
                    {month: 10, count: 31, width: 0, left: 0},
                    {month: 11, count: 30, width: 0, left: 0},
                    {month: 12, count: 31, width: 0, left: 0}
                ],
                currentYear: new Date().getFullYear(),
                initDate: {},
                projectDetailData: {},
                producerList: [],
                filterProducerList: [],
                projectScheduleData: [],
                dateList: [],
                yearDate: {},
                projectBaseData: {},
                adjustLogData: [],
                teamData: {}
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                let _this = this;
                this.projectId = sessionStorage.projectID;
                this.getProjectDetail();
                this.getProjectSchedule()
                    .then(flag => {
                        if (flag) {
                            _this.getDateList();
                        }
                    });
                this.getCalendarList();
                this.getAdjustLogData();
                this.getTeamData();
            },
            async getProjectDetail () {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_contract;
                let param = {
                    project_id: this.projectId,
                    acc_token: this.accToken.acc_token
                };
                this.$axios.post(url, param)
                    .then(result => {
                        if (result.data.err_code === 0) {
                            _this.projectDetailData = result.data.data;
                            if (_this.projectDetailData) {
                                _this.switchDateToYMD();
                            }
                        }
                    });
            },
            async getProjectSchedule () {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_project_schedule;
                return this.$axios.post(url, {project_id: this.projectId, acc_token: this.accToken.acc_token})
                    .then(result => {
                        if (result.data.err_code === 0) {
                            let producerList = JSON.stringify(result.data.data);
                            _this.producerList = JSON.parse(producerList);
                            _this.producerList.forEach(item => {
                                item.headImg = this.GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.id;
                            });
                            _this.filterProducerList = _this.producerList.map(item => {
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
                            const projectScheduleData = result.data.data;
                            _this.projectScheduleData = projectScheduleData;
                            _this.initDate = {
                                initStartDate: result.data.init_start_date,
                                initEndDate: result.data.init_end_date
                            };
                            return true;
                        }
                    });
            },
            getDateList () {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_datelist;
                let param = {
                    start_time: this.initDate.initStartDate,
                    end_time: this.initDate.initEndDate,
                    acc_token: this.accToken.acc_token
                };
                this.$axios.post(url, param)
                    .then(result => {
                        if (result.data.err_code === 0) {
                            _this.showScheduleTimeLine = true;
                            _this.dateList = result.data.data;
                        }
                    });
            },
            async getCalendarList () {
                let _this = this;
                this.defaultShowMonth = false;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_project_calendar;
                this.$axios.post(url, {project_id: this.projectId, acc_token: this.accToken.acc_token})
                    .then(result => {
                        if (result.data.err_code === 0) {
                            _this.projectBaseData = {
                                startDate: result.data.data.start_date,
                                endDate: result.data.data.end_date,
                                workDay: result.data.data.work_day,
                                status: result.data.data.status    // 1：开始，2：暂停，3：停止
                            };
                            let projectCalendar = {
                                start: result.data.data.start_date,
                                end: result.data.data.end_date
                            };
                            // let date = {
                            //     start: '2018-11-25',
                            //     end: '2019-05-8'
                            // };
                            _this.fcEvents[0] = projectCalendar;
                            // _this.fcEvents.push(date);
                            _this.yearDate = _this.fcEvents[0];
                            let yearDateStart = _this.yearDate.start;
                            let yearDateEnd = _this.yearDate.end;
                            let yearStart = parseInt(yearDateStart.split('-')[0]);
                            let monthStart = parseInt(yearDateStart.split('-')[1]);
                            let dayStart = parseInt(yearDateStart.split('-')[2]);
                            let yearEnd = parseInt(yearDateEnd.split('-')[0]);
                            let monthEnd = parseInt(yearDateEnd.split('-')[1]);
                            let dayEnd = parseInt(yearDateEnd.split('-')[2]);
                            let startWidth, startLeft, endWidth, endLeft;
                            if (yearEnd > yearStart) { // 隔年
                                let maxMonth = 12;
                                let maxYearEnd = maxMonth + monthEnd;
                                for (let i in _this.yearList) {
                                    _this.yearList[i].year = null;
                                }
                                _this.yearList[monthStart - 1].isStart = true;
                                _this.yearList[monthStart - 1].isEnd = false;
                                startWidth = (_this.yearList[monthStart - 1].count - dayStart + 1) / _this.yearList[monthStart - 1].count;
                                startLeft = parseFloat(1 - startWidth);
                                _this.yearList[monthStart - 1].width = startWidth * 100;
                                _this.yearList[monthStart - 1].left = startLeft * 100;
                                _this.yearList[monthStart - 1].year = yearStart;

                                // 所隔月
                                for (let index = 1; index < maxYearEnd; index++) {
                                    if (maxYearEnd - index > monthStart) {
                                        if (maxYearEnd - index > maxMonth) {
                                            _this.yearList[maxYearEnd - index - maxMonth - 1].width = 100;
                                            _this.yearList[maxYearEnd - index - maxMonth - 1].year = yearEnd;
                                        } else {
                                            _this.yearList[maxYearEnd - index - 1].width = 100;
                                            _this.yearList[maxYearEnd - index - 1].year = yearStart;
                                        }

                                    }
                                }

                                _this.yearList[monthEnd - 1].isStart = false;
                                _this.yearList[monthEnd - 1].isEnd = true;
                                endWidth = dayEnd / _this.yearList[monthEnd - 1].count;
                                endLeft = 0;
                                _this.yearList[monthEnd - 1].width = endWidth * 100;
                                _this.yearList[monthEnd - 1].left = endLeft * 100;
                                _this.yearList[monthEnd - 1].year = yearEnd;
                            }

                            if (yearEnd <= yearStart) { //同年
                                for (let i in _this.yearList) {
                                    _this.yearList[i].year = yearStart;
                                }
                                if (monthEnd > monthStart) { // 隔月
                                    _this.yearList[monthStart - 1].isStart = true;
                                    _this.yearList[monthStart - 1].isEnd = false;
                                    startWidth = (_this.yearList[monthStart - 1].count - dayStart + 1) / _this.yearList[monthStart - 1].count;
                                    startLeft = parseFloat(1 - startWidth);
                                    _this.yearList[monthStart - 1].width = startWidth * 100;
                                    _this.yearList[monthStart - 1].left = startLeft * 100;

                                    // 所隔月
                                    for (let i = 1; i < monthEnd; i++) {
                                        if (monthEnd - i > monthStart) {
                                            _this.yearList[monthEnd - i - 1].width = 100;
                                        }
                                    }

                                    _this.yearList[monthEnd - 1].isStart = false;
                                    _this.yearList[monthEnd - 1].isEnd = true;
                                    endWidth = dayEnd / _this.yearList[monthEnd - 1].count;
                                    endLeft = 0;
                                    _this.yearList[monthEnd - 1].width = endWidth * 100;
                                    _this.yearList[monthEnd - 1].left = endLeft * 100;
                                }
                                if (monthEnd <= monthStart) { // 当月
                                    _this.yearList[monthStart - 1].isStart = true;
                                    _this.yearList[monthStart - 1].isEnd = true;
                                    startWidth = (dayEnd - dayStart + 1) / _this.yearList[monthStart - 1].count;
                                    startLeft = (dayStart - 1) / _this.yearList[monthStart - 1].count;
                                    _this.yearList[monthStart - 1].width = startWidth * 100;
                                    _this.yearList[monthStart - 1].left = startLeft * 100;
                                }
                            }
                            setTimeout(() => {
                                this.defaultShowMonth = true;
                            });
                        }
                    });
            },
            async getAdjustLogData () {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_project_log;
                let params = {
                    project_id: sessionStorage.projectID,
                    acc_token: this.accToken.acc_token,
                    page: 1,
                    page_size: 99
                };
                this.$axios.post(url, params)
                    .then(result => {
                        if (result.data.err_code === 0) {
                            _this.adjustLogData = result.data.data;
                        } else {
                            _this.$Message.warning(result.data.err_message);
                        }
                    });
            },
            async getTeamData () {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_member_price_helper;
                this.$axios.post(url, {project_id: sessionStorage.projectID, acc_token: this.accToken.acc_token})
                    .then(result => {
                        if (result.data.err_code === 0) {
                            _this.teamData = result.data.data;
                            if (_this.teamData) {
                                if (_this.teamData.end_time > 0) {
                                    let endBaseDate = new Date(parseInt(_this.teamData.end_time) * 1000);
                                    _this.teamData.endDate = endBaseDate.getFullYear() + '-' + (endBaseDate.getMonth() + 1) + '-' + endBaseDate.getDate();
                                } else {
                                    _this.teamData.endDate = '-';
                                }
                                if (_this.teamData.user_data) {
                                    _this.teamData.user_data.forEach(item => {
                                        if (item.expect_end_time && parseInt(item.expect_end_time) > 0) {
                                            let baseDate = new Date(parseInt(item.expect_end_time) * 1000);
                                            item.taskDate = baseDate.getFullYear() + '-' + (baseDate.getMonth() + 1) + '-' + baseDate.getDate();
                                        } else {
                                            item.taskDate = '-';
                                        }
                                        item.headImg = this.GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.id || '';
                                    });
                                }
                            }
                        } else {
                            _this.$Message.warning(result.data.err_message);
                        }
                    });
            },
            switchDateToYMD () {
                let startTime, endTime;
                if (this.projectDetailData && this.projectDetailData.start_time &&this.projectDetailData.start_time > 0) {
                    startTime = parseInt(this.projectDetailData.start_time) * 1000;
                }
                if (this.projectDetailData && this.projectDetailData.end_time && this.projectDetailData.end_time > 0) {
                    endTime = parseInt(this.projectDetailData.end_time) * 1000;
                }
                if (startTime > 0 || endTime > 0) {
                    let startYear = new Date(startTime).getFullYear();
                    let endYear = new Date(endTime).getFullYear();
                    let startMonth = new Date(startTime).getMonth() + 1;
                    let endMonth = new Date(endTime).getMonth() + 1;
                    let startDay = new Date(startTime).getDate();
                    let endDay = new Date(endTime).getDate();
                    this.projectDetailData.startDate = startYear + i18n.t('lang.lang_year') + startMonth + i18n.t('lang.lang_month') + startDay + i18n.t('lang.lang_day');
                    this.projectDetailData.endDate = endYear + i18n.t('lang.lang_year') + endMonth + i18n.t('lang.lang_month') + endDay + i18n.t('lang.lang_day');
                } else {
                    this.projectDetailData.startDate = '-';
                    this.projectDetailData.endDate = '-';
                }
            },
            async adjustDateStatus () {
                this.showUpdateSchedule = true;
                let {data} = await api.bubbleReviseSchedule();
                if (data.err_code === 0 && data.guide && data.guide === 'reviseSchedule'){
                    this.bubble();
                }
            },
            bubble() {
                let text = this.$lau.bubble.adjustDate;
                let defaultOptions = [
                    {
                        id: 'operationItems',
                        position: 'right',
                        title: text[0].title,
                        content: text[0].content,
                        relative: 'body',
                    },
                    {
                        id: 'datePercent',
                        position: 'right',
                        title: text[1].title,
                        content: text[1].content,
                        relative: 'body',
                    },
                ];
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$bubble(defaultOptions);
                    }, 300);
                });
            },
            switchCalendarView () {
                this.defaultShowMonth = !this.defaultShowMonth;
            },
            goPrevYear () {
                this.currentYear -= 1;
            },
            goNextYear () {
                this.currentYear += 1;
            },
            saveAdjustRequest (params) {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_project_control;
                params.acc_token = this.accToken.acc_token;
                this.$axios.post(url, params)
                    .then(result => {
                        if (result.data.err_code === 0) {
                            _this.$Message.success(i18n.t('project.pro_projectAdjustSucceed'));
                            _this.showUpdateSchedule = false;
                            _this.getCalendarList();
                        }
                    });
            },
            chooseOtherProjectTask () {
                this.showOtherProjectTask = !this.showOtherProjectTask;
            }
        }
    };
</script>

<style lang="less">
    .smart-scheduling-modal-wrap {
        /*position: fixed;*/
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /*background: rgba(0, 0, 0, 0.38);*/
        /*z-index: 999;*/
        > .smart-scheduling-modal {
            /*position: absolute;*/
            /*top: 0;*/
            /*left: 0;*/
            /*bottom: 0;*/
            /*right: 0;*/
            /*margin: auto;*/
            min-width: 1580px;
            height: 830px;
            background: #fff;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            box-shadow: @boxShadow;
            overflow: hidden;
            > .schedule-header {
                width: 100%;
                height: 50px;
                padding: 0 20px;
                background: url("../../assets/images/headBarBGimg.png") no-repeat center / cover;
                > h1 {
                    font-size: 16px;
                    color: #fff;
                    font-weight: normal;
                    line-height: 50px;
                    > a.close-adjust-schedule-btn {
                        float: right;
                        color: #fff;
                        > i {
                            font-size: 24px;
                            line-height: 50px;
                        }
                    }
                }
            }
            > .schedule-body {
                width: 100%;
                /*height: 720px;*/
                padding: 20px 0;
                .schedule-header-title {
                    width: 100%;
                    font-weight: normal;
                    font-size: 16px;
                    margin: 0 0 12px;
                    padding: 0 20px;
                    color: #333;
                }
                > .schedule-top-part {
                    width: 100%;
                    /*height: 325px;*/
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-between;
                    .project-details {
                        width: 30%;
                        padding-right: 20px;
                        border-right: 1px solid #eee;
                        > h2 {
                            font-weight: normal;
                            font-size: 15px;
                            margin: 0 0 10px 0;
                            color: #777;
                            /*overflow: hidden;*/
                            > span {
                                float: left;
                            }
                            > a {
                                display: block;
                                float: right;
                                margin-left: 15px;
                                color: @base;
                                &.adjust-log {
                                    position: relative;
                                }
                            }
                        }
                        > ul.project-produce {
                            clear: both;
                            padding-top: 10px;
                            overflow: hidden;
                            > li {
                                line-height: 30px;
                                font-size: 14px;
                                overflow: hidden;
                                color: #777;
                                > label {
                                    float: left;
                                    margin-right: 10px;
                                    color: #bdbdbd;
                                }
                                > .demand-source {
                                    float: left;
                                    > span {
                                        display: block;
                                        color: #777;
                                        overflow: hidden;
                                        -ms-text-overflow: ellipsis;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        > i {
                                            font-size: 16px;
                                            color: #bdbdbd;
                                            margin-right: 5px;
                                        }
                                    }
                                }
                                > .detail-table {
                                    float: left;
                                    width: 375px;
                                    margin-bottom: 17px;
                                    > dl {
                                        overflow: hidden;
                                        > dt {
                                            display: flex;
                                            justify-content: space-between;
                                            > label {
                                                /*width: 68px;*/
                                                flex: 1;
                                                color: #bdbdbd;
                                                font-size: 13px;
                                                &:last-child {
                                                    /*width: 55px;*/
                                                    text-align: right;
                                                }
                                                &.price {
                                                    /*width: 110px;*/
                                                }
                                            }
                                        }
                                        > dd {
                                            display: flex;
                                            justify-content: space-between;
                                            > div {
                                                width: 100%;
                                                height: 111px;
                                                overflow-x: hidden;
                                                overflow-y: auto;
                                                > ul {
                                                    overflow: hidden;
                                                    > li {
                                                        line-height: 21px;
                                                        display: flex;
                                                        justify-content: space-between;
                                                        margin: 16px 0 0;
                                                        > span {
                                                            color: #777;
                                                            /*width: 68px;*/
                                                            flex: 1;
                                                            &:last-child {
                                                                /*width: 43px;*/
                                                                text-align: right;
                                                            }
                                                            &.price-num {
                                                                /*width: 110px;*/
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                &:last-child {
                                    height: 192px;
                                }
                                > p.total-statistics {
                                    clear: both;
                                    width: 100%;
                                    display: flex;
                                    line-height: 20px;
                                    padding-top: 10px;
                                    justify-content: space-between;
                                    border-top: 1px solid #eee;
                                    > label {
                                        color: #bdbdbd;
                                        font-size: 12px;
                                        > span {
                                            margin: 0 0 0 3px;
                                            color: #666;
                                            font-size: 14px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .team-details {
                        width: 52%;
                        padding: 0 20px;
                        border-right: 1px solid #eee;
                        > h2 {
                            font-weight: normal;
                            font-size: 15px;
                            margin: 0 0 10px 0;
                            color: #777;
                            overflow: hidden;
                            > span {
                                float: left;
                            }
                            > a {
                                float: right;
                                margin-left: 15px;
                                color: @base;
                            }
                        }
                        > .team-info-container {
                            width: 100%;
                            /*height: 220px;*/
                            > .team-info-table {
                                > dl {
                                    width: 100%;
                                    > dt {
                                        display: flex;
                                        justify-content: space-between;
                                        > span {
                                            font-size: 14px;
                                            color: #bdbdbd;
                                            &.th1 {
                                                width: 15%;
                                            }
                                            &.th2 {
                                                width: 7%;
                                                text-align: center;
                                            }
                                            &.th3 {
                                                width: 7%;
                                                text-align: center;
                                            }
                                            &.th4 {
                                                width: 12%;
                                                text-align: center;
                                            }
                                            &.th5 {
                                                width: 10%;
                                                text-align: center;
                                            }
                                            &.th6 {
                                                width: 10%;
                                                text-align: center;
                                            }
                                            &.th7 {
                                                width: 15%;
                                                text-align: center;
                                            }
                                            &.th8 {
                                                width: 6%;
                                                text-align: center;
                                            }
                                            &.th9 {
                                                width: 6%;
                                                text-align: center;
                                            }
                                            &.th10 {
                                                width: 6%;
                                                text-align: center;
                                            }
                                            &.th11 {
                                                width: 6%;
                                                text-align: center;
                                            }
                                        }
                                    }
                                    > dd {
                                        > .team-table {
                                            width: 101%;
                                            height: 210px;
                                            overflow-x: hidden;
                                            overflow-y: auto;
                                            padding-right: 1%;
                                            > ul {
                                                > li {
                                                    display: flex;
                                                    justify-content: space-between;
                                                    margin: 16px 0 0;
                                                    line-height: 25px;
                                                    > p {
                                                        font-size: 14px;
                                                        overflow: hidden;
                                                        color: #777;
                                                        -ms-text-overflow: ellipsis;
                                                        text-overflow: ellipsis;
                                                        white-space: nowrap;
                                                        > label {
                                                            position: relative;
                                                            display: block;
                                                            float: left;
                                                            width: 25px;
                                                            height: 25px;
                                                            margin: 1px 2px 0 0;
                                                            border: 1px solid #ededed;
                                                            -webkit-border-radius: 50%;
                                                            -moz-border-radius: 50%;
                                                            border-radius: 50%;
                                                            overflow: hidden;
                                                            > img {
                                                                position: absolute;
                                                                top: 0;
                                                                right: 0;
                                                                bottom: 0;
                                                                left: 0;
                                                                margin: auto;
                                                                max-width: 100%;
                                                                max-height: 100%;
                                                            }
                                                        }
                                                        &.td1 {
                                                            width: 15%;
                                                        }
                                                        &.td2 {
                                                            width: 7%;
                                                            text-align: center;
                                                        }
                                                        &.td3 {
                                                            width: 7%;
                                                            text-align: center;
                                                        }
                                                        &.td4 {
                                                            width: 12%;
                                                            text-align: center;
                                                        }
                                                        &.td5 {
                                                            width: 10%;
                                                            text-align: center;
                                                        }
                                                        &.td6 {
                                                            width: 10%;
                                                            text-align: center;
                                                        }
                                                        &.td7 {
                                                            width: 15%;
                                                            text-align: center;
                                                        }
                                                        &.td8 {
                                                            width: 6%;
                                                            text-align: center;
                                                        }
                                                        &.td9 {
                                                            width: 6%;
                                                            text-align: center;
                                                        }
                                                        &.td10 {
                                                            width: 6%;
                                                            text-align: center;
                                                        }
                                                        &.td11 {
                                                            width: 6%;
                                                            text-align: center;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        > p.total-statistics {
                            clear: both;
                            width: 100%;
                            display: flex;
                            font-size: 14px;
                            line-height: 20px;
                            padding-top: 10px;
                            margin-top: 17px;
                            justify-content: space-between;
                            border-top: 1px solid #eee;
                            > label {
                                color: #bdbdbd;
                                font-size: 12px;
                                > span {
                                    margin: 0 0 0 3px;
                                    color: #666;
                                    font-size: 14px;
                                }
                            }
                        }
                    }
                    .calendar-details {
                        width: 18%;
                        padding: 0 0 0 20px;
                        > h2 {
                            font-weight: normal;
                            font-size: 15px;
                            margin: 0 0 10px 0;
                            color: #777;
                            overflow: hidden;
                            > span {
                                float: left;
                            }
                            > a {
                                float: right;
                                margin-left: 15px;
                                color: @base;
                            }
                        }
                        > .calendar-view {
                            width: 100%;
                            height: 278px;
                            > .comp-full-calendar {
                                padding: 10px 0 ;
                                .full-calendar-header {
                                    .header-left, .header-right {
                                        display: none!important;
                                    }
                                    .header-center {
                                        line-height: 28px;
                                        font-size: 14px;
                                        .prev-month, .next-month {
                                            display: block;
                                            width: 28px;
                                            height: 28px;
                                            border: 1px solid #ededed;
                                            -webkit-border-radius: 50%;
                                            -moz-border-radius: 50%;
                                            border-radius: 50%;
                                            text-indent: 100px;
                                            overflow: hidden;
                                            background: url("../../assets/images/calendar-arrow-right.png") no-repeat center / 68%;
                                            -webkit-transition: all 0.3s;
                                            -moz-transition: all 0.3s;
                                            -ms-transition: all 0.3s;
                                            -o-transition: all 0.3s;
                                            transition: all 0.3s;
                                            &:hover {
                                                background-color: rgba(60, 210, 180, 0.28);
                                                border: 1px solid rgba(60, 210, 180, 0.2);
                                            }
                                        }
                                        .prev-month {
                                            float: left;
                                            -webkit-transform: rotate(180deg);
                                            -moz-transform: rotate(180deg);
                                            -ms-transform: rotate(180deg);
                                            -o-transform: rotate(180deg);
                                            transform: rotate(180deg);
                                        }
                                        .next-month {
                                            float: right;
                                        }
                                    }
                                }
                                > .full-calendar-body {
                                    margin: 10px 0 0;
                                    .week-row {
                                        border: none;
                                        .day-cell {
                                            position: relative;
                                            min-height: 38px;
                                            max-height: 38px;
                                            height: 38px;
                                            border: none;
                                            -webkit-box-sizing: border-box;
                                            -moz-box-sizing: border-box;
                                            box-sizing: border-box;
                                            -webkit-border-radius: 5px;
                                            -moz-border-radius: 5px;
                                            border-radius: 5px;
                                            color: #383838;
                                            &.today {
                                                background: rgba(60, 210, 180, 0.18);
                                            }
                                            .day-number {
                                                position: absolute;
                                                text-align: center;
                                                line-height: 30px;
                                                width: 100%;
                                                margin-left: -4px;
                                                z-index: 9;
                                            }
                                        }
                                    }
                                    > .weeks {
                                        display: none;
                                    }
                                    .dates-events {
                                        .events-day {
                                            position: relative;
                                            min-height: 38px;
                                            max-height: 38px;
                                            height: 38px;
                                            .event-box {
                                                position: absolute;
                                                width: 100%;
                                                height: 26px;
                                                top: 6px;
                                                left: 0;
                                                .event-item {
                                                    width: 100%;
                                                    margin: 0;
                                                    padding: 0;
                                                    height: 26px;
                                                    background: rgba(60, 210, 180, 0.58);
                                                }
                                                .is-start {
                                                    -webkit-border-radius: 15px 0 0 15px;
                                                    -moz-border-radius: 15px 0 0 15px;
                                                    border-radius: 15px 0 0 15px;
                                                    &.is-end {
                                                        -webkit-border-radius: 15px;
                                                        -moz-border-radius: 15px;
                                                        border-radius: 15px;
                                                    }
                                                }
                                                .is-end {
                                                    -webkit-border-radius: 0 15px 15px 0;
                                                    -moz-border-radius: 0 15px 15px 0;
                                                    border-radius: 0 15px 15px 0;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            > .year-view {
                                width: 100%;
                                height: 278px;
                                padding: 10px 0 0;
                                .year-header {
                                    width: 100%;
                                    height: 28px;
                                    line-height: 28px;
                                    text-align: center;
                                    font-size: 14px;
                                    > a {
                                        display: block;
                                        width: 28px;
                                        height: 28px;
                                        border: 1px solid #ededed;
                                        -webkit-border-radius: 50%;
                                        -moz-border-radius: 50%;
                                        border-radius: 50%;
                                        text-indent: 100px;
                                        background: url("../../assets/images/calendar-arrow-right.png") no-repeat center / 68%;
                                        -webkit-transition: all 0.3s;
                                        -moz-transition: all 0.3s;
                                        -ms-transition: all 0.3s;
                                        -o-transition: all 0.3s;
                                        transition: all 0.3s;
                                        &:hover {
                                            background-color: rgba(60, 210, 180, 0.28);
                                            border: 1px solid rgba(60, 210, 180, 0.2);
                                        }
                                        &.prev-year {
                                            float: left;
                                            -webkit-transform: rotate(180deg);
                                            -moz-transform: rotate(180deg);
                                            -ms-transform: rotate(180deg);
                                            -o-transform: rotate(180deg);
                                            transform: rotate(180deg);
                                        }
                                        &.next-year {
                                            float: right;
                                        }
                                    }
                                }
                                .year-months {
                                    > ul {
                                        display: flex;
                                        justify-content: space-between;
                                        flex-wrap: wrap;
                                        > li {
                                            position: relative;
                                            width: 33.33%;
                                            height: 60px;
                                            line-height: 60px;
                                            text-align: center;
                                            font-size: 14px;
                                            > span {
                                                position: absolute;
                                                left: 0;
                                                top: 0;
                                                width: 100%;
                                                height: 60px;
                                                z-index: 9;
                                            }
                                            > .month-bg {
                                                position: absolute;
                                                /*left: 0;*/
                                                top: 0;
                                                /*right: 0;*/
                                                bottom: 0;
                                                margin: auto;
                                                width: 60%;
                                                max-width: 100%!important;
                                                height: 35px;
                                                background: rgba(60, 210, 180, 0.58);
                                                &.is-start {
                                                    -webkit-border-radius: 18px 0 0 18px;
                                                    -moz-border-radius: 18px 0 0 18px;
                                                    border-radius: 18px 0 0 18px;
                                                    &.is-end {
                                                        -webkit-border-radius: 18px;
                                                        -moz-border-radius: 18px;
                                                        border-radius: 18px;
                                                    }
                                                }
                                                &.is-end {
                                                    -webkit-border-radius: 0 18px 18px 0;
                                                    -moz-border-radius: 0 18px 18px 0;
                                                    border-radius: 0 18px 18px 0;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                > .schedule-view {
                    width: 100%;
                    height: 413px;
                    margin: 15px 0 0;
                    /*overflow: hidden;*/
                    > h1 {
                        padding: 0 20px;
                        line-height: 30px;
                        font-weight: normal;
                        overflow: hidden;
                        > span {
                            float: left;
                            font-size: 15px;
                            color: #777;
                        }
                        > a {
                            font-weight: normal;
                            font-size: 14px;
                            float: right;
                            color: #bdbdbd;
                            > i {
                                float: left;
                                font-size: 20px;
                                margin: 5px 5px 0 0;
                                &.ivu-icon-android-checkbox-outline {
                                    color: @base;
                                }
                            }
                        }
                    }
                    > .schedule-container {
                        margin-top: 5px;
                        height: 378px;
                        /*display: flex;*/
                        /*justify-content: space-between;*/
                        /*overflow: hidden;*/
                        .schedule-table-header {
                            width: 100%;
                            height: 48px;
                            background: rgba(60, 210, 180, 0.28);
                            padding-right: 20px;
                            /*border-top: 1px solid #ededed;*/
                            /*border-bottom: 1px solid #ededed;*/
                            > .title-bar {
                                float: left;
                                width: 30.85%;
                                height: 48px;
                                border-top: 1px solid #ededed;
                                border-bottom: 1px solid #ededed;
                                border-right: 1px solid #ededed;
                                display: flex;
                                justify-content: space-between;
                                font-weight: normal;
                                font-size: 13px;
                                color: #bdbdbd;
                                background: #fafbfb;
                                padding: 0 0 0 20px;
                                > span {
                                    flex: 1;
                                    line-height: 22px;
                                    text-align: center;
                                    &:first-child {
                                        flex: 1.2;
                                        line-height: 48px;
                                        text-align: left;
                                    }
                                }
                            }
                            .date-header-list {
                                position: relative;
                                float: left;
                                width: 69.15%;
                                height: 48px;
                                /*margin: 0 1.1% 0 0;*/
                                /*background: rgba(60, 210, 180, 0.28);*/
                                overflow: hidden;
                                ul {
                                    display: flex;
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    /*background: rgba(60, 210, 180, 0.28);*/
                                    li {
                                        display: block;
                                        float: left;
                                        width: 80px;
                                        line-height: 48px;
                                        text-align: center;
                                        font-size: 12px;
                                        color: #666;
                                    }
                                }
                            }
                        }
                        .schedule-table-body {
                            /*width: 100.6%;*/
                            height: 330px;
                            padding-right: 6px;
                            position: relative;
                            overflow-x: hidden;
                            overflow-y: auto;
                        }
                        .schedule-left-content {
                            float: left;
                            border-right: 1px solid #ededed;
                            width: 30.66%;
                            min-height: 328px;
                            padding: 0 0 0 20px;
                            > .title-bar {
                                width: 100%;
                                height: 48px;
                                border-top: 1px solid #ededed;
                                border-bottom: 1px solid #ededed;
                                display: flex;
                                justify-content: space-between;
                                font-weight: normal;
                                font-size: 14px;
                                color: #888;
                                > span {
                                    flex: 1;
                                    line-height: 22px;
                                    text-align: center;
                                    &:first-child {
                                        flex: 1.2;
                                        line-height: 48px;
                                        text-align: left;
                                    }
                                }
                            }
                            .producer-list {
                                width: 100%;
                                > ul {
                                    li {
                                        display: flex;
                                        justify-content: space-between;
                                        padding: 8px 0;
                                        text-align: center;
                                        .producer-cell {
                                            flex: 1;
                                            overflow: hidden;
                                            -ms-text-overflow: ellipsis;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            line-height: 32px;
                                            font-size: 13px;
                                            color: #777;
                                            label {
                                                position: relative;
                                                display: block;
                                                float: left;
                                                width: 32px;
                                                height: 32px;
                                                margin: 0 8px 0 0;
                                                border: 1px solid #eee;
                                                -webkit-border-radius: 50%;
                                                -moz-border-radius: 50%;
                                                border-radius: 50%;
                                                overflow: hidden;
                                                > img {
                                                    position: absolute;
                                                    top: 0;
                                                    left: 0;
                                                    right: 0;
                                                    bottom: 0;
                                                    margin: auto;
                                                    max-width: 100%;
                                                    max-height: 100%;
                                                }
                                            }
                                            span {
                                                float: left;
                                                /*line-height: 32px;*/
                                            }

                                            &:first-child {
                                                flex: 1.2;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        .schedule-comp-content {
                            float: left;
                            width: 69%;
                        }
                    }
                }
            }
        }
    }

</style>
