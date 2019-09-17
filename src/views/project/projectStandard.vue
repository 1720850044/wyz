<template>
    <div class="projectSpeContainer">
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{$route.meta.name}}<div></div></span></div>
        </main-native>
        <!--tab头部-->
        <!-- 规范列表 -->
        <section class="standardList">
            <!--<div class="standardListRule">-->
            <!--<p class="tile">-->
            <!--批量设置项目审核规则-->
            <!--</p>-->
            <!--<Alert type="warning"> 批量设置仅是便捷功能，每个规范仍可单独修改 </Alert>-->
            <!--<p class="buttonText">-->
            <!--需要内部审核-->
            <!--<i-switch size="large" v-model="switchInterior" @on-change="projectAuditChange()">-->
            <!--<span slot="open">启用</span>-->
            <!--<span slot="close">关闭</span>-->
            <!--</i-switch>-->
            <!--</p>-->
            <!--<p v-if="contract||collaboration" class="buttonText">-->
            <!--需要客户审核-->
            <!--<i-switch size="large" v-model="switchClient" @on-change="projectAuditChange()">-->
            <!--<span slot="open">启用</span>-->
            <!--<span slot="close">关闭</span>-->
            <!--</i-switch>-->
            <!--</p>-->
            <!--</div>-->
            <!-- 已加入规范 -->
            <div class="addedContainer" >
                <p class="addedTitle">{{$t('project.pro_importNormative')}}</p>
                <Icon id="standardAddedIcon" class="addedIcon taskclass-guide-add" type="ios-plus-outline" @click.native="addTaskTypeShow = !addTaskTypeShow"
                      style="cursor: pointer;" size="18"></Icon>
                <section class="tabHead">
                    <ul class="typeTabsContainer">
                        <li class="typeTab" v-for="(item,index) in typeTabs" @click.stop="projectTasktype(item,index)"
                            :class="{'tabGreen':index === tabsColor}" :key="index">{{item.tasktype_name}}
                            <!-- <i @click.stop="closeType(item)" class="closeSign">X</i> -->
                        </li>
                    </ul>
                </section>
            </div>
        </section>

        <!--规范表单-->
        <standard-info  ref="tree" class="standardContent"
                       v-on:tabsDelete="closeType"
                       v-on:update="listInit"
                       :contract="contract" v-if="typeTabs && typeTabs.length>0" :project="true" :attrContent="attrContent"
                       :ruleList="ruleList">
            <div slot="item">
                <ul>
                    <li>
                        <p class="titleFloat">
                            <span class="titleH2">{{$t('project.pro_normativeValue')}}</span>
                            <span class="titleContent">({{$t('project.pro_normativeValueClaim')}})</span>
                            <Icon v-if="!attrContentW.show && !disabled" class="addguifan" type="ios-plus-outline"
                                  @click.native="addAttrContent"></Icon>
                        </p>
                        <Row v-for="(item,index) in attrContent" :key="'attrContent'+index" class="fileAttr">
                            <Col span="8">
                                <AutoComplete class='standardName' v-model="item.name" :placeholder="$t('project.pro_normativeName')" clearable
                                              :disabled="disabled">
                                    <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                                </AutoComplete>
                            </Col>
                            <Col span="16">
                                <AutoComplete class='standardContent' v-model="item.values" :placeholder="$t('project.pro_normativeDescribe')" clearable
                                              :disabled="disabled">
                                    <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                                </AutoComplete>
                            </Col>
                            <Icon @click.native="removeAttrContent(index)" type="trash-a" class="delIcon"></Icon>
                        </Row>

                    </li>
                    <li>
                        <p class="titleFloat">
                            <span class="titleH2">{{$t('project.pro_specification')}}</span>
                            <span class="titleContent">({{$t('project.pro_normativeSpecificationClaim')}})</span>
                            <Icon v-if="!ruleListW.show && !disabled" class="addguifan" @click.native="addruleList"
                                  type="ios-plus-outline"></Icon>
                        </p>
                        <Row v-for="(item,index) in ruleList" :key="'ruleList'+index" class="fileAttr">
                            <Col span="8">
                                <AutoComplete class='standardName' v-model="item.name" :placeholder="$t('project.pro_normativeName')" clearable
                                              :disabled="disabled">
                                    <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                                </AutoComplete>
                            </Col>
                            <Col span="16">
                                <AutoComplete class='standardContent' v-model="item.values" :placeholder="$t('project.pro_normativeDescribe')" clearable
                                              :disabled="disabled">
                                    <!-- <Option v-for="item in re  qData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                                </AutoComplete>
                            </Col>
                            <Icon @click.native="removeRuleList(index)" type="trash-a" class="delIcon"></Icon>
                        </Row>

                    </li>
                </ul>
            </div>

        </standard-info>

        <div v-if="typeTabs && typeTabs.length===0"
             style="width:100%;text-align: center;height: 100%;margin-top: 120px;font-size: 20px">{{$t('project.pro_withoutNormative')}}
        </div>
        <!-- 添加弹窗 -->
        <Modal v-model="addTaskTypeShow" class="addTaskTypeWindow" width='1000px;' height="800px" @on-ok="ok"
               @on-cancel="cancel">
            <div class="header" slot="header">
                <div v-for="(item,index) in specification" :key="index"
                     :class="[menuColor === index?'fonsW':'','titleWdith']"
                     @click="selecSpecification(item.children,index)">
                    {{item.name}}({{item.children?item.children.length:0}})
                </div>
            </div>
            <dl v-for="(item,index) in StandardizeSec" :key="index">
                <dt>{{item.name}}</dt>
                <ul class="typeList">
                    <li class="typeBox" @click="greenSign(index,i,children)" v-for="(children,i) in item.children">
                        <div class="type" :title="children.tasktype_name" :class="children.border?'sign':''">
                            <span>{{children.tasktype_name}}</span>

                            <Icon class="icon" v-if="children.border" type="checkmark-circled"></Icon>
                        </div>
                    </li>
                </ul>
            </dl>
            <Button slot="footer" type="primary" @click="closeWindow">{{$t('lang.lang_ok')}}</Button>
        </Modal>
    </div>
</template>

<script>
    import {taskTypeIndex, taskTypeTaskInfo, taskTypeCateList, taskTypeInfo, taskTypeList, taskTypeAdd, taskTypeUpdate, taskTypeDelete} from '@/axios/modules/project/projectTaskType';

    import {mapState, mapMutations} from "vuex";
    import qs from "querystring";
    import api from "api";
    import standardInfo from "@/views/epibol/typeLibrary/standardInfo.vue";
    import mainNative from "@/views/main-components/mainNative.vue";

    export default {
        created() {},
        mounted() {
    // this.$store.dispatch('getCollaboration')

    // 初始化接口
            this.initGuide();
        },
        data() {
            return {
                is_flag: false,
                needGuideData: "",
                addTaskTypeShow: false,
                taskId: null,
                contract: null, // 判断是否是合同项目
                switchInterior: true, // 内部审核
                switchClient: true, // 客户审核
                listColor: null,
                disabled: false,
                menuColor: 0,
                tabsTypeId: null,
                project_id: sessionStorage.getItem("projectID"),
                btnSign: [],
                specification: [],
                StandardizeSec: [],
                typeList: [],
                typeMenu: false,
                tabsColor: 0,
                typeTabs: [],
                attrContentW: {
                    show: false,
                    name: "",
                    main: ""
                },
                ruleListW: {
                    show: false,
                    name: "",
                    main: ""
                },
                attrContent: [{ name: "", values: "", type: "connect" }],
                ruleList: [{ name: "", values: "", type: "hand" }]
            };
        },
        methods: {
            ...mapMutations(["setCollaboration"]),
    // 初始化获取是否引导
            async initGuide() {
                let {data} = await taskTypeIndex();
                console.log(data.err_code === 0, 776);
        // 列表初始化
                this.menuInit();

        /* 项目类型 判断合同项目 或 内部项目 */
        // this.initProjectType();
        /* 审核按钮开关初始化 */
                this.initSwitch();

                if (data.err_code === 0) {
                    if (data.guide === "projectStandard") {
                        this.needGuideData = true;
                    } else if (data.guide === "partyBProjectManagement") {
                        this.needGuideData = true;
                    } else if (data.guide === "projectCriterion") {
                        this.needGuideData = true;
                    }

                    await this.listInit();
                    await this.projectTasktype("init");

                    if (data.guide === "projectStandard") {
                        this.getGuideSteps();
                    } else if (data.guide === "partyBProjectManagement") {
                        this.getPlayBGuideSteps(data.guide);
                    } else if (data.guide === "projectCriterion") {
                        this.bubble();
                    }
                    console.log(data.err_code, 776);

                }
            },
            bubble() {
                let text = this.$lau.bubble.bubbleCompanyStandard;
                let defaultOptions = [
                    {
                        id: "standardAddedIcon",
                        position: "bottom",
                        title: text[0].title,
                        content: text[0].content,
                        relative: "body"
                    },
                    {
                        id: "inSideSwitch",
                        position: "bottom",
                        title: text[1].title,
                        content: text[1].content,
                        relative: "body"
                    },
                    {
                        id: "stepContainerLa",
                        position: "top",
                        title: text[2].title,
                        content: text[2].content,
                        relative: "body"
                    },
                    {
                        id: "taskclassGuideRight",
                        position: "left",
                        title: text[3].title,
                        content: text[3].content,
                        relative: "body"
                    }
                ];
      // let coll = this.collaboration
                let fn = async ({ id }) => {

                    if (id === "taskclassGuideRight") {
                        if (!this.is_flag) {
                            this.needGuideData = "";
                            await this.listInit();
                            await this.projectTasktype("init");
                        }
                    }
                };

                this.$nextTick(() => {
                    setTimeout(() => {
                        this.setCollaboration(1);
                        this.$bubble(defaultOptions, fn);
                    }, 300);
                });
            },
            getGuideSteps() {
                this.modal = true;
                setTimeout(() => {
                    this.$guide()
          .setOptions(this.$CONSTANT.guideOptions)
          .addSteps([
              {
                  element: document.querySelector(".taskclass-guide-add"),
                  intro: this.$lau.guide_words.k6,
                  position: "right",
                  disableInteraction: "1",
                  start: "1",
                  total: "3"
              },
              {
                  element: document.querySelector(".taskclass-guide-main"),
                  intro: this.$lau.guide_words.k7,
                  position: "bottom-middle-aligned",
                  disableInteraction: "1",
                  total: "3"
              },
              {
                  element: document.querySelector(".taskclass-guide-right"),
                  intro: this.$lau.guide_words.k8,
                  position: "bottom-middle-aligned",
                  disableInteraction: "1",
                  total: "3"
              }
          ])
          .oncomplete(async () => {
              this.needGuideData = "";
              this.initGuide();
          })
          .start()
          .onskip(async () => {
              this.needGuideData = "";
              this.initGuide();
          });
                });
            },
    // 乙方
            getPlayBGuideSteps(guideKey) {
                setTimeout(() => {
                    this.$guide()
          .setOptions(this.$CONSTANT.guideOptions)
          .addSteps([
              {
                  element: document.querySelector(".taskClassLibrary"),
                  intro: this.$lau.guide_words.k15,
                  position: "bottom",
                  disableInteraction: "1",
                  start: "2",
                  total: "5"
              }
          ])
          .oncomplete(async () => {
              this.$PublicFuns.completePageGuide(guideKey).then(result => {
              // this.$router.push(this.$router.push('/project/task'));
                  this.$router.push({ path: "/project/task" });
              });
              this.$guide().exit();
          })
          .start()
          .onskip(async () => {
              this.needGuideData = "";
            // this.is_flag = true;
              this.$router.push('/workbench/leader');   //中断流程
            // this.initGuide();
          });
                });
            },
            async initProjectType() {

      /* 合同项目才会有外部审核 当contract ！= 0的时候就是合同项目 */
      //      let { data } = await api.getProjectInfo({ id: this.proectID })
      //      if (data.err_code === 0) {
      //
      //        this.contract = Number(data.contract)
      //
      //      }
            },
            async initSwitch() {
                let {data} = await taskTypeInfo({ id: this.project_id });
                if (data.err_code === 0) {
                    this.switchInterior = !!data.inside_audit;
                    this.switchClient = !!data.client_audit;
                    this.contract = Number(data.contract);
                }
            },
            async menuInit() {
                let {data} = await taskTypeCateList();

                let res = {data};
                this.forTreeData(res.data.data);
                this.specification = res.data.data;
                if (res.data.data) {
                    res.data.data.map(item => {
                        this.typeList.push(item.children);
                    });
                }
                this.menuColor = 0;
                this.StandardizeSec = res.data.data[0].children;
            },

    /*递归遍历*/
            forTreeData(tree) {
                setTimeout(() => {
                    let arrData = data => {
                        data.map(item => {
                            item.btnShow = false;
                            this.typeTabs.map((tab, i) => {
                                if (item.id == tab.tasktype_id) {
                                    item.border = true;
                                }
                            });
                            if (item.tasktype && item.tasktype.length > 0) {
                                item.children = item.tasktype;
                            }
                            if (item.children) {
                                arrData(item.children);
                            }
                        });
                        return data;
                    };
                    return arrData(tree);
                }, 500);
            },

    /*查询列表*/
            listInit() {
                return new Promise(async (resolve, reject) => {
                    let {data} = await taskTypeList({
                        project_id: this.project_id,
                        needGuideData: this.needGuideData
                    });

                    if (data.err_code === 0) {
                        this.typeTabs = data.data;
                        resolve();
                    }
                });
            },

    /*查询详情*/
            projectTasktype(item, index) {
                return new Promise(async (resolve, reject) => {
                    let obj = null;
                    this.clearData();
                    if (this.$refs.tree) {
                        this.$refs.tree.clearInfo();
                    }
                    if (index === "audit") {
                        obj = { id: item };
                    } else if (item !== "init") {
                        this.taskId = item.id;
                        obj = { id: item.id };
                        this.tabsColor = index;
                    } else if (item === "init" && this.typeTabs && this.typeTabs.length > 0) {
                        obj = {
                            id: this.typeTabs[0].id,
                            needGuideData: this.needGuideData
                        };
                    } else {
                        return false;
                    }
                    let {data} = await taskTypeTaskInfo(obj);

                    if (data.err_code === 0 && data.data) {
                        this.tabsTypeId = data.data.id;
                        this.attrContent = data.data.standard
            ? data.data.standard.filter(item => item.type === "connect")
            : [];
                        this.ruleList = data.data.standard
            ? data.data.standard.filter(item => item.type === "hand")
            : [];
                        this.initStandard();
                        this.$bus.emit("projectInfo", data.data);
                        resolve();
                    } else {
                        this.$Message.error(data.err_message);
                    }
                });
            },
            initStandard() {
                if (this.attrContent && this.attrContent.length === 0) {
                    this.attrContent.push({ name: "", values: "", type: "connect" });
                }
                if (this.ruleList && this.ruleList.length === 0) {
                    this.ruleList.push({ name: "", values: "", type: "hand" });
                }
            },

    /*删除*/
            closeType(item) {
                this.$axios
              .post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_project_tasktypedelete, {
                  id: this.tabsTypeId
              })
              .then(({ data }) => {
                  if (data.err_code === 0) {
                      this.listInit();
                      this.menuInit();
                      this.newDetails(item.id);
                  } else {
                      this.$Message.error(data.err_message);
                  }
              });
            },

    /* 已添加规范列表的active效果 和 详情显示内容 */
            newDetails(id) {
                if (this.typeTabs) {
                    let newId = null;
                    let nowIndex = null;

                    this.typeTabs.map((item, index, array) => {
          // 获取当前id
                        if (item.id == id) {
                            nowIndex = index === array.length - 1 ? index - 1 : index + 1;
                            newId = array[nowIndex] ? array[nowIndex].id : null;
                            this.tabsColor = nowIndex;
                        }
          // 获取下一个id
          //  if (nowIndex === index) {
          //   newId = item.id
          // }
                    });
                    if (newId) {
                        this.projectTasktype(newId, "audit");
                    }
                }
            },
            selecSpecification(data, index) {
                this.StandardizeSec = data;
                this.menuColor = index;
            },
            addAttrContent() {
                this.attrContent.push({
                    name: "",
                    values: "",
                    type: "connect"
                });
                this.attrContentW = {
                    show: false,
                    name: "",
                    main: ""
                };
            },
            closeattrContent() {
                this.attrContentW = {
                    show: false,
                    name: "",
                    main: ""
                };
            },
            addruleList() {
                this.ruleList.push({
                    name: "",
                    values: "",
                    type: "hand"
                });
                this.ruleListW = {
                    show: false,
                    name: "",
                    main: ""
                };
            },
            closeruleList() {
                this.ruleListW = {
                    show: false,
                    name: "",
                    main: ""
                };
            },
            removeAttrContent(index) {
                this.attrContent.splice(index, 1);
            },
            removeRuleList(index) {
                this.ruleList.splice(index, 1);
            },

    /*内容规范的增删修改*/
            addContentat() {},
            closeContentat() {},
            contentListAdd() {},
            removeContentat() {},

    /*tab的切换*/
            tabsHandle(index) {},

    /*添加*/
            async greenSign(index, i, children) {
                let addSwitch = false;
                this.typeTabs.map(item => {
                    if (item.tasktype_id == children.id) {
                        addSwitch = true;
                    }
                });
                if (addSwitch) {
                    return false;
                }
      //                this.listColor.push(i);
      //                this.btnSign.push(index) ;
                let {data} = await taskTypeAdd({project_id: this.project_id, tasktype_id: children.id});
                this.projectTasktype({ id: data.id }, this.typeTabs.length);
                this.listInit();
        //                            this.menuInit();
                this.refreshListSign(index, i);
            },
    // 刷新列表
            refreshListSign(index, i) {
                this.specification.map((items, itemsIndex) => {
                    if (this.menuColor === itemsIndex) {
                        items.children.map((item, itemIndex) => {
                            if (index === itemIndex) {
                                item.children.map((child, childIndex) => {
                                    if (i === childIndex) {
                                    this.$set(child, "border", true);
                                }
                                });
                            }
                        });
                    }
                });
            },

/*    changeAudit(type, data) {
      /!* type 客户0  内部1 *!/
      // this.projectAuditChange()
      if (this.typeTabs) {
        let is_over = false;
        this.typeTabs.forEach(async (item, index) => {
            let data = await taskTypeTaskInfo({ id: item.id })
          if (data.err_code === 0 && data.data.stage) {
            data.data.stage.forEach((stage, idx) => {
              if (type === 1) {
                if (this.switchInterior) {
                  // 内部开
                  stage.is_inside_audit = 1;
                } else {
                  stage.is_inside_audit = 0;
                }
              } else if (type === 0) {
                if (this.switchClient) {
                  // 客户开
                  stage.is_client_audit = 1;
                } else {
                  stage.is_client_audit = 0;
                }
              }
            });

            let taskData = data.data;
            let dataObj = {
              id: taskData.id,
              name: taskData.tasktype_name,
              stage: JSON.stringify(taskData.stage),
              standard: JSON.stringify(taskData.standard)
            };
            let taksTypeInfo = await taskTypeUpdate(dataObj)

            if (
              taksTypeInfo.err_code === 0 &&
              index === this.typeTabs.length - 1
            ) {
              if (this.tabsTypeId) {
                this.projectTasktype(this.tabsTypeId, "audit");
              } else {
                this.projectTasktype("init");
              }
            }
          }
        });
      }
    },*/
    /*projectAuditChange() {
      let apiData = {
        id: this.project_id,
        inside_audit: Number(this.switchInterior),
        client_audit: Number(this.switchClient)
      };
        taskTypeUpdate(apiData);
    },*/
    // 情况数据
            clearData() {
                this.ruleList = [{ name: "", values: "", type: "hand" }];
                this.attrContent = [{ name: "", values: "", type: "connect" }];
            },
            closeWindow() {
                this.addTaskTypeShow = !this.addTaskTypeShow;
            },
            ok() {},
            cancel() {}
        },
        computed: {
            ...mapState({
                collaboration(value) {
                    return value.app.is_collaboration;
                }
            })
        },
        components: {
            standardInfo,
            mainNative
        }
    };
</script>

<style lang="less">
.projectSpeContainer {
  display: flex;
  color: @black_2;

  .ivu-input-icon-normal {
    &:hover {
      color: @red;
      cursor: pointer;
    }
  }

  .ivu-alert-warning .ivu-alert-icon {
    color: @orange !important;
  }

  .ivu-alert {
    letter-spacing: 0.2rem;
    padding: 0px;
  }

  .standardList {
    width: 365px;
    margin-right: 30px;

    .standardListRule {
      max-height: 200px;
      .base-card;

      .tile {
        .base-card-head;
      }

      .ivu-alert-warning {
        color: @orange;
        background: #fff !important;
        border: 1px solid transparent !important;
      }

      .buttonText {
        display: flex;
        margin-top: 20px;
        justify-content: space-between;
        font-size: 14px;
      }
    }

    .addedContainer {
      min-width: 300px;
      /*margin-top: 30px;*/
      max-height: 600px;
      .base-card;

      .addedTitle {
        .base-card-operation-head;
      }

      .addedIcon {
        .base-card-operation-icon;

        &:hover {
          color: @base;
        }
      }
    }
  }

  .tabHead {
    height: 95%;
    margin-top: 25px;
    padding-bottom: 5px;
    overflow: auto;

    .typeTabsContainer {
      padding: 5px 0 0 0;

      .typeTab {
        position: relative;
        padding: 12px 22px 10px 0px;
        font-size: 13px;
        color: @black_3;
        cursor: pointer;

        &:hover {
          .closeSign {
            opacity: 1;
          }
        }

        .closeSign {
          display: block;
          position: absolute;
          top: 3px;
          right: 3px;
          width: 16px;
          height: 16px;
          text-align: center;
          line-height: 16px;
          font-size: 12px;
          color: #fff;
          background: #f0816b;
          border-radius: 50%;
          opacity: 0;
        }
      }

      .tabGreen {
        background: @base_option;
        border-radius: 2px;
        color: @base_dark;
      }
    }

    .addType {
      position: relative;
      flex: 1;
      min-height: 40px;

      .addTypeBox {
        position: absolute;
        top: 0;
        left: 70px;
        // padding: 44px 80px;
      }

      .addButton {
        position: absolute;
        top: 0;
        right: 30px;
        /*padding: 10px 14px;*/
        text-align: center;

        .ivu-dropdown,
        .ivu-select-dropdown {
          // top: 50px !important;
          top: 0;
          left: auto !important;

          overflow-y: auto;
        }

        &:before {
          /*display: block;*/
          /*content: ' ';*/
          /*position: absolute;*/
          /*top:30px;*/
          /*left: 24px;*/
          /*width: 0;*/
          /*height: 0;*/
          /*border-top: 14px solid transparent;*/
          /*border-right: 14px solid transparent;*/
          /*border-left: 14px solid transparent;*/
          /*border-bottom: 14px solid #fff;*/
          /*z-index: 901;*/
        }
      }

      .typeMenu {
        color: @green;
        cursor: pointer;
      }
    }
  }
}

.addTaskTypeWindow {
  .com-scrollbar;

  .ivu-modal-header {
    background: transparent !important;
  }

  .ivu-modal-body {
    height: 600px;
    overflow: auto;
  }

  .header {
    overflow-x: auto;
    display: flex;
    padding-bottom: 10px;
    margin: 10px 0px;
    font-size: 16px;
    color: #6b6b6b;
    /*justify-content: flex-end;*/

    .fonsW {
      color: @base;
    }

    .titleWdith {
      min-width: 160px;
      text-align: center;
      cursor: pointer;
    }

    p {
      min-width: 100px;
      margin: 0 6px;
      text-align: center;
      color: @black_2;
      word-break: keep-all;
      white-space: nowrap;
      cursor: pointer;
    }
  }

  dt {
    height: 30px;
    padding-left: 20px;
    line-height: 30px;
    font-size: 14px;
    color: @black_1;
  }

  .typeList {
    display: flex;
    padding-left: 20px;
    margin: 14px 0 25px 0;
    font-size: 14px;
    flex-wrap: wrap;
    cursor: pointer;

    .typeBox {
      position: relative;
      padding: 0 20px;
      margin: 2px 0 2px 15px;
    }

    .type {
      display: flex;
      min-width: 80px;
      max-width: 160px;
      height: 30px;
      padding: 0 4px 0 7px;
      text-align: center;
      line-height: 30px;
      color: @black_3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      img {
        margin: 29px 4px 0 0;
      }

      .icon {
        position: absolute;
        top: 0;
        right: 0;
        padding-left: 5px;
        color: #3bceb6;
        line-height: 30px;
      }
    }

    .sign {
      color: @base_dark;
      background: @white;
      border: 1px solid @base_dark;
      border-radius: 4px;

      img {
        margin: 27px 4px 0 0;
      }
    }
  }
}
</style>
