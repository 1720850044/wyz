<template>
    <div>
         <Tabs active-key="key1">
            <Tab-pane label="我的工作" key="key1">

                <!-- 负责的项目 -->
                <div class="projectWorkInfo">
                    <!-- 日程提醒 -->
                    <div class="myCalend">
                        <CalendInfo></CalendInfo>
                    </div>
                    <div class="myProject">
                        <dl>
                            <dt><Icon type="android-apps"></Icon> 我负责的项目({{ProjectData.length}})</dt>
                            <dd>
                                <Row>
                                    <!-- 分割线 -->
                                    <Col span="12" v-for="(item,index) in ProjectData" :key="index">
                                        <div class="proChart">
                                            <Row>
                                                <Col span="8">
                                                    <div class="circle">
                                                        <div style="display:block"><span class="title">{{item.last_day}}</span></div>
                                                        <i-circle :percent="Number(item.rate_task)" :size="100" stroke-color="#00cc00"  @click.native="homepage(item.id)">
                                                            <span class="demo-Circle-inner" style="font-size:24px">
                                                                {{Math.round(item.rate_task)}}%
                                                                <p>当前完成</p>
                                                            </span>
                                                        </i-circle>
                                                        <div class="content">
                                                            {{item.name}}
                                                            <span class="tips" v-show="item.status==3?true:false">暂停</span>
                                                            <span class="chlidPro" v-show="item.child_name==null?false:true"><Icon type="ios-arrow-right"></Icon> {{item.child_name}}</span>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col span="16" style="padding-top:20px;">
                                                    <div class="PressLine">
                                                        <div class="gressTile">即将完成</div>
                                                        <div class="gressLine"><Progress :percent="Number(item.will_finish_progress)"></Progress></div>
                                                        <div class="clear"></div>
                                                    </div>
                                                    <div class="PressLine">
                                                        <div class="gressTile">时间进度</div>
                                                        <div class="gressLine">
                                                            <Progress :percent="item.time_progress|progressLine">
                                                                <span>{{item.time_progress>101?item.last_day:Math.round(item.time_progress)|progresTime}}</span>
                                                            </Progress>
                                                        </div>
                                                        <div class="clear"></div>
                                                    </div>
                                                    <div class="PressLine">
                                                        <div class="gressTile">文件进度</div>
                                                        <div class="gressLine"><Progress :percent="Number(item.rate_task)"><span>{{item.end_task}}/{{item.all_task}}</span></Progress></div>
                                                        <div class="clear"></div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    <!-- 分割线 -->
                                </Row>
                            </dd>
                        </dl>
                    </div>
                    <div class="clear"></div>
                </div>
                <!-- 工作台内容 -->
                <!-- 文件详情 -->
                <Modal
                    v-model="isTabModal"
                    width="1200"
                    :styles="{top: '100px'}"
                    :closable="false"
                    okText= '保存'
                    cancelText='取消'
                    @on-cancel="closeTabmodal"
                    >
                    <browsetask ref="browsetask"
                                >
                    </browsetask>
                    <div slot="footer">
                    </div>
                </Modal>
                <!-- 文件详情结束 -->
                <div class="projectWorkContent">
                    <!-- 重点关注 -->
                    <div class="contentRow emphkeep">
                        <dl>
                            <dt><Icon type="grid"></Icon> 重点关注({{KeepData.length}})</dt>
                            <dd>
                                <ul>
                                    <li v-for="(item,index) in KeepData" :key="index" @click="taskDetaInfo(
                                        item.id,
                                        item.stage_file.type,
                                        item.stage_file.file,
                                        item.stage_file.task_id,item
                                        )">
                                        <div class="row">
                                            <span>
                                                <b>{{item.name}}</b><br/><img src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>&nbsp;<u>{{item.realname==null?item.nickname:item.realname}}</u>
                                            </span>
                                            <span>
                                                <i :class="[item.surplus_time>1?'ishow':'']">{{item.surplus_time | FilteTime}}</i><br/><u>结束</u>
                                            </span>
                                            <span>
                                                <s>{{item.now_stage}}</s> / {{item.all_stage}}<br/><u>{{item.now_stage_name}}</u>
                                            </span>
                                        </div>
                                        <Progress :percent="Number(item.task_progress)" :stroke-width="2" :hide-info="true"></Progress>
                                    </li>
                                </ul>
                            </dd>
                        </dl>
                    </div>
                    <!-- 等待审核 -->
                    <div class="contentRow awaiaudit">
                        <dl>
                            <dt><Icon type="grid"></Icon> 等待审核({{AuditData.length}})</dt>
                            <dd>
                                <ul>
                                    <li v-for="(item,index) in AuditData" :key="index"  @click="taskDetaInfo(
                                        item.task_id,
                                        item.stage_file.type,
                                        item.stage_file.file,
                                        item.stage_file.task_id,item
                                        )">
                                        <span>
                                            <img :src="item | fitletype"/>{{item.name}}<br/><u class="chlidProject" :title="item.project_name">{{item.project_name}}</u>
                                        </span>
                                        <span>
                                            {{item.upload_day==0?"今天":(Math.abs(item.upload_day)+"天前")}} <br/><u>上传</u>
                                        </span>
                                        <span>
                                            <i>{{item.surplus_time | FilteTime}}</i><br/><u>剩余时间</u>
                                        </span>
                                        <span>
                                            <s>{{item.stage}}</s> / {{item.all_stage}}<br/><u>{{item.now_stage_name}}</u>
                                        </span>
                                    </li>
                                </ul>
                            </dd>
                        </dl>
                    </div>
                    <!-- 反馈待处理 -->
                    <div class="contentRow fbackdisp">
                        <dl>
                            <dt>
                                <Icon type="grid"></Icon> 反馈待处理 ({{DispData.length}})
                            </dt>
                            <dd>
                                <ul>
                                    <li v-for="(item,index) in DispData" :key="index"   @click="taskDetaInfo(
                                        item.id,
                                        item.stage_file.type,
                                        item.stage_file.file,
                                        item.stage_file.task_id,
                                        item
                                        )">

                                        <span class="tip">{{item.upload_day==0?"今天":(Math.abs(item.upload_day)+" 天前")}}</span>
                                        <span class="stop" v-show="item.status==3?true:false">暂停</span>
                                        <img :src="item | fitletype"/>
                                        <div class="fbackinfo">
                                            <p>{{item.name}}</p>
                                            <p>
                                                <span>{{item.fkqk}}</span>
                                                <span>
                                                    <img src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>&nbsp;{{item.realname==null?item.nickname:item.realname}}
                                                </span>
                                            </p>
                                        </div>
                                    </li>

                                    <div class="clear"></div>
                                </ul>
                            </dd>
                        </dl>
                    </div>
                    <div class="clear"></div>
                </div>

            </Tab-pane>
            <!-- 分割线 -->
            <Tab-pane label="日程按排" key="key2">日程按排</Tab-pane>
        </Tabs>

    </div>
</template>
<script>
    import axios from 'axios';
    import CalendInfo from '../main-components/calend/calendrinfo.vue';
    import browsetask from '../project/task/browseTaskPop.vue';
    import {mapMutations} from 'vuex';
    export default {
        data(){
            return {
                isTabModal: false,
                UserID: 1,
                ProjectData: [],
                KeepData: [],
                AuditData: [],
                DispData: [],
                modelTask: false,
                BaseObj: {},
                childList: [],
                taskType: [],
                subpId: '',
                tType: '',
            //AllowEdit:"Allow"//控制是否允许标注 Allow允许，NotAllow不允许，Other不显示下面的容器和不允许标注
            };
        },
        components: {CalendInfo, browsetask},
        filters: {
            progresTime(val){
                if (val<0){
                    return 0+"%";
                } else if (val<=100){
                    return val+"%";
                } else {
                    return val;
                }
            },
            progressLine(val){
                if (val>101){
                    return 101;
                } else if (val<0){
                    return 0;
                } else {
                    return val;
                }
            },
            FilteTime(val){
                let TiemVal=val;
                if (TiemVal<0){
                    return "延期"+Math.abs(TiemVal)+"天";
                } else if (TiemVal==0){
                    return "今天完成";
                } else if (TiemVal>0){
                    return "还剩"+TiemVal+"天";
                }
            },
            fitletype(val){
                if (val.stage_file.type=='image'){
                    return val.stage_file.thumb;
                } else if (val.stage_file.type=='video'){
                    return 'data:image/png;base64,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';
                } else if (val.stage_file.type=='3d'){
                    return 'data:image/png;base64,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';
                }
            }
        },
        mounted(){
            this.UserID=sessionStorage.userId;
            this.AutoHeight();
            this.getData();
            this.InfoRefresh();
        },
        methods: {
            ...mapMutations(['setPrimaryMission', 'setDetailAll', 'setUserStatus']),
        //关闭窗口
            InfoRefresh(){
                this.$bus.on('InfoRefresh', ()=>{
                    this.isTabModal=false;
                    this.getData();
                });
            },
        // 跳转到概况页
            homepage(id){
                sessionStorage.projectID=id;
                this.$router.push('/project/home');
            },
        // 文件详情
            taskDetaInfo(id, type, file, TaskID, item){
            // 本地缓存信息
                this.$store.commit('changeComponentTaskID', TaskID);
                this.$store.commit('changeComponentFileURl', file);
                this.setPrimaryMission(item);
                this.setDetailAll(item);
                this.setUserStatus('leader');
                this.$router.push({path: '/project/details'});

            },
            closeTabmodal(){
                this.isTabModal=false;
                this.$bus.emit('closeModel');
            },
        // 初始化高
            AutoHeight(){
                $(".contentRow dd").height($(window).height()-525);
            },
        // 项目数据
            getData(){
                let _this=this;
                let myProject=_this.$axios.get(_this.GLOBAL.baseRouter+_this.$GLOBALAPI.task_total_by_my_project+'&user_id='+_this.UserID); //我负责的项目
                let emphKeep=_this.$axios.get(_this.GLOBAL.baseRouter+_this.$GLOBALAPI.task_total_by_important+'&user_id='+_this.UserID); //重点关注
                let awaiaudit=_this.$axios.get(_this.GLOBAL.baseRouter+_this.$GLOBALAPI.task_need_review_task_file+'&user_id='+_this.UserID); //需要审核
                let fbackdisp=_this.$axios.get(_this.GLOBAL.baseRouter+_this.$GLOBALAPI.task_wait_action_task_file+'&user_id='+_this.UserID); //反馈待处理
                axios.all([myProject, emphKeep, awaiaudit, fbackdisp]).then(([Mymsg, Keepmsg, Auditmsg, Dispmsg])=>{

                // 我负责的项目
                    let MsgData=Mymsg.data;
                    if (MsgData.err_code==0){
                        _this.ProjectData=MsgData.data;
                    }

                // 重点关注
                    let KeepData=Keepmsg.data;
                    if (KeepData.err_code==0){
                        KeepData.data.forEach(function(element) {
                            if (JSON.stringify(element.stage_file) == "{}"){
                                element.stage_file.id=null;
                                element.stage_file.type='NotType',
                                element.stage_file.file=null,
                                element.stage_file.task_id=null;
                            }
                            _this.KeepData.push(element);
                        }, this);
                    }

                //需要审核
                    let AuditData=Auditmsg.data;
                    if (AuditData.err_code==0){
                        AuditData.data.forEach(function(element) {
                            if (JSON.stringify(element.stage_file) == "{}"){
                                element.stage_file.id=null;
                                element.stage_file.type='NotType',
                                element.stage_file.file=null,
                                element.stage_file.task_id=null;
                            }
                            _this.AuditData.push(element);
                        }, this);
                    }

                //反馈待处理
                    let DispData=Dispmsg.data;
                    if (DispData.err_code==0){
                        DispData.data.forEach(function(element) {
                            if (JSON.stringify(element.stage_file) == "{}"){
                                element.stage_file.id=null;
                                element.stage_file.type='NotType',
                                element.stage_file.file=null,
                                element.stage_file.task_id=null;
                            }
                            _this.DispData.push(element);
                        }, this);
                    }
                }, ()=>{
                    _this.$Message.error('请求失败！');
                });
            }
        }
    };
</script>
<style lang="less">
.projectWorkInfo{
    .myProject{
        margin-right:310px;background:@baseboard;text-align:left;
        dt{
            height:30px;line-height:30px;padding-left:10px;font-size:@fs14;font-weight:bold;
        }
        dd{
            padding:24px;height:215px;overflow:auto;overflow-x:hidden;
            .proChart{
                margin:10px 0px;
            }
            .demo-Circle-inner{
                p{
                    font-size:14px;margin-top:8px;color:#888;
                }
            }
            .circle{
                text-align:center;
            }
            .title{
                background:#ff6600;color:#fff;border-radius:4px;padding:0px 5px;line-height:18px;height:18px;margin-bottom:8px;display:inline-block;
            }
            .content{
                margin-top:10px;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;
                .tips{
                    background:#990000;color:#fff;padding:1px 2px;margin-left:2px;font-size:12px;
                }
                .chlidPro{
                    color:#888;font-size:12px;
                }
            }
            .PressLine{
                margin-top:15px;display:block;
                .gressTile{
                    text-align:right;padding-right:10px;float:left;width:90px;padding-right:10px;
                }
                .gressLine{
                    margin-left:100px;
                }
            }
            .ivu-progress-show-info{
                .ivu-progress-outer{
                    padding-right:90px;margin-right:-90px;
                }
            }

        }
    }
    .myCalend{
        float:right;width:290px;text-align:left;
        .jobCalend{
            margin-top:0px;
            dd{
                height:213px;
            }
        }
    }
}
.projectWorkContent{
    margin-top:20px;
    .contentRow{
        float:left;margin-left:2%;background:@baseboard;width:32%;text-align:left;
        dt{
            &:extend(.projectWorkInfo .myProject dt);
        }
        dd{
            padding:0px 15px 15px 15px;overflow:auto;
        }
    }
    .contentRow:hover{
        box-shadow: 0px 4px 12px 2px #c5c3c38f;
    }
    .emphkeep{
        margin-left:0%;
        .ivu-progress-bg{
            background:#00cc00;
        }
        .ivu-progress-inner{
            background:#e4e4e4;
        }
        li{
            margin-top:15px;margin-bottom:-12px;
        }
        .row{
            background:@baseboard;margin-bottom:-10px;padding:10px;line-height:28px;
            span{
                width:25%;display:inline-block;text-align:right;
                &:nth-child(1){
                    width:48%;text-align:left;
                }
            }
            i{
                font-style:normal;color:#fff;background:#ff9900;padding:0px 2px;
            }
            .ishow{background:none;color:#ff9900;}
            s{
                color:#ff6600;text-decoration:none;font-weight:bold;
            }
            img{
                width:20px;height:20px;border-radius:100%;float:left;margin-right:5px;
            }
            u{
                text-decoration:none;color:#969696;
            }
        }
    }
    .awaiaudit{
        span{
            width:18%;display:inline-block;text-align:right;
            &:nth-child(1){
                text-align:left;width:43%;
            }
        }
        img{
            &:extend(.projectWorkContent .emphkeep .row img);
            width:70px;height:46px;margin-top:4px;
        }
        li{
            &:extend(.projectWorkContent .emphkeep li);
            &:extend(.projectWorkContent .emphkeep .row);
            i{
                &:extend(.projectWorkContent .emphkeep .row i);
            }
        }

        s{
            &:extend(.projectWorkContent .emphkeep .row s);
        }
        u{
            &:extend(.projectWorkContent .emphkeep .row u);
        }
        .chlidProject{
            max-width:90px;height:20px;line-height:20px;overflow:hidden;display:inline-block;white-space:nowrap;text-overflow:ellipsis;
        }
    }
    .fbackdisp{
        li{
            margin-top:12px;width:48.5%;float:left;margin-left:3%;background:@baseboard;padding:4px;
            img{
                width:100%;height:92px;margin-top:-17px;
            }
            &:nth-child(odd){
                margin-left:0;
            }
        }
        .tip{
            background:rgba(223, 140, 10, 0.8);color:#fff;padding:1px 4px;position:relative;
        }
        .stop{
            background:rgba(151, 61, 6, 0.8);
            &:extend(.projectWorkContent .fbackdisp .tip);
        }
        .fbackinfo{
            line-height:24px;margin-top:3px;
            span{
                width:49%;color:#969696;display:inline-block;

            }
            img{
                width:20px;height:20px;border-radius:100%;float:left;margin-right:5px;margin-top:0px;
            }
        }

    }
}
</style>
