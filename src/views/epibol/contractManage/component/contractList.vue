<template>
    <div class="contractRow" :class="{'nothingContractBox':MsgDataAssemble.length==0}">
        <div v-if="loadingFlag" style="height: 100%;">
            <loading></loading>
        </div>
        <dl v-if="!loadingFlag && (MsgDataAssemble && MsgDataAssemble.length > 0)" class="contractTag">
            <Scroll :on-reach-bottom="changePage" :height="scrollHeight">
                <!--<Card dis-hover v-for="(item, index) in list1" :key="index" style="margin: 32px 0">-->
                <!--Content {{ item }}-->
                <!--</Card>-->

                <template v-if="!guideKey">

                    <dd v-for="(item,index) in MsgDataAssemble" :key="index" :id="'contractRow'+index">
                        <p v-if="item.network === '2'" class="networkSign">电</p>
                        <div class="statusRow">
                            <div :class="[item.status!=0?'status':'status yellow']">
                                <span v-if="item.is_over === 0"> 未完善</span>
                                <span
                                    v-else-if="item.status==1&&item.company_signServiceId&&item.customer_signServiceId">合同已签章</span>
                                <span v-else> {{item.status_text}}</span>
                            </div>
                            <div class="title">
                                <Icon v-if="editShow(item)" type="edit" class="icon"
                                      @click.native="editContract(item)"></Icon>
                                <em class="icon iconfonts icon-backs" id="more" @click="closeSlide(item)"></em>
                                <!-- item.status == 1 表示合同已确认，已确认合同无法删除 -->
                                <Icon v-if="item.status < 1" type="trash-a" class="del"
                                      @click.native="deleteContract(item.id)"></Icon>

                                <!-- <Dropdown trigger="click" placement="bottom-end" v-if="item.status<='0'">
                                    <a href="javascript:void(0)">
                                        <Icon type="ios-more"  size="38"></Icon>
                                    </a>

                                    <DropdownMenu slot="list" >
                                        <DropdownItem >编辑</DropdownItem>
                                        <DropdownItem >删除</DropdownItem>
                                    </DropdownMenu>
                                    <DropdownMenu slot="list" v-else>
                                        <DropdownItem @click.native="contDetails(item)">详情</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown> -->
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
                                <i class="iconfonts icon-loudong"></i> {{item.customer_name}}
                            </p>
                            <p class="company">
                                {{item.start_time}} ~ {{item.end_time}}
                            </p>
                        </div>
                        <!--slider-->
                        <previewlist
                            :propsData="{ShowFlag:item.ShowFlag,screenshotID:'contractRow'+index,contractID:item.id}"
                            @closeSlide="closeSlide(item)"></previewlist>
                    </dd>
                </template>
                <template v-else>
                    <dd v-for="(item,index) in MsgDataAssemble" data-step="1" data-disable-interaction="1"
                        data-start="5" data-last="5" :data-intro="guideSteps.step1"
                        :key="index" :id="'contractRow'+index">
                        <p v-if="item.network === '2'" class="networkSign">电</p>
                        <div class="statusRow">
                            <div :class="[item.status!=0?'status':'status yellow']">
                                <span v-if="item.is_over === 0"> 未完善合同</span>
                                <span
                                    v-else-if="item.status==1&&item.company_signServiceId&&item.customer_signServiceId">合同已签章</span>
                                <span v-else> {{item.status_text}}</span>
                            </div>
                            <div class="title">
                                <Icon v-if="editShow(item)" type="edit" class="icon"
                                      @click.native="editContract(item)"></Icon>
                                <em class="icon iconfonts icon-backs" id="more" @click="closeSlide(item)"></em>
                                <!-- item.status == 1 表示合同已确认，已确认合同无法删除 -->
                                <Icon v-if="item.status < 1" type="trash-a" class="del"
                                      @click.native="deleteContract(item.id)"></Icon>

                                <!-- <Dropdown trigger="click" placement="bottom-end" v-if="item.status<='0'">
                                    <a href="javascript:void(0)">
                                        <Icon type="ios-more"  size="38"></Icon>
                                    </a>

                                    <DropdownMenu slot="list" >
                                        <DropdownItem >编辑</DropdownItem>
                                        <DropdownItem >删除</DropdownItem>
                                    </DropdownMenu>
                                    <DropdownMenu slot="list" v-else>
                                        <DropdownItem @click.native="contDetails(item)">详情</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown> -->
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
                                <i class="iconfonts icon-loudong"></i> {{item.customer_name}}
                            </p>
                            <p class="company">
                                {{item.start_time}} ~ {{item.end_time}}
                            </p>
                        </div>

                        <!--slider-->
                        <previewlist
                            :propsData="{ShowFlag:item.ShowFlag,screenshotID:'contractRow'+index,contractID:item.id}"
                            @closeSlide="closeSlide(item)"></previewlist>
                    </dd>

                </template>

                <!--<dd class="contract-guide-dom" v-for="(item,index) in MsgDataAssemble"-->
                <!--:key="index" :id="'contractRow'+index">-->
                <!--<p v-if="item.network === '2'" class="networkSign">电</p>-->
                <!--<div class="statusRow">-->
                <!--<div :class="[item.status!=0?'status':'status yellow']">-->
                <!--<span v-if="item.is_over === 0"> 未完善合同</span>-->
                <!--<span v-else-if="item.status==1&&item.company_signServiceId&&item.customer_signServiceId">合同已签章</span>-->
                <!--<span v-else> {{item.status_text}}</span>-->
                <!--</div>-->
                <!--<div class="title">-->
                <!--<Icon v-if="editShow(item)" type="edit" class="icon"-->
                <!--@click.native="editContract(item)"></Icon>-->
                <!--<em class="icon iconfonts icon-backs" id="more" @click="closeSlide(item)"></em>-->
                <!--&lt;!&ndash; item.status == 1 表示合同已确认，已确认合同无法删除 &ndash;&gt;-->
                <!--<Icon v-if="item.status < 1" type="trash-a" class="del"-->
                <!--@click.native="deleteContract(item.id)"></Icon>-->

                <!--&lt;!&ndash; <Dropdown trigger="click" placement="bottom-end" v-if="item.status<='0'">-->
                <!--<a href="javascript:void(0)">-->
                <!--<Icon type="ios-more"  size="38"></Icon>-->
                <!--</a>-->

                <!--<DropdownMenu slot="list" >-->
                <!--<DropdownItem >编辑</DropdownItem>-->
                <!--<DropdownItem >删除</DropdownItem>-->
                <!--</DropdownMenu>-->
                <!--<DropdownMenu slot="list" v-else>-->
                <!--<DropdownItem @click.native="contDetails(item)">详情</DropdownItem>-->
                <!--</DropdownMenu>-->
                <!--</Dropdown> &ndash;&gt;-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="projectName" @click="enter(item)">-->
                <!--{{item.contract_name}}-->
                <!--</div>-->
                <!--<div class="projectMoney" @click="enter(item)">-->
                <!--￥<span>{{item.contract_price}}</span>-->
                <!--</div>-->
                <!--<div class="projectInfo" @click="enter(item)">-->
                <!--<p class="company">-->
                <!--<i class="iconfonts icon-loudong"></i> {{item.customer_name}}-->
                <!--</p>-->
                <!--<p class="company">-->
                <!--{{item.start_time}} ~ {{item.end_time}}-->
                <!--</p>-->
                <!--</div>-->

                <!--&lt;!&ndash;slider&ndash;&gt;-->
                <!--<previewlist-->
                <!--:propsData="{ShowFlag:item.ShowFlag,screenshotID:'contractRow'+index,contractID:item.id}"-->
                <!--@closeSlide="closeSlide(item)"></previewlist>-->
                <!--</dd>-->

            </Scroll>

        </dl>
        <div v-if="!loadingFlag && MsgDataAssemble.length==0" style="height: 100%;">
            <nothink type="project" text="暂无合同"></nothink>
        </div>


        <Modal v-model="delContractModel" title="确认删除" @on-ok="confirmDelContract">
            <p style="font-size: 15px;letter-spacing: 1px;">是否确认删除！</p>
        </Modal>
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
                list1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                addModal: false,
                modalTitle: null,
                onContractData: Object,
                chatMemberList: [],
                delContractModel: false,
                delContractId: null
            };
        },
        props: {
            guideSteps: {
                type: Object,
                default: () => ({})
            },
            guideKey: {
                type: String,
                default: '',
            },
            contData: {
                type: Array,
                default: []
            },
            loadingFlag: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            MsgDataAssemble() {
                this.contData.forEach((creent, index, arr) => {
                    creent.ShowFlag = false;
                });
                // console.log(this.contData)
                return this.contData;
            }
        },
        mounted() {
            this.autoH();
            this.$bus.on('addContractData', (val) => {
                this.onContractData = val;
            });
            this.$nextTick(() => {
                setTimeout(() => {
                    // this.setDomData()
                }, 1000);
            });
            // this.getChatMemberList();
            // this.addEventListenerFun();
        },
        methods: {
            ...mapMutations(['setContractId', 'setIsEdit']),
            setDomData() {

                let dataStep = null;
                if (this.guideKey) {
                    dataStep = '5';
                } else {
                    dataStep = '1';
                }
                let dom = document.querySelector('.contract-guide-dom')[0];
                if (dom) {
                    dom.setAttribute('data-step', dataStep);
                    dom.setAttribute('data-disable-interaction', dataStep);
                    dom.setAttribute('data-start', '5');
                    dom.setAttribute('data-last', '5');
                    dom.setAttribute('data-intro', this.guideSteps.step1);
                }
            },
            changePage() {
                this.$emit('changePage', this.page);
                this.page++;
            },
            // 初始化高
            autoH() {
                // $('.contractRow').height($(window).height() - 160);
                this.$store.commit('changContractStatus', false);
                // scrollHeight
                if (document.querySelector('.contractRow')) {
                    this.scrollHeight = document.querySelector('.contractRow').offsetHeight;
                }
            },
            //删除
            deleteContract(id) {
                this.delContractId = id;
                this.delContractModel = true;

                // if (window.confirm('是否确认删除?')) {
                //     let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_delete_contract;
                //     let params = {
                //         "contract_id": id
                //     }
                //     this.$axios.post(url, params).then(msg => {
                //         if(msg.data.err_code == 0){
                //             this.$Message.success('删除成功！');
                //             this.$bus.emit('addSuccess');
                //         }else {
                //             this.$Message.warning(msg.data.err_message);
                //         }
                //     })
                // } else {
                //     return;
                // }
            },
            async confirmDelContract() {
                let params = {
                    "contract_id": this.delContractId
                };
                let {data} = await api.confirmDelContract(params);
                if (data.err_code == 0){
                    this.$Message.success('删除成功！');
                    this.$bus.emit('addSuccess');
                }
            },
            //编辑
            editContract(item) {
                this.$router.push({path: "/epibol/contract", query: {ID: item.contract_id}});
                // // 改变传入的状态
                // this.$store.commit('getJudgeType', 'edit');
                //
                // // 路由切换 2为电子合同 其他为线下合同
                // this.$store.commit('getContractIDCommit', item.id);//传contrac_ID
                // if (item.network === '2') {
                //     this.$router.push({path: '/epibol/addElectronicContract'});
                // } else {
                //     this.$store.commit('getContractServerButton', true);//保存按钮
                //     this.newAddData();
                // }
            },

            // 新增合同
            newAddData() {
                this.$router.push({path: '/epibol/contractData'});//路由切换
            },
            // 详情
            contDetails(item) {
                this.$store.commit('getContractIDCommit', item.id);
                this.$store.commit('getContractType', item.network);

                this.$router.push({path: '/epibol/contractDetails'});
            },
            enter(item) {
                this.$router.push({path: "/epibol/contract", query: {ID: item.contract_id}});
                // if (item.network === '2') {
                //     if (item.status <= '0' || (item.status == 1 && (!item.company_signServiceId || !item.customer_signServiceId))) {
                //         this.editContract(item);
                //         this.setIsEdit(true);
                //     } else {
                //         this.contDetails(item);
                //     }
                // } else {
                //     if (item.status <= '0') {
                //         this.setIsEdit(true);
                //         this.editContract(item);
                //     } else {
                //         this.contDetails(item);
                //     }
                // }
            },

            closeSlide(data) {
                this.$forceUpdate();
                data.ShowFlag = !data.ShowFlag;
            },
            editShow({status}) {
                return !(status && Number(status) >= 1);
            },

        },
        destroyed() {
            this.$store.commit('getContrateCommit', false);//销毁组件
        }
    };
</script>
<style lang="less">
    .contractTag {
        .ivu-scroll-content {
            padding-left: 8px;
        }
    }

    .previewListSty {
        position: absolute;
        border: 1px solid @base;
        background: #fff;
        padding: 0 10px;
        width: 160px;
        height: 200px;
        border-radius: 3px;
        z-index: 1;
        text-align: center;
        right: 5px;
        top: 50px;

        .tiele {
            padding: 15px 0;
            border-bottom: 1px solid #e4e5e6;
        }

        ul {
            height: 150px;
            overflow: auto;
            font-size: 12px;

            li {
                display: flex;
                align-items: center;
                padding: 5px 0;

                &:hover {
                    cursor: pointer;
                    background: #17ceb1;
                    color: #fff;
                }

                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 100%;
                }

                span {
                    margin-left: 10px;
                }
            }
        }

    }
</style>
