<template>
    <div class="addExpenditure">
        <dl>
            <dt>{{$t('companyProject.com_addPeople')}}</dt>
            <dd>
                <Input v-model="formExpenditure.addPeople" :placeholder="inputAddName" disabled ></Input>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_payType')}}</dt>
            <dd>
                <Select v-model="formExpenditure.summary">
                    <Option  v-for="item in summaryList" :value="item.value" :key="item.value">{{ item.label }}</Option >
                </Select>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_expenditurePurpose')}}</dt>
            <dd>
                <Input v-model="formExpenditure.purpose" :placeholder="inputPay"></Input>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_payMoney')}}</dt>
            <dd>
                <Input v-model="formExpenditure.expenditureAmount" type="text" :placeholder="inputPayMoney"></Input>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_payDate')}}</dt>
            <dd>
                <DatePicker format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="selePayDate" style="width: 100%;" :value="formExpenditure.paymentDate" @on-change="changeTime"></DatePicker>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_receivingParty')}}</dt>
            <dd>
                <Input v-model="formExpenditure.receivingParty" type="text" :placeholder="inputCompany" icon="ios-search" @on-click="serchReceivie(formExpenditure.receivingParty,$event,true)"></Input>
                <div v-click-outside.capture="onClickOutside" class="select-list">
                    <ul v-if="receivieSide.receivieFlag" class="receivie-side">
                        <li v-for="(item,index) in receivieSide.receivieList" @click="selectReceivieFun(item)" :key="index">{{item.name}}</li>
                    </ul>
                </div>
            </dd>
        </dl>
        <dl>
            <dt>经办人</dt>
            <dd>
                <!-- <Input v-model="formExpenditure.operator" type="text" placeholder="输入经办人"></Input> -->
                <Select v-model="formExpenditure.operator" style="width: 100%;" placeholder="请选择经办人">
                    <Option v-for="item in operatorList" :value="item.user_id" :key="item.user_id">{{ item.realname }}</Option>
                </Select>
            </dd>
        </dl>
        <dl>
            <dt>重复</dt>
            <dd>
                <DatePicker type="date" multiple format="yyyy-MM-dd" placeholder="选择日期" v-show="isDatePicker" :value="statisticalDate" @on-change="changeEnrollDate" @on-clear ='clearEnrollDate' style="width: 100%;"></DatePicker>
                <Select v-model="selectModel" style="width: 100%;"   @on-change="changeStatisticalDate" v-show="!isDatePicker" >
                    <Option value="" >从不</Option>
                    <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.value }}</Option >
                </Select>
            </dd>
        </dl>
        <dl>
            <dt>支出凭证</dt>
            <dd class="last-style">
                <voucher-upload :id="uploadId" v-on:FileUploadedSuccess="FileUploadedSuccess" v-on:UploadProgress="UploadProgress" :isShowProgress="false">
                    <template slot="upload" style="position: relative;">
                        <div v-if="fileShow" style="min-width:120px;min-height:120px;">
                            <img v-if="formExpenditure.voucher" :src="formExpenditure.voucher" class="uploadImg"  style="cursor: pointer;" width="500px" height="300px">
                            <button :id="uploadId" class="btn" style="position: absolute;top: 0;left: 0; width: 100%;height: 100%; opacity: 0;cursor: pointer;">选择文件</button>
                            <div class="shade" v-show="!formExpenditure.voucher" style="width: 100%;height: 100%;text-align: center;cursor: pointer;position: absolute;top: 0px;overflow: hidden;opacity: 1;ext-align: center;background: @baseboard;margin-top: 4%;">
                                <Icon style="font-size:28px;color:#3bceb6;vertical-align:bottom;padding-top:15px;" type="ios-cloud-upload"></Icon>
                                <p>点击上传凭证</p>
                            </div>
                        </div>
                    </template>
                </voucher-upload>
            </dd>
            <div class="clear"></div>
        </dl>
    </div>
</template>
<script>
import voucherUpload from "@/components/upload"; // 引入上传组件
import { directive as clickOutside } from "v-click-outside-x";
import api from "api";
export default {
  directives: { clickOutside },
  props: {
    powerToken: {
      type: String
    }
  },
  data() {
    return {
      fileShow: true, // 文件上传
      inputAddName: i18n.t('companyProject.com_inputAddName'),
      inputPay: i18n.t('companyProject.com_inputPay'),
      inputPayMoney: i18n.t('companyProject.com_inputPayMoney'),
      selePayDate: i18n.t('companyProject.com_selePayDate'),
      inputCompany: i18n.t('companyProject.com_inputCompany'),
      formExpenditure: {
        addPeople: "", // 添加人
        paymentDate: null, // 付款日期
        purpose: "", // 支出用途
        receivingParty: "", // 收款方
        expenditureAmount: "", // 支出金额
        summary: null, // 摘要
        operator: null, // 经办人ID
        voucher: null // 凭证
      },
      voucherId: null, // 凭证ID
      summaryList: [
        { value: "1", label: "工资" },
        { value: "2", label: "报销" },
        { value: "3", label: "付款" },
        { value: "4", label: "备用金申请" }
      ],
      currentTime: null, // 当前时间年月日YYYY-MM-DD

      timeList: [
        {
          value: "每周"
        },
        {
          value: "每月"
        },
        {
          value: "自定义"
        }
      ],
      isDatePicker: false,
      statisticalDate: null, // 自选统计日期
      selectModel: null,
      timeValue: null,
      operatorList: [], // 经办人列表
      receivieSide: {
        receivieFlag: false,
        receivieList: []
      }, // 收款方
      counterpartyId: null // 收款方ID
    };
  },
  components: {
    voucherUpload
  },
  mounted() {
    this.getName();
    this.getNowFormatDate();
    this.getOperatorList();
  },
  computed: {
    uploadId() {
      return "upload" + Math.random();
    }
  },
  methods: {
    //   获取添加人的真实姓名
    getName() {
      if (localStorage.userMsg) {
        let locarealName = JSON.parse(localStorage.userMsg).realname;
        if (locarealName) {
          this.formExpenditure.addPeople = locarealName;
        }
      }
    },
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
      //   console.log("获取当前时间YO", this.currentTime);
    },
    // 改变付款日期
    changeTime(value) {
      // 财务系统添加收入时间和添加支出时间取消限制
      // let sliceStr = value.slice(0, 10);
      // if (value.includes(this.currentTime) || sliceStr > this.currentTime) {
      //     this.$Message.warning("不能选择当前日期以及之后的日期!");
      // } else {
      this.formExpenditure.paymentDate = value;
      // }
    },
    clear() {
      //   this.formExpenditure.addPeople = "";
      this.formExpenditure.paymentDate = null;
      this.formExpenditure.purpose = "";
      this.formExpenditure.receivingParty = "";
      this.formExpenditure.expenditureAmount = "";
      this.formExpenditure.summary = null;
      this.formExpenditure.operator = null;
      this.formExpenditure.voucher = null;
      this.voucherId = null;
      this.statisticalDate = null;
      this.counterpartyId = null;
      this.timeValue = null;
      this.selectModel = null;
    },
    getInputData() {
      let params = {
        addPeople: this.formExpenditure.addPeople,
        time: this.formExpenditure.paymentDate,
        use: this.formExpenditure.purpose,
        counterparty: this.formExpenditure.receivingParty,
        counterparty_id: this.counterpartyId,
        pay: this.formExpenditure.expenditureAmount,
        summary: this.formExpenditure.summary,
        operator: this.formExpenditure.operator,
        repeat: this.timeValue,
        file_id: this.voucherId
      };
      this.$bus.emit("getInputVal", params);
    },
    // 上传凭证
    UploadProgress(result) {
      this.fileShow = true;
    },
    // 上传凭证成功的回调
    FileUploadedSuccess(uploader) {
      this.fileShow = true;
      if (uploader.response) {
        this.voucherId = JSON.parse(uploader.response).fid;
        this.formExpenditure.voucher = JSON.parse(uploader.response).file_url;
      }
    },
    // 选择重复日期
    changeEnrollDate(data) {
      this.timeValue = data;
    },
    clearEnrollDate() {
      this.statisticalDate = null;
      this.isDatePicker = false;
      this.selectModel = "";
    },
    // 选择重复类型
    changeStatisticalDate(value) {
      if (value == "自定义") {
        this.isDatePicker = true;
      } else if (value == "从不") {
        this.timeValue = "no";
      } else if (value == "每周") {
        this.timeValue = "week";
      } else if (value == "每月") {
        this.timeValue = "month";
      }
    },
    // 经办人列表
    async getOperatorList() {
      let { data } = await api.operatorData();
      if (data.err_code == 0) {
        this.operatorList = data.data || [];
      }
    },
    onClickOutside() {
      this.receivieSide.receivieFlag = false;
    },
    // 收款方列表
    async serchReceivie(val, event, flag) {
      let params = {
        select: val,
        acc_token: this.powerToken
      };
      let { data } = await api.receiveData(params);
      if (data.err_code == 0) {
        this.receivieSide.receivieList = data.data || [];
        if (this.receivieSide.receivieList.length > 0) {
          this.receivieSide.receivieFlag = true;
        } else {
          this.receivieSide.receivieFlag = false;
          this.receivieSide.receivieList = [];
          this.formExpenditure.receivingParty = params.select;
          this.$Message.warning("暂无该数据");
        }
      }
    },
    selectReceivieFun(item) {
      this.receivieSide.receivieFlag = false;
      this.formExpenditure.receivingParty = item.name;
      this.counterpartyId = item.id;
    }
  },
  updated() {
    this.getInputData();
  }
};
</script>
<style lang="less" scoped>
@import "./style/modalCommonStyle.less";
</style>
