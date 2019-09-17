<template>
  <div class="set_radmin">
    <div class="clearfix set_radmin_box">
       <div class="set_msg_title">
         <p>消息弹窗提醒设置</p>
         <p>勾选后相关消息将会弹窗通知</p>
       </div>
       <div class="set_msg_switch">
         <i-switch v-model="checkForm.switch" size="large"  @on-change="getChange">
            <span slot="open">允许</span>
            <span slot="close">禁止</span>
        </i-switch>
       </div>
    </div>
    <div class="set_radmin_checkbox">
      <div v-for="(item, index) in userCheck" :key="index">
        <p>{{item.name}}</p>
        <div>
          <CheckboxGroup v-model="checkForm[item.group]">
           <Checkbox v-for="(items, idx) in item.children" :key="idx" :label="items.name">{{items.name}}</Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div class="button_msg">
      <p class="close_button" @click="closeFun">取消</p>
      <p class="soure_button" @click="soureFun">保存</p>
    </div>
    </div>
  </div>
</template>
<script>
import {mapMutations} from 'vuex';
import api from 'api';
export default {
    data () {
        return {
            checkForm: {
                switch: true,
                task: [],
                project: [],
                contract: [],
                bid: [],
                system: []
            },
            userCheck: {}
        };
    },
    mounted () {
        this.getMsg();
    },
    created() {
    },
    methods: {

        ...mapMutations(['setIsSetShow']),
    // 获取用户消息
        async getMsg () {
            let {data} = await api.getUserMsgList();
            if (data.err_code == 0){
                const userMsgs = data.data;
                const listFrom= this.checkForm;
                const msgList = {};
                for (let i in listFrom) {
                    if (i !== 'switch') {
                        userMsgs.forEach(element => {
                            if (element.group === i) {
                                if (!msgList[i]) {
                                    var name = '';
                                    if (i === 'bid') {
                                        name = '投标';
                                    } else if (i === 'system') {
                                        name = '系统';
                                    } else if (i === 'project') {
                                        name = '项目';
                                    } else if (i === 'task') {
                                        name = '任务';
                                    } else {
                                        name = '合同';
                                    }
                                    msgList[i] = {
                                        name: name,
                                        group: i,
                                        children: []
                                    };
                                }
                                if (element.value === '1') {
                                    if (!listFrom[i]) {
                                        listFrom[i] = [];
                                    }
                                    listFrom[i].push(element.name);
                                }
                                msgList[i].children.push(element);
                            }
                        });
                    }
                }
                this.userCheck = msgList;
            }
        },
    // 设置用户消息
        async setMsg (list) {
            const items = {
                config: JSON.stringify(list)
            };
            let {data} = await api.setUserMsgList(items);
            if (data.err_code == 0){
                this.$Message.success('保存成功');
            }
        },
    // 提交
        soureFun () {
            const checkForm = this.checkForm;
            const useMsg = this.userCheck;
            var list = {};
            for (let i in checkForm) {
                if (i !== 'switch' && checkForm[i].length > 0) {
                    const lists = useMsg[i].children;
                    const obj = checkForm[i];
                    lists.forEach(items => {
                        list[items.config_id] = '0';
                        obj.forEach(elements => {
                            for (let i in list) {
                                if (items.name === elements) {
                                    if (items.config_id === i) {
                                        list[i] = '1';
                                    }
                                }
                            }
                        });
                    });
                }
            }
            this.setMsg(list);
            this.setIsSetShow();
        },
    // 开关
        getChange(e) {
            if (!e) {
                this.checkForm = {
                    switch: true,
                    task: [],
                    project: [],
                    contract: [],
                    bid: [],
                    system: []
                };
            } else {
                const checkForm = this.checkForm;
                const userCheck = this.userCheck;
                for (let i in checkForm) {
                    for (let k in userCheck) {
                        if (i === k) {
                            const userNameList = userCheck[i].children;
                            userNameList.forEach(items => {
                                checkForm[i].push(items.name);
                            });
                        }
                    }
                }
            }
        },
    // // 改变
    // getChange(e) {
    //   console.log('改变', e)
    // },
    // 取消
        closeFun () {
            this.checkForm = {
                switch: true,
                task: [],
                project: [],
                contract: [],
                bid: [],
                system: []
            };
            this.setIsSetShow();
        }
    }
};
</script>
<style lang='less'>
.set_radmin{
 width: 100%;
 height: 100%;
}
.set_radmin_box{
 box-sizing: border-box;
 width: 100%;
 height: 80px;
 padding: 10px 10px;
 border-bottom: 1px solid @baseboard;
 position: relative;
}
.set_msg_title{
  width: calc(~"100% - 150px");
  height: 100%;
  float: left;
}
.set_msg_title>p{
 width: 100%;
 height: 30px;
}
.set_msg_title>p:first-child{
  font-weight: bold;
}
.set_msg_title>p:last-child{
  font-size: 14px;
  color: rgb(174,174,174);
}
.set_msg_switch{
  width: 150px;
  height: 100%;
  float: left;
}
.set_msg_switch>span{
  float: right;
}
.set_radmin_checkbox{
  /*width: 100%;*/
  /*height: calc(100% - 80px);*/
  padding: 10px 20px;
  .ivu-checkbox-wrapper{
    width: 30%;
  }
}
.set_radmin_checkbox>div{
 /*width: 100%;*/
 /*height: 80px;*/
 margin-top: 10px;
}
.set_radmin_checkbox>div>p{
 width: 100%;
 height: 30px;
 line-height: 30px;
 font-size: 16px;
 font-weight: bold;
}
.button_msg{
  position: absolute;
  width: 200px!important;
  height: 30px!important;
  right: 10px;
  bottom: 10px;
}
.close_button,
.soure_button{
 width: 80px!important;
 height: 30px!important;
 line-height: 30px;
 text-align: center;
 display: inline-block;
 cursor: pointer;
 border-radius: 4px;
 font-weight: normal!important;
}
.close_button{
  background: rgba(215,215,215,1);
}
.close_button:hover{
  background: rgba(215,215,215,.8)
}
.soure_button{
 background: rgba(24,191,164,.8);
 color: #ffffff;
 margin-left: 10px;
}
.soure_button:hover{
  background: rgba(24,191,164,.5);
}
</style>
