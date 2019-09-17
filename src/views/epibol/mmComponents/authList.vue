<template>
  <div class="authList">
    <div class="itemList" v-for="(item,index) in authList" :key="index">
      <div class="title">{{item.name}}</div>
      <!--暂时隐藏 权限描述-->
      <!--<div class="content">{{item.summary}}</div>   &lt;!&ndash;item.auth_id&ndash;&gt;-->
      <i-switch v-if="auth == 99999" size="large" v-model="switchTrue" disabled>
        <span slot="open">{{$t('memberAauthority.power_enable')}}</span>
      </i-switch>
      <i-switch v-else size="large" v-model="item.auth=='0'?false:true"  @on-change="changeSwitch" @click.native="authID(item.auth_id)">
        <span slot="open">{{$t('memberAauthority.power_enable')}}</span>
        <span slot="close">{{$t('memberAauthority.power_close')}}</span>
      </i-switch>
    </div>
  </div>
</template>

<script>
var qs = require('querystring');
export default {
    name: "authList",
    props: {
        authList: {
            type: Array,
            default: [],
        },
        auth: {
      // type:Number,
        }
    },
    data() {
        return {
            switchFlah: Boolean,
            switchTrue: true,
        };
    },
    methods: {
        changeSwitch(res) {
            this.switchFlah=res;
        },
        authID(id){
      //  console.log(id,this.switchFlah)
            if (this.switchFlah) {
                var data = {
                    id: sessionStorage.postId,
                    auth: 'no_auth',
                    name: id,
                    type: 1
                };
        // Cookies.set('access', 1);
            } else {
                var data = {
                    id: sessionStorage.postId,
                    auth: 'no_auth',
                    name: id,
                    type: 0
                };
            }
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.system_auth_update, data)
      .then(res => res.data)
      .then(res => {
          if (res.err_code == 0) {
          // 修改成功
          }
      });
        }
    }
    
};
</script>

<style scoped lang="less">
.authList{
  .itemList{
    width: 98%;
    padding: 0 5px 16px 5px;
    float: left;
    line-height: 20px;
    border-bottom: 1px dashed #d5d5d5;
    margin-bottom: 16px;
    .title, .content{
      width: 90%;
      float: left;
      color: @black_2;
      font-size: 13px;
    }
    .content{
      color: #bdbdbd;
      font-size: 12px;
    }
     .ivu-switch-checked{
        background: #3BCEB6!important;
        border: #3BCEB6;
        font-size: 12px;
        .ivu-switch-large.ivu-switch-checked:after {
              left: 38px;
              top: 2px;
          }
    }
  }
}
</style>
