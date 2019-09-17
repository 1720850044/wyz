<template>
    <div>
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
        </main-native>
        <div class="statisics">
            <!-- Menu -->
            <div class="statisics-menu">
                
                <div class="ivu-div">
                    <p v-on:click="exportCompanyStatistics"><Icon type="archive" style="font-size: 15px;padding-right:8px;"></Icon>{{$t('companyStatistics.company_projectStatus')}}</p>

                    <Menu :open-names="['1']" :active-name="activeMenu" @on-select="selectListMenu" mode="vertical" width="260" ref="side_menu">
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
           
            <div class="statisics-content" v-if="nowType == 0">
                <div v-if="activeMenu == '1-1'">
                    <statis-tender></statis-tender>
                </div>
                <div v-if="activeMenu == '1-2'">
                  <conversion></conversion>
                </div>
                <div v-if="activeMenu == '1-3'">
                  <tender></tender>
                </div>
                <div v-if="activeMenu == '2-1'">
                  <cooperation></cooperation>
                </div>
                <div v-if="activeMenu == '2-2'">
                  <project-finance></project-finance>
                </div>
                <div v-if="activeMenu == '3-1'">
                    <statis-project></statis-project>
                </div>
                <div v-if="activeMenu == '4-1'">
                  <statis-trading></statis-trading>
                </div>
                <div v-if="activeMenu == '5-1'">
                    <team-kpi></team-kpi>
                </div>
                <div v-if="activeMenu == '5-2'">
                    <team-time></team-time>
                </div>
                <!-- <component :is="nowComp"></component> -->
            </div>

            <div class="statisics-content" v-if="nowType == 1">
                <div v-if="activeMenu == '1-1'">
                    <project-finance></project-finance>
                </div>
                <div v-if="activeMenu == '2-1'">
                  <statis-project></statis-project>
                </div>
                <div v-if="activeMenu == '3-1'">
                    <team-kpi></team-kpi>
                </div>
                <div v-if="activeMenu == '3-2'">
                    <team-time></team-time>
                </div>
            </div>
            <!-- //statisicsContentEnd -->
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
import statisMenu from "./statistics/component/statisMenu";
import mainNative from "../main-components/mainNative.vue";
import statisHome from "./statistics/component/statisHome";
import statisTender from "./statistics/component/statisTender";
import conversion from "./statistics/component/conversion";
import tender from "./statistics/component/tender";
import statisTrading from "./statistics/component/statisTrading";
import statisProject from "./statistics/component/statisProject";
import statisTeam from "./statistics/component/statisTeam";
import cooperation from "./statistics/component/cooperation";
import teamKpi from "./statistics/component/teamKpi";
import teamTime from "./statistics/component/teamTime";
import projectFinance from "./statistics/component/projectFinance";
import Cookies from 'js-cookie';
import api from "api";
export default {
    data() {
        return {
            nowComp: "statisHome",
            menuData: [],
            listMenu: [],
            activeName: 1,
            activeMenu: '1-1',
            powerToken: '',
            pageNames: [
                "statisHome",
                "statisTender",
                "cooperation",
                "statisProject",
                "statisTrading",
                "statisTeam"], //主页，投标，交易,项目，团队
            token: localStorage.token,
            nowType: 0
        };
    },
    components: {
        statisMenu: statisMenu,
        mainNative: mainNative,
        statisHome,
        statisTender,
        conversion,
        tender,
        statisTrading,
        statisProject,
        projectFinance,
        teamKpi,
        teamTime,
        statisTeam,
        cooperation
    },
    mounted() {
        if (this.$route.params.nowComp && this.nowType ==0) {
            this.nowComp = this.$route.params.nowComp;
            switch (this.nowComp) {
                case "statisHome":
                    this.activeName = 1;
                    break;
                case "statisTender":
                    this.activeName = 2;
                    break;
                case "cooperation":
                    this.activeName = 3;
                    break;
                case "statisProject":
                    this.activeName = 4;
                    break;
                case "statisTrading":
                    this.activeName = 5;
                    break;
                case "statisTeam": //cooperation
                    this.activeName = 6;
                    break;
            }
        } else if (this.$route.params.nowComp && this.nowType ==1){
            switch (this.nowComp) {
                case "statisProject":
                    this.activeName = 1;
                    break;
                case "statisTeam":
                    this.activeName = 2;
                    break;
            }
        }
    },
    created() {
        let companyData = Cookies.get("company");
      // console.log('333',JSON.parse(companyData).type)
        companyData && (this.nowType = JSON.parse(companyData).type);
        console.log(2222);
        console.log(this.nowType);
        if (this.nowType == 1){
            console.log('是甲方');
            this.pageNames = [
                "statisProject",
                "statisTeam"
            ];
            this.nowComp = 'statisProject';
        }
        this.initFun().then(() => {
            this.getMenuData();
        });
    },
    methods: {
        async initFun() {
            const res = await api.getCustomerInfo();
            if (res.data.err_code == 0) {
                this.powerToken = res.data.data.acc_token;
            } else {
                this.$Message.error(res.data.err_message);
            }
            return this.powerToken;
        },
    // 导出公司统计
        exportCompanyStatistics(){
            let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_export_company;
            let hostName = Cookies.get("hostName");
            let download = hostName + '/'+url + "&token=" + this.token;
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = download;
            a.click(); //点击触发下载
        },
        selectMenu(name) {
      //console.log('当前选中的是',name)
            this.nowComp = this.pageNames[name - 1];
      //console.log('当前comp..........',this.nowComp);
        },
        selectListMenu(name){
            this.activeMenu = name;
        },
    //甲方隐藏前三个统计
        hideMenu(data){
            let companyData = Cookies.get("company");
      // console.log('333',JSON.parse(companyData).type)
            if (this.nowType==1){

                let arr = [];
                arr[0] = data[3];
                arr[1] = data[4];
        // arr.push(data[3]);
        // arr.push(data[4]);
        //         console.log(arr);
                return arr;
            } else {
                return data;
            }
        },
    // MenuData
        getMenuData() {
            let _this = this;
            let url = _this.GLOBAL.baseRouter + this.$GLOBALAPI.company_catalog_list; //task/count/catalog-list修改之前的菜单列表地址
            _this.$axios.post(url, {'acc_token': _this.powerToken}).then(msg => {
                _this.listMenu = msg.data.data;
                _this.$nextTick(() => {
                    _this.$refs.side_menu.updateOpened();
                    _this.$refs.side_menu.updateActiveName();
                });
                delete msg.data.err_code;
                delete msg.data.err_message;
                // console.log(JSON.stringify(msg.data));
                for (let i in msg.data) {
                    _this.menuData=msg.data[i];
                }
                // console.log(JSON.stringify(msg.data));
                _this.$nextTick(() => {
                    //_this.$refs.side_menu.updateOpened();
                   // _this.$refs.side_menu.updateActiveName();
          //console.log('-0-----',_this.menuData[0].Titem[0].title)
          //s _this.activeName=_this.menuData[0].Titem[0].title;
                });
            });
        }
    }
};
</script>
<style lang="less">
@import "../../assets/styles/statistics.less";
//移动样式，但是下面几个搜索到已经没使用了，暂时没删
.newStatis {
  width: 1600px;
  padding: 30px 0;
  .taskTop {
    ul {
      display: flex;
      justify-content: space-between;
      li {
        width: 495px;
        height: 282px;
        border-radius: 3px;
        background: #fff;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        //cursor: pointer;
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            font-size: 18px;
            color: #b5b5b5
          }
          img {
            width: 23px
          }
        }
        .chars {
          display: flex;
          .charSty {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            font-size: 18px;
            font-weight: lighter;
            p {
              position: absolute;
              top: -25px;
              right: 26px;
              padding: 2px 12px;
              color: #fff;
              border-radius: 3px;
              font-size: 14px;
              color: #fefefe;
              //i{position: absolute;left: 0;bottom: 0;display: inline-block;width:0;height:0;overflow:hidden;border:7px solid transparent;border-right-color:#3bceb6;}
            }
            i {
              font-size: 14px;
              color: #b5b5b5;
              margin-left: 2px;
              font-style: normal
            }
            .numbersSty {
              font-size: 14px;
              color: #b5b5b5;
              margin-top: 20px;
              span {
                font-size: 18px
              }
            }
            .numbers {
              i {
                font-size: 18px;
                color: #b5b5b5
              }
            }
            .adopat {
              position: absolute;
              top: -45px;
              border-radius: 3px;
              padding: 1px 5px;
              font-size: 13px;
            }
          }
          .charsLeft {
            p {
              background: #3bceb6;
            }
            b {
              color: #3bceb6;
            }
            .adopat {
              border: 1px solid #3bceb6;
              color: #3bceb6
            }
          }
          .charsRight {
            p {
              background: @orange;
            }
            b {
              color: @orange;
            }
            .numbers {
              font-size: 13px;
              color: #b5b5b5;
              span {
                color: @orange;
                font-size: 18px
              }
            }
            .adopat {
              border: 1px solid @orange;
              color: @orange
            }
          }
        }
        .charsCenter {
          display: flex;
          align-items: center;
          flex-direction: column;
          .demo-Circle-custom {
            span {
              font-size: 18px;
              color: @red;
            }
            i {
              font-style: normal;
              color: #b5b5b5
            }
            p {
              font-size: 13px;
              color: #d1d1d1;
              margin-top: 2px
            }
          }
          .charsBottom {
            display: flex;
            width: 100%;
            text-align: center;
            .charSty {
              width: 50%;
              p {
                color: #b5b5b5;
                font-size: 14px;
                span {
                  font-size: 18px
                }
                i {
                  font-style: normal
                }
              }
            }
            .left {
              span {
                color: @red;
              }
            }
            .right {
              span {
                color: #a2cffd;
              }
            }
          }
        }
      }
    }
  }
  .taskCenter {
    border-radius: 3px;
    background: #fff;
    margin-top: 26px;
    padding: 20px;
    .taskTitle {
      font-size: 18px;
      color: #b5b5b5;
    }
    ul {
      display: flex;
      align-items: center;
      justify-content: space-between;
      li {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 140px;
        font-size: 18px;
        color: @black_2;
        border-left: 1px dashed #f0f0f0;
        cursor: pointer;
        &:nth-child(1) {
          border: none
        }
        span {
          margin-left: 20px
        }
      }
    }
  }
}
</style>
<style>
.statisics-menu .ivu-menu-vertical .ivu-menu-item {
    /* padding: 13px 100px; */
}
.statisics-content {
  margin-left: 290px;
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

