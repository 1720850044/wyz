<!--statistics.vue 项目统计页-->

<template>
    <div>
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span>
            </div>
        </main-native>

        <div class="statisics">
            <!-- Menu -->
            <div class="statisics-menu">
                <div class="ivu-div">
                    <p @click="exportProjectStatistics">
                        <Icon type="archive" style="font-size: 15px;padding-right:8px;"></Icon>
                        导出项目统计
                    </p>
                    <!-- <Menu width="auto" @on-select="selectMenu" :open-names="['1']" :active-name="nowComp"
                          ref="side_menu">
                        <Submenu name='1'>
                            <template slot="title">
                                <Icon type="ios-paper"></Icon>
                                概述
                            </template>
                            <MenuGroup>
                                <MenuItem name="home">项目概述</MenuItem>
                                <MenuItem name="task">任务统计</MenuItem>
                                <MenuItem name="member">成员统计</MenuItem>
                            </MenuGroup>
                        </Submenu>
                    </Menu> -->
                    <Menu :open-names="['1-1']" :active-name="activeMenu" @on-select="selectListMenu" mode="vertical" width="260" ref="side_menu" accordion>
                      <MenuGroup :name="(idx+1)" v-for="(item,idx) in listMenu" :key="idx">
                          <div class="menu-title">
                            <!-- <i class="ivu-icon ivu-icon-ios-checkmark"></i> -->
                            <h4>{{item.title}}</h4>
                          </div>
                          <MenuItem :name="(idx+1)+'-'+(index+1)" v-for="(elem,index) in item.Titem" :key="index">{{elem.title}}</MenuItem>
                      </MenuGroup>
                  </Menu>
                </div>
            </div>
            <!-- //MenuEnd -->
            <!-- statisicsContent -->
            <div class="statisics-content" style="padding-bottom:30px;">
                <!-- <template v-if="tokenShow">
                    <component :is="nowComp" @goComp='openComp'></component>
                </template> -->
                <div v-if="activeMenu == '1-1'">
                    <home></home>
                </div>
                <div v-if="activeMenu == '2-1'">
                  <task-status></task-status>
                </div>
                <div v-if="activeMenu == '2-2'">
                  <task></task>
                </div>
                <div v-if="activeMenu == '2-3'">
                  <task-feedback></task-feedback>
                </div>
                <div v-if="activeMenu == '3-1'">
                    <member-task></member-task>
                </div>
                <div v-if="activeMenu == '3-2'">
                    <member></member>
                </div>
                <div v-if="activeMenu == '3-3'">
                  <working-hours></working-hours>
                </div>
                <div v-if="activeMenu == '3-4'">
                    <member-feedback></member-feedback>
                </div>
            </div>
            <!-- //statisicsContentEnd -->
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
    import {statisticsIndex} from '@/axios/modules/project/projectStatistics.js';
    import api from 'api';
    import mainNative from "../main-components/mainNative.vue";
    import member from "./statistics/member.vue";
    import memberFeedback from "./statistics/memberFeedback.vue";
    import workingHours from "./statistics/workingHours.vue";
    import home from "./statistics/home.vue";
    import taskStatus from "./statistics/taskStatus.vue";
    import memberTask from "./statistics/memberTask.vue";
    import task from "./statistics/task.vue";
    import taskFeedback from "./statistics/taskFeedback.vue";
    import { onlyAPI } from "../../axios/apiConfig"
    import Cookies from "js-cookie";

    export default {
        data () {
            return {
                tokenShow: false,
                //activeName:'member',
                nowComp: "home",
                activeMenu: '1-1',
                powerToken: '',
                listMenu: [],
                countData: {
                    delay: {},
                    quality: {},
                    schedule: {}
                }
            };
        },
        components: {
            mainNative,
            member,
            taskStatus,
            memberTask,
            task,
            taskFeedback,
            memberFeedback,
            workingHours,
            home
        },
        mounted () {
            // this.init();
        },
        methods: {
            async init () {
                await statisticsIndex();
                this.tokenShow = true;
            },
            async initFun() {
                const res = await api.getProjectIndex();
                if (res.data.err_code == 0) {
                    this.powerToken = res.data.data.acc_token;
                } else {
                    this.$Message.error(res.data.err_message);
                }
                return this.powerToken;
            },
            getMenuData () {
                let _this = this;
                let url = _this.GLOBAL.baseRouter + onlyAPI.project_catalog_list; //task/count/catalog-list修改之前的菜单列表地址
                _this.$axios.post(url, {'acc_token': _this.powerToken}).then(msg => {
                    _this.listMenu = msg.data.data;
                    _this.$nextTick(() => {
                        _this.$refs.side_menu.updateOpened();
                        _this.$refs.side_menu.updateActiveName();
                    })
                });
            },
            actionTask (status) {
                this.$router.push("/project/statisticsDetails/" + status);
            },
            selectListMenu (name) {
                this.activeMenu = name;
            },
            selectMenu (name) {
                // console.log("selectMenu", name);
                this.nowComp = name;
            },
            //子组件跳转
            openComp (compName) {
                this.nowComp = compName;
            },
            // 导出项目统计(-----接口报错还未调整-------)
            async exportProjectStatistics () {
                let id = sessionStorage.projectID;
                let url = this.GLOBAL.baseRouter+this.$GLOBALAPI.task_export_project;
                let token = localStorage.token;
                let hostName = Cookies.get("hostName");
                let download = hostName + '/' + url + "&token=" + token + "&project_id=" + id;
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.href = download;
                a.click(); //点击触发下载
            }
        },
        comments: {
            mainNative
        },
        created () {
            this.initFun().then(() => {
                this.getMenuData();
            })
            // let id = sessionStorage.projectID;
            // this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_project_count,{project_id:id}).then((res)=>{
            //     if(res.data.err_code==0){
            //         this.countData.delay = res.data.data.delay||{};
            //         this.countData.quality = res.data.data.quality||{};
            //         this.countData.schedule = res.data.data.schedule||{};
            //     }else {
            //         console.log('错误：',res.data.err_message);
            //     }
            // })
        }
    };
</script>
<style>
.itemBox-chars .charSty {
    width:50% !important;
}
.itemBox-chars .charsLeft{
    margin-left:15%;
}
.itemBox-charsCenter{
    width:50%;
}
.itemBox-charsCenter {
    position: relative;
    margin-left: 5.5%;
}
.itemBox-charsCenter .charsBottom {
    display: block !important;
    position: absolute;
    left: 117%;
}
.statisics-content {
  margin-left: 290px !important;
}
.statisics-menu .ivu-menu-vertical .ivu-menu-item {
    /* padding: 13px 100px; */
}
.statisics-menu {
  width:260px !important;
  padding: 16px 40px 16px 40px !important;
}
.statisics-menu .ivu-menu-vertical .ivu-menu-item {
    padding: 13px 20px !important;
}
.menu-title{
  margin: 0 15px;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  position: relative;
}
.menu-title h4{
  display: inline-block;
  margin-left: -15px;
}
.menu-title:before {
  position:absolute;
  top:0;
  left: 0;
}
.statisics-menu .ivu-menu-item-group .ivu-menu-item:nth-of-type(1){
  border: none;
}
.statisics-menu .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background: #ccf2ec !important;
    color: #777777 !important;
    border-width: 0px;
}
</style>

<style lang="less">
    @import "../../assets/styles/statistics.less";
</style>

