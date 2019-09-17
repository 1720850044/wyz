<template>
    <div style="height: 90%">
        <template v-if="loadingFlag">
            <div style="height: 720px">
                <loading></loading>
            </div>
        </template>
        <template v-else-if="!loadingFlag && (intivesData && intivesData.length > 0)">
            <div class="comInviteListShit">
                <div class="tableHeade">
                   <span>项目名称</span>
                   <span>项目预计金额</span>
                   <span>项目时间</span>
                   <span>已反馈/已邀请</span>
                   <span>反馈截止</span>
                   <span>状态</span>
                   <span>操作</span>
                </div>
                <dl>
                    <dd v-for="item in intivesData" :key="item.id">
                        <span>{{item.project_name}}</span>
                        <span>￥{{item.project_max_price}}</span>
                        <span>{{item.start_time}} ~ {{item.end_time}}</span>
                        <span>{{item.feedback_num}} / {{item.invite_num}}</span>
                        <span>{{item.join_end_time}}</span>
                        <span>{{item.status_text}}</span>
                        <span>
                            <i @click="details(item.id)" class="ivu-icon ivu-icon-clipboard"></i>
                            <!--<i @click="details(item.id)">详情</i>-->
                        </span>
                    </dd>
                </dl>
            </div>

        </template>
        <template v-else-if="!loadingFlag && intivesData.length == 0">
            <div style="min-height: 720px;position: relative">
                <nothink type="company" text="暂无邀请"></nothink>
            </div>
        </template>
         <!-- Modal组件 -->
        <Modal
            v-model="applModal"
            :title="companyTitle"
            width="800px"
            :footer-hide="footer"
            class="addintives"
            >
            <emit-invite ref="addCoop" @emitInvite="emitInvite"></emit-invite>
            <div slot="footer">
                <Button type="text" size="large" @click="companyCancel">取消</Button>
                <Button type="primary" class="sendBtn" size="large" @click="companyOk">发送邀请</Button>
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
import emitInvite from "./emitInvite";
import {companyInviteApi} from 'api';
export default {
    data() {
        return {
            applModal: false,
            companyTitle: "",
            intivesData: [],
            footer: false,
            page: {
                total: 0,
                page_size: 20,
                creentPage: 1
            },
            loadingFlag: true
        };
    },
    props: {
        intivesearch: {
            type: String
        }
    },
    components: {
        emitInvite: emitInvite
    },
    mounted() {
        this.companyInvite(true);
    },
    methods: {
        emitInvite(data){
            this.inviteData = data;
        },
      // 外包邀请列表
        async companyInvite(type){
            let params = {
                demand_id: 1,
                search: this.intivesearch,
                page: type ? this.page.creentPage : 1,
                page_size: this.page.page_size
            };
            let {data} = await companyInviteApi.inviteList(params);
            if (data.err_code == 0){
                this.loadingFlag = false;
                this.intivesData = data.data;
                this.page.total = parseInt(data.page.count);
            } else {
                this.loadingFlag = false;
            }
        },
        onChangePage(page){
            this.page.creentPage = page;
            this.companyInvite(true);
        },
    // 新增邀请
        newAdd() {
            this.applModal = true;
            this.footer = false;
            this.companyTitle = "增加邀请";
            this.$refs.addCoop.coopCompany();
        },
    // 详情
        details(id) {
            this.applModal = true;
            this.footer = true;
            this.companyTitle = "邀请详情";
            this.$nextTick(function () {
                this.$refs.addCoop.companyListInfo(id);
            });
        },
    // 发送邀请
        async companyOk() {
            let obj = this.inviteData;
            if (!obj.project_name) {
                this.$Message.error("请输入项目名称!");
            } else if (!obj.project_max_price) {
                this.$Message.error("请输入预计金额!");
            } else if (isNaN(obj.project_max_price)) {
                this.$Message.error("金额必须为数字");
            } else if (obj.project_max_price <= 0) {
                this.$Message.error("金额不能小于0");
            } else if (!obj.start_time || !obj.end_time) {
                this.$Message.error("请选择项目研发时间!");
            } else if (!obj.join_end_time) {
                this.$Message.error("请选择反馈截止时间!");
            } else {
                let nowDate = new Date().getTime();
                let endTime = new Date(obj.join_end_time).getTime();
                if (endTime <= nowDate){
                    this.$Message.error("反馈截止时间必须大于今天!");
                } else {
                    if (!obj.invite_company) {
                        this.$Message.error("请选择邀请公司!");
                    } else {
                        let {data} = await companyInviteApi.addInvite(obj);
                        if (data.err_code == 0){
                            this.$Message.success("发送成功!");
                            this.companyCancel();
                            this.companyInvite(true);
                        } else {
                            this.applModal = true;
                        }
                    }
                }
            }
        },
    // 关闭邀请
        companyCancel() {
            this.page.creentPage = 1;
            this.$bus.emit("inviteSuccess");
            this.$refs.addCoop.clearData();
            this.applModal = false;
        }
    }
};
</script>

<style lang="less">
@import "../style/tableStyle.less";
.ivu-modal-body{
    padding: 15px 30px;
}
.ivu-modal-footer{
    margin-right: 15px;
    padding-bottom: 30px;
}
.ivu-page-item-jump-next:after, .ivu-page-item-jump-prev:after {
    display: inline-block;
}
.pageSty{
    margin-top: 10px;
    text-align: center;
    margin-bottom: 30px;
}
.addintives{
    .sendBtn:hover{
        background: #35ab93 !important;
    }
}
</style>

