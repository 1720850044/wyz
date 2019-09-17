<template>

    <div class="epibolTaskClassContainer">
        <main-native>
            <div class="main-header-style">
                <ul class="setMenuList">
                    <li v-for="(item,index) in tabInfo" :key="index" :class="{'checked':index == nowIndex}" @click="toPath(index,item.path)">
                        {{ item.title }}
                        <div></div>
                    </li>
                </ul>
            </div>
        </main-native>

        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>

</template>

<script>
import mainNative from "@/views/main-components/mainNative.vue";
export default {
    created() {
        this.initBorder();
    },
    mounted() {},
    data() {
        return {
            nowIndex: null,
            tabInfo: [
        { title: "个人中心", path: "/home/personalCenter" }
            ]
        };
    },
    methods: {
        initBorder() {
            this.tabInfo.forEach((item, index) => {
                if (item.path === this.$route.path) {
                    this.nowIndex = index;
                }
            });
        },
        toPath(index, path) {
            this.nowIndex = index;
            this.$router.push({ path: path });
        }
    },
    computed: {},
    components: {
        mainNative
    }
};
</script>

<style lang="less" scoped>
.epibolTaskClassContainer {
  height: 100%;
  .color {
    border-bottom: 2px solid #3bceb6;
  }
  .main-header-style {
    margin-right: 10px;
    /*..main-haeder-native .main-header-style .main-header-title{*/
    /*border-bottom: 1px solid transparent; 2px solid #3bceb6*/
    /*}*/
    .main-header-title {
      border-bottom: 2px solid transparent;
    }
  }
}
</style>
