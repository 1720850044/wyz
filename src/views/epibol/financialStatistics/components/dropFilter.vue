<template>
    <div>
      <div class="filter-drop-contents" v-click-outside.capture="onClickOutside">
          <div class="content-box" @click="dropDownContainer()">
              <span class="selected-item selected-item-holder" v-if="selectedItem && selectedItem.length <= 0"><Icon type="ios-plus-empty"></Icon>{{selectedHolder}}</span>
              <div class="selected-data">
                  <span class="selected-item" v-for="(item, index) in selectedItem" :key="index">{{item.title}}
                    <span class="iconfonts icon-cuowu" @click="deleteItems(item)"></span>
                  </span>
              </div>
              <div class="drop-down-container" v-if="showDropContainer" @click.stop>
                  <ul class="drop-tabs" >
                      <li v-for="(item, index) in dropTabs" :key="index" :class="{'tab-active': currentTab === index}" @click.stop="changeTab(item)">{{item.name}}</li>
                  </ul>
                  <!-- 金额 Amount of money-->
                  <div class="drop-leaf" v-if="currentTab === 0">
                      <div id="quanxuan">
                          <input id="all-checked" type="checkbox" v-model='allChecked' @click='changeAllData("price",sumMoneyData)'/>
                          <span>{{$t('companyProject.com_selectAll')}}</span>
                      </div>
                      <tree-menu v-if="sumMoneyData && sumMoneyData.length > 0" v-for="(item, index) in sumMoneyData" :key="index" :data="item" :allData="sumMoneyData" @selectChildItem="selectChildItem" :multiple="multiple" :selectedItem='selectedItem' @checkAllChild="checkAllChild"></tree-menu>
                  </div>
                  <!-- 来源 source-->
                  <div class="drop-leaf" v-if="currentTab === 1">
                        <div id="quanxuan">
                          <input type="checkbox" v-model='allChecked' @click='changeAllData("source",sourceData)'>
                          <span>{{$t('companyProject.com_selectAll')}}</span>
                      </div>
                      <tree-menu v-if="sourceData && sourceData.length > 0" v-for="(item, index) in sourceData" :key="index" :data="item" :allData="sourceData" :multiple="multiple" @selectChildItem="selectChildItem" :selectedItem='selectedItem' @checkAllChild="checkAllChild"></tree-menu>
                  </div>
                  <!-- 人员 people-->
                  <div class="drop-leaf" v-if="currentTab === 2">
                      <div id="quanxuan">
                        <input type="checkbox" v-model='allChecked' @click='changeAllData("personnel",personnelData)'>
                          <span>{{$t('companyProject.com_selectAll')}}</span>
                      </div>
                      <tree-menu v-if="personnelData && personnelData.length > 0" v-for="(item, index) in personnelData" :key="index" :data="item" :allData="personnelData" :multiple="multiple" @selectChildItem="selectChildItem" :selectedItem='selectedItem' @checkAllChild="checkAllChild"></tree-menu>
                  </div>
                  <!-- 收款方 receiveParty-->
                  <div class="drop-leaf" v-if="currentTab === 3">
                      <div id="quanxuan">
                        <input type="checkbox" v-model='allChecked' @click='changeAllData("receiveParty",receivePartyData)'>
                          <span>{{$t('companyProject.com_selectAll')}}</span>
                      </div>
                      <tree-menu v-if="receivePartyData && receivePartyData.length > 0" v-for="(item, index) in receivePartyData" :key="index" :data="item" :allData="receivePartyData" :multiple="multiple" @selectChildItem="selectChildItem" :selectedItem='selectedItem' @checkAllChild="checkAllChild"></tree-menu>
                  </div>
                  <!-- 确定 -->
                  <div class="level-btn">
                      <!-- <Button type="ghost" @click="definiteCancel">取消</Button> -->
                      <Button type="primary" @click="definiteChoice">{{$t('lang.lang_confirm')}}</Button>
                  </div>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
import Vue from "vue";
import treeMenu from "./treeMenu";
import { directive as clickOutside } from "v-click-outside-x";
export default {
  name: "dropFilter",
  directives: { clickOutside },
  components: { treeMenu },
  data() {
    return {
      showDropContainer: false,
      dropTabs: [
        // { index: -1, name: "全部", value: "all" },
        { index: 0, name: i18n.t('companyProject.com_money'), value: "price" },
        { index: 1, name: i18n.t('companyProject.com_source'), value: "source" },
        { index: 2, name: i18n.t('companyProject.com_personnel'), value: "personnel" },
        { index: 3, name: i18n.t('companyProject.com_receivingParty'), value: "receiveParty" }
      ],
      currentTab: 0,
      parentData: null,
      parentDataFlag: false,
      selectedItem: [], // 勾选的值
      reverseItem: [], //反选
      allChecked: false,
      overallData: []
    };
  },
  props: {
    selectedHolder: {
      type: String,
      default: i18n.t("lang.lang_pleaseSelect")
    },
    multiple: {
      type: Boolean,
      default: false
    },
    sumMoneyData: {
      type: Array,
      default: () => []
    },
    sourceData: {
      type: Array,
      default: () => []
    },
    personnelData: {
      type: Array,
      default: () => []
    },
    receivePartyData: {
      type: Array,
      default: () => []
    }
  },
  mounted() {

  },
  methods: {
    // 选择全部的时 / 删除选择全部时
    allInitialization(){
      this.overallData.forEach(item => {
        if (item.child && item.child.length > 0) {
          this.$delete(item, "selected");
          this.$set(item, "selected", false);
          item.child.forEach(opt => {
            this.$delete(opt, "selected");
            this.$set(opt, "selected", false);
          });
        } else {
          this.$delete(item, "selected");
          this.$set(item, "selected", false);
        }
      });
    },
    // 收起展开筛选树
    dropDownContainer() {
      this.showDropContainer = !this.showDropContainer;
      this.allChecked = false;
      this.currentTab = 0;
      let priceData = this.sumMoneyData;
      this.overallData = priceData;
    },
    // 点击区域外
    onClickOutside() {
      this.showDropContainer = false;
      this.currentTab = 0;
      for (let item of this.selectedItem) {
        this.$set(item, "selected", false);
        if(item.key === 'all'){
          this.allInitialization();
        }
      }
      this.overallData.forEach(item => {
        this.$delete(item, "selected");
        this.$set(item, "selected", false);
      });
      this.selectedItem = [];
    },
    // 左侧 TAB 切换
    changeTab(tab) {
      // this.allChecked = false;
      this.currentTab = tab.index;
      if (this.currentTab === 1) {
        this.overallData = this.sourceData;
        this.changeTaballCheckedFlag(this.sourceData);
      } else if (this.currentTab === 2) {
        this.overallData = this.personnelData;
        this.changeTaballCheckedFlag(this.personnelData);
      } else if (this.currentTab === 3) {
        this.overallData = this.receivePartyData;
        this.changeTaballCheckedFlag(this.receivePartyData);
      } else if (this.currentTab === 0) {
        this.overallData = this.sumMoneyData;
        this.changeTaballCheckedFlag(this.sumMoneyData);
      }
    },
    // 切换
    changeTaballCheckedFlag(data){
        data.forEach( element => {
          if(element.selected){
            this.allChecked = true;
          } else {
            this.allChecked = false;
          }
        })
    },
    // 删除选项
    deleteItems(data) {
      this.showDropContainer = false;
      this.selectedItem.forEach((item, index) => {
        if (item.key === data.key) {
          this.selectedItem.splice(index, 1);
          this.$delete(item, "selected");
          this.$set(item, "selected", false);
          this.allChecked = false;
          this.overallData.forEach(item => {
            if(item.child && item.child.length > 0){
              this.$delete(item, "selected");
              this.$set(item, "selected", false);
            }
          });
        }
      });
      if(data.key === 'all'){
        this.allInitialization();
      }
    },
    foreachData(data) {
      let newArr = [];
      data.forEach(item => {
        if (item.child) {
          item.child.forEach(opt => {
            if (opt.selected) {
              newArr.push(opt);
            }
          });
        } else{
            if (item.selected) {
              newArr.push(item);
            }
        }
      });
      return newArr;
    },
    // 选择子级/*  */
    selectChildItem(selectData) {
      let _this = this;
      let selected = selectData.selected;
      this.$delete(selectData, "selected");
      this.$set(selectData, "selected", !selected);
      if (this.multiple) {
        this.overallData.forEach(item => {
          if (item.child && item.child.length > 0) {
            let isSelected = item.child.filter(opt => !opt.selected);
            if (isSelected && isSelected.length > 0) {
              this.$delete(item, "selected");
              this.$set(item, "selected", false);
            } else {
              this.$delete(item, "selected");
              this.$set(item, "selected", true);
            }
          }
        });
        let returnCheckedChild = this.foreachData(this.overallData)
        this.selectedItem = returnCheckedChild;
        let allCheckData = this.overallData.filter(item => !item.selected);
        this.allChecked = !!(!allCheckData || allCheckData.length <= 0);
      }
    },
    checkAllChild(data) {
      let returnData = this.foreachData(data);
      this.selectedItem = returnData;
      let allCheckData = data.filter(item => !item.selected);
      this.allChecked = !!(!allCheckData || allCheckData.length <= 0);
    },
    // 全选框change事件的回调处理方法
    changeAllData(type, data) {
      let _this = this;
      _this.allChecked = !_this.allChecked;
      if (type === "receiveParty") {
        if (_this.allChecked) {
          _this.selectedItem = [];
          data.forEach((item, index) => {
            _this.selectedItem.push(item);
            this.$delete(item, "selected");
            this.$set(item, "selected", true);
          });
        } else {
          _this.selectedItem = [];
          data.forEach((item, index) => {
            this.$delete(item, "selected");
            this.$set(item, "selected", false);
          });
        }
      } else if ( type === "personnel" ||  type === "source" || type === "price" ) {
        if (_this.allChecked) {
          _this.selectedItem = [];
          data.forEach((item, index) => {
            this.$delete(item, "expand");
            this.$set(item, "expand", true);
            if(item.child && item.child.length > 0 ){
                item.child.forEach((items, index) => {
                  this.$delete(item, "selected");
                  this.$delete(items, "selected");
                  this.$set(item, "selected", true);
                  this.$set(items, "selected", true);
                });
            } else if (item.child.length <= 0){
                this.$delete(item, "selected");
                this.$set(item, "selected", true);
            }
          });
          _this.selectedItem.push({title:i18n.t('companyProject.com_selectAll'),key:'all'});
        } else {
          _this.selectedItem = [];
          data.forEach((item, index) => {
            this.$delete(item, "expand");
            this.$set(item, "expand", true);
            if(item.child && item.child.length > 0) {
                item.child.forEach((items, index) => {
                  this.$delete(item, "selected");
                  this.$delete(items, "selected");
                  this.$set(item, "selected", false);
                  this.$set(items, "selected", false);
                });
            } else if (item.child.length <= 0){
                this.$delete(item, "selected");
                this.$set(item, "selected", false);
            }
          });
        }
      }
    },
    // 确定
    definiteChoice() {
      this.showDropContainer = false;
      this.$emit("definiteChoice", this.selectedItem);
    },
  }
};
</script>
<style lang="less">
.filter-drop-contents {
  width: 400px;
  height: auto;
  .content-box {
    position: relative;
    width: 100%;
    height: 38px;
    max-height: 40px;
    padding: 7px;
    border: 1px solid #dfdfdf;
    background: #fff;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    line-height: 22px;
    cursor: pointer;
    .selected-data {
      width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .selected-item {
        position: relative;
        font-size: 12px;
        color: #777;
        padding: 7px 10px;
        height:26px;
        line-height: 26px;
        background-color: #dcf6f2;
        margin-left: 7px;
        border-radius: 4px;
        .icon-cuowu {
          font-size: 12px;
          cursor: pointer;
          padding-left: 15px;
        }
      }
    }
    .selected-item-holder {
      color: #ccc;
      padding-left: 10px;
      i {
        padding-right: 5px;
      }
    }
    > i {
      position: absolute;
      right: 10px;
      top: 13px;
      font-size: 14px;
      color: #999;
    }
    .drop-down-container {
      position: absolute;
      top: 35px;
      left: 0;
      width: 100%;
      height: 283px;
      border: 1px solid #dfdfdf;
      background: #fff;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      z-index: 999;
      display: flex;
      justify-content: space-between;
      .drop-tabs {
        width: 20%;
        overflow: hidden;
        > li {
          padding: 0 10px;
          line-height: 32px;
          color: #777;
          cursor: pointer;
          &.tab-active {
            color: @base;
          }
        }
      }
      .drop-leaf {
        width: 75%;
        background: #fff;
        height: 270px;
        overflow-y: auto;
        margin-top: 5px;
        #quanxuan {
          padding-bottom: 7px;
          input[type="checkbox"] {
            width: 14px;
            height: 14px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            line-height: 14px;
            position: relative;
          }
          input[type="checkbox"]::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            background: #fff;
            width: 100%;
            height: 100%;
            border: 2px solid @base;
            border-radius: 2px;
          }
          input[type="checkbox"]:checked::before {
            content: "\2713";
            background-color: @base;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            border: 1px solid @base;
            color: white;
            font-size: 13px;
            font-weight: 800;
          }
          //
          i {
            color: #3cd2b4;
            font-size: 18px;
          }
        }
      }
      .level-btn {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
  }
}
</style>



