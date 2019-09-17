<!-- 任务详情组件 -->
<template>
    <div class="taskDetailsContainer" :class="{'martop':type !== 'newTask'}">
        <Form :label-position="'left'" :label-width="70">
            <FormItem :label="$t('workbench.work_taskName')">
                <i class="requiredIcon" v-if="type == 'newTask'" >*</i>
                <!--如果是甲方公司 且该任务是协作任务 就不能编辑任务-->
                <Input v-model="taskInfos.name" :disabled="companyType && taskInfos.is_collaboration ? true : type == 'taskDetail' && Boolean(!detailRole.title)"
                       @on-blur="editTaskAutoSave(true)" :placeholder="$t('project.pro_enterTaskName')"></Input>
            </FormItem>
            <!--<FormItem label="制作人" class="borBotm">-->
                <!--<i class="requiredIcon" v-if="type == 'newTask'" >*</i>-->
                <!--&lt;!&ndash;&ndash;&gt;-->
                <!--<Select v-if="taskInfos.run_uid != 'NULL'" v-model="taskInfos.run_uid" placeholder="请选择制作人"  :disabled="companyType && taskInfos.is_collaboration ? true : type == 'taskDetail' && Boolean(!detailRole.run_user)" @on-change="editTaskAutoSave(false)">-->
                    <!--<Option v-for="item in meberList" :value="parseInt(item.user_id)" :key="item.run_uid">-->
                        <!--{{item.realname}}-->
                    <!--</Option>-->
                <!--</Select>-->
            <!--</FormItem>-->
            <FormItem :label="$t('workbench.work_producer')" class="borBotm">
                <i class="requiredIcon" v-if="type == 'newTask'">*</i>
                <bby-select :v-model="taskInfos.remark_name" class="bbySelect" ref="bbySelectMember" :placeholder="$t('project.pro_selectProducer')"
                            :selectTab="memberSelectTab" :disabledFlag="companyType && taskInfos.is_collaboration ? true : type == 'taskDetail' && Boolean(!detailRole.run_user)">
                    <!--项目-->
                    <template slot="select1" v-if="memberDataPro">
                        <div class="projectMemberBox">
                            <div  v-for="(item,index) in memberDataPro" :key="index" @click="selectMmmberProjectVal(item,index)"
                                 class="projectMember" :class="{'active':taskInfos.run_uid == item.user_id}" >
                                <img class="headImg"  :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id" alt="">
                                <span class="memberName" :title="item.realname" >{{item.realname}}</span>
                            </div>
                        </div>
                    </template>
                    <!--公司-->
                    <template slot="select2" v-if="memberDataCom">
                        <Input v-model="searchVal" :placeholder="$t('project.pro_personnelSearch')" @on-keyup="searchMember"  icon="ios-search"  style="width: calc(100% - 20px);margin: 0 10px 0 10px;"></Input>
                       <template v-if="!searchArray">
                           <li  v-for="(item,index) in memberDataCom" :key="index"
                                class="companyMember"  >
                               <p class="memberTitle">{{item.name}}</p>
                               <div class="memberChildList" v-for="(child,i) in item.child" :key="i" :class="{'active':taskInfos.run_uid == child.user_id}"
                                  @click="selectMmmberProjectVal(child,i)" >
                                   <img class="headImg" :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+child.user_id" alt="">
                                   <span>{{child.realname}}</span>
                               </div>
                           </li>
                       </template>
                        <!--搜索-->
                       <template v-else>
                           <template v-if="searchArray.length > 0">
                               <p class="memberChildList" v-for="(item,index) in searchArray" :key="index"  @click="selectMmmberProjectVal(item,index)" >
                                   <img class="headImg" :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id" alt="">
                                   <span>{{item.realname}}</span>
                               </p>
                           </template>
                           <template v-else>
                               <p class="notFound">{{$t('tip.tip_notFoundMember')}}</p>
                           </template>

                       </template>

                    </template>
                </bby-select>
            </FormItem>
            <FormItem :label="$t('project.pro_taskType')" class="borBotm">
                <i class="requiredIcon" v-if="type == 'newTask'">*</i>
                <bby-select :v-model="taskInfos.tasktype_name"   ref="bbySelectTask" :placeholder="$t('project.pro_selectTaskType')" :selectTab="standardSelectTab" :disabledFlag="companyType && taskInfos.is_collaboration ? true : type == 'taskDetail' && Boolean(!detailRole.task_type) ">
                    <template slot="select1" >
                           <li class="projectLi" v-for="(item,index) in selecProjectTask" :key="index"  :class="{'memberActive':item.id === taskInfos.tasktype_id}"
                               @click="selectProjectVal(item,index,'project')">
                               <Icon type="ios-paper-outline" size="14"></Icon>
                               <span class="text">{{item.tasktype_name}}</span>
                           </li>
                    </template>
                    <template slot="select2">
                        <Tree  class="treeSelect" :data="data5" :render="renderContent"></Tree>
                    </template>
                </bby-select>
            </FormItem>
            <!--<FormItem label="任务类型" console.log()lass="borBotm">-->
                <!--<i class="requiredIcon" v-if="type == 'newTask'">*</i>-->
                <!--<Select v-if="taskInfos.tasktype_id != 'NULL'" v-model="taskInfos.tasktype_id" placeholder="选择任务类型" :disabled="companyType && taskInfos.is_collaboration ? true : type == 'taskDetail' && Boolean(!detailRole.task_type) " @on-change="editTaskAutoSave(false)">-->
                    <!--<Option v-for="item in taskTypeList" :key="parseInt(item.id)" :value="item.id">-->
                        <!--{{item.tasktype_name}}-->
                    <!--</Option>-->
                <!--</Select>-->
            <!--</FormItem>-->
            <FormItem :label="$t('project.pro_taskTime')" class="borBotm dateBorBotm">
                <i class="requiredIcon" v-if="type == 'newTask'">*</i>
                <!--{{getTimeRange}}-->
                <!--format="yyyy-MM-dd HH:mm:ss"-->
                <DatePicker class="taskdatepicker" format="yyyy-MM-dd" type="daterange"  :value="getTimeRange" :readonly="companyType && taskInfos.is_collaboration ? true : detailRole.flag ? Boolean(!detailRole.run_time) : false" @on-change="setTimeRange"  split-panels style="width: 100%" :placeholder="$t('project.pro_selectStartEndTime')"></DatePicker>
            </FormItem>
            <FormItem :label="$t('project.pro_subproject')" class="borBotm">
                <Select v-if="taskInfos.project_child != 'NULL'" v-model="taskInfos.project_child" :disabled="companyType && taskInfos.is_collaboration ? true : detailRole.flag ? Boolean(!detailRole.project_child) : false" @on-change='editTaskAutoSave(false)' :placeholder="$t('project.pro_selectSubproject')">
                    <Option v-for="item in ChildProjectList" :key="parseInt(item.id)" :value="item.id">
                        {{item.name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem :label="$t('project.pro_refAttachment')" class="borBotm">
                <!--(!companyType && !taskInfos.is_collaboration && detailRole.task_file && type == 'taskDetail') || type != 'taskDetail'-->
                <div class="uploadSty" v-if="(companyType && !taskInfos.is_collaboration && detailRole.task_file && type == 'taskDetail') ||
                                             (!companyType && detailRole.task_file && type == 'taskDetail') ||
                                             type != 'taskDetail'">
                    <v-upload ref="uploadRef" :id="uploadId" :isShowProgress="false" @FileUploadedSuccess="getUploadFile">
                        <template slot="upload">
                            <div class="shade">
                                <button :id="uploadId" class="btn"></button>
                                <div class="uploadBox">
                                    <span class="iconfonts icon-ymy-upload-copy"></span>
                                    <p>{{$t('project.pro_clickUploadAttachments')}}</p>
                                </div>
                            </div>
                            <ul style="max-height: 140px;overflow: auto">
                                <li class="flieList" v-for="(items,index) in taskInfos.file" :key="index">
                                    <span class="fileText">
                                        <Icon type="android-document"></Icon>
                                        <p :title="items.name"> {{items.name}}</p>
                                    </span>
                                    <span>
                                        <a :href="items.url+'?response-content-type=application%2Foctet-stream'" download="" style="color: #657180">{{$t('upload.upload_download')}} &nbsp;</a>
                                        <Icon @click.native="delImage(items)" type="ios-close-outline" v-if="!detailRole.flag || Boolean(detailRole.task_file)"></Icon>
                                    </span>
                                </li>
                            </ul>
                        </template>
                    </v-upload>
                </div>
                <ul v-else-if="taskInfos && taskInfos.file && taskInfos.file.length > 0">
                    <li v-for="(items,index) in taskInfos.file">
                        <Icon type="android-document"></Icon>
                        <span>{{items.name}}</span>&nbsp;&nbsp;&nbsp;
                        <a :href="items.url+'?response-content-type=application%2Foctet-stream'" download=""  style="color: #657180">{{$t('upload.upload_download')}} &nbsp;</a>
                    </li>
                </ul>
                <p v-else style="height: 40px;line-height: 40px;">{{$t('project.pro_notAvailable')}}</p>
            </FormItem>
            <FormItem :label="$t('project.pro_remark')" class="borBotm remark-item">
                <Input
                @on-blur="editTaskAutoSave(false)"
                class="remark"
                v-model="taskInfos.description"
                type="textarea"
                size="large"
                :autosize="{minRows: 2,maxRows: 5}"
                :disabled="companyType && taskInfos.is_collaboration ? true : detailRole.flag ? Boolean(!detailRole.task_remark) : false"
                ></Input>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import {pjTaskProjectAdd, pjTaskTaskUpdate, pjTaskMemberList, pjTaskCateList, pjTaskList, pjTaskJoined, pjTaskChildList} from '@/axios/modules/project/projectTask';
    import api from 'api';
    import {mapState, mapMutations} from 'vuex';
    import {taskDetail} from 'api';
    import vUpload from '@/components/upload';
    import Cookies from 'js-cookie';
    import BbySelect from "../../../components/bbySelect";
    export default {
        props: {
            taskInfos: {
                type: Object,
                default: function () {
                    return {
                        file: []
                    };
                }
            },
            initData: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            type: {
                type: String
            }
        },
        watch: {
            initData(val){
                this.detailRole = val;
                this.detailRole.flag = true;
            }
        },
        data() {
            return {
                tasktypeSource: 'project',
                searchArray: null,
                memberDataCom: null,
                memberDataPro: null,
                searchVal: "",
                memberProjectI: null,
                memberData: null,
                standardSelectTab: [i18n.t('project.pro_projectSpecification'), i18n.t('project.pro_CompanyGeneralSpecification')],
                memberSelectTab: [i18n.t('lang.lang_project'), i18n.t('lang.lang_company')],
                data5: [
                    {
                        title: 'parent 1',
                        expand: true,
                        render: (h, {root, node, data}) => h('span', {
                            style: {
                                display: 'inline-block',
                                width: '80%'
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                            type: 'ios-folder-outline'
                                        },
                                    style: {
                                            marginRight: '8px'
                                        }
                                }),
                                h('span', data.title)
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '32px'
                                }
                            })
                        ]),
                        children: []
                    }
                ],
                standardVal: {name: '', id: ''},
                selecProjectTask: null,

                projectId: this.$route.query.project || sessionStorage.getItem('projectID'),
                //*时间属性选项*//
                startTime: null,
                endTime: {
                    disabledDate(date) {
                        return date && (date.valueOf() > new Date('2019-05-13').valueOf());
                    }
                },
                companyType: JSON.parse(Cookies.get('company')).type,

                /*
                * 重构开始
                * */
                detailRole: {
                    flag: false
                },
                meberList: [],
                taskTypeList: [],
                ChildProjectList: [],
                flieList: [], // 上传组件回显的图片
                // expect_start_date:null,
                // expect_end_date:null

                /*
                * 重构结束
                * */
                needGuideData: null,
                uploadedFiles: []
            };
        },
        mounted() {
            this.getjoinMeberList();
            this.getTaskTypeList();
            this.getChildProjectList();
            this.getComTaskType();
            this.getProTaskType();
            this.getselecData();
            this.getselecDataCom();
        },
        computed: {
            ...mapState({
                userStatus(value) {
                    return value.project.userStatus;
                },
                toName(value) {
                    return value.ImgVedioStatus.toName;
                },
                clubTaskManagement(value) {
                    return value.app.clubTaskManagement;
                },
            }),
            getTimeRange() {
                //兼容IE的写法 不然IE会有时间显示不出来
                if (this.taskInfos.expect_start_date && this.taskInfos.expect_end_date){
                    let expect_start_date = new Date(this.taskInfos.expect_start_date.replace(/-/g, "/")).getTime();
                    let expect_end_date = new Date(this.taskInfos.expect_end_date.replace(/-/g, "/")).getTime();
                    return [expect_start_date, expect_end_date];
                } else {
                    return [];
                }
                // return [this.taskInfos.expect_start_date,this.taskInfos.expect_end_date]
            },
            fileup() {
                return this.$store.state.paySkip.fileUpload;
            },
            uploadId() {
                return 'upload' + Math.random();
            }
        },
        methods: {
            async searchMember() {
                let objForm = {
                    search: this.searchVal,
                    acc_token: sessionStorage.accToken
                };
                let {data} = await pjTaskMemberList(objForm);
                if (data.err_code === 0 && data.data) {
                    this.searchArray = data.data;
                }
            },
            renderContent(h, {root, node, data}) {
                return h('span', {
                    class: data.active?'treeComActive':'',
                    style: {
                        display: 'inline-block',
                        alignItems: 'center',
                        width: '80%',
                        height: '32px',
                        lineHeight: '32px',
                        paddingLeft: '5px',
                    },
                    on: {
                        click: () => {
                            if (data.tasktype_name) {
                                this.$set(data, 'active', !data.active);
                                this.selectProjectVal(data, null, 'company');
                            }
                        }
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: (data.rank === 0 || data.rank === 1) ? 'ios-folder-outline' : 'ios-paper-outline',
                            },
                            style: {
                                marginRight: '8px',
                                fontSize: '14px',
                                verticalAlign: 'text-bottom',
                            },

                        }),
                        h('span', data.title, {})
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        },
                    }, )
                ]);
            },
            selectProjectVal(item, index, type) {
                this.tasktypeSource = type;
                this.$set(this.taskInfos, 'tasktype_id', item.id);
                this.$set(this.taskInfos, 'tasktype_name', item.tasktype_name);
                this.$refs.bbySelectTask.selectShow = false;
                this.editTaskAutoSave(true);
            },
            selectMmmberProjectVal(item, index) {
                this.searchArray = null;
                this.searchVal = '';
                this.memberProjectI = index;
                this.$set(this.taskInfos, 'run_uid', item.user_id);
                this.$set(this.taskInfos, 'remark_name', item.realname);
                this.$refs.bbySelectMember.selectShow = false;

                this.editTaskAutoSave(true);
            },
            async getComTaskType() {
                let {data} = await pjTaskCateList({acc_token: sessionStorage.accToken});
                if (data.err_code === 0 && data.data) {
                    data.data.map((items, index) => {
                        items.title = items.name;
                        items.rank = 0;
                        if (items.children) {
                            items.children.map((children, idx) => {
                                children.title = children.name;
                                children.rank = 1;
                                if (children.tasktype) {
                                    children.children = children.tasktype;
                                    children.children.map((cld, i) => {
                                        cld.title = cld.tasktype_name;
                                        cld.rank = 2;
                                        // this.typeVal.map((type) => {
                                        //     if (type.id === cld.id) {
                                        //         this.$set(cld, 'active', true)
                                        //     }
                                        // })
                                    });
                                }
                            });
                        }
                    });
                    this.$nextTick(() => {
                        this.data5[0].children = data.data;
                    });
                }
            },
            async getProTaskType() {

                let {data} = await pjTaskList({project_id: this.projectId, acc_token: sessionStorage.accToken});
                if (data.err_code === 0 && data.data) {
                    this.selecProjectTask = data.data;
                }
            },
            async getselecData() {
                let objForm = {
                    project_id: sessionStorage.projectID,
                    acc_token: sessionStorage.accToken
                };
                let {data} = await pjTaskMemberList(objForm);
                if (data.err_code === 0) {
                    this.memberDataPro = data.data;
                }
            },
            async getselecDataCom() {
                let objForm = {
                    type: 'ability',
                    acc_token: sessionStorage.accToken
                };
                let {data} = await pjTaskMemberList(objForm);
                if (data.err_code === 0) {
                    this.memberDataCom = data.data;
                }
            },

            /*
            * 重构开始
            * */
            //获取执行人列表
            async getjoinMeberList(){
                if (sessionStorage.getItem('needGuideData')) {
                    this.needGuideData = JSON.parse(sessionStorage.getItem('needGuideData')) ? true : null;
                }
                // alert(this.needGuideData)
                let {data} = await pjTaskJoined({project_id: this.projectId, needGuideData: this.needGuideData, acc_token: sessionStorage.accToken});
                if (data.err_code == 0){
                    this.meberList = data.data;
                    console.log(this.meberList);
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            //获取任务类型列表
            async getTaskTypeList(){
                if (sessionStorage.getItem('needGuideData')) {
                    this.needGuideData = JSON.parse(sessionStorage.getItem('needGuideData')) ? true :null;
                }
                let {data} = await pjTaskList({project_id: this.projectId, needGuideData: this.needGuideData, acc_token: sessionStorage.accToken});
                if (data.err_code == 0){
                    this.taskTypeList = data.data;
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            //获取子项目列表
            async getChildProjectList(){
                if (sessionStorage.getItem('needGuideData')) {
                    this.needGuideData = JSON.parse(sessionStorage.getItem('needGuideData'))? true :null;
                }
                let {data} = await pjTaskChildList({project_id: this.projectId, needGuideData: this.needGuideData, acc_token: sessionStorage.accToken});
                if (data.err_code == 0){
                    this.ChildProjectList = data.data;
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            //开始时间
            setTimeRange(date) {
                this.taskInfos.expect_start_date = date[0];
                this.taskInfos.expect_end_date = date[1];
                this.editTaskAutoSave(false);
            },
            //编辑任务自动保存
            async editTaskAutoSave(type){
                if (this.type == 'taskDetail'){
                    if (type){
                        if (!this.taskInfos.name || this.taskInfos.name == null || this.taskInfos.name.length ==0){
                            this.$Message.error(i18n.t('project.pro_taskNameCannotEmpty'));
                        } else {
                            this.saveTaskDetails(true);
                        }
                    } else {
                        this.saveTaskDetails(true);
                    }
                }
            },
            //更新任务
            async updateTaskDetail(dataForm, type) {
                dataForm.acc_token = sessionStorage.accToken;
                let {data} = await pjTaskTaskUpdate(dataForm);
                if (data.err_code == 0){
                    if (type === 'childTask'){
                        this.$Message.success(i18n.t('project.pro_subtaskEditSucess'));
                        this.$emit('refreshChildTaskList');
                    } else {
                        this.$Message.success(i18n.t('project.pro_editTaskSuccess'));
                        this.$emit('refreshCurrentTask');
                    }
                } else {
                    if (type === 'childTask'){
                        this.$Message.error(i18n.t('project.pro_subtaskEditFail'));

                    } else {
                        this.$Message.error(i18n.t('project.pro_editTaskFail'));
                    }
                }
            },

            /*
            * 重构结束
            * */

            //主任务保存编辑数据
            saveTaskDetails(type, id) {

                /*
                   * type :  控制 新建任务 还是 编辑任务   id : 如果有表示 子任务 编辑 或者 新建  如果没有 表示正常普通任务 新建 或者 编辑
                   * false 新建
                   * true  编辑
                   * */
                let fatherID = null;
                let taskType = null;
                if (type){
                    if (!id){
                        fatherID = this.taskInfos.father;
                    } else {
                        // alert('子任务编辑')
                        fatherID = id;
                        taskType = 'childTask';
                    }
                } else {
                    if (!id){
                        fatherID = null;
                    } else {
                        taskType = 'childTask';
                        // alert('子任务增加')
                        fatherID = id;
                    }
                }
                // alert('父级任务ID：'+fatherID)
                let dataForm = {};
                dataForm.id = this.taskInfos.id;
                dataForm.father = fatherID;
                dataForm.name = this.taskInfos.name;
                dataForm.project = this.$route.query.project || this.projectId;
                dataForm.project_child = this.taskInfos.project_child;
                dataForm.tasktype_id = this.taskInfos.tasktype_id;
                dataForm.expect_start_time = this.taskInfos.expect_start_date;
                dataForm.expect_end_time = this.taskInfos.expect_end_date;
                dataForm.description = this.taskInfos.description;
                dataForm.file = JSON.stringify(this.taskInfos.file) ? JSON.stringify(this.taskInfos.file) : [];
                dataForm.run_member_id = this.taskInfos.run_uid;

                if (!dataForm.name) {
                    this.$Message.error(i18n.t('project.pro_enterTaskName'));
                } else if (!dataForm.run_member_id) {
                    this.$Message.error(i18n.t('project.pro_selectTaskOperator'));
                } else if (!dataForm.tasktype_id) {
                    this.$Message.error(i18n.t('project.pro_selectTaskType'));
                } else if (!dataForm.expect_start_time) {
                    this.$Message.error(i18n.t('project.pro_selectTaskTime'));
                } else {
                    type ? this.updateTaskDetail(dataForm, taskType) : this.addTaskDetails(dataForm, taskType);
                }
            },

            //新增任务
            async addTaskDetails(dataForm, type) {
                dataForm.tasktype_source = this.tasktypeSource;
                dataForm.acc_token = sessionStorage.accToken;
                let {data} = await pjTaskProjectAdd(dataForm);
                if (data.err_code == 0){
                    this.$emit('clearTaskInfos');
                    // this.taskInfos = {}
                    this.flieList = [];
                    if (type === 'childTask'){
                        this.$Message.success(i18n.t('project.pro_addSubtaskSuccess'));
                        this.$emit('refreshChildTaskList');
                    } else {
                        this.$Message.success(i18n.t('project.pro_addTaskSuccess'));
                        this.$emit('refreshCurrentTaskList');
                    }
                } else {
                    if (type === 'childTask'){
                        this.$Message.error(i18n.t('project.pro_addSubtaskFail'));
                    } else {
                        this.$Message.error(i18n.t('project.pro_addtaskFail'));
                    }
                }
            },

            getUploadFile(uploader) {
                const obj = {url: JSON.parse(uploader.response).file_url, name: uploader.name};
                this.uploadedFiles.push(obj);
                this.$set(this.taskInfos, 'file', this.uploadedFiles);
                if (this.detailRole.flag){
                    this.saveTaskDetails(true);
                }
            },
            delImage({url}) {
                this.uploadedFiles = this.uploadedFiles.filter(item => item.url !== url);
                this.$set(this.taskInfos, 'file', this.uploadedFiles);
                if (this.detailRole.flag){
                    this.saveTaskDetails(true);
                }
            },
        },
        components: {
            BbySelect,
            vUpload
        }
    };
</script>
<style lang="less" >
    .taskDetailsContainer{
        .treeSelectBox {
            .treeSelect {
                .treeComActive{
                    color: @white;
                    background: @base;
                }
            }
        }
    }

</style>
<style lang="less" scoped>
    @bor: #f2f9f9;
    .martop{
        margin-top: 20px;
    }
    .taskDetailsContainer {

        .requiredIcon{
            display: block;
            position: absolute;
            top: 0;
            left: -17px;
            height: 40px;
            line-height: 51px;
            font-size: 18px;
            color: @red;
            font-style: normal;
        }

        .bbySelect {
            .active{
                border: 1px solid @base !important;
                background: @base_light ;
            }

            .companyMember{
                .memberTitle{
                    padding-left: 10px;
                    font-size: 16px;
                    color: @base;
                }

            }
            .memberChildList{
                display: flex;
                align-items: center;
                padding-left: 20px;
                .headImg {
                    width: 25px;
                    height: 25px;
                    margin: 0 10px 2px 0;
                    border-radius: 50%;
                }
            }
            .notFound{
                display: flex;
                width: 100%;
                height: 140px;
                justify-content: center;
                align-items: center;
            }
            .projectMemberBox {
                display: flex;
                padding: 0 5px;
                flex-wrap: wrap;
                width: 305px;
                margin: 0 auto;
                /*justify-content: space-between;*/

                /*.projectMember:nth-of-type(3n+1){*/
                    /*margin-left: 10px;*/
                /*}*/
                .projectMember {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 92px;
                    height: 35px;
                    line-height: 35px;
                    padding: 6px;
                    margin: 0 0 10px 5px;
                    border: 1px solid #eef1f2;
                    border-radius: 4px;
                    .memberName{
                        width: 65px;
                        text-align: center;
                        .comOmit;
                    }
                    .headImg {
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                    }
                }

            }

                .projectLi {
                    height: 40px;
                    padding-left: 10px;
                    vertical-align: text-bottom;
                    .text {
                        width: calc(~"100% - 25px");
                        height: 40px;
                        .comOmit;
                    }
                    &:hover {
                        color: @white ;
                        background: @base ;
                    }
                }
            .memberActive{
                    color: @white;
                    background: @base;
                }
                .treeSelectBox {
                    position: relative;
                    width: 100%;

                    .treeSelect {
                        position: absolute;
                        top: -45px;
                        left: 0;
                        width: 100%;
                        font-size: 200px !important;
                        .treeComActive{
                            color: @white;
                            background: @base;
                        }
                    }
                }




        }


        .ivu-form-item {
            margin-bottom: 20px !important;
        }
        .Tips {
            display: none;
            height: 10px;
            font-style: normal;
            color: @red
        }
        .head {
            display: flex;
            .headImg {
                width: 45px;
                height: 45px;
                border-radius: 50%;
            }
        }
        .ivu-form-item-content, .ivu-input {
            font-size: 13px;
            line-height: 16px !important;
        }
        .taskdatepicker {
            width: 100%;
            height: 40px;
        }
        .uploadSty {
            /*padding-bottom: 15px;*/
            .uploadContainer {
                .shade {
                    position: relative;
                    text-align: center;
                    border-radius: 3px;
                    background: @baseboard;
                    button {
                        position: absolute !important;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        height: 100%;
                        outline: none;
                        background: #fff;
                        border: none;
                        opacity: 0;
                        cursor: pointer;
                    }
                    .uploadBox{
                        padding: 10px 0;
                        line-height: 15px;
                        span{
                            font-size: 40px;
                            color: @base;
                        }
                        p{
                            padding-bottom: 10px;
                        }
                    }
                }
            }
        }
        .flieList {
            display: flex;
            padding: 0 5px;
            justify-content: space-between;
            align-items: center;
            .fileText {
                display: flex;
                align-items: center;
                p {
                    width: 162px;
                    padding-left: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: left;
                }
            }
            i {
                font-size: 15px
            }
            &:hover {
                i {
                    cursor: pointer !important;
                }
            }
            /*&:hover {*/
            /*background: #ccc;*/
            /*}*/
        }
        .borBotm {
            // padding-top: 10px;
            // padding-bottom: 10px;
            // border-bottom: 1px solid @bor;
            color: @black_3;

            .ivu-form-item-label {
                text-align: right;
            }

        }
        .dateBorBotm{
            color: @black_2;
        }
        .ivu-spin-text {
            color: #17ceb1;
        }

        textarea.ivu-input {
            /*height: 30px !important;*/
            /*min-height: 30px !important;*/
        }
        .ivu-btn-large {
            font-size: 13px !important;
        }
    }

    .taskdetail {
        display: inline-block;
        overflow: hidden;
    }

    .taskdetail-left {
        width: 400px;
        float: left;
        padding: 0 20px 0 0;
    }

    .taskdetail-right {
        width: 600px;
        float: left;
        padding: 0 0 0 20px;
    }
</style>
<style lang="less" >
    .taskDetailsContainer{
        .ivu-auto-complete.ivu-select-dropdown{
            max-height: 200px;
        }
        .com-scrollbar;
    }

</style>
