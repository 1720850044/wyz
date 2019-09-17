<template>
    <div class="pricing-assistant">
        <div class="top">
            <p class="title">{{$t('companySetUp.setUp_priceTips')}}</p>
            <p>
                <Poptip content="设置公司的类型价格能力参考，能更好的辅助项目安排和成本核算" placement="left" trigger="hover">
                  <span class="iconfonts icon-uniE901"></span>
                </Poptip>
            </p>
        </div>
        <div class="add-type">
            <div class="reference-table">
                <div class="table-header">
                    <span></span>
                    <span>{{$t('companySetUp.setUp_level')}}</span>
                    <span>{{$t('companySetUp.setUp_pricePerPersonDay')}}</span>
                    <span>{{$t('companySetUp.setUp_productionTime')}}</span>
                    <span>{{$t('companySetUp.setUp_unitPrice')}}</span>
                    <span>{{$t('companySetUp.setUp_productionRequirementScore')}}</span>
                    <span>{{$t('companySetUp.setUp_designRequirementScore')}}</span>
                    <span>{{$t('companySetUp.setUp_communicateRequirementScore')}}</span>
                    <span>{{$t('companySetUp.setUp_comprehensiveRequirementScore')}}</span>
                </div>
                <dl class="table-body">
                  <div class="left">
                      <dd class="body-type" v-for="(item,index) in tableChildList" :key="index" v-if='tableChildList.length > 0'>
                            <Button type="primary" @mouseover.native="enter(index)"  @mouseout.native="leave" v-if="index + 1 == item.num">{{item.type_name}} 
                              <i v-show="isSeenDelbtn && index==current" class="iconfonts icon-shanchu" style="font-size: 12px;" @click='comDel(item.type_id)'></i>
                            </Button>
                      </dd>
                      <dd class="select-type" v-for="(item,index) in classifyList" :key="index" v-if="classifyList.length > 0 ">
                        <div style="position: absolute;top: -100%;left: 14.5%;"><Button type="primary">{{item}}</Button></div>
                      </dd>
                  </div>
                  <div class="right">
                      <dd class="body-content" v-for="(item,index) in tableChildList" :key="index" v-if='tableChildList.length > 0'>
                          <div v-if="!item.id && index!=isShowLevel" class="add-rank">
                              <Button type="primary" @click="addNewLevel(item,index)"><i class="iconfonts icon-jiahao" style="font-size: 12px;letter-spacing: 1px"></i>{{$t('companySetUp.setUp_increaseLevel')}}</Button>
                          </div>
                          <div v-else class="change-content">
                            <Input v-if="index==isShowLevel" type="text" v-model="formItem.level" @change.native="manualInput"></Input>
                            <input v-else v-model="item.level" @change ="changeData('level',item,$event)">

                            <Input v-if="index==isShowLevel" type="text" v-model="formItem.price" @change.native="manualInput"></Input>
                            <input v-else v-model="item.price" @change ="changeData('price',item,$event)"> 

                            <Input v-if="index==isShowLevel" type="text" v-model="formItem.day" @change.native="manualInput"></Input>
                            <input v-else v-model="item.day" @change ="changeData('day',item,$event)">

                            <Input v-if="index==isShowLevel" type="text" v-model="formItem.unit" @change.native="manualInput"></Input>
                            <input v-else v-model="item.unit" @change ="changeData('unit',item,$event)">

                            <Input v-if="index==isShowLevel" type="text" v-model="formItem.make_score" @change.native="manualInput"></Input>
                            <input v-else v-model="item.make_score" @change ="changeData('make_score',item,$event)">

                            <Input v-if="index==isShowLevel" type="text" v-model="formItem.design_score" @change.native="manualInput"></Input>
                            <input v-else v-model="item.design_score" @change ="changeData('design_score',item,$event)">

                            <Input v-if="index==isShowLevel" type="text" v-model="formItem.communicate_score" @change.native="manualInput"></Input>
                            <input v-else v-model="item.communicate_score" @change ="changeData('communicate_score',item,$event)">
                            <span @mouseover="enterStyle(index)" @mouseout="leaveStyle" style="cursor: pointer;">{{item.comprehensive_score}} <i v-show="isShowDelbtn && index==activeIndex" class="iconfonts icon-shanchu" style="font-size: 12px;" @click='delData(item.id)'></i></span>
                            <div v-if="index==isShowLevel" class="btn-style">
                              <Button type="primary" @click="ensure" size="small"><span>{{$t('lang.lang_confirm')}}</span></Button>
                              <Button type="text" @click="cancel" size="small">{{$t('lang.lang_cancel')}}</Button>
                            </div>
                          </div>
                      </dd>
                  </div>
                </dl>
            </div>
            <div class="add-btn" v-if="isShowAddType">
                <Button type="primary" @click="addType">
                    <span class="iconfonts icon-jiahao"></span>
                    {{$t('companySetUp.setUp_increaseClassification')}}
                </Button>
            </div>
            <div class="drop-down">
                <Select v-model="choiceClassify" style="width:200px;margin-top:20px;margin-bottom:30px;" v-if="isShowOption" @on-change='changeType'>
                    <Option v-for="(item,index) in filterList" :value="JSON.stringify(item)" :key="index">{{ item.name }}</Option>
                </Select>
            </div>
        </div>
        <!-- 删除类型 -->
        <Modal v-model="deleteTypeModel" :title="$t('companySetUp.setUp_confirmReduce')" width="350px" @on-ok="deleteType" :mask-closable="false">
              <p style="font-size: 15px;letter-spacing: 1px;">{{$t('companySetUp.setUp_removeTips')}}</p>

        </Modal>
        <!-- 删除列表 -->
        <Modal v-model="deleteListModel" :title="$t('companySetUp.setUp_confirmReduce')" width="350px" @on-ok="deleteList" :mask-closable="false">
              <p style="font-size: 15px;letter-spacing: 1px;">{{$t('companySetUp.setUp_removeTips')}}</p>
        </Modal>
    </div>
</template>
<script>
import { priceAide } from "api";
export default {
  data() {
    return {
      deleteTypeModel: false, // 类型删除
      delTypeId: null,
      current: 0,
      isSeenDelbtn: false,
      deleteListModel: false, // 列表删除
      delListId: null,
      activeIndex: 0,
      isShowDelbtn: false,
      choiceClassify: "", // 类型选择
      selectId: null, // 类型选择ID
      isShowOption: false, // 是否显示下拉列表
      isShowAddLevel: false, // 是否显示增加级别按钮
      isShowAddType: true, // 是否显示增加分类按钮
      filterList: [], // 类型列表
      classifyList: [], // 左侧分类
      tableList: [], // 能力表
      tableChildList: [],
      formItem: {
        // 增加能力表
        level: "",
        price: null,
        day: "",
        unit: null,
        make_score: null,
        design_score: null,
        communicate_score: null
      },
      inputParams: null, // 增加输入框的值
      addBox: false,
      isShowLevel: -1
    };
  },
  components: {},
  created() {},
  mounted() {
    this.initFun();
  },
  methods: {
    clearVal() {
      this.formItem = {
        level: "",
        price: null,
        day: "",
        unit: null,
        make_score: null,
        design_score: null,
        communicate_score: null
      };
    },

    // 添加分类按钮
    addType() {
      this.isShowOption = true;
      this.isShowAddType = false;
    },
    // 下拉选择分类类型
    changeType(value) {
      const strToObj = JSON.parse(value);
      this.selectId = strToObj.id;
      this.classifyList.push(strToObj.name);
      let params = {
        type_name: strToObj.name,
        type_id: strToObj.id
      };
      this.tableChildList.push(params);
      this.isShowAddLevel = true;
      this.isShowOption = false;
      this.isShowAddType = true;
    },
    // 页面初始化接口
    async initFun() {
      let { data } = await priceAide.initAide();
      if (data.err_code == 0) {
        this.getTypeList();
        this.getAideList();
      } else {
        this.$Messages.error(data.err_message);
      }
    },
    // 获取类型列表
    async getTypeList() {
      let { data } = await priceAide.classifyData();
      if (data.err_code == 0) {
        this.filterList = data.data;
      } else {
        this.$Message.error(data.err_message);
      }
    },
    // 获取能力列表
    async getAideList() {
      this.isShowLevel = -1;
      let { data } = await priceAide.aideData();
      if (data.err_code == 0) {
        this.tableList = data.data;
        // console.log('后台数据',this.tableList);
        this.tableList.forEach((currentValue, index, arr) => {
          currentValue.child.forEach((item, index) => {
            item.type_name = currentValue.type_name;
            item.type_id = currentValue.type_id;
            item.num = currentValue.num;
            this.tableChildList.push(item);
          });
        });
        // console.log('组装后的数据',this.tableChildList);
      } else {
        this.$Message.error(data.err_message);
      }
    },
    // -------------------------------------------- 增 ------------------------------------------------ //
    // 新增级别按钮
    addNewLevel(item, index) {
      this.isShowLevel = index;
      this.selectId = item.type_id;
      this.addBox = true;
    },
    // 输入框的值
    manualInput() {
      this.inputParams = {
        type_id: parseInt(this.selectId),
        level: this.formItem.level,
        day: this.formItem.day,
        price: this.formItem.price,
        unit: this.formItem.unit,
        make_score: this.formItem.make_score,
        design_score: this.formItem.design_score,
        communicate_score: this.formItem.communicate_score
      };
    },
    // 取消增加
    cancel() {
      this.isShowLevel = -1;
      this.addBox = false;
      this.classifyList = [];
      this.clearVal();
    },
    // 确定增加
    async ensure() {
      if (!this.inputParams.level) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPrompt'));
      } else if (this.inputParams.level.match(/^\s+$/)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptOne'));
      } else if (!this.inputParams.day) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwo'));
      } else if (this.inputParams.day.match(/^\s+$/)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThree'));
      } else if (!this.inputParams.price) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptFour'));
      } else if (this.inputParams.price.match(/^\s+$/)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptFive'));
      } else if (isNaN(this.inputParams.price)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptSix'));
      } else if (this.inputParams.price <= 0) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptSeven'));
      } else if (isNaN(this.inputParams.unit)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptNight'));
      } else if (this.inputParams.unit.match(/^\s+$/)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptNine'));
      } else if (!this.inputParams.unit) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTen'));
      } else if (this.inputParams.unit <= 0) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptEleven'));
      } else if (this.inputParams.make_score.match(/^\s+$/)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwelve'));
      } else if (!this.inputParams.make_score) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirteen'));
      } else if (isNaN(this.inputParams.make_score)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptFourteen'));
      } else if (
        this.inputParams.make_score < 0 &&
        this.inputParams.make_score > 5
      ) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptFifteen'));
      } else if (this.inputParams.design_score.match(/^\s+$/)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptSixteen'));
      } else if (!this.inputParams.design_score) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptSeventeen'));
      } else if (isNaN(this.inputParams.design_score)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptEighteen'));
      } else if (
        this.inputParams.design_score < 0 &&
        this.inputParams.design_score > 5
      ) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptFifteen'));
      } else if (this.inputParams.communicate_score.match(/^\s+$/)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwenty'));
      } else if (!this.inputParams.communicate_score) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwentyOne'));
      } else if (isNaN(this.inputParams.communicate_score)) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwentyTwo'));
      } else if (
        this.inputParams.communicate_score < 0 &&
        this.inputParams.communicate_score > 5
      ) {
        this.$Message.error(i18n.t('companySetUp.setUp_errorPromptFifteen'));
      } else {
        let { data } = await priceAide.addAideData(this.inputParams);
        if (data.err_code == 0) {
          this.$Message.success(i18n.t('companySetUp.setUp_addSuccess'));
          this.getAideList();
          this.tableChildList = [];
          this.addBox = false;
          this.isShowLevel = -1;
          this.classifyList = [];
          this.clearVal();
        } else {
          this.$Message.error(data.err_message);
        }
      }
    },
    // -------------------------- 删 --------------------------------//
    // 鼠标移入移出
    enter(index) {
      this.isSeenDelbtn = true;
      this.current = index;
    },
    leave() {
      this.isSeenDelbtn = false;
      this.current = null;
    },
    // ------------------------------------- 分类列表删除 ------------------------------------ //
    comDel(id) {
      // alert(1);
      this.delTypeId = id;
      this.deleteTypeModel = true;
    },
    async deleteType() {
      let { data } = await priceAide.delTypeData({ type_id: this.delTypeId });
      if (data.err_code == 0) {
        this.$Message.success(i18n.t('companySetUp.setUp_removeSuccess'));
        this.tableChildList = [];
        this.getAideList();
        this.getTypeList();
      } else {
        this.$Message.error(data.err_message);
      }
    },
    // 鼠标移入移出
    enterStyle(index) {
      this.isShowDelbtn = true;
      this.activeIndex = index;
    },
    leaveStyle() {
      this.isShowDelbtn = false;
      this.activeIndex = null;
    },
    // ------------------------------------- 参考表列表删除 ------------------------------------ //
    delData(id) {
      this.delListId = id;
      this.deleteListModel = true;
    },
    async deleteList() {
      let { data } = await priceAide.delAideData({ id: this.delListId });
      if (data.err_code == 0) {
        this.$Message.success(i18n.t('companySetUp.setUp_removeSuccess'));
        this.tableChildList = [];
        this.getAideList();
        this.getTypeList();
      } else {
        this.$Message.error(data.err_message);
      }
    },
    // ------------------------------------- 编辑 ------------------------------------ //
    changeData(type, item, event) {
      let params = null;
      switch (type) {
        case "level":
          params = { id: item.id, key: "level", value: event.target.value };
          if (params.value == "") {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwentyFour'));
            return false;
          } else if (params.value.match(/^\s+$/)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwentyFive'));
            return false;
          }
          break;
        case "price":
          params = { id: item.id, key: "price", value: event.target.value };
          if (params.value == "") {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwentySix'));
            return false;
          } else if (params.value.match(/^\s+$/)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwentyEight'));
            return false;
          } else if (params.value.price <= 0) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptTwentyNine'));
            return false;
          } else if (isNaN(params.value)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirty'));
            return false;
          }
          break;
        case "day":
          params = { id: item.id, key: "day", value: event.target.value };
          if (params.value == "") {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyone'));
            return false;
          } else if (params.value.match(/^\s+$/)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyTwo'));
            return false;
          }
          break;
        case "unit":
          params = { id: item.id, key: "unit", value: event.target.value };
          if (params.value == "") {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyThree'));
            return false;
          } else if (isNaN(params.value)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyFour'));
            return false;
          } else if (params.value.match(/^\s+$/)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyFour'));
            return false;
          } else if (params.value <= 0) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyFive'));
            return false;
          }
          break;
        case "make_score":
          params = {
            id: item.id,
            key: "make_score",
            value: event.target.value
          };
          if (params.value == "") {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtySeven'));
            return false;
          } else if (params.value.match(/^\s+$/)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyEight'));
            return false;
          } else if (params.value < 0 && params.value > 5) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyNine'));
            return false;
          } else if (isNaN(params.value)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyForty'));
            return false;
          }
          break;
        case "design_score":
          params = {
            id: item.id,
            key: "design_score",
            value: event.target.value
          };
          if (params.value == "") {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtySeven'));
            return false;
          } else if (params.value.match(/^\s+$/)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyEight'));
            return false;
          } else if (params.value < 0 && params.value > 5) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyNine'));
            return false;
          } else if (isNaN(params.value)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyForty'));
            return false;
          }
          break;
        case "communicate_score":
          params = {
            id: item.id,
            key: "communicate_score",
            value: event.target.value
          };
          if (params.value == "") {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtySeven'));
            return false;
          } else if (params.value.match(/^\s+$/)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyEight'));
            return false;
          } else if (params.value < 0 && params.value > 5) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyNine'));
            return false;
          } else if (isNaN(params.value)) {
            this.$Message.error(i18n.t('companySetUp.setUp_errorPromptThirtyForty'));
            return false;
          }
          break;
      }
      this.update(params);
    },
    // changeData(type,item,event){
    //   let params = {
    //     id: item.id,
    //     key: type,
    //     value: event.target.value
    //   };

    //   this.update(params);
    // },
    async update(params) {
      let { data } = await priceAide.updateTypeData(params);
      if (data.err_code == 0) {
        this.$Message.success(data.err_message);
        this.tableChildList = [];
        this.clearVal();
        this.initFun();
      } else {
        this.$Message.error(data.err_message);
      }
    }
  }
};
</script>
<style lang="less" scoped>
// 定价助手
.pricing-assistant {
  .top {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #eef1f2;
    color: #8c8c8c;
    font-size: 16px;
    .title {
      letter-spacing: 1px;
    }
    .iconfonts {
      cursor: pointer;
    }
  }
  .add-type {
    .reference-table {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .table-header {
        display: flex;
        margin: 0;
        font-size: 14px;
        color: #bdbdbd;
        height: 46px;
        line-height: 46px;
        text-align: center;
        font-weight: lighter;
        background-color: #fafbfb;
        border-bottom: 1px solid #eef1f2;
        margin-bottom: 0;
        span {
          width: 152px;
          // flex: 1;
          text-align: center;
        }
      }
      .table-body {
        display: flex;
        .select-type,
        .body-type {
          font-weight: lighter;
          height: 60px;
          line-height: 60px;
          min-width: 152px;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
          .ivu-btn {
            background: #d4f4ef;
            color: #818181;
          }
        }
        .select-type {
          position: relative;
        }
        .body-content {
          .add-rank {
            height: 59px;
            line-height: 59px;
            border-bottom: 1px solid #eef1f2;
            border-left: 1px solid #eef1f2;
            padding-left: 30px;
          }
          // .rank-content {
          //   cursor: pointer;
          //   text-align: center;
          //   display: flex;
          //   background: #fff;
          //   margin: 0;
          //   font-size: 13px;
          //   font-weight: lighter;
          //   height: 60px;
          //   line-height: 60px;
          //   border-left: 1px solid #eef1f2;
          //   border-bottom: 1px solid #e1e1e1;
          //   word-wrap: break-word;
          //   word-break: break-all;
          //   span {
          //     color: #777;
          //     // flex: 1;
          //     text-align: center;
          //     min-width: 152px;
          //     white-space: nowrap;
          //     text-overflow: ellipsis;
          //   }
          // }
          .ivu-input-wrapper {
            width: 146px;
            line-height: 60px;
            margin-left: 6px;
          }
          .change-content {
            display: flex;
            // justify-content: space-around;
            align-items: center;
            border-left: 1px solid #eef1f2;
            border-bottom: 1px solid #e1e1e1;
            position: relative;
            input {
              width: 152px;
              height: 60px;
              border: 0;
              border-bottom: 0px solid #e0e0e0;
              margin: 0 0;
              color: #777;
              text-align: center;
              font-size: 13px;
              border-radius: 3px;
              margin-right: 1px;
              &:focus {
                box-shadow: 0 0 0 1px rgba(60, 210, 180, 1);
              }
              // &:first-child{
              //   width: 142px;
              // }
            }
            span {
              font-size: 13px;
              color: #777;
              text-align: center;
              width: 136px;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .btn-style {
              position: absolute;
              right: 1.5%;
              top: 18%;
              .ivu-btn-primary {
                max-width: 50px;
                span {
                  color: white;
                  margin-left: -58.5px !important;
                }
              }
            }
          }
        }
      }
    }
    .add-btn {
      margin: 20px;
      margin-bottom: 0px;
      .ivu-btn {
        span {
          font-size: 12px;
          letter-spacing: 1px;
          vertical-align: middle;
        }
      }
    }
    .drop-down {
      margin: 20px;
      margin-top: 0px;
    }
  }
}
</style>
