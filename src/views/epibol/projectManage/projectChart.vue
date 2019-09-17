<!--
公司=》项目=》图表
-->
<template>
    <div class="projectChartBox">
        <!-- ChartNav -->
            <!-- Week -->
        <div v-if="!showLoading && dateList && dateList.length > 0">
            <div class="chartNavBox" v-if="dataValue=='week'">
                <div class="chartNav" :style="`width:${pWeek.length*140}px`">
                    <span class="week" v-for="(item,index) in pWeek" :key="index" :style="`left:${index==0?10:(index*140)+10}px`">
                        <span class="weekValue">{{item}}</span>
                    </span>
                </div>
            </div>
                <!-- Month -->
            <div class="chartNavBoxMonth" v-if="dataValue=='month'">
                <div class="MchartNav" :style="`width:${monthDay*10}px`">
                    <span class="week" v-for="(item,index) in pMonth" :key="index" :style="`margin-left:${(item.nDay*10)-10}px`">
                        <span class="weekValue">&nbsp;{{item.date}}</span>
                    </span>
                </div>
            </div>
            <!-- ChartData -->
            <div class="projectChart" id="range">
                <div class="dataSelet">
                    <!-- <Select v-model="dataValue" style="width:50px" size="small" @on-change="changeDate">
                        <Option v-for="item in dateList" :value="item.type" :key="item.val"></Option>
                    </Select> -->
                    <div :class="[nIndex==index?'span showSpan':'span']" v-for="(item,index) in dateList" @click="changeDate(item.type,index)" :key="index">{{ item.val }}</div>
                    <div class="clear"></div>
                </div>
                <div class="chartRow" id="move" :style="`width:${pWeek.length*140}px;`">
                    <!--当前时间线-->
                    <div class="projectSignLien" :style="`left:${dataValue=='week'?(dayLine*20)+20:(dayLine*10)}px`"></div>

                    <!-- 项目/周 -->
                    <div :class="[item.status==3?'projectOver chartList':'chartList']" v-for="(item,index) in projectData" :key="item.id"
                      :style="`margin-left:${item.xdays*20+'px'};margin-top:${item.xdays>item.dayGap&&index>0?'-100px':''}
                          `"
                      v-if="dataValue=='week'"
                    >
                        <Tooltip placement="right">
                            <div slot="content" class="tooptipSlot">
                                <p>{{item.name}}</p>
                                <p>{{item.start_date}} ~ {{item.end_date}}</p>
                                <p style="display: flex;align-items: center">
                                    <img style="width: 20px;height: 20px;border-radius: 100%" :src="headImgSrc(item.create_uid)">
                                    &nbsp;&nbsp;
                                    <span>{{item.realname}}</span>
                                </p>
                            </div>
                            <div class="chartFloat" :style="`width:${(Math.abs(getDayNum(item.start_date,item.end_date))<1?1:Math.abs(getDayNum(item.start_date,item.end_date)))*20+'px'}`">
                                <div class="projectInfo">
                                    <!--进行中-->
                                    <em :class="[{'doing':item.status == 1},{'stop':item.status == 2},{'over':item.status == 3},{'end':item.status== 4 }]"></em>
                                    <i class="projectStatus" :class="[{'doing':item.status == 1},{'stop':item.status == 2},{'over':item.status == 3},{'end':item.status== 4 }]" @click="homePage(item.id)">{{$t('workbench.work_conducting')}}</i>

                                    <div class="company">
                                        <h1 >
                                            <Icon type="social-buffer-outline" style="font-size: 18px"></Icon>
                                            <i @click="homePage(item.id)" class="projectTitle">{{item.name}}</i>
                                        </h1>
                                        <div class="title">
                                            {{item.company==null?'-':item.company}}
                                        </div>
                                        <div class="day">
                                            <span>
                                                {{item.start_date}} ~ {{item.end_date}}
                                            </span>
                                            <p>
                                                <img :src="headImgSrc(item.create_uid)">
                                                &nbsp;&nbsp;<span>{{item.realname}}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="progressSty">
                                    <Progress :percent="Number(item.rate_task)>100.1?100:Number(item.rate_task)" :stroke-width="8" :hideInfo="true" status="active"/>
                                </div>
                            </div>
                        </Tooltip>
                    </div>
                    <!-- 周结束 -->
                    <!-- 项目/月 -->
                    <div :class="[item.status==3?'projectOver chartList':'chartList']" v-for="(item,index) in monthData" :key="item.id"
                     :style="`margin-left:${item.xdays*10+'px'};margin-top:${item.xdays>item.dayGap&&index>0?'-100px':''}
                         `"
                        v-if="dataValue=='month'"
                    >
                        <Tooltip placement="right">
                            <div slot="content" class="tooptipSlot">
                                <p>{{item.name}}</p>
                                <p>{{item.start_date}} ~ {{item.end_date}}</p>
                                <p style="display: flex;align-items: center">
                                    <img style="width: 20px;height: 20px;border-radius: 100%" :src="headImgSrc(item.create_uid)">
                                    &nbsp;&nbsp;
                                    <span>{{item.realname}}</span>
                                </p>
                            </div>
                            <div class="chartFloat" :style="`width:${(Math.abs(item.total_day)<1?1:Math.abs(item.total_day))*10+'px'}`">
                                <div class="projectInfo">
                                    <!--进行中-->
                                    <em :class="[{'doing':item.status == 1},{'stop':item.status == 2},{'over':item.status == 3},{'end':item.status== 4 }]"></em>
                                    <i class="projectStatus" :class="[{'doing':item.status == 1},{'stop':item.status == 2},{'over':item.status == 3},{'end':item.status== 4 }]" @click="homePage(item.id)">{{$t('workbench.work_conducting')}}</i>

                                    <div class="company">
                                        <h1 >
                                            <Icon type="social-buffer-outline" style="font-size: 18px"></Icon>
                                            <i @click="homePage(item.id)" class="projectTitle">{{item.name}}</i>
                                        </h1>
                                        <div class="title">
                                            {{item.company==null?'-':item.company}}
                                        </div>
                                        <div class="day">
                                            <span>
                                                {{item.start_date}} ~ {{item.end_date}}
                                            </span>
                                            <p>
                                                <img :src="headImgSrc(item.create_uid)">
                                                &nbsp;&nbsp;<span>{{item.realname}}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="progressSty">
                                    <Progress :percent="Number(item.rate_task)>100.1?100:Number(item.rate_task)" :stroke-width="8" :hideInfo="true" status="active"/>
                                </div>
                            </div>
                        </Tooltip>
                    </div>
                    <!-- 月结束 -->
                </div>
            </div>
        </div>
        <template v-if="showLoading">
            <div class="loading" style="height: 780px;">
                <loading></loading>
            </div>
        </template>
        <div class="nothink" v-if="!showLoading && (!dateList || dateList.length <= 0)">
            <span>{{$t('common.common_noItem')}}</span>
        </div>
    </div>
</template>
<script>
var {runMove, initW}=require('./chartMove.js');
var qs=require('querystring');
export default {
    data(){
        return {
            showLoading: false,
            pWeek: [],
            projectData: [],
            dayLine: null,
            dateList: [
                {"val": i18n.t('project.pro_week'), "type": "week"},
                {"val": i18n.t('workbench.work_teamWorkMonthTag'), "type": "month"} 
            ],
            dataValue: 'week',
            dataFlgt: false,
            pMonth: [],
            monthData: [],
            monthDay: null,
            nIndex: 0
        };
    },
    mounted(){
        this.getChartData();
        this.autoH();
        runMove(this.dataValue);
        this.$bus.on('submitOk', ()=>{
            this.getChartData();
        });
    },
    filters: {
        fileContent(val){
            return val.name +"　"+ val.start_date+" ~ "+val.end_date+"  "+ val.realname;
        }
    },
    updated(){
        initW(this.dayLine, this.dataValue);
        runMove(this.dataValue);
    },
    methods: {
        changeDate(type, index){
            this.dataValue=type;
            this.nIndex=index;
            this.getChartData();
        },
        // 自适应高
        autoH(){
            let pcH=document.getElementById('range');
            let pcB=document.getElementsByClassName("projectChartBox")[0];
            let pcNav=document.getElementsByClassName('chartNavBox')[0];
            let dH=document.documentElement.offsetHeight;
            let dW=document.documentElement.offsetWidth;
            pcH.style.height=dH-263+"px";
            pcH.style.width=dW-240+"px";
            pcB.style.height=dH-118+"px";
            pcNav.style.width=pcH.style.width;//chartNav

        },
        // 跳转到Home页
        homePage(id){
            sessionStorage.projectID=id;
            this.$router.push('/project/home');
        },
        // 时间轴线
        timeLine(nDate){
            let day=new Date();
            let y=day.getFullYear();
            let m=day.getMonth()+1;
            let d=day.getDate();
            let cuDate=y+'/'+m+'/'+d;
            let cTime=Math.round(new Date(cuDate)/1000);
            let pDate=nDate.replace(/-/g, '/');
            let pTime=Math.round(new Date(pDate)/1000);
            this.dayLine=(cTime-pTime)/86400;

        },
        //计算天数间隔 by Song
        getDayNum(Date1, Date2){
            //Date1和Date2是2017-07-10格式
            let sDate, newDate1, newDate2, Days;
            let aDate = Date1.split("-");
            newDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为07-10-2017格式
            aDate = Date2.split("-");
            newDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
            Days = parseInt(Math.abs(newDate1 - newDate2) / 1000 / 60 / 60 / 24); //把差的毫秒数转换为天数
            console.log('ddddddddddddddd', Days);
            return Days;
        },
        getChartData(){
            let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_page;
            let params={
                "date_type": this.dataValue
            };
            this.$axios.post(url, params).then(msg=>{
                if (this.dataValue=="week"){
                    if (msg.data.err_code==0){
                        this.pWeek=msg.data.date;

                        // DayLine
                        this.timeLine(this.pWeek[0]);
                        let gap_num=[];
                        let gap_numMin=[];
                        msg.data.project.forEach(val => {
                            gap_num.push({dayGap: val.total_day+val.xdays});
                            gap_numMin.push({MindayGap: val.xdays});
                        });
                        // Max
                        gap_num.unshift({dayGap: 0});
                        gap_num.splice(gap_num.length-1, 1);

                        //Min
                        gap_numMin.unshift({MindayGap: 0});
                        gap_numMin.splice(gap_numMin.length-1, 1);

                        for (let i=0;i<msg.data.project.length;i++){
                            msg.data.project[i].dayGap=gap_num[i].dayGap;
                            msg.data.project[i].MindayGap=gap_numMin[i].MindayGap;
                        }
                        this.projectData=msg.data.project;
                    } else {
                        this.$Message.error(msg.data.err_message);
                    }
                } else if (this.dataValue=="month"){
                    if (msg.data.err_code==0){
                        this.pMonth=msg.data.date;
                        let pMonthDay=[];
                        for (let i=0;i<this.pMonth.length;i++){
                            pMonthDay.push({nDay: this.pMonth[i].day});
                        }
                        pMonthDay.unshift({nDay: 0});
                        pMonthDay.splice(pMonthDay.length-1, 1);
                        for (let i=0;i<this.pMonth.length;i++){
                            this.pMonth[i].nDay=pMonthDay[i].nDay;
                        }
                        //DayLine
                        this.timeLine(this.pMonth[0].date);

                        //SumDay
                        let monthDay=null;
                        this.pMonth.forEach(val=>{
                            monthDay+=Number(val.day);
                        });
                        this.monthDay=monthDay;

                        // timeLag
                        let gap_num=[];
                        let gap_numMin=[];
                        msg.data.project.forEach(val => {
                            gap_num.push({dayGap: val.total_day+val.xdays});
                            gap_numMin.push({MindayGap: val.xdays});
                        });
                        // Max
                        gap_num.unshift({dayGap: 0});
                        gap_num.splice(gap_num.length-1, 1);

                        //Min
                        gap_numMin.unshift({MindayGap: 0});
                        gap_numMin.splice(gap_numMin.length-1, 1);

                        for (let i=0;i<msg.data.project.length;i++){
                            msg.data.project[i].dayGap=gap_num[i].dayGap;
                            msg.data.project[i].MindayGap=gap_numMin[i].MindayGap;
                        }
                        this.monthData=msg.data.project;
                    }
                }
                this.showLoading = false;
            }, ()=>{
                this.$Message.error(i18n.t('resources.res_requestFail'));
            });
        },
        headImgSrc(id){
            return this.GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+id;
        },
    },

};
</script>
<style lang="less">
    .projectChartBox{
        margin-top:@p10;
        .nothink{
            display: flex;
            align-items: center;
            justify-content: center;
            background: url("../../../assets/images/contract.png") no-repeat #FFFFFF;
            background-position: center 35%;
            height: 100%;
            width: 100%;
            span{
                font-size: 12px;
                color: @black_2;
            }
        }
    }
    .chartNavBox{
        background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAABDCAIAAAATYLIVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDQ4MDg2MjdBQjU4MTFFOEI1ODREMjA5QkNFODNCQzIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDQ4MDg2MjhBQjU4MTFFOEI1ODREMjA5QkNFODNCQzIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENDgwODYyNUFCNTgxMUU4QjU4NEQyMDlCQ0U4M0JDMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENDgwODYyNkFCNTgxMUU4QjU4NEQyMDlCQ0U4M0JDMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi6RqzEAAAA9SURBVHja7M+xEQAQEERRjP670oxMBUcLTuj9mQ1fsDUiSrZWHoJhGIZhGIZhGIbhazzW/O1zP0vf3gIMAJ6GCMVwYWiQAAAAAElFTkSuQmCC') #fff repeat-x;
        margin-top:10px;position:absolute;height:60px;z-index:9;background-position-y:-7px;overflow:hidden;border-radius:@r4;
        .chartNav{
            display:block;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAABDCAIAAAATYLIVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDQ4MDg2MjdBQjU4MTFFOEI1ODREMjA5QkNFODNCQzIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDQ4MDg2MjhBQjU4MTFFOEI1ODREMjA5QkNFODNCQzIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENDgwODYyNUFCNTgxMUU4QjU4NEQyMDlCQ0U4M0JDMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENDgwODYyNkFCNTgxMUU4QjU4NEQyMDlCQ0U4M0JDMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi6RqzEAAAA9SURBVHja7M+xEQAQEERRjP670oxMBUcLTuj9mQ1fsDUiSrZWHoJhGIZhGIZhGIbhazzW/O1zP0vf3gIMAJ6GCMVwYWiQAAAAAElFTkSuQmCC') #fff;
            position:absolute;height:60px;padding-left:20px;background-position-y:-7px;
            .week{
                position:absolute;
                background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAGCAYAAAAVMmT4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUIzNEU1NzVBQjVBMTFFOEFGQ0U4MzBFMTNENTIzNzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUIzNEU1NzZBQjVBMTFFOEFGQ0U4MzBFMTNENTIzNzkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QjM0RTU3M0FCNUExMUU4QUZDRTgzMEUxM0Q1MjM3OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QjM0RTU3NEFCNUExMUU4QUZDRTgzMEUxM0Q1MjM3OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ple5REsAAAA5SURBVHjaYvj//z8DOrY+t+0/NnEmBjRgc377f2QaGTBhU4iLz4RLAps4Ez6F6BoYQZ5hIBIABBgAqhg5cFgIaoUAAAAASUVORK5CYII=');
                width:20px;background-repeat:no-repeat;height:60px;top:54px;background-position-x:5px;
                .weekValue{
                    position:absolute;top:-30px;color:#949494;left:-23px;width:80px;font-size:12px;font-family:@ff;font-weight:lighter;
                }
            }
        }
    }
    .chartNavBoxMonth{
        &:extend(.chartNavBox);
        background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAABDCAIAAAAqBwNOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkM4Q0U3MDlBQjY1MTFFODhGNDY5M0MxOEQ2MThFMEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkM4Q0U3MEFBQjY1MTFFODhGNDY5M0MxOEQ2MThFMEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQzhDRTcwN0FCNjUxMUU4OEY0NjkzQzE4RDYxOEUwQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQzhDRTcwOEFCNjUxMUU4OEY0NjkzQzE4RDYxOEUwQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhemtAYAAAAwSURBVHjaYvz//z8DbsDEgBeMSo9Kj0qPSo9Kj0qPSpMpffTjq4GymwWI8VgPEGAAN9sIxZ0r2n8AAAAASUVORK5CYII=');
        .MchartNav{
            background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAABDCAIAAAAqBwNOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkM4Q0U3MDlBQjY1MTFFODhGNDY5M0MxOEQ2MThFMEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkM4Q0U3MEFBQjY1MTFFODhGNDY5M0MxOEQ2MThFMEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQzhDRTcwN0FCNjUxMUU4OEY0NjkzQzE4RDYxOEUwQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQzhDRTcwOEFCNjUxMUU4OEY0NjkzQzE4RDYxOEUwQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhemtAYAAAAwSURBVHjaYvz//z8DbsDEgBeMSo9Kj0qPSo9Kj0qPSpMpffTjq4GymwWI8VgPEGAAN9sIxZ0r2n8AAAAASUVORK5CYII=');
            display:block;height:60px;position:absolute;background-position-y:-7px;
            .week{
                float:left;
                width:10px;height:60px;
                .weekValue{
                background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAGCAYAAAAVMmT4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUIzNEU1NzVBQjVBMTFFOEFGQ0U4MzBFMTNENTIzNzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUIzNEU1NzZBQjVBMTFFOEFGQ0U4MzBFMTNENTIzNzkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QjM0RTU3M0FCNUExMUU4QUZDRTgzMEUxM0Q1MjM3OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QjM0RTU3NEFCNUExMUU4QUZDRTgzMEUxM0Q1MjM3OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ple5REsAAAA5SURBVHjaYvj//z8DOrY+t+0/NnEmBjRgc377f2QaGTBhU4iLz4RLAps4Ez6F6BoYQZ5hIBIABBgAqhg5cFgIaoUAAAAASUVORK5CYII=');
                position:relative;width:80px;left:-29px;top:29px;display:inline-block;
                background-repeat:no-repeat;background-position-y:26px;background-position-x:33px;height:32px;
                font-size:13px;font-family:@ff;font-weight:lighter;
                }
            }
        }
    }
    .projectChart{
        .dataSelet{
            position:fixed;z-index:10;left:50%;top:83px;height:38px;width:200px;border-radius:@r4;border:1px solid #3bceb6;
            margin-left:-100px;background:@white;
            .span{
                float:left;font-size:13px;color:@base;width:99px;display:inline-block;text-align:center;line-height:36px;
                cursor:pointer;
            }
            .showSpan{
                background:@base;color:@white;border-radius:@r4;
            }
        }
        .projectSignLien{
            position:absolute;width:1px;background:@orange;margin-top:-20px;height:100%;z-index:8;
        }
        background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADQCAIAAABJFZxUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNkY2NEY1NUFCNUMxMUU4OThGMEVDMzVDMTJBODYwOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNkY2NEY1NkFCNUMxMUU4OThGMEVDMzVDMTJBODYwOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM2RjY0RjUzQUI1QzExRTg5OEYwRUMzNUMxMkE4NjA5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM2RjY0RjU0QUI1QzExRTg5OEYwRUMzNUMxMkE4NjA5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+3nVYtQAAAB5JREFUeNpi+vX3LxMDA8MoHqSYlYlpNBwGLwYIMABM2gSeCZn/KQAAAABJRU5ErkJggg==');
        margin-top:58px;position:absolute;overflow:hidden;overflow-y:auto;
        background-position-y:12px;
        .chartRow{
            display:block;position:absolute;padding-left:20px;padding-top:15px;height:100%;
            .chartList{
                margin:5px 0px;float:left;width:100%;
                h1{
                    font-size:14px;font-weight:normal;
                    a{
                        cursor:pointer;color:#444;
                        &:hover{
                            color:#00d07e;
                        }
                    }

                }
                .ivu-tooltip-popper[x-placement^=right] .ivu-tooltip-arrow{
                    border-right-color:#3bceb6;
                }
                .ivu-tooltip-inner{
                    background-color:#3bceb6;
                    box-shadow:0px 0px 0px;
                }
            }

            .chartFloat{
                position: relative;background:@white;display:inline-block;border:1px solid @base;overflow:hidden;height:89px;border-radius:@r4;cursor: pointer;
                .projectInfo{
                    position: relative;
                    padding:10px;
                    height:100%;
                    em{
                        font-style: normal;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 0;
                        height: 0;
                        border-style: solid;
                        border-width: 40px 55px 0 0;
                        border-color: transparent transparent transparent transparent;
                        &.doing{
                            border-color: #9ED3FD transparent transparent transparent !important;
                        }
                        &.stop{
                            border-color: #ff9283 transparent transparent transparent !important;
                        }
                        &.over{
                            border-color: @base transparent transparent transparent !important;
                        }
                        &.end{
                            border-color: #FF9800 transparent transparent transparent !important;
                        }
                    }
                    .projectStatus{
                        position:absolute;
                        top: 5px;
                        left: -2px;
                        white-space: nowrap;
                        font-style: normal;
                        font-size: 12px;
                        transform: rotate(-38deg);
                        -webkit-transform: rotate(-38deg);
                        &.doing{
                            color: #2396f1;
                        }
                        &.stop{
                            color: #d64734;
                        }
                        &.over{
                            color: #228a75
                        }
                        &.end{
                            color: #8e5502;
                        }
                    }
                    .company{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 100%;
                        .projectTitle{
                            white-space: nowrap;
                        }
                        i{
                            font-style:normal;
                        }
                        h1{
                            height:22px;display:block;font-size: 14px;
                        }
                        .title{
                            color:#c9c9c9;font-size: 12px;

                        }
                        .day{
                            display: flex;
                            justify-content: space-between;
                            font-size: 12px;white-space: nowrap;
                            p{
                                display: flex;
                                img{
                                    width:20px;height:20px;border-radius:100%;
                                }
                            }

                        }
                    }
                }
                .progressSty{
                    position: absolute;
                    bottom: -5px;
                    width: 100%;
                }
            }
            .projectOver{
                .chartFloat{
                    background:#f0fbf0;border-color:#d2e2d2;
                }
                h1{
                    color:#00d07e;
                }
            }

        }
    }
    //这个未使用
    .projectScrollNav{
        position:absolute;bottom:15px;height:30px;background:#f2f2f2;border:1px solid #e4e4e4;line-height:30px;
        .navWidth{
            height:30px;position:absolute;background:#c2ebc2;border-color:#b6dfb6 #49c800;border-style:solid;border-width:1px;top:-1px;cursor:move;
        }
    }
</style>
