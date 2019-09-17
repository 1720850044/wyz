<template>
    <div class="qualityContainer" id="completed">
        <main-native>
            <div class="main-header-style">
                <span class="main-header-title">{{this.$route.meta.title}}<div></div></span>
            </div>
        </main-native>

        <div class="nav" id="navOffsetTop">
            <ul class="categoryUl">
                <li @click="getlist('finish',4);categoryIndex = 0">
                    <div class="rowSty">
                        <div class="cloumSty" :class="{'baseSty':categoryIndex == 0}">
                            <div>
                                <i-circle :size="100" :trail-width="8" :stroke-width="13" :percent=param.num/finishCount*100 stroke-linecap="square" stroke-color="#3bceb6" trail-color="#d5f0eb">
                                    <div class="text">
                                        <p class="big" style="color:#3bceb6;">{{param.num}} <span style="color: #adadad">/ {{ finishCount }}</span>
                                        </p>
                                    </div>
                                </i-circle>
                                <p class="description">{{$t('project.pro_theArchive')}}</p>
                            </div>
                            <i class="activeSty"></i>
                        </div>
                    </div>
                </li>
                <li  v-if="devShow" @click="getlist('nofinish',1);categoryIndex = 1">
                    <div class="rowSty">
                        <div class="cloumSty" :class="{'orangeSty':categoryIndex == 1}">
                            <div>
                                <i-circle :size="100" :trail-width="0" :stroke-width="13" :percent="100" stroke-linecap="square" stroke-color="#fcc44a">
                                    <div class="text">
                                        <p class="big" style="color:#FF9800;">{{param.num1}}</p>
                                    </div>
                                </i-circle>
                                <p class="description">{{$t('workbench.work_insideExamineText')}}</p>
                            </div>
                            <i class="activeSty"></i>
                        </div>
                    </div>
                </li>
                <li v-if="devShow" @click="getlist('nofinish',3);categoryIndex = 2">
                    <div class="rowSty">
                        <div class="cloumSty" :class="{'blueSty':categoryIndex == 2}">
                            <div>
                                <i-circle :size="100" :trail-width="0" :stroke-width="13" :percent="100" stroke-linecap="square" stroke-color="#7cbefc">
                                    <div class="text">
                                        <p class="big" style="color:#2196F3;">{{param.num2}}</p>
                                    </div>
                                </i-circle>
                                <p class="description">{{$t('project.pro_internalFeedback')}}</p>
                            </div>
                            <i class="activeSty"></i>
                        </div>
                    </div>
                </li>
                <li v-if="epibolyShow" @click="getlist('nofinish',2);categoryIndex = 3">
                    <div class="rowSty">
                        <div class="cloumSty" :class="{'redSty':categoryIndex == 3}">
                            <div>
                                <i-circle :size="100" :trail-width="0" :stroke-width="13" :percent="100" stroke-linecap="square" stroke-color="#ff898e">
                                    <div class="text">
                                        <p class="big" style="color:#f44336;">{{param.num3}}</p>
                                    </div>
                                </i-circle>
                                <p class="description">{{$t('project.pro_externalPending')}}</p>
                            </div>
                            <i class="activeSty"></i>
                        </div>
                    </div>
                </li>
                <li v-if="epibolyShow" @click="getlist('nofinish',4);categoryIndex = 4">
                    <div class="rowSty">
                        <div class="cloumSty" :class="{'greenSty':categoryIndex == 4}">
                            <div>
                                <i-circle :size="100" :trail-width="0" :stroke-width="13" :percent="100" stroke-linecap="square" stroke-color="#78c97c">
                                    <div class="text">
                                        <p class="big" style="color:#4CAF50;">{{param.num4}}</p>
                                    </div>
                                </i-circle>
                                <p class="description">{{$t('project.pro_externalFeedback')}}</p>
                            </div>
                            <i class="activeSty"></i>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="scale-statistics-bar" v-show="showOffsetBar">
            <div class="statistics-fix-bar">
                <div class="first border-dashed-line" @click="getlist('finish',4)">
                    <label>{{$t('project.pro_theArchive')}}</label>
                    <span class="special-span">{{param.num}}</span><b>/</b><span>{{ finishCount }}</span>
                </div>
                <div v-if="devShow"   class="second border-dashed-line" @click="getlist('nofinish',1)">
                    <label>{{$t('workbench.work_insideExamineText')}}</label>
                    <span class="special-span">{{param.num1}}</span>
                </div>
                <div v-if="devShow"  class="third border-dashed-line" @click="getlist('nofinish',3)">
                    <label>{{$t('project.pro_internalFeedback')}}</label>
                    <span class="special-span">{{param.num2}}</span>
                </div>
                <div v-if="epibolyShow" class="fourth border-dashed-line" @click="getlist('nofinish',2)">
                    <label>{{$t('project.pro_externalPending')}}</label>
                    <span class="special-span">{{param.num3}}</span>
                </div>
                <div v-if="epibolyShow" class="fifth" @click="getlist('nofinish',4)">
                    <label>{{$t('project.pro_externalFeedback')}}</label>
                    <span class="special-span">{{param.num4}}</span>
                </div>
            </div>
        </div>
        <template v-if="indexShow">
            <pigeonhole v-if="finish" ref="finish" @showModal="showDownloadPage = true"></pigeonhole>
            <resources-list v-else ref="list" :resourcesStatus="resourcesStatus" @showModal="showDownloadPage = true"></resources-list>
        </template>
        <upload-download-modal v-if="showDownloadPage" :initModalParams="toDownloadParams" @closeModal="showDownloadPage = false"></upload-download-modal>
    </div>
</template>

<script>
    import Cookie from 'js-cookie';
    import {pjResourceIndex, pjStagePage, pjResourceCount, resourceProjectInfo
        , pjresourcePage} from '@/axios/modules/project/projectResource';
    import browsetask from './task/browseTaskPop';
    import mySort from '../main-components/sort';
    import pigeonhole from './assetsManage/pigeonhole';
    import resourcesList from './components/resourcesList';
    import {mapGetters, mapState, mapMutations} from 'vuex';
    import mainNative from '../main-components/mainNative.vue';
    import UploadDownloadModal from "../../components/resourceManagement/uploadDownloadModal";
    export default {
        components: {
            mySort,
            browsetask,
            pigeonhole,
            resourcesList,
            mainNative,
            UploadDownloadModal
        },
        data() {
            return {
                is_collaboration: false,
                collaboration: false,
                indexShow: false,
                isContract: false,
                finishCount: null,
                finish: true,
                param: {
                    num1: 0,
                    num2: 0,
                    num3: 0,
                    num4: 0,
                    num: 0
                },
                status: '1',
                sortStatus: '',
                searchInput: '',
                taskType: '',
                page: 1,
                loading: false,
                showOffsetBar: false,

                categoryIndex: 0,
                showDownloadPage: false,
                toDownloadParams: {
                    type: 'download'
                },
                resourcesStatus: 0,
                companyType: Cookie.get('company')?JSON.parse(Cookie.get('company')).type:'',
            };
        },
        mounted() {
            this.initGuide();

            let scrollBox = document.querySelector('.single-page-con');
            scrollBox.addEventListener('scroll', this.handleScroll);
            //  项目管理流程引导

        },
        methods: {
            ...mapMutations(['setCollaboration']),
            // 项目管理流程第三步
            async initGuide() {
                let {data} = await pjResourceIndex();
                this.indexShow = true;
                // navOffsetTop
                let _this = this;
                await this.getProjectInfos();
                this.fetchNum(1);
                this.fetchNum(2);
                this.fetchNum(3);
                this.fetchNum(4);
                this.fetchFinishNum();
                this.getCompalteCount();
                // this.$refs.finish.init();
                let result = {data: data};
                if (result.data.guide) {
                    if (result.data.guide == 'partyAProjectManagement') {
                        setTimeout(() => {
                            _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                .addSteps([
                                    {
                                        element: document.querySelector('.nav'),
                                        intro: this.$lau.guide_words.k19,
                                        position: 'left',
                                        disableInteraction: '1',
                                        start: '3',
                                        total: '3'
                                    }
                                ]).start()
                                .onskip(() => {
                                    sessionStorage.needGuideData = false;
                                })
                                .oncomplete(() => {
                                    this.$router.push('/workbench/leader');
                                });
                        });
                    } else if (result.data.guide == 'partyBProjectManagement') {
                        setTimeout(() => {
                            _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                .addSteps([
                                    {
                                        element: document.querySelector('.nav'),
                                        intro: this.$lau.guide_words.k20,
                                        position: 'left',
                                        disableInteraction: '1',
                                        start: '5',
                                        total: '5'
                                    }
                                ]).start().oncomplete(() => {
                                    this.$router.push('/workbench/leader');
                                });
                        });
                    } else if (result.data.guide === 'feaTures'){
                        this.bubble();
                    }
                }

            },
            bubble(){
                let text = this.$lau.bubble.feaTures;
                this.$nextTick(() => {
                    let defaultOptions = [
                        {
                            id: 'fristCircle',
                            position: 'right',
                            title: text[0].title,
                            content: text[0].content,
                            relative: 'body',
                        },
                        {
                            id: 'secondCircle',
                            position: 'bottom',
                            title: text[1].title,
                            content: text[1].content,
                            relative: 'body',
                        }, {
                            id: 'thirdCircle',
                            position: 'bottom',
                            title: text[2].title,
                            content: text[3].content,
                            relative: 'body',
                        },
                        {
                            id: 'fourthCircle',
                            position: 'left',
                            title: text[3].title,
                            content: text[3].content,
                            relative: 'body',
                        },
                        {
                            id: 'fifthCircle',
                            position: 'left',
                            title: text[4].title,
                            content: text[4].content,
                            relative: 'body',
                        },
                    ];
                    let is_collaboration = this.is_collaboration;
                    this.is_collaboration = true;
                    // let isContract = this.isContract;
                    // this.isContract = true;
                    let fn = ((item) => {
                        if (item.id === 'fifthCircle'){
                            // this.isContract = isContract;
                            this.is_collaboration = is_collaboration;
                        }
                    });
                    setTimeout(() => {
                        this.$bubble(defaultOptions, fn);
                    });
                });
            },
            handleScroll() {
                let pageOffsetTop = document.querySelector('.single-page-con').offsetTop;
                let pageScrollTop = document.querySelector('.single-page-con').scrollTop;
                let navOffsetTop = document.getElementById('navOffsetTop').offsetTop;
                let navHeight = document.getElementById('navOffsetTop').clientHeight;
                if ((pageOffsetTop + pageScrollTop) > (navOffsetTop + navHeight)) {
                    this.showOffsetBar = true;
                    if (this.showOffsetBar) {
                        document.querySelector('.scale-statistics-bar').style.width = document.body.clientWidth - 180 - 60+'px';
                    }
                } else if (pageScrollTop < 140) {
                    this.showOffsetBar = false;
                }
            },
            //重构开始
            //获取文件不同阶段的文件数
            async fetchNum(str) {
                let dataObj = {
                    status: str + '',
                    project_id: sessionStorage.projectID
                };

                let {data} = await pjStagePage(dataObj);
                if (str == 1) {
                    this.param.num1 = data.page.count;
                } else if (str == 3) {
                    this.param.num2 = data.page.count;
                } else if (str == 2) {
                    this.param.num3 = data.page.count;
                } else if (str == 4) {
                    this.param.num4 = data.page.count;
                }
            },
            //获取已归档数
            async fetchFinishNum() {
                let dataObj = {
                    status: '4',
                    project_id: sessionStorage.projectID
                };
                let {data} = await pjresourcePage(dataObj);
                this.param.num = data.page.count;
            },

            /*获取归档总数*/
            async getCompalteCount() {
                let dataObj = {project_id: sessionStorage.projectID};
                let {data} = await pjResourceCount(dataObj);
                this.finishCount = data.count;
            },
            //获取当前项目详细信息
            getProjectInfos() {
                return new Promise(async (resolve, reject) => {
                    let {data} = await resourceProjectInfo( {id: sessionStorage.projectID});
                    this.projectInfo = data;
                    // 甲is_coll 乙coll
                    if (data.is_collaboration && this.companyType === 1){
                        this.is_collaboration = true;
                        // this.isContract = true;
                    }
                    else if (data.is_collaboration && this.companyType === 0) {
                        this.collaboration = true;
                        // this.isContract = false;
                    }
                    // if (data.is_collaboration) {
                    //     this.isContract = true;
                    // } else {
                    //     this.isContract = false;
                    // }
                    resolve();
                });
            },
            //点击切换
            getlist(type, status){
                if (type == 'finish'){
                    this.finish = true;
                } else {
                    this.finish = false;
                    this.resourcesStatus = status;
                }
            }
        },
        computed: {
            devShow () {
                // dev 甲方 研发   epiboly 乙方 外包
                if ( this.is_collaboration) {
                    return false;
                } else {
                    return true;
                }
            },
            epibolyShow () {
                if (this.collaboration||this.is_collaboration) {
                    return true;
                } else {
                    return false;
                }
            },
        },
        destroyed () {
            let scrollBox = document.querySelector('.single-page-con');
            if (scrollBox) {
                scrollBox.removeEventListener('scroll', this.handleScroll);
            }
        }
    };
</script>

<style lang='less'>
    .qualityContainer{
        background: @baseboard;
        .nav{
            height: 215px;
            width: 100%;
            background: url("../../assets/images/headResoce.png") no-repeat #fff;
            background-position: -190px -45px;
            .categoryUl{
                display: flex;
                justify-content: space-between;
                height: 100%;
                li{
                    position: relative;
                    text-align: center;
                    flex: 1;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    .rowSty{
                        display: flex;
                        justify-content: center;
                        height: 100px;
                        width: 100%;
                        border-right: 1px dashed #e6e6e6;
                    }
                    .cloumSty{
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        padding:  0 40px;
                        .activeSty{
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            height: 3px;
                            width: 100%;
                        }
                        .description{
                            color: #a8a8a8;
                        }
                    }

                    .baseSty{
                        background: -webkit-linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 223, 199, 0.44)); /* Safari 5.1 - 6.0 */
                        background: -o-linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 223, 199, 0.44)); /* Opera 11.1 - 12.0 */
                        background: -moz-linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 223, 199, 0.44)); /* Firefox 3.6 - 15 */
                        background: linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 223, 199, 0.44)); /* 标准的语法 */;
                        .activeSty{
                            background: @base !important;
                        }
                        .description{
                            color: @base !important;
                        }
                    }

                    .orangeSty{
                        background: -webkit-linear-gradient(rgba(213, 249, 243, 0.06), rgba(223, 165, 58, 0.44)); /* Safari 5.1 - 6.0 */
                        background: -o-linear-gradient(rgba(213, 249, 243, 0.06), rgba(223, 165, 58, 0.44)); /* Opera 11.1 - 12.0 */
                        background: -moz-linear-gradient(rgba(213, 249, 243, 0.06), rgba(223, 165, 58, 0.44)); /* Firefox 3.6 - 15 */
                        background: linear-gradient(rgba(213, 249, 243, 0.06), rgba(223, 165, 58, 0.44)); /* 标准的语法 */;
                        .activeSty{
                            background: @orange !important;
                        }
                        .description{
                            color: @orange !important;
                        }
                    }

                    .blueSty{
                        background: -webkit-linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 170, 223, 0.44)); /* Safari 5.1 - 6.0 */
                        background: -o-linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 170, 223, 0.44)); /* Opera 11.1 - 12.0 */
                        background: -moz-linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 170, 223, 0.44)); /* Firefox 3.6 - 15 */
                        background: linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 170, 223, 0.44)); /* 标准的语法 */;
                        .activeSty{
                            background: #33a4fd !important;
                        }
                        .description{
                            color: #33a4fd !important;
                        }
                    }

                    .redSty{
                        background: -webkit-linear-gradient(rgba(213, 249, 243, 0.06), rgba(223, 66, 58, 0.44)); /* Safari 5.1 - 6.0 */
                        background: -o-linear-gradient(rgba(213, 249, 243, 0.06), rgba(223, 66, 58, 0.44)); /* Opera 11.1 - 12.0 */
                        background: -moz-linear-gradient(rgba(213, 249, 243, 0.06), rgba(223, 66, 58, 0.44)); /* Firefox 3.6 - 15 */
                        background: linear-gradient(rgba(213, 249, 243, 0.06), rgba(223, 66, 58, 0.44)); /* 标准的语法 */;
                        .activeSty{
                            background: red !important;
                        }
                        .description{
                            color: red !important;
                        }
                    }

                    .greenSty{
                        background: -webkit-linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 223, 109, 0.44)); /* Safari 5.1 - 6.0 */
                        background: -o-linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 223, 109, 0.44)); /* Opera 11.1 - 12.0 */
                        background: -moz-linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 223, 109, 0.44)); /* Firefox 3.6 - 15 */
                        background: linear-gradient(rgba(213, 249, 243, 0.06), rgba(58, 223, 109, 0.44)); /* 标准的语法 */;
                        .activeSty{
                            background: green !important;
                        }
                        .description{
                            color: green !important;
                        }
                    }
                    &:hover{
                        cursor: pointer;
                    }
                }
            }
            /*<!--.base-card;-->*/
            /*<!--display: flex;-->*/
            /*<!--justify-content: space-around;-->*/
            /*<!--padding: 0;-->*/
            /*<!--overflow: hidden;-->*/
            /*<!-- -webkit-border-radius: 3px;-->*/
            /*<!-- -moz-border-radius: 3px;-->*/
            /*<!--border-radius: 3px;-->*/
            /*<!--background: #fff;-->*/

            /*<!--.frist,.second, .third, .fourth, .fifth{-->*/
            /*<!--float: left;-->*/
            /*<!--width: 100px;-->*/
            /*<!--height: 100px;-->*/
            /*<!--margin: 16px 32px 40px;-->*/
            /*<!--cursor: pointer;-->*/
            /*<!--.text{-->*/
            /*<!--//background: #deeeee;-->*/
            /*<!--width: 80px;-->*/
            /*<!--height: 80px;-->*/
            /*<!--border-radius: 50%;-->*/
            /*<!--margin: 10px;-->*/
            /*<!--padding: 22px 0;-->*/
            /*<!--.big{-->*/
            /*<!--font-size: 16px;-->*/
            /*<!--line-height: 43px;-->*/
            /*<!--}-->*/
            /*<!--}-->*/
            /*<!--.description{-->*/
            /*<!--font-size: 13px;-->*/
            /*<!--color: #798684;-->*/
            /*<!--text-align: center;-->*/
            /*<!--margin-top: 2px;-->*/
            /*<!--}-->*/
            /*<!--}-->*/
        }




        .topNav{
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            margin-bottom: 10px;
            position: fixed;
            top: 64px;
            background: #fff;
            z-index: 1;
            li{
                float: left;
                text-align: center;
                padding: 0 15px;
                cursor: pointer;
            }
        }
        .scale-statistics-bar {
            position: fixed;
            top: 52px;
            /*left: 220px;*/
            width: 100%;
            height: 90px;
            z-index: 5;
            background: #f0f0f0;
            padding: 30px 0 0;

            .statistics-fix-bar {
                width: 100%;
                height: 60px;
                background: #fdfdfd;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                -webkit-box-shadow: 0 5px 8px -5px #888;
                -moz-box-shadow: 0 5px 8px -5px #888;
                box-shadow: 0 5px 8px -5px #888;
                display: flex;
                justify-content: space-around;
                flex-wrap: nowrap;
                > div {
                    width: 50%;
                    line-height: 44px;
                    margin: 8px 0;
                    text-align: center;
                    &.border-dashed-line {
                        border-right: 1px dashed #ddd;
                    }
                    &:hover {
                        cursor: pointer;
                    }
                    > label {
                        font-size: 15px;
                        color: @black_2;
                        margin-right: 5px;
                        cursor: pointer;
                    }
                    > span {
                        font-size: 17px;
                    }
                    > b {
                        font-weight: normal;
                        font-size: 17px;
                        color: #adadad;
                        margin: 0 2px;
                    }

                    &.first {
                        > span {
                            color: #adadad;
                            &.special-span {
                                color: @base;
                            }
                        }
                    }
                    &.second {
                        > span.special-span {
                            color: @orange;
                        }
                    }
                    &.third > span.special-span {
                        color: @blue;
                    }
                    &.fourth > span.special-span {
                        color: @red;
                    }
                    &fifth > span.special-span {
                        color: @base;
                    }
                }
            }
        }
        .menauBar{
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            .switch-display-icon {
                display: block;
                width: 40px;
                height: 40px;
                line-height: 40px;
                > i {
                    display: block;
                    width: 22px;
                    height: 35px;
                    //font-size: 32px;
                    //color: @black_2;
                    margin-top: 4px;
                    &.list-icon {
                        width:20px;
                        background: url("https://static.banbooyun.com/public/img/icon/list-icon.png") no-repeat center / contain;
                    }
                    &.poster-icon {
                        width:20px;
                        background: url("https://static.banbooyun.com/public/img/icon/poster-icon.png") no-repeat center / contain;
                    }
                }
            }
            .switch-show-icon {
                display: block;
                width: 40px;
                height: 40px;
                line-height: 40px;
                > i {
                    font-size: 30px;
                    color: #bdbdbd;
                    margin-top: 7px;
                    &.ivu-icon-eye {
                        color: @base;
                    }
                }
            }
            .projectClassfly{
                overflow: hidden;
                height: 58px;
                display: flex;
                align-items: center;
                li {
                    float: left;
                    display: flex;
                    align-items: center;
                    height: 90%;
                    font-size: 13px;
                    color: @black_2;
                    padding: 0 25px;
                    cursor: pointer;
                    &.currenSty, &:hover {
                        background: @base_option;
                        color:@base
                    }
                    span {
                        margin-left: 5px
                    }
                }
            }
            .RscreenBar{
                overflow: hidden;
                height: 58px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 0;
                li{
                    float: left;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    dl{
                        height: 100%;
                        dd{
                            float: left;
                            font-size: 12px;
                            color: #ccc;
                            background: #fff;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            border-left: 1px dashed #e7e7e7;
                            padding: 0 15px;
                            cursor: pointer;
                            &:after{
                                content: '';
                                display: inline-block;
                                height: 12px;
                                width: 9px;
                                background: url("./proStat/image/searchIcons.png") no-repeat;
                                background-position-y: -46px;
                                margin-left: 5px;
                            }
                            &.byAsc{
                                color:@base;
                                &:after {
                                    background-position-y: 0 !important;
                                }
                            }
                            &.byDesc{
                                &:after {
                                    background-position-y: -23px !important;
                                }
                            }
                        }
                    }
                    .downloadBtn{
                        border: 0;
                        color: #fff;
                        outline: none;
                        background: @base;
                        /*width: 100px;*/
                        height: 100%;
                        text-align: center;
                        margin-left: 10px;
                        border-radius: 3px;
                        padding: 0 10px;
                        i{
                            font-style: normal;
                            font-size: 12px;
                        }
                        &:hover{
                            background: #35ab93;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .row-lists {
            background: #fff;
            width: 100%;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            overflow: hidden;
            .table-header {
                width: 100%;
                height: 46px;
                display: flex;
                justify-content: space-around;
                flex-direction: row;
                flex-wrap: nowrap;
                border-bottom: 1px solid #eee;
                > span {
                    width: 25%;
                    color: #bbb;
                    font-size: 14px;
                    line-height: 46px;
                    text-align: center;
                }
            }
            .row-ul-container {
                //overflow: hidden;
                > li {
                    width: 100%;
                    height: 58px;
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: nowrap;
                    line-height: 58px;
                    border-bottom: 1px solid #eee;
                    position: relative;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    > span {
                        width: 25%;
                        text-align: center;
                        font-size: 14px;
                        color: @black_2;
                        overflow: hidden;
                        -ms-text-overflow: ellipsis;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        > label {
                            cursor: pointer;
                            padding: 3px 10px;
                            border: 1px solid @base;
                            font-size: 12px;
                            color: @base;
                            -webkit-border-radius: 3px;
                            -moz-border-radius: 3px;
                            border-radius: 3px;
                        }
                    }
                    &:hover {
                        cursor: pointer;
                        //-webkit-box-shadow: 0 5px 8px -5px #ddd;
                        //-moz-box-shadow: 0 5px 8px -5px #ddd;
                        //box-shadow: 0 5px 8px -5px #ddd;
                        -webkit-box-shadow: 0 0 3px 1px #ddd;
                        -moz-box-shadow: 0 0 3px 1px #ddd;
                        box-shadow: 0 0 3px 1px #ddd;
                        -webkit-transition: all 0.3s;
                        -moz-transition: all 0.3s;
                        -ms-transition: all 0.3s;
                        -o-transition: all 0.3s;
                        transition: all 0.3s;
                    }
                }
            }
        }
    }
</style>
