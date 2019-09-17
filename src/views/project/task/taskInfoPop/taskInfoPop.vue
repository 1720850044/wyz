<!-- 任务信息弹窗-->
<template>
    <div class="taskinfopop">
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{$t('project.pro_tasiDetail')}}<div></div></span></div>
        </main-native>
        <div class="second-navigation-bar">
            <a @click="leaveInfo()">{{$route.query.navTitle || $t('project.pro_spectaculars')}}</a>
            <Icon class="icon" type="ios-arrow-right"></Icon>
            <a class="second-nav-title">{{$t('project.pro_tasiDetail')}}</a>
        </div>
        <div class="taskinfopopContainer">
            <!--<template>-->
            <div class="leftDiv">
                <div class="taskinfopopTitle" v-if="taskInfos">
                    <div>
                        <span class="detailTitle">{{taskInfos.name}}</span>
                        <!--{{taskInfos.project_status}}-->
                        <!--{{taskInfos.status}}-->
                        <!--{{initData.status}}-->

                        <span v-if="taskInfos.status == 1 && initData.status == 1" class="actionTask"
                              @click="actionTaskFlag = true">
                                <em class="iconfonts icon-bofang"></em>{{$t('project.pro_taskStart')}}
                            </span>
                        <span v-if="taskInfos.status != 1 && company.post_id != 3" class="taskStatusSty"
                              :class="{'zantinTask':taskInfos.status==3,'loadingTask':taskInfos.status == 2,'compaletTask':taskInfos.status == 4}">
                                  {{taskInfos.status_text}}
                            </span>
                    </div>

                    <div>
                        <em class="iconfonts icon-pause icon stopIco"
                            v-if="(taskInfos.project_status != 2 && taskInfos.project_status != 4) && taskInfos.status == 2 && company.post_id != 3"
                            :title="$t('project.pro_pauseTheTask')" @click="changeModelStatus(taskInfos.status)"></em>
                        <em class="iconfonts icon-bofang icon ContinueIco"
                            v-if="(taskInfos.project_status != 2 && taskInfos.project_status != 4) && taskInfos.status == 3 && company.post_id != 3"
                            :title="$t('project.pro_contiuneTask')" @click="changeModelStatus(taskInfos.status)"></em>
                        <em class="iconfonts icon-shanchu icon delIco" v-if="initData.delete == 1" :title="$t('project.pro_deleteTask')"
                            @click="deleteShow = true"></em>
                    </div>
                </div>

                <!--重构部分开始-->
                <div class="tabcheckout">
                    <ul>
                        <li @click="currentTab = 'maintask'" :class="{'activeSty':currentTab=='maintask'}">{{$t('project.pro_fundamentalManagement')}}</li>
                        <li @click="currentTab = 'standard'" :class="{'activeSty':currentTab=='standard'}">{{$t('lang.lang_standard')}}</li>
                        <li @click="currentTab = 'resource'" :class="{'activeSty':currentTab=='resource'}">{{$t('lang.lang_resource')}}</li>
                        <li @click="currentTab = 'subtasklist'" :class="{'activeSty':currentTab=='subtasklist'}">
                            {{userStatus === 'member'?$t('project.pro_revevance'):$t('project.pro_subtask')}}
                        </li>
                        <li @click="currentTab = 'tasklog'" :class="{'activeSty':currentTab=='tasklog'}">{{$t('project.pro_log')}}</li>
                    </ul>
                </div>

                <div class="componentContent">
                    <keep-alive>
                        <component v-if="indexShow && taskInfos" :is="currentTab" :initData="initData"
                                   :taskInfos="taskInfos" :fileInfos="fileInfos"
                                   type="taskDetail" @openUploadPop="openUplodPop" @resourceTabFun="resourceTabFun"
                                   @refreshCurrentTask="getTaskData"></component>

                    </keep-alive>
                </div>
                <!--重构部分结束-->
            </div>
            <section class="videoRight">
                <filebrowse v-if="showFileBrowser" ref="filebrowse" :stageInfos="stageInfos" :initData="initData"
                            :is_collaboration="is_collaboration" @referStageInfo="taskStageInfo"
                            class="filebrowseContainer"></filebrowse>
            </section>
            <!--</template>-->
        </div>
        <Modal v-model="deleteShow" :title="$t('project.pro_deleteTask')" @on-ok="ConfirmDelete">
            <p>{{$t('project.pro_confirmDeleteTask')}}</p>
            <p style="font-size: 13px;color: #f44336;margin-top: 10px">{{$t('project.pro_deleteTaskCannotUndone')}}</p>
        </Modal>
        <Modal :title="ModalData.title" v-model="actionTaskFlag" :mask-closable="false" @on-ok="comfirmAction">
            <p v-html="ModalData.content"></p>
        </Modal>

        <taskDetailsUploadFile v-if="UploadPop" :currentStage="currentStage" :taskID="taskId"
                               @closeUploadPop="UploadPop = false" @callbackFun="callbackFun"></taskDetailsUploadFile>
    </div>
</template>
<script>
    import {
        projectInfoIndex,
        projectInfoStart,
        projectInfoPause,
        projectInfoContinue,
        projectInfoAdd,
        projectInfoInfo,
        projectInfoStageInfo,
        projectInfoDelete,
        projectInfoDetail
    } from '@/axios/modules/project/projectTaskDetail';
    import taskDetailsUploadFile from '../../../../components/taskDetailsUploadFile';
    import {mapState, mapMutations} from 'vuex';
    import maintask from '../taskDetails';
    import subtasklist from '../subtask';
    import tasklog from '../taskLog';
    import filebrowse from '../../components/fileBrowseManager';
    import standard from './standard';
    import resource from './resource';
    import mainNative from '../../../main-components/mainNative.vue';
    import api from 'api';
    import {taskDetail} from 'api';
    import Cookies from 'js-cookie';

    export default {
        components: {
            taskDetailsUploadFile,
            maintask,
            subtasklist,
            tasklog,
            filebrowse,
            standard,
            resource,
            mainNative
        },
        computed: {
            ...mapState({
                userStatus (value) {
                    return value.project.userStatus;
                },
                projectDetail (value) {
                    if (value.project.detail.setDetailAll) {
                        return value.project.detail.setDetailAll.name
                            ? value.project.detail.setDetailAll
                            : value.project.detail.taskInfo;
                    }
                },
                projectInfos (value) {
                    if (value.project.detail.taskInfo) {
                        return value.project.detail.taskInfo.name ? value.project.detail.taskInfo : {};
                    }
                },
                projectId (value) {
                    return value.project.detail.setDetailAll.id;
                },
                company () {
                    return JSON.parse(Cookies.get('company'));
                },
                // companyType () {
                //     return JSON.parse(Cookies.get('company')).type;
                // },
                clubTaskManagement (value) {
                    return value.app.clubTaskManagement;
                },
            }),

        },
        watch: {
            projectInfos (value) {
                this.projectDetail.status = value.status;
                this.statusText = value.status_text;
            }
        },
        mounted () {
            this.initGuide();
        },
        data () {
            return {
                showFileBrowser: false,
                indexShow: false,
                collaboration: 0,
                actionTaskFlag: false,
                currentStage: null,
                UploadPop: false,
                deleteShow: false,
                saveButtonShow: false, // 保存按钮
                editDataName: null,
                subtaskInfo: null,
                editData: {},
                subData: [],
                handleUrl: [],
                fileUrl: [],
                setypeClass: [],
                pushSubData: {},
                project_child: '',
                formLeft: {},
                type: '',
                statusText: null,
                ModalData: {
                    title: i18n.t('project.pro_taskStart'),
                    content: `${i18n.t('lang.lang_confirm')} <span style="color: #3cd2b4">${i18n.t('project.pro_start')}</span>${i18n.t('project.pro_thisTask')}`
                },
                //    重构数据
                projectID: this.$route.query.project,
                taskId: this.$route.query.id,
                initData: {},
                taskInfos: {
                    run_uid: 'NULL',
                    tasktype_id: 'NULL',
                    project_child: 'NULL',
                    file: [],
                },
                currentTab: 'maintask',
                fileInfos: {},
                stageInfos: {},
                is_collaboration: 0,   //是否是协作任务
                //引导数据
                guideSteps: {
                    step1: '',
                    step2: '',
                    step3: '',
                    step4: '',
                    step5: '',
                },
                needGuideData: null
            };
        },
        methods: {
            // 初始化获取是否引导
            async initGuide () {
                let {data} = await projectInfoIndex();
                let _this = this;
                this.indexShow = true;
                if (data.guide) {
                    let guide = data.guide;
                    _this.needGuideData = true;
                    _this.getTaskData()
                        .then(() => {
                            setTimeout(() => {
                                _this.$guide()
                                    .exit();
                                if (guide == 'workBench') {
                                    _this.$guide()
                                        .setOptions(this.$CONSTANT.guideOptions)
                                        .addSteps([ {
                                            element: document.querySelector('.leftDiv'),
                                            intro: this.$lau.guide_words.k24,
                                            position: 'bottom',
                                            disableInteraction: '1',
                                            start: '2',
                                            total: '5'
                                        } ])
                                        .start()
                                        .onskip(function () {
                                            _this.$router.push({path: "/workbench/member"});
                                        })
                                        .oncomplete(function () {
                                            _this.$PublicFuns.completePageGuide('workBench2')
                                                .then(res => {
                                                    _this.$router.push({path: "/workbench/member"});
                                                    _this.$guide()
                                                        .exit();
                                                });
                                        });
                                } else if (guide == 'workBench3') {
                                    _this.$guide()
                                        .setOptions(this.$CONSTANT.guideOptions)
                                        .addSteps([ {
                                            element: document.querySelector('.videoRight'),
                                            intro: this.$lau.guide_words.k25,
                                            position: 'bottom',
                                            disableInteraction: '1',
                                            start: '5',
                                            total: '5'
                                        } ])
                                        .start()
                                        .onskip(function () {
                                            _this.$router.push({path: "/workbench/member"});
                                        })
                                        .oncomplete(function () {
                                            _this.$router.push({path: "/workbench/member"});
                                            _this.$guide()
                                                .exit();
                                        });
                                } else if (guide == 'auditTask') {
                                    _this.$guide()
                                        .setOptions(this.$CONSTANT.guideOptions)
                                        .addSteps([
                                            {
                                                element: document.querySelector('.newImgEditor'),
                                                intro: this.$lau.guide_words.k26,
                                                position: 'left',
                                                disableInteraction: '1',
                                                start: '2',
                                                total: '3',
                                                dedicated: '1'
                                            },
                                            {
                                                element: document.querySelector('.feedbackInfoContainer'),
                                                intro: this.$lau.guide_words.k27,
                                                position: 'top-right-aligned',
                                                disableInteraction: '1',
                                                start: '3',
                                                total: '3',
                                                dedicated: '1'
                                            }
                                        ])
                                        .start()
                                        .onskip(function () {
                                            // _this.$router.push({ path: "/workbench/leader" });
                                        })
                                        .oncomplete(function () {
                                            _this.$router.push({path: "/workbench/leader"});
                                            _this.$guide()
                                                .exit();
                                        });
                                }
                            }, 300);
                        });
                } else {
                    _this.init();
                }
            },

            /**
             * 重构开始
             */
            //初始化任务详情接口init
            async init () {
                sessionStorage.removeItem('ImgData');
                sessionStorage.removeItem('threeData');
                sessionStorage.removeItem('videoTime');

                const {data} = await await projectInfoDetail({project_id: this.projectID});
                if (data.err_code == 0 ) {
                    this.initData = data.data;
                    this.getTaskData();
                }

            },
            //获取任务详情数据
            async getTaskData () {
                return new Promise((resolve, reject) => {
                    let parms = {
                        id: this.taskId,
                        needGuideData: this.needGuideData ? true : null
                    };
                    projectInfoInfo(parms)
                        .then(({data}) => {
                            if (data.err_code == 0) {
                                this.taskInfos = data;
                                this.is_collaboration = parseInt(data.is_collaboration);
                                //判断是否有过阶段上传
                                if (data.stage_list.length > 0) {
                                    //判断是否是资源管理页面进入详情页 对应资源管理阶段
                                    let isStage = this.$route.query.stage;
                                    if (isStage) {
                                        this.taskStageInfo(isStage);
                                    } else {
                                        //否则获取最后一次上传的阶段信息 Arr排序取最大值  最大值就是最后一次上传的阶段
                                        let arr = this.$PublicFuns.sortByKey(data.stage_list, 'id');
                                        this.taskStageInfo(arr[arr.length - 1].id);
                                    }
                                } else {
                                    this.$bus.emit('initFileBrowse', {taskid: data.task_id, type: 'NULL'});
                                    this.showFileBrowser = true;
                                }
                                resolve(data);
                            } else {
                                this.$Message.error(data.err_message);
                                reject(false);
                            }
                        });
                });
            },
            //初始化最近上传阶段
            async taskStageInfo (id) {
                let parms = {
                    id: id,
                    needGuideData: this.needGuideData ? true : null
                };
                let {data} = await projectInfoStageInfo(parms);
                if (data.err_code == 0) {
                    let url = data.file.filter(creent => creent.is_main === '1');
                    this.stageInfos = data;
                    let _this = this;
                    if (url[0].type === 'image') {
                        let image = new Image();
                        let imageWidth = null;
                        let imageHeight = null;
                        image.src = url[0].file;
                        image.onload = function () {
                            imageWidth = image.width;
                            imageHeight = image.height;
                            _this.fileInfos = {
                                type: 'image',
                                width: imageWidth,
                                height: imageHeight,
                                ext: url[0].ext,
                                stage: data.stage,
                                stageID: data.stage_id
                            };
                        };
                    } else if (url[0].type === 'video' || url[0].type === '3D' || url[0].type === 'audio') {
                        _this.fileInfos = {
                            type: url[0].type,
                            size: url[0].size,
                            ext: url[0].ext,
                            stage: data.stage,
                            stageID: data.stage_id
                        };
                    }
                } else {
                    this.$Message.error(data.err_message);
                }
                this.showFileBrowser = true;
            },
            //资源面板切换阶段操作
            resourceTabFun (stageData) {
                this.showFileBrowser = false;
                setTimeout(() => {
                    this.stageInfos = stageData;
                    this.showFileBrowser = true;
                }, 100);
            },

            /*
            * 重构结束
            * */

            ...mapMutations([ 'setPrimaryMission', 'setDetailAll', 'setUserStatus' ]),
            detailRoleShow (type) {
                let objForm = localStorage.detailRole ? JSON.parse(localStorage.detailRole) : null;
                for (let k in objForm) {
                    if (k === type) {
                        return objForm[k];
                    }
                }
            },
            changeModelStatus (Status) {
                if (Status == 2) {
                    this.ModalData = {
                        title: i18n.t('project.pro_pauseTheTask'),
                        content: `${i18n.t('lang.lang_confirm')} <span style="color: red">${i18n.t('project.pro_pause')}</span> ${i18n.t('project.pro_thisTask')}`
                    };
                    this.actionTaskFlag = true;
                } else if (Status == 3) {
                    this.ModalData = {
                        title: i18n.t('project.pro_contiuneTask'),
                        content: `${i18n.t('lang.lang_confirm')} <span style="color: #3cd2b4">${i18n.t('project.pro_continue')}</span> ${i18n.t('project.pro_thisTask')}`
                    };
                    this.actionTaskFlag = true;
                }
            },
            //改变任务状态
            async comfirmAction () {
                let url;
                if (this.taskInfos.status == 1) {
                    let {data} = await projectInfoStart({id: this.taskInfos.id});
                } else if (this.taskInfos.status == 2) {
                    let {data} = await projectInfoPause({id: this.taskInfos.id});
                } else if (this.taskInfos.status == 3) {
                    let {data} = await projectInfoContinue({id: this.taskInfos.id});
                }
                // this.$axios.post(url, {id: this.taskInfos.id}).then(data => {

                this.getTaskData();
                this.$Message.success(i18n.t('project.pro_handleSuccess'));

                // });
            },
            //任务详情上传完成后 重新获取数据
            callbackFun () {
                this.getTaskData();
                this.UploadPop = false;
            },
            //任务详情资源点击上传文件触发事件
            openUplodPop (stage) {
                this.currentStage = stage;
                this.UploadPop = true;
            },
            //增加编辑Modal子任务模版
            addChildTask: function () {
                this.subData.push({
                    name: i18n.t('project.pro_noName'),
                    plan: i18n.t('project.pro_noPlan')
                });
            },
            // 确认删除
            async ConfirmDelete () {
                let {data} = await projectInfoDelete({id: this.taskInfos.id});
                if (data.err_code == 0) {
                    this.$Message.success(i18n.t('project.pro_deleteTaskSuccess'));
                    this.$router.back(-1);
                } else {
                    this.$Message.error(data.err_message);
                }
                this.deleteShow = false;
            },
            //子任务新增数据
            async subSave () {
                let cIs = this;
                let dateForm = {};
                dateForm.father = cIs.editData.id;
                dateForm.name = cIs.pushSubData.name;
                dateForm.project = cIs.pushSubData.project_id;
                dateForm.project_child = cIs.pushSubData.project_child;
                dateForm.tasktype_id = cIs.pushSubData.tasktype_id ? cIs.pushSubData.tasktype_id : 0;
                dateForm.expect_start_time = cIs.pushSubData.expect_start_time;
                dateForm.expect_end_time = cIs.pushSubData.expect_end_time;
                dateForm.description = cIs.pushSubData.description;
                dateForm.image = JSON.stringify(cIs.handleUrl);
                dateForm.file = JSON.stringify(cIs.fileUrl) ? JSON.stringify(cIs.fileName) : 0;
                let data = await projectInfoAdd(dateForm);
                cIs.$emit('close');
                this.forEachData();
            },

            //参与人选项卡
            memberList (index) {
                this.num = index;
            },

            /**
             * get请求
             */
            get (url, params, call) {

                /*获取列表信息*/
                this.$http.get(url, {params: params})
                    .then(
                        function (res) {
                            call(res);
                        },
                        function (error) {
                            this.$Message.error(i18n.t('project.pro_dataErrRefreBrowser'));
                        }
                    );
            },
            //判断主任务是否包含子任务数据
            forEachData () {
                let cdy = this;
                let child = this.editData.child;
                if (child) {
                    cdy.subData = child;
                }
            },
            //获取任务类型
            getTaskClass () {
                let clT = this;
                this.get(
                    cateList,
                    {
                        company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
                    },
                    res => {
                        clT.formLeft = res.data.data;
                        for (let i = 0; i < clT.formLeft.length; i++) {
                            this.setypeClass = clT.formLeft[i].tasktype;
                        }
                    }
                );
            },
            subChild (pName) {
                this.pushSubData.project_child = pName;
            },
            subClasst (TypeName) {
                this.pushSubData.tasktype_name = TypeName;
            },
            // 删除子任务列表数据
            removeChild (index) {
                let cIs = this;
                let removeSubData = this.subData[index].id;
                this.get(
                    deletetaskData,
                    {
                        id: removeSubData
                    },
                    () => {
                        cIs.$Message.success(i18n.t('project.pro_deleteSubtaskSuccess'));
                        cIs.getProjectId();
                    }
                );
                this.subData.splice(index, 1);
            },
            // 清除进入详情页获得的任务数据
            leaveInfo () {
                this.$router.back(-1);
            },
            saveShow () {
                this.saveButtonShow = true;
            },
            changeTitle () {
                api.accessoryUpload({id: this.projectId, name: this.projectDetail.name});
            }
        },
        beforeDestroy () {

            /*清空 让左侧菜单显示*/
            this.setDetailAll(null);
            this.setUserStatus(null);
        },
        filters: {
            status (value) {
                if (value == '1') {
                    return i18n.t('workbench.work_noBegin');
                } else if (value == '2') {
                    return i18n.t('project.pro_InProduction');
                } else if (value == '3') {
                    return i18n.t('project.pro_InSuspend');
                } else if (value == '4') {
                    return i18n.t('workbench.work_complete');
                }
            }
        }
    };
</script>
<style lang="less">
    @import '../taskModal.less';

    .taskinfopop {
        .title {
            padding: 0;
            margin-top: 5px;
            text-align: right;
            line-height: 40px;
            font-size: 18px;
            > button {
                min-width: 100px;
                height: 30px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                color: #fff;
                background: @base;
                padding: 0;
                line-height: 30px;
                font-size: 14px;
                &:hover {
                    color: #fff !important;
                    background: @base_dark;
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                }
            }
        }
        .second-navigation-bar {
            margin-bottom: 10px;
            overflow: hidden;
            > a {
                float: left;
                font-size: 13px;
                color: #777777;
                padding: 0 2px;
                border-bottom: 2px solid @baseboard;
                &.second-nav-title {
                    border-bottom: 2px solid #3bceb6;
                    font-size: 14px;
                    margin-top: -1px;
                }
                &:hover {
                    border-bottom: 2px solid #3bceb6;
                    -webkit-transition: border-bottom-color 0.2s;
                    -moz-transition: border-bottom-color 0.2s;
                    -ms-transition: border-bottom-color 0.2s;
                    -o-transition: border-bottom-color 0.2s;
                    transition: border-bottom-color 0.2s;
                }
            }
            > .icon {
                float: left;
                margin: 0 5px;
                font-size: 18px;
                color: @black_2;
            }
        }
        .taskinfopopTitle {
            padding: 12px 0px 20px 0px;
            background: @white;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .actionTask {
                background: @base;
                color: @white;
                font-size: 12px;
                padding: 3px 5px;
                border-radius: 3px;
                border: 1px solid @base;
                &:hover {
                    cursor: pointer;
                    color: @base;
                    background: @white;
                    border: 1px solid @base;
                }
                em {
                    font-size: 12px;
                }
            }
            .taskStatusSty {
                font-size: 12px;
                padding: 2px 0;
                border-radius: 3px;
                width: 60px;
                text-align: center;
                display: inline-block;
            }
            .loadingTask {
                background: #9ED3FD;
                color: @white;
                border: 1px solid #9ED3FD;
            }
            .zantinTask {
                background: #ff7970;
                color: @white;
                border: 1px solid #ff7970;
            }
            .compaletTask {
                background: @base;
                color: @white;
                border: 1px solid @base;
            }
            .icon {
                padding: 5px;
                font-size: 16px;
                color: @black_4;
                &:hover {
                    cursor: pointer;
                }
            }
            .stopIco {
                &:hover {
                    color: #ff7970;
                }
            }
            .ContinueIco {
                &:hover {
                    color: @base;
                }
            }
            .delIco {
                &:hover {
                    color: @red;
                }
            }
            .tag {
                display: inline-block;
                padding: 2px 10px 0px 10px;
                border-radius: 8px;
                height: 20px;
                line-height: 16px;
                color: @white;
                font-size: 12px;
                right: 30px;
                > i {
                    margin: 0 1px 0 0;
                }
                > label {
                    line-height: 13px;
                }
            }
            .tag1 {
                background: @orange;
            }
            .tag2 {
                background: @blue;
            }
            .tag3 {
                background: @red;
            }
            .tag4 {
                background: @base;
            }
        }
        .taskinfopopContainer {
            height: 800px;
            .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
                font-size: 13px;
            }
            .save {
                text-align: right;
                margin: 15px 20px;
                button.ivu-btn {
                    width: 100%;
                    height: 38px;
                    background: #3bceb6;
                    outline: none;
                    border: none;
                    > span {
                        font-size: 14px;
                    }
                    &:hover {
                        background: rgba(59, 206, 182, 0.9);
                    }
                }
            }
            .detailTitle {
                margin-right: 10px;
                font-size: 15px;
            }
            .leftDiv {
                .base-card;
                width: 25%;
                min-width: 310px;
                height: 100%;
                background: @white;
                float: left;
                .tabcheckout {
                    ul {
                        display: flex;
                        border: 1px solid #efefef;
                        border-right: 0;
                        border-radius: 5px;
                        li {
                            width: 20%;
                            text-align: center;
                            font-size: 13px;
                            border-right: 1px solid #f7f3f3;
                            color: #bdbdbd;
                            padding: 7px 0;
                            &.activeSty {
                                color: @base !important;
                            }
                            &:hover {
                                cursor: pointer;
                                color: @base;
                            }
                        }
                    }
                }
                .taskManagement {
                    width: 100%;
                    .ivu-tabs-bar,
                    .ivu-tabs-tab {
                        border-bottom: 1px sold transparent !important;
                    }
                    .ivu-tabs-bar {
                        border: none !important;
                        margin: 0;
                        .ivu-tabs-nav-container {
                            height: 40px !important;
                            margin-bottom: 10px;
                            .ivu-tabs-nav-wrap {
                                .ivu-tabs-nav-prev {
                                    line-height: 40px;
                                    left: 6px;
                                }
                                .ivu-tabs-nav-next {
                                    line-height: 40px;
                                    right: 6px;
                                }
                                .ivu-tabs-nav {
                                    border: none !important;
                                    height: 45px;
                                }
                            }
                            .ivu-tabs-bar {
                                border: none !important;
                            }
                            .ivu-tabs-nav-scroll .ivu-tabs-tab {
                                border: 1px solid #f2f9f9;
                                background: @white;
                            }
                        }
                        .ivu-tabs-tab {
                            width: 75px;
                            height: 35px !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            text-align: center;
                            line-height: 35px !important;
                            color: #b0b0b0;
                            border-radius: 0 !important;
                            &:hover {
                                color: rgb(24, 191, 164);
                            }
                        }
                    }
                }
            }
            .videoRight {
                margin-left: 26%;
                height: 100%;
                .filebrowseContainer {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    // justify-content: space-between;
                }
            }
        }
        .taskbrowse {
            width: 540px !important;
            padding-right: 200px;
            margin: 0 12px 0 0;
        }
        .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
            position: relative;
            color: @base !important;
            background: #fff;
        }
        .ivu-select-visible,
        .ivu-select-placeholder,
        .ivu-select-selection {
            height: 40px !important;
            line-height: 40px !important;
            outline: none !important;
            box-shadow: none !important;
        }
        .ivu-form-item-label {
            color: @black_3;
        }
        .requirement {
            padding: 0;
            background: #fcfdfd;
            .ivu-card {
                background: transparent;
                border: none;
                .ivu-card-body {
                    padding: 0 !important;
                }
                &:hover {
                    box-shadow: none;
                }
            }
            .ivu-input {
                padding-right: 6px;
                font-size: 13px;
                text-align: right;
            }
            .ivu-input-icon {
                left: 0;
                font-size: 20px;
            }
            p {
                display: flex;
                height: 22px;
                margin-bottom: 10px;
                padding: 0 5px;
                font-size: 14px;
                line-height: 22px;
                justify-content: space-between;
                border-radius: 8px;
                background: @gray;
            }
        }
    }
</style>
