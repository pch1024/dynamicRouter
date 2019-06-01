<template>
  <div class=" page_color">
    <div class="box">
      <select id="blend" ref="blend" @change="onSelectChange">
        <option value="normal">normal-正常</option>
        <option value="multiply">multiply-正片叠底</option>
        <option value="screen" selected>screen-滤色</option>
        <option value="overlay">overlay-叠加</option>
        <option value="darken">darken-变暗</option>
        <option value="lighten">lighten-变亮</option>
        <option value="color-dodge">color-dodge-颜色减淡</option>
        <option value="color-burn">color-burn-颜色加深</option>
        <option value="hard-light">hard-light-强光</option>
        <option value="soft-light">soft-light-柔光</option>
        <option value="difference">difference-差值(</option>
        <option value="exclusion">exclusion-排除</option>
        <option value="hue">hue-色相</option>
        <option value="saturation">saturation-饱和度</option>
        <option value="color">color-颜色</option>
        <option value="luminosity">luminosity-亮度</option>
        <option value="initial">initial-初始</option>
        <option value="inherit">inherit-继承</option>
        <option value="unset">unset-复原</option>
      </select>
      <div class="color red" :style="colorStyle"></div>
      <div class="color green" :style="colorStyle"></div>
      <div class="color blue" :style="colorStyle"></div>
    </div>
  </div>
</template>
<script>
import Draggable from "gsap/Draggable";
export default {
  data() {
    return {
      colorStyle: {
        "mix-blend-mode": "screen"
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      Draggable.create(".color", {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: "#box",
        throwProps: true
      });
    });
  },
  methods: {
    onSelectChange(e) {
      this.colorStyle["mix-blend-mode"] = e.target.value;
    }
  }
};
</script>
<style lang="scss" scoped>
select#blend {
  border: 1px solid #d9d9d9;
  border-width: 0 0 1px 0;
  width: 100%;
  height: 30px;
  margin: 0 auto;
  line-height: 30px;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  color: gray;
  padding-right: 20px;
}
.box {
  width: 500px;
  height: 500px;
  margin: 30px auto;
  border: 1px solid #d9d9d9;
  position: relative;
  > div {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 1px solid black;
    mix-blend-mode: screen;
    position: absolute;
    top: calc(50% - 150px);
    left: calc(50% - 150px);
  }
  .red {
    background-color: rgb(255, 0, 0);
  }
  .green {
    background-color: rgb(0, 255, 0);
  }
  .blue {
    background-color: rgb(0, 0, 255);
  }
}
</style>
