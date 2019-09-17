<template>
    <div class="addIncome">
        <dl>
            <dt>{{$t('companyProject.com_addPeople')}}</dt>
            <dd>
                <Input v-model="addPeople" :placeholder="realName" disabled></Input>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_incomeType')}}</dt>
            <dd>
                <Select v-model="type" @on-change="changeStepDate" v-if="!customTypes">
                    <Option value="1">{{$t('companyProject.com_project')}}</Option>
                    <Option value="2">{{$t('memberAauthority.power_testTask')}}</Option>
                    <Option value="3">{{$t('companyProject.com_custom')}}</Option>
                </Select>
                <Input v-model="incomeType" :placeholder="pleaseEnter" v-if="customTypes"></Input>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_sourceIncome')}}</dt>
            <dd>
                <Input v-model="source" type="text" :placeholder="inputItem" icon="ios-search" @on-click="serchSource(source,$event,true)"></Input>
                <div v-click-outside.capture="onClickOutside" class="select-list">
                  <ul v-if="incomeStream.sourceFlag" class="source-list">
                      <li v-for="(item,index) in incomeStream.sourceList" @click="selectSourceFun(item)" :key="index">{{item.name}}</li>
                  </ul>
                </div>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_amountIncome')}}</dt>
            <dd>
                <Input v-model="income" type="text" :placeholder="inputAmountIncome"></Input>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_amountIncomDate')}}</dt>
            <dd>
                <DatePicker format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="seleIncomDate" style="width: 100%;" :value="date" @on-change="changeDate"></DatePicker>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_incomeNumber')}}</dt>
            <dd>
                <Slider style="width: 80%;" v-model="stage" :max="Number(totaNumber)" :disabled="sliderDisable"></Slider>
                <Input style="width: 15%;margin-left: 5%;"  type="text" v-model="totaNumber" :disabled="sliderDisable" @on-change="clearSlider" ></Input>
            </dd>
        </dl>
        <dl style="margin-top: -15px;">
            <dt></dt>
            <dd>
                <span class="grayColor"><span class="iconfonts icon-jingao"></span>{{$t('companyProject.com_inputDescribe')}}</span>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_payer')}}</dt>
            <dd>
                <Input v-model="payment" type="text" :placeholder="inputPayer" icon="ios-search" @on-click="serchPay(payment,$event,true)"></Input>
                <div v-click-outside.capture="onClickOutside" class="select-list">
                  <ul v-if="payData.payFlag" class="pay-list">
                      <li v-for="(item,index) in payData.payList" @click="selectPayFun(item)" :key="index">{{item.name}}</li>
                  </ul>
                </div>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_projectLeader')}}</dt>
            <dd>
                <!-- <Input v-model="header" type="text" placeholder="请选择..."></Input> -->
                <Select v-model="header" style="width: 100%;" :placeholder="inputProjectLeader">
                    <Option v-for="item in headerList" :value="item.id" :key="item.id">{{ item.realname }}</Option>
                </Select>
            </dd>
        </dl>
        <dl>
            <dt>{{$t('companyProject.com_uploadInvoice')}}</dt>
            <dd class="last-style">
                <voucher-upload :id="uploadId" v-on:FileUploadedSuccess="FileUploadedSuccess" v-on:UploadProgress="UploadProgress" :isShowProgress="false">
                    <template slot="upload" style="position: relative;">
                        <div v-if="fileShow" style="min-width:120px;min-height:120px;">
                            <img v-if="voucher" :src="voucher" class="uploadImg"  style="cursor: pointer;" width="500px" height="300px">
                            <button :id="uploadId" class="btn" style="position: absolute;top: 0;left: 0; width: 100%;height: 100%; opacity: 0;cursor: pointer;">{{$t('upload.upload_chooseFile')}}</button>
                            <div class="shade" v-show="!voucher" style="width: 100%;height: 100%;text-align: center;cursor: pointer;position: absolute;top: 0px;overflow: hidden;opacity: 1;ext-align: center;background: @baseboard;margin-top: 4%;">
                                <Icon style="font-size:28px;color:#3bceb6;vertical-align:bottom;padding-top:15px;" type="ios-cloud-upload"></Icon>
                                <p>{{$t('companyProject.com_clickUploadInvoice')}}</p>
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
import api from "api";
import { mapState } from "vuex";
import voucherUpload from "@/components/upload"; // 引入上传组件
import { directive as clickOutside } from "v-click-outside-x";
export default {
    directives: { clickOutside },
    data() {
      return {
        payData: {
          payFlag: false,
          payList: []
      }, // 付款方
        incomeStream: {
          sourceFlag: false,
          sourceList: []
      }, //收入来源
        realName: i18n.t('companyProject.com_realName'),
        pleaseEnter: i18n.t('lang.lang_pleaseEnter'),
        inputItem: i18n.t('companyProject.com_inputItem'),
        inputAmountIncome: i18n.t('companyProject.com_inputAmountIncome'),
        seleIncomDate: i18n.t('companyProject.com_seleIncomDate'),
        inputPayer: i18n.t('companyProject.com_inputPayer'),
        inputProjectLeader: i18n.t('companyProject.com_inputProjectLeader'),
        addPeople: "", //添加人
        date: null, // 收款日期
        source: "", // 收入来源
        sourceId: null, //收入来源ID
        sourceType: null, //收入来源类型
        payment: "", //付款方
        payCompanyId: null, //付款方ID
        income: null, // 收款金额
        totaNumber: 1, // 收入总笔数
        stage: 1, // 当前收入阶段
        type: null, //收入类型
        incomeType: null, //收入类型
        header: "", //项目负责人
        currentTime: null, // 当前时间年月日YYYY-MM-DD
        sliderDisable: false,
        fileShow: true, // 文件上传
        voucher: null, // 凭证
        voucherId: null, // 凭证ID
        customTypes: false, //自定义类型
        headerList: [] //项目负责人列表
    };
  },
    components: {
      voucherUpload
  },
    props: {
      powerToken: {
        type: String
    }
  },
    mounted() {
      this.getName();
      this.getNowFormatDate();
      this.getMemberList();
  },
    computed: {
      ...mapState({
        MsgIsShow() {
          return this.$store.state.MsgIsShow;
      }
    }),
      uploadId() {
        return "upload" + Math.random();
    }
  },
    methods: {
    // 获取添加人的真实姓名
      getName() {
        if (localStorage.userMsg) {
          let locarealName = JSON.parse(localStorage.userMsg).realname;
          if (locarealName) {
            this.addPeople = locarealName;
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
    },
    // 改变收款日期
      changeDate(time) {
      // 财务系统添加收入时间和添加支出时间取消限制
      // let sliceStr = time.slice(0, 10);
      // if (time.includes(this.currentTime) || sliceStr > this.currentTime) {
      //   this.$Message.warning("不能选择当前日期以及之后的日期!");
      // } else {
        this.date = time;
      // }
    },
      changeStepDate(value) {
        if (value == 2) {
          this.stage = 1;
          this.totaNumber = 1;
          this.sliderDisable = true;
          this.customTypes = false;
      } else if (value == 3) {
          this.customTypes = true;
          this.sliderDisable = false;
      } else {
          this.sliderDisable = false;
          this.customTypes = false;
      }
    },
    // 取消添加后清空输入框数据
      clearData() {
        this.date = null;
        this.source = "";
        this.payment = "";
        this.income = null;
        this.totaNumber = 1;
        this.stage = 1;
        this.type = null;
        this.header = "";
        this.sliderDisable = false;
        this.incomeType = null;
        this.sourceId = null;
        this.sourceType = null;
        this.payCompanyId = null;
        this.voucher = null;
        this.voucherId = null;
    },
      getInputData() {
        let params = {
          addPeople: this.addPeople,
          time: this.date,
          name: this.source,
          source_id: this.sourceId,
          source_type: this.sourceType,
          pay_company: this.payment,
          pay_company_id: this.payCompanyId,
          income: this.income,
          income_count: this.totaNumber,
          step: this.stage,
          type: this.type,
          leader: this.header,
          file_id: this.voucherId
      };
        if (params.type == 3) {
          params.customize_type = this.incomeType;
      }
        this.$bus.emit("getInputVal", params);
    },
      clearSlider() {
        this.stage = 1;
    },
    // 获取已有付款方列表
      async serchPay(val, event, flag) {
        this.payData.payFlag = this.$store.state.MsgIsShow;
        let params = {
          select: val,
          acc_token: this.powerToken
      };
        let { data } = await api.getPayData(params);
        if (data.err_code == 0) {
          this.payData.payList = data.data || [];
          if (this.payData.payList.length > 0) {
            this.payData.payFlag = true;
        } else {
            this.payData.payFlag = false;
            this.payData.payList = [];
            this.payment = params.select;
            this.$Message.warning(i18n.t('companyProject.com_notCompany'));
        }
      } else {
          this.$Message.error(data.err_message);
      }
    },
    //选择公司
      selectPayFun(item) {
        this.payData.payFlag = false;
        this.payment = item.name;
        this.payCompanyId = item.id;
    },
    // 获取已有来源列表
      async serchSource(val, event, flag) {
        let params = {
          select: val,
          acc_token: this.powerToken
      };
        let { data } = await api.getSourceList(params);
        if (data.err_code == 0) {
          this.incomeStream.sourceList = data.data || [];
          if (this.incomeStream.sourceList.length > 0) {
            this.incomeStream.sourceFlag = true;
        } else {
            this.incomeStream.sourceFlag = false;
            this.incomeStream.sourceList = [];
            this.source = params.select;
            this.$Message.warning(i18n.t('companyProject.com_notSelfData'));
        }
      }
    },
      selectSourceFun(item) {
        this.incomeStream.sourceFlag = false;
        this.source = item.name;
        this.sourceId = item.id;
        this.sourceType = item.type;
    },
    // 获取项目负责人列表
      async getMemberList() {
        let { data } = await api.memberList();
        if (data.err_code == 0) {
          this.headerList = data.data || [];
      }
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
          this.voucher = JSON.parse(uploader.response).file_url;
      }
    },
      onClickOutside() {
        this.payData.payFlag = false;
        this.incomeStream.sourceFlag = false;
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
