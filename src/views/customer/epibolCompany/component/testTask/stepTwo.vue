<template>
    <div style="position: relative;">
        <div class="addRow">
            <dl style="margin-top: 30px;">
                <dt>稿件规格</dt>
                <dd>
                    <Input v-model="postData.spec" placeholder="输入测试任务稿件规格，例：1920 x 1080"></Input>
                </dd>
            </dl>
            <dl>
                <dt>稿件格式</dt>
                <dd>
                    <Input v-model="postData.format" placeholder="输入测试任务格式，例：JPG、PNG、3DS等"></Input>
                    <!-- <p style="height: 32px;line-height: 32px;margin-top: 5px; color: #3bceb6;">稿件类型包括：图片、视频和3D模型</p> -->
                </dd>
            </dl>
            <dl>
                <dt>测试稿件数量</dt>
                <dd>
                    <Input v-model="postData.num" placeholder="输入测试稿件数量"></Input>
                </dd>
            </dl>
            <dl style="position: relative;">
                <dt>稿件要求补充说明</dt>
                <dd>
                    <Input v-model="postData.description" type="textarea" placeholder="输入补充说明内容..." style="font-size: 12px"
                           :autosize="{minRows: 9,maxRows: 9}" :maxlength="500"
                           @keyup.native="calculationWords()"></Input>
                    <label class="enter-desc-counts"
                           style=" font-size: 12px;position: absolute;bottom: 2px;right: 10px;color: #dbdbdb;"><a
                        style="color: #dbdbdb;">{{enterWordCount}}</a><span>/</span><a
                        style="color: #dbdbdb;">500</a></label>
                </dd>
            </dl>
            <dl style="margin-bottom: 85px;">
                <dt>参考附件</dt>
                <dd style="display: flex;justify-content: space-between;align-items: center">
                    <ul class="listP" v-if="uploadFile && uploadFile.length > 0">
                        <li v-for="(item,index) in uploadFile" :key="index">{{item.name}}<i class="icon-sourceDel" @click="deleteViewFile(item)"></i></li>
                    </ul>
                    <div>
                        <general-upload :showOtherInfos="showOtherInfos" :initParams="initParams" ></general-upload>
                    </div>
                </dd>
            </dl>
        </div>
        <div class="footer" style="position: absolute;right: 0px;">
            <Button type="ghost" @click="preFun">上一步</Button>
            <Button type="primary" @click="nextFun">下一步</Button>
        </div>
        <!-- 删除上传文件 -->
          <Modal v-model="deleteFileModel" title="删除参考附件" width="350px" @on-ok="deleteFile">
            <p style="font-size: 15px">您确定要删除该文件吗？</p>
        </Modal>
    </div>
</template>

<script>
import GeneralUpload from "../../../../../components//uploadAndPreview/generalUpload";

export default {
  data() {
    return {
      enterWordCount: 0,
      initParams: {
          definedBtnStyle: 'margin:0;width:auto;',
          definedIconStyle: {

          },
          smallBtnText: '上传附件'
      },
      showOtherInfos: {
        fieldLabel: false,
        styleLabel: false,
        fileDescribe: false
      },
      postData: {
        spec: null, //稿件规格
        format: null, // 稿件格式
        description: null, // 测试任务补充说明
        num: null //稿件数量
      },
      uploadFile: null,
      uploadCallbackData: {
        id2: "browse2",
        callbackData2: []
      },
      deleteFileModel:false,
      delFile: null,
    };
  },
  props: {
    stepTwoData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    GeneralUpload
  },
  updated() {
    this.postData.file = this.uploadFile;
  },
  mounted() {
    /* 上传成功回调 */
    this.$bus.$on("confirmUpload", obj => {
      let fileList = obj.response;
      //3D文件后缀去重
      fileList.forEach(function(creent) {
        if (creent.fileType === "3d") {
          var strindex = creent.file_url;
          var arr = strindex.split(".");
          var SuffixName = strindex.split(".")[arr.length - 1];
          var lastIndex = strindex.lastIndexOf("." + SuffixName);
          creent.file_url = strindex.substring(0, lastIndex);
        }
      });
      let newArr = this.uploadFile ? this.uploadFile : [];
      this.uploadFile = newArr.concat(fileList)
      // this.uploadFile = fileList;
    });
    // 第二步数据赋值
    
    if(this.stepTwoData){
        this.postData = this.stepTwoData;
        this.uploadFile = this.stepTwoData.file;
    }
  },
  methods: {
    //   上一步
    preFun() {
      this.$emit("pre");
      
    },
    // 下一步
    nextFun() {
      this.$emit("next");
      this.$emit("sendiptVal", this.postData, this.uploadFile);
    },
    calculationWords() {
      this.enterWordCount = this.postData.description
        ? this.postData.description.length
        : 0;
    },
    // 删除上传的文件
    deleteViewFile(file) {
      this.deleteFileModel = true
      this.delFile = file
    },
    deleteFile() {
      this.uploadFile.forEach((item, index) => {
        if (item.name === this.delFile.name) {
          this.uploadFile.splice(index, 1)
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
@import "../../style/addEpibolCom.less";

.addRow {
  dl {
    dt {
      width: 88px;
      font-size: 13px;
    }
  }

  .listP {
    max-height: 100px;
    overflow: auto;
    .icon-sourceDel{
      padding-left: 5px;
      &:hover{
        color: @base;
      }
    }
    li {
      padding: 5px 0;
    }
  }
}
</style>
