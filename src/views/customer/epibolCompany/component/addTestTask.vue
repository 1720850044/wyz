<template>
    <div>
        <div class="statusNav">
            <span :class="[nIndex=='0'?'show':'nextshow']">完善项目招标信息</span>
            <span :class="[nIndex=='1'?'show':'',(nIndex=='2'|| nIndex=='3')?'nextshow':'']">完善测试任务详细要求</span>
            <span :class="[nIndex=='2'?'show':'',nIndex=='3'?'nextshow':'']">合作邀请</span>
            <span :class="[nIndex=='3'?'show':'']">招标预览</span>
        </div>
        <div class="clear"></div>
        <div class="addTestTask">
            <div v-if="nIndex==0">
                <template>
                    <div style="position: relative;">
                        <div class="addRow">
                            <dl style="margin-top: 30px;">
                                <dt>测试任务名称</dt>
                                <dd>
                                    <Input v-model="postData.test_name" placeholder="输入任务名称"></Input>
                                </dd>
                            </dl>
                            <dl>
                                <dt>测试任务类型</dt>
                                <dd>
                                    <Select v-model="postData.task_type" style="width:100%" placeholder="请选择任务类型" @on-change="changeSelect">
                                        <Option :value="item.id" :key="index" v-for="(item,index) in abilityList">{{item.name}}</Option>
                                    </Select>
                                </dd>
                            </dl>
                            <dl>
                                <dt v-if="offerFlag.radioStatus == 2">报名截止日期</dt>
                                <dt v-if="offerFlag.radioStatus == 1">报价截止日期</dt>
                                <dd>
                                    <DatePicker type="date" :editable="false" placeholder="点击选择截止日期" style="width: 100%" @on-change="changeEnrollDate" :value="postData.bid_end_time"></DatePicker>
                                </dd>
                            </dl>
                            <dl>
                                <dt>交稿截止日期</dt>
                                <dd>
                                    <DatePicker type="date" :editable="false" placeholder="点击选择交稿截止日期" style="width: 100%" @on-change="changeDate" :value="postData.submit_time"></DatePicker>
                                </dd>
                            </dl>
                            <dl>
                                <dt style="margin-top: 25px">测试费用</dt>
                                <dd class="testTaskPrice">
                                    <RadioGroup v-model="offerFlag.radioStatus">
                                        <Radio label="1">
                                            <span>服务商报价</span>
                                        </Radio>
                                        <Radio label="2">
                                            <span>我方报价</span>
                                        </Radio>
                                    </RadioGroup>
                                    <p v-if="offerFlag.radioStatus == 1" style="height: 32px;line-height: 32px;margin-top: 5px; color: #3bceb6;">测试任务发布成功后，参与投标的服务方报价</p>
                                    <Input v-if="offerFlag.radioStatus == 2" v-model="postData.test_price"  placeholder="测试费用" :maxlength='8' style="margin-top: 5px"></Input>
                                </dd>
                            </dl>
                            <dl>
                                <dt>项目预计金额</dt>
                                <dd>
                                    <Input v-model="postData.expect_price" placeholder="输入项目预计金额" :maxlength='8'></Input>
                                </dd>
                            </dl>
                            <dl>
                                <dt>项目预计周期</dt>
                                <dd>
                                    <DatePicker format="yyyy-MM-dd" type="daterange" :editable="false" placeholder="点击选择项目预计周期"  style="width:100%" :value="postData.expectDate" @on-change="expectCycle"></DatePicker>
                                </dd>
                            </dl>
                        </div>
                        <Button class="anaBtn" type="primary" @click="nextStep()" style="position: absolute;right: 0px;" :disabled='btnDisabled'>下一步</Button>
                    </div>
                </template>

            </div>
            <div v-if="nIndex==1">
                <template>
                    <div style="position: relative;">
                        <div class="addRow">
                            <dl style="margin-top: 30px;">
                                <dt>稿件规格</dt>
                                <dd>
                                    <Input v-model="postData.spec" placeholder="输入测试任务稿件规格，例：1920 x 1080" :maxlength="30"></Input>
                                </dd>
                            </dl>
                            <dl>
                                <dt>稿件格式</dt>
                                <dd>
                                    <Input v-model="postData.format" placeholder="输入测试任务格式，例：JPG、PNG、3DS等" :maxlength="30"></Input>
                                    <!-- <p style="height: 32px;line-height: 32px;margin-top: 5px; color: #3bceb6;">稿件类型包括：图片、视频和3D模型</p> -->
                                </dd>
                            </dl>
                            <dl>
                                <dt>测试稿件数量</dt>
                                <dd>
                                    <Input v-model="postData.num" placeholder="输入测试稿件数量" :maxlength="5"></Input>
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
                            <Button type="ghost" @click="preStep">上一步</Button>
                            <Button type="primary" @click="nextStep">下一步</Button>
                        </div>
                        <!-- 删除上传文件 -->
                          <Modal v-model="deleteFileModel" title="删除参考附件" width="350px" @on-ok="deleteFile">
                            <p style="font-size: 15px">您确定要删除该文件吗？</p>
                        </Modal>
                    </div>
                </template>
            </div>
            <div v-if="nIndex==2">
                <template>
                    <div style="position: relative;">
                        <div class="addRow">
                            <dl style="margin-top: 30px;">
                                <dt>邀请合作企业</dt>
                                <dd>
                                    <ul class="ul">
                                        <li class="checked-all">
                                            <Checkbox v-if="isNullData"
                                            :value="checkAll"
                                            @click.prevent.native="handleCheckAll">全选</Checkbox>
                                            <em>
                                                <Input v-model="postData.searchData" style="width:200px" placeholder="输入公司名称" @keyup.13.native="commitSearch">
                                                    <Button slot="append" icon="ios-search" size='small' @click="commitSearch"></Button>
                                                </Input>
                                            </em>
                                        </li>
                                        <li>
                                            <CheckboxGroup v-model="inviteCompany" @on-change="checkAllGroupChange">
                                                <span class="span" v-for="item in coopListData" :key="item.id">
                                                    <Checkbox :label="item.id">{{item.company}}</Checkbox>
                                                </span>
                                                <span v-if="coopListData && coopListData.length == 0" class="notCompany">暂无可邀请公司</span>
                                            </CheckboxGroup>
                                            <div class="clear"></div>
                                        </li>
                                    </ul>
                                    <div>
                                      <p style="height: 32px;line-height: 32px;color: #3bceb6;"><span style="vertical-align: baseline;">*&nbsp;</span>非必填项，可直接跳过，点击下一步</p>
                                    </div>
                                </dd>
                            </dl>
                            <dl>
                                <dt style="margin-top: -65px">招标权限</dt>
                                <dd>
                                    <Input v-model="postData.is_public" :placeholder="placeholder" style="width:100%" disabled></Input>
                                    <div class="testTaskPrice" style="margin-top: 10px">
                                        <RadioGroup v-model="radioFlag.radioStatus" @on-change='changeRadio'>
                                            <Radio label="1">
                                                <span>公开招标</span>
                                            </Radio>
                                            <Radio label="2">
                                                <span>合作招标</span>
                                            </Radio>
                                        </RadioGroup>
                                        <p v-if="radioFlag.radioStatus == 1" style="height: 32px;line-height: 32px;margin-top: 5px; color: #3bceb6;">招标信息对所有人开放，对外公开招标</p>
                                        <p v-if="radioFlag.radioStatus == 2" style="height: 32px;line-height: 32px;margin-top: 5px; color: #3bceb6;">招标信息仅限邀请企业查看，不对外公开招标</p>
                                    </div>
                                </dd>

                            </dl>
                        </div>
                        <div class="footer" style="position: absolute;right:0px;">
                            <Button type="ghost" @click="preStep">上一步</Button>
                            <Button type="primary" @click="nextStep" :disabled='threeBtnDisabled'>下一步</Button>
                        </div>
                    </div>
                </template>
            </div>
            <div v-if="nIndex==3">
                <template>
                  <div style="position: relative;">
                      <div class="detailsLeftBlock" style="margin-top:20px;">
                        <!-- v-if="postData" -->
                          <dl>
                              <dt class="Task-detail-name">
                                  <p><i class="icon-project-square"></i>{{postData.test_name || '暂无'}}</p>
                              </dt>
                              <dt class="Task-detail-tips">
                                  <p>任务发布于：{{postData.bid_end_time || '暂无'}}</p>
                                  <span>类型：{{postData.task_type || '暂无'}}</span>
                              </dt>
                              <table  width="800" border="0" cellpadding="0" cellspacing="0" class="tableSty">
                                  <tr>
                                      <td colspan="2" class="title"><p>项目预计</p></td>
                                  </tr>
                                  <tr class="expectInfo">
                                      <td><span>预计金额：</span><em>￥</em><span class="price">{{postData.expect_price || '0.00'}}</span></td>
                                      <td><span>预计周期：</span>{{postData.project_start_time || '暂无'}} ~ {{postData.project_end_time || '暂无'}}</td>
                                  </tr>
                                  <tr>
                                      <td colspan="2"  class="title"><p>招标任务信息</p></td>
                                  </tr>
                                  <tr class="expectInfo">
                                      <td v-if="postData.test_price"><span>测试费用：</span><em>￥</em><span class="price">{{postData.test_price}}</span></td>
                                      <td v-if="!postData.test_price"><span>测试费用：</span><em></em>{{'服务商报价'}}</td>
                                      <td><span>测试截稿：</span>{{postData.submit_time || '暂无'}}</td>
                                  </tr>
                                  <tr class="expectInfo">
                                      <td><span>稿件规格：</span>{{postData.spec || '暂无'}}</td>
                                      <td><span>稿件格式：</span>{{postData.format || '暂无'}}</td>
                                  </tr>
                                  <tr class="expectInfo">
                                      <td style="padding-bottom: 0px !important;"><span>测试数量：</span>{{postData.num || '暂无'}}</td>
                                  </tr>
                              </table>
                              <dt class="explain">任务补充说明</dt>
                              <dd class="explain-sty">
                                  <p>{{postData.description || '暂无'}}</p>
                              </dd>
                              <dt class="enclosure">参考附件</dt>
                              <dd class="enclosure-sty">
                                    <ul class="filesDown" v-if="postData.file && postData.file.length > 0">
                                        <li v-for="(item,index) in postData.file" :key="index">
                                            <a :href="item.file_url+'?response-content-type=application%2Foctet-stream'" download>{{item.name}} <i class="icon iconfonts icon-xiazai" style="color:#3cd2b4;margin-left:5px;"></i></a>
                                        </li>
                                    </ul>
                                    <span v-else style="color: #777;font-size:12px;">暂无</span>
                              </dd>
                          </dl>
                      </div>
                      <div class="footer" style="position: absolute;right: 0px;">
                          <Button type="ghost" @click="preStep">上一步</Button>
                          <Button type="primary" @click="publishTestTask">立即发布</Button>
                      </div>
                  </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { invitationApi, testTaskApi } from "api";
import GeneralUpload from "../../../../components//uploadAndPreview/generalUpload";
export default {
  data() {
    return {
      nIndex: 0,
      offerFlag: {
        flag: true,
        radioStatus: "1"
      },
      postData: {
        test_name: null, // 测试任务名称
        task_type: null, // 测试任务类型
        test_price: null, // 测试费用
        bid_end_time: null, // 报名截止时间
        submit_time: null, // 交稿截止时间
        expect_price: null, // 预计金额
        project_start_time: null, // 预计周期开始时间
        project_end_time: null, // 预计周期结束时间
        expectDate: null, // 预计周期
        spec: null, //稿件规格
        format: null, // 稿件格式
        description: null, // 测试任务补充说明
        num: null, //稿件数量
        file: null,
        invite: null, // 邀请的公司id
        searchData: null,
        is_public: "公开招标" // 是否公开招标 默认公开 1   合作 0
      },

      is_publicNum: "1",
      abilityList: [],
      currentTime: null, // 获取当前时间年月日YYYY-MM-DD
      btnDisabled: false,
      threeBtnDisabled: false,
      enterWordCount: 0,
      initParams: {
        definedBtnStyle: "margin:0;width:auto;",
        definedIconStyle: {},
        smallBtnText: "上传附件"
      },
      showOtherInfos: {
        fieldLabel: false,
        styleLabel: false,
        fileDescribe: false
      },
      uploadFile: null,
      uploadCallbackData: {
        id2: "browse2",
        callbackData2: []
      },
      deleteFileModel: false,
      delFile: null,
      placeholder: "公开招标",
      inviteCompany: [],
      checkAll: false,
      inviteCompanyID: [],
      isNullData: false,
      radioFlag: {
        flag: true,
        radioStatus: "1"
      },
      coopListData: [],
      coopList: [],
      acc_token: null
    };
  },
  components: {
    GeneralUpload
  },
  updated() {
    this.postData.file = this.uploadFile;
  },
  mounted() {
    this.AbilityList();
    this.getNowFormatDate();
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
      this.uploadFile = newArr.concat(fileList);
    });
  },
  methods: {
    preStep() {
      this.nIndex--;
      if (this.postData && this.nIndex == 0) {
        this.postData.expectDate = [
          this.postData.project_start_time,
          this.postData.project_end_time
        ];
        for (let index in this.abilityList) {
          if (this.abilityList[index].name == this.postData.task_type) {
            this.postData.task_type = this.abilityList[index].id;
          }
        }
      }
    },
    nextStep() {
      this.nIndex++;
      if (this.nIndex == 3) {
        for (let index in this.abilityList) {
          if (this.abilityList[index].id == this.postData.task_type) {
            this.postData.task_type = this.abilityList[index].name;
          }
        }
      } else if(this.nIndex == 2){
        this.coopListGet();
      }
    },
    // ----------------------------------------  第一步 ------------------------------------------- //
    // 获取当前时间
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.currentTime = year + seperator1 + month + seperator1 + strDate;
    },
    // 获取类型列表
    async AbilityList() {
      let { data } = await invitationApi.abilityList();
      if (data.err_code === 0 && data.data) {
        this.abilityList = data.data;
      }
    },
    // 报名截止日期
    changeEnrollDate(date) {
      let sliceStr = date.slice(0, 10);
      if (date.includes(this.currentTime) || sliceStr <= this.currentTime) {
        this.$Message.warning("不能选择当前日期及之前的日期");
        this.btnDisabled = true;
      } else {
        this.postData.bid_end_time = date;
        this.btnDisabled = false;
      }
    },
    // 交稿截止日期
    changeDate(date) {
      let sliceStr = date.slice(0, 10);
      if (date.includes(this.currentTime) || sliceStr <= this.currentTime) {
        this.$Message.warning("不能选择当前日期及之前的日期");
        this.btnDisabled = true;
      } else if (this.postData.bid_end_time) {
        if (
          parseInt(new Date(date).getTime()) <=
          parseInt(new Date(this.postData.bid_end_time).getTime())
        ) {
          this.$Message.warning("交稿日期不能小于或等于报名或报价日期");
          this.btnDisabled = true;
        } else {
          this.btnDisabled = false;
          this.postData.submit_time = date;
        }
      }
    },
    // 预计周期
    expectCycle(date) {
      this.postData.project_start_time = date[0];
      this.postData.project_end_time = date[1];
    },
    // 选择任务类型
    changeSelect(value) {
      this.postData.task_type = value;
    },
    // ----------------------------------------  第二步 ------------------------------------------- //
    calculationWords() {
      this.enterWordCount = this.postData.description
        ? this.postData.description.length
        : 0;
    },
    // 删除上传的文件
    deleteViewFile(file) {
      this.deleteFileModel = true;
      this.delFile = file;
    },
    deleteFile() {
      this.uploadFile.forEach((item, index) => {
        if (item.name === this.delFile.name) {
          this.uploadFile.splice(index, 1);
        }
      });
    },
    // ----------------------------------------  第三步 ------------------------------------------- //
    // 全选
    handleCheckAll() {
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        this.threeBtnDisabled = false;
        this.inviteCompany = this.coopList;
        this.postData.invite = this.inviteCompany;
      } else {
        this.inviteCompany = [];
        this.inviteCompanyID = [];
        if(this.is_publicNum == 1){
          this.threeBtnDisabled = false;
        } else if (this.is_publicNum == 0 && this.inviteCompany.length == 0){
            this.threeBtnDisabled = true;
            this.$Message.warning("选择合作招标需要选择相应合作企业");
        }
      }
    },
    // 多选
    checkAllGroupChange(data) {
      this.inviteCompanyID = data;
      // console.log(this.inviteCompanyID,"this.inviteCompanyID");
      this.postData.invite = this.inviteCompanyID;
      if (data.length === this.coopList.length) {
        this.checkAll = true;
        this.threeBtnDisabled = false;
      } else if (data.length > 0) {
        this.checkAll = false;
        this.threeBtnDisabled = false;
      } else {
        this.checkAll = false;
        if(this.is_publicNum == 1){
          this.threeBtnDisabled = false;
        } else if (this.is_publicNum == 0){
            this.threeBtnDisabled = true;
            this.$Message.warning("选择合作招标需要选择相应合作企业");
        }
      }
    },
    // 搜索
    commitSearch() {
      this.coopListGet(this.postData.searchData);
    },
    // 获取公司列表
    async coopListGet(search = this.postData.searchData) {
      if (localStorage.acc_token) {
        this.acc_token = JSON.parse(localStorage.acc_token);
      }
      let params = {
        search: search,
        acc_token: this.acc_token
      };
      let { data } = await invitationApi.companyData(params);

      if (data.err_code == 0) {
        this.coopListData = data.data;
        if (data.data && data.data.length > 0) {
          this.coopList = [];
          data.data.forEach(val => {
            this.coopList.push(val.id);
          });
          this.coopList.forEach(item => {
            this.inviteCompany.forEach(opt => {
              if (item !== opt) {
                this.checkAll = false;
              }
            })
          });
          if (this.coopList.length <= 0) {
            this.checkAll = false;
            this.inviteCompany = [];
            this.inviteCompanyID = [];
            this.isNullData = false;
            this.threeBtnDisabled = true;
            this.$Message.warning("选择合作招标需要选择相应合作企业");
          } else {
            this.isNullData = true;
          }
        } else if (data.data.length <= 0){
          if(this.is_publicNum == 1){
            this.threeBtnDisabled = false;
          }
        }
      } else {
        this.$Message.error(msg.data.err_message);
      }
    },
    // 切换单选框
    changeRadio(value) {
      if (value === "1") {
        this.postData.is_public = "公开招标";
        this.is_publicNum = "1";
        this.threeBtnDisabled = false;
      } else if (value === "2") {
        this.is_publicNum = "0";
        this.postData.is_public = "合作招标";
        if (this.inviteCompanyID.length === 0 && this.inviteCompany.length === 0) {
          this.threeBtnDisabled = true;
          this.$Message.warning("选择合作招标需要选择相应合作企业");
        }
        
      }
    },
    // ----------------------------------------  第四步 ------------------------------------------- //
    // 发布测试任务
    publishTestTask() {
      this.$emit(
        "publishTestTask",
        this.postData,
        this.offerFlag.radioStatus,
        this.is_publicNum
      );
    },
    // ----------------------------------------  清除数据 ------------------------------------------- //
    // 清除数据
    clearData() {
      this.postData = {
        test_name: null, // 测试任务名称
        task_type: null, // 测试任务类型
        test_price: null, // 测试费用
        bid_end_time: null, // 报名截止时间
        submit_time: null, // 交稿截止时间
        expect_price: null, // 预计金额
        expectDate: null,
        spec: null, //稿件规格
        format: null, // 稿件格式
        description: null, // 测试任务补充说明
        num: null, //稿件数量
        file: null, // 稿件
        invite: null, // 合作公司id
        is_public: "公开招标" // 是否公开招标
      };
      this.uploadFile = null;
      this.inviteCompany = [];
      this.checkAll = false;
      this.nIndex = 0;
      this.offerFlag.radioStatus = "1";
      this.radioFlag.radioStatus = "1";
    }
  }
};
</script>

<style lang="less">
@import "../style/addEpibolCom.less";
.statusNav {
  line-height: 34px;
  background: #dfe1e2;
  border-radius: @r4;
  text-align: center;
  color: #777777;
  font-size: 13px;
  font-weight: lighter;
  font-family: @ff;
  margin-top: 10px;
  span {
    width: 25%;
    float: left;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAiCAYAAACJDyPYAAABx0lEQVQ4jX2Sv3LTQBCHf3vS7dlFAsSjylTwAk6VDio6nsUdHWW6dHmVlFRQJRV+AahCgyYmxEOs+08hWz7ZOm9zc9I33+ztb+m3fr6pePwRAFb/nhfO+3NkSvxx+i4iagAYKZ4C+JqFfYyXj9bcAYAsy6ooitMsDABL13zbfhgfsQsAMCHUK2cXnV2IQbvYnNcPdmfP9b6FsQ7uxzq4nwDAUlZCCJWFAVw/mOP2FMbK2+8mhBoAlJSvhSCVhTe9f+nszNNjMP46s/AxPgEAM1eC6DYLR8Sr5WYyBCiV2A9gAEhXQLGsaGMfhH2Ml4+uXQEiUopllYUBYJmGxDwlotssbEKoV75dASJSSsoqC2MvJKV4egzuFRHlewYwn8jRu64tY+oszEJUJ6Wcbe+NMb+y8Fm5s2pj70OIehAuiD6/lHyRWgG8H4RfleqC0G6ctvY+hKCBgVAI9OkseVijW+sg/KLkWUF0CgDG2nprHYLnEzn6MGQ9gE8Kec5CVK3V1T6Ep/R/CvdCaIzuWXvwWJRvx0X5BgCsc7X3fWsKzydSddb1Xq89uI2WZzurP7B2cBrt/gR6cBqtdb52GSsAiDTaRh9OIK3/vQTXFRw69FoAAAAASUVORK5CYII=");
    background-repeat: no-repeat;
    background-position: right 0px;
    background-color: #eef1f2;
    border-radius: @r4 0px 0px @r4;
    cursor: pointer;
    &:nth-of-type(4) {
      background-image: none;
      border-radius: 0px @r4 @r4 0px;
    }
    &:nth-of-type(2),
    &:nth-of-type(3) {
      border-radius: 0px;
    }
  }
  .show {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAiCAYAAACJDyPYAAABx0lEQVQ4jX2Sv3LTQBCHf3vS7dlFAsSjylTwAk6VDio6nsUdHWW6dHmVlFRQJRV+AahCgyYmxEOs+08hWz7ZOm9zc9I33+ztb+m3fr6pePwRAFb/nhfO+3NkSvxx+i4iagAYKZ4C+JqFfYyXj9bcAYAsy6ooitMsDABL13zbfhgfsQsAMCHUK2cXnV2IQbvYnNcPdmfP9b6FsQ7uxzq4nwDAUlZCCJWFAVw/mOP2FMbK2+8mhBoAlJSvhSCVhTe9f+nszNNjMP46s/AxPgEAM1eC6DYLR8Sr5WYyBCiV2A9gAEhXQLGsaGMfhH2Ml4+uXQEiUopllYUBYJmGxDwlotssbEKoV75dASJSSsoqC2MvJKV4egzuFRHlewYwn8jRu64tY+oszEJUJ6Wcbe+NMb+y8Fm5s2pj70OIehAuiD6/lHyRWgG8H4RfleqC0G6ctvY+hKCBgVAI9OkseVijW+sg/KLkWUF0CgDG2nprHYLnEzn6MGQ9gE8Kec5CVK3V1T6Ep/R/CvdCaIzuWXvwWJRvx0X5BgCsc7X3fWsKzydSddb1Xq89uI2WZzurP7B2cBrt/gR6cBqtdb52GSsAiDTaRh9OIK3/vQTXFRw69FoAAAAASUVORK5CYII=");
    background-color: #d6f4ee;
    background-repeat: no-repeat;
    background-position: right 0px;
    color: @base;
  }
  .nextshow {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAiCAYAAACJDyPYAAABx0lEQVQ4jX2Sv3LTQBCHf3vS7dlFAsSjylTwAk6VDio6nsUdHWW6dHmVlFRQJRV+AahCgyYmxEOs+08hWz7ZOm9zc9I33+ztb+m3fr6pePwRAFb/nhfO+3NkSvxx+i4iagAYKZ4C+JqFfYyXj9bcAYAsy6ooitMsDABL13zbfhgfsQsAMCHUK2cXnV2IQbvYnNcPdmfP9b6FsQ7uxzq4nwDAUlZCCJWFAVw/mOP2FMbK2+8mhBoAlJSvhSCVhTe9f+nszNNjMP46s/AxPgEAM1eC6DYLR8Sr5WYyBCiV2A9gAEhXQLGsaGMfhH2Ml4+uXQEiUopllYUBYJmGxDwlotssbEKoV75dASJSSsoqC2MvJKV4egzuFRHlewYwn8jRu64tY+oszEJUJ6Wcbe+NMb+y8Fm5s2pj70OIehAuiD6/lHyRWgG8H4RfleqC0G6ctvY+hKCBgVAI9OkseVijW+sg/KLkWUF0CgDG2nprHYLnEzn6MGQ9gE8Kec5CVK3V1T6Ep/R/CvdCaIzuWXvwWJRvx0X5BgCsc7X3fWsKzydSddb1Xq89uI2WZzurP7B2cBrt/gR6cBqtdb52GSsAiDTaRh9OIK3/vQTXFRw69FoAAAAASUVORK5CYII=");
    background-repeat: no-repeat;
    background-position-x: right;
    background-color: #d6f4ee;
    color: @base;
  }
}
.addTestTask {
  // .addTestTaskSetps {
  //   margin-top: 5px;
  //   .ivu-steps-item {
  //     width: 28.5% !important;
  //     &:last-child {
  //       width: 14.5% !important;
  //       .ivu-steps-main {
  //         .ivu-steps-title {
  //           &:last-child {
  //             padding-right: 0px !important;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   .ivu-steps-status-process {
  //     .ivu-steps-head {
  //       .ivu-steps-head-inner {
  //         border-color: @base !important;
  //         background-color: @base !important;
  //         span {
  //           color: white;
  //         }
  //       }
  //     }
  //     .ivu-steps-tail {
  //       i {
  //         background-color: @base;
  //       }
  //     }
  //   }
  //   .ivu-steps-status-finish {
  //     .ivu-steps-tail {
  //       i {
  //         &:after {
  //           background: @base;
  //         }
  //       }
  //     }
  //     .ivu-steps-head {
  //       .ivu-steps-head-inner {
  //         border-color: @base;
  //         .ivu-steps-icon {
  //           color: @base;
  //         }
  //       }
  //     }
  //   }
  // }
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
      .icon-sourceDel {
        padding-left: 5px;
        &:hover {
          color: @base;
        }
      }
      li {
        padding: 5px 0;
      }
    }
    .ul {
      border: 1px solid #d3d9e1;
      border-radius: 4px;
      .span {
        float: left;
        width: 50%;
        padding: 5px 0px;
        font-size: 13px;
        .ivu-checkbox-wrapper {
          font-size: 13px !important;
        }
      }
      .notCompany {
        display: block;
        text-align: center;
      }
      li {
        padding: 10px;
        font-size: 12px;
      }
      .title {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #d3d9e1;
      }
      .checked-all {
        border-bottom: 1px solid #d3d9e1;
        overflow: hidden;
        > em {
          float: right;
        }
      }
    }
  }
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
          margin: 20px 0 30px;
          width: 100%;
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
      }
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
        .filesDown {
          li {
            a {
              &:hover {
                color: @base !important;
              }
            }
          }
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
}
</style>