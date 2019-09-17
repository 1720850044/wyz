<template slot="detailsLeft">
  <div style="position: relative;">
      <div class="detailsLeftBlock" style="margin-top:20px;">
          <dl v-if="testTaskData">
              <dt class="Task-detail-name">
                  <p><i class="icon-project-square"></i>{{testTaskData.test_name || '暂无'}}</p>
              </dt>
              <dt class="Task-detail-tips">
                  <p>任务发布于：{{testTaskData.bid_end_time || '暂无'}}</p>
                  <span>类型：{{testTaskData.task_type || '暂无'}}</span>
              </dt>
              <table  width="800" border="0" cellpadding="0" cellspacing="0" class="tableSty">
                  <tr>
                      <td colspan="2" class="title"><p>项目预计</p></td>
                  </tr>
                  <tr class="expectInfo">
                      <td><span>预计金额：</span><em>￥</em><span class="price">{{testTaskData.expect_price || '0.00'}}</span></td>
                      <td><span>预计周期：</span>{{testTaskData.project_start_time || '暂无'}} ~ {{testTaskData.project_end_time || '暂无'}}</td>
                  </tr>
                  <tr>
                      <td colspan="2"  class="title"><p>招标任务信息</p></td>
                  </tr>
                  <tr class="expectInfo">
                      <td v-if="testTaskData.test_price"><span>测试费用：</span><em>￥</em><span class="price">{{testTaskData.test_price}}</span></td>
                      <td v-if="!testTaskData.test_price"><span>测试费用：</span><em></em>{{'服务商报价'}}</td>
                      <td><span>测试截稿：</span>{{testTaskData.submit_time || '暂无'}}</td>
                  </tr>
                  <tr class="expectInfo">
                      <td><span>稿件规格：</span>{{testTaskData.spec || '暂无'}}</td>
                      <td><span>稿件格式：</span>{{testTaskData.format || '暂无'}}</td>
                  </tr>
                  <tr class="expectInfo">
                      <td style="padding-bottom: 0px !important;"><span>测试数量：</span>{{testTaskData.num || '暂无'}}</td>
                  </tr>
              </table>
              <dt class="explain">任务补充说明</dt>
              <dd class="explain-sty">
                  <p>{{testTaskData.description || '暂无'}}</p>
              </dd>
              <dt class="enclosure">参考附件</dt>
              <dd class="enclosure-sty">
                    <ul class="filesDown" v-if="testTaskData.file && testTaskData.file.length > 0">
                        <li v-for="(item,index) in testTaskData.file" :key="index">
                            <a :href="item.file_url+'?response-content-type=application%2Foctet-stream'" download>{{item.name}} <i class="icon iconfonts icon-xiazai" style="color:#3cd2b4;margin-left:5px;"></i></a>
                        </li>
                    </ul>
                    <span v-else style="color: #777;font-size:12px;">暂无</span>
              </dd>
          </dl>
      </div>
      <div class="footer" style="position: absolute;right: 0px;">
          <Button type="ghost" @click="preFun">上一步</Button>
          <Button type="primary" @click="publishTestTask">立即发布</Button>
      </div>
  </div>
</template>
<script>
import { testTaskApi } from "api";
export default {
    data() {
        return {
            testTaskData: null,
            acc_token: null
        };
    },
    props: {
        params: {
            type: Object
        },
        status: {
            type: String
        }
    },
    components: {},
    mounted() {
        this.testTaskData = this.params;
        if (this.params.task_type == 1) {
            this.testTaskData.task_type = "原画";
        } else if (this.params.task_type == 8) {
            this.testTaskData.task_type = "UI";
        } else if (this.params.task_type == 10) {
            this.testTaskData.task_type = "图标";
        } else if (this.params.task_type == 12) {
          this.testTaskData.task_type = "角色";
      } else if (this.params.task_type == 18) {
        this.testTaskData.task_type = "2D场景";
    } else if (this.params.task_type == 25) {
        this.testTaskData.task_type = "动作";
    } else if (this.params.task_type == 32) {
        this.testTaskData.task_type = "特效";
    } else if (this.params.task_type == 39) {
        this.testTaskData.task_type = "2D模型";
    } else if (this.params.task_type == 40) {
        this.testTaskData.task_type = "3D场景";
    } else if (this.params.task_type == 41) {
        this.testTaskData.task_type = "3D模型";
    } else if (this.params.task_type == 42) {
        this.testTaskData.task_type = "次时代模型";
    } else if (this.params.task_type == 43) {
        this.testTaskData.task_type = "次时代场景";
    }
    },
    created() {},
    methods: {
    // 上一步
        preFun() {
            this.$emit("pre");
        },
    // 发布测试任务
        publishTestTask() {
            let _this = this;
            let params = this.params;
            this.$bus.emit("todoSth", this.params); //params是传递的参数
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
        padding-bottom: 10px;
        border-bottom: 1px dashed #d8d8d8;
      }
      &:nth-child(3) {
        padding-top: 0 !important;
      }
      &.Task-detail-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-size: 20px;
          color: #222;
          .icon-project-square {
            padding-right: 5px;
            color: #bdbdbd;
          }
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
        width: 62%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: #bdbdbd;
        padding-top: 0 !important;
        margin-top: 12px;
        margin-bottom: 40px;
      }
      &.project-info {
        margin-bottom: 15px;
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
        height: 400px;
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ececec;
        border-radius: 3px;
        background: #fbfbfb;
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
      .refurenceTab {
        padding: 20px 0;
        span {
          background: #f3f2f2;
          display: inline-block;
          padding: 5px 10px;
          border: 1px solid #f3f2f2;
          border-radius: 3px;
          font-size: 12px;
          color: #c5c5c5;
          margin-right: 15px;
          margin-bottom: 10px;
          cursor: pointer;
          &.selectedSty {
            border: 1px solid @base;
            background: @white;
            color: @base;
          }
          .preview-file {
            display: block;
            float: right;
            margin: 0 0 0 10px;
            border-left: 1px solid @base;
            padding: 0 0 0 6px;
            color: @base;
          }
        }
      }
      // button {
      //   background: @base;
      //   color: @white;
      //   border-radius: 3px;
      //   padding: 6px 20px;
      //   border: 0;
      //   //   margin-top: 20px;
      //   outline: none;
      //   cursor: pointer;
      // }
    }
    // .amount-money {
    //   display: flex;
    //   width: 60%;
    //   justify-content: space-between;
    //   p {
    //     margin-top: 15px;
    //     font-size: 14px;
    //     color: #777;
    //     .money {
    //       color: #3bceb6;
    //       font-size: 18px;
    //       em {
    //         font-size: 14px;
    //         font-style: normal;
    //       }
    //     }
    //   }
    // }
    // .requirement {
    //   display: flex;
    //   width: 54%;
    //   justify-content: space-between;
    //   p {
    //     margin-top: 15px;
    //     font-size: 14px;
    //     color: #777;
    //   }
    // }
    // .number {
    //   p {
    //     margin-top: 15px;
    //     font-size: 14px;
    //     color: #777;
    //   }
    // }
    .explain,
    .enclosure {
      margin-bottom: 26px;
    }
    .explain-sty {
      p {
        margin-top: 15px;
        width: 100%;
        height: auto;
        word-wrap: break-word;
        word-break: break-all;
        font-size: 14px;
        color: #777;
      }
    }
    .enclosure-sty {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

