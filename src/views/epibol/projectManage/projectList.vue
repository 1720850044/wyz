<template>
    <!-- 项目管理内容 -->
        <div class="projectManageContent">
            <template v-if="(MsgData && MsgData.length > 0)">
                <div  class="ContentRow project-guide-list"  data-step="1" data-disable-interaction="1" data-start="3" data-last="3" data-position="right" :data-intro="'<h1>managementProject</h1><p>workbench</p>'" :class="[{'project-guide-list':index === 0}]" v-for="(item,index) in MsgDataAssemble" :key="index" :id="'ContentRow'+index" @click="homePage(item.id)">
                    <!-- Header -->
                    <div class="RowTitle">
                        <!--0内部 1外包-->
                        <!--{{companyType}}-->
                        <span v-if="item.collaboration||item.is_collaboration" class="state_participation">{{$t('resources.res_cooperation')}}</span>
                        <span v-else-if="item.contract != 0" class="state_participation">{{$t('resources.res_cooperation')}}</span>

                        <div class="title">
                            <p>
                                <span>
                                <Icon v-if="Number(item.status)==2 || Number(item.status)==4" type="ios-pause" size="20" color="#17ceb1" style="margin-right: 10px;line-height: 22px;"></Icon>
                                </span>
                                    <span class="">
                                    <b style="font-size: 18px;font-weight: lighter">{{item.name}}</b>
                                    <span class="tag"><i v-for="(tage,index) in item.tag" class="i" :key="index" >{{tage}}</i></span>
                                </span>
                            </p>
                            <p>
                                <!--乙方 外包项目 需要显示编辑和删除按钮 反之 甲方不显示-->
                                <span v-if="!item.collaboration" class="edit">
                                <em  class="iconfonts icon-bianji2" @click.stop="editPro($event,item)"></em>
                                <em class="iconfonts icon-shanchu" @click.stop="deletePro($event,item.id,index,item.name)"></em>
                                </span>
                                    <span class="edit">
                                    <em class="iconfonts icon-backs" @click.self="closeSlide($event,item)"></em>
                                </span>
                            </p>

                        </div>
                        <div style="display: flex;justify-content: space-between;align-items: flex-end;">
                            <!--<span class=""> -->
                                <!--v-if="item.contract != 0 || item.contract == null"-->
                            <div>
                                <p>
                                    <span v-if="item.company" style="display: inline-block;width: 100%;height: 16px"><i class="iconfonts icon-loudong"></i> {{item.company}}</span>
                                    <span v-else style="display: inline-block;height: 16px;width: 100%">&nbsp;</span>
                                </p>
                                <p><i class="iconfonts icon-SVG-"></i> {{item.start_date}}{{$t('resources.res_to')}} {{item.end_date}}</p>
                            </div>

                            <!--</span>-->
                            <span class="realname">
                                <p>{{item.realname　|| notAvailable}}</p>
                            </span>
                        </div>
                    </div>
                    <!-- Content -->
                    <div class="content">
                        <Row>
                            <Col span="6" class="listTitle">
                            <i-circle :percent="Number(item.rate_task)" :size="90" :trail-width="7" :stroke-width="7" stroke-color="#3bceb6" trail-color="#d0f3ee">
                                <span class="demo-Circle-inner" style="font-size:14px;color:#17ceb1;margin-bottom:5px;font-weight:bold;">{{item.rate_task}}%</span>
                                <p style="font-size: 12px;color: #bdbdbd;margin-top: 3px">{{$t('project.pro_plan')}}</p>
                                <!--<span style="font-size: 12px;color: #bdbdbd">进度</span>-->
                            </i-circle><br/>
                            <p v-if="item.last_day != 1" class="lastDay">{{item.last_day_text}} <span> {{ item.last_day < 0 ? Math.abs(item.last_day) : item.last_day }} </span> 工作日</p>
                            <p v-else-if="item.last_day == 1" class="nowDay">{{$t('workbench.work_endTodayTab')}}</p>
                            </Col>
                            <Col span="18" class="listLine">
                            <div class="line">
                                <div class="title">{{$t('lang.lang_time')}}</div>
                                <div class="lineRow lineTime">
                                    <Progress :percent="Number(item.time_progress)" :stroke-width="7" status="active">
                                    <span>
                                        <!--<i v-if="item.last_day < 0" style="color:#3bceb6;font-size: 13px">已延期</i>-->
                                        <i style="color:#3bceb6;font-size: 13px">{{item.time_progress | ProgessDay}} %</i>
                                    </span>
                                    </Progress>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="line">
                                <div class="title">{{$t('project.pro_postpone')}}</div>
                                <div class="lineRow lineFile">
                                    <Progress :percent="Number(item.out_time_rate)" :stroke-width="7" status="active">
                                        <span><i style="color:@orange;font-size: 14px">{{Math.round(Number(item.out_time_rate))}} %</i></span>
                                    </Progress>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="line">
                                <div class="title">{{$t('workbench.work_complete')}}</div>
                                <div class="lineRow linePost"><Progress :percent="Number(item.rate_task)" :stroke-width="7" status="active">
                                    <span style="font-size: 14px"><i style="color:#2196F3;font-size: 14px">{{item.end_task}}</i><i style="color: #bdbdbd"> / {{item.all_task}}</i></span></Progress></div>
                                <div class="clear"></div>
                            </div>
                            </Col>
                        </Row>
                    </div>
                    <!--slider-->
                    <previewlist :propsData="{ShowFlag:item.ShowFlag,screenshotID:'ContentRow'+index,id:item.id}" @closeSlide="closeSlide(null,item)"></previewlist>
                </div>
            </template>
            <!-- 删除项目 -->
            <Modal v-model="deleteProject" :title="deleteProValue" @on-ok="DeleteOk">
                <p style="font-size:14px;">{{$t('resources.res_deleSure')}} "<span style="margin:0px 5px;font-weight:bold;color:#ff8000;"> {{deleteProValue}} </span>"{{$t('resources.res_deleRevoke')}}</p>
            </Modal>
        </div>
</template>
<script>
import api from 'api';
import {mapState} from 'vuex';
import Cookies from 'js-cookie';
// import ScreenShitAndUploadOSS from '@libs/ScreenShitAndUploadOSS.js';
export default {
    data(){
        return {
            deleteProject: false,
            managementProject: i18n.t('resources.res_managementProject'),
            plan: i18n.t('project.pro_plan'),
            notAvailable: i18n.t('project.pro_notAvailable'),
            workbench: i18n.t('resources.res_workbench'),
            deleteProValue: '',
            DPid: 0,
            DIndex: 0,
            companyType: JSON.parse(Cookies.get('company')).type,
            OSSdata: null,
            chatMemberList: [],
        };
    },
    props: {
        MsgData: {
            type: Array,
            default: []
        }
    },
    computed: {
        ...mapState({
            collaboration(value){
                return value.app.collaboration;
            },
        }),
        MsgDataAssemble(){
            this.MsgData.forEach((creent, index, arr)=>{
                creent.ShowFlag = false;
            });
            return this.MsgData;
        }
    },
    methods: {
        // 删除项目
        deletePro(e, Pid, index, name){
            if (e){e.stopPropagation();}
            this.deleteProject=true;
            this.DPid=Pid;
            this.DIndex=index;
            this.deleteProValue=name;

        },
        DeleteOk(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_projectdelete;
            let params={
                id: this.DPid
            };
            _this.$axios.post(url, params).then((msg)=>{
                if (msg.data.err_code == 0){
                    this.$bus.emit('delProjectFun');
                    _this.MsgData.splice(this.DIndex, 1);
                        // 刷新导航
                    _this.$store.dispatch('createNav');
                    _this.$Message.success(i18n.t('resources.res_deleSuce'));
                    _this.$emit('getContractList');
                } else {
                    _this.$Message.error(i18n.t('companyProject.com_deleteFail'));
                }

            }, ()=>{
                _this.$Message.warning(i18n.t('resources.res_requestFail'));
            });
        },
        // 跳转到Home页
        homePage(id){
            // 更新导航栏
            this.$bus.emit('changeMenuList', id);
            sessionStorage.projectID=id;

            this.$router.push('/project/task');
        },
        //编辑项目
        editPro(e, item){
            if (e){e.stopPropagation();}
            this.$bus.emit("editProjectInfo", item);
        },
        closeSlide(e, data){
            if (e){e.stopPropagation();}
            this.$forceUpdate();
            data.ShowFlag = !data.ShowFlag;
        }
    },
    filters: {
        ProgessDay(val){
            if (val>=100){
                return 100;
            } else if (val<0){
                return 0;
            } else {
                return val;
            }
        },
        lastDay(val){
            if (val>0){
                return val+"%";
            } else if (val<0){
                return "0%";
            } else {
                return val;
            }
        }
    },
};
</script>
<style lang="less">
    .projectManageContent {
        margin-top: 20px;
        height: 88%;
        overflow: auto;
        i {
            font-style: normal;
        }
        .ContentRow:nth-of-type(3n) {
            margin-right: 0 !important;
        }
        .ContentRow {
            height: 285px;
            width: 32.3%;
            float: left;
            margin-bottom: 1.5%;
            background: @white;
            margin-right: 1.5%;
            border-radius: @r4;
            position: relative;
            animation: appear 0.3s ease;
            @keyframes appear {
                0% {
                    opacity: 0;
                }
                50% {
                    opacity: 0.7;
                }
                100% {
                    opacity: 1;
                }
            }
            .state_introd,
            .state_participation {
                width: 90px;
                height: 20px;
                line-height: 20px;
                color: @white;
                text-align: center;
                position: absolute;
                top: 4px;
                left: -34px;
                background: @base;
                transform: rotate(-45deg);
            }
            .state_participation {
                background: @orange;
            }
            &:hover {
                cursor: pointer;
                .edit {
                    opacity: 1;
                }
            }
        }
        .ContentRow:hover {
            box-shadow: 0px 4px 12px 2px #c5c3c38f;
        }
        .RowTitle {
            position: relative;
            padding: 20px;
            overflow: hidden;
            .MLeft20 {
                margin-left: 20px;
                margin-right: 10px;
            }
            span {
                .tips {
                    position: relative;
                    left: -60px;
                    top: -30px;
                }
                img {
                    width: 90px;
                    height: 90px;
                    border: 0px;
                    border-radius: @r4;
                    &:hover {
                        cursor: pointer;
                    }
                }
                .font14 {
                    font-size: @fs14;
                    font-weight: lighter;
                    color: @black_2;
                    margin-right: @p5;
                    &:hover {
                        cursor: pointer;
                        text-decoration: underline;
                    }
                }
                .tag {
                    .i {
                        background: @white;
                        border-radius: 2px;
                        padding: 1px 2px;
                        color: @base;
                        margin: 0 4px;
                        border: 1px solid @base;
                        font-size: 12px;
                    }
                }
                p {
                    display: block;
                    line-height: 26px;
                    color: @baseFont;
                    font-size: 12px;
                    img {
                        width: 20px;
                        height: 20px;
                        border-radius: 100%;
                        margin-left: 5px;
                        margin-right: 5px;
                    }
                }
            }

            .edit {
                opacity: 0;
                .iconfonts {
                    cursor: pointer;
                    margin-left: @p5;
                    color: @black_3;
                    font-size: @fs16;
                    &:hover {
                        color: @base;
                    }
                }
                .icon-shanchu:hover {
                    color: @red;
                }
            }
            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .realname {
                float: right;
            }
        }
        .content {
            border-top: 1px dashed @gray;
            padding: 20px;
            .listTitle {
                display: block;
                text-align: center;
                width: 25% !important;
                &:hover {
                    cursor: pointer;
                }
                .lastDay {
                    color: #bdbdbd;
                    font-size: 12px;
                    span {
                        color: @base;
                        font-size: 14px;
                    }
                }
                .nowDay {
                    background: @red;
                    color: @white;
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                }
            }
            .listLine {
                .line {
                    margin: 15px 0px;
                    .title {
                        float: left;
                        width: 100px;
                        display: inline-block;
                        text-align: right;
                        padding-right: 15px;
                        font-size: 12px;
                        color: #bdbdbd;
                    }
                    .lineRow {
                        margin-left: 100px;
                        display: block;
                    }
                }
            }
            .lineTime {
                .ivu-progress-bg {
                    background: #3bceb6;
                }
            }
            .linePost {
                .ivu-progress-bg {
                    background: #7cbefc;
                }
            }
            .lineFile {
                .ivu-progress-bg {
                    background: #fcc44a;
                }
                .ivu-progress-success {
                    .ivu-progress-text {
                        color: #fcc44a;
                    }
                }
            }
            .ivu-progress-show-info .ivu-progress-outer {
                padding-right: 65px;
                margin-right: -65px;
            }
        }
    }
</style>
