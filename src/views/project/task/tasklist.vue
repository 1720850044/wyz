<!-- 任务列表组件 -->
<template>
    <div class="taskListContainer">
        <div class="tasklistMaxDiv">
            <div class="taskoverflow" :style="{width: checkoutFlag ? '24%' : '37%'}">
                <div class="title title-yellow">
                    <div class="taskType">
                        <!--<Icon type="android-radio-button-off" class=""></Icon>-->
                        <span>待开始（<span class="white">{{dataList_type.start.length}}</span>）</span>
                        <span class='excel-task' @click="addExcelTask">Excel导入</span>
                    </div>

                    <!--<Button v-if="clubTaskManagement" class='excel-task' type='text' @click="addExcelTask">Excel导入</Button>-->
                </div>
                <section class="WaitingToStart sectionSty">
                    <div style="text-align: center; padding: 10px;">
                        <button v-if="clubTaskManagement" class='new-task' @click="addNewTask">新建任务</button>
                    </div>

                    <!--<Button v-if="clubTaskManagement" class='new-task' icon='md-add' @click="addNewTask">新建任务</Button>-->
                    <template v-if="dataList_type.start.length>0">
                        <div class="list" v-for="(items,index) in dataList_type.start" :key="index"
                             :id="items.propsData.screenshotID" @click="goTaskDetail($event, items)">
                            <div class="headText">
                                <p class="projectName">{{items.name}}</p>
                                <div class="headImgDiv" :title="items.realname">
                                    <img v-show="items.run_uid" class="headImg" :src="items.headimage" alt="">
                                    <p v-show="items.run_uid">{{items.realname}}</p>
                                    <em class="icon iconfonts icon-backs" title="发送到聊天组"
                                        @click="changeFlagFun($event, items.propsData)"></em>
                                </div>
                            </div>
                            <span class="taskStageName">{{items.tasktype_name}}</span>
                            <div class="BottomInfo">
                                <span>{{items.expect_work_day}}工作日(<span class="startTime">{{timeType(items.expect_start_date)}}</span>~{{timeType(items.expect_end_date)}})</span>
                            </div>
                            <previewlist
                                :propsData="{ShowFlag:items.propsData.ShowFlag,screenshotID:items.propsData.screenshotID,project:items.project,id:items.id}"
                                @closeSlide="changeFlagFun(null, items.propsData)"></previewlist>
                        </div>
                    </template>
                </section>
            </div>

            <div class="taskoverflow">
                <div class="title title-blue">
                    <div class="taskType">
                        <!--<Icon type="android-radio-button-off" class=""></Icon>-->
                        <span>进行中（<span class="white">{{dataList_type.underWay.length}}</span>）</span>
                        <span class="orderBy" @click="orderByFlag = !orderByFlag">排序<em
                            class="iconfonts icon-bottommore"></em></span>

                        <div class="positonBox" :style="{'opacity':orderByFlag ? 1 : 0,'height':orderByFlag ? '112px' : '0px'}">
                            <!--<i class="sanjiao"></i>-->
                            <ul class="orderUl">
                                <li v-for="(item,index) in orderByList" :key="index" :class="{'creentOrderSty':orderIndex == index}" @click="orderBysort(item.key,index)">
                                    {{item.lable}}
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
                <section class="perform sectionSty">
                    <template v-if="dataList_type.underWay.length>0">
                        <div class="list" v-for="(items,index) in dataList_type.underWay" :key="index"
                             :id="items.propsData.screenshotID" @click="goTaskDetail($event, items)">
                            <!-- 暂停 -->
                            <template v-if="items.status == 3">
                                <p class="pause">暂停</p>
                                <p class="sign"></p>
                            </template>
                            <!-- 标题和头像 -->
                            <div class="headText">
                                <p class="projectName">{{items.name}}</p>
                                <div class="headImgDiv" :title="items.realname">
                                    <img v-show="items.run_uid" class="headImg" :src="items.headimage" alt="">
                                    <p v-show="items.run_uid">{{items.realname}}</p>
                                    <em class="icon iconfonts icon-backs" title="发送到聊天组"
                                        @click="changeFlagFun($event, items.propsData)"></em>
                                </div>
                            </div>
                            <span class="taskStageName">{{items.tasktype_name}}</span>
                            <!-- 阶段 -->
                            <template v-if="items.tasktype_stage">
                                <ul v-if="items.tasktype_stage.length!==0" class="stageList"
                                    :id="index === 0?'taskStepList':''">
                                    <li v-if="item.text" class="stage" v-for="(item,idx) in  items.tasktype_stage "
                                        :key="idx">
                                        <span
                                            :class="[{'isFile':item.color},{'isEnd':item.isEnd}]"> {{item.text}}</span>
                                        <Icon v-if="idx!==items.tasktype_stage.length-1"
                                              :class="{'nowStage':item.isEnd}" size="14" style="margin: 0 10px"
                                              type="arrow-right-a"></Icon>
                                    </li>
                                </ul>
                                <div class="progress" :id="index === 0?'taskProgress':''">
                                    <Progress
                                        :percent="items.tasktype_stage.length?parseInt(Number(items.progress)/items.tasktype_stage.length*100):0"></Progress>
                                    <span>{{items.expect_work_day}}工作日(<span class="startTime">{{timeType(items.expect_start_date)}}</span>~{{timeType(items.expect_end_date)}})</span>
                                </div>
                            </template>
                            <previewlist
                                :propsData="{ShowFlag:items.propsData.ShowFlag,screenshotID:items.propsData.screenshotID,project:items.project,id:items.id}"
                                @closeSlide="changeFlagFun(null, items.propsData)"></previewlist>
                        </div>
                    </template>
                </section>
            </div>

            <div class="taskoverflow" :style="{width: checkoutFlag ? '24%' : '10%'}">
                <div class="title title-green">
                    <div class="taskType">
                        <!--<Icon type="android-radio-button-off" class=""></Icon>-->
                        <span>已完成（<span class="white">{{dataList_type.end.length}}</span>）</span>
                    </div>
                </div>
                <section class="complete sectionSty">
                    <template v-if="dataList_type.end.length > 0">
                        <div class="list" v-for="(items,index) in dataList_type.end" :key="index"
                             :id="items.propsData.screenshotID" @click="goTaskDetail($event, items)">
                            <div class="headText">
                                <p class="projectName">{{items.name}}</p>
                                <div class="headImgDiv" :title="items.realname" v-if="checkoutFlag">
                                    <img v-show="items.run_uid" class="headImg" :src="items.headimage" alt="">
                                    <p v-show="items.run_uid">{{items.realname}}</p>
                                    <em class="icon iconfonts icon-backs" title="发送到聊天组"
                                        @click="changeFlagFun($event, items.propsData)"></em>
                                </div>
                            </div>
                            <span class="taskStageName">{{items.tasktype_name}}</span>
                            <div class="BottomInfo" v-if="checkoutFlag">
                                <span>{{items.expect_work_day}}工作日(<span class="startTime">{{timeType(items.expect_start_date)}}</span>~{{timeType(items.expect_end_date)}})</span>
                            </div>
                            <previewlist
                                :propsData="{ShowFlag:items.propsData.ShowFlag,screenshotID:items.propsData.screenshotID,project:items.project,id:items.id}"
                                @closeSlide="changeFlagFun(null, items.propsData)"></previewlist>

                        </div>
                    </template>
                    <template>
                        <p class="shrinkButton" @click="checkoutFlag = !checkoutFlag">
                            <Icon v-if="!checkoutFlag" type="chevron-right"></Icon>
                            <Icon v-else type="chevron-left"></Icon>
                        </p>
                    </template>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import {pjTaskTaskList, pjTaskDelete} from '@/axios/modules/project/projectTask';
    import api from 'api';
    import {mapMutations, mapState} from 'vuex';
    import Cookies from 'js-cookie';

    export default {
        props: {
            subtask: {
                type: String,
                default: ''
            }
        },
        components: {},
        data() {
            return {
                needGuideData: '',
                companyType: JSON.parse(Cookies.get('company')).type,
                projectId: sessionStorage.getItem('projectID'),
                dataList_type: {
                    start: [],
                    underWay: [],
                    end: []
                },
                currentMsg: {},
                loading: true,
                dellisthighlight: false,

                /*-----*/
                dataList: [],
                dataList_del: [],
                columnsTask: [{
                    title: '任务名',
                    key: 'name',
                    align: 'left',
                    ellipsis: true,
                    width: 340
                }, {
                    title: '状态',
                    key: 'status_text',
                    align: 'right',
                    ellipsis: true,
                    width: 120
                }, {
                    title: '类型',
                    key: 'tasktype_name',
                    align: 'right',
                    ellipsis: true,
                    width: 100
                }, {
                    title: '负责人',
                    key: 'remark_name',
                    align: 'right',
                    ellipsis: true,
                    width: 154
                }, {
                    title: '实施阶段',
                    key: 'stage',
                    align: 'left',
                    ellipsis: true,
                    width: 280,
                    render: function (h, params) {
                        let steplist = [];
                        let present = parseInt(params.row.progress) + 1;
                        for (let i = 0; i < params.row.stage.length; i++) {
                            let str = '';
                            if (present - 1 == i) {str = params.row.stage[i].stage_name;}
                            steplist.push(
                                h('Step', {
                                    props: {
                                        title: str
                                    }
                                })
                            );
                        }
                        return h(
                            'Steps', {
                                props: {
                                    current: present - 1,
                                    size: 'small'
                                }
                            },
                            steplist
                        );
                    }
                }, {
                    title: '任务文件',
                    align: 'center',
                    ellipsis: true,
                    key: 'file_id',
                    width: 140
                }, {
                    title: '文件最近更新',
                    align: 'right',
                    key: 'update_date',
                    ellipsis: false,
                    width: 120
                }, {
                    title: '到期时间',
                    align: 'right',
                    key: 'expect_end_date',
                    ellipsis: false,
                    width: 120
                }, {
                    title: '操作',
                    align: 'right',
                    width: 84,
                    render: (h, params) => h('div', [
                        h(
                                'Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        confirm: true,
                                        title: '确认删除该任务?',
                                        transfer: true
                                    },
                                    style: 'dellisttask',
                                    on: {
                                        click: $event => {
                                            this.removetasklistData(params.index, $event);
                                        }
                                    }
                                },
                                '删除'
                            )
                    ])
                }],
                columnsTask_del: [{
                    title: '删除',
                    key: 'name',
                    align: 'center',
                    width: 80,
                    render: (h, params) => h('div', [
                        h(
                                'Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        confirm: true,
                                        title: '确认删除该任务?',
                                        transfer: true
                                    },
                                    style: 'dellisttask',
                                    on: {
                                        click: $event => {
                                            //render不支持.
                                            this.removetasklistData(params.index, $event);
                                        }
                                    }
                                },
                                '删除'
                            )
                    ])
                }],
                jumpToSecondPage: {},

                //0.9.1 优化
                checkoutFlag: false,
                orderByFlag: false,
                orderByList: [
                    {
                        lable: '更新时间',
                        key: 'update_time'
                    },
                    {
                        lable: '结束时间',
                        key: 'expect_end_time'
                    },
                    {
                        lable: '开始时间',
                        key: 'expect_start_time'
                    },
                    {
                        lable: '类型',
                        key: 'tasktype_id'
                    },
                    {
                        lable: '制作人员',
                        // run_uid  realname
                        key: 'run_uid'
                    }
                ],
                orderIndex: 0
            };
        },
        mounted() {
            // this.initGuide();
            this.$bus.on('searchTaskList', ({type, taskData}) => {
                this.searchTaskList(type, taskData);
            });
            // 项目角色进度
        },
        beforeDestroy(){
            console.log(999);
            this.$bus.$off('getTaskCount');
        },
        methods: {
            ...mapMutations(['setPrimaryMission']),
            bubble() {
                let text = this.$lau.bubble.taskPlan;
                this.$nextTick(() => {
                    let defaultOptions = [
                        {
                            id: 'taskTabs',
                            position: 'bottom',
                            title: text[0].title,
                            content: text[0].content,
                            relative: 'body',
                            subClassName: 'ivu-tabs-bar',
                        },
                        // 隐藏气泡引导  ====> 项目 》任务 暂时隐藏以下三块功能说明
                        // {
                        //     id: 'taskStepList',
                        //     position: 'left',
                        //     title: text[1].title,
                        //     content: text[1].content,
                        //     relative:'body',
                        // },
                        // {
                        //     id: 'taskProgress',
                        //     position: 'bottom',
                        //     title:text[2].title,
                        //     content: text[2].content,
                        //     relative:'body',
                        // },
                        // {
                        //     id: 'taskManage',
                        //     position: 'bottom',
                        //     title: text[3].title,
                        //     content: text[3].content,
                        //     relative:'body',
                        // },

                    ];
                    let fn = (({id}) => {
                        if (id === 'taskTabs') {
                            this.needGuideData = '';
                            this.getTaskList('all');
                        }
                    });
                    setTimeout(() => {
                        this.$bubble(defaultOptions, fn);
                    }, );
                });
            },
            changeFlagFun(event, items) {
                if (event) {
                    event.stopPropagation();
                }
                items.ShowFlag = !items.ShowFlag;
                this.$forceUpdate();
            },
            async delButton(items) {
                await pjTaskDelete({
                    id: items.id
                });
                this.$bus.emit('refreshCurrentTaskList');
                this.refreshTaskList();
                this.$Message.success('删除任务成功');
            },
            addNewTask() {
                this.$emit('addNewTask');
            },
            addExcelTask() {
                this.$emit('addExcelTask');
            },
            // 打开任务详情
            goTaskDetail(event, currentRow) {
                this.jumpToSecondPage = {
                    event: event,
                    currentRow: currentRow
                };
                event.stopPropagation();
                this.$router.push({
                    path: "/project/details",
                    query: {project: currentRow.project, id: currentRow.id, navTitle: '看板'}
                });
            },
            exportData(type) {
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '原始数据的处理'
                    });
                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: '排序和过滤数据',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.table.exportCsv({
                        filename: '自定义数据',
                        columns: this.columnsTask.filter((col, sub) => sub < 4),
                        data: this.dataList.filter((data, sub) => sub < 4)
                    });
                }
            },
            //删除数据
            async removetasklistData(index, $event) {
                $event.cancelBubble = true;
                await pjTaskDelete({
                    id: this.dataList[index].id
                });
                this.$Message.error('删除任务成功');
                this.$bus.emit('refreshCurrentTaskList');
                this.refreshTaskList();
            },
            //遍历主任务列表数据
            initTaskListFromId(data, type, item) {
                if (data == null) {data = {};}
                if (data === 'all') {
                    this.getTaskList(data);
                } else if (type === 'member') {
                    this.getTaskList(data.run_uid, 'member', item);
                } else {
                    let msg = {};
                    if (!data.project_child_id) {
                        //主项目
                        msg.project_id = data.project_id ? data.project_id : sessionStorage.projectID;
                    } else {
                        msg.project_child_id = data.project_child_id;
                    }
                    this.currentMsg = msg;
                    this.getTaskList(msg);
                }
                // Guide step
            },
            // 初始化获取是否引导
            async initGuide(data) {
                let _this = this;
                let result = data;
                if (result.data.guide === 'taskPlan') {
                    this.needGuideData = true;
                }
                await this.initTaskListFromId();
                if (result.data.guide) {
                    if (result.data.guide == 'partyAProjectManagement') {
                        setTimeout(() => {
                            _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                .addSteps([
                                    {
                                        element: document.querySelector('.taskListContainer'),
                                        intro: this.$lau.guide_words.k21,
                                        position: 'left',
                                        disableInteraction: '1',
                                        start: '2',
                                        total: '3'
                                    }
                                ]).start()
                                .onskip(() => {
                                    sessionStorage.needGuideData = false;
                                    this.initGuide();
                                })
                                .oncomplete(() => {
                                    this.$PublicFuns.completePageGuide(result.data.guide).then(result => {
                                        // this.$router.push(this.$router.push('/project/quality'));
                                        this.$router.push({path: '/project/quality'});
                                    });
                                });
                        });

                    } else if (result.data.guide == 'partyBProjectManagement') {
                        setTimeout(() => {
                            _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                .addSteps([
                                    {
                                        element: document.querySelector('.new-task'),
                                        intro: this.$lau.guide_words.k22,
                                        position: 'right',
                                        disableInteraction: '1',
                                        start: '3',
                                        total: '5'
                                    }
                                ]).start()
                                .onskip(() => {
                                    sessionStorage.needGuideData = false;
                                    this.initGuide();
                                })
                                .oncomplete(() => {
                                    setTimeout(() => {
                                        _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                            .addSteps([
                                                {
                                                    element: document.querySelector('.taskListContainer'),
                                                    intro: this.$lau.guide_words.k23,
                                                    position: 'left',
                                                    disableInteraction: '1',
                                                    start: '4',
                                                    total: '5'
                                                }
                                            ]).start()
                                            .onskip(() => {
                                                sessionStorage.needGuideData = false;
                                                this.initGuide();
                                            })
                                            .oncomplete(() => {
                                                // 此处为需要跳转到子页面的方法
                                                this.$PublicFuns.completePageGuide(result.data.guide).then(result => {
                                                    // this.$router.push();
                                                    this.$router.push({path: '/project/quality'});
                                                });
                                            });
                                    }, 200);
                                });
                        });

                    } else if (result.data.guide === 'taskPlan') {
                        this.bubble();
                    }
                }
            },
            //刷新当前列表
            refreshTaskList() {
                this.loading = true;
                this.getTaskList(this.currentMsg);
            },
            async searchTaskList(type, taskData) {
                let objForm = {
                    project_id: this.projectId

                };
                if (type === 'task') {
                    objForm.tasktype_id = taskData.id;
                } else if (type === 'project') {
                    objForm.project_child_id = taskData.project_child_id;
                } else if (type === 'user') {
                    objForm.user_id = taskData.user_id;
                }
                let {data} = await pjTaskTaskList(objForm);
                if (data.err_code === 0) {
                    this.dataList = data.data;
                    this.initTaskType();
                    this.formatTaskList(this.dataList); //颠倒顺序
                    this.typeSelection();
                    this.loading = false;
                    this.dataList_del = [];
                    this.dataList.forEach(element => {
                        this.dataList_del.push({
                            name: '删除',
                            id: element.id
                        });
                    });

                }
            },
            async getTaskList(msg, type, item) {
                if (msg === 'all') {
                    msg = {
                        project_id: this.projectId
                    };
                } else if (type === 'member') {
                    let child_id = item.child_id ? item.child_id : '';
                    msg = {
                        user_id: msg,
                        project_id: this.projectId,
                        project_child_id: child_id
                    };
                } else if (this.primaryMission && this.subtask) {
                    // 子任务 只需要father 其余都不要
                    msg = {
                        father: this.primaryMission.id
                    };
                }
                if (this.needGuideData) {
                    msg.needGuideData = true;
                }
                // 进入任务详情，只展示子任务
                let data = await pjTaskTaskList(msg);
                let res = data.data;
                this.dataList = res.data;

                this.initTaskType();
                this.formatTaskList(this.dataList); //颠倒顺序
                this.typeSelection();
                this.loading = false;
                this.dataList_del = [];
                this.dataList.forEach(element => {
                    this.dataList_del.push({
                        name: '删除',
                        id: element.id
                    });
                });
                this.memberListCount();
            },

            /* 成员列表计数 */
            memberListCount() {
                this.$bus.emit('getTaskCount', this.dataList);
            },
            // 阶段初始化
            initTaskType() {
                if (this.dataList) {
                    this.dataList.map((items, index) => {
                        if (items.tasktype_stage) {
                            items.tasktype_stage = items.tasktype_stage.map((item, index) => {
                                let nowValue = item;
                                item = {
                                    text: nowValue,
                                    color: false
                                };
                                if (items.progress == index + 1) {
                                    item.isEnd = true;
                                }
                                for (let k in items.stage) {
                                    if (k == index + 1) {
                                        item.color = true;
                                    }
                                }
                                return item;
                            });
                        }
                    });
                }
            },
            // 排序
            formatTaskList(taskData) {
                if (Array.isArray(taskData)) {
                    taskData.map((item, index, arr) => {
                        arr[index].createStamp = new Date(item.create_time).getTime();
                    });
                }
                this.sortDataList(this.dataList);
            },
            TimeFormatDay(str) {
                return str ? str.substr(0, str.search(/ /)) : '';
            },
            TimeFormatMinute(str) {
                return str ? str.substr(0, str.lastIndexOf(':')) : '';
            },
            //任务状态
            setTaskStatus(taskDatastatus) {
                switch (taskDatastatus.status) {
                    case '1':
                        taskDatastatus.cellClassName = {
                            status_text: 'demo-table-info-cell-start'
                        };
                        break;
                    case '2':
                        taskDatastatus.cellClassName = {
                            status_text: 'demo-table-info-cell-execution'
                        };
                        break;
                    case '3':
                        taskDatastatus.cellClassName = {
                            status_text: 'demo-table-info-cell-pause'
                        };
                        break;
                    case '4':
                        taskDatastatus.cellClassName = {
                            status_text: 'demo-table-info-cell-complete'
                        };
                        break;
                }
            },
            switchImgToBase64(url, callback) {
                let canvas = document.createElement("canvas");   //创建canvas DOM元素
                let ctx = canvas.getContext("2d");
                let img = new Image();
                img.crossOrigin = '*';
                img.src = url;
                let ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
                img.onload = function () {
                    canvas.height = img.height; //指定画板的高度,自定义
                    canvas.width = img.width; //指定画板的宽度，自定义
                    ctx.drawImage(img, 0, 0, img.width, img.height); //参数可自定义
                    let dataURL = canvas.toDataURL("image/" + ext);
                    callback.call(this, dataURL); //回掉函数获取Base64编码
                    canvas = null;
                };
            },
            typeSelection() {
                this.dataList_type = {
                    start: [],
                    underWay: [],
                    end: []
                };
                if (Array.isArray(this.dataList)) {
                    this.dataList.map((items, index) => {
                        switch (items.status) {
                            case '1':
                                items.propsData = {
                                    screenshotID: 'start' + index,
                                    ShowFlag: false
                                };
                                this.dataList_type.start.push(items);
                                break;
                            case '2':
                                items.propsData = {
                                    screenshotID: 'underWay' + index,
                                    ShowFlag: false
                                };
                                this.dataList_type.underWay.push(items);
                                break;
                            case '3':
                                items.propsData = {
                                    screenshotID: 'underWay' + index,
                                    ShowFlag: false
                                };
                                this.dataList_type.underWay.push(items);
                                break;
                            case '4':
                                items.propsData = {
                                    screenshotID: 'end' + index,
                                    ShowFlag: false
                                };
                                this.dataList_type.end.push(items);
                                break;
                        }
                    });

                    if (this.dataList_type.underWay.length > 0) {
                        //默认按照更新时间排序
                        let underWayList = this.dataList_type.underWay;
                        this.dataList_type.underWay = this.sortByData(underWayList, 'update_time');
                    }
                }
            },
            timeType(time) {
                return (
                    time.split(' ')[0].split('-')[1] +
                    '-' +
                    time.split(' ')[0].split('-')[2]
                );
            },
            sortDataList(time) {
                time = time.sort((a, b) => b.createStamp - a.createStamp);
            },

            //0.9.1优化
            orderBysort(key, index) {
                this.orderIndex = index;
                let underWayList = this.dataList_type.underWay;
                this.sortByData(underWayList, key);
                this.orderByFlag = false;
            },
            sortByData(list, type) {
                let temp = null;
                // if (type === 'realname') {
                //     list.sort((a, b) => {
                //         if(a.realname && b.realname){
                //             return a[type].localeCompare(b[type])
                //         }
                //
                //     })
                // } else {
                temp = list.sort((a, b) => b[type] - a[type]);
                // }
                return temp;
            }
        },
        computed: {
            ...mapState({
                primaryMission(data) {
                    return data.project.primaryMission;
                },
                clubTaskManagement(data) {

                    return data.app.clubTaskManagement;
                }
            })
        }
    };
</script>
<style lang="less">
    .taskListContainer {
        .green {
            color: #6ce2d3;
        }
        .orange {
            color: #fdd772;
        }
        .blue {
            color: #9ed3fd;
        }
        .tasklistMaxDiv {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 830px;
            padding: 0 2px 2px 2px;
            overflow: hidden;
            .startTime {
                color: @base;
            }
            .taskoverflow:nth-of-type(1) {
                width: 36%;
                /*width: 24%;*/
                min-width: 200px;
            }
            .taskoverflow:nth-of-type(2) {
                width: 52%;
                min-width: 270px;
                margin: 0 20px;
            }
            .taskoverflow:nth-of-type(3) {
                width: 0%;
                min-width: 100px;
                /*width: 24%;*/
                /*min-width: 200px;*/
            }
            .taskoverflow {
                .base-card;
                padding: 0;
                background: #fff;
                transition: all .5s;
                .title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 45px;
                    /*line-height: 45px;*/
                    font-size: 15px;
                    /*padding: 0px 0px 0px 12px;*/
                    /*color: #fff;*/
                    border-bottom: 1px solid #efefef;
                    border-radius: 3px 3px 0 0;
                    -moz-border-radius: 3px 3px 0 0;
                    -webkit-border-radius: 3px 3px 0 0;
                    &.title-yellow {
                        border-top: 10px solid #fdd772;
                        /*background: #fdd772;*/
                    }
                    &.title-blue {
                        border-top: 10px solid #9ed3fd;
                        /*background: #9ed3fd;*/
                    }
                    &.title-green {
                        border-top: 10px solid #6ce2d3;
                        /*background: #6ce2d3;*/
                    }
                    > i {
                        font-weight: bold;
                        color: #fff;
                        font-size: 17px;
                        /*float: left;*/
                        /*margin: 15px 10px 0 0;*/
                    }
                    .taskType {
                        position: relative;
                        width: 100%;
                        padding: 0 12px;
                        display: flex;
                        justify-content: space-between;
                        .orderBy {
                            color: #bdbdbd;
                            font-size: 12px;
                            em {
                                margin-left: 3px;
                                font-size: 12px;
                            }
                            &:hover {
                                color: @base;
                                cursor: pointer;
                            }
                        }
                        .positonBox {
                            position: absolute;
                            top: 24px;
                            right: 10px;
                            z-index: 5;
                            height: 0px;
                            overflow: hidden;
                            transition: all .3s;
                            opacity: 0;
                        }
                        /*.sanjiao{*/
                        /*position: absolute;*/
                        /*right: 25px;*/
                        /*top: -5px;*/
                        /*border-bottom: 5px solid #b9b9b9;*/
                        /*border-left:5px solid #fff;*/
                        /*border-right: 5px solid #fff;*/
                        /*}*/
                        .orderUl {
                            font-size: 12px;
                            border: 1px solid #ececec;
                            padding: 5px 8px;
                            border-radius: 4px;
                            background: #fff;
                            color: #b9b9b9;
                            li {
                                padding: 1px 0;
                                &:hover {
                                    cursor: pointer;
                                    color: @base;
                                }
                                &.creentOrderSty{
                                    color: @base;
                                }
                            }
                        }
                    }
                }
                .taskStageName {
                    padding-bottom: 10px;
                    color: #bdbdbd;
                }
                .stageList {
                    display: flex;
                    color: @black_2;
                    flex-wrap: wrap;
                    .stage {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                        .isFile {
                            border: 1px solid #ccc;
                        }
                        .isEnd {
                            color: @base;
                            border: 1px solid @base !important;
                        }

                        span {
                            padding: 5px 10px;
                            border: 1px dashed #ccc;
                            border-radius: 4px;
                        }
                        .nowStage {
                            color: #3bceb6;
                        }
                    }
                }
                .progress {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .ivu-progress {
                        width: 78% !important;
                    }
                    .ivu-progress-bg {
                        background: @base;
                    }
                    span {
                        flex: 1;
                        white-space: nowrap;
                        text-align: right;
                    }
                }
                .sectionSty {
                    width: 100%;
                    height: 94%;
                    overflow-y: auto;
                    position: relative;
                }
                .new-task {
                    width: 100%;
                    padding: 10px 0;
                    background: #3bceb600;
                    border-style: dashed;
                    border-width: 2px;
                    border-radius: 3px;
                    color: @card-title;
                    outline: none;
                    &:hover {
                        border-color: @base !important;
                        color: @base;
                        cursor: pointer;
                    }
                }
                .excel-task {
                    color: @base;
                    font-size: 13px;
                    text-decoration: underline;
                    &:hover {
                        color: @base;
                        cursor: pointer;
                    }
                }
                .shrinkButton {
                    position: absolute;
                    top: 50%;
                    left: 0px;
                    width: 18px;
                    height: 34px;
                    text-align: center;
                    line-height: 34px;
                    transform: translateY(-50%);
                    color: @white;
                    background: @base;
                    border-radius: 0 7px 7px 0;
                    &:hover {
                        cursor: pointer;
                        background: @base_active;
                    }
                }
            }
        }
        .WaitingToStart,
        .perform,
        .complete,
        .suspended {
            .list {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: relative;
                margin: 12px;
                padding: 12px;
                font-size: 12px;
                color: #ccc;
                transition: all 0.3s;
                background: #fff;
                border: 1px solid #efefef;
                border-radius: 3px;
                cursor: pointer;
                &:hover .headText > .headImgDiv > em {
                    opacity: 1;
                }
                .headText {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .headImgDiv {
                        display: flex;
                        align-items: center;
                        img {
                            margin-right: 6px;
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            vertical-align: middle;
                        }
                        em {
                            font-size: 16px;
                            margin-left: 5px;
                            opacity: 0;
                            &:hover {
                                color: @base;
                            }
                        }
                        p {
                            //   width: 60px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    // margin: 4px;

                }
                .BottomInfo {
                    display: flex;
                    justify-content: space-between;
                    color: #bdbdbd;
                }
                .pause {
                    position: absolute;
                    top: 2px;
                    right: 5px;
                    z-index: 3;
                    color: #fff;
                }
                .sign {
                    position: absolute;
                    top: 18px;
                    right: 0;
                    width: 0;
                    height: 0;
                    margin-top: -20px;
                    border-top: none;
                    border-right: 50px solid #ff7970;
                    border-bottom: 50px solid transparent;
                    border-left: 50px solid transparent;
                    z-index: 2;
                }
                .close {
                    position: absolute;
                    top: 0;
                    right: 0;
                    margin: 2px 2px 0 0;
                    font-size: 18px;
                    opacity: 0;
                    cursor: pointer;
                }
                .projectName {
                    text-align: left;
                    padding: 0px 0px 0px 0px;
                    font-size: 15px;
                    color: @black_2;
                }
                &:hover {
                    // transform: scale(1.01);
                    box-shadow: 0px 1px 6px 0.5px #c5c3c38f;
                    .close {
                        opacity: 1;
                    }
                }
            }
            &::after {
                content: ' ';
                display: block;
                clear: left;
            }
        }
    }

    .main-header-con {
        z-index: 999 !important;
    }

    .showAdd {
        display: inline-block;
    }

    .hideAdd {
        display: none;
    }

    .showEdit {
        display: inline-block;
    }

    .hideEdit {
        display: none;
    }

    .dropChild .ivu-select-dropdown {
        width: 300px !important;
        top: 40px !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .meberli li {
        height: 35px;
        line-height: 35px;
    }

    .pushDa input {
        width: 100px !important;
        border-right: 0 !important;
        border-radius: 0 !important;
        position: relative;
    }

    .borderNome input {
        border-radius: 0 !important;
        right: 20px;
        position: relative;
    }

    .tasklistfather {
        display: inline-block;
        overflow: hidden;
    }

    .tasklist {
        width: 1400px;
        z-index: 1;
        float: left;
        padding: 0 0px 0 0;
    }

    .tasklistdel {
        width: 82px;
        z-index: 1;
        float: left;
        padding: 0 0 0 -2px;
    }

    .dellisttask {
        width: 80px;
        position: absolute;
        z-index: 2;
        margin-left: 12px;
        display: block;
    }
</style>

