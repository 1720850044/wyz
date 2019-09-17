<!-- 新增任务弹窗-->
<template>
    <div>
        <addtask ref="add" :taskInfos="taskInfos"></addtask>
    </div>
</template>
<script>
import addtask from "./taskDetails";
export default {
    props: {
        taskInfos: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },
    components: {
        addtask
    },
    data(){
        return {
            addTaskData: {}
        };
    },
    mounted() {},
    methods: {
        // accretionTaskPop(projectInfo) {
        //     this.$refs.add.initTaskDetailFromNew(projectInfo);
        // },
        //保存所有的任务信息，包含子任务
        saveTaskDetail(type) {
            return this.$refs.add.saveTaskDetails(type);
            // if(id){
            //     //保存父任务
            //     return this.$refs.add.saveTaskDetails(null,id);
            // }else{
            //     return this.$refs.add.saveTaskDetails(null);
            // }
            //保存父任务
            // return true;
        },
        // clearAllData(){
        //     this.$refs.add.clearAllData()
        // }
    }
};
</script>
<style lang="less">
.taskModel {
  /*.ivu-modal-content {*/
    /*.ivu-modal-body {*/
      /*!*margin-top: 10px;*!*/
      /*h1 {*/
        /*background: url("../../../assets/images/headBarBGimg.png") no-repeat;*/
        /*height: 60px;*/
        /*line-height: 60px;*/
        /*border-radius: 4px 4px 0px 0px;*/
        /*font-size: 16px;*/
        /*color: #fff;*/
        /*font-weight: normal;*/
        /*padding-left: 20px;*/
      /*}*/
      /*.taskDetailsContainer {*/
        /*!*padding: 20px 30px 10px 30px;*!*/
        /*.borBotm {*/
          /*// padding: 0;*/
        /*}*/
        /*.ivu-form-item-label {*/
          /*color: #cacaca;*/
        /*}*/
        /*.btn {*/
          /*position: relative;*/
          /*// color: #898989;*/
          /*font-size: 12px;*/
        /*}*/
        /*.shade {*/
          /*// background: @baseboard;*/
          /*border: 0;*/
          /*//  height: 100px;*/
          /*.ivu-icon-android-upload {*/
            /*display: block;*/
            /*font-size: 32px;*/
            /*color: #3bceb6;*/
            /*margin-bottom: -48px;*/
            /*padding-top: 28px;*/
          /*}*/
        /*}*/
        /*.remark-item {*/
          /*height: 62px;*/
          /*.remark {*/
            /*.ivu-input {*/
              /*height: 62px !important;*/
              /*margin-bottom: 0 !important;*/
            /*}*/
          /*}*/
        /*}*/
      /*}*/
    /*}*/
    /*.ivu-modal-footer {*/
      /*border: 0;*/
      /*padding: 10px 30px 20px;*/
      /*.ivu-btn-large {*/
        /*width: 120px;*/
        /*height: 42px;*/
      /*}*/
    /*}*/
  /*}*/
}
</style>
