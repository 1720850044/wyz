<!--member.vue 项目统计->成员统计-->


<template>
    <div>
    <Row :gutter="30"  >
        <Col span="24" class-name='bgw'>
            <div class="itemBox base-card">
              <div class="base-card-head">
                <div class="base-card-operation-head" >成员资源反馈</div>
                <div class="base-card-operation-icon" ><!--p class="iconfonts icon-shenglve-"></p--></div>
                <div style="clear:both"></div>
              </div>
                <!-- <div class="itemBox-CheckboxGroup">
                  <CheckboxGroup v-model="feedBack.selectUsers" @on-change="updateChart('MemberFeedback')" >
                      <Checkbox v-for="(item,index) in memberTaskUsers" :label="item" :key='index'></Checkbox>
                  </CheckboxGroup>
                </div> -->
                <!-- <div id='MemberFeedback' class="itemBox-chartBox" style="position:relative">
                  <nothink type="project" text="暂无数据" v-if="feedBack.isNull == true"></nothink>
                </div> -->
                <task-echars v-if="objData.data"
                    :objData="objData" 
                    :isDate = "false"
                    :isRadio = "false" 
                    :isTitle = "false"
                    :statue = "false"
                    :position = "false"
                    :department = "false"
                    :accToken="powerToken"
                    :isRoll = "false"
                    :formatter = "'成员反馈'"
                    :yAxis = "yAxis"
                    :dataZoom = "dataZoom"
                    :dataZoomRoll = "dataZoomRoll"
                    :percentage = "'inside_pass_rate'"
                    :insidePercentage = "'client_pass_rate'"
                    :censusType = "'bar'"
                    :projectId = "project_id"
                    :echarsUrl="echarsUrl">
                </task-echars>
                <template v-else>
                    <div style="height: 720px">
                        <loading></loading>
                    </div>
                </template>
            </div>
        </Col>

        <Col span="24" class-name='bgw' v-if="false">
            <div class="itemBox base-card" style="margin-top:30px">
              <div class="base-card-head">
                <div class="base-card-operation-head" >项目成员任务占比</div>
                <div class="base-card-operation-icon" ><!--p class="iconfonts icon-shenglve-"></p--></div>
                <div style="clear:both"></div>
              </div>
                <!-- <div class="itemBox-CheckboxGroup">
                  <CheckboxGroup v-model="feedBack.selectUsers" @on-change="updateChart('MemberFeedback')" >
                      <Checkbox v-for="(item,index) in memberTaskUsers" :label="item" :key='index'></Checkbox>
                  </CheckboxGroup>
                </div> -->
                <!-- <div id='MemberFeedback' class="itemBox-chartBox" style="position:relative">
                  <nothink type="project" text="暂无数据" v-if="feedBack.isNull == true"></nothink>
                </div> -->
                <finance-echars v-if="taskRateObjData.data"
                    :objData="taskRateObjData" 
                    :isDate = "false"
                    :isRadio = "false"
                    :accToken="powerToken"
                    :censusType = "'line'"
                    :projectId = "project_id"
                    :echarsId = "'taskRate'"
                    :echarsUrl="taskRateEcharsUrl">
                </finance-echars>
                <div v-else style="height: 400px">
                    <nothink type="project" text="暂无数据"></nothink>
                </div>
            </div>
        </Col>
    </Row>


    </div>
</template>
<script>
import FinanceEchars from "../../../components/FinanceEchars.vue";
import TaskEchars from "../../../components/TaskEchars.vue";
import BidEchars from "../../../components/BidEchars.vue";
import { onlyAPI } from "../../../axios/apiConfig"
import api from "api";
export default {

  beforeMount() {},
  data() {
    return {
      testData:[1,2,3,4,5,6],
      initData:[],
      deleteData:[],
      taskStatusData: {},
      objData: {},
      taskRateObjData: {},
      MemberObjData: {},
      echarsUrl: '',
      taskRateEcharsUrl: '',
      MemberEcharsUrl: '',
      powerToken: '',
      project_id: 0,
      memberTaskNumData: {  //任务数量
        //xAxis: [],
        selectUsers:[],
        task_num: [],
        total_task: 5,
        isNull:false
      },
      memberTaskTimeData: { //任务用时
        //users: [],
        selectUsers:[],
        legendData: [],
        task_time: [],
        isNull:false
      },
      TimeUtilization:{   //用时利用率
        selectUsers:[],
        UtilizationData: [],
        isNull:false
      },
      feedBack:{    //反馈
          selectUsers:[],
          feedBackData:[],
          isNull:false
      },
      yAxis: [
          {name: '任务数量',type: 'value',min: 0},
          {name: '通过率',type: 'value',min: 0,
              max: 100,   //  平均分为5份
              axisLabel: {
                  formatter: '{value}%'
              }
          }
      ],
      dataZoomRoll: [
          {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              handleSize: 0, //滑动条的 左右2个滑动条的大小
              height: 20, //组件高度
              bottom: 5, //右边的距离
              handleColor: '#CBBCDB', //h滑动图标的颜色
              handleStyle: {
                  borderColor: "#CBBCDB",
                  borderWidth: "1",
                  shadowBlur: 2,
                  background: "#CBBCDB",
                  shadowColor: "#CBBCDB",
              },
              fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
              //给第一个设置0，第四个设置1，就是垂直渐变
              offset: 0,
              color: '#ddd'
              }, {
                  offset: 1,
                  color: '#ddd'
              }]),
              backgroundColor: '#F2F2F2', //两边未选中的滑动条区域的颜色
              showDataShadow: false, //是否显示数据阴影 默认auto
              showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
              handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
              filterMode: 'filter',
          }
      ],
      dataZoom: [
          {
              start: 0, //默认为0
              end: 20, //默认为100
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              handleSize: 0, //滑动条的 左右2个滑动条的大小
              height: 20, //组件高度
              bottom: 5, //右边的距离
              handleColor: '#CBBCDB', //h滑动图标的颜色
              handleStyle: {
                  borderColor: "#CBBCDB",
                  borderWidth: "1",
                  shadowBlur: 2,
                  background: "#CBBCDB",
                  shadowColor: "#CBBCDB",
              },
              fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
              //给第一个设置0，第四个设置1，就是垂直渐变
              offset: 0,
              color: '#797979'
              }, {
                  offset: 1,
                  color: '#797979'
              }]),
              backgroundColor: '#F2F2F2', //两边未选中的滑动条区域的颜色
              showDataShadow: false, //是否显示数据阴影 默认auto
              showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
              handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
              filterMode: 'filter',
          }
      ],
      memberTaskUsers:[],   //任务成员
      memberTaskNames:[]    //任务名称
    };
  },

  created() {
    let id = sessionStorage.projectID;
    this.initFun().then(() => {
        this.getTaskTimeInfo();
        //this.getMemberInfo();
        //this.getTaskRateInfo();
    });
    this.$PublicFuns.drawEchart(()=>{
      //成员任务数量
      //this.getMemberTaskNum(id);
    })
  },
  mounted() {

  },
  components: {
      FinanceEchars,
      BidEchars,
      TaskEchars
  },
  methods: {
    async initFun() {
        const res = await api.getProjectIndex();
        this.project_id = sessionStorage.getItem('projectID')-0;
        if (res.data.err_code == 0) {
            this.powerToken = res.data.data.acc_token;
        } else {
            this.$Message.error(res.data.err_message);
        }
        return this.powerToken;
    },
    getMemberInfo () {
        var self = this;
        this.MemberEcharsUrl = this.GLOBAL.baseRouter + onlyAPI.project_member_work_time;
        this.$axios.post(this.MemberEcharsUrl,{
            'project_id':self.project_id,
            'acc_token': self.powerToken
        }).then(this.getMemberSuccess);
    },
    getMemberSuccess (res) {
        this.MemberObjData = res.data.data;
    },
    getTaskTimeInfo () {
        var self = this;
        this.echarsUrl = this.GLOBAL.baseRouter + onlyAPI.project_member_feedback;
        this.$axios.post(this.echarsUrl,{
            'project_id':self.project_id,
            'acc_token': self.powerToken
        }).then(this.getTaskTimeSuccess);
    },
    getTaskTimeSuccess (res) {
        this.objData = res.data.data;
    },
    getTaskRateInfo () {
        var self = this;
        this.taskRateEcharsUrl = this.GLOBAL.baseRouter + onlyAPI.project_member_task_rate;
        this.$axios.post(this.taskRateEcharsUrl,{
            'project_id':self.project_id,
            'acc_token': self.powerToken
        }).then(this.getTaskRateSuccess);
    },
    getTaskRateSuccess (res) {
        this.taskRateObjData = res.data.data;
    },
    //js 数组去重
    uniquess(arr) {
      var hash = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) == i) {
          hash.push(arr[i]);
        }
      }
      return hash;
    },

    updateChart(name){
      //console.log('chart 更新了')
      switch (name) {
        case 'memberTaskTime':
          this.getMemberTimeChart("memberTaskTime");
          break;
        case 'memberTaskTimeUtilization':
            //console.log('刷新图表','this.getMemberTimeUtilizationChart');
              this.getMemberTimeUtilizationChart('memberTaskTimeUtilization');
          break;
        case 'MemberFeedback':
            //this.getMemberFeedbackChart('MemberFeedback');
          break;
        default:
          break;
      }

    },
    //成员任务数量
    getMemberTaskNum(id) {
      this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_task_count, {project_id: id}).then(res => {
          if (res.data.err_code == 0) {
            // console.log("项目统计->成员数量：", JSON.stringify(res.data.data));
            this.initData = res.data.data;

            let _this = this;

            if (res.data.data.length <= 0) {
              this.feedBack.isNull = true;
              this.TimeUtilization.isNull =true;
              this.TimeUtilization.isNull =true;
              this.memberTaskTimeData.isNull =true;
              this.memberTaskNumData.isNull =true;
              return false;
            }
            //组装lengend
            let lengendArr = [];
            res.data.data.forEach((item, index) => {
              //单个用户的任务数量
              _this.memberTaskNumData.task_num.push(item.task_num);
              _this.memberTaskNumData.total_task = item.total_task;
              //获取任务名
              item.tasks.forEach((task, idx) => {
                lengendArr.push(task.name);
              });
              //用户拼为数组
              _this.memberTaskUsers.push(item.realname);

              //console.log("itemss", item.tasks);
            });

            this.memberTaskNames = this.uniquess(lengendArr);
            console.log("任务名组lengendArr:",JSON.stringify(this.memberTaskNames));
            console.log("成员名组this.memberTaskUsers:",JSON.stringify(this.memberTaskUsers));
            this.memberTaskTimeData.selectUsers = this.TimeUtilization.selectUsers = this.feedBack.selectUsers = this.memberTaskUsers;
            //
            let timeData = [];  //项目用时
            let timeUseData = []; //使用率
            let timeFeedbackData = [];//反馈
            
            this.memberTaskNames.forEach((lengend, index2) => {
              let oneSeriesData = { name: lengend,type:'bar',data: [] };
              let oneSeriesDataU = {name:lengend,type:'bar',data: []};
              let oneSeriesDataFB = {name: lengend,type:'scatter',data: []};
              res.data.data.forEach((item, index) => {
                let hasData = false;
                item.tasks.forEach((task, index3) => {
                  //包装lengend
                  if (task.name == lengend) {
                    oneSeriesData.data[index] = task.work_time;
                    oneSeriesDataU.data[index] = task.wt_rate;
                    oneSeriesDataFB.data[index] = task.feedback_num;
                    hasData = true;
                  }
                });
                //不存在的任务 暂用 123456789000 ,生成图片后会隐藏
                if (!hasData) {
                  oneSeriesData.data[index] = {value:'false'};
                  oneSeriesDataU.data[index] = {value:'false'};
                  oneSeriesDataFB.data[index] = {value:'false'};
                }
              });

              timeData[index2] = oneSeriesData;
              timeUseData[index2] = oneSeriesDataU;
              timeFeedbackData[index2] = oneSeriesDataFB;

            });
            this.memberTaskTimeData.task_time = timeData;
            this.TimeUtilization.UtilizationData = timeUseData;
            this.feedBack.feedBackData = timeFeedbackData;
            
            this.$nextTick(function() {
              //this.getMemberTimeChart("memberTaskTime");
              //this.getMemberTimeUtilizationChart('memberTaskTimeUtilization');
              //this.getMemberFeedbackChart('MemberFeedback');
            });

          } else {
            console.log("成员数量错误：", res.data.err_message);
          }
        });
    },

    //成员反馈
    getMemberFeedbackChart(idName) {
      let echarts = require("echarts");
      let numChart = echarts.init(document.getElementById(idName),'echartTheme');
      numChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter:function(params){
            //console.log(params);
            let unit = '次';
            let relVal = params[0].name;
            for ( var i = 0; i < params.length; i++) {
                if(params[i].value == 'false') continue
                  relVal += '<div class="circle" ><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + params[i].value+unit+"</div>";
            }
            return relVal;
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" 
          }
        },
        legend: {
          show:false,
          top:15,
          data: this.memberTaskNames
        },
        grid: {
          left: this.GLOBAL.echartCFG.gridLeft,
          right: this.GLOBAL.echartCFG.gridRight,
          bottom: "3%",
          containLabel: true
        },

        xAxis: [
          {
            type: "category",
            data: this.feedBack.selectUsers//this.memberTaskUsers
          }
        ],
        yAxis: [
          {
            type: "value",
              min:0,
              max:5,
            axisLabel: {
              formatter: "{value}次",
              // color: "#bdbdbd"
            },
          }
        ],
        series: this.feedBack.feedBackData
      });
    },

    //生成成员任务时间利用率
    getMemberTimeUtilizationChart(idName) {
      let echarts = require("echarts");
      let numChart = echarts.init(document.getElementById(idName),'echartTheme');
      numChart.setOption({

        tooltip: {
          
          trigger: "axis",
          formatter:function(params){
            //console.log(params);
            let unit = '%';
            let relVal = params[0].name;
            for ( var i = 0; i < params.length; i++) {
                if(params[i].value == 'false') continue
                  relVal += '<div class="circle" ><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + params[i].value+unit+"</div>";
            }
            return relVal;
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show:false,
          top:15,
          data: this.memberTaskNames
        },
        grid: {
          left: this.GLOBAL.echartCFG.gridLeft,
          right: this.GLOBAL.echartCFG.gridRight,
          bottom: "3%",
          containLabel: true
        },

        xAxis: [
          {
            type: "category",
            data: this.TimeUtilization.selectUsers//this.memberTaskUsers
          }
        ],
        yAxis: [
          {
            type: "value",
            min: 'dataMin',
            max: 'dataMax',
            interval: 500,
            axisLabel: {
              formatter: "{value}%",
              // color: "#bdbdbd"
            },
          }
        ],
        series: this.TimeUtilization.UtilizationData
      });
    },

    //生成成员任务用时表
    getMemberTimeChart(idName) {
      let echarts = require("echarts");
      let numChart = echarts.init(document.getElementById(idName),'echartTheme');
      numChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter:function(params){
            //console.log(params);
            let unit = '小时';
            let relVal = params[0].name;
            for ( var i = 0; i < params.length; i++) {
                if(params[i].value == 'false') continue
                  relVal += '<div class="circle" ><span style="background:'+params[i].color+'"></span>'+ params[i].seriesName + ' : ' + params[i].value+unit+"</div>";
            }
            return relVal;
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show:false,
          top:15,
          data: this.memberTaskNames
        },
        grid: {
          left: this.GLOBAL.echartCFG.gridLeft,
          right: this.GLOBAL.echartCFG.gridRight,
          bottom: "3%",
          containLabel: true
        },

        xAxis: [
          {
            type: "category",
            data: this.memberTaskTimeData.selectUsers//this.memberTaskUsers
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value}小时",
              // color: "#bdbdbd"
            },
          }
        ],
        series: this.memberTaskTimeData.task_time
      });
    },

    //生成成员任务数量图表
    getMemberTaskNumChart(idName) {
      let echarts = require("echarts");
      let numChart = echarts.init(document.getElementById(idName),'echartTheme');
      numChart.setOption({
        
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["任务数量", "百分比"]
        },
        grid: {
          left: this.GLOBAL.echartCFG.gridLeft,
          right: this.GLOBAL.echartCFG.gridRight,
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.memberTaskUsers,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 100
          },
          {
            type: "value",
            name: "百分比",
            min: 0,
            max: 100,
            position: "right",
            offset: 0,
            axisLabel: {
              formatter: "{value}%",
              // color: "#bdbdbd"
            },
            axisLine: {
              lineStyle: {
                // color: "#bdbdbd"
              }
            }
          }
        ],
        series: [
          {
            name: "任务数量",
            type: "bar",
            barWidth: "60%",
            label: "hehe",
            data: this.memberTaskNumData.task_num
          },
          {
            name: "百分比",
            data: this.memberTaskNumData.task_num.map(item =>
              parseInt((item / this.memberTaskNumData.total_task) * 100)
            ),
            type: "line"
          }
        ]
      });
    },
    //跳转
    goTaskComp() {
      this.$emit("goComp", "task");
    }
  }
};
</script>
<style lang="less" >
</style>

