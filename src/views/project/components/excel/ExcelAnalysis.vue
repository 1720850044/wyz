<template>
  <div>
    <div class="pipeiSty">
      <Card style="width: 30.333%" id="uploadExcel">
        <p slot="title">
          <Icon type="navicon-round"></Icon>
          已识别字段和数据，拖动至右侧
        </p>
        <div id="excelList">
          <p v-for="(item, index) in excelList" :key="index" class="notwrap todolist-item" :data-index="index">{{ item.title }}  ： {{ item.label }}</p>
        </div>
      </Card>
      <Card style="width: 36.333%">
        <p slot="title">
          <Icon type="android-funnel"></Icon>
          匹配数据
        </p>
        <ul id="dragUl">
          <li v-for="(item,index) in titleList" :key="index">
            <span>{{item.name}}</span>
            <div :id="item.el"></div>
          </li>
        </ul>
      </Card>
      <Card style="width: 30.333%">
        <p slot="title">
          <Icon type="android-funnel"></Icon>
          智能匹配的数据
        </p>
        <div>
          <ul class="matchList" style="line-height: 40px;">
            <li>任务名称 ： {{mate.name}}</li>
            <li>制作人 ： {{mate.run_member_id}}</li>
            <li>任务类型 ： {{mate.tasktype_id}}</li>
            <li>预计开始 ： {{mate.expect_start_time}}</li>
            <li>预计结束 ： {{mate.expect_end_time}}</li>
            <li>要求说明 ： {{mate.description}}</li>
            <!--<li>子项目 ： {{mate.project_child}}</li>-->
            <!--<li>参考图片 ： {{mate.image}}</li>-->
          </ul>
        </div>
      </Card>
    </div>
    <div class="footer">
      <Button type="primary" @click="preFun">上一步</Button>
      <Button type="primary" @click="nextFun">下一步</Button>
    </div>
    <div class="popUp" v-if="loadingStatus">
      <Spin size="large" class="spinSty"></Spin>
    </div>
  </div>
</template>

<script>
    import Sortable from 'sortablejs';
    import DragableTable from './dragableTable.vue';
    import api from 'api';
    var mate = {
        name: '',
        expect_start_time: '',
        expect_end_time: '',
        project_child: '',
        run_member_id: '',
        tasktype_id: '',
        image: '',
        description: ''
    };
    export default {
        name: 'ExcelAnalysis',
        components: {
            DragableTable
        },
        data() {
            return {
                headList: [],
                firstList: [],
                loadingStatus: true,
                excelList: [],
                affordList: [],
                columnsList: [],
                tableData: [],
                columns: [
                    {
                        title: '字段',
                        key: 'name'
                    }
                ],
                titleList: [
                    {
                        name: '任务名称',
                        el: 'taskName'
                    },
                    {
                        name: '制作人',
                        el: 'participants'
                    },
                    {
                        name: '任务类型',
                        el: 'taskStyle'
                    },
                    {
                        name: '预计开始',
                        el: 'startTime'
                    }, {
                        name: '预计结束',
                        el: 'endTime'
                    },
                    {
                        name: '要求说明',
                        el: 'remarks'
                    }
                    // {
                    //     name: '子项目',
                    //     el:'subproject'
                    // },

                    // {
                    //     name: '参考图片',
                    //     el:'images'
                    // },

                ],
                mate: {},
                excel_key: ''
            };
        },
        created() {

        },
        mounted() {
            this.analysisExcel(sessionStorage.analysisFileId);
            document.body.ondrop = function(event) {
                event.preventDefault();
                event.stopPropagation();
            };
            this.dragableAssembly("excelList");
            this.dragableAssembly("taskName");
            this.dragableAssembly("participants");
            this.dragableAssembly("taskStyle");
            this.dragableAssembly("startTime");
            this.dragableAssembly("endTime");
            this.dragableAssembly("remarks");
            // this.dragableAssembly("subproject");
            // this.dragableAssembly("images");
            this.bubbleAddFile();

        },
        methods: {
          // 气泡
            async bubbleAddFile(){
                let {data} = await api.bubbleAddFile();
                if (data.err_code === 0){
                    if (data.guide && data.guide === 'addFile'){
                        this.bubble();
                    }
                }
            },
            bubble(){
                let text = this.$lau.bubble.uploadExcel;
                this.$nextTick(() => {
                    let defaultOptions = [
                        {
                            id: 'uploadExcel',
                            position: 'right',
                            title: text[0].title,
                            content: text[0].content,
                            relative: 'body',
                        },
                    ];
                    setTimeout(() => {
                        this.$bubble(defaultOptions);
                    }, 300);
                });
            },

            /**
             * 配置sortable
             */
            dragableAssembly(idDom) {
                let idDom2 = document.getElementById(idDom);
                let _this= this;
                Sortable.create(idDom2, {
                    group: {
                        name: 'list',
                        pull: function () {
                            if (idDom2.getAttribute('id') == 'excelList'){
                                return 'clone';
                            } else {
                                return false;
                            }
                        }
                    },
                    animation: 120,
                    ghostClass: 'placeholder-style',
                    fallbackClass: 'iview-admin-cloned-item',
                    onChoose(event){
                        let toIdDom = event.to.id;
                        if (toIdDom != 'excelList'){
                            document.getElementById(toIdDom).innerHTML = "";
                            switch (toIdDom) {
                                case "taskName":
                                    _this.mate.name = '';
                                    break;
                                case "participants":
                                    _this.mate.run_member_id = '';
                                    break;
                                case "taskStyle":
                                    _this.mate.tasktype_id = '';
                                    break;
                                case "startTime":
                                    _this.mate.expect_start_time = '';
                                    break;
                                case "endTime":
                                    _this.mate.expect_end_time = '';
                                    break;
                                case "remarks":
                                    _this.mate.description = '';
                                    break;
                                // case "subproject":
                                //     _this.mate.project_child = '';
                                //     break;
                                // case "images":
                                //     _this.mate.image = '';
                                //     break;
                            }
                        }
                    },
                    onEnd(event){
                        let toIdDom = event.to.id;
                          // console.log(event);
                          // console.log(event.item.innerText.split('：')[1]);
                        switch (toIdDom) {
                            case "taskName":
                                _this.mate.name = event.item.innerText.split('：')[0].split(' ')[0];
                                break;
                            case "participants":
                                _this.mate.run_member_id = event.item.innerText.split('：')[0].split(' ')[0];
                                break;
                            case "taskStyle":
                                _this.mate.tasktype_id = event.item.innerText.split('：')[0].split(' ')[0];
                                break;
                            case "startTime":
                                _this.mate.expect_start_time = event.item.innerText.split('：')[0].split(' ')[0];
                                break;
                            case "endTime":
                                _this.mate.expect_end_time = event.item.innerText.split('：')[0].split(' ')[0];
                                break;
                            case "remarks":
                                _this.mate.description = event.item.innerText.split('：')[0].split(' ')[0];
                                break;
                              // case "subproject":
                              //     _this.mate.project_child = event.item.innerText.split('：')[0].split(' ')[0];
                              //     break;
                              // case "images":
                              //     _this.mate.image = event.item.innerText.split('：')[0].split(' ')[0];
                              //     break;
                        }
                    },
                });
            },

            /**
             * 解析excel
             */
            analysisExcel(fileId) {
                let data = {
                    fid: fileId
                };
                this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_resolve_excel, data).then(res => res.data).then(res => {
                    if (res.err_code == 0) {
                        this.loadingStatus = true;
                        let excelData = res;
                        if (excelData) {
                            this.loadingStatus = false;
                        }
                        this.excel_key = res.excel_key;
                        // 获取excel中第一条数据
                        res.excel_data.forEach((item, index) => {
                            for (let i = 0; i < 6; i++) {
                                let k = res.excel_data[0][i];
                                let j = res.excel_data[1][i];
                                this.excelList.push({title: k, label: j});
                            }
                        });
                        let arrLength = this.excelList.length / 2;
                        this.excelList = this.excelList.slice(0, arrLength);
                        // 获取智能匹配的数据
                        this.mate = res.mate;
                    } else {
                        this.loadingStatus = false;
                        this.$Message.error('文件解析失败，请重新上传！');
                        // this.$Message.error(res.err_message+'，请重新上传！');
                    }
                });
            },
            nextFun(){
                this.loadingStatus = true;
                let data = {
                    mate: JSON.stringify(this.mate),
                    excel_key: this.excel_key,
                    project_id: sessionStorage.projectID
                };
                // sessionStorage.matchData = JSON.stringify(data)
                let mateData = async()=>{
                    let res = await api.mateExcel(data);
                    if (res.data.err_code == 0){
                        this.loadingStatus = false;
                        sessionStorage.matchData = JSON.stringify(res.data.data);
                        this.$emit('next');
                    } else {
                        this.loadingStatus = false;
                        this.$Message.error(res.data.err_message);
                    }
                };
                mateData();
            },
            preFun(){
                this.$emit('pre');
            }
        }
    };
</script>
<style lang="less" scoped>
  .pipeiSty{
    display: flex;justify-content: space-between;margin-top: 20px;padding-bottom:30px;
    #excelList{
      overflow: auto;
      p{
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        /*padding: 8px 10px;*/
        border-radius: 3px;
        border: 1px dashed #e2e2e2;
        margin: 5px 0;
        cursor: pointer;
      }
    }
    #dragUl{
      li{
        display: flex;justify-content: space-between;align-items: center;margin: 5px 0;
        div{border:1px dashed #e1e1e1;width: 240px;height: 40px;line-height:40px;border-radius: 3px;overflow: hidden;
        p{height: 40px;line-height:40px;padding:0 10px;cursor: pointer}
        }
      }
    }
    .matchList{
      li{margin: 5px 0;border: 1px dashed #e1e1e1;border-radius: 3px;padding: 0 10px;height: 40px;line-height: 40px}
    }
  }
  .footer{position: absolute;right: 30px;bottom: 5px;padding-bottom: 20px;}
  .popUp{
    position: absolute;top: 0;left: 0;right: 0;bottom: 0;display: flex;justify-content: center;align-items: center;background: rgba(0,0,0,.1);z-index: 999;
  }
@import 'style/draggableList.less';
</style>
