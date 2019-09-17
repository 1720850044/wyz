<!--
    公司====>项目=====>项目邀请
-->
<template>
    <div class="projectInvite">
        <template v-if="!showLoading && projectInviteData && projectInviteData.length>0">
            <dl class="inviteContent">
                <dd class="ddSty" @click="toDetail(item.id)" v-for="(item,index) of projectInviteData" :key="index">
                    <i class="statusLabel" v-if="item.status === '0'">{{item.status_text}}</i>
                    <i class="statusLabel" v-if="item.status === '1'">{{item.status_text}}</i>
                    <i class="statusLabel" v-if="item.status === '2'">{{item.status_text}}</i>
                    <div class="topContent">
                        <div class="title">
                            {{item.title}}
                        </div>
                        <div class="content">
                            <div class="InviteMoney">
                                <span>项目预计金额</span>
                                <p style="font-size: 12px !important;">￥<em class="money">{{item.expect_price}}</em></p>
                            </div>
                            <div class="InviteMoney">
                                <span>项目预计周期</span>
                                <p><em>{{item.expect_start_date}}~{{item.expect_end_date}}</em></p>
                            </div>
                            <div class="InviteMoney">
                                <span>邀请方</span>
                                <p><em>{{item.company}}</em></p>
                            </div>
                        </div>
                    </div>
                </dd>
            </dl>
            <Page v-if="page.total > page.page_size"
                  class-name="pageSty"
                  :current=page.creentPage
                  :total="page.total"
                  :show-total=false
                  :page-size="page.page_size"
                  @on-change="onChangePage"
            >
            </Page>
        </template>
        <template v-if="showLoading">
            <div class="loading" style="height: 810px;">
                <loading></loading>
            </div>
        </template>
        <template v-if="!showLoading && (!projectInviteData || projectInviteData.length <= 0)">
            <div style="min-height: 810px;position: relative">
                <nothink type="project" text="暂无邀请"></nothink>
            </div>
        </template>
        <!-- 项目邀请详情对话框 -->
        <Modal
            v-model="inviteDtailModal"
            :title="modalTitle"
            width="800px"
            class="inviteDtail"
            :mask-closable='false'
        >
            <project-InviteDtail ref="projectInviteDtail"></project-InviteDtail>
            <div slot="footer" style="text-align: center;">
                <Button type="primary" class="sendBtn" size="large" @click="clickInvitate('1')">接受邀请</Button>
                <Button type="ghost" class="sendBtn" size="large" @click="clickInvitate('2')">拒绝邀请</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import {projectInviteApi} from "api";
    import projectInviteDtail from "./projectInviteDtail";

    export default {
        data() {
            return {
                showLoading: true,
                inviteDtailModal: false,
                modalTitle: "",
                projectInviteData: [],
                page: {
                    total: 0,
                    page_size: 20,
                    creentPage: 1
                },
                detailID: null
            };
        },
        components: {projectInviteDtail},
        mounted() {
            this.initFun();
        },
        methods: {
            onChangePage(page) {
                this.page.creentPage = page;
                this.projectInviteList();
            },
            // 页面初始化
            async initFun() {
                let {data} = await projectInviteApi.projectInviteInit();
                if (data.err_code == 0) {
                    this.showLoading = false;
                    this.projectInviteList();
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            //   项目邀请详情
            toDetail(id) {
                this.detailID = id;
                this.inviteDtailModal = true;
                this.modalTitle = "邀请详情";
                this.$nextTick(function () {
                    this.$refs.projectInviteDtail.inviteDtailInfo(id);
                });
            },
            // 接受邀请、拒绝邀请
            async clickInvitate(status) {
                this.inviteDtailModal = false;
                let params = {};
                if (status === "1") {
                    params = {
                        id: this.detailID,
                        status: "1"
                    };
                } else if (status === "2") {
                    params = {
                        id: this.detailID,
                        status: "2"
                    };
                }
                let {data} = await projectInviteApi.projectInviteBtn(params);
                if (data.err_code == 0) {
                    this.$Message.success(data.err_message);
                    this.projectInviteList();
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            // 获取项目邀请列表
            async projectInviteList() {
                let {data} = await projectInviteApi.projectInviteData();
                if (data.err_code == 0) {
                    this.projectInviteData = data.data;
                } else {
                    this.$Message.error(data.err_message);
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "./style/listStyle.less";
    .projectInvite {
        .inviteContent {
            .ddSty {
                .statusLabel {
                }
                .topContent {
                    .title {
                        color: #777;
                        height: 115px;
                        line-height: 115px;
                    }
                    .content {
                        padding: 30px !important;
                        .InviteMoney {
                            padding-bottom: 26px;
                            &:last-child {
                                padding-bottom: 0px !important;
                            }
                        }
                        .InviteMoney {
                            span,
                            p,
                            em {
                                font-size: 14px;
                                color: #777;
                            }
                            p {
                                em {
                                    font-size: 14px !important;
                                }
                            }
                            .money {
                                font-size: 16px;
                                color: #777 !important;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
