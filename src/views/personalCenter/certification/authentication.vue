<template>
    <div class="personalAuthenticationContainer">
        <p class="titlePrompt"><i class="icon">!</i>签署电子合同需要您完成身份验证，才能生成有法律效应电子合同</p>
        <section class="fromInfoContainer">
            <p class="title" style="font-size: 16px;color: @black_2;padding-left: 40px;margin-bottom: 35px;">实名认证</p>
            <Form :model="formLeft" label-position="right" :label-width="113">
                <FormItem label="你的姓名">
                    <Input v-model="formLeft.input1" placeholder="请输入您的姓名" style="width:430px;" size="large"></Input>
                </FormItem>
                <FormItem label="身份证号码">
                    <Input v-model="formLeft.input2" placeholder="请输入您的身份证号码" style="width:430px;" size="large"></Input>
                </FormItem>
                <FormItem label="银行卡号">
                    <Input v-model="formLeft.input3" placeholder="请输入您的银行卡号码" style="width:430px;" size="large"></Input>
                </FormItem>
                <FormItem label="银行预留手机号">
                    <Input v-model="formLeft.input4" placeholder="请输入您在银行所预留的手机号码" style="width:430px;" size="large"></Input>
                </FormItem>
                <FormItem label="验证码">
                    <Input v-model="formLeft.input5" placeholder="请输入您的手机验证码" style="width:430px;" size="large">
                    <span @click="getCode" slot="append" style="color:#3dcfb7;cursor: pointer;">{{ codeName === '获取验证码' ? codeName : codeName + 's后重新获取验证码'}}</span>
                    </Input>
                </FormItem>
            </Form>
        </section>
        <Button @click="submit" style="background:#3dcfb7;color:#fff;margin-left:192px;font-size:14px;min-width:100px;height:38px;">完成身份验证</Button>
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
            formLeft: {},
            codeName: "获取验证码"
        };
    },
    methods: {
        getCode() {
            if (this.codeName === "获取验证码") {
                this.codeName = 200;
                const timeId = setInterval(() => {
                    this.codeName--;
                    if (this.codeName <= 0) {
                        clearInterval(timeId);
                        this.codeName = "获取验证码";
                    }
                }, 1000);
            }
        },
        submit() {}
    },
    computed: {},
    components: {}
};
</script>

<style lang="less" scoped>
.personalAuthenticationContainer {
  padding-bottom: 30px;
  .titlePrompt {
    height: 40px;
    padding-left: 12px;
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
    padding: 40px 0 10px 80px;
    .title {
      margin-bottom: 25px;
      font-size: 14px;
      color: @black_2;
    }
  }
}
</style>
<style lang="less">
.personalAuthenticationContainer {
  .fromInfoContainer {
    .ivu-form {
    }
    .ivu-form-item-label {
      font-size: 13px;
      padding: 11px 22px 12px 0px;
      color: #c3cbd6 !important;
    }
    .ivu-input {
      font-size: 14px;
      color: #dbdbdb !important;
    }
    .ivu-input-group-append {
      background: #fff;
      padding: 0px 20px 0px 20px;
    }
  }
}
</style>