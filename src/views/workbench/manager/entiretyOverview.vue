<template>
    <div class="manager_page_all">

        <main-native>
            <div class="main-header-style"><span class=" main-header-title ">{{this.$route.meta.title}}<div></div></span></div>
        </main-native>

        <div class="clearfix manager_page_header" v-if="manager.manager_page_header">
            <div class='left_manager_head'>
                <manager-in :data='business_concept'></manager-in>
            </div>
            <div class="right_manager_head">
                <managerx :data='business_concept'></managerx>
            </div>
        </div>
        <!-- main -->
        <div class="clearfix manager_main">
            <Row>
                <!-- 投标 -->
                <Col  v-if="manager.manager_main_bid" class="manager_main_bid" span="8">
                    <manager-bid :bidList='bid'></manager-bid>
                </Col>
                <!-- 签单 -->
                <Col v-if="manager.manager_main_Sign" class="manager_main_Sign" span="16">
                    <div class="manager_Sign_children">
                        <manager-sign :contList='contract'></manager-sign>
                    </div>
                </Col>
                <!-- 项目 -->
                <Col v-if="manager.manager_main_project" class="manager_main_project" span="8">
                    <manager-poject :jectList='project'></manager-poject>
                </Col>
                <!-- 质量 -->
                <Col  v-if="manager.manager_main_quality" class="manager_main_quality" span="8">
                    <div class="manager_quality_children">
                        <manager-qua :quaList='quality'></manager-qua>
                    </div>
                </Col>
                <!-- 团队 -->
                <!-- 经理工作台，暂时隐藏《任务平均分值》与《团队》  start -->
                <!-- <Col v-if="manager.manager_main_team" class="manager_main_team" span="8">
                <div class="manager_team_children">
                    <manager-team :teamList='team'></manager-team>
                </div>
                </Col> -->
                <!-- 经理工作台，暂时隐藏《任务平均分值》与《团队》  end -->
            </Row>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import managerBid from './managerBid.vue';
    import managerSign from './managerSign.vue';
    import managerPoject from './managerPoject.vue';
    import managerQua from './managerQua.vue';
    import managerTeam from './managerTeam.vue';
    import managerIn from './managerIn.vue';
    import managerx from './managerx.vue';
    import mainNative from '../../main-components/mainNative.vue';
    export default {
        data () {
            return {
                bid: {},
                team: {},
                quality: {},
                project: {},
                contract: [],
                business_concept: {}
            };
        },
        components: {
            managerBid,
            managerSign,
            managerPoject,
            managerQua,
            managerTeam,
            managerIn,
            managerx,
            mainNative
        },
        mounted () {
            this.getData();
        },
        methods: {
            // 获取数据
            getData () {
                const url = this.GLOBAL.baseRouter+this.$GLOBALAPI.task_manager_wp;
                const items = {};
                this.$axios.post(url, items).then(data => {
                    const objData = data.data;
                    objData.bid.add = objData.bid.add.split('%')[0];
                    objData.bid.win_rate = Number(objData.bid.win_rate.split('%')[0]);
                    objData.quality.outside_pass = objData.quality.outside_pass.split('%')[0];
                    objData.quality.inside_pass = objData.quality.inside_pass.split('%')[0];
                    this.bid = objData.bid;
                    this.team = objData.team;
                    this.quality = objData.quality;
                    this.project = objData.project;
                    this.contract = objData.contract;
                    this.business_concept = objData.business_concept;
                });
            }
        },
        computed: {
            ...mapState({
                manager (value) {
                    return value.app.manager;
                }
            })
        }
    };
</script>
<style lang="less" scoped>
    .manager_page_all{
        width: 100%;
        min-height: 100%;
    }

    .manager_page_header{
        width: 100%;
        /*height: 120px;*/
        /* margin-top: 30px; */
    }
    .mag-1{
        width: 10%;
        float: left;
    }
    .mag-2{
        width: 20%;
        float: left;
    }
    .mag-3{
        width: 30%;
        float: left;
    }
    .mag-4{
        width: 40%;
        float: left;
    }
    .mag-5{
        width: 50%;
        float: left;
    }
    .mag-6{
        width: 60%;
        float: left;
    }
    .mag-7{
        width: 70%;
        float: left;
    }
    .mag-8{
        width: 80%;
        float: left;
    }
    .mag-9{
        width: 90%;
        float: left;
    }
    .mag-10{
        width: 100%;
        float: left;
    }
    .left_manager_head{
        width: 50%;
        height: 100%;
        float: left;
        padding-right: 15px;
    }
    .right_manager_head{
        width: 50%;
        height: 100%;
        float: left;
        padding-left: 15px;
    }
    .manager_head_left{
        width: 200px;
        padding-top: 10px;
        float: left;
    }
    .manager_head_right{
        width: calc(100% - 200px);
        float: left;
    }
    .manager_head_right>div{
        height: 100%;
    }
    .manager_page_header>div{
        height: 100%;
    }
    .manager_rve,
    .manager_rvs{
        border-left: 1px solid rgb(210,210,210);
    }
    .scope_overview{
        font-size: 26px;
        letter-spacing: 5px;
    }
    .manager_box_rve,
    .manager_box_rves{
        width: 80%;
        height: 100%;
        margin: auto;
        padding-top: 10px;
        /* background: red; */
    }
    .income_msg{
        font-size: 20px;
    }
    .income_msg_details{
        width: 100%;
        margin-top: 20px;
    }
    .receivables{
        float: left;
    }
    .receivables>span:first-child,
    .payment>span:first-child{
        font-size: 16px;
    }
    .receivables>span:last-child,
    .payment>span:last-child{
        font-size: 30px;
        Color: rgb(24,191,164);
        font-weight: 400;
    }
    .payment{
        float: right;
    }
    .manager_main{
        width: 100%;
        padding-top: 30px;
    }
    .manager_main_bid{
        height: 300px;
        background: #ffffff;
    }
    .manager_Sign_children{
        width: 100%;
        height: 100%;
        background: rgb(240,240,240);
    }
    .manager_main_Sign{
        height: 300px;
        padding-left: 30px;
    }
    .manager_main_project,
    .manager_main_quality,
    .manager_main_team{
        /* width: 33.333333%; */
        height: 300px;
        margin-top: 30px;
        /* float: left; */

    }
    .manager_main_quality,
    .manager_main_team{
        padding-left: 30px;
        //  <!-- 经理工作台，暂时隐藏《任务平均分值》与《团队》后宽度 -->
        width: 66.66666667%;
    }
    .manager_quality_children{
        width: 100%;
        height: 100%;
        background: rgb(240,240,240);
    }
    .manager_team_children{
        width: 100%;
        height: 100%;
        background: rgb(240,240,240);
    }
</style>
