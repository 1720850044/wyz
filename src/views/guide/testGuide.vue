<template>
  <div id="box" v-if="power">
    <!-- 设置 -->
    <div v-if="isShow === 'c5_7.1'&&stateNum ==0" class="stepA">
      <img src="https://yhc-static.oss-cn-shanghai.aliyuncs.com/guide/1.png?x-oss-process=style/lim">
      <p class="next" @click="nextStep('c5_7.1')">我知道了</p>
    </div>
    <div v-if="isShow === 'c5_7.1'&&stateNum ==1" class="stepB">
      <img src="https://yhc-static.oss-cn-shanghai.aliyuncs.com/guide/2.png?x-oss-process=style/lim">
      <p class="next" @click="nextStep('c5_7.1')">我知道了</p>
    </div>
    <div v-if="isShow === 'c5_7.1'&&stateNum ==2" class="stepC">
      <img src="https://yhc-static.oss-cn-shanghai.aliyuncs.com/guide/3.png?x-oss-process=style/lim">
      <p class="next" @click="nextStep('c5_7.1')">我知道了</p>
    </div>
    <!-- 项目成员设置 -->
    <div v-if="isShow === 'c5_5'&&stateNum ==0" class="stepM">
      <img src="https://yhc-static.oss-cn-shanghai.aliyuncs.com/guide/4.png?x-oss-process=style/lim">
      <p class="next" @click="nextStep('c5_5')">我知道了</p>
    </div>
    <!-- 任务管理 -->
    <div v-if="isShow === 'c5_3'&&stateNum ==0" class="stepD">
      <img src="https://yhc-static.oss-cn-shanghai.aliyuncs.com/guide/5.png?x-oss-process=style/lim">
      <p class="next" @click="nextStep('c5_3')">我知道了</p>
    </div>
    <div v-if="isShow === 'c5_3'&&stateNum ==1" class="stepE">
      <img src="https://yhc-static.oss-cn-shanghai.aliyuncs.com/guide/6.png?x-oss-process=style/lim">
      <p class="next" @click="nextStep('c5_3')">我知道了</p>
    </div>
    <div v-if="isShow === 'c5_3'&&stateNum ==2" class="stepF">
      <img src="https://yhc-static.oss-cn-shanghai.aliyuncs.com/guide/7.png?x-oss-process=style/lim">
      <p class="next" @click="nextStep('c5_3')">我知道了</p>
    </div>
    <!-- 资源管理 -->
    <div v-else-if="isShow=='c5_4'&&stateNum ==0" class="stepK">
      <img src="https://yhc-static.oss-cn-shanghai.aliyuncs.com/guide/11.png?x-oss-process=style/lim">
      <p class="next" @click="nextStep('c5_4')">我知道了</p>
    </div>
    <div v-else-if="isShow=='c5_4'&&stateNum ==1" class="stepL">
      <img src="https://yhc-static.oss-cn-shanghai.aliyuncs.com/guide/12.png?x-oss-process=style/lim">
      <p class="next" @click="nextStep('c5_4')">我知道了</p>
    </div>
  </div>


</template>
<script>
import api from "api";
import config from "../../../build/config";
export default {
    mounted() {
        this.initGuide();
    },
    props: ["array"],
    data() {
        return {
            isShow: false,
            power: null,
            guide_message: null,
            stateNum: 0
        };
    },
    methods: {
        initGuide() {

            localStorage.getItem("page_guide"); //获取名称为“page_guide”的值
            this.guide_message = JSON.parse(localStorage.getItem("page_guide"));
            for (let item in this.guide_message) {
                if (item === this.array[0]) {
                    this.power = this.guide_message[item];
                }
            }
            this.isShow = this.array[0];
        },
        async nextStep(type) {
            if (type === this.array[0]) {
                this.stateNum++;
            }
            if (type === "c5_7.1" && this.stateNum == 3) {
                this.getAgainMeg();
                this.power = null;
                let { data } = await api.updateGuideState({
                    page: "c5_7.1"
                });
            } else if (type === "c5_3" && this.stateNum == 3) {
                this.getAgainMeg();
                this.power = null;
                let { data } = await api.updateGuideState({
                    page: "c5_3"
                });
            } else if (type === "c5_4" && this.stateNum == 2) {
                this.getAgainMeg();
                this.power = null;
                let { data } = await api.updateGuideState({
                    page: "c5_4"
                });
            } else if (type === "c5_5" && this.stateNum == 1) {
                this.getAgainMeg();
                this.power = null;
                let { data } = await api.updateGuideState({
                    page: "c5_5"
                });
            }
        },
    // 再次获取存储引导后的信息
        getAgainMeg() {
            this.$axios
        .get(this.GLOBAL.baseRouter+this.$GLOBALAPI.system_info)
        .then(res => res.data)
        .then(res => {
            localStorage.setItem("page_guide", JSON.stringify(res.page_guide)); ////以“page_guide”为名称存储一个值
        });
        }
    }
};
</script>
<style scoped>
.next {
  position: absolute;
  width: 110px;
  height: 50px;
  /* background-color: red; */
  opacity: 0;
  cursor: pointer;
  text-align: center;
  line-height: 50px;
}

#box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

#box img {
  width: 100%;
  height: 100%;
}
#box div {
  height: 100%;
}
.stepA .next {
  top: 57.6%;
  left: 44.6%;
}

.stepB .next {
  top: 77.5%;
  left: 24.6%;
}

.stepC .next {
  top: 56.8%;
  right: 31.2%;
}

.stepD .next {
  top: 65.91%;
  right: 56.6%;
}

.stepE .next {
  top: 61.96%;
  left: 24.65%;
}

.stepF .next {
  top: 46.8%;
  left: 50.39%;
}

.stepK .next {
  top: 44.1%;
  left: 28.99%;
}

.stepL .next {
  top: 45.9%;
  left: 43.19%;
}
.stepM .next {
  top: 64.8%;
  right: 18.8%;
}
</style>
