<template>
    <!-- 招标详情 -->
    <div class="appDetails">
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{$route.query.navTitle || '已报名'}}<div></div></span>
            </div>
        </main-native>
        <div class="second-navigation-bar">
            <a @click="backToList()">{{$route.query.navTitle || '已报名'}}</a>
            <Icon class="icon" type="ios-arrow-right"></Icon>
            <a class="second-nav-title">任务详情</a>
        </div>
        <div class="contener">
            <!-- 信息 -->
            <!--data-start="4" data-step="1" data-disable-interaction="4" data-last="7" :data-intro="guideSteps.step4" data-position="right"-->
            <div class="detailsList">
                <div class="detailHead">
                    <span class="projectName">{{detailsData.test_name | titleSubstring}}</span>
                    <span v-if="detailsData.is_delete" class="projectStatus delSty"><Icon
                        type="ios-minus-outline"></Icon> 已删除</span>
                    <span v-else-if="okStatua != 'join'" class="projectStatus"
                          :class="[{'doing':okStatua == 'doing'},{'ok':okStatua == 'ok'},{'no':okStatua == 'no'},{'join':okStatua == 'join'}]"><Icon
                        type="ios-minus-outline"></Icon> {{taskStatusText}}</span>
                    <span class="projectStage">测试</span>
                    <!--<Icon class="hrartIco" type="heart"></Icon>-->
                </div>

                <div class="Tabs">
                    <span v-for="(tab,index) in tabsInfo.tabsArr" :class="{'Tabchecked':index == tabsInfo.currenIndex}"
                          @click="tabsInfo.currenIndex = index">{{tab.tabTitle}}</span>
                </div>

                <template v-if="tabsInfo.currenIndex==0">
                    <dl>
                        <!--<dd><span>外包方</span><em>{{detailsData.demand_company_name||'暂无'}}</em><div class="clear"></div></dd>-->
                        <!--<dd><span>所属项目</span><em>{{detailsData.test_name}}</em>-->
                        <!--<div class="clear"></div>-->
                        <!--</dd>-->
                        <dd v-if="detailsData.test_price"><span>测试金额</span><em class="num">￥{{detailsData.test_price||'0.00'}}</em>
                            <div class="clear"></div>
                        </dd>
                        <dd><span>项目预计总额</span><em class="num">￥{{detailsData.project_max_price||'0.00'}}</em>
                            <div class="clear"></div>
                        </dd>
                        <dd><span>交稿截止</span><em class="num">{{detailsData.end_time | timeCover}}</em>
                            <div class="clear"></div>
                        </dd>
                        <!--data-start="5" data-last="7" data-step="2" data-disable-interaction="5" :data-intro="guideSteps.step5"-->
                        <div class="zhizuo">
                            <dd><span>制作人</span>
                                <em>
                                    <Select v-if="pesValue1 != 'NULL'" v-model="pesValue1" :disabled="disabledFlag"
                                            style="width:150px" :placeholder="detailsData.execute_user_name||'请选择制作人'"
                                            @on-change="changeUserName()">
                                        <Option v-for="item in personnel" :value="item.id" :key="item.user_id">
                                            {{item.realname}}
                                        </Option>
                                    </Select>
                                </em>
                                <div class="clear"></div>
                            </dd>
                            <dd><span>负责人</span>
                                <em>
                                    <Select v-if="pesValue2 != 'NULL'" v-model="pesValue2" :disabled="disabledFlag"
                                            style="width:150px" :placeholder="detailsData.leader_name||'请选择负责人'"
                                            @on-change="changeUserName()">
                                        <Option v-for="item in personnel" :value="item.id" :key="item.user_id">
                                            {{item.realname}}
                                        </Option>
                                    </Select>
                                </em>
                                <div class="clear"></div>
                            </dd>
                        </div>

                        <!--<dt>任务类型</dt>-->
                        <dd>
                            <span>任务类型</span>
                            <!--<Icon type="android-color-palette" style="font-size: 20px;color: #1ac0df"></Icon>-->
                            <em>{{detailsData.task_type}}</em>
                            <div class="clear"></div>
                        </dd>
                        <dt>稿件要求补充说明</dt>
                        <dd class="description" style="margin-top: 10px">
                            {{detailsData.description||'暂无'}}
                        </dd>
                        <dd v-if="detailsData.file_require && detailsData.file_require.spec"><span>稿件规格</span><em
                            class="num">{{detailsData.file_require.spec}}</em>
                            <div class="clear"></div>
                        </dd>
                        <dd v-if="detailsData.file_require && detailsData.file_require.format"><span>稿件格式</span><em
                            class="num">{{detailsData.file_require.format}}</em>
                            <div class="clear"></div>
                        </dd>
                        <dt>参考文件</dt>
                        <dd style="line-height: 20px">
                            <ul style="max-height: 100px;overflow: auto">
                                <li v-if="!detailsData.file ||detailsData.file.length == 0">暂无</li>
                                <li v-else v-for="item in detailsData.file" style="padding: 5px 0">
                                    <a :href="item.file_url+'?response-content-type=application%2Foctet-stream'"
                                       download>{{item.name | substring}} &nbsp;&nbsp;&nbsp;<i style="color: #3cd2b4"
                                                                                               class="icon iconfonts icon-xiazai"></i></a>
                                </li>
                            </ul>
                            <div class="clear"></div>
                        </dd>
                        <!--<dt>其他说明</dt>-->
                        <!--<dd style="line-height: 25px;word-wrap: break-word;">-->
                        <!--{{detailsData.description ? detailsData.description : '暂无' }}-->
                        <!--</dd>-->
                    </dl>
                </template>
                <template v-else>
                    <div style="height: 663px;overflow: auto">
                        <Timeline>
                            <TimelineItem v-for="(li,index) in testTaskLog" :key="index">
                                <p style="color: #929292">
                                    <span>{{li.realname || '用户_'+li.id}}</span>
                                    <span style="margin-left: 20px">{{li.create_date}}</span>
                                </p>
                                <p style="margin-top: 5px;color: #3cd2b4 ">{{ li.text }}</p>
                            </TimelineItem>
                        </Timeline>
                    </div>
                </template>
            </div>
            <!-- 文件 -->
            <div class="bottomDivSty">
                <div class="detailsComponent">
                    <div style="position: relative;width: 100%;height: 100%" v-if="isHaveFile">
                        <nothink type="project" text="暂无文件"></nothink>
                    </div>
                    <filebrowse ref="filebrowse" v-else :guideSteps="guideSteps" :stageInfos="testfileData"
                                @referTestInfo="getTestTaskBidInfos"></filebrowse>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import mainNative from '../../main-components/mainNative.vue';    //公用头文件
    import filebrowse from '../../project/components/fileBrowseManager.vue';        //公共资源类型组件
    import api from 'api';
    import Cookies from 'js-cookie';

    export default {
        data() {
            return {
                okStatua: 'doing',
                detailsData: {},
                personnel: [],
                pesValue1: 'NULL',
                pesValue2: 'NULL',
                fileType: 'NULL',
                tabsInfo: {
                    tabsArr: [
                        {'tabTitle': '基本'},
                        {'tabTitle': '日志'}
                    ],
                    currenIndex: 0
                },
                isHaveFile: false,
                taskStatusText: null,
                testTaskLog: [],
                disabledFlag: false,
                userPostId: Cookies.get('company') ? JSON.parse(Cookies.get('company')).post_id : 3,

                testfileData: {},
                //引导数据
                guideSteps: {
                    step4: '',
                    step5: ''
                },
                needGuideData: null
            };
        },
        components: {
            mainNative: mainNative,
            filebrowse: filebrowse
        },
        mounted() {
            //获取基础数据
            this.initGuide();
            // this.userInfos();
        },
        methods: {
            // 初始化获取是否引导
            async initGuide() {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_bidindex;
                this.$axios.get(url).then(({data}) => {
                    if (data.guide) {
                        let guide = data.guide;
                        _this.needGuideData = true;
                        Promise.all([_this.getTestTaskInfos(), _this.getTestTaskBidInfos()]).then(res => {
                            _this.$guide().exit();
                            setTimeout(() => {
                                _this.$guide().setOptions(this.$CONSTANT.guideOptions)
                                    .addSteps([
                                        {
                                            element: document.querySelector('.detailsList'),
                                            intro: this.$lau.guide_words.k34,
                                            position: 'right',
                                            disableInteraction: '1',
                                            start: '4',
                                            total: '7'
                                        },
                                        {
                                            element: document.querySelector('.zhizuo'),
                                            intro: this.$lau.guide_words.k35,
                                            position: 'right',
                                            disableInteraction: '1',
                                            start: '5',
                                            total: '7'
                                        },
                                        {
                                            element: document.querySelector('.imgModel'),
                                            intro: this.$lau.guide_words.k36,
                                            position: 'right',
                                            disableInteraction: '1',
                                            start: '6',
                                            total: '7'
                                        },
                                        {
                                            element: document.querySelector('.feenbackModel'),
                                            intro: this.$lau.guide_words.k37,
                                            position: 'right',
                                            disableInteraction: '1',
                                            start: '7',
                                            total: '7'
                                        }
                                    ])
                                    .start()
                                    .onskip(function () {
                                        _this.$bus.emit('changeMenu', 2, 0);
                                        _this.needGuideData = '';
                                        _this.$router.push({path: "/artsquare/home"});
                                    })
                                    .oncomplete(function () {
                                        //流程结束
                                        _this.$bus.emit('changeMenu', 2, 0);
                                        _this.$router.push({path: "/artsquare/home"});
                                        _this.$guide().exit();
                                    });
                            }, 200);
                        });
                    } else {
                        _this.init();
                    }
                });
            },

            // 返回报名列表
            backToList() {
                this.$router.back(-1);
            },

            //获取基础数据
            async init() {
                let TestID = this.$route.query.TestID;    //测试任务ID
                let enteredID = this.$route.query.enteredID;  //报名ID
                if (!TestID || !enteredID) {
                    this.$router.back(-1);
                } else {
                    this.getTestTaskInfos();
                    this.getcompanyList();
                    this.getTestTaskBidInfos();
                    this.getTestTaskLogList();
                }
            },
            async getTestTaskInfos() {
                return new Promise((resolve, reject) => {
                    let TestID = this.$route.query.TestID;    //测试任务ID
                    api.getTestinfo({
                        id: TestID,
                        needGuideData: this.needGuideData ? true : null
                    }).then(TestTaskInfo => {
                        if (TestTaskInfo.data.err_code == 0) {
                            let data = TestTaskInfo.data;
                            //判断当前任务是否已经被删除  被删除不可设置负责人和实施人
                            if (data.is_delete === 1) {
                                this.disabledFlag = true;
                            } else {
                                //判断当前用户是不是成员 成员不可设置负责人和实施人
                                if (this.userPostId === 3) {
                                    this.disabledFlag = true;
                                } else {
                                    //bid_end_days < 0 表示报名已截止          end_days > 0 表示交稿未截止 <0表示截止
                                    if (data.bid_end_days < 0 && data.end_days > 0) {
                                        // alert(data.status)
                                        if (!data.test_price){
                                            if (data.status == 4){
                                                this.disabledFlag = true;
                                            } else {
                                                this.disabledFlag = false;
                                            }
                                        } else {
                                            this.disabledFlag = false;
                                        }
                                        // if (data.status == 1 || data.status == 4) {
                                        //     this.disabledFlag = false;
                                        // } else {
                                        //     this.disabledFlag = true;
                                        // }
                                    } else {
                                        this.disabledFlag = true;
                                    }
                                }
                            }
                            if (data.file_require && (data.file_require.indexOf('spec') > 0 || data.file_require.indexOf('format') > 0)) {
                                data.file_require = JSON.parse(data.file_require);
                            } else {
                                //兼容老数据 不然页面加载不出来 报错
                                data.file_require = false;
                            }
                            if (data.file) {
                                data.file = JSON.parse(data.file);
                            }
                            this.detailsData = TestTaskInfo.data;
                            resolve();
                        } else {
                            this.$Message.error(TestTaskInfo.data.err_message);
                            reject();
                        }
                    });
                });
            },
            async getcompanyList() {
                let userInfos = JSON.parse(Cookies.get('company'));
                const companyUserList = await api.getcompanyUserList({company_id: userInfos.company_id});
                if (companyUserList.data.err_code == 0) {
                    this.personnel = companyUserList.data.data || [];
                } else {
                    this.$Message.error(companyUserList.data.err_message);
                }
            },
            async getTestTaskBidInfos() {
                return new Promise((resolve, reject) => {
                    let enteredID = this.$route.query.enteredID;  //报名ID
                    let type = this.$route.query.type;
                    api.getTestTaskBidinfos({
                        bid_id: enteredID,
                        type: type,
                        needGuideData: this.needGuideData ? true : null
                    }).then(TestTaskBidInfos => {
                        if (TestTaskBidInfos.data.err_code == 0) {
                            // if (TestTaskBidInfos.data.data.status == 5 || TestTaskBidInfos.data.data.status == 2 || TestTaskBidInfos.data.data.status == 3) {
                            //     this.disabledFlag = true;
                            // }
                            this.pesValue1 = TestTaskBidInfos.data.data.execute_member;
                            this.pesValue2 = TestTaskBidInfos.data.data.leader_member;

                            //验证状态
                            this.CheckStatus(TestTaskBidInfos.data.data.status);

                            let isData = TestTaskBidInfos.data.data.upload;
                            TestTaskBidInfos.data.data.is_test = 1;

                            if (isData != false) {
                                if (isData.file) {
                                    this.isHaveFile = false;
                                    isData.leader_name = TestTaskBidInfos.data.data.leader_name;
                                    isData.leader_member = TestTaskBidInfos.data.data.leader_member;
                                    isData.isTestTask = true;
                                    this.testfileData = isData;
                                } else {
                                    this.isHaveFile = true;
                                }
                            } else {
                                this.isHaveFile = true;
                            }
                            resolve();
                        } else {
                            this.$Message.error(TestTaskBidInfos.data.err_message);
                            reject();
                        }
                    });

                });

            },
            async getTestTaskLogList() {
                let enteredID = this.$route.query.enteredID;  //报名ID
                const TestTaskLog = await api.getTestTaskLog({bid_id: enteredID});
                if (TestTaskLog.data.err_code == 0) {
                    this.testTaskLog = [...TestTaskLog.data.data];
                } else {
                    this.$Message.error(TestTaskLog.data.err_message);
                }
            },

            //改变实施人员
            async changeUserName() {
                let enteredID = this.$route.query.enteredID;  //报名ID
                let data = {
                    bid: enteredID,
                    execute_user: this.pesValue1,
                    leader_user: this.pesValue2
                };
                const setRelatedUser = await api.setRelatedUser(data);
                if (setRelatedUser.data.err_code == 0) {
                    this.$Message.success('设置成功！');
                    this.getTestTaskLogList();
                }
            },
            //获取当前用户post
            // userInfos() {
            // let Infos = JSON.parse(Cookies.get('company'));
            // this.userPostId = Infos.post_id;
            // switch (Infos.post_id) {
            //     case '1':
            //         this.userPost.postName = '经理';
            //         this.userPost.postId = '1';
            //         this.disabledFlag = false;
            //         break;
            //     case '2':
            //         this.userPost.postName = '组长';
            //         this.userPost.postId = '2';
            //         this.disabledFlag = false;
            //         break;
            //     case '3':
            //         this.userPost.postName = '成员';
            //         this.userPost.postId = '3';
            //         this.disabledFlag = true;
            //         break;
            //     case '99999':
            //         this.userPost.postName = '管理员';
            //         this.userPost.postId = '99999';
            //         this.disabledFlag = false;
            //         break;
            // }
            // },
            //状态验证
            CheckStatus(status) {
                switch (status) {
                    case 0 :
                        this.taskStatusText = '制作上传稿件';
                        this.okStatua = 'doing';
                        break;
                    case 1 :
                        this.taskStatusText = '中标';
                        this.okStatua = 'ok';
                        break;
                    case 2 :
                        this.taskStatusText = '落标';
                        this.okStatua = 'no';
                        break;
                    case 3 :
                        this.taskStatusText = '招标失败';
                        this.okStatua = 'no';
                        break;
                    case 4 :
                        this.taskStatusText = '加入公司库';
                        this.okStatua = 'join';
                        break;
                    case 5 :
                        this.taskStatusText = '已报价';
                        this.okStatua = 'doing';
                        // this.disabledFlag = true;
                        break;
                    case 6 :
                        this.taskStatusText = '等待选稿';
                        this.okStatua = 'doing';
                        break;
                    case 7 :
                        this.taskStatusText = '报价未通过';
                        this.okStatua = 'no';
                        // this.disabledFlag = true;
                        break;
                    case 8 :
                        this.taskStatusText = '待确认收款';
                        this.okStatua = 'ok';
                        break;
                    case 9 :
                        this.taskStatusText = '招标完成';
                        this.okStatua = 'ok';
                        break;
                }
            }
        },
        filters: {
            titleSubstring: function (val) {
                if (val) {
                    return val.length > 10 ? val.substring(0, 10) + '...' : val;
                }
            },
            substring: function (val) {
                if (val) {
                    return val.length > 30 ? '...' + val.substring(val.length, val.length / 2) : val;
                } else {
                    return null;
                }
            },
            timeCover: function (val) {
                if (val) {
                    let day = new Date(val * 1000);
                    let year = day.getFullYear();
                    let month = (day.getMonth() + 1) < 10 ? '0' + (day.getMonth() + 1) : (day.getMonth() + 1);
                    let date = day.getDate() < 10 ? '0' + day.getDate() : day.getDate();
                    return year + '-' + month + '-' + date || '00:00:00';
                } else {
                    return '00:00:00';
                }

            }
        }
    };
</script>
<style lang="less" scoped>
    .appDetails {
        height: 800px;

        .second-navigation-bar {
            margin-bottom: 20px;
            overflow: hidden;

            > a {
                float: left;
                font-size: 13px;
                color: @black_2;
                padding: 0 2px;
                border-bottom: 2px solid @baseboard;

                &.second-nav-title {
                    border-bottom: 2px solid @base;
                    font-size: 14px;
                    margin-top: -1px;
                }

                &:hover {
                    border-bottom: 2px solid @base;
                    -webkit-transition: border-bottom-color 0.2s;
                    -moz-transition: border-bottom-color 0.2s;
                    -ms-transition: border-bottom-color 0.2s;
                    -o-transition: border-bottom-color 0.2s;
                    transition: border-bottom-color 0.2s;
                }
            }

            > .icon {
                float: left;
                margin: 0 5px;
                font-size: 18px;
                color: @black_2;
            }
        }

        .contener {
            height: 100%;
            display: flex;
            justify-content: space-between;
            /*overflow: hidden;*/

            .detailsList {
                min-width: 335px;
                .base-card;
                float: left;
                width: 24%;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);

                .detailHead {
                    height: 30px;
                    line-height: 30px;

                    .projectName {
                        font-size: 16px;
                        margin-right: 10px;
                    }

                    .projectStatus {
                        color: #fff;
                        padding: 3px 10px;
                        border-radius: 10px;
                        margin-right: 10px;

                        &.delSty {
                            background: #e0e0e0;
                        }

                        &.doing {
                            background: #82c7fd;
                        }

                        &.ok {
                            background: @base;
                        }

                        &.no {
                            background: #ff9283;
                        }

                        &.join {
                            background: #FF9800;
                        }
                    }

                    .projectStage {
                        border: 1px solid @base;
                        padding: 2px 10px;
                        border-radius: 3px;
                        color: @base;
                    }

                    .hrartIco {
                        float: right;
                        color: #de1111;
                        line-height: 30px;
                        font-size: 18px;
                    }
                }

                .Tabs {
                    display: flex;
                    margin: 20px 0px;
                    border: 1px solid #f3f3f3;
                    border-radius: 3px;
                    overflow: hidden;

                    span {
                        display: inline-block;
                        width: 50%;
                        color: #afafaf;
                        text-align: center;
                        padding: 7px 0;
                        cursor: pointer;
                        font-size: 13px;

                        &:first-child {
                            border-right: 1px solid #f3f3f3;
                        }

                        &.Tabchecked {
                            color: #fff;
                            background: #3cd2b4;
                        }
                    }
                }

                dd {
                    line-height: 45px;
                    // border-bottom: 1px solid @gray;
                    span {
                        float: left;
                        color: @black_3;
                        font-size: @fs13;
                    }

                    em {
                        float: right;
                        font-style: normal;
                        font-size: @fs14;
                        color: #a0a0a0;

                        a {
                            color: @base;

                            &:hover {
                                text-decoration-line: underline;
                            }
                        }
                    }

                    .num {
                        color: @base;
                        font-size: 15px;
                    }

                    .file {
                        color: @black_3;
                    }
                }

                dt {
                    margin-top: 10px;
                    color: @black_3;
                    font-size: @fs13;
                }

                .description {
                    background: @white;
                    border: 1px solid @black_4;
                    border-radius: 5px;
                    padding: 10px;
                    color: @black_3;
                    max-height: 200px;
                    overflow-y: auto;
                    line-height: 26px;
                }

                .downFile {
                    cursor: pointer;
                }

                .testLogList {
                    height: 85%;
                    overflow: auto;

                    li {
                        padding: 10px 0;
                        display: flex;

                        .timeLog {
                            color: #b1b1b1;
                            font-size: 13px;
                            width: 22%;
                        }

                        .textLog {
                            color: @base;
                            margin-left: 20px;
                            font-size: 12px;
                            width: 70%;
                            line-height: 20px;
                        }
                    }
                }
            }

            .bottomDivSty {
                float: right;
                width: 75%;
                height: 100%;
                flex-direction: column;
                justify-content: space-between;
                padding: 0;

                .detailsComponent {
                    border-radius: 3px;
                    /*overflow: hidden;*/
                    height: 100%;
                }

                .footerStatus {
                    height: 14%;
                    border: 1px solid red;
                }
            }
        }

    }


</style>
