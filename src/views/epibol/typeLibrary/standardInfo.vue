<template>
  <Content class="taskClassLibrary">
    <div class="taskClassLiHeader">
      <div class="headerTitle"  >
        <section v-if="!project" class="taskTypeName">
          <div v-if="!disabled" v-show="boxShow" class="taskTypeNameBox">
            <div v-for="(item,index) in TaskIdentity" :key="index" class="standard-label">
              <img :src="item.url" @click="secMarkers(item,'icon')" :class="{'iconColor':identification.iconBorder === item.id}" class="identification" width="30" height="36">
              <div @click="secMarkers(item)" class="identification" :class="{'iconColor':identification.iconColor === item.color}">
                <p class="signColor" :style="{background:item.color}"></p>
              </div>
            </div>
            <Button @click="addMarkers(true)" type="text">{{$t('lang.lang_ok')}}</Button>
            <Button @click="addMarkers(false)" type="text">{{$t('lang.lang_cancel')}}</Button>
          </div>
          <span @click="showMarkers" class="btn">
            <img v-if="identification.icon" :src="identification.icon" :style="{filter: `drop-shadow(${identification.iconColor?identification.iconColor:'black'} 0px -30px)`,width:'30px',color:identification.color}" style="height:36px;margin-top:30px;">
            <template v-else v-if="!disabled">{{$t('project.pro_discernIcon')}}</template>
          </span>
        </section>
        <Input :placeholder="$t('project.pro_newNormative')" v-model="typename.typename" style="" :disabled="disabled"></Input>
        <Select  v-model="abilityVal" :placeholder="$t('project.pro_selectNormative')"  style="width:120px;margin-left:10px">
          <Option v-for="item in abilityList" :value="item.id" :key="item.id" >{{ item.name }}</Option>
        </Select>
      </div>
      <div v-if="isSubmit||project">
        <Button type="text" @click="deleteStandard" class='standardOperateButtonDel'>{{$t('lang.lang_delete')}}</Button>
        <!--<Button v-if="!project&&!temporary" @click="moveStandard" type="primary" class='standardOperateButton'>移动</Button>--><!--临时隐藏-->
        <Button id="librarySaveButton" @click="submitTaskClas" type="primary" :disabled="saveDis" class='standardOperateButton'>{{$t('lang.lang_save')}}</Button>
      </div>
      <p v-else style="color: orange;">{{$t('project.pro_notChangeNormative')}}</p>
    </div>

    <Form class="taskClassLiContener" :model="formLeft" label-position="left" :label-width="100">
      <Row style="display: flex;">
        <Col class="taskclass-guide-main" span="16" >
        <span class="titleH2">{{$t('project.pro_productionFlow')}}</span>
        <!--流程核心-->
        <div class="stepCentral">
          <Steps v-if="fstandard" :current="current" direction="vertical" size="small">
            <Step v-for="(step,index) in fstandard" :id="index === 0 ? 'stepContainer' : index === fstandard.length-1 ? 'stepContainerLa':''"   class="stepContainer" :key="index">
              <div class="stepRight">
                <!--步骤名称-->
                <div class="stepRightBox">
                  <!-- <span v-show="!step.flowTIlteShow" @click="step.flowTIlteShow = !step.flowTIlteShow" class="title" style="cursor: pointer">{{step.stage_name}}
                                    </span>
                                    <input v-show="step.flowTIlteShow" @blur="step.flowTIlteShow = !step.flowTIlteShow" v-model="step.stage_name" class="title" type="text" /> -->
                  <input v-model="step.stage_name" :disabled="disabled" class="title" type="text" prefix='' />
                  <!--<CheckboxGroup class="review" v-if="project" v-model="step.review" :key="index">-->
                    <!--<Checkbox :label="1">内部审核</Checkbox>-->
                    <!--<Checkbox v-if="contract||collaboration" :label="0">客户审核</Checkbox>-->
                  <!--</CheckboxGroup>-->

                  <div v-if="project" :id="index === 0 ? 'inSideSwitch' : ''" >
                    <Checkbox   v-model="step.is_inside_audit" :true-value="1" :false-value="0" :key="index">{{$t('project.pro_internalAudit')}}</Checkbox>
                    <Checkbox  v-if="collaboration || is_collaboration" v-model="step.is_client_audit" :true-value="1" :false-value="0" :key="index">{{$t('project.pro_externalAudit')}}</Checkbox>
                  </div>
                  <p class="acmSign" v-if="fstandard.length === index+1">{{$t('project.pro_deliveryPeriod')}}</p>
                  <Icon class="deleteStepIcon" v-if="!disabled" @click.native="deleteStep(index,step)" type="close-circled"></Icon>
                </div>
                <!---->
                <div>
                  <ul class="stepsUl">
                    <li class="stepsList" v-for="(list,i) in step.require" :key="i">

                      <Input v-model="list.text" :placeholder="$t('project.pro_enterStageClaim')" :disabled="disabled" class="borderBottomSty"></Input>
                      <div class="priorityContainer">
                        <p  v-if="list.level !== '0'" class="priority priorityExhibition" :class="`priority${list.level}`">
                          {{list.level | priorityValue}}</p>
                        <div v-if="!disabled" class="priorityList">
                          <p class="priority priority3" @click="editPriority('3',index,i)">{{$t('lang.lang_height')}}</p>
                          <p class="priority priority2" @click="editPriority('2',index,i)">{{$t('lang.lang_mid')}}</p>
                          <p class="priority priority1" @click="editPriority('1',index,i)">{{$t('lang.lang_low')}}</p>
                        </div>
                      </div>
                      <!--规范列表-->
                      <Taskselect :isSubmit="isSubmit" :project="project" :parentIndex="index" :chilenIndex="i" :module="fstandard" :normName="list.norm_name" :dataList="norms" :disabled="disabled" v-on:Selectdata="updataSelect" v-on:addNormsFun="addNorms" :callbackStatus="callbackStatus"></Taskselect>
                      <Icon v-if="!disabled" type="trash-a" class="delIcon" @click="delFlowNorm(index,i)" :disabled="disabled"></Icon>
                    </li>
                    <!--审核选项-->
                    <!-- <Select v-if="project&& Array.isArray(step.review) " v-model="step.review" multiple style="position:absolute;top:-20px;right:20px;width:212px;">
                                            <Option v-for="item in reviewList" :value="item.id" :key="item.id">
                                                {{ item.label }}
                                            </Option>
                                        </Select> -->
                  </ul>
                  <!--流程info增加-->
                  <div class="stepsUl" >
                    <Icon  v-show="!step.show" v-if="!disabled" class="addSteps" @click.native="stepAdd(index)" type="ios-plus-outline" style="margin-left:5px;" :disabled="disabled"></Icon>
                  </div>
                </div>
              </div>
            </Step>
          </Steps>
          <!--<div>-->
          <Icon id="addSteps"   @click.native="addSteps" v-if="!disabled" style="font-size:38px;color: #3bceb6;cursor: pointer;" type="plus-circled" :disabled="disabled"></Icon>
          <!--</div>-->
        </div>
        </Col>
        <Col span="8" class="taskclass-guide-right"  id="taskclassGuideRight">
        <div class="contenerRight">
          <ul>
            <li>
              <!--内容规范-->
              <slot name="item"></slot>
            </li>
            <li>
              <!--制作规范-->
              <p class="titleFloat">
                <span class="titleH2">{{$t('project.pro_productionNormative')}}</span>
                <span class="titleContent">({{$t('project.pro_commonNormative')}})</span>
                <Icon v-if="!fileShow&& !disabled" class="addSteps" @click="addFileat" type="ios-plus-outline"></Icon>
              </p>
              <template v-if="pstandard && pstandard.length>0">
                <Row v-for="(item,index) in pstandard" :key="'pstandard'+index" class="fileAttr">
                  <Col span="8">
                    <AutoComplete class='standardName' v-model="item.name" :placeholder="$t('project.pro_normativeName')" :clearable="!disabled" :disabled="disabled">
                    </AutoComplete>
                  </Col>
                  <Col span="16">
                    <AutoComplete class='standardContent' v-model="item.values" :placeholder="$t('project.pro_normativeDescribe')" :clearable="!disabled" :disabled="disabled">
                    </AutoComplete>
                  </Col>
                  <Icon v-if="!disabled" @click.native="removeFileat(index)" type="trash-a" class="delIcon" :disabled="disabled"></Icon>
                </Row>
              </template>
            </li>
            <li>
              <!--文稿文件规范-->
              <p class="titleFloat">
                <span class="titleH2">{{$t('project.pro_fileNormative')}}</span>
                <span class="titleContent">({{$t('project.pro_subUserFileNormative')}})</span>
                <Icon v-if="!OtherfileShow&&!disabled" class="addSteps" @click="addJunctShow" type="ios-plus-outline"></Icon>
              </p>
              <template v-if="tstandard && tstandard.length>0">
                <div v-for="(item,index) in tstandard" :key="index" class="attachingTask" style="display: flex">
                  <Col span="8">
                    <AutoComplete  class='standardName' v-model="item.name" :placeholder="$t('project.pro_normativeName')" :clearable="!disabled" :disabled="disabled"></AutoComplete>
                  </Col>
                  <Col span="16">
                    <AutoComplete class='standardContent' v-model="item.values" :placeholder="$t('project.pro_normativeDescribe')" :clearable="!disabled" :disabled="disabled"></AutoComplete>
                  </Col>
                  <Icon v-if="!disabled" @click.native="delOtherfile(index)" type="trash-a" class="delIcon" :disabled="disabled"></Icon>
                </div>
              </template>
            </li>
          </ul>
        </div>
        </Col>
      </Row>
    </Form>
    <!--规范增加-->
    <!--<h4 :style="{paddingBottom:'10px', marginTop:'20px'}">编辑规范</h4>-->
    <Modal v-model="modal1" @on-ok="addNorms">
      <section>
        <div style="margin-bottom: 5px">
          <span>{{$t('project.pro_addNormativeTags')}}&emsp;：&emsp;</span>
          <Input v-model="normValue" :placeholder="$t('project.pro_addTags')" style="width: 200px"></Input>
        </div>
      </section>
    </Modal>
    <Modal v-model="modal2" @on-ok="delNorms">
      <div>{{$t('lang.lang_delete')}}</div>
      <Select v-model="delnormsValue" size="small" class="standard">
        <Option v-for="item in norms" :label="item.name" :value="item.id" :key="item.id">
          {{ item.name }}
        </Option>
      </Select>
    </Modal>
    <!-- 移动 -->
    <Modal v-model="moveShow" :title="$t('lang.lang_move')" @on-ok="moveOk">
      <Select v-model="moveValue" style="width:200px">
        <Option v-for="(item,index) in treeData" :value="item.cate_id" :key="index">
          {{item.name}}
        </Option>
      </Select>
    </Modal>
  </Content>

</template>
<script>
  import {taskTypeUpdate} from '@/axios/modules/project/projectTaskType';

  import { mapState, mapMutations } from "vuex";
  import qs from "querystring";
  import api from "api";
  import Icon from "iview/src/components/icon/icon";
  import Caspanel from "iview/src/components/cascader/caspanel";
  import typeList from "./typeList";
  import Taskselect from "./Taskselect";

//import canvas2html

  export default {
      name: 'standardInfo',
      components: {
          typeList,
          Caspanel,
          Icon,
          Taskselect
      },
      props: {

          project: {
              type: Boolean,
              default: false
          },
          contract: {
              type: Number,  // 是否需要外审
              default: 0,
          },
          attrContent: {
              type: Array
          },
          ruleList: {
              type: Array
          }
      },
      data() {
          return {
              abilityList: null,
              abilityVal: null,
              saveDis: false,
              temporary: false,
              projectFlowNum: null,
              moveValue: "",
              moveShow: false,
              info: null,
              expandStatus: sessionStorage.expandStatus?JSON.parse(sessionStorage.expandStatus):0,
              expandDetails: sessionStorage.getItem("expandDetails"),
              curreSelect: {
                  id: null,
                  val: null
              },
              disabled: true, // 禁用
              updateId: null, //更新Id
              goinfo: null, // 新增id

              delnormsValue: "",
              isSubmit: false, // 提交按钮

              reviewList: [{ id: 0, label: i18n.t('project.pro_externalAudit') }, { id: 1, label: i18n.t('project.pro_internalAudit') }],
              fstandard: [], // 流程规范
              pstandard: [
                  {
                      name: "",
                      values: "",
                      type: "progress"
                  }
              ], // 制作规范
              tstandard: [
                  {
                      name: "",
                      values: "",
                      type: "file"
                  }
              ], // 文件规范
              typename: {
                  typename: "",
                  icon: "",
                  color: ""
              }, // 规范名称

      /*调试接口添加*/
              norms: [],
              modal1: false,
              modal2: false,
              identification: {
                  iconBorder: null,
                  iconColor: null, // 颜色
                  icon: null, // url路径
                  color: null
              },
              TaskIdentity: [],
              stepInfoList: {
                  text: "",
                  type: "",
                  level: "3"
              },
              fileShow: false,
              fileAddName: "",
              fileAddMain: "",
              OtherfileShow: false,
              OtherfileName: "",
              OtherfileMain: "",
              boxShow: false,
              normValue: "",

      // 以上是后面测试添加
              current: 0,
              formLeft: {},
              accesData: [],
              reqData: [],
              attrFile: [{ config_name: "", value: "" }],
              otherfile: [{ config_name: "", value: "" }],

      //添加新标签完成后的回调状态
              callbackStatus: false,
              timeId: null,
              originalLenght: null,
          };
      },
      mounted() {
          this.initGuide();
          this.contractAbilityList();

    // 获取规范列表
          this.getNormslist();

    // icon列表
          if (!this.project) {
              this.iconList();
          }

    /*进入详情*/
          this.$bus.on("typesDetail", data => {
              this.updateId = data.id;
              this.newtaskTypesDetail(data);
              this.expandDetails = sessionStorage.expandDetails;
              this.isDisabled();

      // 提交变为更新
              this.goinfo = null;
              this.temporary = false;
          });

    // 新建详情
          this.$bus.on("addType", data => {
      // 获取树状图上个节点信息
              this.addType(data);
              this.temporary = true;
          });

    // 项目类型库添加
          this.$bus.on("projectInfo", data => {
              this.addInfo(data);
              this.tabsTypeId = data.id;

          });
    // 清空
          this.$bus.on("projectInfoClear", data => {
              this.clearInfo();
          });
    // 是否编辑
          this.isDisabled();

    //    动态设置高度
    // $(".taskClassLiContener").height($(window).height() - 275);
          this.$store.dispatch('getCollaboration');
      },
      destroyed() {
          this.$bus.$off('typesDetail');
          clearInterval(this.timeId);
      },
      methods: {
          ...mapMutations(["setDefId"]),
    // 初始化获取是否引导
          async initGuide() {
              if (this.project){
                  return;
              }
              let {data} = await api.specificationLibraryIndex();
              if (data.err_code === 0 ){
                  if (this.defId) {
                      this.updateId = this.defId;
                      await this.newtaskTypesDetail("default");
                  }
                  if (data.guide === "standardLibrary"){
                      setTimeout(() => {
                          this.$guide().setOptions(this.$CONSTANT.guideOptions)
                    .addSteps([
                        {
                            element: document.querySelector('.typelib-guide-left'),
                            intro: this.$lau.guide_words.k39,
                            position: 'right',
                            disableInteraction: '1',
                            start: '1',
                            total: '3'
                        },
                        {
                            element: document.querySelector('.taskclass-guide-main'),
                            intro: this.$lau.guide_words.k40,
                            position: 'bottom-middle-aligned',
                            disableInteraction: '1',
                            total: '3'
                        },
                        {
                            element: document.querySelector('.taskclass-guide-right'),
                            intro: this.$lau.guide_words.k41,
                            position: 'bottom-middle-aligned',
                            disableInteraction: '1',
                            total: '3'
                        }])
                    .onskip(() => {
                      // this.bubble();
                    })
                    .oncomplete(async () => {
                      // this.bubble();
                    }).start();
                      });
                  } else if (data.guide === 'criterion'){
          // this.bubble();
                  }
              }
          },
          bubble(){
      // let text = this.$lau.bubble.projectScheduleTool
              let text = this.$lau.bubble.specificationLibrary;
              this.$nextTick(() => {
                  let defaultOptions = [
                      {
                          id: 'addSteps',
                          position: 'right',
                          title: text[0].title,
                          content: text[0].content,
                          relative: 'body',
                      },
                      {
                          id: 'stepContainer',
                          position: 'bottom',
                          title: text[1].title,
                          content: text[1].content,
                          relative: 'body',
                      },
                      {
                          id: 'stepContainerLa',
                          position: 'top',
                          title: text[2].title,
                          content: text[2].content,
                          relative: 'body',
                      },
                      {
                          id: 'librarySaveButton',
                          position: 'left',
                          title: text[3].title,
                          content: text[3].content,
                          relative: 'body',
                      },
                  ];
                  let disabled = this.disabled;
                  let isSubmit = this.isSubmit;
                  let fn = ((item) => {
                      if (item.id === 'librarySaveButton'){
                          this.disabled = disabled;
                          this.isSubmit = isSubmit;
                      }
                  });
                  this.disabled = false;
                  this.isSubmit = true;
                  setTimeout(() => {
                      this.$bubble(defaultOptions, fn);
                  }, 300);
              });
          },

      /* 获取类型列表 */
          async contractAbilityList(){
              let {data} = await api.contractAbilityList();
              if (data.err_code === 0 && data.data){
                  this.abilityList = data.data;
              }
          },
          updataSelect(data) {
              if (data.falg) {
                  this.fstandard = data.data;
              } else {
                  this.curreSelect.id = data.id;
                  this.curreSelect.val = data.val;
              }
          },

    /*获取规范列表*/
          async getNormslist() {
              let { data } = await api.getNorms();
              if (data.err_code === 0) {
                  this.norms = data.data;
              } else {
                  this.$Message.error(data.err_message);
              }
          },

    /*获取图标库*/
          async iconList() {
              let { data } = await api.getIconList();

              if (data.err_code === 0) {
                  if (data.data) {
                      data.data.map((item, index) => {
                          switch (index) {
                              case 0:
                                  item.color = "#4ea397";
                                  break;
                              case 1:
                                  item.color = "#22c3aa";
                                  break;
                              case 2:
                                  item.color = "#7bd9a5";
                                  break;
                              case 3:
                                  item.color = "#d0648a";
                                  break;
                              case 4:
                                  item.color = "#f58db2";
                                  break;
                          }
                      });
                  }
                  this.TaskIdentity = data.data;
              } else {
                  this.$Message.error(data.err_message);
              }
          },

    /*提交*/
          submitTaskClas() {

      /*项目级*/
              if (this.project) {
                  this.submitProject();
                  return false;
              }

      /*公司级*/
              this.submitCompany();
          },

    /*项目级提交*/
          async submitProject() {
              this.saveDis = true;
              let obj = {
                  id: this.tabsTypeId,
                  name: this.typename.typename,
                  stage: JSON.stringify(this.fstandard),
                  standard: JSON.stringify(
          this.tstandard
            .concat(this.pstandard)
            .concat(this.ruleList)
            .concat(this.attrContent)
        ),
                  icon: this.identification.iconBorder,
                  color: this.identification.iconColor,
                  ability_id: this.abilityVal,
              };
      // let res = await api.taskprojectCateUpdate(obj);
              let {data} = await taskTypeUpdate(obj);
              let res = {data};
              this.saveDis = false;
              if (res.data.err_code === 0) {

                  this.$Message.success(i18n.t('project.pro_saveSucceed'));
                  this.$emit("update");
                  this.$bus.emit("treeUpdate"); // 刷新左侧树状图
              } else {
                  this.$Message.error(res.data.err_message);
              }
          },

    /*公司级提交*/
          async submitCompany() {
              let url = this.$GLOBALAPI.task_task_typeadd;
              let obj = null;

      // 点击添加的情况
              if (this.goinfo) {

        /*新增*/
                  obj = {
                      category_id: this.goinfo.cate_id,
                      name: this.typename.typename,
                      stage: JSON.stringify(this.fstandard),
                      standard: JSON.stringify(this.tstandard.concat(this.pstandard)),
                      icon: this.identification.iconBorder,
                      color: this.identification.iconColor,
                      ability_id: this.abilityVal,
                  };
              } else {

        /*更新*/
                  url = this.$GLOBALAPI.task_task_typeupdate;
                  obj = {
                      id: this.updateId,
                      name: this.typename.typename,
                      stage: JSON.stringify(this.fstandard),
                      standard: JSON.stringify(this.tstandard.concat(this.pstandard)),
                      icon: this.identification.iconBorder,
                      color: this.identification.iconColor,
                      ability_id: this.abilityVal,
                  };
              }

              let res = await api.taskTypeAdd(obj, url);
              if (res.data.err_code === 0) {
                  this.$Message.success(i18n.t('project.pro_saveSucceed'));
                  this.$bus.emit("treeUpdate", res.data); // 刷新左侧树状图
                  if (url === this.$GLOBALAPI.task_task_typeadd) {
                      this.goinfo = null;
                      this.updateId = res.data.id;
                  }
              } else {
                  this.$Message.error(res.data.err_message);
              }
          },
    //增加任务附加文件
          addJunctShow() {
              this.tstandard.push({
                  name: "",
                  values: "",
                  type: "file"
              });
          },
    //移除任务附加文件
          delOtherfile(index) {
              this.tstandard.splice(index, 1);
          },
    //移除任务附加文件tabel
          remove(index) {
              this.accesData.splice(index, 1);
          },
    //沟通确认阶段
          addSteps() {
              let aSp = this;
              if (aSp.fstandard && aSp.fstandard.length >= 100 || aSp.current >= 100) {
                  this.$Message.error(i18n.t('project.pro_AddUpToSix'));
                  aSp.current = 6;
              } else {
                  let obj = {
                      stage_name: i18n.t('project.pro_newStepName'),
                      require: [
                          {
                              text: "",
                              level: "3",
                              norm: ""
                          }
                      ],
                      show: false,
                      flowTIlteShow: false
                  };
                  if (this.project && this.projectFlowNum) {
                      this.projectFlowNum++;
                      obj.stage = this.projectFlowNum;
                  }

                  this.fstandard.push(obj);
              }
          },

    /**
     * 制作规范模块操作
     */
    //增加制作属性
          addFileat() {
              this.pstandard.push({
                  name: "",
                  values: "",
                  type: "progress"
              });
          },
    //删除制作属性
          removeFileat(index) {
              this.pstandard.splice(index, 1);
          },

    /**
     * get请求
     */
          get(url, params, call) {

      /*获取列表信息*/
              this.$http.get(url, { params: params }).then(
        function(res) {
            call(res);
        },
        function(error) {
            this.$Message.error(i18n.t('project.pro_dataErrRefreBrowser'));
        }
      );
          },
    // 删除规范
          deleteStandard() {
      // 公司级删除
              if (this.temporary) {
                  this.$bus.emit("treeUpdate");
//        this.newtaskTypesDetail("default");
              } else if (!this.project) {
                  this.$bus.emit("deleteDetails", this.info);
              } else {
        // 项目级删除
                  this.$emit("tabsDelete");
              }
          },
    // 移动规范
          moveStandard() {
              this.moveShow = true;
          },
          async moveOk() {
              let data = await taskTypeUpdate({
                  id: this.updateId,
                  category_id: this.moveValue
              });
              if (data.err_code === 0) {
                  this.$bus.emit("treeUpdate"); // 刷新左侧树状图
                  this.moveValue = "";
              }
          },

          stepAdd(index) {
              let obj = {
                  norm: this.curreSelect.id,
                  text: this.stepInfoList.text,
                  level: this.stepInfoList.level,
                  norm_name: this.curreSelect.val
              };

              this.fstandard[index].require.push(obj);

              this.$set(this.fstandard[index], "show", false);
              this.stepInfoList = {
                  text: "",
                  norm: "",
                  level: "3"
              };
          },
          closeStepList(index) {
              this.$set(this.fstandard[index], "show", false);
              this.stepInfoList = {
                  text: "",
                  norm: "",
                  level: "1"
              };
          },
    // 图标框显示
          showMarkers() {
              this.boxShow = !this.boxShow;
//      this.identification.iconBorder = null;
//      this.identification.iconColor = null;
          },
    // 图标框边框
          secMarkers(item, type) {
              if (type === "icon") {
                  this.identification.iconBorder = item.id;
                  this.identification.icon = item.url;
              } else {
                  this.identification.iconColor = item.color;
              }
          },
          addMarkers(type) {
              this.boxShow = false;
              if (!type) {
                  this.identification = {
                      iconBorder: null,
                      iconColor: null,
                      icon: null,
                      color: null
                  };
              }
          },
    // 进入详情
          newtaskTypesDetail(dataDetail) {
              return new Promise(async (resolve, reject) => {
                  let obj = {id: dataDetail.id};
        // 点击进入详情
                  if (dataDetail.rank === 2) {
                      this.isSubmit = dataDetail.status !== 0;
                      this.disabled = dataDetail.status === 0;
                  } else if (dataDetail === "default") {
          // 页面刷新 进入默认详情
                      obj = {
                          id: this.updateId
                      };
                  }
                  this.clearInfo();
                  let {data} = await api.taskCateinfo(obj);
                  if (data.err_code === 0) {
                      this.info = data;
                      this.addInfo(data);
                      this.identification.iconBorder = data.icon;
                      this.identification.icon = data.icon_url;
                      resolve();
                  } else {
                      this.$Message.error(data.err_message);
                  }
              });
          },
          addInfo(data) {
              if (data.ability_id) {
                  this.abilityVal = Number(data.ability_id);
              } else {
                  this.abilityVal = null;
              }
              this.projectFlowNum = null;
              this.typename.typename = data.tasktype_name;

              this.tstandard = data.standard.filter(item => item.type === "file");
              this.pstandard = data.standard.filter(item => item.type === "progress"); // 制作规范

              this.initStandard();

              if (Array.isArray(data.stage) && data) {
                  data.stage.map(item => {
                      item.show = false;
                      item.flowTIlteShow = false;
                  });
              }

      // 获取最后一个stage 标识
              if (data.stage) {
                  data.stage.map((item, index) => {
                      if (index === data.stage.length - 1) {
                          this.projectFlowNum = item.stage;
                      }
                  });
              }

              this.fstandard = data.stage;
      // 审核值转成数组
//      if (data && data.stage) {
//        data.stage.map((item, index) => {
//          this.fstandard[index].review = [];
//          if (item.is_inside_audit == 1) {
//            this.fstandard[index].review.push(1);
//          }
//          if (item.is_client_audit == 1) {
//            this.fstandard[index].review.push(0);
//          }
//        });
//      }

              this.originalLenght = this.fstandard?this.fstandard.length + 1:1;

              this.identification.icon = data.icon_url;
              this.identification.iconColor = data.color;
          },
          initStandard() {
              if (this.tstandard && this.tstandard.length === 0) {
                  this.tstandard.push({
                      name: "",
                      values: "",
                      type: "file"
                  });
              }
              if (this.tstandard && this.tstandard.length === 0) {
                  this.tstandard.push({
                      name: "",
                      values: "",
                      type: "progress"
                  });
              }
          },
          editPriority(type, index, i) {
              if (index === 0 || index) {
                  this.fstandard[index].require[i].level = type;
              } else {
                  this.stepInfoList.level = type;
              }
          },

          delFlowNorm(index, i) {
              this.fstandard[index].require.splice(i, 1);
          },

    // 添加详情
          addType(data) {
              if (data.cate_id) {
        // 直接新建
                  this.goinfo = data;
              } else if (data.parent_id) {
        // 新建时没保存 但是用户点击了其他详情，又点击回来
                  this.goinfo = { cate_id: data.parent_id };
              }

              this.isSubmit = true;
              this.disabled = false;
              this.clearInfo();
          },

    /*清空页面*/
          clearInfo() {
              this.fileShow = false;
              this.fileAddName = "";
              this.fileAddMain = "";
              this.OtherfileShow = false;
              this.OtherfileName = "";
              this.OtherfileMain = "";
              this.fstandard = [
                  {
                      stage_name: i18n.t('project.pro_newStepName'),
                      require: [
                          {
                              text: "",
                              level: "3",
                              norm: ""
                          }
                      ],
                      show: false,
                      flowTIlteShow: false,
                      stage: 0
                  }
              ]; // 流程规范
              this.pstandard = [
                  {
                      name: "",
                      values: "",
                      type: "progress"
                  }
              ]; // 制作规范
              this.tstandard = [
                  {
                      name: "",
                      values: "",
                      type: "file"
                  }
              ]; // 文件规范
              this.typename = { typename: "", icon: "", color: "" };
              this.identification = {
                  iconBorder: null,
                  iconColor: null,
                  icon: null,
                  color: null
              };
          },

    /*添加规范*/
          async addNorms(val) {
              this.callbackStatus = false;
              let { data } = await api.addNorm({ name: val });
              if (data.err_code === 0) {
                  this.callbackStatus = true;
                  this.$Message.success(i18n.t('companySetUp.setUp_addSuccess'));
                  this.modal1 = false;
                  this.normValue = "";
                  this.getNormslist();
              } else {
                  this.callbackStatus = false;
                  this.$Message.error(data.err_message);
              }
          },

    /*删除规范*/
          async delNorms() {
              let { data } = await api.deleteNorm({ id: this.delnormsValue });

              if (data.err_code === 0) {
                  this.modal2 = false;
                  this.normValue = "";
                  this.getNormslist();
              } else {
                  this.$Message.error(data.err_message);
              }
          },
    // 刷新页面 禁止效果
          isDisabled() {
              this.expandStatus = sessionStorage.expandStatus;
              if (this.expandStatus && !this.project) {

                  this.isSubmit = this.expandStatus != 0;
                  this.disabled = this.expandStatus == 0;

              }
      // 项目
              if (this.project) {
                  this.disabled = false;
              }
          },
    // 删除阶段
          deleteStep(index, step) {
              this.fstandard.splice(index, 1);
              this.isDeleteflow = true;
              if (!step.stage && this.projectFlowNum) {
                  this.projectFlowNum--;
              }
          }
      },
      computed: {
          ...mapState({
      // 进入页面系统默认id  和 点击详情获取的id
              defId(data) {
                  return data.typelib.defId;
              },
              treeData(data) {
                  let moveArray = [];
                  if (data.typelib.treeData) {
                      data.typelib.treeData.forEach((items, index) => {
                          if (items.status !== 0 && items.children) {
                              items.children.forEach((children, idx) => {
                                  let obj = {
                                    name: children.name,
                                    cate_id: children.cate_id
                                };
                                  moveArray.push(obj);
                              });
                          }
                      });
                  }
                  return moveArray;
              },
              collaboration(value){
                  return value.app.collaboration;
              },
              is_collaboration(value){
                  return value.app.is_collaboration;
              }
          })
      },
      watch: {
    // 异步defId数据
          defId(data) {
              if (data !== null) {
                  this.updateId = data;
                  this.newtaskTypesDetail("default");
              }
          }
      },
      filters: {

    /*优先级*/
          priorityValue(value) {
              let data = value;
              switch (value) {
                  case "3":
                      data = i18n.t('lang.lang_height');
                      break;
                  case "2":
                      data = i18n.t('lang.lang_mid');
                      break;
                  case "1":
                      data = i18n.t('lang.lang_low');
                      break;
                  case "0":
                      data = i18n.t('lang.lang_priority');
                      break;
              }
              return data;
          }
      }
  };
</script>
<style lang="less">
/*UI改版样式开始*/
.taskClassLibrary {
  .base-card;
    min-width: 1110px;
  margin-bottom:30px;
  min-height: 830px;
  overflow: hidden;
  -webkit-flex: 4;
          flex: 4;
  .ivu-input[disabled] {
    background: transparent;
  }
  .ivu-input {
    color: @black_2;
  }
  .taskClassLiHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: @black_2;
    /*background: @base;*/
    padding: 10px 10px;
    .headerTitle {
      display: flex;
      width: 61.5%;
      // padding-bottom: 10px;
      font-size: @fs18 !important;
      color: @base;

      .ivu-input {
        font-size: @fs18 !important;
        color: @base;
        border-bottom: 1px solid @base;
      }
    }
    .standardOperateButton{
        height:38px;
        width:100px;
    }
    .standardOperateButtonDel{
      .standardOperateButton;
      &:hover{
        color:@red;
      }
    }
    .standardOperateButtonDel{
    &:hover{
      color:@red !important;
    }
    }
    .grayButton {
      background: #fff !important;
      color: #c1c1c1 !important;
      border: 1px solid #f3f5f6 !important;
    }
    .button {
      padding: 8px 30px;
      margin-left: 8px;
      border: 0;
      border-radius: 3px;
      outline: none;
    }
  }
  .taskClassLiContener {
    padding: 10px 15px;
    overflow: auto;
      .taskclass-guide-right{
          min-width: 360px;
      }
    .ivu-icon-ios-plus-outline{
      &:hover{
        color: @base;
      }
    }
    .ivu-icon-plus-circled{
      &:hover{
        color: @base_dark !important;
      }
    }
    .titleH2 {
      font-weight: lighter;
      color: @black_3;
      font-size: @fs14;
    }
    .titleContent
    {
      left:0px;
      color: @black_4;
      font-size: @fs13;
      margin-left: -30%;
    }
    .stepCentral {
      margin-top: 12px;
      padding-right: 30px;
    }
    .stepContainer {
      .ivu-steps-main {
        width: 100% !important;
        .stepRight {
          margin-left: 45px !important;
          margin-top: 30px;
          .title {
            width: calc(~"100% - 210px");
            color: @black_2;
            font-size: 15px;
            border: 1px solid transparent;
            outline: none;
            z-index: 0 !important;
            background: #fff;
          }
        }
        .stepRightBox {
          position: absolute;
          top: 2px;
          left: 50px;
          display: flex;
          width: 85%;
          height: 27px;
          border-bottom: 1px solid @black_3;
          z-index: 99;
        }
      }
    }
    .addSteps {
      font-size: 20px;
      cursor: pointer;
    }
    .contenerRight {
      padding:0 30px 0 30px;
      border-left: 1px dashed #e1e1e1;
      .ivu-icon-trash-a{
        &:hover{
          color: @red;
        }
      }
      ul li {
        margin-bottom: 30px;
        .titleFloat {
          display: flex;
          justify-content: space-between;
        }
        .ivu-input {
          font-size: 13px;
          color:@black_2;
          border-bottom: 1px solid #e2e3e4;
        }
      }
    }
  }
}
//这里有一个老版本的样式
.taskClassLibrary {
  .ivu-steps-vertical,
  .ivu-steps-item {
    min-height: 102px !important;
    margin-bottom: 10px;
  }
  .ivu-btn-text:hover{
    color: @base;
  }
  .fileAttr.ivu-row {
    display: flex;
    &::after {
      clear: none;
    }
  }
  .fileAttr,
  .attachingTask {
    margin: 10px 0;
    height: 40px;
    .ivu-col-span-12{
      margin-right: 2px;
    }
    .delIcon {
      /*margin-left: 30px;*/
      padding: 10px;
      font-size: 16px;
      color:@black_4;
      cursor: pointer;
      /*opacity: 0;*/
      transition: all 0.2s;
      z-index: 2;

    }
    .standardName{
      input{
        text-align: left;
      }
    }
    .standardContent{

      input{
        text-align: right;
      }
    }

  }
  .iconColor {
    border: 1px solid @base !important;
  }
  .btn {
    width: 68px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
    color: @black_2;
    background: #fff;
    border: none;

    cursor: pointer;
    overflow: hidden;
    &:focus {
      box-shadow: none;
      outline: none;
      color: @base;
    }
    &:hover{
      color: @base;
    }
  }
  .ivu-input {
    border-radius: 0;
    border: none;
    /*<!--border-bottom: 1px solid @base;-->*/
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
  .borderBottomSty {
    border-bottom: 1px solid @black_4;
    width: 90%;
    margin-right: 30px;
    input{
      height: 28px !important;
    }
  }
  .ivu-steps-main {
    overflow: visible !important;
  }
  .taskTypeName {
    display: flex;
    position: relative;
    top: 10px;
    .taskTypeNameBox {
      position: absolute;
      top: 35px;
      left: -24px;
      width: 158px;
      text-align: center;
      border: 1px solid @black_4;
      background: #fff;
      z-index: 150;
      box-sizing: border-box;
      padding: 10px;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      -webkit-box-shadow: 1px 1px 8px #dfdfdf;
      -moz-box-shadow: 1px 1px 8px #dfdfdf;
      box-shadow: 1px 1px 8px #dfdfdf;
      .standard-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
      .identification {
        padding: 3px 0;
        width: 48%;
        font-size: 30px;
        border: 1px solid #fff;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        .signColor {
          display: block;
          width: 28px;
          height: 28px;
          margin: auto;
          border-radius: 50%;
        }
        &:hover {
          border: 1px solid @base;
        }
      }

      button {
        width: 48%;

        &:focus {
          color: @base;
          border: none;
          box-shadow: none;
        }
      }
    }
  }
  .stepContainer {
    /*步骤条圈*/
    .ivu-steps.ivu-steps-small,
    .ivu-steps-head-inner {
      width: 31px !important;
      height: 31px !important;
      line-height: 30px !important;
      font-size: 16px !important;
      background: #fff !important;
      border: 1px dashed @black_2 !important;
      span {
        color: @black_2 !important;
      }
      .ivu-icon {
        top: 4px !important;
        font-size: 30px !important;
      }
    }
    /*步骤条线*/
    .ivu-steps-vertical.ivu-steps-small,
    .ivu-steps-tail {
      left: 15px !important;
      top: 15px !important;
    }
    /*步骤条title*/
    .title {
      .ivu-input-icon + .ivu-input {
        height: 21px;
        padding: 0;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        border-radius: 0;
      }
    }
    /*步骤条阶段标记*/
    .acmSign,
    .review {
      display: inline-block;
      padding: 0 2px;
      // margin-left: 15px;
      line-height: 18px;
      font-size: 12px;
    }
    .acmSign {
      color: #3bceb6;
    }

    .stepsUl {
      /*padding-left: 35px;*/

      /*margin-bottom: 10px;*/
      .stepsList {
        display: flex;
        position: relative;
        padding: 6px 0;
        font-size: 13px;
        align-items: center;
        .delIcon {
          padding: 10px;
          margin-left: 0px;
          margin-right: 0px;
          font-size: 16px;
          opacity: 0;
          color:@black_3;
          cursor: pointer;
        }
        .standard {
          width: 100px;
          height: 32px;
          margin: 0 20px;
          vertical-align: middle;
          .ivu-select-selection {
            border: 1px solid @base;
            text-align: center;
            color: @base;
          }
          .ivu-select-selection,
          .ivu-select-selected-value,
          .ivu-select-placeholder {
            height: 32px;
            line-height: 32px;
          }
        }
        .ivu-input {
          font-size: 13px;
        }
        .priorityContainer {
          position: relative;
          .priorityExhibition {
            position: relative;
            left: 0px;
          }
          .priority {
            width: 24px;
            height: 24px;
            /*margin-bottom: 4px;*/
            font-size: 12px;
            text-align: center;
            line-height: 22px;
            color: @black_2;
            background-color: #fff;
            border-radius: 50%;
            vertical-align: middle;
            cursor: pointer;
            z-index: 2;
          }
          .priority3 {
            border: 1px solid @red !important;
            color: @red !important;
          }
          .priority2 {
            border: 1px solid @orange !important;
            color: @orange !important;
          }
          .priority1 {
            border: 1px solid @yellow !important;
            color: @yellow !important;
          }
          .priorityList {
            display: none;
            position: absolute;
            left: 0;
            padding-top: 10px;
            z-index: 103;
            background: #fff;
          }
          &:hover {
            .priorityList {
              display: block;
            }
          }
        }
        &:hover {
          .delIcon {
            opacity: 1;
            transition: 0.2s;
           &:hover{
             color: @red;
           }
          }
        }
      }
    }
  }
}
/*UI改版样式结束*/

.stepContainer {
  .ivu-steps-main {
    width: 100% !important;
  }
  .deleteStepIcon {
    font-size: 18px;
    position: absolute;
    top: 6px;
    right: -22px;
    color: #d7d7d7;
    cursor: pointer;
    &:hover {
      color: #ff5252;
      transition: 0.2s;
    }
  }
}



.spaceTb {
  /*padding: 21px 21px;*/
}

.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}

.layout-nav {
  /*width: 500px;*/
  margin: 0 auto;
  margin-right: 20px;
}

.stem-logo img {
  max-width: 8rem;
}

.stem-l {
  margin-left: 10rem;
}

.restdele {
  position: relative;
  color: @red;
  top: 10px;
  left: 12px;
  z-index: 999999;
  font-size: 14px;
  cursor: pointer;
}

.show {
  display: block;
}

.hide {
  display: none;
}

.ivu-steps.ivu-steps-small .ivu-steps-content {
  padding: 0 !important;
}
.ivu-input:hover {
  box-shadow: none !important;
  outline: none !important;
}
.ivu-input-wrapper:focus {
  outline: none !important;
}
.ivu-select:focus {
  outline: none !important;
}
/* .hideIconDel {
      display: none;
    } */
</style>
