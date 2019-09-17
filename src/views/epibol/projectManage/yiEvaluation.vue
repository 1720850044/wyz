<template>
    <div class="scoreContent">
        <div class="filterBar">
            <Select v-model="creentStatus" style="width:100px;margin-right: 10px" @on-change="selectFun">
                <Option v-for="(item,index) in selectionData" :value="item.status" :key="index">{{ item.value }}</Option>
            </Select>
            <Input v-model="searchText" style="width:200px" icon="ios-search" :placeholder="inputProjectName"  @keyup.enter.native="searchfun" class="search-input"></Input>
        </div>
        <div class="contenerList">
            <div class="tableHead">
                <span>{{$t('workbench.work_projectName')}}</span>
                <span>{{$t('companyProject.com_relatedContracts')}}</span>
                <span>{{$t('memberAauthority.power_testTask')}}</span>
                <span>{{$t('resources.res_projectAmount')}}</span>
                <span>{{$t('resources.res_numberTasks')}}</span>
                <span>{{$t('resources.res_projectCycle')}}</span>
                <span>{{$t('resources.res_evaluationState')}}</span>
            </div>
            <ul class="listSty" v-if="!showLoading && listArr && listArr.length > 0">
                <li v-for="(item,index) in listArr" :key="index">
                    <span><i class="evaluate" @click="hrefPage('project',item.project_id)">{{item.project_name}}</i></span>
                    <span><i class="evaluate" @click="hrefPage('contract',item.contract_id)">{{item.contract_name}}</i></span>
                    <span><i class="evaluate" @click="hrefPage('testTask',item.task_id)">{{item.task_name || '--'}}</i></span>
                    <span>{{item.contract_price}}</span>
                    <span>{{item.task_count}}</span>
                    <span>{{item.time}}</span>
                    <span><i class="evaluate" @click="showModal(item)">{{$t('resources.res_viewEvaluation')}}</i></span>
                </li>
            </ul>
            <template v-if="showLoading">
                <div class="loading" style="height: 700px;">
                    <loading></loading>
                </div>
            </template>
            <div v-if="!showLoading && (!listArr || listArr.length <= 0)" style="position: relative;min-height: 95%">
                <nothink type="project" :text="noData"></nothink>
            </div>
        </div>
        <Page v-if="page.total > page.page_size"
              class-name="pageSty"
              :current=page.creentPage
              :total="page.total"
              :show-total=false
              :page-size="page.page_size"
              @on-change="onChangePage"
        >
        </Page>
        <!--评价弹框-->
        <Modal v-model="modelFlag" :footer-hide="footerFlag" :title="projectScore" width="900">
            <div class="modalContener">
                <div class="top">
                    <div class="left">
                        <dl>
                            <dt>{{$t('resources.res_projectBasic')}}</dt>
                            <dd>{{$t('workbench.work_projectName')}}：&nbsp;&nbsp;&nbsp;{{projectInfos.project_name || '--'}}</dd>
                            <dd>{{$t('companyProject.com_relatedContracts')}}：&nbsp;&nbsp;&nbsp;{{projectInfos.contract_name || '--'}}</dd>
                            <dd>{{$t('memberAauthority.power_testTask')}}：&nbsp;&nbsp;&nbsp;{{projectInfos.test_name || '---'}}</dd>
                            <dd>{{$t('resources.res_projectAmount')}}：&nbsp;&nbsp;&nbsp;{{projectInfos.contract_price || '--'}}</dd>
                            <dd>{{$t('resources.res_projectCycle')}}：&nbsp;&nbsp;&nbsp;{{projectInfos.time || '--'}}</dd>
                            <dd>{{$t('resources.res_numberTasks')}}：&nbsp;&nbsp;&nbsp;{{projectInfos.task_count || '--'}}</dd>
                        </dl>
                    </div>
                    <div class="right">
                        <ul v-if="bannerArr && bannerArr.length > 0" :style="{width:bannerArr.length * 520 + 'px'}" id="bannerUl" ref="bannerUl">
                            <li v-for="(item,index) in bannerArr" :key="index">
                                <img :src="bannerObj.index -1 == index ? item : null" />
                            </li>
                        </ul>
                        <div v-if="bannerArr && bannerArr.length > 0" class="pageTool">
                            <em class="iconfonts icon-fangxiangshang leftsty" @click="prev"></em> <span>{{bannerObj.index}} / {{bannerArr.length}}</span> <em class="iconfonts icon-fangxiangshang rightsty" @click="next"></em>
                        </div>

                        <div v-else style="position: relative;min-height: 334px">
                            <nothink type="project" :text="noDocuments"></nothink>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="title">
                        <span>{{$t('companyProject.com_projectScore')}}</span>
                    </div>
                    <div class="star">
                        <div class="left">
                            <ul>
                                <li>
                                    <span>{{$t('companySetUp.setUp_productionTime')}}</span>
                                    <Rate style="font-size: 15px" v-model="projectInfos.make_score" :disabled="true" />
                                    <span>{{projectInfos.make_score | convert}}</span>
                                </li>
                                <li>
                                    <span>{{$t('resources.res_linkUp')}}</span>
                                    <Rate style="font-size: 15px" v-model="projectInfos.communication_score" :disabled="true" />
                                    <span>{{projectInfos.communication_score | convert}}</span>
                                </li>
                                <li>
                                    <span>{{$t('resources.res_manuscriptQuality')}}</span>
                                    <Rate style="font-size: 15px" v-model="projectInfos.quality_score" :disabled="true" />
                                    <span>{{projectInfos.quality_score | convert}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="right">
                            <Input style="font-size: 12px" v-model="projectInfos.content" :disabled="true" :autosize="{minRows: 5,maxRows: 5}" :maxlength="500" type="textarea" placeholder="输入您的评价内容" />
                            <label class="enter-desc-counts"><i :class="{'errorSty':enterNum > 500}">{{enterNum}}</i><span> / </span><i>500</i></label>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {scoreApi} from 'api';
    export default {
        name: "yi-evaluation",
        data(){
            return {
                showLoading: true,
                inputProjectName: i18n.t('resources.res_inputProjectName'),
                noDocuments: i18n.t('resources.res_noDocuments'),
                projectScore: i18n.t('companyProject.com_projectScore'),
                noData: i18n.t('tip.tip_noData'),
                selectionData: [
                    {value: i18n.t('lang.lang_all'), status: 0},
                    {value: i18n.t('resources.res_evaluated'), status: 2},
                    {value: i18n.t('resources.res_alreadyEvaluated'), status: 1}
                ],
                creentStatus: 0,
                searchText: null,
                fileter: {
                    status: 0,
                    name: null
                },
                listArr: [],
                page: {
                    total: 0,
                    creentPage: 1,
                    page_size: 20
                },
                modelFlag: false,
                footerFlag: true,
                bannerArr: [
                    // 'https://yhc-1.oss-cn-shanghai.aliyuncs.com/avatar/835',
                    // 'https://yhc-1.oss-cn-shanghai.aliyuncs.com/avatar/835',
                    // 'https://yhc-1.oss-cn-shanghai.aliyuncs.com/avatar/835',
                    // 'https://yhc-1.oss-cn-shanghai.aliyuncs.com/avatar/835',
                    // 'https://yhc-1.oss-cn-shanghai.aliyuncs.com/avatar/835'
                ],
                bannerObj: {
                    left: 0,
                    index: 1
                },
                enterNum: 0,
                projectInfos: {
                    communication_score: 0,
                    content: null,
                    contract_name: null,
                    contract_price: null,
                    make_score: 0,
                    project_id: null,
                    project_name: null,
                    quality_score: 0,
                    task_count: null,
                    test_name: null,
                    time: null,
                    score_status: 1
                }
            };
        },
        mounted(){
            this.resetBanner();
            this.init();
        },
        watch: {
            'projectInfos.content': {
                handler: function(val) {
                    this.enterNum = val.length;
                }
            }
        },
        methods: {
            //初始化接口
            async init(){
                let {data} = await scoreApi.yiscoreInit();
                if (data.err_code == 0){
                    this.getProjectList();
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            //列表接口
            async getProjectList(){
                let fileter = this.fileter;
                let page = {
                    page: this.page.creentPage,
                    limit: this.page.page_size
                };
                let parms = Object.assign(fileter, page);
                let {data} = await scoreApi.getYiProjectHttp(parms);
                if (data.err_code == 0){
                    this.showLoading = false;
                    this.listArr = data.data.data;
                    this.page.total = parseInt(data.data.page.count);
                } else {
                    this.showLoading = false;
                    this.$Message.error(data.err_message);
                }
            },
            //选择操作
            selectFun(){
                this.fileter.status = this.creentStatus;
                this.getProjectList();
            },
            //搜索操作
            searchfun(){
                let search = this.searchText;
                if (search == null || search == '' || search.length == 0){
                    this.$Message.error(i18n.t('resources.res_search'));
                } else {
                    this.fileter.name = search;
                    this.getProjectList();
                }
            },
            //分页操作
            onChangePage(newVal){
                this.page.creentPage = newVal;
                this.getProjectList();
            },
            //查看详情
            async showModal(item){
                this.modelFlag = true;
                let {data} = await scoreApi.getYiProjectDtailHttp({project_id: item.project_id});
                if (data.err_code == 0){
                    this.resetBanner();
                    this.projectInfos = data.data;
                    this.bannerArr = data.data.files;
                    this.$nextTick(() => {
                        if (data.data.files && data.data.files.length > 0){
                            document.getElementById('bannerUl').style.marginLeft = 0 + 'px';
                        } else {
                            console.log('没有数据');
                        }
                    });
                }
            },
            //上一张
            prev(){
                let index = this.bannerObj.index;
                let left = this.bannerObj.left;
                if (index > 1){
                    index --;
                    this.bannerObj.index = index;
                    this.bannerObj.left = left + 520;
                    this.$refs.bannerUl.style.marginLeft = this.bannerObj.left + 'px';
                }
            },
            //下一张
            next(){
                let index = this.bannerObj.index;
                let left = this.bannerObj.left;
                if (index < this.bannerArr.length){
                    index ++;
                    this.bannerObj.index = index;
                    this.bannerObj.left = left - 520;
                    this.$refs.bannerUl.style.marginLeft = this.bannerObj.left + 'px';
                }
            },
            //页面跳转
            hrefPage(type, id){
                if (id){
                    switch (type){
                        case 'project' :
                            // 更新导航栏
                            this.$bus.emit('changeMenuList', id);
                            sessionStorage.projectID = id;
                            this.$router.push('/project');
                            break;
                        case 'contract' :
                            this.$store.commit("getContractIDCommit", id);
                            this.$router.push({
                                path: "/epibol/contractDetails",
                                // query: {navTitle: "项目评分" }
                            });
                            break;
                        case 'testTask' : this.$router.push({path: '/customer/testTaksDetails', query: {id: id}});
                            break;
                    }
                }

            },
            //重置
            resetBanner(){
                this.bannerObj = {left: 0, index: 1};
                this.bannerArr = [];
            }
        },
        filters: {
            convert(number){
                let str = null;
                switch (number){
                    case 0 : str = i18n.t('resources.res_pleaseGrade');
                        break;
                    case 1 : str = i18n.t('resources.res_range');
                        break;
                    case 2 : str = i18n.t('resources.res_commonly');
                        break;
                    case 3 : str = i18n.t('resources.res_bad');
                        break;
                    case 4 : str = i18n.t('resources.res_satisfied');
                        break;
                    case 5 : str = i18n.t('resources.res_verySatisfied');
                        break;
                }
                return str;
            }
        }
    };
</script>

<style lang="less" scoped>
    .scoreContent{
        height: 100%;
        .filterBar{
            display: flex;
            justify-content: flex-end;
        }
        .contenerList{
            height: 90%;
            margin-top: 20px;
            .tableHead , .listSty li{
                display: flex;
                justify-content: space-between;
                color: #bdbdbd;
                height: 46px;
                line-height: 46px;
                font-weight: lighter;
                background-color: #fdfdfd;
                border-bottom: 1px solid #efefef;
                margin-bottom: 0;
                font-size: 14px;
                span{
                    flex: 1;
                    text-align: center;
                    &:first-child{
                        text-align: left;
                        padding-left: 20px;
                    }
                    &:last-child{
                        text-align: right;
                        padding-right: 20px;
                    }
                }
            }
            .listSty{
                height: 94%;
                background-color: #fff;
                overflow: auto;
                li{
                    height: 60px;
                    line-height: 60px;
                    color: @black_2;
                    font-size: 13px;
                    .evaluate{
                        font-style: normal;
                        &:hover{
                            cursor: pointer;
                            color: @base;
                        }
                    }
                }
            }
        }
        .pageSty{
            margin-top: 10px;
            text-align: center;
            margin-bottom: 30px;
        }
    }
    .modalContener{
        .top{
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e8e8e8;
            padding-bottom: 10px;
            .left{
                width: 320px;
                dl{
                    dt{
                        font-size: 15px;
                    }
                    dd{
                        font-size: 13px;
                        margin-top: 33px;
                    }
                }
            };
            .right{
                width: 520px;
                overflow: hidden;
                ul{
                    display: flex;
                    transition: all .5s;
                    li{
                        width: 520px;
                        height: 315px;
                        text-align: center;
                        overflow: hidden;
                        img{
                            max-width: 520px;
                            max-height: 315px;
                        }
                    }
                }
                .pageTool{
                    font-size: 15px;
                    display: flex;
                    justify-content: center;
                    color: #a7a7a7;
                    margin-top: 5px;
                    .leftsty , .rightsty{
                        display: inline-block;
                        font-size: 16px;
                        &:hover{
                            cursor: pointer;
                            color: @base;
                        }
                    }
                    .leftsty {
                        transform: rotate(-90deg);
                        margin-right: 10px;
                    }
                    .rightsty{
                        transform: rotate(90deg);
                        margin-left: 10px;
                    }
                    span{
                        font-size: 13px;
                    }
                }
            }
        }
        .bottom{
            padding-top: 10px;
            .title{
                span{
                    font-size: 15px;
                }
            }
            .star{
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                .left{
                    width: 320px;
                    ul{
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        li{
                            /*margin-top: 10px;*/
                            font-size: 13px;
                            display: flex;
                            align-items: baseline;
                            span{
                                &:first-child{
                                    margin-right: 20px;
                                }
                                &:last-child{
                                    font-size: 12px;
                                    margin-left: 20px;
                                    background: #f7f7f7;
                                    width: 80px;
                                    border-radius: 3px;
                                    text-align: center;
                                    padding: 1px 0;
                                    color: @base;
                                }
                            }
                        }
                    }
                }
                .right{
                    position: relative;
                    width: 520px;
                    .enter-desc-counts{
                        font-size: 12px;
                        position: absolute;
                        bottom: 5px;
                        right: 20px;
                        color: #a2a2a2;
                        i{font-style: normal}
                    }
                    .errorSty{
                        color: red;
                    }
                }
            }
        }
    }
    .confimBtn{
        border: 0;
        border-radius: 3px;
        background: @base;
        color: #fff;
        padding: 10px 25px;
        outline: none;
        &:hover{
            cursor: pointer;
            background: @base_active;
        }
    }
</style>
