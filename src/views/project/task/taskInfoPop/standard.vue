<template>
    <!--规范-->
    <div class="taskInfoPopStandardContainer">
        <dl class="standardList">
            <dt class="standardTitle">{{$t('project.pro_basicsNorm')}}</dt>
            <dd v-for="(item,index) in taskInfos.standard" :key="index" class="standardInfo" v-if="item.type === 'progress' || item.type === 'hand' || item.type === 'connect'">
                <span>{{item.name || '--'}}</span>
                <span>{{item.values || '--'}}</span>
            </dd>
        </dl>
        <dl class="standardList">
            <dt class="standardTitle">{{$t('project.pro_processExecutionRegulation')}}</dt>
            <!--阶段-->
            <div style="overflow: auto">
                <ul class="flowChartUl">
                    <li v-for="(item,index) in taskInfos.stage" :class="{'highlight':highlight === index}" class="flowChart" @click="getFlowInfo(item,index)">
                        <span>{{item.stage_name}}</span>
                        <Icon v-if="index !== taskInfos.stage.length-1" type="arrow-right-a"  class="icon"></Icon>
                    </li>
                </ul>
            </div>
            <!--上传-->
            <dd v-if="flowChartText" v-for="(item,index) in flowChartText" :key="index" class="uploadlist ">
                <span>{{item.norm_name || '--'}}</span>
                <div>
                    <span>{{item.text || '--'}}</span>
                    <span class="level" :class="'level'+item.level">{{item.level|level}}</span>
                </div>
            </dd>
        </dl>
        <dl class="standardList">
            <dt class="standardTitle">{{$t('project.pro_fileNormative')}}</dt>
            <!--<template v-if="taskInfos">-->
                <dd v-for="(item,index) in taskInfos.standard" :key="index" class="standardInfo" v-if="item.type === 'file'">
                    <span>{{item.name}}</span>
                    <span>{{item.values}}</span>
                </dd>
            <!--</template>-->

        </dl>
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
                flowChartText: [],
                highlight: 0
            };
        },
        methods: {
            getFlowInfo(item, index) {
                this.highlight = index;
                if (item.require) {
                    this.flowChartText = item.require;
                }
            }
        },
        mounted() {
            this.flowChartText = this.taskInfos.stage[0].require || [];
        },
        filters: {
            level(value){
                if (value === 1){
                    return i18n.t('project.pro_height');
                } else if (value === 2){
                    return i18n.t('lang.lang_mid');
                } else if (value === 3){
                    return i18n.t('lang.lang_low');
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .taskInfoPopStandardContainer {
        height: 90%;
        overflow-y: auto;
        .standardList {
            border-bottom: 1px solid #f2f9f9;
            .standardTitle {
                font-size: 12px;
                color: #9f9f9f;
                margin: 15px 0
            }
            .level {

                color: #fff;
            }
            .level3 {
                background: @red;
            }
            .level2 {
                background: @orange;
            }
            .level1 {
                background: #8c8c8c;
            }
            .standardInfo {
                padding: 8px 10px;
                font-size: 13px;
                color: #b3b3b3;
                background: #f6f8f8;
                display: flex;
                justify-content: space-between;
                border-radius: 3px;
                margin-bottom: 15px;
            }
            .flowChartUl {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                cursor: pointer;
                .highlight{
                    border: 1px solid @base !important;
                    cursor: pointer;
                    .icon{
                        color: @base;
                    }
                }
                .flowChart {
                    list-style: none;
                    position: relative;
                    border: 1px dashed #ccc;
                    padding: 2px 10px;
                    border-radius: 3px;
                    font-size: 13px;
                    margin-left: 35px;
                    flex: none;
                    /*width: 100px;*/
                    text-align: center;
                    &:nth-child(1) {
                        margin-left: 0 !important;
                    }
                    .icon{
                        position: absolute;
                        top: 25%;
                        right: -25px;
                    }
                }
                .current {
                    border: 1px solid #3dcfb7 !important;
                    color: #3dcfb7 !important;
                    i {
                        background: url("../../proStat/image/JT1.png") no-repeat !important;
                    }
                }
            }
            .uploadlist {
                display: flex;
                justify-content: space-between;
                list-style: none;
                background: url("../../proStat/image/circleIcon.png") no-repeat left center;
                padding: 10px 0 10px 10px;
                font-size: 13px;
            }
        }
    }

</style>
