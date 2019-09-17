<template>
    <div>
        <!-- statisInfo -->
        <div class="statisInfo">
            <!-- inCome -->
            <div class="sIncome">
                <div class="title">收入</div>
                <div>
                    <div class="infoMent sPayMent">
                        <i class="iconfonts icon-qianbao"></i> 已收款
                        <p>￥{{Number(statisData.income).toFixed(2)}}</p>
                    </div>
                    <div class="infoMent sPayAble">
                        <i class="iconfonts icon-shoukuan"></i> 待收款
                        <p>￥{{Number(statisData.wait_income).toFixed(2)}}</p>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <!-- sDisbu -->
            <div class="sIncome sDisbu">
                <div class="title">支出</div>
                <div>
                    <div class="infoMent outPaid">
                        <i class="iconfonts icon-qiandai"></i> 已支出
                        <p>￥{{Number(statisData.pay).toFixed(2)}}</p>
                    </div>
                    <div class="infoMent forPaid">
                        <i class="iconfonts icon-zidingyibiaodan-caiwulei_zhichu"></i> 待支出
                        <p>￥{{Number(statisData.wait_pay).toFixed(2)}}</p>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <!-- sProje -->
            <div class="sIncome sProje">
                <div class="title">&nbsp;</div>
                <div>
                    <div class="infoMent">
                        <span class="project">{{statisData.project_count}}</span>个
                        <p>承接项目</p>
                    </div>
                    <div class="infoMent">
                        <span class="number">{{statisData.member_count}}</span>个
                        <p>成员数量</p>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <!-- sGrade start-->
            <!-- <div class="sGrade">
                <i-circle :size="80" :trail-width="5" :stroke-width="6" :percent="valueHalf*20" stroke-linecap="square" stroke-color="@orange" trail-color="#fff2d7" >
                    <div>
                        <p class="gradeText"><span>{{Number(statisData.quality)}}</span>分</p>
                        <Rate allow-half disabled v-model="valueHalf" />
                    </div>
                </i-circle>
                <p class="title">总体质量评分</p>
            </div> -->
            <!-- sGrade end -->
            <div class="clear"></div>
        </div>
        <!-- statisEchart -->
        <div class="statisEchart">
            <!-- 中标率 -->
            <div class="echartColumn bidding" id="bidding">
                <div class="echartTitle"><span>中标率</span>
                    <!--<em class="icon iconfonts icon-backs" @click="biddingColor.ShowFlag = !biddingColor.ShowFlag"></em>-->
                </div>
                <bid-ding :biddingColor="biddingColor" :biddingData="bidData"></bid-ding>
                <!--<previewlist :propsData="biddingColor" @closeSlide="biddingColor.ShowFlag=!biddingColor.ShowFlag"></previewlist>-->
            </div>
            <!-- 收入走势 -->
            <div class="echartColumn earning" id="earning">
                <div class="echartTitle"><span>收入走势</span>
                    <!--<em class="icon iconfonts icon-backs" @click="earningColor.ShowFlag = !earningColor.ShowFlag"></em>-->
                </div>
                <bid-ding :biddingColor="earningColor" :biddingData="earningData"></bid-ding>
                <!--<previewlist :propsData="earningColor" @closeSlide="earningColor.ShowFlag=!earningColor.ShowFlag"></previewlist>-->
            </div>
            <!-- 承接项目走势 -->
            <div class="echartColumn project" id="project">
                <div class="echartTitle"><span>承接项目走势</span>
                    <!--<em class="icon iconfonts icon-backs" @click="projectColor.ShowFlag = !projectColor.ShowFlag"></em>-->
                </div>
                <bid-ding :biddingColor="projectColor" :biddingData="projectData"></bid-ding>
                <!--<previewlist :propsData="projectColor" @closeSlide="projectColor.ShowFlag=!projectColor.ShowFlag"></previewlist>-->
            </div>
            <!-- 暂时隐藏掉质量走势与成员空闲走势 start -->
            <!-- 质量走势 -->
            <!-- <div class="echartColumn quality" id="quality">
                <div class="echartTitle"><span>质量走势</span><em class="icon iconfonts icon-backs" @click="qualityColor.ShowFlag = !qualityColor.ShowFlag"></em></div>
                <bid-ding :biddingColor="qualityColor" :biddingData="qualityData"></bid-ding>
                <previewlist :propsData="qualityColor" @closeSlide="qualityColor.ShowFlag=!qualityColor.ShowFlag"></previewlist>
            </div> -->
            <!-- 成员空闲走势 -->
            <!-- <div class="echartColumn member" id="member">
                <div class="echartTitle"><span>成员空闲走势</span><em class="icon iconfonts icon-backs" @click="memberColor.ShowFlag = !memberColor.ShowFlag"></em></div>
                <bid-ding :biddingColor="memberColor" :biddingData="memberData"></bid-ding>
                <previewlist :propsData="memberColor" @closeSlide="memberColor.ShowFlag=!memberColor.ShowFlag"></previewlist>
            </div> -->
            <!-- 暂时隐藏掉质量走势与成员空闲走势 end -->
            <div class="clear"></div>
        </div>

        <!-- //statisEchartEnd -->
    </div>
</template>
<script>
import bidDing from './statisHome/bidding';
import remoteJs from '@/components/remoteJs';
export default {
    data(){
        return {
            valueHalf: 1.2,
            // 中标率
            biddingColor: {
                cTitle: '中标率',
                Cstart: '#c0f3ea',
                Cend: '#f6fdfc',
                Cline: '#4CAF50',
                echartID: 'echartBid',
                ShowFlag: false,
                screenshotID: 'bidding',
                tabName: 'statisHome'
            },
            // 收入走势
            earningColor: {
                cTitle: '收入走势',
                Cstart: '#feeabe',
                Cend: '#fffcf6',
                Cline: '#FF9800',
                echartID: 'echartEarning',
                ShowFlag: false,
                screenshotID: 'earning',
                tabName: 'statisHome'
            },
            // 承接项目走势
            projectColor: {
                cTitle: '承接项目走势',
                Cstart: '#d0e8fe',
                Cend: '#f5faff',
                Cline: '#2196F3',
                echartID: 'echartProject',
                ShowFlag: false,
                screenshotID: 'project',
                tabName: 'statisHome'
            },
            // 质量走势
            qualityColor: {
                cTitle: '质量走势',
                Cstart: '#ffd4d6',
                Cend: '#fff3f3',
                Cline: '#f44336',
                echartID: 'echartQuality',
                ShowFlag: false,
                screenshotID: 'quality',
                tabName: 'statisHome'
            },
            // 成员空闲走势
            memberColor: {
                cTitle: '成员空闲走势',
                Cstart: '#ceeccf',
                Cend: '#fafdfa',
                Cline: '#4CAF50',
                echartID: 'echartMember',
                ShowFlag: false,
                screenshotID: 'member',
                tabName: 'statisHome'
            },

            //图表数据
            bidData: {}, // 中标
            earningData: {}, // 收入走势
            projectData: {}, // 承接项目
            qualityData: {}, // 质量走势
            memberData: {},  //  成员

            statisData: Array
        };
    },
    components: {
        bidDing: bidDing,
    },
    beforeMount(){
        this.getStatisData();
    },
    methods: {
        getStatisData(){
            this.$Loading.start();
            let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_home_page;
            this.$axios.get(url).then(msg=>{
                if (msg.data.err_code==0){
                    this.$Loading.finish();
                    this.statisData=msg.data.data;
                    this.valueHalf=Number(this.statisData.quality);

                    this.bidData=msg.data.data.bid_trend;
                    this.earningData=msg.data.data.income_trend;
                    this.projectData=msg.data.data.project_trend;
                    this.qualityData=msg.data.data.quality_trend;
                    this.memberData=msg.data.data.free_trend;

                } else {
                    this.$Loading.error();
                }
            });
        }
    }
};
</script>

