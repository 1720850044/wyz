<template>
    <div class="page-loading"></div>
</template>

<script>
    export default {
        name: "pageLoading"
    };
</script>

<style lang="less" scoped>
    .page-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        z-index: 999999999;
    }
</style>
