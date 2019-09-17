<template>
    <div style="height: 90%">
        <template v-if="inviteData&&inviteData.length > 0">
            <div class="comInviteListShit">
                <div class="tableHeade">
                   <span>项目名称</span>
                   <span>项目预计费用</span>
                   <span>项目周期</span>
                   <span>受邀公司</span>
                   <span>反馈截止</span>
                   <span>状态</span>
                   <span>操作</span>
                </div>
                <dl>
                    <dd v-for="(item,index) in inviteData" :key="index">
                        <span>{{item.title}}</span>
                        <span>￥{{item.expect_price}}</span>
                        <span>{{item.expect_start_date}} ~ {{item.expect_end_date}}</span>
                        <!-- <i class="icon-msg-o" style="margin-left:10px;font-size:16px;color:#3cd2b4;cursor: pointer;" @click="connect(item.id)"></i> -->
                        <span>{{item.company}}</span>
                        <span>{{item.invite_end_date}}</span>
                        <span>{{item.status_text}}</span>
                        <span>
                            <i class="ivu-icon ivu-icon-clipboard" @click="toDetails(item.id)"></i>
                        </span>
                    </dd>
                </dl>
            </div>

        </template>
        <template v-else>
            <div style="min-height: 720px;position: relative">
                <nothink type="company" text="暂无邀请"></nothink>
            </div>
        </template>
         <!-- 新增邀请面板 -->
        <Modal
            v-model="addInviteModal"
            :title="companyTitle"
            width="800px"
            :footer-hide="footer"
            class="addintives"
            :mask-closable='false'
            >
            <new-invitations ref="addNewinvite" @addInvite="addInvite"></new-invitations>
            <div slot="footer">
                <Button type="text" size="large" @click="cancelInvite">取消</Button>
                <Button type="primary" class="sendBtn" size="large" @click="confirmInvite">确认邀请</Button>
            </div>
        </Modal>
        <Modal
            v-model="detailModal"
            :title="companyTitle"
            width="800px"
            class="addintives"
            :mask-closable='false'
            >
            <invitate-detail ref="inviteDetail"></invitate-detail>
            <div slot="footer" style="text-align: center;margin:0px;border-top: 1px solid transparent !important;padding: 0px;">
                <!-- <Button type="primary" class="sendBtn" size="large" @click="communicate">立即沟通</Button> -->
            </div>
        </Modal>
        <Page v-if="page.total > page.page_size"
              class-name="pageSty"
              :current="page.creentPage"
              :total="page.total"
              :page-size="page.page_size"
              @on-change="onChangePage"
        >
        </Page>
    </div>
</template>
<script>
import newInvitations from "./newInvitations"; // 新增邀请
import invitateDetail from "./invitateDetail"; // 邀请详情
import { invitationApi } from "api";
export default {
    data() {
        return {
            addInviteModal: false,
            detailModal: false,
            companyTitle: "",
            inviteData: [], // 邀请列表
            addInviteData: null, // 新增邀请数据
            footer: false,
            page: {
                total: 0,
                page_size: 20,
                creentPage: 1
            }
        };
    },
    props: ["source", "search"],
    components: {
        newInvitations,
        invitateDetail
    },
    mounted() {
        this.initFun();
    },
    methods: {
    // 页面初始化
        async initFun() {
            let { data } = await invitationApi.invitationInit();
            if (data.err_code == 0) {
                this.invitationList();
        // this.$bus.on("emitCoopData", val => {
        //   this.coopData = val;
        // });
            } else {
                this.$Messages.error(data.err_message);
            }
        },
    // 合作邀请列表
        async invitationList() {
            let params = {
                search: this.search,
                page: this.page.creentPage,
                page_size: this.page.page_size
            };
            let { data } = await invitationApi.invitationData(params);
            if (data.err_code == 0) {
                this.inviteData = data.data;
            } else {
                this.$Message.error(data.err_message);
            }
        },
        onChangePage(page) {
            this.page.creentPage = page;
            this.invitationList();
        },
    // 新增邀请
        newAdd() {
            this.addInviteModal = true;
            this.footer = false;
            this.companyTitle = "新增邀请";
      //   this.$refs.addCoop.coopCompany();
        },
        addInvite(data) {
            this.addInviteData = data;
        },
    // 确认邀请
        async confirmInvite() {
            if (!this.addInviteData.name) {
                this.$Message.error("请输入项目名称!");
            } else if (!this.addInviteData.expect_price) {
                this.$Message.error("请输入预计金额!");
            } else if (isNaN(this.addInviteData.expect_price)) {
                this.$Message.error("金额必须为数字");
            } else if (this.addInviteData.expect_price <= 0) {
                this.$Message.error("金额不能小于0");
            } else if (
        !this.addInviteData.expect_start_time ||
        !this.addInviteData.expect_end_time
      ) {
              this.$Message.error("请选择项目预计周期!");
          } else if (!this.addInviteData.invite_end_time) {
            this.$Message.error("请选择反馈截止时间!");
        } else {
            let nowDate = new Date().getTime();
            let endTime = new Date(this.addInviteData.invite_end_time).getTime();
            if (endTime <= nowDate) {
              this.$Message.error("反馈截止时间必须大于今天!");
          } else {
              if (!this.addInviteData.invite) {
                  this.$Message.error("请选择邀请公司!");
              } else {
                  let { data } = await invitationApi.addInvitationData(
              this.addInviteData
            );
                  if (data.err_code == 0) {
                      this.$Message.success("发送成功!");
                      this.invitationList();
                      this.cancelInvite();
                  } else {
                      this.$Message.error(data.err_message);
                  }
              }
          }
        }
        },
    // 取消邀请
        cancelInvite() {
            this.page.creentPage = 1;
            this.addInviteModal = false;
            this.$refs.addNewinvite.clearData();
        },
    // 邀请详情
        toDetails(id) {
            this.detailModal = true;
            this.companyTitle = "邀请详情";
            this.$nextTick(function() {
                this.$refs.inviteDetail.inviteDetailInfo(id);
            });
        },
    // 立即沟通
        // communicate() {
        //     this.detailModal = false;
        //     console.log("立即沟通");
        // },
        // connect() {}
    }
};
</script>

<style lang="less">
// 引用的是招投标的表格样式
@import "../../../customer/epibolCompany/style/tableStyle.less";
</style>