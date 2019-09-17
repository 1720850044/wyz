<template>
    <div class="begood">
        <Select v-model="chooseModel" @on-change='selectResullt' :placeholder='seceleJob' class="begood-select">
            <Option v-for="(item,index) in beGoodList" :value="JSON.stringify(item)" :key="index">{{ item.name}}</Option>
        </Select>
    </div>
</template>
<script>
import api from "api";
export default {
    data() {
        return {
            chooseModel: "",
            beGoodList: [],
            seceleJob: null,
        };
    },
    props: {
        job: {
            type: Object
        },
    },
    watch: {
        job(val){
            if (val.job){
                this.$nextTick(() => {
                    this.seceleJob = val.job;
                });
            } else {
                this.seceleJob = '请选择擅您的擅长能力';
            }
        }
    },
    created() {
        this.getBegoodAt();
    
    },
    methods: {
        async getBegoodAt() {
            let { data } = await api.beGoodAtFun();
            if (data.err_code == 0) {
                this.beGoodList = data.data;
            } else {
                this.$Message.error(data.err_message);
            }
        },
    // 下拉选择
        selectResullt(value) {
      // this.seceleJob = JSON.parse(value).name;
            this.$emit("ReceiveData", JSON.parse(value));
        }
    }
};
</script>
<style lang="less">
.begood{
  width: 100%;
  height: auto;
  .begood-select{
    .ivu-select-selection{
      .ivu-select-placeholder{
        color: #616161 !important;
      }

    }
  }
}
</style>
