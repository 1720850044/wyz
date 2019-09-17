<template>
  <div class="oneStep">
    <div class="oneStepContent">
        <div class="leftStep">
            <p class="operationStep">操作步骤</p>
            <span class="operationTips">按照系统模板编写，批量导入更精准</span>
            <Steps direction="vertical">
                <Step title="下载标准模板"><Button type="ghost" icon="ios-cloud-download-outline" style="font-size:12px;" @click="downloadTemplate">点击下载</Button></Step>
                <Step title="上传成员模板文件"></Step>
                <Step title="成功导入"></Step>
            </Steps>
        </div>
        <div class="rightContent">
            <!-- <h3>请上传任务excel文件</h3> -->
            <span style="display:none">{{fcert}}</span>
            <div class="text">
                <p class="fileName" v-if="file !== null">{{ file.name }}</p>
                <div v-else class="textContet">
                    <Upload :action="uploadUrl" :data="{'cert': fcert}" name="file" :show-upload-list="false" :on-format-error="formatError" :on-progress="handleUpload" :on-success="uploadSuccess" :on-error="uploadFail" accept="xls,xlsx" :format="['xls','xlsx']">
                        <!--<Button type="ghost" icon="ios-cloud-upload-outline">选择批量导入文件</Button>-->
                        <button>选择批量导入文件</button>
                        <p>支持office编辑xlsx/xls 格式文档</p>
                    </Upload>
                    <!--  -->
                </div>
            </div>
        </div>
    </div>
    <Button class="anaBtn" type="primary" @click="analysisExcel()" :disabled='file==null'>下一步</Button>
    <div class="popUp" v-if="loadingStatus">
      <Spin size="large" class="spinSty"></Spin>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
    name: "ExcelUpload",
    data() {
        return {
            file: null,
            loadingStatus: false,
            showAddNew: false,
            header: {},
            fileId: 0,
            projectId: sessionStorage.getItem("projectID"),
            token: localStorage.token,
            uploadType: "task"
        };
    },
    props: {
        fcert: {
            type: String,
            default: ""
        }
    },
    computed: {
        uploadUrl() {
            let baseURL = window.location.host.indexOf("banbooyun.com") !== -1 ? window.location.protocol + "//" + window.location.host : "https://dev.banbooyun.com";
            let base = baseURL + '/' + this.GLOBAL.baseRouter;
            return base + this.$GLOBALAPI.file_file_upload;
        }
    },
    methods: {
        formatError(event) {
            if (event.type != "xls" || event.type != "xlsx") {
                this.$Message.warning("上传文件格式错误！");
            }
        },
        handleUpload(event, file) {
            this.file = file;
            this.loadingStatus = true;
            return false;
        },
        uploadSuccess(res, file) {
            this.loadingStatus = false;
            this.fileId = res.file.fid;
            sessionStorage.analysisFileId = res.file.fid;
            return false;
        },
        uploadFail(error, file) {
            this.loadingStatus = false;
            return false;
        },

    /**
     * 解析excel
     */
        analysisExcel() {
            this.$emit("next");
        },
    // 下载标准模板
        downloadTemplate() {
            let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_excel_template;
            let hostName = Cookies.get("hostName");
            let download =
        hostName +
        "/" +
        url +
        "&token=" +
        this.token +
        "&type=" +
        this.uploadType +
        "&project_id=" +
        this.projectId;
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = download;
            a.click(); //点击触发下载
        }
    }
};
</script>
<style lang="less">
.ivu-upload-list {
  position: absolute;
  margin: 0;
  top: -5px;
  left: -655px;
  width: 100%;
}
.leftStep {
  .ivu-steps {
    margin-top: 35px;
    .ivu-steps-item {
      .ivu-steps-tail {
        i {
          background-color: #bcbcbc;
        }
      }
      .ivu-steps-head {
        background-color: #f2f2f2;
        .ivu-steps-head-inner {
          border-color: #ffcc00;
          background-color: #ffcc00;
          span {
            color: #212121;
          }
        }
      }
      .ivu-steps-main {
        min-height: 100px;
        .ivu-steps-title {
          color: #999;
          background-color: #f2f2f2;
        }
        .ivu-btn-ghost {
          color: @base_active;
          background-color: #fff;
          border-color: @base_active;
          border-radius: 6px;
          vertical-align: baseline;
          padding: 5px 10px;
        }
      }
    }
  }
}
.textContet {
  .ivu-upload {
    text-align: center;
    .ivu-upload-select {
      padding: 35px 65px;
      &:hover {
        cursor: pointer;

      }
    }
    .ivu-btn {
      color: #48c5b5;
      border-color: #48c5b5;
      span {
        font-size: 14px;
      }
    }
    button {
      border: 1px solid transparent;
      background: transparent;
      color: @base;
      // padding: 5px 10px;
      // border-radius: 3px;
      // outline: none;
    }
    p {
      color: @black_3;
      /*margin: 20px 0px 0px 40px;*/
    }
  }
}
</style>
<style lang="less" scoped>
.oneStep {
  margin-top: -9px;
  .oneStepContent {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 30px 0px;
    .leftStep {
      width: 40%;
      padding: 30px;
      background: #f2f2f2;
      margin-right: 16px;
      .operationStep {
        margin-bottom: 15px;
        font-size: 16px;
        color: @black_1;
      }
      .operationTips {
        color: @black_3;
      }
    }
    .rightContent {
      width: 60%;
      background: #f2f2f2;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
      }
    }
  }
  .popUp {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
}

// .ivu-upload{
//   width: 100px;
//   position: absolute;
//   top: 0;
//   right: 0;
// }
.text {
  position: relative;
  border: 1px dashed @base_active;
  border-radius: 4px;
  .fileName {
    margin: 45px 65px;
    font-size: 14px;
    color: @base_active;
  }
}
.uploadBtn {
  position: absolute;
  left: 10px;
  bottom: 0;
  z-index: 10;
  /* display: none; */
}
.anaBtn {
  position: absolute;
  right: 30px;
  // bottom: 10px;
  z-index: 10;
  margin-bottom: 20px;
}
</style>
