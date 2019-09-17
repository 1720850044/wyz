<template>
    <div class="loading-content">
        <span class="loading-area">
            <Icon type="load-a" class="loading-icon"></Icon>
            <label class="loading-text">加载中</label>
        </span>
    </div>
</template>

<script>
    export default {
        name: "loading"
    };
</script>

<style lang="less" scoped>
    .loading-content {
        position: relative;
        width: 100%;
        height: 100%;
        background: #fff;
        .loading-area {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            width: 60px;
            height: 60px;
            text-align: center;
            .loading-icon {
                margin: 0 auto;
                font-size: 46px;
                color: @base;
                animation: 2s linear infinite loadingRotate;
                -webkit-animation: 2s linear infinite loadingRotate ;
            }
            .loading-text {
                display: block;
                color: #999;
                margin: 5px 0 0;
                font-size: 14px;
            }
        }
    }
    @keyframes loadingRotate{
        form {transform:rotate(0deg);}
        to     {transform:rotate(360deg);}
    }
    /* Safari and Chrome */
    @-webkit-keyframes loadingRotate{
        form {transform:rotate(0deg);}
        to     {transform:rotate(360deg);}
    }
</style>
