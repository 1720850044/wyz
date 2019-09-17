<!--
    团队->成员管理
-->
<template>
    <div class="membermanager">
        <routerlink>
            <ul slot="linkList" class="linkTab">
                <router-link tag="li" to="/epibol/memberManager/menberManagerIndex">成员管理</router-link>
                <router-link tag="li" to="/epibol/memberManager/permissionSetting">权限设置</router-link>
                <router-link tag="li" to="/epibol/memberManager/teamCapability">团队能力</router-link>
            </ul>
        </routerlink>
        <router-view></router-view>


        <!--<nav-tav v-if="tabsInfo" :tabList="tabsInfo.tabs" @changeNav="changeNav" ></nav-tav>-->

        <!--<div>-->
            <!--<template v-if="tabsInfo.tabIndex == 0">-->
                <!--<Layout>-->
                    <!--<Sider class="memberType">-->
                        <!--<membertype :title="title" :number="number" :deptList='deptList' :dutyList='dutyList' @openDept="deptData" @openDuty="dutyData" @deptEdit="editDept" @deptDel="delDept" @dutyDel="delDuty" @dutyEdit="editDuty">-->
                            <!--<div slot="addDept">-->
                                <!--<div class="addDept" @click="addDept()">-->
                                    <!--<i class="icon iconfonts icon-jia" style="vertical-align:middle;"></i>-->
                                    <!--<span  style="vertical-align:middle;" >添加部门</span>-->
                                <!--</div>-->
                            <!--</div>-->
                            <!--<div slot="addDuty">-->
                                <!--<div class="addDept" @click="addDuty()">-->
                                    <!--<i class="icon iconfonts icon-jia" style="vertical-align:middle;"></i>-->
                                    <!--<span  style="vertical-align:middle;" >添加职能</span>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</membertype>-->
                    <!--</Sider>-->
                    <!--<Layout>-->
                        <!--<div class="search" v-show="tabsInfo.tabIndex == 0">-->
                            <!--<div class="searchBox" style="">-->
                                <!--<input type="password" style="display:none">-->
                                <!--<Input v-model="searchValue" icon="ios-search" style="width:250px;" placeholder="真实姓名/手机名/邮箱" @keyup.enter.native="searchList"></Input>-->
                            <!--</div>-->
                            <!--&lt;!&ndash; 暂隐藏加入公司申请按钮 2019-03-04&ndash;&gt;-->
                            <!--&lt;!&ndash; <Button size="large" type="primary" style="width: 130px;position: relative" @click="ApplyJionCompanyInfo.flag = true"><i class="iconfonts icon-ymy-chang-ren-copy"></i>&nbsp;&nbsp;加入公司申请-->
                                <!--<span class="basgeS" v-if="ApplyJionCompanyInfo.number > 0">{{ApplyJionCompanyInfo.number}}</span>-->
                            <!--</Button> &ndash;&gt;-->
                            <!--<Button size="large" type="primary" @click.native="clickInviteMember"><i class="iconfonts icon-ymy-chang-ren-copy"></i>&nbsp;&nbsp;添加成员</Button>-->
                        <!--</div>-->
                        <!--<Content>-->
                            <!--<memberlist ref="list" @choiseRow="selectMember" :deptList='deptList'></memberlist>-->
                            <!--<memberinvite @test="deptData" ref="invite"></memberinvite>-->
                            <!--<membermessage ref="message" :param="param" @revised='editMember(param.id,param.realname,param.department_id,param.post_id,param.password)' @removed='delMember(param.id)' :editStatus="true"></membermessage>-->
                        <!--</Content>-->
                    <!--</Layout>-->
                <!--</Layout>-->
            <!--</template>-->


            <!--<template v-if="tabsInfo.tabIndex == 1">-->
                <!--<Layout>-->
                    <!--<Sider >-->
                        <!--<auth-type :title="title" :number="number" :postList="postList" :dutyList='dutyList' @openAuth="authData"></auth-type>-->
                    <!--</Sider>-->
                    <!--<Layout>-->
                        <!--<div class="search" v-show="tabsInfo.tabIndex == 0">-->
                            <!--<div class="searchBox" style="">-->
                                <!--<input type="password" style="display:none">-->
                                 <!--<Input class="search-input" icon="ios-search" placeholder="真实姓名/手机名/邮箱" v-model="searchValue" @on-click="searchList" size="small" style="width: 300px"></Input>-->
                                <!--&lt;!&ndash; <input class="search-input" type="search" v-model="searchValue" placeholder="真实姓名/手机名/邮箱" autocomplete="off">-->
                                <!--<Icon @click.native="searchList" type="search"></Icon> &ndash;&gt;-->
                            <!--</div>-->
                            <!--<Button size="large" type="primary" icon="person-add" @click.native="clickInviteMember">添加成员</Button>-->
                        <!--</div>-->
                        <!--<Content>-->
                            <!--<auth-message ref="authMesg" :tabs="authList"></auth-message>-->
                        <!--</Content>-->
                    <!--</Layout>-->
                <!--</Layout>-->
            <!--</template>-->



            <!--<template v-if="tabsInfo.tabIndex == 2">-->
                <!--<team-power></team-power>-->
            <!--</template>-->
        <!--</div>-->
        <!--<Modal v-model="editModel" :title="deptStatus == 'add' ? '新增部门' : '编辑部门'" @on-ok="ok(deptStatus)"-->
               <!--@on-cancel="cancel">-->
            <!--<Input v-model="deptName" placeholder="请输入部门名称" style="width: 300px"></Input>-->
        <!--</Modal>-->
        <!--<Modal v-model="delModal" title="确认删除部门？" @on-ok="delOk" @on-cancel="cancel">-->
            <!--<p>删除部门后成员将移入“未分配部门”</p>-->
        <!--</Modal>-->
        <!--<Modal v-model="dutyModel" :title="dutyStatus == 'add' ? '新增职能' : '编辑职能'" @on-ok="okDuty(dutyStatus)"-->
               <!--@on-cancel="cancel">-->
            <!--<Input v-model="dutyName" placeholder="请输入职能名称" style="width: 300px"></Input>-->
        <!--</Modal>-->
        <!--<Modal v-model="delDutyModal" title="确认删除职能？" @on-ok="delDutyOk" @on-cancel="cancel">-->
            <!--<p>删除职能后成员将移入“自定义角色”</p>-->
        <!--</Modal>-->
        <!--<Modal v-model="ApplyJionCompanyInfo.flag" title="申请加入公司记录" class="JionCompanySty" width="660"  :footerHide='true'>-->
            <!--<p class="jionTips"><i>!</i> 申请7天内未确认将会失效，拒绝申请3天内可重新调整审核结果</p>-->
            <!--<ul>-->
                <!--<li v-for="item in  ApplyJionCompanyInfo.ApplyJionCompanyList">-->
                    <!--<div class="PersionInfos">-->
                        <!--<span><img :src="item.headimage">&nbsp;<em>{{item.realname}} </em></span>-->
                        <!--<span class="colorGray">{{item.apply_time}}</span>-->
                        <!--<span class="colorGray">发出申请</span>-->
                        <!--<span style="width: 40px" :class="{'confirmed':item.type==0,'no':item.type==2||item.type==3,'ok':item.type==1,'colorGray':item.type==5}">{{item.type | joinStatus}}</span>-->
                    <!--</div>-->
                    <!--<div class="statusBtn">-->
                        <!--<button v-if="item.type == 0" class="noBtn" @click="joinCompanyFun(item.id,'2')">拒绝</button>-->
                        <!--<button v-if="item.type == 0" class="okBtn" @click="joinCompanyFun(item.id,'1')">同意</button>-->
                        <!--<button v-if="item.type == 2 ||item.type == 3 " class="agianBtn" @click="joinCompanyFun(item.id,'1')">再次同意</button>-->
                    <!--</div>-->
                <!--</li>-->
            <!--</ul>-->
        <!--</Modal>-->
    </div>
</template>

<script>
    // import Cookies from 'js-cookie';
    // import {mapGetters} from 'vuex';
    // import memberlist from './mmComponents/memberList.vue';
    // import membertype from './mmComponents/memberType.vue';
    // import memberinvite from './mmComponents/memberInvite.vue';
    // import membermessage from './mmComponents/memberMessage.vue';
    // import authType from './mmComponents/authType.vue';
    // import authMessage from './mmComponents/authMessage.vue';
    // import {mapState} from 'vuex';
    // import mainNative from '../main-components/mainNative.vue';
    // import md5 from "md5";
    // import TeamPower from "./teamPower";
    // import NavTav from "../../components/navTav";
    // export default {
    //     components: {
    //         NavTav,
    //         TeamPower,
    //         memberlist,
    //         membertype,
    //         memberinvite,
    //         membermessage,
    //         authType,
    //         authMessage,
    //         mainNative,
    //     },
    //     data() {
    //         return {
    //             ApplyJionCompanyInfo: {
    //                 ApplyJionCompanyList: [],
    //                 flag: false,
    //                 number: 0
    //             },
    //             searchValue: '',
    //             tabsType: 'member',
    //             num: 1,
    //             showAddNewTodo: false,
    //             newToDoItemValue: '',
    //             memberinfolist: [],
    //             interiormemberinfolist: [],
    //             editModel: false,
    //             deptStatus: 'add',
    //             deptName: '',
    //             deptId: 0,
    //             delModal: false,
    //             delDutyModal: false,
    //             dutyModel: false,
    //             dutyStatus: 'add',
    //             dutyId: 0,
    //             dutyName: '',
    //             param: {},
    //             title: '',
    //             number: '',
    //             tabsInfo: {
    //                 tabs: [
    //                     {tab: '成员管理', name: 'member'},
    //                     {tab: '权限设置', name: 'auth'},
    //                     {tab: '团队能力', name: 'auth'},
    //                 ],
    //                 tabIndex: 0
    //             },
    //             editPassWord: '123456',
    //             topTabId: null,
    //         };
    //     },
    //     created() {
    //         this.getInitInfo();
    //         let company = JSON.parse(Cookies.get('company'));
    //         this.title = company.company_name;
    //     },
    //     mounted() {
    //         this.deptListData();
    //         this.dutyListData();
    //         this.authListData();
    //         this.getApplyJionCompanyList();
    //         this.memberBubbble();
    //     },
    //     computed: {
    //         ...mapState({
    //             memberMgt(data) {
    //                 return data.app.memberMgt;
    //             },
    //             roleMgt(data) {
    //                 return data.app.roleMgt;
    //             }
    //         }),
    //         ...mapGetters({
    //             deptList: 'getDeptList',
    //             dutyList: 'getDutyList',
    //             postList: 'getPostList',
    //             authList: 'getAuthList'
    //         }),
    //         getCompanyMembers () {
    //             return this.$store.state.companyMembers;
    //         }
    //     },
    //     updated() {
    //         this.initialLoad();
    //     },
    //     methods: {
    //         // tab 切换
    //         changeTabs(index){
    //             this.tabsInfo.tabIndex = index;
    //             this.getauthorityBubble();
    //         },
    //         getMatchedStatus () {
    //             for (let index in this.tabsInfo.tabs) {
    //                 if (index == 1) {
    //                     this.topTabId = index;
    //                     return this.topTabId;
    //                 }
    //             }
    //         },
    //         //  成员管理气泡引导
    //         bubble(){
    //             let index = this.getMatchedStatus();
    //             let text = this.$lau.bubble.memberManageGuide;
    //             if (index == 1){
    //                 let guideOptions = [
    //                     {
    //                         id: 'memberTabID',
    //                         position: 'right-top',
    //                         title: text[0].title,
    //                         content: text[0].content,
    //                         relative: 'body',
    //                         subClassName: 'ivu-tabs-bar',
    //                     },
    //                     {
    //                         id: 'memberListId',
    //                         position: 'bottom',
    //                         title: text[1].title,
    //                         content: text[1].content,
    //                         subClassName: 'ivu-table-row',
    //                         relative: 'body',
    //                     },
    //                     {
    //                         id: 'tbsID' + index,
    //                         position: 'bottom',
    //                         title: text[2].title,
    //                         content: text[2].content,
    //                         relative: 'body',
    //                     }
    //                 ];
    //                 setTimeout(() => {
    //                     this.$bubble(guideOptions);
    //                 }, 200);
    //             }
    //         },
    //         //
    //         memberBubbble(){
    //             this.$axios.get(this.GLOBAL.baseRouter+this.$GLOBALAPI.company_team_setindex).then(res => res.data).then(res => {
    //                 if (res.guide === 'teamSet'){
    //                     this.bubble();
    //                 }
    //             });
    //         },
    //         // 成员权限管理引导
    //         authorityBubble(){
    //             let text = this.$lau.bubble.memberAuthority;
    //             let guideOptions = [
    //                     // 隐藏气泡引导===>权限设置功能引导 》去掉管理员不能编辑这个功能引导
    //                     // {
    //                     //     id: 'activedID',
    //                     //     position: 'right-top',
    //                     //     title: text[0].title,
    //                     //     content: text[0].content,
    //                     //     relative:'body',
    //                     //     subClassName:'actived',
    //                     // },
    //                 {
    //                     id: 'authorityID',
    //                     position: 'left-top',
    //                     title: text[1].title,
    //                     content: text[1].content,
    //                         // subClassName:'ivu-table-row',
    //                     relative: 'body',
    //                 },
    //                 {
    //                     id: 'teamTreeID',
    //                     position: 'left-top',
    //                     title: text[2].title,
    //                     content: text[2].content,
    //                     relative: 'body',
    //                 }
    //             ];
    //             setTimeout(() => {
    //                 this.$bubble(guideOptions);
    //             }, 200);
    //         },
    //         //
    //         getauthorityBubble(){
    //             this.$axios.get(this.GLOBAL.baseRouter+this.$GLOBALAPI.company_use_authorityindex).then(res => res.data).then(res => {
    //                 if (res.guide === 'useAuthority'){
    //                     this.authorityBubble();
    //                 }
    //             });
    //         },
    //         getInitInfo() {
    //             this.$axios
    //             .get(this.GLOBAL.baseRouter+this.$GLOBALAPI.system_info)
    //             .then(res => res.data)
    //             .then(res => {
    //                 //公司改名后 重新设置Cookie
    //                 this.title = res.company.company_name;
    //                 Cookies.set('company', res.company);
    //                 this.number = res.company.member_count + '';
    //             });
    //         },
    //         searchList() {
    //             this.$refs.list.deptFData(this.searchValue);
    //         },
    //         initialLoad() {
    //             if (this.postList.length > 0) {
    //                 let arr = this.postList;
    //                 this.authData(0, arr[0].id, arr);
    //             }
    //         },
    //         updateDate(memberType) {
    //             this.$emit('init');
    //         },
    //
    //         /**
    //          * 获取部门列表
    //          */
    //         deptListData() {
    //             let data = {
    //                 company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
    //             };
    //             this.$store.dispatch('fetchDeptList', data);
    //         },
    //
    //         /**
    //          * 获取职位列表
    //          */
    //         dutyListData() {
    //             let data = {
    //                 company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
    //             };
    //             this.$store.dispatch('fetchDutyList', data);
    //         },
    //
    //         /**
    //          * 获取权限列表
    //          */
    //         authListData() {
    //             let data = {};
    //             this.$store.dispatch('fetchAuthList', data);
    //         },
    //
    //         /**
    //          * 根据成员部门获取列表
    //          */
    //         deptData(index, comId, deptId) {
    //             this.$refs.list.deptData(comId, deptId);
    //             sessionStorage.memberStyle = 'dept';
    //             sessionStorage.comId = comId;
    //             sessionStorage.deptId = deptId;
    //         },
    //
    //         /**
    //          * 切换成员类型数据页面消息
    //          */
    //         dutyData(index, comId, dutyId) {
    //             this.$refs.list.dutyData(comId, dutyId);
    //             sessionStorage.memberStyle = 'duty';
    //             sessionStorage.comId = comId;
    //             sessionStorage.dutyId = dutyId;
    //         },
    //         // 切换职位类型获取对应数据
    //         authData(index, postId, postList) {
    //             sessionStorage.postId = postId;
    //             this.$bus.emit("changeAuth", postId, postList);
    //         },
    //         addDept() {
    //             this.deptStatus = 'add';
    //             this.editModel = true;
    //         },
    //         editDept(id, name) {
    //             this.deptStatus = 'edit';
    //             this.editModel = true;
    //             this.deptId = id;
    //             this.deptName = name;
    //         },
    //         ok(name) {
    //             if (name == 'add') {
    //                 let data = {
    //                     company_id: JSON.parse(Cookies.get('company')).company_id, // company_id1
    //                     name: this.deptName
    //                 };
    //                 this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_add, data)
    //                     .then(res => res.data)
    //                     .then(res => {
    //                         if (res.err_code == 0) {
    //                             this.deptListData();
    //                             this.deptName = '';
    //                             this.$Message.success('创建部门成功');
    //                         } else {
    //                             this.$Message.error('创建部门失败');
    //                         }
    //                     });
    //             } else if (name == 'edit') {
    //                 let data = {
    //                     id: this.deptId,
    //                     name: this.deptName
    //                 };
    //                 this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_update, data)
    //                     .then(res => res.data)
    //                     .then(res => {
    //                         if (res.err_code == 0) {
    //                             this.deptListData();
    //                             this.deptName = '';
    //                             this.$Message.success('修改部门名称成功');
    //                         } else {
    //                             this.$Message.error('修改部门名称失败');
    //                         }
    //                     });
    //             }
    //         },
    //         cancel() {
    //             this.deptName = '';
    //         },
    //
    //         /**
    //          * 删除部门
    //          */
    //         delDept(id) {
    //             this.delModal = true;
    //             this.deptId = id;
    //         },
    //         delOk() {
    //             let data = {
    //                 id: this.deptId
    //             };
    //             this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_delete, data)
    //                 .then(res => res.data)
    //                 .then(res => {
    //                     if (res.err_code == 0) {
    //                         this.deptListData();
    //                         this.$Message.success('删除部门成功');
    //                         window.location.reload();
    //                     } else {
    //                         this.$Message.error('删除部门失败');
    //                     }
    //                 });
    //         },
    //         delDuty(id) {
    //             this.delDutyModal = true;
    //             this.dutyId = id;
    //         },
    //         delDutyOk() {
    //             let data = {
    //                 id: this.dutyId
    //             };
    //             this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_postdelete, data)
    //                 .then(res => res.data)
    //                 .then(res => {
    //                     if (res.err_code == 0) {
    //                         this.dutyListData();
    //                         this.$Message.success('删除职能成功');
    //                     } else {
    //                         this.$Message.error('删除职能失败');
    //                     }
    //                 });
    //         },
    //         addDuty() {
    //             this.dutyStatus = 'add';
    //             this.dutyModel = true;
    //         },
    //         editDuty(id, name) {
    //             this.dutyStatus = 'edit';
    //             this.dutyModel = true;
    //             this.dutyId = id;
    //             this.dutyName = name;
    //         },
    //         okDuty(name) {
    //             if (name == 'add') {
    //                 let data = {
    //                     company_id: JSON.parse(Cookies.get('company')).company_id, // company_id1
    //                     name: this.dutyName
    //                 };
    //                 this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_postadd, data)
    //                     .then(res => res.data)
    //                     .then(res => {
    //                         if (res.err_code == 0) {
    //                             this.dutyListData();
    //                             this.dutyName = '';
    //                             this.$Message.success('创建职能成功');
    //                         } else {
    //                             this.$Message.error('创建职能失败');
    //                         }
    //                     });
    //             } else if (name == 'edit') {
    //                 let data = {
    //                     id: this.dutyId,
    //                     name: this.dutyName
    //                 };
    //                 this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_postupdate, data)
    //                     .then(res => res.data)
    //                     .then(res => {
    //                         if (res.err_code == 0) {
    //                             this.dutyListData();
    //                             this.$Message.success('修改职能名称成功');
    //                         } else {
    //                             this.$Message.error('修改职能名称失败');
    //                         }
    //                     });
    //             }
    //         },
    //
    //         /**
    //          * 暂时，会移动到用户控制组件中
    //          */
    //         clickInviteMember() {
    //             this.$refs.invite.isShowPage(true);
    //         },
    //         selectMember(index) {
    //             let data = {
    //                 id: index.id
    //             };
    //             this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_info, data)
    //                 .then(res => res.data)
    //                 .then(res => {
    //                     if (res.err_code == 0) {
    //                         this.param = res;
    //                         this.param.password = this.editPassWord;
    //                         this.param.post_id = Number(this.param.post_id);
    //                         this.param.department_id = Number(this.param.department_id);
    //                         this.$nextTick(function(){
    //                             this.$refs.message.isShowPage(true);
    //                         });
    //
    //                     }
    //                 });
    //         },
    //         changeNav({index}){
    //             this.tabsInfo.tabIndex = index;
    //         },
    //
    //         /**
    //          * 修改成员信息
    //          * id 成员id
    //          * rname 成员备注名
    //          * did 部门id
    //          * pid 职位id
    //          */
    //         //  获取加密密码的密钥
    //         fetchKey() {
    //             this.$axios
    //             .get(this.GLOBAL.baseRouter+this.$GLOBALAPI.system_get_public_secret_key)
    //             .then(res => res.data)
    //             .then(res => {
    //                 if (res.err_code == 0) {
    //                     this.publicKey = res.public_key;
    //                 }
    //             });
    //         },
    //         editMember(id, rname, did, pid, pwd) {
    //             let _this = this;
    //             if (pwd == "") {
    //                 _this.$Message.error("登录密码不能为空");
    //             } else if (pwd.length < 6) {
    //                 _this.$Message.error("密码长度不能小于6位");
    //             } else if (pwd.indexOf(" ") >=0){
    //                 _this.$Message.error("密码存在空格");
    //             } else {
    //                 _this.$axios.get(_this.GLOBAL.baseRouter+this.$GLOBALAPI.system_get_public_secret_key).then(res => res.data).then(res => {
    //                     if (res.err_code == 0) {
    //                         let encrypt = new JSEncrypt(); // 新建JSEncrypt对象
    //                         encrypt.setPublicKey(res.public_key);
    //                         let data = {
    //                             id: id,
    //                             realname: rname,
    //                             department_id: did,
    //                             post_id: pid,
    //                             password: pwd,
    //                         };
    //                         data.password = encrypt.encrypt(md5(md5(data.password)));
    //                         let getData = function() {
    //                             _this.$axios.post(_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_update, data)
    //                             .then(res => res.data)
    //                             .then(res => {
    //                                 if (res.err_code == 0) {
    //                                     _this.$Message.success('成功修改该成员信息');
    //                                     //刷新当前表格
    //                                     if (sessionStorage.memberStyle == 'dept') {
    //                                         _this.$refs.list.deptData(sessionStorage.comId, sessionStorage.deptId);
    //                                     } else if (sessionStorage.memberStyle == 'duty') {
    //                                         _this.$refs.list.dutyData(sessionStorage.comId, sessionStorage.dutyId);
    //                                     }
    //                                     //关闭弹窗
    //                                 }
    //                                 if (sessionStorage.memberStyle == 'dept') {
    //                                     _this.deptListData();
    //                                     _this.$refs.list.deptData(sessionStorage.comId, sessionStorage.deptId);
    //                                 } else if (sessionStorage.memberStyle == 'duty') {
    //                                     _this.dutyListData();
    //                                     _this.$refs.list.dutyData(sessionStorage.comId, sessionStorage.dutyId);
    //                                 }
    //                                 _this.$refs.message.isShowPage(false);
    //                             });
    //                         };
    //                         getData();
    //                     }
    //                 });
    //             }
    //         },
    //
    //         /**
    //          * 移除成员
    //          */
    //         delMember(id) {
    //             this.$Modal.confirm({
    //                 title: '移除成员',
    //                 content: '<p>是否确定永久的移除改成员？</p>',
    //                 okText: '是',
    //                 cancelText: '否',
    //                 onOk: () => {
    //                     let data = {
    //                         id: id
    //                     };
    //                     this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_delete, data)
    //                         .then(res => res.data)
    //                         .then(res => {
    //                             if (res.err_code == 0) {
    //                                 this.deptListData();
    //                                 this.dutyListData();
    //                                 this.$Message.success('成功移除该成员');
    //                                 this.getInitInfo();
    //                                 //刷新当前表格
    //                                 if (sessionStorage.memberStyle == 'dept') {
    //                                     this.$refs.list.deptData(sessionStorage.comId, sessionStorage.deptId);
    //
    //                                 } else if (sessionStorage.memberStyle == 'duty') {
    //                                     this.$refs.list.dutyData(sessionStorage.comId, sessionStorage.dutyId);
    //                                 }
    //                                 //关闭弹窗
    //                                 this.$refs.message.isShowPage(false);
    //                             }
    //                         });
    //                 }
    //             });
    //         },
    //
    //         /**
    //          * 增加一行艺术家用户信息
    //          */
    //         addInviteMember() {
    //             var info = {
    //                 id: this.num,
    //                 account: "account" + this.num,
    //                 name: "name" + this.num,
    //                 profession: "profession" + this.num
    //             };
    //             this.num++;
    //             this.memberinfolist.push(info);
    //         },
    //
    //         /**
    //          * 增加一行内部用户信息
    //          */
    //         addInteriorMember() {
    //             var info = {
    //                 id: this.num,
    //                 account: "account" + this.num,
    //                 name: "name" + this.num,
    //                 profession: "profession" + this.num
    //             };
    //             this.interiormemberinfolist.push(info);
    //         },
    //
    //         /**
    //          * 删除一行艺术家用户信息
    //          */
    //         delInviteMember(info) {
    //             //需要移动到工具函数中
    //             Array.prototype.indexOf = function (val) {
    //                 for (var i = 0; i < this.length; i++) {
    //                     if (this[i] == val) {return i;}
    //                 }
    //                 return -1;
    //             };
    //             //需要移动到工具函数中
    //             Array.prototype.removeOf = function (val) {
    //                 var index = this.indexOf(val);
    //                 if (index > -1) {
    //                     this.splice(index, 1);
    //                 }
    //             };
    //             this.memberinfolist.removeOf(info);
    //         },
    //         //申请加入公司数据列表
    //         getApplyJionCompanyList(){
    //             this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_apply_list).then((res)=>{
    //                 if (res.data.err_code == 0){
    //                     let num = 0;
    //                     this.ApplyJionCompanyInfo.ApplyJionCompanyList = res.data.data;
    //                     res.data.data.map(function (creent, index) {
    //                         if (creent.type == 0){num ++ ;}
    //                     });
    //                     this.ApplyJionCompanyInfo.number = num;
    //                 } else {
    //                     this.$Message.error(res.data.err_message);
    //                 }
    //             });
    //         },
    //         //申请加入公司操作
    //         joinCompanyFun(persionID, status){
    //             this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_apply_type, {id: persionID, type: status}).then((res)=>{
    //                 if (res.data.err_code == 0){
    //                     this.$Message.success('操作成功！');
    //                     this.deptListData();
    //                     this.dutyListData();
    //                     this.authListData();
    //                     this.getApplyJionCompanyList();
    //                 } else {
    //                     this.$Message.error(res.data.err_message);
    //                 }
    //             });
    //         }
    //     },
    //     filters: {
    //         joinStatus(val){
    //             switch (val){
    //                 case '0':return '待确认';
    //                     break;
    //                 case '1':return '同意';
    //                     break;
    //                 case '2':return '拒绝';
    //                     break;
    //                 case '3':return '拒绝';
    //                     break;
    //                 case '5':return '已失效';
    //             }
    //         }
    //     },
    //     watch: {
    //         getCompanyMembers (val) {
    //             if (val) {
    //                 this.number = val;
    //             }
    //         }
    //     },
    // };
</script>

<style lang="less">
    .ivu-layout-content {
        padding-left: 20px;
    }
    .ivu-layout-sider {
        width: 362px !important;
        max-width: 362px !important;
        flex: 0 0 362px !important;
        height: 100%;
        border-radius: 3px;
    }
    .ivu-layout-sider,
    .ivu-layout-header {
        background: #fff;
    }
    .addBtn {
        background: @base;
        color: #fff;
        border: 0;
    }
    .addDept {
        color: @black_2;
        font-size: 14px;
        line-height: 50px;
        padding: 0 25px;
        cursor: pointer;
        border-top: 1px solid #f8f9fa;
        &:hover{
            color:@base;
            .icon-jia{
                color:@base;
            }
        }
        .icon-jia {
            color: @black_3;
            font-size: 20px;
            margin-right:10px;
        }
    }
    .search {
        text-align: right;
        margin-bottom: 10px;
        .searchBox{
            float: left;
            padding-left:20px;
            padding-bottom:10px;
            .search-input {
                .ivu-input-icon{
                    width: 40px;
                    font-size: 20px;
                    color: #bdbdbd;
                    height: 40px;
                    line-height: 40px;
                }
                .ivu-input{
                    font-size: 14px !important;
                    color: #bdbdbd;
                    border: 1px solid transparent;
                    &:focus{
                    border: 1px solid @base;
                    box-shadow: none;
                    }
                }
            }
        }
        .basgeS{
            position: absolute;
            top: -1px;
            right: 0px;
            display: inline-block;
            background: @red;
            height: 16px;
            line-height: 15px;
            border-radius: 7px;
            font-size: 12px;
            padding: 0 4px;
        }
        .ivu-icon-search {
            font-size: 16px;
            color: #bdbdbd;
            width: 50px;
            height: 40px;;
            text-align: center;
            background: #fff;
            border-radius: 0 8px 8px 0;
            cursor: pointer;
            padding-top: 11px;
        }
    }
</style>
<style lang="less">
    .membermanager {
        background: @baseboard;
        .memberType{
            .base-card;
            padding:0px;
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
       .ivu-tabs-content-animated{
            min-height: 400px !important;
        }
        .ivu-tabs-tabpane{
            min-height: 400px !important;
            overflow: auto;
            }
        .ivu-layout{
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
    .JionCompanySty{
        .ivu-modal-body{
            position: relative!important;
        }
        .jionTips{
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
            i{
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
        ul{
            margin-top: 30px;
            li{
                border-bottom:1px dashed #ccc;
                padding: 10px 0;
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                .PersionInfos{
                    width: 75%;
                    display: flex;
                    justify-content: space-between;
                    span{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        &:first-child{
                            /*background: red;*/
                            min-width: 70px;
                            max-width: 100px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            justify-content: start;
                            em{font-style: normal}
                            img{
                                width: 25px;
                                height: 25px;
                                border-radius: 100%;
                            }
                        }
                    }
                    .colorGray{
                        color: #b7b5b5;
                    }
                    .confirmed{
                        color: #79bbfb;
                    }
                    .ok{
                        color: @base;
                    }
                    .no{
                        color: #f74f57;
                    }
                }
                .statusBtn{
                    width: 20%;
                    text-align: right;
                    button{
                        border: 1px solid transparent;
                        background: @white;
                        padding: 2px 10px;
                        border-radius: 3px;
                        outline: none;
                        cursor: pointer;
                        &.noBtn{
                            border-color: #f74f57 !important;
                            color: #f74f57;
                        }
                        &.okBtn{
                            background: @base;
                            border-color: @base !important;
                            color: @white;
                        }
                        &.agianBtn{
                            border-color: @base !important;
                            color: @base;
                        }
                    }
                }
            }
        }
    }
</style>

