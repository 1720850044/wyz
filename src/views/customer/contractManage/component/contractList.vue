<template>
    <div>
        <div class="contractRow" :class="{'nothingContractBox':MsgDataAssemble.length==0}">
            <div v-if="MsgDataAssemble.length==0" style="height: 100%">
                <nothink type="project" text="暂无合同"></nothink>
            </div>
            <dl v-if="MsgDataAssemble.length!==0" class="contractTag">
                <Scroll :on-reach-bottom="changePage" :height="scrollHeight">
                    <dd v-for="(item,index) in MsgDataAssemble"   data-start="1" data-last="4" data-step="1" data-disable-interaction="1" :data-intro="guideSteps.step1" :key="index" class="contract-guide-dev" v-if="item.is_over === 1" :id="'contractRow'+index">
                        <p v-if="item.network === '2'" class="networkSign">电</p>
                        <div class="statusRow">
                            <div :class="[item.status!=0?'status':'status yellow']">
                                <span v-if="item.company_signServiceId&&item.customer_signServiceId">合同已签章</span>
                                <span v-else> {{item.status_text}}</span>
                            </div>
                            <div class="title">
                                <em class="icon iconfonts icon-backs" id="more" @click="closeSlide($event,item)"></em>
                            </div>
                        </div>
                        <div class="projectName" @click="enter(item)">
                            {{item.contract_name}}
                        </div>
                        <div class="projectMoney" @click="enter(item)">
                            ￥<span>{{item.contract_price}}</span>
                        </div>
                        <div class="projectInfo" @click="enter(item)">
                            <p class="company">
                                <i class="iconfonts icon-loudong"></i> {{item.company}}
                            </p>
                            <p class="company">
                                {{item.start_time}} ~ {{item.end_time}}
                            </p>
                        </div>
                        <!--slider-->

                        <previewlist :propsData="{ShowFlag:item.ShowFlag,screenshotID:'contractRow'+index,id:item.id,network:item.network,status:item.status}" @closeSlide="closeSlide(null,item)"></previewlist>

                    </dd>
                </Scroll>
            </dl>
        </div>
    </div>
</template>
<script>
    import api from 'api';
    import {mapMutations} from 'vuex';
    export default {
        data() {
            return {
                page: 2,
                scrollHeight: 0,
                addModal: false,
                modalTitle: null,
                onContractData: Object,
                // chatMemberList: []
            };
        },
        props: {
            contData: {
                type: Array
            },
            guideSteps: {
                type: Object,
                defaule: () => ({})
            },
        },
        filters: {
            filterStat(val) {
                switch (val) {
                    case '1':
                    case '6':
                        return '立即支付';
                        break;
                    case '4':
                    case '9':
                        return '同意结算';
                        break;
                }
            }
        },
        computed: {
            MsgDataAssemble(){
                this.contData.forEach((creent, index, arr)=>{
                    creent.ShowFlag = false;
                });
                return this.contData;
            }
        },
        mounted() {
            this.autoH();
        },
        methods: {
            ...mapMutations(['setIsEdit', 'getContractType']),
            changePage () {
                this.$emit('changePage', this.page);
                this.page++;
            },
            // 初始化高
            autoH() {
                $('.contractRow').height($(window).height() - 210);
                if (document.querySelector('.contractRow')){
                    this.scrollHeight = document.querySelector('.contractRow').offsetHeight;
                }
            },
            // 电子合同编辑
            networkContDetails(id) {
                this.$store.commit('getContractIDCommit', id);
                this.$router.push('/epibol/addElectronicContract');
            },
            // 详情
            contDetails(item) {

//                this.$router.push('/customer/contractData');
//                this.$store.commit('getContractIDCommit', id);

                this.$store.commit('getContractIDCommit', item.id);
                this.$store.commit('getContractType', item.network);

                this.$router.push({path: '/epibol/contractDetails'});
            },
            enter(item) {
                this.$router.push({path: "/customer/contract", query: {ID: item.contract_id}});
                // if (item.network === '2') {
                //     if (item.status <= '0' || (item.status == 1 && (!item.company_signServiceId || !item.customer_signServiceId))) {
                //         this.networkContDetails(item.id);
                //         this.setIsEdit(true);
                //     } else {
                //         this.getContractType(2);
                //         this.contDetails(item);
                //     }
                // } else {
                //     this.contDetails(item);
                //
                // }
            },
            closeSlide(e, data){
                if (e){e.stopPropagation();}
                this.$forceUpdate();
                data.ShowFlag = !data.ShowFlag;
            }
        }
    };
</script>
<style lang="less">
    .contractTag{
        .ivu-scroll-content{
            padding-left: 8px;
        }
    }
    .previewListSty{
        position: absolute;
        border: 1px solid #17ceb1;
        background: #fff;
        padding: 0 10px;
        width: 160px;
        height: 200px;
        border-radius: 3px;
        z-index: 1;
        text-align: center;
        right: 5px;
        top: 50px;
        .tiele{
            padding: 15px 0;
            border-bottom: 1px solid #e4e5e6;
        }
        ul {
            height: 150px;
            overflow: auto;
            font-size: 12px;
            li{
                display: flex;
                align-items: center;
                padding: 5px 0;
                &:hover{
                    cursor: pointer;
                    background: #17ceb1;
                    color: #fff;
                }
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 100%;
                }
                span{
                    margin-left: 10px;
                }
            }
        }

    }
</style>
