<template>
    <div class="newInvitations">
        <dl>
            <dt>项目名称</dt>
            <dd>
                <Input v-model="projectInfos.project_name" placeholder="输入项目名称"></Input>
            </dd>
        </dl>
        <dl>
            <dt>项目预计金额</dt>
            <dd>
                <Input v-model="projectInfos.expect_price" placeholder="项目预计金额" :maxlength='8'></Input>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>项目预计周期</dt>
            <dd>
                <DatePicker format="yyyy-MM-dd" type="daterange" :editable="false" placeholder="项目预计周期"
                            style="width:100%" :value="projectInfos.projectDate" @on-change="expectCycle"></DatePicker>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>邀请反馈时间</dt>
            <dd>
                <DatePicker format="yyyy-MM-dd" type="date" :editable="false" placeholder="邀请反馈时间" style="width: 100%"
                            :value="projectInfos.invite_end_time" @on-change="feedbackTime"></DatePicker>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>邀请合作企业</dt>
            <dd>
                <!-- <Icon type="ios-arrow-down"></Icon> -->
                <Input v-model="projectInfos.invite" type="text" placeholder="搜索或下拉选择邀请企业" icon="ios-arrow-down"
                       @on-click="companySearch(projectInfos.invite,$event,true)"></Input>
                <ul v-if="companyData.isShowDropDown" class="companyList">
                    <li v-for="(item,index) in companyData.companyList" @click="selectPayFun(item)" :key="index">
                        {{item.company}}
                    </li>
                </ul>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl v-if="!isShowDetail">
            <dt @click="showDetail">详细要求
                <Icon type="chevron-down" style="margin-left:10px;cursor: pointer;"></Icon>
            </dt>
            <dd>
                <p style="color: #bdbdbd;cursor: pointer;">非必填项</p>
            </dd>
            <div class="clear"></div>
        </dl>
        <!-- 详细要求 -->
        <dl v-if="isShowDetail">
            <div class="detailRequire">
                <ul>
                    <li class="priceTile">
                        <span class="span">资源名称</span>
                        <span class="span">资源类型</span>
                        <span class="span">资源数量</span>
                        <span class="span">预计费用</span>
                    </li>
                    <div>
                        <li class="valueList" v-if="detailRequirementsList && detailRequirementsList.length > 0"
                            v-for="(item,index) in detailRequirementsList" :key="index">
                            <span class="span">
                                <Input style="width: 50%;min-width: 100px;" v-model="item.name"></Input>
                            </span>
                            <span class="span" style="position: relative">
                            <Select v-model="item.ability" style="width:100px" placeholder="请选择">
                                <Option :value="item.id" :key="index"
                                        v-for="(item,index) in abilityList">{{item.name}}</Option>
                            </Select>
                            </span>
                            <span class="span">
                                <InputNumber :min="0" style="width: 50%;min-width: 100px;"
                                             v-model="item.num"></InputNumber>
                            </span>
                            <span class="span">
                               <Input style="width: 50%;min-width: 100px;" v-model="item.price" :maxlength='8'></Input>
                            </span>
                        </li>
                        <li style="margin-top:10px;cursor: pointer;">
                            <span class="span">
                              <em class="addPrice" @click="detailRequirements">
                                  <span class="iconfonts icon-add1" style="color: #bdbdbd;"><span
                                      style="padding-left:10px;font-size:13px;">非必填项</span></span>
                              </em>
                            </span>
                        </li>
                    </div>
                </ul>
            </div>
        </dl>
    </div>
</template>
<script>
import { invitationApi } from "api";

export default {
  data() {
    return {
      num: 1,
      projectInfos: {
        project_name: "", //项目名称
        expect_price: "", // 项目预计金额
        invite_end_time: "", //预计结束时间
        invite: "", // 邀请公司
        invite_id: "", //邀请公司ID
        projectDate: [], // 项目预计周期
        expect_start_time: "", //预计周期开始时间
        expect_end_time: "", // 预计周期结束时间
        detailDemand: null //详细要求
      },
      resource: "", // 资源
      isShowDetail: false,
      companyData: {
        isShowDropDown: false,
        companyList: []
      },
      // 详细要求
      requirements: {
        name: "",
        ability: "",
        num: null,
        price: null
      },
      detailRequirementsList: [],
      abilityList: []
    };
  },
  updated() {
    this.addInviteData();
  },
  mounted() {
    this.AbilityList();
    this.detailRequirements();
  },
  methods: {
    // 获取类型列表
    async AbilityList() {
      let { data } = await invitationApi.abilityList();
      if (data.err_code === 0 && data.data) {
        this.abilityList = data.data;
        // this.detailRequirementsList[0].ability_id = data.data[0].id;
      }
    },
    // 搜索邀请企业
    async companySearch(val, event, flag) {
      this.companyData.isShowDropDown = this.$store.state.MsgIsShow;
      let params = {
        search: val
      };
      let { data } = await invitationApi.companyData(params);
      if (data.err_code == 0) {
        this.companyData.companyList = data.data || [];
        if (this.companyData.companyList.length > 0) {
          this.companyData.isShowDropDown = true;
        } else {
          this.companyData.isShowDropDown = false;
          this.companyData.companyList = [];
          // this.payment = params.select;
          this.$Message.warning("暂无此公司");
        }
      } else {
        this.$Message.error(data.err_message);
      }
    },
    // 展示详细要求
    showDetail() {
      this.isShowDetail = true;
    },
    //   增加一行详细要求
    detailRequirements() {
      this.num++;
      let info = {
        ability: null,
        name: null,
        num: null,
        price: null
      };
      this.detailRequirementsList =
        this.detailRequirementsList && this.detailRequirementsList.length > 0
          ? this.detailRequirementsList
          : [];
      this.detailRequirementsList.push(info);
    },
    // 反馈时间
    feedbackTime(date) {
      this.projectInfos.invite_end_time = date;
    },
    // 项目预计周期
    expectCycle(date) {
      //   console.log(1245634, date);
      //   this.projectInfos.projectDate[0] = date[0];
      //   this.projectInfos.projectDate[1] = date[1];
      this.projectInfos.expect_start_time = date[0];
      this.projectInfos.expect_end_time = date[1];
    },
    //选择公司
    selectPayFun(item) {
      this.companyData.isShowDropDown = false;
      this.projectInfos.invite = item.company;
      this.projectInfos.invite_id = item.id;
    },
    // 清空数据
    clearData() {
      this.projectInfos.project_name = "";
      this.projectInfos.expect_price = "";
      this.projectInfos.invite_end_time = "";
      this.projectInfos.invite = "";
      this.projectInfos.invite_id = "";
      this.projectInfos.expect_start_time = "";
      this.projectInfos.expect_end_time = "";
      this.projectInfos.detailDemand = null;
      this.detailRequirementsList = [
        {
          ability: null,
          name: null,
          num: null,
          price: null
        }
      ];
      this.isShowDetail = false;
      this.projectInfos.projectDate = [];
    },
    // 发送邀请数据
    addInviteData() {
      let obj = {};
      if (
        this.detailRequirementsList &&
        this.detailRequirementsList.length > 0
      ) {
        obj.name = this.projectInfos.project_name;
        obj.expect_price = this.projectInfos.expect_price;
        obj.expect_start_time = this.projectInfos.expect_start_time;
        obj.expect_end_time = this.projectInfos.expect_end_time;
        obj.resource = JSON.stringify(this.detailRequirementsList);
        obj.invite_end_time = this.projectInfos.invite_end_time;
        obj.invite = this.projectInfos.invite_id;
      } else {
        obj.name = this.projectInfos.project_name;
        obj.expect_price = this.projectInfos.expect_price;
        obj.expect_start_time = this.projectInfos.expect_start_time;
        obj.expect_end_time = this.projectInfos.expect_end_time;
        obj.invite_end_time = this.projectInfos.invite_end_time;
        obj.invite = this.projectInfos.invite_id;
      }
      this.$emit("addInvite", obj);
    }
  }
};
</script>
<style lang="less" scoped>
.newInvitations {
  line-height: 20px;
  margin-top: 20px;

  .general-upload-container {
    width: auto !important;
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
    align-items: center;
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
      position: relative;

      .companyList {
        max-height: 200px;
        overflow: auto;
        position: absolute;
        left: 0;
        background: #ffffff;
        width: 99.99%;
        top: 92.5%;
        border: 1px solid #eae9e9;
        z-index: 2;

        &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 3px;
          background: rgba(0, 0, 0, 0.2);
        }

        &::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }

        &::-webkit-scrollbar {
          width: 3px !important;
          background: #f5f5f5;
        }

        li {
          padding: 10px;
          border-bottom: 1px solid #eae9e9;

          &:hover {
            cursor: pointer;
            background: @base;
            color: @white;
          }
        }
      }
    }

    .ivu-input {
      height: 34px;
      line-height: 34px;
      font-family: @ff;
      font-weight: lighter;
    }

    .detailRequire {
      width: 100%;

      .priceTile {
        display: flex;
        border: 1px solid @baseboard;

        .span {
          flex: 1;
          text-align: center;
          color: @black_3;
          font-size: 14px;
          padding: 10px 0px;

          &:first-child {
            text-align: center;
            padding-left: 10px;
          }

          &:last-child {
            text-align: center;
            padding-right: 10px;
          }
        }
      }

      .valueList {
        display: flex;
        font-size: 13px;
        border: 1px solid @baseboard;
        border-top: 1px solid transparent;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .span {
          text-align: center;
          flex: 1;
          padding: 10px 0px;

          &:first-child {
            text-align: center;
            padding-left: 10px;
          }

          &:last-child {
            text-align: center;
            padding-right: 10px;
          }
        }

        .ivu-input {
          font-size: 13px;
          outline: none !important;
        }
      }
    }
  }
}
</style>