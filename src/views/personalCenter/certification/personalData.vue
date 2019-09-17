<template>
    <!-- 个人中心页面 另有一个info,不清楚是不是在用-->
    <div class="personalData">
        <!-- 个人头像 -->
        <section class="iconheadPortrait" style="display: flex;flex-direction: row;">
            <p class="title">个人头像</p>
            <div class="headPortraitMain avatar">
                <!--FileUploadedSuccess上传成功的回调  UploadProgress 选择文件并确定回调-->
                <head-upload :parameter="{type: 'avatar'}"
                             :fileType="[{title: 'Image files',extensions: 'jpg,gif,png'}]" :id="uploadId"
                             v-if="!uploadImgStatus" v-on:FileUploadedSuccess="FileUploadedSuccess"
                             v-on:UploadProgress="UploadProgress" :isShowProgress="false">
                    <template slot="upload" style="position: relative;padding-left:32px;padding-bottom:20px;">
                        <div v-if="fileShow">
                            <img v-if="formInline.headimage " :src="defaultUrl" class="avatarImg"
                                 style="cursor: pointer;">
                            <button :id="uploadId" class="btn">选择文件</button>
                            <div class="shade">
                                <Icon type="camera" size="20"></Icon>
                            </div>
                        </div>
                    </template>
                </head-upload>
                <p class='userImageText des'>点击上传头像</p>
                <p class='userImageText notice'>（限jpg,png,gif格式，头像建议大小 200*200）</p>
            </div>
        </section>
        <!-- 基本资料 -->
        <section class="headPortrait">
            <p class="title">基本资料</p>
            <Form class="headPortraitMain" ref="formInline" label-position="right" :model="formInline"
                  :rules="ruleInline" :label-width="80">
                <!--<div>-->
                <!--<FormItem prop="basic">-->
                <!--<span v-model="formInline.account">{{formInline.account}}</span>-->
                <!--</FormItem>-->
                <!--</div>-->

                <FormItem prop="nickname" label='昵称'>
                    <Input type="text" style="width:430px;" size="large" @change.native="changeNickname('nickname')"
                           v-model="formInline.nickname"
                           placeholder="输入您的昵称"></Input>
                </FormItem>


                <FormItem prop="realname" label='姓名'>
                    <Input type="text" style="width:430px;" size="large" @change.native="changeNickname('realname')"
                           v-model="formInline.realname"
                           placeholder="输入您的姓名"></Input>
                </FormItem>
                <!-- v-if="userInfo.from!='company'" -->
                <FormItem prop="job" label='职位'>
                    <div style="width: 430px">
                        <!-- <be-good :job="formInline.job" @ReceiveData="ReceiveData"></be-good> -->
                        <choosebe-good :job="userInfo" @ReceiveData="ReceiveData"></choosebe-good>
                    </div>

                    <!--<Input type="text" style="width:430px;" size="large" @change.native="changeNickname('job')" v-model="formInline.job" placeholder='输入您的擅长能力，如 “原画”、“模型”，“动作”'></Input>-->
                </FormItem>
            </Form>
        </section>
        <!-- 修改密码 -->
        <section class="headPortrait">
            <p class="title">修改密码
                <img style="vertical-align: middle;cursor:pointer;" width="20" height="20" :src="pwpic3.src"
                     @click="changeType()"/>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="headPortraitMain"
                  label-position="right" :label-width="84">
                <FormItem label='原始密码' prop="currentPassword" style="margin-bottom:23px;">
                    <Input style="width:430px;" size="large" v-model="formValidate.currentPassword"
                           :type="pwpic3.pwdType3" placeholder="输入原始密码（6-32位）"></Input>
                </FormItem>
                <FormItem label='新密码' prop="newPassword" style="margin-bottom:23px;">
                    <Input style="width:430px;" size="large" v-model="formValidate.newPassword" :type="pwpic3.pwdType3"
                           placeholder="输入新密码（6-32位）"></Input>
                </FormItem>
                <FormItem label='确认密码' prop="repPassword" style="margin-bottom:16px">
                    <Input style="width:430px;" size="large" v-model="formValidate.repPassword" :type="pwpic3.pwdType3"
                           placeholder="请确认密码"></Input>
                </FormItem>
                <!-- <FormItem> -->
                <Button type="primary" class='passwordbtn' v-on:click.native="handleSubmit('formValidate')">确认修改
                </Button>
                <!-- </FormItem> -->
            </Form>
        </section>
        <!-- 手机号绑定 -->
        <section class="headPortrait" style="padding-top: 20px;">
            <p class="mobileTitle">手机</p>
            <!-- <div v-if="userInfo.phone" class="headPortraitMain">
              <div><span>{{userInfo.phone}}</span><span class="sign">已认证</span></div>
              <Button class="marginBtn" @click="mobileShow = true" >修改</Button>
            </div>
            <div v-else  @click="mobileShow = true" class="phoneContainer">完善您的手机号</div> -->
            <div v-if="userInfo.phone">
                <div class="certificate" style="margin-top: -33px;">
                    <span
                        style="color:#3dcfb7;font-size:15px;margin-right:10px;margin-left:12px;">{{userInfo.phone}}</span>
                    <Icon type="ios-checkmark" style='font-size:20px;' color="#3bceb6"></Icon>
                    <span class="sign" style="margin-left: 4px;font-size: 14px;color: #31bb9f;">已认证</span>
                </div>
                <Button type="primary" class="marginBtn" @click="revisePhoneNum">修改</Button>
            </div>
            <Form :label-width="80" v-else>
                <FormItem label="手机绑定">
                    <Input placeholder="请输入您的手机号码" style="width:430px;" size="large" @on-focus="bindPhoneNum"></Input>
                </FormItem>
            </Form>
        </section>
        <!-- 邮箱 -->
        <section class="headPortrait">
            <p class="emailTitle">邮箱</p>
            <div v-if="userInfo.email">
                <div class="certificate" style="margin-top: -30px;">
                    <span
                        style="color:#3dcfb7;font-size:15px;margin-right:10px;margin-left:12px;">{{userInfo.email}}</span>
                    <Icon type="ios-checkmark" style='font-size:20px;' color="#3bceb6"></Icon>
                    <span class="sign" style="margin-left: 4px;font-size: 14px;color: #31bb9f;">已认证</span>
                </div>
                <Button type="primary" class="marginBtn" @click="reviseEmail">修改</Button>
            </div>
            <!-- <span style="font-size: 16px;" v-else>
              邮箱未认证
            </span> -->
            <Form :label-width="80" v-else>
                <FormItem label="邮箱绑定">
                    <Input placeholder="请输入您的邮箱" style="width:430px;" size="large" @on-focus="bindEmail"></Input>
                </FormItem>
            </Form>
        </section>
        <!-- 个人离开团队 -->
        <section class="headPortrait" style="padding-bottom:20px;">
            <p class="title">所属团队</p>
            <div v-if="userInfo.company_name">
                <Form>
                    <FormItem label="公司名称">
                        <Input v-model="userInfo.company_name" disabled style="width:430px;" size="large"></Input>
                    </FormItem>
                </Form>
                <Button type="ghost" class="leaveBtn" @click="clickLeaveCompany"
                        v-if="!userInfo.is_leader && userInfo.from!='company'">离开团队
                </Button>
            </div>
            <Form :label-width="80" v-else>
                <FormItem label="公司名称">
                    <Input placeholder="暂未加入公司" style="width:430px;" size="large"></Input>
                </FormItem>
                <!-- 加入团队操作，暂时都隐藏 -->
                <!-- <Button type="primary" class='jionBtn' @click="jionCompany">加入公司</Button> -->
            </Form>
        </section>
        <!--加入公司-->
        <perfect v-if="isproject" @coloseFlag="isproject=false" ref="perfect"></perfect>
        <!-- 修改邮箱对话框 -->
        <div class="headPortraitMain">
            <!-- <div>
              <span style="color:#3dcfb7;font-size:15px;padding-right:30px;">{{userInfo.email}}</span>
              <Icon type="ios-checkmark" size="100px" color="#3bceb6"></Icon>
              <span class="sign">已认证</span>
            </div> -->
            <Modal class="changeMailDialog" v-model="emailShow" width="660" :title="emailTitle">
                <Form ref="emailValidate" :model="emailValidate" :rules="ruleValidate" label-position="right"
                      :label-width="84" style="margin-top:30px;">
                    <FormItem label="登录密码" prop="ePassword">
                        <Input v-model="emailValidate.ePassword" size="large" style="width:530px;" type="password"
                               placeholder="输入登录密码完成身份验证" autocomplete='off'></Input>
                    </FormItem>
                    <FormItem label="邮箱" prop="address">
                        <Input v-model="emailValidate.address" size="large" style="width:530px;" type="text"
                               placeholder="输入您的新邮箱"></Input>
                    </FormItem>
                    <FormItem label="验证码" prop="emailCode">
                        <Input v-model="emailValidate.emailCode" size="large" style="width:530px;" type="text"
                               placeholder="请输入验证码">
                        <div class="code-text" @click="sendCode('email')" slot="append">{{authCode === '获取验证码' ?
                            authCode : authCode + 's后重新获取验证码'}}
                        </div>
                        </Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" size="large" style="font-size: 13px" @click="cancelModal">取消</Button>
                    <Button type="primary" size="large" style="font-size: 13px" @click="handleSubmit('emailValidate')">
                        确认修改
                    </Button>
                </div>
            </Modal>
        </div>
        <!-- 修改 / 完善手机对话框 -->
        <Modal class="changeMobileWindow" v-model="mobileShow" width="660" :title="modalTitle">
            <Form ref="mobileValidate" :model="mobileValidate" :rules="ruleValidate" label-position="right"
                  :label-width="85">
                <FormItem prop="mPassword" label="身份验证">
                    <Input type="password" size="large" v-model="mobileValidate.mPassword" placeholder="请输入登录密码进行验证"
                           autocomplete='off'></Input>
                </FormItem>
                <FormItem prop="phoneNumber" label="手机号">
                    <Input type="text" size="large" v-model="mobileValidate.phoneNumber" placeholder="请输入手机号"></Input>
                </FormItem>
                <FormItem prop="mobileCode" label="验证码">
                    <Input type="text" size="large" v-model="mobileValidate.mobileCode" placeholder="请输入验证码">
                    <div class="code-text" @click="sendCode('phone')" slot="append">{{authCode === '获取验证码' ? authCode :
                        authCode + 's后重新获取验证码'}}
                    </div>
                    </Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" style="font-size:13px" @click="cancelModal">取消</Button>
                <Button type="primary" size="large" style="font-size:13px" @click="handleSubmit('mobileValidate')">
                    确认修改
                </Button>
            </div>
        </Modal>
        <!-- 加入公司团队对话框 -->
        <Modal class="changeMobileWindow" v-model="companyShow" width="660" title="加入团队">
            <div class="joinCompany">
                <dl>
                    <dt>团队公司名称</dt>
                    <dd>
                        <input v-model="joinCompany.companyName" type="text" placeholder="输入加入团队公司名称 （必填）"
                               @keyup="serchCompany(joinCompany.companyName)"/>
                        <i class="iconfonts icon-findmore"></i>
                        <ul v-if="companyData.companyFlag" class="companylist">
                            <li v-for="(item,index) in companyData.companyList" @click="selectedCompanyFun(item)"
                                :key="index">{{item.company}}
                            </li>
                        </ul>
                    </dd>
                    <dt>真实姓名</dt>
                    <dd>
                        <input v-model="joinCompany.realName ? joinCompany.realName : formInline.realname" type="text"
                               placeholder="输入您的姓名、方便团队沟通 （必填）"/>
                    </dd>
                </dl>
            </div>
            <div slot="footer" class="toConfirm">
                <Button type="primary" size="large" style="font-size:13px" @click="saveData">保存</Button>
            </div>
        </Modal>
        <!-- 离开公司团队对话框 -->
        <Modal class="changeMobileWindow" v-model="leaveCompany" width="660" title="确认离开公司">
            <p class="titlePrompt"><span class="icon">!</span>离开公司将不能在参与项目管理、任务制作等相关事项</p>
            <div slot="footer" class="toConfirm">
                <Button type="text" size="large" style="font-size:13px" @click="cancelModal">取消</Button>
                <Button type="primary" size="large" style="font-size:13px" @click="confirmLeave">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import perfect from "../../main-components/perfect.vue";
    import beGood from "../../../components/beGood";
    import choosebeGood from "../../../components/chooseBeGood";
    import api, {userInfosApi} from "api";
    import {mapMutations, mapActions} from "vuex";
    import md5 from "md5";
    import "../cropper.min.css";
    import src from "@/assets/images/close_eyes.png";
    import src2 from "@/assets/images/open_eyes.png";
    import headUpload from "@/components/upload";
    import VTest from "../../../components/vTest.vue"; // 上传文件组件
    export default {
        components: {
            VTest,
            headUpload,
            perfect,
            beGood,
            choosebeGood
        },
        created() {
            this.getUserInfo();
        },
        computed: {
            uploadId() {
                return "upload" + Math.random();
            }
        },
        data() {
            const phoneNumber = (rule, value, callback) => {
                let reg = new RegExp(
                    /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
                );
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error("请输入合法的手机号"));
                }
            };
            const repPassword = (rule, value, callback) => {
                if (this.formValidate.newPassword === this.formValidate.repPassword) {
                    callback();
                } else {
                    callback(new Error("请确认密码"));
                }
            };
            const newPassword = (rule, value, callback) => {
                let reg = new RegExp(/^\S{6,32}$/);
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error("请输入合法的密码"));
                }
            };

            return {
                isproject: false,
                timer: null,
                is_success: null,
                pwpic3: {
                    pwdType3: "password",
                    src
                },
                secretKey: null,
                cropper1: {},
                option1: {
                    showCropedImage: false,
                    cropedImg: ""
                },
                defaultUrl: null,
                editImgShow: true,
                authCode: "获取验证码",
                userId: null,
                mobileShow: false,
                emailShow: false,
                emailTitle: '',
                companyShow: false,
                leaveCompany: false,
                files: [],
                loadingStatus: false,
                userInfo: {},
                formValidate: {
                    currentPassword: ""
                },
                mobileValidate: {},
                emailValidate: {},
                companyValidate: {},
                ruleInline: {},
                formInline: {},
                ruleValidate: {
                    currentPassword: [
                        {required: true, message: "请输入密码", trigger: "blur"},
                        {
                            type: "string",
                            max: 32,
                            min: 6,
                            message: "请输入合法的密码",
                            trigger: "blur"
                        }
                    ],
                    newPassword: [
                        {required: true, message: "请输入新密码", trigger: "blur"},
                        {
                            // type: "string",
                            // max: 32,
                            // min: 6,
                            validator: newPassword,
                            message: "请输入合法的密码",
                            trigger: "blur"
                        }
                    ],
                    repPassword: [
                        {required: true, message: "请确认密码", trigger: "blur"},
                        {
                            validator: repPassword,
                            message: "两次密码必须相同",
                            trigger: "blur"
                        }
                    ],
                    address: [
                        {required: true, message: "请输入邮箱地址", trigger: "blur"},
                        {type: "email", message: "请输入合法的邮箱地址", trigger: "blur"}
                    ],
                    emailCode: [
                        {required: true, message: "请输入验证码", trigger: "blur"}
                    ],
                    phoneNumber: [
                        {required: true, message: "请输入手机号", trigger: "blur"},
                        {validator: phoneNumber, trigger: "blur"}
                    ],
                    mobileCode: [
                        {required: true, message: "请输入验证码", trigger: "blur"}
                    ],
                    mPassword: [{required: true, message: "请输入密码", trigger: "blur"}],
                    ePassword: [{required: true, message: "请输入密码", trigger: "blur"}],
                    job: [{required: true, message: "请输入职业", trigger: "blur"}]
                },
                fileShow: true, // 文件上传
                fileList: [], // 拿到的上传头像的图片
                uploadImgStatus: false,
                modalTitle: "",
                joinCompany: {
                    companyName: null,
                    realName: null,
                    companyId: null
                },
                companyData: {
                    companyFlag: false,
                    companyList: []
                },
                updateHeadImg: null
            };
        },
        methods: {
            ...mapMutations(["setIsproject", "setPerfectType", "autoChangeHeadImg"]),
            ReceiveData(val) {
                // this.formInline.job = val.childID;
                this.formInline.job = val.id;
                this.userInfo.job = val.name;
                this.changeNickname("job");
            },
            // 获取用户信息
            async getUserInfo() {
                this.userId = sessionStorage.getItem("userId");
                let {data} = await api.getUserInfoById({id: this.userId});
                if (data.err_code == 0) {
                    this.userInfo = data;
                    this.formInline = data;
                    this.defaultUrl = this.userInfo.headimage;
                }
            },
            // 更改用户信息
            async changeNickname(type) {
                let parms = null;
                switch (type) {
                    case "nickname":
                        parms = {id: this.userId, nickname: this.formInline.nickname};
                        if (this.formInline.nickname === "") {
                            this.messageError("昵称不能为空");
                            return false;
                        }
                        break;
                    case "realname":
                        parms = {id: this.userId, realname: this.formInline.realname};
                        if (this.formInline.realname === "") {
                            this.messageError("姓名不能为空");
                            return false;
                        }
                        break;
                    case "headimage":
                        parms = {id: this.userId, headimage: this.updateHeadImg};
                        break;
                    case "job":
                        parms = {id: this.userId, job: this.formInline.job};
                        break;
                }
                let {data} = await userInfosApi.userUpdata(parms);
                if (data.err_code == 0) {
                    this.messageSuccess("修改成功");
                    if (localStorage.userMsg) {
                        let UserInfo = JSON.parse(localStorage.userMsg);
                        UserInfo.realname = this.formInline.realname;
                        localStorage.userMsg = JSON.stringify(UserInfo);
                    }
                }
            },
            // 上传个人头像
            UploadProgress(uploader) {
                this.fileShow = true;
                uploader.files[0].name = this.userId;
            },

            FileUploadedSuccess(uploader) {
                this.fileShow = true;
                let newHead = JSON.parse(uploader.response).file_url;
                this.updateHeadImg = newHead + "?" + new Date().getTime();
                this.formInline.headimage = this.updateHeadImg;
                this.defaultUrl = this.updateHeadImg;
                this.autoChangeHeadImg(this.updateHeadImg);
                this.changeNickname("headimage");
            },

            // 邮箱、手机验证
            sendCode(type) {
                if (this.authCode !== "获取验证码") {
                    return false;
                }
                let fn = async () => {
                    let ajaxType = null;
                    let obj = null;
                    if (type === "email") {
                        ajaxType = "sendUserEmailCode";
                        obj = {
                            email: this.emailValidate.address,
                            password: this.emailValidate.ePassword
                        };
                        if (type === "email" && !(this.emailValidate.ePassword && this.emailValidate.address)) {
                            this.messageError("密码或邮箱不能为空");
                            return;
                        }
                    } else {
                        ajaxType = "sendUserPhoneCode";
                        obj = {
                            phone: this.mobileValidate.phoneNumber,
                            password: this.mobileValidate.mPassword
                        };
                        if (type === "phone" && !(this.mobileValidate.mPassword && this.mobileValidate.phoneNumber)) {
                            this.messageError("密码或手机不能为空");
                            let reg = new RegExp(
                                /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
                            );
                            if (!reg.test(this.mobileValidate.phoneNumber)) {
                                this.messageError("请输入正确的格式的手机号");
                                return;
                            }
                            return;
                        }
                    }
                    let {data} = await api[ajaxType](obj);
                    if (data.err_code === 0) {
                        this.$Message.success("验证码已发出，请注意查收");
                        this.getCodeTime();
                    } else {
                        this.$Message.error(data.err_message);
                    }
                };

                this._reduce(fn);
            },
            // 获取验证码事件
            getCodeTime() {
                this.authCode = 60;
                const timeId = setInterval(() => {
                    this.authCode--;
                    if (this.authCode <= 0) {
                        this.authCode = "获取验证码";
                        clearInterval(timeId);
                    }
                }, 1000);
            },
            // 更改邮箱
            async updateEmail() {
                let obj = {
                    email: this.emailValidate.address,
                    password: this.emailValidate.ePassword,
                    code: this.emailValidate.emailCode
                };
                let {data} = await userInfosApi.saveEmail(obj);
                if (data.err_code === 0) {
                    this.$Message.success("修改成功");
                    this.emailShow = false;
                    this.clearData("emailValidate");
                    this.getUserInfo();
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            // 更改手机号
            async updatePhone() {
                let obj = {
                    phone: this.mobileValidate.phoneNumber,
                    password: this.mobileValidate.mPassword,
                    code: this.mobileValidate.mobileCode
                };
                let {data} = await userInfosApi.savePhone(obj);
                if (data.err_code === 0) {
                    this.mobileShow = false;
                    this.getUserInfo();
                    this.messageSuccess("修改成功");
                    this.clearData("mobileValidate");
                } else {
                    this.messageError(data.err_message);
                }
            },
            // 绑定手机号弹出对话框
            bindPhoneNum() {
                this.mobileShow = true;
                this.modalTitle = "完善手机";
            },
            revisePhoneNum() {
                this.mobileShow = true;
                this.modalTitle = "修改手机";
            },
            // 绑定邮箱
            bindEmail() {
                this.emailShow = true;
                this.emailTitle = "完善邮箱";
            },
            reviseEmail() {
                this.emailShow = true;
                this.emailTitle = "修改邮箱";
            },
            // 提交按钮
            handleSubmit(name) {
                let fn = () => {
                    this.$refs[name].validate(valid => {
                        if (valid) {
                            if (name === "emailValidate") {
                                this.updateEmail();
                            } else if (name === "mobileValidate") {
                                this.updatePhone();
                            } else {
                                this.passwordCorrelation();
                            }
                        } else {
                            this.messageError("提交失败");
                        }
                    });
                };
                this._reduce(fn);
            },
            // 取消Model对话框
            cancelModal() {
                this.emailShow = false;
                this.mobileShow = false;
                this.leaveCompany = false;
            },
            // 修改密码
            async passwordCorrelation() {
                // 获取秘钥
                let {data} = await userInfosApi.getPublicSecretKey();
                if (data.err_code == 0) {
                    this.secretKey = data.public_key;
                    this._verifyPassword();
                }
            },
            // 验证密码
            async _verifyPassword(type) {
                let encrypt = new JSEncrypt(); // 新建JSEncrypt对象
                encrypt.setPublicKey(this.secretKey); // 设置公钥
                let password = null;
                if (type === "email") {
                    password = encrypt.encrypt(md5(md5(this.emailValidate.ePassword))); // 对密码进行加密
                } else if (type === "phone") {
                    password = encrypt.encrypt(md5(md5(this.mobileValidate.mPassword)));
                } else {
                    password = encrypt.encrypt(
                        md5(md5(this.formValidate.currentPassword))
                    );
                }
                let {data} = await userInfosApi.chackUserpassword({password: password});
                if (data.err_code == 0) {
                    this.is_success = data.is_success;
                    this._editPassword(data.is_success);
                }
            },
            // 修改密码
            async _editPassword(is_success) {
                if (is_success !== "1") {
                    this.messageError("原始密码错误！");
                    return false;
                }
                let encrypt = new JSEncrypt();
                encrypt.setPublicKey(this.secretKey);
                let password = encrypt.encrypt(md5(md5(this.formValidate.newPassword)));
                let {data} = await userInfosApi.savePassword({id: this.userId, password: password});
                if (data.err_code == 0) {
                    this.clearData("formValidate");
                    this.messageSuccess("修改成功！");
                }
            },

            // 显示密码
            changeType() {
                this.pwpic3.pwdType3 = this.pwpic3.pwdType3 == "password" ? "text" : "password";
                this.pwpic3.src = this.pwpic3.src == src ? src2 : src;
            },
            _reduce(fn) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    fn();
                }, 800);
            },

            clearData(data) {
                for (let k in this[data]) {
                    delete this[data][k];
                }
            },
            messageSuccess(data) {
                this.$Message.success(data);
            },
            messageError(data) {
                this.$Message.error(data);
            },
            // 加入公司
            jionCompany() {
                this.isproject = true;
                this.setIsproject();
                this.$nextTick(() => {
                    this.$refs.perfect.selectFun(1, true);
                });
            },
            async serchCompany(val) {
                let res = await api.joinSerchCompany({company_name: val});
                if (res.data.err_code == 0) {
                    this.companyData.companyList = res.data.data || [];
                    if (res.data.data.length > 0) {
                        this.companyData.companyFlag = true;
                    } else {
                        this.companyData.companyFlag = true;
                        this.companyData.companyList = [];
                        this.companyData.companyList.push({
                            company: "暂无此公司",
                            id: "noCompany"
                        });
                    }
                }
            },
            //选择公司
            selectedCompanyFun(item) {
                this.companyData.companyFlag = false;
                if (item.id != "noCompany") {
                    this.joinCompany.companyId = item.id;
                    this.joinCompany.companyName = item.company;
                } else {
                    this.joinCompany.companyName = null;
                }
            },

            saveData() {
                let _this = this;
                let Data = _this.joinCompany;
                if (
                    !Data.companyName ||
                    Data.companyName == null ||
                    Data.companyName == "" ||
                    Data.companyName.length <= 0
                ) {
                    _this.$Message.error("请输入公司名称！");
                } else {
                    if (!Data.companyId) {
                        _this.serchCompany(Data.companyName);
                    } else {
                        if (
                            !Data.realName ||
                            Data.realName == null ||
                            Data.realName == "" ||
                            Data.realName.length <= 0
                        ) {
                            _this.$Message.error("请输入真实姓名！");
                        } else {
                            let params = {
                                company_id: Data.companyId,
                                realname: Data.realName
                            };
                            let joinCompany = async function () {
                                let res = await api.joinCompanyFun(params);
                                if (res.data.err_code == 0) {
                                    _this.$Message.success("等待公司审核！");
                                    localStorage.isproject = `false`;
                                    localStorage.isjump = false;
                                    _this.$store.commit("setbreakJump", false);
                                    _this.setIsproject();
                                    _this.$store.dispatch("createNav");
                                } else {
                                    _this.$Message.error(res.data.err_message);
                                }
                                _this.companyShow = false;
                            };
                            joinCompany();
                        }
                    }
                }
            },
            // 离开公司团伙
            clickLeaveCompany() {
                this.leaveCompany = true;
            },
            // 确认离开公司团队
            async confirmLeave() {
                let res = await api.leaveCompany();
                if (res.data.err_code == 0) {
                } else {
                    this.$Message.warning("请求失败");
                }
                this.leaveCompany = false;
            }
        },
        filters: {
            codePrompt(value) {
                if (typeof value === "string") {
                    return value + "s后重获验证码";
                }
            }
        }
    };
</script>
<style lang="less">
    .personalData {
        height: 100%;
        padding: 20px 0 0 20px;
        border-radius: 4px;
        background: #fff;
        margin-bottom: 30px;
        box-shadow: @boxShadow;
        .iconheadPortrait {
            padding-top: 10px;
            padding-bottom: 30px;
            position: relative;
        }
        .headPortrait {
            position: relative;
            .ivu-form-item {
                margin-bottom: 16px;
            }
            .ivu-form-item-label {
                font-size: 13px;
                color: #dfdfdf !important;
            }

            .certificate {
                margin-left: 100px;
                margin-bottom: 20px;
            }
            .marginBtn {
                margin-left: 422px;
                float: left;
                margin-top: -50px;
                max-width: 92px;
                height: 34px;
                border-radius: 3px;
                line-height: 34px;
            }
            .passwordbtn {
                max-width: 92px;
                height: 34px;
                line-height: 34px;
                margin-left: 422px;
                border-radius: 3px;
            }
            .jionBtn {
                margin-left: 400px;
            }
            .leaveBtn {
                max-width: 92px;
                height: 34px;
                background: #fff;
                color: @red;
                border-color: @red;
                margin-left: 411px;
                margin-bottom: 20px;
            }
            .sign {
                margin-left: 10px;
                font-size: 15px;
                color: @base;
            }
            .upLoadImg {
                display: inline-block;
                position: absolute;
                top: 0;
                left: 32px;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                opacity: 0;
            }
            .ivu-form-item-label {
                font-size: 13px;
                padding: 11px 22px 12px 0px;
                color: #c3cbd6 !important;
            }
            .ivu-input {
                font-size: 14px;
                color: @black_2 !important;
            }
            .ivu-input-group-append {
                background: #fff;
                padding: 0px 20px 0px 20px;
            }
        }
        .headPortraitMain {
            .avatar {
                p:nth-of-type(1) {
                    margin: 5px 0 10px 0;
                    color: black;
                }
                p:nth-of-type(2) {
                    color: #aeaeae;
                }
            }
            .userImageText {
                text-align: center;
                font-size: 14px;
                color: @black_3;
            }
            .userImageText.des {
                margin-top: -18px;
            }
            .userImageText.notice {
                margin-top: -2px;
            }
            .headPortraitImg,
            .avatarImg {
                width: 70px;
                height: 70px;
                font-size: 57px;
                border-radius: 50%;
            }
            .ivu-form-item {
                .ivu-btn,
                .jionBtn {
                    min-width: 100px;
                    height: 38px;
                    background: #3dcfb7;
                    color: #fff;
                }
                .ivu-form-item-label {
                    font-size: 13px;
                    padding: 11px 22px 12px 0px;
                    color: #c3cbd6 !important;
                }
            }
            .uploadContainer {
                height: 75px;
                text-align: center;
                .btn {
                    position: absolute;
                    top: 0;
                    // left: 112px;
                    left: 37%;
                    width: 75px;
                    height: 75px;
                    cursor: pointer;
                    opacity: 0;
                }
                .shade {
                    width: 70px;
                    height: 70px;
                    line-height: 70px;
                    border: 1px dashed #d7dde4;
                    border-radius: 4px;
                    text-align: center;
                    position: absolute;
                    top: 0;
                    overflow: hidden;
                    opacity: 0;
                }
            }
        }
        .title {
            padding-right: 23px;
            font-size: 14px;
            color: @black_3;
            padding-bottom: 10px;
        }
        .mobileTitle,
        .emailTitle {
            .title;
        }
    }

    .changeMailDialog,
    .changeMobileWindow {
        .joinCompany {
            dl {
                dt {
                    font-size: 15px;
                    color: #969595;
                }
                dd {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    margin: 15px 0;
                    .joinType {
                        width: 48%;
                        padding: 15px;
                        position: relative;
                        color: @white;
                        border-radius: 2px;
                        &.selectedSty {
                            box-shadow: 5px 5px 10px -5px #383131 !important;
                        }
                        &:hover {
                            cursor: pointer;
                            box-shadow: 5px 5px 10px -5px #383131;
                        }
                        &:before {
                            content: "";
                            opacity: 0.3;
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-position: bottom right !important;
                            background-size: 30% !important;
                        }
                        &:nth-child(1) {
                            background: #3bceb6;
                            &:before {
                                // background: url("../../assets/images/perfectformationWeite2.png") no-repeat;
                            }
                        }
                        &:nth-child(2) {
                            background: #7cbefc;
                            &:before {
                                // background: url("../../assets/images/perfectformationWeite1.png") no-repeat;
                            }
                        }
                        p {
                            font-size: 15px;
                        }
                        span {
                            display: inline-block;
                            margin-top: 5px;
                        }
                    }
                    input {
                        border: 1px solid #eae9e9;
                        width: 100%;
                        padding: 8px 5px;
                        border-radius: 3px;
                        outline: none;
                    }
                    input::-webkit-input-placeholder {
                        color: #ccc;
                    }
                    .icon-findmore {
                        position: absolute;
                        right: 12px;
                        top: 10px;
                        color: #ccc;
                        font-size: 18px;
                    }
                    .companylist {
                        max-height: 160px;
                        overflow: auto;
                        position: absolute;
                        left: 0;
                        background: @white;
                        width: 100%;
                        top: 35px;
                        border: 1px solid #eae9e9;
                        z-index: 2;
                        &::-webkit-scrollbar-thumb {
                            /*滚动条里面小方块*/
                            border-radius: 3px;
                            -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
                            background: rgba(0, 0, 0, 0.2);
                        }
                        &::-webkit-scrollbar-track {
                            /*滚动条里面轨道*/
                            -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
                            border-radius: 0;
                            background: rgba(0, 0, 0, 0.1);
                        }
                        &::-webkit-scrollbar {
                            width: 3px !important;
                            background: #f5f5f5;
                        }
                        li {
                            padding: 10px;
                            border-bottom: 1px solid #eae9e9;
                            &:hover {
                                cursor: pointer;
                                background: @base;
                                color: @white;
                            }
                        }
                    }
                }
            }
            button {
                width: 100%;
                border: 0;
                padding: 10px 0;
                border-radius: 3px;
                font-size: 14px;
                color: #fff;
                background: @base;
                margin-top: 15px;
                outline: none;
                &:hover {
                    cursor: pointer;
                    background: @base_dark;
                }
            }
        }

        .titlePrompt {
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 16px;
            color: @orange;
            margin-bottom: 20px;
            .icon {
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-right: 16px;
                color: #fff;
                background-color: @orange;
                border: 1px solid @orange;
                border-radius: 50%;
                text-align: center;
                line-height: 16px;
            }
        }
        .ivu-modal-wrap {
            .ivu-modal {
                .ivu-modal-content {
                    .ivu-modal-close {
                        .ivu-icon {
                            padding-right: 8px;
                        }
                    }
                    .ivu-modal-header {
                        margin-bottom: 30px;
                        margin-bottom: 30px;
                        .ivu-modal-header-inner {
                            padding-left: 15px;
                        }
                    }
                    .ivu-modal-body {
                        padding: 0px 30px;
                        .ivu-form {
                            .ivu-form-item {
                                .ivu-form-item-label {
                                    font-size: 13px;
                                    padding: 11px 22px 12px 0px;
                                    color: #c3cbd6 !important;
                                }
                                .ivu-form-item-content {
                                    .ivu-input-wrapper {
                                        padding-right: 15px;
                                        .ivu-input-group-append {
                                            background: #fff;
                                            padding: 0px 20px 0px 20px;
                                            .code-text {
                                                min-width: 70px;
                                                cursor: pointer;
                                                &:hover {
                                                    color: @base;
                                                }

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .ivu-modal-footer {
                        border-top-style: none;
                        div {
                            padding: 0 15px 30px 15px;
                            // .ivu-btn:first-child{
                            //   .ivu-btn-text.active, .ivu-btn-text:active {
                            //       color: #2b85e4;
                            //       background-color: transparent;
                            //       border-color: transparent;
                            //   }
                            // }
                        }
                    }
                }
            }
        }
    }
</style>
