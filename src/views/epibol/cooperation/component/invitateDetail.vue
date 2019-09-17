<template>
    <div>
        <div class="detailsLeftBlock" v-if="inviteDetails">
            <dl>
                <dt class="Task-detail-name">
                    <h2>{{inviteDetails.title}}</h2>
                </dt>
                <dt class="Task-detail-tips">
                    <p class="expectDate">邀请反馈时间：{{inviteDetails.invite_end_date}}</p>
                </dt>
                <dt>项目基础信息</dt>
                <dd class="basicInfo">
                    <p>项目预计金额：￥<span style="font-size:18px;color:#3bceb6">{{inviteDetails.expect_price}}</span></p>
                    <p>项目预计周期：<span>{{inviteDetails.expect_start_date}} ~ {{inviteDetails.expect_end_date}}</span></p>
                </dd>
                <dt v-if="inviteDetails.resource && inviteDetails.resource.length >0">项目详细信息</dt>
                <dd v-if="inviteDetails.resource && inviteDetails.resource.length >0">
                    <div class="comInviteListShit" style="margin-top: 10px;">
                        <div class="tableHeade" style="border: 1px solid #efefef;border-right: 1px solid #efefef;">
                          <span>资源名称</span>
                          <span>资源类型</span>
                          <span>资源数量</span>
                          <span>预计费用</span>
                        </div>
                        <dl v-for="(item,index) in inviteDetails.resource" :key="index">
                            <dd style="border-left: 1px solid #efefef;border-right: 1px solid #efefef">
                                <span>{{item.name}}</span>
                                <span>{{item.ability_name}}</span>
                                <span>{{item.num}}</span>
                                <span>{{item.price}}</span>
                            </dd>
                        </dl>
                    </div>
                </dd>
                <dt>邀请反馈</dt>
                <dd class="feedback">
                    <p><span>{{inviteDetails.invite_company}}</span></p>
                    <p v-if="inviteDetails.status === '0'"><span style="color:#FF9800">{{inviteDetails.status_text}}</span></p>
                    <p v-if="inviteDetails.status === '1'"><span style="color:#3bceb6">{{inviteDetails.status_text}}</span></p>
                    <p v-if="inviteDetails.status === '2'"><span style="color:#FF9800">{{inviteDetails.status_text}}</span></p>
                </dd>
            </dl>
        </div>
        <template v-else>
            <div style="min-height: 720px;position: relative">
                <nothink type="company" text="暂无邀请"></nothink>
            </div>
        </template>
    </div>
</template>
<script>
import { invitationApi } from "api";
export default {
    data() {
        return {
            inviteDetails: null
        };
    },
    methods: {
    // 获取邀请详情
        async inviteDetailInfo(id) {
            let { data } = await invitationApi.cooperationInvitationDetail({ id: id });
            if (data.err_code == 0) {
                this.inviteDetails = data.data;
            } else {
                this.$Message.error(data.err_message);
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import "../../../customer/epibolCompany/style/tableStyle.less";
.detailsLeftBlock {
  dl {
    dt {
      font-size: 16px;
      color: #222;
      margin-top: 40px;
      &:nth-child(1),
      &:nth-child(2) {
        margin-top: 0px !important;
      }
      h2 {
        font-size: 18px;
        color: #222;
        padding-bottom: 20px;
        margin-bottom: 18px;
        border-bottom: 1px dashed #d8d8d8;
      }
    }
    .Task-detail-tips {
      .expectDate {
        font-size: 13px;
        color: #bdbdbd;
      }
    }
    .basicInfo,
    .feedback {
      display: flex;
      width: 68%;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 14px;
        color: #777777;
        margin-top: 30px;
      }
    }
    .feedback {
      width: 35%;
    }
  }
}
</style>

