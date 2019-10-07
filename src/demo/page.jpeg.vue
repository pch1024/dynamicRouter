<template>
  <div class="jpeg">
    <img src="./images/Progressive.jpg" alt="Progressive" />
    <img src="./images/Baseline.jpg" alt="Baseline" />
  </div>
</template>
<style lang="scss" scoped>
.jpeg {
  width: 100%;
  position: relative;
  > img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    border: 1px solid black;
  }
  img:nth-child(1) {
    left: 50%;
  }
}
</style>

