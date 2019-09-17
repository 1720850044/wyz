<template>
    <div class="detailsLeftBlock">
        <dl v-if="inviteDetailData">
            <dt class="Task-detail-name">
                <h2>{{inviteDetailData.title}}</h2>
            </dt>
            <dt class="Task-detail-tips">
                <p>邀请反馈时间：{{inviteDetailData.invite_end_date}}</p>
            </dt>
            <dt>项目基础信息</dt>
            <dd class="basicInfo">
                <p>项目预计金额：<span>￥<em>{{inviteDetailData.expect_price}}</em></span></p>
                <p>项目预计周期：<span>{{inviteDetailData.expect_start_date}} ~ {{inviteDetailData.expect_end_date}}</span></p>
            </dd>
            <!-- v-if="inviteDetailData.resource && inviteDetailData.resource.length>0" -->
            <dt class="detailInfoTitle" v-if="inviteDetailData.resource && inviteDetailData.resource.length>0">项目详细信息</dt>
            <dd class="detailInfo" v-if="inviteDetailData.resource && inviteDetailData.resource.length>0"> 
                <div class="comInviteListShit" style="margin-top: 10px;">
                    <div class="tableHeade" style="border: 1px solid #efefef;border-right: 1px solid #efefef;">
                    <span>资源名称</span>
                    <span>资源类型</span>
                    <span>资源数量</span>
                    <span>预计费用</span>
                    </div>
                    <dl v-for="(item,index) in inviteDetailData.resource" :key="index">
                        <dd style="border-left: 1px solid #efefef;border-right: 1px solid #efefef">
                            <span>{{item.name}}</span>
                            <span>{{item.ability_name}}</span>
                            <span>{{item.num}}</span>
                            <span>{{item.price}}</span>
                        </dd>
                    </dl>
                </div>
            </dd>
            <dt class="Task-detail-inviter">邀请方</dt>
            <dd>
              <!-- <i class="icon-msg-o" style="margin-left:5px;font-size:16px;color:#3cd2b4;cursor: pointer;"></i> -->
                <p style="font-size: 14px;color: #777;">{{inviteDetailData.company}}</p>
            </dd>
        </dl>
    </div>
</template>
<script>
import { projectInviteApi } from "api";
export default {
    data() {
        return {
            inviteDetailData: null
        };
    },
    methods: {
    // 页面初始化
        async inviteDtailInfo(id) {
            let { data } = await projectInviteApi.projectInviteDetail({ id: id });
            if (data.err_code == 0) {
                this.inviteDetailData = data.data;
            } else {
                this.$Messages.error(data.err_message);
            }
        }
    }
};
</script>
<style lang="less" scoped>
.detailsLeftBlock {
  dl {
    dt {
      font-size: 16px !important;
      color: #222;
      padding-top: 45px;
      &:first-child {
        padding-top: 0 !important;
        padding-bottom: 20px;
        border-bottom: 1px dashed #d8d8d8;
      }
      &:nth-child(3) {
        padding-top: 0 !important;
      }
      &.Task-detail-name {
        h2 {
          font-size: 18px;
          color: #222;
        }
      }
      &.Task-detail-tips {
        font-size: 13px !important;
        color: #bdbdbd;
        padding-top: 0 !important;
        margin-top: 18px;
        margin-bottom: 40px;
      }
      &.Task-detail-inviter {
        margin-bottom: 30px;
      }
    }
    .basicInfo {
      width: 70%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        margin-top: 30px;
        font-size: 14px;
        color: #777;
        span {
          em {
            font-style: normal;
            font-size: 18px;
            color: #3bceb6;
          }
        }
      }
    }
    .detailInfoTitle{
      margin-bottom: 30px;
    }
    .detailInfo {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .tableHeade {
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
        span {
          flex: 1;
          text-align: center;
          &:first-child {
            text-align: left;
            padding-left: 20px;
            flex: 1;
          }
          &:last-child {
            text-align: right;
            padding-right: 20px;
          }
        }
      }
      dl {
        overflow: auto;
        height: 100%;
      }
      dd {
        text-align: center;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f3f3f3;
        background: #fff;
        margin: 0;
        color: @black_2;
        font-size: 13px;
        font-family: @ff;
        font-weight: lighter;
        height: 60px;
        line-height: 60px;
        overflow: hidden;
        span {
          flex: 1;
          text-align: center;
          &:first-child {
            text-align: left;
            padding-left: 20px;
            flex: 1;
          }
          &:last-child {
            text-align: right;
            padding-right: 20px;
          }
        }
        i,
        em {
          font-style: normal;
        }
      }
    }
  }
}
</style>
