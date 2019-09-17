<!-- 子任务组件 -->
<template>
    <div class="subtask">
        <div style="text-align: right">
            <span v-if="initData.project_child_add == 1" class="addTask" @click="addChildTask">
                <Icon style="margin-right: 8px;color: #48c5b5;margin-bottom: 4px;vertical-align: middle" size="20" type="ios-plus-outline"></Icon>{{$t('project.pro_addSubtask')}}
            </span>
        </div>
        <!--列表-->
        <tasklist subtask="true" ref="list" :taskInfos="taskInfos" @editChildTask="editChildTask"></tasklist>
        <!--新增任务组件-->
        <Modal v-model="showFlag" width="600" class="taskModel taskAddModel" :title='modalTitle' @on-ok="saveAccretionTaskPop">
            <formDetails ref="formData" :taskInfos="editTaskData" type="childTask" @refreshChildTaskList='refreshChildTaskList'></formDetails>
        </Modal>
    </div>
</template>
<script>
    import formDetails from "./taskDetails";
    import tasklist from "./taskInfoPop/subtasksList";
    import {taskDetail} from 'api';

    export default {
        props: {
            taskInfos: {
                type: Object,
                default: function () {
                    return {

                    };
                }
            },
            initData: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        data() {
            return {
                //重构
                showFlag: false,
                modalTitle: i18n.t('project.pro_newSubtask'),
                actionType: false,
                editTaskData: this.taskInfos
            };
        },
        methods: {
            //显示新建子任务弹窗
            addChildTask(){
                this.editTaskData = {
                    file: []
                };
                this.actionType = false;
                this.modalTitle = i18n.t('project.pro_newSubtask');
                this.showFlag = true;
            },
            //关闭弹窗并刷新子任务列表
            refreshChildTaskList(){
                this.showFlag = false;
                this.$refs.list.listInit();
            },
            //显示弹窗编辑子任务
            editChildTask(item){
                this.actionType = true;
                this.modalTitle = i18n.t('project.pro_editSubtask');
                this.showFlag = true;
                this.getChildTaskDetails(item);
            },
            //获取子任务详情
            async getChildTaskDetails(item){
                let {data} = await taskDetail.getTaskData({id: item.id});
                if (data.err_code == 0){
                    this.editTaskData = data;
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            // 添加
            saveAccretionTaskPop() {

                /*
                * type  控制 新建子任务 还是 编辑子任务
                * false 新建
                * true  编辑
                * */
                let type = this.actionType;
                this.$refs.formData.saveTaskDetails(type, this.taskInfos.id);
            },
        },
        components: {
            formDetails,
            tasklist,
        }
    };
</script>
<style lang="less">
    .subtask {
        margin-top: 20px;
        .addTask {
            font-size: 13px;
            color: @fontColor;
            cursor: pointer;
        }
    }
</style>
