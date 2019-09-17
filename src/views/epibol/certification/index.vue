<template>
    <div class="companyInformation">
        <ul class="navList">
            <li v-for="(item,index) in navList"  :key="index" v-if="index==0 || index>3" @click="changeNav(index)" :class="{'navActive':currentNav === index}">
              {{item}}
            </li>
        </ul>
        <section class="infoList">
            <keep-alive>
                <!--暂时隐藏部分栏目 别删除-->
                <!-- <basic-information v-if="currentNav === 0"></basic-information>
                <company-certification v-if="currentNav === 1"></company-certification>
                <company-signature v-if="currentNav === 2" ></company-signature>
                <company-contract ref="contract"  :pageType="currentNav === 2?1:0" v-if="currentNav === 2||currentNav === 3" :key="currentNav"></company-contract>
                <pricing-assistant v-if="currentNav === 4"></pricing-assistant> -->
                <basic-information v-if="currentNav === 0"></basic-information>
                <company-certification v-if="currentNav === 1"></company-certification>
                <company-signature v-if="currentNav === 2" ></company-signature>
                <company-contract ref="contract"  :pageType="currentNav === 2?1:0" v-if="currentNav === 3||currentNav === 4" :key="currentNav"></company-contract>
                <pricing-assistant v-if="currentNav === 5"></pricing-assistant>
            </keep-alive>
            <company-agent  ref="agent" v-if="currentNav === 3" ></company-agent>
        </section>
    </div>
</template>

<script>
import companyCertification from "./companyCertification"; // 企业认证
import companySignature from "./companySignature"; // 电子签名
import companyContract from "./companyContract"; // currentNav === 2 签章人 currentNav === 3 经办人
import basicInformation from "./basicInformation"; // 基本信息
import pricingAssistant from "./pricingAssistant"; // 定价助手
export default {
    name: "companyInformation",
    created() {},
    mounted() {
        this.noticeNav();
    },
    data() {
        return {
            currentNav: 0,
      //暂时隐藏企业认证
            navList: ["基本资料", "企业认证", "电子签名", "签章人", "经办人", "定价助手"]
        };
    },
    methods: {
        noticeNav(){
            if (this.$route.query){
                if (this.$route.query.type === 1){
                    this.currentNav = 4;
                }
            }
        },
        changeNav(index) {
            this.currentNav = index;
        }
    },
    computed: {},
    components: {
        companyCertification,
        companySignature,
        companyContract,
        basicInformation,
        pricingAssistant
    }
};
</script>

<style lang="less" scoped>
.companyInformation {
  width: 100%;
   min-height: 100%;
  display: flex;
  .navList {
    .base-card;
    min-width: 360px;
    max-width: 360px;
    // height: 260px;
    margin-right: 30px;
    li {
      height: 44px;
      padding-left: 46px;
      line-height: 44px;
      color: @black_3;
      font-size: 13px;
      cursor: pointer;
    }
    .navActive {
      font-size: 13px;
      color: @black_2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background: rgb(204, 242, 236);
    }
  }
  .infoList {
    padding: 0 !important;
    flex: 1;
    .base-card;
    margin-bottom: 15px;

  }
}
</style>
