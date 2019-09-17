<template>
    <div class="certificationContainer">
        <p class="titlePrompt"><i class="icon">!</i>请准确填写公司对公帐户信息，系统将打款至您公司对公帐户，输入到帐户金额后完成实名认证</p>
        <Form class="formList" :model="formLeft" ref="formData" :rules="ruleValidate" label-position="right"
              :label-width="123">
            <section>
                <p class="title" >基本信息</p>
                <div class="formListHead">
                    <FormItem prop="name" label="企业全称">
                        <Input v-model="formLeft.name" @on-change="revalidation" placeholder="公司名称" style="width: 430px"
                               :readonly="readonly"></Input>
                    </FormItem>
                    <FormItem prop="code" label="营业执照注册号">
                        <Input v-model="formLeft.code" @on-change="revalidation" placeholder="组织代码号或社会信用代码号"
                               style="width: 430px"
                               :readonly="readonly"></Input>
                    </FormItem>
                    <FormItem prop="legalName" label="法人姓名">
                        <Input v-model="formLeft.legalName" @on-change="revalidation" placeholder="法人姓名"
                               style="width: 430px"
                               :readonly="readonly"></Input>
                    </FormItem>
                    <FormItem prop="legalIdno" label="法人身份证">
                        <Input v-model="formLeft.legalIdno" @on-change="revalidation" placeholder="法人身份证"
                               style="width: 430px"
                               :readonly="readonly"></Input>
                    </FormItem>
                </div>
            </section>
            <section class="formListBody" >
                <p class="title" style="margin-top: 30px;">对公账户信息</p>
                <div>
                    <FormItem prop="cardno" label="开户行账户">
                        <Input v-model="formLeft.cardno" @on-change="revalidation" placeholder="银行卡号"
                               style="width: 430px"
                               :readonly="readonly"></Input>
                    </FormItem>
                    <FormItem prop="bank" label="开户行名称">
                        <Select v-model="formLeft.bank" @on-change="getCityList" style="width: 430px"
                                :disabled="readonly" placeholder="请选择银行">
                            <Option v-for="(item,index) in bankList" :value="item" :key="index">{{item}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="开户行所在地">
                        <Cascader v-if="authenticated" :data="cityList" v-model="city" placeholder="请选择银行地区"
                                  style="width: 430px"
                                  @on-change="getSubbranch"></Cascader>
                        <Input v-else v-model="cityString" :readonly="readonly" style="width: 430px"></Input>
                    </FormItem>
                    <FormItem prop="subbranch">
                        <Select v-if="authenticated" v-model="formLeft.subbranch" style="width: 430px"
                                placeholder="请选择支行">
                            <Option v-for="(item,index) in subbranchList" :value="item" :key="index">{{item}}</Option>
                        </Select>
                        <Input v-else v-model="formLeft.subbranch" :readonly="readonly" style="width: 430px"></Input>
                    </FormItem>
                    <FormItem v-if="status === 0&& authenticated">
                        <Button type="primary" style="width: 100px;margin-left:200px;" @click="showWindow('formData')">立刻验证</Button>
                    </FormItem>
                    <template v-else-if="status === 1">
                        <FormItem class="cash" label="银行验证金额">
                            <Input v-model="cash" style="width: 430px" placeholder="请输入打入您公司账户金额"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="submit()">完成验证</Button>
                        </FormItem>
                    </template>
                    <FormItem v-else-if="status === 2">
                        <Button type="primary" style="width: 100px;margin-left:200px;" @click="showWindow('formData')" v-show="modal2">重新认证企业</Button>
                    </FormItem>
                    <!--<FormItem prop="subbranch">-->
                    <!--<Select v-if="authenticated" v-model="formLeft.subbranch" style="width:200px">-->
                    <!--<Option v-for="(item,index) in subbranchList" :value="item" :key="index">{{item}}</Option>-->
                    <!--</Select>-->
                    <!--<Input v-else v-model="formLeft.subbranch" :readonly="readonly"></Input>-->
                    <!--</FormItem>-->
                    <!--<FormItem prop="subbranch">-->
                    <!--<Select v-if="authenticated" v-model="formLeft.subbranch" style="width:200px">-->
                    <!--<Option v-for="(item,index) in subbranchList" :value="item" :key="index">{{item}}</Option>-->
                    <!--</Select>-->
                    <!--<Input v-else v-model="formLeft.subbranch" :readonly="readonly"></Input>-->
                    <!--</FormItem>-->

                </div>
            </section>

            <!--<Button v-if="status === 0&& authenticated" @click="showWindow('formData')">立刻验证</Button>-->


        </Form>

        <Modal
                v-model="modal1"
                width="350">
            <section slot="header" style="opacity: 0">11</section>

            <section>
                <div>
                    已向您公司对公账户打款
                    <p>金额小于1元，24小时内到账</p>
                </div>
                <div>
                    <p>稍后进入</p>
                    <p>设置>企业认证</p>
                    <p> 输入打款金额，完成最后验证</p>
                </div>
            </section>
            <Button slot="footer" type="primary" @click="modal1 = false">我知道了</Button>

        </Modal>


    </div>
</template>

<script>
import api from "api";

export default {
    created() {},
    mounted() {
    // 获取银行列表
        this.bankListInit();
    // 获取信息
        this.initInfo();
    },
    data() {
        return {
            readonly: true,
            authenticated: false,
            subbranchList: [],
            bankList: [],
            cash: 0, // 验证金额
            status: 0,
            modal1: false,
            modal2: false,
            formLeft: {
                name: "",
                code: "",
                legalName: "",
                legalIdno: "",
                subbranch: "",
                cardno: "",
                bank: ""
            },
            cityString: "",
            city: [],
            cityList: [],
            ruleValidate: {
                name: [{ required: true, message: "不能为空", trigger: "change,blur" }],
                code: [{ required: true, message: "不能为空", trigger: "change,blur" }],
                legalName: [
          { required: true, message: "不能为空", trigger: "change,blur" }
                ],
                legalIdno: [
          { required: true, message: "不能为空", trigger: "change,blur" }
          //                        {max: 18, min: 18, message: '格式不正确', trigger: 'change'}
                ],
                cardno: [
          { required: true, message: "不能为空", trigger: "change,blur" }
                ],
                bank: [{ required: true, message: "不能为空", trigger: "change,blur" }],
                subbranch: [
          { required: true, message: "不能为空", trigger: "change,blur" }
                ]
            }
        };
    },
    methods: {
        async initInfo() {
            let { data } = await api.getconfirmInfo();

      /*已认证*/
            if (data.err_code === 40012) {
                this.authenticated = true;
                this.readonly = false;
            } else if (data.err_code === 0 && data.data) {
                let formData = data.data;
                this.formLeft.name = formData.account_name;
                this.formLeft.code = formData.code;
                this.formLeft.legalName = formData.legalName;
                this.formLeft.legalIdno = formData.legalIdno;
                this.formLeft.cardno = formData.cardno;
                this.formLeft.bank = formData.bank;
                this.formLeft.subbranch = formData.subbranch;
                this.formLeft.provice = formData.provice;
                this.cityString = formData.provice + "/" + formData.city;
            }
        },
    // 显示验证弹窗
        showWindow(name) {
            this.$refs[name].validate(async valid => {
                if (valid) {
                    let { data } = await api.getCompanyConfirm(this.formLeft);
                    if (data.err_code === 0) {
                      this.modal1 = true;
                      this.verify();
                  } else {
                      this.$Message.error(data.err_message);
                  }
                } else {
                    this.$Message.error("请填写正确的信息!");
                }
            });
        },
    // 开始验证
        verify() {
            this.status = 1;
      //                this.modal1 = false
        },
    // 提交
        async submit() {
            let { data } = await api.getCompanyCodeConfirm({ cash: this.cash });
            if (data.err_code === 0) {
        // 完成认证
                this.$bus.emit("attestation");
                this.status = 2;
            } else {
                this.$Message.error(data.err_message);
            }
        },

    // 获取银行列表
        async bankListInit() {
            let { data } = await api.getBankInfo();
            this.bankList = data.data;
        },
    // 获取城市列表
        async getCityList() {
            let { data } = await api.getBankInfo({ name: this.formLeft.bank });
            this.cityList = data.data;
            this.revalidation();
        },
    // 获取支行
        async getSubbranch(value) {
            let { data } = await api.getBankInfo({
                name: this.formLeft.bank,
                pro: value[0],
                city: value[1]
            });
            this.subbranchList = data.data;
            this.formLeft.provice = value[0];
            this.formLeft.city = value[1];
        },

    // 显示重新验证
        revalidation() {
            this.modal2 = true;
        }
    },
    computed: {},
    components: {}
};
</script>

<style lang="less" scoped>
.certificationContainer {
  .titlePrompt {
    height: 40px;
    padding-left: 12px;
    line-height: 40px;
    color: @orange;
    background: #fff8eb;
    border-radius: 4px;
    .icon {
      display: inline-block;
      width: 13px;
      height: 13px;
      margin-right: 5px;
      color: @orange;
      border: 1px solid @orange;
      border-radius: 50%;
      text-align: center;
      line-height: 13px;
    }
  }
  .formList {
    padding: 40px 0px 15px 80px;
    color: #777777;
    .title {
      margin-bottom: 35px;
      font-size: 16px;
    }
    .cash {
      font-size: 16px;
    }
  }
}
</style>
<style lang="less">
.certificationContainer {
  .formList {
    .ivu-form-item-label {
      font-size: 13px;
      padding: 15px 15px 12px 0;
      color: #bdbdbd;
    }
    .ivu-form-item-content{
        .ivu-input{
            font-size: 13px;
        }
    }
    .cash {
      .ivu-form-item-label {
        font-size: 16px;
        color: @black_2;
      }
      .ivu-input {
        border: 1px solid #3bceb6;
      }
    }
  }
}
</style>
