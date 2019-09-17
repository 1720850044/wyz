<template>
    <div class="pigeonhole">
        <div class="menauBar">
            <ul class="projectClassfly">
                <li v-if="TwoMenuList && TwoMenuList.length > 0" v-for="(item,index) in TwoMenuList" :class="{'currenSty':index == typeIndex}"
                    @click="selectTaskType(index,item.id)">{{ item.tasktype_name }}<span>({{item.cnt}})</span></li>
            </ul>
            <ul class="RscreenBar">
                <li>
                    <a class="switch-show-icon" @click="showOrHidden(isShow)" v-if="fileData.length > 0 && showType === 'poster'">
                        <Icon type="eye" v-if="!isShow" :title="$t('project.pro_showDetail')"></Icon>
                        <Icon type="eye-disabled" :title="$t('project.pro_closeDetail')" v-else></Icon>
                    </a>
                    <a class="switch-display-icon" @click="switchListDataDisplay(showType)" v-if="fileData.length > 0">
                        <i class="list-icon" v-if="showType==='poster'" :title="$t('project.pro_switchList')"></i>
                        <i class="poster-icon" v-else :title="$t('project.pro_switchThumbnail')"></i>
                    </a>
                </li>
                <li class="searchBar">
                    <div>
                        <Input v-model="searchInput" icon="ios-search" style="width:200px;" :placeholder="$t('lang.lang_task') + '/' + $t('project.pro_leader')" @keyup.enter.native="fetchData"></Input>
                    </div>
                </li>
                <li>
                    <button v-if="(fileData && fileData.length > 0) && (dowloadObj.countNum == 0)" class="downloadBtn"  @click="downloadFile('project',null)">
                        <i class="iconfonts icon-xiazai"></i>
                        <span>{{$t('project.pro_downloadAll')}}</span>
                    </button>
                    <button v-else-if="(fileData && fileData.length > 0) && (dowloadObj.countNum > 0)" class="downloadBtn" @click="downloadFile('task',null)">
                        <i class="iconfonts icon-xiazai"></i>
                        <span> {{$t('project.pro_batchDownload')}} {{$t('project.pro_items')}}</span>
                    </button>
                </li>
            </ul>

        </div>
        <div class="tab-main" >
            <div v-if="loadingFlag" style="height: 620px">
                <loading></loading>
            </div>
            <div class="" v-if="!loadingFlag && ((fileData && fileData.length > 0) && showType==='poster')">
                <div class="Rowlist">
                    <ul>
                        <li v-for="(item,index) in fileData" :key="index" @mouseover="mouseoverFun(item)" @mouseout="mouseoutFun(item)">
                            <div class="tools" :style="{opacity:item.opacityFlag}">
                                <i class="iconfonts icon-tongyong-quan" :class="{'selectSty':item.isselect}" @click="changeSelect(item)"></i>
                                <i class="iconfonts icon-xiazai" @click="downloadFile('task',item.id)"></i>
                            </div>
                            <div class="contenner" @click="fetchFileData(item)">
                                <img v-if="item.stage_file.type == 'image'" :src="item.stage_file.thumb+'?x-oss-process=style/420'"/>
                                <img v-else-if="item.stage_file.type == 'video'" :src="item.stage_file.thumb+'?x-oss-process=video/snapshot,t_1000,f_jpg,w_420,h_280,m_fast'"/>
                                <img v-else-if="item.stage_file.type == '3d' || item.stage_file.type == '3D'" :src="item.stage_file.thumb+'?x-oss-process=style/420'"/>
                            </div>
                            <div class="fileInfo" v-show="isShow">
                                <div class="RcardBlock">
                                    <div>
                                        <span class="taskType">{{item.tasktype_name}}</span>
                                        <span>{{item.name}}</span>
                                    </div>
                                    <div class="taskUser">
                                        <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id"/>
                                        <span>{{item.remark_name}}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 列展示 -->
            <div class="row-lists" v-else-if="!loadingFlag && ((fileData && fileData.length > 0) &&  showType==='list')">
                <div class="table-header">
                    <!--<span>文件名称</span>-->
                    <span>{{$t('workbench.work_taskName')}}</span>
                    <span>{{$t('lang.lang_type')}}</span>
                    <span>{{$t('lang.step')}}</span>
                    <span>{{$t('project.pro_lastTimeFeedback')}}</span>
                    <span>{{$t('project.pro_update')}}</span>
                </div>
                <ul class="row-ul-container">
                    <li v-for="(item,index) in fileData" :key="index" @click="fetchFileData(item)">
                        <!--<span>{{item.task_name}}</span>-->
                        <span>{{item.name}}</span>
                        <span><label>{{item.tasktype_name || $t('project.pro_unknownType')}}</label></span>
                        <span>{{item.stage[item.stage.length-1].stage_name}}</span>
                        <span :title="item.feedback || $t('project.pro_isNoFeedback')">{{item.feedback || $t('project.pro_isNoFeedback')}}</span>
                        <span>{{item.create_date}}</span>
                    </li>
                </ul>
            </div>
            <div v-if="!loadingFlag && fileData.length == 0" style="position: relative;min-height: 620px">
                <nothink type="project" :text="$t('project.pro_notAvailableData')"></nothink>
            </div>
        </div>
    </div>
</template>

<script>
    import {pjTasktypeCount, pjresourcePage } from '@/axios/modules/project/projectResource';
    export default {
        name: 'pigeonhole',
        data() {
            return {
                fileData: [],
                selTaskType: '',
                taskType: '',
                status: '4',
                searchInput: '',
                // isTabModal: false,
                TwoMenuList: [],
                typeIndex: 0,
                clickItem: [],
                showType: 'poster',
                isShow: true,

                needGuideData: null,
                dowloadObj: {
                    dowloadFileArr: [],
                    countNum: 0
                },
                loadingFlag: true
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                this.fetchData();
                this.getTwoMenuList();
            },
            //获取资源列表
            async fetchData() {
                let dataObj = {
                    status: this.status,
                    tasktype: this.selTaskType,
                    project_id: sessionStorage.projectID,
                    project_child_id: '',
                    search: this.searchInput
                };
                let {data} = await pjresourcePage(dataObj);
                if (data.err_code == 0){
                    this.loadingFlag = false;
                    let dataArr = data.data;
                    dataArr.forEach((creent) => {
                        creent.isselect = false;
                        creent.opacityFlag = 0;
                    });
                    this.fileData = dataArr;

                    this.clickItem = [];
                    for (var item in data.data) {
                        this.clickItem.push({id: data.data[item].id, status: false, type: 'task'});
                    }
                } else {
                    this.loadingFlag = false;
                }
            },

            /*获取归档二级分类*/
            async getTwoMenuList() {
                if (sessionStorage.getItem('needGuideData')) {
                    if (sessionStorage.getItem('needGuideData') === 'true'){
                        this.needGuideData = true;
                    }
                }
                let dataObj = {
                    project_id: sessionStorage.projectID,
                    status: 4,
                    needGuideData: this.needGuideData ? true : null
                };
                let {data} = await pjTasktypeCount(dataObj);
                let dataArr = data;
                let allCount = null;
                if (dataArr.length > 0){
                    dataArr.forEach((creent)=>{
                        allCount += parseInt(creent.cnt);
                    });
                    let all = [{
                        cnt: allCount,
                        id: null,
                        tasktype_name: i18n.t('lang.lang_all'),
                    }];
                    this.TwoMenuList = all.concat(dataArr);
                } else {
                    this.TwoMenuList = [];
                }
            },
            // 切换文件显示类型
            switchListDataDisplay (showType) {
                this.showType = showType === 'poster' ? 'list' : 'poster';
            },
            //显示隐藏资源信息
            showOrHidden (isShow) {
                this.isShow = !isShow;
            },

            /*根据选择的二级标签查询数据*/
            selectTaskType(index, type) {
                this.typeIndex = index;
                this.selTaskType = type;
                this.fetchData();
            },
            //跳转详情任务页面
            fetchFileData(item) {
                this.$router.push({ path: "/project/details", query: { project: item.project, id: item.id, navTitle: i18n.t('workbench.work_resourceManagement')}});
            },
            //移进
            mouseoverFun(item){
                item.opacityFlag = 1;
            },
            //移出
            mouseoutFun(item){
                if (item.isselect){
                    item.opacityFlag = 1;
                } else {
                    item.opacityFlag = 0;
                }
            },
            //选择资源
            changeSelect(item){
                if (item.isselect){
                    item.isselect = false;
                    let Arr = this.dowloadObj.dowloadFileArr;
                    Arr.forEach((creent, index) =>{
                        if (creent === item.id){
                            Arr.splice(index, 1);
                        }
                    });
                } else {
                    item.isselect = true;
                    this.dowloadObj.dowloadFileArr.push(item.id);
                }
                this.dowloadObj.countNum = this.dowloadObj.dowloadFileArr.length;
                // this.$forceUpdate()
            },
            //单个 批量 下载资源
            downloadFile(type, id) {
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.project_task_downloadindex).then(({data}) =>{
                    if (data.err_code == 0){
                        let acctoken = data.data.acc_token;
                        let parms = {
                            type: type,
                            id: null,
                            acc_token: acctoken
                        };
                        if (type == 'project' && id == null){
                            this.resetData();
                            parms.id = sessionStorage.projectID;
                        } else if (type == 'task' && id == null){
                            let arr = this.dowloadObj.dowloadFileArr;
                            let str = arr.join(',');
                            parms.id = str;
                        } else {
                            this.resetData();
                            parms.id = id;
                        }
                        this.dowloadFun(parms);
                    } else {
                        this.$Message.error(data.err_message);
                    }
                });
            },
            dowloadFun(parms){
                this.$emit('showModal');
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_pack, parms).then(({data}) =>{
                    if (data.err_code == 0){
                        this.$Message.info(i18n.t('project.pro_arePackaged'));
                    } else {
                        this.$Message.error(data.err_message);
                    }
                });
            },
            //清空下载数据和选中数据
            resetData(){
                let Arr = this.fileData;
                Arr.forEach((creent) =>{
                    creent.isselect = false;
                    creent.opacityFlag = 0;
                });
                this.dowloadObj = {
                    dowloadFileArr: [],
                    countNum: 0
                };
            }
        }
    };
</script>

<style lang='less' scoped>
    .pigeonhole{
        .tab-main{
            min-height: 620px;
            .Rowlist{
                ul{
                    overflow: hidden;
                    li{
                        float: left;
                        width: 20%;
                        height: 280px;
                        position: relative;
                        border: 1px solid #fff;
                        box-sizing: border-box;
                        .tools{
                            position: absolute;
                            top: 0;
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                            padding: 15px;
                            z-index: 2;
                            i{
                                font-size: 18px;
                                color: #fbfbfb;
                                &:hover{
                                    cursor: pointer;
                                    color: @base;
                                }
                            }
                            .selectSty{
                                color: @base!important;
                            }
                        }
                        .contenner{
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            width: 100%;
                            background: rgba(0,0,0,.2);
                            z-index: 1;
                            overflow: hidden;
                            cursor: pointer;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            img{
                                /*max-width: 100%;*/
                                max-height: 100%;
                            }
                        }
                        .fileInfo{
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            background: rgba(0,0,0,.3);
                            z-index: 2;
                            .RcardBlock {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                width: 100%;
                                padding: 10px;
                                color: #fff;
                                font-size: 13px;
                                .taskType{
                                    background: @base;
                                    padding: 2px 5px;
                                    border-radius: 3px;
                                    margin-right: 10px;
                                    font-size: 12px;
                                }
                                .taskUser{
                                    display: flex;
                                    align-items: center;
                                    img{
                                        width: 30px;
                                        height: 30px;
                                        border-radius: 100%;
                                        margin-right: 10px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
