<template>
    <div>
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span>
            </div>
        </main-native>
        <div class="content">
            <div class="table" id="scheduleTable">
                <div class="content-top">
                    <div @click="editer($event,0)"><em class="iconfonts icon-xinjian"></em>
                        {{$t('workbench.work_newEvent')}}
                    </div>
                    <div class="Calendartitle">
                        <i class="iconfonts icon-bottommore PrevIcon" @click="PrevMonth"></i>
                        <div class="positionDiv" @click.stop="selectUlFlag = true">
                            <span>{{currentDate.year}} {{$t('workbench.work_teamWorkYaerTag')}} {{currentDate.mounth}} {{$t('workbench.work_teamWorkMonthTag')}} <i
                                style="font-size: 13px">&#9660;</i></span>
                            <ul class="selectList" v-if="selectUlFlag" @mouseleave="selectUlFlag = false">
                                <li v-for="item in 12" @click="selectMounth(item)">{{currentDate.year}}
                                    {{$t('workbench.work_teamWorkYaerTag')}} {{item}}
                                    {{$t('workbench.work_teamWorkMonthTag')}}
                                </li>
                            </ul>
                        </div>
                        <i class="iconfonts icon-bottommore NextIcon" @click="NextMonth"></i>
                    </div>
                    <div>
                        <span @click="toNowDay" :class="{'selectSty':btnObj.nowDay}">{{$t('workbench.work_teamWorkMonthTag')}}</span>
                        <span @click="btnObj.Holiday = !btnObj.Holiday" :class="{'selectSty':btnObj.Holiday}">{{$t('workbench.work_holidayTag')}}</span>
                    </div>
                </div>
                <div class="content-center">
                    <div class="table-header">
                        <span>{{$t('workbench.work_Sunday')}}</span>
                        <span>{{$t('workbench.work_Monday')}}</span>
                        <span>{{$t('workbench.work_Tuesday')}}</span>
                        <span>{{$t('workbench.work_Wednesday')}}</span>
                        <span>{{$t('workbench.work_Thursday')}}</span>
                        <span>{{$t('workbench.work_Friday')}}</span>
                        <span>{{$t('workbench.work_Saturday')}}</span>
                    </div>
                    <div class="tabble-body">
                        <ul id="parentUl">
                            <li v-for="item in dayData">
                                <div v-for="creent in item"
                                     :class="[{'Month':creent.isexpired},{'creentDay':creent.isCreent}]"
                                     @click="editer($event,0,creent)">
                                    <em></em>
                                    <div class="cellSty">
                                        <p v-if="creent.isCreent" class="creentDay fontSize">{{creent.Time |
                                            monthCover}}</p>
                                        <p v-else class="fontSize">{{creent.day}}</p>
                                        <p class="Holiday" v-if="btnObj.Holiday">{{creent.Holiday}}</p>
                                        <dl v-if="!creent.shrinkFlag">
                                            <dd @click="editer($event,1,d,creent.isexpired)"
                                                v-for="(d,index) in creent.Evens_list" v-if="index < 4"
                                                :class="{'loopSty':d.type == '0'}" :title="d.content">
                                                <p>
                                                    <span v-if="d.Start_time != '0'" :class="`priority${d.priority}`">{{d.Start_time | coverTime}}&nbsp;</span>
                                                    <span
                                                        :class="[{'overflowText':d.Start_time != '0'},`priority${d.priority}`]">{{d.content | substr}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <span v-if="d.loop" class="iconfonts icon-inside-cycle"
                                                          :class="`priority${d.priority}`"></span>
                                                </p>
                                            </dd>
                                            <dd class="moreSty iconfonts icon-shenglve-"
                                                v-if="creent.Evens_list.length > 4"
                                                @click="creent.shrinkFlag = true"></dd>
                                        </dl>
                                        <dl v-else>
                                            <dd @click="editer($event,1,d,creent.isexpired)"
                                                v-for="(d,index) in creent.Evens_list"
                                                :class="{'loopSty':d.type == '0'}" :title="d.content">
                                                <p>
                                                    <span v-if="d.Start_time != '0'" :class="`priority${d.priority}`">{{d.Start_time | coverTime}}&nbsp;</span>
                                                    <span
                                                        :class="[{'overflowText':d.Start_time != '0'},`priority${d.priority}`]">{{d.content | substr}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <span v-if="d.loop" class="iconfonts icon-inside-cycle"
                                                          :class="`priority${d.priority}`"></span>
                                                </p>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="rightBlock">
                <Input v-model="searchObj.eventSearch" icon="ios-search" :placeholder="$t('workbench.work_allEvent')"
                       @keyup.enter.native="enterSearchEvents"></Input>
                <div class="toolBar">
                    <span class="leftTool">{{$t('workbench.work_eventTag')}}</span>
                    <span class="rightTool">
                        <i v-if="searchObj.flag" @click="reductionFun">{{$t('workbench.work_reduction')}}</i>
                        <Checkbox v-model="radioFlag" style="color: #ccc;margin-right: 0!important;">{{$t('workbench.work_complete')}}</Checkbox>
                    </span>
                </div>
                <div id="eventUl">
                    <ul class="eventUl">
                        <li v-for="item in incompleteEvens" :title="item.content">
                            <span :class="`priorityBackground${item.priority}`"></span>
                            <span>{{item.Time | monthCover}}</span>&nbsp;&nbsp;
                            <span v-if="item.Start_time != '0'">{{item.Start_time | coverTime}}&nbsp;&nbsp;</span>
                            <span class="contentSpan">{{item.content}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <Modal v-model="modal3" :title="modelTitle" :footer-hide="modelFooter" width="550"
               @on-cancel="moreFlag = false">
            <dl class="newEventDl">
                <dd>
                    <div class="selectColor" @mouseenter="mouseFlag.colorFlag = true"
                         @mouseleave="mouseFlag.colorFlag = false">
                        <em class="hoverSty" v-for="c in color" :style="{'background':c.color}"
                            v-if="eventsObj.priority == c.id" :key="c.id"></em>
                        <p class="hoverP" v-if="mouseFlag.colorFlag">
                            <!---->
                            <!-- @click="eventsObj.priority = c.id = mouseFlag.colorFlag = false" -->
                            <em v-for="c in color" :style="{'background':c.color}"
                                @click="selectColor(c)" :key="c.id"></em>
                        </p>
                    </div>
                    <Input v-model="eventsObj.title" :placeholder="$t('workbench.work_eventTitle')"
                           style="width: 455px"/>
                    <!--<input class="eventTitle" v-model="eventsObj.title" type="text" placeholder="事件标题"/>-->
                </dd>
                <dd>
                    <span class="leftIcon"></span>
                    <div class="rightBlock">
                        <DatePicker v-if="eventsObj.type" :value="eventsObj.Date" @on-change="eventsObj.Date = $event"
                                    type="date" style="width: 85%" :placeholder="$t('lang.lang_date')"></DatePicker>
                        <DatePicker v-if="!eventsObj.type" :value="eventsObj.Date" @on-change="eventsObj.Date = $event"
                                    type="date" style="width: 30%" :placeholder="$t('lang.lang_date')"></DatePicker>
                        <TimePicker v-if="!eventsObj.type" :value="eventsObj.Start_time"
                                    @on-change="eventsObj.Start_time = $event" format="HH:mm" :placeholder="$t('workbench.work_startTime')"
                                    style="width: 100px"></TimePicker>
                        <span v-if="!eventsObj.type"> - </span>
                        <TimePicker v-if="!eventsObj.type" :value="eventsObj.End_time"
                                    @on-change="eventsObj.End_time = $event" format="HH:mm" :placeholder="$t('workbench.work_endTime')"
                                    style="width: 100px"></TimePicker>
                        <i-switch v-model="eventsObj.type">
                            <span slot="open">{{$t('workbench.work_onFlag')}}</span>
                            <span slot="close">{{$t('workbench.work_offFlag')}}</span>
                        </i-switch>
                    </div>
                </dd>
                <dd>
                    <div class="leftTips">
                        <span class="leftIcon" style="background-position: 0 -50px !important;"></span>
                        <span class="tips">{{$t('workbench.work_remind')}}</span>
                    </div>
                    <Select v-model="eventsObj.Remind" style="width:85%">
                        <Option :value="item.key" :key="item.key" v-for="item in Remind">{{item.label}}</Option>
                    </Select>
                </dd>
                <dd>
                    <div class="leftTips">
                        <span class="leftIcon" style="background-position: 0 -101px !important;"></span>
                        <span class="tips">{{$t('workbench.work_repeat')}}</span>
                    </div>
                    <Select v-model="eventsObj.loop" style="width:85%">
                        <Option :value="item.key" :key="item.key" v-for="item in loopArr">{{item.label}}</Option>
                    </Select>
                </dd>
                <div v-if="moreFlag">
                    <dd>
                        <div class="leftTips">
                            <span class="leftIcon" style="background-position: 0 -151px !important;"></span>
                            <span class="tips">{{$t('workbench.work_workContent')}}</span>
                        </div>
                        <template>
                            <RadioGroup v-model="eventsObj.selectType">
                                <Radio label="1">
                                    <span>{{$t('lang.lang_project')}}</span>
                                </Radio>
                                <Radio label="2">
                                    <span>{{$t('lang.lang_contract')}}</span>
                                </Radio>
                            </RadioGroup>
                            <Select v-model="eventsObj.project" style="width:50%" v-if="eventsObj.selectType == 1"
                                    :placeholder="$t('workbench.work_selectProject')">
                                <Option v-for="item in contractAndproject.project" :value="item.id" :key="item.id">{{
                                    item.name }}
                                </Option>
                            </Select>
                            <Select v-model="eventsObj.contract" style="width:50%" v-if="eventsObj.selectType == 2"
                                    :placeholder="$t('workbench.work_selectContract')">
                                <Option v-for="item in contractAndproject.contract" :value="item.id" :key="item.id">{{
                                    item.contract_name }}
                                </Option>
                            </Select>
                        </template>
                    </dd>
                    <dd>
                        <div class="leftTips">
                            <span class="leftIcon" style="background-position: 0 -202px !important;"></span>
                            <span class="tips">{{$t('workbench.work_noticeMember')}}</span>
                        </div>
                        <Select v-model="eventsObj.member" multiple style="width:80%">
                            <Option v-for="item in memberList" :value="item.user_id" :key="item.user_id">{{
                                item.realname }}
                            </Option>
                        </Select>
                    </dd>
                    <dd>
                        <div class="leftTips">
                            <span class="leftIcon" style="background-position: 0 -253px !important;"></span>
                            <span class="tips">{{$t('workbench.work_addrees')}}</span>
                        </div>
                        <Input v-model="eventsObj.address" :placeholder="$t('workbench.work_eventAddress')" style="width: 420px"/>
                        <!--<input class="eventAddress" v-model="eventsObj.address" type="text" placeholder="事件地点"/>-->
                    </dd>
                </div>
            </dl>
            <div slot="footer" class="modelFooter">
                <button class="moreSelect" @click="moreFlag = true" v-if="!moreFlag">{{$t('workbench.work_moreSelect')}}</button>
                <button class="saveData" @click="saveData">{{$t('lang.lang_save')}}</button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api, {schedule} from 'api';
    import mainNative from '../main-components/mainNative.vue';
    // import {schedule} from 'api';

    export default {
        components: {
            mainNative
        },
        data() {
            return {
                btnObj: {
                    nowDay: true,
                    Holiday: false
                },
                dayData: [],
                taskArr: [],
                currentDate: {
                    getDate: new Date(),
                    dateTile: null,
                    year: null,
                    mounth: null
                },
                modal3: false,
                switch1: true,
                eventsObj: {
                    id: null,
                    title: null,
                    Date: null,
                    priority: 1,
                    type: true,
                    Start_time: null,
                    End_time: null,
                    Remind: 0,
                    loop: 0,
                    contract: null,
                    project: null,
                    member: [],
                    address: null,
                    selectType: '1'
                },
                modelTitle: i18n.t('workbench.work_newEvent'),
                modelFooter: false,

                incompleteEvens: [],
                radioFlag: false,
                loopArr: [
                    {
                        key: 0,
                        label: i18n.t('workbench.work_never')
                    },
                    {
                        key: 1,
                        label: i18n.t('workbench.work_Daily')
                    },
                    {
                        key: 2,
                        label: i18n.t('workbench.work_weekly')
                    },
                    {
                        key: 3,
                        label: i18n.t('workbench.work_monthly')
                    }
                ],
                Remind: [
                    {
                        key: 0,
                        label: i18n.t('workbench.work_never')
                    },
                    {
                        key: 1,
                        label: i18n.t('workbench.work_1MinutesAgo')
                    },
                    {
                        key: 2,
                        label: i18n.t('workbench.work_5MinutesAgo')
                    },
                    {
                        key: 3,
                        label: i18n.t('workbench.work_halfAnHourAgo')
                    },
                    {
                        key: 4,
                        label: i18n.t('workbench.work_1HoursAgo')
                    },
                    {
                        key: 5,
                        label: i18n.t('workbench.work_halfaDayAgo')
                    },
                    {
                        key: 6,
                        label: i18n.t('workbench.work_1DaysAgo')
                    }
                ],
                memberList: [],
                contractAndproject: {
                    project: [],
                    contract: []
                },

                searchObj: {
                    flag: false,
                    eventSearch: null,
                    searchList: []
                },

                mouseFlag: {
                    colorFlag: false
                },
                color: [
                    {
                        color: '#33cccc',
                        id: 7
                    },
                    {
                        color: '#1877d6',
                        id: 6
                    },
                    {
                        color: '#f31515',
                        id: 5
                    },
                    {
                        color: '#f3b806',
                        id: 4
                    },
                    {
                        color: '#20bf35',
                        id: 3
                    },
                    {
                        color: '#5353e0',
                        id: 2
                    },
                    {
                        color: '#b1b1b1',
                        id: 1
                    },
                ],

                moreFlag: false,
                selectUlFlag: false
            };
        },
        mounted() {
            this.init();
            // console.log("%c", "padding:100px 100px;line-height:0px;background:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548310529042&di=beca880547e3c23cf7864399e8d1edb7&imgtype=0&src=http%3A%2F%2Fs8.rr.itc.cn%2Fr%2FwapChange%2F20172_7_16%2Fb967ik8744978714050.gif') no-repeat;");
        },
        watch: {
            radioFlag(val) {
                this.incompleteFun(val);
            }
        },
        methods: {
            // Select color
            selectColor(item) {
                this.eventsObj.priority = item.id;
                this.mouseFlag.colorFlag = false;
            },
            //初始化接口
            async init() {
                const res = await schedule.init();
                if (res.data.err_code == 0) {
                    this.schedule();
                    this.getProData();
                    this.getmembers();
                    this.bubbleSchedule();
                } else if (res.data.err_code == 2) {
                    this.$router.push({path: "/403"});
                } else {
                    this.$Message.error(res.data.err_message);
                }
            },
            async bubbleSchedule() {
                let {data} = await api.bubbleSchedule();
                if (data.err_code === 0 && data.guide && data.guide === 'schedule') {
                    this.bubble();
                }
            },
            bubble() {
                let text = this.$lau.bubble.schedule;
                this.$nextTick(() => {
                    let defaultOptions = [
                        {
                            id: 'menuContainer',
                            position: 'right',
                            title: text[0].title,
                            content: text[0].content,
                            relative: 'body',
                            subClassName: 'ivu-menu-item-selected'
                        },
                        {
                            id: 'eventUl',
                            position: 'left',
                            title: text[1].title,
                            content: text[1].content,
                        },
                    ];
                    setTimeout(() => {
                        this.$bubble(defaultOptions);
                    }, 300);
                });
            },
            //
            async schedule(time) {
                const res = await schedule.Calendar({time: time});
                if (res.data.err_code == 0) {
                    this.taskArr = res.data.data;
                    if (time) {
                        let date = new Date(time * 1000);
                        let nowDate = new Date();

                        let dateStr = this.getDateStr(date, 8);
                        let nowDateStr = this.getDateStr(nowDate, 8);
                        if (dateStr === nowDateStr) {
                            this.btnObj.nowDay = true;
                        } else {
                            this.btnObj.nowDay = false;
                        }
                    }
                    this.initCalendar();
                } else {
                    this.$Message.error(res.data.err_message);
                }
            },
            //初始化日历
            initCalendar() {
                this.dayData = [];
                this.incompleteEvens = [];
                let date = this.currentDate.getDate;
                this.currentDate.dateTile = this.getDateStr(date, 3);
                this.currentDate.year = this.getDateStr(date, 6);
                this.currentDate.mounth = this.getDateStr(date, 7);
                let firstDay = this.getDateStr(new Date(date.getFullYear(), date.getMonth(), 1), 1);       //当月第一天
                let lastDay = this.getDateStr(new Date(date.getFullYear(), date.getMonth() + 1, 0), 1);      //当月最后一天
                // let prevDay = this.getDateStr(new Date(date.getFullYear(),date.getMonth(),0),1);        //上月最后一天
                let nextDay = this.getDateStr(new Date(date.getFullYear(), date.getMonth() + 1, 1), 1);      //下月第一天
                let creentDay = this.getDateStr(new Date(), 1);           //当天

                let arr = this.taskArr;
                let length = arr.length;
                let _this = this;
                if (length > 0) {
                    for (let i = 0; i < length; i++) {
                        let Millisecond = new Date(arr[i].Time * 1000);
                        let strDate = _this.getDateStr(Millisecond, 1);
                        arr[i].day = _this.getDateStr(Millisecond, 2);
                        // console.log(strDate)
                        // console.log(creentDay)
                        // console.log('---------------------------------')
                        arr[0].day = _this.getDateStr(new Date(arr[0].Time * 1000), 0);
                        //已完成循环事件
                        if (strDate < creentDay) {
                            arr[i].Evens_list.forEach(item => {
                                if (item.loop) {
                                    this.incompleteEvens.push({
                                        Cid: arr[i].Cid,
                                        Date: arr[i].Date,
                                        Holiday: arr[i].Holiday,
                                        Time: arr[i].Time,
                                        day: arr[i].day,
                                        content: item.content,
                                        Start_time: item.Start_time,
                                        id: item.id,
                                        loop: item.loop,
                                        priority: item.priority,
                                        type: item.type
                                    });
                                }
                            });
                            // console.log(this.incompleteEvens)
                        }
                        //未完成事件
                        if (strDate >= creentDay) {
                            arr[i].Evens_list.forEach(item => {
                                this.incompleteEvens.push({
                                    Cid: arr[i].Cid,
                                    Date: arr[i].Date,
                                    Holiday: arr[i].Holiday,
                                    Time: arr[i].Time,
                                    day: arr[i].day,
                                    content: item.content,
                                    Start_time: item.Start_time,
                                    id: item.id,
                                    loop: item.loop,
                                    priority: item.priority,
                                    type: item.type
                                });
                            });
                            // console.log(this.incompleteEvens)
                        }

                        //当天标识
                        if (strDate == creentDay) {
                            arr[i].isCreent = true;
                        } else {
                            arr[i].isCreent = false;
                        }
                        //当月第一天标识
                        if (strDate == firstDay) {
                            arr[i].isFirst = true;
                            arr[i].day = _this.getDateStr(Millisecond, 0);
                        } else {
                            arr[i].isFirst = false;
                        }
                        //当月最后一天标识
                        if (strDate == lastDay) {
                            arr[i].isLast = true;
                        } else {
                            arr[i].isLast = false;
                        }
                        //上月最后一天标识
                        // if(strDate == prevDay){
                        //     arr[i].isPrve = true;
                        //     arr[i].day = _this.getDateStr(Millisecond,0);
                        // }else {
                        //     arr[i].isPrve = false;
                        // }
                        //下月第一天
                        if (strDate == nextDay) {
                            arr[i].isNext = true;
                            arr[i].day = _this.getDateStr(Millisecond, 0);
                        } else {
                            arr[i].isNext = false;
                        }
                        //已过日期
                        if (strDate < creentDay) {
                            arr[i].isexpired = true;
                        } else {
                            arr[i].isexpired = false;
                        }
                    }
                    for (var i = 0; i < length; i += 7) {
                        _this.dayData.push(this.taskArr.slice(i, i + 7));
                    }
                    // console.log(JSON.stringify(this.incompleteEvens))
                }
            },
            //选择月份
            selectMounth(mounth) {
                let str = this.currentDate.year + '/' + mounth + '/' + 1;
                this.currentDate.getDate = new Date(str);
                this.schedule(this.currentDate.getDate.getTime() / 1000);
                this.selectUlFlag = false;
            },
            //上月
            PrevMonth() {
                let date = this.currentDate.getDate;
                this.currentDate.getDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                this.schedule(this.currentDate.getDate.getTime() / 1000);
            },
            //下月
            NextMonth() {
                let date = this.currentDate.getDate;
                this.currentDate.getDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                this.schedule(this.currentDate.getDate.getTime() / 1000);
            },
            //今天
            toNowDay() {
                this.btnObj.nowDay = true;
                this.currentDate.getDate = new Date();
                this.schedule(this.currentDate.getDate.getTime() / 1000);
            },
            // Holiday(){
            //     this.btnObj.Holiday = !this.btnObj.Holiday
            // },
            //新建
            async saveData() {
                let data = this.eventsObj;
                let RemindTimeStr = 0;
                let timeDate = null;
                if (data.type) {
                    timeDate = new Date(data.Date).getTime() / 1000;
                } else {
                    timeDate = new Date(data.Date + ' ' + data.Start_time).getTime() / 1000;
                }
                switch (data.Remind) {
                    case 0 :
                        RemindTimeStr = 0;
                        break;
                    case 1 :
                        RemindTimeStr = timeDate - 1 * 60;
                        break;
                    case 2 :
                        RemindTimeStr = timeDate - 5 * 60;
                        break;
                    case 3 :
                        RemindTimeStr = timeDate - 30 * 60;
                        break;
                    case 4 :
                        RemindTimeStr = timeDate - 60 * 60;
                        break;
                    case 5 :
                        RemindTimeStr = timeDate - (12 * 60) * 60;
                        break;
                    case 6 :
                        RemindTimeStr = timeDate - (24 * 60) * 60;
                        break;
                }
                let cidTime = this.getDateStr(new Date(timeDate * 1000), 5);

                let sendObj = {
                    calendar_id: null,
                    notice_time: RemindTimeStr,
                    begin: data.type ? 0 : new Date(data.Date + ' ' + data.Start_time).getTime() / 1000 || null,
                    end: data.type ? 0 : new Date(data.Date + ' ' + data.End_time).getTime() / 1000 || null,
                    content: data.title,
                    loop_cycle: data.loop,
                    remind: data.Remind,
                    project_id: data.project,
                    contract_id: data.contract,
                    users: data.member.join(',') + ',' + JSON.parse(localStorage.userMsg).id,
                    address: data.address,
                    priority: data.priority,
                    id: data.id || null
                };
                let taskArr = this.taskArr;
                taskArr.forEach(item => {
                    if (item.Time == cidTime) {
                        sendObj.calendar_id = item.Cid;
                    }
                });

                let creentDay = this.getDateStr(new Date(), 1);//当天
                let date = this.getDateStr(new Date(data.Date), 1);
                if (!sendObj.content) {
                    this.$Message.error(i18n.t('workbench.work_titleCannotEmpty'));

                } else if (!data.Date) {
                    this.$Message.error(i18n.t('workbench.work_dateCannotEmpty'));

                } else if (creentDay > date) {
                    this.$Message.error(i18n.t('workbench.work_dateCanontLessToday'));
                    data.Date = null;

                } else if (!data.type) {
                    if (!sendObj.begin) {
                        this.$Message.error(i18n.t('workbench.work_startTimeCanontEmpty'));

                    } else if (!sendObj.end) {
                        this.$Message.error(i18n.t('workbench.work_endTimeCannotEmpty'));

                    } else {
                        let beginTime = new Date(data.Date + ' ' + data.Start_time).getTime() / 1000;
                        let endTime = new Date(data.Date + ' ' + data.End_time).getTime() / 1000;
                        if (endTime < beginTime) {
                            this.$Message.error(i18n.t('workbench.work_endTimeCannotLessStartTime'));
                            data.End_time = null;

                        } else {
                            this.addEvent(sendObj);
                        }
                    }
                }

                // if(data.selectType === '1' && !data.project){
                //     this.$Message.error('请选择项目');
                //     return
                // }else if(data.selectType === '2' && !data.contract){
                //     this.$Message.error('请选择合同');
                //     return
                // }else if(data.member.length <= 0){
                //     this.$Message.error('请选择成员');
                //     return
                // }else if(!data.address){
                //     this.$Message.error('地点不能为空');
                //     return
                // }
                else {
                    this.addEvent(sendObj);
                }
            },
            async addEvent(sendObj) {
                const res = await schedule.addEvent(sendObj);
                if (res.data.err_code == 0) {
                    this.modal3 = false;
                    this.moreFlag = false;
                    this.schedule();
                } else {
                    this.modal3 = false;
                    this.moreFlag = false;
                    this.$Message.error(res.data.err_message);
                }
            },
            //编辑
            async editer(event, type, item, isexpired) {
                event.stopPropagation();
                this.eventsObj = {
                    id: null,
                    title: null,
                    Date: null,
                    priority: 1,
                    type: true,
                    Start_time: null,
                    End_time: null,
                    Remind: 0,
                    loop: 0,
                    contract: null,
                    project: null,
                    member: [],
                    address: null,
                    selectType: '1'
                };
                if (type) {
                    this.moreFlag = true;
                    this.modal3 = true;
                    this.modelTitle = i18n.t('workbench.work_eventDetails');
                    this.modelFooter = isexpired;
                    const res = await schedule.eventDeatil({event_id: item.id});
                    if (res.data.err_code == 0) {
                        let data = res.data.data;
                        let memberArr = [];
                        if (data.users && data.users.length > 0) {
                            data.users.forEach(item => {
                                memberArr.push(item.id);
                            });
                        }
                        this.eventsObj = {
                            id: data.id,
                            title: data.content,
                            type: !!parseInt(data.type),
                            priority: data.priority,
                            loop: parseInt(data.loop_cycle),
                            Date: data.Date,
                            Start_time: parseInt(data.type) ? 0 : this.getDateStr(new Date(data.Start_time * 1000), 4),
                            End_time: parseInt(data.type) ? 0 : this.getDateStr(new Date(data.End_time * 1000), 4),
                            address: data.address,
                            Remind: parseInt(data.Remind),
                            selectType: data.Project ? '1' : data.Contract ? '2' : '1',
                            contract: data.Contract ? data.Contract.id : null,
                            project: data.Project ? data.Project.id : null,
                            member: memberArr,
                        };
                        // console.log(this.eventsObj)
                    } else {
                        this.$Message.error(res.data.err_message);
                    }
                } else {
                    this.modelTitle = i18n.t('workbench.work_newEvent');
                    if (item) {
                        if (!item.isexpired) {
                            this.modelFooter = item.isexpired;
                            this.modal3 = true;
                            this.eventsObj.Date = item.Date;
                        }
                    } else {
                        this.modelFooter = false;
                        this.modal3 = true;
                    }
                }
            },
            //
            incompleteFun(type) {
                this.incompleteEvens = [];
                let creentDay = this.getDateStr(new Date(), 1);//当天
                if (this.searchObj.flag) {
                    let arr = this.searchObj.searchList;
                    if (arr.length > 0) {
                        if (type) {
                            arr.forEach(item => {
                                let Millisecond = new Date(item.Time * 1000);
                                let strDate = this.getDateStr(Millisecond, 1);
                                if (strDate < creentDay && item.Time != false) {
                                    this.incompleteEvens.push(item);
                                }
                            });
                        } else {
                            this.incompleteEvens = arr;
                        }
                    }
                } else {
                    let arr = this.taskArr;
                    let length = arr.length;
                    let _this = this;
                    if (length > 0) {
                        for (let i = 0; i < length; i++) {
                            let Millisecond = new Date(arr[i].Time * 1000);
                            let strDate = _this.getDateStr(Millisecond, 1);
                            arr[i].day = _this.getDateStr(Millisecond, 2);
                            if (type) {
                                //已完成事件
                                if (strDate < creentDay) {
                                    arr[i].Evens_list.forEach(item => {
                                        if (!item.loop) {
                                            this.incompleteEvens.push({
                                                Cid: arr[i].Cid,
                                                Date: arr[i].Date,
                                                Holiday: arr[i].Holiday,
                                                Time: arr[i].Time,
                                                day: arr[i].day,
                                                content: item.content,
                                                Start_time: item.Start_time,
                                                id: item.id,
                                                loop: item.loop,
                                                priority: item.priority,
                                                type: item.type
                                            });
                                        }
                                    });
                                }
                            } else {
                                //已完成循环事件
                                if (strDate < creentDay) {
                                    arr[i].Evens_list.forEach(item => {
                                        if (item.loop) {
                                            this.incompleteEvens.push({
                                                Cid: arr[i].Cid,
                                                Date: arr[i].Date,
                                                Holiday: arr[i].Holiday,
                                                Time: arr[i].Time,
                                                day: arr[i].day,
                                                content: item.content,
                                                Start_time: item.Start_time,
                                                id: item.id,
                                                loop: item.loop,
                                                priority: item.priority,
                                                type: item.type
                                            });
                                        }
                                    });
                                }
                                //未完成事件
                                if (strDate >= creentDay) {
                                    arr[i].Evens_list.forEach(item => {
                                        this.incompleteEvens.push({
                                            Cid: arr[i].Cid,
                                            Date: arr[i].Date,
                                            Holiday: arr[i].Holiday,
                                            Time: arr[i].Time,
                                            day: arr[i].day,
                                            content: item.content,
                                            Start_time: item.Start_time,
                                            id: item.id,
                                            loop: item.loop,
                                            priority: item.priority,
                                            type: item.type
                                        });
                                    });
                                }
                            }

                        }
                    }
                }
            },
            async getProData() {
                const res = await schedule.getprojctList();
                if (res.data.err_code == 0) {
                    this.contractAndproject = {
                        project: res.data.data.project,
                        contract: res.data.data.contract
                    };
                } else {
                    this.$Message.error(res.data.err_message);
                }
            },
            async getmembers() {
                const res = await schedule.getmembersList();
                if (res.data.err_code == 0) {
                    this.memberList = res.data.data;
                } else {
                    this.$Message.error(res.data.err_message);
                }
            },
            //搜索
            async enterSearchEvents() {
                let str = this.searchObj.eventSearch;
                if (!str) {
                    this.$Message.error(i18n.t('workbench.work_searchCannotEmpty'));
                } else {
                    this.searchObj.searchList = [];
                    this.searchObj.flag = true;
                    this.radioFlag = true;
                    const res = await schedule.serchEvent({key: str});
                    if (res.data.err_code == 0) {
                        let data = res.data.data;
                        data.forEach(item => {
                            this.searchObj.searchList.push({
                                Cid: item.calendar_id,
                                Date: item.Date,
                                Time: item.Time,
                                content: item.content,
                                Start_time: item.Start_time,
                                id: item.id,
                                loop: item.loop,
                                priority: item.priority,
                                type: item.type
                            });
                        });
                        this.incompleteFun(1);
                    } else {
                        this.$Message.error(res.data.err_message);
                    }
                }
            },
            //还原
            reductionFun() {
                this.radioFlag = false;
                this.searchObj.eventSearch = null;
                this.searchObj.flag = false;
                this.searchObj.searchList = [];
                this.incompleteEvens = [];
                this.schedule();
            },
            //转化时间
            getDateStr(date, type) {
                let _year = date.getFullYear();
                let _month = date.getMonth() + 1;    // 月从0开始计数
                let _d = date.getDate();
                let _hours = (date.getHours() > 9) ? ("" + date.getHours()) : ('0' + date.getHours());
                let _minutes = (date.getMinutes() > 9) ? ("" + date.getMinutes()) : ('0' + date.getMinutes());
                if (type == 0) {
                    return _month + i18n.t('workbench.work_teamWorkMonthTag') + _d + i18n.t('workbench.work_teamWorkDayTag');
                } else if (type == 1) {
                    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
                    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
                    return _year + _month + _d;
                } else if (type == 2) {
                    return _d;
                } else if (type == 3) {
                    return _year + i18n.t('workbench.work_teamWorkYaerTag') + _month + i18n.t('workbench.work_teamWorkMonthTag');
                } else if (type == 4) {
                    return _hours + ':' + _minutes;
                } else if (type == 5) {
                    let date = new Date(_year + '/' + _month + '/' + _d + '  00:00:00');
                    return date.getTime() / 1000;
                } else if (type == 6) {
                    return _year;
                } else if (type == 7) {
                    return _month;
                } else if (type == 8) {
                    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
                    return _year + _month;
                }
            },
        },
        filters: {
            coverTime(val) {
                if (val) {
                    let date = new Date(val * 1000);
                    let yaer = date.getFullYear();
                    let momth = date.getMonth() + 1;
                    let day = date.getDate();
                    let hours = (date.getHours() > 9) ? ("" + date.getHours()) : ('0' + date.getHours());
                    let minutes = (date.getMinutes() > 9) ? ("" + date.getMinutes()) : ('0' + date.getMinutes());
                    let seconds = (date.getSeconds() > 9) ? ("" + date.getSeconds()) : ('0' + date.getSeconds());
                    // return hours + ':' + minutes + ':' + seconds
                    return hours + ':' + minutes;
                }
            },
            monthCover(val) {
                if (val) {
                    let date = new Date(val * 1000);
                    let yaer = date.getFullYear();
                    let momth = date.getMonth() + 1;
                    let day = date.getDate();
                    return momth + i18n.t('workbench.work_teamWorkMonthTag') + day + i18n.t('workbench.work_teamWorkDayTag');
                }
            },
            substr(val) {
                if (val) {
                    return val.length > 10 ? val.substr(0, 9) + '...' : val;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .content {
        display: flex;
        justify-content: space-between;
        .table {
            .base-card;
            margin-bottom: 30px;
            padding: 16px 0px;
            width: 73%;
            background: #fff;
            .content-top {
                padding: 0px 16px 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                div {
                    &:nth-child(1) {
                        background: @base;
                        color: #fff;
                        padding: 10px 20px;
                        border-radius: 3px;
                        &:hover {
                            cursor: pointer;
                            background: #39b199;
                        }
                    }
                    &.Calendartitle {
                        font-size: 14px;
                        color: #a0a0a0;
                        padding: 10px;
                        display: flex;
                        align-items: center;
                        i {
                            display: inline-block;
                            font-style: normal;
                            &.PrevIcon {
                                transform: rotate(90deg);
                                font-size: 14px;
                                &:hover {
                                    cursor: pointer;
                                    color: @base !important;
                                }
                            }
                            &.NextIcon {
                                transform: rotate(-90deg);
                                font-size: 14px;
                                &:hover {
                                    cursor: pointer;
                                    color: @base !important;
                                }
                            }
                            &:hover {
                                cursor: pointer;
                                color: #bdbdbd;
                            }
                        }
                        .positionDiv {
                            position: relative;
                            &:hover {
                                color: @base;
                                cursor: pointer;
                            }
                            span {
                                margin: 0 10px;
                            }
                            ul {
                                position: absolute;
                                width: 100%;
                                text-align: center;
                                border: 1px solid #e0dbdb;
                                border-radius: 3px;
                                z-index: 9;
                                background: #fff;
                                padding: 0 5px;
                                /*box-shadow: 0px 0px 3px 0px #71efd5;*/
                                top: 35px;
                                li {
                                    padding: 10px 0;
                                    border-bottom: 1px solid #e8e8e8;
                                    font-size: 13px;
                                    color: #bdbdbd;
                                    &:hover {
                                        cursor: pointer;
                                        color: @base;
                                    }
                                }
                            }
                        }
                    }
                    &:nth-child(3) {
                        span {
                            display: inline-block;
                            width: 35px;
                            height: 35px;
                            line-height: 35px;
                            text-align: center;
                            border: 1px solid #efefef;
                            border-radius: 100%;
                            color: #a0a0a0;
                            &.selectSty {
                                border: 1px solid @base;
                                color: @base;
                            }
                            &:hover {
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            .content-center {
                .table-header {
                    padding-bottom: 5px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #efefef;
                    span {
                        flex: 1;
                        text-align: center;
                        color: @black_3;
                    }
                }
                .tabble-body {
                    position: relative;
                    #parentUl {
                        li {
                            display: flex;
                            justify-content: space-between;
                            height: 126px;
                            border-bottom: 1px solid #f6f6f6;
                            div {
                                display: flex;
                                flex-direction: column;
                                /*justify-content: center;*/
                                flex: 1;
                                font-size: 14px;
                                /*text-align: center;*/
                                border-right: 1px solid #f6f6f6;
                                color: #929292;
                                em {
                                    display: inline-block;
                                    width: 100%;
                                    height: 3px;
                                    background: transparent;
                                }
                                &:hover {
                                    background: #fcfcfc;
                                    cursor: pointer;
                                }
                                &:last-child {
                                    border-right: none;
                                }
                                &.creentDay {
                                    color: @red;
                                    em {
                                        background: #3bceb6;
                                    }
                                }
                                &.Month {
                                    background: #fcfcfc;
                                }
                                .cellSty {
                                    padding: 0 4px;
                                    /*padding-top: 5px;*/
                                    .fontSize {
                                        font-size: 14px;
                                    }
                                }
                                .Holiday {
                                    font-size: 12px;
                                    color: @red;
                                }
                                .creentDay {
                                    color: #3bceb6;
                                }
                                dl {
                                    font-size: 12px;
                                    height: 100%;
                                    overflow: auto;

                                    &::-webkit-scrollbar {
                                        width: 3px;
                                        height: 6px;
                                    }
                                    dd {
                                        margin-bottom: 2px;

                                        p {
                                            display: flex;
                                            border-radius: 3px;
                                            align-items: center;
                                            justify-content: space-between;
                                            .overflowText {
                                                width: 89px;
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                            }
                                            padding: 1px 5px;
                                            &:hover {
                                                background: #ccf2ec;

                                            }
                                        }

                                        &.loopSty {
                                            background: #ccf2ec;
                                            border-radius: 3px;
                                        }
                                        &.moreSty {
                                            text-align: center;
                                            font-size: 20px;
                                            color: @base;
                                            height: 10px;
                                            line-height: 10px;
                                            margin-bottom: 0;
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
        .rightBlock {
            .base-card;
            width: 25%;
            background: #fff;
            .toolBar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;
                i {
                    font-style: normal;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    padding: 0 5px;
                    margin-right: 20px;
                    color: #bdbdbd;
                    &:hover {
                        cursor: pointer;
                        border: 1px solid @base;
                        color: @base;
                    }
                }
                .leftTool {
                    border-left: 2px solid @base;
                    padding-left: 5px;
                    color: @base;
                    font-size: 13px;
                }
                .rightTool {
                    display: flex;
                    align-items: center;
                }
            }
        }
        .eventUl {
            height: 670px;
            overflow: auto;
            li {
                padding: 15px 0;
                border-bottom: 1px solid #f5f5f5;
                font-size: 13px;
                color: #9a9a9a;
                display: flex;
                align-items: center;
                span {
                    &:nth-child(1) {
                        display: inline-block;
                        border-radius: 100%;
                        width: 15px;
                        height: 15px;
                        margin-right: 10px;
                    }
                    &.contentSpan {
                        width: 220px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }
        }
        .popUp {
            padding: 20px;
            position: absolute;
            width: 600px;
            /*height: 300px;*/
            border: 1px solid #ccc;
            background: #fff;
            border-radius: 5px;
            top: 0;
            left: 200px;
        }
    }

    .newEventDl {
        dd {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            .eventTitle {
                width: 94%;
                height: 35px;
                border: 1px solid transparent;
                border-bottom: 1px solid #f4f4f4;
                outline: none;
                padding-left: 10px;
                border-radius: 3px;
                &:hover {
                    border: 1px solid @base;
                    cursor: pointer;
                }
            }
            .selectColor {
                position: relative;
                width: 20px;
                text-align: center;
                display: flex;
                em {
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    border-radius: 100%;
                }
                &:hover {
                    cursor: pointer;
                    /*.hoverP{*/
                    /*display: block;*/
                    /*}*/
                }
                p {
                    position: absolute;
                    top: 18px;
                    left: -2px;
                    background: #fff;
                    padding-top: 5px;
                    em {
                        margin: 3px 0;
                    }
                }
            }

            .leftIcon {
                display: inline-block;
                width: 18px;
                height: 19px;
                background: url("../../assets/images/eventIcon.png");
            }
            .leftTips {
                display: flex;
                .tips {
                    color: #ccc;
                    margin-left: 5px;
                }
            }
            .rightBlock {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 93%;
            }
            .eventAddress {
                width: 85%;
                height: 35px;
                border: none;
                border-bottom: 1px solid #f4f4f4;
                outline: none;
                padding-left: 10px;
            }
        }
    }

    .modelFooter {
        /*display: flex;*/
        /*justify-content: space-between;*/
        button {
            cursor: pointer;
            outline: none;
            border: 0;
            &.saveData {
                padding: 8px 40px;

                border-radius: 3px;
                color: #fff;
                background: @base;
            }
            &.moreSelect {
                float: left;
                background: #fff;
                color: #bdbdbd;
                &:hover {
                    color: @base;
                }
            }
        }
    }

    .priority1 {
        /*color: #cccccc;*/
    }

    .priority2 {
        color: #5353e0;
    }

    .priority3 {
        color: #20bf35;
    }

    .priority4 {
        color: #f3b806;
    }

    .priority5 {
        color: #f31515;
    }

    .priority6 {
        color: #1877d6;
    }

    .priority7 {
        color: #33cccc;
    }

    .priorityBackground1 {
        /*color: #cccccc;*/
    }

    .priorityBackground2 {
        background: #5353e0;
    }

    .priorityBackground3 {
        background: #20bf35;
    }

    .priorityBackground4 {
        background: #f3b806;
    }

    .priorityBackground5 {
        background: #f31515;
    }

    .priorityBackground6 {
        background: #1877d6;
    }

    .priorityBackground7 {
        background: #33cccc;
    }

    /*优化*/
    .schedulePop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .2);
        z-index: 999;
        .cloneEl {
            position: absolute;
            background: rgba(168, 205, 255, 0.2);
            .modal {
                position: absolute;
                width: 550px;
                height: auto;
                background: @white;
                .modal_header {
                    padding: 14px 16px;
                    height: 60px;
                    line-height: 60px;
                    background: url("../../assets/images/upload.png") no-repeat;
                    background-size: 100% 100%;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #fff;
                    font-size: 16px;
                    .iconfonts {
                        font-size: 12px;
                        cursor: pointer;
                    }
                }
                .modal_body {
                    padding: 20px 30px;
                    font-size: 12px;
                    line-height: 1.5;
                }
                .modal_footer {
                    border-top: 1px solid #e9eaec;
                    padding: 12px 18px;
                    text-align: right;
                }
            }
        }
    }
</style>
