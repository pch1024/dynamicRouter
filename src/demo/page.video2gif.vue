<template>
  <div class="page_video2gif">
    <a-upload-dragger name="file" :multiple="true" :beforeUpload="beforeUpload">
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">请将素材视频拖拽到这里上车</p>
      <p class="ant-upload-hint">
        建议： MP4格式，时长小于20秒，分辨率小于300*300，单文件
      </p>
    </a-upload-dragger>
    <div class="videoBox">
      <div class="item">
        <p>视频：</p>
        <video
          ref="video"
          id="uploadVideo"
          :src="videoSrc"
          v-on:loadeddata="onVideoLoad"
          width="300"
          height="150"
        ></video>
      </div>
      <div class="item">
        <p>视频参数：</p>
        <p>视频文件名： {{ video.name || "-" }}</p>
        <p>视频分辨率： {{ video.ratio || "-" }}</p>
        <p>视频总时长： {{ video.duration || "-" }}秒</p>
        <p>预计Gif FPS：{{ video.FPS }}帧/s</p>
        <p>
          预计生产帧：
          {{ `${Math.floor((video.duration * 1000) / (1000 / 4))}帧` }}
        </p>
        <p>该文件大小： {{ video.size || "-" }}MB</p>
        <p>添加字幕数： {{ video.word.length }}</p>
      </div>
      <div class="item">
        <p>Gif 预览：</p>
        <canvas width="300" height="150" ref="canvas"></canvas>
      </div>
      <div class="item">
        <p>Gif 文件：</p>
        <img width="300" height="150" ref="gif" />
      </div>
    </div>
    <div class="opts" v-if="video.duration">
      <a-row
        v-for="(item, index) in video.word"
        :key="index"
        style="margin:5px 0"
      >
        <a-col class="common" :span="2">
          设置字幕时间:
        </a-col>
        <a-col :span="10">
          <a-slider
            range
            :defaultValue="[item.start, item.stop]"
            @change="val => onSliderChange(index, val)"
            :max="Math.floor(video.duration)"
          />
        </a-col>
        <a-col :span="2" class="common textCenter">
          {{ item.start }}-{{ item.stop }}s
        </a-col>
        <a-col :span="8">
          <a-input class="common" v-model="item.text" placeholder="添加字幕" />
        </a-col>
        <a-col :span="2" style="padding-left:15px">
          <a-button
            :loading="loading"
            type="danger"
            @click="delWord(index)"
            class="common"
            :disabled="index === 0"
          >
            删除字幕
          </a-button>
        </a-col>
      </a-row>

      <a-button
        :loading="loading"
        type="dashed"
        style="width:100%"
        @click="addWord"
        class="common"
      >
        添加字幕
      </a-button>
      <br />
      <br />
      <a-button
        :loading="loading"
        type="dashed"
        style="width:100%"
        @click="checkWordTime"
        class="common"
      >
        检查字幕/生成Gif
      </a-button>
    </div>
  </div>
</template>
<script>
import { debuglog } from "util";
import gifshot from "gifshot";
export default {
  data() {
    let word = [
      {
        text: "程序员",
        start: 3,
        stop: 4
      },
      {
        text: "你也想下班？",
        start: 4,
        stop: 5
      },
      {
        text: "没钱就老老实实给我搬砖",
        start: 5,
        stop: 10
      },
      {
        text: "年轻",
        start: 10,
        stop: 11
      },
      {
        text: "你是老板就了不起啊？",
        start: 11,
        stop: 13
      },
      {
        text: "对，就是了不起",
        start: 14,
        stop: 16
      },
      {
        text: "产品，再给他加两百个需求",
        start: 18,
        stop: 20
      }
    ];
    return {
      file: null,
      loading: false,
      video: {
        name: null,
        type: null,
        src: null,
        size: null,
        duration: null,
        ratio: null,
        FPS: 4,
        word: word
      },
      videoSrc: null
    };
  },
  methods: {
    onSliderChange(index, val) {
      this.video.word[index].start = val[0];
      this.video.word[index].stop = val[1];
      this.$refs.video.currentTime = val[0];
    },
    delWord(i) {
      if (this.video.duration) {
        this.video.word.splice(i, 1);
      }
    },
    addWord() {
      if (this.video.duration) {
        this.video.word.push({
          text: `Hello World`,
          start: 0,
          stop: Math.floor(this.video.duration)
        });
      }
    },
    beforeUpload(file) {
      this.file = file;
      this.video.name = file.name;
      this.video.size = (file.size / 1024 / 1024).toFixed(2);
      this.video.type = file.type;
      // console.log(file);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => (this.videoSrc = e.target.result);
      return false;
    },
    onVideoLoad(e) {
      console.log("onVideoLoad", e);
      this.video.duration = e.target.duration;
      this.video.ratio = `${e.target.width}*${e.target.height}`;
      this.addWord();
    },
    checkWordTime() {
      let word = this.video.word;
      let err = [];
      for (let index = 0; index < word.length; index++) {
        let start = word[index].start;
        let bools = word.map((item, i) => {
          if (index === i) return false;
          return start >= item.start && start < item.stop;
        });
        // debugger;
        if (bools.indexOf(true) !== -1) err.push(index);
      }
      if (err.length > 0) {
        return alert(`第${err.join("、")}个字幕与其他字幕发生冲突`);
      }
      // 没有错误 生成gif
      this.video2img();
    },
    video2img() {
      this.loading = true;
      let images = [];
      let timer = null;
      let tt = 1000 / this.video.FPS;
      let canvas = this.$refs.canvas;
      let video = this.$refs.video;
      let [ww, hh] = [video.width, video.height];
      canvas.width = ww;
      canvas.height = hh;
      let ctx = canvas.getContext("2d");

      let filterWord = time => {
        let word = this.video.word;
        let i = word.findIndex(item => {
          return time >= item.start && time < item.stop;
        });
        return i === -1 ? " " : word[i].text;
      };

      let savaImg = () => {
        timer = setInterval(() => {
          // console.log(video.currentTime);
          let txt = filterWord(video.currentTime);
          ctx.drawImage(video, 0, 0, ww, hh);
          ctx.font = "20px Microsoft JhengHei"; //设置文本大小 + 字体

          ctx.fillStyle = "#ffffff"; //设置文本颜色
          ctx.textAlign = "center"; //设置文本对齐
          ctx.fillText(txt, 150, 150); //绘制文本 + 文本 x 和 y 的坐标位置
          images.push(canvas.toDataURL("image/jpeg"));
        }, tt);
      };
      let download = (base64, callback) => {
        let dataURL = base64.split(",")[1];
        setTimeout(function() {
          let binStr = atob(dataURL);
          let len = binStr.length;
          let arr = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }
          callback(new Blob([arr], { type: "image/gif" }));
        });
      };

      let saveGif = () => {
        gifshot.createGIF(
          {
            gifWidth: ww,
            gifHeight: hh,
            images: images
          },
          obj => {
            if (!obj.error) {
              download(obj.image, b => {
                this.$refs.gif.src = window.URL.createObjectURL(b);
                this.loading = false;
              });
            }
          }
        );
      };

      let reset = () => {
        clearInterval(timer);
        video.removeEventListener("play", savaImg, false);
        saveGif();
      };

      video.addEventListener("play", savaImg, false);
      video.addEventListener("ended", reset, false);
      video.play();
    }
  }
};
</script>
<style lang="scss" scoped>
.page_video2gif {
  .videoBox {
    width: 100%;
    text-align: center;
    display: flex;
    flex-flow: row nowrap;
    > div {
      text-align: left;
      border: 1px dashed #efefef;
      margin: 15px 0;
      display: inline-flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      &:nth-child(1),
      &:nth-child(3) {
        width: 300px;
        flex-grow: 0;
        flex-shrink: 0;
      }
      &:nth-child(2) {
        align-items: flex-start;
        padding: 15px;
        flex-grow: 1;
        flex-shrink: 1;
        p {
          margin: 0;
          padding: 0;
        }
      }
    }
  }
  .common {
    padding-left: 10px;
    height: 36px;
    line-height: 36px;
  }
}
</style>
