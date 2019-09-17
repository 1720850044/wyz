<template>
    <div class="personalSettings">
      <!-- 左侧隐藏及调整 -->
        <!-- <ul class="navList">
            <li v-for="(item,index) in navList" :key="index" @click="changeNav(index)" :class="{'navActive':currentNav === index}">{{item}}
            </li>
        </ul> -->

        <section class="infoList">
            <div>
                <personal-data v-if="currentNav === 0"></personal-data>
                <!-- <authentication v-if="currentNav === 1"></authentication>
                <electronic-signature v-if="currentNav === 2"></electronic-signature> -->
            </div>
        </section>

    </div>
</template>

<script>
import "../cropper.min.css";
import personalData from "./personalData.vue"; //个人资料
import authentication from "./authentication.vue"; //实名认证
import electronicSignature from "./electronicSignature.vue"; //电子签名
export default {
    name: "personalSettings",
    data() {
        return {
            currentNav: 0,

            navList: ["个人资料"]
      // navList: ["个人资料", "实名认证", "电子签名"]
        };
    },
    components: {
        personalData,
        authentication,
        electronicSignature
    },
    created() {},
    methods: {
        changeNav({index}) {
            this.currentNav = index;
        }
    }
};
</script>

<style lang="less" scoped >
.personalSettings {
  height: 100%;
  display: flex;
  .navList {
    min-width: 360px;
    height: 190px;
    padding: 28px;
    margin-right: 30px;
    background: #fff;
    border-radius: 4px;

    box-shadow: @boxShadow;

    li {
      height: 44px;
      padding-left: 46px;
      line-height: 44px;
      color: #777777;
      font-size: 13px;
      cursor: pointer;
    }
    .navActive {
      font-size: 13px;
      color: #777777;
      background: #ccf2ec;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
  .infoList {
    flex: 1;
    // background: #fff;
    // border-radius: 4px;
    box-shadow: @boxShadow;
  }
}
</style>

