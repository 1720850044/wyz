<template>
    <div class="newContract">
        <main-native>
            <div class="main-header-style"><span
                    class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
        </main-native>
        <dl style="height: 100%;">
            <dt>
                <!--<span class="span">-->
                    <!--<Input v-model="search"  icon="ios-search" placeholder="请输入您想搜索的合同" style="width: 300px"-->
                           <!--@on-click="searchCommit"  @on-enter="searchCommit">-->
                    <!--</Input>-->
                <!--</span>-->
                <span class="em">
                     <!--<Dropdown style="margin-left: 20px">-->
                           <!--<Button type="success"><i class="iconfonts icon-xinjian"></i> 增加合同</Button>-->
                            <!--<DropdownMenu trigger="click" slot="list">-->
                                <!--&lt;!&ndash;<DropdownItem @click.native="addElectronicContract">电子合同</DropdownItem>&ndash;&gt;-->
                                <!--<DropdownItem @click.native="newAdd">线下合同</DropdownItem>-->
                            <!--</DropdownMenu>-->
                    <!--</Dropdown>-->
                    <Select v-model="fileterObj.contreactStatus" style="width:100px" placeholder="合同状态" @on-change="contractData">
                        <Option v-for="item in fileterObj.contreactStatusArr" :value="item.status" :key="item.status">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="fileterObj.relationProject" style="width:100px" placeholder="关联项目" @on-change="contractData">
                        <Option v-for="item in fileterObj.relationProjectArr" :value="item.status" :key="item.status">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="fileterObj.inputNameStr" placeholder="合同名称/商务" style="width: 180px" icon="ios-search" @on-enter="contractData"></Input>
                    <Button type="success" v-if="!guideKey" data-step="1" data-disable-interaction="1" :data-intro="guideSteps.step1" data-start="1" data-last="5" @click.native="newAdd" ><i class="iconfonts icon-xinjian"></i> 增加合同</Button>
                </span>
                <div class="clear"></div>
            </dt>

            <contract-list  :guideKey="guideKey" :guideSteps="guideSteps" :contData="contData" :loadingFlag="loadingFlag"  v-on:changePage="changePage" @addSuccess="contractData"></contract-list>
            <!--<Page  class="contractPage" :current="current" :total="total" :page-size="20" @on-change="changePage" show-elevator ></Page>-->
        </dl>
    </div>
</template>
<script>
    import contractList from './contractManage/component/contractList';
    import mainNative from '../main-components/mainNative.vue';
    import {mapState, mapMutations, mapActions} from 'vuex';

    export default {
        data () {
            return {
                guideKey: '',
                guideSteps: {
                    step1: '',
                    step5: '',
                },
                contData: [],
                search: '',
                total: 0,
                current: 1,
                needGuideData: false,
                loadingFlag: true,

                fileterObj: {
                    contreactStatusArr: [
                        {
                            status: -1,
                            label: '不限'
                        },
                        {
                            status: 0,
                            label: '进行中'
                        },
                        {
                            status: 1,
                            label: '待确认'
                        },
                        {
                            status: 2,
                            label: '已确认'
                        },
                        {
                            status: 999,
                            label: '已完成'
                        }
                    ],
                    relationProjectArr: [
                        {
                            status: -1,
                            label: '不限'
                        },
                        {
                            status: 1,
                            label: '有'
                        },
                        {
                            status: 0,
                            label: '无'
                        }
                    ],
                    inputNameStr: null,
                    contreactStatus: -1,
                    relationProject: -1
                }
            };
        },
        computed: {
            ...mapState({
                companyID (data) {
                    return data.paySkip.company;
                }
            })
        },
        components: {
            contractList: contractList,
            mainNative: mainNative
        },
        mounted () {
            this.projectPost();
            this.getUserInfo();
            this.initGuide();
        },
        methods: {
            ...mapMutations(['getJudgeType']),
            ...mapActions(['vuexGetUserInfo', 'vuexProjectPost']),
            changePage(page){
                this.contractData(page);
            },
            // 新增
            newAdd () {
                this.$router.push({path: "/epibol/contract"});
            },
            // 搜索
            // searchCommit () {
            //     this.contractData(this.search);
            // },
            setDomData(){
                let dataStep = null;
                if (this.guideKey) {
                    dataStep = '5';
                } else {
                    dataStep = '1';
                }
                let dom = document.querySelector('.contract-guide-dom')[0];
                if (dom){
                    dom.setAttribute('data-step', dataStep);
                    dom.setAttribute('data-disable-interaction', dataStep);
                    dom.setAttribute('data-start', '5');
                    dom.setAttribute('data-last', '5');
                    dom.setAttribute('data-intro', this.guideSteps.step1);
                }
            },
            // 初始化列表数据
            contractData (page) {
                let _this = this;
                let url = _this.GLOBAL.baseRouter + this.$GLOBALAPI.task_get_contract_list;
                let params = {
                    company_id: this.companyID.company_id,
                    status: this.fileterObj.contreactStatus,
                    is_project: this.fileterObj.relationProject,
                    search: this.fileterObj.inputNameStr,
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
                    _this.loadingFlag = false;
                    if (msg.data.err_code == 0) {
                        if (page >= 2) {
                            _this.contData = _this.contData.concat(msg.data.data);
                        } else {
                            _this.contData = msg.data.data;
                        }
                        _this.$store.commit('getContractIDCommit', null);
                    }
                }, () => {
                    _this.$Loading.error();
                });

            },
            // 初始化获取是否引导
            async initGuide() {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_outsource_contractindex;
                this.$PublicFuns.guideInitInterface(url).then(async (result) => {
                    sessionStorage.accToken = result.acc_token;
                    if (JSON.stringify(result.guideSteps) !== "{}") {
                        this.needGuideData = true;
                    }
                    await this.contractData().then(() => {
                        if (JSON.stringify(result.guideSteps) !== "{}") {
                            this.guideSteps = result.guideSteps;
                            if (result.guideKey === 'collContractLast') {
                                this.guideKey = result.guideKey;
                            }
                                // this.$nextTick(() => {
                                //     this.setDomData()
                                // })
                                //oncomplete
                            setTimeout(() => {
                                _this.$guide().setOptions(this.$CONSTANT.guideOptions).start().oncomplete(async () => {
                                        // this.$nextTick(() => {
                                        //     this.setDomData()
                                        // })
                                    this.$nextTick(() => {
                                        _this.$guide().exit();
                                    });
                                    if (result.guideKey == 'collContract') {
                                        await this.$PublicFuns.completePageGuide(result.guideKey);
                                        this.$router.push({path: "/epibol/contract"});
                                            // await this.$refs.contractRef.newAddData();
                                    } else if (result.guideKey == 'collContractLast') {
                                        this.needGuideData = '';
                                        this.contractData();
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
            //获取项目ID
            projectPost () {
                this.vuexProjectPost();
            },
            //获取人员名单
            getUserInfo () {
                this.vuexGetUserInfo();
            },
            addElectronicContract () {
                this.$store.commit('getJudgeType', 'add');
                this.$router.push({path: '/epibol/addElectronicContract'});
            },

            selectContractStatus(val){

            },
            selectRelationProject(val){

            }
        }
    };
</script>
<style lang="less">
    @import './contractManage/style/contractManage.less';
</style>
<style lang="less" scoped>
    .contractPage{
        margin-top: 15px;
        text-align: right;
    }
</style>
