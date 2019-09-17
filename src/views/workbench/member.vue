<!--成员工作台-->
<template>
    <div class="imPlementerContainer">
        <main-native>
            <div class="main-header-style"><span
                class="iconfonts main-header-title">{{this.$route.meta.title}}<div></div></span></div>
        </main-native>
        <div class="page_week_all">
            <div class="myTask">
                <div class="leftBar" v-show="tastListDataShow == true" @click="moveFUn('left',beforeDataNumber)">
                    <span>{{beforeDataNumber}}</span>
                </div>
                <div class="centerContenr">
                    <div class="myTaskAll global-card-title-font">
                        <span>{{$t('workbench.work_taskScheduling')}}</span>
                        <span>
                            <button class="checkoutBtn" @click="checkoutFun(7)"
                                    :class="{'checkedSty':column == 7}">{{$t('workbench.work_aWeek')}}</button>
                            <button class="checkoutBtn" @click="checkoutFun(14)"
                                    :class="{'checkedSty':column == 14}">{{$t('workbench.work_twoWeeks')}}</button>
                        </span>
                    </div>
                    <template v-if="loadingFlag">
                        <div style="height: 520px">
                            <loading></loading>
                        </div>
                    </template>

                    <template v-show="!loadingFlag">
                        <div class="tiemSolt" id="tiemSolt" :style="`height: ${boxHight}`" @mousedown="down">
                            <template>
                                <div class="clearfix timeSoltFather" id="timeSoltFather">
                                    <!-- 时间 -->
                                    <div v-for="(item, indexed) in dateList" :style="`width: ${widths}`" :index="indexed"
                                         class="times_box global-child-title-font" :key="indexed">
                                        <span v-show='item.weeks'>{{item.weeks}}</span>
                                        <span>{{item.dateStr}}</span>
                                    </div>
                                    <!-- 时间结束 -->
                                    <div class="task_ka" :style="`height:${boxHg}`">
                                        <div :class="`task_top_box ${elems.taskBack}`" v-for="(elems, indexed) in tastList"
                                             :key="indexed" :title="elems.name"
                                             :style="`width:${elems.centWidth}; left:${elems.clienLeft}; top:${elems.top}`">
                                            <div class="task_describe">
                                                <div class="clearfix task_describe_title">
                                                    <p class="state-introd" :style="`background:${elems.leftTopColor}`">
                                                        {{elems.isComplete}}</p>
                                                    <div class="task_describe_father">


                                                <span class='task_describe-sign iconfonts icon-bofang'
                                                      @click='getAgin(elems)'
                                                      :title="$t('workbench.work_clickStartTask')"
                                                      v-if='elems.is_test == 0 && elems.status == 1'></span>


                                                        <span class="task_describe_msg global-body-color"
                                                              @click="goTask(elems,elems.id)">{{elems.name || '--'}}</span>

                                                        <span v-if="elems.is_test == 1" class="IsTestTaskType">{{$t('workbench.work_testTab')}}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-if="elems.is_test == 0" class="upload_preview_box"
                                                 v-show="elems.status == '2'"
                                                 @click="getUpload(elems)">
                                                <p class="iconfonts icon-ymy-upload-copy"></p>
                                            </div>
                                            <div v-if="elems.is_test == 1" class="upload_preview_box"
                                                 v-show="elems.status !== '2'"
                                                 @click="getUpload(elems)">
                                                <p class="iconfonts icon-ymy-upload-copy"></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>

                    <template>
                        <div v-if="!loadingFlag && tastListDataShow==false" style="position: relative;height: 530px">
                            <nothink type="task" :text="$t('workbench.work_noTaskTpis')"></nothink>
                        </div>
                    </template>


                </div>
                <div class="rightBar" v-show="!loadingFlag && tastListDataShow == true" @click="moveFUn('right',afterDataNumber)">
                    <span>{{afterDataNumber}}</span>
                </div>
            </div>
            <!-- 审核任务未读 -->
            <!-- 审核任务 -->
            <div class="taskFeedbackDiv" style="min-height: 200px;background: #fff">
                <template v-if="loadingFlag">
                    <div style="height: 200px">
                        <loading></loading>
                    </div>
                </template>
                <template v-if="!loadingFlag && examinListDataShow == true">
                    <div style="width: 100%;display: flex;justify-content: space-between;align-items: center" >
                        <div class="leftBar">
                            <img class='left_img_first' src='../../assets/images/right.png'/>
                        </div>
                        <div class="centerContenr" style="width: 100%">
                            <p class="myTaskAll global-card-title-font">{{$t('workbench.work_taskFeedbackTitle')}}</p>
                            <div class="task_feedback" @mousedown="getdown">
                                <template>
                                    <div class="task_feedback_box" style="width:100%">
                                        <div class="clearfix task_feedback_msg" v-for="(item, index) in examinList"
                                             :key="index">
                                            <div class="feedback_iamge_father">
                                                <img :src="item.thumb"/>
                                            </div>
                                            <div class="task_feedback_details">
                                                <div class="clearfix feedback_words_box">
                                                    <div class="feedback_words">
                                                        <p class="feedback_words_task global-child-title-font"
                                                           @click="goTask(item,item.taskID)">{{item.name || '--'}}
                                                            <span v-if="item.is_test == 1"
                                                                  class="IsTestTaskType">{{$t('workbench.work_taskTestTips')}}</span>
                                                        </p>
                                                        <p v-if="item.is_test == 0"
                                                           class="feedback_words_project global-input-notice">
                                                            {{item.project_name}}</p>
                                                    </div>
                                                </div>
                                                <!-- 进度条 -->
                                                <div v-if="item.is_test == 0">
                                                    <div class="feedback_task_progress"
                                                         v-if="item.is_client_audit==1 && item.is_inside_audit==1">
                                                        <div
                                                            :class="`progress_feedback_style ${item.firstStage}`"></div>
                                                        <div
                                                            :class="`progress_feedback_style ${item.secondStage}`"></div>
                                                        <div
                                                            :class="`progress_feedback_style ${item.thirdStage}`"></div>
                                                    </div>
                                                    <div class="feedback_task_progress"
                                                         v-else-if="item.is_client_audit==1 && item.is_inside_audit==0">
                                                        <div :class="`progress_feedback_style ${item.firstStage}`"
                                                             style="flex: 1"></div>
                                                        <div
                                                            :class="`progress_feedback_style ${item.thirdStage}`"></div>
                                                    </div>
                                                    <div class="feedback_task_progress"
                                                         v-else-if="item.is_client_audit==0 && item.is_inside_audit==1">
                                                        <div :class="`progress_feedback_style ${item.firstStage}`"
                                                             style="flex: 1"></div>
                                                        <div
                                                            :class="`progress_feedback_style ${item.secondStage}`"></div>
                                                    </div>
                                                    <div class="feedback_task_progress"
                                                         v-else-if="!item.is_client_audit && !item.is_inside_audit">
                                                        <div :class="`progress_feedback_style isStage`"
                                                             style="flex: 1"></div>
                                                        <div
                                                            :class="`progress_feedback_style progress_last_style isStage`"></div>
                                                    </div>

                                                    <div class="feedback_stage"
                                                         v-if="item.is_client_audit==1 && item.is_inside_audit==1">
                                                        <div>
                                                            <span>{{$t('workbench.work_uploadFeilText')}}</span>
                                                            <p>{{item.create_time_title}}</p>
                                                        </div>
                                                        <div>
                                                            <span>{{$t('workbench.work_insideExamineText')}}</span>
                                                            <p>{{item.inside_audit_title}}</p>
                                                        </div>
                                                        <div>
                                                            <span>{{$t('workbench.work_outsideExamineText')}}</span>
                                                            <p>{{item.client_audit_title}}</p>
                                                        </div>
                                                    </div>
                                                    <div class="feedback_stage"
                                                         v-else-if="item.is_client_audit==1 && item.is_inside_audit==0">
                                                        <div>
                                                            <span>{{$t('workbench.work_uploadFeilText')}}</span>
                                                            <p>{{item.create_time_title}}</p>
                                                        </div>
                                                        <div></div>
                                                        <div>
                                                            <span>{{$t('workbench.work_outsideExamineText')}}</span>
                                                            <p>{{item.client_audit_title}}</p>
                                                        </div>
                                                    </div>
                                                    <div class="feedback_stage"
                                                         v-else-if="item.is_client_audit==0 && item.is_inside_audit==1">
                                                        <div>
                                                            <span>{{$t('workbench.work_uploadFeilText')}}</span>
                                                            <p>{{item.create_time_title}}</p>
                                                        </div>
                                                        <div></div>
                                                        <div>
                                                            <span>{{$t('workbench.work_insideExamineText')}}</span>
                                                            <p>{{item.inside_audit_title}}</p>
                                                        </div>
                                                    </div>
                                                    <div class="feedback_stage"
                                                         v-else-if="!item.is_client_audit && !item.is_inside_audit">
                                                        <div>
                                                            <span>{{$t('workbench.work_uploadFeilText')}}</span>
                                                            <p>{{item.create_time_title}}</p>
                                                        </div>
                                                        <div></div>
                                                    </div>
                                                </div>

                                                <!--测试任务进度条-->
                                                <div v-if="item.is_test == 1">
                                                    <div class="feedback_task_progress">
                                                        <div class="progress_feedback_style"
                                                             :class="{'isStage':item.upload_time!=null ? true : false}"
                                                             style="flex: 1"></div>
                                                        <div class="progress_feedback_style"
                                                             :class="{'isStage':item.inside_audit_time!=null ? true : false}"></div>
                                                    </div>
                                                    <div class="feedback_stage"
                                                         style="display: flex;justify-content: space-between">
                                                        <div>
                                                            <span>{{$t('workbench.work_uploadFeilText')}}</span>
                                                            <p>{{item.uploadTime}}</p>
                                                        </div>
                                                        <div>
                                                            <span>{{$t('workbench.work_insideExamineText')}}</span>
                                                            <p>{{item.insideAuditTime}}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="rightBar">
                            <img class='right_img_first' src='../../assets/images/left.png'/>
                        </div>
                    </div>
                </template>
                <template v-if="!loadingFlag && examinListDataShow == false">
                    <div style="position: relative;height: 200px;width: 100%">
                        <nothink type="feedback" :text="$t('workbench.work_noFeedbackTips')"></nothink>
                    </div>
                </template>
            </div>
        </div>

        <!--上传界面-->
        <taskDetailsUploadFile v-if="UploadPop" :taskID="task_id" :isTest="is_test" @closeUploadPop="UploadPop = false"
                               @callbackFun="callbackFun"></taskDetailsUploadFile>
    </div>
</template>
<script>
    import api, {memberApi} from 'api';
    import {mapMutations, mapState} from 'vuex';
    import mainNative from '../main-components/mainNative.vue';
    import taskDetailsUploadFile from '../../components/taskDetailsUploadFile';
    import Cookies from 'js-cookie';

    export default {
        data() {
            return {
                UploadPop: false,
                dateList: [],
                widths: '',
                widthAll: '',
                left: 0,
                taskleft: 0,
                momentTime: 0,
                isAngin: false,
                tastList: [],
                examinList: [],
                solt: {},
                index: 0,
                boxHg: '',
                allListWidth: '',
                isToday: true,
                boxHgs: '',
                boxHight: '',
                is_test: 0,
                beforeData: {},
                afterData: {},
                task_id: '',
                startTime: '2018-6-20',
                endTime: '2018-8-10',
                testTaskList: [],
                beforeDataNumber: 0,
                afterDataNumber: 0,
                column: parseInt(Cookies.get('memberColum')) || 14,
                taskConcatList: null,
                tastListDataShow: 'loading',
                examinListDataShow: 'loading',
                screenWidth: null,

                //引导数据
                needGuideData: null,
                changeTaskStatus: null,

                loadingFlag: true
            };
        },
        components: {
            mainNative,
            taskDetailsUploadFile
        },
        mounted() {
            this.getScreenWidth();
            this.initGuide();
        },
        computed: {
            sessionGuideStatus() {
                return this.$store.state.guideStatus;
            }
        },
        watch: {
            sessionGuideStatus(newVal) {
                if (newVal === '1') {
                    this.initGuide();
                }
            }
        },
        methods: {
            ...mapMutations(['setUserStatus', 'changeComponentTaskID']),
            mytaskBubble() {
                let text = this.$lau.bubble.mytask;
                let defaultOptions = [
                    {
                        id: 'tiemSolt',
                        position: 'bottom',
                        title: text[0].title,
                        content: text[0].content,
                        relative: 'body',
                    },
                ];
                let fn = (() => {
                    this.needGuideData = '';
                    this.initGuide();
                });
                this.$nextTick(() => {
                    this.$bubble(defaultOptions, fn);
                });
            },
            // 初始化获取是否引导
            async initGuide() {
                //清空初始化数据
                this.getOriginal();
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$interface.guidePaths.memberGuideIndex;
                this.$axios.get(url).then(({data}) => {
                    _this.$store.commit('setGuideStatus', '2');
                    if (data.guide) {
                        let guide = data.guide;
                        if (guide == 'workBench2') {
                            _this.changeTaskStatus = true;
                        }
                        _this.needGuideData = true;
                        _this.getMsgLists().then(() => {
                            setTimeout(() => {
                                _this.$guide().exit();
                                if (guide == 'workBench') {
                                    _this.$guide().setOptions(this.$CONSTANT.guideOptions)
                                        .addSteps([{
                                            element: document.querySelector('.task_top_box'),
                                            intro: this.$lau.guide_words.k16,
                                            position: 'bottom-left-aligned',
                                            disableInteraction: '1',
                                            start: '1',
                                            total: '5'
                                        }]).start()
                                        .onskip(async function () {
                                            _this.needGuideData = false;
                                            _this.column = 14;
                                            Cookies.set('memberColum', 14);
                                            _this.getOriginal();
                                            _this.getScreenWidth();
                                            _this.getTestTaskList();
                                            await _this.getMsgLists();
                                            _this.mytaskBubble();
                                        })
                                        .oncomplete(function () {
                                            _this.$PublicFuns.completePageGuide('workBench').then(res => {
                                                _this.$router.push({
                                                    path: "/project/details",
                                                    query: {project: 1, id: 9999999, navTitle: i18n.t('workbench.work_myTaskWorkText')}
                                                });
                                                _this.$guide().exit();
                                            });
                                        });
                                } else if (guide == 'workBench2') {
                                    _this.$guide().setOptions(this.$CONSTANT.guideOptions)
                                        .addSteps([
                                            {
                                                element: document.querySelector('.task_top_box'),
                                                intro: this.$lau.guide_words.k17,
                                                position: 'bottom-right-aligned',
                                                disableInteraction: '1',
                                                start: '3',
                                                total: '5'
                                            },
                                            {
                                                element: document.querySelector('.task_feedback_msg'),
                                                intro: this.$lau.guide_words.k18,
                                                position: 'bottom-right-aligned',
                                                disableInteraction: '1',
                                                start: '4',
                                                total: '5'
                                            },
                                        ]).start()
                                        .onskip(function () {
                                            _this.needGuideData = false;
                                            _this.column = 14;
                                            Cookies.set('memberColum', 14);
                                            _this.getOriginal();
                                            _this.getScreenWidth();
                                            _this.getTestTaskList();
                                            _this.getMsgLists();
                                        })
                                        .oncomplete(function () {
                                            _this.$PublicFuns.completePageGuide('workBench3').then(res => {
                                                _this.$router.push({
                                                    path: "/project/details",
                                                    query: {project: 1, id: 9999999, navTitle: i18n.t('workbench.work_myTaskWorkText')}
                                                });
                                                _this.$guide().exit();
                                            });
                                        });
                                } else if (guide === 'mytask') {
                                    this.mytaskBubble();
                                }
                            }, 200);
                        });
                    } else {
                        this.getTestTaskList();
                        this.getMsgLists();
                    }
                });
            },

            callbackFun() {
                this.UploadPop = false;
                this.getOriginal();
                this.getMsgLists();
                if (this.is_test == 1) {
                    this.getTestTaskList();
                }
            },
            //切换周期
            checkoutFun(num) {
                this.column = num;
                Cookies.set('memberColum', num);
                this.getOriginal();
                this.getScreenWidth();
                this.getView(this.taskConcatList);
            },
            //跳转业务详情
            goTask(data, taskID) {
                if (data.is_test == 0) {
                    sessionStorage.projectID = data.project;
                    this.$router.push({
                        path: "/project/details",
                        query: {project: data.project, id: taskID, navTitle: i18n.t('workbench.work_myTaskWorkText')}
                    });
                } else {
                    this.$router.push({
                        path: "/epibol/ManageDetails",
                        query: {enteredID: data.id, TestID: data.test_id, type: 'new', navTitle: i18n.t('workbench.work_myTaskWorkText')}
                    });
                }
                this.setUserStatus('member');
            },
            // 确定开始
            async sureAngin() {
                const parms = {
                    id: this.task_id
                };
                let {data} = memberApi.taskStart(parms);
                if (data.err_code == 0){
                    this.getOriginal();
                    this.getMsgLists();
                    this.getMsgLists();
                    this.$Message.success(data.err_message);
                }
            },
            // 取消开始
            noAngin() {
                // this.isAngin = false
            },
            // 是否开始
            getAgin(data) {
                this.task_id = data.id;
                // this.isAngin = true;
                this.sureAngin();
            },
            // 上传
            getUpload(data) {
                this.task_id = data.id;
                this.is_test = parseInt(data.is_test);
                // this.is_test = '1';
                // this.task_id = '150';
                this.UploadPop = true;
                this.$store.commit('changeComponentTaskID', data.id);
                this.bubbleResource();
            },
            async bubbleResource() {
                let {data} = await api.bubbleResource();
                if (data.err_code === 0 && data.guide === 'workbencResource') {
                    this.bubble();
                }
            },
            bubble() {
                let text = this.$lau.bubble.workbencResource;
                let defaultOptions = [
                    {
                        id: 'choice_page_ul',
                        position: 'bottom',
                        title: text[0].title,
                        content: text[0].content,
                        relative: 'body',
                    },
                    {
                        id: 'singleUpload',
                        position: 'top',
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
            //获取测试任务数据
            async getTestTaskList() {
                let {data} = await memberApi.testTaskShaft();
                if (data.err_code == 0){
                    let temp = {};
                    let array = data.data;
                    //测试任务数据组装 为了和普通任务字段完整性一致  免除后面不必要的问题
                    for (let i = 0; i < array.length; i++) {
                        array[i].create_time = array[i].add_time;
                        array[i].is_test = 1;
                        array[i].startDate = this.timeFun(array[i].add_time);
                        array[i].endDate = this.timeFun(array[i].end_time);
                        array[i].name = array[i].test_name;
                        array[i].run_uid = null;
                        array[i].tasktype_id = array[i].test_id;
                        array[i].update_time = 0;
                        array[i].expect_start_time = array[i].add_time;
                        array[i].expect_end_time = array[i].end_time;
                        array[i].start_time = array[i].add_time;
                        array[i].end_time = array[i].end_time;
                        array[i].project = array[i].test_id;
                        array[i].image = '';
                        array[i].status_text = '';
                        array[i].stage = {};
                        array[i].project_name = array[i].test_name;
                    }
                    var filterObj = {};
                    var tempIndex = [];
                    for (let j = 0; j < array.length; j++) {
                        if (temp[array[j].startDate]) {
                            tempIndex.push(j);
                            filterObj[array[j].startDate] = tempIndex;
                        } else {
                            temp[array[j].startDate] = [array[j]];
                        }
                    }
                    for (var i in filterObj) {
                        filterObj[i].map(function (item, index, arr) {
                            temp[i].push(array[item]);
                        });
                    }
                    this.testTaskList = temp;
                }
            },
            //转换时间
            timeFun(time) {
                var unixTimestamp = new Date(time * 1000);
                var year = unixTimestamp.getFullYear();
                var month = unixTimestamp.getMonth() + 1;
                month = month < 10 ? ('0' + month) : month;
                var date = unixTimestamp.getDate();
                date = date < 10 ? ('0' + date) : date;
                return year + '-' + month + '-' + date;
            },
            // 获取数据
            getMsgList() {
                return new Promise((resove, reject) => {
                    for (let i = 1; i < 8; i++) {
                        const indexs = i * 8;
                        this.getBefore(indexs).then((data) => {
                            let lists = Object.assign(this.beforeData, data.list);
                            this.beforeData = lists;
                            if (data.day == 56) {
                                for (let j = 0; j < 8; j++) {
                                    const Jindexs = j * 8;
                                    this.getAfter(Jindexs).then((data) => {
                                        let Jlists = Object.assign(this.afterData, data.list);
                                        this.afterData = Jlists;
                                        if (data.day == 56) {
                                            resove();
                                        }
                                    })["catch"](() => {
                                        this.$Message.error('请求失败');
                                        reject();
                                    });
                                }
                            }
                        })["catch"](() => {
                            this.$Message.error('请求失败');
                        });
                    }
                });
            },
            getMsgLists() {
                return new Promise((resolve, reject) => {
                    this.getMsgList().then(() => {
                        this.getAll().then((res) => {
                            if (res) {
                                resolve(true);
                            } else {
                                reject(false);
                            }
                        });
                    });
                });
            },
            // 获取前面的数据
            getBefore(number) {
                return new Promise(async (resove, reject) => {
                    const parms = {
                        xdays: number,
                        needGuideData: this.needGuideData ? true : null,
                        status: this.changeTaskStatus ? true : null
                    };
                    let {data} = await memberApi.getTaskList(parms);
                    if (data.err_code == 0){
                        resove({list: data.data.dates, day: number});
                    } else {
                        reject();
                    }
                });
            },
            // 获取后面的数据
            async getAfter(number) {
                return new Promise(async (resove, reject) => {
                    const parms = {
                        xdays: -number,
                        needGuideData: this.needGuideData ? true : null,
                        status: this.changeTaskStatus ? true : null
                    };
                    let {data} = await memberApi.getTaskList(parms);
                    if (data.err_code == 0) {
                        resove({list: data.data.dates, day: number});
                    } else {
                        reject();
                    }
                });
            },
            // 获取任务时间数据
            getAll() {
                return new Promise(async (resolve, reject) => {
                    const beforeLists = this.beforeData;
                    const afterLists = this.afterData;
                    const testTaskList = this.testTaskList;
                    let _this = this;
                    const parms = {
                        needGuideData: this.needGuideData ? true : null,
                        status: this.changeTaskStatus ? true : null
                    };
                    let {data} = await memberApi.getTaskList(parms);
                    if (data.err_code == 0){
                        const nowList = data.data.dates;
                        _this.momentTime = data.current_time;
                        let commonTaskList = Object.assign(afterLists, nowList, beforeLists);
                        let taskList = _this.AssignObjData(commonTaskList, testTaskList);
                        _this.taskConcatList = taskList;
                        _this.getView(taskList);
                        _this.loadingFlag = false;
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            },
            //普通任务 测试任务数据合并
            AssignObjData(task, test) {
                let tasklen = Object.keys(task).length;
                let testlen = Object.keys(test).length;
                let max = null;
                let min = null;
                let AssignObj = {};
                if (tasklen > 0 && testlen > 0) {
                    if (tasklen > testlen) {
                        max = task;
                        min = test;
                    } else {
                        max = test;
                        min = task;
                    }
                    for (var ak in max) {
                        var aa = max[ak];
                        for (var bk in min) {
                            var bb = min[bk];
                            if (ak == bk) {
                                var aaa = [];
                                var bbb = [];
                                var ccc = [];
                                for (var i = 0; i < aa.length; i++) {
                                    aaa.push(aa[i]);
                                }
                                for (var j = 0; j < bb.length; j++) {
                                    bbb.push(bb[j]);
                                }
                                ccc = aaa.concat(bbb);
                                AssignObj[ak] = ccc;
                            } else {
                                AssignObj = Object.assign(max, min);
                            }
                        }
                    }
                } else if (tasklen > 0 && testlen <= 0) {
                    AssignObj = task;
                } else if (testlen > 0 && tasklen <= 0) {
                    AssignObj = test;
                }
                return AssignObj;
            },
            // 获取视图
            getView(list) {
                let lists = [];
                let tastList = [];
                let objList = [];
                for (let i in list) {
                    lists.push(i);
                    tastList = tastList.concat(list[i]);
                }

                //过滤掉项目停止的普通任务
                tastList = tastList.filter(function (item) {
                    if (item.is_test == 0 && item.project_status != 4) {
                        return item;
                    } else if (item.is_test == 1) {
                        return item;
                    }
                });

                if (tastList.length > 0) {
                    this.tastListDataShow = true;
                    tastList.forEach((items, i) => {
                        let flag = true;
                        objList.forEach((elems, j) => {
                            if (items.id == elems.id) {
                                flag = false;
                            }
                        });
                        if (flag) {
                            if (items.is_test == 0) {
                                if (items.status == 1) {
                                    items.isComplete = i18n.t('workbench.work_noBeginStatus');
                                    items.leftTopColor = '@orange';
                                    items.taskBack = 'task-wait';
                                } else if (items.status == 2) {
                                    items.isComplete = i18n.t('workbench.work_conducting');
                                    items.leftTopColor = '#9ED3FD';
                                    items.taskBack = 'task-doing';
                                } else if (items.status == 3) {
                                    items.isComplete = i18n.t('workbench.work_stoping');
                                    items.leftTopColor = '#ff9283';
                                    items.taskBack = 'task-pause';
                                } else {
                                    items.isComplete = i18n.t('workbench.work_complete');
                                    items.leftTopColor = '#3bceb6';
                                    items.taskBack = 'task-complete';
                                }
                            } else if (items.is_test == 1) {
                                if (items.status == 1) {
                                    items.isComplete = i18n.t('workbench.work_examineTab');
                                    items.leftTopColor = '#9ED3FD';
                                    items.taskBack = 'task-doing';
                                } else if (items.status == 2) {
                                    items.isComplete = i18n.t('workbench.work_complete');
                                    items.leftTopColor = '#3bceb6';
                                    items.taskBack = 'task-complete';
                                } else if (items.status == 3) {
                                    items.isComplete = i18n.t('workbench.work_feedbackTab');
                                    items.leftTopColor = '#9ED3FD';
                                    items.taskBack = 'task-doing';
                                } else {
                                    items.isComplete = i18n.t('workbench.work_conducting');
                                    items.leftTopColor = '#9ED3FD';
                                    items.taskBack = 'task-doing';
                                }
                            }
                            objList.push(items);
                        }
                    });
                    let countList = this.ArrSort(lists);
                    let index = countList.length - 1;
                    this.startTime = countList[0];
                    this.endTime = countList[index];
                    this.tastList = objList;
                    this.getTimeSlot();
                    this.getTast();
                    this.getFeedback(list);
                } else {
                    this.tastListDataShow = false;
                    this.examinListDataShow = false;
                }
            },
            //数组排序
            ArrSort(arr) {
                return arr.sort(function (a, b) {
                    return (parseInt(a.replace(/-/g, '')) - parseInt(b.replace(/-/g, '')));
                });
            },
            // 获取任务
            getTast() {
                let list = this.tastList;
                let startTimes = this.startTime;
                let endTimes = this.endTime;
                const todays = this.getTimes(Date.now()).times;
                const clentWidth = Number(this.widths.split('px')[0]);
                const startCode = new Date(startTimes.replace(/-/g, '/')).getTime();
                const endCode = new Date(endTimes.replace(/-/g, '/')).getTime();
                const dateList = this.dateList;
                let startTime = '';
                let endTime = '';
                let starts = '';
                let diffDaye = 0;
                let index = 0;
                list.forEach((items, itInd) => {
                    // console.log(items)
                    console.log(JSON.stringify({
                        name: items.name,
                        start_time: items.start_time !== '0' ? this.getTimes(items.start_time * 1000).title : null,
                        end_time: items.end_time !== '0' ? this.getTimes(items.end_time * 1000).title : null,
                        expect_start_time: items.expect_start_time !== '0' ? this.getTimes(items.expect_start_time * 1000).title : null,
                        expect_end_time: items.expect_end_time !== '0' ? this.getTimes(items.expect_end_time * 1000).title : null,
                        status_text: items.status_text
                    }));
                    // if (items.end_time !=='0') {
                    //     endTime = items.end_time
                    // } else {
                    endTime = items.expect_end_time;
                    // }
                    // if (items.start_time !=='0') {
                    //     startTime = items.start_time
                    // } else {
                    startTime = items.expect_start_time;
                    // }
                    const expectEnd = Number(items.expect_end_time) * 1000;
                    const expectStart = Number(items.expect_start_time) * 1000;

                    items.startDay = this.getTimes(expectStart).title;
                    items.endDay = this.getTimes(expectEnd).title;
                    if (Number(items.end_time) - Number(items.expect_end_time) < 0) {
                        const delay = todays - expectEnd;
                        if (delay > 0 && !Number(items.end_time)) {
                            items.isDelay = true;
                        } else {
                            items.isDelay = false;
                        }
                    } else {
                        items.isDelay = true;
                    }
                    const startNow = this.getTimes(Number(startTime) * 1000).times; // 后台获取的时间戳是10位，
                    const endNow = this.getTimes(Number(endTime) * 1000).times;
                    const diffenc = startCode - startNow;
                    const diffencEnd = endCode - endNow;
                    let diffStart = 0;
                    let diffEnd = 0;
                    if (diffenc > 0) {
                        diffStart = startCode;
                    } else {
                        diffStart = startNow;
                    }
                    if (diffencEnd > 0) {
                        diffEnd = endNow;
                    } else {
                        diffEnd = endCode;
                    }
                    diffDaye = (diffEnd - diffStart) / (24 * 60 * 60 * 1000) + 1;
                    const diffDayes = (this.getTimes(expectEnd).times - this.getTimes(expectStart).times) / (24 * 60 * 60 * 1000) + 1;
                    starts = this.getTime(diffStart, 0).dateStr;
                    // if (diffDaye <= 0) { // 不在时间线内的删除
                    //     list.splice(itInd, 1)
                    // }
                    dateList.forEach((elems, inds) => {
                        if (elems.dateStr == starts) {
                            index = inds;
                        }
                    });
                    const centWidth = clentWidth * diffDaye - 20;
                    const clienLeft = index * clentWidth + 10;
                    const startIndex = index;
                    items.startIndex = startIndex; // 任务开始的数据
                    items.endIndex = startIndex + diffDaye - 1; // 最后结束位置
                    items.centWidth = centWidth + 'px';
                    items.clienLeft = clienLeft + 'px';
                    items.workDay = diffDayes;
                    items.ends = diffEnd;
                    items.starts = diffStart;
                });
                this.getTop();
                this.getBackground();
            },
            // 获取今天的日期
            getToDay() {
                const dateList = this.dateList;
                const width = this.widths.split('px')[0];
                const todays = Date.now();
                const element = document.getElementById('timeSoltFather');
                const todayStr = this.getTime(todays, 0).dateStr;
                const widthAll = this.widthAll;
                dateList.forEach((items, index) => {
                    if (todayStr == items.dateStr) {
                        items.weeks = i18n.t('workbench.work_todayTag');
                        const lefts = -((index) * width - 1);
                        const moves = lefts + 'px';
                        this.left = lefts;
                        element.setAttribute('style', `width: ${widthAll}; left: ${moves}`);
                        this.dynamicsGetBeforAndAfterForTaskNumber(Math.abs(parseInt(lefts / width)));
                    }
                });
            },
            // 获取task排序位子
            getTop() {
                const list = this.tastList;
                const listLt = list.length;
                let solt = this.solt;
                let index = this.index;
                if (Object.keys(solt).length == 0) {
                    solt[index] = [];
                    if (!listLt) {
                        solt[index].push(
                            {
                                startIndex: 0,
                                endIndex: 0
                            }
                        );
                    } else {
                        solt[index].push(list[0]);
                    }
                    this.solt = solt;
                } else {
                    index++;
                    let items = list[index];
                    let ends = items.ends;
                    let starts = items.starts;
                    let object = []; // 计算层级
                    let isPing = false; // 是否匹配
                    let isPush = false; // 循环层级
                    let isXun = false; // 是否循环
                    for (let i in solt) {
                        object.push(i);
                    }
                    object.forEach(element => { // 循环层级
                        const ok = solt[element];
                        if (!isXun) {
                            ok.forEach(elems => {
                                const soltEnds = Number(elems.ends);
                                const soltStarts = Number(elems.starts);
                                const endsCode = ends - soltStarts;
                                const startsCode = soltEnds - starts;
                                // if (endsCode >= 0 && startsCode >= 0) {
                                isPush = true;
                                // }
                            });
                            if (!isPush) {
                                solt[element].push(items);
                                items.top = element * 80 + 'px';
                                isPing = true;
                                isPush = true;
                                isXun = true;
                                this.solt = solt;
                            } else {
                                isPush = false;
                                // isPing = false
                            }
                        }
                    });
                    if (!isPing) {
                        const objLt = object.length - 1;
                        const num = Number(object[objLt]) + 1;
                        solt[num] = [];
                        solt[num].push(items);
                        items.top = num * 80 + 'px';
                        this.solt = solt;
                    }
                    this.index = index;
                }
                if (index < listLt - 1) { // 执行次数，因为本身执行一次，所以减一
                    this.getTop();
                }
                if (index == listLt - 2) {
                    this.tastList = list;
                    this.getHieght();
                }
            },
            // 获取背景
            getBackground() {
                const list = this.solt;
                const object = [];
                for (let i in list) {
                    object.push(i);
                }
                // 最低6层测试
                let num = 0;
                if (object.length < 6) {
                    num = 6;
                    const objLt = object.length;
                    const differ = 6 - objLt;
                    const soltNum = Number(object[objLt - 1]);
                    for (let i = 0; i < differ; i++) {
                        const nums = i + soltNum + 1;
                        list[nums] = [
                            {
                                startIndex: 0,
                                endIndex: 0
                            }
                        ];
                    }
                } else {
                    num = object.length;
                }
                // 测试结束
                const numbers = this.dateList.length;
                const widths = this.widths;
                let element = document.getElementsByClassName('timeSoltFather')[0];
                let div = document.createElement('div');
                div.setAttribute('id', 'lattice');
                let htmlDate = '';
                for (let i = 0; i < num; i++) {
                    let HierList = list[i];
                    let childrenString = ''; // 多少子元素
                    for (let k = 0; k < numbers; k++) {
                        let index = 0;
                        let isremove = false;
                        for (let y = 0; y < HierList.length; y++) {
                            index++;
                            const hierLength = HierList.length;
                            const start = HierList[y].startIndex;
                            const end = HierList[y].endIndex;
                            let appendStr = '';
                            if (k >= start && k < end) {
                                isremove = true;
                            }
                            if (index == hierLength) {
                                if (isremove) {
                                    appendStr = `<div class='latt-child latt-border' style='width: ${widths};'></div>`;
                                } else {
                                    appendStr = `<div class='latt-child' style='width: ${widths}'></div>`;
                                }
                                childrenString += appendStr;
                            }
                        }
                    }
                    htmlDate += `<div class='latt-father'>${childrenString}</div>`;
                }
                div.innerHTML = htmlDate;
                element.appendChild(div);
            },
            getHieght() {
                const list = this.solt;
                let ObjList = [];
                for (let i in list) {
                    ObjList.push(i);
                }
                const length = ObjList.length;
                this.boxHg = length * 80 + 'px';
                this.boxHgs = length * 80 + 50 + 'px';
            },
            // 转换时间
            getTimes(str) {
                const now = new Date(str);
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                month = month < 10 ? ('0' + month) : month;
                var date = now.getDate();
                date = date < 10 ? ('0' + date) : date;
                const timesTile = year + '-' + month + '-' + date;
                const dateTime = year + '/' + month + '/' + date;
                const itms = {
                    times: new Date(dateTime).getTime(),
                    title: timesTile
                };
                return itms;
            },
            // 获取时间任务时间段
            getTimeSlot() {
                const startTime = this.startTime;
                const endTime = this.endTime;
                const isToday = this.isToday; // 只允许第一次加载定位今天
                const startStr = new Date(startTime.replace(/-/g, '/')).getTime();
                const endStr = new Date(endTime.replace(/-/g, '/')).getTime();
                const timeNum = (endStr - startStr) / (24 * 60 * 60 * 1000);
                var list = [];
                for (let i = 0; i < timeNum + 1; i++) {
                    let dateList = this.getTime(startStr, i);
                    list.push(dateList);
                }
                const width = this.widths.split('px')[0];
                this.widthAll = width * (timeNum + 1) + 'px';
                this.dateList = list;
                if (isToday) {
                    this.getToDay();
                    this.isToday = false;
                }
                //debugger
            },
            // mousedown
            down(e) {
                if (!this.tastListDataShow) {
                    return false;
                }
                const ownDiv = e.target; // 获取元素
                const isSx = false; // 是否刷新
                const ownWidth = ownDiv.clientWidth; // 获取元素宽度
                const startDisX = e.clientX;// 获取鼠标开始位置
                let isClick = false;
                let width = Number(this.widths.split('px')[0]);
                const element = document.getElementsByClassName('timeSoltFather')[0];
                const widthAll = this.widthAll;
                const lefts = this.left;
                const WidthStr = Number(widthAll.split('px')[0]);
                var endDisX = 0;
                var that = this;
                let column = this.column;
                const fun = function (e) {
                    isClick = true;
                    endDisX = e.clientX - startDisX + lefts > 0 ? 0 : e.clientX - startDisX + lefts < -(WidthStr - (width * column)) ? -(WidthStr - (width * column)) + 1 : e.clientX - startDisX + lefts;
                    that.left = endDisX;
                    const movePx = endDisX + 'px';
                    element.setAttribute('style', `width: ${widthAll}; left: ${movePx}`);

                    if (endDisX < 0) {
                        that.dynamicsGetBeforAndAfterForTaskNumber(Math.abs(parseInt(endDisX / width)));
                    }
                };
                let unFun = function (e) {
                    document.removeEventListener('mousemove', fun, false);
                    document.removeEventListener('mouseup', unFun, false);
                    if (!isClick) {

                    }
                };
                document.addEventListener('mousemove', fun, false);
                document.addEventListener('mouseup', unFun, false);
            },
            getdown(e) {
                if (!this.tastListDataShow) {
                    return false;
                }
                const ownDiv = e.target; // 获取元素
                const isSx = false; // 是否刷新
                const ownWidth = ownDiv.clientWidth; // 获取元素宽度
                const startDisX = e.clientX;// 获取鼠标开始位置
                let isClick = false;
                // let width = Number(this.widths.split('px')[0]) + 10
                const element = document.getElementsByClassName('task_feedback_box')[0];
                const widthAll = this.allListWidth;
                const lefts = this.taskleft;
                var endDisX = 0;
                var that = this;
                const fun = function (e) {
                    isClick = true;
                    endDisX = e.clientX - startDisX + lefts > 30 ? 30 : e.clientX - startDisX + lefts;
                    that.taskleft = endDisX;
                    const movePx = endDisX + 'px';
                    element.setAttribute('style', `width: ${widthAll}; left: ${movePx}`);
                };
                let unFun = function (e) {
                    document.removeEventListener('mousemove', fun, false);
                    document.removeEventListener('mouseup', unFun, false);
                    if (!isClick) {

                    }
                };
                document.addEventListener('mousemove', fun, false);
                document.addEventListener('mouseup', unFun, false);
            },
            // 获取时间
            getTime(str, Num) {
                const now = new Date(str + Num * 24 * 60 * 60 * 1000);
                var month = now.getMonth() + 1;
                var date = now.getDate();
                var year = now.getFullYear();
                var hour = now.getHours();
                var minute = now.getMinutes();
                var second = now.getSeconds();
                const week = now.getDay();
                var weekday = [i18n.t('workbench.work_Sunday'), i18n.t('workbench.work_Monday'), i18n.t('workbench.work_Tuesday'), i18n.t('workbench.work_Wednesday'), i18n.t('workbench.work_Thursday'), i18n.t('workbench.work_Friday'), i18n.t('workbench.work_Saturday')];
                var weekString = weekday[week];
                month = month < 10 ? ('0' + month) : month;
                date = date < 10 ? ('0' + date) : date;
                hour = hour < 10 ? ('0' + hour) : hour;
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                var dateStr = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
                const tims = {
                    dateStr: month + '-' + date,
                    weeks: weekString,
                    date: dateStr,
                    dataCover: new Date(dateStr.replace(/-/g, "/")).getTime() / 1000
                };
                return tims;
            },
            // 获取开始和后面的时间
            getShowTime() {
                var list = [];
                for (let i = 1; i < 7; i++) {
                    const dateObj = this.getTime(i);
                    list.push(dateObj);
                }

                this.dateList = list;
            },
            // 获取屏幕宽度
            getScreenWidth() {
                const width = $('.myTask').width();
                this.widths = Math.floor((width - 1) / this.column * 100) / 100 + 'px';
            },
            // 获取反馈信息
            getFeedback(obj) {
                // console.log(obj)
                let ones = {};
                let index = 0;
                let allList = [];
                let idList = [];
                let heightList = [];
                const clentWidth = Number(this.widths.split('px')[0]);
                let testArr = [];
                for (let i in obj) {
                    index++;
                    ones[i] = [];
                    const left = clentWidth * (index - 1) + 10 * (index - 1) + 'px';
                    const list = obj[i];
                    // console.log(list)
                    list.forEach(item => {
                        if (item.is_test == 0) {
                            if (item.project_status != 4) {
                                if (Object.keys(item.stage).length != 0) {
                                    item.stage.project = item.project;
                                    item.stage.taskID = item.id;
                                    item.stage.is_test = 0;
                                    item.stage.is_client_audit = item.is_client_audit;
                                    item.stage.is_inside_audit = item.is_inside_audit;
                                    item.stage.left = left;
                                    item.stage.name = item.name;
                                    item.stage.parentId = item.id;
                                    item.stage.project_name = item.project_name;
                                    ones[i].push(item.stage);
                                }
                            }
                        } else if (item.is_test == 1 && item.status == 1 || item.is_test == 1 && item.status == 3) {
                            item.uploadTime = this.getTimeTitle(item.upload_time);
                            item.insideAuditTime = this.getTimeTitle(item.inside_audit_time);
                            testArr.push(item);
                        }
                    });
                }

                for (let k in ones) {
                    const list = ones[k];
                    let topNum = 0;
                    list.forEach((items, index) => {
                        items.centWidths = clentWidth + 'px';
                        items.chilrenLeft = clentWidth / 2 + 'px';
                        items.top = index * 210 + 'px';
                        if (index > 0) {
                            const status = list[index - 1].status;
                            if (status !== '1') {
                                topNum += 360;
                            } else {
                                topNum += 210;
                            }
                        } else {
                            topNum = 0;
                        }
                        items.top = topNum + 'px';
                        heightList.push(index * 210);
                        if (items.create_time) {
                            items.create_time_title = items.create_time ? this.getTimeTitle(items.create_time) : null;
                            items.client_audit_title = items.client_audit_time ? this.getTimeTitle(items.client_audit_time) : null;
                            items.inside_audit_title = items.inside_audit_time ? this.getTimeTitle(items.inside_audit_time) : null;
                            if (!allList.length) {
                                allList.push(items);
                                idList.push(items.id);
                            } else {
                                if (idList.indexOf(items.id) == -1) {
                                    idList.push(items.id);
                                    allList.push(items);
                                }
                            }
                        }
                    });
                }
                heightList.sort();
                const height_min = $(window).height() - 420; // 300是除去他元素的总高度
                const length = heightList.length - 1;
                const boxHgs = Number(this.boxHgs.split('px')[0]);
                if (length >= 0) {
                    const lengths = boxHgs;
                    if (lengths > height_min) {
                        this.boxHight = boxHgs + 'px';
                    } else {
                        this.boxHight = height_min + 'px';
                    }
                } else {
                    if (boxHgs > height_min) {
                        this.boxHight = boxHgs + 'px';
                    } else {
                        this.boxHight = height_min + 'px';
                    }
                }
                const testList = testArr.length;
                const listLt = allList.length;
                this.allListWidth = (listLt + testList) * 520 - 20 + 'px';

                allList.forEach(element => {
                    if (element.create_time) {
                        element.firstStage = 'isStage';
                    } else {
                        element.firstStage = '';
                    }
                    if (element.inside_audit_time) {
                        element.secondStage = 'isStage';
                    } else {
                        element.secondStage = '';
                    }
                    if (element.client_audit_time) {
                        element.thirdStage = 'isStage';
                    } else {
                        element.thirdStage = '';
                    }
                    // if (!element.create_time && !element.inside_audit_time && !element.client_audit_time) {
                    //     element.firstStage = '',
                    //     element.secondStage = '',
                    //     element.thirdStage = ''
                    // }
                });

                this.examinList = allList.concat(testArr);

                if (this.examinList.length === 0) {
                    this.examinListDataShow = false;
                } else {
                    this.examinListDataShow = true;
                }

            },
            // 获取时间字段
            getTimeTitle(time) {
                if (time) {
                    let nowTime = new Date();//获取当前时间
                    let dateDiff = nowTime.getTime() - (time * 1000);//时间差的毫秒数
                    let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
                    let leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                    let hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数

                    //计算相差分钟数
                    let leave2 = leave1 % (3600 * 1000);    //计算小时数后剩余的毫秒数
                    let minutes = Math.floor(leave2 / (60 * 1000));//计算相差分钟数
                    //计算相差秒数
                    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                    var seconds = Math.round(leave3 / 1000);

                    // console.log(dayDiff +'+++' + hours +'+++'+ minutes +'---'+seconds)
                    return dayDiff > 0 ? dayDiff + i18n.t('workbench.work_dayAgo') : hours > 0 ? hours + i18n.t('workbench.work_hoursAgo') : minutes > 0 ? minutes + i18n.t('workbench.work_minutesAgo') : seconds > 0 ? seconds + i18n.t('workbench.work_secondAgo') : i18n.t('workbench.work_ganggang');
                } else {
                    return '';
                }

            },
            //动态获取前后任务数
            dynamicsGetBeforAndAfterForTaskNumber(creenIndex) {
                // console.log(creenIndex)
                // console.log('动态获取前后任务数');
                let nowDayIndex = creenIndex;
                let lastDayIndex = (creenIndex + this.column);
                let nowDay = this.dateList[nowDayIndex];
                let lastDay = this.dateList[lastDayIndex];
                // console.log(nowDayIndex+'-----------------'+(lastDayIndex));
                // console.log(nowDay)

                let taskData = this.tastList;
                let beforeNum = 0;
                let afterNum = 0;
                // console.log(JSON.stringify(taskData))
                taskData.forEach((creent, index, arr) => {
                    if (parseInt(creent.expect_end_time) < nowDay.dataCover) {
                        beforeNum++;
                    }
                    let endTime = creent.expect_start_time;
                    // let endTime = creent.start_time!== '0'  ? this.resetTime(creent.start_time) : creent.expect_start_time;
                    if (lastDay.dataCover < endTime) {
                        afterNum++;
                    }
                });
                this.beforeDataNumber = beforeNum;
                this.afterDataNumber = afterNum;
            },
            //时分秒置零
            resetTime(time) {
                let settime = new Date(time * 1000);
                let timeStr = settime.getFullYear() + '-' + (settime.getMonth() + 1) + '-' + settime.getDate() + ' 00:00:00';
                return new Date(timeStr).getTime() / 1000;
            },
            //左右移动
            moveFUn(direction, num) {
                const width = this.widths.split('px')[0];
                let element = document.getElementById('timeSoltFather');
                let widthAll = this.widthAll.split('px')[0];
                let moves = (width * this.column);
                if (direction == 'left') {
                    if (num > 0) {
                        this.left += moves;
                        if (this.left >= 0) {
                            this.left = 0;
                        }
                        element.setAttribute('style', `width: ${widthAll + 'px'}; left: ${this.left + 'px'}`);
                    }

                } else {
                    if (num > 0) {
                        this.left -= moves;
                        if (this.left <= -widthAll + moves) {
                            this.left = -widthAll + moves;
                        }
                        element.setAttribute('style', `width: ${widthAll + 'px'}; left: ${this.left + 'px'}`);
                    }
                }
                this.dynamicsGetBeforAndAfterForTaskNumber(Math.abs(parseInt(this.left / width)));
            },
            // 回到初始状态
            getOriginal() {
                this.index = 0;
                this.boxHgs = '';
                this.boxHight = '';
                this.tastList = [];
                this.examinList = [];
                this.solt = {};
                this.isToday = true;
                this.beforeData = {};
                this.afterData = {};
            },
        }
    };
</script>
<style lang="less">
    .my_task_top {
        background: rgb(72, 197, 183);
    }

    .my_task_bottom {
        background: rgb(26, 153, 170);
    }

    .page_week_all {
        width: 100%;
        min-height: 100%;
        position: relative;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        user-select: none;
    }

    .imPlementerContainer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

    }

    .taskFeedbackDiv {
        margin-top: 20px;
        margin-bottom: 30px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
        border-radius: 3px;
    }

    .myTask {

        position: relative;
        display: flex;
        width: 100%;
        justify-content: space-between;
        .leftBar, .rightBar {
            position: absolute;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            z-index: 3;
            background-repeat: no-repeat !important;
            background-position: center center !important;
            cursor: pointer;
            span {
                margin-top: -100px;
                display: inline-block;
                border: 1px solid @base;
                border-radius: 100%;
                background: @base;
                width: 25px;
                height: 25px;
                text-align: center;
                line-height: 25px;
                font-size: 16px;
                color: @white;
            }
        }
        .leftBar {
            left: -10px;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAAAvZJREFUSIm9189vFkUcx/FXn7a0SopSpdTfpFqIP5KCxN+IF3oxHpyTV4+e93/w6J69cjDGmDAXo0Y96IUq6oFokMQYbUWhSJXwq1Ra9DDz2PWRtrtb9ZNsdmaf7+x7vrMzn5mn77UjR2xGRQiN4ssYX8BMEcLCQAteH27FDuwoYxzFbRjCYCXmAs5hAWdwCiuYxhRe7auReQdjmMS9GM7PBtCfy1exjOu5E8MYyeVq7O/Ymutv1sn8bjybs1nIGZzDJVwpQlhZq2EZYz9uxjbchecyHKbqwOfxLs7jjxrxfyl37GK+fipjfAg78QaO14Ev5WtdlTFOYzveL0K4sEbYx3i7COEy1Pnm66oIQRnjy9J3/g27cLgI4cxGbTubIqOMcR9GixBeL0J4K3fg6TptNw3Hk/i8Ul/Blf8DPiat7S+hjHErxrv1/xp+EKeLELqZTuNsEcIv/wZ8AofweK6P4lHckuvj+KwSv6envq56l9rt2Ce51TwelkxlJ16UDOIyduNXKcs5KGN8ML/j6zbwPjyB7yS73I+ZDB/CSziGk3hEcr0PKu0P4EQRwvW68OqwT0oZn8TZ/Ox0vg9hNv/GqtPNQhnjFmmzOVYX3Au/B9/m8gi+kJYNaYf6pBL7mLSel3P9EM4XIcw3gQ9U7oP4Odc3esmnqM7o3T2dawSfwDXpW9dRd/iVMU5I2+VXTeHdYR/HXNPGWQdwvAhhecPIHnUz77c6yZpquzQhG6uTG3ekSdVUz0jzY7mM8ak28DulU0mjg0LWFI5KrranDXxEWjZNNYlOdrgOtrSBd9Q4qdxAS3gvl3dJttsYviS5U1PNSVZMOtX+2AY+L+1WrVTGOImb/P1AURt+SnK3sRbsQTyPo0UIi23gJE/fL02+utqGVzBXhDDTFMyqyXwvDd1B6Tv+YG2r7cdeafv9pgjhozbgKhxOSJvFXtyPRWlLXZQ8YBh34D7pb9E72lvyP+Ay/ENp9j8gnWAGrC7Ja9LBf3Yz0K7+BCwYxZe4wfNQAAAAAElFTkSuQmCC");
        }
        .rightBar {
            right: -10px;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAAAxZJREFUSIm9189rXUUUB/DPSx5R27T4q2rr7wqKlSpNBMW6sCvBH8iAC3fiQhDUzfwFIm4Ee8GVIF2IoohCLkhd2GqloLaL1EVobWPaasUmpr8gSZuUtmlczDxJH31J7g32C8O7Z+6c85175sw55zW2DgzIeAOf4ZwKiCFUWX4Fmvn3TbyEbzCN+3FPHrfjVsyhgQs4jxMYK8ryH4xiPIYwW4W8sXVgYCM+xKVscDVms9waJzPhFLrQjRW43LbuPP7EfhxZbDNNvDBPvgEfYwSnMYGLC+h3YyV6cQfW4z7ciUHsWYz8A+zAW9nQ9oUU2jAbQ5jEpOT6X6Eoy5slTyyIpvRl+/AaHslzV1Ns4lXp3D/HTCejMYQzS9l5V5t8oAPxSrwnBd5qvCsd0bLQTt4JWzLZ+yhwFq9cK/IJ6Qa08BU2SEfwv5P/LLn+qSwflM78yWtBfhm/4Ll5c3uxeTnkzcWX/IcdeELywDnsxtNFWfZKWXEzTsQQhouyfBx34e8YwmAng415uX0peAdH8WmWX5fc38xjBc7gOhzD3RjG9dItGYohHG0ZW6rbW/gBm+bJ2/EgpmII2/AJ1uDHGML3+BIPSWn5APqLsrypLvleKaU+muUxKS80IGe7/VIREkOYkQrRVAxhRMqCfXXJL0op9Pl5c3uwoSjL1gZ2xhD+mPd+V2szOIRVdclhJ26TzrFl/Fsd7nwMYSyGMJyfT0NRlmupFu0tHMcpvIivc9ncV0F/VIqDsTpfDt/hsZq6f0m3opbb4WH0SIWmKk6hUZTlqjrkG6X7+zueqaocQ7gkJaV765D34Qi+QF9Rlj01bIyjtw55l9Q2TWf52Ro2JqgX7TNSR0tqtbtr2JhDow75b1KBgYM1+/Ye6kX7kNRYLKeTWYcLda/aNvRjbVXFHKC3YKQu+SEpzb5dlOX6CsRNqS6MxxAmq9bzdmzJYxC7YghnO5B2S3/BNkkNx26qNxNXwxq8LHU4x3BY6nTmpKZiHW6USu9QDOFwS7FOtF+BGMJJfJQrVT8eyK9mpVo+jZ9iCKPtuv8C117myeFozb8AAAAASUVORK5CYII=");
        }
        .centerContenr {
            width: 100%;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
            overflow: hidden;
            border-radius: 3px;
        }
    }

    .times_box {
        height: 50px;
        line-height: 50px;
        text-align: center;
        border: 1px solid @baseboard;
        border-left: none;
        margin-top: -1px;
        float: left;
        background: #fff;
    }

    .times_box:first-child {
        border-left: 1px solid @baseboard;
    }

    .tiemSolt {
        /*box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);*/
        display: grid;
        border-top: 1px solid @baseboard;
        width: 100%;
        /*margin-bottom: 10px;*/
        // min-height: 600px;
        /* margin: 50px 0px; */
        overflow: hidden;
        position: relative;
    }

    .times_box > span:nth-child(2) {
        margin-right: 10px;
    }

    .task_top_box {
        position: absolute;
        height: 60px;
        /* padding: 10px; */
        border-radius: 4px;
        overflow: hidden;
        z-index: 1;
        // background: rgb(72,197,183);
    }

    .timeSoltFather {
        //transition:left 1s linear;
        background: #fdfdfd;
        position: absolute;
        top: 0;
    }

    .task_ka {
        width: 100%;
        /* height: 50px; */
        margin-top: 60px;
        position: relative;
    }

    .my_strips {
        width: calc(100% - 200px);
        height: 60px;
        border-bottom: 10px solid rgb(26, 153, 170);
    }

    .myTaskAll {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 60px;
        padding-left: 20px;
        padding-right: 20px;
        background: @white;
        border-top-left-radius: 5px;
        .checkoutBtn {
            padding: 3px 15px;
            border: 1px solid @base;
            border-radius: 3px;
            font-size: 13px;
            background: @white;
            color: @base;
            cursor: pointer;
            display: inline-block;
            outline: none;
        }
        .checkedSty {
            background: @base;
            color: @white;
            border: 1px solid @base;
        }
    }

    .myTaskAll > span {
        color: @black_2;
        font-size: 16px;
        margin-right: 0px;
    }

    .upload_preview_box {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 10px;
        right: 20px;
        cursor: pointer;
        text-align: center;
        line-height: 40px;
        color: #ffffff;
        & p {
            font-size: 40px;
        }
    }

    .task_describe {
        @widthed: 60px;
        width: calc(~"100% - @{widthed}");
        height: 100%;
    }

    .task_describe_title {
        width: 100%;
        height: 100%;
        /*padding-right: 10px;*/
        position: relative;
    }

    /* .task_describe_title>div{
      float: left;
    } */
    .state-introd {
        width: 100px;
        height: 30px;
        line-height: 30px;
        color: #ffffff;
        //  background: @orange;
        text-align: center;
        position: absolute;
        top: 3px;
        left: -33px;
        transform: rotate(-45deg);
    }

    .task_describe-sign {
        color: @blue;
        cursor: pointer;
    }

    .task-wait {
        background: -webkit-linear-gradient(left, rgb(254, 228, 155), rgb(253, 215, 114)); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, rgb(254, 228, 155), rgb(253, 215, 114)); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, rgb(254, 228, 155), rgb(253, 215, 114)); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, rgb(254, 228, 155), rgb(253, 215, 114)); /* 标准的语法 */
        .task_describe_msg {
            color: rgb(168, 116, 1)
        }
        .task_describe_father {
            .task_describe-sign {
                color: #fff
            }
        }
    }

    .task-doing {
        background: -webkit-linear-gradient(left, rgb(185, 224, 254), rgb(158, 211, 253)); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, rgb(185, 224, 254), rgb(158, 211, 253)); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, rgb(185, 224, 254), rgb(158, 211, 253)); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, rgb(185, 224, 254), rgb(158, 211, 253)); /* 标准的语法 */
        .task_describe_father {
            .task_describe_msg {
                color: rgb(54, 127, 193)
            }
        }
    }

    .task-pause {
        background: -webkit-linear-gradient(left, rgb(252, 197, 180), rgb(254, 171, 146)); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, rgb(252, 197, 180), rgb(254, 171, 146)); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, rgb(252, 197, 180), rgb(254, 171, 146)); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, rgb(252, 197, 180), rgb(254, 171, 146)); /* 标准的语法 */
    }

    .task-complete {
        background: -webkit-linear-gradient(left, rgb(147, 235, 224), rgb(107, 226, 211)); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, rgb(147, 235, 224), rgb(107, 226, 211)); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, rgb(147, 235, 224), rgb(107, 226, 211)); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, rgb(147, 235, 224), rgb(107, 226, 211)); /* 标准的语法 */
        .task_describe_father {
            .task_describe_msg {
                color: rgb(21, 96, 84)
            }
        }
    }

    .task_describe_father {
        /* padding-right: 60px; */
        @widthLeft: 50px;
        margin-left: 45px;
        width: calc(~"100% - @{widthLeft}");
        height: 100%;
        line-height: 60px;
    }

    .task_describe_msg {

        cursor: pointer;
    }

    .IsTestTaskType {
        color: #fff;
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 12px;
        border: 1px solid #fff;
        margin-left: 5px;
    }

    .task_describe_sub {
        font-size: 16px;
        color: #ffffff;
    }

    .task_describe_time {
        color: #ffffff;
        font-size: 14px;
    }

    .task_describe_time > span:last-child {
        margin-left: 20px;
    }

    .task_icon {
        margin-right: 10px;
    }

    .task_icon > span {
        font-size: 30px;
        display: block;
        line-height: 1;
        float: left;
        color: rgb(25, 250, 40);
    }

    .examine_task {
        width: 100%;
        margin-top: 80px;
        height: 400px;
        position: relative;
    }

    .examin_msg_task {
        position: absolute;
        /* width: 200px; */
        height: 200px;
    }

    .examin_sanjiao {
        height: 0px;
        width: 0px;
        /* margin-left: 84px; */
        border-right: 15px solid transparent;
        border-bottom: 30px solid rgb(26, 153, 170);
        border-left: 15px solid transparent;
    }

    .eaxmin_msg {
        width: 100%;
        /* height: 150px; */
        padding: 10px;
        background: rgb(26, 153, 170);
    }

    .eaxmin_title_all {
        width: 100%;
        height: 100px;
    }

    .eaxmin_title_all > p:first-child {
        font-size: 20px;
        color: #ffffff;
    }

    .eaxmin_title_all > p:last-child {
        font-size: 14px;
        color: #ffffff;
    }

    .msg_stauts {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        color: rgb(72, 197, 183);
    }

    .no_msgs {
        position: absolute;
        width: 50px;
        height: 50px;
        left: 10px;
        top: 80px;
        cursor: pointer;
    }

    .no_msg_left {
        position: absolute;
        left: 0;
        top: 10px;
        height: 0px;
        width: 0px;
        /* margin-left: 84px; */
        border-top: 10px solid transparent;
        border-right: 20px solid rgb(72, 197, 183);
        border-bottom: 10px solid transparent;
    }

    .no_msg_lefts {
        position: absolute;
        left: 0;
        top: 10px;
        height: 0px;
        width: 0px;
        /* margin-left: 84px; */
        border-top: 10px solid transparent;
        border-right: 20px solid rgb(255, 92, 50);
        border-bottom: 10px solid transparent;
    }

    .no_msg_sj {
        position: absolute;
        right: 0;
        top: 10px;
        height: 0px;
        width: 0px;
        /* margin-left: 84px; */
        border-top: 10px solid transparent;
        border-left: 20px solid rgb(72, 197, 183);
        border-bottom: 10px solid transparent;
    }

    .no_msg_title {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        background: rgb(72, 197, 183);
        font-size: 16px;
        color: #ffffff;
    }

    .no_msg_titles {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 10px;
        text-align: center;
        line-height: 40px;
        background: rgb(255, 92, 50);
        font-size: 16px;
        color: #ffffff;
    }

    .msg_couple {
        width: 100%;
    }

    .msg_couple > span:nth-child(1) {
        float: left;
        display: block;
        width: 30px;
        height: 30px;
        background: #ffffff;
        border-radius: 50%;
    }

    .msg_couple > span:nth-child(2) {
        float: left;
        color: #ffffff;
        margin-top: 10px;
        font-size: 14px;
    }

    .msg_couple > span:nth-child(3) {
        float: right;
        font-size: 20px;
        color: rgb(72, 197, 183);
    }

    .msg_couple_p {
        width: 100%;
        height: 150px;
        border: 2px solid #ffffff;
        border-radius: 4px;
    }

    .sure_title {
        width: 100px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        margin-top: 20px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        float: right;
        background: rgba(24, 191, 164, 1);
        color: #ffffff;
    }

    .sure_title:hover {
        background: rgba(24, 191, 164, .8);
    }

    //.yulanBack {background:#c8f9f3 !important;color: #17ceb1;border: 1px solid #c8f9f3 !important; .precond {color: @green;} }

    .prompt_title {
        font-size: 14px;
        cursor: pointer;
    }

    .prompt_title_last {
        font-size: 13px;
        color: rgb(215, 215, 215);
    }

    .font_class {
        font-size: 40px !important;
        cursor: pointer;
        color: #3bceb6;
    }

    .imPlementerContainer {
        .uploadContainer {
            //position: absolute;
            //width: 100%;
            //top: 50%;
            //left: 50%;
            //height: 120px;
            //margin-top: -60px;
            //margin-left: -258px;
            //text-align: center;
        }

    }

    .yulan_span {
        width: 100%;
        background: #fff;
        padding: 10px 0;
        overflow: hidden;
        .yulanBacks {
            display: inline-block;
            padding: 4px;
            background: #fff;
            border: 1px dashed #bdbdbd;
            position: relative;
            cursor: pointer;
            border-radius: 4px;
            margin-bottom: 10px;
            margin-right: 10px;
            i {
                font-style: normal
            }
        }
        button {
            float: right
        }
        .settingBtnOk {
            border: 0;
            background: #fff;
            color: @green;
            outline: none;
            height: 30px;
            line-height: 30px
        }
        .againFileBtn, .settingMainFile {
            border: 1px solid @green;
            color: @green;
            background: #fff;
            border-radius: 3px;
            outline: none;
            margin-left: 10px;
            height: 30px;
            line-height: 30px;
            &:hover {
                cursor: pointer;
                background: @green;
                color: #fff
            }
        }
    }

    .again_upload {
        padding: 3px 10px;
        text-align: center;
        line-height: 20px;
        margin-top: 5px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 4px;
        float: right;
        color: #3bceb6;
        border: 1px solid #3bceb6;
    }

    .again_upload_title {
        float: left;
        margin: 5px 0 0 10px;
        line-height: 20px;
        font-size: 16px;
        color: #3bceb6;
    }

    .all_upload_page {
        width: 100%;
        height: 100%;
        .ivu-row {
            width: 100%;
            height: 100%;
            .demo-spin-col > div {
                width: 50px;
                margin: 180px auto 0;
                text-align: center;
            }
        }
    }

    .again_upload_father {
        width: 100%;
        height: 30px;
        padding-right: 10px;
    }

    .is_angin {
        width: 200px;
        height: 160px;
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top: -100px;
        margin-left: -100px;
        background: rgb(240, 240, 240);
        border-radius: 4px;
        z-index: 99999;
    }

    .is_angin > p {
        width: 100%;
        height: 120px;
        text-align: center;
        line-height: 160px;
    }

    .is_angin_box {
        width: 100%;
        height: 40px;
    }

    .is_angin_box > p {
        width: 60px;
        height: 30px;
        float: left;
        border-radius: 4px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        color: #ffffff;
        margin-top: 5px;
    }

    .is_angin_box > p:first-child {
        background: rgb(24, 191, 164);
        margin-left: 30px;
    }

    .is_angin_box > p:last-child {
        background: rgb(215, 215, 215);
        margin-left: 20px;
    }

    .xe_title {
        width: 100%;
        height: 100%;
        padding: 5px 10px;
    }

    .precond {
        padding: 3px;
        margin-right: 3px;
    }

    .yulanBacks:hover .yulan_bx {
        display: block;
    }

    .yulan_bx {
        width: 100px;
        height: 40px;
        z-index: 9999;
        position: absolute;
        left: 0;
        top: 29px;
        display: none;
        margin-bottom: 20px;
    }

    .yulan_sanjiao {
        height: 0px;
        width: 0px;
        margin-left: 20px;
        border-right: 5px solid transparent;
        border-bottom: 10px solid @orange;
        border-left: 5px solid transparent;
    }

    .yulan_zhujian {
        width: 100%;
        height: 30px;
        border-radius: 4px;
        background: @orange;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        color: #ffffff;
    }

    .demo-spin-container {
        width: 100%;
        height: 100%;
    }

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    /* @keyframes ani-demo-spin {
      from { transform: rotate(0deg)}
      50%  { transform: rotate(180deg)}
      to   { transform: rotate(360deg)}
    } */
    .demo-spin-col {
        height: 100%;
        position: relative;
    }

    .demo-spin-col > div {
        width: 50px;
        margin: 100px auto 0;
    }

    #lattice {
        width: 100%;
        position: absolute;
        top: 50px;
        left: 0;
    }

    .latt-father {
        width: 100%;
        height: 80px;
        border-bottom: 1px solid @baseboard;
    }

    .latt-child {
        float: left;
        height: 100%;
        border-right: 1px solid @baseboard;
        background: #fff;
    }

    .latt-child:first-child {
        border-left: 1px solid @baseboard;
    }

    .latt-border {
        border-right: 1px solid rgba(255, 255, 255, 0);
    }

    .task_feedback {
        width: 100%;
        height: 160px;
        padding: 20px 30px;
        overflow: hidden;
        position: relative;
        background: @white;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        user-select: none;
        .task_feedback_box {
            // width: 100%;
            position: absolute;
            top: 0;
            height: 100%;
            .task_feedback_msg {
                display: flex;
                width: 500px;
                height: 140px;
                padding: 20px;
                border-radius: 4px;
                background: #fdfdfd;
                margin-right: 20px;
                border: 1px solid @baseboard;
                float: left;
                &:last-child {
                    margin-right: 0;
                }
                .feedback_iamge_father {
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    img {
                        max-width: 100px;
                        max-height: 100px;
                    }
                }
                .task_feedback_details {
                    width: 350px;
                    height: 100px;
                    margin-left: 10px;
                    float: left;
                    .feedback_words_box {
                        width: 100%;
                        height: 45px;
                        .feedback_words {
                            width: 240px;
                            height: 45px;
                            float: left;
                            .feedback_words_task {
                                //font-weight: bold;
                                cursor: pointer;
                                .IsTestTaskType {
                                    font-weight: lighter;
                                }
                            }
                            .feedback_words_project {

                                color: #bdbdbd;
                            }
                        }
                        .feedback_explain {
                            padding: 5px 10px;
                            margin-left: 10px;
                            border: 1px solid @baseboard;
                            color: #3bceb6;
                            float: left;
                        }
                    }
                    .feedback_task_progress {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        height: 5px;
                        border-radius: 4px;
                        background: #bdbdbd;
                        .progress_feedback_style {
                            width: 33.3333%;
                            height: 100%;
                            float: left;
                            border-radius: 4px;
                            background: @baseboard;
                            &:before {
                                display: block;
                                content: '';
                                width: 0;
                                height: 0;
                                border-left: 5px solid transparent;
                                border-right: 5px solid transparent;
                                border-top: 5px solid @baseboard;
                                // position: absolute;
                                // top: 40px;
                                // left: 50%;
                                margin: 5px 0 0 55px;
                            }
                        }
                        .progress_last_style {
                            &:before {
                                border: none !important;
                            }
                        }
                        .isStage {
                            background: #78E5D8;
                            &::before {
                                border-top: 5px solid #78E5D8;
                            }
                        }
                    }
                    .feedback_stage {
                        width: 100%;
                        margin-top: 5px;
                        & div {
                            width: 33.3333333%;
                            height: 38px;
                            float: left;
                            text-align: center;
                            color: #bdbdbd;
                        }
                        /*& p {*/
                        /*color: #bdbdbd;*/
                        /*}*/
                    }
                    .feedback_stage_state {
                        width: 100%;
                        height: 20px;
                        display: flex;
                        justify-content: space-between;
                        & p {
                            width: 33.333%;
                            height: 100%;
                            text-align: center;
                            font-size: 14px;
                            color: #bdbdbd;
                            float: left;
                        }
                    }
                }
            }
        }
    }

</style>
