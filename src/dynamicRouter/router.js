import Vue from 'vue';
import vuex from './vuex';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import pageA from './pages/a';
import pageB from './pages/b';
import pageC from './pages/c';
import pageD from './pages/d';

export const dynamicRouter = [
    { path: '/b', name: 'b', component: pageB },
    { path: '/c', name: 'c', component: pageC },
];

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: pageA },
    { path: '/404', component: pageD },
    { path: '*', redirect: '/404' },
];

const router = new VueRouter({
    mode: 'history',
    routes, // (缩写) 相当于 routes: routes
});

let whiteList = routes.map(i => i.path);
router.beforeEach((to, from, next) => {
    let path = to.redirectedFrom || to.path;
    // 白名单 放行
    if (whiteList.indexOf(path) >= 0) return next();
    // 黑名单
    if (!vuex.getters.roleRouter) return next({ path: '/login' });
    if (!vuex.getters.isAddRoutes) {
        console.log('path未注册,存在角色路由，立即注册尝试匹配');
        router.addRoutes(vuex.getters.roleRouter);
        vuex.dispatch('set_isAddRoutes', true);
        next(path);
    } else {
        console.log('已注册过动态路由，尝试匹配');
        next();
    }
});
export default router;
