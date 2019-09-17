<!-- 浏览任务弹窗-->
<template>
    <div class="browsetaskpop">
        <div class="taskbrowse">
            <maintask ref="browse"></maintask>
        </div>
        <div class="filebrowse">
            <filebrowse ref="filebrowse"></filebrowse>
        </div>
    </div>
</template>
<script>
    import maintask from "./taskDetails";
    import filebrowse from "../components/fileBrowseManager.vue";

    export default {
        components: {
            maintask,
            filebrowse
        },
        data() {
            return {
                taskData: {}
            };
        },
        mounted() {
        },
        methods: {
            initBrowseTaskPop(taskId, taskfileType) {
                this.$refs.browse.initTaskDetailFromID(taskId);
                this.$refs.filebrowse.initFileBrowse(taskId, taskfileType);
            },
            //设置能否编辑
            setEditDisabled(forbidEdit) {
                this.$refs.browse.setEditDisabled(forbidEdit);
            },
            loadfileSucceed() {

            }
        }
    };
</script>
<style>
    .browsetaskpop {
        display: inline-block;
        width: 100%;
        overflow: hidden;
    }

    .taskbrowse {
        float: left;
        width: 340px;
        margin: 0 12px 0 0;
    }

    .filebrowse {
        float: left;
        width: 800px;
    }
</style>
