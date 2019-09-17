<template>
    <div class="projectManage">
        <routerlink>
            <ul slot="linkList" class="linkTab">
                <router-link tag="li" to="/epibol/projectManage/projectIndex">项目</router-link>
                <router-link tag="li" to="/epibol/projectManage/projectScore">项目评分</router-link>
                <router-link v-if="user_type == 0" tag="li" to="/epibol/projectManage/projectInvite">项目邀请</router-link>
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
                user_type: JSON.parse(Cookies.get('company')).type
            };
        }
    };
</script>
<style lang="less">
    .projectManage {
        height: 100%;
        /*<!--.project-invite {-->*/
        /*<!--height: 100%;-->*/
        /*<!--.nothink {-->*/
        /*<!--display: flex;-->*/
        /*<!--align-items: center;-->*/
        /*<!--justify-content: center;-->*/
        /*<!--background: url("../../assets/images/contract.png") no-repeat #ffffff;-->*/
        /*<!--background-position: center 35%;-->*/
        /*<!--height: 100%;-->*/
        /*<!--width: 100%;-->*/
        /*<!--span {-->*/
        /*<!--font-size: 12px;-->*/
        /*<!--color: @black_2;-->*/
        /*<!--}-->*/
        /*<!--}-->*/
        /*<!--}-->*/
    }
</style>
