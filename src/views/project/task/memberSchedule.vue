<template>
    <!--项目进度-->
    <div class="projectPlanRight" v-if="TabFlags.oneAndOneFlag">
        <p class="projectLeftHead" @click="searchTaskList('all',null)">
            <em class="iconfonts icon-icon-project" style="font-size: 24px;color: #9E9E9E;margin-right: 10px"></em>
            <span class="projectName" :title="`${projectName}`">{{projectName}}(<span class="orange">{{taskCountComplete}}</span>/{{taskCountNumber}})</span>
            <span class="exportProjectTasks" v-on:click="exportProjectTasks">
                <Icon type="archive" style="font-size: 15px;padding-right:8px;"></Icon>{{$t('project.pro_exportProjectTask')}}
            </span>
        </p>
        <Tabs value="name1" class="projectPlanTabs" id="taskTabs">
            <TabPane :label="$t('lang.lang_type')" name="name1" class='taskManager'>
                <ul class="taskSchedule"  v-if="taskCountList">
                    <li class="memberList" v-if="item.cnt" v-for="(item,index) in taskCountList" :key="index" @click="searchTaskList('task',item)">
                        <p class="headInfo">
                            <span class="headInfoText black_1" :title="item.tasktype_name">{{item.tasktype_name}}</span>
                        </p>
                        <Progress hide-info :percent="item.complete_cnt/item.cnt?item.complete_cnt/item.cnt*100:0"></Progress>
                        <span class="ratio"><span class="base">{{item.complete_cnt}}</span> / {{item.cnt}}</span>
                    </li>
                </ul>
            </TabPane>
            <TabPane :label="$t('project.pro_subproject')" name="name2">
                <!--头部-->
                <div v-if="clubTaskManagement" class="rightTitle">
                    <p class="editBtn"   v-show="editShow" @click="editMode">
                        <!--<Icon type="android-options" style="vertical-align: top" size="20"></Icon>&emsp;-->
                        {{$t('project.pro_managingSubprojects')}}
                    </p>
                    <p class="editHead" v-show="!editShow">
                        <span @click="editMode" class="backtrack" style="cursor: pointer;"><Icon type="chevron-left" style="margin-right: 5px;"></Icon>{{$t('lang.lang_back')}}</span>
                        <span class="black_1">{{$t('project.pro_managingSubprojects')}}</span>
                        <span class="addButton"  @click="addInputShow" style="cursor: pointer;">
                            <Icon type="plus-circled" style="margin-right:3px;font-size: 13px"></Icon>{{$t('project.pro_add')}}
                        </span>
                        <!--<Icon type="android-options" style="vertical-align: top" size="20"></Icon>&emsp;-->
                    </p>
                    <!--<span v-if="clubTaskManagement" class="editBtn">-->
                    <!--<Icon v-show="editShow" @click.native="editMode" type="ios-compose-outline" style="vertical-align: top;"-->
                    <!--size="20"></Icon>-->
                    <!--<Icon v-show="!editShow" @click.native="editMode" type="android-arrow-back" style="vertical-align: top;"-->
                    <!--size="20"></Icon>-->
                    <!--</span>-->
                </div>
                <!--显示列表-->
                <div v-if="editShow" class="rightRow">
                    <!-- <div class="Listall" @click="changeTaskListData('all')">全部</div> -->
                    <div class="projectInfoContainer">
                        <!-- 子项目 -->
                        <div v-if="item.is_delete!==1" v-for="(item,index) in childProjectList" class="ChildMsgDataBox" :key="index" @click="searchTaskList('project',item)">
                            <section class="projectInfoBox">
                                <div class="projectHead">
                                    <p class="projectTitle " :title="item.name">{{item.name}}</p>
                                    <p class="leaderText" :title="item.leader_realname">{{$t('project.pro_groupLeader')}}：{{item.leader_realname}}</p>
                                </div>
                                <div class="projectInfo">
                                    <div class="progressBar">
                                        <Progress hide-info :percent="item.complete_count != 0 ?Number(item.complete_count)/Number(item.task_count):0"></Progress>
                                        <div class="ratio" :class="{'aloneRight': true}">
                                            <span class="base">{{item.complete_count}}</span> / {{item.task_count}}
                                        </div>
                                    </div>
                                    <!--<ul class="memberList">-->
                                        <!--<li v-if="item.child_project" v-for="(children,idx) in item.child_project" :key="idx">-->
                                            <!--<div>-->
                                                <!--<img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+children.run_uid">-->
                                                <!--<span>{{children.user}}</span>-->
                                            <!--</div>-->
                                            <!--<div>{{children.complete}}/{{children.total}}</div>-->
                                        <!--</li>-->
                                    <!--</ul>-->
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                <!--编辑-->
                <div v-else class="rightRow editRightRow">
                    <div class="eidtList" >
                        <!--{{childProjectList}}-->
                        <div class="lineEdit"  v-for="(item,index) in childProjectList" :key="index">
                            <section>
                                <div class="editProjectMember">
                                    <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.leader" alt=""> &nbsp;&nbsp;
                                    <Select  v-model="item.leader" @on-change="changePrincipal(item,item.leader)" style="width: 36%">
                                        <Option v-if="leader.id" v-for="(leader,i) in companyMember" :value="leader.user_id?Number(leader.user_id):leader.user_id" :key="i">{{ leader.realname}}</Option>
                                    </Select>
                                    <Input style="width:64%" type="text" @on-blur="changeName(item,$event)" :value="item.name " class="title"></Input>
                                    <span class="iconfonts icon-cuowu-yuankuang-xianxing fontSty" @click="delProject(item)"></span>
                                </div>
                            </section>
                        </div>
                        <div :class="{projectPlanButton:!addInput}" class="addBlock">
                            <div v-show="addInput" style="display: flex;justify-content: space-between">
                                <Select v-model="subProjectManager" style="width:40%" class="selectSty" :placeholder="$t('project.pro_selectSubprojectLeader')">
                                    <Option v-if="item.id" v-for="(item,index) in companyMember" :value="item.user_id" :key="index">{{ item.realname}}</Option>
                                </Select>
                                <Input v-model="subProjectName" :placeholder="$t('project.pro_subprojectName')" style="width:60%"></Input>
                            </div>
                            <div v-show="addInput" style="margin-top: 10px ;text-align: right;">
                                <Button style="background: #3cd2b4;color: #fff;" @click="addButton(true)">{{$t('lang.lang_confirm')}}</Button>
                                <Button type="text" @click="addButton(false) ">{{$t('lang.lang_cancel')}}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </TabPane>
            <TabPane :label="$t('lang.lang_member')" name="name3">
                <ul class="memberSchedule" style="padding: 0 10px" >
                    <li class="memberList" v-for="(children,index) in memberList" :key="index" @click="searchTaskList('user',children)">
                        <p class="headInfo">
                            <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+children.user_id"alt="">
                            <span class="headInfoText" style="width: 80px" :title="children.realname">{{children.realname}}</span>
                        </p>
                        <Progress hide-info :percent="children.complete/children.task_num?children.complete/children.task_num*100:0"></Progress>
                        <span class="ratio"><span class="base">{{children.complete?children.complete:0}}</span> / {{children.task_num}}</span>
                    </li>
                </ul>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import {pjTaskChildUpdate, pjTaskChildList, pjTaskChilDelete, pjTaskChidAdd, pjTaskJoined, pjTaskCount, pjTaskProjectInfo, pjTaskTasktypeCount} from '@/axios/modules/project/projectTask';
    import api from "api";
    import {mapState} from "vuex";
    import Cookies from "js-cookie";

    export default {
        props: {
            TabFlags: {
                type: Object
            }
        },
        created() {
        },
        beforeCreate(){
            this.$bus.$off('getTaskCount');
        },
        mounted() {
            //            this.initTaskSchedule();  以前的项目进度接口
            // this.initTaskSchedule();
            this.initProjectName();
            // this.tasktypeTaskCount();
            this.projectPlan();
            this.$bus.on('getTaskCount', (value) => {
                this.getTaskCount(value);
                this.tasktypeTaskCount();
                // this.initTaskSchedule()
            });
        },
        data() {
            return {
                allProject: null,
                taskCountComplete: 0, // 项目已完成的
                taskCountNumber: 0, //  项目总数
                taskCountList: null, // 类型库计数列表
                memberList: "", // 成员列表
                editShow: true,
                projectName: "",
                taskMain: {
                    child: null,
                    name: ""
                },
                ChildMsgData: null, // 所有成员列表
                mainTaskList: null, // 主成员列表
                addInput: false, // 编辑
                subProjectManager: null,
                companyMember: null,
                subProjectName: null,
                projectId: sessionStorage.getItem("projectID"),
                token: localStorage.token,
                needGuideData: null,

                childProjectList: []
            };
        },
        methods: {
            // 导出项目任务
            exportProjectTasks() {
                let url = this.GLOBAL.baseRouter+this.$GLOBALAPI.task_export_project_task;
                let hostName = Cookies.get("hostName");
                let download = hostName + '/' + url + "&token=" + this.token + "&project_id=" + this.projectId;
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.href = download;
                a.click(); //点击触发下载
            },
            // 项目进度初始化接口
            async projectPlan() {
                this.childProjectList = [];
                if (sessionStorage.getItem('needGuideData')) {
                    // console.log(12534,sessionStorage.getItem('needGuideData'));
                    if (sessionStorage.getItem('needGuideData') === 'true'){
                        this.needGuideData = true;
                    }
                }
                let {data} = await pjTaskChildList({id: this.projectId, needGuideData: this.needGuideData ? true : null});
                // let {data} = await api.getMemberTaskSchedule({id: this.projectId,needGuideData:this.needGuideData ? true : null});
                if (data.err_code === 0 && data.data ) {
                    this.childProjectList = data.data;
                }
                // this.$axios.post(this.GLOBAL.baseRouter + "/task/total/member-child-project-total", {project_id: this.projectId,needGuideData:this.needGuideData ? true : null}).then(({data}) => {
                //     if(data.err_code === 0){
                //         let dataArr = data.data;
                //         let _this = this;
                //         if(dataArr.length > 0){
                //             dataArr.forEach(function (creent) {
                //                 if(creent.child_id){
                //                     _this.childProjectList.push(creent)
                //                 }
                //             });
                //             console.log(this.childProjectList)
                //         }
                //     }else {
                //         this.$Message.error(data.err_message);
                //     }
                // });
            },

            /* 项目进度 */
            async initTaskSchedule() {
                if (sessionStorage.getItem('needGuideData')) {
                    // alert(sessionStorage.getItem('needGuideData'));
                    if (sessionStorage.getItem('needGuideData') === 'true'){
                        this.needGuideData = true;
                    }
                }
                //pjTaskChildList

            },

            /* 获取有任务成员进度 */
            async getTaskCount(dataList) {
                let {data} = await pjTaskCount({project_id: this.projectId});
                if (data.err_code === 0 && data.data) {

                    this.memberList = data.data;

                    dataList.map((item, index) => {
                        this.memberList.map((members, idx) => {
                            if (item.status == '4' && members.user_id === item.run_uid) {
                                this.$set(members, 'complete', members.complete?members.complete+1:1);
                            }
                        });
                    });
                }
            },

            /* 获取项目名称 */
            async initProjectName() {
                let project = await pjTaskProjectInfo({id: this.projectId});
                if (project.data.err_code === 0) {
                    this.projectName = project.data.name;
                }
            },

            /* 获取任务类型库计数 */
            async tasktypeTaskCount() {
                if (sessionStorage.getItem('needGuideData')) {
                    // console.log(11,sessionStorage.getItem('needGuideData'))
                    if (sessionStorage.getItem('needGuideData') === 'true'){
                        this.needGuideData = true;
                    }
                }
                let {data} = await pjTaskTasktypeCount({
                    project_id: this.projectId,
                    needGuideData: this.needGuideData ? true : null
                });
                if (data.err_code === 0 && data.data) {
                    this.taskCountList = data.data;
                    this.countNumber(data.data);

                }
            },
            countNumber(array) {
                this.taskCountNumber = 0;
                this.taskCountComplete = 0;
                array.map((item, index) => {
                    this.taskCountComplete += Number(item.complete_cnt);
                    this.taskCountNumber += Number(item.cnt);
                });
            },
            // 编辑按钮并获得负责人
            async editMode() {
                this.editShow = !this.editShow;
                this.projectPlan();
                if (!this.companyMember) {
                    let {data} = await pjTaskJoined({
                        project_id: this.projectId
                    });
                    this.companyMember = data.data;
                }
            },
            //改变任务列表
            changeTaskListData(subType, type, member, item) {
                this.teamActive = "";
                this.aloneActive = "";
                this.itemActive = "";
                if (subType.run_uid && member === "alone") {
                    this.aloneActive = subType.run_uid;
                } else if (subType.run_uid && member === "team") {
                    this.teamActive = subType.run_uid;
                    this.memberItemActive = item.child_id;
                } else if (!subType.run_uid && member === "alone") {
                    this.itemActive = subType.child_id;
                }

                if (Object.keys(subType)[0] === "run_uid") {
                    type = "member";
                }
                if (subType !== "all") {
                    subType.project_child_id = subType.child_id;
                }

                this.$refs.list.initTaskListFromId(subType, type, item);
            },

            /* 查询项目 */
            async searchTaskList(type, taskData) {
                this.$bus.emit('searchTaskList', {type: type, taskData: taskData});
            },
            // 添加项目
            async addButton(type) {
                if (type) {
                    if (!this.subProjectName){
                        this.$Message.error(i18n.t('project.pro_projectNameCannotEmpty'));
                        return;
                    } else if (!this.subProjectManager){
                        this.$Message.error(i18n.t('project.pro_pro_projectLeaderCannotEmpty'));
                        return;
                    }
                    let data = await pjTaskChidAdd({
                        project_id: this.projectId,
                        name: this.subProjectName,
                        leader: this.subProjectManager
                    });
                    this.projectPlan();

                }
                this.subProjectManager = "";
                this.subProjectName = "";
                this.addInput = false;
            },
            // 更改项目名称
            async changeName(itemData, e) {
                let id = itemData.id;
                let name = e.target.value;
                if (itemData.name !== name) {
                    let data = await pjTaskChildUpdate({
                        id: id,
                        name: name,
                        leader: itemData.leader
                    });
                    this.projectPlan();

                }
            },
            // 更改负责人
            async changePrincipal(itemData, leader) {

                if (itemData.leader) {
                    let id = itemData.id;
                    let name = itemData.name;
                    let data = await pjTaskChildUpdate({
                        id: id,
                        name: name,
                        leader: itemData.leader
                    });
                    this.projectPlan();
                }
            },
            // 删除项目
            async delProject(itemData) {
                let id = itemData.id;
                // if (itemData.project_child_id) {
                //     id = itemData.project_child_id;
                // } else if (itemData.run_uid) {
                //     id = itemData.run_uid;
                // }
                let data = await pjTaskChilDelete({id: id});
                this.projectPlan();

                // this._ajax(this.$GLOBALAPI.task_child_delete, {id: id}).then(({data}) => {
                //     if (data.err_code === 0) {
                //         this.$Message.success("删除成功");
                //         this.projectPlan();
                //     }
                // });
            },

            addInputShow() {
                this.addInput = !this.addInput;
            },
            _ajax(url, data) {
                return this.$axios.post(this.GLOBAL.baseRouter + url, data);
            }
        },
        computed: {
            ...mapState({
                clubTaskManagement(value) {
                    return value.app.clubTaskManagement;
                },
            })
        },
        components: {}
    };
</script>

<style lang="less">
    .editProjectMember{
        .ivu-select-single .ivu-select-selection{
            border: 0!important;
        }
        .ivu-input{
            border: 0!important;
        }
    }
    .addBlock{
        .selectSty{
            &.ivu-select-single .ivu-select-selection{
                border: 0!important;
            }
        }
        .ivu-input{
            border: 0!important;
        }
    }
</style>
<style lang="less">
    .projectPlanRight {
        .base-card;
        height: 829px;
        min-width: 390px;
        width: 33% !important;
        z-index: 333;
        overflow: hidden;
        margin-right: 30px;
        padding: 0 !important;
        .orange {
            color: @orange;
        }
        .black_1 {
            color: #808080;
        }
        .base {
            color: @base;
        }
        .projectPlanTabs{
            // height:780px;
        }
        .projectLeftHead {
            display: flex;
            height: 45px;
            padding: 0 20px;
            font-size: 16px;
            border-radius: 3px;
            justify-content: space-between;
            align-items: center;
            color: @black_1;
            background: @base_option;
            .projectName{
                flex:1;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                color:@black_2;
            }
            .exportProjectTasks {
                width: 115px;
                text-align: right;
                /*margin-bottom: 30px;*/
                font-size: 14px;
                color: #3bceb6;
                cursor: pointer;
            }
        }
        .taskManager{
            height:100%;
            overflow-y: auto !important;
        }
        .memberSchedule,
        .taskSchedule {
            // overflow-y: auto !important;
            .memberList {
                display: flex;
                height: 90px;
                padding: 0 10px;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px dashed @gray;
                .headInfo {
                    display: flex;
                    align-items: center;
                }
                .headInfoText,
                img {
                    vertical-align: middle;
                }
                .headInfoText {
                    width: 110px;
                    text-align: center;
                    display: inline-block;
                    color: @black_3;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                img {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                }
                .ratio {
                    width: 120px;
                    padding-right: 10px;
                    margin-left: 10px;
                    text-align: right;
                    font-size: 13px;
                }
                &:hover{
                    background: @base_option;
                }
            }
        }
        .rightRow {
            .ChildMsgDataBox:last-child{
                border-bottom: 1px solid @gray;
                /*color: red;*/
            }
            .projectInfoBox {
                display: flex;
                padding: 25px 15px;
                color: @black_3;
                border: 4px;
                padding: 16px 20px;
                border-top: 1px dashed #d6d6d6;
                &:hover{
                    background: @base_option;
                }
                .projectHead {
                    width: 120px;
                    min-height: 40px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    // /*margin-top: 10px;*/
                }
                .projectTitle {
                    font-size: 16px;
                    color: @black_1;
                    text-align: left;
                    /*float: left;*/
                }
                .leaderText {
                    min-width: 110px;
                    font-size: 13px;
                    text-align: left;
                    color: #8e8e8e;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    /*float: right;*/
                }
                .projectInfo {
                    float: none;
                    flex: 1;
                    .ratio {
                        color: @black_2;
                    }
                    .progressBar {
                        display: flex;
                        margin:20px 10px;
                        // padding: 0px 0px 10px 0px;
                        // border-bottom: 1px dashed #d6d6d6;
                        .ratio {
                            width: 90px;
                            font-size: @fs14;
                            padding: 0px 20px 0px 8px;
                            margin-left: 30px;
                            text-align: right;
                        }
                    }
                    .memberList {
                        margin-bottom: 0px;
                        li {
                            display: flex;
                            padding: 20px 0 20px 8px;
                            border-bottom: 1px dashed #d6d6d6;
                            justify-content: space-between;
                            align-items: center;
                            img {
                                width: 30px;
                                height: 30px;
                                border-radius: 50%;
                                vertical-align: middle;
                            }
                        }
                    }
                }
            }
        }
        .editRightRow {
            background: #fff;
            height: 720px;

            .addBlock {
                /*border-bottom: 1px solid #f2f2f2;*/
                padding: 0 5px;
                background: #fff;
                margin-top: 10px;
            }
            .ivu-input {
                font-size: 13px;
                height: 30px;
                top: 4px;
                // border-left: 1px solid transparent;
                // border-top: 1px solid transparent;
                // border-right: 1px solid transparent;
                background: transparent !important;
                color: #777777;
            }
            .ivu-select-selection {
                color: #777777;
                background: transparent !important;
            }
            .lineEdit {
                border-bottom: 1px solid #f2f2f2;
                padding: 25px 15px;
                background: #fff;
                .editProjectMember {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    img {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                    }
                    .fontSty{
                        margin-left: 5px;
                        &:hover{
                            cursor: pointer;
                            color: #f44336;
                        }
                    }
                }
            }
        }
        .Listall {
            height: 30px;
            padding-left: 5px;
            line-height: 30px;
            background: @base;
            color: #fff;
            cursor: pointer;
            &:hover {
                border: 1px solid @base;
            }
        }
        .titleList {
            display: flex;
            padding: 17px 0 17px 5px;
            background: #fff;
            /*border: 1px solid red;*/
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            border-bottom: 1px solid #fff;
            border-top: 1px solid #fff;
            .showPlan {
                flex: 1;
                margin-top: 8px;
            }
            .headTitle {
                .headImg {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
                .titleText {
                    display: inline-block;
                    width: 40px;
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                }

                span {
                    vertical-align: middle;
                }
                .iconfont:nth-of-type(2) {
                    vertical-align: middle;
                }
            }
            .aloneHead {
                width: 90px;
            }
            .aloneRight {
                margin-top: 27px;
            }
            .showPlanColor {
                margin: 0;
            }
            .ratio {
                width: 60px;
                padding: 8px;
                text-align: center;
            }
            &:hover {
                border-top: 1px solid @base;
                border-bottom: 1px solid @base;
            }
        }
        .projectMemberList {
            display: flex;
            height: 30px;
            margin: 10px 0 10px 30px;
            padding-left: 5px;
            line-height: 30px;
            justify-content: space-between;
            background: #fff;
            cursor: pointer;
            .memberTitle {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .memberRatio {
                width: 40px;
                text-align: center;
                color: #fff;
                background: @base;
            }
            &:hover {
                border: 1px solid @base;
            }
        }
        .editList {
            // display: flex;
            margin-bottom: 10px;
            justify-content: space-between;
            .pName {
                font-size: 12px;
                color: #bdbdbd;
            }
            .PDel {
                float: right;
                color: @red;
            }
            .ivu-input {
                font-size: 14px;
            }
            &:hover {
            }
        }
        .flag {
            position: absolute;
            top: 0;
            left: 20px;
            transform: scale(0.8);
        }
        .rightTitle {
            position: relative;
            height: 40px;
            padding: 0 15px;
            font-weight: lighter;
            font-size: 16px;
            color: @black_3;
            background: #f4fcfa;
            .editHead {
                display: flex;
                height: 40px;
                justify-content: space-between;
                align-items: center;
                color: @black_3;
                .backtrack{
                    font-size: 12px;
                    &:hover{
                        color: @base;
                    }
                }
                .addButton{
                    font-size: 12px;
                    color: @base;
                    &:hover{
                        color: @base_dark;
                    }
                }
            }
            .editBtn {
                position: absolute;
                top: 50%;
                right: 15px;
                padding: 2px 4px;
                font-size: 12px;
                transform: translateY(-50%);
                cursor: pointer;
                color: @white;
                background: @base;
                border-radius: 3px;
                &:hover{
                    background: @base_dark;
                }
            }
        }
        .editShowPlan {
            margin-left: 355px !important;
        }
        .alone {
            display: flex;
            margin-left: 20px;
            background: #fff;
            line-height: normal !important;
        }
        .editList {
            display: flex;
            padding-right: 10px;
            justify-content: space-between;
        }
    }
    .taskMainContainer {
        .projectPlanRight {
            .ivu-tabs .ivu-tabs-content-animated {
                margin-top: 0 !important;
            }
            .ivu-tabs-tab {
                padding: 4px 42px !important;
            }
            .ivu-tabs-ink-bar {
                background: @base_active !important;
            }
            .ivu-tabs-bar {
                margin-bottom: 0;
                border-bottom: 1px dashed @gray;
            }
            .ivu-tabs-nav-prev{
                line-height: 48px;
                left:6px;
            }
            .ivu-tabs-nav-next{
                line-height: 48px;
                right:6px;
            }
        }
        .editRightRow {
            /*<!--.ivu-input {-->*/
                /*<!--border: 1px solid transparent;-->*/
            /*<!--}-->*/
            /*<!--.ivu-select-single,-->*/
            /*<!--.ivu-select-selection {-->*/
                /*<!--border: 1px solid transparent;-->*/
                /*<!--outline: none;-->*/
                /*<!--&:active,-->*/
                /*<!--&:hover {-->*/
                    /*<!--border: 1px solid @base;-->*/
                    /*<!--outline: none;-->*/
                /*<!--}-->*/
            /*<!--}-->*/
        }
    }
</style>
