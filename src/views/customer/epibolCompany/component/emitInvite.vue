<template>
    <div class="emitInvite">
        <dl>
            <dt>项目名称</dt>
            <dd>
                <Input v-model="projectInfos.project_name" :disabled="disableFlag"  placeholder="输入项目名称"></Input>
            </dd>
        </dl>
        <dl>
            <dt>项目预计总额</dt>
            <dd>
                <Input v-model="projectInfos.project_max_price" :disabled="disableFlag"  placeholder="项目预计总额"></Input>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>项目研发时间</dt>
            <dd>
                <DatePicker format="yyyy-MM-dd" type="daterange" :disabled="disableFlag"  placeholder="项目研发时间"  @on-change="startTime" style="width:100%" :value="projectInfos.projectDate" ></DatePicker>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>反馈截止时间</dt>
            <dd>
                <DatePicker format="yyyy-MM-dd" type="date"  :disabled="disableFlag"  placeholder="截止时间" style="width: 100%" @on-change="joinEndTime" :value="projectInfos.join_end_time"></DatePicker>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>附件</dt>
            <dd style="display: flex;justify-content: space-between;align-items: center">
                <template v-if="!disableFlag">
                    <ul v-if="accFile && accFile.length > 0" style="overflow-y: auto;max-height: 80px;padding-right: 10px">
                        <li  v-for="(item,index) in accFile">{{item.name}}</li>
                    </ul>
                    <general-upload  :showOtherInfos="showOtherInfos" :initParams="initParams"></general-upload>
                </template>
                <template v-else>
                    <ul class="filesDown" v-if="projectInfos.file && projectInfos.file.length > 0">
                        <li v-for="item in projectInfos.file">
                            <a v-if="item.response" :href="JSON.parse(item.response).file_url+'?response-content-type=application%2Foctet-stream'" download>{{item.name}} <i class="icon iconfonts icon-xiazai"></i></a>

                            <a v-else :href="item.file_url+'?response-content-type=application%2Foctet-stream'" download>{{item.name}} <i class="icon iconfonts icon-xiazai"></i></a>
                        </li>
                    </ul>
                    <span v-else style="color: #b3b3b3 ">暂无</span>
                </template>

            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>项目说明</dt>
            <dd>
                <Input v-model="projectInfos.description" type="textarea" :disabled="disableFlag" placeholder="请输入说明" style="width:100%" :autosize="{minRows: 2,maxRows: 5}"></Input>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl v-if="!disableFlag">
            <dt>选择外包邀请公司({{inviteCompany.length}})</dt>
            <dd>
                <ul class="ul">
                    <li class="title">
                        <Checkbox
                        :indeterminate="indeterminate"
                        :value="checkAll"
                        @click.prevent.native="handleCheckAll">全选</Checkbox>
                        <em>
                            <Input v-model="searchData" style="width:200px" placeholder="公司名称" @keyup.13.native="commitSearch">
                                <Button slot="append" icon="ios-search" size='small' @click="commitSearch"></Button>
                            </Input>

                        </em>
                    </li>
                    <li>
                         <CheckboxGroup v-model="inviteCompany" @on-change="checkAllGroupChange">
                            <span class="span" v-for="item in coopListData" :key="item.id">
                                <Checkbox :label="item.company_id">{{item.company}}</Checkbox>
                            </span>
                            <span v-if="coopListData.length == 0" class="notCompany">暂无可邀请公司</span>
                        </CheckboxGroup>
                         <div class="clear"></div>
                    </li>
                </ul>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl v-else>
            <dt>已邀请公司({{detailsData.length}})</dt>
            <dd class="tableSty">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <th style="text-align: left;width: 35%">公司名称</th>
                        <th style="width: 20%">邀请反馈</th>
                        <th style="width: 20%">联系人</th>
                        <th style="text-align: right;width: 25%">联系电话</th>
                    </tr>
                    <tr v-for="item in detailsData">
                        <td style="text-align: left">{{item.company}}</td>
                        <td style="text-align: center">{{item.status}}</td>
                        <td style="text-align: center">{{item.contact_people}}</td>
                        <td style="text-align: right">{{item.tel}}</td>
                    </tr>
                </table>
            </dd>
            <div class="clear"></div>
        </dl>
    </div>
</template>
<script>
import {cooperationApi} from 'api';
import GeneralUpload from "../../../../components/uploadAndPreview/generalUpload.vue";
export default {
    components: {
        GeneralUpload
    },
    data() {
        return {
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
            projectInfos: {
                project_name: '--',
                project_min_price: '0.00',
                project_max_price: '0.00',
                start_time: '00-00-00',
                end_time: '00-00-00',
                description: '暂无说明',
                join_end_time: '00-00-00',
                projectDate: []
            },
            searchData: null,
            accFile: [],
            indeterminate: false,
            checkAll: false,
            inviteCompany: [],
            coopListData: [],
            detailsTitle: [
                { title: "公司名称", key: "company", width: 200 },
                { title: "邀请反馈", key: "status" },
                { title: "联系人", key: "contact_people" },
                { title: "联系电话", key: "tel" }
            ],
            detailsData: [],
            disableFlag: false,
            coopList: []
        };
    },
    mounted() {
        this.coopListGet();

      /* 上传成功回调 */
        this.$bus.$on('confirmUpload', (obj) => {
            let fileList = obj.response;
          //3D文件后缀去重
            fileList.forEach(function (creent) {
                if (creent.fileType === '3d'){
                    var strindex = creent.file_url;
                    var arr = strindex.split('.');
                    var SuffixName = strindex.split('.')[arr.length-1];
                    var lastIndex = strindex.lastIndexOf('.'+SuffixName);
                    creent.file_url = strindex.substring(0, lastIndex);
                }
            });
            this.accFile = fileList;
        });
    },
    methods: {
    // 初始化新增数据
        coopCompany() {
            this.clearData();
            this.disableFlag = false;
            this.inviteCompany = [];
            this.checkAll = false;
        },
    // 清空数据
        clearData() {
            this.projectInfos = {
                project_name: null,
                project_min_price: null,
                project_max_price: null,
                start_time: null,
                end_time: null,
                description: null,
                join_end_time: null,
                projectDate: []
            };
            this.accFile = [];
        },
    // 全选
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                this.inviteCompany = this.coopList;
            } else {
                this.inviteCompany = [];
            }
        },
        checkAllGroupChange(data) {
            if (data.length === this.coopList.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
    // 开始时间
        startTime(date) {
            this.projectInfos.start_time = date[0];
            this.projectInfos.end_time = date[1];
        },
    // 截止时间
        joinEndTime(date) {
            this.projectInfos.join_end_time = date;
        },
    // 搜索
        commitSearch() {
            this.coopListGet(this.searchData);
        },
    // 获取公司列表
        async coopListGet(search = this.searchData) {
            let params = {
                demand_id: 1,
                search: search,
                page_size: 100
            };
            let {data} = await cooperationApi.getCooperationList(params);
            if (data.err_code == 0){
                this.coopListData = data.data;
                data.data.forEach(val => {
                    this.coopList.push(val.company_id);
                });
            }
        },
    // 发送邀请数据
        emitInviteData() {
            let srtCom = this.inviteCompany.toString();
            let RsrtCom = srtCom.substring(0, srtCom.length);
            let obj = {
                demand_id: 1,
                project_name: this.projectInfos.project_name,
                project_max_price: this.projectInfos.project_max_price,
                start_time: this.projectInfos.start_time,
                end_time: this.projectInfos.end_time,
                join_end_time: this.projectInfos.join_end_time,
                description: this.projectInfos.description,
                file: JSON.stringify(this.accFile),
                invite_company: RsrtCom
            };
            this.$emit("emitInvite", obj);
        },
    // 获取详情
        async companyListInfo(id) {
            let {data} = await cooperationApi.task_invite_info({id: id});
            if (data.err_code == 0){
                this.disableFlag = true;
                this.projectInfos = data;
                this.projectInfos.projectDate = [data.start_time, data.end_time];
                this.detailsData = data.invite_companys;
            }
        }
    },
    updated() {
        this.emitInviteData();
    },
    watch: {
        accFile(val) {
            this.file = JSON.stringify(val);
            this.emitInviteData();
        }
    },
    filters: {
        substring: function(val) {
            return val.length > 30 ? "..." + val.substring(val.length, 15) : val;
        }
    }
};
</script>

<style lang="less" scoped>
.emitInvite {
  line-height: 20px;
  margin-top: 20px;
    .general-upload-container{
        width: auto!important;
    }
  .ivu-upload-list {
    position: static;
  }
  .ivu-checkbox-checked .ivu-checkbox-inner {
    background: #3bce3b;
    border-color: #3bce3b;
  }
  dl {
    font-family: @ff;
    font-weight: lighter;
    display: flex;
    margin: 20px 0px;
    dt {
      float: left;
      width: 84px;
      font-size: 12px;
      text-align: right;
      line-height: 40px;
    }
    dd {
      margin-left: 20px;
      flex: 1;
      font-size: 13px !important;
      line-height: 32px;
      .title {
        border-bottom: 1px solid #d3d9e1;
        display: flex;
        justify-content: space-between;
        em {
        //   float: right;
        }
      }
      &.tableSty{
          table{
              width: 100%;
              border: 1px solid #d8d8d8;
              border-radius: 3px;
              th{
                  background: #f9f9f9;
              }
              td,th{
                  padding: 0 5px;
              }
              tr{
                  border-bottom: 1px solid @red;
              }
          }
      }
      .tipsText {
        font-style: normal;
        font-size: 13px;
        color: @red;
        display: inline-block;
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
      }
    }
    .ivu-input {
      height: 34px;
      line-height: 34px;
      font-family: @ff;
      font-weight: lighter;
    }
  }

  .filesDown {
    a {
      color: @black_2;
      font-size: 13px;
      i {
        color: #17ceb1;
        margin-left: 50px;
      }
    }
  }
}
</style>
