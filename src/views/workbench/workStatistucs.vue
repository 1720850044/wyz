<template>
    <div class="workStatistucs">
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
        </main-native>
        <div class="content">
            <div class="MytaskList">
                <mytaskList></mytaskList>
            </div>
            <div class="taskEchart">
                <tasktrend></tasktrend>
                <speedtrend></speedtrend>
                <qualitytrend></qualitytrend>
            </div>
        </div>
    </div>
</template>

<script>
    import mainNative from '../main-components/mainNative.vue';
    import mytaskList from './member/mytasklist.vue';
    import tasktrend from './member/task.vue';
    import speedtrend from './member/speed.vue';
    import qualitytrend from './member/quality.vue';

    export default {
        name: "works-statistucs",
        components: {
            mainNative,
            mytaskList,
            tasktrend,
            speedtrend,
            qualitytrend
        }
    };
</script>

<style lang="less">
    .workStatistucs{
        .content{
            /*display: flex;*/
            /*justify-content: space-between;*/
            .MytaskList{
                float: left;
                width: 34%;
                background: @white;
                /*padding: 20px;*/
            }
            .taskEchart{
                float: right;
                width: 65%;
                #RtaskTJDiv{
                    .base-card;
                    background: @white;
                    /*border: 1px solid #efefef;*/
                    margin-bottom: 15px;
                    .taskTongji{
                        display: flex;
                        justify-content: space-between;
                        span{
                            font-size: 15px;
                        }
                        button{
                            border: 0;
                            float: left;
                            padding: 2px 10px;
                            cursor: pointer;
                            color: @white;
                            border-radius: 2px;
                            outline: none;
                            background: @black_4;
                            &.creentTabSty{
                                background: @base !important;
                                color: @white;
                            };
                        }

                    }
                    .TaskTrend{width: 100%;height: 220px}
                }
            }
        }
    }


</style>
