<template>
  <div>招投标管理</div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    created() {
        let title = "正在开发中";
        let content = '<p>程序小哥哥正在努力开发中</p><p>敬请期待后续内容！</p>';
        this.$Modal.warning({
            title: title,
            content: content
        });
    }
};
</script>

<style lang="less">

</style>
