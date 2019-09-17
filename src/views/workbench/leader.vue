

<template>
    <div>
        <p class="page_navigation global-card-title-font"><span class="navig_icon iconfonts icon-ymywenjian-copy"></span>全部项目</p>
        <Row class="page_group_row">
            <Col span='16' class="group_left">
                <div class="group_header">
                    <div class="group_head_left">
                        <p class="group_obj_num">{{groupNum+testTaskObj.testTaskNum}}</p>
                        <p class="group_obj_msg">{{$t('workbench.work_myProjectTab')}}</p>
                    </div>
                    <div class="group_head_right">
                        <div class="group_rank">
                            <p class="group_rank_num">{{taskAllwangs.endNow.length + testTaskObj.nowComplatTaskNum}}</p>
                            <p class="group_rank_title">{{$t('workbench.work_endTodayTab')}}</p>
                        </div>
                        <div class="group_rank">
                            <p class="group_rank_numa">{{taskAllwangs.delay.length}}</p>
                            <p class="group_rank_title">{{$t('workbench.work_delayTab')}}</p>
                        </div>
                        <!--暂时隐藏-->
                        <!-- <div class="group_rank">
                          <p class="group_rank_numb">0</p>
                          <p class="group_rank_title">关注任务</p>
                       </div> -->
                        <div class="group_rank">
                            <p class="group_rank_numc">{{taskAllwangs.examine.length + testTaskObj.delayTaskNum}}</p>
                            <p class="group_rank_title">{{$t('workbench.work_examineTab')}}</p>
                        </div>
                        <div class="group_rank">
                            <p class="group_rank_numd">{{taskAllwangs.backList.length}}</p>
                            <p class="group_rank_title">{{$t('workbench.work_feedbackTab')}}</p>
                        </div>
                    </div>
                </div>
                <div class="group_left_main">
                    <template v-if="loadingFlag">
                        <div style="height: 685px">
                            <loading></loading>
                        </div>
                    </template>
                    <template v-if="!loadingFlag && (testTaskObj.testTaskNum > 0 || groupList.length > 0)">
                        <div class="group_main_msg" id="testTaskDiv" @click="clickTestTask($event)"
                             v-if="testTaskObj.testTaskNum > 0">
                            <span class="group_head_title"><em class="iconfonts icon-icon-project"></em> {{$t('workbench.work_myTestTask')}}</span>
                            <span class="open_botton iconfont"></span>
                            <div class="close_box">
                                <div class="close_box_child">
                                    <div class="close_box_left">
                                        <Progress :percent="testTaskObj.complatTaskNum/testTaskObj.testTaskNum*100"
                                                  :stroke-width="10" hide-info status="success"></Progress>
                                    </div>
                                    <div class="close_box_right">
                                        <p class="close_popress_num"><span class="firstSpan">{{testTaskObj.complatTaskNum}} /</span>
                                            <span class="twoSpan">{{testTaskObj.testTaskNum}}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-for='(item, index) in groupList' :class="`group_main_msg ${item.backGoup}`" :key='index'
                             @click="getTask(index)">
                        <span class="group_head_title" @click="goHome(item.project_id)"><em
                            class="iconfonts icon-icon-project"></em>{{item.project_name}}</span>
                            <span :class="`open_botton iconfonts ${item.icon}`" @click.stop="getClose(index)"></span>
                            <div class="close_box" v-if="!item.isOpen">
                                <div class="close_box_child">
                                    <div class="close_box_left">
                                        <Progress :percent="item.speed" :stroke-width="10" hide-info
                                                  status="success"></Progress>
                                    </div>
                                    <div class="close_box_right">
                                        <p class="close_popress_num"><span class="firstSpan">{{item.upload_file}} /</span>
                                            <span class="twoSpan">{{item.peroject_file}}</span></p>
                                    </div>
                                </div>
                                <div class="close_box_childs">
                                    <div class="close_box_left">
                                        <Progress :percent="item.work_now" :stroke-width="7" hide-info
                                                  status="success"></Progress>
                                    </div>
                                    <div class="close_box_right">
                                        <p class="close_popress_num" style="color: #bdbdbd">{{item.work_now}} %</p>
                                    </div>
                                </div>
                            </div>
                            <!-- 展开box -->
                            <div class="open_box" v-if="item.isOpen">
                                <div class="group_progress_father">
                                    <div class="group_progress">
                                        <Tooltip :content="$t('workbench.work_noBegin')" class="group_color_block"
                                                 :style="`width:${item.waitNum};background: #FF9800;`"
                                                 v-if="item.wait"></Tooltip>
                                        <Tooltip :content="$t('workbench.work_conducting')" class="group_color_block"
                                                 :style="`width:${item.doNum};background: #9ED3FD;`"
                                                 v-if="item.doing"></Tooltip>
                                        <Tooltip :content="$t('workbench.work_stoping')" class="group_color_block"
                                                 :style="`width:${item.pauseNum};background: #ff9283;`"
                                                 v-if="item.pause"></Tooltip>
                                        <Tooltip :content="$t('workbench.work_complete')" class="group_color_block"
                                                 :style="`width:${item.completeNum};background: #3bceb6;`"
                                                 v-if="item.complete"></Tooltip>
                                    </div>
                                    <p class="group_progress_file"><span>{{item.complete}}</span> / <span
                                        class="group_file_all">{{item.allFile}}</span></p>
                                </div>
                                <div class="ul_father">
                                    <ul class="ul_box">
                                        <li>
                                            <p><span class="begin"></span><span>{{$t('workbench.work_noBegin')}}</span></p>
                                        </li>
                                        <li>
                                            <p><span class="doing"></span><span>{{$t('workbench.work_conducting')}}</span></p>
                                        </li>
                                        <li>
                                            <p><span class="suspend"></span><span>{{$t('workbench.work_stoping')}}</span></p>
                                        </li>
                                        <li>
                                            <p><span class="complete"></span><span>{{$t('workbench.work_complete')}}</span></p>
                                        </li>
                                    </ul>
                                </div>
                                <div class="propress_box">
                                    <div class="prop-bx">
                                        <Progress :percent="item.work_now" hide-info :stroke-width="7" status="success"/>
                                    </div>
                                    <P class="propress_surplus" v-if="item.last_workdays > 0">{{$t('workbench.work_surplusText')}}<span
                                        class="propress_surplus_time">{{item.last_workdays}}</span>{{$t('workbench.work_workDayText')}}</p>
                                    <p class="propress_surplus" v-if="item.last_workdays <= 0">{{$t('workbench.work_delayTab')}}</p>

                                </div>
                                <div class="project_all">
                                    <div class="project_name">
                                        <p class="title_name"><span class="iconfonts icon-riliwenjian-copy"></span>{{$t('workbench.work_projectTimeText')}}</p>
                                        <!--<p class="msg_name"><span class="workday">{{item.workDay}}</span>个工作日</p>-->
                                        <p class="msg_name">{{item.start_time}} ~ {{item.end_time}}</p>
                                    </div>
                                    <div class="complany_name">
                                        <p class="title_name"><span class="iconfonts icon-gongwenbaoymy-copy"></span>{{$t('workbench.work_companyNameText')}}</p>
                                        <p class="msg_name">{{item.company.name}}</p>
                                        <p class="cpy_person">{{item.company.legal}}</p>
                                    </div>
                                    <div  class="tem_person">
                                        <p class="title_name"><span class="iconfonts icon-chengyuan"></span>{{$t('workbench.work_jionMemberText')}}</p>
                                        <p class="msg_name"><span class="people_name" v-for='(items, idx) in item.person' :key='idx'>{{items.name}}</span></p>
                                    </div>
                                </div>
                            </div>
                            <!-- 展开样式结束 -->
                        </div>
                    </template>
                    <template v-if="!loadingFlag && groupList.length == 0">
                        <div
                            style="min-height: 685px;position: relative;margin-top: 10px;box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);border-radius: 3px;">
                            <nothink type="project"></nothink>
                        </div>
                    </template>
                </div>
            </Col>
            <Col span='8' class="tables_all_father">
                <div class="tables_all">
                    <p class="CreentprojectName"><em class="iconfonts icon-icon-project"
                                                     style="font-size: 24px;color: #9E9E9E;margin-right: 10px"></em>{{currenProject}}
                    </p>
                    <!-- :animated="false" -->
                    <Tabs :value="tabname" v-if="TaskTab" @on-click="getTab" style="z-index: 1">
                        <TabPane :label="label" name="name1">
                            <project-task :list="taskChild.endNow" :loadingFlag="loadingFlag"></project-task>
                        </TabPane>
                        <TabPane :label="delayLabel" name="name2">
                            <project-task :list="taskChild.delay" :loadingFlag="loadingFlag"></project-task>
                        </TabPane>
                        <!-- <TabPane :label="distList" name="name3">
                          <project-task :list="taskChild.distList"></project-task>
                        </TabPane> -->
                        <TabPane :label="examineLabel" name="name4">
                            <!-- {{'待审核'}} -->
                            <project-task :list="taskChild.examine" :loadingFlag="loadingFlag"></project-task>
                        </TabPane>
                        <TabPane :label="backLabel" name="name5">
                            <project-task :list="taskChild.backList" :loadingFlag="loadingFlag"></project-task>
                        </TabPane>
                    </Tabs>

                    <Tabs :value="tabname" v-if="testTaskTab" @on-click="getTab" style="z-index: 1">
                        <TabPane :label="testTaskNowDay" name="name1">
                            <project-task :list="testTaskObj.nowDayList"  :loadingFlag="loadingFlag" :isTest="true"></project-task>
                        </TabPane>
                        <TabPane :label="testTaskdelay" name="name2">
                            <project-task :list="testTaskObj.delayList" :loadingFlag="loadingFlag" :isTest="true"></project-task>
                        </TabPane>
                        <TabPane :label="testTaskNo" name="name3">
                            <project-task :list="testTaskObj.NoList" :loadingFlag="loadingFlag" :isTest="true"></project-task>
                        </TabPane>
                    </Tabs>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import projectTask from './leader/ProjectChild.vue';
    import mainNative from '../main-components/mainNative.vue';
    import api from 'api';
    import NavTav from "../../components/navTav"

    export default {
        data() {
            return {
                groupList: [],
                groupNum: 0,
                tabname: 'name1',
                testTaskTab: false,
                TaskTab: true,
                taskAllwangs: {
                    endNow: [],
                    delay: [],
                    examine: [],
                    backList: []
                },
                taskChild: {
                    endNow: [],
                    delay: [],
                    examine: [],
                    backList: [],
                    distList: []
                },
                label: (h) =>
                    h('div', [
                        h('span', i18n.t('workbench.work_endTodayTab')),
                        h('Badge', {
                            props: {
                                count: this.taskChild.endNow.length
                            }
                        })
                    ]),
                distList: (h) => h('div', [
                    h('span', '关注'),
                    h('Badge', {
                        props: {
                            count: this.taskChild.distList.length
                        }
                    })
                ]),
                delayLabel: (h) => h('div', [
                    h('span', i18n.t('workbench.work_delayTab')),
                    h('Badge', {
                        props: {
                            count: this.taskChild.delay.length
                        }
                    })
                ]),
                examineLabel: (h) => h('div', [
                    h('span', i18n.t('workbench.work_examineTab')),
                    h('Badge', {
                        props: {
                            count: this.taskChild.examine.length
                        }
                    })
                ]),
                backLabel: (h) => h('div', [
                    h('span', i18n.t('workbench.work_feedbackTab')),
                    h('Badge', {
                        props: {
                            count: this.taskChild.backList.length
                        }
                    })
                ]),
                testTaskNowDay: (h) => h('div', [
                    h('span', i18n.t('workbench.work_endTodayTab')),
                    h('Badge', {
                        props: {
                            count: this.testTaskObj.nowComplatTaskNum
                        }
                    })
                ]),
                testTaskdelay: (h) => h('div', [
                    h('span', i18n.t('workbench.work_examineTab')),
                    h('Badge', {
                        props: {
                            count: this.testTaskObj.delayTaskNum
                        }
                    })
                ]),
                testTaskNo: (h) => h('div', [
                    h('span', i18n.t('workbench.work_noAppointTab'))
                ]),
                testTaskObj: {
                    testTaskNum: 0,
                    complatTaskNum: 0,
                    nowComplatTaskNum: 0,
                    delayTaskNum: 0,
                    nowDayList: [],
                    delayList: [],
                    NoList: []
                },
                currenProject: null,
                needGuideData: null,
                loadingFlag: true
            };
        },
        components: {
            NavTav,
            projectTask,
            mainNative
        },
        watch: {
            guideStatus(value) {
                if (value === "1") {
                    this.initGuide();
                }
            }
        },
        computed: {
            guideStatus() {
                return this.$store.state.guideStatus;
            }
        },
        mounted() {
            this.getAuditTestTaskList();
            this.initGuide();
        },
        methods: {
            // 项目管理流程引导第一步
            async initGuide() {
                let _this = this;
                let {data} = await api.bubbleMyTask();
                if (data.err_code == 0){
                    _this.$store.commit('setGuideStatus', '2');
                    if (data.guide){
                        sessionStorage.setItem('needGuideData', true);
                        _this.needGuideData = true;
                        if (data.guide == 'partyAProjectManagement') {
                            _this.getGroup().then(() => {
                                setTimeout(() => {
                                    _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                        .addSteps([
                                            {
                                                element: document.querySelector('.group_main_msg'),
                                                intro: this.$lau.guide_words.k3,
                                                position: 'bottom',
                                                disableInteraction: '1',
                                                start: '1',
                                                total: '3'
                                            }
                                        ]).start()
                                        .onskip(() => {
                                            sessionStorage.needGuideData = false;
                                            _this.needGuideData = null;
                                            _this.getGroup();
                                        })
                                        .oncomplete(() => {
                                            this.$PublicFuns.completePageGuide(data.guide).then(result => {
                                                this.$router.push(this.$router.push('/project/task'));
                                            });
                                        });
                                });
                            });
                        } else if (data.guide == 'partyBProjectManagement') {
                            _this.getGroup().then(() => {
                                setTimeout(() => {
                                    _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                        .addSteps([
                                            {
                                                element: document.querySelector('.group_main_msg'),
                                                intro: this.$lau.guide_words.k4,
                                                position: 'bottom',
                                                disableInteraction: '1',
                                                start: '1',
                                                total: '5'
                                            }
                                        ]).start()
                                        .onskip(() => {
                                            sessionStorage.needGuideData = false;
                                            _this.needGuideData = null;
                                            _this.getGroup();
                                        })
                                        .oncomplete(() => {
                                            this.$PublicFuns.completePageGuide(data.guide).then(result => {
                                                this.$router.push({
                                                    path: '/project/projectStandard',
                                                    query: {type: '1211'}
                                                });
                                            });
                                        });
                                });
                            });
                        } else if (data.guide == 'auditTask') {
                            _this.$guide().exit();
                            _this.getGroup().then(() => {
                                this.getTab('name4');
                                this.$nextTick(() => {
                                    setTimeout(() => {
                                        _this.$guide().setOptions(this.$CONSTANT.guideOptions)
                                            .addSteps([
                                                {
                                                    element: document.querySelector('.tables_all'),
                                                    intro: this.$lau.guide_words.k5,
                                                    position: 'left',
                                                    disableInteraction: '1',
                                                    start: '1',
                                                    total: '3'
                                                }
                                            ]).start()
                                            .onskip(() => {
                                                sessionStorage.setItem('needGuideData', false);
                                                _this.needGuideData = null;
                                                _this.getGroup();
                                            })
                                            .oncomplete(() => {
                                                // $('task_msg_bx').css('z-index',1000);
                                                this.$PublicFuns.completePageGuide(data.guide).then(result => {
                                                    this.$router.push({
                                                        path: "/project/details",
                                                        // query: {project: 1, id: 9999999, navTitle: '资源管理'}
                                                        query: {project: 1, id: 9999999, navTitle: i18n.t('workbench.work_resourceManagement')}
                                                    });
                                                });
                                            });
                                        // $('.introjs-helperLayer').css({'background-color':'rgba(255, 255, 255, 0)','left':'1227.12px'})
                                    }, 200);
                                });
                            });
                        }
                    } else {
                        sessionStorage.setItem('needGuideData', false);
                        _this.getGroup();
                    }
                }
            },
            // tabs 点击
            getTab(e) {
                const element = document.getElementsByClassName('ivu-tabs-tabpane');
                const index = e.split('name')[1];
                this.tabname = 'name' + index;
            },
            // 关闭按钮
            getClose(index) {
                const list = this.groupList;
                list.forEach((item, idx) => {
                    if (index == idx) {
                        item.isOpen = !item.isOpen;
                        item.backGoup = 'backGoup';
                        if (item.isOpen) {
                            item.icon = 'icon-fangxiangshang';
                        } else {
                            item.icon = 'icon-fangxiangxia';
                        }
                    } else {
                        item.isOpen = false;
                        item.icon = 'icon-fangxiangxia';
                        item.backGoup = '';
                    }
                });
            },
            // 获取组长数据
            async getGroup() {
                let items = {};
                if (this.needGuideData) {
                    items = {
                        needGuideData: true
                    };
                }
                let {data} = await api.task_headman_wp(items);
                if (data.err_code == 0){
                    this.loadingFlag = false;
                    const list = data.data;
                    list.forEach(element => {
                        const taskList = element.task_list;
                        const taskSun = []; // 已完成的任务
                        element.isOpen = false;
                        element.backGoup = '';
                        element.icon = 'icon-fangxiangxia';
                        const startWork = this.getTimes(element.start_time);
                        const endWork = this.getTimes(element.end_time);
                        const now_time = this.getTimes(element.time);
                        const Surplus = (endWork.times - now_time.times) / (24 * 60 * 60 * 1000) + 1;
                        const workDay = (endWork.times - startWork.times) / (24 * 60 * 60 * 1000) + 1;
                        let work_now = 0;
                        if (Surplus > 0) {
                            if (workDay - Surplus > 0) {
                                work_now = Math.floor((workDay - Surplus) / workDay * 100);
                            } else {
                                work_now = 0;
                            }
                        } else {
                            work_now = 100;
                        }
                        const status = element.status;
                        if (status !== '3') {
                            if (Surplus > 0) {
                                element.Surplus = Surplus;
                            } else {
                                element.Surplus = Surplus;
                            }
                        } else {
                            if (Surplus > 0) {
                                element.Surplus = Surplus;
                            } else {
                                element.Surplus = 0;
                            }
                        }
                        taskList.forEach((items, idx) => {
                            if (items.task_status == '5') {
                                taskSun.push(items);
                            }
                        });
                        element.allFile = element.wait + element.doing + element.pause + element.complete;
                        element.waitNum = Math.floor(element.wait / element.allFile * 100) + '%';
                        element.doNum = Math.floor(element.doing / element.allFile * 100) + '%';
                        element.pauseNum = Math.floor(element.pause / element.allFile * 100) + '%';
                        element.completeNum = Math.floor(element.complete / element.allFile * 100) + '%';
                        element.work_now = work_now;
                        element.end_time = endWork.day;
                        element.peroject_file = taskList.length;
                        element.upload_file = taskSun.length;
                        element.speed = Math.floor(taskSun.length / taskList.length * 100);
                        element.start_time = startWork.day;
                    });
                    this.groupNum = list.length;
                    this.groupList = list;
                    this.taskAllwangs = this.getAllTask(list);
                    if (list.length > 0) {
                        this.getTask(0);
                    }
                } else {
                    this.loadingFlag = false;
                }
            },
            getTimes(day) {
                // if(XXX){} 做引导时加的
                if (day) {
                    const days = day.split(' ')[0].replace(/-/g, '/');
                    const date = days.split('/')[1] + '-' + days.split('/')[2];
                    const dayList = {
                        times: new Date(days).getTime(),
                        days: date,
                        day: day.split(' ')[0]
                    };
                    return dayList;
                }

            },
            // 获取任务
            getTask(index) {
                $('#testTaskDiv').removeClass('backGoup');
                this.testTaskTab = false;
                this.TaskTab = true;
                const list = this.groupList;
                this.currenProject = list[index].project_name;
                this.getClose(index);
                const taskList = list[index].task_list;
                this.taskChild = this.getTaskList(taskList, list[index].project_id);
            },
            // 获取任务
            getTaskList(lists, projectID) {
                const list = this.groupList;
                const nowTime = this.getTimes(list[0].time).times; // 获取今天的日期
                const endNow = []; // 今天结束
                const delay = []; // 延期
                const examine = []; // 待审核
                const backList = []; // 反馈
                const distList = []; // 未分配
                lists.forEach((element, index) => {
                    const expect_end = this.getTimes(element.expect_end_time);
                    const expect_start = this.getTimes(element.expect_start_time);
                    element.projectID = projectID;
                    element.expect_end_time = expect_end.day;
                    element.expect_start_time = expect_start.day;
                    element.expect_end_new = expect_end.days;
                    element.expect_start_new = expect_start.days;
                    element.workDay = (expect_end.times - expect_start.times) / (24 * 60 * 60 * 1000) + 1;
                    let endTime = 0;
                    if (element.end_time == '') {
                        //  if(xxx)){} 做引导时加的
                        if (this.getTimes(element.end_time)) {
                            endTime = this.getTimes(element.end_time).times;
                        }
                    } else {
                        endTime = 0;
                    }
                    if (expect_end.times === nowTime) {
                        endNow.push(element);
                    }
                    if (!endTime && nowTime > expect_end.times) {
                        delay.push(element);
                    }
                    if (element.task_status == 1) {
                        examine.push(element);
                    } else if (element.task_status == 4) {
                        backList.push(element);
                    }
                    // else {
                    //   distList.push(element)
                    // }
                });
                this.getTab('name1');
                return {
                    endNow: endNow,
                    delay: delay,
                    examine: examine,
                    backList: backList,
                    distList: distList
                };
            },
            // 获取任务
            getAllTask(list) {
                if (list == null || list.length <= 0) {
                    return {
                        endNow: [],
                        delay: [],
                        examine: [],
                        backList: [],
                        distList: []
                    };
                }
                // const list = this.groupList
                const nowTime = this.getTimes(list[0].time).times; // 获取今天的日期
                const endNow = []; // 今天结束
                const delay = []; // 延期
                const examine = []; // 待审核
                const backList = []; // 反馈
                const distList = []; // 未分配
                list.forEach((item, index) => {
                    const taskList = item.task_list;
                    taskList.forEach((element, index) => {
                        const expect_end = this.getTimes(element.expect_end_time).times;
                        let endTime = 0;
                        if (element.end_time == '') {
                            //  if(xxx)){} 做引导时加的
                            if (this.getTimes(element.end_time)) {
                                endTime = this.getTimes(element.end_time).times;
                            }

                        } else {
                            endTime = 0;
                        }
                        if (expect_end === nowTime) {
                            endNow.push(element);
                        }
                        if (!endTime && nowTime > expect_end) {
                            delay.push(element);
                        }
                        if (element.task_status == 1) {
                            examine.push(element);
                        } else if (element.task_status == 4) {
                            backList.push(element);
                        }
                        // else {
                        //   distList.push(element)
                        // }
                    });
                });
                return {
                    endNow: endNow,
                    delay: delay,
                    examine: examine,
                    backList: backList,
                    distList: distList
                };
            },
            goHome(id) {
                // console.log(110, '跳转到任务页面');
                sessionStorage.projectID = id;
                this.$bus.emit('changeMenuList', id);
                this.$router.push('/project/task');
            },
            //测试任务点击
            clickTestTask(e) {
                this.testTaskTab = true;
                this.TaskTab = false;
                this.tabname = 'name1';
                this.currenProject = i18n.t('workbench.work_myTestTask');
                $('#testTaskDiv').addClass('backGoup');

                this.groupList.forEach(function (item, index) {
                    item.backGoup = '';
                    item.icon = "icon-fangxiangxia";
                    item.isOpen = false;
                });
            },
            //获取负责人测试任务列表
            async getAuditTestTaskList() {
                const TestTaskList = await api.AuditTestTaskList();
                let nowDay = new Date();
                let StrNowDay = nowDay.getFullYear() + '-' + (nowDay.getMonth() + 1) + '-' + nowDay.getDate();
                if (TestTaskList.data.err_code == 0) {
                    let dataArr = TestTaskList.data.data;
                    this.testTaskObj.testTaskNum = dataArr.length;
                    let complayNum = 0;
                    for (let i = 0; i < dataArr.length; i++) {
                        //数据组装
                        let AddTime = new Date(dataArr[i].add_time * 1000);
                        let endTime = new Date(dataArr[i].end_time * 1000);
                        let strAddTime = AddTime.getFullYear() + '-' + (AddTime.getMonth() + 1) + '-' + AddTime.getDate();
                        let strEndTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate();

                        let year = parseInt(endTime.getFullYear() - AddTime.getFullYear());
                        let month = parseInt((endTime.getMonth() + 1) - (AddTime.getMonth() + 1));
                        let day = parseInt(endTime.getDate() - AddTime.getDate());

                        let startDay = (AddTime.getMonth() + 1) + '/' + AddTime.getDate();
                        let endDay = (endTime.getMonth() + 1) + '/' + endTime.getDate();
                        //剩余天数
                        let shengyuDay = year * 365 + month * 30 + day;

                        dataArr[i].shengyuDay = shengyuDay;
                        dataArr[i].startDay = startDay;
                        dataArr[i].endDay = endDay;

                        if (dataArr[i].upload.status == 2) {
                            complayNum++;
                        }
                        this.testTaskObj.complatTaskNum = complayNum;

                        if (strEndTime == StrNowDay) {
                            this.testTaskObj.nowDayList.push(dataArr[i]);
                            this.testTaskObj.nowComplatTaskNum = this.testTaskObj.nowDayList.length;
                        } else if (dataArr[i].upload.status == 1) {
                            this.testTaskObj.delayList.push(dataArr[i]);
                            this.testTaskObj.delayTaskNum = this.testTaskObj.delayList.length;
                        } else if (dataArr[i].member_id == '') {
                            this.testTaskObj.NoList.push(dataArr[i]);
                        }
                    }
                } else {
                    this.$Message.error(TestTaskList.data.err_message);
                }
            }
        }
    };
</script>
<style lang="less">
    .page_group_all {
        // width: 100%;
        // height: 100%;
        .page_navigation {
            width: 100%;
            height: 80px;
            line-height: 80px;
            .navig_icon {
                font-size: 20px;
                color: #3bceb6;
                margin-right: 5px;
            }
        }
    }

    .page_group_row {
        width: 100%;
        height: 100%;
    }

    .group_header {
        .base-card;
        width: 100%;
        height: 110px;
        background: #fff;
        border-radius: 4px;
        padding: 20px;
    }

    .group_left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-right: 40px;
        height: 100%;
    }

    .group_head_left {
        width: 200px;
        height: 100%;
        float: left;
        text-align: center;
    }

    .group_obj_num {
        text-align: center;
        font-size: 30px;
        color: #3bceb6;
    }

    .group_obj_msg {
        font-size: 14px;
        margin-top: 5px;
        color: #777777;
    }

    .backGoup {
        position: relative;
        @widths: 20px;
        width: calc(~"100% + @{widths}") !important;
        box-shadow: 0px 0px 5px 0px @base !important;
    }

    .tables_all_father {
        .tables_all {
            min-width: 285px;
            .base-card;
            // max-height: 800px;
            width: 100%;
            min-height: 800px;
            border-radius: 4px;
            // padding: 20px;
            background: #fff;
            .CreentprojectName {
                font-size: 18px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                vertical-align: middle;
            }
            .ivu-tabs-ink-bar {
                display: none !important;
            }
            .ivu-tabs-nav > .ivu-tabs-tab-active {
                color: @base !important;
            }
            .ivu-tabs-bar {
                border-bottom: none;
                margin-bottom: 0px;
            }
            .ivu-tabs-nav-container {
                &:focus {
                    .ivu-tabs-tab-focused {
                        & div {
                            border: 1px solid @base !important;
                            background: @base;
                            color: #ffffff !important;
                        }
                    }
                }
                .ivu-tabs-nav-wrap {
                    height: 60px;
                    line-height: 32px;
                }
                .ivu-tabs-nav {
                    width: 100%;
                    border: none;
                    .ivu-tabs-tab {
                        font-size: 13px;
                        box-sizing: border-box;
                        //暂时隐藏关注
                        width: 25%;
                        margin-right: 0;
                        text-align: center;
                        position: relative;
                        padding: 0px;
                        // height: 40px;
                        color: @black_3;
                        z-index: 5;
                        & div {
                            border: 1px solid #dcdedd;
                            border-right: none;
                            .ivu-badge-count-alone {
                                top: -2px;
                                left: 2px;
                            }
                        }
                        &:nth-child(2) {
                            & div {
                                border-top-left-radius: 4px;
                                border-bottom-left-radius: 4px;
                            }
                        }
                        &:last-child {
                            & div {
                                border-right: 1px solid #dcdedd !important;
                                border-top-right-radius: 4px;
                                border-bottom-right-radius: 4px;
                            }
                        }
                        &:hover {
                            color: @base;
                        }
                    }
                }
            }
            .ivu-tabs-tabpane {
                max-height: 680px;
                overflow: auto;
            }
        }
    }

    .group_head_right {
        @diff: 220px;
        width: calc(~"100% - @{diff}");
        height: 100%;
        float: left;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .group_rank {
            width: 20%;
            text-align: center;
            border-left: 1px dashed #dedede;
            //   width:80px;
            .group_rank_num, .group_rank_numa, .group_rank_numb, .group_rank_numc, .group_rank_numd {
                font-size: 30px;
            }
            .group_rank_num {
                color: @base;
            }
            .group_rank_numa {
                color: @red;
            }
            .group_rank_numb {
                color: @base;
            }
            .group_rank_numc {
                color: #9ED3FD;
            }
            .group_rank_numd {
                color: @orange;
            }
            .group_rank_title {
                color: @black_2;
                font-size: 14px;
                margin-top: 5px;
            }
        }
    }

    .group_left_main {
        width: 100%;
        @height: 130px;
        height: calc(~"100% - @{height}");
        .group_main_msg {
            .base-card;
            width: 100%;
            // height: 350px;
            margin-top: 20px;
            // padding: 20px;
            position: relative;
            background: #fff;
            border-radius: 4px;
            .group_head_title {
                font-size: 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                .iconfonts {
                    font-size: 24px;
                    color: @black_3;
                    margin-right: 10px;
                }
            }
            .open_botton {
                position: absolute;
                right: 10px;
                top: 10px;
                margin-top: 4px;
                margin-right: 4px;
                font-size: 25px;
                z-index: 9;
                cursor: pointer;
            }
            .group_progress_father {
                display: flex;
                align-items: center;
                .group_progress_file {
                    font-size: 14px;
                    color: @black_3;
                    margin-left: 10px;
                    .group_file_all {
                        color: @base;
                    }
                }
                .group_progress {
                    @widths: 130px;
                    width: calc(~"100% - @{widths}");
                    height: 10px;
                    float: left;
                    background: @baseboard;
                    border-radius: 5px;
                    overflow: hidden;
                    .group_color_block {
                        height: 100%;
                        float: left;
                        // width: 20%;
                        //  background: red;
                    }
                }
            }
            .close_box {
                width: 100%;
                //height: 80px;
                .ivu-progress-inner {
                    background-color: @black_4;
                }
                .close_box_child {
                    & .ivu-progress-bg {
                        background-color: @base;
                    }
                }
                .close_box_childs {
                    & .ivu-progress-bg {
                        background-color: @blue2;
                    }
                }
                .close_box_child, .close_box_childs {
                    width: 100%;
                    height: 40px;
                    .close_box_left {
                        float: left;
                        height: 100%;
                        padding-top: 20px;
                        @leftWidth: 80px;
                        width: calc(~"100% - @{leftWidth}");
                    }
                    .close_box_right {
                        float: left;
                        width: 70px;
                        height: 100%;
                        line-height: 40px;
                        padding-top: 10px;
                        margin-left: 10px;
                        .close_popress_msg {
                            float: left;
                            font-size: 16px;
                        }
                        .close_popress_num {
                            float: left;
                            margin-left: 10px;
                            font-size: 14px;
                            .firstSpan {
                                color: @black_3;
                            }
                            .twoSpan {
                                color: @base;
                            }
                        }
                    }
                }
            }
        }
    }

    .open_box {
        margin-top: 16px;
        .ul_father {
            width: 100%;
            height: 30px;
            .ul_box {
                width: 100%;
                height: 100%;
                & li {
                    float: left;
                    margin-right: 20px;
                    font-size: 12px;
                    & p {
                        height: 30px;
                        line-height: 30px;
                        color: #bdbdbd;
                        display: flex;
                        align-items: center;
                        .complete {
                            background: #3bceb6;
                        }
                        .doing {
                            background: #9ED3FD;
                        }
                        .suspend {
                            background: #ff9283;
                        }
                        .begin {
                            background: #FF9800;
                        }
                        & span {
                            float: left;
                        }
                        & span:first-child {
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            /*margin: 13px 5px 0 0;*/
                            border-radius: 100%;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    }

    .project_all {
        width: calc(~"100%" - 130px);
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        .complany_name {
            padding-left: 80px;
        }
        .tem_person {
            padding-left: 80px;
        }
        .title_name {
            font-size: 13px;
            color: #bdbdbd;
            & span {
                display: inline-block;
                font-size: 16px;
                margin-right: 5px;
            }
        }
        .cpy_person {
            /*font-size: 16px;*/
            margin-top: 10px;
            color: #bdbdbd;
        }
        .people_name {
            margin-right: 10px;
        }
        .msg_name {
            font-size: 12px;
            margin-top: 10px;
            color: #777777;
            .workday {
                color: #3bceb6;
            }
        }
    }

    .propress_box {
        width: 100%;
        display: flex;
        align-items: center;
        .propress_surplus {
            color: rgb(174, 174, 174);
            margin-left: 10px;
            .propress_surplus_time {
                font-size: 18px;
                margin: 0 5px;
                color: #9ED3FD;
            }
        }
        .prop-bx {
            @widthed: 130px;
            width: calc(~"100% - @{widthed}");
            & .ivu-progress-bg {
                background-color: #9ED3FD;
            }
        }
        .ivu-progress-inner {
            background-color: #e6e6e6;
            border-radius: 5px;
        }
    }
</style>
