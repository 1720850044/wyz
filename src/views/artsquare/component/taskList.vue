<template>
    <div>
        <div class="contractRow">
            <template v-if="loadingFlag">
                <div style="height: 750px">
                    <loading></loading>
                </div>
            </template>
            <template v-if="!loadingFlag && (taskData && taskData.length > 0)">
                <dl>
                    <!--data-start="1" data-last="7" data-step="1" data-disable-interaction="1"  :data-intro="guideSteps.step1" data-position="right"-->
                    <dd data-start="1" class="ddModel" v-for="item in taskData" :key="item.id">
                        <div class="statusRow">
                            <div class="status" v-if="item.end_days > 0">
                                <Icon type="ios-stopwatch-outline"></Icon>
                                <span v-if="item.test_price">{{$t('projectHall.pro_signUp')}}</span>
                                <span v-else>{{$t('projectHall.pro_quotedPrice')}}</span>
                                {{$t('projectHall.pro_surplus')}} {{item.end_days}} {{$t('projectHall.pro_day')}}
                            </div>
                            <div class="TimeOverSty" v-else>
                                <Icon type="ios-stopwatch-outline"></Icon>
                                {{$t('projectHall.pro_enrollmentEnded')}}
                            </div>
                        </div>
                        <div class="Rprojectinfo" @click="showDetails(item)">
                            <div class="RprojectName">
                                <span>{{item.test_name}}</span>
                                <i v-if="item.task_type">{{item.task_type}}</i>
                                <i class="companyNumber">{{item.join_num}}{{$t('projectHall.pro_numberOfEnrolment')}}</i>
                            </div>
                            <p v-if="item.test_price">{{$t('projectHall.pro_testPrice')}}：<span>￥{{item.test_price}}</span></p>
                            <p v-else>{{$t('projectHall.pro_testPrice')}}：<span>{{$t('projectHall.pro_serviceProviderQuotation')}}</span></p>

                            <p>{{$t('projectHall.pro_estimate')}}：<span>￥{{item.project_max_price}}</span></p>
                            <p>{{item.company}}</p>
                        </div>
                    </dd>
                </dl>
                </template>
            <template v-if="!loadingFlag && taskData.length == 0">
                <div style="position: relative;min-height: 750px">
                    <nothink type="task" :text="$t('projectHall.pro_noTaskTpis')"></nothink>
                </div>
            </template>
        </div>
        <!-- Modal组件 -->
        <Modal
            v-model="taskDetails"
            class="deal-task-detail"
            id="taskHall"
            :transfer="false"
            :footer-hide="companyType == 1 ? true : false"
            width="600px">
            <task-details :emitDetailsData="detailsData"></task-details>
            <div slot="header">
                <span class='deal-task-detail-head'>{{detailsData.test_name}}， {{$t('projectHall.pro_welcomeToApply')}}！</span>
                <i class="deal-task-detail-tasktype" v-if="detailsData.task_type">{{detailsData.task_type}}</i>
            </div>
            <div slot="footer" >
                <div class="bjTbDiv" >
                    <div v-if="!detailsData.test_price">
                        <p v-if="detailsData.bid_end_days >=0 && !detailsData.is_join"><input v-model="BJprice" type="number" :maxlength='8' :placeholder="$t('projectHall.pro_inputQuotation')"/><span @click="nowBJFun">{{$t('projectHall.pro_quoteImmediately')}}</span></p>
                        <p v-if="detailsData.bid_end_days >=0 && detailsData.is_join" class="yiBJ">{{$t('projectHall.pro_quotePrice')}}（{{detailsData.bid_price}}）{{$t('projectHall.pro_yuan')}}</p>
                        <p v-if="detailsData.bid_end_days < 0 " class="yiBJ">{{$t('projectHall.pro_enrollmentEnded')}}</p>
                    </div>
                    <div v-show="detailsData.test_price">
                        <!--<div data-start="2" data-last="7" data-step="2" data-disable-interaction="2"  :data-intro="guideSteps.step2" data-position="right">-->
                            <div data-start="2" class="twoStep">
                                <p v-if="detailsData.bid_end_days >=0 && !detailsData.is_join"  class="lijiBM" @click="nowBJFun">{{$t('projectHall.pro_signUpImmediately')}}</p>
                            </div>
                        <!--</div>-->
                        <p v-if="detailsData.bid_end_days >=0 && detailsData.is_join" class="yiBJ">{{$t('projectHall.pro_enrolment')}}</p>
                        <p v-if="detailsData.bid_end_days < 0 " class="yiBJ">{{$t('projectHall.pro_enrollmentEnded')}}</p>
                    </div>
                </div>
            </div>
        </Modal>
        <Page v-if="page.total > page.page_size"
              class-name="pageSty"
              :current=page.creentPage
              :total="page.total"
              :show-total=false
              :page-size="page.page_size"
              @on-change="onChangePage"
        >
        </Page>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import taskDetails from './taskDetails';
import Cookies from 'js-cookie';
import api from 'api';
export default {
    data(){
        return {
            taskData: [],
            taskDetails: false,
            detailsData: {},
            Tid: null,
            BJprice: null,
            companyType: JSON.parse(Cookies.get('company')).type,
            page: {
                creentPage: 1,
                total: 0,
                page_size: 12
            },
            //引导数据
            guideSteps: {
                step1: '',
                step2: ''
            },
            needGuideData: null,
            loadingFlag: true
        };
    },
    props: ['searchCondition'],
    watch: {
        searchCondition: {
            handler(val, oldVal){
                this.page.creentPage = 1;
            },
            deep: true
        }
    },
    mounted(){
        // this.taskListData(this.searchCondition);
        this.$bus.on('joinSuccess', ()=>{
            this.taskListData(this.searchCondition);
        });
        this.initGuide();
    },
    components: {
        taskDetails: taskDetails
    },
    methods: {
        // 初始化获取是否引导
        async initGuide () {
            let _this = this;
            let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_task_hallindex;
            this.$axios.get(url).then(({data}) =>{
                if (data.guide){
                    if (data.guide == 'href_0'){
                        _this.$router.push({ path: "/customer/epibolCompany"});
                    } else if (data.guide == 'taskHall'){
                        _this.needGuideData = true;
                        _this.taskListData(Object.assign({}, _this.searchCondition, {needGuideData: true})).then((res) => {
                            _this.$guide().exit();
                            setTimeout(() => {
                                _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                    .addSteps([
                                        {
                                            element: document.querySelector('.ddModel'),
                                            intro: _this.$lau.guide_words.k1,
                                            position: 'right',
                                            disableInteraction: '1',
                                            start: '1',
                                            total: '7'
                                        },
                                        {
                                            element: document.querySelector('.twoStep'),
                                            intro: _this.$lau.guide_words.k2,
                                            position: 'right',
                                            disableInteraction: '1',
                                            start: '2',
                                            total: '7'
                                        },
                                    ])
                                    .onchange(function (el) {
                                        let step = el.getAttribute('data-start');
                                        if (step == 2){
                                            _this.showDetails(res[0]);
                                            _this.$nextTick(() => {
                                                _this.$guide().exit();
                                            });
                                        }
                                    }).onafterchange(function (el) {
                                        let step = el.getAttribute('data-start');
                                        if (step == 2){
                                            setTimeout(()=>{
                                                _this.$guide().setOptions(Object.assign({}, _this.$CONSTANT.guideOptions, {overlayOpacity: 0}), _this.$CONSTANT.guideOptions).goToStepNumber(2)
                                                .addSteps([
                                                    {
                                                        element: document.querySelector('.twoStep'),
                                                        intro: _this.$lau.guide_words.k2,
                                                        position: 'right',
                                                        disableInteraction: '1',
                                                        start: '2',
                                                        total: '7'
                                                    },
                                                ]).start()
                                                .onskip(function () {
                                                    _this.taskDetails = false;
                                                    _this.needGuideData = '';
                                                    _this.taskListData(_this.searchCondition);
                                                })
                                                .oncomplete(function () {
                                                    _this.taskDetails = false;
                                                    _this.$PublicFuns.completePageGuide('tendering').then(res =>{
                                                        _this.$router.push({path: "/epibol/bidManage"});
                                                        _this.$bus.emit('changeMenu', 1, 1);
                                                        _this.$guide().exit();
                                                    });
                                                });
                                                $('#taskHall .ivu-modal-wrap').removeClass('introjs-fixParent');
                                                $('.introjs-helperLayer').css('background-color', 'rgba(255, 255, 255, 0)');
                                            }, 200);
                                        }
                                    }).start().onskip(function () {
                                        _this.needGuideData = false;
                                        _this.taskListData(_this.searchCondition);
                                    });
                            }, 200);
                        });
                    }
                } else {
                    _this.taskListData(_this.searchCondition);
                }
            });
        },

        //列表数据
        async taskListData(params){
            return new Promise((resolve, reject) =>{
                params.page = this.page.creentPage;
                params.page_size = this.page.page_size;
                api.getTaskHall(params).then(taskHall =>{
                    if (taskHall.data.err_code == 0){
                        this.loadingFlag = false;
                        this.page.total = parseInt(taskHall.data.page.count);
                        let ResData = taskHall.data.data;
                        this.taskData=ResData;
                        resolve(ResData);
                    } else {
                        this.loadingFlag = false;
                        this.$Message.error(taskHall.data.err_message);
                    }

                });
            });
        },
        //分页请求数据
        onChangePage(nowPage){
            this.page.creentPage = nowPage;
            this.taskListData(this.searchCondition);
        },
        //立即报价
        async nowBJFun(){
            let obj = {
                id: this.detailsData.id,
                price: this.BJprice
            };
            const postBJ = await api.postBaojia(obj);
            if (postBJ.data.err_code == 0){
                this.$bus.emit('joinSuccess');   //更新页面数据
                this.$Message.success(postBJ.data.err_message);
                this.BJprice = null;
                this.taskDetails = false;
            } else {
                this.BJprice = null;
                this.taskDetails = false;
            }
        },
        showDetails(item){
            this.detailsData = item;
            this.taskDetails = true;
        },
    },
    computed: {
        ...mapState({
            applyrole(value){
                return value.app.callForBidsdts.HaveTender;
            }
        }),
    }
};
</script>
<style type="text/css" lang="less">
    .contractRow {
        height: 100%;
        margin-top: @p20;
        dl {
            margin-left: -1%;
            display: block;
            zoom: 1;
            overflow: auto;
        }
        dd {
            width: 23%;
            display: inline-block;
            margin: 0px 0px @p30 2%;
            white-space: nowrap;
            background: @white;
            border-radius: @r4;
            cursor: pointer;
            &:hover{
                .base-card-hover;
            }
            .ivu-icon-ios-more {
                color: #222222;
            }
            .statusRow {
                height: 60px;
                border-bottom: 1px dashed @gray;
                .ivu-select-dropdown {
                    margin: -10px;
                    padding: 0px;
                }
                .status {
                    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAABSCAYAAABns+t1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAydpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTg4Q0NDMzE5RjkyMTFFODlBQjhBNEJFNzMyRURENTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTg4Q0NDMzA5RjkyMTFFODlBQjhBNEJFNzMyRURENTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDpmZjg5MTI5Ny1jMDNhLTI5NGUtYTQ2Ni1kZWRiODgzODhkNDIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZmY4OTEyOTctYzAzYS0yOTRlLWE0NjYtZGVkYjg4Mzg4ZDQyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Fyhy2wAAAuhJREFUeNrsnD9rU1Echu/v3ktLgqak2jiURrAO4p+h0EL9M9giQuxSsEugm5DFmvYDCBb8BFcn03YREQQhxSGBLl0CmgR0k5bYweCipEjjEAom8XdtK7U0bcd7Xt4HXkKSm+U+nJNz4ZxXbn7MtS0SFLY0m5p1TUmT2339S2EoceSPbd6/QNGjuaDxrT3RFDUVzYwmdNyPKTP4XNQ816zd+pSfPOpC4TRrHBlNWqfcbY5M80lp8jpKI5SJwZgmq0K7KBOD8d3/UspEmXL3L4oo03w8FRqiTAzimgeUiUOaz5lYjHJk4nCXMnG4Tpk4XKJMHM5SJg6nKRMIysThF2XiUKNMHNYoE4f3lInDist7AEGlMJQocmRi8IyPJhhUNUuUicGsTrENyjSfBRW5vPeGMs2loHm0/wPKNJNVzcTBXe2UaR7+8YSEiqwf/ILPmWatWudUYrbTBZQZfDY0nmZxb9VKmWbgT501a+ewbVmTt3bOaJ5oB6X0vXja8cIfqcfC+2sONoUByeQIBJNJoWAyKRRMJoWCyaRQc5HfhXs8BRYYG+6W5YY3pfvcuhU+X5KeazmJ3SlRJoxg+4tEhz3pn1qSyJUGZWJQlejIrH15fpkyUXDCGXvwYVr6bm9TJgardnx6UgaS9WNXsyTwjLWqr7Ltb29Y6gTCeOvrS5Y6AZFqfphiqRMMzYbX+jzPUicQ4u2fZZY6AZHmowkS4rDUCYZ2k6VOQLDUCQiWOgHBUicgWOqEBGXiwFInIFjqBARLnYBgqRMM4qxQJgYV58Y7ljqBwFInEPwtmCx1gsAJ+XtpWeoEwIIz+palTgAU7Pg0S50A8DdBT8hA8r9d7WwbMe8/MmMPzhx6PIEyzVq1zulih6VO5iIb0jviSf/9RYlcZamTOd7cuuWGa9Id8w/bllVeXqLDRaur92SlTt9fn+l4YSxZ43F4g7ApDEgmRyCYTAoFk0mhYDIpFEzmP6HuKd4dw/gjwAATusRH9cSaQgAAAABJRU5ErkJggg==');
                    min-width: 115px;
                    height: 41px;
                    line-height: 34px;
                    color: @white;
                    text-align: center;
                    display: inline-block;
                    font-size: @fs14;
                    position: relative;
                    margin-left: -7px;
                    margin-top: 10px;
                    padding: 0 10px;
                    background-size: 100% 200%;
                }
                .TimeOverSty{
                    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAAApCAMAAADOBgHiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiMWYyOGVjZi03ZmVhLTM2NDYtYjA5MC02ZDhkYTAyZWRiM2EiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDRFNkQxQzgwNDI4MTFFOUIxQTA5QzI5NDBBMUEyQjAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDRFNkQxQzcwNDI4MTFFOUIxQTA5QzI5NDBBMUEyQjAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM1NDQxMjVkLWYzNGEtNTI0Mi05NzU5LTdhODg4NDM0ZjY4YyIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmRmMmMxMDgzLTUyYzQtOWQ0MC1hNmZhLTgyNmUxZWVmNWY0NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgJmVGUAAAB1UExURb29vXd3d+bm5r6+vujo6Pb29sLCwvn5+dDQ0NHR0crKytbW1u/v77+/v9/f38DAwPz8/N7e3np6esHBwdra2ru7u/Ly8peXl8fHx6mpqfHx8YWFhf7+/qKion9/f42Njff3966urpCQkOnp6dTU1Hh4eP///84nM8sAAAAndFJOU///////////////////////////////////////////////////AINWl9kAAAC5SURBVHja7NhXDsIwEEXRSew0p5LQe539L5EgEHzwz7WE3wqOZHk8zyK/Tp26Ms70E2FiioomjMkTnCCDxQkiE54gDU8QyxPaBCdIzhOk4gkFTzAZTpCYJ5Q8wfGElCfUgeDHQbhwKb0YTR4M6CI81j6sLB4sbjYs8XyVae2/11q23JuvL47rJnonViKix9PtJeg7iKDaHJ6Es2IE7Wb9g7ACCaqXxUgYUIJul/toyhJU17s5Q7gLMAAyCpJMMr0a0QAAAABJRU5ErkJggg==");
                    min-width: 115px;
                    height: 41px;
                    line-height: 34px;
                    color: @white;
                    text-align: center;
                    display: inline-block;
                    font-size: @fs14;
                    position: relative;
                    margin-left: -7px;
                    margin-top: 10px;
                    padding: 0 10px;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                }
                .yellow {
                    background-position-y: -41px;
                }
            }
            .title {
                display: block;
                text-align: right;
                position: relative;
                margin-right: 21px;
                margin-top: -40px;
            }
            .ivu-icon-ios-more {
                color: #eee;
            }
            .Rprojectinfo{
                padding: 20px;
                .RprojectName{
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    span{
                        font-size: 15px;
                    }
                    i{
                        font-style: normal;
                        padding: 0 5px;
                        border: 1px solid @base;
                        border-radius: 3px;
                        margin-left: 10px;
                        color: @base;
                    }
                    .companyNumber{
                        position: absolute;
                        right: 0;
                    }
                }
                p{
                    padding: 10px 0;
                    color: #ccc;
                    font-size: 13px;
                    span{
                        font-size: 13px;
                        color: #828080;
                    }
                }
            }
        }
        .nothink{
            display: flex;
            align-items: center;
            justify-content: center;
            background: url('../../../assets/images/contract.png') no-repeat #FFFFFF;
            background-position: center 35%;
            height: 100%;
            width: 100%;
            span{
                font-size: 12px;
                color: @black_2;
            }
        }
    }
    .bjTbDiv{
        position: relative;
        text-align: left;
        border-radius: 3px;
        overflow: hidden;
        input{
            width: 100%;
            height: 32px;
            padding-left:10px;
            padding-right: 185px;
            border: 1px solid @base;
            color: @black_2;
            font-size: 15px;
        }
        span{
            display: inline-block;
            position: absolute;
            right: 0;
            bottom: 0;
            top: 0;
            background: @base;
            color: #fff;
            line-height: 32px;
            font-size: 13px;
            width: 200px;
            text-align: center;
            &:hover{
                background: #32CEB5;
                cursor: pointer;
            }
        }
        .lijiBM{
            text-align: center;
            background: @base;
            height: 40px;
            line-height: 40px;
            font-size: 13px;
            color: #fff;
            &:hover{
                background: #32CEB5;
                cursor: pointer;
            }
        }
        .yiBJ{
            text-align: center;
            background: @black_3;
            height: 40px;
            line-height: 40px;
            font-size: 13px;
            color: @black_2;
            &:hover{
                background: @black_3;
                cursor: pointer;
                color: @black_2;
            }
        }
        button{
            color: #fff;
        }
        .isJoin{
            background: @base;
        }
        .noJoin{
            background: #b3b3b3;
        }
    }
    .deal-task-detail{
        .deal-task-detail-head{
            color:@white;
            font-size:@fs16;
        }
        .deal-task-detail-tasktype{
            font-style: normal;
            border-radius: 2px;
            font-size: 12px;
            color:@base_light;
            border: 1px solid @base_light;
            font-weight: lighter;
            margin-left:20px;
        }
    }
    .ivu-page-item-jump-next:after, .ivu-page-item-jump-prev:after {
        display: inline-block;
    }
    .pageSty{
        margin-bottom: 30px;
        text-align: center;
    }
</style>
