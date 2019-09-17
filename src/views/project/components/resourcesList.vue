<template>
    <div class="menauBarContainer">
        <div class="menauBar">
            <ul class="projectClassfly">
                <li v-if="TwoMenuList && TwoMenuList.length > 0" v-for="(item,index) in TwoMenuList"
                    :class="{'currenSty':index == selectIndex}"
                    @click="selectTaskType(index,item.id)">{{ item.tasktype_name || null }}<span>( {{item.cnt}} )</span>
                </li>
            </ul>
            <ul class="RscreenBar">
                <li>
                    <a class="switch-show-icon" @click="showOrHidden(isShow)"
                       v-if="listData.length > 0 && showType === 'poster'">
                        <Icon type="eye" v-if="!isShow" :title="$t('project.pro_showDetail')"></Icon>
                        <Icon type="eye-disabled" :title="$t('project.pro_closeDetail')" v-else></Icon>
                    </a>
                    <a class="switch-display-icon" @click="switchListDataDisplay(showType)" v-if="listData.length > 0">
                        <i class="list-icon" v-if="showType==='poster'" :title="$t('project.pro_switchList')"></i>
                        <i class="poster-icon" v-else :title="$t('project.pro_switchThumbnail')"></i>
                    </a>
                </li>
                <li>
                    <my-sort :sortList="ndsSortList" @choiced="filterFTime" v-if="resourcesStatus == 1"></my-sort>
                    <my-sort :sortList="nsfkSortList" @choiced="filterSTime" v-if="resourcesStatus == 2"></my-sort>
                    <my-sort :sortList="khdsSortList" @choiced="filterTTime" v-if="resourcesStatus == 3"></my-sort>
                    <my-sort :sortList="khfkSortList" @choiced="filterFoTime" v-if="resourcesStatus == 4"></my-sort>
                </li>
                <li class="searchBar">
                    <Input v-model="searchInput" icon="ios-search" style="width:200px;" :placeholder="$t('project.pro_task')+' /'+ $t('project.pro_leader')"
                           @keyup.enter.native="fetchData"></Input>

                    <button class="downloadBtn" v-if="(listData && listData.length > 0) && (dowloadObj.countNum == 0)"
                            @click="dowloadFile('project',null)">
                        <i class="iconfonts icon-xiazai"></i>
                        <span>{{$t('project.pro_downloadAll')}}</span>
                    </button>
                    <button class="downloadBtn"
                            v-else-if="(listData && listData.length > 0) && (dowloadObj.countNum > 0)"
                            @click="dowloadFile('task',null)">
                        <i class="iconfonts icon-xiazai"></i>
                        <span> {{$t('project.pro_batchDownload')}}{{dowloadObj.countNum}} {{$t('project.pro_items')}}</span>
                    </button>
                </li>
            </ul>
        </div>

        <div class="tab-main">
            <div style="height: 620px" v-if="loadingFlag">
                <loading></loading>
            </div>
            <div class="Rowlist" v-if="!loadingFlag && ((listData && listData.length > 0) && showType==='poster')">
                <ul>
                    <li v-for="(item,index) in listData" :key="index" @mouseover="mouseoverFun(item)"
                        @mouseout="mouseoutFun(item)">
                        <div class="tools" :style="{opacity:item.opacityFlag}">
                            <i class="iconfonts icon-tongyong-quan" :class="{'selectSty':item.isselect}"
                               @click="changeSelect(item)"></i>
                            <i class="iconfonts icon-xiazai" @click="dowloadFile('task',item.stage_id)"></i>
                        </div>
                        <div class="contenner" @click="fetchFileData(item)">
                            <img v-if="item.stage_file.type == 'image'"
                                 :src="item.stage_file.thumb+'?x-oss-process=style/420'"/>
                            <img v-else-if="item.stage_file.type == 'video'"
                                 :src="item.stage_file.thumb+'?x-oss-process=video/snapshot,t_1000,f_jpg,w_420,h_280,m_fast'"/>
                            <img v-else-if="item.stage_file.type == '3d' || item.stage_file.type == '3D'"
                                 :src="item.stage_file.thumb+'?x-oss-process=style/420'"/>
                        </div>
                        <div class="fileInfo" v-show="isShow">
                            <p class="fileCategory">
                                <span>{{item.tasktype_name}}&emsp;{{item.task_name}}</span>
                                <!--<span class="fileTime">{{item.create_date}} </span>-->
                            </p>
                            <div class="fileDetailInfo">
                                <dl>
                                    <dd class="headImg">
                                        <img
                                            :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id"/>
                                        <span>{{item.run_uname}}</span>
                                    </dd>
                                    <dd>
                                        <span>{{resourcesStatus==1||resourcesStatus==2 ? $t('project.pro_pendingDays') : $t('project.pro_feedbackTime')}}</span>
                                    </dd>
                                    <dd>
                                        <span>{{$t('workbench.work_CompletedPhase')}}</span>
                                    </dd>
                                    <dd>
                                        <span>{{$t('project.pro_timeRemaining')}}</span>
                                    </dd>
                                </dl>
                                <p>
                                    <span></span>
                                    <span v-if="resourcesStatus==1||resourcesStatus==2">
                                        {{item.wait_day == 0 ? $t('workbench.work_toDayTag') : item.wait_day +'/'}}{{$t('workbench.work_teamWorkDateTag')}}
                                    </span>
                                    <span v-else>
                                        {{item.wait_day == 0 ? $t('workbench.work_todayTag') : item.wait_day +'/' + $t('project.pro_beforeDay')}}
                                    </span>
                                    <span v-if="item.tasktype_stage_now">{{item.tasktype_stage_now.stage_name}}</span>
                                    <span v-else>{{$t('project.pro_noPassStage')}}</span>
                                    <span v-if="item.expect_end_day == 0">{{$t('workbench.work_todayTag')}}</span>
                                    <span>{{item.expect_end_day > 0 ? item.expect_end_day+ '/'+$t('workbench.work_teamWorkDateTag') : $t('project.pro_haveExpired')}}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 列展示 -->
            <div class="row-lists" v-else-if="!loadingFlag && ((listData && listData.length > 0) && showType==='list')">
                <div class="table-header">
                    <!--<span>文件名称</span>-->
                    <span>{{$t('workbench.work_taskName')}}</span>
                    <span>{{$t('lang.lang_type')}}</span>
                    <span>{{$t('lang.step')}}</span>
                    <span>{{$t('project.pro_lastTimeFeedback')}}</span>
                    <span>{{$t('project.pro_update')}}</span>
                </div>
                <ul class="row-ul-container">
                    <li v-for="(item,index) in listData" :key="index" @click="fetchFileData(item)">
                        <!--<span>{{item.task_name}}</span>-->
                        <span>{{item.task_name}}</span>
                        <span><label>{{item.tasktype_name || $t('project.pro_unknownType')}}</label></span>
                        <span v-if="item.tasktype_stage_now">{{item.tasktype_stage_now.stage_name}}</span>
                        <span v-else>{{$t('project.pro_taskStepInexistence')}}</span>
                        <span :title="item.feedback || $t('project.pro_isNoFeedback')">{{item.feedback || $t('project.pro_isNoFeedback')}}</span>
                        <span>{{item.create_date}}</span>
                    </li>
                </ul>
            </div>

            <div v-if="!loadingFlag && listData.length == 0" style="position: relative;min-height: 620px">
                <nothink type="project" :text="$t('tip.tip_noData')"></nothink>
            </div>

            <span class="more" v-if="listData.length > 0" @click="changePageIndex()">{{moreText}}</span>
        </div>
    </div>
</template>

<script>
    import {
        pjResourceIndex, pjStagePage, pjResourceCount, resourceProjectInfo
        , pjresourcePage
    } from '@/axios/modules/project/projectResource';
    import mySort from '../../main-components/sort';
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: 'resourcesList',
        components: {
            mySort
        },
        props: {
            resourcesStatus: {
                type: Number
            }
        },
        watch: {
            resourcesStatus() {
                this.init();
            }
        },
        data() {
            return {
                page: 1,
                date: (Date.parse(new Date())) / 1000,
                selTaskType: '',
                searchInput: '',
                listData: [],
                moreText: i18n.t('project.pro_loadMode'),
                TwoMenuList: [],
                selectIndex: 0,
                showType: 'poster',
                isShow: true,
                orderBy: 'asc',
                dowloadObj: {
                    dowloadFileArr: [],
                    countNum: 0,
                    type: null
                },
                dowloadType: null,
                loadingFlag: true
            };
        },
        mounted() {
            this.init();
        },
        computed: {
            ...mapGetters({
                ndsSortList: 'getNdsSortList',
                nsfkSortList: 'getNsfkSortList',
                khdsSortList: 'getKhdsSortList',
                khfkSortList: 'getKhfkSortList'
            }),
        },
        methods: {
            init() {
                switch (this.resourcesStatus) {
                    case 1:
                        this.filterFTime(0);
                        this.dowloadType = 'inside_audit';
                        break;
                    case 2:
                        this.filterSTime(0);
                        this.dowloadType = 'client_audit';
                        break;
                    case 3:
                        this.filterTTime(0);
                        this.dowloadType = 'inside_nopass';
                        break;
                    case 4:
                        this.filterFoTime(0);
                        this.dowloadType = 'client_nopass';
                        break;
                }
                this.getTaskTwoMenuList(this.resourcesStatus);
            },
            //文件筛选条件
            filterFTime(val) {
                this.page = 1;
                if (val == 0) {
                    this.sortStatus = 'stage_create_time';
                } else if (val == 1) {
                    this.sortStatus = 'stage_create_time';
                    this.orderBy = 'asc';
                } else if (val == 2) {
                    this.sortStatus = 'expect_end_time';
                    this.orderBy = 'asc';
                }
                this.fetchData();
            },
            filterSTime(val) {
                this.page = 1;
                if (val == 0) {
                    this.sortStatus = 'inside_audit_time';
                } else if (val == 1) {
                    this.sortStatus = 'expect_end_time';
                }
                this.fetchData();
            },
            filterTTime(val) {
                this.page = 1;
                if (val == 0) {
                    this.sortStatus = 'inside_audit_time';
                } else if (val == 1) {
                    this.sortStatus = 'inside_audit_time';
                } else if (val == 2) {
                    this.sortStatus = 'expect_end_time';
                }
                this.fetchData();
            },
            filterFoTime(val) {
                this.page = 1;
                if (val == 0) {
                    this.sortStatus = 'client_audit_time';
                } else if (val == 1) {
                    this.sortStatus = 'client_audit_time';
                } else if (val == 2) {
                    this.sortStatus = 'expect_end_time';
                }
                this.fetchData();
            },
            //获取数据列表
            async fetchData() {
                this.loadingFlag = true;
                this.listData = [];
                this.dowloadObj = {
                    dowloadFileArr: [],
                    countNum: 0
                };
                this.$Loading.start();
                let dataObj = {
                    status: this.resourcesStatus,
                    search: this.searchInput,
                    order: this.sortStatus,
                    tasktype_id: this.selTaskType,
                    page: this.page,
                    order_by: this.orderBy,
                    project_id: sessionStorage.projectID
                };
                let {data} = await pjStagePage(dataObj);

                if (data.err_code == 0) {
                    this.loadingFlag = false;
                    if (this.page == 1) {
                        let dataArr = data.data;
                        dataArr.forEach(function (creent) {
                            creent.isselect = false;
                            creent.opacityFlag = 0;
                        });
                        this.listData = dataArr;
                    } else {
                        this.listData.push.apply(this.listData, data.data);
                    }
                    this.searchInput = '';
                    if (parseInt(this.page) == data.page.count_page && parseInt(this.page) != 1) {
                        this.moreText = i18n.t('project.pro_noMore');
                    } else if (parseInt(this.page) == 1 && data.data.length > 0) {
                        this.moreText = '';
                    } else {
                        this.moreText = i18n.t('project.pro_noContent');
                    }
                    this.$Loading.finish();
                } else {
                    this.loadingFlag = false;
                    this.$Loading.error();
                }
            },
            //跳转任务详情
            fetchFileData(item) {
                this.$router.push({
                    path: "/project/details",
                    query: {project: item.project, id: item.task_id, stage: item.stage_id, navTitle: i18n.t('workbench.work_resourceManagement')}
                });
            },
            //获取各阶段二级菜单
            getTaskTwoMenuList(status) {
                let data = {
                    project_id: sessionStorage.projectID,
                    status: status
                };
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_stage_tasktype_count, data).then(res => res.data).then(res => {
                    if (res.err_code == 0) {
                        let dataArr = res.data;
                        let allCount = null;
                        if (dataArr.length > 0) {
                            dataArr.forEach((creent) => {
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
                    } else {
                        this.$Message.error(res.err_message);
                    }
                });
            },
            //根据选择的二级菜单获取对应的数据
            selectTaskType(index, type) {
                this.selectIndex = index;
                this.selTaskType = type;
                this.fetchData();
            },
            //切换文件显示类型
            switchListDataDisplay(showType) {
                this.showType = showType === 'poster' ? 'list' : 'poster';
            },
            //显示隐藏资源信息
            showOrHidden(isShow) {
                this.isShow = !isShow;
            },
            //加载下一页
            changePageIndex() {
                this.page += 1;
                this.fetchData();
            },
            //移进
            mouseoverFun(item) {
                item.opacityFlag = 1;
            },
            //移出
            mouseoutFun(item) {
                if (item.isselect) {
                    item.opacityFlag = 1;
                } else {
                    item.opacityFlag = 0;
                }
            },
            //选择方法
            changeSelect(item) {
                if (item.isselect) {
                    item.isselect = false;
                    let Arr = this.dowloadObj.dowloadFileArr;
                    Arr.forEach((creent, index) => {
                        if (creent === item.stage_id) {
                            Arr.splice(index, 1);
                        }
                    });
                } else {
                    item.isselect = true;
                    this.dowloadObj.dowloadFileArr.push(item.stage_id);
                }
                this.dowloadObj.countNum = this.dowloadObj.dowloadFileArr.length;
                // console.log(this.dowloadObj);
                // this.$forceUpdate()
            },
            //全部下载 单个下载 和 批量下载 资源
            dowloadFile(type, id) {
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.project_task_downloadindex).then(({data}) => {
                    if (data.err_code == 0) {
                        let acctoken = data.data.acc_token;
                        let parms = {
                            type: this.dowloadType,
                            project_id: sessionStorage.projectID,
                            id: null,
                            acc_token: acctoken
                        };
                        if (type == 'project' && id == null) {
                            //全部下载
                            this.resetData();
                            this.dowloadFun(parms);
                        } else if (type == 'task' && id == null) {
                            //批量下载
                            let arr = this.dowloadObj.dowloadFileArr;
                            let str = arr.join(',');
                            parms.id = str;
                            this.dowloadFun(parms);
                        } else {
                            //单个下载
                            this.resetData();
                            parms.id = id;
                            this.dowloadFun(parms);
                        }

                    } else {
                        this.$Message.error(data.err_message);
                    }
                });
            },
            //下载
            dowloadFun(parms) {
                this.$emit('showModal');
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.project_stage_pack, parms).then(({data}) => {
                    if (data.err_code == 0) {
                        this.$Message.info(i18n.t('project.pro_arePackaged'));
                    } else {
                        this.$Message.error(data.err_message);
                    }
                });
            },
            //清空下载数据和选中数据
            resetData() {
                let Arr = this.listData;
                Arr.forEach((creent) => {
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

<style lang="less" scoped>
    .menauBarContainer {
        .tab-main {
            min-height: 620px;
            min-width: 1400px;
            .Rowlist {
                ul {
                    overflow: hidden;
                    li {
                        float: left;
                        width: 20%;
                        height: 280px;
                        position: relative;
                        border: 1px solid #fff;
                        box-sizing: border-box;
                        .tools {
                            position: absolute;
                            top: 0;
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                            padding: 15px;
                            z-index: 2;
                            i {
                                font-size: 18px;
                                color: #fbfbfb;
                                &:hover {
                                    cursor: pointer;
                                    color: @base;
                                }
                                &.selectSty {
                                    color: @base_bor !important;
                                }
                            }
                        }
                        .contenner {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            width: 100%;
                            background: rgba(0, 0, 0, .2);
                            z-index: 1;
                            overflow: hidden;
                            cursor: pointer;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            img {
                                /*max-width: 100%;*/
                                max-height: 100%;
                            }
                        }
                        .fileInfo {
                            position: absolute;
                            bottom: 0;
                            padding: 0 15px;
                            width: 100%;
                            background: rgba(0, 0, 0, .3);
                            z-index: 2;
                            .fileCategory {
                                color: @white;
                                padding: 8px 0;
                                .fileTime {
                                    float: right;
                                }
                            }
                            .fileDetailInfo {
                                position: relative;
                                padding-bottom: 15px;
                                dl {
                                    display: flex;
                                    align-items: center;
                                    width: 100%;
                                    dd {
                                        flex: 1;
                                        text-align: center;
                                        display: flex;
                                        justify-content: center;
                                    }
                                    .headImg {
                                        display: flex;
                                        align-items: center;
                                        justify-content: flex-start;
                                        color: @white;
                                        flex: 2;
                                        img {
                                            width: 30px;
                                            height: 30px;
                                            border-radius: 100%;
                                            margin-right: 10px;
                                        }
                                    }
                                    span {
                                        color: @white;
                                    }
                                }
                                p {
                                    position: absolute;
                                    top: 22px;
                                    display: flex;
                                    align-items: center;
                                    width: 100%;
                                    span {
                                        flex: 1;
                                        text-align: center;
                                        color: @yellow;
                                        &:first-child {
                                            flex: 2;
                                        }
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
