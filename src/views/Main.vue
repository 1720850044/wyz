<template>
    <div class="main" :class="{'main-hide-text': shrink}">

        <div :style="{paddingLeft: shrink?'60px':'0'}" class="main-header-con">
            <ul class="pageSecondaryNav" :class="{'pageSecondaryNavShow':!menuShow}">
                <Icon v-show="!menuShow" type="navicon-round" @click.native="menuHidden"
                      style="margin-right: 10px;font-size: 20px;"></Icon>
                <div class="iconContainer">
                    <i v-if="pageType === 'workbench'" class="iconfonts icon-xiangmuxiaoxi workbenchIcon"></i>
                    <i v-if="pageType === 'epibol'" class="iconfonts icon-company" style="font-size: 20px;"></i>
                    <em v-if="pageType === 'artsquare' || pageType === 'myPorject' "
                        class="iconfonts icon-icon-project"
                        style="font-size: 20px;"></em>
                </div>
                <div>
                    <p class="projectText">
                        <span class="projectTitle">{{navTitle}}</span>
                        <template v-if=" pageType === 'myPorject' ">
                            <Icon @click.native="goSetting" type="gear-b" size="20"></Icon>
                        </template>
                    </p>
                    <div class="navList">
                        <li class="pageSecondaryLi" v-for="(item,index) in pageTab " :key="index">
                            <router-link class="menuNav" :to="{path:item.path}">{{item.title}}</router-link>
                        </li>
                    </div>
                </div>
            </ul>
            <Header>
                <transition name="fade">
                    <div v-show="menuShow" class="logo" @click="goHome">
                        <div class="iconBox" @click.stop="menuHidden">
                            <Icon type="chevron-left" size="12" style="margin-top: 2px;"></Icon>
                            <Icon type="navicon-round" style="margin:2px 0 0 2px;" size="20"></Icon>
                        </div>
                    </div>
                </transition>
                <div class="main-header-avator">
                    <!-- 创建公司与加入团队操作，暂时都隐藏 2019-03-04-->
                    <!-- <div class="pulsCompany" v-if="jumpFlag">
                        <span @click="selectFun(0)">创建公司</span>
                        <span @click="selectFun(1)">加入公司</span>
                    </div> -->
                    <!-- 多语言切换 -->
                    <!--<Select v-model="defaultLang" style="width: 120px;margin-right: 30px;" @on-change="changePlatformLang">-->
                        <!--<Option  v-for="(lang, index) in languageList" :key="index" :value="lang.lang">{{lang.name}}</Option>-->
                    <!--</Select>-->

                    <div class="Rico">
                        <i class="iconfonts icon-ymy-ren-copy" v-if="client_service"
                           style="float: left;font-size: 21px;margin-top: 10px;" @click="gotoCustomerServicePage()"></i>
                        <i style="float: left; font-size: 19px; margin: 10px 15px 0 0;" class="iconfonts icon-uniE901"
                           v-if="!isManager"
                           @click="showInitGuide()"></i>
                        <upload-operate :uploadParams="{type: 'download'}"></upload-operate>
                        <!-- 暂时隐藏或去掉第二个图标，后面有功能再开放 -->
                        <!-- <Icon type="information-circled"></Icon> -->
                        <!--有无未读消息-->
                        <!--<Badge dot v-if='hasUnReadMessage'>-->
                        <!--<i class="iconfonts icon-chat-top"  :class="{'baseColor':MsgFlag.MsgTabIndex == 0}" @click="showMsg($event,0,true)"></i>-->
                        <!--</Badge>-->
                        <!--<Icon v-else type="chatbubble-working" @click.native="showMsg($event,0,true)"></Icon>-->
                        <!--<Icon type="iconfont icon-message-top" @click.native="showMsg($event,1,true)"></Icon>-->
                        <i class="iconfonts icon-chat-top" :class="{'baseColor':MsgFlag.MsgTabIndex == 0}"
                           @click="showMsg($event,0,true)"></i>
                        <i :class="{'baseColor':MsgFlag.MsgTabIndex == 1}" class="iconfonts icon-message-top"
                           @click="showMsg($event,1,true)"></i>

                    </div>

                    <Dropdown @on-click="handleClickUserDropdown" style="z-index: 99" class="down-menu"
                              placement="bottom-end">
                        <Avatar v-if="avatorPath" style="top:-4px;" :src="avatorPath+'?'+new Date().getTime()"></Avatar>
                        <span class="userNameSpan ivu-icon" style="color: #2d2d2d;">{{ userName }}</span>
                        <DropdownMenu slot="list" style="top: 40px;z-index: 999;">
                            <DropdownItem name="ownSpace">{{$t('main.main_personalCenter')}}</DropdownItem>
                            <DropdownItem name="login"><a :href="GLOBAL.apiDomain+'/desk.php'" style="color: #495060;">{{$t('main.main_addDeskIcon')}}</a>
                            </DropdownItem>
                            <DropdownItem name="loginout" divided>{{$t('lang.lang_logout')}}{{$t('lang.lang_login')}}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <!-- @on-click="toDesktop"  创建桌面快捷方式 -->
                    <div class="to-desktop" v-if="isShowTips">
                        <p class="triangle_border_up">
                            <span class="triangle"></span>
                        </p>
                        <p class="textContent">{{$t('main.main_createDesktopShortcuts')}}</p>
                        <p>
                            <a @click="canceSet">
                                <span>{{$t('lang.lang_cancel')}}</span>
                            </a>
                            <a @click="canceSet" :href="GLOBAL.apiDomain+'/desk.php'">
                                <span>{{$t('lang.lang_confirm')}}</span>
                            </a>
                        </p>
                    </div>
                </div>
            </Header>
        </div>
        <mainNative></mainNative>
        <div id="menuContainer" class="main-content" style="display: flex" :style="`height:${centerHight}px`">
            <div class="menuBlock" v-if="!showMenu"></div>
            <!--菜单-->
            <transition name="fade">
                <Menu v-if="woroNav" v-show="menuShow" style="min-width: 180px;max-width: 180px;" class="leftMenuList"
                      @on-select="openSelect"
                      @on-open-change="openChange"
                      ref="menu" :open-names="openMenu.openName" :active-name="openMenu.openSct" :accordion="true">
                    <div v-for="(item,index) in woroNav" :key="index">
                        <MenuItem v-if="!item.children" :name="index" @click.native="toDetailPage(item,0,index)">
                            <i v-if="item.title === '我的工作台'" class="iconfonts icon-xiangmuxiaoxi"
                               style="margin-left: -1px;font-size: 16px;"></i>
                            <i v-if="item.title === '公司'" class="iconfonts icon-company" style="font-size: 18px;"></i>
                            <i v-if="item.title === '项目大厅'" class="iconfonts icon-icon-project"
                               style="font-size: 16px;margin-right: 10px"></i>
                            {{item.title}}
                        </MenuItem>
                        <Submenu :name="index" v-if="item.children">
                            <template slot="title">
                                <em class="iconfonts icon-icon-project"
                                    style="font-size: 16px;color: #616161;margin-right: 10px"></em>
                                {{item.title}}
                            </template>
                            <MenuGroup title="使用">
                                <MenuItem :name="index+'-'+i" v-for="(child,i) in item.children" :key="i"
                                          @click.native="toDetailPage(child,1,index,i)">{{child.name}}
                                </MenuItem>
                            </MenuGroup>
                        </Submenu>
                    </div>

                </Menu>
            </transition>
            <!--右边内容区-->
            <div class="single-page-con" :style="`width:100%;height: 100%;`">
                <div class="single-page">
                    <router-view v-if="$route.path.includes('/project')" :key="key"></router-view>
                    <router-view v-else></router-view>
                </div>
            </div>
        </div>
        <!-- 完善信息 -->
        <perfect v-if="isproject" ref="perfect"></perfect>
        <chat-interface :chatMsgBoxHeight="chatMsgBoxHeight" :chatMsgBoxWidth="chatMsgBoxWidth"
                        :MsgFlag="MsgFlag"></chat-interface>
        <customer-service v-if="cusomerServiceFlag"></customer-service>

        <customer-enter v-show="customerEnterFlag && !client_service"
                        @showCustomer="showCustomer($event)"></customer-enter>

        <!-- 项目引导 -->
        <!-- <test-guide :array="projectStandard" v-if="$route.path.includes('/project/projectStandard')"
                    :key="key"></test-guide>
        <test-guide :array="task" v-if="$route.path.includes('/project/task')" :key="key"></test-guide>
        <test-guide :array="quality" v-if="$route.path.includes('/project/quality')" :key="key"></test-guide> -->

        <!-- menu guide -->
        <div class="left-guide-demo" v-show="firstEntry">
            <!--<div class="overflow-layer">-->
            <div class="first-menu">
                <label>
                    <i class="iconfonts icon-xiangmuxiaoxi"></i>
                    <span>我的工作台</span>
                    <Icon type="ios-arrow-down"></Icon>
                </label>
                <ul class="work-item">
                    <li class="company-info">公司概览</li>
                    <li>负责项目</li>
                    <li>我的任务</li>
                    <li>团队工作</li>
                    <li>工作统计</li>
                    <li class="schedule-info">日程安排</li>
                </ul>
            </div>
            <div class="first-menu">
                <label>
                    <i class="iconfonts icon-company"></i>
                    <span>公司</span>
                    <Icon type="ios-arrow-down"></Icon>
                </label>
                <ul class="company-item">
                    <li class="project-info">项目</li>
                    <li class="bid-info">招标</li>
                    <li>合同</li>
                    <li>财务</li>
                    <li>资源</li>
                </ul>
            </div>
            <div class="first-menu">
                <label>
                    <i class="iconfonts icon-icon-project"></i>
                    <span>项目大厅</span>
                    <Icon type="ios-arrow-down"></Icon>
                </label>
            </div>
            <div class="first-menu">
                <label>
                    <i class="iconfonts icon-icon-project"></i>
                    <span>项目名称</span>
                    <Icon type="ios-arrow-down"></Icon>
                </label>
            </div>
            <!--</div>-->
        </div>
        <div class="left-guide-demo2" v-show="firstEntry">
            <p class="company-info active-item">公司概览</p>
        </div>
        <div class="left-guide-demo3" v-show="firstEntry">
            <p class="company-info active-item">招标</p>
        </div>
        <div class="left-guide-demo4" v-show="firstEntry">
            <p class="company-info active-item">项目</p>
        </div>
        <div class="left-guide-demo5" v-show="firstEntry">
            <p class="company-info active-item">日程安排</p>
        </div>

        <!-- party B home -->
        <div class="left-guide-demo6" v-show="firstEntry">
            <p class="company-info active-item">团队工作</p>
        </div>
        <div class="left-guide-demo7" v-show="firstEntry">
            <p class="company-info active-item">财务</p>
        </div>
        <div class="left-guide-demo8" v-show="firstEntry">
            <p class="company-info active-item">资源</p>
        </div>
        <!-- top personal center -->
        <div class="top-personal-center" v-show="firstEntry">
            <a><i class="iconfonts icon-download"></i></a>
            <p class="message-info">
                <a><i class="iconfonts icon-chat-top" :class="{'baseColor':MsgFlag.MsgTabIndex == 0}"></i></a>
                <a><i class="iconfonts icon-message-top" :class="{'baseColor':MsgFlag.MsgTabIndex == 1}"></i></a>
            </p>
            <a class="float-right">
                <span v-if="avatorPath">
                    <img :src="avatorPath+'?'+new Date().getTime()"/>
                </span>
                <label>{{userName}}</label>
            </a>
        </div>

        <div>
            <Modal
                footer-hide
                class="projectSetContainerModal"
                v-model="setingPageShow"
                :title="$t('lang.lang_setting')">
                <template v-if="setingPageShow">
                    <div slot="header" style="margin: 0 auto;">
                        <h3>{{$t('lang.lang_setting')}}</h3>
                    </div>
                    <project-setting></project-setting>
                </template>
            </Modal>
        </div>

        <!-- 首页引导入口组件 -->
        <main-guide v-if="showGuideWelcome" :guideList="guideList" @nextGuide="showNextGuide"></main-guide>

        <!-- 个人中心 -->
        <Modal v-model="personalModalFlag" :title="$t('main.main_personalProfile') + $t('lang.lang_setting')" :footer-hide="true" width='680'>
            <personal-center :personalModalFlag="personalModalFlag"></personal-center>
        </Modal>

    </div>
</template>
<script>
    import api, {guideApi, systemApi} from 'api';
    import {setup} from '../locale/index';
    import UploadOperate from "../components/resourceManagement/uploadOperate";
    import Cookies from 'js-cookie';
    import messageTip from './main-components/message-tip.vue';
    import mainNative from './main-components/mainNative.vue';
    import perfect from './main-components/perfect.vue';
    import {mapState, mapMutations} from 'vuex';
    import {projectMenu} from '@/router/menu';
    import MainGuide from "../components/mainGuide/mainGuide";
    import CustomerEnter from "../components/customerEnter";
    import ProjectSetting from "./project/projectSet";
    import PersonalCenter from "../components/personalCenter";

    require('@/assets/js/labjs.min.js');
    const OPEN_NAME = 3;

    export default {
        components: {
            PersonalCenter,
            ProjectSetting,
            CustomerEnter,
            MainGuide,
            UploadOperate,
            messageTip,
            mainNative,
            perfect
        },
        data() {
            return {
                defaultLang: 'zh',
                languageList: [
                    {lang: 'zh', name: '简体中文'},
                    {lang: 'en', name: 'English'},
                    {lang: 'ja', name: '日文'},
                    {lang: 'ko', name: '한국어'},
                ],
                OPEN_NAME: OPEN_NAME, // 列表展开的常量
                setingPageShow: false,
                pageName: sessionStorage.pageName ? sessionStorage.pageName : '',
                pageType: sessionStorage.pageType ? sessionStorage.pageType : '',
                pageTab: sessionStorage.pageTab ? JSON.parse(sessionStorage.pageTab) : [],
                woroNav: localStorage.woroNav ? JSON.parse(localStorage.woroNav) : [],
                menuShow: true,
                showGuideWelcome: false,
                firstEntry: false,
                partyABEntry: false,
                menuNumber: null,
                jumpFlag: localStorage.isjump ? JSON.parse(localStorage.isjump) : false,
                openMenu: {
                    openName: [OPEN_NAME], // 展开项
                    openSct: 0,
                },
                shrink: false,
                showMenu: false,
                userName: '',
                subMenu: [],
                activePath: '',
                centerHight: 0,
                mainWidth: 0,
                hasUnReadMessage: false,
                havaBack: false,
                avatorPath: null,
                companyType: Cookies.get('company') ? JSON.parse(Cookies.get('company')).type : null,
                MsgFlag: {
                    MsgIsShow: false,
                    MsgTabIndex: null
                },
                projectStandard: ["c5_7.1"],
                task: ["c5_3"],
                quality: ["c5_4"],
                achildren: [
                    {
                        path: '/project/task',
                        name: 'task',
                        level: '1-2',
                        title: '任务',
                        companyType: 1
                    }, {
                        path: '/project/quality',
                        name: 'quality',
                        level: '1-3',
                        title: '资源',
                        companyType: 1
                    }, {
                        path: '/project/projectMember',
                        name: 'eMember',
                        level: '1-4',
                        title: '团队',
                        companyType: 1
                    },
                    // {
                    //     path: '/project/home',
                    //     name: 'custom',
                    //     level: '1-1',
                    //     title: '概况',
                    //     companyType: 1
                    // },

                ],
                bchildren: [
                    {
                        path: '/project/task',
                        name: 'task',
                        level: '1-2',
                        title: '任务',
                        companyType: 1
                    }, {
                        path: '/project/quality',
                        name: 'quality',
                        level: '1-3',
                        title: '资源',
                        companyType: 1
                    },
                    // {
                    //     path: '/project/home',
                    //     name: 'custom',
                    //     level: '1-1',
                    //     title: '概况',
                    //     companyType: 1
                    // },

                ],
                isShowTips: true,
                guideList: [],
                cusomerServiceFlag: false,
                customerEnterFlag: true,
                client_service: 0,
                isManager: false,
                status: 0,
                chatMsgBoxHeight: $(window).height() - 62,
                chatMsgBoxWidth: 0,
                //    0.9.1优化
                personalModalFlag: false
            };
        },
        created() {
            this.$store.commit('setGuideStatus', '0');
            if (sessionStorage.getItem('openMenu')) {
                this.openMenu = JSON.parse(sessionStorage.getItem('openMenu'));
            }
            let bodyHight = document.documentElement.clientHeight;   //浏览器body的高度
            let bodyWidth = document.documentElement.clientWidth;   //浏览器body的宽度
            this.centerHight = bodyHight - 52;
            this.mainWidth = bodyWidth - 121;
        },
        beforeCreate() {
            this.$bus.$off('changeNavCRUD');
        },
        beforeDestroy(){
            this.$bus.$off('storageTab');
        },
        mounted() {
            let _this = this;
            //连接webSockect
            _this.$connectSoket.createWebSocket(this);
            //全局监听 控制聊天窗口
            window.addEventListener('click', function (e) {
                let Flag = _this.MsgFlag.MsgIsShow;
                let customerEnter = _this.customerEnterFlag;
                if (!customerEnter) {
                    _this.$store.commit('setCustomerServiceIsShow', true);    //主开关 开启调用接口
                    _this.$store.commit('setCustomerShowOrHiden', false);      //副开关 显示隐藏不会调用接口
                    _this.$store.commit('setCustomerEnterFlag', true);       //入口开关
                }
                let bubbleClass = e.target.getAttribute('class');
                let is_bubble = bubbleClass && ((bubbleClass == 'bubble-mask') || (bubbleClass == 'bubble-tooltip') || (bubbleClass.includes('bubble-position')));
                if (Flag && !is_bubble) {
                    _this.$store.commit('setMsgIsShow', false);
                }
            }, false);

            /* 初始化 工作台菜单展开*/
            this.$bus.on('initMenuList', (openName, openSct) => {
            });

            /* 改变 菜单 */
            this.$bus.on('changeMenuList', (id) => {
                this.changeMenuList(id);
            });
            this.$bus.on('changeMenu', (parentIndex, childIndex) => {
                this.changeMenu(parentIndex, childIndex);
            });
            this.$bus.on('changeNavCRUD', (parentIndex, childIndex) => {
                // console.log(666666)
                this.changeNavCRUD();
            });

            this.$bus.on('storageTab', (item) => {
                this.storageTab(item);
                this.woroNav = localStorage.woroNav ? JSON.parse(localStorage.woroNav) : [];
                if (!item.pageLeader && item.pageIsProject) {
                    this.otherProject(item);
                } else {
                    this.changeMenuAction(item);
                }
            });
            this.bodySize();
            this.init();
            this.updateMenu();

            /**
             * 刷新当前页面路由设置
             */
            this.refresh();
            this.setIsproject();
            //重置后 高度变化
            window.addEventListener('resize', function () {
                let bodyHight = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器body的高度
                let bodyWidth = document.documentElement.clientWidth || document.body.clientWidth;   //浏览器body的宽度
                //console.log('resize中....bodyHight'+bodyHight+'clientWidth:' + bodyWidth);
                _this.centerHight = bodyHight - 52;
                _this.mainWidth = bodyWidth - 121;

                //聊天框高度自适应
                _this.chatMsgBoxHeight = $(window).height() - 62;
            });
        },
        computed: {
            ...mapState({
                menuListShow(value) {
                    return value.project.detail.setDetailAll;
                }, //从state中获取子路由 概述 合作等
                children(value) {
                    return value.app.projectNav;
                },
                //获取导航菜单
                menuList(value) {
                    return value.app.menuList;
                },
                UnreadMsgList: (state) => state.UnreadMsgList,
                // 区分项目目录下相同的子菜单
                key() {
                    return this.$route.name !== undefined ? this.$route.name + new Date() + Math.random() : this.$route + new Date() + Math.random();
                },
                isproject(value) {
                    return value.app.issproject;
                },
                MsgIsShow() {
                    return this.$store.state.MsgIsShow;
                },
                customerIsShow() {
                    return this.$store.state.customerServiceIsShow;
                },
                customerEnterShow() {
                    return this.$store.state.customerEnterFlag;
                },
                loginStatus() {
                    return this.$store.state.loginData;
                }
            }),
            mesCount() {
                return this.$store.state.app.messageCount;
            },
            activeMenu() {
                return this.$route.name;
            },
            jumpbreakFlag() {
                return this.$store.state.breakJumpFlag;
            },
            autoChangeHeadImg() {
                return this.$store.state.headImg;
            },
            getGuideStatus() {
                return this.$store.state.guideStatus;
            },
            navTitle() {
                let companyName = Cookies.get('company') ? JSON.parse(Cookies.get('company')).company_name : '公司';
                return this.pageType === 'workbench' ? '工作台'
                    : this.pageType === 'epibol' ? companyName
                        : this.pageType === 'artsquare' ? '任务大厅' : this.pageName;
            },
        },
        methods: {
            ...mapMutations(['setIsproject']),

            changePlatformLang(lang) {
                this.defaultLang = lang;
                console.log('Language:', lang);
                setup(lang);
            },
            // 显示新手帮助
            showInitGuide() {
                this.showGuideWelcome = !this.showGuideWelcome;
                this.initGuide();
            },
            // 初始化获取是否引导
            async initGuide() {
                this.isManager = !!(Cookies.get('post_id') && Cookies.get('post_id') === '99999');
                let {data} = await guideApi.novice();
                if (data.err_code == 0) {
                    if (data.guide === 'novice' && data.isCompleteInfo === 0) {
                        this.showGuideWelcome = true;
                    }
                    this.guideList = data.data;
                }
            },
            // manager guide
            async managerGuide(route) {
                let _this = this;
                let guideSteps = [];
                document.querySelector('.work-item').style.display = 'block';
                document.querySelector('.company-item').style.display = 'none';

                let {data} = await guideApi.wk_company();
                if (data.err_code == 0){
                    if (data.guide && data.guide === 'partyAhome') {
                        _this.partyABEntry = true;
                        guideSteps = [
                            {
                                element: document.querySelector('.left-guide-demo2'),
                                intro: this.$lau.guide_words.k9,
                                position: 'right',
                                disableInteraction: '1',
                                start: '1',
                                total: '4'
                            },
                            {
                                element: document.querySelector('.left-guide-demo3'),
                                intro: this.$lau.guide_words.k10,
                                position: 'right',
                                disableInteraction: '1',
                                total: '4'
                            },
                            {
                                element: document.querySelector('.left-guide-demo4'),
                                intro: this.$lau.guide_words.k11,
                                position: 'right',
                                disableInteraction: '1',
                                total: '4'
                            },
                            // {
                            //     element: document.querySelector('.top-personal-center'),
                            //     intro: '<h1>消息通知</h1><p>在线与合作方保持项目沟通，保证项目进度和质量</p>',
                            //     position: 'bottom-middle-aligned',
                            //     disableInteraction: '1',
                            //     total: '5'
                            // },
                            {
                                element: document.querySelector('.left-guide-demo5'),
                                intro: this.$lau.guide_words.k12,
                                position: 'right',
                                disableInteraction: '1',
                                total: '4'
                            }
                        ];
                    }
                    if (data.guide && data.guide === 'partyBhome') {
                        _this.partyABEntry = true;
                        guideSteps = [
                            {
                                element: document.querySelector('.left-guide-demo2'),
                                intro: this.$lau.guide_words.k9,
                                position: 'right',
                                disableInteraction: '1',
                                start: '1',
                                total: '4'
                            },
                            {
                                element: document.querySelector('.left-guide-demo6'),
                                intro: this.$lau.guide_words.k13,
                                position: 'right',
                                disableInteraction: '1',
                                total: '4'
                            },
                            {
                                element: document.querySelector('.left-guide-demo7'),
                                intro: this.$lau.guide_words.k14,
                                position: 'right',
                                disableInteraction: '1',
                                total: '4'
                            },
                            {
                                element: document.querySelector('.left-guide-demo8'),
                                intro: this.$lau.guide_words.k28,
                                position: 'right',
                                disableInteraction: '1',
                                total: '4'
                            }
                        ];
                    }
                    if (_this.partyABEntry) {
                        _this.firstEntry = true;
                        setTimeout(() => {
                            _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                .addSteps(guideSteps).start()
                                .onchange((ele) => {
                                    if (ele.className === 'left-guide-demo3') {
                                        document.querySelector('.work-item').style.display = 'none';
                                        document.querySelector('.company-item').style.display = 'block';
                                    }
                                    if (ele.className === 'left-guide-demo5') {
                                        document.querySelector('.work-item').style.display = 'block';
                                        document.querySelector('.company-item').style.display = 'none';
                                    }
                                    if (ele.className === 'left-guide-demo7') {
                                        document.querySelector('.work-item').style.display = 'none';
                                        document.querySelector('.company-item').style.display = 'block';
                                    }
                                }).oncomplete(() => {
                                    this.$store.commit('setGuideStatus', '1');
                                    _this.firstEntry = false;
                                    _this.$router.push(route);
                                }).onskip(() => {
                                    this.$store.commit('setGuideStatus', '1');
                                    _this.firstEntry = false;
                                    _this.$router.push(route);
                                });
                        });
                    } else {
                        this.$store.commit('setGuideStatus', '1');
                        _this.firstEntry = false;
                        _this.$router.push(route);
                    }
                }
            },
            async showNextGuide(route) {
                let _this = this;
                this.showGuideWelcome = false;

                let {data} = await guideApi.green_help();
                if (data.err_code == 0){
                    if (data.guide === 'generalGuide') {
                        this.firstEntry = true;
                        setTimeout(() => {
                            _this.$guide().setOptions(_this.$CONSTANT.guideOptions)
                                .addSteps([
                                    {
                                        element: document.querySelector('.left-guide-demo'),
                                        intro: this.$lau.guide_words.k29,
                                        position: 'right',
                                        disableInteraction: '1',
                                        start: '1',
                                        total: '2'
                                    },
                                    {
                                        element: document.querySelector('.top-personal-center'),
                                        intro: this.$lau.guide_words.k30,
                                        position: 'bottom-middle-aligned',
                                        disableInteraction: '1',
                                        total: '2'
                                    }
                                ]).start().oncomplete(() => {
                                    _this.$guide().exit();
                                    _this.managerGuide(route);
                                }).onskip(() => {
                                    this.$store.commit('setGuideStatus', '1');
                                    _this.firstEntry = false;
                                    _this.$router.push(route);
                                });
                        });
                    } else {
                        if (!data.guide) {
                            _this.managerGuide(route);
                        }
                    }
                }
            },

            goHome() {
                location.href = window.location.protocol + '//' + window.location.host;
            },
            menuHidden() {
                this.menuShow = !this.menuShow;
            },
            goSetting() {

                this.setingPageShow = true;
            },
            selectFun(type) {
                localStorage.isproject = `true`;
                this.setIsproject();
                this.$nextTick(() => {
                    this.$refs.perfect.selectFun(type, true);
                });
            },
            gotoCustomerServicePage() {
                this.$router.push({path: '/customer/customerServicePage'});
            },
            showCustomer(event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                this.$store.commit('setCustomerServiceIsShow', true);    //主开关 开启调用接口
                this.$store.commit('setCustomerShowOrHiden', true);      //副开关 显示隐藏不会调用接口
                this.$store.commit('setCustomerEnterFlag', false);       //入口开关
            },
            showMsg(event, num, flag) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                if (!this.MsgFlag.MsgIsShow) {
                    flag = true;
                    this.MsgFlag.MsgTabIndex = num;
                } else {
                    flag = false;
                    this.MsgFlag.MsgTabIndex = null;
                }

                this.MsgFlag.MsgIsShow = flag;
                this.$store.commit('setMsgIsShow', flag);
            },
            projectDetails(children, id) {
                if (id) {
                    sessionStorage.projectID = id;
                }
                this.$router.push({path: children.path, query: {sign: this.key}});
            },
            bodySize() {
                let body = document.body;
                body.onresize = () => {
                    let bodyWidth = document.documentElement.clientWidth;   //浏览器body的宽度
                    this.mainWidth = bodyWidth - 121;
                };
            },

            /**
             * 刷新当前页面
             */
            refresh() {
                if (location.href.match(/\/#\/(.*?)\//) != null) {
                    let routeName = location.href.match(/\/#\/(.*?)\//)[1];
                    if (this.menuList) {
                        this.menuList.forEach((item) => {
                            if (routeName === item.name) {
                                this.subMenu = item.children;
                                let menuArr = item.children;
                                this.$router.push('/' + location.hash.match(/\#\/(.*)/)[1]);
                                if (routeName == 'project') {
                                    this.havaBack = true;
                                } else {
                                    this.havaBack = false;
                                }
                            }
                        });
                    }

                }
                this.activePath = this.$route.path;
            },
            linkTo(url, params) {
                if (params) {
                    this.$router.push({path: url, query: params});
                } else {
                    this.$router.push(url);
                }
            },
            goBack() {
                this.$router.push('/epibol/projectManage');
            },
            init() {
                this.userName = Cookies.get('user');
                this.fetchUserMesg().then(() => {
                    let postId = Cookies.get('post_id');
                    if (postId && (postId !== '2' || postId !== '3')) {
                        this.initGuide();
                    }
                });
                if (localStorage.getItem('isToDesktop')) {
                    this.isShowTips = false;
                } else {
                    setTimeout(() => {
                        this.isShowTips = false;
                    }, 5000);
                }
            },
            toggleClick() {
                this.shrink = !this.shrink;
            },
            fetchUserMesg() {
                return new Promise(async(resolve, reject) => {
                    let _this = this;
                    let {data} = await systemApi.login_info();
                    if (data.err_code == 0){
                        console.log(data);
                        localStorage.setItem("page_guide", JSON.stringify(data.page_guide)); //以“page_guide”为名称存储一个值
                        if (data.banboo) {
                            this.client_service = data.banboo.client_service;
                            localStorage.client_service = data.banboo.client_service;
                        }
                        _this.avatorPath = _this.GLOBAL.imgDomain + '/index.php?r=system/user/get-headimage&id=' + data.user.id;
                        if (data.limit.complete_show == 0) {
                            localStorage.isproject = `false`;
                            localStorage.isjump = 'false';
                            _this.$store.commit('setbreakJump', false);
                        } else if (data.limit.complete_show == 1) {
                            localStorage.isproject = `true`;
                            localStorage.isjump = 'false';
                            _this.$store.commit('setbreakJump', false);
                        } else if (data.limit.complete_show == 2) {
                            localStorage.isproject = `false`;
                            localStorage.isjump = 'true';
                            _this.$store.commit('setbreakJump', true);
                        } else if (data.limit.complete_show == 3) {
                            localStorage.isproject = `true`;
                            localStorage.isjump = 'false';
                            _this.selectFun(3);
                        }
                        _this.setIsproject();
                        sessionStorage.userId = data.user.id;
                        sessionStorage.user_type = data.user.user_type;
                        Cookies.set('post_id', data.company.post_id);
                        // Cookies.set('user_type', res.user.user_type)
                        Cookies.set('company', data.company);
                        resolve();
                    } else {
                        reject();
                    }
                });
            },
            // 退出和登录
            async handleClickUserDropdown(name) {
                if (name == 'loginout') {
                    let {data} = await systemApi.login_logout();
                    if (data.err_code == 0){
                        let flag = false;
                        if (localStorage.getItem('isToDesktop')) {
                            flag = true;
                        }
                        Cookies.remove('user');
                        Cookies.remove('post_id');
                        Cookies.remove('company');
                        this.$router.push({path: '/login', query: {ref: 'admin'}});
                        sessionStorage.clear();
                        localStorage.clear();
                        if (flag) {
                            localStorage.setItem('isToDesktop', true);
                        }
                        window.webSocket.close();
                    }
                } else if (name === 'ownSpace') {
                    this.personalModalFlag = true;
                }
            },
            collapsedSider() {
                if (this.showMenu == false) {
                    this.showMenu = true;
                } else {
                    this.showMenu = false;
                }
            },
            updateMenu() {
                if (this.menuList) {
                    this.menuList.forEach((item) => {
                        this.refresh();
                    });
                    this.activePath = this.$route.path;
                }
            },
            changeMenuList(id) {
                let num = 0;
                projectMenu.map((item, index) => {
                    if (item.name === 'task') {
                        num = index;
                    }
                });
                this.menuList.map((item, index) => {
                    if (item.id === id) {
                        this.openSelect(index, num);
                    }
                });
            },
            changeMenu(parentIndex, childIndex) {
                this.openSelect(parentIndex, childIndex);

            },
            // 选中内容
            openSelect(name, type) {
            },
            // 点击一级目录进入页面 menu
            async toDetailPage(item, navRank, index, i) {
                let obj = {};
                let routerObj = null;
                this.woroNav = localStorage.woroNav ? JSON.parse(localStorage.woroNav) : [];
                // 点击的第一级目录
                if (navRank === 0) {
                    obj.type = item.name;
                }
                // 点击第二级目录
                else if (navRank === 1) {
                    obj.project_id = item.id;
                }
                let {data} = await api.getAuthTable(obj);
                if (data.err_code === 0 && data.data) {
                    routerObj = {path: data.data[0].path, query: {isMenu: true}};
                    if (navRank === 1) {
                        routerObj.query.sign = item.id;
                        this.pageName = item.name;
                        sessionStorage.pageName = this.pageName;
                        sessionStorage.projectID = item.id;

                    }
                    this.$router.push(routerObj);

                    this.pageType = navRank === 0 ? item.name : 'myPorject';
                    sessionStorage.pageType = this.pageType;
                    this.pageTab = data.data;
                    sessionStorage.pageTab = JSON.stringify(this.pageTab);
                    this.storageMenuInfo(i ? `${index}-${i}` : index, [this.OPEN_NAME]);
                    if (navRank === 1) {
                        this.$nextTick(() => {
                            document.title = `${this.pageName} - Banboo `;
                        });
                    }
                }
            },
            // 修改并存储tab信息
            storageTab(item) {
                if (item.pageName) {
                    this.pageName = item.pageName;
                    sessionStorage.pageType = this.pageName;
                }
                this.pageType = item.pageType;
                sessionStorage.pageType = this.pageType;
                this.pageTab = item.pageTab;
                sessionStorage.pageTab = JSON.stringify(this.pageTab);
            },
            // 切换高亮
            changeMenuAction(item) {
                const OPEN_NAME = this.OPEN_NAME;
                const projectNav = this.woroNav[OPEN_NAME];
                let openSct = null;
                // 一级菜单
                if (!item.pageName) {
                    let index = 0;
                    switch (item.pageType) {
                        case 'workbench':
                            index = 0;
                            break;
                        case 'epibol':
                            index = 1;
                            break;
                        case 'artsquare':
                            index = 2;
                            break;
                    }
                    this.openMenu.openSct = index;
                }
                // 二级菜单
                else {
                    if (projectNav && projectNav.children) {
                        projectNav.children.map((items, index) => {
                            if (items.id === sessionStorage.projectID) {
                                this.openMenu.openSct = `${OPEN_NAME}-${index}`;
                                openSct = `${OPEN_NAME}-${index}`;
                            }
                        });
                    }
                }
                this.$nextTick(() => {
                    if (this.$refs.menu) {
                        this.$refs.menu.updateOpened();
                        this.$refs.menu.updateActiveName();
                        if (item.pageName) {
                            this.$refs.menu.currentActiveName = openSct;
                        }
                    }
                });
                console.log([OPEN_NAME]);
                this.storageMenuInfo(this.openMenu.openSct, [OPEN_NAME]);
            },
            otherProject(item) {
                const projectNav = this.woroNav[OPEN_NAME];
                let is_other = null;
                if (projectNav && projectNav.children) {
                    is_other = projectNav.children[projectNav.children.length - 1].other;

                    if (!is_other) {
                        projectNav.children[projectNav.children.length] = {
                            name: item.pageName,
                            path: '',
                            id: '',
                            other: true
                        };
                        this.openMenu.openSct = `${OPEN_NAME}-${projectNav.children.length - 1}`;
                        this.$nextTick(() => {
                            if (this.$refs.menu) {
                                this.$refs.menu.updateOpened();
                                this.$refs.menu.updateActiveName();
                                this.$refs.menu.currentActiveName = `${OPEN_NAME}-${projectNav.children.length - 1}`;
                            }
                        });
                    }
                }
            },
            changeNavCRUD() {
                this.woroNav = localStorage.woroNav ? JSON.parse(localStorage.woroNav) : [];
            },
            // 存储menu的展开信息
            storageMenuInfo(openSct, openName) {
                sessionStorage.setItem('openMenu', JSON.stringify({
                    openSct: openSct,
                    openName: openName,
                }));
            },
            // 选中栏
            openChange(name) {

                // this.openMenu.openName = name;
            },
            canceSet() {
                localStorage.setItem('isToDesktop', true);
                this.isShowTips = false;
            },

            getRouterPath() {
                // console.log('ROUTER:', this.$route);
                // console.log('MENULIST:', this.menuList);
                // console.log('CHILDREN:', this.children);
            }
        },
        watch: {
            getGuideStatus(status) {
                let postId = Cookies.get('post_id');
                if (postId && (postId === '2' || postId === '3')) {
                    if (status === '2') {
                        this.initGuide();
                    }
                }
            },
            UnreadMsgList(value) {
                // console.log('UnreadMsgList改变了', value);
                let hasUnReadMessage = false;
                value.forEach((item, index) => {
                    if (item.unread && item.unread != 0) {
                        hasUnReadMessage = true;
                    }
                });
                this.hasUnReadMessage = hasUnReadMessage;
            },
            menuList(data) {
                // 每次刷新后菜单的展开
                if (data.length > 0) {
                    this.updateMenu();
                    this.$nextTick(() => {
                        if (this.$refs.menu) {
                            this.$refs.menu.updateOpened();
                            this.$refs.menu.updateActiveName();
                        }
                    });
                }
            },
            '$route': 'updateMenu',
            mainWidth() {
                let bodyWidth = document.documentElement.clientWidth;   //浏览器body的宽度
                this.mainWidth = bodyWidth - 121;
            },
            MsgIsShow(flag) {
                if (flag) {
                    let index = this.MsgFlag.MsgTabIndex;
                    this.MsgFlag = {
                        MsgIsShow: true,
                        MsgTabIndex: index || 0
                    };
                } else {
                    this.MsgFlag = {
                        MsgIsShow: false,
                        MsgTabIndex: null
                    };
                }
            },
            customerIsShow(flag) {
                this.cusomerServiceFlag = flag;
            },
            customerEnterShow(flag) {
                this.customerEnterFlag = flag;
            },

            jumpbreakFlag(flag) {
                this.jumpFlag = flag;
            },
            autoChangeHeadImg(val) {
                if (val) {
                    this.avatorPath = val;
                }
            },
            // '$route': 'getRouterPath'
        },
    };
</script>
<style lang="less">
    @import "./main.less";

    .main {

        .main-header-con, .ivu-layout-header, .ivu-menu-horizontal {
            height: 70px;
            line-height: 70px;
            background: @white;
            border-bottom: 1px solid @gray;
            // box-shadow: 0px 1px 12px 1px #dfe1e2;
        }

        // guide
        .left-guide-demo, .left-guide-demo2, .left-guide-demo3, .left-guide-demo4, .left-guide-demo5, .left-guide-demo6, .left-guide-demo7, .left-guide-demo8 {
            position: fixed;
            top: 52px;
            left: 0;
            width: 180px;
            height: 100%;
            background: #151b26;
            z-index: 99999;

            .ivu-menu {
                width: 180px !important;
                background: #151b26 !important;

                .ivu-menu-submenu-title {
                    border-top: .1px solid #222b37;
                    background: #151b26 !important;
                    padding: 11px 30px 11px 20px !important;
                    color: #616161;

                    &:hover {
                        color: #fff;
                    }
                }

                .ivu-menu-item {
                    padding: 6px 30px 6px 46px !important;
                    color: #616161;
                    border: none;

                    &:hover {
                        background: #f5f5f521;
                    }

                    &.ivu-menu-item-selected {
                        border-left: 2px solid #3bceb6 !important;
                        background: linear-gradient(left, #316766, #2e464b) !important;
                        color: #fff;

                        &:after {
                            display: block;
                            content: '';
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 0;
                            height: 0;
                            border-width: 16px 16px 16px 0;
                            border-style: solid;
                            border-color: transparent rgba(255, 255, 255, 0.95) transparent transparent;
                        }
                    }
                }
            }

            /*&.introjs-fixParent {*/
            /*z-index: 9999!important;*/
            /*}*/

            .first-menu {
                border-top: 1px solid #222b37;
                color: #616161;
                font-size: 14px;

                label {
                    display: block;
                    padding: 11px 30px 11px 20px;

                    i:first-child {
                        margin-right: 8px;
                    }

                    i.ivu-icon-ios-arrow-down {
                        float: right;
                        margin: 5px -12px 0 0;
                    }
                }

                ul {
                    /*position: relative;*/
                    display: none;

                    li {
                        display: block;
                        position: relative;
                        padding: 6px 30px 6px 50px;
                        z-index: 1;
                        background: none;

                        &.active-item {
                            border-left: 2px solid #3bceb6;
                            background: linear-gradient(left, #316766, #2e464b);
                            color: #fff;

                            &:after {
                                display: block;
                                content: '';
                                position: absolute;
                                top: 0;
                                right: 0;
                                width: 0;
                                height: 0;
                                border-width: 16px 10px 16px 0;
                                border-style: solid;
                                border-color: transparent rgba(255, 255, 255, 0.95) transparent transparent;
                            }
                        }
                    }
                }
            }

            p {
                font-size: 14px;
                display: block;
                position: relative;
                padding: 6px 30px 6px 50px;
                z-index: 1;
                background: none;

                &.active-item {
                    border-left: 2px solid #3bceb6;
                    background: linear-gradient(left, #316766, #2e464b);
                    color: #fff;

                    &:after {
                        display: block;
                        content: '';
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 0;
                        height: 0;
                        border-width: 16px 10px 16px 0;
                        border-style: solid;
                        border-color: transparent rgba(255, 255, 255, 0.95) transparent transparent;
                    }
                }
            }
        }

        .left-guide-demo2 {
            height: 32px;
            top: 97px;
            z-index: auto;
        }

        .left-guide-demo3 {
            height: 32px;
            top: 174px;
            z-index: auto;
        }

        .left-guide-demo4 {
            height: 32px;
            top: 140px;
            z-index: auto;
        }

        .left-guide-demo5 {
            height: 32px;
            top: 260px;
            z-index: auto;
        }

        .left-guide-demo6 {
            height: 32px;
            top: 195px;
            z-index: auto;
        }

        .left-guide-demo7 {
            height: 32px;
            top: 238px;
            z-index: auto;
        }

        .left-guide-demo8 {
            height: 32px;
            top: 270px;
            z-index: auto;
        }

        .top-personal-center {
            position: fixed;
            top: 8px;
            right: 8px;
            max-width: 410px;
            min-width: 330px;
            height: 36px;
            z-index: 0;
            background: #eef1f2;
            line-height: 27px;

            p {
                float: left;
            }

            a {
                display: block;
                float: left;
                margin: 5px 14px;

                i {
                    font-size: 26px;
                    color: @black_3;

                    &.icon-download {
                        font-size: 26px;
                    }

                    &.icon-chat-top {
                        font-size: 22px;
                    }

                    &.icon-message-top {
                        font-size: 24px;
                    }
                }

                span {
                    display: block;
                    float: left;
                    width: 33px;
                    height: 33px;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                    overflow: hidden;
                    margin: -4px 3px 0 0;
                    border: 1px solid #f7f7f7;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                &.float-right {
                    float: right;
                    min-width: 140px;
                    max-width: 220px;
                    margin: 5px 22px;
                    overflow: hidden;
                    -ms-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

    }

    .main-header-con {
        box-shadow: none !important;

        .pageSecondaryNavShow {
            left: 30px !important;
        }

        .pageSecondaryNav {
            display: flex;
            position: absolute;
            top: 0;
            left: 210px;
            height: 70px;
            align-items: center;
            color: @black_3;
            transition: left .8s;

            .iconContainer {
                width: 40px;
                height: 40px;
                margin-right: 10px;
                text-align: center;
                line-height: 45px;
                background: @base;
                border-radius: 4px;

                i, em {
                    color: @white;
                }
            }

            .projectText {
                display: flex;
                height: 20px;
                line-height: 20px;
                align-items: center;

                .projectTitle {
                    color: @black_2;
                    font-size: 16px;
                    font-weight: 500;
                }

                .ivu-icon {
                    margin-left: 5px;
                }
            }

            .navList {
                display: flex;
                height: 20px;
                line-height: 20px;

                .pageSecondaryLi {
                    margin-right: 10px;
                    font-size: 13px;
                    .menuNav {
                        display: inline;

                        color: @black_3;
                    }

                    .menuNav.router-link-active {
                        color: @base;
                    }
                }

            }

        }
    }

    .main-header-avator {
        display: flex;
        align-items: center;
        float: right;
        /*z-index: 999 !important;*/
        padding: 0 10px 0 0;
        height: 70px;
        line-height: 70px;

        .pulsCompany {
            span {
                background: #3cd2b4;
                border-radius: 3px;
                color: #fff;
                display: inline;
                margin-left: 10px;
                cursor: pointer;
                padding: 8px;

                &:before {
                    box-sizing: unset !important;
                    content: "+";
                    display: inline-block;
                    height: 16px;
                    line-height: 15px;
                    width: 16px;
                    font-size: 16px;
                    border: 1px solid #fff;
                    border-radius: 100%;
                    text-align: center;
                    margin-right: 5px;
                }

                &:nth-child(2) {
                    background: @white !important;
                    color: #b3b2b2 !important;

                    &:before {
                        border-color: #b3b2b2 !important;
                    }
                }
            }
        }

        .Rico {
            margin-top: 5px;
            line-height: 45px;

            .baseColor {
                color: @base;
            }

            i {
                font-size: 25px;
                padding: 0 10px;
                margin-right: 10px;
                color: @black_3;
                cursor: pointer;

                &:hover {
                    color: @base;
                }

                &:nth-child(5) {
                    border-right: 1px solid @line;
                    padding: 0 20px 0 10px;
                }

            }

            .icon-message-top {
                font-size: 24px;
                display: inline-block;
                position: relative;
                top: 3px;
            }

            .icon-chat-top {
                margin-right: 6px;
                font-size: 22px;
                display: inline-block;
                position: relative;
                top: 2px;
            }

            .ivu-badge {
                line-height: 45px;
                margin-bottom: 0px;
                margin-right: 0px;

                .ivu-badge-dot {
                    right: 6px;
                    top: 7px;
                    width: 6px;
                    height: 6px;

                }

                i {
                    font-size: 22px;
                    margin-right: 0px;
                    top: 1px;
                }
            }
        }

        .down-menu {
            .ivu-select-dropdown {
                top: 41px !important;
            }
        }

        .to-desktop {
            background: #fff;
            position: absolute;
            top: 108%;
            right: 3.5%;
            padding: 16px 20px 10px 20px;
            border-radius: 4px;
            box-shadow: @boxShadow;

            .triangle_border_up {
                .triangle {
                    display: block;
                    width: 0;
                    height: 0;
                    border-width: 0 15px 15px;
                    border-style: solid;
                    border-color: transparent transparent #fff;
                    /*透明 透明  黄*/
                    position: absolute;
                    top: -8%;
                    left: 53%;
                }

            }

            .textContent {
                font-size: 14px;
                color: #777;
                margin-bottom: 15px;

            }

            p:nth-child(3) {
                text-align: right;
                border-top: 1px solid #eef1f2;

                a {
                    margin-top: 8px;
                }

                a:nth-child(1) {
                    font-size: 14px;
                    color: #bdbdbd;

                    &:hover {
                        color: @base;
                    }

                }

                a:nth-child(2) {
                    margin-left: 30px;

                    span {
                        padding: 8px 18px;
                        line-height: 30px;
                        height: 30px;
                        width: 64px;
                        font-size: 14px;
                        color: #fff;
                        border: 0px;
                        border-radius: 3px;
                        background: #3cd2b4;
                    }
                }
            }
        }

        .userNameSpan {
            position: relative;
            cursor: pointer;

            &:after {
                content: '\F35F';
                position: absolute;
                content: '\F35F';
                display: inline-block;
                font-size: 17px;
                color: @black_2;
                top: -2px;
                padding-left: 5px;
            }
        }

    }

    .main-content {
        .fade-enter-active, .fade-leave-active {
            transition: opacity .3s;
        }

        .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
            opacity: 0;
        }

        .com-scrollbar;

        ::-webkit-scrollbar {
            width: 0;
            height: 0;
        }

        /*::-webkit-scrollbar { !*滚动条整体样式*!width: 0px; !*高宽分别对应横竖滚动条的尺寸*!height: 0px;}*/
        /*::-webkit-scrollbar-thumb { !*滚动条里面小方块*!border-radius: 0px;-webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);background: rgba(0, 0, 0, 0.2);}*/
        /*::-webkit-scrollbar-track { !*滚动条里面轨道*!-webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);border-radius: 0;background: rgba(0, 0, 0, 0.1);}*/

        .ivu-menu {
            // overflow-y: auto !important;
            /*overflow-x: hidden;*/
            width: 100%;

        }

        .single-page {
            height: 100%;
            min-width: 1280px;
        }
    }

    .single-page-con {
        ::-webkit-scrollbar {
            width: 6px !important;
            height: 6px !important;
        }
    }

    .leftMenuList {
        background: #151b26 !important;
        /*z-index: 9 !important;*/
        transition: all 2s;
        color: @black_2;
        .com-scrollbar;

        .navList {
            .ivu-menu-submenu-title {
                padding: 11px 30px 11px 20px !important;
                border-top: 0.1px solid #222b37;
            }
        }

        .childrenList {
            padding: 6px 30px 6px 46px !important;
            color: @black_2;
        }

        .navText {
            display: inline-block;
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
            color: @black_2;
        }

        img {
            background: #fff;
        }

        .ivu-menu-submenu-title-icon {
            color: #8e9194;
            top: 3px;
            right: -20px;
            visibility: hidden;
        }

        .active1 {
            width: 50px;
            height: 50px;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAUpklEQ…ACPSaAAHo8+ew6BBAAOQCBHhNAAD2efHYdAgiAHIBAjwn8DzH4MQCeA8k3AAAAAElFTkSuQmCC) no-repeat 50%/37px 34px;
            background-size: 50px 50px;
        }

        .ivu-menu, .ivu-menu-submenu-title {
            /*color: #bdbdbd;*/
            color: @black_2;
        }

        .ivu-menu-submenu {
            background: #151b26 !important;
        }

        .ivu-menu-vertical, .ivu-menu-submenu-title:hover {
            // background: -webkit-linear-gradient(left, #316766, #2e464b) !important;
            background: #151b26 !important;

            .navText {
                color: @white
            }
        ;

            .ivu-menu-submenu-title-icon {
                visibility: visible;
            }
        ;
        }

        .ivu-menu-vertical, .ivu-menu-item:hover {
            // background: -webkit-linear-gradient(left, #316766, #2e464b) !important;
            background: #f5f5f521 !important;
            width: 100%;
        }

        .ivu-menu-item-active:not(.ivu-menu-submenu) {
            /*overflow: hidden;*/
            color: @white !important;
            border-left: 2px solid #3bceb6 !important;
            border-right: 1px solid #2e464b !important;
            background: -webkit-linear-gradient(left, #316766, #2e464b) !important;
            width: 100%;

            div {
                width: 0;
                height: 0;
                border-width: 20px 12px 20px 0;
                border-style: solid;
                border-color: transparent #f4f7f6 transparent transparent; /*透明 灰 透明 透明 */
                margin-right: 0;
                top: -3.5px;
                right: -3px;
                position: absolute;
            }
        }
    }

    .layout-logo {
        width: 100px;
        height: 30px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }

    .logo {
        position: relative;
        width: 180px;
        height: 70px;
        float: left;
        background: #151b26 url("../assets/images/banboo-logo.png") no-repeat center / 100%;
        background-size: 120px;
        background-position: 15px;
        cursor: pointer;

        .iconBox {
            display: flex;
            position: absolute;
            top: 0;
            right: 10px;
            height: 100%;
            align-items: center;
        }
    }

    .layout-nav {
        margin: 0 auto;
        margin-right: 20px;
    }

    .stem-logo img {
        max-width: 8rem;
    }

    .stem-l {
        margin-left: 10rem;
    }

    .ivu-menu-item-group-title {
        display: none;
    }

    .sidebar-menu-con ul li:first-child {
        display: none;
    }

    .menu {
        width: 121px;
        padding: 0 18px;
        padding-top: 119px;
        float: left;
        background: #f5f7f6;
        height: 100%;
    }

    .menu li a {
        display: block;
        width: 85px;
        height: 60px;
    }

    .menu li {
        position: relative;
        margin-bottom: 40px;
    }

    .menu li a + .name {
        position: absolute;
        transition: all 0s ease;
        opacity: 0;
        left: 40px;
        top: 40px;
        width: 75px;
        height: 28px;
        font-size: 12px;
        text-align: center;
        line-height: 28px;
        background: #FFFBDE;
        border: 1px solid #CCCAB9;
        box-shadow: 0 12px 18px 0 rgba(0, 0, 0, 0.06);
        border-radius: 4px;
    }

    .menu li a:hover + .name {
        opacity: 1;
        left: 46px;
        top: 30px;
    }

    .menu li a.eHome, .menu li a.cHome {
        background: url(https://static.banbooyun.com/public/img/icon/company.png) no-repeat center center / 37px 34px;
    }

    .menu li a.bidManage, .menu li a.cusBidManage {
        background: url(https://static.banbooyun.com/public/img/icon/bidManage.png) no-repeat center center / 37px 34px;
    }

    .menu li a.contractManage, .menu li a.cContractManage {
        background: url(https://static.banbooyun.com/public/img/icon/contractManage.png) no-repeat center center / 37px 34px;
    }

    .menu li a.projectManage, .menu li a.cProjectManage {
        background: url(https://static.banbooyun.com/public/img/icon/project.png) no-repeat center center / 37px 34px;
    }

    .menu li a.memberManager {
        background: url(https://static.banbooyun.com/public/img/icon/memberManager.png) no-repeat center center / 37px 34px;
    }

    .menu li a.eStatistics {
        background: url(https://static.banbooyun.com/public/img/icon/statistics.png) no-repeat center center / 37px 34px;
    }

    .menu li a.custom {
        background: url(https://static.banbooyun.com/public/img/icon/survey.png) no-repeat center center / 37px 34px;
    }

    .menu li a.task {
        background: url(https://static.banbooyun.com/public/img/icon/task.png) no-repeat center center / 37px 34px;
    }

    .menu li a.quality {
        background: url(https://static.banbooyun.com/public/img/icon/resources.png) no-repeat center center / 37px 34px;
    }

    .menu li a.eMember {
        background: url(https://static.banbooyun.com/public/img/icon/member.png) no-repeat center center / 37px 34px;
    }

    .menu li a.statistics {
        background: url(https://static.banbooyun.com/public/img/icon/pstatistics.png) no-repeat center center / 37px 34px;
    }

    .menu li a:hover {
        border-right: 6px solid #48c5b5;
    }

    .menu li a.active {
        border-right: 6px solid #48c5b5;
    }

    .projectSetContainerModal {
        .ivu-modal {
            width: 50% !important;
            min-width: 1000px;
            // height: 70%;
            // overflow-y: auto;
            // background: #fff;
        }

        .ivu-modal-content {
            height: 100%;
        }

        .ivu-modal-header {
            text-align: center;
            color: #ffffff;
            // background: #fff;
            border-bottom-color: transparent;
        }

        .ivu-modal-body {
            padding: 0;
            border-top: 1px solid @gray;
            height: calc(~"100% - 61px");

        }

    }
</style>
