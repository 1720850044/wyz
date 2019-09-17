<!-- 项目-任务页面 看板等-->
<template>
  <div>
    <!--<main-native>-->
      <!--<div class="main-header-style">-->
        <!--<div class="headerNavBar">-->
          <!--<ul class="setMenuList">-->
            <!--<li @click="switchTabFun(1)" :class="{'checked':TabFlags.oneFlag}">看板<div></div></li>-->
            <!--&lt;!&ndash;领导要求 隐藏甘特图&ndash;&gt;-->
            <!--&lt;!&ndash;li @click="switchTabFun(2)" :class="{'checked':TabFlags.twoFlag}">甘特图<div></div></li&ndash;&gt;-->
            <!--<li id="taskManage" @click="switchTabFun(3)" :class="{'checked':TabFlags.threeFlag}">进度管理<div></div></li>-->
          <!--</ul>-->
        <!--</div>-->
      <!--</div>-->
    <!--</main-native>-->

    <div class="task" v-if="initShow">
        <nav-tav v-if="tabsInfo" :tabList="tabsInfo.tabs" @changeNav="changeNav" ></nav-tav>
      <!-- <div class="task-operation" v-if="companyType == 0">
                <button @click="showExcelTask">Excle导入</button>
                <button @click="showAccretionTask">新增任务</button>
            </div> -->
      <div class="taskMainContainer">
        <!--项目成员进度-->
        <member-schedule  :TabFlags="TabFlags" ></member-schedule>
        <!--主视图:列表/甘特图 -->
        <div class="task-tab">
          <!--看板-->
          <tasklist v-if="TabFlags.oneAndTwoFlag" ref="list" v-on:addNewTask="showAccretionTask" v-on:addExcelTask="showExcelTask"></tasklist>
          <!--甘特图-->
          <template v-if="TabFlags.twoFlag">
            <iframe width="100%" height="800" id="show-iframe" frameborder=0 name="showHere" scrolling=auto src="../../../static/gantt/gantt.html"></iframe>
          </template>
          <!--进度-->
          <v-schedule-plan v-if="TabFlags.threeFlag"></v-schedule-plan>
        </div>
      </div>

      <!-- 新增任务组件  表单选项太多时 超出弹层 点击选择无效 暂时关闭mask-closable -->
      <Modal v-model="isAccretionTask"  :width="modalWidth" :title="$t('project.pro_addtask')" class="taskModel taskAddModel" :mask-closable="false"  :loading="isSaveLoading">

        <div class="taskScheduleTool" >
          <accretiontaskpop ref="add"  class="taskDetailsHeight"  type="newTask" :taskInfos="taskInfos" @clearTaskInfos="clearTaskInfos" @refreshCurrentTaskList='refreshCurrentTaskList'></accretiontaskpop>
          <accordion-collapse  :contractList="contractList"   :shrinkModalShow="shrinkModalShow" >
           <template v-if="contractList" slot="contract"   >
               <li   class="contractList" title="已安排/总数量" v-for="(item,index) in contractList" :key="index">
                 <div class="contractInfo" >
                   <span class="title" :title="item.name">{{item.name}}</span>
                   <span  class="date" v-if="item.description" :title="item.description" >
                   <template v-if="item.description">
                     （{{item.description}}）
                   </template>
                 </span>
                 </div>
                 <Progress style="width: 370px;" :percent="parseInt(item.task_cnt/item.price_cnt*100)>100?100:parseInt(item.task_cnt/item.price_cnt*100)" hide-info ></Progress>
                 <span class="ratio"><span class="complete">{{item.task_cnt}}</span>/{{item.price_cnt}}</span>
               </li>
           </template>
            <div slot="taskState" class="workState">
              <ul class="workStateUl">
                <li class="workStateList" v-for="(item,index) in memberWork" :key="index">
                  <div style="min-width: 120px;">
                    <div class="taskInfo">
                      <div class="taskInfoData base" title="本项目任务总数">
                        <!--<Progress  :percent="item.task_count" hide-info/>-->
                        <Progress  :percent="100" hide-info/>
                        <span>{{item.task_count}}</span>
                      </div>
                      <div class="taskInfoData blue" title="其他项目任务总数">
                        <!--<Progress :percent="item.other_task_count" hide-info/>-->
                        <Progress :percent="100" hide-info/>
                        <span>{{item.other_task_count}}</span>
                      </div>
                      <div class="taskInfoData golden" title="负荷率（安排任务时间/总工作时间）">
                        <Progress :percent="item.work_rate" hide-info/>
                        <span>{{item.work_rate}}%</span>
                      </div>
                    </div>
                    <div class="userInfo">
                      <img class="headimg"
                           :src="`${GLOBAL.imgDomain}/index.php?r=system/user/get-headimage&id=${item.user_id}`"
                           alt="">
                      <span class="userName">{{item.realname}}</span>
                    </div>
                  </div>
                  <timeline v-if="item.dateList && item.task_format" :id="'timeline'+index" style="margin-left: 30px;"  :dateList="item.dateList" :taskFormat="item.task_format" :key="index"></timeline>
                </li>
              </ul>
            </div>
          </accordion-collapse>
            <p class="shrinkButton" @click="shrinkModal"  >
                <Icon v-if="shrinkModalShow" type="chevron-left"></Icon>
                <Icon v-else type="chevron-right"></Icon>
            </p>
        </div>

        <div  slot="footer">
         <div>
           <Button type="text" size="large" @click="cancelFun">取消</Button>
           <Button type="primary" size="large" @click="saveAccretionTaskPop">创建任务</Button>
         </div>
        </div>
      </Modal>
      <!-- excel解析组件 -->
      <Modal v-model="isExcelTask" :title="$t('project.pro_bulkImportTask')" class="taskModel " width="1000"  @on-cancel="excelCancel" :mask-closable="false">
        <div class='excelModal'>
          <excel-modal ref="upload" @refreshTaskList="refreshCurrentTaskList"></excel-modal>
        </div>
        <div slot="footer" style="  height: 20px"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import {pjTaskIndex, pjTaskContract, pjTaskSchedule, pjTaskMemberTime} from '@/axios/modules/project/projectTask';
  import {mapState, mapMutations } from "vuex";
  import qs from "querystring";
  import Cookies from "js-cookie";
  import api from "api";
  import date from 'date';

  import tasklist from "./task/tasklist";
// import taskinfopop from "./task/taskInfoPop/taskInfoPop";
  import accretiontaskpop from "./task/taskDetails";
  import ExcelModal from "./components/excel";
  import vSchedulePlan from "./schedule";
  import mainNative from "../main-components/mainNative.vue";
  import memberSchedule from './task/memberSchedule';
  import Timeline from "../../components/timeline.vue";
  import AccordionCollapse from "../../components/accordionCollapse.vue";
  import NavTav from "../../components/navTav";

  export default {
      components: {
          NavTav,
          AccordionCollapse,
          Timeline,
          tasklist,
    // taskinfopop,
          accretiontaskpop,
          ExcelModal,
          vSchedulePlan,
          mainNative,
          memberSchedule,
      },
      computed: {
          ...mapState({
              clubTaskManagement(value){
                  return value.app.clubTaskManagement;
              },
          }),
      },

      data() {
          return {
              tabsInfo: {
                  tabs: [
                {tab: i18n.t('project.pro_spectaculars'), name: 'tasklist', },
                // {tab:'甘特图',name:'gantt',},
                {tab: i18n.t('project.pro_scheduleManagement'), name: 'taskSchedule', },
                  ],
              },
              initShow: false,
              modalWidth: 1150,
              shrinkModalShow: true,
              taskInfos: {},
              contractList: [],
              memberWork: null,
              projectName: "",
              taskMain: {
                  child: null,
                  name: ""
              },
              TabFlags: {
                  oneFlag: true,
                  twoFlag: false,
                  threeFlag: false,
                  oneAndOneFlag: true,
        // JSON.parse(Cookies.get('company')).type == 1 ? false : true,
                  oneAndTwoFlag: true
              },
              addInput: false,
              aloneActive: "",
              teamActive: "",
              memberItemActive: "",
              itemActive: "",
              editShow: true,
              ChildMsgData: null, // 所有成员列表
              mainTaskList: null, // 主成员列表
              memberMsgData: [],
              projectId: sessionStorage.getItem("projectID"),
              companyMember: null,
              subProjectManager: null,
              subProjectName: null,
      // isShowTaskDetails: true,
              isSaveLoading: true,
              taskId: 0,
              isExcelTask: false,
              isAccretionTask: false,
              projectInfo: {},
              userID: sessionStorage.userId,
              companyType: JSON.parse(Cookies.get("company")).type,
              needGuideData: null

          };
      },
      mounted() {
          this.init();
    // this.componentSchedulePrice();
    // this.memberTaskSchedule();
          this.autoH();
          this.initTaskMain();
    // this.$bus.on("refreshCurrentTaskList", () => {
    //   this.refreshCurrentTaskList();
    // });
          this.setUserStatus(null);

    /* 成员进度 */
    /* 协作权限 */
          this.$store.dispatch('getCollaboration');
      },
      methods: {
          ...mapMutations(["setProjectInfoDetails", "setDetailAll", "setUserStatus"]),
          async init(){
              let data = await pjTaskIndex();
              this.initShow = true;
              this.$nextTick(() => {
                  setTimeout(() => {
                      if (this.$refs.list){
                          this.$refs.list.initGuide(data);
                      }
                  });
          // this.$refs.list.initGuide(data);
              });
          },
          clearTaskInfos(){
              this.taskInfos = {};
          },
          componentSchedulePrice() {
              return new Promise(async (resolve, reject) => {
                  if (sessionStorage.getItem('needGuideData')) {
                      if (sessionStorage.getItem('needGuideData') === 'true'){
                          this.needGuideData = true;
                      }
                  }
                  let objForm = {project_id: this.projectId, needGuideData: this.needGuideData ? true : null};
                  let {data} = await pjTaskContract(objForm);
                  if (data.err_code === 0 && data.data) {
                      this.contractList = data.data;
                      resolve(data);
                  }

              });
          },
          async memberTaskSchedule() {
              if (sessionStorage.getItem('needGuideData')) {
                  if (sessionStorage.getItem('needGuideData') === 'true'){
                      this.needGuideData = true;
                  }
              }
              let objForm = {project_id: this.projectId, needGuideData: this.needGuideData ? true : null};
              let {data} = await pjTaskSchedule(objForm);
              if (data.err_code === 0 && data.data) {
                  this.memberWork = data.data;
                  await this.memberWork.map(async (item, index, arr) => {
                      item.task_format = item.task_format;
                      const startTime = date.getFormattingTime(item.start_time);
                      const endTime = date.getFormattingTime(item.end_time);

                      this.$set(item, 'dateList', await this.getComponentDate(startTime, endTime));
                  });
              }
          },
          async getComponentDate(startTime, endTime) {
              let objForm = {start_time: startTime, end_time: endTime};
              let {data} = await pjTaskMemberTime(objForm);
              if (data.err_code === 0 && data.data){
                  return data.data;
              }
          },
    // 新建任务更新时间轴
          async changeTaskTimeline(){
              this.memberTaskSchedule();
              let data = await this.componentSchedulePrice();
              if (data.guide === 'createTask'){
                  this.bubble();
              }
              // this.getComponentDate();
          },
          excelCancel() {
              this.$bus.emit("clearExcleData");
          },

          autoH() {
              let oIframe = document.getElementById("show-iframe");
              let deviceHeight = document.documentElement.clientHeight - 190;
              if (oIframe) {
                  oIframe.style.width = 100 + "%";
                  oIframe.style.height = deviceHeight + "px";
              }
          },
          shrinkModal() {
              this.modalWidth = this.shrinkModalShow ? 500 : 1150;
              const fn = () => {
                  this.shrinkModalShow = !this.shrinkModalShow;
              };
              if (this.shrinkModalShow === false) {
                  setTimeout(() => {
                      fn();
                  }, 300);
              } else {
                  fn();
              }
          },
    //初始化任务相关参数
          initTaskMain() {
              sessionStorage.TaskID = 0;
          },
    //刷新当前任务列表
          refreshCurrentTaskList() {
              this.isAccretionTask = false;
              this.$refs.list.refreshTaskList();
          },
    // //编辑后关闭modal
    // closeTaskDetails() {
    //   this.isShowTaskDetails = false;
    // },
    //取消新建任务弹窗
          cancelFun() {
              this.isAccretionTask = false;
              this.isSaveLoading = false;
      // this.$refs.add.clearAllData();
          },
    //保存新建任务弹窗
          async saveAccretionTaskPop() {
        //创建任务时没有任务ID 传False
              let result = await this.$refs.add.saveTaskDetails(false);
              if (result) {
                  this.isSaveLoading = false;
                  this.isAccretionTask = false;
        // this.$Message.success("创建任务成功");
        // this.$refs.add.clearAllData();
              } else if (result == false) {
                  setTimeout(() => {
                      this.isSaveLoading = false;
                      this.isAccretionTask = false;
          // this.$Message.error("创建任务失败");
                  }, 1000);
              }
          },
    //EXCEL添加
          showExcelTask() {
              this.isExcelTask = true;
              this.$refs.upload.isShowPage(true);
          },
    //添加任务
          async showAccretionTask(index) {

              this.isAccretionTask = true;
              this.changeTaskTimeline();

      // this.$refs.add.clearAllData();
      // this.$refs.add.accretionTaskPop(this.projectInfo);
          },
          changeNav({index}){
              this.switchTabFun(index === 0?1:3);
          },
          bubble(){
              let text = this.$lau.bubble.createTask;
              this.$nextTick(() => {
                  let defaultOptions = [
                      {
                          id: 'newTaskContract',
                          position: 'right',
                          title: text[0].title,
                          content: text[0].content,
                          relative: 'body',
                      },
                      {
                          id: 'memberPlan',
                          position: 'right',
                          title: text[1].title,
                          content: text[1].content,
                          relative: 'body',
                      },
                  ];
                  let fn = ((item) => {
                      if (item.id === 'memberPlan'){
                          this.contractList = [];
                          this.changeTaskTimeline();
                      }
                  });
                  setTimeout(() => {
                      this.$bubble(defaultOptions, fn);
                  }, 300);
              });
          },
    //初始化任务列表的项目信息
          setProjectInfo(projectInfo) {
              this.projectInfo = projectInfo;
          },
    //切换TAB
          switchTabFun(index) {
              switch (index) {
                  case 1:
                      this.TabFlags.oneFlag = true;
                      this.TabFlags.twoFlag = false;
                      this.TabFlags.threeFlag = false;
                      this.TabFlags.oneAndTwoFlag = true;
                      this.TabFlags.oneAndOneFlag = true;
          // this.companyType == 1 ? false : true
                      break;
                  case 2:
                      this.TabFlags.oneFlag = false;
                      this.TabFlags.twoFlag = true;
                      this.TabFlags.threeFlag = false;
                      this.TabFlags.oneAndTwoFlag = false;
                      this.TabFlags.oneAndOneFlag = false;
                      break;
                  case 3:
                      this.TabFlags.oneFlag = false;
                      this.TabFlags.twoFlag = false;
                      this.TabFlags.threeFlag = true;
                      this.TabFlags.oneAndTwoFlag = false;
                      this.TabFlags.oneAndOneFlag = false;
                      break;
                  default:
                      this.TabFlags.oneFlag = true;
                      this.TabFlags.twoFlag = false;
                      this.TabFlags.threeFlag = false;
                      this.TabFlags.oneAndTwoFlag = true;
                      this.TabFlags.oneAndOneFlag = this.companyType != 1;
              }
          },

      }
  };
</script>
<style lang="less" >
.task {
  position: relative;
  height: 100%;

  .ivu-tabs,
  .ivu-tabs-content-animated {
    height: 90%;
  }
  .taskMainContainer {
    // margin: 10px 0;
    display: flex;
    justify-content: space-between;
    /*height: 100%;*/
    .ivu-tabs .ivu-tabs-content-animated {
      margin-top: 60px;
    }
    .ivu-tabs-nav-container {
      height: 42px !important;
    }

    .ivu-tabs-ink-bar {
      margin-left: 16px;
      /*height: 6px !important;*/
      background: @green !important;
    }
    .ivu-tabs-tab {
      padding: 8px 6px;
      margin-left: 16px;
      margin-right: 0 !important;
      font-size: 12px;
      line-height: 32px;
      color:@black_3;
      &:hover {
        color: #48c5b5;
      }
    }
    .ivu-tabs-tab-active {
      color: #48c5b5;
    }
    .projectInfoContainer {
      // padding: 20px 4px;
      height: 670px;
      overflow: auto;
      background: #fff;
    }
    .eidtList {
      overflow-x: hidden;
      /*height: 718px;*/
      height: 90%;
      border-top: 0;
      overflow-y: auto;
      background: #fff;
      .text {
        color: #bdbdbd;
      }
    }

    .taskListContainer {
      // height: 760px;
      /*background: #fff;*/
    }
    .activeTask {
      border-top: 1px solid @green;
      border-bottom: 1px solid @green;
    }
  }
  .projectPlanButton {
    text-align: right;
    background: #fff;
  }
}

.task-tab {
  width: 100%;
  overflow: hidden;
}

.task-operation {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 13px;
  z-index: 2;
  button {
    margin-left: 10px;
    cursor: pointer;
    color: #fff;
    border: none;
    outline: none;
    padding: 8px 10px 8px 30px;
    font-size: 14px;
    border-radius: 3px;
    &:nth-child(1) {
      background: url("./components/imgEditorTwo/images/taskIcos.png") #3bceb6
        no-repeat left center;
      background-position: 10px -31px;
    }
    &:nth-child(2) {
      background: url("./components/imgEditorTwo/images/taskIcos.png") #3bceb6
        no-repeat left center;
      background-position: 10px 10px;
    }
  }
}

.taskAddModel {
    .shrinkButton{
        position: absolute;
        top: 50%;
        right: 5px;
        width: 18px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        transform: translateY(-50%);
        color: @white;
        background: @base;
        border-radius: 0 7px 7px 0;
    }
  .ivu-modal-wrap{
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
  }
  .ivu-modal{
    top:128px;
      transition: all .5s;
  }
  .ivu-modal-body {
    padding: 0;
  }
}
.taskModel {
  .ivu-modal-content {
    // margin-top: -40px;
    // .ivu-modal-close {
    //   right: 30px;
    //   top: -2px;
    //   font-size: 40px;
    // }
    .ivu-modal-body {
      // margin-top: 10px;
      h1 {
        background: url("../../assets/images/headBarBGimg.png") no-repeat;
        height: 60px;
        line-height: 60px;
        border-radius: 4px 4px 0px 0px;
        font-size: 16px;
        color: #fff;
        font-weight: normal;
        padding-left: 20px;
        // .ivu-modal-header;
      }
      .taskDetailsContainer {
        padding: 20px 30px 10px 30px;
        .borBotm {
          // padding: 0;
        }
        .ivu-form-item-label {
          color: #cacaca;
        }
        .btn {
          position: relative;
          // color: #898989;
          font-size: 12px;
        }
        .shade {
          // background: @baseboard;
          border: 0;
          //  height: 100px;
          .ivu-icon-android-upload {
            display: block;
            font-size: 32px;
            color: #3bceb6;
            margin-bottom: -22px;
            /*padding-top: 10px;*/
          }
        }
        .remark-item {
          height: 62px;
          .remark {
            .ivu-input {
              height: 62px !important;
              margin-bottom: 0 !important;
            }
          }
        }
      }
    }
    .ivu-modal-footer {
      border: 0;
      // padding: 10px 30px 20px;
      // padding-bottom: 30px;
      .ivu-btn-large {
        width: 120px;
        height: 42px;
      }

    }
  }
}

.taskScheduleTool {
    display: flex;
    margin-top: 5px;
    .taskDetailsHeight {
        height: 517px;
        overflow-y: auto;
        width: 480px;
        min-width: 480px;
    }

  .contractList {
    display: flex;
    margin-top: 30px;
    justify-content: space-around;
    align-items: center;
    .contractInfo{
      display: flex;
      min-width: 190px;
      margin-right: 20px;
      .title{
        min-width: 40px;
        text-align: left;
        color: @black_2;
      }
      .date{
        min-width: 150px;
        max-width: 150px;
        color: #c1c1c1;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }

    .ratio{
      width: 60px;
      text-align: right;
      color:@black_2 ;
      .complete{
        color: @base;
      }
    }
    .ivu-progress-inner{
      height: 22px !important;
    }
    .ivu-progress-bg{
      height: 22px !important;
      background: @base;

    }
  }

  .workStateList {
    display: flex;
    margin: 20px 0 10px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eef1f2;
    .taskInfo{
      display: flex;
      justify-content: space-between;
      .taskInfoData{
        max-width: 30px;
        min-width: 30px;
      }
      .base{
        color: @base;
        .ivu-progress-success .ivu-progress-bg{
          height: 9px !important;
          background:@base;
        }
      }
      .blue{
        color: #7cbefc;
        .ivu-progress-success .ivu-progress-bg{
          height: 9px !important;
          background: #7cbefc;
        }
      }
      .golden{
        color: #ffb617;
        .ivu-progress-success .ivu-progress-bg{
          height: 9px !important;
          background: #ffb617;
        }
        .ivu-progress-bg{
          height: 9px !important;
          background: #ffb617;
        }
      }
    }
    .userInfo{
      display: flex;
      margin-top: 20px;
      color: @black_2;
      justify-content: space-around;
      align-items: center;
      .headimg{
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      .userName{
        width: 70px;
      }
    }
  }
}

</style>

