<template>
    <div class="homePage">
        <!-- 首页头部 -->
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
        </main-native>

        <div class="companyInfo">

            <div class="companyInfoLeft">
                <Icon class="setting" @click.native="companySet" type="ios-gear-outline"></Icon>

                <!-- content -->
                <ul class="contentRow">

                    <p class="contentTitle">{{companyInfos.company_name}}</p>

                    <li>
                        <span>能力范围</span>
                        <p>人物原画、场景原画、3D模型、3D场景、动作、特效、次世代场景</p>

                    </li>
                    <li>
                        <span>满意率</span>
                        <p>100%</p>

                    </li>
                    <li>
                        <span>质量</span>
                        <p>4.96</p>

                    </li>
                    <li>
                        <span>速度</span>
                        <p>4.96</p>

                    </li>
                    <li>
                        <span>服务</span>
                        <p>4.96</p>

                    </li>
                </ul>
            </div>
            <div class="companyInfoRight">
                <div class="projectFlow">
                  <p class="projectFlowHead">项目流程</p>
                </div>
                <div class="projectDynamic">
                    <p class="projectDynamicHead">项目动态</p>
                    <table class="projectDiaryTable">
                      <tbody class="projectDiaryTbody">
                        <tr v-for="(item,index) in comProjectNews" :key="index" style="padding-top:16px;">
                            <td class="projectTime">{{item.time}}</td>
                            <td class="projectAction">{{item.action}}</td>
                            <td class="projectName">{{item.remark_name}}</td>
                        </tr>
                      </tbody>
                    </table>
                </div>
            </div>

        </div>

        <!-- <div class="pageHeader">

        </div>
        <div class="pageContent">
            <div class="companyInfo">
                <div class="companyLog">
                </div>
                <div class="contentRow">
                    <p>
                        <span>能力范围</span>
                        <em>人物原画、场景原画、3D模型、3D场景、动作、特效、次世代场景</em>
                        <div class="clear"></div>
                    </p>
                    <p>
                        <span>满意率</span>
                        <em>100%</em>
                        <div class="clear"></div>
                    </p>
                    <p>
                        <span>质量</span>
                        <em>4.96</em>
                        <div class="clear"></div>
                    </p>
                    <p>
                        <span>速度</span>
                        <em>4.96</em>
                        <div class="clear"></div>
                    </p>
                    <p>
                        <span>服务</span>
                        <em>4.96</em>
                        <div class="clear"></div>
                    </p>
                </div>
            </div>
            <div class="companyContent">
                <div class="contentHeader">
                    <div class="companyTitle">
                        <h4>{{companyInfos.company_name}}</h4>
                    </div>
                    <div v-if="standardLibrary" class="companySet" @click="companySet" >
                        <span>设置</span>
                    </div>
                    <div class="clear"></div>
                </div>

                <div class="contentRow">
                    <div class="project" @click="project">
                        <i class="iconfonts icon-xiangmu"></i>
                        <span>项目</span>
                    </div>
                    <div  v-if="epibol.callForBids" class="bid" @click="bid">
                        <i class="iconfonts icon-toubiao"></i>
                        <span>招标</span>
                    </div>
                    <div v-if="epibol.contract" class="contract" @click="contract">
                        <i class="iconfonts icon-hetong"></i>
                        <span>合同</span>
                    </div>
                    <div class="group" @click="group">
                        <i class="iconfonts icon-tuandui"></i>
                        <span>团队</span>
                    </div>
                    <div class="statis" @click="statis">
                        <i class="iconfonts icon-tongji"></i>
                        <span>统计</span>
                    </div>
                </div>

            </div>

        </div> -->
    </div>
</template>
<script>
import { mapState } from "vuex";
import Cookies from "js-cookie";
import mainNative from "../main-components/mainNative.vue";
import api from "api";
export default {
    data() {
        return {
            companyInfos: {},
            comProjectNews: [], //公司级项目动态数据
            companySkill: {} //公司能力{雷达图}
        };
    },
    mounted() {
        this.initComTableData();
    },
    components: {
        mainNative
    },
    methods: {
        companySet() {
            this.$router.push("/epibol/taskClass");
        },
        project() {
            this.$router.push("/epibol/projectManage");
        },
        bid() {
            this.$router.push("/epibol/bidManage");
        },
        contract() {
            if (this.companyInfo.type == 1) {
                this.$router.push("/customer/contractManage");
            } else {
                this.$router.push("/epibol/contractManage");
            }
        },
        group() {
            this.$router.push("/epibol/memberManager");
        },
        statis() {
            this.$router.push("/epibol/statistics");
        },
    // 获取公司级项目动态
        async initComTableData() {
            let res = await api.getComProjecNewsInfo();
            if (res.data.err_code == 0){
                this.comProjectNews = res.data;
            } else {
                this.$Message.error(res.data.err_message);
            }
        }
    },

    computed: {
        ...mapState({
            standardLibrary(data) {
                return data.app.standardLibrary;
            },
            epibol(data) {
                return data.app.epibol;
            },
            companyInfo(data) {
                return data.paySkip.company;
            }
        })
    },
    created() {
        this.companyInfos = JSON.parse(decodeURI(Cookies.get("company")));
    }
};
</script>


<style lang="less">
.homePage {
  height: 100%;
  .companyInfo {
    display: flex;
    height: 100%;
    .companyInfoLeft {
      .base-card;
      padding:30px;
      width:30%;
      .setting {
        position: absolute;
        top: 30px;
        right: 30px;
        font-size: 22px;
        cursor: pointer;
      }
      .contentRow {
        li {
          display: flex;
          margin-top: 18px;
          font-size: 14px;
          span {
            flex: 1;
            color:@black_3;
          }
          p {
            flex: 3;
          }
        }
        .contentTitle {
          font-size: @fs18;
          color:@black_1;
          margin-bottom: 28px;
        }
        .contentDescription {
          font-size: 12px;
          color: #bdbdbd;
        }
      }
    }
    .companyInfoRight {
      flex: 1;
      margin-left: 30px;
      .projectFlow {
        .base-card;
        height: 280px !important;
        margin-bottom: 30px;
        &Head{
          .base-card-head;
        }
      }
      .projectDynamic {
        .base-card;
        height: 510px;
        &Head{
          .base-card-head;
        }
        .projectDiaryTable {
          height: 510px;
          width: 100%;
          table-layout: fixed;
          .projectDiaryTbody {
            overflow-y: auto;
            display: block;
            height: 440px;
            width: 100%;
            &::-webkit-scrollbar{
              width: 3px!important;
            }
            tr {
              display: table;
              width: 100%;
              table-layout: fixed;
            }
          }
        }
        .projectTime,
        .projectName {
          font-size: 14px;
          color: #bdbdbd;
        }
        .projectAction {
          font-size: 14px;
          color: @black_2;
        }
      }
    }
  }
}
</style>
