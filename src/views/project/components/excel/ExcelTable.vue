<template>
  <div>
    <div style="color: #f44336;padding: 20px 0">带*号的字段为必填项，不能为空</div>
     <div class="edittable-table-height-con">
         <table>
             <tr>
                 <th v-for="item in editIncellColumns">
                     <template v-if="item.isMust">
                         <span><b>*</b>{{item.title}}</span>
                     </template>
                     <template v-else>
                         {{item.title}}
                     </template>
                 </th>
             </tr>
             <tr v-for="(item,index) in editIncellData">
                 <td :class="{'mustSty':!item.name}">
                     <template v-if="item.editFlag.editTaskNameFlag" >
                         <span @click="showOrHidden(index,'editTaskNameFlag')" class="Disscription" :title="item.name || '暂无数据'">
                            {{item.name  || '暂无数据'}}
                         </span>
                         <Icon type="edit" @click="showOrHidden(index,'editTaskNameFlag')"></Icon>
                     </template>
                     <template v-else>
                         <div class="editParent">
                             <input v-model="item.name" class="editInput" type="text" @blur="comfirmUpdata(index,'editTaskNameFlag')"/>
                             <!--<button @click="comfirmUpdata(index,'editTaskNameFlag')"><Icon type="ios-checkmark-empty"></Icon></button>-->
                         </div>
                     </template>
                 </td>
                 <td :class="{'mustSty':item.run_member_id.matchStatus}" :title="item.run_member_id.remark_name || '暂无数据'">
                     <template v-if="item.editFlag.editTaskJionFlag">
                         <span  @click="showOrHidden(index,'editTaskJionFlag')">
                             {{item.run_member_id.remark_name  || '暂无数据'}}<Icon type="edit"></Icon>
                         </span>
                     </template>
                     <template v-else>
                         <Select v-model="item.run_member_id.member_id" :label-in-value="true" @on-change="changeSelect($event,index,'joinMember')" >
                             <Option v-for="item in JoinMembersList"  :value="item.member_id" :label="item.realname" :key="item.id">{{ item.realname }}</Option>
                         </Select>
                     </template>
                 </td>
                 <td :class="{'mustSty':item.tasktype_id.matchStatus}" :title="item.tasktype_id.tasktype_name || '暂无数据'">
                     <template v-if="item.editFlag.editTaskTypeFlag">
                         <span  @click="showOrHidden(index,'editTaskTypeFlag')">
                             {{item.tasktype_id.tasktype_name  || '暂无数据'}}<Icon type="edit"></Icon>
                         </span>
                     </template>
                     <template v-else>
                         <Select v-model="item.tasktype_id.tasktype_id" :label-in-value="true" @on-change="changeSelect($event,index,'taskType')" >
                             <Option v-for="item in TaskTypeList"  :value="String(item.id)" :label="item.tasktype_name" :key="item.id">{{ item.tasktype_name }}</Option>
                         </Select>
                     </template>
                 </td>
                 <td :class="{'mustSty':!item.expect_start_time}" :title="item.expect_start_time || '暂无数据'">
                     <template v-if="item.editFlag.editTaskStartTimeFlag">
                         <span @click="showOrHidden(index,'editTaskStartTimeFlag')">{{item.expect_start_time  || '暂无数据'}}<Icon type="edit"></Icon></span>
                     </template>
                     <template v-else>
                         <div class="editParent">
                             <DatePicker type="date" :editable="isEdit" :value="item.expect_start_time" placeholder="开始日期" @on-change="changeDate($event,1,index)" placement="bottom-end"></DatePicker>
                         </div>
                     </template>
                 </td>
                 <td :class="{'mustSty':!item.expect_end_time}" :title="item.expect_end_time || '暂无数据'">
                     <template v-if="item.editFlag.editTaskEndTimeFlag">
                         <span @click="showOrHidden(index,'editTaskEndTimeFlag')">{{item.expect_end_time  || '暂无数据'}}<Icon type="edit"></Icon></span>
                     </template>
                     <template v-else>
                         <div class="editParent">
                             <DatePicker type="date" :editable="isEdit" :value="item.expect_end_time" placeholder="结束日期" @on-change="changeDate($event,2,index)" placement="bottom-end" ></DatePicker>
                         </div>
                     </template>
                 </td>
                 <td :title="item.description || '暂无数据'">
                     <template v-if="item.editFlag.editTaskDisscriptionFlag" >
                         <span @click="showOrHidden(index,'editTaskDisscriptionFlag')" class="Disscription">
                            {{item.description  || '暂无数据'}}
                         </span>
                         <Icon type="edit"></Icon>
                     </template>
                     <template v-else>
                         <div class="editParent">
                             <input v-model="item.description" class="editInput" type="text" @blur="comfirmUpdata(index,'editTaskDisscriptionFlag')"/>
                             <!--<button @click="comfirmUpdata(index,'editTaskDisscriptionFlag')"><Icon type="ios-checkmark-empty"></Icon></button>-->
                         </div>
                     </template>
                 </td>
                 <!--<td :class="{'mustSty':item.project_child.matchStatus}" :title="item.project_child.project_child_name || '暂无数据'">-->
                     <!--<template v-if="item.editFlag.editTaskProjectFlag">-->
                         <!--<span @click="showOrHidden(index,'editTaskProjectFlag')" >-->
                             <!--{{item.project_child.project_child_name  || '暂无数据'}}<Icon type="edit"></Icon>-->
                         <!--</span>-->
                     <!--</template>-->
                     <!--<template v-else>-->
                         <!--<Select v-model="item.project_child.project_child_name" :label-in-value="true" size="small" @on-change="changeSelect($event,index,'projectChild')" >-->
                             <!--<Option v-for="item in ChildeProjectList"  :value="item.id" :label="item.name" :key="item.id">{{ item.name }}</Option>-->
                         <!--</Select>-->
                     <!--</template>-->
                 <!--</td>-->

                 <!--<td  :title="item.name || '暂无数据'">-->
                     <!--<p v-if="item.image && item.image.length > 0" class="imagesTD">-->
                         <!--<img  v-for="img in item.image" :src="img" @click="showImg(img)">-->
                     <!--</p>-->
                     <!--<span v-else>暂无数据</span>-->
                 <!--</td>-->

             </tr>
         </table>
    </div>
    <div class="footer">
      <Button type="primary" @click="preFun">上一步</Button>
      <Button type="primary" @click="uploadExcel">下一步</Button>
    </div>

      <div class="popupImg" @click="popupFlag.flag = false" v-if="popupFlag.flag">
          <div class="popupDiv">
              <img :src="popupFlag.popupSrc"/>
          </div>
      </div>

      <div class="popUp" v-if="loadingStatus">
          <Spin size="large" class="spinSty"></Spin>
      </div>
  </div>
</template>

<script>
import api from 'api';
export default {
    name: 'ExcelTable',
    data() {
        return {
            dateTime: {
                disabledDate(date) {
//                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            projectID: sessionStorage.projectID,
            loadingStatus: false,
            editIncellData: [],
            editIncellColumns: [
                {title: '任务名称', key: 'name', editFlag: true, isMust: true},
                {title: '制作人', key: 'run_member_id', editFlag: true},
                {title: '任务类型', key: 'tasktype_id', editFlag: true, isMust: true},
                {title: '任务开始', key: 'expect_start_time', editFlag: true, isMust: true},
                {title: '任务结束', key: 'expect_end_time', editFlag: true, isMust: true},
                {title: '要求说明', key: 'description', editFlag: true}
                // {title: '子项目', key: 'project_child',editFlag:true},
                // {title: '参考图片', key: 'image',editFlag:false},
            ],
            ChildeProjectList: [],
            JoinMembersList: [],
            TaskTypeList: [],
            popupFlag: {
                flag: false,
                popupSrc: null
            },
            isEdit: false
        };
    },
    methods: {
        showImg(src){
            this.popupFlag.popupSrc = src;
            this.popupFlag.flag = true;
        },
        changeSelect(value, index, type){
            // if(type=='projectChild'){
            //     this.editIncellData[index].project_child.project_child_name = value.label;
            //     this.editIncellData[index].project_child.project_child_id = value.value;
            //     this.editIncellData[index].editFlag.editTaskProjectFlag = true;
            //     this.MatchingData(this.ChildeProjectList,'project_child');
            // }else
            if (type=='joinMember'){
                this.editIncellData[index].run_member_id.remark_name = value.label;
                this.editIncellData[index].run_member_id.member_id = value.value;
                this.editIncellData[index].editFlag.editTaskJionFlag = true;
                this.MatchingData(this.JoinMembersList, 'run_member_id');
            } else {
                this.editIncellData[index].tasktype_id.tasktype_name = value.label;
                this.editIncellData[index].tasktype_id.tasktype_id = value.value;
                this.editIncellData[index].editFlag.editTaskTypeFlag = true;
                this.MatchingData(this.TaskTypeList, 'tasktype_id');
            }
        },
        changeDate(value, type, index){
            if (type == 1){
                this.editIncellData[index].expect_start_time = value;
            } else {
                this.editIncellData[index].expect_end_time = value;
            }
            this.editIncellData[index].editFlag.editTaskStartTimeFlag = true;
            this.editIncellData[index].editFlag.editTaskEndTimeFlag = true;
            this.$forceUpdate();
        },
        comfirmUpdata(index, Flag){
            this.editIncellData[index].editFlag[Flag] = true;
        },
        showOrHidden(index, Flag){
            this.editIncellData[index].editFlag[Flag] = false;
        },
        //获取子项目列表
        // getChildeProjectList(){
        //     this.$axios.post(this.GLOBAL.baseRouter + "/task/project/child-list", {id: sessionStorage.getItem('projectID')}).then((res) => {
        //         if(res.data.err_code==0){
        //             this.ChildeProjectList = res.data.data||[];
        //             this.MatchingData(res.data.data,'project_child')
        //         }else {
        //             this.$Message.error("获取子项目失败！");
        //         }
        //     })
        // },
        // 获取团队项目成员
        getJoinMembersList(){
            this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_joined_members, {project_id: sessionStorage.getItem('projectID')}).then((res) => {
                if (res.data.err_code==0){
                    this.JoinMembersList = res.data.data||[];
                    this.MatchingData(res.data.data, 'run_member_id');
                } else {
                    this.$Message.error("获取项目成员失败！");
                }
            });
        },
        //获取任务类型列表
        getTaskTypeList(){
            this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_project_tasktypelist, {project_id: sessionStorage.getItem('projectID')}).then((res) => {
                if (res.data.err_code==0){
                    this.TaskTypeList = res.data.data||[];
                    this.MatchingData(res.data.data, 'tasktype_id');
                } else {
                    this.$Message.error("获取任务类型失败！");
                }
            });
        },
        //匹配用户表格数据是否与请求列表数据匹配
        MatchingData(Arr, type) {
            //用户数据源表
            let userTableData = this.editIncellData;
            let len = userTableData.length;
            //子项目、制作人，任务类型
            let typeJudge = null;
            switch (type) {
                case 'tasktype_id':
                    typeJudge = 'tasktype_id';
                    break;
                case 'run_member_id':
                    typeJudge = 'member_id';
                    break;
                // case 'project_child':
                //     typeJudge = 'project_child_id';
                //     break
            }
            //匹配

            if (type == 'tasktype_id'){
                if (Arr.length > 0){
                    this.chaeckDataFun(Arr, typeJudge, type);
                } else {
                    for (let j = 0;j < len;j++){
                        this.$set(userTableData[j][type], 'matchStatus', true);
                    }
                    this.$Message.error("任务类型为空，无法匹配！");
                }
            } else {
                this.chaeckDataFun(Arr, typeJudge, type);
            }
        },
        chaeckDataFun(Arr, typeJudge, type){
            //用户数据源表
            let userTableData = this.editIncellData;
            let len = userTableData.length;

            var tmp = [];
            Arr.forEach(item =>{
                tmp[item.id] = 1;
            });

            for (let i=0;i<userTableData.length;i++){
                // type == 'project_child' && !type[typeJudge] ||
                if (type == 'run_member_id' && !type[typeJudge]) {
                    this.$set(userTableData[i][type], 'matchStatus', false);
                    break;
                }
                if (tmp[userTableData[i][type][typeJudge]]) {
                    //如果没匹配到状态为TRUE 根据状态来添加class
                    this.$set(userTableData[i][type], 'matchStatus', false);
                    continue;
                } else {
                    this.$set(userTableData[i][type], 'matchStatus', true);
                }
            }
        },
        uploadExcel() {
            let userTableData = this.editIncellData;
            //数据组合
            let submitData = [];
            userTableData.forEach((item=>{
                submitData.push(
                    {
                        name: item.name,
                        run_member_id: item.run_member_id.member_id,
                        tasktype_id: item.tasktype_id.tasktype_id,
                        expect_start_time: item.expect_start_time,
                        expect_end_time: item.expect_end_time,
                        description: item.description
                        // project_child:item.project_child.project_child_id,
                        // image:item.image,
                    }
                );
            }));

            //必填字段检测
            let submitFlag = true;
            for (let i=0;i<submitData.length;i++){
                let Field = null;  //字段名
                let rows = i+1; //行数
                let column = null; //列数
                if (!submitData[i].name){
                    Field = '任务名称';
                    column = 1;
                    submitFlag = false;
                    this.$Message.error('第'+rows+'行,第'+column+'列,'+ Field +'为必填项！');
                    break;
                } else if (!submitData[i].tasktype_id){
                    Field = '任务类型';
                    column = 3;
                    submitFlag = false;
                    this.$Message.error('第'+rows+'行,第'+column+'列,'+ Field +'为必填项！');
                    break;
                } else if (!submitData[i].expect_start_time){
                    Field = '任务开始';
                    column = 4;
                    submitFlag = false;
                    this.$Message.error('第'+rows+'行,第'+column+'列,'+ Field +'为必填项！');
                    break;
                } else if (!submitData[i].expect_end_time){
                    Field = '任务结束';
                    column = 5;
                    submitFlag = false;
                    this.$Message.error('第'+rows+'行,第'+column+'列,'+ Field +'为必填项！');
                    break;
                }
            }

            if (submitFlag){
                let param = {
                    data: JSON.stringify(submitData),
                    project_id: sessionStorage.projectID
                };
                let addBatch = async()=>{
                    let res = await api.addBatch(param);
                    if (res.data.err_code == 0){
                        this.loadingStatus = false;
                        this.$emit('next');
                        this.$emit('refreshTaskList');
                    } else {
                        this.loadingStatus = false;
                        this.$Message.error(res.data.err_message);
                    }
                };
                addBatch();
            }
        },
        preFun(){
            this.$emit('pre');
        },
    },
    mounted(){
        //yy-mm-dd hh:mm:ss
        // let timeRegex = new RegExp(/^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/)

        //yy-mm-dd
        // let timeRegex_2 = new RegExp(/^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))$/)

        // this.getChildeProjectList();
        this.getJoinMembersList();
        this.getTaskTypeList();
        let editIncellData = JSON.parse(sessionStorage.matchData)||[];
        editIncellData.forEach((creent, index, arr)=>{
            creent.editFlag = {
                editTaskNameFlag: true,
                editTaskStartTimeFlag: true,
                editTaskEndTimeFlag: true,
                editTaskProjectFlag: true,
                editTaskJionFlag: true,
                editTaskTypeFlag: true,
                editTaskDisscriptionFlag: true,
            };
        });
        this.editIncellData = editIncellData;
    }
};
</script>

<style lang="less" scoped>
    .edittable-table-height-con{
        min-height: 400px;overflow: auto;
        table{
            width: 100%;border-collapse: collapse;
            tr{
                th,td{
                    font-size: 14px;
                    border:1px solid @black_2;
                    font-weight: lighter;line-height: 35px;
                    text-align: center;
                    /*padding: 5px;*/
                    border: 1px solid #ece7e7;
                }
                th{
                    span{
                        position: relative;
                        b{position: absolute;top: -4px;left: -14px;font-size: 24px;color: @red}
                    }
                }
                td{
                    font-size: 13px;
                    cursor: pointer;
                    width: 16.666%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    height: 41px;
                    .ivu-icon-edit{opacity: 0;}
                    &:hover{ .ivu-icon-edit{opacity: 1;} }
                    &.mustSty{background: rgba(255, 126, 146, 0.72);}
                    .editParent{
                        position: relative;
                        .editInput{
                            width: 100%;
                            height: 40px;
                            line-height: 40px;
                            border-radius: 3px;
                            border: 1px solid #c7c6c6;
                            font-size: 12px;
                            color: @black_2;
                            padding: 0 5px;
                            outline: none;
                        }
                        button{
                            position: absolute;
                            top: 6px;
                            right: 4px;
                            height: 25px;
                            line-height: 24px;
                            padding: 0 7px;
                            outline: none;
                            font-size: 16px;
                            cursor: pointer;
                            border-top-right-radius: 3px;
                            border-bottom-right-radius: 3px;
                            border: 1px solid #ccc;
                            &:hover{
                                background: #b5b5b5;
                                color: #fff;
                            }
                        }
                    }
                    .Disscription{
                        display: inline-block;
                        width: 140px;
                        float: left;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        /*white-space: nowrap;*/
                        /*text-align: center;*/
                    }
                    .imagesTD{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img{
                            width: 30px;height: 30px;
                        }
                    }
                }
            }
        }
    }

  .footer{position: absolute;right: 30px;bottom: 5px}
    .popupImg{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.5);
        display: flex;
        align-items: center;
        justify-content: center;
        .popupDiv{
            display: inline-block;
            max-width: 1024px;
            max-height: 768px;
            img{max-width: 1024px;max-height: 768px;}
        }
    }
    .popUp{
        position: absolute;top: 0;left: 0;right: 0;bottom: 0;display: flex;justify-content: center;align-items: center;background: rgba(0,0,0,.1);z-index: 999;
    }
</style>
