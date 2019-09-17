import Main from '@/views/Main.vue';
import login from '@/views/login.vue';
import config from './routerConfig'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: login
    /*resolve => {
        require(['@/views/login.vue'], resolve);
    }*/
};
//默认首页路由
export const indexRouter = {
    path: '/index',
    name: 'index',
    meta: {
        title: '默认首页'
    },
    component: resolve => {
        require(['@/views/index/index.vue'], resolve);
    }

};

export const page404 = {
    path: '/404',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => {
        require(['@/views/error-page/404.vue'], resolve);
    }
};
export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => {
        require(['@//views/error-page/403.vue'], resolve);
    }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => {
        require(['@/views/error-page/500.vue'], resolve);
    }
};
// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter =
    {
        path: '/',
        name: 'otherRouter',
        component: Main,
        redirect: '/home/personalCenter/',
        children: [
            {
                path: '/home/personalCenter',
                icon: 'ios-folder',
                name: '/home/personalCenter',
                title: '个人中心',
                component: resolve => {
                    require(['@/views/personalCenter/personalSet.vue'], resolve);
                },
                children: [
                    {
                        path: '/',
                        icon: 'ios-paper-outline',
                        name: 'personalCenter',
                        title: '艺术WIKI',
                        meta: {title: '个人设置'},
                        component: resolve => {
                            require(['@/views/personalCenter/certification/index.vue'], resolve);
                        },
                    },

                ]
            }
        ]
    }
;
// 作为Main组件的子页面展示并且在右侧顶部菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/project',
        icon: 'ios-folder',
        name: 'project',
        title: '项目管理',

        component: Main,
        children: [
            {
                path: '/project/task',
                icon: 'ios-paper-outline',
                name: 'task',
                title: '任务管理',

                component: resolve => {
                    require(['@/views/project/task.vue'], resolve);
                },
                children: [{
                    path: '/project/kanban',

                    component: resolve => {
                        require(['@/views/project/task/tasklist.vue'], resolve);
                    },
                }, {
                    path: '/project/jinduguanli',

                    component: resolve => {
                        require(['@/views/project/schedule.vue'], resolve);
                    },
                }]
            },
            {
                path: '/project/home',
                icon: 'ios-paper-outline',
                name: 'custom',
                title: '概况',

                component: resolve => {
                    require(['@/views/project/projectHome.vue'], resolve);
                }
            },
            {
                path: '/project/schedule',
                icon: 'ios-paper-outline',
                name: 'schedule',
                title: '项目进度',

                component: resolve => {
                    require(['@/views/project/schedule.vue'], resolve);
                }
            },
            {
                path: '/project/quality',
                icon: 'ios-paper-outline',
                name: 'quality',
                title: '质量管理',

                component: resolve => {
                    require(['@/views/project/quality.vue'], resolve);
                }
            },
            {
                path: '/project/assetsManage/pigeonhole',
                icon: 'ios-paper-outline',
                name: 'pigeonhole',
                title: '归档文件',

                component: resolve => {
                    require(['@/views/project/assetsManage/pigeonhole.vue'], resolve);
                }
            },
            {
                path: '/project/statistics',
                icon: 'ios-paper-outline',
                name: 'statistics',
                title: '项目统计',

                component: resolve => {
                    require(['@/views/project/statistics.vue'], resolve);
                }
            },
            {
                path: '/project/statisticsDetails/:style',
                icon: 'ios-paper-outline',
                name: 'statisticsDetails',
                title: '统计详情',

                component: resolve => {
                    require(['@/views/project/proStat/statisticsDetails.vue'], resolve);
                }
            },
            {
                path: '/project/setting',
                icon: 'ios-paper-outline',
                name: 'Psetting',
                title: '设置',

                component: resolve => {
                    require(['@/views/project/projectSet.vue'], resolve)
                }
            },
            {
                path: '/project/projectStandard',
                icon: 'ios-paper-outline',
                name: 'projectStandard',
                title: '项目类型库',

                component: resolve => {
                    require(['@/views/project/projectStandard.vue'], resolve)
                }
            },
            {
                path: '/project/details',
                icon: 'ios-paper-outline',
                name: 'file',
                title: '任务管理详情',

                component: resolve => {
                    require(['@/views/project/task/taskInfoPop/taskInfoPop.vue'], resolve)
                }
            },
            {
                path: '/project/projectMember',
                titie: '项目成员',
                name: 'projectMember',
                component: resolve => {
                    require(['@/views/project/projectSet/peopleSet.vue'], resolve);
                },
            },
            {
                path: '/project/imgEditorTwo',
                name: 'imgEditorTwo',
                title: '2D显示标注2.0',

                component: resolve => {
                    require(['@/views/project/components/imgEditorTwo.vue'], resolve);
                }
            },
            {
                path: '/project/smartSchedule',
                icon: 'ios-paper-outline',
                name: 'smartScheduling',
                title: '智能排期',

                component: resolve => {
                    require(['@/views/project/smartSchedule/smartSchedulePage.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/epibol',
        icon: 'ios-folder',
        name: 'epibol',
        title: '外包公司管理',
        component: Main,

        children: [
            {
                path: '/epibol/teamPower',
                icon: 'ios-paper-outline',
                name: 'teamPower',
                title: '团队能力',

                component: resolve => {
                    require(['@/views/epibol/teamPower.vue'], resolve);
                }
            },
            {
                path: '/epibol/projectManage',
                icon: 'ios-paper-outline',
                name: 'projectManage',
                title: '项目',
                redirect:'/epibol/projectManage/projectIndex',
                component: resolve => {
                    require(['@/views/epibol/projectManage.vue'], resolve);
                },
                children:[
                    {
                        path: 'projectIndex',
                        icon: 'ios-paper-outline',
                        name: 'projectIndex',
                        title: '项目',
                        component: resolve => {
                            require(['@/views/epibol/projectManage/projectIndex.vue'], resolve);
                        }
                    },
                    {
                        path: 'projectScore',
                        icon: 'ios-paper-outline',
                        name: 'projectScore',
                        title: '项目评分',
                        component: resolve => {
                            require(['@/views/epibol/projectManage/projectScore.vue'], resolve);
                        }
                    },
                    {
                        path: 'projectInvite',
                        icon: 'ios-paper-outline',
                        name: 'projectInvite',
                        title: '项目邀请',
                        component: resolve => {
                            require(['@/views/epibol/projectManage/projectInvite.vue'], resolve);
                        }
                    },
                ]
            },
            {
                path: '/epibol/home',
                icon: 'ios-paper-outline',
                name: 'eHome',
                title: '概况页',

                component: resolve => {
                    require(['@/views/epibol/home.vue'], resolve);
                }
            },
            {
                path: '/epibol/bidManage',
                icon: 'ios-paper-outline',
                name: 'bidManage',
                title: '投标',
                redirect:'/epibol/bidManage/bidIndex',
                component: resolve => {
                    require(['@/views/epibol/bidManage.vue'], resolve);
                },
                children:[
                    {
                        path: 'bidIndex',
                        icon: 'ios-paper-outline',
                        name: 'bidIndex',
                        title: '已报名',
                        component: resolve => {
                            require(['@/views/epibol/bidManage/bidList.vue'], resolve);
                        }
                    },
                    {
                        path: 'bidInvite',
                        icon: 'ios-paper-outline',
                        name: 'bidInvite',
                        title: '外包邀请',
                        component: resolve => {
                            require(['@/views/epibol/bidManage/bidInvite.vue'], resolve);
                        }
                    },
                    {
                        path: 'testInvite',
                        icon: 'ios-paper-outline',
                        name: 'testInvite',
                        title: '测试邀请',
                        component: resolve => {
                            require(['@/views/epibol/bidManage/testInvite.vue'], resolve);
                        }
                    },
                ]
            },
            {
                path: '/epibol/ManageDetails',
                icon: 'ios-paper-outline',
                name: 'ManageDetails',
                title: '投标详情',

                component: resolve => {
                    require(['@/views/epibol/bidManage/bidDetails.vue'], resolve);
                }
            },
            {
                path: '/epibol/contractManage',
                icon: 'ios-paper-outline',
                name: 'contractManage',
                title: '合同',

                component: resolve => {
                    // require(['@/views/contract/index.vue'], resolve);
                    require(['@/views/epibol/contractManage.vue'], resolve);
                }
            },
            {
                path: '/epibol/contract',
                icon: 'ios-paper-outline',
                name: 'contractIndex',
                title: '新版合同',
                component: resolve => {
                    require(['@/views/contract/index.vue'], resolve);
                }
            },
            {
                path: '/epibol/contractData',
                icon: 'ios-paper-outline',
                name: 'contractData',
                title: '新增合同',

                component: resolve => {
                    require(['@/views/epibol/contractManage/component/contractData.vue'], resolve);
                }
            },
            {
                path: '/epibol/memberManager',
                icon: 'ios-paper-outline',
                name: 'memberManager',
                title: '团队',
                redirect:'/epibol/memberManager/menberManagerIndex',
                component: resolve => {
                    require(['@/views/epibol/memberManager.vue'], resolve);
                },
                children:[
                    {
                        path: 'menberManagerIndex',
                        icon: 'ios-paper-outline',
                        name: 'memberManagerIndex',
                        title: '成员管理',

                        component: resolve => {
                            require(['@/views/epibol/mmComponents/menberManagerIndex.vue'], resolve);
                        }
                    },
                    {
                        path: 'permissionSetting',
                        icon: 'ios-paper-outline',
                        name: 'permissionSetting',
                        title: '权限设置',

                        component: resolve => {
                            require(['@/views/epibol/mmComponents/permissionSetting.vue'], resolve);
                        }
                    },
                    {
                        path: 'teamCapability',
                        icon: 'ios-paper-outline',
                        name: 'teamCapability',
                        title: '团队能力',

                        component: resolve => {
                            require(['@/views/epibol/teamPower.vue'], resolve);
                        }
                    },
                ]

            },
            {
                path: '/epibol/statistics',
                icon: 'ios-paper-outline',
                name: 'eStatistics',
                title: '统计',

                component: resolve => {
                    require(['@/views/epibol/statistics.vue'], resolve);
                }
            },
            {
                path: '/epibol/skydrive',
                icon: 'ios-paper-outline',
                name: 'skydrive',
                title: '资源管理',

                component: resolve => {
                    require(['@/views/epibol/skydrive.vue'], resolve);
                }
            },
            {
                path: '/epibol/taskClass',
                icon: 'ios-paper-outline',
                name: '设置',
                title: '设置',

                // component: resolve => { require(['@/views/epibol/typeLibrary/taskClass.vue'], resolve); }
                component: resolve => {
                    require(['@/views/epibol/companySet.vue'], resolve);
                },
                children: [
                    {
                        path: '/',
                        name: 'companyInformation',
                        title: '企业资料',

                        component: resolve => {
                            require(['@/views/epibol/certification/index.vue'], resolve);
                        }
                    },
                ]
            },
            {
                path: '/epibol/taskClassMain',
                icon: 'ios-paper-outline',
                name: 'imPlementer',
                title: '公司规范库',

                component: resolve => {
                    require(['@/views/epibol/typeLibrary/taskClass.vue'], resolve);
                }
            },

            {
                path: '/epibol/3D',
                icon: 'ios-paper-outline',
                name: '3D',
                title: '3D',

                component: resolve => {
                    require(['@/views/project/components/threeModule.vue'], resolve);
                }
            },
            {
                path: '/epibol/contractDetails',
                icon: 'ios-paper-outline',
                name: 'contractDetails',
                title: '合同详情',

                component: resolve => {
                    require(['@/views/epibol/contractManage/component/contractDetails.vue'], resolve);
                }
            },
            {
                path: '/epibol/addElectronicContract',
                icon: 'ios-paper-outline',
                name: 'addElectronicContract',
                title: '电子合同',

                component: resolve => {
                    require(['@/views/epibol/contractManage/component/electronicContract'], resolve);
                }
            },
            {
                path: '/epibol/mainPage',
                icon: 'ios-paper-outline',
                name: 'mainPage',
                title: '财务统计',
                redirect:'/epibol/mainPage/financeIndex',
                component: resolve => {
                    require(['@/views/epibol/financialStatistics/mainPage.vue'], resolve);
                },
                children: [
                    {
                        path: 'financeIndex',
                        name: 'financeIndex',
                        title: '财务总览',
                        component: resolve => {
                            require(['@/views/epibol/financialStatistics/overview.vue'], resolve);
                        }
                    },
                    {
                        path: 'detailed',
                        name: 'detailed',
                        title: '收入明细',
                        component: resolve => {
                            require(['@/views/epibol/financialStatistics/detailed.vue'], resolve);
                        }
                    },
                    {
                        path: 'expenditure',
                        name: 'expenditure',
                        title: '支出明细',
                        component: resolve => {
                            require(['@/views/epibol/financialStatistics/expenditure.vue'], resolve);
                        }
                    },
                    {
                        path: 'financialStatistics',
                        name: 'financialStatistics',
                        title: '财务统计',
                        component: resolve => {
                            require(['@/views/epibol/financialStatistics/financial.vue'], resolve);
                        }
                    },
                ]
            },
            {
                path: '/epibol/cooperation',
                icon: 'ios-paper-outline',
                name: 'cooperation',
                title: '合作',
                redirect:'/epibol/cooperation/cooperationIndex',
                component: resolve => {
                    require(['@/views/epibol/cooperation.vue'], resolve);
                },
                children:[
                    {
                        path: 'cooperationIndex',
                        name: 'cooperationIndex',
                        title: '合作公司库',
                        component: resolve => {
                            require(['@/views/epibol/cooperation/page/cooperationIndex.vue'], resolve);
                        }
                    },
                    {
                        path: 'cooperationInvitation',
                        name: 'cooperationInvitation',
                        title: '合作邀请',
                        component: resolve => {
                            require(['@/views/epibol/cooperation/page/cooperationInvitation.vue'], resolve);
                        }
                    }
                ]
            },
        ]
    },
    {
        path: '/customer',
        icon: 'ios-folder',
        name: 'customer',
        title: '客户公司管理',

        component: Main,
        children: [
            {
                path: '/customer/home',
                icon: 'ios-paper-outline',
                name: 'cHome',
                title: '概况页',

                component: resolve => {
                    require(['@/views/customer/home.vue'], resolve);
                }
            },
            {
                path: '/customer/epibolCompany',
                icon: 'ios-paper-outline',
                name: 'epibolCompany',
                title: '合作',
                redirect:'/customer/epibolCompany/testTaskIndex',
                component: resolve => {
                    require(['@/views/customer/epibolCompany.vue'], resolve);
                },
                children:[
                    {
                        path: 'testTaskIndex',
                        name: 'testTaskIndex',
                        title: '测试任务',
                        component: resolve => {
                            require(['@/views/customer/epibolCompany/page/testTaskIndex.vue'], resolve);
                        }
                    },
                    {
                        path: 'cooperativeCompany',
                        name: 'cooperativeCompany',
                        title: '合作公司',
                        component: resolve => {
                            require(['@/views/customer/epibolCompany/page/cooperativeCompany.vue'], resolve);
                        }
                    },
                    {
                        path: 'outsourcingInvitation',
                        name: 'outsourcingInvitation',
                        title: '外包邀请',
                        component: resolve => {
                            require(['@/views/customer/epibolCompany/page/outsourcingInvitation.vue'], resolve);
                        }
                    }
                ]
            },
            {
                path: '/customer/testTaksDetails',
                icon: 'ios-paper-outline',
                name: 'testTaksDetails',
                title: '任务详情',

                component: resolve => {
                    require(['@/views/customer/epibolCompany/component/taskDetails.vue'], resolve);
                }
            },
            {
                path: '/customer/contractManage',
                icon: 'ios-paper-outline',
                name: 'cContractManage',
                title: '合同',

                component: resolve => {
                    // require(['@/views/contract/index.vue'], resolve);
                    require(['@/views/customer/contractManage.vue'], resolve);
                }
            },
            {
                path: '/customer/contract',
                icon: 'ios-paper-outline',
                name: 'contractIndex',
                title: '新版合同',
                component: resolve => {
                    require(['@/views/contract/index.vue'], resolve);
                }
            },
            {
                path: '/customer/contractData',
                title: '合同详情',

                component: resolve => {
                    require(['../views/customer/contractManage/component/contractData.vue'], resolve);
                }
            },
            {
                path: '/customer/bidManage',
                icon: 'ios-paper-outline',
                name: 'cusBidManage',
                title: '招投标管理',

                component: resolve => {
                    require(['@/views/customer/bidManage.vue'], resolve);
                }
            },
            {
                path: '/epibol/projectManage',
                icon: 'ios-paper-outline',
                name: 'cProjectManage',
                title: '项目管理',

                component: resolve => {
                    require(['@/views/epibol/projectManage.vue'], resolve);
                }
            },
            {
                path: '/customer/payManage/:id',
                icon: 'ios-paper-outline',
                name: 'cpayManage',
                title: '支付',

                component: resolve => {
                    require(['@/views/customer/payManage.vue'], resolve);
                }
            },
            {
                path: '/customer/paySkip',
                icon: 'ios-paper-outline',
                name: 'paySkip',
                title: '支付跳转',

                component: resolve => {
                    require(['@/views/customer/paySkip.vue'], resolve);
                }
            },
            {
                path: '/customer/customerServicePage',
                icon: 'ios-paper-outline',
                name: 'paySkip',
                title: '客服聊天',

                component: resolve => {
                    require(['@/views/customer-service/customerServicePage.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/artsquare',
        icon: 'ios-folder',
        name: 'artsquare',
        title: '任务大厅',
        component: Main,
        children: [
            {
                path: '/artsquare/home',
                icon: 'ios-paper-outline',
                name: 'aHome',
                title: '任务大厅',
                meta: {title: '任务大厅'},
                component: resolve => {
                    require(['@/views/artsquare/home.vue'], resolve);
                }
            },
            {
                path: '/artsquare/project',
                icon: 'ios-paper-outline',
                name: 'dProject',
                title: '项目库',
                meta: {title: '项目库'},
                component: resolve => {
                    require(['@/views/artsquare/project.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/typeLibrary',
        icon: 'ios-paper',
        title: '项目管理',
        name: 'typeLibrary',
        component: Main,
        children: []
    },
    {
        path: '/workbench',

        component: Main,
        children:[
            {
                path: '/workbench/member',
                icon: 'ios-paper-outline',
                name: 'member',

                component: resolve => {
                    require(['@/views/workbench/member.vue'], resolve);
                }
            },
            {
                path: '/workbench/workStatistucs',
                icon: 'ios-paper-outline',
                name: 'WorkStatistucs',
                title: '工作统计',

                component: resolve => {
                    require(['@/views/workbench/workStatistucs.vue'], resolve);
                }
            },
            {
                path: '/workbench/leader',
                icon: 'ios-paper-outline',
                name: 'workbench',
                title: '工作台',
                component: resolve => {
                    require(['@/views/workbench/leader.vue'], resolve);
                },

            },
            {
                path: '/workbench/teamWork',
                icon: 'ios-paper-outline',
                name: 'teamWork',
                title: '团队工作',

                component: resolve => {
                    require(['@/views/workbench/teamWork'], resolve);
                },

            },
            {
                path: '/workbench/manager',
                icon: 'ios-paper-outline',
                name: 'manager',
                title: '经理工作台',
                redirect:'/workbench/manager/entiretyOverview',
                component: resolve => {
                    require(['@/views/workbench/manager.vue'], resolve);
                },
                children: [
                    {
                        path: 'workOverview',

                        name: 'a',
                        title: '工作概况',
                        component: resolve => {
                            require(['@/views/workbench/manager/workOverview.vue'], resolve);
                        },
                    },  {
                        path: 'financeOverview',

                        name: 'b',
                        title: '财政概况',
                        component: resolve => {
                            require(['@/views/workbench/manager/financeOverview.vue'], resolve);
                        },
                    },  {
                        path: 'memberOverview',
                        name: 'memberOverview',
                        title: '成员概况',
                        component: resolve => {
                            require(['@/views/workbench/manager/memberOverview.vue'], resolve);
                        },
                    },  {
                        path: 'entiretyOverview',

                        name: 'd',
                        title: '整体概况',
                        component: resolve => {
                            require(['@/views/workbench/manager/entiretyOverview.vue'], resolve);
                        },
                    },
                ],

            },
            {
                path: '/workbench/setSchedule',
                icon: 'ios-paper-outline',
                name: 'setSchedule',
                title: '日程安排',

                component: resolve => {
                    require(['@/views/workbench/setSchedule.vue'], resolve);
                }
            },
        ]
    },
];
// const videoTest = {
//     path: '/',
//     name: 'otherRouter',
//     component: `@/views//videoTest/.vue`,
// };
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    indexRouter,
    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404,
    // videoTest
];
