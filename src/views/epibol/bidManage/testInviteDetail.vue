<template slot="detailsLeft">
    <div class="detailsLeftBlock">
        <dl v-if="inviteDetailData">
            <dt class="Task-detail-name">
                <p class="title">{{inviteDetailData.title}}</p>
            </dt>
            <dt class="Task-detail-tips">
                <p>任务发布于：{{inviteDetailData.create_date}}</p>
                <span>类型：{{inviteDetailData.ability}}</span>
            </dt>
            <table  width="800" border="0" cellpadding="0" cellspacing="0" class="tableSty">
                <tr>
                    <td colspan="2" class="title"><p>项目预计</p></td>
                </tr>
                <tr class="expectInfo">
                    <td><span>预计金额：</span><em>￥</em><span class="price">{{inviteDetailData.expect_price || '0.00'}}</span></td>
                    <td><span>预计周期：</span>{{inviteDetailData.project_start_date || '暂无'}} ~ {{inviteDetailData.project_end_date || '暂无'}}</td>
                </tr>
                <tr>
                    <td colspan="2"  class="title"><p>招标任务信息</p></td>
                </tr>
                <tr class="expectInfo">
                    <td v-if="inviteDetailData.test_price"><span>测试费用：</span><em>￥</em><span class="price">{{inviteDetailData.test_price}}</span></td>
                    <td v-if="!inviteDetailData.test_price"><span>测试费用：</span><em></em>{{'服务商报价'}}</td>
                    <td><span>测试截稿：</span>{{inviteDetailData.end_date || '暂无'}}</td>
                </tr>
                <tr class="expectInfo">
                    <td><span>稿件规格：</span>{{inviteDetailData.spec || '暂无'}}</td>
                    <td><span>稿件格式：</span>{{inviteDetailData.format || '暂无'}}</td>
                </tr>
                <tr class="expectInfo">
                    <td style="padding-bottom: 0px !important;"><span>测试数量：</span>{{inviteDetailData.resource_num || '暂无'}}</td>
                </tr>
            </table>
            <dt style="margin-bottom:26px;">任务补充说明</dt>
            <dd>
                <p style="margin-top: 15px">{{inviteDetailData.description || '暂无说明'}}</p>
            </dd>
            <dt style="margin-bottom:26px;">参考附件</dt>
            <dd>
                <div class="refurenceFile" v-if="inviteDetailData.file">
                    <p class="uploadFileSty" v-for="(item,index) in JSON.parse(inviteDetailData.file)" :key="index">
                        <a :href="item.file_url+'?response-content-type=application%2Foctet-stream'" download>
                            {{item.name}}
                            <i class="icon iconfonts icon-xiazai" style="color:#3cd2b4;margin-left:5px;"></i>
                        </a>
                    </p>
                </div>
                <div class="file-is-empty" v-else>
                    <p>暂无附件</p>
                </div>
            </dd>
            <dd style="margin-bottom: 10px;" v-if="!inviteDetailData.test_price">
                <Input v-model="priceValue" placeholder="立即报价" style="width: 100%" @on-change="getValue" :maxlength='8'></Input>
            </dd>
            <dd style="text-align: center;margin-bottom: -10px;">
                <p>{{inviteDetailData.last_time}}后报名截止</p>
            </dd>
        </dl>
    </div>
</template>
<script>
import { testInviteApi } from "api";

export default {
  data() {
    return {
      inviteDetailData: null,
      priceValue: null
    };
  },
  methods: {
    async inviteDtailInfo(id) {
      let { data } = await testInviteApi.testInviteDetail({ id: id });
      if (data.err_code == 0) {
        this.inviteDetailData = data.data;
      } else {
        this.$Messages.error(data.err_message);
      }
    },
    getValue() {
      this.$emit("listenToChild", this.priceValue);
    }
  }
};
</script>
<style lang="less" scoped>
.detailsLeftBlock {
  dl {
    dt {
      font-size: 18px;
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 20px;
          color: #222;
        }
        span {
          font-size: 12px;
          color: #d8d8d8;
          i {
            font-style: normal;
            font-size: 16px;
            color: @base;
          }
        }
      }
      &.Task-detail-tips {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: #9e9e9e;
        padding-top: 0 !important;
        margin-top: 12px;
        margin-bottom: 40px;
      }

      .download-files-btn {
        margin-left: 20px;
        font-size: 12px;
        display: block;
        float: right;
        padding: 2px 15px;
        color: #999;
        border: 1px solid #cfcfcf;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -ms-transition: all 0.3s;
        -o-transition: all 0.3s;
        transition: all 0.3s;
        &:hover {
          color: @base;
          border-color: @base;
        }
      }
    }
    dd {
      .refurenceFile {
        position: relative;
        width: 100%;
        min-height: 120px;
        margin-top: 30px;
        display: flex;
        // align-items: center;
        // justify-content: center;
        border-radius: 3px;
        // background: #fbfbfb;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      .file-is-empty {
        position: relative;
        /*padding: 20px 0;*/
        margin: 20px 0 30px;
        width: 100%;
        // height: 310px;
      }
      p {
        font-size: 14px;
        color: #777;
      }
    }
    .tableSty {
      .title {
        padding-bottom: 30px;
        font-size: 18px;
        color: #222;
      }
      .expectInfo {
        td {
          font-size: 14px;
          color: #777;
          padding-bottom: 25px;
          em {
            font-style: normal;
            font-size: 14px;
            color: #3bceb6;
          }
          .price {
            font-size: 18px;
            color: #3bceb6;
          }
        }
      }
    }
  }
}
</style>
