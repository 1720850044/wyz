<template>
    <div style="height: 100%">
        <div class="electronicSignatureContainer" v-if="isAttestation">
            <p class="titlePrompt"><i class="icon">!</i>请填写真实资料完成电子签名申请，电子签名虚假将导至电子合同不具有法律约束力</p>

            <Form class="formList" ref="formData" :model="formLeft" :rules="ruleValidate" label-position="right"
                  :label-width="120">
                <p class="title">企业电子签名资料</p>

                <FormItem label="所在地区" prop="legalArea">
                    <Select v-model="formLeft.legalArea" style="width: 430px" size="large" :disabled="isAttestation">
                        <Option v-for="(item,index) in regionList" :key="index"   :value="item.value">{{item.label}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="机构类型" prop="organType">
                    <Select v-model="formLeft.organType" style="width: 430px" size="large" :disabled="isAttestation">
                        <Option v-for="(item,index) in companyTypeList" :key="index" :value="item.value">{{item.label}}
                        </Option>
                    </Select>
                </FormItem>

                <FormItem label="企业名称">
                    <Input v-model="formLeft.name" :disabled="isAttestation" placeholder="请选择" style="width: 430px"></Input>
                </FormItem>
                <FormItem label="企业注册方式">
                    <Input v-model="formLeft.code" :disabled="isAttestation"  style="width: 430px"></Input>
                </FormItem>

                <FormItem label="注册类型">
                    <RadioGroup v-model="formLeft.radio">
                        <Radio label="male">法人注册</Radio>
                        <Radio label="female">代理人注册</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="nameLabel">
                    <Input v-model="formLeft.legalName" :placeholder="nameLabel" style="width: 430px"></Input>
                </FormItem>
                <FormItem :label="identityLabel">
                    <Input v-model="formLeft.legalIdno" :placeholder="identityLabel" style="width: 430px"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="submit('formData')" type="primary">保存</Button>
                </FormItem>
            </Form>

        </div>
        <h3 v-else style="margin-top: 300px;height: 100%;text-align: center;">请先完成企业认证</h3>
    </div>
</template>

<script>
import api from "api";

const regionList = [
  { value: "0", label: "大陆" },
  { value: "1", label: "香港" },
  { value: "2", label: "澳门" },
  { value: "3", label: "台湾" },
  { value: "4", label: "外籍" }
];

const companyTypeList = [
  { value: "0", label: "普通企业" },
  { value: "1", label: "社会团体" },
  { value: "2", label: "事业单位" },
  { value: "3", label: "民办非企业单位" },
  { value: "4", label: "党政及国家机构" }
];

export default {
    created() {
        this.initInfo();
    },
    mounted() {
        this.$bus.on("attestation", () => {
            this.attestation();
        });
    },
    data() {
        return {
            regionList: regionList,
            companyTypeList: companyTypeList,
            formLeft: {
                radio: "male",
                name: "",
                code: "",
                legalName: "",
                legalIdno: "",
                legalArea: "0",
                organType: "0"
            },
            ruleValidate: {},
            isAttestation: false
        };
    },
    methods: {
    // 获取信息
        async initInfo() {
            let { data } = await api.getconfirmInfo();

      /*已认证*/
            if (data.err_code === 0 && data.data) {
                this.attestation();
                this.isAttestation = true;
                let formData = data.data;
                this.formLeft.name = formData.name;
                this.formLeft.code = formData.code;
                this.formLeft.legalName = formData.legalName;
                this.formLeft.legalIdno = formData.legalIdno;
        // 所在地区
                if (formData.legal_area) {
                    this.legalArea = formData.legal_area;
                }
        // 机构类型
                if (formData.organ_type) {
                    this.organType = formData.organ_type;
                }
            } else if (data.err_code === 40012) {
            }
        },
    // 提交表单
        submit(name) {
            this.$refs[name].validate(async valid => {
                if (valid) {
                    let { data } = await api.getCompanyAccount({
                      organType: this.formLeft.organType,
                      legalArea: this.formLeft.legalArea
                  });
                    if (data.err_code === 0) {
                      this.initInfo();
                      this.$Message.success(data.err_message);
                  }
                } else {
                    this.$Message.error("请填写正确的信息!");
                }
            });
        },
        attestation() {
            this.isAttestation = true;
        }
    },
    computed: {
        nameLabel(){
            return this.formLeft.radio =='male'?'法人姓名':'代理人姓名';
        },
        identityLabel(){
            return this.formLeft.radio =='male'?'法人身份证':'代理人身份证';
        }
    },
    components: {}
};
</script>

<style lang="less" scoped>
.electronicSignatureContainer {
  height: 100%;
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
  }
}
</style>
<style lang="less">
.electronicSignatureContainer {
  .formList {
    .ivu-form-item-label {
      font-size: 13px;
      padding: 11px 22px 12px 0;
      color: #bdbdbd;
    }
    .ivu-input {
      font-size: 13px;
    }
    .ivu-btn {
      padding: 0 40px;
    }

    .ivu-radio-inner:after {
      background: #3bceb6;
    }
  }
}
</style>
