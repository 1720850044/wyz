<!-- 任务项目组分类 -->
<template>
    <div>
        <div class="taskHead">
            <div class="taskInfo">
              <span v-for="item in childProjectList" :key='item.name'>
                <a href="javascript:;" @click=filterTask(item) >
                    {{item.name}} ({{item.task_count}})
                    <div v-if="isShowModify" class="opration">
                        <div v-if="!item.isAll" >
                            <Button type="text" size="small" icon="edit" class="hideIconDel"  @click="showModifySubProject('modify')"></Button>
                            <Button type="text" size="small" icon="trash-b" class="hideIconDel" @click="childDel(item.id)"></Button>
                        </div>
                    </div>
                </a>
              </span>
            </div>
            <div class="op">
                <Button type="text" size="small" icon="edit" @click="showModify" style="width =40px"></Button>
                <Button type="text" size="small" icon="plus-round" @click="showModifySubProject('creat')" style="width =40px"></Button>
            </div>
            <span v-if="isShowModifySubProject">
                <div class="taskclassedit">
                    <Input v-model="subProjectManager" placeholder="负责人" icon="ios-plus-empty" style="width:100px"></Input>
                    <Input v-model="subProjectName" placeholder="子项目名称" style="width: 200px"></Input>
                    <Button type="primary" size="small" @click="saveModifySubproject">保存</Button>
                    <Button type="ghost" size="small" @click="showModifySubProject">取消</Button>
                </div>
              </span>

        </div>
    </div>
</template>
<script>
import {projectList, getChildList} from "@/config/env.js";
export default {
    name: 'taskclasses',
    data(){
        return {
            projectId: 0, //项目ID
            childProjectList: [], //子项目列表
            isShowModifySubProject: false,
            isShowModify: false,
            modifyStatus: "",
            subProjectManager: "",
            subProjectName: "",
        };
    },
    mounted() {
        this.getProjectInfo();
    },
    methods: {

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
                    this.$Message.error("数据加载出错了！请刷新浏览器");
                }
            );
        },
        showModify() {
            this.isShowModify = !this.isShowModify;
        },
        // 显示编辑子项目组件
        showModifySubProject(Status) {
            this.modifyStatus = Status;
            this.isShowModifySubProject = !this.isShowModifySubProject;
        },
        //获得项目列表
        //这里逻辑还有问题，没有根据项目去取值
        getProjectInfo() {
            let project_id = sessionStorage.projectID;
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_info, {id: project_id})
                .then(res => {
                    this.projectId = res.data.id;
                    this.$emit('setProjectInfo', res.data);
                    this.getProjectChildInfo();
                })
                ["catch"](error => {
                    this.$Message.error("获得项目信息失败，请重试！");
                    return false;
                });
            return true;
        },
        getProjectChildInfo() {
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_child_list, {id: this.projectId})
                .then(res => {
                    this.childProjectList = res.data.data;
                    let max = 0;
                    this.childProjectList.forEach(
                        (res)=>{
                            max += parseInt(res.task_count);
                            res.project_child_id = res.id;
                        });
                    this.childProjectList.unshift(
                        {
                            name: "所有任务",
                            task_count: max.toString(),
                            project_id: this.projectId,
                            isAll: true
                        }
                    );
                })
                ["catch"](error => false);
            return true;
        },
        //hover子“项目任务”编辑，删除图标
        dataDetails: function(e) {
            let el = event.currentTarget.children[0].children[0];
            let el2 = event.currentTarget.children[0].children[1];
            el.style.display = "inline-block";
            el2.style.display = "inline-block";
        },
        hiddenDetail: function(e) {
            let el = event.currentTarget.children[0].children[0];
            let el2 = event.currentTarget.children[0].children[1];
            el.style.display = "";
            el2.style.display = "";
        },
        //子“项目任务”筛选切换样式
        filterTask(tem) {
            $(".taskHead .taskInfo a").click(function() {
                $(".taskHead .taskInfo a").removeClass("active");
                $(this).addClass("active");
            });
            this.$emit('changeTaskListData', tem);
        },
        //刪除，子“项目任务”筛选
        childDel: function(id) {
            let cdt = this;
            let delObj = {};
            delObj.id = id;
            cdt.$axios
            .post("/task/project/child-delete", delObj)
            .then(del => {
                if (del.data.err_code === 0) {
                    cdt.getProjectInfo();
                    cdt.$Message.success("刪除成功！");
                } else {
                    cdt.$Message.error(dis.data.err_message);
                }
            });
        },
        // 新增保存，子“项目任务”
        saveModifySubproject: function() {
            let info = {};
            info.project_id = this.projectId;
            info.name = this.subProjectName;
            let add = "";
            let result = "";
            if (this.modifyStatus == 'creat') {
                add = this.GLOBAL.baseRouter+this.$GLOBALAPI.task_child_add;
                result = "新增子项目成功！";
            } else if (this.modifyStatus == 'modify') {
                add = this.GLOBAL.baseRouter+this.$GLOBALAPI.task_child_update;
                result = "修改成功！";
            } else {
                return;
            }
            this.$axios.post(add, info)
            .then(dis => {
                if (dis.data.err_code === 0) {
                    this.$Message.success("新增子项目成功！");
                    this.getProjectInfo();
                } else {
                    this.$Message.error(dis.data.err_message);
                }
            })
            ["catch"](error => {
                this.$Message.error("请求失败，请刷新重试！");
            });
        },
    }
};
</script>

<style>
.taskHead {
  margin: -10px 0px 0px 0px;
  font-size: 14px;
  height: 40px;
}
.taskHead .taskInfo {
  display:inline-block;
  overflow:hidden;
}
.taskHead .taskInfo a {
  width:120px;
  float: left;
  color: #666;
  margin : 0px 6px 0px 0px;
}
.taskHead .taskInfo .opration {
    width: 60px;
}
.taskHead .taskInfo b {
  color: #555;
}
.taskHead .taskInfo span {
  margin-right: 12px;
}
.taskHead .taskInfo .active {
  background: #3399ff;
  color: #fff;
}
.taskHead .taskInfo .active:hover {
  color: #fff;
}
.taskHead .taskclassedit {
  float: right;
  margin : -4px 60px 0px 0px;
}
.taskHead .op {
  float: right;
}
.taskHead .taskInfo .hideIconDel {
  font-size: 10px;
}
</style>
