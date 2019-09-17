<template>
    <!-- 合作 -->
    <div class="cooperation">
        <routerlink>
            <ul slot="linkList" class="linkTab">
                <router-link tag="li" to="/epibol/cooperation/cooperationIndex">合作公司库</router-link>
                <router-link tag="li" v-if="user_type == 1" to="/epibol/cooperation/cooperationInvitation">合作邀请</router-link>
            </ul>
        </routerlink>
        <router-view></router-view>
    </div>
</template>
<script>
import Cookies from "js-cookie";
export default {
    data() {
        return {
            user_type: JSON.parse(Cookies.get("company")).type
        };
    }
};
</script>
<style scoped lang="less">
@import "../customer/epibolCompany/style/epibolCompany.less";
</style>
