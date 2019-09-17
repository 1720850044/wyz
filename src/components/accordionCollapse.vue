<template>
    <div class="accordionCollapse" v-show="shrinkModalShow" >
        <div id="newTaskContract" v-show="contractListShow&&contractList.length>0" class="topBox" :class="{'selectShow':selectShow.taskMember}">
            <p class="navHead">
                <slot name="contractTitle">{{$t('project.pro_contractList')}}</slot>
                <Icon type="arrow-resize" v-show="selectShow.contract"
                      @click.native="openSelect('contract')"></Icon>
                <Icon v-show="selectShow.taskMember" size="16" type="arrow-expand"
                      @click.native="openSelect('otherContract')"></Icon>
            </p>
            <ul :class="{'overAuto':selectShow.contract}" v-show="selectShow.average||selectShow.contract" >
                <slot name="contract"></slot>
            </ul>
            <div class="bottomIconBox"  v-show="selectShow.average" >
                <div class="bottomIcon">
                    <span style="margin-bottom: 10px;">......</span>
                    <Icon @click.native="openSelect('contract')" type="arrow-expand"></Icon>
                </div>
            </div>
        </div>
        <div id="memberPlan" class="bottomBox" :class="{'selectShow':selectShow.contract}">
            <span class="navHead">
                <slot name="taskStateTitle">{{$t('project.pro_memberWorkingPosition')}}</slot>
                <span>
                    <ul  class="colorUl">
                        <template v-if="type =='project'">
                            <li><i class="colorTag selfTask project"></i>{{$t('project.pro_nowProject')}}</li>
                            <li><i class="colorTag otherTask"></i>{{$t('project.pro_otherProject')}}</li>
                            <li><i class="colorTag vacation"></i>{{$t('project.pro_vacation')}}</li>
                        </template>
                        <template v-else>
                            <li><i class="colorTag selfTask" ></i>{{$t('project.pro_projectTask')}}</li>
                            <li><i class="colorTag otherTask"></i>{{$t('project.pro_otherProject')}}</li>
                            <li><i class="colorTag vacation"></i>{{$t('project.pro_vacation')}}</li>
                        </template>
                        <Icon type="arrow-resize" v-show="selectShow.taskMember"
                              @click.native="openSelect('taskMember')"></Icon>
                    </ul>
                </span>
                <Icon v-show="selectShow.contract" size="16" type="arrow-expand"
                      @click.native="openSelect('otherTask')"></Icon>
            </span>
            <div id="ProjectScheduleGuide" class="ScheduleGuideBox">
                <div class="content" :class="{'dateAuto':selectShow.taskMember}" v-show="selectShow.average||selectShow.taskMember">
                    <slot name="taskState"></slot>
                </div>
                <div class="bottomIconBox"  v-show="selectShow.average&&contractListShow" v-if="contractList.length>0">
                    <div class="bottomIcon" >
                        <span style="margin-bottom: 10px;">......</span>
                        <Icon @click.native="openSelect('taskMember')" type="arrow-expand"></Icon>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'accordionCollapse',
        props: {
            contractList: { //合同清单没有的时候隐藏部分功能
                type: Array,
                default: () => [1, 2]
            },
            height: {
                type: Number
            },
            type: {
                type: String,
            },
            shrinkModalShow: {
                type: Boolean,
                default: true,
            }
        },
        created() {
        },
        mounted() {

        },
        data() {
            return {
                contractListShow: true,
                selectShow: {
                    contract: false,
                    taskMember: false,
                    average: true,
                },
            };
        },
        methods: {
            openSelect(type) {
                if (type === 'contract') {
                    this.selectShow.contract = !this.selectShow.contract;
                    this.selectShow.average = !this.selectShow.average;
                } else if (type === 'taskMember') {
                    this.selectShow.taskMember = !this.selectShow.taskMember;
                    this.selectShow.average = !this.selectShow.average;
                } else if (type === 'otherTask') {
                    this.selectShow.taskMember = true;
                    this.selectShow.contract = false;
                    this.selectShow.average = false;
                } else if (type === 'otherContract'){
                    this.selectShow.taskMember = false;
                    this.selectShow.contract = true;
                    this.selectShow.average = false;
                }
            },
            contractHidden(){
                this.contractListShow = !this.contractListShow;
            },
        },
        computed: {},
        components: {}
    };
</script>

<style lang="less" scoped>
    .accordionCollapse {
        /*flex: 1;*/
        width: 56%;
        height: 505px;
        padding: 0 0 0 30px;
        margin: 0 30px 0 0px;
        display: flex;
        flex-flow: column;
        border-left: 1px solid #e8e8e8;
        .ivu-icon-arrow-expand{
            cursor: pointer;
        }
        .navHead {
            display: flex;
            position: relative;
            width: 100%;
            height: 50px;
            padding: 0 10px;
            color: @base;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eef1f2;
            .colorUl{
                display: flex;
                align-items: center;
                color: #bdbdbd;
                li{
                    display: flex;
                    margin-right: 20px;
                    align-items: center;
                    .colorTag{
                        width: 30px;
                        height: 14px;
                        background: @red;
                        border-radius: 8px;
                    }
                    .selfTask{
                        background: @base;
                    }
                    .project{
                        border: 1px solid @base;
                    }
                    .otherTask{
                        background: #7cbefc;
                    }
                    .vacation{
                        background: #ff7b7e;
                    }
                    .selfTask,.otherTask,.vacation{
                        margin-right: 10px;
                    }
                }

            }
            &::before{
                position: absolute;
                left: 0;
                top:50%;
                content: ' ';
                display: block;
                width: 2px;
                height: 17px;
                color: @red;
                background: @base;
                transform: translateY(-50%);
            }
        }
        .ScheduleGuideBox{
            height: 90%;
            overflow: auto;
        }
        .overAuto{
            height: calc(~"100% - 50px");
            overflow: auto;
        }
        .topBox, .bottomBox {
            flex: 1;
            position: relative;
            overflow: hidden;
        }
        .bottomBox{
            margin-top: 10px;
            .content{
                height: 90%;
                margin-bottom: 10px;
                overflow-y: auto;
            }
            .dateAuto{
                height: calc(~"100% - 50px");
                overflow: auto;
            }
        }
        .selectShow {
            flex: none;
        }

        .bottomIconBox {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 48px;
            padding-top: 10px;
            font-size: 16px;
            color: #c2c2c3;
            background: #fff;
            .bottomIcon{
                display: flex;
                width: 100%;
                padding: 0 14px;
                background: #f3f5f6;
                justify-content: space-between;
                align-items: center;
            }
        }

    }
</style>
