<template>
    <div class="authMessage">
        <div class="content">
            <div class="content-left">
                <div class="title">{{$t('memberAauthority.power_setRoleFuncPermissions')}}</div>
                <Tabs type="card" @on-click="changeTabs" id='authorityID'>
                    <TabPane v-for="(tab,index) in tabList" :key="index" :label="tab.name" :name="tab.name">
                        <auth-list :auth="authId" :authList="tab.children"></auth-list>
                    </TabPane>
                </Tabs>
            </div>
            <div class="content-right">
                <div class="title">{{$t('memberAauthority.power_setRoleDataScope')}}</div>
                <!--<div class="tips">
                  <div class="tips-message">
                    <span>1</span>勾选"负责的任务"后，默认拥有所属子任务的权限
                  </div>
                  <div class="tips-message">
                    <span>2</span>勾选"关联的任务"后，默认拥有所关联任务的权限
                  </div>
                 <div @click="close"><Icon type="close" style="color:#bdbdbd;"></Icon></div>
                </div>-->
                <auth-tree :auth="authId" :project="projectAuth" :bid="bidAuth" :contract="contractAuth"></auth-tree>
            </div>
        </div>
    </div>
</template>

<script>
    import authList from './authList.vue';
    import authTree from './authTree.vue';
    export default {
        name: 'authMessage',
        components: {
            authList,
            authTree
        },
        props: {
            tabs: {
                type: Array,
                default: []
            },
            // authLists: {
            //   type: Array,
            //   default: []
            // }
        },
        data() {
            return {
                authId: null,
                name: 'bbb',
                // tabs: [{
                //   name: '工作台'
                // }, {
                //   name: '招标'
                // }, {
                //   name: '合同'
                // }],
                authLists: [{
                    status: true,
                    modelName: i18n.t('memberAauthority.power_myTasksList'),
                    modelMessage: i18n.t('memberAauthority.power_modelMessage')
                }],
                tabList: [],
                authlist: [],
                bidAuth: [],
                contractAuth: [],
                projectAuth: []
            };
        },
        mounted() {
            this.changeType();
        },
        methods: {
            changeTabs(name) {  //根据name的不同加载不同的权限列表
                // console.log(name)
            },
            close() {
                let tips = document.querySelectorAll('.tips');
                tips[0].style.display = "none";
                //  console.log(tips)
            },
            changeType() {
                let project = [], bid = [], contract = [];
                this.$bus.on("changeAuth", (val, list) => {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].id == val) {
                            this.authId = list[i].id;

                            this.tabList = list[i].auth;
                            // project.push(list[i].project_auth.name);
                            // bid.push(list[i].bid_auth.name);
                            // contract.push(list[i].contract_auth.name);
                            // // const arr = [1, 1, 2, 2, 3, 4, 5, 5];
                            // this.projectAuth = [...new Set(project)];
                            // this.bidAuth = [...new Set(bid)];
                            // this.contractAuth = [...new Set(contract)];
                            // console.log(this.tabList, this.projectAuth, this.bidAuth, this.contractAuth)
                        }
                    }
                });
            }
        },
        updated() {
            this.changeType();
        }

    };
</script>

<style scoped lang="less">
    .authMessage {
        .content {
            display: flex;
            .content-left {
                float: left;
                width: 70%;
                padding-left: 50px;
                // border-right: 1px solid #e4e4e4;
                // border-left: 1px solid #e4e4e4;
                box-shadow: @boxShadow;
                background: #fff;
                color: @black_2;
                margin-bottom: 30px;
                border-radius: 3px;
                .title {
                    height: 50px;
                    line-height: 50px;
                    margin-bottom: 20px;
                    margin-left: -50px;
                    padding-left: 30px;
                    font-size: 16px;
                    background: @gray;
                    border-radius: 3px 3px 0px 0px;
                }
                .ivu-tabs {
                    left: -25px;
                }
                .ivu-tabs.ivu-tabs-card {
                    max-height: 765px;
                }
                .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-wrap {
                    height: 34px;
                    line-height: 17px;
                    margin-top: 0;
                }
                .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
                    margin-right: 0;
                    border: none;
                    width: 50px;
                    text-align: center;
                }
            }
            .content-right {
                width: 28%;
                float: left;
                max-height: 835px;
                margin-left: 20px;
                background: #fff;
                border-radius: 3px;
                box-shadow: @boxShadow;
                .title {
                    color: @black_2;
                    height: 50px;
                    line-height: 50px;
                    margin-bottom: 0px;
                    padding-left: 30px;
                    font-size: 16px;
                    background: @gray;
                    border-radius: 3px 3px 0px 0px;
                }
                .tips {
                    margin: 10px;
                    border: 1px solid @orange;
                    background: #fcf0d4;
                    padding: 30px 40px 30px 32px;
                    position: relative;
                    color: @black_2;
                    .tips-message {
                        .tips-message {
                            color: @black_2;
                        }
                        &:first-child {
                            margin-bottom: 10px;
                        }
                        span {
                            display: block;
                            width: 15px;
                            height: 15px;
                            border-radius: 50%;
                            float: left;
                            background: @orange;
                            text-align: center;
                            color: #fff;
                            margin-right: 3px;
                        }
                    }
                    .ivu-icon-close {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        color: #FDA692;
                    }
                }
            }
        }
    }
</style>
<style lang="less">
    .authMessage {
        .ivu-tabs-nav-container {
            margin-bottom: 3px;
        }
        .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-wrap {
            height: 34px;
            line-height: 17px;
            margin-top: 0;
        }
        .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
            color: @black_2;
            border: none;
            max-width: 77px;
            padding: 0 !important;
            text-align: center;
            background: #fff;
            margin-right: 10px;
            border-bottom: none !important;
            &:last-child {
                margin-right: 0px;
            }
        }
        .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
            color: #31bb9f;
            &::after {
                content: ' ';
                display: block;
                height: 2px;
                margin-top: 8px;
                background: #3bceb6;
            }
        }
    }
</style>

