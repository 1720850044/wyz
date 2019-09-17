<template>
    <div class="cooperationIndex">
        <div class="fileCondition">
            <em>
                <button class="new-operative-company" @click="newOperativeCompany">新合作公司</button>
            </em>
            <em>
                <Select v-model="filterData" style="width:80px" placeholder="请选择...">
                    <!-- <Option value="">全部</Option> -->
                    <Option v-for="item in sourceList" :value="item.index" :key="item.index">{{ item.value }}</Option>
                </Select>
            </em>
            <em>
                <Input v-model="searchData" icon="ios-search" style="width:200px;" placeholder="公司名称/联系人/电话/擅长" @keyup.enter.native="searchCoop"></Input>
            </em>
            <!--  v-if="user_type == 1"  1jia 0yi  -->
            <em>
                <button class="AddBtnPublicSty" type="success" @click="addCooperative">
                  <i class="iconfonts icon-xinjian"></i> 添加公司
                </button>
            </em>
            <div class="clear"></div>
        </div>
        <cooperative-company :source="filterData" :search="searchData" ref="cooperativeRef"></cooperative-company>
    </div>
</template>

<script>
import cooperativeCompany from "../component/cooperativeCompany.vue"; // 公司合作库列表
import Cookies from "js-cookie";
import { cooperationAide } from "api";
export default {
  name: "cooperation-index",
  components: {
    cooperativeCompany
  },
  data() {
    return {
      filterData: "",
      sourceList: [
        { value: "全部", index: "all" },
        { value: "手动添加", index: 0 },
        { value: "测试任务", index: 1 },
        { value: "网页", index: 2 }
      ],
      searchData: null,
      user_type: JSON.parse(Cookies.get("company")).type,
    };
  },
  mounted() {},
  methods: {
    // 页面初始化
    async initFun() {
      let { data } = await cooperationAide.newCooperativeCompanyListIndex();
      if (data.err_code == 0) {
        // this.getNewCooperativeCompaniesList();
      } else {
        this.$Messages.error(data.err_message);
      }
    },
    // 公司合作库=====>公司名称/联系人/电话/擅长搜索
    searchCoop() {
      this.$refs.cooperativeRef.cooperationList();
    },
    // 公司合作库=====>添加公司按钮
    addCooperative() {
      this.$refs.cooperativeRef.newAdd();
    },
    // 新合作公司列表（0.9.2）
    newOperativeCompany() {
      this.$refs.cooperativeRef.newOperativeCompany();
    },
  },
  watch: {
      filterData(val){
          this.filterData = val;
          this.$nextTick(() => {
              this.$refs.cooperativeRef.cooperationList();
          });
      }
  }
};
</script>

<style lang="less">
@import "../../../customer/epibolCompany/style/tableStyle.less";
.cooperationIndex {
  .fileCondition {
    display: flex;
    justify-content: flex-end;
    padding: 0 0 20px 0;
    em {
      margin-left: 5px;
      font-style: normal;
      float: left;
    }
    .ivu-select-selection {
      .ivu-select-selected-value {
        color: @base !important;
      }
    }
    .AddBtnPublicSty,
    .new-operative-company {
      background: @base;
      border: 0;
      height: 100%;
      padding: 0 10px;
      border-radius: 3px;
      color: #fff;
      outline: none;
      &:hover {
        cursor: pointer;
        background: #35ab93;
      }
    }
    .new-operative-company {
      background: #fff;
      color: @base;
      &:hover {
        color: #fff;
        background: #35ab93;
      }
    }
  }
  .comInviteListShit {
    .tableHeade {
      span {
        &:first-child {
          flex: 2 !important;
        }
      }
    }
    dd {
      .first-span {
        flex: 2 !important;
      }
    }
  }
}
</style>
