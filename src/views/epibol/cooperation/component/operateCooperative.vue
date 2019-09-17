<template>
    <div class="addCoop">
        <dl>
            <dt>公司名称</dt>
            <dd>
                <Input v-model="company" placeholder="输入公司名称" :disabled="isEditer" @keyup.13.native="searchCompany($event)" @on-blur="searchCompany">
                </Input>
            </dd>
        </dl>
        <!-- <dl>
            <dt>联系人</dt>
            <dd>
                <Input v-model="contactPeople"></Input>
            </dd>
        </dl>
        <dl>
            <dt>联系电话</dt>
            <dd>
                <Input v-model="tel"></Input>
            </dd>
        </dl>
        <dl>
            <dt>备注说明</dt>
            <dd>
                <Input v-model="explain" type="text" placeholder="备注说明.."></Input>
            </dd>
        </dl> -->
    </div>
</template>
<script>
import { cooperationAide } from "api";
export default {
  data() {
    return {
      companyID: null, //公司ID
      company: null, // 公司名称
      contactPeople: "", // 联系人
      tel: "", // 联系电话
      explain: "", //备注说明
      Tid: null,
      isEditer: false // 公司名称是否可编辑
    };
  },
  mounted() {
    // 新增服务商
    this.$bus.on("newAddCompanyFlag", () => {
      this.isEditer = false;
      this.clearData();
    });
    // 编辑服务商
    this.$bus.on("editCoopData", val => {
      this.isEditer = true;
      this.Tid = val.id;
      this.company = val.company;
      this.contactPeople = val.contact_people;
      this.tel = val.tel;
      this.explain = val.description;
      this.addLabDIV = false;
    });
  },
  methods: {
    // 清空数据
    clearData() {
      this.companyID = null;
      this.company = null;
    //   this.contactPeople = "";
    //   this.tel = "";
    //   this.explain = "";
    },
    editCoop() {
      let obj = {
        Tid: this.Tid,
        companyID: this.companyID,
        company: this.company,
        contactPeople: this.contactPeople,
        tel: this.tel,
        explain: this.explain
      };
      this.$bus.emit("emitCoopData", obj);
    },
    // 搜索公司
    async searchCompany(e) {
      let params = {
        company_name: this.company
      };
      let { data } = await cooperationAide.searchCompany(params);
      if (this.company == null || this.company == "") {
        return;
      }
      if (data.err_code == 0) {
        if (data.company == undefined) {
          this.$Message.error("公司名称不正确!");
        } else {
          this.companyID = data.id;
          this.editCoop();
          // this.company = data.company;
          // this.contactPeople = data.contact_people;
          // this.tel = data.tel;
        }
      }
    }
  },
  updated() {
    this.editCoop();
  }
};
</script>
<style lang="less" scoped>
@import "../../../customer/epibolCompany/style/epibolCompany.less";
</style>
