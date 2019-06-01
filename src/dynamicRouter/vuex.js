import Vue from 'vue';
import Vuex from 'vuex';
import { dynamicRouter } from './router';

Vue.use(Vuex);

export default new Vuex.Store({
    // 私有变量
    state: {
        isAddRoutes: false,
        roleRouterRules: JSON.parse(localStorage.getItem('roleRouterRules')),
    },
    // 公共变量 => 派生变量
    getters: {
        isAddRoutes: state => state.isAddRoutes,
        roleRouter: state => {
            if (state.roleRouterRules) {
                return dynamicRouter.filter(
                    router => state.roleRouterRules.indexOf(router.name) >= 0,
                );
            } else return null;
        },
    },
    // 私有方法(同步) => 改变静态变量
    mutations: {
        set_isAddRoutes: (state, data) => (state.isAddRoutes = data), // payload: true/false
        set_roleRouterRules: (state, data) => (state.roleRouterRules = data), // payload: true/false
    },
    // 公共方法（可异步）=> 调用私有方法
    actions: {
        set_isAddRoutes({ commit }, data) {
            commit('set_isAddRoutes', data);
        },
        set_roleRouterRules({ commit }, data) {
            commit('set_roleRouterRules', data);
            localStorage.setItem('roleRouterRules', JSON.stringify(data));
        },
    },
});
