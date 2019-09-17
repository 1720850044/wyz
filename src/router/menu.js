export const companyMenu = [
    {
        path: '/epibol/projectManage',
        name: 'projectManage',
        level: '2-4',
        title: '项目',
    },
    {
        path: '/epibol/bidManage',
        name: 'bidManage',
        level: '2-2',
        title: '投标',
        auth: 0,
    },
    {
        path: '/customer/epibolCompany',
        icon: 'ios-paper-outline',
        name: 'epibolCompany',
        title: '招标',
    },
    {
        path: '/epibol/cooperation',
        name: 'cooperation',
        title: '合作',
    },
    ,{
        path: '/epibol/contractManage',
        name: 'contractManage',
        level: '2-3',
        title: '合同',
        auth: 1,
    },
    {
        path: '/epibol/mainPage',
        name: 'mainPage',
        level: '2-8',
        title: '财务',
    },
    {
        path: '/epibol/skydrive',
        name: 'skydrive',
        level: '2-8',
        title: '资源',
    },
    {
        path: '/epibol/taskClassMain',
        name: 'taskClass',
        level: '2-7',
        title: '规范库',
    },
    {
        path: '/epibol/memberManager',
        name: 'memberManager',
        level: '2-5',
        title: '成员和权限',
    },
    {
        path: '/epibol/teamPower',
        name: 'teamPower',
        level: '2-9',
        title: '团队能力',
    },
    {
        path: '/epibol/statistics',
        name: 'eStatistics',
        level: '2-6',
        title: '统计',
    },
    // {
    //     path: '/epibol/home',
    //     name: 'eHome',
    //     level: '2-1',
    //     title: '概况',
    // },
    {
        path: '/epibol/taskClass',
        name: 'taskClass',
        level: '2-7',
        title: '设置',
    },



];

export const projectMenu =  [

    {
        path: '/project/task',
        name: 'task',
        level: '1-2',
        title: '任务',
    },
    {
        path: '/project/smartSchedule',
        name: 'smartScheduling',
        level: '1-8',
        title: '排期'
    } ,
    {
        path: '/project/quality',
        name: 'quality',
        level: '1-3',
        title: '资源',
    },
    {
        path: '/project/projectStandard',
        name: 'projectStandardLibrary',
        level: '1-7',
        title: '规范',
    },
    {
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
        path: '/project/home',
        name: 'custom',
        level: '1-1',
        title: '概况',
    },
    // {
    //     path: '/project/setting',
    //     name: 'Psetting',
    //     level: '1-6',
    //     title: '设置',
    // },

];

export const menu =

   // {
   //      path: '/workbench',
   //      name: 'member',
   //      title: '我的工作台',
   //      children: [
   //          {
   //              path: '/workbench/manager',
   //              name: 'eHome',
   //              title: '经理工作台',
   //          },
   //          {
   //              path: '/workbench/leader',
   //              name: 'eHome',
   //              title: '组长工作台',
   //          },
   //          {
   //              path: '/workbench/member',
   //              name: 'member',
   //              title: '成员工作台',
   //          },
   //          {
   //              path: '/workbench/workStatistucs',
   //              name: 'workStatistics',
   //              title: '工作统计',
   //          },
   //
   //      ]
   //  },

    {
        path: '/artsquare',
        name: 'artsquare',
        title: '项目大厅',
        children: [
            {
                path: '/artsquare/home',
                name: 'aHome',
                title: '任务大厅',
            },
            // {
            //     path: '/artsquare/project',
            //     name: 'dProject',
            //     title: '项目库',
            // }
        ]
    };

