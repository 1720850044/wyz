<template>
    <div id="mychart" style="width:100%; height:258px;" ></div>
</template>
<script>
var qs=require('querystring');
export default {
    name: 'treemap',
    data() {
        return {

            dataArr: [],

        };
    },
    mounted() {
        this.myData();
    },
    methods: {
        getLevelOption() {
            return [
                {
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            gapWidth: 5,

                        }
                    }
                },

            ];
        },
        drawLine() {
      // 基于准备好的dom，初始化echarts实例
            var echarts = require('echarts');
            let myChart = echarts.init(document.getElementById('mychart'), 'ehcartTheme');
            var formatUtil = echarts.format;
      // 绘制图表
            myChart.setOption({
                tooltip: {
                    formatter: function (info) {
                        var value = info.value;
                        var treePathInfo = info.treePathInfo;
                        var treePath = [];

                        for (var i = 1; i < treePathInfo.length; i++) {
                            treePath.push(treePathInfo[i].name);

                        }

                        return [
                            '<div class="tooltip-title">'+formatUtil.encodeHTML(treePath)+'</div>',
                        ].join('');
                    }
                },
                color: ['#63E0CC', '#94CCFE', '#FF9095', '#FECE66'],
                series: [
                    {
                        name: '类型',
                        type: 'treemap',
                        visibleMin: 10,
                //自由缩放、拖动
                        roam: false,
                        nodeClick: false,
                        width: '100%',
                        height: '100%',
                        label: {
                            show: true,
                            formatter: '{b}'

                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff'
                            }
                        },
                        levels: this.getLevelOption(),
                //面包屑
                        breadcrumb: {
                            show: false
                        },
                        data: this.dataArr,
                    }
                ]

            });
        },
    //数据
        myData(){
            let _this=this;
            let projectID=sessionStorage.projectID;
            let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_get_tasktype_task_count+'&project_id='+projectID;
            _this.$axios.get(url).then(msg=>{
                let obj={value: '', 'name': '', path: ''};
                let data= msg.data.data;
                for (let i in data){
                    obj.value=data[i].cnt*10;
                    obj.name=data[i].tasktype_name+' '+data[i].complete_cnt+'/'+data[i].cnt;
                    if (data[i].cnt){
                        // debugger;
                        _this.dataArr.push(obj);
                    }
                    //  _this.dataArr.push(obj)
                    obj={};
                }
                        // console.log(_this.dataArr)

                //执行绘制图表
                this.drawLine();
            });
        }
    }
};
</script>
<style>
</style>
