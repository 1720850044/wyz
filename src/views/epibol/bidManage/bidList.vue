<template>
    <div class="newBidList">
        <template v-if="loadingFlag">
            <div style="height: 800px">
                <loading></loading>
            </div>
        </template>
        <template v-if="!loadingFlag && (bidListData && bidListData.length > 0)">
            <dl>
                <dd class="dataDD" v-for="(item,index) in bidListData" :key="item.id" :id="'application'+index" @click="applicationInfo(item)">
                    <i class="Statuslabel delete" v-if="item.is_delete === '1'">已删除</i>
                    <i v-else-if="item.bid_status != '4'" class="Statuslabel" :class="{'bidYes':item.bid_status == 1 ||item.bid_status == 2 || item.bid_status == 9}">{{item.status_text}}</i>
                    <div>
                        <div class="bidTitle">
                            <span>{{item.test_name}}</span>
                            <em class="iconfonts icon-backs" @click.self="closeSlide($event,item)"></em>
                        </div>
                        <div class="bidMoney">
                            <span v-if="item.test_price">
                                测试金额
                                <p>￥<em>{{Math.round(Number(item.test_price))}}</em></p>
                            </span>
                            <span v-else>
                                我方报价
                                <p>￥<em>{{Math.round(Number(item.bid_price))}}</em></p>
                            </span>
                            <span>
                                项目预计
                                <p>￥<em>{{Math.round(Number(item.project_max_price))}}</em></p>
                            </span>
                            <div class="clear"></div>
                        </div>
                        <div class="bidPerso">
                            <div class="persoInfo">
                                <div>
                                    <span class="span"><i class="iconfonts icon-renyuanguanli"></i> 负责人：{{item.leader_name ||'未指派'}}</span>
                                    <span class="span"><i class="iconfonts icon-yonghuguanli"></i> 制作人：{{item.execute_name ||'未指派'}}</span>
                                    <div class="clear"></div>
                                </div>

                                <div v-if="item.bid_status === '8'" class="progress" :id="'confirmBtn' + index" >
                                    <button @click="comfirmPay($event,item.id)">确认收款</button>
                                </div>
                                <div v-else class="progress">
                                    <Progress :percent="item.progress" status="active" :stroke-width="5" style="max-width: 100%">
                                        <span style="color: #bdbdbd">{{item.strShengyuDay}}</span>
                                    </Progress>
                                </div>
                            </div>
                        </div>
                    </div>
                    <previewlist :propsData="{ShowFlag:item.ShowFlag,screenshotID:'application'+index,id:item.id,testId:item.test_id,type:'new'}" @closeSlide="closeSlide(null,item)"></previewlist>
                </dd>
            </dl>
            <Page v-if="page.total > page.page_size"
                  class-name="pageSty"
                  :current=page.creentPage
                  :total="page.total"
                  :show-total=false
                  :page-size="page.page_size"
                  @on-change="onChangePage"
            >
            </Page>
        </template>
        <template v-if="!loadingFlag && bidListData.length == 0">
            <div style="min-height: 800px;position: relative">
                <nothink type="project" text="暂无报名"></nothink>
            </div>
        </template>
    </div>
</template>
<script>
import api from 'api';
export default {
    data(){
        return {
            bidListData: [],
            page: {
                creentPage: 1,
                total: 0,
                page_size: 12
            },
            //引导数据
            guideSteps: {
                step3: ''
            },
            needGuideData: null,
            confirmId: null,
            guideFirstComplete: false,
            loadingFlag: true
        };
    },
    computed: {},
    mounted(){
        this.initGuide();
        // this.bidGet();
    },
    methods: {
        // 初始化获取是否引导
        async initGuide () {
            let _this = this;
            let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_bid_listindex;
            this.$axios.get(url).then(({data}) =>{
                if (data.guide){
                    let guide = data.guide;
                    if (guide == 'href'){
                        this.$bus.emit('changeMenu', 2, 0);
                        _this.$router.push({ path: "/artsquare/home"});
                    } else if (guide == 'tendering'){
                        _this.needGuideData = true;
                        _this.bidGet().then((item) => {
                            _this.$guide().exit();
                            setTimeout(() => {
                                _this.$guide().setOptions(this.$CONSTANT.guideOptions)
                                    .addSteps([{
                                        element: document.querySelector('.dataDD'),
                                        intro: this.$lau.guide_words.k38,
                                        position: 'right',
                                        disableInteraction: '1',
                                        start: '3',
                                        total: '7'
                                    }])
                                    .start()
                                    .onskip(function () {
                                        _this.needGuideData = '';
                                        _this.$router.push({ path: "/artsquare/home"});
                                    })
                                    .oncomplete(function () {
                                        _this.$PublicFuns.completePageGuide('tendering').then(res =>{
                                            _this.$router.push({ path: "/epibol/ManageDetails", query: {enteredID: item[0].id, TestID: item[0].test_id, type: 'new', navTitle: '已报名'}});
                                            _this.$guide().exit();
                                            // _this.guideFirstComplete = true;
                                        });
                                    });
                            }, 200);
                        });
                    } else if (guide == 'bidKey'){
                        _this.needGuideData = true;
                        _this.bidGet().then(()=>{
                            setTimeout(() => {
                                _this.bubbleGuide();
                            });
                        });
                    }
                } else {
                    _this.bidGet();
                }
            });
        },
        // 气泡引导
        bubbleGuide () {
            let index = this.getMatchedStatus();
            if (index >= 0) {
                let options = [
                    {
                        id: 'confirmBtn' + index,
                        position: 'bottom',
                        title: '确认收款',
                        content: '需求方已经选择您投标的稿件为中标，并完成支付，点击收款吧！',
                        relative: 'body'
                    }
                ];
                setTimeout(() => {
                    this.$bubble(options, step => {
                        this.needGuideData = null;
                        this.bidGet();
                    });
                });
            }
        },
        getMatchedStatus () {
            for (let index in this.bidListData) {
                if (this.bidListData[index].bid_status === '8') {
                    this.confirmId = index;
                    return this.confirmId;
                }
            }
        },
        // 获取招标数据
        async bidGet(){
            return new Promise((resolve, reject) => {
                this.$Loading.start();
                let parms = {
                    page: this.page.creentPage,
                    page_size: this.page.page_size,
                    needGuideData: this.needGuideData ? true : null
                };
                // debugger
                api.getBidList(parms).then(bidList =>{
                    this.loadingFlag = false;
                    if (bidList.data.err_code == 0){
                        this.page.total = parseInt(bidList.data.page.count);
                        this.$Loading.finish();
                        let listData = bidList.data.data;
                        let nowTime = new Date();
                        for (let i=0;i<listData.length;i++){
                            let strShengyuDay = '';
                            let progressDay = '';
                            let countDiff = '';
                            let cutDiff= '';
                            let dateDiff='';
                            let dayDiff='';
                            if (listData[i].end_time && listData[i].apply_time){
                                countDiff = (listData[i].end_time*1000) - (listData[i].apply_time*1000);
                                cutDiff = Math.round(countDiff / (24 * 3600 * 1000))+1;
                                dateDiff = nowTime.getTime() - (listData[i].end_time*1000);//时间差的毫秒数
                                dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数

                                if (dayDiff > 0){
                                    if (listData[i].bid_status == 9 || listData[i].bid_status == 4 ){
                                        strShengyuDay = `招标完成`;
                                        progressDay= 100;
                                    } else {
                                        strShengyuDay = '交稿截止';
                                        progressDay=100;
                                    }
                                } else if (dayDiff == 0){
                                    strShengyuDay = `今日截止`;
                                    progressDay=100;
                                } else {
                                    strShengyuDay = `剩余 ${Math.abs(dayDiff)} 天`;
                                    progressDay=(100 - (Math.abs(dayDiff)/cutDiff*100));
                                }
                            } else {
                                progressDay = 0;
                                cutDiff = 0;
                                dayDiff = 0;
                                strShengyuDay = 'null';
                            }

                            listData[i].ShowFlag = false;
                            listData[i].progress = progressDay;
                            listData[i].countDay = cutDiff;
                            listData[i].shengyuDay = dayDiff;
                            listData[i].strShengyuDay = strShengyuDay;
                        }
                        this.bidListData = listData;
                        resolve(listData);
                    } else {
                        this.$Loading.error();
                        this.$Message.error(bidList.data.err_message);
                    }
                });
                // .then(() => {
                //     this.bubbleGuide();
                // });
            });
        },

        // 招标详情
        applicationInfo(item){
            this.$router.push({ path: "/epibol/ManageDetails", query: {enteredID: item.id, TestID: item.test_id, type: 'new', navTitle: '已报名'}});
        },
        comfirmPay(e, id){
            e.stopPropagation();
            let _this = this;
            (async function () {
                const collectData = await api.collect({bid: id});
                if (collectData.data.err_code == 0){
                    _this.$Message.success("收款成功!");
                    _this.bidGet();
                } else {
                    _this.$Message.error("收款失败!");
                }
            })();
        },
        closeSlide(event, data){
            if (event){
                event.stopPropagation();
            }
            this.$forceUpdate();
            data.ShowFlag = !data.ShowFlag;
        },
        onChangePage(nowPage){
            this.page.creentPage = nowPage;
            this.bidGet();
        }
    },
    watch: {
        guideFirstComplete (val) {
            if (val) {
                this.bidGet();
            }
        }
    }
};
</script>
<style lang="less">
    .ivu-page-item-jump-next:after, .ivu-page-item-jump-prev:after {
        display: inline-block;
    }
    .pageSty{
        margin-bottom: 30px;
        text-align: center;
    }
</style>
