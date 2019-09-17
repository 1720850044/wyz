<template>
    <div>
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{$route.meta.title}}<div></div></span></div>
        </main-native>

        <Content class="companyNormLibrary">
            <type-list ref="tree"  :listData="formLeft"></type-list>
            <standard-info ref="standard"   ></standard-info>
        </Content>
    </div>
</template>
<script>
    import api from 'api';
    import qs from 'querystring';
    import Icon from "iview/src/components/icon/icon";
    import Caspanel from "iview/src/components/cascader/caspanel";
    import typeList from "./typeList";
    import standardInfo from "./comStandardInfo";
    import mainNative from '../../main-components/mainNative.vue';

    export default {
        components: {
            typeList,
            Caspanel,
            Icon,
            standardInfo,
            mainNative
        },
        data() {
            return {
                formLeft: {},
            };
        },
        mounted() {
            // $('.companyNormLibrary ul').height($(window).height()-150);
        },
        methods: {

        }
    };
</script>
<style lang="less">
    .companyNormLibrary {
        padding-left:0px !important;
        display: flex;
        display: -webkit-flex;
    }
</style>
