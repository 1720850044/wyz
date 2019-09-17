<!--
    公司====>项目=====>项目邀请
-->
<template>
    <div class="projectInvite">
        <template v-if="loadingFlag">
            <div style="height: 800px">
                <loading></loading>
            </div>
        </template>
        <template v-if="!loadingFlag && (testInviteData && testInviteData.length > 0)">
            <dl class="inviteContent">
                <dd class="ddSty" @click="toDetail(item.id)" v-for="(item,index) of testInviteData" :key="index">
                    <i class="statusLabel" v-if="item.status === '0'">{{'待确认'}}</i>
                    <div class="topContent">
                        <div class="title">
                            {{item.title}}
                        </div>
                        <div class="content">
                            <div class="InviteMoney">
                                <span>项目预计金额</span>
                                <p>￥<em class="money">{{item.expect_price}}</em></p>
                            </div>
                            <div class="InviteMoney">
                                <span>项目预计周期</span>
                                <p><em>{{item.project_start_date}} ~ {{item.project_end_date}}</em></p>
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
        <template v-if="!loadingFlag && testInviteData.length == 0">
            <div style="min-height: 800px;position: relative">
                <nothink type="project" text="暂无邀请"></nothink>
            </div>
        </template>
        <!-- 测试邀请详情对话框 -->
        <Modal
            v-model="inviteDetailModal"
            width="800px"
            title="测试邀请详情"
            :mask-closable='false'
        >
            <testInviteDetail ref="testInviteDetail" @listenToChild="getChildMsg"></testInviteDetail>
            <div slot="footer" style="text-align: center;margin-bottom:40px;">
                <Button type="primary" class="sendBtn" size="large" @click="clickInvitate('1')">接受邀请</Button>
                <Button type="ghost" class="sendBtn" size="large" @click="clickInvitate('2')">拒绝邀请</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import {testInviteApi} from "api";
    import testInviteDetail from "./testInviteDetail";

    export default {
        data() {
            return {
                inviteDetailModal: false,
                testInviteData: [],
                page: {
                    total: 0,
                    page_size: 20,
                    creentPage: 1
                },
                detailID: null,
                price: null,
                loadingFlag:true
            };
        },
        components: {testInviteDetail},
        mounted() {
            this.initFun();
        },
        methods: {
            onChangePage(page) {
                this.page.creentPage = page;
                this.testInviteList();
            },
            getChildMsg(val) {
                this.price = val;
            },
            // 页面初始化
            async initFun() {
                let {data} = await testInviteApi.testInviteInit();
                if (data.err_code == 0) {
                    this.testInviteList();
                } else {
                    this.$Messages.error(data.err_message);
                }
            },
            // 获取测试邀请列表
            async testInviteList() {
                let params = {};
                let {data} = await testInviteApi.testInviteData(params);
                if (data.err_code == 0) {
                    this.loadingFlag = false;
                    this.testInviteData = data.data;
                } else {
                    this.loadingFlag = false;
                    this.$Messages.error(data.err_message);
                }
            },
            //   测试邀请详情
            async toDetail(id) {
                this.detailID = id;
                this.inviteDetailModal = true;
                this.$nextTick(function () {
                    this.$refs.testInviteDetail.inviteDtailInfo(id);
                });
            },
            // 1接受邀请、2拒绝邀请
            async acceptInvitate(status, Data) {
                let _this = this;
                let params = {};
                this.inviteDetailModal = false;
                if (Data && Data.length > 0 && typeof (Data) === "object") {
                    Data.forEach(function (item) {
                        if (item.id === _this.detailID) {
                            params.price = item.test_price;
                        } else {
                            console.log(1);
                        }
                    });
                } else {
                    params.price = Data;
                }
                if (status === "1") {
                    params.id = this.detailID;
                    params.status = "1";
                } else if (status === "2") {
                    params.id = this.detailID;
                    params.status = "2";
                }
                let {data} = await testInviteApi.testInviteBtn(params);
                if (data.err_code == 0) {
                    this.$Message.success(data.err_message);
                    this.testInviteList();
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            clickInvitate(status) {
                if (this.price) {
                    if (!this.price) {
                        this.$Message.error("请填写报价");
                    } else if (isNaN(this.price)) {
                        this.$Message.error("输入金额必须为数字");
                    } else if (this.price <= 0) {
                        this.$Message.error("请输入>0的金额");
                    } else {
                        this.acceptInvitate(status, this.price);
                    }
                } else {
                    this.acceptInvitate(status, this.testInviteData);
                }

            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../epibol/projectManage/style/listStyle.less";
</style>
