<template>
<div class="rightsManagementContainer">
    <Alert type="warning" show-icon>
        <template slot="desc">
            项目允许甲方或者其它参与者，共同管理与实施项目
        </template>
    </Alert>
  <div class="mainContainer" >
      <!-- 主要公司 -->
      <div class="mainCompany">
          <p class="mainCompanyTitle">甲方公司</p>
          <p class="mainCompanyText">
              为项目关联合同后将拥有甲方公司信息，甲方可查看、审核、管理任务等操作
          </p>
          <Select v-if="!mainCompanyValue" v-model="mainCompanyId"  style="width:400px" @on-change="changeMainCompany" >
              <Option v-for="(item,index) in mainCompanyList" :value="item.id" :key="index">
                  {{item.contract_name}}({{item.company_name}})
              </Option>
          </Select>
          <ul v-if="mainCompanyValue">
              <li  class="mainCompanyList"  >
                  <span>
                      <span class="iconfonts icon-gongsi-pingtaitubiao"></span>
                      {{mainCompanyValue.contract}}({{mainCompanyValue.company}})
                  </span>
                  <span>
                      允许管理任务
                  <i-switch true-value="1" false-value="0" v-model="mainCompanyValue.update_auth"  @on-change="updateCollaboration(null,null,'company')"></i-switch>
                  </span>
                  <p class="removeButton" @click="changeMainCompany(null,'delete')">移除</p>
              </li>
          </ul>
      </div>
      <!-- 其他公司 -->
      <div class="otherCompany">
          <div class="otherCompany">
              <p class="otherCompanyTitle">协作方公司</p>
              <p class="otherCompanyText">
                  可指定公司或个人成为项目的协作方,项目规范库允许审核的阶段，协作方才能审核资源
              </p>
              <ul>
                  <li class="otherCompanyList" v-for="(item,index) in collaborationList" :key="index" >
                      <span style="width: 260px;">
                          <span class="iconfonts icon-gongsi-pingtaitubiao"></span>
                          {{item.name}}
                      </span>
                      <span class="switch">
                         允许管理任务
                         <i-switch v-model="item.update_auth" true-value="1" false-value="0" @on-change="updateCollaboration(item,index,'update_auth')"></i-switch>
                     </span>
                      <span class="switch">
                         允许审核任务
                         <i-switch v-model="item.check_auth"  true-value="1" false-value="0" @on-change="updateCollaboration(item,index,'check_auth')"></i-switch>
                     </span>
                      <span @click="deleteCollaboration(item,index)" class="iconfonts icon-shanchu"></span>
                  </li>
              </ul>
          </div>
      </div>
      <p v-if="!searchShow" class="addcollaboration"  @click="addcollaborationShow">+增加协作方</p>
      <AutoComplete
              v-if="searchShow"
              v-model="searchValue"
              icon="ios-search"
              placeholder="请搜索协作公司"
              @keyup.native="getSearchList"

              style="width:300px">
          <div class="searchListBox">
              <div v-if="searchList"  v-for="(item,index) in searchList" style="height: 40px;line-height: 40px;" :key="index"
                   class="demo-auto-complete-item"  @click="addCollaboration(item,index)">
                  {{item.name}}
              </div>
          </div>
      </AutoComplete>
      <!--<Input v-model="companyMember" placeholder="公司名称/成员邮箱">-->
         <!--<Icon class="searchIcon" @click="searchCollaboration"-->
               <!--slot="append" type="ios-search" size="18">-->
         <!--</Icon>-->
      <!--</Input>-->
  </div>

</div>
</template>

<script>
    import {projectSetContract, projectSetUpdate, projectSetList, projectSetAdd, projectSetUpdateCo, projectSetDelete, projectSetInfo, projecSetSelect} from '@/axios/modules/project/projectSetting';
    import api from 'api';
    export default {
        created() {
        },
        mounted() {
            this.init();

        },
        data() {
            return {
                searchShow: false,
                collaborationList: null,
                project_id: sessionStorage.projectID,
                searchValue: '',
                searchList: null,
                companyMember: '',
                mainCompanyList: null,
                mainCompanyId: null,
                mainCompanyValue: null,
                switch1: true,
                mainCompanyName: '',
                switch2: true,
                otherCompanyName: '',
            };
        },
        methods: {
            init(){

                this.getContractList();
                this.getCollaborationList();
//                this.getTaskProjectInfo()
            },

            /* 甲方公司列表 */
            async getContractList(){
                let {data} = await projectSetContract({type:1,page_size:999});
                if (data.err_code === 0){
                    this.mainCompanyList = data.data;
                }
            },

            /* 选择甲方公司 */
            async changeMainCompany(id, type) {
                let value;
                if (this.mainCompanyList) {
                    value = this.mainCompanyList.find((item, index) => item.id === id);
                }
                let objForm = null;
                if (type!=='delete'){
                    objForm = {
                        id: this.project_id,
                        contract: value.id,
                    };
                } else {
                    objForm = {
                        id: this.project_id,
                        contract: '0',
                    };
                }
                let {data} = await projectSetUpdate(objForm);
                if (data.err_code === 0) {
                    this.getCollaborationList();
                    if (type === 'delete'){
                        this.mainCompanyId = null;
                    }
                }

            },

            /* 项目详情 */
            async getTaskProjectInfo(){
                let { data } = await projectSetInfo({ id: this.project_id });
            },

            changeOtherCompany(){},

            /* 获取公司列表 */
            async getSearchList(e){
                const value = e.target.value;
                let {data} = await projecSetSelect({project_id: this.project_id, select: value});
                if (data.err_code === 0){
                    this.searchList = data.data;
                }
            },

            /* 甲方公司和协作方列表 */
            async getCollaborationList(){
                let {data} = await projectSetList({project_id: this.project_id});
                if (data.err_code === 0 && data.data){
                    this.collaborationList = data.data.collaboration;
                    this.mainCompanyValue = data.data.customer;
                }
            },

            /* 添加协办 */
            async addCollaboration(item, index){
                let objForm = {
                    project_id: this.project_id,
                    id: item.id,
                    type: item.type
                };

                let {data} = await projectSetAdd(objForm);
                if (data.err_code === 0){
                    this.searchShow = false;
                    this.getCollaborationList();
                }
            },

            /* 修改协办权限 */
            async updateCollaboration(item, index, type){
                let objForm = null;
                if (type !== 'company' ){
                    objForm = {
                        project_id: this.project_id,
                        id: item.id,
                        update_auth: item.update_auth,
                        check_auth: item.check_auth,
                    };
                } else {
                    objForm = {
                        project_id: this.project_id,
                        id: this.mainCompanyValue.id,
                        update_auth: this.mainCompanyValue.update_auth,
                        check_auth: 0,
                    };
                }
                let {data} = await projectSetUpdateCo(objForm);

            },

            /* 删除协办 */
            async deleteCollaboration(item, index){
                let {data} = await projectSetDelete({project_id: this.project_id, id: item.id});
                if (data.err_code === 0){
                    this.getCollaborationList();
                }
            },

            /* 显示协办人 */
            addcollaborationShow(){
                this.searchShow = true;
            },

        },
        filters: {},
        computed: {},
        components: {}
    };
</script>

<style lang="less" scoped>
.rightsManagementContainer{
    .mainContainer{
        width: 700px;
        padding: 0 15px;
        margin: 0 auto;
        .mainCompany{
            margin: 50px 0;
        }
        .mainCompanyList,.otherCompanyList{
            display: flex;
            height: 50px;
            padding: 0 10px;
            justify-content: space-between;
            align-items: center;
            color: @black_1;
            border: 1px solid @gray;
            border-radius: 4px;
            .iconfonts{
                vertical-align: middle;
            }
            .switch{
                color: @black_2;
            }
            .icon-shanchu{
                &:hover{
                    transform: scale(1.1)
                }
            }
            .removeButton{
                cursor:pointer;
                &:hover{
                    color: @red;
                }
            }
        }

        .otherCompany{
            margin-bottom: 15px;
            ul{
                max-height: 240px;
                overflow-y: auto;
                .otherCompanyList{
                    margin-bottom: 10px;
                }
            }
        }
        .mainCompanyTitle,.otherCompanyTitle{
            font-size: 16px;
            color: @black_1;
            font-weight: 600;
        }
        .mainCompanyText,.otherCompanyText{
            margin: 10px 0 15px 0;
            color: @black_3;
        }
        .addcollaboration{
            width: 120px;
            padding: 10px 0;
            color: @base;
            cursor: pointer;
            font-size: 14px;

        }
        .searchListBox{
            height: 180px;
            overflow-y: auto;
        }
        .searchIcon{
            padding: 0 10px;
            background: @white;
        }
        .demo-auto-complete-item{
            &:hover{
            background: @gray;
        }
        }
    }

}
</style>
<style lang="less">
    .rightsManagementContainer{
        .mainContainer{

            .ivu-select,.ivu-select-single .ivu-select-selection{
                height: 40px;
            }
            .ivu-input,.ivu-select-single .ivu-select-selection .ivu-select-placeholder,.ivu-select-single .ivu-select-selection .ivu-select-selected-value{
                height: 40px;
                line-height:40px;
            }
            .ivu-input-group-append{
                background:@white ;
                border-left: 1px solid transparent;
            }
            .ivu-input-group .ivu-input{
                border-right: 1px solid transparent;
            }
            .ivu-switch-checked{
                background: @base;
                border: 1px solid @base;
            }
            .ivu-input-icon{
                height: 40px;
                line-height: 40px;
            }
        }
        .ivu-alert-with-desc.ivu-alert-with-icon{
            padding: 6px 2px 6px 69px;
        }
        .ivu-alert-warning .ivu-alert-icon{
            color: @orange;
        }

        .ivu-alert-with-desc .ivu-alert-icon{
            font-size: 20px;
            top:63%;
            left: 44px;
        }
        .ivu-alert-with-desc .ivu-alert-desc{
            color: @orange;
        }

    }

</style>
