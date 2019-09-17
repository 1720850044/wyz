<template>
    <div class="income-details">
        <div class="content">
            <div class="content-top">
                <div class="btn-style">
                    <Button id="addExpenditure" size='small' @click="addBtn" class="addBtn"><i class="iconfonts icon-xinjian"></i>&nbsp;
                    {{$t('companyProject.com_addExpenditure')}}
                    </Button>
                </div>
                <div class="filters-condition">
                    <drop-filter :selectedHolder="addScreen" :sumMoneyData="sumMoneyData" :sourceData="sourceData" :personnelData="personnelData" :receivePartyData="receivePartyData" multiple @definiteChoice="definiteChoice"></drop-filter>
                </div>
            </div>
            <div class="over-view">
                <div class="total-income">
                    <div class="total-income-show">
                        <p class="text">{{$t('memberAauthority.power_total')}}</p>
                        <p class="sum">￥{{ sum || 0}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_alreadyPay')}}</p>
                        <p class="sum">￥{{ paySum || 0}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_unspent')}}</p>
                        <p class="sum">￥{{ unPaySum || 0}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_totalWages')}}</p>
                        <p class="sum">{{ wagesNum || 0}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_totalReimbursement')}}</p>
                        <p class="sum">{{ expenseNum || 0}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_otherTotal')}}</p>
                        <p class="sum">{{ otherNum || 0}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_totalPayees')}}</p>
                        <p class="sum">{{ receiveNum || 0}}</p>
                    </div>
                    <template>
                        <div class="filters-date">
                            <p><Icon type="android-calendar"></Icon>{{$t('companyProject.com_statisticalTimeRange')}}</p>
                            <DatePicker type="date" format="yyyy-MM-dd" :placeholder="selectStarDate" :value="startDate"
                                        @on-change='changeStartDate' @on-clear="clearime('start')"></DatePicker>&nbsp;&nbsp;~&nbsp;&nbsp;
                            <DatePicker type="date" format="yyyy-MM-dd" :placeholder="selectEndDate" :value="endDate"
                                        @on-change='changeEndDate' @on-clear="clearime('end')"></DatePicker>
                        </div>
                    </template>
                    <div class="btn-style">
                        <Button size='small' @click="exportExcel"><i class="iconfonts icon-export"></i>&nbsp;{{$t('companyProject.com_export')}}
                        </Button>
                    </div>
                </div>
                
                
            </div>
            <template>
                <div class="income-details-list">
                    <div class="list-header">
                        <span>{{$t('companyProject.com_totalPay')}}</span>
                        <span>{{$t('companyProject.com_alreadyPay')}}</span>
                        <span>{{$t('companyProject.com_unspent')}}</span>
                        <span>{{$t('companyProject.com_expenditureSummary')}}</span>
                        <span>{{$t('companyProject.com_expenditurePurpose')}}</span>
                        <span>{{$t('companyProject.com_payDate')}}</span>
                        <span>{{$t('companyProject.com_receivingParty')}}</span>
                        <span>{{$t('companyProject.com_payVoucher')}}</span>
                        <span>{{$t('companyProject.com_modificationRecord')}}</span>
                        <span>{{$t('companyProject.com_addPeople')}}</span>
                        <span>{{$t('lang.lang_operating')}}</span>
                    </div>
                    <dl v-if="expenditureList.length > 0">
                        <dd v-for="(item,index) in expenditureList" :key="index">
                            <span>{{item.total_pay}}</span>
                            <Input type="text" v-model="formItem.expenditure" v-if="editIndex === index"
                                   :autofocus='true' style="width: 160px;line-height: 60px;margin-left: 16px;"></Input>
                            <span v-else>{{item.pay}}</span>
                            <span>{{item.wait_pay}}</span>
                            <span>{{item.summary}}</span>
                            <span>{{item.name}}</span>
                            <span>{{item.time}}</span>
                            <span>{{item.counterparty}}</span>
                            <span style="cursor:pointer" @click='viewVoucher(item)'>{{item.file_name || notAvailable}}<i
                                style="padding:3px 4px;border:1px solid #eef1f2;color:#5fd4c0;"
                                v-if="item.file_name">{{$t('workbench.work_lookOverTag')}}</i></span>
                            <span>{{item.record_count}} <i
                                style="padding:3px 4px;border:1px solid #eef1f2;color:#5fd4c0;"
                                @click="viewRecord(item.id)">{{$t('companyProject.com_record')}}</i></span>
                            <span>{{item.create_user}}</span>
                            <span v-if="editIndex === index">
                              <Button @click="handleSave(item,index)" type="text" size="small" class='save'>{{$t('lang.lang_save')}}</Button>
                              <Button @click="editIndex = -1" type="text" size="small" class='cancel'>{{$t('lang.lang_cancel')}}</Button>
                            </span>
                            <span class="action" v-else>
                                <i class="ivu-icon ivu-icon-edit" @click="editData(item,index)"></i>
                                <i class="iconfonts icon-sourceDel" @click="deleteData(item.id)"></i>
                            </span>
                        </dd>
                    </dl>
                    <template v-else>
                        <div style="min-height: 700px;position: relative">
                            <nothink type="project" :text="noData"></nothink>
                        </div>
                    </template>
                </div>
            </template>
            <div class="paging-style">
              <Page  v-if="page.total > 10" :current="page.creentPage" :total="page.total" :page-size="page.page_size"
                  @on-change="changePage"></Page>
            </div>

        </div>
        <!-- 添加支出对话框  @on-ok="confirmAdd" @on-cancel="cancelAdd" -->
        <Modal v-model="expenditureModal.isShow" width="660" :title="expenditureModal.title"
               :ok-text="expenditureModal.btn" :mask-closable="false">
            <div class="from-verification">
                <add-expenditure ref="addExpenditure" :powerToken='powerToken'></add-expenditure>
            </div>
            <div slot="footer">
                <Button type="text" size="large" style="font-size: 13px" @click="cancelAdd">{{$t('lang.lang_cancel')}}</Button>
                <Button type="primary" size="large" style="font-size: 13px" @click="confirmAdd">{{$t('companyProject.com_confirmAdd')}}</Button>
            </div>
        </Modal>
        <!-- 查看修改记录对话框 -->
        <Modal v-model="viewRecordModal.isShow" width="920" :title="viewRecordModal.title" footer-hide>
            <div class="from-verification" v-if="recordList.length >0">
                <view-record :recordList='recordList'></view-record>
            </div>
            <template v-else>
                <div style="min-height: 350px;position: relative">
                    <nothink type="project" :text="noData"></nothink>
                </div>
            </template>
        </Modal>
        <!-- 查看凭证对话框 -->
        <Modal v-model="viewVoucherModal.isShow" width="920" :title="viewVoucherModal.title" footer-hide
               v-if="voucherImg">
            <div class="from-verification" style="text-align: center;padding:25px;">
                <img :src="voucherImg" width="800px" height="500px">
            </div>
        </Modal>
        <!-- 上传凭证对话框 -->
        <Modal v-model="viewVoucherModal.isShow" width="920" :title="uploadCredentials" v-else @on-ok="confirmUpload"
               @on-cancel="cancelUpload">
            <template>
                <voucher-upload :id="uploadId" v-on:FileUploadedSuccess="FileUploadedSuccess"
                                v-on:UploadProgress="UploadProgress" :isShowProgress="false">
                    <template slot="upload" style="position: relative;">
                        <div v-if="fileShow" style="min-width:120px;min-height:120px;">
                            <img v-if="voucher " :src="voucher" class="uploadImg" style="cursor: pointer;" width="800px"
                                 height="500px">
                            <button :id="uploadId" class="btn"
                                    style="position: absolute;top: 0;left: 0; width: 100%;height: 100%; opacity: 0;cursor: pointer;">
                                {{$t('upload.upload_chooseFile')}}
                            </button>
                            <div class="shade" v-show="!voucher"
                                 style="width: 100%;height: 100%;text-align: center;cursor: pointer;position: absolute;top: 0px;overflow: hidden;opacity: 1;ext-align: center;background: @baseboard;margin-top: 2%;">
                                <Icon style="font-size:28px;color:#3bceb6;vertical-align:bottom;padding-top:15px;"
                                      type="ios-cloud-upload"></Icon>
                                <p>{{$t('companyProject.com_clickUpload')}}</p>
                            </div>
                        </div>
                    </template>
                </voucher-upload>
            </template>
        </Modal>
        <Modal v-model="deleteModel" :title="deleteDetails" width="350px" @on-ok="remove">
            <p style="font-size: 15px">{{$t('companyProject.com_delete')}}</p>
        </Modal>
    </div>
</template>
<script>
import api from "api";
import Cookies from "js-cookie";
import addExpenditure from "./components/addExpenditure.vue";
import viewRecord from "./components/viewRecord.vue";
import dropFilter from "./components/dropFilter.vue";
import voucherUpload from "@/components/upload"; // 引入上传组件
export default {
    data() {
      return {
        fileShow: true, // 文件上传
        voucher: "", // 上传凭证
        voucherId: null, // 凭证ID
        selectData: null,
        noData: i18n.t('tip.tip_noData'),
        uploadCredentials: i18n.t('companyProject.com_uploadCredentials'),
        notAvailable: i18n.t('project.pro_notAvailable'),
        deleteDetails: i18n.t('companyProject.com_deleteDetails'),
        addScreen: i18n.t('companyProject.com_addScreen'),
        selectStarDate: i18n.t('companyProject.com_selectStarDate'),
        selectEndDate: i18n.t('companyProject.com_selectEndDate'),
        noData: i18n.t('tip.tip_noData'),
        powerToken: "", // 权限
        statisticalDate: null,
        sum: null, //总计
        paySum: null, // 已支出
        unPaySum: null, // 未支出
        wagesNum: null, // 工资总数
        expenseNum: null, // 报销总数
        otherNum: null, // 其他总数
        receiveNum: null, // 收款方总数
        editIndex: -1, // 当前聚焦的输入框的行数
        deleteModel: false, // 确认删除面板
        deleteID: null, // 删除id
        expenditureList: [],
        isDatePicker: false,
        payeeList: [],
        leaderList: [],
        beginTime: "", // 搜索统计开始时间
        endTime: "", //  搜索统计结束时间
        searchItem: {
          purpose: "", //支出用途
          receivingParty: "", // 收款方
          operator: "", // 经办人
          summary: "", //摘要
          source: "", // 来源
          statisticalTime: "" //统计日期
      },
        expenditureModal: {
          isShow: false,
          title: i18n.t('companyProject.com_addExpenditure'),
          btn: i18n.t('companyProject.com_confirmAdd')
      },
        viewRecordModal: {
          isShow: false,
          title: i18n.t('companyProject.com_recordDetails')
      },
        viewVoucherModal: {
          isShow: false,
          title: i18n.t('companyProject.com_viewVoucher')
      },
        voucherImg: null,
        addInputVal: null,
        recordList: [], // 修改记录列表
        formItem: {
          expenditure: ""
      },
        token: localStorage.token, // token值
        page: {
          creentPage: 1, // 当前页数
          total: 0, // 初始化信息总条数
          page_size: 10 // 每页显示多少条数据
      },
        startDate: null,
        endDate: null,
        sumMoneyData: [], // 金额
        sourceData: [], // 来源
        personnelData: [], // 人员
        receivePartyData: [] // 收款方
    };
  },
    components: {
      addExpenditure,
      viewRecord,
      voucherUpload,
      dropFilter
  },
    computed: {
      uploadId() {
        return "upload" + Math.random();
    }
  },
    mounted() {
      this.initFun();
  },
    methods: {
      async initFun() {
        let res = await api.payInitInterface();
        if (res.data.err_code == 0) {
          this.powerToken = res.data.data.acc_token;
          this.getExpenditureList({ acc_token: this.powerToken });
          this.$bus.on("getInputVal", val => {
            this.addInputVal = val;
        });
          this.getPayeeList();
          this.getLeaderList();
          this.filterDate();
          if (res.data.guide === "incomeOrExpenditure") {
            this.bubble();
        }
      } else {
          this.$Messages.error(res.data.err_message);
      }
    },
      bubble() {
        let text = this.$lau.bubble.incomeOrExpenditure;
        let defaultOptions = [
          {
              id: "expenditure",
              position: "bottom",
              title: text[0].title, // newTaskContract
              content: text[0].content
          },
          {
              id: "addExpenditure",
              position: "left",
              title: text[1].title,
              content: text[1].content,
              relative: "body"
          }
      ];
        this.$bubble(defaultOptions);
    },
      async getExpenditureList(params) {
        let { data } = await api.getExpenditureData(params);
        if (data.err_code == 0) {
          this.expenditureList = data.data.data;
          this.sum = data.data.pay_sum;
          this.paySum = data.data.pay;
          this.unPaySum = data.data.wait_pay;
          this.wagesNum = data.data.wage_num;
          this.expenseNum = data.data.reimbursement_num;
          this.otherNum = data.data.other_num;
          this.receiveNum = data.data.get_count;
          this.page.total = parseInt(data.data.page.count);
          this.expenditureList.forEach((creent, index) => {
            if (creent.file_name) {
              let intercept = creent.file_name.lastIndexOf("/");
              creent.file_name = creent.file_name.slice(intercept + 1);
          }
            if (creent.summary == "1") {
              creent.summary = i18n.t('companyProject.com_wages');
          } else if (creent.summary == "2") {
              creent.summary = i18n.t('companyProject.com_reimbursement');
          } else if (creent.summary == "3") {
              creent.summary = i18n.t('companyProject.com_payment');
          } else if (creent.summary == "4") {
              creent.summary = i18n.t('companyProject.com_applyMoney');
          }
            if (creent.data_resource == 1) {
              creent.data_resource = i18n.t('companyProject.com_systemGeneration');
          } else if (creent.data_resource == 2) {
              creent.data_resource = i18n.t('companyProject.com_handAdd');
          }
        });
      } else {
          this.$Message.error(data.err_message);
      }
    },
    // ------------------------------------ 增 --------------------------------- //
      addBtn() {
        this.expenditureModal.isShow = true;
        this.$refs.addExpenditure.clear();
    },
      cancelAdd() {
        this.expenditureModal.isShow = false;
        this.$refs.addExpenditure.clear();
    },
      async confirmAdd() {
        if (!this.addInputVal.time) {
          this.$Message.error(i18n.t('companyProject.com_inputPaymentDate'));
      } else if (!this.addInputVal.use) {
          this.$Message.error(i18n.t('companyProject.com_payPurpose'));
      } else if (!this.addInputVal.counterparty) {
          this.$Message.error(i18n.t('companyProject.com_inputReceivables'));
      } else if (!this.addInputVal.pay) {
          this.$Message.error(i18n.t('companyProject.com_moneyNotNull'));
      } else if (isNaN(this.addInputVal.pay)) {
          this.$Message.error(i18n.t('companyProject.com_moneyBookNumber'));
      } else if (this.addInputVal.pay <= 0) {
          this.$Message.error(i18n.t('companyProject.com_moneyNotZero'));
      } else if (!this.addInputVal.summary) {
          this.$Message.error(i18n.t('companyProject.com_typeNotNull'));
      } else if (!this.addInputVal.operator) {
          this.$Message.error(i18n.t('companyProject.com_managerNotNull'));
      } else {
          delete this.addInputVal.addPeople;
          this.addInputVal.acc_token = this.powerToken;
          let { data } = await api.addExpenditureData(this.addInputVal);
          if (data.err_code == 0) {
            this.$Message.success(i18n.t('companySetUp.setUp_addSuccess'));
            this.expenditureModal.isShow = false;
            this.getExpenditureList({ acc_token: this.powerToken });
            this.getPayeeList();
            this.getLeaderList();
        }
      }
    },
    // ------------------------------------ 删 --------------------------------- //
      deleteData(val) {
        this.deleteModel = true;
        this.deleteID = val;
    },
      async remove() {
        let res = await api.delExpenditureData({
          id: this.deleteID,
          acc_token: this.powerToken
      });
        if (res.data.err_code == 0) {
          this.$Message.success(i18n.t('companySetUp.setUp_removeSuccess'));
          this.getExpenditureList({ acc_token: this.powerToken });
      } else {
          this.$Message.error(i18n.t('companyProject.com_deleteFail'));
      }
    },
    // ------------------------------------ 查 --------------------------------- //
      search(value) {
        let params = {
          pay_use: this.searchItem.purpose,
          counterparty: this.searchItem.receivingParty,
          operator: this.searchItem.operator,
          summary: this.searchItem.summary,
          data_resource: this.searchItem.source,
        // begin: this.beginTime,
        // end: this.endTime,
          begin: this.startDate,
          end: this.endDate,
          page: this.page.creentPage,
          limit: this.page.page_size,
          acc_token: this.powerToken
      };
      // console.log("要传后台的参数", params);
        if (value == "") {
          params.begin = "";
          params.end = "";
      }
        this.getExpenditureList(params);
    },
    // 搜索支出用途
      searchPurpose() {
        this.search();
        this.searchItem.purpose = "";
    },
    // 收款方列表
      async getPayeeList() {
        let { data } = await api.payeeData({ acc_token: this.powerToken });
        if (data.err_code == 0) {
          data.data.forEach(item => {
            this.payeeList.push(item);
        });
      } else {
          this.$Message.error(data.err_message);
      }
    },
    // 搜索收款方
      handleSearchReceive(value) {
        this.searchItem.receivingParty = value;
        this.search();
    },
    // 经办人列表
      async getLeaderList() {
        let { data } = await api.leaderData({ acc_token: this.powerToken });
        if (data.err_code == 0) {
          data.data.forEach(item => {
            this.leaderList.push(item);
        });
      } else {
          this.$Message.error(data.err_message);
      }
    },
    // 搜索经办人
      handleSearchOperator(value) {
        this.searchItem.operator = value;
        this.search();
    },
    // 搜索摘要
      handleSearchSummary(value) {
        this.searchItem.summary = value;
        this.search();
    },
    // 搜索来源
      handleSearchSourcer(value) {
        this.searchItem.source = value;
        this.search();
    },
    // 获取当前时间
      getNowFormatDate(timeValue) {
        let currentdate = new Date().getTime();
        let toDay = 24 * 60 * 60 * 1000;
        let begin = new Date(currentdate - timeValue * toDay);
        let end = new Date(currentdate);
        this.beginTime =
        begin.getFullYear() +
        "-" +
        (begin.getMonth() + 1) +
        "-" +
        begin.getDate();
        this.endTime =
        end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate();
    },
    // 搜索统计日期
   
      changeTime(timeData) {
        this.beginTime = timeData[0];
        this.endTime = timeData[1];
        this.search();
    },
      clearime(type) {
        this.isDatePicker = false;
        this.statisticalDate = null;
        this.searchItem.statisticalTime = "";
        if (type == "start") {
          this.startDate = null;
          this.search();
      } else if (type == "end") {
          this.endDate = null;
          this.search();
      }
    },

    // 查看记录详情
      async viewRecord(val) {
        this.viewRecordModal.isShow = true;
        let { data } = await api.viewRecordData({
          id: val,
          acc_token: this.powerToken
      });
        if (data.err_code == 0) {
          this.recordList = data.data.data;
      } else {
          this.$Message.error(data.err_message);
      }
    },
    // 查看凭证
      viewVoucher(item) {
        this.viewVoucherModal.isShow = true;
        if (item.file) {
          this.voucherImg = item.file;
      } else {
          this.voucherImg = null;
          this.selectData = item;
      }
    },
    // ------------------------------------ 改 --------------------------------- //
      editData(item, index) {
        this.formItem.expenditure = item.pay;
        this.editIndex = index;
    },
      async handleSave(item, index) {
        let params = {
          id: item.id,
          pay: this.formItem.expenditure,
          acc_token: this.powerToken
      };
        if (isNaN(params.pay)) {
          this.$Message.error(i18n.t('companyProject.com_mustNumber'));
      } else if (!params.pay) {
          this.$Message.error(i18n.t('companyProject.com_contentNotNull'));
      } else if (params.pay == item.pay) {
          this.$Message.warning(i18n.t('companyProject.com_moneyRecord'));
      } else {
          let data = await api.editExpenditureData(params);
          if (data.data.err_code == 0) {
            this.$Message.success(i18n.t('companyProject.com_editSueccs'));
            this.getExpenditureList({ acc_token: this.powerToken });
        } else {
            this.$Message.error(data.data.err_message);
        }
          this.editIndex = -1;
      }
    },
    // 选择统计日期
      changeStartDate(date) {
        this.startDate = date;
    },
      changeEndDate(date) {
        this.endDate = date;
        if (this.startDate) {
          if (
          parseInt(new Date(date).getTime()) <=
          parseInt(new Date(this.startDate).getTime())
        ) {
            this.$Message.warning(i18n.t('companyProject.com_effectiveDate'));
        } else {
            this.filterDate();
            this.search();
        }
      }
    },
      async filterDate() {
        let params = {
          begin: this.startDate,
          end: this.endDate,
          acc_token: this.powerToken
      };
        let { data } = await api.filterDate(params);
        if (data.err_code == 0) {
          this.sumMoneyData = data.data.price;
          this.sourceData = data.data.source;
          this.personnelData = data.data.user;
          this.receivePartyData = data.data.counterparty;
          this.settingDataAttribute(this.sumMoneyData);
          this.settingDataAttribute(this.sourceData);
          this.settingDataAttribute(this.personnelData);
          this.settingDataAttribute(this.receivePartyData);
      }
    },
    // 设置初始数据属性
      settingDataAttribute(data) {
        data.forEach(item => {
          item.expand = false;
          item.selected = false;
          if (item.child) {
            this.settingDataAttribute(item.child);
        }
      });
    },
    // ------------------------------------ 导出excel表格数据 --------------------------------- //
      exportExcel() {
        let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_pay_listexcel;
        let download = this.GLOBAL.apiDomain + '/' + url + "&token=" + this.token + "&acc_token=" + this.powerToken;
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = download;
        a.click();
        window.URL.revokeObjectURL(download);  //下载完成进行释放
    },
    // ------------------------------------ 分页 --------------------------------- //
      changePage(nowPage) {
        this.page.creentPage = nowPage;
        let params = {
          page: this.page.creentPage,
          limit: this.page.page_size,
          acc_token: this.powerToken
      };
        this.getExpenditureList(params);
    },
    // 上传凭证
      async confirmUpload() {
        let params = {
          id: this.selectData.id,
          file_id: this.voucherId,
          acc_token: this.powerToken
      };
        let { data } = await api.editExpenditureData(params);
        if (data.err_code == 0) {
          this.$Message.success(i18n.t('companyProject.com_uploadScuess'));
          this.getExpenditureList({ acc_token: this.powerToken });
          this.voucher = "";
      } else {
          this.$Message.error(data.err_message);
      }
    },
    // 取消上传按钮
      cancelUpload() {
        this.voucherId = null;
        this.voucher = "";
    },
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
    // 确定选择
      definiteChoice(selectedItem) {
      //console.log('选择后的数据selectedItem',selectedItem);
        let parentKey = [];
        let newArr = [];
        let params = {};
        let child = [];
        params.acc_token = this.powerToken;
        if (selectedItem && selectedItem.length > 0) {
          selectedItem.forEach((key, index) => {
            if (key.parent_key) {
              parentKey.push(key.parent_key);
              return parentKey;
          } else {
              if (key.key == 'all'){
                params = { acc_token: this.powerToken };
                selectedItem = [];
            } else {
                child.push(key.key);
                params.counterparty = JSON.stringify(child);
                params.user = JSON.stringify(child);
            }

          }
        });
          parentKey.forEach((items, index) => {
            if (!newArr.includes(items)) {
              newArr.push(items);
              return newArr;
          }
        });
          newArr.forEach((item, index) => {
            child.push([]);
            selectedItem.forEach((key, indexs) => {
              if (item === key.parent_key) {
                child[index].push(key.key);
                params[item] = JSON.stringify(child[index]);
            }
          });
        });
          this.getExpenditureList(params);
      }
    }
  }
};
</script>

<style lang="less">
@import "./components/style/detailedCommonStyle.less";
</style>

