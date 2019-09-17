<template>
    <Layout>
        <Sider class="memberType">
            <membertype :title="title" :number="number" :deptList='deptList' :dutyList='dutyList' @openDept="deptData"
                        @openDuty="dutyData" @deptEdit="editDept" @deptDel="delDept" @dutyDel="delDuty"
                        @dutyEdit="editDuty">
                <div slot="addDept">
                    <div class="addDept" @click="addDept()">
                        <i class="icon iconfonts icon-jia" style="vertical-align:middle;"></i>
                        <span style="vertical-align:middle;">{{$t('memberAauthority.power_addDepartment')}}</span>
                    </div>
                </div>
                <div slot="addDuty">
                    <div class="addDept" @click="addDuty()">
                        <i class="icon iconfonts icon-jia" style="vertical-align:middle;"></i>
                        <span style="vertical-align:middle;">{{$t('memberAauthority.power_addFunction')}}</span>
                    </div>
                </div>
            </membertype>
        </Sider>
        <Layout>
            <div class="search" v-show="tabsInfo.tabIndex == 0">
                <div class="searchBox" style="">
                    <input type="password" style="display:none">
                    <Input v-model="searchValue" icon="ios-search" style="width:250px;" :placeholder="$t('memberAauthority.power_inputPlaceholder')"
                           @keyup.enter.native="searchList"></Input>
                </div>
                <!-- 暂隐藏加入公司申请按钮 2019-03-04-->
                <!--<Button size="large" type="primary" style="width: 130px;position: relative" @click="ApplyJionCompanyInfo.flag = true"><i class="iconfonts icon-ymy-chang-ren-copy"></i>&nbsp;&nbsp;加入公司申请-->
                    <!--<span class="basgeS" v-if="ApplyJionCompanyInfo.number > 0">{{ApplyJionCompanyInfo.number}}</span>-->
                <!--</Button>-->
                <Button size="large" type="primary" @click.native="clickInviteMember">
                    <i class="iconfonts icon-ymy-chang-ren-copy"></i>&nbsp;&nbsp;{{$t('memberAauthority.power_addMember')}}
                </Button>
            </div>
            <Content>
                <memberlist ref="list" @choiseRow="selectMember" :deptList='deptList'></memberlist>
                <memberinvite @test="deptData" ref="invite"></memberinvite>
                <membermessage ref="message" :param="param"
                               @revised='editMember(param.id,param.realname,param.department_id,param.post_id,param.password)'
                               @removed='delMember(param.id)' :editStatus="true"></membermessage>
            </Content>
        </Layout>

        <Modal v-model="editModel" :title="deptStatus == 'add' ? $t('memberAauthority.power_newDepartment') : $t('memberAauthority.power_editDepartment')" @on-ok="ok(deptStatus)"
               @on-cancel="cancel">
            <Input v-model="deptName" :placeholder="$t('lang.lang_pleaseEnter') + $t('memberAauthority.power_departmentName')" style="width: 300px"></Input>
        </Modal>
        <Modal v-model="delModal" :title="$t('memberAauthority.power_confirmdelDepartment')" @on-ok="delOk" @on-cancel="cancel">
            <p>{{$t('memberAauthority.power_delTips')}}</p>
        </Modal>
        <Modal v-model="dutyModel" :title="dutyStatus == 'add' ? $t('memberAauthority.power_newFunction') : $t('memberAauthority.power_editFunction')" @on-ok="okDuty(dutyStatus)" @on-cancel="cancel">
            <Input v-model="dutyName" :placeholder="$t('memberAauthority.power_functionName')" style="width: 300px"></Input>
        </Modal>
        <Modal v-model="delDutyModal" :title="$t('memberAauthority.power_confirmdelFunc')" @on-ok="delDutyOk" @on-cancel="cancel">
            <p> {{$t('memberAauthority.power_funcDelTips')}}</p>
        </Modal>
        <Modal v-model="ApplyJionCompanyInfo.flag" :title="$t('memberAauthority.power_applicationAccession')" class="JionCompanySty" width="660"  :footerHide='true'>
            <p class="jionTips"><i>!</i> {{$t('memberAauthority.power_applicationTips')}}</p>
            <ul>
                <li v-for="item in  ApplyJionCompanyInfo.ApplyJionCompanyList">
                    <div class="PersionInfos">
                        <span><img :src="item.headimage">&nbsp;<em>{{item.realname}} </em></span>
                        <span class="colorGray">{{item.apply_time}}</span>
                        <span class="colorGray">{{$t('memberAauthority.power_sendApplication')}}</span>
                        <span style="width: 40px" :class="{'confirmed':item.type==0,'no':item.type==2||item.type==3,'ok':item.type==1,'colorGray':item.type==5}">{{item.type | joinStatus}}</span>
                    </div>
                    <div class="statusBtn">
                        <button v-if="item.type == 0" class="noBtn" @click="joinCompanyFun(item.id,'2')">{{$t('memberAauthority.power_refuse')}}</button>
                        <button v-if="item.type == 0" class="okBtn" @click="joinCompanyFun(item.id,'1')">{{$t('memberAauthority.power_agree')}}</button>
                        <button v-if="item.type == 2 ||item.type == 3 " class="agianBtn" @click="joinCompanyFun(item.id,'1')">{{$t('memberAauthority.power_agreeAgain')}}</button>
                    </div>
                </li>
            </ul>
        </Modal>
    </Layout>
</template>

<script>
    import Cookies from 'js-cookie';
    import {mapGetters, mapState} from 'vuex';
    import memberlist from '../mmComponents/memberList.vue';
    import membertype from '../mmComponents/memberType.vue';
    import memberinvite from '../mmComponents/memberInvite.vue';
    import membermessage from '../mmComponents/memberMessage.vue';
    import md5 from "md5";

    export default {
        components: {
            memberlist,
            membertype,
            memberinvite,
            membermessage
        },
        data() {
            return {
                ApplyJionCompanyInfo: {
                    ApplyJionCompanyList: [],
                    flag: false,
                    number: 0
                },
                searchValue: '',
                tabsType: 'member',
                num: 1,
                showAddNewTodo: false,
                newToDoItemValue: '',
                memberinfolist: [],
                interiormemberinfolist: [],
                editModel: false,
                deptStatus: 'add',
                deptName: '',
                deptId: 0,
                delModal: false,
                delDutyModal: false,
                dutyModel: false,
                dutyStatus: 'add',
                dutyId: 0,
                dutyName: '',
                param: {},
                title: JSON.parse(Cookies.get('company')).company_name,
                number: JSON.parse(Cookies.get('company')).member_count.toString(),
                tabsInfo: {
                    tabs: [
                        {tab: i18n.t('memberAauthority.power_memberManagement'), name: 'member'},
                        {tab: i18n.t('memberAauthority.power_permissionSet'), name: 'auth'},
                        {tab: i18n.t('memberAauthority.power_teamCapability'), name: 'auth'},
                    ],
                    tabIndex: 0
                },
                editPassWord: '123456',
                topTabId: null,
            };
        },
        mounted() {
            this.getInitInfo();
            this.deptListData();
            this.dutyListData();
            this.getApplyJionCompanyList();
            this.memberBubbble();
        },
        computed: {
            ...mapState({
                memberMgt(data) {
                    return data.app.memberMgt;
                },
                roleMgt(data) {
                    return data.app.roleMgt;
                }
            }),
            ...mapGetters({
                deptList: 'getDeptList',
                dutyList: 'getDutyList',
                postList: 'getPostList'
            }),
            getCompanyMembers() {
                return this.$store.state.companyMembers;
            }
        },
        methods: {
            getMatchedStatus() {
                for (let index in this.tabsInfo.tabs) {
                    if (index == 1) {
                        this.topTabId = index;
                        return this.topTabId;
                    }
                }
            },
            //  成员管理气泡引导
            bubble() {
                let index = this.getMatchedStatus();
                let text = this.$lau.bubble.memberManageGuide;
                if (index == 1) {
                    let guideOptions = [
                        {
                            id: 'memberTabID',
                            position: 'right-top',
                            title: text[0].title,
                            content: text[0].content,
                            relative: 'body',
                            subClassName: 'ivu-tabs-bar',
                        },
                        {
                            id: 'memberListId',
                            position: 'bottom',
                            title: text[1].title,
                            content: text[1].content,
                            subClassName: 'ivu-table-row',
                            relative: 'body',
                        },
                        {
                            id: 'tbsID' + index,
                            position: 'bottom',
                            title: text[2].title,
                            content: text[2].content,
                            relative: 'body',
                        }
                    ];
                    setTimeout(() => {
                        this.$bubble(guideOptions);
                    }, 200);
                }
            },
            //
            memberBubbble() {
                this.$axios.get(this.GLOBAL.baseRouter + this.$GLOBALAPI.company_team_setindex).then(res => res.data).then(res => {
                    if (res.guide === 'teamSet') {
                        this.bubble();
                    }
                });
            },
            // 成员权限管理引导
            authorityBubble() {
                let text = this.$lau.bubble.memberAuthority;
                let guideOptions = [
                    // 隐藏气泡引导===>权限设置功能引导 》去掉管理员不能编辑这个功能引导
                    // {
                    //     id: 'activedID',
                    //     position: 'right-top',
                    //     title: text[0].title,
                    //     content: text[0].content,
                    //     relative:'body',
                    //     subClassName:'actived',
                    // },
                    {
                        id: 'authorityID',
                        position: 'left-top',
                        title: text[1].title,
                        content: text[1].content,
                        // subClassName:'ivu-table-row',
                        relative: 'body',
                    },
                    {
                        id: 'teamTreeID',
                        position: 'left-top',
                        title: text[2].title,
                        content: text[2].content,
                        relative: 'body',
                    }
                ];
                setTimeout(() => {
                    this.$bubble(guideOptions);
                }, 200);
            },
            getInitInfo() {
                this.$axios.get(this.GLOBAL.baseRouter + this.$GLOBALAPI.system_info).then(res => res.data).then(res => {
                    //公司改名后 重新设置Cookie
                    this.title = res.company.company_name;
                    Cookies.set('company', res.company);
                    this.number = res.company.member_count.toString();
                });
            },
            searchList() {
                this.$refs.list.deptFData(this.searchValue);
            },

            /**
             * 获取部门列表
             */
            deptListData() {
                let data = {company_id: JSON.parse(Cookies.get('company')).company_id};
                this.$store.dispatch('fetchDeptList', data);
            },

            /**
             * 获取职位列表
             */
            dutyListData() {
                let data = {
                    company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
                };
                this.$store.dispatch('fetchDutyList', data);
            },

            /**
             * 根据成员部门获取列表
             */
            deptData(index, comId, deptId) {
                this.$refs.list.deptData(comId, deptId);
                sessionStorage.memberStyle = 'dept';
                sessionStorage.comId = comId;
                sessionStorage.deptId = deptId;
            },

            /**
             * 切换成员类型数据页面消息
             */
            dutyData(index, comId, dutyId) {
                this.$refs.list.dutyData(comId, dutyId);
                sessionStorage.memberStyle = 'duty';
                sessionStorage.comId = comId;
                sessionStorage.dutyId = dutyId;
            },
            // 切换职位类型获取对应数据
            authData(index, postId, postList) {
                sessionStorage.postId = postId;
                this.$bus.emit("changeAuth", postId, postList);
            },
            addDept() {
                this.deptStatus = 'add';
                this.editModel = true;
            },
            editDept(id, name) {
                this.deptStatus = 'edit';
                this.editModel = true;
                this.deptId = id;
                this.deptName = name;
            },
            ok(name) {
                if (name == 'add') {
                    let data = {
                        company_id: JSON.parse(Cookies.get('company')).company_id, // company_id1
                        name: this.deptName
                    };
                    this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_add, data).then(res => res.data).then(res => {
                        if (res.err_code == 0) {
                            this.deptListData();
                            this.deptName = '';
                            this.$Message.success(i18n.t('memberAauthority.power_successCreateDepartment'));
                        } else {
                            this.$Message.error(i18n.t('memberAauthority.power_failCreateDepartment'));
                        }
                    });
                } else if (name == 'edit') {
                    let data = {
                        id: this.deptId,
                        name: this.deptName
                    };
                    this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_update, data).then(res => res.data).then(res => {
                        if (res.err_code == 0) {
                            this.deptListData();
                            this.deptName = '';
                            this.$Message.success(i18n.t('memberAauthority.power_successEditDepartment'));
                        } else {
                            this.$Message.error(i18n.t('memberAauthority.power_failEditDepartment'));
                        }
                    });
                }
            },
            cancel() {
                this.deptName = '';
            },

            /**
             * 删除部门
             */
            delDept(id) {
                this.delModal = true;
                this.deptId = id;
            },
            delOk() {
                let data = {id: this.deptId};
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_delete, data).then(res => res.data).then(res => {
                    if (res.err_code == 0) {
                        this.deptListData();
                        this.$Message.success(i18n.t('memberAauthority.power_successDelDepartment'));
                        window.location.reload();
                    } else {
                        this.$Message.error(i18n.t('memberAauthority.power_failDelDepartment'));
                    }
                });
            },
            delDuty(id) {
                this.delDutyModal = true;
                this.dutyId = id;
            },
            delDutyOk() {
                let data = {id: this.dutyId};
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_postdelete, data).then(res => res.data).then(res => {
                    if (res.err_code == 0) {
                        this.dutyListData();
                        this.$Message.success(i18n.t('memberAauthority.power_successDelFunc'));
                    } else {
                        this.$Message.error(i18n.t('memberAauthority.power_failDelFunc'));
                    }
                });
            },
            addDuty() {
                this.dutyStatus = 'add';
                this.dutyModel = true;
            },
            editDuty(id, name) {
                this.dutyStatus = 'edit';
                this.dutyModel = true;
                this.dutyId = id;
                this.dutyName = name;
            },
            okDuty(name) {
                if (name == 'add') {
                    let data = {
                        company_id: JSON.parse(Cookies.get('company')).company_id, // company_id1
                        name: this.dutyName
                    };
                    this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_postadd, data).then(res => res.data).then(res => {
                        if (res.err_code == 0) {
                            this.dutyListData();
                            this.dutyName = '';
                            this.$Message.success(i18n.t('memberAauthority.power_successCreateFunc'));
                        } else {
                            this.$Message.error(i18n.t('memberAauthority.power_failCreateFunc'));
                        }
                    });
                } else if (name == 'edit') {
                    let data = {
                        id: this.dutyId,
                        name: this.dutyName
                    };
                    this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_postupdate, data).then(res => res.data).then(res => {
                        if (res.err_code == 0) {
                            this.dutyListData();
                            this.$Message.success(i18n.t('memberAauthority.power_successEditFunc'));
                        } else {
                            this.$Message.error(i18n.t('memberAauthority.power_failEditFunc'));
                        }
                    });
                }
            },

            /**
             * 暂时，会移动到用户控制组件中
             */
            clickInviteMember() {this.$refs.invite.isShowPage(true);},
            selectMember(index) {
                let data = {id: index.id};
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_member_info, data).then(res => res.data).then(res => {
                    if (res.err_code == 0) {
                        this.param = res;
                        this.param.password = this.editPassWord;
                        this.param.post_id = Number(this.param.post_id);
                        this.param.department_id = Number(this.param.department_id);
                        this.$nextTick(function () {
                            this.$refs.message.isShowPage(true);
                        });
                    }
                });
            },

            /**
             * 修改成员信息
             * id 成员id
             * rname 成员备注名
             * did 部门id
             * pid 职位id
             */
            editMember(id, rname, did, pid, pwd) {
                let _this = this;
                if (pwd == "") {
                    _this.$Message.error(i18n.t('memberAauthority.power_emptyErrorPrompt'));
                } else if (pwd.length < 6) {
                    _this.$Message.error(i18n.t('memberAauthority.power_lengthErrorPrompt'));
                } else if (pwd.indexOf(" ") >= 0) {
                    _this.$Message.error(i18n.t('memberAauthority.power_blankErrorPrompt'));
                } else {
                    _this.$axios.get(_this.GLOBAL.baseRouter + _this.$GLOBALAPI.system_get_public_secret_key).then(res => res.data).then(res => {
                        if (res.err_code == 0) {
                            let encrypt = new JSEncrypt(); // 新建JSEncrypt对象
                            encrypt.setPublicKey(res.public_key);
                            let data = {
                                id: id,
                                realname: rname,
                                department_id: did,
                                post_id: pid,
                                password: pwd,
                            };
                            data.password = encrypt.encrypt(md5(md5(data.password)));
                            let getData = function () {
                                _this.$axios.post(_this.GLOBAL.baseRouter + _this.$GLOBALAPI.task_member_update, data).then(res => res.data).then(res => {
                                    if (res.err_code == 0) {
                                        _this.$Message.success(i18n.t('memberAauthority.power_modifiedSuccess'));
                                        //刷新当前表格
                                        if (sessionStorage.memberStyle == 'dept') {
                                            _this.$refs.list.deptData(sessionStorage.comId, sessionStorage.deptId);
                                        } else if (sessionStorage.memberStyle == 'duty') {
                                            _this.$refs.list.dutyData(sessionStorage.comId, sessionStorage.dutyId);
                                        }
                                        //关闭弹窗
                                    }
                                    if (sessionStorage.memberStyle == 'dept') {
                                        _this.deptListData();
                                        _this.$refs.list.deptData(sessionStorage.comId, sessionStorage.deptId);
                                    } else if (sessionStorage.memberStyle == 'duty') {
                                        _this.dutyListData();
                                        _this.$refs.list.dutyData(sessionStorage.comId, sessionStorage.dutyId);
                                    }
                                    _this.$refs.message.isShowPage(false);
                                });
                            };
                            getData();
                        }
                    });
                }
            },

            /**
             * 移除成员
             */
            delMember(id) {
                this.$Modal.confirm({
                    title: i18n.t('memberAauthority.power_removeMembers'),
                    content: '<p>是否确定永久的移除改成员？</p>',
                    okText: i18n.t('memberAauthority.power_yes'),
                    cancelText: i18n.t('memberAauthority.power_no'),
                    onOk: () => {
                        let data = {
                            id: id
                        };
                        this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_member_delete, data)
                            .then(res => res.data)
                            .then(res => {
                                if (res.err_code == 0) {
                                    this.deptListData();
                                    this.dutyListData();
                                    this.$Message.success(i18n.t('memberAauthority.power_removeSuccess'));
                                    this.getInitInfo();
                                    //刷新当前表格
                                    if (sessionStorage.memberStyle == 'dept') {
                                        this.$refs.list.deptData(sessionStorage.comId, sessionStorage.deptId);

                                    } else if (sessionStorage.memberStyle == 'duty') {
                                        this.$refs.list.dutyData(sessionStorage.comId, sessionStorage.dutyId);
                                    }
                                    //关闭弹窗
                                    this.$refs.message.isShowPage(false);
                                }
                            });
                    }
                });
            },
            //申请加入公司数据列表
            getApplyJionCompanyList() {
                this.$axios.post(this.GLOBAL.baseRouter + this.$GLOBALAPI.task_apply_list).then((res) => {
                    if (res.data.err_code == 0) {
                        let num = 0;
                        this.ApplyJionCompanyInfo.ApplyJionCompanyList = res.data.data;
                        res.data.data.map(function (creent, index) {
                            if (creent.type == 0) {
                                num++;
                            }
                        });
                        this.ApplyJionCompanyInfo.number = num;
                    } else {
                        this.$Message.error(res.data.err_message);
                    }
                });
            },
        },
        watch: {
            getCompanyMembers(val) {
                if (val) {
                    this.number = val;
                }
            }
        },
        filters: {
            joinStatus(val){
                switch (val){
                    case '0':return i18n.t('memberAauthority.power_toBeConfirmed');
                        break;
                    case '1':return i18n.t('memberAauthority.power_agree');
                        break;
                    case '2':return i18n.t('memberAauthority.power_refuse');
                        break;
                    case '3':return i18n.t('memberAauthority.power_refuse');
                        break;
                    case '5':return i18n.t('memberAauthority.power_failure');
                }
            }
        },
    };
</script>

<style lang="less">
    .membermanager {
        background: @baseboard;
        .memberType {
            .base-card;
            padding: 0px;
        }
        .ivu-tabs-nav-wrap {
            height: 50px;
            line-height: 40px;
            .ivu-tabs-nav {
                border-bottom: 2px solid #dcdedd;
                .ivu-tabs-ink-bar {
                    background: transparent;
                }
                .ivu-tabs-tab {
                    font-size: 16px;
                }
                .ivu-tabs-tab-active {
                    color: #4ac4b5;
                    border-bottom: 2px solid #4ac4b5;
                }
            }
        }
        .ivu-tabs-content-animated {
            min-height: 400px !important;
        }
        .ivu-tabs-tabpane {
            min-height: 400px !important;
            overflow: auto;
        }
        .ivu-layout {
            background: transparent !important;
        }
        .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-wrap {
            height: 34px;
            line-height: 17px;
            margin-top: 0;
        }
        .ivu-table-tbody {
            font-size: 13px;
        }
        .ivu-table td.demo-table-info-column:nth-of-type(3) {
            font-size: 14px;
        }
        .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
            margin-right: 0;
            border: none;
            width: 100px;
            text-align: center;
            font-size: 13px;
        }

    }

    //申请加入公司 STY
    .JionCompanySty {
        .ivu-modal-body {
            position: relative !important;
        }
        .jionTips {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40px;
            line-height: 40px;
            padding-left: 40px;
            background: #f5ebd8;
            color: #efbe58;
            font-size: 13px;
            i {
                font-style: normal;
                display: inline-block;
                width: 15px;
                height: 15px;
                line-height: 13px;
                border: 1px solid #efbe58;
                border-radius: 100%;
                text-align: center;
            }
        }
        ul {
            margin-top: 30px;
            li {
                border-bottom: 1px dashed #ccc;
                padding: 10px 0;
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                .PersionInfos {
                    width: 75%;
                    display: flex;
                    justify-content: space-between;
                    span {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        &:first-child {
                            /*background: red;*/
                            min-width: 70px;
                            max-width: 100px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            justify-content: start;
                            em {
                                font-style: normal
                            }
                            img {
                                width: 25px;
                                height: 25px;
                                border-radius: 100%;
                            }
                        }
                    }
                    .colorGray {
                        color: #b7b5b5;
                    }
                    .confirmed {
                        color: #79bbfb;
                    }
                    .ok {
                        color: @base;
                    }
                    .no {
                        color: #f74f57;
                    }
                }
                .statusBtn {
                    width: 20%;
                    text-align: right;
                    button {
                        border: 1px solid transparent;
                        background: @white;
                        padding: 2px 10px;
                        border-radius: 3px;
                        outline: none;
                        cursor: pointer;
                        &.noBtn {
                            border-color: #f74f57 !important;
                            color: #f74f57;
                        }
                        &.okBtn {
                            background: @base;
                            border-color: @base !important;
                            color: @white;
                        }
                        &.agianBtn {
                            border-color: @base !important;
                            color: @base;
                        }
                    }
                }
            }
        }
    }
</style>
