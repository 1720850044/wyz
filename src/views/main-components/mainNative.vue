<template>
    <!--<div class="main-haeder-native">-->
        <!--<slot></slot>-->
    <!--</div>-->
</template>

<script>
    export default {
        name: "main-native"
    };
</script>

<style lang="less">
    .main-haeder-native{
        display: flex;
        position: absolute;
        top: 0;
        left: 210px;
        height: 52px;
        font-size: 15px !important;
        z-index: 999;
        align-items: flex-end;
        .main-header-style{
            .main-header-title{
                // border-bottom: 2px solid @base;
                // padding-bottom: 15px;
                min-width: 100px;
                text-align: center;
                display: inline-block;
                color:@black_2;
                cursor: pointer;
                div{
                    width:100px;
                    height:2px;
                    margin: 12px auto 0px auto;
                    animation:open 0.3s;
                    background:@base;
                }
                @keyframes open{
                    from  {width:0px;}
                    to    {width:100px;}
                }
            }
        }
        // 导航这里上面用的span下面用的li，这里应该统一
        .setMenuList{
            li {
                min-width: 100px;
                text-align: center;
                float: left;
                display: inline-block;
                margin-right: 15px;
                font-size: 15px;
                color: @black_3;
                cursor: pointer;
                div{
                    width:0px;
                    height:2px;
                    margin: 12px auto 0px auto;
                    background:@base;
                }
                &.checked{
                    color: @black_2 !important;
                    div{
                        transition:all 0.3s ease;
                        width:100px;
                    }
                }
            }
        }
        .nativeItems{
            a {
                display: inline-block;
                padding-bottom: 10px;
                border-bottom: 2px solid transparent;
                margin: 0 15px;
                font-size: 15px;
                cursor: pointer;
                color: @black_2;
                width: 70px;
                text-align: center;
                &.router-link-active{
                    color: @base !important;
                    border-bottom: 2px solid @base!important;
                }
            }
        }
    }
</style>
