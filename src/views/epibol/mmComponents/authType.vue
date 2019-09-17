<template>
    <div class="classify">

        <div class="title"><i class="icon iconfonts icon-hezuobaoxiangongsi"></i>{{title}}
            <slot name="title"></slot>
            ({{number}})
            <slot name="number"></slot>
        </div>
        <div class="auth">

            <ul class="fMenu">
                <!-- 之前循环的是 postList 列表 注释 <span class="numStyle">{{item.member_count}}</span> -->
                <li v-for="(item,index) in dutyList" :key="index" :class="{'actived': FMenuIndex == index}"
                    @click="openTable(index,item.id,postList)" id='activedID'>
                    {{item.name}}<span v-if="item.is_default != 0" class="fMwnu-deful">({{$t('memberAauthority.power_default')}})</span>
                    <!-- <span class="numStyle">{{item.member_count}}</span> -->
                </li>
            </ul>
            <!-- <i class="icon iconfonts icon-jia" ></i> -->
        </div>
    </div>
</template>
<script>
    export default {
        name: 'authTypeMenu',
        data() {
            return {
                FMenuIndex: 0,
                SMenuIndex: null
            };
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            number: {
                type: String,
                default: ''
            },
            postList: {
                type: Array,
                default: []
            },
            dutyList: {
                type: Array,
                default: []
            }
        },

        methods: {

            /**
             * 改变类型项
             */
            changeFMenu(active) {
                this.$emit('on-change', active);
                // console.log(active);
            },
            changeSMenu(active) {
                this.$emit('on-change', active);
                // console.log(active);
            },
            openTable(index, postId, postList) {
                this.FMenuIndex = index;
                this.$emit('openAuth', index, postId, postList);
            },
        },
        computed: {}
    };
</script>
<style scoped lang="less">
    .classify {
        width: 362px;
        box-shadow: @boxShadow;
    }

    .title {
        height: 48px;
        line-height: 48px;
        text-align: center;
        padding: 0 20px;
        width: 362px;
        color: @black_2;
        font-size: 16px;
        background: @gray;
        border-radius: 3px 3px 0px 0px;
    }

    .icon-hezuobaoxiangongsi {
        font-size: 28px;
        padding-right: 4px;
        color: @black_3;
    }

    .icon-jia {
        color: @orange;
        font-size: 24px;
        padding-left: 42px;
    }

    .fMenu {
        height: auto;
        color: @black_2;
        line-height: 50px;
    }

    .fMwnu-deful {
        color: #657180;
    }

    .fMenu li {
        cursor: pointer;
        padding: 0 30px;
        padding-left: 72px;
        font-size: 13px;
    }

    .fMenu li:hover {
        background: @white;
        /* border-right: 3px solid #31bb9f; */
        color: #31bb9f;
        .fMwnu-deful {
            color: #31bb9f;
        }
    }

    .fMenu li.actived {
        /*background: linear-gradient(to right,#78DDCD,#E2F8F4)!important;*/
        /* border:0!important; */
        /*border-left: 3px solid #31bb9f!important;*/
        color: #31bb9f;
        background: #fff;
        .fMwnu-deful {
            color: #31bb9f;
        }
    }

    .fMenu li:hover .more {
        display: block;
    }

    .editItem {
        text-align: center;
        line-height: 30px;
    }

    .numStyle {
        color: #bdbdbd;
    }

    .numStyle,
    .more {
        float: right;
    }

    .more,
    .fMenu li:hover .numStyle {
        display: none;
    }

    .ivu-menu-light {
        background: #fff !important;
    }

    .ivu-menu-vertical .ivu-menu-item:hover,
    .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: #f3f3f3 !important;
    }

    .ivu-tabs-bar {
        margin-bottom: 0 !important;
    }

    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab,
    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        width: 100px !important;
        text-align: center !important;
    }
</style>
