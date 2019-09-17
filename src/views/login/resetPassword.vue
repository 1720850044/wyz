<template>
    <Form :model="resetPassword">
        <FormItem>
            <Input v-model="resetPassword.userName" :disabled="disabled" placeholder="输入您的登录邮箱">
            </Input>

                <i class="iconfonts icon-youxiang1 registerIcon"></i>

        </FormItem>
        <FormItem v-if="!account">
            <Input v-model="resetPassword.code" placeholder="输入验证码">
                <p v-if="!account" slot="append" @click="getCode">{{code === '获取验证码' ? code : code + 's后重新获取验证码'}}</p>
            </Input>

                <i class="iconfonts icon-youxiang1 registerIcon"></i>

        </FormItem>
        <FormItem>
            <Input v-model="resetPassword.passwd" :type="pwpic.pwdType" placeholder="输入您的新密码"></Input>
            <div class=" registerIcon">
                <i class="iconfonts icon-mima1"></i>

            </div>
            <span
                    :class="[pwpic.pwdType=='password'?'iconfonts icon-chakanmima1 lookPas':'iconfonts icon-chakanmima lookPas','chakanmima']"
                    @click="changeType()">
                </span>
        </FormItem>
        <FormItem>
            <Input v-model="resetPassword.passwdCheck" :type="pwpic2.pwdType2" placeholder="再次输入密码"></Input>
            <div class=" registerIcon" >
                <i class="iconfonts icon-mima1"></i>

            </div>
            <span
                    :class="[pwpic2.pwdType2=='password'?'iconfonts icon-chakanmima1 lookPas':'iconfonts icon-chakanmima lookPas','chakanmima']"
                    @click="changeType2()">
                </span>
        </FormItem>
        <div class="errorHint" v-if="errorHint.hintFlag"><span class="iconfonts icon-cuowu1"></span>{{errorHint.hintData}}
        </div>
    </Form>
</template>

<script>
    import api from 'api';
    export default {
        props: ['account'],
        data() {
            return {
                
                pwpic: {
                    pwdType: "password",
                },
                pwpic2: {
                    pwdType2: "password",
                },
                resetPassword: {
                    userName: '',
                    passwd: '',
                    passwdCheck: '',
                    code: '',
                },
                code: '获取验证码',
                errorHint: {
                    hintFlag: false,
                    hintData: ''
                },
                disabled: false
            };
        },
        updated() {
            this.upDate();
        },
        methods: {
            errorInfo(data) {
                this.errorHint.hintData = data;
                this.errorHint.hintFlag = true;
            },
            // 密码显隐
            changeType() {
                this.pwpic.pwdType = this.pwpic.pwdType == 'password' ? 'text' : 'password';
            },
            changeType2() {
                this.pwpic2.pwdType2 = this.pwpic2.pwdType2 == 'password' ? 'text' : 'password';
            },
            // 获取验证码
            async getCode() {
                if (!this.resetPassword.userName) {
                    this.$Message.info('邮箱名不能为空');
                    return false;
                }
                if (this.code !== '获取验证码') {
                    return false;
                }
                let {data} = await api.sendResetEmail({email: this.resetPassword.userName});
                if (data.err_code === 0) {
                    this.$Message.success('验证码已发送邮件，请注意查收');
                    this.code = 60;
                    const timeId = setInterval(() => {
                        this.code--;
                        if (this.code <= 0) {
                            this.code = '获取验证码';
                            clearInterval(timeId);
                        }
                    }, 1000);
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            upDate() {
                this.$bus.emit('resetData', this.resetPassword);
            },
        },
        watch: {
            account(value){
                this.resetPassword.userName = value;
                this.disabled = true;
            }
        } 
    };
</script>

<style lang="less" scoped>
    .registerIcon{
        position: absolute;
        top:50%;
        left: 0;
        transform: translateY(-50%);
        font-size: 20px;
        z-index: 2;
    }
    .chakanmima{
        right: 0px !important;
    }
</style>
