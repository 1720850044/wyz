<template>
    <div class="feedbackInfoContainer">
        <!--{{feedbackData.isTestTask}}-->
        <!--postID{{userPost.postId}}-->
        <!--status{{feedbackData.status}}-->
        <!--测试任务-->
        <div v-if="feedbackData.isTestTask">
            <!--成员-->
            <div v-if="userPost.postId == 3">
                <div class="feedbackInfo" v-if="feedbackData.status == 1">
                    <span class="text"><p>{{$t('lang.lang_status')}}</p><br/>{{feedbackData.status | testFilter}}</span>
                    <span class="text"><p>{{$t('project.pro_waitingTime')}}</p><br/>
                        <Icon type="android-time"></Icon>
                        <b style="color: #3bceb6">{{feedbackData.wait_time}}</b>
                    </span>
                    <span class="text"><p>{{$t('project.pro_reviewer')}}</p><br/>
                    <b>
                        <img v-if="feedbackData.inside_audit_uid" :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.inside_audit_uid" style="width: 32px;height: 32px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                        <img v-else :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.leader_member" style="width: 32px;height: 32px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                        {{feedbackData.inside_audit_name?feedbackData.inside_audit_name:feedbackData.leader_name }}
                    </b>
                    </span>
                </div>
                <div class="feedbackInfo" v-if="feedbackData.status == 2">
                    <span class="text"><p>{{$t('lang.lang_status')}}</p><br/>
                        <Icon type="checkmark-circled" size="16" style="color: #3bceb6"></Icon>
                        {{feedbackData.status | testFilter}}
                    </span>
                    <span class="text"><p>{{$t('project.pro_feedbackTime')}}</p><br/>
                        <Icon type="android-time"></Icon>
                        <b style="color: #3bceb6">{{feedbackData.wait_time}}</b>
                    </span>
                    <span class="text"><p>{{$t('project.pro_reviewer')}}</p><br/>
                    <b>
                        <img v-if="feedbackData.inside_audit_uid" :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.inside_audit_uid" style="width: 32px;height: 32px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                        <img v-else :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.leader_member" style="width: 32px;height: 32px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                        {{feedbackData.inside_audit_name?feedbackData.inside_audit_name:feedbackData.leader_name }}
                    </b>
                    </span>
                </div>
                <div v-if="feedbackData.status != 1 && feedbackData.status != 2" class="feedbackInfo">
                    <div class="content">
                        <p>{{$t('lang.lang_status')}}</p><br/>
                        {{feedbackData.status | testFilter}}
                    </div>
                    <div  class="content">
                        <p>{{$t('project.pro_modifyAdjustment')}}</p><br/>
                        <span style="color: #3bceb6">{{modifySignNum}} {{$t('project.pro_bureau')}}</span>
                        <!--<span style="color: #3bceb6">{{JSON.parse(feedbackData.file[0].tag) ? JSON.parse(feedbackData.file[0].tag).length : 0}} 处</span>-->
                    </div>
                    <div  class="content"><p>{{$t('project.pro_feedbackToDescribe')}}</p><br/> {{feedbackData.feedback || $t('project.pro_notAvailable')}}</div>
                    <span class="content"><p>{{$t('project.pro_reviewer')}}</p><br/>
                    <b>
                        <img v-if="feedbackData.inside_audit_uid" :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.inside_audit_uid" style="width: 32px;height: 32px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                        <img v-else :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.leader_member" style="width: 32px;height: 32px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                            {{feedbackData.inside_audit_name?feedbackData.inside_audit_name:feedbackData.leader_name }}
                    </b>
                    </span>
                </div>
            </div>
            <!--非成员-->
            <div v-else>
                <div v-if="feedbackData.status == 1" class="VideoAllowEdit">
                    <i class="project_opinion tagimage"></i>
                    <span style="color: @black_2;line-height: 30px;">{{$t('project.pro_auditOpinion')}}</span>
                    <span class="text">
                        <textarea name="" class="EditInputs" :placeholder="$t('project.pro_pleaseEnterYourFeedback')+'...'"
                                  v-model="FeedbackValue"></textarea>
                    </span>
                    <span class="EditSub">
                        <button class="actionPost" @click="commitEidt('edit', true)">
                            <Icon v-if="showLoading" type="load-c"></Icon>
                            <label v-if="showLoading">{{$t('project.pro_submitting')}}</label>
                            <label v-if="!showLoading">{{feedbackBtnText}}</label>
                        </button>
                    </span>
                    <span class="EditSub">
                        <button class="subPass" @click="commitEidt('ok', true)" :class="{'disabled-btn': dontClickBtn}" :disabled="dontClickBtn">{{$t('project.pro_pass')}}</button>
                    </span>
                </div>

                <div v-else-if="feedbackData.status != 1" class="feedbackInfo">
                    <div  class="content" >
                        <p>{{$t('lang.lang_status')}}</p><br/>
                        <Icon v-if="feedbackData.status == 2" type="checkmark-circled" size="16" style="color: #3bceb6"></Icon>
                        {{feedbackData.status | testFilter}}
                    </div>
                    <template v-if="feedbackData.status == 3">
                        <div class="content">
                            <p>{{$t('project.pro_modifyAdjustment')}}</p><br/>
                            <span style="color: #3bceb6">{{modifySignNum}} {{$t('project.pro_bureau')}}</span>
                            <!--<span  class="text" style="color: #3bceb6">{{JSON.parse(feedbackData.file[0].tag) ? JSON.parse(feedbackData.file[0].tag).length : 0}} 处</span>-->
                        </div>
                        <div  class="content"><p>{{$t('project.pro_feedbackTime')}}</p><br/> {{feedbackData.feedback || $t('workbench.work_nullStatus')}}</div>
                    </template>
                    <div v-else class="content">
                        <p>{{feedbackData.status == 2?$t('lang.lang_status'):$t('project.pro_waitingTime')}}</p><br/>
                        <span class="text">
                            <Icon type="android-time"></Icon>
                            <b style="color: #3bceb6">{{feedbackData.wait_time}}</b>
                        </span>
                    </div>
                    <span class="content"><p>{{$t('project.pro_reviewer')}}</p><br/>
                    <b>
                        <img v-if="feedbackData.inside_audit_uid" :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.inside_audit_uid"
                             style="width: 32px;height: 32px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                        <img v-else :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.leader_member"
                             style="width: 32px;height: 32px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                            {{feedbackData.inside_audit_name?feedbackData.inside_audit_name:feedbackData.leader_name }}
                    </b>
                    </span>
                </div>

            </div>
        </div>
        <!--普通任务-->
        <div v-else>
            <!-- 内部待审 -->
            <div v-if="feedbackData.status == 1">
                <!--{{userPost.type}}-->
                <!--{{is_collaboration}}-->
                <div v-if="userPost.postId == 3 || (userPost.type && is_collaboration)" class="feedbackInfo">
                    <span class="text"><p>{{$t('lang.lang_status')}}</p><br/>{{feedbackData.status | filtStat}}</span>
                    <span class="text"><p>{{$t('project.pro_waitingTime')}}</p><br/>
                        <Icon type="android-time"></Icon>
                        <b style="color: #3bceb6">{{feedbackData.wait_time}}</b>
                    </span>
                    <span class="text"><p>{{$t('project.pro_reviewer')}}</p><br/>
                        <b>
                            <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.p_leader" style="width: 32px;height: 32px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                            {{feedbackData.leader_member_name || feedbackData.client_audit_remarkname}}
                        </b>
                    </span>
                </div>
                <div v-else class="VideoAllowEdit">
                    <i class="project_opinion tagimage"></i>
                    <span style="color: @black_2;line-height: 30px;">{{$t('project.pro_auditOpinion')}}</span>
                    <span class="text">
                        <textarea name="" class="EditInputs" :placeholder="$t('project.pro_pleaseEnterYourFeedback')"
                                  v-model="FeedbackValue">
                        </textarea>
                    </span>
                    <span class="EditSub">
                        <button class="actionPost" @click="commitEidt('edit',false)">
                            <Icon v-if="showLoading" type="load-c"></Icon>
                            <label v-if="showLoading">{{$t('project.pro_submitting')}}</label>
                            <label v-if="!showLoading">{{feedbackBtnText}}</label>
                        </button>
                    </span>
                    <span class="EditSub">
                        <button class="subPass"
                                @click="commitEidt('ok',false)"
                                :class="{'disabled-btn': dontClickBtn}"
                                :disabled="dontClickBtn">{{$t('project.pro_pass')}}
                        </button>
                    </span>
                </div>
            </div>
            <!-- 内部已反馈 和 客户反馈-->
            <div v-if="feedbackData.status == 3 ||feedbackData.status == 4" class="feedbackInfo">
                <div class="content">
                    <p>{{$t('lang.lang_status')}}</p><br/>
                    {{feedbackData.status | filtStat}}
                </div>
                <template>
                    <div class="content">
                        <p>{{$t('project.pro_modifyAdjustment')}}</p><br/> <span style="color: #3bceb6">{{modifySignNum}} {{$t('project.pro_bureau')}}</span>
                    </div >
                    <div style="flex:1;text-align: center"><p>{{$t('project.pro_feedbackToDescribe')}}</p><br/> {{feedbackData.feedback}}</div>
                </template>
                <!-- 组长审核人 -->
                <div class="content" v-if="feedbackData.status == 3">
                    <p>{{$t('project.pro_reviewer')}}</p><br/>
                    <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.inside_audit_uid"
                         style="width: 33px;height: 33px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                    {{feedbackData.inside_audit_remarkname || '--'}}
                </div>
                <!-- 外部审核人 -->
                <div class="content" v-else>
                    <p>{{$t('project.pro_reviewer')}}</p><br/>
                    <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+feedbackData.client_audit_uid"
                         style="width: 33px;height: 33px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                    {{feedbackData.client_audit_remarkname || '--'}}
                </div>
            </div>
            <!-- 外部待审 -->
            <div v-if="feedbackData.status == 2"  >
                <!--{{is_collaboration}} {{userPost.type}}-->
                <div v-if="(is_collaboration && !userPost.type)" class="feedbackInfo" >
                    <div class="content">
                        <p>{{$t('lang.lang_status')}}</p><br/>
                        {{feedbackData.status | filtStat}}
                    </div>
                    <div class="content">
                        <p>{{$t('project.pro_waitingTime')}}</p><br/>
                        <span class="text">
                            <Icon type="android-time"></Icon>
                            <b style="color: #3bceb6">{{feedbackData.wait_time}}</b>
                        </span>
                    </div>
                </div>
                <template v-else>
                    <div v-if="(is_collaboration && userPost.type)" class="VideoAllowEdit">
                        <i class="project_opinion tagimage"></i>
                        <span style="color: @black_2;line-height: 30px;">{{$t('project.pro_auditOpinion')}}</span>
                        <span class="text">
                             <textarea name=""  class="EditInputs"
                                       :placeholder="$t('project.pro_pleaseEnterYourFeedback')"
                                       v-model="FeedbackValue"></textarea>
                        </span>
                        <span class="EditSub">
                            <button class="actionPost" @click="commitEidt('clientEdit',false)">
                                <Icon v-if="showLoading" type="load-c"></Icon>
                                <label v-if="showLoading">{{$t('project.pro_submitting')}}</label>
                                <label v-if="!showLoading">{{feedbackBtnText}}</label>
                            </button>
                        </span>
                        <span class="EditSub">
                            <button class="subPass" @click="commitEidt('clientOk',false)" :class="{'disabled-btn': dontClickBtn}" :disabled="dontClickBtn">{{$t('project.pro_pass')}}</button>
                        </span>
                    </div>
                    <template v-else>
                        <span style="margin:0 auto;display: flex; justify-content: center;">
                               <Icon type="ios-locked" size="50"  style="color: #bec1c3;line-height: 84px;"></Icon>
                                <span style="margin-left: 15px;flex: initial;" >
                                    <div style="margin-top: 19px;color: #616161">{{$t('project.pro_unauditedResourcePermissions')}}</div>
                                    <div style="margin-top: 10px; color: #9E9E9E">{{$t('project.pro_permissionRequiresInvitingCollaborators')}}（<span style="color:#3cd2b4;">{{pro_company_name}}</span>）{{$t('project.pro_companyStart')}}</div>
                                </span>
                            </span>
                    </template>
                </template>
            </div>
            <!-- 阶段完成 -->
            <div v-if="feedbackData.status == 5" class="feedbackInfo">
                <div class="content">
                    <p>{{$t('lang.lang_status')}}</p><br/>
                    <Icon  type="checkmark-circled" size="16"
                           style="color: #3bceb6"></Icon>
                    {{feedbackData.status | filtStat}}
                </div>
                <span class="text"><p>{{$t('project.pro_feedbackTime')}}</p><br/>
                        <Icon type="android-time"></Icon>
                        <b style="color: #3bceb6">{{feedbackData.wait_time}}</b>
                    </span>
                <div class="content">
                    <p>{{$t('project.pro_reviewer')}}</p><br/>
                    <img :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+taskimg"
                         style="width: 33px;height: 33px;border-radius: 50%;vertical-align: middle;margin-right: 10px;">
                    {{feedbackData.client_audit_remarkname?feedbackData.client_audit_remarkname:feedbackData.inside_audit_remarkname?feedbackData.inside_audit_remarkname:feedbackData.leader_member_name}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex';
    import Cookies from 'js-cookie';

    export default {
        props: {
            taskInfos: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            is_collaboration: {
                type: Number
            }
        },
        watch: {
            sumSign(value) {
                this.dontClickBtn = value > 0;
            },
            taskInfos(val){
                debugger;
                this.feedbackData = val;
                if (val.file && val.file.length > 0){
                    let mainFile = val.file.filter(file => file.is_main === '1');
                    let tag = mainFile[0].tag;
                    //测试任务是字符串  普通任务是数组  坑比的后端
                    if (typeof tag === 'string' && tag.constructor === String){
                        tag = tag && tag.length > 0 ? JSON.parse(tag) : null;
                    } else {
                        tag = mainFile[0].tag;
                    }
                    this.modifySignNum = tag ? tag.length : 0;
                } else {
                    this.modifySignNum = 0;
                }
            }
        },
        mounted() {
            this.userInfos();
        },
        data() {
            return {
                project_id: sessionStorage.getItem('projectID'),
                companyName: '',
                FeedbackValue: '',
                feedbackData: {
                    isTestTask: false
                },
                userPost: {
                    postName: '',
                    postId: null,
                    type: JSON.parse(Cookies.get('company')).type
                },
                dontClickBtn: false,
                modifySignNum: 0,
                feedbackBtnText: i18n.t('project.pro_needBeModified'),
                showLoading: false
            };
        },
        methods: {
            commitEidt(type, isTestTask) {
                this.$emit('commitEidt', {
                    type: type,
                    FeedbackValue: this.FeedbackValue,
                    isTestTask: isTestTask,   //是否是测试任务,
                });
            },
            async userInfos(){
                let Infos = JSON.parse(Cookies.get('company'));
                switch (Infos.post_id){
                    case '1':
                        this.userPost.postName = i18n.t('project.pro_manager');
                        this.userPost.postId = '1';
                        break;
                    case '2':
                        this.userPost.postName = i18n.t('project.pro_groupLeader');
                        this.userPost.postId = '2';
                        break;
                    case '3':
                        this.userPost.postName = i18n.t('lang.lang_member');
                        this.userPost.postId = '3';
                        break;
                    case '99999':
                        this.userPost.postName = i18n.t('project.pro_administrator');
                        this.userPost.postId = '99999';
                        break;
                }
            }
        },
        computed: {
            ...mapState({
                clubAudit(value) {
                    return value.app.clubAudit;
                },
                clubTaskManagement(value) {
                    return value.app.clubTaskManagement;
                },
                qualityId(value) {
                    return value.project.qualityId;
                },
                pro_company_name(value) {
                    return value.app.pro_company_name;
                },
                sumSign(val){
                    return val.ImgVedioStatus.sumSign;
                }
            }),
            taskimg(){
                return this.feedbackData.client_audit_uid?this.feedbackData.client_audit_uid:this.feedbackData.inside_audit_uid?this.feedbackData.inside_audit_uid:this.feedbackData.p_leader;
            },
        },

        filters: {
            filtStat(val) {
                if (val == 1) {
                    return i18n.t('project.pro_internalPending');
                } else if (val == 2) {
                    return i18n.t('project.pro_externalPending');
                } else if (val == 3) {
                    return i18n.t('project.pro_internalFeedback');
                } else if (val == 4) {
                    return i18n.t('project.pro_externalFeedback');
                } else if (val == 5) {
                    return i18n.t('project.pro_stageComplete');
                } else {
                    return '--';
                }
            },
            testFilter(val) {
                if (val == 1) {
                    return i18n.t('project.work_examineTab');
                } else if (val == 2) {
                    return i18n.t('project.pro_alreadyPassed');
                } else {
                    return i18n.t('project.pro_notPass');
                }
            },
            timeConvert(val) {

                let tmp = Date.parse(new Date()).toString();
                tmp = tmp.substr(0, 10);
                let utc = Number(tmp) - Number(val);
                utc = utc/60/60/24;
                let date = null;
                if (utc.toString().includes('.')) {
                    date = utc.toString().split('.')[0];
                } else {
                    date = utc.toString();
                }
                return date <= 0 ? 1 : date;
            }
        }
    };
</script>


<style lang="less" scoped>
    .feedbackInfoContainer {
        box-shadow: 0 1px 3px 0 #ccc;
        .VideoAllowEdit {
            display: flex;
            width: 100%;
            /*padding: 24px 0 24px 20px;*/
            /*background: @baseboard;*/
            padding:  24px;
            background: #fff;
            border-radius: 3px;

            .text {
                flex: 1;
                margin: 0 20px;
                .EditInputs {
                    font-size: 13px;
                    width: 100%;
                    height: 80px;
                    color: #777777;
                    border: 1px solid #eee;
                    resize: none;
                    padding: 5px 8px;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    outline: none;
                    &:hover, &:focus {
                        border: 1px solid #3bceb6;
                        -webkit-box-shadow: 0 0 2px #3bceb6;
                        -moz-box-shadow: 0 0 2px #3bceb6;
                        box-shadow: 0 0 2px #3bceb6;
                        -webkit-transition: border 0.3s;
                        -moz-transition: border 0.3s;
                        -ms-transition: border 0.3s;
                        -o-transition: border 0.3s;
                        transition: border 0.3s;
                    }
                }
            }
            .EditInput {
                width: 74%;
                display: inline-block;
                input {

                    border: 0;
                    border-bottom: 1px solid #ddd;
                    padding: 5px 10px;
                    width: 100%;
                    background: none;
                    line-height: 30px;
                    font-size: 14px;
                }
            }
            .EditSub {
                .actionPost {
                    margin-top: 35px;
                    margin-right: 30px;
                    > i {
                        font-size: 14px;
                        color: #fff;
                        margin-right: 3px;
                        animation: rotate-infinity 1s linear infinite;
                    }
                    @keyframes rotate-infinity {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                }
                button {
                    outline: ;
                    width: 125px;
                    height: 40px;
                    border-radius: 4px;
                    color: #fff;
                    line-height: 40px;
                    border: 0;
                    font-size: 13px;
                    cursor: pointer;

                    &.actionPost{
                        background: @orange;
                        &:hover{
                            background: #cc984b !important;
                        }
                    }
                    &.subPass {
                        margin-top: 35px;
                        background: @base;
                        &:hover{
                            background: #00AA82;
                        }
                        &.disabled-btn {
                            background: #cfcfcf;
                            cursor: not-allowed;
                        }
                    }
                }

            }

        }

        .feedbackInfo {
            width: 100%;
            display: flex;
            background: #fff;
            font-size: 13px;
            padding: 20px;
            text-align: center;
            justify-content: space-between;
            .text{
                padding: 0 20px;
            }
            .content{
                flex: 1;
                padding: 0 20px;
                min-width: 130px;
            }

            p {
                font-size: 12px;
                color: #cacaca;
                display: inline-block;
                margin-bottom: 6px;
            }
        }
    }

</style>
