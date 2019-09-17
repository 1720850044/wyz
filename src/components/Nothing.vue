<template>
    <div class="NoThink">
        <div v-if="type=='project'" class="NothinkPublicStyle NoProject"><img src="../assets/images/NoProject.png"/><span>{{text || '暂无项目'}}</span></div>
        <div v-if="type=='task'" class="NothinkPublicStyle NoTask"><img src="../assets/images/NoTask.png"/><span>{{text || '暂无任务'}}</span></div>
        <div v-if="type=='feedback'" class="NothinkPublicStyle NoFeedBack"><img src="../assets/images/NoFeedBack.png"/><span>{{text || '暂无反馈'}}</span></div>
        <div v-if="type=='company'" class="NothinkPublicStyle NoCompany"><img src="../assets/images/NoProject.png"/><span>{{text || '暂无公司'}}</span></div>
    </div>
</template>

<script>
    export default {
        name: 'no-think',
        props: ['type', 'text']
    };
</script>

<style lang="less" scoped>
    .NoThink{
        width: 100%;height: 100%;background: #fff;border-radius: 3px;position: absolute;top: 0;bottom: 0;
        .NothinkPublicStyle{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            letter-spacing: 5px;
        }

    }
</style>
