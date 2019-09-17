<template>
  <div>
     <main-native v-if="projectSetShow" >
          <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
      </main-native>

    <div class="projectMemberContainer">
      <div class="member">
        <p class="title" v-if="memberArray">已加入项目组(<span> {{ memberArray.length }} </span>)</p>
        <ul class="cardList">
          <template v-if="memberArray">
            <li class="cardBox" v-for="(item,index) in memberArray" :key="index">
              <!-- {{memberArray}} -->
              <div v-if="item.collaboration === 1&&collaboration||(item.collaboration === 2&&!collaboration)" class="participation defaultListTag">参与</div>
              <div class="card">
                <!-- <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id" alt="头像"> -->
                <img :src="item.headimage" alt="头像">
                <p>{{item.realname || '空'}}</p>
              </div>
              <div class="job">
                <span >{{item.job || '无职位'}}</span>
              </div>
              <Icon v-if="item.collaboration === 1 && !collaboration" class="deleteI" type="close-circled" @click.native="removeShow(item.id,item.is_task,item.role)"></Icon>
              <Icon v-if="item.collaboration === 1 && collaboration" class="deleteI" type="close-circled" @click.native="delCollaboration(item,index)"></Icon>

            </li>
          </template>
        </ul>
        <Modal v-model="removeModal" title="该成员移除项目？" width="380" @on-ok="removeCard">
          <p style="color: #FF6600">说明：如果该成员负责相关任务，移除后任务将暂停，任务执行人将空缺。</p>
        </Modal>
      </div>
      <div class="whole" id="memberWhole">
        <p class="title">公司成员</p>
        <div class="contents">
          <template v-if="items">
            <div class="departmentList" v-for="(item,index) in items" :key="index">
              <p class="wholeTitle" :class="{'added':addArray.indexOf(index)!==-1 }">
                <span>{{item.department_name}}</span>

              <template v-if="item.members&&item.members.length>0">
                <Icon  v-if="allArray.indexOf(index)!==-1"  type="checkmark-circled" size="22" style="cursor:pointer;" ></Icon>
                <i    v-else-if="addArray.indexOf(index)!==-1" @click="addShow(item.members)"  class="notAll"  >-</i>
                <Icon v-else type="ios-plus-outline" @click.native="addShow(item.members)" size="22" style="cursor:pointer;"></Icon>
              </template>

              </p>
              <div class="persionList">
                <ul>
                  <li v-if="member.user_id" v-for="(member,i) in item.members" :key="i" :class="{'activeSty':member.is_join||member.is_collaboration}"
                      :title=" member.remark_name" @click="onCard(member)">
                    <div>
                      <!-- <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+member.user_id" /> -->
                      <img :src="member.headimage"/>
                      <span> {{ member.realname || '空'}} </span>
                    </div>
                    <i class="ivu-icon"></i>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- <test-guide :array="peopleSetting"></test-guide> -->
  </div>

</template>

<script>
  import {pjTeamIndex, pjTeamGetmembers, pjTeamJoinedMembers,
    pjTeamRemoveMember, pjTeamJoinProject} from '@/axios/modules/project/projectTeam';
  import {mapState} from 'vuex';
  import api from 'api';
  import qs from "querystring";
  import mainNative from "../../main-components/mainNative.vue";
// 项目引导
// import testGuide from "../../guide/testGuide.vue";
  export default {
      props: {
          islink: {
              type: Boolean,
              default: false
          },
          projectSetShow: {
              type: Boolean,
              default: true
          }
      },
      mounted() {
          this.init();
      },
      data() {
          return {
              addArray: [],
              allArray: [],
              imgHead: require("./image/timg.jpg"),
              projectID: sessionStorage.getItem("projectID"),
              beDeletedId: null,
              beAddId: null,
              removeModal: false,
              addModal: false,
              memberArray: null,
              items: null,
              peopleSetting: ["c5_5"]
          };
      },
      methods: {

          async init() {
              await pjTeamIndex();
              this.getItems();
              this.getMemberArray();
              this.autoH();
              this.$store.dispatch('getCollaboration');
          },
    // 所有成员
          async getItems() {
              let {data} = await pjTeamGetmembers( {project_id: this.projectID});

              this.items = data.data;
              this.addStyle();
              this.bubbleGetmembers();
          },
          async bubbleGetmembers(){
              let {data} = await api.bubbleGetmembers();
              if (data.err_code === 0 && data.guide && data.guide === 'addTeam'){
                  this.bubble();
              }
          },
          bubble() {
              let text = this.$lau.bubble.addTeam;
              let defaultOptions = [
                  {
                      id: 'memberWhole',
                      position: 'left',
                      title: text[0].title,
                      content: text[0].content,
                      relative: 'body',
                  },
              ];
              this.$nextTick(() => {
                  setTimeout(() => {
                      this.$bubble(defaultOptions);
                  }, 300);
              });
          },
          addStyle() {
              this.addArray = [];
              this.allArray = [];
              if (this.items) {
                  this.items.map((items, index) => {
                      if (items.members) {
                          let is_join = false;
                          let is_all = true;
                          items.members.map((item, idx) => {
                              if (item.is_join) {
                                  is_join = true;
                              } else {
                                  is_all = false;
                              }
                          });
                          if (is_join) {
                              this.addArray.push(index);
                          }
                          if (is_all) {
                              this.allArray.push(index);
                          }
                      }
                  });
              }
          },
    // 已经添加的成员
          async getMemberArray() {
              let {data} = await pjTeamJoinedMembers({
                  project_id: this.projectID
              });
              this.memberArray = data.data;
          },

    /* 删除弹窗*/
          removeShow(index, is_task, role) {

              this.beDeletedId = index;

              if (is_task) {
                  this.removeModal = true;
              } else {
                  this.removeCard();
              }
          },

    /* 删除卡片*/
          async removeCard() {
              let {data} = await pjTeamRemoveMember({ id: this.beDeletedId });
              this._messageSuccess(data.msg);
              this.getMemberArray();
              this.getItems();
              this.addStyle();
          },
    // 添加
          onCard(member) {

      // 是否已添加
              const isRemove = this.memberArray.some((item, index) => item.member_id === member.member_id);

              if (member.is_collaboration){
                  this.delCollaboration(member);
              } else if (!isRemove) {
                  if (!this.collaboration){
                      this.addmember(member);
                  } else {
                      this.addCollaboration(member);
                  }
              } else {
        // 删除
                  let id = null;
                  let is_task = null;
                  this.memberArray.map((item, index) => {
                      if (item.member_id == member.member_id) {
                          id = item.id;
                          is_task = item.is_task;
                      }
                  });

                  this.removeShow(id, is_task);
              }
          },

      /* 成员添加 */
          async addmember(member){
              let {data} = await pjTeamJoinProject({
                  project_id: this.projectID,
                  member_ids: member.member_id
              });
              this._messageSuccess(data.msg);
              this.getMemberArray();
              this.getItems();
              this.addStyle();

          },
          addShow(members) {
      //this.addModal = true;
              let ids = [];
              members.map((item, index) => {
                  if (!item.is_join) {
                      ids.push(item.member_id);
                  }
              });
              this.beAddId = ids.join(",");
              this.addGroup();
          },
          async addGroup() {
              if (!this.beAddId) {
                  this._messageError("成员不能为空");
              }
              let data = await pjTeamJoinProject({
                  project_id: this.projectID,
                  member_ids: this.beAddId
              });
              this._messageSuccess(data.msg);
              this.getMemberArray();
              this.getItems();

          },

          _messageSuccess(data) {
              this.$Message.success(data);
          },
          _messageError(data) {
              this.$Message.error(data);
          },
    // 设置行高
          autoH() {
              $(".projectMemberContainer").height($(window).height() - 114);
          },

    // 协作方添加
          async addCollaboration(item, index){
              let objForm = {
                  project_id: this.projectID,
                  user_id: item.user_id
              };
              let {data} = await api.addCollaborationMember(objForm);
              if (data.err_code === 0){
                  this.getMemberArray();
                  this.getItems();
              }
          },
      // 协作方删除
          async delCollaboration(item, index){
              let objForm = {
                  project_id: this.projectID,
                  user_id: item.user_id
              };
              let {data} = await api.delCollaborationMember(objForm);
              if (data.err_code === 0){
                  this.getMemberArray();
                  this.getItems();
              }
          },
      },
      computed: {
          ...mapState({
              collaboration(value){
                  return value.app.collaboration;
              }
          })
      },
      components: {
          mainNative,
    // testGuide
      },
      watch: {
          $route() {
              this.getItems();
              this.getMemberArray();
          }
      }
  };
</script>

<style lang="less" scoped>
.projectMemberContainer {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  .member,
  .whole {
    overflow: hidden;
    .base-card;
    .title {
      font-size: 16px;
      color: @black_2;
      padding-bottom: 12px;
      span {
        color: @green;
      }
    }
  }
  .member {
    width: 33% !important;
    .base-card;
    .cardList {
      margin-top: 0px;
      /*display: flex;*/
      /*justify-content: space-between;*/
      /*flex-wrap: wrap;*/
      padding: 2px;
      height: 100%;
      overflow: auto;
      .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
      }
      .cardBox {
        float: left;
        position: relative;
        width: 32%;
        height: 200px;
        /*margin-bottom: 20px;*/
        border-radius: 3px;
        overflow: hidden;
        margin: 0 1.3% 3% 0px;

        .card {
          background: url("./image/autherBG.png") no-repeat;
          background-size: 100% 100%;
          text-align: center;
          padding: 30px 0;
          height: 133px;
          p {
            font-size: 13px;
            color: #fff;
          }
          img {
            display: inline-block;
            width: 50px;
            height: 50px;
            border-radius: 100%;
            background: #ccc;
            overflow: hidden;
          }

          .sign {
            display: none;
            position: absolute;
            top: 6px;
            right: 6px;
            padding: 2px;
            font-size: 12px;
            color: #fff;
            background: @red;
            cursor: pointer;
          }
          &:hover {
            transform: scale(1.05);
            transition: transform 0.3s;

            .sign {
              display: block;
            }
          }
        }
        .job {
          height: 65px;
          border-radius: 3px;
          text-align: center;
          padding: 20px 0;
          border-left: 1px solid @black_4;
          border-right: 1px solid @black_4;
          border-bottom: 1px solid @black_4;
          span {
            display: inline-block;
            border: 1px solid @baseboard;
            color: @black_2;
            padding: 2px 5px;
            font-size: 12px;
            border-radius: 3px;
          }
        }
        .deleteI {
          display: inline-block;
          position: absolute;
          top: 0;
          right: 0;
          width: 30px;
          height: 30px;
          font-size: 20px;
          text-align: center;
          line-height: 30px;
          opacity: 0;
          /*background: url("./image/delectIco.png") no-repeat;*/
          /*<!--background-position: 7px -44px;-->*/
          &:hover{
            color: @red;
          }
        }
        &:hover {
          cursor: pointer;
          .deleteI {
            opacity: 1;

            /*background: url("./image/delectIco.png") no-repeat rgba(0, 0, 0, .3);*/
            /*background-position: 7px 7px;*/
          }
        }
      }
      &::after {
        content: " ";
        display: block;
        clear: both;
      }
    }
  }
  .whole {
    width: 65%;
    // max-width: 1020px;
    .contents{
      overflow-y:auto;
      height: 100%;
      padding: 0px 0px 30px 0px;
      margin-bottom:6px;
    }
    .departmentList {
      margin-bottom: 30px;
      /*height: 100%;*/
      overflow: auto;

      .wholeTitle {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        background: #f9f9f9;
        // color: @base;
        padding: 8px 10px;
        border-radius: 3px;
        min-width: 140px;
        color: #657180;
        .notAll {
          display: block;
          width: 20px;
          height: 20px;
          line-height: 15px;
          font-size: 25px;
          color: @white;
          border: 1px solid @white;
          cursor: pointer;
        }
        .persionList {
          i {
            display: inline-block;
            font-style: normal;
            text-align: center;
            cursor: pointer;
            width: 20px;
            height: 20px;
            line-height: 18px;
            border-radius: 100%;
            border: 1px solid @base;
            cursor: pointer;
            &:after {
              content: "\F217";
              color: @base;
              font-size: 15px;
            }
          }
        }
      }
      .persionList {
        ul {
          display: flex;
          flex-wrap: wrap;
          padding: 0 6px;
          li {
            display: flex;
            padding: 10px;
            min-width: 143px;
            max-width: 143px;
            margin: 30px 20px 0 20px;
            justify-content: space-between;
            align-items: center;
            border: 1px solid @black_4;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;

            div {
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                display: inline-block;
                width: 28px;
                height: 28px;
                border-radius: 100%;
                background: #ccc;
              }
              span {
                width: 68px;
                margin-left: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }

            i {
              display: inline-block;
              font-style: normal;
              text-align: center;
              cursor: pointer;
              width: 20px;
              height: 20px;
              line-height: 20px;
              border-radius: 100%;
              border: 1px solid @base;
              &:after {
                content: "\F217";
                color: @base;
                font-size: 15px;
              }
            }
            &.activeSty {
              border: 1px solid @base;
              // background: #dcf6f2;
              i {
                border: none;
                &:after {
                  content: "\F3FF";
                  color: @base;
                  font-size: 22px;
                }
              }
            }
          }
        }
      }
      .added {
        color: @white;
        background: @base !important;
      }
    }
  }
}
</style>
