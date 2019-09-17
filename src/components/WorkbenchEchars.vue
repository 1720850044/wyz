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
        <div v-if="department" class="projectDepartment" style="margin-right:10px;">
            部门
            <Select v-model="model3" style="width:100px" @on-change="changeStatue">
                <Option value="0">所有部门</Option>
                <Option v-for="item in cityList3" :value="item.id" :key="item.value">{{ item.name }}</Option>
            </Select>
        </div>
        <div v-if="position" class="projectPosition" style="margin-right:10px;">
            职能
            <Select v-model="model2" style="width:100px" @on-change="changeStatue">
                <Option value="0">所有职能</Option>
                <Option v-for="item in cityList2" :value="item.id" :key="item.value">{{ item.name }}</Option>
            </Select>
        </div>
        <div v-if="statue" class="projectStatue" style="margin-right:10px;">
            项目状态
            <Select v-model="model1" style="width:100px" @on-change="changeStatue">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
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
import api from "api";
export default {
  name: "FinanceEchars",
    props: {
        objData: { //子组件传过来的objData(从数据获取的数据)
            type: Object
        },
        statue: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
        echarsType: {
            type: String,
            default: () => {
                return '';
            }
        },
        position: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
        department: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
        isRoll: {
            type: Boolean,
            default: () => {
                return true;
            }
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
        isRadio: { // 是否显示切换按钮
            type: Boolean,
            default: () => {
                return true
            }
        },
        unit: { // 是否显示切换按钮
            type: String,
            default: ''
        },
        percentage: { // 找到需要加单位的项
            type: String,
            default: () => {
                return '';
            }
        },
        changePercentage: { // 找到需要加单位的项
            type: String,
            default: () => {
                return '';
            }
        },
        freePercentage: { // 找到需要加单位的项
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
        sort: {
            type: Boolean,
            default: () => {
                return false;
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
        dataZoomRoll: {
            type: Array,
            default: () => {
                return [];
            }
        },
        dataZoom: {
            type: Array,
            default: () => {
                return [
                    {
                        xAxisIndex: 0,
                        height: '20px',
                        bottom: 5, //右边的距离
                        filterMode: 'empty'
                    }
                ]
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
            accToken:sessionStorage.accToken,
            cityList: [
                {
                    value: '0',
                    label: '项目状态'
                },
                {
                    value: '1',
                    label: '进行中'
                },
                {
                    value: '2',
                    label: '暂停'
                },
                {
                    value: '3',
                    label: '已停止'
                },
                {
                    value: '4',
                    label: '已完成'
                }
            ],
            oldArr: [],
            cityList2: [],
            cityList3: [],
            model1: '0',
            model2: '0',
            model3: '0',
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
            this.axiosRender(); // 调接口重新获取数据
        },
        async getDepInfo () {
            const res = await api.getDepartmentInfo();
            if (res.data.err_code == 0) {
                this.cityList3 = res.data.data;
            }
        },
        async getPostInfo () {
            const res = await api.contractAbilityList();
            if (res.data.err_code == 0) {
                this.cityList2 = res.data.data;
            }
        },
        changeStatue () {
            this.axiosRender();
        },
        changeDateType () { //监听年月日粒度切换
            this.axiosRender(); // 调接口重新获取数据
        },
        // 获取数据接口
        axiosRender () {
            let titleIdx = Object.values(this.listDate).indexOf(this.nowDateType);
            this.title = Object.keys(this.listDate)[titleIdx];
            var self = this;
            let param = null
            if (this.position && this.department) {
                param = {
                    'title': self.title,
                    'ability_id': self.model2 == 0 ? null : self.model2,
                    'department_id': self.model3 == 0 ? null : self.model3,
                    'start_time': self.particleRange.split(',')[0],
                    'end_time': self.particleRange.split(',')[1],
                    'acc_token': self.accToken
                }
            } else {
                param = {
                    'title': self.title,
                    'start_time': self.particleRange.split(',')[0],
                    'end_time': self.particleRange.split(',')[1],
                    'acc_token': self.accToken
                }
            }
            this.$axios.post(self.echarsUrl,param).then(function(res){
                //console.log( res.data.data)
                if(res.data.data.data){ // 存在的时候才执行
                    self.liduData = res.data.data;
                    self.len = res.data.data.data.length;
                    self.endLen = res.data.data.data.length;
                    self.dateTypes = Object.values(res.data.data.title_list);
                    self.echarsRender(); // echars数据切换
                }
            });
        },
        tableTel (start,end) { // 粒度拖动数据变化
            var liduArr = [];
            this.starLen = Math.ceil(start/100*this.len);
            this.endLen = Math.ceil(end/100*this.len);
            this.dataTab = this.liduData.data.slice(this.len-this.endLen,this.len-this.starLen+1);
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
            if(this.sort){
                this.dataTab = this.liduData.data.reverse();
            }else{
                this.dataTab = this.liduData.data
            }
            //console.log(this.dataTab);
            if(this.percentage){
                this.handleArr(this.dataTab,this.percentage.split(',')[0]);
                this.handleArr(this.dataTab,this.percentage.split(',')[1]);
                this.handleArr(this.dataTab,this.percentage.split(',')[2]);
            }
            if(this.changePercentage){
                if(this.changePercentage.indexOf(',')){
                    this.handleArr(this.dataTab,this.changePercentage.split(',')[0]);
                    this.handleArr(this.dataTab,this.changePercentage.split(',')[1]);
                }
            }
            if(this.freePercentage){
                this.handleArr(this.dataTab,this.freePercentage);
            }
            this.newEcharsArr.length = 0;
            this.arr.shift();
            key.shift();
            key.forEach((val,index)=>{
                if(val[2] == 1){
                    this.newEcharsArr.push(this.echarsData[index+1]);
                }
            })
        },
        handleArr (oldArr,key) {
            oldArr.forEach((val,index) => {
                if(val[key]>0){
                    val[key] = "+"+ val[key] + '%';
                }else{
                    val[key] += '%';
                }
            })
        },
        // 用来动态添加echars中的series配置项 这里可以选择加入折线图还是柱状图
        seriesInstall () {
            this.series.length = 0;
            for(var i=0;i<this.newEcharsArr.length;i++){
                if(this.echarsType == 'barLine'){
                    if(i<this.newEcharsArr.length-1){
                        this.series.push(
                            {
                                name: this.arr[i],
                                type: 'bar',
                                yAxisIndex: 0,
                                barWidth:'10%',
                                data: this.newEcharsArr[i]
                            }
                        );
                    }else{
                        this.series.push(
                            {
                                name: this.arr[i],
                                type: 'line',
                                yAxisIndex: 1,
                                data: this.newEcharsArr[i]
                            }
                        );
                    }
                }else if(this.echarsType == 'line'){
                    this.series.push(
                        {
                            name: this.arr[i],
                            type: 'line',
                            data: this.newEcharsArr[i]
                        }
                    );
                }
                else{
                    this.series.push(
                        {
                            name: this.arr[i],
                            type: 'bar',
                            barWidth:'10%',
                            data: this.newEcharsArr[i]
                        }
                    );
                }
            }
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
                        formatter:(param)=>{
                            var relVal = param[0].name;
                            for (var i = 0; i < param.length; i++) {
                                let unit = this.unit === 'saturated'||this.unit === 'quality'? '%' : '个';
                                let val = param[i].value;
                                if ((this.unit === 'efficiency' || this.unit === 'quality')&& i === param.length - 1) {
                                    unit = '%'
                                    val = param[i].value >0? '+' + param[i].value : param[i].value
                                }
                                relVal += '<br/>' + param[i].marker + param[i].seriesName + ':' + val + unit
                            }
                            return relVal;
                        },
                        axisPointer: { // 可以写回调函数
                            type: "cross"
                        }
                    },
                    grid: {
                        left: '80',
                        right: '80'
                    },
                    legend: {
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
                    dataZoom: this.dataZoom,
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
            // console.log(this.echarsData);
        }
    },
    created () {
        this.getDepInfo();
        this.getPostInfo();
    },
    mounted() {
        if(this.objData.data){
            this.particleRange = this.starEndDate.toString(); // 接口所需要的参数日期
            // console.log(this.particleRange);
            this.liduData = this.objData; // 存放子组件传过来的值
            //console.log(this.liduData);
            this.len = this.objData.data.length;
            this.endLen = this.objData.data.length;
            this.dateTypes = Object.values(this.objData.title_list); //年月日季周
            this.listDate=this.objData.title_list; //年月日季周
            this.nowDateType = Object.values(this.objData.current_title)[0]; //选中的项 currnt_title
            this.echarsRender(); // echars初始化
        }
    }
}
</script>

<style lang="less" scoped>
.echars-title {
    //width:100%;
    height: 40px;
    margin: 20px 80px 0;
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
  .star-end-date,.projectStatue,.projectPosition,.projectDepartment{
      float: right;
  }
}
.echars-table{
  margin: 10px 80px;
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
.ivu-switch-checked{
  background-color: #3cd2b4 !important;
}
</style>
