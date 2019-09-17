<template>
    <div class="projectSetRow">
        <ul class="setMenuList">
            <li v-for="(item,index) in prjectMenu"
                v-if="projectSet[item.role]"
                :class="{checked:index==mIndex}"
                @click="switchSet(index,item.state)"
                :key="index">
                {{item.name}}
                <div></div>
            </li>
        </ul>
        <keep-alive>
            <template v-if="indexShow">
                <component v-if="mIndex === 0&&contractList" style="flex: 1;" :contractList="contractList"
                           :is_edit="true" :projectSetShow="false" :is="componentChecked" :islink="true"></component>
                <component v-else style="flex: 1;" :is_edit="true" :projectSetShow="false" :is="componentChecked"
                           :islink="true"></component>
            </template>
        </keep-alive>
    </div>
</template>
<script>
    import {projectSetIndex, projectSetContract} from '@/axios/modules/project/projectSetting';
    import api from 'api';
    import {mapState} from "vuex";
    import qs from "querystring";
    import Cookies from 'js-cookie';

    import timeSet from "./projectSet/timeSet";
    import peopleSet from "./projectSet/peopleSet";
    import rightsManagement from './projectSet/rightsManagement';

    import mainNative from "../main-components/mainNative.vue";
    import projectEdit from '@/views/epibol/projectManage/addProject';

    export default {
        name: 'projectSetting',
        components: {
            mainNative,
            projectEdit
        },
        data() {
            return {
                indexShow: false,
                contractList: [],
                prjectMenu: [
                     // { name: "项目信息", state: "projectEdit", role: "projectNorm" },
                    {name: "项目工作时间", state: "workTime", role: "projectTitle"},

                ],
                mIndex: 0,
                menuFlag: true,
                componentChecked: timeSet
            };
        },
        mounted() {
            this.init();
            this.setPrjectMenu();
            this.autoH();
        },
        methods: {
            async init(){
                // await projectSetIndex();
                this.indexShow = true;
                this.getContractList();

            },
            async getContractList(){

                let objform = {
                    page_size: 999,
                    company_id: this.companyID.company_id
                };
                let {data} = await projectSetContract(objform);
                if (data.err_code === 0 && data.data){
                    this.contractList = data.data;
                    this.contractList.map((item, index) => {
                        this.$set(item, 'date', `${item.start_time}~${item.end_time}`);
                    });
                }
            },
            autoH() {
                $(".projectSetMenu").height($(window).height() - 160);
            },
            switchSet(index, state) {
                this.mIndex = index;
                switch (state) {
                    case "workTime":
                        this.componentChecked = timeSet;
                        break;
                    case "peopleSet":
                        this.componentChecked = peopleSet;

                        break;
                    case "projectEdit":
                        this.componentChecked = projectEdit;
                        break;
                    case "rightsManagement":
                        this.componentChecked = rightsManagement;
                        break;
                }
            },

            /* 乙方才有协作方 */
            setPrjectMenu() {
                if (JSON.parse(Cookies.get('company')).type === 0) {
                    this.prjectMenu.push({name: "项目协作共享", state: "rightsManagement", role: "projectsetMember"});
                }
            },
        },
        computed: {
            ...mapState({
                projectSet(data) {
                    return data.app.projectSet;
                },
                companyID (data) {
                    return data.paySkip.company;
                }
            })
        }
    };
</script>
<style lang="less">
.projectSetRow{
  display: flex;
  height: 100%;
    min-height: 600px;
  border-right: 1px solid @gray;
  .setMenuList{
    width: 200px;
    height: 100%;
    border-left: 1px solid @gray;
    border-right: 1px solid @gray;
    .checked{
      color: #777777;
      background: #ccf2ec;
    }
    li{
      height: 60px;
      text-align: center;
      line-height: 60px;
      border-bottom: 1px solid @gray;
        cursor: pointer;
    }
  }
}
.projectTimeSet {
  position: relative;
  flex: 1;
    padding-bottom: 120px;
  color: @black_2;
  dl{
    background: #FFFFFF;
    font-size: 14px;
  }
  em {
    font-style: normal;
  }
  dt {
    font-weight: bold;
    font-size: @fs14;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }

  .setTime {

    dd {
      padding: 2px 0;
      border: 1px solid @baseboard;
      height: 48px;
      font-size: 13px;
      span {
        width: 20%;
        display: inline-block;
        text-align: center;
        line-height: 48px;
        // font-size: @fs14;
          .work{
              &:hover {
                  color: @base_dark;
              }
          }
          .rest{
              &:hover {
                  color: #ff8000;
              }
          }
        &:nth-of-type(1) {
          width: 20%;
          .restIcon {
            width: 16px;
            line-height: 16px;
            background: #949494;
            color: #fff;
            display: inline-block;
            text-align: center;
            font-size: 12px;
            border-radius: 2px;
            margin-left: 5px;
          }
        }
        &:nth-of-type(2) {
          width: 38%;
          em {
            font-size: 12px;
          }
          .work {
            background: #f2f2f2;
            border: 1px solid #d7d7d7;
            color: #3BCEB6;
            height: 18px;
            line-height: 16px;
            padding: 0px 52px;
            display: inline-block;
            cursor: pointer;
            border-radius: 2px;

          }
          .rest {
            background: @orange;
            border: 1px solid @orange;
            color: #fff;
            height: 18px;
            line-height: 16px;
            padding: 0px 5px;
            display: inline-block;
            cursor: pointer;
            border-radius: 2px;

          }
          .timeRow {
            // width: 154px;
            display: inline-block;
            text-align: center;
            font-size: 14px;
            .ivu-input{
              padding-left: 2px;
              font-size: 14px;
              color: #5FD4C0;
            }
            .icon{
              color: #5FD4C0;
              // margin-left: 10px;
            }
          }
        }
        &:nth-of-type(3) {
          .timeRow {
            width: 160px;
            display: inline-block;
            text-align: center;
            .ivu-input{

              font-size: 14px;
              padding-left: 2px;
            }

          }
        }
      }
    }
    .title {
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      background: @black_4;
      padding: 0;
      color: @black_3;
      // font-size: 16px;
      span:nth-of-type(2) {
        padding-left: 7px;
      }
      span:nth-of-type(3) {
        padding-left: 7px;
      }
    }
    .work{
      color: @base;
      cursor: pointer;
    }
    .rest{
      color: @orange;
      cursor: pointer;
    }
  }
  .ivu-input-icon-normal + .ivu-input {
    padding-right: 0px;
  }
  .ivu-input {
    border-width: 0px;
  }
  .ivu-input-icon {
    display: none;
  }
  .save{
    // text-align: right;
    position: absolute;
    right: 50px;
    bottom: 50px;
    margin-top: 30px;
    letter-spacing:5px;
  }
  .overtime{
    width: 100%;
    padding: 30px;
    padding-right: 0;
    padding-bottom: 0;
    background: #fff;
    margin-top: 30px;
    h3{
      font-size: 18px;
      font-weight:400;
      position: relative;
      .overtimeAdd{
        position: absolute;
        padding: 0;
        right: 30px;
        border-color: #3BCEB6;
        color: #3BCEB6;
        width: 108px;
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        .ivu-icon{
          font-size: 20px;
          margin-right: 10px;
          margin-top: 5px;

        }

      }
    }
      .overtimeList{
        // padding-top: 30px;
        overflow: hidden;
        li{
          position: relative;
          width: 23%;
          border: 1px solid @baseboard;
          height: 146px;
          margin-bottom: 30px;
          font-size: 14px;
          float: left;
          color: #CDCDCD;
          margin-right: 32px;
          .overtimeList-left{
            width: 96px;
            background: #FAFBFB;
            float: left;
            height: 100%;
            text-align: center;
            padding-top: 28px;
            font-size: 12px;
            .duration{
              font-size: 16px;
              color: #3BCEB6;
              line-height: 52px;
            }
          }
          .overtimeList-right{
            float: left;
            padding-left: 22px;
            padding-top: 20px;
            font-size: 13px;
            p{
              line-height: 38px;
            }
          }
          .overtimeDel{
            position: absolute;
            right: 24px;
            top: 26px;
            font-size: 20px;
            cursor: pointer;
            color: #d1d1d1;
          }
        }
      }
  }
}
</style>
