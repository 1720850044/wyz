<template>
    <div class="personalCenter">
        <ul class="Tab">
            <li :class="{'selected':index == tabInfos.creentIndex}" v-for="(item,index) in tabInfos.tabs"
                @click="tabInfos.creentIndex = index">{{item}}
            </li>
        </ul>
        <template>
            <div class="basicInfo" v-show="tabInfos.creentIndex == 0">
                <ul>
                    <li>
                        <span class="field">{{$t('pc.pc_avatar')}}</span>
                        <div class="head">
                            <div class="headBox">
                                <head-upload :parameter="{type: 'avatar'}"
                                             :fileType="[{title: 'Image files',extensions: 'jpg,gif,png'}]"
                                             :id="uploadHead" @FileUploadedSuccess="headerSuccess">
                                    <template slot="upload">
                                        <div class="uploadHeadBox">
                                            <button :id="uploadHead"></button>
                                            <img v-if="userInfo.headimage"
                                                 :src="userInfo.headimage+'?x-oss-process=style/420'" class="avatarImg"
                                                 style="cursor: pointer;">
                                            <span v-else class="addHead">{{$t('pc.pc_clickUpload')}}</span>
                                        </div>
                                    </template>
                                </head-upload>
                            </div>
                            <span class="tips">
                                <em>{{$t('pc.pc_clickAvatarForUpload')}}</em><br/>
                                <em>{{$t('pc.pc_avatarTips')}}</em>
                            </span>
                        </div>
                    </li>
                    <li>
                        <span class="field martop">{{$t('pc.pc_nickName')}}</span>
                        <div class="inputBox">
                            <Input style="width:100%" v-model="userInfo.nickname" key="usernickname"></Input>
                            <p class="placeholder">
                                {{$t('pc.pc_bbyPlatformUseNameTips')}}
                            </p>
                        </div>
                    </li>
                    <li>
                        <span class="field martop">{{$t('pc.pc_realName')}}</span>
                        <div class="inputBox">
                            <Input style="width:100%" v-model="userInfo.realname" key="userRealname"></Input>
                            <p class="placeholder">
                                {{$t('pc.pc_useRealNameTips')}}
                            </p>
                        </div>
                    </li>
                    <li>
                        <span class="field martop">{{$t('pc.pc_workType')}}</span>
                        <div class="inputBox">
                            <Select v-model="userInfo.ability_id" :placeholder="$t('lang.lang_pleaseEnter')">
                                <Option v-for="(item,index) in beGoodList" :value="item.id" :key="index">
                                    {{item.name}}
                                </Option>
                            </Select>
                            <p class="placeholder">
                                {{$t('pc.pc_useWorkTypeTips')}}
                            </p>
                        </div>
                    </li>
                </ul>
                <div class="footer">
                    <button @click="saveBasicInfo">{{$t('lang.lang_save')}}</button>
                </div>
            </div>
            <div class="accountInfo" v-show="tabInfos.creentIndex == 1">
                <ul>
                    <li>
                        <span class="field">{{$t('lang.lang_account')}}</span>
                        <div class="inputBox">
                            <Input style="width:89%" disabled v-model="userInfo.account" :placeholder="$t('lang.lang_pleaseEnter') + $t('lang.lang_account')" key="userAccount"></Input>
                        </div>
                    </li>
                    <li>
                        <span class="field">{{$t('main.main_password')}}</span>
                        <div class="inputBox">
                            <Input style="width:89%" disabled :placeholder="$t('lang.lang_pleaseEnter') + $t('main.main_password')" type="password" value="123456" key="userPassword"></Input>
                            <span @click="showBox('passwordFlag')">{{$t('lang.lang_modify')}}{{$t('main.main_password')}}</span>
                        </div>
                        <div class="positionBlock" v-if="updataFlag.passwordFlag">
                            <dl>
                                <dt><span>{{$t('lang.lang_modify')}}{{$t('main.main_password')}}</span><i class="iconfonts icon-cuowu" @click="updataFlag.passwordFlag = false"></i></dt>
                                <dd>
                                    <span class="field">{{$t('pc.pc_original')}}{{$t('main.main_password')}}</span>
                                    <Input :placeholder="$t('lang.lang_pleaseEnter') + $t('pc.pc_original') + $t('main.main_password')" type="password" v-model="passwordObj.oldPassword" key="userOldPassword"
                                           autocomplete="off"></Input>
                                </dd>
                                <dd>
                                    <span class="field">{{$t('main.main_new')}}{{$t('main.main_password')}}</span>
                                    <Input :placeholder="$t('lang.lang_pleaseEnter') + $t('main.main_new') + $t('main.main_password')" type="password" v-model="passwordObj.newPassword" key="userNewPassword"
                                           autocomplete="off"></Input>
                                </dd>
                                <dd>
                                    <span class="field">{{$t('lang.lang_ok')}}{{$t('main.main_password')}}</span>
                                    <Input :placeholder="$t('lang.lang_pleaseEnter') + $t('lang.lang_ok') + $t('main.main_password')" type="password" v-model="passwordObj.comfirmPassword" key="userComfirmPassword"
                                           autocomplete="off"></Input>
                                </dd>
                                <dd>
                                    <button class="comrimBtn" @click="updataPassword">{{$t('lang.lang_ok')}}</button>
                                </dd>
                            </dl>
                        </div>
                    </li>
                    <li>
                        <span class="field">{{$t('lang.lang_phone')}}</span>
                        <div class="inputBox">
                            <Input style="width:89%" disabled v-model="userInfo.phone" :placeholder="$t('pc.pc_notBoundPhoneNumber')" key="userPhone"></Input>
                            <span @click="showBox('phoneFlag')">{{userInfo.phone ? $t('lang.lang_modify') + $t('lang.lang_phone') : $t('lang.lang_bound') + $t('lang.lang_phone')}}</span>
                        </div>
                        <div class="positionBlock" v-if="updataFlag.phoneFlag">
                            <dl>
                                <dt><span>{{userInfo.phone ? $t('lang.lang_modify') + $t('lang.lang_phone') : $t('lang.lang_bound') + $t('lang.lang_phone')}}</span><i class="iconfonts icon-cuowu" @click="updataFlag.phoneFlag = false"></i></dt>
                                <dd>
                                    <span class="field">{{$t('pc.pc_authentication')}}</span>
                                    <Input :placeholder="$t('pc.pc_enterPwdForAuthentication')" type="password" v-model="phoneObj.password" key="userPhonePassword"
                                           autocomplete="off"></Input>
                                </dd>
                                <dd>
                                    <span class="field">{{$t('lang.lang_phoneNumber')}}</span>
                                    <Input :placeholder="$t('lang.lang_pleaseEnter') + $t('lang.lang_phone') + $t('lang.lang_number')" v-model="phoneObj.phoneNumber" key="userPhonetwo"
                                           autocomplete="off"></Input>
                                </dd>
                                <dd>
                                    <span class="field">{{$t('pc.pc_verificationCode')}}</span>
                                    <Input type="text" :placeholder="$t('lang.lang_pleaseEnter') + $t('pc.pc_verificationCode')" v-model="phoneObj.verificationCode" key="userPhoneCode"
                                           autocomplete="off">
                                        <button class="codeBtn" :class="[phoneObj.btnStatus ? 'noSty': 'yesSty']"
                                                :disabled="phoneObj.btnStatus ? true : false" slot="append"
                                                @click="getPhoneCode">{{phoneObj.btnStatus ? phoneCodeSecond + 's' + $t('pc.pc_afterReGetCode') : $t('main.main_getVerificationCode')}}
                                        </button>
                                    </Input>
                                </dd>
                                <dd>
                                    <button class="comrimBtn" @click="updataPhone">{{$t('lang.lang_ok')}}</button>
                                </dd>
                            </dl>
                        </div>
                    </li>
                    <li>
                        <span class="field">{{$t('lang.lang_email')}}</span>
                        <div class="inputBox">
                            <Input style="width:89%" disabled v-model="userInfo.email" :placeholder="$t('lang.lang_pleaseEnter') + $t('lang.lang_email')" key="userEmail"></Input>
                            <span @click="showBox('emailFlag')">{{userInfo.email ? $t('lang.lang_modify') + $t('lang.lang_email') : $t('lang.lang_add') + $t('lang.lang_email')}}</span>
                        </div>
                        <div class="positionBlock" v-if="updataFlag.emailFlag">
                            <dl>
                                <dt><span>{{userInfo.email ? $t('lang.lang_modify') + $t('lang.lang_email') : $t('lang.lang_add') + $t('lang.lang_email')}}</span><i class="iconfonts icon-cuowu"  @click="updataFlag.emailFlag = false"></i></dt>
                                <dd>
                                    <span class="field">{{$t('lang.lang_login')}}{{$t('main.main_password')}}</span>
                                    <Input :placeholder="$t('lang.lang_pleaseEnter') + $t('main.main_password')" type="password" v-model="emailObj.password" key="userEmailPassword"
                                           autocomplete="off"></Input>
                                </dd>
                                <dd>
                                    <span class="field">{{$t('lang.lang_email')}}</span>
                                    <Input :placeholder="$t('lang.lang_pleaseEnter') + $t('lang.lang_email')" v-model="emailObj.email" autocomplete="off" key="userEmailTwo"></Input>
                                </dd>
                                <dd>
                                    <span class="field">{{$t('pc.pc_verificationCode')}}</span>
                                    <Input type="text" :placeholder="$t('lang.lang_pleaseEnter') + $t('pc.pc_verificationCode')" v-model="emailObj.verificationCode" key="userEmailCode"
                                           autocomplete="off">
                                        <button class="codeBtn" :class="[emailObj.btnStatus ? 'noSty': 'yesSty']"
                                                :disabled="emailObj.btnStatus ? true : false" slot="append"
                                                @click="getEmailCode">{{emailObj.btnStatus ? emailCodeSecond+'s' + $t('pc.pc_afterReGetCode') : $t('main.main_getVerificationCode')}}
                                        </button>
                                    </Input>
                                </dd>
                                <dd>
                                    <button class="comrimBtn" @click="updataEmail">{{$t('lang.lang_ok')}}</button>
                                </dd>
                            </dl>
                        </div>
                    </li>
                    <!--<li>-->
                    <!--<span class="field">微信</span>-->
                    <!--<div class="inputBox">-->
                    <!--<Input style="width:89%" disabled placeholder="请输入微信号"></Input>-->
                    <!--<span @click="showBox('wchatFlag')">解绑</span>-->
                    <!--</div>-->
                    <!--<div class="positionBlock"  v-if="updataFlag.wchatFlag">-->
                    <!--123-->
                    <!--</div>-->
                    <!--</li>-->
                </ul>
            </div>
            <div class="companyInfo" v-show="tabInfos.creentIndex == 2">
                <ul>
                    <li>
                        <span class="field">{{$t('lang.lang_department')}}</span>
                        <div class="inputBox">
                            <Input style="width:100%" disabled v-model="userInfo.department_name" key="userdepartment"></Input>
                        </div>
                    </li>
                    <li>
                        <span class="field">{{$t('pc.pc_functions')}}</span>
                        <div class="inputBox">
                            <Input style="width:100%" disabled v-model="userInfo.post_name" key="userPostName"></Input>
                        </div>
                    </li>
                    <li>
                        <span class="field">{{$t('pc.pc_joinedCompany')}}</span>
                        <div class="inputBox">
                            <Input style="width:100%" disabled v-model="userInfo.company_name" key="userJoinCompany"></Input>
                        </div>
                    </li>
                </ul>
                <div class="footer">
                    <button class="leaveCompany" @click="leavecompanyFlag = true"
                            v-if="userInfo.company_id && userInfo.is_leader != 1">{{$t('pc.pc_leaveCompany')}}
                    </button>
                    <!--<button class="addCompany" v-if="!userInfo.company_id" @click="addCompany">加入公司</button>-->
                </div>
            </div>
        </template>
        <Modal v-model="leavecompanyFlag" :title="$t('pc.pc_confirmLeave')" @on-ok="comfirmLeave">
            <div class="leavecompany">
                <i class="icon">!</i>
                <span>
                    {{$t('pc.pc_leaveCompanyTips')}}！
                </span>
            </div>
        </Modal>
        <!--加入公司-->
        <perfect v-if="isproject" @coloseFlag="isproject=false" ref="perfect"></perfect>
    </div>
</template>

<script>
    import headUpload from "@/components/upload";
    import {userInfosApi} from 'api';
    import md5 from "md5";
    import perfect from "../views/main-components/perfect.vue";

    export default {
        name: "personal-center",
        props: ['personalModalFlag'],
        components: {
            headUpload,
            perfect
        },
        watch: {
            personalModalFlag(val) {
                if (val) {
                    this.tabInfos.creentIndex = 0;
                    this.resetData();
                }
            },
            'tabInfos.creentIndex': {
                handler: function (val) {
                    if (val == 1) {
                        this.resetData();
                    }
                },
            }
        },
        data() {
            return {
                isproject: false,
                tabInfos: {
                    tabs: [i18n.t('pc.pc_baseInformation'), i18n.t('pc.pc_accountManagement'), i18n.t('pc.pc_companyInformation')],
                    creentIndex: 0
                },
                userInfo: {},
                beGoodList: [],
                updataFlag: {
                    passwordFlag: false,
                    phoneFlag: false,
                    emailFlag: false,
                    wchatFlag: false
                },
                uploadHead: 'uploadUserHead',
                passwordObj: {
                    oldPassword: null,
                    newPassword: null,
                    comfirmPassword: null
                },
                phoneObj: {
                    password: null,
                    phoneNumber: null,
                    verificationCode: null,
                    btnStatus: 0
                },
                emailObj: {
                    password: null,
                    email: null,
                    verificationCode: null,
                    btnStatus: 0
                },
                phoneCodeSecond: 60,
                emailCodeSecond: 60,
                leavecompanyFlag: false
            };
        },
        mounted() {
            this.getUserInfo();
            this.getBegoodAt();
        },
        methods: {
            async getUserInfo() {
                let parms = {
                    id: sessionStorage.getItem('userId')
                };

                let {data} = await userInfosApi.getUserInfo(parms);
                if (data.err_code == 0) {
                    this.userInfo = data;
                }
            },
            async getBegoodAt() {
                let {data} = await userInfosApi.getAtbegood();
                if (data.err_code == 0) {
                    this.beGoodList = data.data;
                }
            },
            showBox(type) {
                let flagObj = this.updataFlag;
                for (let item in flagObj) {
                    if (item === type) {
                        flagObj[item] = !flagObj[item];
                    } else {
                        flagObj[item] = false;
                    }
                }
            },
            headerSuccess({response}) {
                let data = JSON.parse(response);
                this.userInfo.headimage = data.file_url;
            },
            async saveBasicInfo() {
                let parms = {
                    id: this.userInfo.id,
                    headimage: this.userInfo.headimage,
                    nickname: this.userInfo.nickname,
                    realname: this.userInfo.realname,
                    job: this.userInfo.ability_id
                };
                let {data} = await userInfosApi.userUpdata(parms);
                if (data.err_code == 0) {
                    this.$Message.success(i18n.t('project.pro_saveSucceed') );
                }
            },
            //修改密码功能开始
            updataPassword() {
                let passwordObj = this.passwordObj;
                if (!passwordObj.oldPassword) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('pc.pc_original') + i18n.t('main.main_password') + '！');
                } else if (!passwordObj.newPassword) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('main.main_new') + i18n.t('main.main_password') + '！');
                } else if (!passwordObj.comfirmPassword) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('lang.lang_ok') + i18n.t('main.main_password') + '！');
                } else if (passwordObj.newPassword != passwordObj.comfirmPassword) {
                    this.$Message.error(i18n.t('pc.pc_pwdIncorrectAndReenterTips') + '！');
                } else {
                    userInfosApi.getPublicSecretKey().then(({data}) => {
                        if (data.err_code == 0) {
                            this.checkPassword(data.public_key);
                        }
                    });
                }
            },
            async checkPassword(publicKey) {
                let passwordObj = this.passwordObj;
                let encrypt = new JSEncrypt(); // 新建JSEncrypt对象
                encrypt.setPublicKey(publicKey); // 设置公钥
                let parms = {
                    password: encrypt.encrypt(md5(md5(passwordObj.oldPassword)))
                };
                let {data} = await userInfosApi.chackUserpassword(parms);
                if (data.err_code == 0) {
                    if (data.is_success === '1') {
                        this.savePassword(publicKey);
                    } else {
                        this.$Message.error(i18n.t('pc.pc_originalErrorAndReenter') + '！');
                    }
                }
            },
            async savePassword(publicKey) {
                let passwordObj = this.passwordObj;
                let encrypt = new JSEncrypt();
                encrypt.setPublicKey(publicKey);
                let parms = {
                    id: this.userInfo.id,
                    password: encrypt.encrypt(md5(md5(passwordObj.newPassword)))
                };
                let {data} = await userInfosApi.savePassword(parms);
                if (data.err_code == 0) {
                    this.resetData();
                    this.updataFlag.passwordFlag = false;
                    this.$Message.success(i18n.t('main.main_password') + i18n.t('lang.lang_modify') + i18n.t('lang.lang_success') + '！');
                }
            },
            //修改手机号码功能开始
            async getPhoneCode() {
                let phoneObj = this.phoneObj;
                let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
                if (!phoneObj.password) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('lang.lang_login') + i18n.t('main.main_password') + '！');
                } else if (!phoneObj.phoneNumber) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('lang.lang_phone') + i18n.t('lang.lang_number') + '！');
                } else if (!TEL_REGEXP.test(phoneObj.phoneNumber)) {
                    this.$Message.error(i18n.t('pc.pc_phoneNumberFormatIncorrect') + '！');
                } else {
                    let parms = {
                        phone: phoneObj.phoneNumber,
                        password: md5(md5(phoneObj.password))
                    };
                    let {data} = await userInfosApi.getPhoneCode(parms);
                    if (data.err_code == 0) {
                        this.$Message.success(i18n.t('pc.pc_verificationCodeHasSent') + "！");
                        phoneObj.btnStatus = 1;
                        this.getCodeTime('phone');
                    }
                }
            },
            updataPhone() {
                let phoneObj = this.phoneObj;
                let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
                if (!phoneObj.password) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('lang.lang_login') + i18n.t('main.main_password') + '！');
                } else if (!phoneObj.phoneNumber) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('lang.lang_phone') + i18n.t('lang.lang_number') + '！');
                } else if (!TEL_REGEXP.test(phoneObj.phoneNumber)) {
                    this.$Message.error(i18n.t('pc.pc_phoneNumberFormatIncorrect') + '！');
                } else if (!phoneObj.verificationCode) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('pc.pc_verificationCode') + '！');
                } else {
                    let parms = {
                        phone: phoneObj.phoneNumber,
                        password: md5(md5(phoneObj.password)),
                        code: phoneObj.verificationCode
                    };
                    userInfosApi.savePhone(parms).then(({data}) => {
                        if (data.err_code == 0) {
                            this.resetData();
                            this.updataFlag.phoneFlag = false;
                            this.userInfo.phone = parms.phone;
                            this.$Message.success(i18n.t('pc.pc_phoneNumberModifySuccess') + "！");
                        }
                    });
                }
            },
            //修改邮箱功能开始
            updataEmail() {
                let emailObj = this.emailObj;
                let EMAILI_REGEXP = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
                if (!emailObj.password) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('lang.lang_login') + i18n.t('main.main_password') + '！');
                } else if (!emailObj.email) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('lang.lang_email') + i18n.t('lang.lang_name') + '！');
                } else if (!EMAILI_REGEXP.test(emailObj.email)) {
                    this.$Message.error(i18n.t('pc.pc_emailNameFormatIncorrect') + '！');
                } else if (!emailObj.verificationCode) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('pc.pc_verificationCode') + '！');
                } else {
                    let parms = {
                        email: emailObj.email,
                        password: md5(md5(emailObj.password)),
                        code: emailObj.verificationCode
                    };
                    userInfosApi.saveEmail(parms).then(({data}) => {
                        if (data.err_code == 0) {
                            this.resetData();
                            this.updataFlag.emailFlag = false;
                            this.userInfo.email = parms.email;
                            this.$Message.success(i18n.t('pc.pc_emailAddressModifySuccess') + "！");
                        }
                    });
                }
            },
            async getEmailCode() {
                let emailObj = this.emailObj;
                let EMAILI_REGEXP = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
                if (!emailObj.password) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('lang.lang_login') + i18n.t('main.main_password') + '！');
                } else if (!emailObj.email) {
                    this.$Message.warning(i18n.t('lang.lang_pleaseEnter') + i18n.t('lang.lang_email') + i18n.t('lang.lang_name') + '！');
                } else if (!EMAILI_REGEXP.test(emailObj.email)) {
                    this.$Message.error(i18n.t('pc.pc_emailNameFormatIncorrect') + '！');
                } else {
                    let parms = {
                        email: emailObj.email,
                        password: md5(md5(emailObj.password))
                    };
                    let {data} = await userInfosApi.getEmailCode(parms);
                    if (data.err_code == 0) {
                        this.$Message.success(i18n.t('pc.pc_verificationCodeHasSent') + '！');
                        emailObj.btnStatus = 1;
                        this.getCodeTime('email');
                    }
                }
            },

            getCodeTime(type) {
                let phoneCodeSecond = 60;
                let emailCodeSecond = 60;
                let secound = null;
                if (type == 'phone') {
                    secound = phoneCodeSecond;
                } else {
                    secound = emailCodeSecond;
                }
                let time = setInterval(() => {
                    if (secound <= 0) {
                        if (type === 'phone') {
                            this.phoneObj.btnStatus = 0;
                        } else if (type === 'email') {
                            this.emailObj.btnStatus = 0;
                        }
                        clearInterval(time);
                        secound = 60;
                    } else {
                        secound--;
                    }
                    if (type == 'phone') {
                        this.phoneCodeSecond = secound;
                    } else {
                        this.emailCodeSecond = secound;
                    }
                }, 1000);
            },
            //离开公司
            async comfirmLeave() {
                let {data} = await userInfosApi.leaveCompany();
                if (data.err_code == 0) {
                    this.$Message.success(data.err_message);
                }
            },
            //加入公司
            addCompany() {
                this.isproject = true;
                this.setIsproject();
                this.$nextTick(() => {
                    this.$refs.perfect.selectFun(1, true);
                });
            },

            //重置
            resetData() {
                this.updataFlag = {
                    passwordFlag: false,
                    phoneFlag: false,
                    emailFlag: false,
                    wchatFlag: false
                };
                this.passwordObj = {
                    oldPassword: null,
                    newPassword: null,
                    comfirmPassword: null
                };
                this.phoneObj = {
                    password: null,
                    phoneNumber: null,
                    verificationCode: null,
                    btnStatus: 0
                };
                this.emailObj = {
                    password: null,
                    email: null,
                    verificationCode: null,
                    btnStatus: 0
                };
            }
        }
    };
</script>

<style lang="less" scoped>
    .personalCenter {
        .Tab {
            display: flex;
            border-bottom: 1px solid #ccc;
            li {
                color: #ccc;
                padding: 10px 0;
                margin-left: 30px;
                color: #ccc;
                font-size: 13px;
                &:first-child {
                    margin-left: 0 !important;
                }
                &:hover {
                    cursor: pointer;
                    color: @base;
                }
                &.selected {
                    color: @base !important;
                }
            }
        }
        .basicInfo {
            ul {
                margin-top: 20px;
                li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    .field {
                        color: #bdbdbd;
                        width: 80px;
                        font-size: 13px;
                    }
                    .martop {
                        margin-top: -20px;
                    }
                    .head {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        .headBox {
                            width: 66px;
                            height: 66px;
                            border-radius: 100%;
                            /*border: 1px solid #bdbdbd;*/
                            overflow: hidden;
                            .uploadHeadBox {
                                width: 100%;
                                height: 100%;
                                button {
                                    width: 100%;
                                    height: 100%;
                                    border: none;
                                    outline: none;
                                    background: transparent;
                                    cursor: pointer;
                                }
                                .avatarImg {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    width: 66px;
                                    height: 66px;
                                    display: block;
                                    border-radius: 100%;
                                    border: 1px solid #ccc;
                                    overflow: hidden;
                                    &:hover {
                                        cursor: pointer;
                                    }
                                }
                                .addHead {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    color: #bdbdbd;
                                    width: 66px;
                                    height: 66px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }
                            }
                        }
                        .tips {
                            margin-left: 20px;
                            em {
                                font-style: normal;
                                color: #ccc;
                            }
                        }
                    }
                    .inputBox {
                        width: 100%;
                        .placeholder {
                            color: #ccc;
                            margin-top: 2px;
                        }
                        ul > li {
                            margin-bottom: 5px !important;
                        }
                    }
                }
            }
            .footer {
                text-align: right;
                button {
                    font-size: 13px;
                    border: 1px solid @base;
                    border-radius: 3px;
                    height: 40px;
                    width: 100px;
                    background: #fff;
                    color: @base;
                    outline: none;
                    &:hover {
                        cursor: pointer;
                        background: @base;
                        color: #fff;
                    }
                }
            }
        }
        .accountInfo {
            ul {
                margin-top: 20px;
                li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    position: relative;
                    .field {
                        color: #bdbdbd;
                        width: 60px;
                        font-size: 13px;
                    }
                    .inputBox {
                        width: 100%;
                        span {
                            margin-left: 10px;
                            color: @base;
                            &:hover {
                                cursor: pointer;
                                text-decoration: underline;
                            }
                        }
                    }
                    .positionBlock {
                        position: absolute;
                        right: -310px;
                        top: 0px;
                        width: 300px;
                        box-shadow: 0px 0px 5px #000;
                        border-radius: 3px;
                        background: #fff;
                        z-index: 9;
                        dl {
                            padding: 20px;
                            dt {
                                margin-bottom: 10px;
                                display: flex;
                                justify-content: space-between;
                                span{
                                    font-size: 15px;
                                    font-weight: bold;
                                }
                                i{
                                    font-style: normal;
                                    font-size: 12px;
                                    color: #ccc;
                                    &:hover{
                                        cursor: pointer;
                                        color: #a9a9a9;
                                    }
                                }
                            }
                            dd {
                                display: flex;
                                align-items: center;
                                margin-bottom: 10px;
                                &:last-child {
                                    margin-bottom: 0 !important;
                                }
                                .field {
                                    width: 90px;
                                    /*text-align: right;*/
                                    font-size: 12px;
                                    color: #bdbdbd;
                                }
                                .codeBtn {
                                    background: transparent;
                                    border: none;
                                    outline: none;
                                }
                                .yesSty {
                                    color: #000;
                                    cursor: pointer;
                                }
                                .noSty {
                                    color: #bdbdbd;
                                    cursor: not-allowed;
                                }
                                .comrimBtn {
                                    background: #fff;
                                    border: 1px solid @base;
                                    width: 100%;
                                    height: 35px;
                                    border-radius: 5px;
                                    color: @base;
                                    overflow: hidden;
                                    outline: none;
                                    &:hover {
                                        background: @base !important;
                                        color: @white;
                                        cursor: pointer;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .companyInfo {
            ul {
                margin-top: 20px;
                li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    .field {
                        color: #ccc;
                        width: 90px;
                        font-size: 13px;
                    }
                    .inputBox {
                        width: 100%;
                        span {
                            margin-left: 10px;
                            color: @base;
                            &:hover {
                                cursor: pointer;
                                text-decoration: underline;
                            }
                        }
                    }
                }
            }
            .footer {
                text-align: right;
                button {
                    font-size: 13px;
                    border-radius: 3px;
                    height: 40px;
                    width: 100px;
                    background: #fff;
                    outline: none;
                    &:hover {
                        cursor: pointer;
                        color: #fff;
                    }
                }
                .leaveCompany {
                    border: 1px solid @red;
                    color: @red;
                    &:hover {
                        background: @red;
                    }
                }
                .addCompany {
                    border: 1px solid @base;
                    color: @base;
                    &:hover {
                        background: @base;
                    }
                }

            }
        }
    }

    .leavecompany {
        color: @orange;
        display: flex;
        align-items: center;
        padding: 40px 0;
        .icon {
            font-style: normal;
            display: inline-block;
            border-radius: 100%;
            width: 18px;
            height: 18px;
            border: 1px solid #FF9800;
            text-align: center;
            line-height: 18px;
            font-size: 16px;
            margin-right: 10px;
        }
        span {
            font-size: 13px;
        }
    }
</style>
