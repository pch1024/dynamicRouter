# 使用 Vue Router 的 addRoutes 方法实现动态添加用户的权限路由

> 最近做vue 单页项目涉及到多角色用户权限问题，不同的角色用户拥有不同的功能权限， 不同的功能权限对应的不同的页面

```
举个例子：
    角色A =>功能1
         =>功能2
         =>功能3
         
    角色B =>功能1
         =>功能4
         =>功能5
```
## 第1步 定义默认路由和动态路由
```js
//动态路由(所有角色的都在这里,我们都做好组件页面了所以我们一定有这个，防君子不防小人)
export const dynamicRouter = [
    { path: '/b', name: 'b', component: pageB },
    { path: '/c', name: 'c', component: pageC },
];

//默认路由(无需登录就可以使用)
const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: pageLogin},
    { path: '/404', component: page404},
    { path: '*', redirect: '/404' },
];

const router = new VueRouter({
    mode: 'history',
    routes, // (缩写) 相当于 routes: routes
});
```
## 第2步 登录获取权限规则

当然，登录还要获取token、用户信息等，我们暂时不关注，我们的权限规则需要在多处使用所以我们将它存到vuex里
```html
// vue 组件
<li @click="login(['b'])">
  模拟用户1登录，权限['b']，跳转到页面B
</li>
<li @click="login(['c'])">
  模拟用户2登录，权限['c']，跳转到页面B,(用户2没有页面B权限，强行进入会滚去页面404)
</li>
```
```js

// 登录模块---------------------------------------------------------
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions([
      "set_roleRouterRules"
    ]),
    login(roleRouterRules) {
      // 登录成功，vuex 存储角色路由
      this.set_roleRouterRules(roleRouterRules);
      // 跳转到动态注册B
      this.$router.replace({ path: "/b" });
    }
  }
};

// vuex 对应功能实现-----------------------------------------------
// 引入第1步 定义的dynamicRouter 
import { dynamicRouter } from './router';
// 私有变量
state: {
    isAddRoutes: false,
    // 后端返回的原始数据默认存到 localStorage，每次初始化取出来
    roleRouterRules: JSON.parse(localStorage.getItem('roleRouterRules')),
},
// 公共变量 => 派生私有变量
getters: {
    isAddRoutes: state => state.isAddRoutes,
    // 根据 roleRouterRules 生成当前角色的动态路由配置数据（addRoutes方法可以直接使用的路由数组)
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
        // 保存到vuex
        commit('set_roleRouterRules', data);
        // 保存到 localStorage,当用户强制刷新浏览器时我们要使用这一份数据初始化 state.roleRouterRules
        localStorage.setItem('roleRouterRules', JSON.stringify(data));
    },
}
```
## 第3步 登录成功跳转权限页面（核心）

基本思路：
- 所有的路由跳转都要做鉴权，
- 不是动态路由（也就是默认路由）直接放过，
- 是动态路由（也就是还未创建的，强行进入会被重定向到404,但依然可以在to.redirectedFrom获取到用户希望进去的路由），检查前端是否有路由权限规则数据
  - 没有，让他去登录页
  - 有，就根据 roleRouterRules 生成当前角色的动态路由配置数据并addRoutes添加到真实router，此时通过`let path = to.redirectedFrom || to.path;` 和 `next(path);` 再走一遍鉴权（这一次真实router上有它就进页面，还没有就代表这个用户没有这个页面访问权限滚去404）

注意事项：
- `addRoutes()` 方法一个用户只能使用一次，所以要加一个状态值`isAddRoutes`到vuex里，每次用户进动态路由时检查 addRoutes 使用过没有
- `next()` 方法没有参数会直接放行，有参数（例如 next({path:'/404'})） 放行后会再次进入router.beforeEach，一不小心就是死循环


```js
import vuex from './vuex';
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
```


## 第4步 切换不同角色用户

此处有坑， Vue Router 只提供了 addRoutes ，却没有删除和替换方法，所以只能通过强刷新浏览器来重置 Vue Router,先清空localStorage，在刷新时，初始化的Vue Router只有默认路由，用户只能去登录页了
还有一种方法我没看懂,感兴趣可以查看：https://github.com/vuejs/vue-router/issues/1234
```js
exit() {
  localStorage.clear();
  window.location.reload();
}
```















