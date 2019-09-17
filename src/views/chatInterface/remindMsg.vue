<template>
    <div class="remind_all" :style="{height:chatMsgBoxHeight -70 +'px'}">
        <ul class="remind_message_ul" v-if="!settingFlag">
                <li v-for="(li,index) in tabs.tab" @click="changeNav(li,index)"
                    :class="{'remind_active':index == tabs.creent}">
                    <Badge :count="badgeCount(li,index)" size="12">
                       {{li}}
                    </Badge>
                </li>
        </ul>
        <!-- <span @click="setMsg">设置</span> -->
        <div class="remind_children" :style="{height:chatMsgBoxHeight -70 -44 +'px'}">
            <remind-children ref="children" v-if="!settingFlag" :tabIndex="tabs.creent"></remind-children>
            <set-rmind v-else></set-rmind>
        </div>
    </div>
</template>
<script>
    import remindChildren from './remindChildren.vue';
    import setRmind from './setramind.vue';
    import {mapState} from 'vuex';
    const tabList = ['系统', '合作', '合同', '项目', '任务', ];
    export default {
        props: {
            settingFlag: {
                type: Boolean,
                default: false
            },
            chatMsgBoxHeight: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                tabs: {
                    creent: 0,
                    tab: tabList
                }
            };
        },
        methods: {
            badgeCount(tab, index){
                let num = 0;
                switch (index)
                {
                    case 0:
                        num = this.noticeNum.system;
                        break;
                    case 1:
                        num = this.noticeNum.bid;
                        break;
                    case 2:
                        num = this.noticeNum.contract;
                        break;
                    case 3:
                        num = this.noticeNum.project;
                        break;
                    case 4:
                        num = this.noticeNum.task;
                        break;
                }

                return num;
            },
            changeNav(item,index){
                this.tabs.creent = index
                if(this.$refs.children){
                    this.$refs.children.clearId()
                }
            },
        },
        computed: {
            ...mapState({
                noticeNum(app){
                    return app.notice.noticeNum;
                }
            })
        },
        components: {
            remindChildren,
            setRmind
        }
    };
</script>
<style scoped lang="less">
    @lightGray: #bdbdbd;
    @dullGrey: @black_2;
    .remind_all {
        width: 100%;
        height: 804px;
    }

    .remind_message {
        width: 100%;
        height: 50px;
        position: relative;
    }

    .remind_message > span {
        position: absolute;
        bottom: 5px;
        right: 5px;
        cursor: pointer;
    }

    .remind_message_ul {
        display: flex;
        color: @lightGray;
        border-bottom: 1px solid #ececec;

        li {
            font-size: 14px;
            cursor: pointer;
            padding: 10px 30px;

            &.remind_active {
                color: @base;
                border-bottom: 2px solid @base;
            }
        }
    }

    .remind_children {
        height: 746px;
        background: #fff;
        /*width: 100%;*/
        /*height: calc(~"100% - 150px");*/
    }
</style>
<style lang="less" >
    .remind_all{
        .remind_message_ul{
            .ivu-badge-count{
                height: 15px;
                min-width: 15px;
                padding: 0 3px;
                line-height: 13px;

            }
        }
    }


</style>
