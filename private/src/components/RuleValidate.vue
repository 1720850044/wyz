<template>
<i-form ref= 'formItem' :model="formItem"  :rules='ruleValidate'>
    <form-item label="用户名称" prop='username' >
        <i-input  v-model="formItem.username" placeholder="请输入用户名"></i-input>
    </form-item>
    <form-item label="用户密码" prop="password">
        <i-input v-model="formItem.password" type="password"></i-input>
    </form-item>
    <form-item label="再次密码" prop="rpassword">
        <i-input v-model="formItem.rpassword" type="password"></i-input>
     </form-item>
     <form-item label="用户组" prop="group">
        <i-select v-model="formItem.group">
            <i-option value="0">选择用户组</i-option>
            <i-option v-for="item in group" :value="item.id">{{item.typename}}</i-option>
        </i-select>
     </form-item>
     <form-item label="用户名称" prop='nick'>
         <i-input v-model="formItem.nick"  placeholder="请输入昵称"></i-input>
     </form-item>
     <form-item label="联系电话">
        <i-input v-model="formItem.tel" placeholder="请输入电话"></i-input>
     </form-item>
     <form-item label="联系 Q Q">
          <i-input v-model="formItem.qq" ></i-input>
     </form-item>
</i-form>
</template>
<script>
    export default {
        data () {
            var  validateuser = function(rule, value, callback){
                    if(!value){
                        return callback(new Error("请输入用户名"));
                    }else if(!/^[a-zA-Z\d]+$/.test(value)){
                        return callback(new Error("请正确输入用户名"))
                    }else{
                        callback();
                    }
                };
                var  validatenick = function(rule, value, callback){
                    if(!value){
                        return callback(new Error("请输入用户名称"));
                    }else if(!/^[\u4e00-\u9fa5]+$/.test(value)){
                        return callback(new Error("请正确输入用户名称"))
                    }else{
                        callback();
                    }
                };
                var validatePass = function(rule, value, callback) {
                    if (value === '') {
                        callback(new Error('请输入密码'));
                    } else {
                        callback();
                    }
                };
                var validatePassCheck = function(rule, value, callback){
                    if (value === '') {
                        return callback(new Error('请再次输入密码'));
                    } else if (value !== vue.formItem.password) {
                        return callback(new Error('两次密码不一致'));
                    } else {
                        callback();
                    }
                };
            return {
                group:[],
                formItem:{
                    'username':"",
                    'password':"",
                    'rpassword':"",
                    'nick':'',
                    'tel':"",
                    'qq':"",
                    'group':""
                },
                ruleValidate:{
                    username    : [{validator: validateuser,trigger: 'blur'}],
                    nick        : [{validator: validatenick,trigger: 'blur'}],
                    password    : [{validator: validatePass, trigger: 'blur' },{min:6,message:'请输入最少6位'}],
                    rpassword   : [{validator: validatePassCheck, trigger: 'blur' },{min:6,message:'请输入最少6位'}],
                    group:[{required: true, type: 'string', message: '请选择分组', trigger: 'change'}],
                }
            }
        }
    }
</script>