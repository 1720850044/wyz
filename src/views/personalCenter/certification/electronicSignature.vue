<template>
    <div class="electronicSignature">
        <p class="titlePrompt"><i class="icon">!</i>请认真完善电子合同签名资料，才能生成有法律效应的电子合同</p>
        <section class="fromInfoContainer">
            <p class="title" style="font-size: 16px;color: @black_2;margin-bottom: 35px;">电子签名资料</p>
            <Form :model="formLeft" label-position="right" :label-width="100">
                <FormItem label="所在地区">
                    <Select v-model="model1" style="width:430px" size="large">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="身份证号码">
                    <Input v-model="formLeft.input2" style="width:430px;" placeholder="请输入您的身份证号码" size="large"></Input>
                </FormItem>
                <FormItem label="姓名">
                    <Input v-model="formLeft.input3" style="width:430px;" placeholder="请输入您的姓名" size="large"></Input>
                </FormItem>
                <FormItem label="手机号">
                    <Input v-model="formLeft.input3" style="width:430px;" placeholder="请输入您在银行所预留的手机号码" size="large"></Input>
                </FormItem>
                <FormItem label="邮箱（可选）">
                    <Input v-model="formLeft.input3" style="width:430px;" placeholder="请输入您的电子邮箱" size="large"></Input>
                </FormItem>
            </Form>
        </section>
        <Button @click="submit" style="background:#3dcfb7;color:#fff;margin-left:181px;font-size:14px;min-width:100px;height:38px;">保存</Button>
    </div>
</template>

<script>
import api from "api";
import "../cropper.min.css";
export default {
    created() {},
    mounted() {},
    data() {
        return {
            cityList: [
                {
                    value: "New York",
                    label: "New York"
                }
            ],
            model1: "",
            formLeft: {},
            codeName: "获取验证码"
        };
    },
    methods: {
        submit() {}
    },
    computed: {},
    components: {}
};
</script>


<style lang="less" scoped>
.electronicSignature {
  padding-bottom: 30px;
  .titlePrompt {
    height: 40px;
    padding-left: 13px;
    line-height: 40px;
    font-size: 13px;
    color: @orange;
    background: #fff8eb;
    border-radius: 4px;
    .icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: 14px;
      color: @orange;
      border: 1px solid @orange;
      border-radius: 50%;
      text-align: center;
      line-height: 14px;
    }
  }
  .fromInfoContainer {
    padding: 40px 0 0 80px;
    .title {
      margin-bottom: 25px;
      font-size: 14px;
      color: @black_2;
    }
  }
}
</style>
<style lang="less">
.electronicSignature {
  .fromInfoContainer {
    .ivu-form,
    .ivu-form-item-label {
      font-size: 13px;
      color: #c3cbd6 !important;
      padding: 11px 22px 12px 0px;
    }
    .ivu-input {
      font-size: 14px;
      color: #dfdfdf !important;
    }
  }
}
</style>

