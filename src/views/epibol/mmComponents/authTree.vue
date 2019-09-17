<template>
  <div class="teamTreeContainer" id="teamTreeID">
    <ul>
      <CheckboxGroup v-model="project"  @on-change="changeProjectBox">
        <li><Checkbox class="title" label="1" :disabled="disabled">{{$t('workbench.work_teamWorkAllProject')}}</Checkbox></li>
        <li><Checkbox label="2" :disabled="disabled">{{$t('memberAauthority.power_projectTab')}}</Checkbox></li>
        <!--<li><Checkbox label="3">负责的子项目</Checkbox></li>
        <li><Checkbox label="4">负责的任务</Checkbox></li>
        <li><Checkbox label="5">关联的任务</Checkbox></li>-->
      </CheckboxGroup>
    </ul>
    <ul>
      <CheckboxGroup v-model="bid"  @on-change="changeBidBox">
        <li><Checkbox class="title" label="1" :disabled="disabled" >{{$t('memberAauthority.power_fullTender')}}</Checkbox></li>
        <li><Checkbox label="2" :disabled="disabled" >{{$t('memberAauthority.power_responsibleBid')}}</Checkbox></li>
      </CheckboxGroup>
    </ul>
    <ul>
      <CheckboxGroup v-model="contract" @on-change="changeContractBox">
        <li><Checkbox class="title" label="1" :disabled="disabled">{{$t('memberAauthority.power_fullContract')}}</Checkbox></li>
        <li><Checkbox label="2" :disabled="disabled">{{$t('memberAauthority.power_responsibleContract')}}</Checkbox></li>
      </CheckboxGroup>
    </ul>
    <ul>
      <CheckboxGroup v-model="member" @on-change="changeMemberBox">
        <li><Checkbox class="title" label="1" :disabled="disabled">{{$t('memberAauthority.power_allMembers')}}</Checkbox></li>
        <li><Checkbox label="2" :disabled="disabled">{{$t('memberAauthority.power_responsibleDepartmentMembers')}}</Checkbox></li>
      </CheckboxGroup>
    </ul>
  </div>
</template>

<script>
var qs = require('querystring');
export default {
    data() {
        return {
  
            member: [],
            project: [],
            beforeProject: [],
            bid: [],
            contract: []
        };
    },
    props: ['auth'],
    mounted () {
        this.changeType();
    },
    computed: {
        disabled(){
            return this.auth === 99999;
        }
    },
    methods: {
        changeType() {
            let project = [], bid = [], contract = [], member = [];
            this.$bus.on("changeAuth", (val, list) => {
                for (let i=0;i<list.length;i++){
                    if (list[i].id==val){
            // project.push(list[i].project_auth.type);
            // bid.push(list[i].bid_auth.type);
            // contract.push(list[i].contract_auth.type);
                        if (list[i].project_auth.type == "1") {
                            project = ["1", "2", "3", "4", "5"];
                        } else if (list[i].project_auth.type == "2") {
                            project = ["2", "3", "4", "5"];
                        } else if (list[i].project_auth.type == "3") {
                          project = ["3", "4", "5"];
                      } else if (list[i].project_auth.type == "4") {
                        project = ["4"];
                    } else if (list[i].project_auth.type == "5") {
                      project = ["5"];
                  } else if (list[i].project_auth.type == "4,5" || list[i].project_auth.type == "5,4") {
                    project = ["4", "5"];
                } else {
                    project.push(list[i].project_auth.type);
                }
                        if (list[i].bid_auth.type == "1") {
                            bid = ["1", "2"];
                        } else {
                            bid.push(list[i].bid_auth.type);
                        }
                        if (list[i].member_auth.type == "1") {
                            member = ["1", "2"];
                        } else {
                            member.push(list[i].member_auth.type);
                        }
                        if (list[i].contract_auth.type == "1") {
                            contract = ["1", "2"];
                        } else {
                            contract.push(list[i].contract_auth.type);
                        }
                        this.project = [...new Set(project)];
                        this.beforeProject = [...new Set(project)];
                        this.bid = [...new Set(bid)];
                        this.contract = [...new Set(contract)];
                        this.member = [...new Set(member)];
                    }
                }
            });
        },
        changeProjectBox(res, data) {
            let Num = [];
            if (this.beforeProject.length>res.length){
                if (res.length === 0){
                    this.project = [];
                } else if (!res.includes('5')){
                    this.project = ['4'];
                } else if (!res.includes('4')){
                    this.project = ['5'];
                } else if (!res.includes('3')){
                    this.project = ['4', '5'];
                } else if (!res.includes('2')){
                  this.project = ['3', '4', '5'];
              } else if (!res.includes('1')){
                  this.project = ['2', '3', '4', '5'];
              }
            } else {
                if (!this.beforeProject.includes('1')&&res.includes('1')){
                    this.project = ['1', '2', '3', '4', '5'];
                } else if (!this.beforeProject.includes('1')&&!this.beforeProject.includes('2')&&res.includes('2')){
                    this.project = ['2', '3', '4', '5'];
                } else if (!this.beforeProject.includes('1')&&!this.beforeProject.includes('2')&&!this.beforeProject.includes('3')&&res.includes('3')){
                    this.project = ['3', '4', '5'];
                }
            }
            if ( this.project.includes('1')){
                Num = ['1'];
            } else if ( this.project.includes('2')){
                Num = ['2'];
            } else if ( this.project.includes('3')){
                Num = ['3'];
            } else if ( this.project.includes('4')&&this.project.includes('5')){
                Num = ['4', '5'];
            } else if (this.project.includes('4')){
                Num = ['4'];
            } else if (this.project.includes('5')){
              Num = ['5'];
          }
            this.updateType("project_auth", Num);
        },

        changeBidBox(res) {
            if (res.length>1){
                res = [1];
            } else if (res.length === 0){
                res = [3];
            }
            this.updateType("bid_auth", res);
        },
        changeContractBox(res) {
            if (res.length>1){
                res = [1];
            } else if (res.length === 0){
                res = [3];
            }
            this.updateType("contract_auth", res);
        },
        changeMemberBox(res) {
            if (res.length > 1) {
                res = [1];
            } else if (res.length === 0) {
                res = [3];
            }
            this.updateType("member_auth", res);
        },
        updateType(auth, type) {
            let data = {
                id: sessionStorage.postId,
                auth: auth,
                name: '',
                type: JSON.stringify(type)
            };
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.system_auth_update, data)
      .then(res => res.data)
      .then(res => {
          if (res.err_code == 0) {
              this.beforeProject = this.project;
          // 修改成功
          }
      });
        }
    },
    updated() {
        this.changeType();
    }
};
</script>
<style lang="less">
  .teamTreeContainer{
    .ivu-checkbox-wrapper{
      color: #bdbdbd;

    }
    .ivu-checkbox-inner{
      background: #fff !important;
      border: 1px solid #cbcbcb !important;
    }

  }

</style>

<style scoped lang="less">
.ivu-tree-children{
  border-bottom: 1px solid;
}
ul{
  padding: 10px 10px;
  // padding-bottom: 0;
  li{
    .title{
      color: @black_2 !important;
      font-size: 14px;
    }

    line-height: 44px;
    &:nth-child(1){
      background: @baseboard;
      padding-left: 15px;
    }
    &:nth-child(2){
      margin-left: 20px;
      padding-left: 28px;
    }
    &:nth-child(3),&:nth-child(4),&:nth-child(5){
      padding-left: 50px;
      margin-left: 40px;
    }
    // &:nth-child(4),&:nth-child(5){
    //   padding-left: 50px;
    //   margin-left: 60px;
    // }
  }
}
</style>
