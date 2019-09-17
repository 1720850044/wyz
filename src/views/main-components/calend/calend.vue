
<template>
    <div>
        <dl>
            <dt><Icon type="calendar"></Icon><span>日程</span><em class="more"><a @click="addRemind">增加提醒</a> <a @click="addLeave">标识请假</a></em></dt>
            <dd>
                    <div class="dateSelect">
                        <span>节假日:</span>
                        <span>
                          <Select v-model="selct" style="width:100px" @on-change="selectVal" placeholder="假期按排">
                            <Option v-for="item in option" :value="item.value" :key="item.value">{{ item.text }}</Option>
                          </Select>
                        </span>
                        <span><button @click="today" class="dateBtn">按回今天</button></span>
                        <div class="clear"></div>
                    </div>
                    <div class="schedule">
                        <p v-for="(item,index) in scheduleData">
                          <span><Icon type="record" color="#fff"></Icon> {{item.content}} <tt class="deleItem" v-if="item.status==1?true:false">周</tt><tt class="deleItem" v-if="item.status==2?true:false">月</tt></span>
                          <em>
                              {{item.time}}
                               <a v-if="item.id==null?false:true" class="deleItem" @click="deleItem(item.id,index)">X</a>
                          </em>
                        </p>
                        <p v-for="(item,index) in leavelList">
                            <Icon type="record" color="#fff"></Icon> {{item.content}} <a v-if="item.id==null?false:true" class="deleItem" @click="leavedeleItem(item.id,index)">X</a><br/>
                            开始：{{item.start_date}} {{item.start_time}}<br/>
                            结束：{{item.end_date}} {{item.end_time}}
                        </p>
                        <p v-for="item in overtimeList">
                             <Icon type="record" color="#fff"></Icon> {{item.content}}<br/>
                             开始：{{item.start_date}} {{item.start_time}}<br/>
                             结束：{{item.end_date}} {{item.end_time}}
                        </p>
                    </div>
                    <vue-event-calendar :events="demoEvents" @day-changed="changeDate" @month-changed="monthChange"></vue-event-calendar>

                    <!--提醒-->
                    <div id="remind" class="dataTip"><span class="tipimg"></span>
                        <dl>
                            <dt>
                                <RadioGroup v-model="animal">
                                    <Radio label="0">当日提醒</Radio>
                                    <Radio label="1">每周提醒</Radio>
                                    <Radio label="2">每月提醒</Radio>
                                </RadioGroup>
                            </dt>
                            <dd>
                                <p>
                                    <textarea v-model="textArea"></textarea>
                                </p>
                                <button @click.stop="RaddRem">确定</button>
                                <button @click.stop="RescRem">取消</button>
                            </dd>
                        </dl>
                    </div>

                    <!--请假-->
                    <div id="leave" class="dataTip"><span class="tipimg"></span>
                        <dl>
                            <dt>请选择请假时间</dt>
                            <dd>
                                <p class="seletTime">
                                    <!-- <input type="text" class="sTime"/>&nbsp;&nbsp;至&nbsp;&nbsp;<input type="text" class="eTime"/> -->
                                    <DatePicker type="datetimerange" placeholder="开始时间和结束时间" style="width:100%" @on-change="leaveDate"></DatePicker>
                                </p>
                                <button @click.stop="LaddRem">确定</button>
                                <button @click.stop="RescRem">取消</button>
                            </dd>
                        </dl>
                    </div>
            </dd>
        </dl>

    </div>
</template>
<script>
    var arr=[];
    var DataArry=[];
    Date.prototype.format=function (){
        var s='';
        s+=this.getFullYear()+'-';          // 获取年份。
        s+=(this.getMonth()+1)+"-";         // 获取月份。
        s+= this.getDate();                 // 获取日。
        return (s);                          // 返回日期。
    };
    var qs = require('querystring');
    export default {
        data () {
            return {
                demoEvents: arr,
                option: [],
                selct: '',
                value: '',
                animal: '0',
                textArea: '',
                dateB: [],
                remindData: [],
                scheduleData: [],
                holidayData: [],
                leavelDate: [],
                leavelList: [],
                overtimeDate: [],
                overtimeList: [],
                AddRemDate: '',
                leavelTime: [],
                YearDate: '',
                MonthDate: '',
                projectID: sessionStorage.projectID
            };
        },
        mounted(){
            $(".cal-events").remove();
            this.defualtDate();
            this.CalendGetDate();
        },
        methods: {
      // 获取时间段里面的日期
            getDayAll(begin, end){
                var dateAllArr = new Array();
                var ab = begin.split("/");
                var ae = end.split("/");
                var db = new Date();
                db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
                var de = new Date();
                de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
                var unixDb=db.getTime();
                var unixDe=de.getTime();
                for (var k=unixDb;k<=unixDe;){
                    dateAllArr.push((new Date(parseInt(k))).format().toString());
                    k=k+24*60*60*1000;
                }
                return dateAllArr;
            },
      // 时间格式化
            formatDate(startD, EndDate){
                let SEdate=this.getDayAll(startD, EndDate);
                let STEdae=SEdate.toString();
                let Rdate=STEdae.replace(/[-]/g, '/');
                let Adate=Rdate.split(',');
                return Adate;
            },

      //删除提醒
            deleItem(Tid, index){
                let _this=this;
                _this.$Modal.confirm({
                    title: '删除',
                    content: '<p>您确认删除吗？</p>',
                    onOk: () => {
                        let url=_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_delete_remind;
                        _this.$axios.post(url, {id: Tid}).then(msg=>{
                            _this.$Message.info('删除成功');
                            _this.CalendGetDate(_this.YearDate, _this.MonthDate);
                        }, ()=>{
                            _this.$Message.error('删除失败');
                        });
                    }
                });
            },
      //删除请假
            leavedeleItem(Tid, index){
                let _this=this;
                _this.$Modal.confirm({
                    title: '删除',
                    content: '<p>您确认删除吗？</p>',
                    onOk: () => {
                        let url=_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_delete_leave;
                        _this.$axios.post(url, {id: Tid}).then(msg=>{
                            _this.$Message.info('删除成功');
                            _this.CalendGetDate(_this.YearDate, _this.MonthDate);
                        }, ()=>{
                            _this.$Message.error('删除失败');
                        });
                    }
                });
            },
      //获取日历的数据
            defualtDate(){
                let date=new Date();
                let YearDate=date.getFullYear();
                let MonthDate=date.getMonth()+1;
                this.YearDate=YearDate;
                this.MonthDate=MonthDate;
            },
            CalendGetDate(Year=this.YearDate, Month=this.MonthDate){
                let _this=this;
                let url=_this.GLOBAL.baseRouter+ this.$GLOBALAPI.task_get_plan_list+'&year='+Year+'&month='+Month+'&project_id='+_this.projectID;
                _this.$axios.get(url).then(msg=>{
                    if (msg.data.err_code==0){
                        $(".dates .item .remindDiv").remove();
                        this.scheduleData=[];
                        this.leavelList=[];
                        this.overtimeList=[];
                        arr.splice(0, arr.length);
                        this.option=[];
                        let NData=new Date();
                        let Y=NData.getFullYear();
                        let M=NData.getMonth()+1;
                        let D=NData.getDate();
                        let YMD=Y+'/'+M+'/'+D;

              // 加班
                        _this.overtimeDate=[];
                        _this.overtimeDate=msg.data.data.overtime_date;
                        let overtimeList=[];
                        _this.overtimeDate.forEach(val=>{
                            _this.formatDate(val.start_date, val.end_date).forEach(valDate=>{
                                let Dobj={
                                    date: valDate,
                                    title: val.content
                                };
                                arr.push(Dobj);
                                if (YMD==valDate){
                                    overtimeList.push(val);
                                }

                    //添加通知标记
                                let STime=valDate;
                                let LTime=STime.lastIndexOf('/')+1;
                                let BSTime=STime.substring(LTime);

                    //添加程序
                                let Item=document.getElementsByClassName("item");
                                for (let i=0;i<Item.length;i++){
                                    let Ttrim=Item[i].innerText;
                                    let rTtrim=Ttrim.replace(/(^\s*)|(\s*$)/g, "");

                                    if (rTtrim==BSTime){
                                        let Cdiv = document.createElement("div");
                                        Cdiv.className = "remindDiv";
                                        Cdiv.innerText = val.type;
                                        Item[i].appendChild(Cdiv);
                                    }
                                }

                            });
                        });
                        _this.overtimeList=overtimeList;

              // 自定义事件及周事件
                        _this.remindData=[];
                        _this.remindData=msg.data.data.remind_data;
                        _this.remindData.forEach(val=>{
                            let obj={
                                date: val.time,
                                title: val.content
                            };
                            arr.push(obj);
                            if (YMD==val.time){
                                _this.scheduleData.push(val);
                            }

                  //添加通知标记
                            let STime=val.time;
                            let LTime=STime.lastIndexOf('/')+1;
                            let BSTime=STime.substring(LTime);

                  //添加程序
                            let Item=document.getElementsByClassName("item");
                            for (let i=0;i<Item.length;i++){
                                let Ttrim=Item[i].innerText;
                                let rTtrim=Ttrim.replace(/(^\s*)|(\s*$)/g, "");

                                if (rTtrim==BSTime){
                                    let Cdiv = document.createElement("div");
                                    Cdiv.className = "remindDiv";
                                    Cdiv.innerText = val.type;
                                    Item[i].appendChild(Cdiv);
                                }
                            }

                        });

              // 法定节假日
                        _this.holidayData=[];
                        _this.holidayData=msg.data.data.holiday_data;
                        _this.holidayData.forEach(val=>{
                            let obj={
                                text: val.title,
                                value: val.start_time_string
                            };
                            _this.option.push(obj);
                            _this.formatDate(val.start_time_string, val.end_time_string).forEach(valDate=>{
                                let Dobj={
                                    date: valDate,
                                    title: val.title
                                };
                                arr.push(Dobj);
                                if (YMD==valDate){
                                    let Sdate={
                                        time: valDate,
                                        content: val.title
                                    };
                                    _this.scheduleData.push(Sdate);
                                }
                         //添加通知标记
                                let STime=valDate;
                                let LTime=STime.lastIndexOf('/')+1;
                                let BSTime=STime.substring(LTime);
                      //添加程序
                                let Item=document.getElementsByClassName("item");
                                for (let i=0;i<Item.length;i++){
                                    let Ttrim=Item[i].innerText;
                                    let rTtrim=Ttrim.replace(/(^\s*)|(\s*$)/g, "");

                                    if (rTtrim==BSTime){
                                        let Cdiv = document.createElement("div");
                                        Cdiv.className = "remindDiv remindHoliday";
                                        Cdiv.innerText = val.type;
                                        Item[i].appendChild(Cdiv);
                                    }
                                }

                            });
                        });

              // 请假
                        _this.leavelDate=[];
                        _this.leavelDate=msg.data.data.leavel_date;
                        let leavelList=[];
                        _this.leavelDate.forEach(val=>{
                            _this.formatDate(val.start_date, val.end_date).forEach(valDate=>{
                                let Dobj={
                                    date: valDate,
                                    title: val.content
                                };
                                arr.push(Dobj);
                                if (YMD==valDate){
                                    leavelList.push(val);
                                }
                      //添加通知标记
                                let STime=valDate;
                                let LTime=STime.lastIndexOf('/')+1;
                                let BSTime=STime.substring(LTime);

                      //添加程序
                                let Item=document.getElementsByClassName("item");
                                for (let i=0;i<Item.length;i++){
                                    let Ttrim=Item[i].innerText;
                                    let rTtrim=Ttrim.replace(/(^\s*)|(\s*$)/g, "");

                                    if (rTtrim==BSTime){
                                        let Cdiv = document.createElement("div");
                                        Cdiv.className = "remindDiv remindHoliday";
                                        Cdiv.innerText = val.type;
                                        Item[i].appendChild(Cdiv);
                                    }
                                }
                            });
                        });
                        _this.leavelList=leavelList;

                    }
          // console.log(DataArry)
                });
            },
      // 请假时间
            leaveDate(date){
                this.leavelTime=date;
            },
      //改变月份
            monthChange (month) {
                let Cmonth=month.replace('月', '');
                let ArrCmonth=Cmonth.split("年");
                this.MonthDate=ArrCmonth[1];
                this.YearDate=ArrCmonth[0];
                this.CalendGetDate(ArrCmonth[0], ArrCmonth[1]);
            },

      //点击天数
            changeDate(day) {
        // console.log(day)
                $(".dates .item").removeClass(".selected-day");
                let D=day.date;
                this.scheduleData=[];
                this.leavelList=[];
                this.overtimeList=[];
        // 自定义事件
                this.remindData.forEach(val=>{
                    if (D==val.time){
                        this.scheduleData.push(val);
                    }
                });

        //法定节假日
                this.holidayData.forEach(val=>{
                    this.formatDate(val.start_time_string, val.end_time_string).forEach(valDate=>{
                        let Dobj={
                            time: valDate,
                            content: val.title
                        };
                        if (D==valDate){
                            this.scheduleData.push(Dobj);
                        }
                    });
                });

         //请假
                this.leavelDate.forEach(val=>{
                    this.formatDate(val.start_date, val.end_date).forEach(valDate=>{
                        if (D==valDate){
                            this.leavelList.push(val);
                        }
                    });
                });

        //加班
                this.overtimeDate.forEach(val=>{
                    this.formatDate(val.start_date, val.end_date).forEach(valDate=>{
                        if (D==valDate){
                            this.overtimeList.push(val);
                        }
                    });
                });

//      Append
                $(".dates .item").unbind('click').click(function(){
                    $(".select-event").remove();
                    $(".dates .item").removeClass("today");
          // $(this).append('<span class="select-event"></span>').addClass("today");
                    $(this).addClass("today");
                    var ttoday=$.trim($(this).find(".date-num").text());
                    if (!(ttoday=="")){
                        $(".events-wrapper .date").text(ttoday);
                    } else {
                        $(".events-wrapper .date").text('--');
                    }
          // console.log($(".today").offset().top)
                });
            },

            selectVal(){
                let sval= this.selct;
                this.$EventCalendar.toDate(sval);
                let l=sval.lastIndexOf('/')+1;
                let s=sval.slice(l);
                $(".events-wrapper .date").text(s);
                let obj={
                    date: sval
                };
                this.changeDate(obj);

            },

      // 返回今天
            today(){
                $(".item").removeClass("today");
                let tdata=new Date();
                let y=tdata.getFullYear();
                let m=tdata.getMonth()+1;
                let d=tdata.getDate();
                let MM=m<10?'0'+m:m;
                this.$EventCalendar.toDate(y+'/'+m+'/'+d);
                $(".events-wrapper .date").text(d);
                if (Number(this.MonthDate)!=MM){
                    this.CalendGetDate(y, m);
                    this.MonthDate=m;
                }
        // console.log(y+"/"+m+"/"+d)
            },

      // 请假
            qjbtn(){
                let qjVal=$(".qj-select").val();
                let obj={
                    date: qjVal,
                    title: '请假'
                };
                arr.push(obj);
                $("#dataTip").hide();
                $(".select-event").remove();
            },

      // 新增提醒
            addRemind(){
                if ($(".dates .item").hasClass("today")){
                    if ($.trim($(".today").text())!=""){
                        let Atop = $(".today").position().top+194;
                        let Aleft = $(".today").offset().left;
                        let dateD = $.trim($(".today").text());
                        let AdateD=dateD<10?'0'+dateD:dateD;
                        let dateYM = $(".cal-header .title").text().replace('年', '/').replace('月', '/');
                        $("#remind").css({'top': Atop-20, 'left': Aleft-257, 'display': 'block'});
                        $("#leave").hide();
                        this.AddRemDate=dateYM+AdateD;
                    } else {
                        console.log("Date is Null");
                    }
                }
            },

      // 提交提醒
            RaddRem(){
                let _this=this;
                let SDate=_this.AddRemDate.substring();
                let RDate=SDate.replace(/[/]/g, '-');
                let obj={
                    status: _this.animal,
                    date: RDate,
                    content: _this.textArea,
                    project_id: this.projectID
                };
                let url=_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_add_remind;
                _this.$axios.post(url, obj).then(msg=>{
                    _this.$Message.success('添加成功！');
                    _this.animal='0';
                    _this.textArea='';
                    _this.CalendGetDate(_this.YearDate, _this.MonthDate);
                }, ()=>{
                    _this.$Message.error('添加失败,请重新提交！');
                });
                $("#remind,#leave").hide();
            },

            RescRem(){
                $("#remind,#leave").hide();
            },

      //增加请假
            addLeave(){
                if ($(".dates .item").hasClass("today") ) {
                    if ($.trim($(".today").text()) != "") {
                        let Atop = $(".today").position().top+194;
                        let Aleft = $(".today").offset().left;
                        $("#leave").css({'top': Atop - 20, 'left': Aleft - 257, 'display': 'block'});
                        $("#remind").hide();
                    }
                }
            },
      // 提交请假
            LaddRem(){
                let _this=this;
                let url=_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_add_leave;
                let obj={
                    project_id: this.projectID,
                    start_time: _this.leavelTime[0],
                    end_time: _this.leavelTime[1]
                };
                _this.$axios.post(url, obj).then(msg=>{
                    _this.$Message.success('添加成功！');
                    _this.CalendGetDate(_this.YearDate, _this.MonthDate);
                });
                $("#remind,#leave").hide();
            }

        }
    };
</script>
<style lang="less">
    @import './calend.less';
</style>
