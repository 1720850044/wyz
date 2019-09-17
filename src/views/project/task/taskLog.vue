<!-- 任务日志组件 -->
<template>
    <div class="logContainer" >
        <Timeline>
            <TimelineItem v-for="(item,index) in taskLogData" :key="index">
                <p style="color: #929292">
                    <span>{{item.nickname}}</span>
                    <span style="margin-left: 20px">{{item.time}}</span>
                </p>
                <p style="margin-top: 5px;color: #3cd2b4 ">{{ item.text }}</p>
            </TimelineItem>
        </Timeline>
    </div>
</template>
<script>
export default {
    props: {
        taskInfos: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },
    data() {
        return {
            taskLogData: this.taskInfos.log
        };
    },
    watch: {
        taskInfos(val){
            this.taskLogData = val.log;
        }
    }
};
</script>
<style lang="less" scroll >
    .logContainer{
        height: 650px;
        overflow-y: auto;
        margin-top: 20px;
    }
</style>
