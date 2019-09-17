<template>
    <div>
        <main-native>
            <div class="main-header-style">
                <ul class="setMenuList">
                    <li v-for="(item,index) in tabInfo" :key="index" :class="{'checked':index == nowIndex}" @click="toPath(index,item.path)">
                        {{ item.title }}
                        <div></div>
                    </li>
                </ul>
            </div>
            <!--<div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>-->
            <!--<div class="main-header-style iconfont"><span class="main-header-title"><i></i><router-link tag="span" to="/home/personalCenter">个人资料</router-link></span></div>-->
            <!--<div class="main-header-style iconfont"><span class="main-header-title"><i></i><router-link tag="span" to="/home/personalCenter/b">实名认证</router-link></span></div>-->
            <!--<div class="main-header-style iconfont"><span class="main-header-title"><i></i><router-link tag="span" to="/home/personalCenter/c">电子签名</router-link></span></div>-->

        </main-native>
        <div class="personalContainer">

            <!-- <Menu class="menuList"   active-name="1">
                <MenuGroup>
                    <MenuItem name="1">
                        <Icon type="document-text"></Icon>
                        个人资料
                    </MenuItem>
                    <!-- <MenuItem name="2">
                        <Icon type="navicon-round"></Icon>
                        个人主页管理
                    </MenuItem>
                    <MenuItem name="3">
                        <Icon type="clipboard"></Icon>
                        团队信息
                    </MenuItem> -->
            <!--</MenuGroup>-->
            <!--</Menu>-->
            <router-view class="menuMain"></router-view>
        </div>
    </div>
</template>
<script>
    import mainNative from '../main-components/mainNative.vue';

    export default {
        data() {
            return {
                theme2: 'primary',
                tabInfo: [
                    {'title': '个人资料', path: '/home/personalCenter'},
                    // {'title':'实名认证',path:'/home/personalCenter/b'},
                    // {'title':'电子签名',path:'/home/personalCenter/c'},
                ],
                nowIndex: 0
            };
        },
        components: {
            mainNative
        },
        created() {

        },
        methods: {
            toPath(index, path) {
                this.nowIndex = index;
                this.$router.push({path: path});
            }
        }
    };
</script>

<style lang="less" >
    .single-page{
        height: 90%;
    }
    .personalContainer{
        .ivu-menu{
            background: #fff !important;
            z-index: 2;
            .ivu-menu-vertical,.ivu-menu-item{
                &:hover{
                    background: #ccc!important;
                }
            }
        }
        display: flex;
        /*height: 100%;*/
        /*margin-left: 150px;*/
        .menuList{
            width: 120px;
        }
        .menuMain{
            flex:1;
        }
    }

</style>

