<template>
    <div class="td-loading-container">
        <div class="percent-container">
            <div class="load-total-percent">
                <div class="loaded-percent" :style="{'width': loadedParams.loadedPercent + '%'}"></div>
            </div>
            <p>{{loadingText}}<span>...</span></p>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            loadedParams: {
                type: Object,
                default: () => ({
                    loadedPercent: 5
                })
            }
        },
        data () {
            return {
                loadingText: '正在努力加载中'
            };
        }
    };
</script>
<style lang="less" scoped>
    // New loading
    .td-loading-container {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(58, 58, 58, 0.58);
        z-index: 998;
        > .percent-container {
            position: absolute;
            display: block;
            width: 325px;
            height: 80px;
            margin: auto;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            text-align: center;
            > .load-total-percent {
                position: relative;
                display: block;
                width: 100%;
                height: 10px;
                background: #fff;
                border: 1px solid #eee;
                -webkit-border-radius: 8px;
                -moz-border-radius: 8px;
                border-radius: 8px;
                > .loaded-percent {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 180px;
                    height: 8px;
                    background: linear-gradient(to right, #38f3ce, #3cd2b4);
                    -webkit-border-radius: 8px;
                    -moz-border-radius: 8px;
                    border-radius: 8px;
                }
            }
            > p {
                font-size: 14px;
                color: #fff;
                margin-top: 15px;
            }
        }
    }
</style>
