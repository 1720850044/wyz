import {otherRouter, appRouter} from '@/router/router';
import {menu, companyMenu, projectMenu, setCompanyMenu} from '@/router/menu'
import Vue from 'vue'
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import {cidrSubnet} from 'ip';
import api from 'api'

const app = {

    state: {
        projectNav: localStorage.projectNav ? JSON.parse(localStorage.projectNav) : [],
        companyMenu: null,
        collaboration: null,//是否是协作方
        is_collaboration: null,//有协作的公司
        clubAudit: true,  // 协作审核
        clubTaskManagement: true,  // 协作任务管理权限
        projectSeting: false,  // 项目设置按钮权限
        pro_company_name: null, // 被协作方公司名
        perfectStatus: false,
        menuList: localStorage.menuList ? JSON.parse(localStorage.menuList) : [],
        projectMenuList: [],
        children: [
            // {
            //     path: '/project/home',
            //     name: 'custom',
            //     level: '1-1',
            //     title: '概况',
            // },
            {
                path: '/project/task',
                name: 'task',
                level: '1-2',
                title: '任务管理',
            }, {
                path: '/project/quality',
                name: 'quality',
                level: '1-3',
                title: '资源管理',
            }, {
                path: '/project/projectMember',
                name: 'eMember',
                level: '1-4',
                title: '团队',
            },
            {
                path: '/project/statistics',
                name: 'statistics',
                level: '1-5',
                title: '统计',
            },
            {
                path: '/project/setting',
                name: 'Psetting',
                level: '1-6',
                title: '设置',
            },

        ],
        routers: [
            otherRouter,
            ...appRouter
        ],
        routerCallback: null,  // router回调
        menuTheme: 'dark', // 主题
        themeColor: '',
        messageCount: 0,
        isSetShow: false, // 显示设置
        uploadFile: [],  // 上传文件路径
        filenum: null, // 上传文件数量
        /* 以下 8月9日 权限 */
        role: null,              // 权限
        standardLibrary: true, // 公司级规范库
        memberMgt: true, // 成员管理
        roleMgt: true, // 权限管理
        issproject: null, // 显示完善信息
        searchStred: false,// 返回值
        projectSet: {
            self: true,             // 设置按钮
            projectNorm: true,       // 规范设置
            projectTitle: true,      // 时间设置
            projectsetMember: true,     // 成员设置

            projectStatistics: true,   //统计
            projectMember: true,     //  成员
            projectTask: true,       // 任务列表
            projectCustom: true,     //概况

            projectQuality: true,    // 资源
            qualityFrist: true,      //资源管理归档
            qualitySecond: true,      //资源管理归档
            qualityThird: true,      //资源管理归档
            qualityFourth: true,      //资源管理归档
            qualityFifth: true,      //资源管理归档
        },
        epibol: {
            nav: false,                   // 公司导航,
            memberManager: true,         // 团队,
            contract: true,              // 合同,
            callForBids: true,           // 招标,
            eHome: true,                 // 概况,
            projectHome: true,            // 项目
            cooperation: true,           //合作
            statistics: true,            // 统计
            skydrive: true,            // 资源
            teamPower: true,            // 团队能力
        },
        callForBidsdts: {
            HaveTender: true,             // 已报名招标
            invitation: true,            // 外包邀请
        },
        manager: {
            manager_page_header: true,        // 经营
            manager_main_bid: true,           // 投标
            manager_main_Sign: true,              // 合同
            manager_main_project: true,       // 项目
            manager_main_quality: true,       // 质量
            manager_main_team: true,          // 团队projectManage

        }
    },
    mutations: {
        /* 获取协作权限 */
        Collaboration(state, data) {
            state.projectSeting = false;
            state.clubTaskManagement = true;
            state.collaboration = null;
            state.is_collaboration = null;
            if (data) {
                data.map((item, index) => {
                    if (item.id === sessionStorage.projectID && item.collaboration) {
                        state.collaboration = item.collaboration
                    }
                    if (item.id === sessionStorage.projectID && !item.collaboration) {
                        state.projectSeting = true
                    }
                    if (item.id === sessionStorage.projectID && item.update_auth === '0') {
                        state.clubTaskManagement = false
                    }
                    if (item.id === sessionStorage.projectID && item.check_auth === '0') {
                        state.clubAudit = false
                    }
                    if (item.id === sessionStorage.projectID && item.is_collaboration) {
                        state.is_collaboration = item.is_collaboration
                    }
                    if (item.id === sessionStorage.projectID && item.pro_company_name) {

                        state.pro_company_name = item.pro_company_name
                    }

                });
                // console.log(99,state.collaboration)
            }
        },

        setCollaboration(state, data) {
            state.is_collaboration = data;
        },
        /*上传*/
        setfileUrl(state, data) {
            data.data.name = data.files.name;
            state.uploadFile.push(data.data);
        },
        clearfileUrl(state) {
            state.uploadFile = [];
        },
        setFilenum(state, data) {
            state.filenum = data;
        },
        setIsSetShow(state) {
            state.isSetShow = !state.isSetShow
        },
        setIsproject(state) {
            if (typeof(localStorage.isproject) != 'undefined' && localStorage.isproject) {
                state.issproject = JSON.parse(localStorage.isproject)
            }
        },

        delFile(state, index) {
            state.uploadFile.splice(index, 1);
        },

        /*
            project级权限
        */
        projectMenuList(state) {

            const array = state.children.map((child, idx) => {
                if (!state.projectSet.projectStatistics && child.name === 'statistics') {
                    return ''
                }
                else if (!state.projectSet.projectMember && child.name === 'eMember') {
                    return ''
                }
                else if (!state.projectSet.projectQuality && child.name === 'quality') {
                    return ''
                }
                else if (!state.projectSet.projectTask && child.name === 'task') {
                    return ''
                }
                else if (!state.projectSet.projectCustom && child.name === 'custom') {
                    return ''
                }
                else if (!state.projectSet.self && child.name === 'Psetting') {
                    return ''
                }
                return child
            });

            state.children = array.filter((child) => {
                return child !== ''
            })


        },

        /*权限显隐控制*/
        async setRole(state, data) {
            // await this.dispatch('updateMenulistRole', data.vm)
        },
        // 初始化把所有权限设置为true
        roleInit(state) {

            state.routerCallback = null;
            state.standardLibrary = true;
            state.memberMgt = true;
            state.roleMgt = true;
            [state.projectSet, state.epibol, state.callForBidsdts, state.manager].map((item) => {
                for (let k in item) {
                    item[k] = true
                }
            });


        },

        perfect(state) {
            state.perfectStatus = true
        },

        /* 触发回调 */
        handlecallback(state, data) {
            // console.log('refer:',ref);
            if (state.routerCallback) {
                let ref = document.referrer;
                //判断 如果从首页登录 跳转至来路页
                if (ref.indexOf('/spw') != -1 || ref == '') {
                    state.routerCallback(state.menuList);
                } else {
                    location.href = document.referrer;
                }

            }
        },
        /* 添加菜单 */
        createNavList(state, {project, vm}) {
            // debugger
            if (localStorage.woroNav) {
                let array = [];
                if (JSON.parse(localStorage.woroNav) && JSON.parse(localStorage.woroNav)[0]) {
                    array.push(JSON.parse(localStorage.woroNav)[0]);
                }
                if (JSON.parse(localStorage.woroNav) && JSON.parse(localStorage.woroNav)[1]) {
                    array.push(JSON.parse(localStorage.woroNav)[1]);
                }
                // array.push(state.companyMenu);
                array.push(menu);
                state.menuList = array.concat(project);
                localStorage.menuList = JSON.stringify(state.menuList);
                if (vm) {
                    vm.$router.push({path: state.menuList[0].children[0].path})
                    // //添加新首页  优化登录后跳转功能
                    // let ref = document.referrer;
                    // console.log('createNavList: referrer:'+document.referrer+'vm.$route.query.ref:'+ vm.$route.query.ref);
                    // if(ref.indexOf('/spw') != -1 || ref == '' || (vm.$route&&vm.$route.query&&vm.$route.query.ref=='admin')){
                    //     vm.$router.push({path:state.menuList[0].children[0].path})
                    // }else if(ref == 'https://dev.banbooyun.com/' || ref == 'https://www.banbooyun.com/' || ref == 'http://dev3.banbooyun.com/'){

                    //     location.href = document.referrer;
                    // }else{
                    //     location.href = document.referrer;
                    // }
                }
            }
        },
        createProjectNav(state) {
            const array = projectMenu.map((child, idx) => {
                if (!state.projectSet.projectStatistics && child.name === 'statistics') {
                    return ''
                }
                else if (!state.projectSet.projectMember && child.name === 'eMember') {
                    return ''
                }
                else if (!state.projectSet.projectQuality && child.name === 'quality') {
                    return ''
                }
                else if (!state.projectSet.projectTask && child.name === 'task') {
                    return ''
                }
                else if (!state.projectSet.projectCustom && child.name === 'custom') {
                    return ''
                }
                else if (!state.projectSet.self && child.name === 'Psetting') {
                    return ''
                }
                return child
            });

            state.projectNav = array.filter((child) => {
                return child !== ''
            });
            localStorage.projectNav = JSON.stringify(state.projectNav)
        },

    },
    actions: {
        // 获取项目列表
        async getProjectList() {
            if (localStorage.token) {
                const {data} = await api.taskProjectPage();
                if (data.err_code === 0 && data.project) {
                    localStorage.projectList = JSON.stringify(data.project)
                }
            }
        },
        /* 获取协作和菜单 */
        async getCollaborationAndNav({commit, dispatch}, vm) {
            localStorage.projectNav = null;
            localStorage.menuList = null;
            await dispatch('getProjectList');
            await commit('Collaboration', localStorage.projectList ? JSON.parse(localStorage.projectList) : []);
            await commit('createProjectNav');
            await commit('createNavList', {
                project: localStorage.projectList ? JSON.parse(localStorage.projectList) : [],
                vm: vm ? vm : ''
            })
        },
        /* 单独获取协作权限 */
        async getCollaboration({commit, dispatch},) {
            await dispatch('getProjectList');
            await commit('Collaboration', localStorage.projectList ? JSON.parse(localStorage.projectList) : [])

        },

        /* 登录后触发存储权限 */
        async getPermissions({commit, dispatch}, {vm}) {
            await commit('roleInit');
            localStorage.totalPermissions = null;
            localStorage.woroNav = null;
            // 工作台权限
            let woroNav = await api.getAuthMenu();
            if (woroNav.data.err_code === 0 && woroNav.data.data) {
                if (woroNav.data.err_code === 0 && woroNav.data.data) {
                    localStorage.woroNav = JSON.stringify(woroNav.data.data)
                    if (woroNav.data.data[0]) {
                        let item = woroNav.data.data[0];
                        sessionStorage.pageType = item.name;
                        if (item.type === 'myPorject') {
                            return
                        }
                        let obj = {}
                        if (item.id) {
                            obj.project_id = item.id;
                        } else {
                            obj.type = item.name;
                        }
                        let {data} = await api.getAuthTable(obj);
                        if (data.err_code === 0 && data.data && data.data[0]) {
                            sessionStorage.pageTab = JSON.stringify(data.data)
                            vm.$router.push({path: data.data[0].path})
                        }
                    }
                }
            }

        },
        async getMenuNav() {

            // let {data} = await api.projectScheduleHelp()
            // debugger
        },
        /* 单独获取创建菜单 */
        async createNav({commit, dispatch}, vm) {
            let woroNav = await api.getAuthMenu();
            if (woroNav.data.err_code === 0 && woroNav.data.data) {
                if (woroNav.data.err_code === 0 && woroNav.data.data) {
                    localStorage.woroNav = JSON.stringify(woroNav.data.data)
                    // console.log(5555555)
                    Vue.$bus.emit('changeNavCRUD')
                }
            }
        },
    }
};
export default app;
