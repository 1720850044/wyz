<template>
    <div class="basicInformationContainer">
        <!-- <p class="titlePrompt"><i class="icon">!</i>请准备填写公司对公账户信息，系统将打款至您公司对公账户，输入到账金额后完成实名认证。</p> -->
        <Form ref="formValidate" class="fromInfoContainer" :rules="ruleInline" :model="formValidate" :label-width="86">
            <p class="title">{{$t('companySetUp.setUp_essentiaInformation')}}</p>
            <div class='content'>
                <FormItem :label="$t('companySetUp.setUp_companyLogo')">

                       <v-upload :id="uploadId"  class="upload" v-on:FileUploadedSuccess="FileUploadedSuccess" v-on:UploadProgress="UploadProgress" :isShowProgress="false">
                           <template slot="upload" style="position: relative;">
                               <div v-if="fileShow" style="min-width:160px;min-height:160px;">
                                   <img v-if="formValidate.logo" :src="formValidate.logo" class="image">
                                   <button :id="uploadId" class="uploadBrowse"></button>
                                   <div class="uploadButton" v-show="!formValidate.logo">
                                       <div class="uploadIconBox">
                                           <Icon style="font-size:28px;color:#3bceb6;" type="ios-cloud-upload"></Icon>
                                           <p>{{$t('companySetUp.setUp_clickUploadLogo')}}</p>
                                       </div>
                                   </div>
                               </div>
                           </template>
                       </v-upload>
                </FormItem>
                <FormItem :label="$t('companySetUp.setUp_companyName')">
                    <Input v-if="isAttestation" v-model="formValidate.name" style="width:430px;"  key="1" :placeholder="$t('lang.lang_pleaseEnter') + $t('companySetUp.setUp_companyName')" :readonly="readonly">
                      <span class="sign" slot="append">{{$t('companySetUp.setUp_certified')}}</span>
                    </Input>
                    <Input v-else v-model="formValidate.name" style="width:430px;" key="2" :placeholder="$t('lang.lang_pleaseEnter') + $t('companySetUp.setUp_companyName')" ></Input>
                </FormItem>
                <FormItem :label="$t('companySetUp.setUp_companyType')">
                    <Input v-model="formValidate.type_name" style="width:430px;" :placeholder="$t('lang.lang_pleaseSelect') + $t('companySetUp.setUp_companyType')" :readonly="readonly"></Input>
                </FormItem>
                <FormItem :label="$t('companySetUp.setUp_establishmentTime')">
                    <DatePicker :value="formValidate.found_time" format="yyyy-MM-dd" @on-change="formValidate.found_time = $event" type="date" :placeholder="$t('lang.lang_pleaseEnter') +$t('lang.lang_company')+ $t('companySetUp.setUp_establishmentTime')" style="width: 430px"></DatePicker>
                </FormItem>
                <FormItem :label="$t('companySetUp.setUp_companySize')">
                    <Select v-model="formValidate.size" style="width:430px" :placeholder="$t('lang.lang_pleaseSelect') + $t('companySetUp.setUp_companySize')">
                        <Option v-for="(item,index) in companySize" :value="item.value" :key="index">{{item.lable}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('companySetUp.setUp_goodAtField')">
                    <ul class="fieldBox">
                        <li class="field" v-for="(item,index) in fieldList" :key="index"
                            :class="{'fieldActive':item.active}"
                            @click="changeField(item,index)" >{{item.name}}</li>
                    </ul>
                </FormItem>

                <FormItem :label="$t('companySetUp.setUp_companyIntroduction')" prop="summary">
                    <Input type="textarea" v-model="formValidate.summary" style="width:430px;" :autosize="{minRows: 9,maxRows: 9}" :maxlength="250" :placeholder="$t('lang.lang_pleaseEnter') + $t('companySetUp.setUp_companyIntroduction')" @keyup.native="calculationWords()"></Input>
                    <label class="enter-desc-counts" style=" font-size: 12px;position: absolute;bottom: -3px;left: 363px;"><a>{{enterWordCount}}</a><span>/</span><a>250</a></label>
                </FormItem>
            </div>
            <p class="title" style="margin-top:40px;">{{$t('companySetUp.setUp_contactInformation')}}</p>
            <div class='content'>
                <FormItem :label="$t('companySetUp.setUp_contacts')">
                    <!-- <Input v-model="formValidate.contact_people" style="width:430px;" placeholder="请输入联系人"></Input> -->
                    <Select v-model="formValidate.contact_people" style="width:430px" :placeholder="$t('lang.lang_pleaseSelect') + $t('companySetUp.setUp_contacts')" @on-change='chooseContacts'>
                        <Option v-if='contactPerson && contactPerson.length>0' v-for="(item,index) in contactPerson" :value="item.user_id" :key="index">{{item.realname}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('companySetUp.setUp_contactNumber')">
                    <Input v-model="formValidate.tel" style="width:430px;" :placeholder="$t('lang.lang_pleaseSelect') + $t('companySetUp.setUp_contactNumber')"></Input>
                </FormItem>
                <FormItem :label="$t('companySetUp.setUp_companyAddress')">
                    <Input v-model="formValidate.address" style="width:430px;" :placeholder="$t('lang.lang_pleaseSelect') + $t('companySetUp.setUp_companyAddress')"></Input>
                </FormItem>
                <FormItem :label="$t('companySetUp.setUp_companyHomepage')">
                    <Input v-model="formValidate.homepage" style="width:430px;" :placeholder="$t('companySetUp.setUp_companyHomepage') + $t('companySetUp.setUp_address')"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">{{$t('lang.lang_save')}}</Button>
                </FormItem>

            </div>

        </Form>
    </div>

</template>


<script>
import api from "api";
import vUpload from "@/components/upload";

export default {
  created() {
    this.init();
    this.getconfirmInfo();
  },
  mounted() {
    this.getContactPerson();
  },
  data() {
    return {
      fieldList: [],
      formValidate: {
        name: "",
        logo: "",
        type_name: "",
        found_time: "",
        size: "",
        summary: "",
        contact_people: "",
        tel: "",
        address: ""
      },
      isAttestation: false, //公司是否认证
      ruleInline: {
        //                    summary: [
        //                        {required: true, message: 'Please select gender', trigger: 'change'}
        //                    ],
      },
      fileShow: true, // 文件上传
      readonly: true,
      enterWordCount: 0,
      companySize: [
        { lable: "0-50人", value: 1 },
        { lable: "51-100人", value: 2 },
        { lable: "100人以上", value: 3 }
      ],
      contactPerson: null // 联系人
    };
  },
  methods: {
    // 获取联系人
    async getContactPerson() {
      let { data } = await api.memberList();
      if (data.err_code == 0) {
        this.contactPerson = data.data;
      }
    },
    // 选择联系人
    chooseContacts(value) {
      if(this.contactPerson && this.contactPerson.length>0){
        this.contactPerson.forEach(element => {
          if (element.user_id === value) {
            this.formValidate.tel = element.phone;
          }
        });
      }

    },
    // 获取公司信息
    async init() {
      let { data } = await api.getCompanyInfo();
      if (data.err_code === 0) {
        this.formValidate = data.data;
        this.contractAbilityList();
      } else {
        this.$Message.error(data.err_message);
      }
      this.enterWordCount = this.formValidate.summary.length;
    },
    // 公司信息
    async getconfirmInfo() {
      let { data } = await api.getconfirmInfo();
      if (data.err_code === 0) {
        // 公司已认证
        this.isAttestation = true;
      } else {
        // 公司设置 》 基本资料 》 取消认证提示
        // this.$Message.warning(data.err_message);
      }
    },
    async contractAbilityList() {
      let { data } = await api.contractAbilityList();
      if (data.err_code === 0 && data.data) {
        if (this.formValidate.ability) {
          this.formValidate.ability.map(items => {
            data.data.map(item => {
              if (item.id == items) {
                this.$set(item, "active", true);
              }
            });
          });
        }
        this.fieldList = data.data;
      }
    },
    // 修改公司信息 // 公司名称和公司类型无法修改
    async updateInfo() {
      // 公司认证后不能修改name
      let field = this.fieldList
        .filter(item => item.active)
        .map(item => item.id)
        .join(",");
      this.formValidate.ability_id = field === "" ? -1 : field;
      let objForm = { ...this.formValidate };

      if (this.isAttestation) {
        delete objForm.name;
      }
      let { data } = await api.updateCompanyInfo(objForm);
      if (data.err_code === 0) {
        this.$Message.success(i18n.t('companySetUp.setUp_saveSuccessfully'));
      } else {
        this.$Message.error(data.err_message);
      }
    },
    //上传成功回调
    FileUploadedSuccess(data) {
      this.uploadImgStatus = true;
      this.fileShow = true;
      if (data.response) {
        this.formValidate.logo = JSON.parse(data.response).file_url;
      }
    },
    UploadProgress(uploader) {
      this.fileShow = true;
      if (uploader.files.length > 1) {
        this.$Message.error(i18n.t('companySetUp.setUp_onlyUpload'));
      } else {
        this.$Message.success(i18n.t('companySetUp.setUp_uploadSuccess'));
      }
    },
    // 提交
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.updateInfo();
        } else {
          this.$Message.error(i18n.t('companySetUp.setUp_improveAndPerfect'));
        }
      });
    },
    // 清空
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // 公司简介最多输入字数
    calculationWords() {
      // this.enterWordCount = this.formValidate.summary ? this.formValidate.summary.length : 0;
      this.enterWordCount = this.formValidate.summary.length;
    },
    // 修改领域id
    changeField(item, index) {
      this.$set(item, "active", !item.active);
    }
  },
  computed: {
    uploadId() {
      return "upload" + Math.random();
    }
  },
  components: {
    vUpload
  }
};
</script>

<style lang="less" scoped>
.basicInformationContainer {
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
  .fromInfoContainer {
    height: auto;
    padding: 40px 0 15px 80px;
    .title {
      margin-bottom: 25px;
      padding-right: 23px;
      font-size: 16px;
      color: @black_2;
    }
    .content {
      .ivu-form-item {
        margin-bottom: 24px;
        // height: 40px;
        line-height: 40px;
        .ivu-form-item-content {
          margin-bottom: 60px;
          .ivu-btn {
            padding: 0 40px;
          }
        }
      }
      .sign {
        display: block;
        padding: 4px;
        background: #3bceb6;
        color: #fff;
        font-size: 12px !important;
        border-radius: 4px;
      }
      .fieldBox {
        display: flex;
        width: 430px;
        justify-content: space-between;
        flex-wrap: wrap;
        .field {
          min-width: 80px;
          margin: 5px;
          text-align: center;
          border-radius: 6px;
          color: #bdbdbd;
          transition: all 0.3s;
          cursor: pointer;
        }
        .fieldActive {
          color: @base;
          background: #ccf2ec;
        }
      }
    }
    .upload {
      position: relative;
      width: 160px;
      height: 160px;
      .uploadBrowse {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
      .uploadButton {
        width: 100%;
        height: 100%;
        text-align: center;
        cursor: pointer;
        position: absolute;
        top: 0px;
        overflow: hidden;
        opacity: 1;
        text-align: center;
        background: @baseboard;
        .uploadIconBox {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
        }
      }
      .filesList {
        margin-bottom: 150px;
      }
    }
    .image {
      max-width: 160px;
      max-height: 160px;
      display: block;
    }
  }
}
</style>
<style lang="less" >
.basicInformationContainer {
  .fromInfoContainer {
    .ivu-form,
    .ivu-form-item-label {
      font-size: 12px;
      color: #bdbdbd !important;
    }
    .ivu-form-item-label {
      height: 40px;
      font-size: 13px;
      padding: 15px 22px 12px 0;
      color: rgb(195, 203, 214) !important;
    }
    .ivu-input {
      font-size: 13px;
    }
    .ivu-input-group-append {
      background: #fff;
      color: #fb3838;
      .sign {
        display: block;
        padding: 4px;
        background: @white;
        color: #fff;
        font-size: 12px !important;
        border-radius: 4px;
      }
    }
    .ivu-input-group > .ivu-input:not(:first-child):not(:last-child) {
      border-right: none;
    }
  }
}
</style>
