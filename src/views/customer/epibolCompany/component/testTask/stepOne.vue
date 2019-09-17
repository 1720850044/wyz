<template>
    <div style="position: relative;">
        <div class="addRow">
            <dl style="margin-top: 30px;">
                <dt>测试任务名称</dt>
                <dd>
                    <Input v-model="postData.test_name" placeholder="输入任务名称"></Input>
                </dd>
            </dl>
            <dl>
                <dt>测试任务类型</dt>
                <dd>
                    <Select v-model="postData.task_type" style="width:100%" placeholder="请选择任务类型" @on-change="changeSelect">
                        <Option :value="item.id" :key="index" v-for="(item,index) in abilityList">{{item.name}}</Option>
                    </Select>
                </dd>
            </dl>
            <dl>
                <dt v-if="radioFlag.radioStatus == 2">报名截止日期</dt>
                <dt v-if="radioFlag.radioStatus == 1">报价截止日期</dt>
                <dd>
                    <DatePicker type="date" :editable="false" placeholder="点击选择截止日期" style="width: 100%" @on-change="changeEnrollDate" :value="postData.bid_end_time"></DatePicker>
                </dd>
            </dl>
            <dl>
                <dt>交稿截止日期</dt>
                <dd>
                    <DatePicker type="date" :editable="false" placeholder="点击选择交稿截止日期" style="width: 100%" @on-change="changeDate" :value="postData.submit_time"></DatePicker>
                </dd>
            </dl>
            <dl>
                <dt style="margin-top: 25px">测试费用</dt>
                <dd class="testTaskPrice">
                    <RadioGroup v-model="radioFlag.radioStatus" @on-change='changeRadio'>
                        <Radio label="1">
                            <span>服务商报价</span>
                        </Radio>
                        <Radio label="2">
                            <span>我方报价</span>
                        </Radio>
                    </RadioGroup>
                    <p v-if="radioFlag.radioStatus == 1" style="height: 32px;line-height: 32px;margin-top: 5px; color: #3bceb6;">测试任务发布成功后，参与投标的服务方报价</p>
                    <Input v-if="radioFlag.radioStatus == 2" v-model="postData.test_price"  placeholder="测试费用" :maxlength='15' style="margin-top: 5px"></Input>
                </dd>
            </dl>
            <dl>
                <dt>项目预计金额</dt>
                <dd>
                    <Input v-model="postData.expect_price" placeholder="输入项目预计金额" :maxlength='15'></Input>
                </dd>
            </dl>
            <dl>
                <dt>项目预计周期</dt>
                <dd>
                    <DatePicker format="yyyy-MM-dd" type="daterange" :editable="false" placeholder="点击选择项目预计周期"  style="width:100%" :value="postData.expectDate" @on-change="expectCycle"></DatePicker>
                </dd>
            </dl>
        </div>
        <Button class="anaBtn" type="primary" @click="nextStep()" style="position: absolute;right: 0px;" :disabled='btnDisabled'>下一步</Button>
    </div>
</template>

<script>
import { invitationApi } from "api";
export default {
    data() {
      return {
        radioFlag: {
          flag: true,
          radioStatus: "1"
      },
        postData: {
          test_name: null, // 测试任务名称
          task_type: null, // 测试任务类型
          test_price: null, // 测试费用
          bid_end_time: null, // 报名截止时间
          submit_time: null, // 交稿截止时间
          expect_price: null, // 预计金额
          project_start_time: null, // 预计周期开始时间
          project_end_time: null, // 预计周期结束时间
          expectDate: null
      },
        flag: false,
        abilityList: [],
        currentTime: null, // 当前时间年月日YYYY-MM-DD
        btnDisabled: false
    };
  },
    props: {
      stepOneData: {
        type: Object,
        default() {
          return {};
      }
    }
  },
    watch: {
      radioFlag(val) {
        if (val) {
          console.log(2, val);
      }
      // if (val.radioStatus == 2) {
      //   // this.radioFlag.radioStatus == 2
      //   this.postData.test_price = this.stepOneData.test_price;
      // }
    }
  },
    mounted() {
      this.AbilityList();
      this.getNowFormatDate();
      if (this.stepOneData) {
        this.postData = this.stepOneData;
        this.postData.expectDate = [
          this.stepOneData.project_start_time,
          this.stepOneData.project_end_time
      ];
        if (this.stepOneData.test_price) {
          this.radioFlag.radioStatus == 2;
          this.postData.test_price = this.stepOneData.test_price;
      } else {
          this.radioFlag.radioStatus == 1;
      }
    }
  },
    methods: {
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
      // console.log("获取当前时间", this.currentTime);
    },
    // 获取类型列表
      async AbilityList() {
        let { data } = await invitationApi.abilityList();
        if (data.err_code === 0 && data.data) {
          this.abilityList = data.data;
      }
    },
    //   下一步
      nextStep() {
        this.$emit("next");
        this.$emit("sendiptVal", this.postData, this.radioFlag.radioStatus);
    },
    // 报名截止日期
      changeEnrollDate(date) {
      //   this.postData.bid_end_time = date;
        let sliceStr = date.slice(0, 10);
        if (date.includes(this.currentTime) || sliceStr <= this.currentTime) {
          this.$Message.warning("不能选择当前日期及之前的日期");
          this.btnDisabled = true;
      } else {
          this.postData.bid_end_time = date;
          this.btnDisabled = false;
      }
    },
    // 交稿截止日期
      changeDate(date) {
        let sliceStr = date.slice(0, 10);
        if (date.includes(this.currentTime) || sliceStr <= this.currentTime) {
          this.$Message.warning("不能选择当前日期及之前的日期");
          this.btnDisabled = true;
      } else if (this.postData.bid_end_time) {
          if (
          parseInt(new Date(date).getTime()) <=
          parseInt(new Date(this.postData.bid_end_time).getTime())
        ) {
            this.$Message.warning("交稿日期不能小于或等于报名或报价日期");
            this.btnDisabled = true;
        } else {
            this.btnDisabled = false;
            this.postData.submit_time = date;
        }
      }
    },
    // 预计周期
      expectCycle(date) {
        this.postData.project_start_time = date[0];
        this.postData.project_end_time = date[1];
    },
    // 选择任务类型
      changeSelect(value) {
        this.postData.task_type = value;
    },
      changeRadio(value) {
        // console.log("服务商报价还是我方标价", value);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/addEpibolCom.less";
.addRow {
  dl {
    dt {
      width: 88px;
      font-size: 13px;
    }
  }
}
</style>
