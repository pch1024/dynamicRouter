<template>
  <div>
    <p>login page</p>
    <li @click="login(['b'])">
      模拟用户登录B，过滤并存储角色路由，跳转到动态注册B
    </li>
    <li @click="login(['c'])">
      模拟用户登录C，过滤并存储角色路由，跳转到动态注册B
    </li>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions([
      "set_roleRouterRules" // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    login(roleRouterRules) {
      // 登录成功，vuex 存储角色路由
      this.set_roleRouterRules(roleRouterRules);
      // 跳转到动态注册B
      this.$router.replace({ path: "/b" });
    }
  }
};
</script>
