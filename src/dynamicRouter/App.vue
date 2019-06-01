<template>
  <div id="app">
    <ul>
      <router-link tag="li" to="/">默认路由根路由login</router-link>
      <router-link tag="li" to="/login">login</router-link>
      <router-link tag="li" to="/b">
        动态注册B,未登录login,已登录可进入,无权限404
      </router-link>
      <router-link tag="li" to="/c">
        动态注册C,未登录login,已登录可进入,无权限404
      </router-link>
      <router-link tag="li" to="/err">
        不存在的路由,已登录的去404,未登录去login
      </router-link>
      <li @click="exit">模拟用户登出,跳转到login</li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { dynamic } from "./router";
export default {
  name: "app",
  methods: {
    ...mapActions([
      "set_roleRouterRules",
      "set_isAddRoutes" // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    exit() {
      localStorage.clear();
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" >
li {
  text-align: center;
  cursor: pointer;
  color: skyblue;
  text-decoration: underline;
}
</style>
