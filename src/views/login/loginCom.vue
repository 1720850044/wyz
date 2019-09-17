<template>
    <Form :model="loginform">
        <FormItem>
                    <Input v-model="loginform.email"  @on-focus="iconChange(1)" @on-blur="iconbulr" placeholder="请输入邮箱 / 用户名"></Input>
                <div class="inputPosition">
                    <i class="iconfonts icon-youxiang1" :class="{'icon':loginform.iconEmail}"></i>
                </div>
        </FormItem>
        <FormItem>
            <Input v-model="loginform.password" @on-focus="iconChange(2)"   @on-blur="iconbulr"
                   onpaste="return false" oncontextmenu="return false" oncopy="return false" oncut="return false"
                   :type="pwpic3.pwdType3" placeholder="请输入密码" prefix="ios-contact"></Input>
            <div class="inputPosition">
                <i class="iconfonts icon-mima1" :class="{'icon':loginform.iconPass}" ></i>
                <span
                    :class="[pwpic3.pwdType3=='password'?'iconfonts icon-chakanmima1 lookPas':'iconfonts icon-chakanmima lookPas']"
                    @click="changeType3()">
                </span>
            </div>

        </FormItem>
        <div class="errorHint" v-if="errorHint.hintFlag"><span class="iconfonts icon-cuowu1"></span>{{errorHint.hintData}}</div>
    </Form>
</template>
<script>
export default {
    data(){
        return {
            pwpic3: {
                pwdType3: "password",
            },
            loginform: {
                email: '',
                password: '',
                iconEmail: false,
                iconPass: false,
            },
            errorHint: {
                hintFlag: false,
                hintData: ''
            }
        };
    },
    mounted(){
        this.upDate();
    },
    updated(){
        this.upDate();
    },
    methods: {
        errorInfo(data){
            this.errorHint.hintData=data;
            this.errorHint.hintFlag=true;
        },
        upDate(){
            this.$bus.emit('loginData', this.loginform);
        },
        changeType3() {
            this.pwpic3.pwdType3 = this.pwpic3.pwdType3 == 'password' ? 'text' : 'password';
        },
        iconChange(type){
            if (type === 1){
                this.loginform.iconEmail = true;
            } else {
                this.loginform.iconPass = true;
            }
        },
        iconbulr(){
            this.loginform.iconEmail = false;
            this.loginform.iconPass = false;
        },
    }

};
</script>
