<template>
    <div class="loading-container">
        <label>
            <span></span>
            <p>正在加载<span>...</span></p>
        </label>
    </div>
</template>
<script>

</script>
<style lang="less" scoped>
    // New loading
    .loading-container {
        width: 100%;
        height: 100%;
        background: @baseboard;
        position: relative;
        z-index: 6;
        > label {
            position: absolute;
            display: block;
            width: 125px;
            height: 150px;
            margin: auto;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            text-align: center;
            > span {
                display: block;
                width: 125px;
                height: 105px;
                background: url("../../../assets/images/loading-icon.png") no-repeat center / contain;
            }
            > p {
                font-size: 14px;
                color: @baseFont;
                margin-top: 15px;
            }
        }
    }
</style>
