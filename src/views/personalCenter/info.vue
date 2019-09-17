<template>
    <div class="personalInfo">
        <section class="headPortrait">
            <p class="title">个人头像</p>
            <div class="headPortraitMain avatar">
                <div style="position: relative">
                    <img v-if="formInline.headimage" :src="defaultUrl" class="avatarImg" alt="头像">
                    <Avatar v-else class="headPortraitImg" icon="person" size="large"/>
                    <Upload
                        class="upLoadImg"
                        ref="upload"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        multiple
                        type="drag"
                        :action="imgUrl"
                        :on-success="upLoadImg"
                    >
                        <div style="width: 70px;height:70px;line-height: 70px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                </div>
                <p>点击上传头像</p>
                <p>（限jpg,png,gif格式，头像建议大小 200*200）</p>
            </div>

        </section>
        <section class="headPortrait">
            <p class="title">基本资料</p>
            <Form class="headPortraitMain" ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <!--<div>-->
                <!--<FormItem prop="basic">-->
                <!--<span v-model="formInline.account">{{formInline.account}}</span>-->
                <!--</FormItem>-->
                <!--</div>-->
                <div>
                    <FormItem prop="nickname">
                        <Input type="text" @change.native="changeNickname('nickname')" v-model="formInline.nickname"
                               placeholder="输入您的昵称"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="realname">
                        <Input type="text" @change.native="changeNickname('realname')" v-model="formInline.realname"
                               placeholder="输入您的姓名"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="job">
                        <Input type="text" @change.native="changeNickname('job')" v-model="formInline.job"
                               placeholder='输入您的工种如 “原画”、“动作”，“地编”'></Input>
                    </FormItem>
                </div>
            </Form>
        </section>
        <section class="headPortrait">
            <p class="title">修改密码 <img style="vertical-align: top;cursor :pointer;" width="20" height="20"
                                       :src="pwpic3.src" @click="changeType()"/></p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="headPortraitMain" inline>
                <div>
                    <FormItem prop="currentPassword">
                        <Input v-model="formValidate.currentPassword" :type="pwpic3.pwdType3"
                               placeholder="输入原密码（6-32位）"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="newPassword">
                        <Input v-model="formValidate.newPassword" :type="pwpic3.pwdType3"
                               placeholder="输入新密码（6-32位）"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem prop="repPassword">
                        <Input v-model="formValidate.repPassword" :type="pwpic3.pwdType3" placeholder="确认新密码"></Input>
                    </FormItem>
                </div>
                <div>
                    <FormItem>
                        <Button @click="handleSubmit('formValidate')">确认修改</Button>
                    </FormItem>
                </div>
            </Form>
        </section>
        <section class="headPortrait">
            <p class="mobileTitle title">手机</p>
            <div v-if="userInfo.phone" class="headPortraitMain">
                <div><span>{{userInfo.phone}}</span><span class="sign">已认证</span></div>
                <Button class="marginBtn" @click="mobileShow = true">修改</Button>
            </div>
            <div v-else @click="mobileShow = true" class="phoneContainer">
                完善您的手机号
            </div>
        </section>
        <section class="headPortrait">
            <p class="emailTitle title">邮箱</p>
            <div class="headPortraitMain">
                <div><span>{{userInfo.email}}</span><span class="sign">已认证</span></div>
                <Button class="marginBtn" @click="emailShow = true">修改</Button>
                <Modal class="changeMobileWindow" v-model="emailShow" width="360">
                    <p>修改邮箱</p>
                    <Form ref="emailValidate" :model="emailValidate" :rules="ruleValidate">
                        <FormItem prop="ePassword">
                            <Input v-model="emailValidate.ePassword" type="password" placeholder="输入登录密码完成身份验证"></Input>
                        </FormItem>
                        <FormItem prop="address">
                            <Input v-model="emailValidate.address" type="text" placeholder="输入您的新邮箱"></Input>
                        </FormItem>
                        <FormItem prop="emailCode">
                            <Input v-model="emailValidate.emailCode" type="text" placeholder="请输入验证码">
                            <div style="width: 70px;cursor: pointer;" @click="sendCode('email')" slot="append">
                                {{emailAuthCode}}
                            </div>
                            </Input>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button @click="handleSubmit('emailValidate')">确认修改</Button>
                    </div>
                </Modal>
            </div>
        </section>
        <Modal class="changeMobileWindow" v-model="mobileShow" width="360">
            <p>修改手机</p>
            <Form ref="mobileValidate" :model="mobileValidate" :rules="ruleValidate">
                <FormItem prop="mPassword">
                    <Input type="password" v-model="mobileValidate.mPassword" placeholder="请输入登录密码进行验证"></Input>
                </FormItem>
                <FormItem prop="phoneNumber">
                    <Input type="text" v-model="mobileValidate.phoneNumber" placeholder="请输入手机号"></Input>
                </FormItem>
                <FormItem prop="mobileCode">
                    <Input type="text" v-model="mobileValidate.mobileCode" placeholder="请输入验证码">
                    <div style="width: 70px;cursor: pointer;" @click="sendCode('phone')" slot="append">
                        {{mobileAuthCode|codePrompt}}
                    </div>
                    </Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="handleSubmit('mobileValidate')">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import api from 'api';
    import {mapMutations, mapActions} from 'vuex';
    import qs from 'querystring';
    // import jsencrypt from 'jsencrypt'
    import '@/assets/js/jsencrypt.min';
    import md5 from 'md5';
    //    import Cropper from 'cropperjs';
    import './cropper.min.css';
    import src from '@/assets/images/close_eyes.png';
    import src2 from '@/assets/images/open_eyes.png';

    export default {
        created() {
            this.getUserInfo();
        },
        mounted() {
        },
        data() {
            const phoneNumber = (rule, value, callback) => {
                let reg = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('请输入合法的手机号'));

                }
            };
            const repPassword = (rule, value, callback) => {
                if (this.formValidate.newPassword === this.formValidate.repPassword) {
                    callback();
                } else {
                    callback(new Error('请确认密码'));
                }
            };
            return {
                timer: null,
                is_success: null,
                pwpic3: {
                    pwdType3: 'password',
                    src
                },
                secretKey: null,
                cropper1: {},
                option1: {
                    showCropedImage: false,
                    cropedImg: ''
                },
                defaultUrl: null,
                editImgShow: true,
                mobileAuthCode: '获取验证码',
                emailAuthCode: '获取验证码',
                imgUrl: `http://192.168.2.19/index.php?r=file/file/file-upload`,
                userId: null,
                mobileShow: false,
                emailShow: false,
                files: [],
                loadingStatus: false,
                userInfo: {},
                formValidate: {
                    currentPassword: ''
                },
                mobileValidate: {},
                emailValidate: {},
                ruleInline: {},
                formInline: {},
                ruleValidate: {
                    currentPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {type: 'string', max: 32, min: 6, message: '请输入合法的密码', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {type: 'string', max: 32, min: 6, message: '请输入合法的密码', trigger: 'blur'}
                    ],
                    repPassword: [
                        {required: true, message: '请确认密码', trigger: 'blur'},
                        {validator: repPassword, message: '两次密码必须相同', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入合法的邮箱地址', trigger: 'blur'}
                    ],
                    emailCode: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ],
                    phoneNumber: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: phoneNumber, trigger: 'blur'},
                    ],
                    mobileCode: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ],
                    mPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    ePassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    job: [
                        {required: true, message: '请输入职业', trigger: 'blur'}
                    ],
                },
            };
        },
        methods: {
            // 获取用户信息
            async getUserInfo() {
                this.userId = sessionStorage.getItem('userId');
                let {data} = await api.getUserInfoById({id: this.userId});
                if (data.err_code == 0) {
                    this.userInfo = {...data};
                    this.formInline = {...data};
                    this.defaultUrl = data.headimage;
                }
            },
            // 更改用户信息
            async changeNickname(type) {
                let parms = null;
                switch (type) {
                    case 'nickname':
                        parms = {id: this.userId, nickname: this.formInline.nickname};
                        if (this.formInline.nickname === '') {
                            this.messageError('昵称不能为空');
                            return false;
                        }
                        break;
                    case 'realname':
                        parms = {id: this.userId, realname: this.formInline.realname};
                        if (this.formInline.realname === '') {
                            this.messageError('姓名不能为空');
                            return false;
                        }
                        break;
                    case 'headimage':
                        parms = {id: this.userId, headimage: this.formInline.headimage};
                        break;
                    case 'job':
                        parms = {id: this.userId, job: this.formInline.job};
                        break;
                }
                let {data} = await api.userUpdata(parms);
                if (data.err_code == 0) {
                    this.messageSuccess('修改成功');
                }
            },
            upLoadImg(data) {
                this.formInline.headimage = data.file.url;
                this.changeNickname('headimage');
                this.defaultUrl = data.file.url;
            },

            // 邮箱验证
            sendCode(type) {
                if (this.emailAuthCode !== '获取验证码') {
                    return;
                }

                let fn = async () => {
                    let ajaxType = null;
                    let obj = null;

                    if (type === 'email') {
                        ajaxType = 'sendUserEmailCode';
                        obj = {email: this.emailValidate.address, password: this.emailValidate.ePassword};
                        if (type === 'email' && !(this.emailValidate.ePassword && this.emailValidate.address)) {
                            this.messageError('密码或邮箱不能为空');
                            return;
                        }
                    } else {
                        ajaxType = 'sendUserPhoneCode';
                        obj = {phone: this.mobileValidate.phoneNumber, password: this.mobileValidate.mPassword};
                        if (type === 'phone' && !(this.mobileValidate.mPassword && this.mobileValidate.phoneNumber)) {
                            this.messageError('密码或手机不能为空');
                            let reg = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
                            if (!reg.test(this.mobileValidate.phoneNumber)) {
                                this.messageError('请输入正确的格式的手机号');
                                return;
                            }
                            return;
                        }
                    }
                    let {data} = await api[ajaxType](obj);
                    if (data.err_code === 0) {

                        this.$Message.success('验证码已发出，请注意查收');
                        this.getCodeTime();

                    } else {
                        this.$Message.error(data.err_message);
                    }

                };

                this._reduce(fn);
            },
            getCodeTime(type) {
                this[type] = 90;
                const timeId = setInterval(() => {
                    this[type]--;
                    if (this[type] <= 0) {
                        this[type] = '获取验证码';
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
                let {data} = await api.updateUserEmailCode(obj);
                if (data.err_code === 0) {
                    this.$Message.success('修改成功');
                    this.emailShow = false;
                    this.clearData('emailValidate');
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
                let {data} = await api.updateUserPhoneCode(obj);
                if (data.err_code === 0) {
                    this.emailShow = false;
                    this.getUserInfo();
                    this.messageSuccess('修改成功');
                    this.clearData('mobileValidate');
                } else {
                    this.messageError(data.err_message);
                }

            },
            // 提交
            handleSubmit(name) {
                let fn = () => {
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            if (name === 'emailValidate') {
                                this.updateEmail();
                            } else if (name === 'mobileValidate') {
                                this.updatePhone();
                            } else {
                                this.passwordCorrelation();
                            }
                        } else {
                            this.messageError('提交失败');
                        }
                    });
                };
                this._reduce(fn);
            },
            // 修改密码
            async passwordCorrelation() {
                let {data} = await api.system_get_public_secret_key();
                if (data.err_code == 0) {
                    this.secretKey = data.public_key;
                    this._verifyPassword();
                }
            },
            // 验证密码
            async _verifyPassword(type) {
                let encrypt = new JSEncrypt();
                encrypt.setPublicKey(this.secretKey);
                let password = null;
                if (type === 'email') {
                    password = encrypt.encrypt(md5(md5(this.emailValidate.ePassword)));
                } else if (type === 'phone') {
                    password = encrypt.encrypt(md5(md5(this.mobileValidate.mPassword)));
                } else {
                    password = encrypt.encrypt(md5(md5(this.formValidate.currentPassword)));
                }
                let {data} = await api.system_check_user_by_password({password: password});
                if (data.err_code == 0) {
                    this.is_success = data.is_success;
                    this._editPassword(data.is_success);
                }
            },
            // 修改密码
            async _editPassword(is_success) {
                if (is_success !== '1') {
                    return false;
                }
                let encrypt = new JSEncrypt();
                encrypt.setPublicKey(this.secretKey);
                let password = encrypt.encrypt(md5(md5(this.formValidate.newPassword)));
                let {data} = await api.system_edit_password({id: this.userId, password: password});
                if (data.err_code == 0) {
                    this.clearData('formValidate');
                    this.messageSuccess('修改成功！');
                }
            },

            // 显示密码
            changeType() {
                this.clearData('formValidate');
                this.pwpic3.pwdType3 = this.pwpic3.pwdType3 === 'password' ? 'text' : 'password';
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
            }
        },
        filters: {
            codePrompt(value) {
                if (typeof value === 'string') {
                    return value + 's后重获验证码';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .personalInfo {
        .headPortrait {
            display: flex;
            padding: 24px 0;
            flex-direction: row;
            border-bottom: 1px solid #ededed;
            .title {
                width: 190px;
                height: 115px;
                text-align: center;
                font-size: 14px;
                font-weight: 600;
                color: black;
            }
            .mobileTitle, .emailTitle {
                height: 55px;
            }
            .upLoadImg {
                display: inline-block;
                position: absolute;
                top: 0;
                left: 0;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                opacity: 0;
            }
            .headPortraitMain {
                flex: 1;
                .avatar {
                    p:nth-of-type(1) {
                        margin: 5px 0 10px 0;
                        color: black;
                    }
                    p:nth-of-type(2) {
                        color: #AEAEAE;
                    }

                }
                .marginBtn {
                    margin-top: 15px;
                }

                .headPortraitImg, .avatarImg {
                    width: 70px;
                    height: 70px;
                    font-size: 57px;
                    border-radius: 50%;
                }
                .ivu-form-item {

                }
                .sign {
                    display: inline-block;
                    padding: 0 4px;
                    margin-left: 8px;
                    font-size: 12px;
                    color: #fff;
                    background: #31BB9F;
                }
            }
            .phoneContainer {
                width: 200px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                border: 1px solid #bdbdbd;
                border-radius: 4px;
                cursor: pointer;
            }
        }
    }

</style>
<style lang="less">
    .changeMobileWindow {
        .button {
            width: 135px;
            height: 35px;
            text-align: center;
            line-height: 35px;
            color: #fff;
            background: @green;
            cursor: pointer;
        }
        .ivu-modal-body {
            padding: 30px 15px 0 15px;
            p {
                margin-bottom: 20px;
                font-size: 18px;
                font-weight: 500;
                color: black;
            }
        }
        .ivu-modal-footer {
            text-align: left;
            border: none;
        }

    }
</style>
