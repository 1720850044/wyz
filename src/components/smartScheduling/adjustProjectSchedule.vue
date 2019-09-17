<template>
    <div class="project-schedule-modify-wrap">
        <div class="project-schedule-modify-modal">
            <div class="project-schedule-header">
                <h1>{{$t('project.pro_timeAndTypeAdjust')}}<a class="close-adjust-schedule-btn" @click="closeAdjustSchedule()"><Icon type="android-close"></Icon></a></h1>
            </div>
            <div class="project-schedule-body">
                <div class="apprise-row">
                    <a class="apprise-check" @click="checkNotice()">
                        <Icon type="android-checkbox-outline-blank" v-if="!checkNoticeBox"></Icon>
                        <Icon type="android-checkbox-outline" v-else></Icon>
                        <span>{{$t('project.pro_notifyAllMembers')}}</span>
                    </a>
                    <input class="enter-notice" type="text" :placeholder="$t('project.pro_adjustmentContent')" v-model="adjustParams.descript" />
                </div>
                <div class="project-date-percent" id="datePercent">

                    <div class="current-project-cycle" :class="{'paused-bg': showPauseIcon, 'stoped-bg': showStopIcon}" v-if="showCurrentProjectDate"></div>
                    <div class="adjust-project-cycle" :style="{width: adjustProjectDate.width, left: adjustProjectDate.left}" v-if="showAdjustProjectDate"></div>
                </div>
                <div class="project-produce">
                    <ul>
                        <li>
                            <b></b>
                            <label>{{$t('project.pro_nowProjectTime')}}</label>
                            <span>{{projectBaseData.startDate}} ~ {{projectBaseData.endDate}} {{projectBaseData.workDay}}{{$t('project.pro_workDay')}}</span>
                        </li>
                        <li class="arrow-icon" v-if="showAdjustProjectDate">
                            <Icon type="ios-arrow-thin-right"></Icon>
                        </li>
                        <li class="show-adjust-date" v-if="showAdjustProjectDate">
                            <b></b>
                            <label>{{$t('project.pro_adjustedProjectTime')}}</label>
                            <span>{{adjustProjectDate.startDate}} ~ {{adjustProjectDate.endDate}} {{adjustProjectDate.workDay}}{{$t('project.pro_workDay')}}</span>
                        </li>
                    </ul>
                </div>
                <!-- operation -->
                <div class="operation-items" id="operationItems">
                    <ul>
                        <li class="pause-project" :class="{'selected-item': whichItem === 'pause' || whichItem === 'recover'}" @click="chooseCurrentItem('pause')">
                            <a :class="{'selected-item-a': whichItem === 'pause' || whichItem === 'recover'}">
                                <i class="iconfonts icon-pause1" v-if="showPauseIcon" :class="{'selected-item-a': whichItem === 'pause'}"></i>
                                <i class="iconfonts icon-shortleave" v-else :class="{'selected-item-a': whichItem === 'recover'}"></i>
                                <span v-if="showPauseIcon">{{$t('project.pro_startUpProject')}}</span>
                                <span v-else>{{$t('project.pro_pauseProject')}}</span>
                            </a>
                            <span>{{$t('project.pro_pauseAllProject')}}</span>
                        </li>
                        <li class="forward-project" :class="{'selected-item': whichItem === 'forward'}" @click="chooseCurrentItem('forward')">
                            <a :class="{'selected-item-a': whichItem === 'forward'}">
                                <i class="iconfonts icon-forward" :class="{'selected-item-a': whichItem === 'forward'}"></i>
                                <!--<Icon class="last-left-arrow" :class="{'selected-item-a': whichItem === 'forward'}" type="arrow-left-b"></Icon>-->
                                <span>{{$t('lang.lang_aheadSchedule')}}</span>
                                <p :class="{'selected-border': whichItem === 'forward'}">
                                    <input type="text" :class="{'selected-item-bg-none': whichItem === 'forward'}" v-model="adjustParams.forward" @keyup="changeProjectDate(adjustParams.forward, 'forward')" />
                                </p>
                                <span>{{$t('lang.lang_day')}}</span>
                            </a>
                            <span>{{$t('project.pro_aheadScheduleAllProject')}}</span>
                        </li>
                        <li class="delay-project" :class="{'selected-item': whichItem === 'delay'}" @click="chooseCurrentItem('delay')">
                            <a :class="{'selected-item-a': whichItem === 'delay'}">
                                <i class="iconfonts icon-forward" :class="{'selected-item-a': whichItem === 'delay'}"></i>
                                <!--<Icon class="last-right-arrow" :class="{'selected-item-a': whichItem === 'delay'}" type="arrow-right-b"></Icon>-->
                                <span>{{$t('lang.lang_postpone')}}</span>
                                <p :class="{'selected-border': whichItem === 'delay'}">
                                    <input type="text" :class="{'selected-item-bg-none': whichItem === 'delay'}" v-model="adjustParams.delay" @keyup="changeProjectDate(adjustParams.delay, 'delay')" />
                                </p>
                                <span>{{$t('lang.lang_day')}}</span>
                            </a>
                            <span>{{$t('project.pro_allTaskPostpone')}}</span>
                        </li>
                        <li class="increase-project" :class="{'selected-item': whichItem === 'increase'}" @click="chooseCurrentItem('increase')">
                            <a :class="{'selected-item-a': whichItem === 'increase'}">
                                <i class="iconfonts icon-add1" :class="{'selected-item-a': whichItem === 'increase'}"></i>
                                <span>{{$t('lang.lang_add')}}</span>
                                <p :class="{'selected-border': whichItem === 'increase'}">
                                    <input type="text" :class="{'selected-item-bg-none': whichItem === 'increase'}" v-model="adjustParams.increase" @keyup="changeProjectDate(adjustParams.increase, 'increase')" />
                                </p>
                                <span>{{$t('lang.lang_day')}}</span>
                            </a>
                            <span>{{$t('project.pro_allTaskAddTime')}}</span>
                        </li>
                        <li class="decrease-project" :class="{'selected-item': whichItem === 'decrease'}" @click="chooseCurrentItem('decrease')">
                            <a :class="{'selected-item-a': whichItem === 'decrease'}">
                                <i class="iconfonts icon-reduce" :class="{'selected-item-a': whichItem === 'decrease'}"></i>
                                <span>{{$t('lang.lang_decrease')}}</span>
                                <p :class="{'selected-border': whichItem === 'decrease'}">
                                    <input type="text" :class="{'selected-item-bg-none': whichItem === 'decrease'}" v-model="adjustParams.decrease" @keyup="changeProjectDate(adjustParams.decrease, 'decrease')" />
                                </p>
                                <span>{{$t('lang.lang_day')}}</span>
                            </a>
                            <span>{{$t('project.pro_decreaseTaskTime')}}</span>
                        </li>
                        <li class="stop-project" :class="{'selected-item':  whichItem === 'stop' || whichItem === 'restart'}" @click="chooseCurrentItem('stop')">
                            <a :class="{'selected-item-a': whichItem === 'stop' || whichItem === 'restart'}">
                                <i class="iconfonts icon-pause1" v-if="showStopIcon" :class="{'selected-item-a': whichItem === 'stop'}"></i>
                                <i class="iconfonts icon-stop" v-else :class="{'selected-item-a': whichItem === 'restart'}"></i>
                                <span v-if="!showStopIcon">{{$t('project.pro_stopProject')}}</span>
                                <span v-else>{{$t('project.pro_startProject')}}</span>
                            </a>
                            <span>{{$t('project.pro_stopAllTask')}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="project-schedule-footer">
                <a class="save-adjust" @click="saveAdjust()">{{$t('project.pro_saveAdjust')}}</a>
            </div>
        </div>

        <template>
            <div class="confirm-adjust-modal-wrap" v-if="confirmModal">
                <div class="confirm-adjust-modal">
                    <div class="project-schedule-header">
                        <h1>{{$t('project.pro_confirmAdjust')}}<a class="close-adjust-schedule-btn" @click="closeConfirmAdjustModal()"><Icon type="android-close"></Icon></a></h1>
                    </div>
                    <div class="project-schedule-body">
                        <div class="apprise-row">
                            <a class="apprise-check" @click="checkNotice()">
                                <Icon type="android-checkbox-outline-blank" v-if="!checkNoticeBox"></Icon>
                                <Icon type="android-checkbox-outline" v-else></Icon>
                                <span>{{$t('project.pro_notifyAllMembers')}}</span>
                            </a>

                            <input class="enter-notice" type="text" :placeholder="$t('project.pro_enterNotifyContent')" v-model="adjustParams.descript" />
                        </div>
                        <div class="project-date-percent">
                            <div class="current-project-cycle" :class="{'paused-bg': showPauseIcon, 'stoped-bg': showStopIcon}" v-if="showCurrentProjectDate"></div>
                            <div class="adjust-project-cycle" :style="{width: adjustProjectDate.width, left: adjustProjectDate.left}" v-if="showAdjustProjectDate"></div>
                        </div>
                        <div class="project-produce">
                            <ul>
                                <li>
                                    <b></b>
                                    <label>{{$t('project.pro_nowProjectTime')}}</label>
                                    <span>{{projectBaseData.startDate}} ~ {{projectBaseData.endDate}} {{projectBaseData.workDay}}{{$t('project.pro_workDay')}}</span>
                                </li>
                                <li class="arrow-icon" v-if="showAdjustProjectDate">
                                    <Icon type="ios-arrow-thin-right"></Icon>
                                </li>
                                <li class="show-adjust-date" v-if="showAdjustProjectDate">
                                    <b></b>
                                    <label>{{$t('project.pro_adjustedProjectTime')}}</label>
                                    <span>{{adjustProjectDate.startDate}} ~ {{adjustProjectDate.endDate}} {{adjustProjectDate.workDay}}{{$t('project.pro_workDay')}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="operation-items">
                            <ul>
                                <li class="pause-project" :class="{'selected-item': whichItem === 'pause' || whichItem === 'recover'}" @click="chooseCurrentItem('pause')" v-if="whichItem === 'pause' || whichItem === 'recover'">
                                    <a :class="{'selected-item-a': whichItem === 'pause' || whichItem === 'recover'}">
                                        <i class="iconfonts icon-pause1" v-if="showPauseIcon" :class="{'selected-item-a': whichItem === 'pause'}"></i>
                                        <i class="iconfonts icon-shortleave" v-else :class="{'selected-item-a': whichItem === 'recover'}"></i>
                                        <span v-if="showPauseIcon">{{$t('project.pro_startUpProject')}}</span>
                                        <span v-else>{{$t('project.pro_pauseProject')}}</span>
                                    </a>
                                    <span>{{$t('project.pro_pauseAllProject')}}</span>
                                </li>
                                <li class="forward-project" :class="{'selected-item': whichItem === 'forward'}" @click="chooseCurrentItem('forward')" v-if="whichItem === 'forward'">
                                    <a :class="{'selected-item-a': whichItem === 'forward'}">
                                        <i class="iconfonts icon-forward" :class="{'selected-item-a': whichItem === 'forward'}"></i>
                                        <!--<Icon class="last-left-arrow" :class="{'selected-item-a': whichItem === 'forward'}" type="arrow-left-b"></Icon>-->
                                        <span>{{$t('lang.lang_aheadSchedule')}}</span>
                                        <p :class="{'selected-border': whichItem === 'forward'}">
                                            <input type="text" :class="{'selected-item-bg-none': whichItem === 'forward'}" v-model="adjustParams.forward" @keyup="changeProjectDate(adjustParams.forward, 'forward')" />
                                        </p>
                                        <span>{{$t('lang.lang_day')}}</span>
                                    </a>
                                    <span>{{$t('project.pro_aheadScheduleAllProject')}}</span>
                                </li>
                                <li class="delay-project" :class="{'selected-item': whichItem === 'delay'}" @click="chooseCurrentItem('delay')" v-if="whichItem === 'delay'">
                                    <a :class="{'selected-item-a': whichItem === 'delay'}">
                                        <i class="iconfonts icon-forward" :class="{'selected-item-a': whichItem === 'delay'}"></i>
                                        <!--<Icon class="last-right-arrow" :class="{'selected-item-a': whichItem === 'delay'}" type="arrow-right-b"></Icon>-->
                                        <span>{{$t('lang.lang_postpone')}}</span>
                                        <p :class="{'selected-border': whichItem === 'delay'}">
                                            <input type="text" :class="{'selected-item-bg-none': whichItem === 'delay'}" v-model="adjustParams.delay" @keyup="changeProjectDate(adjustParams.delay, 'delay')" />
                                        </p>
                                        <span>{{$t('lang.lang_day')}}</span>
                                    </a>
                                    <span>{{$t('project.pro_allTaskPostpone')}}</span>
                                </li>
                                <li class="increase-project" :class="{'selected-item': whichItem === 'increase'}" @click="chooseCurrentItem('increase')" v-if="whichItem === 'increase'">
                                    <a :class="{'selected-item-a': whichItem === 'increase'}">
                                        <i class="iconfonts icon-add1" :class="{'selected-item-a': whichItem === 'increase'}"></i>
                                        <span>{{$t('lang.lang_add')}}</span>
                                        <p :class="{'selected-border': whichItem === 'increase'}">
                                            <input type="text" :class="{'selected-item-bg-none': whichItem === 'increase'}" v-model="adjustParams.increase" @keyup="changeProjectDate(adjustParams.increase, 'increase')" />
                                        </p>
                                        <span>{{$t('lang.lang_day')}}</span>
                                    </a>
                                    <span>{{$t('project.pro_allTaskAddTime')}}</span>
                                </li>
                                <li class="decrease-project" :class="{'selected-item': whichItem === 'decrease'}" @click="chooseCurrentItem('decrease')" v-if="whichItem === 'decrease'">
                                    <a :class="{'selected-item-a': whichItem === 'decrease'}">
                                        <i class="iconfonts icon-reduce" :class="{'selected-item-a': whichItem === 'decrease'}"></i>
                                        <span>{{$t('lang.lang_decrease')}}</span>
                                        <p :class="{'selected-border': whichItem === 'decrease'}">
                                            <input type="text" :class="{'selected-item-bg-none': whichItem === 'decrease'}" v-model="adjustParams.decrease" @keyup="changeProjectDate(adjustParams.decrease, 'decrease')" />
                                        </p>
                                        <span>{{$t('lang.lang_day')}}</span>
                                    </a>
                                    <span>{{$t('project.pro_decreaseTaskTime')}}</span>
                                </li>
                                <li class="stop-project" :class="{'selected-item':  whichItem === 'stop' || whichItem === 'restart'}" v-if="whichItem === 'stop' || whichItem === 'restart'" @click="chooseCurrentItem('stop')">
                                    <a :class="{'selected-item-a': whichItem === 'stop' || whichItem === 'restart'}">
                                        <i class="iconfonts icon-pause1" v-if="showStopIcon" :class="{'selected-item-a': whichItem === 'stop'}"></i>
                                        <i class="iconfonts icon-stop" v-else :class="{'selected-item-a': whichItem === 'restart'}"></i>
                                        <span v-if="!showStopIcon">{{$t('project.pro_stopProject')}}</span>
                                        <span v-else>{{$t('project.pro_startProject')}}</span>
                                    </a>
                                    <span>{{$t('project.pro_stopAllTask')}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="confirm-modal-tips">
                            <p>{{$t('project.pro_adjustAllTaskCannotUndone')}}</p>
                            <p class="last-confirm-p">{{$t('project.pro_doYouConfirmAdjust')}}</p>
                        </div>
                    </div>
                    <div class="project-schedule-footer">
                        <a class="confirm-adjust" @click="confirmAdjust()">{{$t('lang.lang_ok')}}</a>
                        <a class="cancel-adjust" @click="cancelAdjust()">{{$t('lang.lang_abandon')}}</a>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "adjustProjectSchedule",
        props: {
            projectBaseData: {
                type: Object,
                default: () => ({
                    startDate: '-',
                    endDate: '-',
                    workDay: '-'
                })
            }
        },
        data () {
            return {
                checkNoticeBox: true,
                adjustParams: {},
                whichItem: '',
                showPauseIcon: false,
                showStopIcon: false,
                showCurrentProjectDate: true,
                showAdjustProjectDate: false,
                adjustProjectDate: {
                    startDate: null,
                    endDate: null,
                    workDay: null,
                    width: null,
                    left: null
                },
                confirmModal: false
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.adjustParams.notice = 1;
                if (this.projectBaseData) {
                    switch (this.projectBaseData.status) {
                        case '1':
                            this.showPauseIcon = false;
                            this.showStopIcon = false;
                            break;
                        case '2':
                            this.showPauseIcon = true;
                            this.showStopIcon = false;
                            break;
                        case '4':
                            this.showPauseIcon = false;
                            this.showStopIcon = true;
                            break;
                    }
                    return {
                        showPauseIcon: this.showPauseIcon,
                        showStopIcon: this.showStopIcon
                    };
                }
            },
            checkNotice () {
                this.checkNoticeBox = !this.checkNoticeBox;
                this.adjustParams.notice = this.checkNoticeBox ? 1 : 0;
            },
            chooseCurrentItem (type) {
                this.showAdjustProjectDate = false;
                this.whichItem = type;
                this.adjustParams.forward = null;
                this.adjustParams.delay = null;
                this.adjustParams.increase = null;
                this.adjustParams.decrease = null;
                this.adjustParams.stop = null;
                this.adjustParams.pause = null;
                // this.showPauseIcon = false;
                // this.showStopIcon = false;
                if (type === 'pause') {
                    this.showStopIcon = this.init().showStopIcon;
                    this.adjustParams.stop = null;
                    this.whichItem = this.showPauseIcon ? 'recover' : 'pause';
                    this.showPauseIcon = !this.showPauseIcon;
                    this.adjustParams.pause = this.showPauseIcon ? 1 : 2;
                } else if (type === 'stop') {
                    this.showPauseIcon = this.init().showPauseIcon;
                    this.adjustParams.pause = null;
                    this.whichItem = this.showStopIcon ? 'restart' : 'stop';
                    this.showStopIcon = !this.showStopIcon;
                    this.adjustParams.stop = this.showStopIcon ? 1 : 2;
                } else {
                    this.showPauseIcon = this.init().showPauseIcon;
                    this.showStopIcon = this.init().showStopIcon;
                }
            },
            changeProjectDate (day, type) {
                day = parseInt(day);
                this.whichItem = type;
                if (!day || day <= 0) {
                    day = 0;
                    this.showAdjustProjectDate = false;
                    this.adjustProjectDate = {
                        startDate: null,
                        endDate: null
                    };
                } else {
                    switch (type) {
                        case 'forward':
                            this.forwardDate(day);
                            break;
                        case 'delay':
                            this.delayDate(day);
                            break;
                        case 'increase':
                            this.increaseDate(day);
                            break;
                        case 'decrease':
                            this.decreaseDate(day);
                            break;
                    }
                }
            },
            // 将天数转化为毫秒
            switchDaysToMs (day) {
                return day * 24 * 60 * 60 * 1000;
            },
            formatDate (date, fmt) {
                let o = {
                    'M+': date.getMonth() + 1,                    //月份
                    'd+': date.getDate(),                        //日
                    'h+': date.getHours(),                       //小时
                    'm+': date.getMinutes(),                     //分
                    's+': date.getSeconds(),                     //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds()                 //毫秒
                };
                if (/(y+)/.test(fmt)) {   //年份
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                for (let k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        let str = o[k] + '';
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
                    }
                }
                return fmt;
            },
            padLeftZero (str) {
                return ('00' + str).substr(str.length);
            },
            // 时间转化
            switchDate () {
                let oldStartDate = this.projectBaseData.startDate;
                let oldEndDate = this.projectBaseData.endDate;
                let oldStartDateMs = new Date(oldStartDate).getTime();
                let oldEndDateMs = new Date(oldEndDate).getTime();
                return {
                    oldStartDateMs: oldStartDateMs,
                    oldEndDateMs: oldEndDateMs
                };
            },
            forwardDate (day) {
                let oldDateMs = this.switchDate();
                let adjustStartDate = new Date(oldDateMs.oldStartDateMs - this.switchDaysToMs(day));
                let adjustEndDate = new Date(oldDateMs.oldEndDateMs - this.switchDaysToMs(day));
                adjustStartDate = this.formatDate(adjustStartDate, 'yyyy-MM-dd');
                adjustEndDate = this.formatDate(adjustEndDate, 'yyyy-MM-dd');
                this.showAdjustProjectDate = true;
                this.adjustProjectDate.startDate = adjustStartDate;
                this.adjustProjectDate.endDate = adjustEndDate;
                this.adjustProjectDate.workDay = this.projectBaseData.workDay;
                this.adjustProjectDate.width = '40%';
                let left = (0.3 - (day / this.projectBaseData.workDay * 0.4)) * 100;
                this.adjustProjectDate.left = left >= 0 ? left + '%' : 0;
            },
            delayDate (day) {
                let oldDateMs = this.switchDate();
                let adjustStartDate = new Date(oldDateMs.oldStartDateMs + this.switchDaysToMs(day));
                let adjustEndDate = new Date(oldDateMs.oldEndDateMs + this.switchDaysToMs(day));
                adjustStartDate = this.formatDate(adjustStartDate, 'yyyy-MM-dd');
                adjustEndDate = this.formatDate(adjustEndDate, 'yyyy-MM-dd');
                this.showAdjustProjectDate = true;
                this.adjustProjectDate.startDate = adjustStartDate;
                this.adjustProjectDate.endDate = adjustEndDate;
                this.adjustProjectDate.workDay = this.projectBaseData.workDay;
                this.adjustProjectDate.width = '40%';
                let left = (0.3 + (day / this.projectBaseData.workDay * 0.4)) * 100;
                this.adjustProjectDate.left = left >= 60 ? 60 + '%' : left + '%';
            },
            increaseDate (day) {
                let oldDateMs = this.switchDate();
                let adjustEndDate = new Date(oldDateMs.oldEndDateMs + this.switchDaysToMs(day));
                adjustEndDate = this.formatDate(adjustEndDate, 'yyyy-MM-dd');
                this.showAdjustProjectDate = true;
                this.adjustProjectDate.startDate = this.projectBaseData.startDate;
                this.adjustProjectDate.endDate = adjustEndDate;
                this.adjustProjectDate.workDay = parseInt(this.projectBaseData.workDay) + day;
                this.adjustProjectDate.width = this.adjustProjectDate.workDay * 40 / this.projectBaseData.workDay >= 70 ? '70%' : this.adjustProjectDate.workDay * 40 / this.projectBaseData.workDay + '%';
                this.adjustProjectDate.left = '30%';
            },
            decreaseDate (day) {
                let oldDateMs = this.switchDate();
                let adjustEndDate = new Date(oldDateMs.oldEndDateMs - this.switchDaysToMs(day));
                adjustEndDate = this.formatDate(adjustEndDate, 'yyyy-MM-dd');
                this.showAdjustProjectDate = true;
                this.adjustProjectDate.startDate = this.projectBaseData.startDate;
                this.adjustProjectDate.endDate = adjustEndDate;
                this.adjustProjectDate.workDay = parseInt(this.projectBaseData.workDay) - day > 0 ? parseInt(this.projectBaseData.workDay) - day : 0;
                this.adjustProjectDate.width = this.adjustProjectDate.workDay * 40 / this.projectBaseData.workDay <= 0 ? '0%' : this.adjustProjectDate.workDay * 40 / this.projectBaseData.workDay + '%';
                this.adjustProjectDate.left = '30%';
            },
            saveAdjust () {
                // let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_project_control;
                let type = '';
                switch (this.whichItem) {
                    case 'forward':
                        type = 'advance';
                        break;
                    case 'delay':
                        type = 'postpone';
                        break;
                    case 'increase':
                        type = 'add';
                        break;
                    case 'decrease':
                        type = 'reduce';
                        break;
                    case 'restart':
                        type = 'recover';
                        break;
                    default:
                        type = this.whichItem;
                        break;
                }
                let params = {
                    project_id: sessionStorage.projectID,
                    type: type
                };
                if (type === 'pause' || type === 'recover' || type === 'stop') {
                    params.value = null;
                } else {
                    params.value = this.adjustParams[this.whichItem];
                }
                params.notice = this.adjustParams.notice;
                params.descript = this.adjustParams.descript;
                if (type && type.length >= 0) {
                    this.$emit('saveAdjustRequest', params);
                } else {
                    this.$Message.warning(i18n.t('project.pro_selectAction'));
                }
            },
            closeAdjustSchedule () {
                if (this.adjustParams) {
                    if (this.adjustParams.forward || this.adjustParams.delay || this.adjustParams.increase || this.adjustParams.decrease || this.adjustParams.pause || this.adjustParams.stop) {
                        this.confirmModal = true;
                    } else {
                        this.$emit('closeAdjustSchedule');
                    }
                }
            },
            confirmAdjust () {
                this.saveAdjust();
            },
            cancelAdjust () {
                this.closeConfirmAdjustModal();
                this.$emit('closeAdjustSchedule');
            },
            closeConfirmAdjustModal () {
                this.confirmModal = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    .project-schedule-header {
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
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                }
            }
        }
    }
    .project-schedule-body {
        width: 100%;
        padding: 20px;
        > .apprise-row {
            width: 100%;
            height: 30px;
            overflow: hidden;
            > a.apprise-check {
                float: left;
                line-height: 30px;
                color: #797979;
                > i {
                    float: left;
                    font-size: 22px;
                    color: #888;
                    margin: 3px 5px 0 2px;
                    &.ivu-icon-android-checkbox-outline {
                        color: @base;
                    }
                }
                > span {
                    float: left;
                    font-size: 14px;
                }
            }
            > .enter-notice {
                float: right;
                width: 500px;
                height: 30px;
                padding: 3px 6px;
                color: #666;
                border: 1px solid #ddd;
                outline: none;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                -webkit-transition: all 0.3s;
                -moz-transition: all 0.3s;
                -ms-transition: all 0.3s;
                -o-transition: all 0.3s;
                transition: all 0.3s;
                &:hover, &:focus {
                    border-color: @base;
                }
            }
        }
        > .project-date-percent {
            position: relative;
            width: 100%;
            height: 68px;
            margin: 15px 0 0;
            padding: 11px 0;
            background: rgba(60, 210, 180, 0.158);
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            > .current-project-cycle {
                position: absolute;
                left: 0;
                right: 0;
                width: 40%;
                height: 46px;
                border: 1px dashed #aaa;
                margin: 0 auto;
                background: rgba(60, 210, 180, 0.48);
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                border-radius: 5px;
                z-index: 1;
                &.paused-bg {
                    background: #fb0;
                }
                &.stoped-bg {
                    background: #f30;
                }
            }
            > .adjust-project-cycle {
                position: absolute;
                width: 50%;
                height: 46px;
                background: @base;
                margin: 0 auto;
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                border-radius: 5px;
            }
        }
        > .project-produce {
            width: 100%;
            margin: 15px 0;
            > ul {
                display: flex;
                justify-content: space-between;
                > li {
                    > b {
                        float: left;
                        display: block;
                        width: 15px;
                        height: 15px;
                        margin: 2px 3px 0 0;
                        -webkit-border-radius: 3px;
                        -moz-border-radius: 3px;
                        border-radius: 3px;
                    }
                    > label {
                        font-size: 12px;
                        color: #999;
                    }
                    &:first-child {
                        > b {
                            border: 1px dashed #aaa;
                            background: rgba(60, 210, 180, 0.48);
                        }
                    }
                    &.show-adjust-date {
                        > b {
                            background: @base;
                        }
                    }
                    &.arrow-icon {
                        /*width: 80px;*/
                        text-align: center;
                        margin: 0 8px;
                        > i {
                            float: left;
                            font-size: 26px;
                            line-height: 0;
                            margin: 8px 0 0;
                            color: #888;
                        }
                    }
                }
            }
        }
        > .operation-items {
            width: 100%;
            overflow: hidden;
            > ul {
                .selected-item {
                    background: rgba(60, 210, 180, 0.88);
                    color: #fff;
                }
                .selected-item-a {
                    color: #fff;
                }
                .selected-item-bg-none {
                    background: none;
                    color: #fff;
                }
                .selected-border {
                    border-color: #fff;
                }
                > li {
                    position: relative;
                    width: 100%;
                    height: 55px;
                    border: 1px solid #ddd;
                    margin: 10px 0 0;
                    padding: 0 10px;
                    line-height: 55px;
                    -webkit-border-radius: 5px;
                    -moz-border-radius: 5px;
                    border-radius: 5px;
                    display: flex;
                    justify-content: space-between;
                    color: #999;
                    cursor: pointer;
                    > a {
                        width: 40%;
                        font-size: 14px;
                        color: #595959;
                        > i {
                            float: left;
                            font-size: 24px;
                            color: #aaa;
                            margin: 15px 10px 0 0;
                        }
                        > span {
                            float: left;
                        }
                        > p {
                            float: left;
                            width: 70px;
                            height: 30px;
                            padding: 3px 0 0;
                            margin: 8px 10px 0;
                            border-bottom: 1px solid #ccc;
                            line-height: 30px;
                            > input {
                                text-align: center;
                                width: 68px;
                                height: 22px;
                                outline: none;
                                border: none;
                                font-weight: bold;
                            }
                        }
                    }
                    > span {
                        width: 60%;
                        text-align: left;
                    }
                    &.pause-project {
                        > a {
                            > i {
                                font-size: 23px;
                                margin: 16px 11px 0 3px;
                                &.icon-shortleave {
                                    font-size: 26px;
                                    margin: 14px 9px 0 2px;
                                }
                            }
                        }
                    }
                    &.forward-project {
                        > a {
                            > i {
                                font-size: 16px;
                                margin: 20px 10px 0 4px;
                                -webkit-transform: rotate(180deg);
                                -moz-transform: rotate(180deg);
                                -ms-transform: rotate(180deg);
                                -o-transform: rotate(180deg);
                                transform: rotate(180deg);
                                &.last-left-arrow {
                                    margin-left: -10px;
                                }
                            }
                        }
                    }
                    &.delay-project {
                        > a {
                            > i {
                                font-size: 16px;
                                margin: 20px 10px 0 4px;
                                &.last-right-arrow {
                                    margin-left: -10px;
                                }
                            }
                        }
                    }
                    &.increase-project {
                        > a {
                            > i {
                                font-size: 24px;
                                margin: 15px 10px 0 2px;
                            }
                        }
                    }
                    &.decrease-project {
                        > a {
                            > i {
                                font-size: 28px;
                                margin: 14px 8px 0 0;
                            }
                        }
                    }
                    &.stop-project {
                        > a {
                            > i {
                                &.icon-stop {
                                    font-size: 25px;
                                    margin: 15px 10px 0 2px;
                                }
                                &.icon-pause1 {
                                    font-size: 24px;
                                    margin: 15px 10px 0 3px;
                                }
                            }
                        }
                    }
                    > .disabled-mask {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        background: rgba(0, 0, 0, 0.3);
                    }
                }
            }
        }
    }
    .project-schedule-footer {
        position: absolute;
        bottom: 20px;
        width: 100%;
        height: 35px;
        padding: 0 20px;
        > a {
            display: block;
            float: right;
            font-size: 14px;
            padding: 6px 20px;
            margin: 0 0 0 15px;
            color: #fff;
            text-align: center;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
        }
        > .save-adjust {
            background: @base;
            &:hover {
                background: rgba(60, 210, 180, 0.86);
            }
        }
        > .confirm-adjust {
            background: @base;
            padding: 6px 35px;
            &:hover {
                background: rgba(60, 210, 180, 0.86);
            }
        }
        > .cancel-adjust {
            background: #f1f1f1;
            padding: 6px 35px;
            color: #666;
            &:hover {
                background: rgba(0, 0, 0, 0.1);
            }
        }
    }
    .project-schedule-modify-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;

        > .project-schedule-modify-modal {
            width: 718px;
            height: 708px;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            background: #fff;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            overflow: hidden;
        }
        > .confirm-adjust-modal-wrap {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.38);
            z-index: 999;
            > .confirm-adjust-modal {
                width: 718px;
                height: 480px;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
                background: #fff;
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                border-radius: 5px;
                overflow: hidden;
                z-index: 999;
                .confirm-modal-tips {
                    width: 100%;
                    margin: 20px 0;
                    padding: 10px;
                    font-size: 16px;
                    text-align: center;
                    line-height: 30px;
                    color: #888;
                    border: 1px dashed #fb0;
                    -webkit-border-radius: 5px;
                    -moz-border-radius: 5px;
                    border-radius: 5px;
                    > .last-confirm-p {
                        color: #fb0;
                    }
                }
            }
        }
    }

</style>
