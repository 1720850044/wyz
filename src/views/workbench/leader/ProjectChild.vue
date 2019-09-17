<template>
    <div class="task_page_all" >
        <template v-if="loadingFlag">
            <div style="height: 660px">
                <loading></loading>
            </div>
        </template>
        <template v-if="!loadingFlag && (list && list.length > 0)">
            <!--测试任务-->
            <template v-if="isTest">
                <div class="task_msg_bx" v-for="item in list" @click="goTestTaskDetail(item)">
                    <div class="task_msg_left">
                        <div class="task_name">
                            <div class="task_name_title">
                                <p class="task_introduce" >{{item.test_name}}</p>
                            </div>
                        </div>
                        <div class="task_test_day">
                            <span class="task_time">{{item.shengyuDay}}{{$t('workbench.work_workDayText')}}({{item.startDay}} ~ {{item.endDay}})</span>
                            <p class="task_work_img" v-if="item.execute_name"><img :src="item.headimage"/><span>{{item.execute_name}}</span></p>
                        </div>
                    </div>
                </div>
            </template>
            <!--普通任务-->

            <template v-else>
                <div class="task_msg_bx" v-for="(item, index) in list" :key="index" v-if="list.length">
                     <!-- {{guideSteps}} -->
                    <div class="task_msg_left" @click="getTask(item)">
                        <div class="task_name">
                            <div class="task_name_title">
                                <p class="task_introduce">{{item.task_name}}</p>
                                <p class="project-name">{{item.project_name}}</p>
                            </div>
                            <div class="task_pp_name" v-if="item.task_person">
                                <img :src="item.headimage"/>
                                <span>{{item.task_person}}</span>
                            </div>
                        </div>
                        <div class="task_man_day">
                            <div style="display: flex;justify-content: space-between">
                                <span class="task_time">{{item.days}}{{$t('workbench.work_workDayText')}}({{item.expect_start_new}} ~ {{item.expect_end_new}})</span>
                                <span class="task_type">{{item.progress_name}} <i> {{item.progress}} / </i>{{item.progress_total}}</span>
                            </div>
                            <Progress :percent="parseInt((item.progress/item.progress_total)*100)" :stroke-width="5" hide-info style="margin-top: 5px"></Progress>
                        </div>
                    </div>
                </div>
            </template>
        </template>
        <template v-if="!loadingFlag && list.length == 0">
            <div style="min-height: 660px;position: relative">
                <nothink type="task"></nothink>
            </div>
        </template>
    </div>
</template>
<script>
    export default {
        props: ['list', 'isTest', 'loadingFlag'],
        methods: {
            //跳转详情页
            getTask (item) {
                // this.$router.push({ path: "/project/details", query: { project: item.projectID, id: item.id, navTitle: '负责项目'}});
                this.$router.push({ path: "/project/details", query: { project: item.projectID, id: item.id, navTitle: i18n.t('workbench.work_conscientiousProject')}});

            },
            goTestTaskDetail(item){
                this.$router.push({ path: "/epibol/ManageDetails", query: { enteredID: item.id, TestID: item.test_id, type: 'new'}});
                // this.$router.push({name:'ManageDetails',params:{enteredID:item.id,TestID:item.test_id,type:'new'}});
            }
        }
    };
</script>
<style lang="less">
    .task_page_all{
        /*width: 100%;*/
        /*min-height: 100%;*/
        /*padding: 5px;*/
        // padding: 0 1px;
        .no_task{
            width: 200px;
            height: 200px;
            margin: 0 auto;
            margin-top: 150px;
            text-align: center;
            font-size: 18px;
            .icon_no{
                font-size: 60px;
                color: rgb(210,210,210);
            }
        }
        .task_msg_bx{
            width: 99.9%;
            height: 120px;
            border: 1px solid @black_4;
            margin-bottom: 20px;
            padding:10px 20px;
            //  background: #fdfdfd;
            border-radius: 4px;
            &:hover{
                cursor: pointer;
                box-shadow: 0px 1px 6px 0.5px #c5c3c38f;
            }
            .task_msg_left{
                /*width: 100%;*/
                /*height: 100%;*/
                /*float: left;*/
                .task_name{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    /*width: 100%;*/
                    /*height: 60px;*/
                    .task_name_title{
                        /*float: left;*/
                        /*<!--@title: 120px;-->*/
                        /*height: 100%;*/
                        .project-name{
                            color: #bdbdbd;
                            font-size: 12px;
                        }
                    }
                    .task_pp_name{
                        display: flex;
                        align-items: center;
                        img{
                            width: 28px;
                            height: 28px;
                            border-radius: 100%;
                            border: none;
                            margin-right: 10px;
                        }
                        span{
                            color: #989898;
                        }
                    }
                    .task_msg_right{
                        width: 120px;
                        height: 100%;
                        // line-height: 80px;
                        text-align: right;
                        float: left;
                        .progress_task_all{
                            height: 30px;
                            line-height: 30px;
                            font-size: 16px;
                            .task-total{
                                color: @base;
                            }
                        }
                        .task_progress_name{
                            font-size: 18px;
                            margin-right: 10px;
                            color: @base;
                        }
                    }
                }
                .task_introduce{
                    width: 100%;
                    /*height: 30px;*/
                    /*line-height: 30px;*/
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                .task_test_day{display: flex;justify-content: space-between;align-items: center;}
                .task_test_day,.task_man_day{
                    color: #bdbdbd;margin-top: 20px;
                    .task_time{white-space: nowrap}
                    .task_type{color: @base;white-space: nowrap;i{font-style: normal;color: #bdbdbd}}
                    .ivu-progress-inner{background-color: #e6e6e6!important;border-radius: 5px}
                    .ivu-progress-bg{background-color: @base!important;}

                    .task_work_msg{
                        float: left;
                    }
                    .task_work_time{
                        float: left;
                        margin-left: 20px;
                    }
                    .task_work_img{
                        float: right;
                        // margin-left: 80px;
                        img{
                            width: 30px;
                            height: 30px;
                            // margin-top: 10px;
                            float: left;
                            border-radius: 50%;
                        }
                        span{
                            float: left;
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
    }
</style>
