<template>
    <div class="income-details">
        <div class="content">
            <div class="content-top">
                <div class="btn-style">
                    <Button size='small' id="btnStyle" @click="addIncome" class="addBtn">
                        <i class="iconfonts icon-xinjian"></i>&nbsp;{{$t('companyProject.com_addIncome')}}
                    </Button>
                </div>
                <div class="filters-condition">
                    <drop-filter :selectedHolder="addScreen" :sumMoneyData="sumMoneyData" :sourceData="sourceData"
                                 :personnelData="personnelData" :receivePartyData="receivePartyData" multiple
                                 @definiteChoice="definiteChoice"></drop-filter>
                </div>
            </div>
            <div class="over-view">
                <div class="total-income">
                    <div class="total-income-show">
                        <p class="text">{{$t('memberAauthority.power_total')}}</p>
                        <p class="sum">￥{{allSum || '0'}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_grossProceeds')}}</p>
                        <p class="sum">￥{{incomeSum || '0'}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_totalOutstanding')}}</p>
                        <p class="sum">￥{{balanceSum || '0'}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_totalProject')}}</p>
                        <p class="sum">{{projectSum || '0'}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_totalTest')}}</p>
                        <p class="sum">{{taskSum || '0'}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_totalOther')}}</p>
                        <p class="sum">{{otherSum || '0'}}</p>
                    </div>
                    <div class="total-income-show">
                        <p class="text">{{$t('companyProject.com_paymentTotal')}}</p>
                        <p class="sum">{{payCount || '0'}}</p>
                    </div>
                    <template>
                        <div class="filters-date">
                            <p>
                                <Icon type="android-calendar"></Icon>
                                {{$t('companyProject.com_statisticalTimeRange')}}
                            </p>
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
                <!-- <div class="operation" >
                   <span id="operation"  class="filters-box">
                       <div class="aside"><Input icon="ios-search" placeholder="收入来源" v-model="searchContent.source" @on-click="handleSearchSource" size="small" style="width: 300px"></Input></div>
                       <div class="filters">
                           <div class='filter-item' id="">
                               <Select v-model="searchContent.payer" placeholder="按付款方筛选"  @on-change='handleSearchPayer'>
                                   <Option value="" >全部</Option>
                                   <Option v-for="(item,index) in payerList" :value="item" :key="index">{{ item }}</Option>
                               </Select>
                           </div>
                           <div class='filter-item'>
                               <Select v-model="searchContent.leader"  placeholder="按负责人筛选"  @on-change="handleSearchHeader">
                                   <Option value="" >全部</Option>
                                   <Option v-for="(item,index) in leaderList" :value="item" :key="index">{{ item }}</Option>
                               </Select>
                           </div>
                           <div class='filter-item'>
                               <Select v-model="searchContent.dataSource"  placeholder="按数据来源筛选"  @on-change="handleSearchDataSourcer">
                                   <Option value="" >全部</Option>
                                   <Option v-for="item in dataSourceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                               </Select>
                           </div>
                           <div class='filter-item'>
                               <Select v-model="searchContent.type"  placeholder="按类型筛选"  @on-change="handleSearchType">
                                   <Option value="" >全部</Option>
                                   <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                               </Select>
                           </div>
                           <div class="filters-date">
                               <p>统计日期</p>
                               <DatePicker type="daterange" format="yyyy-MM-dd" placeholder="选择日期" v-show="isDatePicker" :value="statisticalDate" @on-change="changeEnrollDate" @on-clear ='clearEnrollDate'></DatePicker>
                               <Select v-model="searchContent.selectModel" style="width:160px;" placeholder='按统计日期筛选'  @on-change="changeStatisticalDate" v-show="!isDatePicker">
                                   <Option value="" >全部</Option>
                                   <Option  v-for="item in timeList" :value="item.value" :key="item.value">{{ item.value }}</Option >
                               </Select>
                           </div>
                       </div>
                   </span>
                    <div class="btn-style">
                        <Button size='small' id="btnStyle" @click="addIncome"><i class="iconfonts icon-xinjian"></i>&nbsp;添加收入</Button>
                        <Button size='small' @click="exportExcel"><i class="iconfonts icon-export"></i>&nbsp;导出excel</Button>
                    </div>
                </div> -->
            </div>
            <template>
                <div class="income-details-list">
                    <div class="list-header">
                        <span>{{$t('companyProject.com_totleIncome')}}</span>
                        <span>{{$t('companyProject.com_actualReceipts')}}</span>
                        <span>{{$t('companyProject.com_outstandingBalance')}}</span>
                        <span>{{$t('lang.lang_type')}}</span>
                        <span style="flex:2;">{{$t('companyProject.com_makeCollections')}}</span>
                        <span>{{$t('companyProject.com_collectionTime')}}</span>
                        <span>{{$t('companyProject.com_payer')}}</span>
                        <span>{{$t('companyProject.com_incomeStage')}}</span>
                        <span>{{$t('companyProject.com_invoice')}}</span>
                        <span>{{$t('companyProject.com_addPeople')}}</span>
                        <span>{{$t('companyProject.com_modificationRecord')}}</span>
                        <span>{{$t('lang.lang_operating')}}</span>
                    </div>
                    <dl v-if="incomeList && incomeList.length > 0">
                        <dd v-for="(item,index) in incomeList" :key="index">
                            <span>{{item.total_income}}</span>
                            <Input type="text" v-model="formItem.editIncome" v-if="editIndex === index" :autofocus='true' style="width: 160px;line-height: 60px;margin-left: 16px;"></Input>
                            <span style="font-size: 14px" v-else>{{item.income}}</span>
                            <span>{{item.balance}}</span>
                            <span style="font-size: 14px;cursor:pointer;" :title="item.type">{{item.type}}</span>
                            <!-- showCheckBtn && item.data_resource == 1 -->
                            <span style="flex:2;">{{item.name}} <i style="padding:3px 4px;border:1px solid #eef1f2;color:#5fd4c0;" @click="viewToSource(item)" v-if="item.project_id != 0 && item.data_resource == 1">{{$t('workbench.work_lookOverTag')}}</i></span>
                            <span>{{item.time}}</span>
                            <span>{{item.pay_company}}</span>
                            <span>{{item.step}}</span>
                            <span style="cursor:pointer;" @click='viewInvoice(item)'>{{item.file_name || notAvailable}}<i style="padding:3px 4px;border:1px solid #eef1f2;color:#5fd4c0;" v-if="item.file_name">{{$t('workbench.work_lookOverTag')}}</i></span>
                            <span>{{item.create_user}}</span>
                            <span>{{item.record_count}} <i style="padding:3px 4px;border:1px solid #eef1f2;color:#5fd4c0;" @click="viewRecord(item)">{{$t('companyProject.com_record')}}</i></span>
                            <span v-if="editIndex === index">
                              <Button @click="handleSave(item,index)" type="text" size="small" class='save'>{{$t('lang.lang_save')}}</Button>
                              <Button @click="editIndex = -1" type="text" size="small" class='cancel'>{{$t('lang.lang_cancel')}}</Button>
                            </span>
                            <span class="action" v-else>
                                <i class="ivu-icon ivu-icon-edit" @click="editData(item,index)"></i>
                                <i class="iconfonts icon-shanchu" @click="deleteData(item.id)"></i>
                            </span>
                        </dd>
                    </dl>
                    <template v-else>
                        <div style="min-height: 700px;position: relative">
                            <nothink type="project" :text='noData'></nothink>
                        </div>
                    </template>
                </div>
            </template>
            <div class="paging-style">
                <Page v-if="page.total > 10" :current="page.creentPage" :total="page.total" :page-size="page.page_size"
                      @on-change="onChangePage"></Page>
            </div>
        </div>
        <!-- 添加收入对话框 -->
        <Modal v-model="addIncomeModal" width="660" :title="icometitle" :ok-text="incomeBtn" :mask-closable="false">
            <div class="from-verification">
                <add-income ref="addIncome" :powerToken='powerToken'></add-income>
            </div>
            <div slot="footer">
                <Button type="text" size="large" style="font-size: 13px" @click="incomeCancel">
                    {{$t('lang.lang_cancel')}}
                </Button>
                <Button type="primary" size="large" style="font-size: 13px" @click="icomeOk">
                    {{$t('companyProject.com_confirmAdd')}}
                </Button>
            </div>
        </Modal>
        <!-- 查看修改记录对话框 -->
        <Modal v-model="viewRecordModal.isShow" width="920" :title="viewRecordModal.title" footer-hide>
            <div class="from-verification" v-if="recordList.length >0">
                <view-record :recordList='recordList'></view-record>
            </div>
            <template v-else>
                <div style="min-height: 350px;position: relative">
                    <nothink type="project" :text='noData'></nothink>
                </div>
            </template>
        </Modal>
        <!-- 删除明细对话框 -->
        <Modal v-model="deleteDtailModel" :title='deleteDetails' width="350px" @on-ok="deleteDtail">
            <p style="font-size: 15px">{{$t('companyProject.com_delete')}}</p>
        </Modal>
        <!-- 查看凭证对话框 -->
        <Modal v-model="viewInvoiceModal.isShow" width="920" :title="viewInvoiceModal.title" footer-hide
               v-if="invoiceImg">
            <div class="from-verification" style="text-align: center;padding:25px;">
                <img :src="invoiceImg" width="800px" height="500px">
            </div>
        </Modal>
        <!-- 上传凭证对话框 -->
        <Modal v-model="viewInvoiceModal.isShow" width="920" :title='uploadCredentials' v-else @on-ok="confirmUpload"
               @on-cancel="cancelUpload">
            <template>
                <voucher-upload :id="uploadId" v-on:FileUploadedSuccess="FileUploadedSuccess"
                                v-on:UploadProgress="UploadProgress" :isShowProgress="false">
                    <template slot="upload" style="position: relative;">
                        <div v-if="fileShow" style="min-width:120px;min-height:120px;">
                            <img v-if="voucher " :src="voucher" class="uploadImg" style="cursor: pointer;" width="800px" height="500px">
                            <button :id="uploadId" class="btn" style="position: absolute;top: 0;left: 0; width: 100%;height: 100%; opacity: 0;cursor: pointer;">
                                {{$t('upload.upload_chooseFile')}}
                            </button>
                            <div class="shade" v-show="!voucher" style="width: 100%;height: 100%;text-align: center;cursor: pointer;position: absolute;top: 0px;overflow: hidden;opacity: 1;ext-align: center;background: @baseboard;margin-top: 2%;">
                                <Icon style="font-size:28px;color:#3bceb6;vertical-align:bottom;padding-top:15px;" type="ios-cloud-upload"></Icon>
                                <p>{{$t('companyProject.com_clickUpload')}}</p>
                            </div>
                        </div>
                    </template>
                </voucher-upload>
            </template>
        </Modal>
    </div>
</template>
<script>
    import api from "api";
    import Cookies from "js-cookie";
    import addIncome from "./components/addIncome.vue";
    import viewRecord from "./components/viewRecord.vue";
    import dropFilter from "./components/dropFilter.vue";
    import voucherUpload from "@/components/upload"; // 引入上传组件
    export default {
        data() {
            return {
                powerToken: "", // 权限判断
                statisticalDate: null, // 自选统计日期
                startDate: null,
                endDate: null,
                deleteDtailModel: false, // 确认删除面板
                deleteID: null, // 确认删除ID
                searchTime: "", // 搜索统计开始时间
                currentTime: "", //  搜索统计结束时间
                addScreen: i18n.t('companyProject.com_addScreen'),
                selectStarDate: i18n.t('companyProject.com_selectStarDate'),
                selectEndDate: i18n.t('companyProject.com_selectEndDate'),
                handAdd: i18n.t('companyProject.com_handAdd'),
                showCheckBtn: false,
                noData: i18n.t('tip.tip_noData'),
                notAvailable: i18n.t('project.pro_notAvailable'),
                deleteDetails: i18n.t('companyProject.com_deleteDetails'),
                uploadCredentials: i18n.t('companyProject.com_uploadCredentials'),
                searchContent: {
                    source: "", // 收入来源
                    payer: null, // 付款方
                    leader: null, // 负责人
                    dataSource: null, // 数据来源
                    type: null, // 类型
                    selectModel: "" // 统计日期
                },
                formItem: {
                    editIncome: ""
                },
                addIncomeModal: false, //添加收入对话框
                addInputVal: {},
                icometitle: i18n.t('companyProject.com_Details'),
                incomeBtn: i18n.t('companyProject.com_confirmAdd'),
                allSum: null,
                incomeSum: null,
                balanceSum: null,
                projectSum: null,
                taskSum: null,
                otherSum: null,
                payCount: null,
                incomeList: [], // 收入明细列表
                payerList: [],
                leaderList: [],
                isDatePicker: false,
                editIndex: -1, // 当前聚焦的输入框的行数
                page: {
                    creentPage: 1, // 当前页数
                    total: 0, // 初始化信息总条数
                    page_size: 10 // 每页显示多少条数据
                },
                token: localStorage.token, // token值
                viewRecordModal: {
                    isShow: false,
                    title: i18n.t('companyProject.com_recordDetails')
                },
                recordList: [], // 修改记录列表
                filtersRange: null,
                viewInvoiceModal: {
                    isShow: false,
                    title: i18n.t('companyProject.com_viewVoucher')
                },
                invoiceImg: null,
                selectData: null,
                voucherId: null, // 凭证ID
                voucher: "", // 上传凭证
                fileShow: true, // 文件上传
                sumMoneyData: [], // 金额
                sourceData: [], // 来源
                personnelData: [], // 人员
                receivePartyData: [] // 收款方
            };
        },
        components: {
            addIncome,
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
        created() {
        },
        methods: {
            // 初始化接口
            async initFun() {
                const res = await api.incomeInitInterface();
                if (res.data.err_code == 0) {
                    this.powerToken = res.data.data.acc_token;
                    this.getIncomeList({acc_token: this.powerToken});
                    this.$bus.on("getInputVal", val => {
                        this.addInputVal = val;
                    });
                    this.getPayerList();
                    this.getLeaderList();
                    this.screenDate();
                    if (res.data.guide === "incomeOrExpenditure") {
                        this.bubble();
                    }
                }
            },
            bubble() {
                let text = this.$lau.bubble.incomeOrExpenditure;
                let defaultOptions = [
                    {
                        id: "operation",
                        position: "bottom",
                        title: text[0].title, // newTaskContract
                        content: text[0].content
                    },
                    {
                        id: "btnStyle",
                        position: "left",
                        title: text[1].title,
                        content: text[1].content,
                        relative: "body"
                    }
                ];
                this.$bubble(defaultOptions);
            },
            // 收入明细列表数据
            async getIncomeList(params) {
                let res = await api.getIncomeData(params);
                if (res.data.err_code == 0) {
                    this.allSum = res.data.data.sum;
                    this.incomeSum = res.data.data.income_sum;
                    this.balanceSum = res.data.data.balance_sum;
                    this.projectSum = res.data.data.project_num;
                    this.taskSum = res.data.data.task_num;
                    this.otherSum = res.data.data.other_num;
                    this.payCount = res.data.data.pay_count;
                    this.page.total = parseInt(res.data.data.page.count);
                    this.page.creentPage = parseInt(res.data.data.page.page);
                    this.incomeList = res.data.data.data;
                    this.incomeList.forEach((creent, index, arr) => {
                        if (creent.file_name) {
                            let intercept = creent.file_name.lastIndexOf("/");
                            creent.file_name = creent.file_name.slice(intercept + 1);
                        }
                        if (creent.type == 1) {
                            creent.type = i18n.t('companyProject.com_project');
                        } else if (creent.type == 2) {
                            creent.type = i18n.t('memberAauthority.power_testTask');
                        } else if (creent.type == 3) {
                            creent.type = creent.type_name;
                        }
                        //   收入来源  1 系统生成  2 手动添加
                        if (creent.data_resource == 1) {
                            //   creent.data_resource = i18n.t('companyProject.com_systemGeneration');
                            this.showCheckBtn = true;
                        } else if (creent.data_resource == 2) {
                            //   creent.data_resource = i18n.t('companyProject.com_handAdd');
                            this.showCheckBtn = false;
                        }
                    });
                }
            },
            // --------------------------------------- 查 -------------------------- //
            search(value) {
                let params = {
                    leader: this.searchContent.leader,
                    data_resource: this.searchContent.dataSource,
                    income_type: this.searchContent.type,
                    income_resource: this.searchContent.source,
                    pay_company: this.searchContent.payer,
                    // begin: this.searchTime,
                    // end: this.currentTime,
                    begin: this.startDate,
                    end: this.endDate,
                    page: this.page.creentPage,
                    limit: this.page.page_size,
                    acc_token: this.powerToken
                };
                if (value == "") {
                    params.begin = "";
                    params.end = "";
                }
                this.getIncomeList(params);
            },
            handleSearchSource() {
                this.search();
                this.searchContent.source = "";
            },
            handleSearchPayer(value) {
                this.searchContent.payer = value;
                this.search();
            },
            handleSearchHeader(value) {
                this.searchContent.leader = value;
                this.search();
            },
            handleSearchDataSourcer(val) {
                this.searchContent.dataSource = val;
                this.search();
            },
            handleSearchType(val) {
                this.searchContent.type = val;
                this.search();
            },
            changeEnrollDate(data) {
                // console.log('---------',data);
                this.searchTime = data[0];
                this.currentTime = data[1];
                this.search();
                // this.statisticalDate = null;
                // this.isDatePicker = false;
            },
            clearEnrollDate() {
                this.statisticalDate = null;
                this.isDatePicker = false;
                this.searchContent.selectModel = "";
            },
            // 付款方列表
            async getPayerList() {
                let {data} = await api.getPayerData({acc_token: this.powerToken});
                if (data.err_code == 0) {
                    data.data.forEach(item => {
                        this.payerList.push(item);
                    });
                }
            },
            //筛选项负责人列表
            async getLeaderList() {
                let {data} = await api.getLeaderData({acc_token: this.powerToken});
                if (data.err_code == 0) {
                    data.data.forEach(item => {
                        this.leaderList.push(item);
                    });
                }
            },
            // 获取当前时间
            getNowFormatDate(timeValue) {
                let currentdate = new Date().getTime();
                let toDay = 24 * 60 * 60 * 1000;
                let beginTime = new Date(currentdate - timeValue * toDay);
                let endTime = new Date(currentdate);
                this.searchTime =
                    beginTime.getFullYear() +
                    "-" +
                    (beginTime.getMonth() + 1) +
                    "-" +
                    beginTime.getDate();
                this.currentTime =
                    endTime.getFullYear() +
                    "-" +
                    (endTime.getMonth() + 1) +
                    "-" +
                    endTime.getDate();
            },
            //
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
                        this.$Message.warning("结束日期不能小于或等于开始日期");
                    } else {
                        this.search();
                        this.screenDate();
                    }
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
            // 筛选统计时间范围
            async screenDate() {
                let params = {
                    begin: this.startDate,
                    end: this.endDate,
                    acc_token: this.powerToken
                };
                let {data} = await api.screenDate(params);
                if (data.err_code == 0) {
                    this.sumMoneyData = data.data.price;
                    this.sourceData = data.data.source;
                    this.personnelData = data.data.leader;
                    this.receivePartyData = data.data.counterparty;
                    this.settingDataAttribute(this.sumMoneyData);
                    this.settingDataAttribute(this.sourceData);
                    this.settingDataAttribute(this.personnelData);
                    this.settingDataAttribute(this.receivePartyData);
                }
            },
            clearime(type) {
                if (type == "start") {
                    this.startDate = null;
                } else if (type == "end") {
                    this.endDate = null;
                }
            },
            // 确定选择
            definiteChoice(selectedItem) {
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
                            if (key.key == 'all') {
                                params = {acc_token: this.powerToken};
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
                    this.getIncomeList(params);
                } else {
                    this.getIncomeList({acc_token: this.powerToken});
                }

            },
            // 导出excel表格数据
            exportExcel() {
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_excel;
                let download = this.GLOBAL.apiDomain + '/' + url + "&token=" + this.token + "&acc_token=" + this.powerToken;
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.href = download;
                a.click();
                window.URL.revokeObjectURL(download);  //下载完成进行释放
            },
            // 分页
            onChangePage(nowPage) {
                this.page.creentPage = nowPage;
                let params = {
                    page: this.page.creentPage,
                    limit: this.page.page_size,
                    acc_token: this.powerToken
                };
                this.getIncomeList(params);
            },
            // -------------------------------- 改 ------------------------------ //
            editData(value, index) {
                this.formItem.editIncome = value.income;
                this.editIndex = index;
            },
            async handleSave(item, index) {
                let params = {
                    id: item.id,
                    income: this.formItem.editIncome,
                    acc_token: this.powerToken
                };
                if (isNaN(params.income)) {
                    this.$Message.error("输入的金额必须为数字!");
                } else if (!params.income) {
                    this.$Message.error("输入的金额不能为空!");
                } else if (params.income <= 0) {
                    this.$Message.error("输入的金额不能小于或等于0!");
                } else if (params.income == item.income) {
                    this.$Message.warning("未修改的金额将不作修改记录!");
                } else {
                    let data = await api.editIncomeData(params);
                    if (data.data.err_code == 0) {
                        this.$Message.success("编辑成功!");
                        this.getIncomeList({acc_token: this.powerToken});
                    }
                    this.editIndex = -1;
                }
            },
            // -------------------------------------- 删 ----------------------------------- //
            deleteData(val) {
                this.deleteDtailModel = true;
                this.deleteID = val;
            },
            async deleteDtail() {
                let res = await api.delIncomeData({
                    id: this.deleteID,
                    acc_token: this.powerToken
                });
                if (res.data.err_code == 0) {
                    this.$Message.success("删除成功!");
                    this.getIncomeList({acc_token: this.powerToken});
                }
            },
            // -------------------------------------- 增 ----------------------------------- //
            // 打开添加收入对话框
            addIncome() {
                this.addIncomeModal = true;
                this.$refs.addIncome.clearData();
            },
            // 取消添加
            incomeCancel() {
                this.addIncomeModal = false;
                this.$refs.addIncome.clearData();
            },
            // 确认添加收入
            icomeOk() {
                let url =
                    this.GLOBAL.baseRouter + this.$GLOBALAPI.company_finance_listadd;
                //     if (!this.addInputVal.addPeople) {
                //       this.$Message.error("输入的添加人不能为空!");
                //   } else
                if (!this.addInputVal.time) {
                    this.$Message.error("请选择收款日期!");
                } else if (!this.addInputVal.name) {
                    this.$Message.error("请输入的收入来源!");
                } else if (!this.addInputVal.pay_company) {
                    this.$Message.error("请输入的付款方!");
                } else if (isNaN(this.addInputVal.income)) {
                    this.$Message.error("输入的金额必须为数字!");
                } else if (!this.addInputVal.income) {
                    this.$Message.error("输入的金额不能为空!");
                } else if (isNaN(this.addInputVal.income_count)) {
                    this.$Message.error("输入的总阶段必须为数字!");
                } else if (!this.addInputVal.income_count) {
                    this.$Message.error("输入的总阶段不能为空!");
                } else if (this.addInputVal.income_count <= 0) {
                    this.$Message.error("输入的总阶段不能小于或等于0!");
                } else if (this.addInputVal.income_count < this.addInputVal.step) {
                    this.$Message.error("输入的当前收入阶段不能大于收入总阶段!");
                } else if (isNaN(this.addInputVal.step)) {
                    this.$Message.error("输入的阶段必须为数字!");
                } else if (!this.addInputVal.step) {
                    this.$Message.error("输入的阶段不能为空!");
                } else if (!this.addInputVal.type) {
                    this.$Message.error("请选择收入类型!");
                } else if (!this.addInputVal.leader) {
                    this.$Message.error("请输入项目负责人!");
                } else {
                    delete this.addInputVal.addPeople;
                    this.addInputVal.acc_token = this.powerToken;
                    this.$axios.post(url, this.addInputVal).then(msg => {
                        if (msg.data.err_code == 0) {
                            this.$Message.success("添加成功!");
                            this.addIncomeModal = false;
                            this.getIncomeList({acc_token: this.powerToken});
                            this.getPayerList();
                            this.getLeaderList();
                            this.$refs.addIncome.clearData();
                        }
                    });
                }
                // else if (isNaN(this.addInputVal.balance)) {
                //   this.$Message.error("输入的金额必须为数字!");
                // } else if (!this.addInputVal.balance) {
                //   this.$Message.error("输入的金额不能为空!");
                // }     // 财务系统取消手动添加项目未结金额
            },
            // 查看记录详情
            async viewRecord(item) {
                this.viewRecordModal.isShow = true;
                let {data} = await api.viewIRecordData({
                    id: item.id,
                    acc_token: this.powerToken
                });
                if (data.err_code == 0) {
                    this.recordList = data.data.data;
                }
            },
            // 查看收入来源 跳转到任务详情页面
            viewToSource(item) {
                if (item.type == "测试任务") {
                    this.$router.push({
                        path: "/epibol/ManageDetails",
                        query: {enteredID: item.source_id, TestID: item.resource_id, type: 'new'}
                    });
                } else if (item.type == "项目") {
                    sessionStorage.projectID = item.project_id;
                    this.$router.push({path: '/project/task'});
                }
            },
            // 查看发票
            viewInvoice(item) {
                this.viewInvoiceModal.isShow = true;
                if (item.file) {
                    this.invoiceImg = item.file;
                } else {
                    this.invoiceImg = null;
                    this.selectData = item;
                }
            },
            // 上传发票
            async confirmUpload() {
                let params = {
                    id: this.selectData.id,
                    file_id: this.voucherId,
                    acc_token: this.powerToken
                };
                let {data} = await api.editIncomeData(params);
                if (data.err_code == 0) {
                    this.$Message.success("上传成功!");
                    this.getIncomeList({acc_token: this.powerToken});
                    this.voucher = "";
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
            // 上传发票成功的回调
            FileUploadedSuccess(uploader) {
                this.fileShow = true;
                if (uploader.response) {
                    this.voucherId = JSON.parse(uploader.response).fid;
                    this.voucher = JSON.parse(uploader.response).file_url;
                }
            }
        }
    };
</script>

<style lang="less">
    @import "./components/style/detailedCommonStyle.less";
</style>

