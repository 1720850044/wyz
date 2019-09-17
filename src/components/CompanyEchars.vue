<template>
<div>
    <div class="echars-title">
        <div class="is-table">
            <span>
                <span>表格:</span>
                <i-switch v-model="isShowTab" size="large">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </span>
        </div>
        <div class="radio" v-show="isRadio">
            <RadioGroup v-model="nowDateType" type="button" @on-change="changeDateType">
                <Radio v-for="(item,index) in dateTypes" :label="item" :key="index"></Radio>
            </RadioGroup>
        </div>
        <div class="star-end-date" v-show="isDate">
            <span>
                <Col span="6" style="text-align: center;line-height:40px;font-size:14px;">起始时间:</Col>
                <Col span="6">
                    <DatePicker 
                    :value="starEndDate"
                    format="yyyy-MM-dd" 
                    type="daterange" 
                    placement="bottom-end" 
                    placeholder="起始日期" style="width: 200px" @on-change="changeDate">
                    </DatePicker>
                </Col>
            </span>
        </div>
    </div>
    <div :id="echarsId" style="width:100%;height:400px;"></div>
    <div v-show="isShowTab" class="echars-table">
        <Table border :columns="columns" :data="dataTab"></Table>
    </div>
</div>
</template>

<script>
/*
*组件说明
*echarsUrl: 父组件传过来的地址(必须传)
*echarsId: 同一个页面有多个统计图需要传入不同的id默认情况id是charts(如果多个图必须传)
*objData：是从父组件中传过来的值这个值是接口里面取出来的{}(必须传)
*starEndDate: 父组件给一个默认时间例如(['开始时间','结束时间'])['2018-01-09,2018-03-17'](必须传)
*accToken: 是指acc_token表示权限(必须传)
*current_title：是当前所展示的
*particle_range_most：时间段
*
*/ 
export default {
  name: "CompanyEchars",
    props: {
        objData: { //子组件传过来的objData(从数据获取的数据)
            type: Object
        },
        titleData: {
            type: Array
        },
        starEndDate: { // 查询范围
            type: Array,
            default: () => {
                return [];
            }
        },
        isDate: { // 是否显示日期条件查询
            type: Boolean,
            default: () => {
                return true
            }
        },
        total: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        granularity: { // 是否显示粒度在table中
            type: Boolean,
            default: () => {
                return true
            }
        },
        timeRange: {
            type: String,
            default: () => {
                return '';
            }
        },
        formatter: {
            type: String,
            default: () => {
                return '';
            }
        },
        isRadio: { // 是否显示切换按钮
            type: Boolean,
            default: () => {
                return true
            }
        },
        isTitle: { // 是否需要传title参数给后台
            type: Boolean,
            default: () => {
                return true
            }
        },
        projectId: {
            type: [String,Number],
            default: () => {
                return '';
            }
        },
        censusType: { //选择显示内容折线还是柱状'bar,line'柱状和折线单独的bar和line表示柱状和折线
            type: String,
            default: () => {
                return 'line'
            }
        },
        accToken: { //token表示权限
          type: String,
          default: () => {
              return '';
          }
        },
        echarsUrl: { // 接口地址
            type: String
        },
        echarsId: { // 组件id
            type: String,
            default: () => {
                return 'charts';
            }
        },
        yAxis: { // 默认y坐标只有一个表示维度 如果是数组表示两个维度
            type: [Object,Array],
            default: () => {
                return {
                        type: "value",
                        position: "left",
                        offset: 0,
                        axisLabel: {
                            formatter: "{value}"
                        }
                    }
                }
        }
    },
    data () {
        return {
            columns:[], // table的标题项
            dataTab: [], // table里面的数据内容
            dateTypes: [], // 动态存放年月日
            nowDateType: '', // 当前选中的年月日
            liduData:{}, // 存放子组件传过来的objData
            isShowTab: true, // 控制表格是否显示问题
            len: 0,
            starLen:0,
            endLen:0,
            title:0, // 接口所需要的参数
            dataValue: null, // 监听日期变化的参数
            particleRange: '', // 接口所需要的参数
            echarsData:[], // 存放echars y轴的值数据[[],[],[],[]]
            newEcharsArr: [],
            arr: [], // 存放y轴对应的中文名称
            series: [], // 存放echars中的series数据
            listDate: {} // 存放粒度列表['日','月','年']
        }
    },
    methods: {
        changeDate (daterange) { // 监听日期变化
            this.particleRange = daterange[0] + ',' + daterange[1];
            //this.nowDateType = Object.values(this.liduData.current_title)[0];
            //console.log(this.particleRange,this.nowDateType);
            this.axiosRender(); // 调接口重新获取数据
        },
        changeDateType () { //监听年月日粒度切换
            this.axiosRender(); // 调接口重新获取数据
        },
        // 获取数据接口
        axiosRender () {
            let titleIdx = Object.values(this.listDate).indexOf(this.nowDateType);
            this.title = Object.keys(this.listDate)[titleIdx];
            var self = this;
            if(this.isDate && this.isTitle){
                var param = {
                    'title': self.title,
                    'time': self.particleRange,
                    'acc_token': self.accToken
                }
            }else if(this.isTitle && this.projectId){
                var param = {
                    'title': self.title,
                    'project_id': this.projectId,
                    'acc_token': self.accToken
                }
            }else if(this.isDate){
                var param = {
                    'title': self.title,
                    'start_time': !self.particleRange.split(',')[0] == true ? 'null' : self.particleRange.split(',')[0],
                    'end_time': !self.particleRange.split(',')[1] == true ? 'null' : self.particleRange.split(',')[1],
                    'acc_token': self.accToken
                }
            }else if(this.isTitle){
                var param = {
                    'title': self.title,
                    'acc_token': self.accToken
                }
            }
            if(this.timeRange){
                var param = {
                    'title': self.title,
                    'project_id': self.projectId,
                    'time': self.particleRange,
                    'acc_token': self.accToken
                }
            }
            this.$axios.post(self.echarsUrl,param).then(function(res){
                //console.log( res.data.data)
                if(res.data.data.data){ // 存在的时候才执行
                    self.liduData = res.data.data;
                    self.len = res.data.data.data.length;
                    self.endLen = res.data.data.data.length;
                    if(!res.data.data.title_list){
                        res.data.data.title_list = {
                            '1': '日',
                            '2': '月',
                            '3': '年',
                        }
                    }
                    self.dateTypes = Object.values(res.data.data.title_list);
                    self.echarsRender(); // echars数据切换
                }
            });
        },
        tableTel (start,end) { // 粒度拖动数据变化
            var liduArr = [];
            this.dataTab = [];
            this.starLen = Math.ceil(start/100*this.len);
            this.endLen = Math.ceil(end/100*this.len);
            //this.dataTab.slice(this.starLen,this.endLen)
            // if(this.endLen == this.len){
            //     this.dataTab = this.liduData.data.slice(0,this.len-this.starLen+1);
            // }else if(this.starLen == 0){
            //     this.dataTab = this.liduData.data.slice(this.len-this.endLen,this.len);
            // }else{
            //     this.dataTab = this.liduData.data.slice(this.len-this.endLen,this.len-this.starLen+1);
            // }
            this.dataTab = this.liduData.data.slice(this.len-this.endLen,this.len-this.starLen+1);
            //this.dataTab = liduArr.reverse();
        },
        columnsR (key) { // table控制行列表项
            this.arr.length = 0;
            this.columns.length = 0;
            this.dataTab.length = 0;
            for(var i=0;i<key.length;i++){
                this.columns.push(
                    {
                        'title':key[i][1],
                        'key':key[i][0]
                    }
                );
                this.arr.push(key[i][1]);
            }
            this.dataTab = this.liduData.data.reverse();
            this.newEcharsArr.length = 0;
            this.arr.splice(0,1);
            key.splice(0,1);
            if(this.granularity){ // 是否有粒度
                // 这个是处理那些数据需要展示的1表示展示0不展示
                key.forEach((val,index)=>{
                    if(val[2] == 1){
                        this.newEcharsArr.push(this.echarsData[index+1]);
                    }
                    
                })
            }else{
                if(this.total){
                    this.echarsData.splice(1,1);
                }
                key.forEach((val,index)=>{
                    if(val[2] == 1){
                        this.newEcharsArr.push(this.echarsData[index]);
                    }
                })
            }
            //console.log(this.newEcharsArr)
        },
        // 用来动态添加echars中的series配置项 这里可以选择加入折线图还是柱状图
        seriesInstall () {
            this.series.length = 0;
            //console.log(this.censusType);
            if(this.total){
                this.arr.shift();
            }
            for(var i=0;i<this.newEcharsArr.length;i++){
                if(this.censusType == 'heap'){
                   this.series.push(
                        {
                            name: this.arr[i],
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            data: this.newEcharsArr[i]
                        }
                    );
                }else{
                    if(i < this.newEcharsArr.length-1){
                        this.series.push(
                            {
                                name: this.arr[i],
                                type: 'bar',
                                barWidth:this.objData.data.length > 8 ? '5%' : '10%',
                                data: this.newEcharsArr[i]
                            }
                        );
                    }else{
                        //console.log(this.arr[i]);
                        //console.log(this.newEcharsArr[i]);
                        this.series.push(
                            {
                                name: this.arr[i],
                                type: 'line',
                                data: this.newEcharsArr[i]
                            }
                        );
                    }
                }
            }
            // console.log(this.series)
        },
        // 初始化echars
        echarsRender () {
            var self = this;
            this.echarsDataRender(); // 组装echars里面的数据将它转化成echars所需要的数据
            this.$PublicFuns.drawEchart(()=>{
                // console.log(echarts);
                var myChart = echarts.init(document.getElementById(this.echarsId),'echartTheme');
                this.columnsR(this.liduData.field_list);
                //console.log(this.liduData);
                this.seriesInstall(); // 组装数据echars里面的数据使series里面的数据动态改变
                //console.log(this.series);
                myChart.setOption({
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: "axis",
                        formatter:function(param){
                            if(self.formatter == 'statisProject'){
                                param.unshift({
                                    'marker': '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#FF6699;"></span>',
                                    'seriesName': '项目合计',
                                    'value': Number(param[0].value) + Number(param[1].value) + Number(param[2].value) + Number(param[3].value)
                                });
                                var relVal = param[1].name;
                            }else{
                                var relVal = param[0].name;
                            }
                            for(var i=0;i<param.length;i++){
                                if(self.formatter == 'statisProject'){
                                    relVal += '<br/>'+param[i].marker+param[i].seriesName+':'+param[i].value+'个'
                                }
                                if(self.formatter == '任务状态统计'){
                                    relVal += '<br/>'+param[i].marker+param[i].seriesName+':'+param[i].value+'个'
                                }
                            }
                            return relVal;
                        },
                        // formatter: '{b0}<br/>{a0}:{c0}<br/>{a1}:{c1}<br/>{a2}:{c2}<br/>{a3}:{c3}'+'%',
                        axisPointer: { // 可以写回调函数
                            type: "cross"
                        }
                    },
                    grid: {
                        left: '40',
                        right: '40'
                    },
                    legend: {
                        top:'6%', 
                        data: this.arr
                    },
                    xAxis: {
                        axisTick : {
                            inside: false,
                            length: 0,
                            lineStyle: {
                                color: '#00f',
                                shadowColor: '#00f',
                                shadowOffsetY: 0
                            }
                        },
                        data: this.echarsData[0]
                    },
                    yAxis: this.yAxis,
                    dataZoom: [
                        {
                            xAxisIndex: 0,
                            height: '20px',
                            bottom: 5, //右边的距离
                            filterMode: 'empty'
                        }
                    ],
                    series: this.series
                })
                // 监听粒度变化
                myChart.on("datazoom", function (param) {
                    self.tableTel(param.start,param.end);
                });
            });
            
        },
        // 动态组装x1,x2,x3,x4的数据格式[[],[],[],[]];
        echarsDataRender () {
            var self = this;
            self.echarsData.length = 0;
            if(this.liduData.field_list && this.liduData.data){
                this.liduData.field_list.forEach(function(val,index){
                    var newArr = [];
                    self.liduData.data.forEach(function(v,k){
                        newArr.push(Object.values(v)[index]);
                    });
                    self.echarsData.push(newArr);
                });
            }
            //console.log(this.arr);
        }
    },
    created () {
    },
    mounted() {
        if(this.objData.data){
            this.particleRange = this.starEndDate.toString(); // 接口所需要的参数日期
            // console.log(this.particleRange);
            this.liduData = this.objData; // 存放子组件传过来的值
            //console.log(this.liduData);
            this.len = this.objData.data.length;
            this.endLen = this.objData.data.length;
            if(!this.objData.title_list){
                this.objData.title_list = {
                    '1': '日',
                    '2': '月',
                    '3': '年',
                }
            }
            this.dateTypes = Object.values(this.objData.title_list); //年月日季周
            this.listDate=this.objData.title_list; //年月日季周
            //console.log(this.objData.current_title)
            if(!this.objData.current_title){
                this.objData.current_title = {
                    '1': '日'
                }
            }
            this.nowDateType = Object.values(this.objData.current_title)[0]; //选中的项 currnt_title
            /*ECharts图表*/
            //console.log(this.dateTypes);
            this.echarsRender(); // echars初始化
        }else{
          //console.log('没有数据')
          //console.log(this.objData.data)
        }
    }
}
</script>

<style lang="less" scoped>
.echars-title {
    //width:100%;
    height: 40px;
    margin: 20px 35px 0;
    // display: flex;
    // margin: 15px 0;
    // justify-content: center;
    //align-items: center;
  .is-table{
      float: left;
      //margin-left: 20px;
      line-height: 40px;
  }
  .radio{
      float: left;
      line-height: 40px;
      margin-left:10px;
  }
  .star-end-date{
      float: right;
  }
}
.echars-table{
  margin: 10px 40px;
}
</style>
<style>
.ivu-radio-group-button .ivu-radio-wrapper-checked{
  background: #3cd2b4;
  border-color:#3cd2b4;
  color: #fff; 
  box-shadow: -1px 0 0 0 #3cd2b4;
}
.ivu-radio-group-button .ivu-radio-wrapper-checked:first-child {
    border-color: #3cd2b4;
}
.ivu-radio-group-button .ivu-radio-wrapper-checked:hover{
  border-color: #3cd2b4;
  color: #fff;
}
.ivu-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
.ivu-switch-checked{
  background-color: #3cd2b4 !important;
}
.ivu-row{
    margin-left: 0 !important;
    margin-right: 0 !important;
}
</style>
