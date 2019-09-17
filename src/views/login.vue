<template>
    <div class="login">
        <div class="login-purple" :style="`border-top:${bodyHight}px solid #3bceb6`"></div>
        <div class="bg" :style="`height:${bodyHight}px`"></div>
        <!-- <div class="login-yellow" :style="`border-bottom:${bodyHight}px solid #fff`"></div> -->
        <div class="login-con">
            <div class="loginFooder">蜀ICP备18023414--号</div>
            <div class="form-bannger"></div>
            <!-- 注册 -->
            <div class="form-con" v-if="isRegister && !isReset" @keydown.enter="onRegister()">
                <div class="form-con-logoImg">欢迎加入斑驳</div>
                <div v-if="urlInfos.companyName" class="InvitationJoinCompany">
                    <span class="JoinCompany">
                        <em class="iconfonts icon-sound"></em>{{urlInfos.companyName}}
                    </span>
                    <span class="JoinCompanySTR">
                        &nbsp;&nbsp;邀请您加入团队
                    </span>
                </div>
                <reg-ister :account="urlInfos.account" ref="regError" class="registerContent"></reg-ister>
                <div>
                    <Button @click="onRegister()" type="primary" long>注 册</Button>
                    <p class="loginText">已有帐号，去<span @click="changeMode('register')">登录</span></p>
                </div>
            </div>
            <!-- 登录 -->
            <div class="form-con" v-else-if="!isRegister && !isReset" @keydown.enter="onSubmit()">
                <div class="form-con-logoImg">欢迎登录斑驳</div>
                <login-com ref="loginError" class="loginContent"></login-com>
                <div class="errorForget" style="" @click="changeMode('forgetPwd')">忘记密码？</div>
                <div>
                    <Button @click="onSubmit()" type="primary" long :loading="loginIng">登 录</Button>
                    <!--<p class="loginText">没有帐号，去<span @click="changeMode('login')">注册</span></p>-->
                </div>
            </div>
            <!-- 重置密码 -->
            <div class="form-con" v-else-if="isReset">
                <div class="form_back" @click="changeMode('backLogin')" style="cursor: pointer;">返回登录</div>
                <div class="resetPwd">重置密码</div>
                <p class="tipsMessage">通过登录邮箱获取验证码，完成重置密码</p>
                <reset-password ref="regError"></reset-password>
                <div>
                    <Button type="primary" @click="confirmRevision()">确认</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from "vuex";
    import "@/assets/js/jsencrypt.min";
    import axios from "axios";
    import Cookies from "js-cookie";
    import regIster from "./login/register";
    import loginCom from "./login/loginCom";
    import resetPassword from "./login/resetPassword";
    import api, {loginApi} from 'api';

    var md5 = require("md5");
    export default {
        data () {
            return {
                loginIng: false,
                isRegister: false,
                bodyHight: 500,
                publicKey: "",
                register: {},
                loginform: {},
                resetPassword: {},
                urlInfos: {
                    sign: null,
                    account: null,
                    companyName: null,
                },
                isReset: false,
            };
        },
        components: {
            regIster: regIster,
            loginCom: loginCom,
            resetPassword: resetPassword,
        },

        /**
         * 页面加载前
         * */
        created () {

            this.bodyHight = document.documentElement.clientHeight;
            let inviteCode = this.$route.query.invate_code;
            if (inviteCode) {
                Cookies.set("invate_code", inviteCode);
            } else {
                Cookies.set("invate_code", null);
            }
            this.checkIsRegister();
            //判断是否属于公司邀请
            let url = window.location.href;
            if (url.indexOf('sign') > 0) {
                this.isRegister = true;
                let strArr = url.split('?')[ 1 ].split('#/login')[ 0 ].split('&');
                this.urlInfos.sign = strArr[ 0 ].split('=')[ 1 ];
                this.getInviteInfos(this.urlInfos.sign);
            }
        },
        mounted () {
            // console.log('document.referrer:',document.referrer);
            // console.log('router:',this.$router);
            this.fetchKey();
            localStorage.removeItem("msgShow");
            this.$store.state.msgShow = false;
            this.$bus.on("registerData", val => {
                this.register = val;
            });
            this.$bus.on("loginData", val => {
                this.loginform = val;
            });
            this.$bus.on("resetData", val => {
                this.resetPassword = val;
            });
        },
        methods: {
            ...mapMutations([ "setIsproject" ]),
            ...mapActions([ "getMsgNoticeNum" ]),
            async getInviteInfos(parms){
                let {data} = await loginApi.getInviteInfo({sign: parms});
                if (data.err_code == 0){
                    this.urlInfos.account = data.data.account;
                    this.urlInfos.companyName = data.data.company_name;
                }
            },
            //如果toTag
            checkIsRegister () {
                //console.log('指定到注册页 toTag:',this.$route.query)
                if (this.$route.query.toTag && this.$route.query.toTag == 'isRegister') {
                    this.isRegister = true;
                }
            },
            // 链接websoket
            changeMode (mode) {
                if (mode == "login") {
                    this.isRegister = true;
                    this.isReset = false;
                    this.loginform.userName = "";
                    this.loginform.password = "";
                } else if (mode == "register") {
                    this.isRegister = false;
                    this.isReset = false;
                    this.register.userName = "";
                    this.register.password = "";
                    this.register.passwdCheck = "";
                    this.register.code = "";
                } else if (mode == "forgetPwd") {
                    this.isReset = true;
                } else if (mode == "backLogin") {
                    this.isRegister = false;
                    this.isReset = false;

                }
            },
            async fetchKey () {
                let {data} = await loginApi.getPublicSecretKey();
                if (data.err_code == 0){
                    this.publicKey = data.public_key;
                }
            },
            async onRegister () {
                let encrypt = new JSEncrypt();
                encrypt.setPublicKey(this.publicKey);
                let password = encrypt.encrypt(md5(md5(this.register.passwd)));
                let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
                let parms = {};
                if (this.urlInfos.sign) {
                    parms = {
                        sign: this.urlInfos.sign,
                        password: password
                    };
                } else {
                    parms = {
                        account: this.register.userName,
                        password: password,
                        code: this.register.code
                    };
                    if (this.register.code == "") {
                        this.$refs.regError.errorInfo("验证码不能为空");
                        return;
                    }
                }

                if (this.register.passwd == "" || this.register.passwdCheck == "") {
                    this.$refs.regError.errorInfo("密码不能为空！");
                    return;
                } else if (this.register.passwd != this.register.passwdCheck) {
                    this.$refs.regError.errorInfo("两次密码不一致！");
                    return;
                } else if (!pattern.test(this.register.userName)) {
                    this.$refs.regError.errorInfo("请输入正确的邮箱信息！");
                    return;
                }

                let {data} = await loginApi.register(parms);
                if (data.err_code == 0){
                    this.loginform.email = this.register.userName;
                    this.loginform.password = this.register.passwd;
                    this.onSubmit();
                }
            },
            async onSubmit () {
                if (this.loginIng) {
                    this.$Message.error('!请不要重复提交');
                    return false;
                }
                this.loginIng = true;
                let {data} = await loginApi.getPublicSecretKey();
                if (data.err_code === 0){
                    let key = data.public_key;
                    this.publicKey = key;
                    let encrypt = new JSEncrypt();
                    encrypt.setPublicKey(key);
                    let password = encrypt.encrypt(md5(md5(this.loginform.password)));
                    let parms = {
                        account: this.loginform.email,
                        password: password
                    };
                    this.loginFun(parms);
                }
            },
            async loginFun(parms){
                let {data} = await loginApi.login(parms);
                if (data.err_code == 0){
                    sessionStorage.removeItem("openMenu");
                    Cookies.set("user", this.loginform.email);
                    localStorage.token = data.token;
                    this.$store.state.msgShow = true;
                    localStorage.msgShow = true;
                    if (localStorage.useList) {
                        this.$store.state.useList = JSON.parse(localStorage.useList);
                    }
                    axios.defaults.headers.common.token = data.token;
                    this.$store.dispatch("getPermissions", {vm: this});
                    this.$store.dispatch("getMenuNav", {vm: this});
                    this.getMsgNoticeNum();
                } else {
                    this.loginIng = false;
                }
            },
            //  重置密码
            async confirmRevision () {
                let encrypt = new JSEncrypt();
                encrypt.setPublicKey(this.publicKey);
                let password = md5(md5(this.resetPassword.passwd));
                let params = {
                    email: this.resetPassword.userName,
                    code: this.resetPassword.code,
                    pwd: password
                };
                if (this.resetPassword.passwd == "" || this.resetPassword.passwdCheck == "") {
                    this.$refs.regError.errorInfo("密码不能为空");
                    return;
                } else if (this.resetPassword.passwd != this.resetPassword.passwdCheck) {
                    this.$refs.regError.errorInfo("两次密码不一致");
                    return;
                } else if (this.resetPassword.code == "") {
                    this.$refs.regError.errorInfo("验证码不能为空");
                    return;
                }
                let {data} = await api.ResetPwd(params);
                if (data.err_code == 0) {
                    this.$Message.success('重置密码成功');
                    this.isRegister = false;
                    this.isReset = false;
                } else {
                    this.$Message.error(data.err_message);
                }
            }

        },
        computed: {},
        watch: {}
    };
</script>

<style lang="less">
    .errorForget {
        margin-top: -10px;
        margin-bottom: 60px;
        font-size: 14px;
        color: #bdbdbd;
        margin-left: 270px;
        cursor: pointer;
        &:hover {
            color: @base;
        }
    }

    .login {
        width: 100%;
        height: 100%;
        position: absolute;
        .loginPrompt {
            color: @orange;
            font-size: 13px;
            letter-spacing: 1px;
            .ivu-icon {
                position: static !important;
                font-size: 20px !important;
                color: @orange;
                vertical-align: bottom;
            }
        }
        &-purple {
            position: absolute;
            top: 0;
            left: 0;
            border-top: 100px solid #3bceb6;
            border-right: 200px solid transparent;
            height: 100%;
            width: 56%;
        }
        .bg {
            //background: url('../assets/images/bg.png');
            width: 100%;
            height: 100px;
            position: absolute;
            z-index: 2;
        }
        &-yellow {
            position: absolute;
            top: 0;
            right: 0;
            // border-bottom: 100px solid #fff;
            // border-left: 200px solid transparent;
            height: 100%;
            width: 40%;
        }
        &-con {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 1071px;
            height: 611px;
            z-index: 999;
            margin-left: -535px;
            margin-top: -305px;
            background: url('https://static.banbooyun.com/static/img/login-bg.png'); //url('../assets/images/login-bg.png');
            .title {
                height: 80px;
                line-height: 80px;
                box-shadow: 0px 5px 5px #e8e8e8;
                font-size: 28px;
                color: #ffa35d;
                padding: 0 20px;
                span {
                    color: #ababab;
                    font-size: 14px;
                    float: right;
                }
            }
            .form-bannger {
                float: left;
                width: 450px;
                background: @red;
                display: inline-block;
                margin-left: 130px;
                margin-top: 150px;
                background: url('https://static.banbooyun.com/static/img/banner.png') no-repeat center; //url('../assets/images/banner.png') no-repeat center; url('http://static.banbooyun.com/static/img/login-bg.png');
                height: 300px;
            }
            .form-con {
                width: 345px;
                float: left;
                display: inline-block;
                margin-top: 115px;

                .loginContent {
                    margin-top: 80px;
                    i {
                        position: absolute;
                        margin-top: -32px;
                        left: 0px;
                        font-size: 22px;
                        color: #cecece;
                    }
                }
                .ivu-btn-loading {
                    .ivu-icon {
                        font-size: 15px;
                        display: inline-block;
                        font-family: Ionicons;
                        speak: none;
                        font-style: normal;
                        font-weight: 300;
                        font-variant: normal;
                        text-transform: none;
                        position: relative;
                        left: 80px;
                        text-rendering: auto;
                        line-height: 1;
                        -webkit-font-smoothing: antialiased;
                    }
                }
                .registerContent {
                    margin-bottom: 24px;
                }
                &-logoImg {
                    height: 50px;
                    background: url('https://static.banbooyun.com/static/img/newLog.png') no-repeat; //url('../assets/images/newLog.png') no-repeat;
                    display: block;
                    background-position-x: 70px;
                    padding-left: 110px;
                    color: @black_2;
                    overflow: hidden;
                    line-height: 70px;
                    font-size: 16px;
                    font-weight: lighter;
                    margin-bottom: 25px;
                }
                .InvitationJoinCompany {
                    padding-bottom: 15px;
                    display: flex;
                    align-items: center;
                    .JoinCompany {
                        color: @ingColor;
                        font-size: 14px;
                        display: flex;
                        align-items: flex-end;
                        em {
                            font-size: 20px
                        }
                    }
                    .JoinCompanySTR {
                        color: #ccc;
                    }
                }
                .ivu-input-group-append {
                    padding: 0 !important;
                    color: #3bceb6;
                    border-radius: 4px !important;
                    background: #fff;
                    cursor: pointer;
                    border: 1px solid transparent;
                    border-left: 1px solid @baseboard;
                    border-bottom: 1px solid @baseboard;
                    p {
                        height: 38px;
                        padding: 4px 7px;
                        line-height: 32px !important;
                    }
                }
                .itemname {
                    font-size: 14px;
                    color: #b2b2b2;
                    padding-left: 10px;
                }
                .ivu-input {
                    border: none;
                    border-bottom: 1px solid @baseboard;
                    border-radius: 0;
                    outline: none;
                    font-size: @fs14 !important;
                    color: @black_2;
                    height: 40px;
                    line-height: 40px;
                    font-weight: lighter;
                    font-family: @ff;
                    padding-left: 35px;
                    &:focus {
                        box-shadow: 0 0 0 0;
                        border-bottom: 1px solid @base;
                    }
                }
                .ivu-input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px white inset;
                    background-image: none;
                    color: @black_2;
                }

                .icon-mima1 {
                    font-size: 20px;
                    margin-top: -33px;
                    color: #cecece;

                }
                .inputPosition {
                    position: absolute;
                    width: 282px;
                    z-index: 12;

                    .icon {
                        color: #3bceb6 !important;
                    }
                }
                .ivu-btn-primary {
                    width: 240px;
                    height: 42px;
                    // background: #544c93;
                    // border: 1px solid #544c93;
                    font-size: 20px;
                    margin-left: 50px;
                    font-weight: lighter;
                    background: @base;
                    border-width: 0px;
                    margin-top: 0px;
                    span {
                        width: 210px;
                        font-size: 14px;
                        line-height: 42px;
                    }
                }
                .ivu-form-item {
                    margin-bottom: 22px;
                }
                .lookPas {
                    position: absolute;
                    right: -46px;
                    margin-top: -30px;
                    cursor: pointer;
                    color: #bdbdbd;
                }
                .loginText {
                    display: block;
                    text-align: center;
                    margin-top: 10px;
                    font-size: 12px;
                    font-weight: lighter;
                    color: #bdbdbd;

                    span {
                        cursor: pointer;
                        color: #3bceb6;
                        text-decoration-line: underline;
                        &:hover {
                            text-decoration-line: none;
                        }
                    }
                }
                img {
                    width: 30px;
                    position: absolute;
                    right: 0;
                    margin-top: -40px;
                }
                .resetPwd {
                    height: 50px;
                    display: block;
                    background-position-x: 70px;
                    padding-left: 135px;
                    color: @black_2;
                    overflow: hidden;
                    line-height: 70px;
                    font-size: 16px;
                    font-weight: lighter;
                    // margin-bottom: 20px;
                }
                .tipsMessage {
                    text-align: center;
                    color: #ababab;
                    font-size: 12px;
                    margin-bottom: 20px;
                }
                .form_back {
                    font-size: 14px;
                    color: @base;
                }
            }
        }
    }

    .loginFooder {
        position: absolute;
        z-index: 1111;
        width: 100%;
        color: #3bceb6;
        text-align: center;
        padding-left: 100px;
        bottom: -20px;
        margin-left: 22px;
    }

    .errorHint {
        position: absolute;
        color: @red;
        margin-top: -20px;
        font-size: 14px;
        span {
            margin-right: 5px;
        }
    }
</style>
