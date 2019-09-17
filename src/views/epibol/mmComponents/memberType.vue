<template>
    <div class="classify">
        <div class="title" :title="title+number"><i class="icon iconfonts icon-hezuobaoxiangongsi"></i>{{title}}({{number}})
            <slot name="title"></slot>
            <!-- ({{number}}) -->
            <!-- <slot name="number"></slot> -->
        </div>
        <Tabs type="card" :value='creentTab' @on-click='changeTab' id='memberTabID'>
            <TabPane :label="$t('lang.lang_department')" name='dept'>
                <ul class="fMenu">
                    <li v-for="(item,index) in deptList" :key="index" :class="{'actived': FMenuIndex == index}"
                        @click="openTable(index,item.company_id,item.id)">
                        {{item.name}}
                        <span class="numStyle">({{item.member_count}})</span>
                        <!-- <span class="more" @click.stop="editItem()">...</span> -->
                        <!-- <Poptip class="more" placement="bottom-end" v-if="index+1 < deptList.length"> -->
                        <!-- <span>...</span> -->
                        <!-- <div class="api" slot="content"> -->
                        <!-- <slot name="fmore"></slot> -->
                        <!-- <ul class="editItem">
                            <li @click="editDept(item.id,item.name)">编辑</li>
                            <li @click="delDept(item.id)">删除</li>
                        </ul>
                    </div>  -->
                        <!-- </Poptip> -->
                        <span v-if="item.company_id" class="api">
                            <!-- <slot name="fmore"></slot> -->
                            <Icon @click.native="editDept(item.id,item.name)" type="edit" class='op_edit'></Icon>
                            
                            <Icon @click.native="delDept(item.id)" type="ios-trash-outline" class='op_del'></Icon>
                            
                        </span>
                    </li>
                    <!-- <li>未分配门（0）</li> -->
                    <!-- <div>
                        <span v-if="!item.name">未分配部门</span>
                        <Icon @click="editDept(item.id,item.name)" type="edit" ></Icon>
                            
                        <Icon @click="delDept(item.id)" type="ios-trash-outline" ></Icon> 
                    </div> -->
                </ul>
                <slot name="addDept"></slot>
            </TabPane>
            
            <TabPane :label="$t('pc.pc_functions')" name='post'>
                <ul class="fMenu">
                    <!-- {{dutyList}} -->
                    <li v-for="(item,index) in dutyList" :key="index" :class="{'actived': SMenuIndex == index}"
                        @click="open2Table(index,item.company_id,item.id)">
                        {{item.name}}
                        <span class="numStyle">({{item.member_count}})</span>
                        <!-- <span class="more" @click.stop="editItem()">...</span> -->
                        <!-- <Poptip class="more" placement="bottom-end" v-if="item.is_default!=1"> -->
                        <!-- <span>...</span> -->
                        <!-- <div class="api" slot="content">
                            <slot name="fmore"></slot>
                            <ul>
                                <li @click="editDuty(item.id,item.name)">编辑</li>
                                <li @click="delDuty(item.id)">删除</li>
                            </ul>
                        </div>   -->
                        <span v-if="item.company_id" class="api">
                                <Icon @click.native="editDuty(item.id,item.name)" type="edit" class="edit"></Icon>
                                <Icon @click.native="delDuty(item.id)" type="ios-trash-outline" class=""></Icon>
                            <!-- （默认） -->
                            </span>
                        <span v-if="!item.company_id&& item.name!=$t('memberAauthority.power_unassignedFunc')" class="post">
                                <!-- <Icon @click="editDuty(item.id,item.name)" type="edit" class="edit"></Icon>
                                <Icon @click="delDuty(item.id)" type="ios-trash-outline" class=""></Icon> -->
                                （{{$t('memberAauthority.power_defaultFunc')}}）
                            </span>
                        <!-- </Poptip> -->
                    </li>
                </ul>
                <slot name="addDuty"></slot>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    var qs = require('querystring');
    export default {
        name: 'memberTypeMenu',
        data() {
            return {
                FMenuIndex: null,
                SMenuIndex: null,
                // deptListtda:[]
                cid: '',
                iid: '',
                creentTab: 'dept'

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
            deptList: {
                type: Array,
                default: []
            },
            dutyList: {
                type: Array,
                default: []
            }
            // menuList: Array,
            // iconSize: Number,
            // openNames: {
            //     type: Array
            // }
        },
        mounted() {
            // console.log('dutylIS',this.dutyList)
            // this.deptListtda=JSON.parse(sessionStorage.fetchList);
            // sessionStorage.removeItem(fetchList)
            this.FMenuIndex = 0;
            this.SMenuIndex = 0;
            //    console.log(121,this.cid,this.iid)

            this.init();

            // console.log(this.deptList)
        },
        methods: {
            changeTab(name){
                this.creentTab = name;
                if (name == 'post'){
                    let arr = this.dutyList;
                    
                    this.open2Table(0, arr[0].company_id, arr[0].id);
                }
            },
            init() {
                let data = {
                    company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
                };
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_list, data)
                    .then(res => res.data)
                    .then(res => {

                        // console.log(1111,res)
                        if (res.data.length) {
                            this.cid = res.data[0].company_id;
                            this.iid = res.data[0].id;
                            this.openTable(0, this.cid, this.iid);

                        }
                    });
            },

            /**
             * 初始化数据
             *
             */
            initData() {

                /*
                axios.get('/user', {
                    params: {
                    ID: 12345
                    }
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
                */
            },

            /**
             * 改变类型项
             */
            changeFMenu(active) {
                this.$emit('on-change', active);
                // console.log(111,active);
            },
            changeSMenu(active) {
                this.$emit('on-change', active);
                // console.log(active);
            },
            openTable(index, comId, deptId) {
                this.FMenuIndex = index;
                this.$emit('openDept', index, comId, deptId);
                //  console.log(111,index, comId, deptId)
            },
            editDept(id, name) {
                this.$emit('deptEdit', id, name);
            },
            delDept(id) {
                this.$emit('deptDel', id);
            },
            delDuty(id) {
                this.$emit('dutyDel', id);
            },
            open2Table(index, comId, dutyId) {
                this.SMenuIndex = index;
                this.$emit('openDuty', index, comId, dutyId);
            },
            editDuty(id, name) {
                this.$emit('dutyEdit', id, name);
            },
            //名字多语言处理
            itemTitle(item) {
                if (typeof item.title === 'object') {
                    return this.$t(item.title.i18n);
                } else {
                    return item.title;
                }
            }
        },
        computed: {}
    };
</script>
<style scoped lang="less">
    .title {
        height: 48px;
        line-height: 48px;
        text-align: center;
        color: @black_2;
        padding: 0 20px;
        width: 362px;
        font-size: 16px;
        background: #fafbfb;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        border-radius: 3px 3px 0px 0px;
    }

    .icon-hezuobaoxiangongsi {
        font-size: 28px;
        padding-right: 4px;
        color:@black_3;
    }

    .ivu-tabs-nav-scroll {
        text-align: center !important;
        margin: 0 auto !important;
    }

    

    .api {
        color: @black_3;
        float: right;
        font-size: 12px;
        .ivu-icon {
            padding: 5px;
            font-size: 16px;
            font-weight: 400;
            vertical-align: middle;
        }
    }
    .post{
        color: @black_3;
        float: right;
        font-size: 12px;
    }
    .fMenu {
        height: auto;
        line-height: 50px;
    }

    .fMenu li {
        cursor: pointer;
        padding: 0 30px;
        font-size: 13px;
        color: @black_2;
        .api {
            color: @black_3;
            opacity: 0;
            .op_edit:hover{
                color: @base;
            }
            .op_del:hover{
                color: @red;
            }
        }
    }

    .fMenu li:hover {
        background: #ccf2ec;
        .api {
            opacity: 1;
        }
    }
    .fMenu li.actived {
        background: #ccf2ec;
        color: @base;
        .numStyle{
            color: @base;
        }
    }
    li.actived {
      background: #fff !important;
        .api {
            color: @black_3;
            opacity: 0;
        }
    }
    .fMenu li:hover .more {
        display: block;

    }
    

    .editItem {
        text-align: center;
        line-height: 30px;
    }
    .numStyle{
        color: #bdbdbd;
    }
    // .numStyle, .more{
    //     // float: right;
    // }
    // .more, .fMenu li:hover .numStyle{

    // }
    .ivu-menu-light {
        /*background: #fff !important;*/
    }

    .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: #f3f3f3 !important;
    }

    .ivu-tabs-bar {
        margin-bottom: 0 !important;

    }

    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab, .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        width: 100px !important;
        text-align: center !important;
    }
</style>
<style lang="less">
    .classify .ivu-tabs-bar {
        height: 34px !important;
        margin: 10px 20px;
        border-bottom: 0;
        .ivu-tabs-nav-container {
            height: 100% !important;
            .ivu-tabs-nav-wrap {
                height: 100% !important;
                border-bottom: 0;
                // margin: 0 auto;
                .ivu-tabs-nav {
                    border: 1px solid #31bb9f !important;
                    border-radius: 4px !important;
                    padding: 0px;
                }
            }
        }
    }
    .classify .ivu-tabs-bar .ivu-tabs-nav-container
    .ivu-tabs-nav-wrap .ivu-tabs-nav-scroll .ivu-tabs-nav .ivu-tabs-tab {
        /* height: 50px!important; */
        /* margin:20px!important;
        height:100px!important; */
        /* overflow: visible!important; */
        width: 160px;
        border: 0 !important;
        height: 30px;
        line-height: 30px;
        background: #fff;
        border-radius: 4px;
        padding: 0;
        margin: 0;
        color:@black_2;
        transition: none !important;
        transform: none !important;
        border-width: 0;
        &.ivu-tabs-tab-active {
            border: 1px solid #3bceb6 !important;
            height: 32px;
            background: #3bceb6;
            color: #fff;
            border-radius: 0;
        }
    }
</style>
