<template>
<div>
    <div>
     <RadioGroup v-model="nowDateType" type="button" @on-change="changeDateType">
        <Radio v-for="(item,index) in dateTypes" :label="item" :key="index"></Radio>
      </RadioGroup>
      <span>
        <span>表格:</span>
        <i-switch v-model="isShowTab" size="large">
          <span slot="open">开</span>
          <span slot="close">关</span>
        </i-switch>
      </span>
    </div>
    <div id="charts" style="width:100%;height:400px;"></div>
    <div v-show="isShowTab">
       <Table border :columns="columns1" :data="data1"></Table>
    </div>
</div>
</template>

<script>
import utli from './tools/utli';
import { setTimeout } from 'timers';
var echarts = require('echarts');
export default {
    props: {
        dataTime: {
            type: Array
        },
        totle: {
            type: Array
        },
        objData: {
            type: Object
        }
    },
    data () {
        return {
            columns1:[], 
            data1: [],
            xData:[],
            totalD: [],
            dateTypes: ['日','月','年'],
            nowDateType: '日',
            isShowTab: true,
            len: 0,
            starLen:0,
            endLen:31
        }
    },
    methods: {
        changeDateType () {
            console.log(this.nowDateType);
        },
        tableTel (star,end) {
            setTimeout(() => {
                this.starLen = Math.ceil(star/100*this.len);
                this.endLen = Math.ceil(end/100*this.len)-1;
                this.data1.length = 0;
                this.tabRenderT();
            },500)
        },
        tabRenderT () {
            for(var i=this.starLen;i<this.endLen;i++){
                this.data1.push({
                    name: this.xData[i],
                    age: this.totalD[i],
                    address: this.totalD[i],
                    action: this.totalD[i],
                    zaction:this.totalD[i],
                    valid:'',
                    valid1:''
                });
            }
        }
    },
    mounted() {
        var self = this;
        setTimeout(() => {
        console.log(this.objData);
        this.xData = this.dataTime // = ["2019-3-4", "2019-3-5", "2019-3-6", "2019-3-7", "2019-3-8", "2019-3-9", "2019-3-10", "2019-3-11", "2019-3-12", "2019-3-13", "2019-3-14", "2019-3-15", "2019-3-16", "2019-3-17", "2019-3-18", "2019-3-19", "2019-3-20", "2019-3-21", "2019-3-22", "2019-3-23", "2019-3-24", "2019-3-25", "2019-3-26", "2019-3-27", "2019-3-28", "2019-3-29", "2019-3-30", "2019-3-31", "2019-4-1", "2019-4-2", "2019-4-3"];;
        this.len = this.xData.length;
        this.totalD = this.totle //  = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "3000", "0", "4500", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];;
        this.columns1.push({
                    title: '日期',
                    key: 'name',
                    render: (h, params) => {
                        if (params.row.$isEdit) {
                            return [h('Input', {
                            props: {
                                type: "text",
                                value: params.row.name
                            },
                            on: {
                                "on-blur": event => {
                                    params.row.name = event.target.value;
                                    if(!event.target.value){
                                    this.data1[params.index].valid = "不能为空";
                                    }else{
                                    this.data1[params.index].valid = "";
                                    this.$set(params.row, '$isEdit', false);
                                    }
                                    
                                },
                            }
                            }),
                            h(
                                "span",
                                {
                                    attrs: {
                                    title: params.row.valid
                                    },
                                    style: {
                                    color: "red"
                                    }
                                },
                                params.row.valid
                            )
                            ]
                        } else  {  
                        return h('div', {
                            on: {
                                click: () => {
                                    this.$set(params.row, '$isEdit', true);
                                },                            
                            }
                            },params.row.name);
                        }
                    }
                },
                {
                    title: '总收入',
                    key: 'age',
                    render: (h, params) => {
                        if (params.row.$isEdit) {
                            return [h('Input', {
                            props: {
                                type: "text",
                                value: params.row.age
                            },
                            on: {
                                "on-blur": event => {
                                    params.row.age = event.target.value;
                                    if(!event.target.value){
                                    this.data1[params.index].valid1 = "不能为空";
                                    }else{
                                    this.data1[params.index].valid1 = "";
                                    this.$set(params.row, '$isEdit', false);
                                    }
                                    
                                },
                            }
                            }),
                            h(
                                "span",
                                {
                                    attrs: {
                                    title: params.row.valid1
                                    },
                                    style: {
                                    color: "red"
                                    }
                                },
                                params.row.valid1
                            )
                            ]
                        } else  {  
                        return h('div', {
                            on: {
                                click: () => {
                                    this.$set(params.row, '$isEdit', true);
                                },                            
                            }
                            },params.row.age);
                        }
                    }  
                },
                {
                    title: '实收款',
                    key: 'address'
                },
                {
                    title: '未收款',
                    key: 'action'
                },
                {
                    title: '支出',
                    key: 'zaction'
                });
        this.tabRenderT();
        /*ECharts图表*/
        var myChart = echarts.init(document.getElementById('charts'));
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
                data: ['销售'],
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
                data: this.objData.date
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
            series: [
                {
                    name: '销量',
                    type: 'line',
                    data: this.totalD
                },
                {
                    name: '销量',
                    type: 'bar',
                    data: this.totalD
                }
            ]
        })
        myChart.on("datazoom", function (param) {
            self.tableTel(param.start,param.end);
        });
        },500);
    }
}
</script>

<style>

</style>
