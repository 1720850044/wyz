<template>
    <div class="routerLinkDiv">
        <slot name="linkList"></slot>
    </div>
</template>

<script>
    export default {
        name: "router-link",
    };
</script>

<style lang="less" scoped>
    .routerLinkDiv{
        display: inline-block;
        .linkTab{
            display: flex;
            margin-bottom: 5px;
            border-right: 6px;
            background: #e6e9ea;
            li {
                min-width: 86px;
                height: 32px;
                margin: 2px;
                line-height: 32px;
                text-align: center;
                color: @black_3;
                &.router-link-active{
                    background: #fff;
                    color: @base;
                }
            }
        }
    }
</style>
