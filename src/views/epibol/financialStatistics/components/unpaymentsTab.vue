<template>

    <div>
        <template  v-if="uncollectedList.length > 0">
            <div class="unpayments-list">
                <div class="table-head">
                    <span>收款截止日期</span>
                    <span>收入来源</span>
                    <span>付款方</span>
                    <span>收入阶段</span>
                    <span>待收金额</span>
                    <span>负责人</span>
                    <span>操作</span>
                    <span>备注</span>
                </div>
                <dl>
                    <dd v-for="(item,index) in uncollectedList" :key="index">
                        <span :title="item.time">{{item.time}}</span>
                        <!-- && item.type == 1 -->
                        <span :title="item.name" style="cursor: pointer;" @click="check(item)">{{item.name}} <i class="view" v-if="item.project_id != 0">查看</i></span>
                        <span :title="item.pay_company">{{item.pay_company}}</span>
                        <span>{{item.step}}</span>
                        <Input type="text" v-model="editUncollected" v-if="editIndex === index" style="width: 125px;line-height: 60px;"></Input>
                        <span v-else>{{item.balance}}</span>
                        <span>{{item.leader || '暂无'}} <i class="iconfonts icon-mynotice" @click="notice(item)" style="color: #ffb617;"></i></span>
                        <span v-if="editIndex === index" class="btn-style">
                          <Button @click="handleSave(item)" type="primary"  size="small"><span>保存</span></Button>
                          <Button @click="editIndex = -1" type="text"  size="small">取消</Button>
                        </span>
                        <span class="action" v-else>
                            <i class="iconfonts icon-source-rename" @click="editData(item,index)"></i>
                            <i class="iconfonts icon-sourceDel" @click="deleteData(item.id)"></i>
                        </span>
                        <span class="edit-remarks" v-if="editIndex === index">
                            <Input v-model="remarks" placeholder="编辑备注" size="small"></Input>
                        </span>
                        <span v-else :title="item.remark">{{item.remark || "暂无备注"}}</span>
                    </dd>
                </dl>
            </div>
        </template>
        <template v-else>
          <div>
            <nothink type="project" text="暂无数据"></nothink>
          </div>
        </template>
    </div>
</template>
<script>
import api from "api";
export default {
    data() {
        return {
            remarks: "", // 编辑备注
            editUncollected: null, // 编辑未收款
            editIndex: -1, // 当前聚焦的输入框的行数
            isEdit: false, //编辑
            isDel: false, //删除
        };
    },
    props: {
        uncollectedList: {
            type: Array
        },
        powerToken: {
            type: String
        },
        operation: {
            type: Function,
            default: null
        }
    },
    mounted() {},
    methods: {
        editData(value, index) {
            this.editUncollected = value.balance;
            this.remarks = value.remark;
            this.editIndex = index;
            this.isEdit = true;
        },
        deleteData(id) {
            this.isDel = true;
            if (this.isDel) {
                if (this.operation) {
                    this.operation(id);
                }
            }
        },
    // 编辑
        handleSave(item) {
            let params = {
                id: parseInt(item.id),
                balance: this.editUncollected,
                remark: this.remarks
            };
            this.$emit("add-comment", item, params);
            this.editIndex = -1;
        },
    // 查看
        check(item) {
            if (item.project_id != 0){
                // 1 项目 2测试任务
                if(item.type == 1){
                    sessionStorage.projectID = item.project_id;
                    this.$router.push({path: '/project/task'})
                } else if (item.type == 2){
                    this.$router.push({ path: "/epibol/ManageDetails", query: {enteredID: item.source_id , TestID: item.resource_id , type: 'new'} });  
                }
            }
        },
    // 通知
        notice(item) {
            // console.log('发送通知');

        }
    }
};
</script>
<style lang="less" scoped>
.unpayments-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .table-head {
    display: flex;
    justify-content: space-between;
    color: #bdbdbd;
    height: 46px;
    line-height: 46px;
    font-weight: lighter;
    background-color: #fafbfb;
    border-bottom: 1px solid #eef1f2;
    margin-bottom: 0;
    font-size: 14px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px 0px;
    span {
      flex: 1;
      text-align: center;
      &:nth-child(2),&:nth-child(3){
        flex: 2;
      }
    }
  }
  dl {
    overflow: auto;
    height: 100%;
  }
  dd {
    text-align: center;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eef1f2;
    background: #fff;
    margin: 0;
    color: #777;
    font-size: 13px;
    font-family: @ff;
    font-weight: lighter;
    height: 60px;
    line-height: 60px;
    overflow: hidden;
    span {
      flex: 1;
      text-align: center;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      &:nth-child(2),&:nth-child(3){
        flex: 2;
      }
      i {
        cursor: pointer;
        font-style: normal;
      }
      .view {
        padding: 3px 4px;
        border: 1px solid #eef1f2;
        color: #5fd4c0;
      }
    }
    .btn-style{
      .ivu-btn-primary{
        max-width: 50px;
        span{
              color: white;
              margin-top: 5px;
              margin-left: -2.5px !important;
        }
      }
    }
    .action {
      i {
        cursor: pointer;
      }
      .icon-source-rename{
        &:hover{
          color: @base;
        }

      }
      .icon-sourceDel{
        &:hover{
          color: #f44336;
        }

      }
    }
  }
}
</style>
