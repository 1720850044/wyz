<template>
    <div style="height: 90%">
        <template v-if="loadingFlag">
            <div style="height: 720px">
                <loading></loading>
            </div>
        </template>
        <template v-if="!loadingFlag && (coopCompanyList && coopCompanyList.length > 0)">
            <div class="coopCorListShit">
                <div class="tableHeade">
                    <span>公司名称</span>
                    <span>合作次数</span>
                    <span>来源</span>
                    <span>联系人</span>
                    <span>联系电话</span>
                    <span>擅长领域</span>
                    <span>备注</span>
                    <span>操作</span>
                </div>
                <dl>
                    <dd v-for="(item,index) in coopCompanyList" :key="index">
                        <span class="">{{item.company}}</span>
                        <span style="font-size: 14px">{{item.cooperation_num}}</span>
                        <span>{{item.from_text}}</span>
                        <span>{{item.contact_people}}</span>
                        <span style="font-size: 14px">{{item.tel}}</span>
                        <span >
                            <p class="skilled" v-if="item.ability && item.ability.length > 0">
                                <Tooltip placement="right-start" v-if="item.ability.length > 4">
                                    <em v-for="(tag,index) in item.ability" v-if="index < 4" :key="index">{{tag.name || '--'}}</em>
                                    <div slot="content" class="tooltipBox">
                                        <em v-for="(tag,index) in item.ability" :key="index">{{tag.name || '--'}}</em>
                                    </div>
                                </Tooltip>
                                <em v-else v-for="(tag,index) in item.ability" :key="index">{{tag.name || '--'}}</em>
                            </p>
                        </span>
                        <span>{{item.description}}</span>
                        <span class="shitRight">
                            <!-- <i class="ivu-icon ivu-icon-edit" @click="editCooper(item)" v-if="user_type == 1"></i> -->
                            <i class="iconfonts icon-shanchu" @click="delCooper(item.id)"></i>
                        </span>
                    </dd>
                </dl>
            </div>
        </template>
        <template v-if="!loadingFlag && coopCompanyList.length == 0">
            <div style="min-height: 720px;position: relative">
                <nothink type="company" text="暂无公司"></nothink>
            </div>
        </template>
          <!-- Modal组件 -->
        <Modal v-model="operateModal" :title="Cooptitle" @on-ok="addInitOk" @on-cancel="cooperCancel" :ok-text="CoopBtn" width="600px" :mask-closable='false'>
             <operate-cooperative ref="addCoop"></operate-cooperative>
        </Modal>
        <!--删除合作公司对话框-->
        <Modal v-model="delObj.delModal" title="删除"  @on-ok="confirmDelCooper" @on-cancel="cancelDelCooper" ok-text="删除" width="600px" :mask-closable='false'>
            <p style="font-size: 15px;padding-top: 20px">
                你确定要<span style="color: #f44336;font-weight: bold"> 删除 </span>吗？
            </p>
        </Modal>
        <!-- 新合作公司列表Modal组件 -->
        <Modal v-model="listModal.modalFlag" title="新合作公司" width="800px" :footer-hide="false" :mask-closable="false">
          <!-- refurbish -->
            <new-cooperative-company  ref="newCooperativeCompanyRefs" @add-comment="appendComment"></new-cooperative-company>
            <div slot="footer"></div>
        </Modal>
        <Page v-if="page.total > page.page_size"
              class-name="pageSty"
              :current="page.creentPage"
              :total="page.total"
              :page-size="page.page_size"
              @on-change="onChangePage">
        </Page>
    </div>
</template>
<script>
import Cookie from "js-cookie";
import operateCooperative from "./operateCooperative";
import newCooperativeCompany from "../page/newCooperativeCompany";
import { cooperationAide } from "api";
var qs = require("querystring");
export default {
  data() {
    return {
      user_type: JSON.parse(Cookie.get("company")).type,
      delObj: {
        delModal: false,
        id: null
      },
      operateModal: false,
      coopData: {},
      Cooptitle: "",
      CoopBtn: "确认添加",
      coopCompanyList: [],
      page: {
        total: 0,
        page_size: 20,
        creentPage: 1
      },
      ability: [],
      loadingFlag: true,
      listModal: {
        modalFlag: false
      },
    };
  },
  props: ["source", "search"],

  components: {
    operateCooperative,
    newCooperativeCompany
  },
  mounted() {
    this.initFun();
  },
  methods: {
    // 页面初始化接口
    async initFun() {
      let { data } = await cooperationAide.initCooperation();
      if (data.err_code == 0) {
        this.cooperationList();
        this.$bus.on("emitCoopData", val => {
          this.coopData = val;
        });
      } else {
        this.$Messages.error(data.err_message);
      }
    },
    // 新合作公司列表初始化接口
    async addInitOk() {
      let { data } = await cooperationAide.newCooperativeCompanyListIndex();
      if (data.err_code == 0) {
          this.cooperOk();
      } else {
        this.$Messages.error(data.err_message);
      }
    },
    //   分页
    onChangePage(page) {
      this.page.creentPage = page;
      this.cooperationList();
    },
    // 获取公司合作库列表
    async cooperationList() {
      let params = {
        from: this.source,
        search: this.search,
        page: this.page.creentPage,
        page_size: this.page.page_size
      };
      let { data } = await cooperationAide.cooperationData(params);
      if (data.err_code == 0) {
        this.loadingFlag = false;
        this.coopCompanyList = data.data;
      } else {
        this.loadingFlag = false;
        this.$Message.error(data.err_message);
      }
    },
    // 增加服务商
    // 新增
    newAdd() {
      this.Cooptitle = "增加服务商";
      this.CoopBtn = "确认添加";
      this.operateModal = true;
      this.$bus.emit("newAddCompanyFlag");
    },
    // --------------------------------------- 编辑服务商 ---------------------------------- //
    editCooper(item) {
      this.operateModal = true;
      this.Cooptitle = "编辑服务商";
      this.CoopBtn = "确认修改";
      let obj = {
        id: item.id,
        company: item.company,
        contact_people: item.contact_people,
        tel: item.tel,
        tag: item.tag == null ? [] : item.tag,
        description: item.description
      };
      this.$bus.emit("editCoopData", obj);
    },
    // 确认编辑
    async cooperOk() {
      //   let params = {
      //     id: this.coopData.Tid,
      //     company_id: this.coopData.Cid,
      //     contact_people: this.coopData.contactPeople,
      //     tel: this.coopData.tel,
      //     description: this.coopData.explain,
      //     tag: JSON.stringify(this.coopData.tag)
      //   };
      let params = {
        id: this.coopData.Tid,
        company_id: this.coopData.companyID
      };
        if (params.id == null) {
            delete params.id;
          // let { data } = await cooperationAide.addCooperateData(params);
          let { data } = await cooperationAide.newAddCooperateData(params);
          if (data.err_code == 0) {
            this.$Message.success("添加成功!");
            this.$refs.addCoop.clearData();
            // this.cooperationList();
            // this.$refs.newCooperativeCompanyRefs.initFun();   // 0.9.2 优化合作公司库
          }
        } else {
          let { data } = await cooperationAide.editCooperateData(params);
          if (data.err_code == 0) {
            this.$Message.success("修改成功!");
            this.$refs.addCoop.clearData();
            this.cooperationList();
          }
        }
    },
    // 取消编辑
    cooperCancel() {
      this.$refs.addCoop.clearData();
    },

    // --------------------------------------- 删除服务商 ---------------------------------- //
    delCooper(id) {
      this.delObj.id = id;
      this.delObj.delModal = true;
    },
    async confirmDelCooper() {
      let params = {
        id: this.delObj.id
      };
      let { data } = await cooperationAide.delCooperateData(params);
      if (data.err_code == 0) {
        this.$Message.success("删除成功!");
        this.cooperationList();
      } else {
        this.$Message.error(data.err_message);
      }
    },
    cancelDelCooper() {},
    // 0.9.2   新合作公司库列表
    newOperativeCompany(){
      this.listModal.modalFlag = true;
      this.$refs.newCooperativeCompanyRefs.initFun(); 
    },
    appendComment () {
      this.listModal.modalFlag = false;
      this.cooperationList();
    }
  }
};
</script>
<style lang="less">
.ivu-page-item-jump-next:after,
.ivu-page-item-jump-prev:after {
  display: inline-block;
}
.pageSty {
  margin-top: 10px;
  text-align: center;
  margin-bottom: 30px;
}
.skilled {
  .ivu-tooltip-popper[x-placement^="right"] .ivu-tooltip-arrow {
    border-right-color: #3bceb6 !important;
  }
  .ivu-tooltip-inner {
    background-color: #3bceb6 !important;
    box-shadow: 0px 0px 0px;
  }
}
</style>
<style lang="less" scoped>
@import "../../../customer/epibolCompany/style/tableStyle.less";
.skilled {
  em {
    border: 1px solid @base;
    padding: 1px 2px;
    border-radius: 3px;
    margin-right: 2px;
    color: @base;
    cursor: pointer;
  }

  .tooltipBox {
    white-space: normal;
    em {
      display: inline-block;
      margin: 2px;
      color: #fff !important;
      border-color: #fff !important;
    }
  }
}
</style>
