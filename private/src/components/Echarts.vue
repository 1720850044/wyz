<template>
<div>
    <div>
     <RadioGroup v-model="nowDateType" type="button" @on-change="changeDateType">
        <Radio v-for="(item,index) in dateTypes" :label="item" :key="index"></Radio>
      </RadioGroup>
      <span>
        <span>表格:</span>{{elem}}
        <i-switch v-model="isShowTab" size="large">
          <span slot="open">开</span>
          <span slot="close">关</span>
        </i-switch>
      </span>
      <span>
          <Col span="12">
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
    <div id="charts" style="width:100%;height:400px;"></div>
    <div v-show="isShowTab">
       <Table border :columns="columns" :data="dataTab"></Table>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import utli from './tools/utli';
import { setTimeout } from 'timers';
var echarts = require('echarts');
import qs from 'querystring'
import { log } from 'util';
export default {
    props: {
        objData: { //子组件传过来的objData(从数据获取的数据)
            type: Object
        },
        titleData: {
            type: Array
        },
        starEndDate: {
            type: Array
        },
        elem: {
            type: String,
            default: () => {
                return 'charts'
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
            arr: [], // 存放y轴对应的中文名称
            series: [], // 存放echars中的series数据
            listDate: [] // 存放粒度列表['日','月','年']
        }
    },
    methods: {
        changeDate (daterange) { // 监听日期变化
            this.dataValue = daterange;
            this.particleRange = this.dataValue[0] + ',' + this.dataValue[1];
            this.nowDateType = this.liduData.currnt_title;
            this.axiosRender(); // 调接口重新获取数据
        },
        changeDateType () { //监听年月日粒度切换
            this.axiosRender(); // 调接口重新获取数据
        },
        // 获取数据接口
        axiosRender () {
            var self = this;
            this.title = this.listDate.indexOf(this.nowDateType) + 1;
            axios.post('https://dev.banbooyun.com/index.php?r=hanstest/test',qs.stringify({
                'title': self.title,
                'particle_range': self.particleRange
            })).then(function(res){
                self.liduData = res.data.data;
                self.len = res.data.data.data.length;
                self.endLen = res.data.data.data.length;
                self.dateTypes = Object.values(res.data.data.title_list);
                self.echarsRender(); // echars数据切换
                self.nowDateType = Object.values(self.liduData.currnt_title)[0];
                
            });
        },
        tableTel (start,end) { // 粒度拖动数据变化
            var liduArr = [];
            this.starLen = Math.ceil(start/100*this.len);
            this.endLen = Math.ceil(end/100*this.len);
            for(var i=this.starLen;i<this.endLen;i++){
                liduArr.push(this.liduData.data[i]);
            }
            this.dataTab = liduArr;
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
            this.dataTab = this.liduData.data;
            this.arr.splice(0,1);
        },
        // 用来动态添加echars中的series配置项
        seriesInstall () {
            this.series.length = 0;
            for(var i=1;i<this.echarsData.length;i++){
                this.series.push(
                    {
                        name: this.arr[i-1],
                        type: 'line',
                        data: this.echarsData[i]
                    },
                    {
                        name: this.arr[i-1],
                        type: 'bar',
                        data: this.echarsData[i]
                    }
                );
            }
        },
        // 初始化echars
        echarsRender () {
            var self = this;
            this.echarsDataRender(); // 组装echars里面的数据将它转化成echars所需要的数据
            var myChart = echarts.init(document.getElementById('charts'));
            this.columnsR(this.liduData.field_list);
            //console.log(this.liduData);
            this.seriesInstall(); // 组装数据echars里面的数据使series里面的数据动态改变
            //console.log(this.series);
            myChart.setOption({
                title: {
                    text: 'demo'
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: { // 可以写回调函数
                        type: "cross"
                    }
                },
                grid: {
                    
                },
                legend: {
                    data: this.arr,
                    x: "right",
                    y: 16,
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
                yAxis: {
                    type: "value",
                    //name: '数量',
                    position: "left",
                    offset: 0,
                    axisLabel: {
                    formatter: "{value}"
                    }
                },
                dataZoom: [
                    {
                        xAxisIndex: 0,
                        height: '20px',
                        filterMode: 'empty',
                        // startValue:10
                    }
                ],
                series: this.series
            })
            // 监听粒度变化
            myChart.on("datazoom", function (param) {
                self.tableTel(param.start,param.end);
            });
        },
        // 动态组装x1,x2,x3,x4的数据格式[[],[],[],[]];
        echarsDataRender () {
            var self = this;
            self.echarsData.length = 0;
            this.liduData.field_list.forEach(function(val,index){
                var newArr = [];
                self.liduData.data.forEach(function(v,k){
                    newArr.push(Object.values(v)[index]);
                });
                self.echarsData.push(newArr);
            });
        }
    },
    mounted() {
        setTimeout(() => {
            console.log(this.elem);
            this.particleRange = this.starEndDate.toString(); // 接口所需要的参数日期
            this.liduData = this.objData; // 存放子组件传过来的值
            this.len = this.objData.data.length;
            this.endLen = this.objData.data.length;
            this.dateTypes = Object.values(this.liduData.title_list); //年月日季周
            this.listDate = this.dateTypes; //年月日季周
            this.nowDateType = Object.values(this.liduData.currnt_title)[0]; //选中的项
            //console.log(this.len,this.endLen)
            /*ECharts图表*/
            this.echarsRender(); // echars初始化
        },500);
    }
}
</script>

<style>

</style>
