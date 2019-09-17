import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';
import api from 'api';
import {routerBus} from '@/plugins/bus';
import config from './routerConfig.js';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers,
};

export const router = new VueRouter(RouterConfig);

// 根据路由获取对应的二级tab列表
const toRouterGetTab = async (to, from, next) => {
    let dataObj = {};
    let pathObk = null;
    if (!localStorage.token) {
        return;
    }
    // 菜单的跳转在Main.js处理  带有isMenu参数的是菜单跳转，这里只处理页面中的跳转
    if (to.fullPath && !to.fullPath.includes('isMenu')) {
        if (to.fullPath.includes('epibol') || to.fullPath.includes('customer')) {
            dataObj.type = 'epibol';
        } else if (to.fullPath.includes('workbench')) {
            dataObj.type = 'workbench';

        } else if (to.fullPath.includes('artsquare')) {
            dataObj.type = 'artsquare';
        } else if (to.fullPath.includes('project')) {
            dataObj.project_id = sessionStorage.projectID;
        }
        let {data} = await api.getAuthTable(dataObj);
        if (data && data.data) {
            sessionStorage.pageTab = JSON.stringify(data.data);
            sessionStorage.pageType = dataObj.type ? dataObj.type : 'myPorject';
            pathObk = {
                pageType: dataObj.type ? dataObj.type : 'myPorject',
                pageTab: data.data,
                pageLeader: data.is_leader,
            };
            if (data.project_name) {
                pathObk.pageName = data.project_name;
                pathObk.pageIsProject = true;
                sessionStorage.pageName = data.project_name;
            }
            toRouterGetName(to, from, next, data.project_name);
            setTimeout(() => {
                Vue.$bus.emit('storageTab', pathObk);
            }, 500);
        }
    } else {
        toRouterGetName(to, from, next);
    }
};
const toRouterGetName = (to, from, next, name) => {
    if (to.fullPath.includes('workbench')) {
        document.title = config.metaTitle.workbench;
    }
    else if (to.fullPath.includes('epibol') || from.fullPath.includes('customer')) {
        document.title = config.metaTitle.company;
    }
    else if (name && to.fullPath.includes('project')) {
        document.title = `${name} - Banboo`;
    }
};

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    // next();
    //判断是否返回首页    暂时隐藏  不要删除
    if (!Cookies.get('user') && to.name !== 'index' && to.name !== 'login') {
        //debugger
        console.log('router未登录 index页面');
        next({
            name: 'login', //'index'  退出的一返回登录页 by Song
        });
    } else if (Cookies.get('user') && (to.name === 'index' || to.name === 'login')) {
        Util.title();
        next({
            name: 'home_index',
        });
    }
    else {
        const curRouterObj = Util.getRouterObjByName([ otherRouter, ...appRouter ], to.name);
        if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
            if (curRouterObj.access === parseInt(Cookies.get('access'))) {
                Util.toDefaultPage([ otherRouter, ...appRouter ], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
            } else {
                next({
                    replace: true,
                    name: 'error-403',
                });
            }
        } else { // 没有配置权限的路由, 直接通过
            toRouterGetTab(to, from, next);
            // Util.toDefaultPage([...routers], to.name, router, next);
        }
    }

    // 如果没有匹配的路由则跳转到404
    if (to.matched && to.matched.length <= 0) {
        next({
            replace: true,
            name: 'error-404',
        });
    } else {
        next();
    }
});

router.afterEach((to) => {
    // Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;
