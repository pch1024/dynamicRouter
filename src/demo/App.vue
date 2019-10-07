<template>
  <div class="app">
    <!-- <a-locale-provider :locale="locale"> -->
    <div class="nav">
      <span v-for="item in pages" :key="item" @click="page = item">
        {{ item }}
      </span>
    </div>
    <pageJPEG class="page" v-if="page === 'JPEG'" />
    <pageColor class="page" v-if="page === 'Color'" />
    <pageVideo2Gif class="page" v-if="page === 'Video2Gif'" />
    <!-- </a-locale-provider> -->
  </div>
</template>
<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import pageColor from "./page.color";
import pageVideo2Gif from "./page.video2gif";
import pageJPEG from "./page.jpeg";
export default {
  components: {
    pageJPEG,
    pageColor,
    pageVideo2Gif
  },
  data() {
    let pages = ["JPEG", "Color", "Video2Gif"];
    return {
      name: "hello world",
      pages,
      page: pages[0],
      locale: zhCN
    };
  }
};
</script>
<style lang="scss" scoped>
.nav {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: center;

  span {
    height: 40px;
    line-height: 40px;
    font-size: 40px;
    font-weight: 400;
    margin: 40px 0;
    padding: 0 40px;
    &:not(:last-child) {
      border-right: 1px dashed lightgray;
    }
    &:hover {
      color: skyblue;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.page {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>
