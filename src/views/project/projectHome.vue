<template>
    <div class="ProjectHomePage">
        <main-native>
            <div class="main-header-style"><span
                class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
        </main-native>
        <div class="companyInfo">
            <div class="companyInfoLeft">
                <!--<Icon class="setting" v-if="projectSetingShow||collaboration===1" @click.native="companySet"-->
                      <!--type="ios-gear-outline"></Icon>-->

                <!-- content -->
                <ul class="contentRow">
                    <p class="contentTitle">{{proData.name}}</p>
                    <p class="contentDescription">{{/*proData.description != null ? proData.description :
                        '项目描述和备注'*/}}</p>
                    <li>
                        <span>负责人</span>
                        <p>{{proData.leader_name != null ? proData.leader_name : '暂无'}}&nbsp;</p>
                    </li>
                    <li>
                        <span>项目时间</span>
                        <p>{{proData.start_time}}~{{proData.end_time}} &nbsp;{{proData.day_num}} 工作日</p>
                    </li>
                    <li>
                        <span>甲方公司</span>
                        <p>{{proData.demand_company == null ? '暂无' : proData.demand_company.company_name}}</p>
                    </li>
                    <li>
                        <span>甲方对接人</span>
                        <p>{{proData.demand_company == null ? '暂无' : proData.demand_company.customer_people}}</p>
                    </li>
                </ul>
            </div>
            <div class="companyInfoRight">
                <!-- 项目流程板块隐藏 -->
                <!-- <div class="projectFlow">
                    <p class="projectFlowHead">项目流程</p>
                </div> -->
                <div class="projectDynamic">
                    <p class="projectDynamicHead">项目动态</p>
                    <template v-if="projectNews&&projectNews.length>0">
                        <table class="projectDiaryTable">
                            <tbody class="projectDiaryTbody">
                            <tr v-for="(item,index) in projectNews" :key="index" style="padding-bottom:16px;">
                                <td class="projectTime">{{item.time}}</td>
                                <td class="projectAction">{{item.action}}</td>
                                <td class="projectName">{{item.remark_name}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </template>
                    <template v-else>
                        <div class="projectHomeImg">
                            <img class="" :src="require('@/assets/images/projectHome.png')" alt="">
                            <p style="letter-spacing: 5px;font-size: 13px;text-align: right;">暂无项目动态</p>
                        </div>
                    </template>

                </div>
            </div>
        </div>
        <!--<div>-->
        <!--<Modal-->
        <!--footer-hide-->
        <!--class="projectSetContainerModal"-->
        <!--v-model="setingPageShow"-->
        <!--title="Common Modal dialog box title"-->
        <!--&gt;-->
        <!--<div slot="header" style="margin: 0 auto;">-->
        <!--<h3>设置</h3>-->
        <!--</div>-->
        <!--<project-seting></project-seting>-->
        <!--</Modal>-->
        <!--</div>-->

    </div>

</template>
<script>
    import {surveyIndex, surveyProjectInfo, surveyCountShow} from '@/axios/modules/project/projectSurvey';
    import Cookies from "js-cookie";
    import api from "api";
    import {mapState, mapActions} from "vuex";

    import vFlare from "@/components/d3flare";
    import mainNative from "../main-components/mainNative.vue";
    import homeEchart from "./components/homeEchart.vue";
    import projectSeting from './projectSet.vue';

    const nav = ['项目工作时间', '项目协作共享'];

    export default {
        data () {
            return {
                mIndex: 0,
                navList: nav,
                setingPageShow: false,
                projectNews: [], //项目级项目日志动态数据
                proData: [],
                width: null,
                companyType: JSON.parse(Cookies.get("company")).type
            };
        },
        mounted () {
            this.init();

        },
        methods: {
            ...mapActions(['getCollaboration']),
            async init () {
                await surveyIndex();
                this.get();
                this.flare();
                this.initProTableData();
                this.getCollaboration();
            },
            companySet () {
                this.setingPageShow = true;
//      this.$router.push("/project/setting");
            },
            task () {
                this.$router.push("/project/task");
            },
            group () {
                this.$router.push("/project/projectMember");
            },
            statistics () {
                this.$router.push("/project/statistics");
            },
            async get () {
                let params = {
                    id: sessionStorage.projectID
                };
                let _this = this;
                _this.$Loading.start();
                let {data} = await surveyProjectInfo(params);
                _this.$Loading.finish();
                _this.proData = data;
            },
            flare () {
                this.$nextTick(() => {
                    if (this.$refs.resouer) {
                        this.width = this.$refs.resouer.offsetWidth + "";
                    }
                });
            },
            // 获取项目级项目动态
            async initProTableData () {
                let _this = this;
                let params = {
                    project_id: sessionStorage.projectID
                };
                let {data} = await surveyCountShow(params);
                _this.projectNews = data.data;
            },
        },
        computed: {
            ...mapState({
                projectSet (data) {
                    return data.app.projectSet;
                },
                projectSetingShow (data) {
                    return data.app.projectSeting;
                },
                collaboration (data) {
                    return data.app.collaboration;
                },

            })
        },
        components: {
            vFlare,
            mainNative,
            homeEchart,
            projectSeting
        }
    };
</script>
<style lang="less">
    .ProjectHomePage {
        // height: 100%;
        .companyInfo {
            display: flex;
            // height: 100%;
            .companyInfoLeft {
                .base-card;
                position: relative;
                width: 30%;
                .setting {
                    position: absolute;
                    top: 30px;
                    right: 30px;
                    font-size: 22px;
                    cursor: pointer;
                    &:hover {
                        color: @base;
                    }
                }
                .contentRow {
                    li {
                        display: flex;
                        margin-top: 18px;
                        font-size: 14px;
                        span {
                            flex: 1;
                            color: @black_3;
                            font-size: 12px;
                        }
                        p {
                            flex: 3;
                        }
                    }

                    .contentTitle {
                        font-size: 18px;
                    }
                    .contentDescription {
                        margin-bottom: 28px;
                        font-size: 12px;
                        color: #bdbdbd;
                    }
                }
            }
            .companyInfoRight {
                height: 100%;
                flex: 1;
                margin-left: 30px;
                .projectFlow {
                    .base-card;
                    height: 50%;
                    margin-bottom: 30px;
                    height: 280px !important;
                    &Head {
                        .base-card-head;
                    }
                }
                .projectDynamic {
                    .base-card;
                    min-height: 510px;
                    position: relative;
                    &Head {
                        .base-card-head;
                    }
                    .projectDiaryTable {
                        min-height: 510px;
                        width: 100%;
                        table-layout: fixed;
                        .projectDiaryTbody {
                            overflow-y: auto;
                            display: block;
                            height: 760px;
                            width: 100%;
                            &::-webkit-scrollbar {
                                width: 3px !important;
                            }
                            tr {
                                display: table;
                                width: 100%;
                                table-layout: fixed;
                            }
                        }
                    }
                    .projectHomeImg {
                        width: 114px;
                        height: 122px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate3d(-50%, -50%, 0);
                    }
                    .projectTime,
                    .projectName {
                        font-size: 14px;
                        color: #bdbdbd;
                    }
                    .projectAction {
                        font-size: 14px;
                        color: @black_2;
                    }
                }
            }
            .projectFlow,
            .projectDynamic {
                padding: 30px;
            }
        }
    }
</style>
<style lang="less">
    .projectSetContainerModal {
        .ivu-modal {
            width: 50% !important;
            min-width: 1000px;
            // height: 70%;
            // overflow-y: auto;
            // background: #fff;
        }
        .ivu-modal-content {
            height: 100%;
        }
        .ivu-modal-header {
            text-align: center;
            color: #ffffff;
            // background: #fff;
            border-bottom-color: transparent;
        }
        .ivu-modal-body {
            padding: 0;
            border-top: 1px solid @gray;
            height: calc(~"100% - 61px");

        }

    }
</style>
