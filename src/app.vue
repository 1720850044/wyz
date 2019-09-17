<!--script src="../../develop/dist/0.chunk.js"></script>
<script src="../../develop/dist/0.chunk.1534735769255.js"></script-->
<template>
    <div id="main" class="app-main">
        <router-view></router-view>
        <!-- 截图插件 -->
        <screen-shot ref="screenShot" v-on:sendImg="sendImg"></screen-shot>
        <page-loading v-if="$store.state.isLoading"></page-loading>
    </div>
</template>

<script>
    import screenShot from '@/components/screenshot';
    import {mapState, mapMutations} from 'vuex';
    import './assets/styles/iconfontB/font.css';
    import './assets/styles/newIconfont/style.css';
    import Cookies from 'js-cookie';
    import PageLoading from './components/pageLoading/pageLoading';
    export default {
        data() {
            return {
                theme: this.$store.state.app.themeColor,
                positionX: 0,
                positionY: 0,
                isLoading: false
            };
        },
        created() {
            this.$nextTick(() => {
                this.modifyBodyStyle();
            });
        },
        updated() {
            this.modifyBodyStyle();
        },
        computed: {
            ...mapState({
                menulist(value) {
                    return value.app.menuList;
                }
            }),
            // getishow() {
            //     if (localStorage.token) {
            //         let msgData = JSON.stringify({
            //             action: 'login',
            //             token: localStorage.token
            //         });
            //         // console.log('正在链接websocket app.vue msgData',msgData);
            //         this.$connectSoket.connectSocket(msgData, this);
            //     }else {
            //         this.$axios.get(this.GLOBAL.baseRouter + '/system/login/logout').then(res => res.data).then(res => {
            //             if (res.err_code == 0) {
            //                 Cookies.remove('user');
            //                 Cookies.remove('company');
            //                 Cookies.remove('post_id');
            //                 Cookies.remove('hostName');
            //                 sessionStorage.clear();
            //                 localStorage.clear();
            //                 this.$router.push({path: '/login', query: {ref: 'admin'}});
            //                 this.$store.state.msgShow = false;
            //                 this.$store.state.useList = [];
            //             }
            //         })
            //     }
            //     if (localStorage.useList) {
            //         this.$store.state.useList = JSON.parse(localStorage.useList)
            //         // console.log('这儿有个json.parse',localStorage.useList)
            //     }
            // },
        },
        watch: {
            // getishow(e) {
            //     // console.log("数据", e);
            // },
            menulist(value) {
                if (value && this.$route.path === '/home/personalCenter/') {
//                    this.$router.push(value[0].path);
                }
            }
        },
        mounted() {
            window.addEventListener('keydown', function (e) {
                if (e.keyCode === 116 || (e.ctrlKey === 17 && e.keyCode === 116) || (e.ctrlKey === 17 && e.keyCode === 82) || (e.ctrlKey === 17 && e.shiftKey === 16 && e.keyCode === 82)) {
                    window.location.reload();
                }
            }, false);
            this.$bus.on('screenshotInit', (id, type) => {
                this.$refs.screenShot.init(id, type);
            });
            //   console.log('数据2', this.$store.state.msgShow)
            const script = document.createElement("script");
            script.src = "https://s13.cnzz.com/z_stat.php?id=" + this.GLOBAL.tongJiId + "&web_id=" + this.GLOBAL.tongJiId;
            script.language = "JavaScript";
            document.body.appendChild(script);
            // this.$store.dispatch('getCollaboration');
            this.setRole();
        },
        beforeDestroy() {
            localStorage.removeItem('msgShow');
        },
        methods: {
            ...mapMutations(['setRole']),
            sendImg(url) {
                this.$store.commit('setImg', url);
                // this.$bus.emit('messageSendImg', url);
            },
            modifyBodyStyle() {
                //console.log('route modifyBodyStyle modifyBodyStyle', this.$route.path);
                if (this.$route.path == '/index') {
                    document.body.style.overflowY = 'auto';
                } else {
                    document.body.style.overflowY = 'hidden';
                }

            },
        },
        components: {
            PageLoading,
            screenShot
        }
    };
</script>

<style lang='less'>
    /*@import './assets/styles/commonUI.less';*/
    @import './assets/styles/bubble.less';
    html, body {
        width: 100%;
        height: 100%;
        background: #fdfdfd;
        overflow: hidden;
        position: relative;
        font-family: @ff;
    }

    .app-main {
        width: 100%;
        height: 100%;
    }

    //这里不需要引入样式
    // @import './assets/styles/contractData.less'; //合同日期引入
    // @import './assets/styles/statistics.less'; //统计相关样式
</style>
