<template>
    <div>
        <template v-if="companyList && companyList.length > 0">
            <div class="new-cooperative-company">
                <div class="tableHeade">
                    <span>公司名称</span>
                    <span>添加时间</span>
                    <span>添加来源</span>
                    <span>已合作次数</span>
                    <span>操作</span>
                </div>
                <dl class="new-cooperative-dl">
                    <dd v-for="(item,index) in companyList" :key="index">
                        <span class="first-span">{{item.company}}</span>
                        <span>{{item.create_time | timeStampConversion}}</span>
                        <span v-if="item.from==0">手动添加</span>
                        <span v-if="item.from==1">测试任务</span>
                        <span v-if="item.from==2">网页</span>
                        <span>{{item.cooperate}}</span>
                        <span>
                            <i class="add" @click="agreeAddorIgnore('1',item.id)">添加</i>
                            <i class="ignore" @click="agreeAddorIgnore('2',item.id)">忽略</i>
                        </span>
                    </dd>
                </dl>
            </div>
        </template>
        <template v-else>
            <div style="min-height: 400px;position: relative">
                <nothink type="company" text="暂无数据"></nothink>
            </div>
        </template>
    </div>
</template>

<script>
import { cooperationAide } from "api";
const moment = require("moment");
export default {
  data() {
    return {
      companyList: []
    };
  },

  mounted() {
    // this.initFun();
  },
  methods: {
    // 页面初始化
    async initFun() {
      let { data } = await cooperationAide.newCooperativeCompanyListIndex();
      if (data.err_code == 0) {
        this.getNewCooperativeCompaniesList();
      } else {
        this.$Messages.error(data.err_message);
      }
    },
    // 获取新合作公司列表
    async getNewCooperativeCompaniesList() {
      let { data } = await cooperationAide.newCooperativeCompaniesList();
      if (data.err_code == 0) {
        this.companyList = data.data;
      }
    },
    // 添加   // 忽略
    agreeAddorIgnore(type, id) {
      if (type == "1") {
        let params = {
          id: id,
          type: type
        };
        this.operationFunc(params);
      } else if (type == "2") {
        let params = {
          id: id,
          type: type
        };
        this.operationFunc(params);
      }
    },
    async operationFunc(params) {
      let { data } = await cooperationAide.newCooperativeCompaniesResponse(
        params
      );
      if (data.err_code == 0) {
        this.$Message.success(data.err_message);
        this.getNewCooperativeCompaniesList();
        this.$emit('add-comment');
      }
    }
  },
  // 时间戳转换日期格式
  filters: {
    timeStampConversion: function(timeStamp) {
      if (timeStamp) {
        let time = moment(timeStamp * 1000).format("YYYY-MM-DD HH:mm:ss");
        return time;
      }
    }
  }
};
</script>

<style>
</style>
