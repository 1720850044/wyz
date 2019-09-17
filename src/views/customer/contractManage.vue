<template>
    <div class="newContract">
        <main-native>
            <div class="main-header-style "><span class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
        </main-native>
        <dl>
            <dt>
                <span class="span">
                    <Input v-model="search" icon="ios-search" style="width:300px;" placeholder="合同/项目名称" @keyup.enter.native="searchCommit"></Input>
                    <!--<Input v-model="search" placeholder="合同/项目名称" style="width: 300px" icon="ios-search" @on-click="searchCommit" @on-enter="searchCommit"></Input>-->
                </span>
                <div class="clear"></div>
            </dt>
            <contract-list :guideSteps="guideSteps" :contData="contData" v-on:changePage="changePage" ref="contractRef"></contract-list>
        </dl>
    </div>
</template>
<script>
    import api from 'api';
    import contractList from './contractManage/component/contractList';
    import mainNative from '../main-components/mainNative.vue';
    var qs = require('querystring');

    export default {
        data() {
            return {
                guideSteps: {
                    step1: '',
                },
                search: null,
                contData: [],
                needGuideData: false,
            };
        },
        components: {
            contractList: contractList,
            mainNative: mainNative
        },
        mounted() {
            this.initGuide();
            // this.contractData(this.search);
        },
        watch: {
            status(val) {
                this.search = null;
                this.contractData(this.search);
            }
        },
        methods: {
            searchCommit() {
                this.contractData(this.search);
            },
            // 初始化列表数据
            contractData(search = this.search, page) {
                let _this = this;
                let url = _this.GLOBAL.baseRouter + this.$GLOBALAPI.task_contract_list;
                let params = {
                    search: search,
                    page_size: 50,
                };
                if (this.needGuideData){
                    params.needGuideData = true;
                }
                if (page){
                    params.page = page;
                }
                _this.$Loading.start();
                return _this.$axios.post(url, params).then(msg => {
                    _this.$Loading.finish();
                    if (msg.data.err_code == 0) {
                        if (page >= 2) {
                            _this.contData = _this.contData.concat(msg.data.data);
                        } else {
                            _this.contData = msg.data.data;
                        }
                    }
                }, () => {
                    _this.$Loading.error();
                });
            },
            // 初始化获取是否引导
            // async initGuide() {
            //     let {data} = await api.demandContractIndex()
            //     if (data.err_code == 0) {
            //         if (data.guide === 'devContract') {
            //             this.needGuideData = true;
            //         }
            //         await this.contractData().then(() => {
            //             if (data.guide === 'devContract') {
            //                 setTimeout(() => {
            //                     this.$guide().setOptions(this.$CONSTANT.guideOptions)
            //                         .addSteps([
            //                             {
            //                                 element: document.querySelector('.contract-guide-dev'),
            //                                 intro: '<h1>功能导航</h1><p>个人业务管理和企业业务管理，以及新建项目管理</p>',
            //                                 position: 'right',
            //                                 disableInteraction: '1',
            //                                 start: '1',
            //                                 total: '4'
            //                             },
            //                         ])
            //                         .start().oncomplete(async () => {
            //                         if (this.$refs.contractRef) {
            //                             await this.$PublicFuns.completePageGuide(data.guide)
            //                             await this.$refs.contractRef.enter(this.contData ? this.contData[0] : {})
            //                         }
            //                     });
            //                 })
            //
            //             }
            //         })
            //     }
            // },
            // 初始化获取是否引导
            async initGuide() {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_demand_contractindex;
                this.$PublicFuns.guideInitInterface(url)
                    .then(async (result) => {
                        if (JSON.stringify(result.guideSteps) !== "{}"){
                            this.needGuideData = true;
                        }
                        await this.contractData().then(() => {
                            if (JSON.stringify(result.guideSteps) !== "{}") {
                                this.guideSteps = result.guideSteps;
                                setTimeout(() => {
                                    _this.$guide().setOptions(this.$CONSTANT.guideOptions).start().oncomplete(async () => {
                                        if (this.$refs.contractRef) {
                                            await this.$PublicFuns.completePageGuide(result.guideKey);
                                            await this.$refs.contractRef.enter(this.contData ? this.contData[0] : {});
                                        }
                                    }).onskip(() => {
                                        this.needGuideData = '';
                                        this.contractData();
                                    });
                                });

                            }
                        });
                    });
            },
            changePage(page){
                this.contractData(this.search, page);
            },
        }
    };
</script>
<style lang="less">
    @import '../epibol/contractManage/style/contractManage.less';
</style>

