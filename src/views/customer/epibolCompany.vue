<template>
  <div style="height: 95%">
      <routerlink>
          <ul slot="linkList" class="linkTab">
              <!--<router-link tag="li" to="/customer/epibolCompany/testTaskIndex">测试任务</router-link>-->
              <!--<router-link tag="li" to="/customer/epibolCompany/cooperativeCompany">合作公司</router-link>-->
              <!--<router-link tag="li" to="/customer/epibolCompany/outsourcingInvitation">外包邀请</router-link>-->
          </ul>
      </routerlink>
      <router-view></router-view>
  </div>
</template>
<style lang="less">
@import './epibolCompany/style/epibolCompany.less';
</style>
