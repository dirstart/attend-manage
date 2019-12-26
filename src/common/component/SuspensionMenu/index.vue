<template>
  <div class="picCenter">
    <el-tooltip placement="bottom-start" effect="light" class="tooltip" popper-class="shadowTooltip">
      <!-- 轨迹分析 -->
      <div v-if="faceTrackAnalysis">
        <div class="pic-box" v-if="['0','3'].includes(SuspensionData.passType+'')">
          <template v-if="SuspensionData.similarity">
            <img-show width="48px" height="48px" txt="暂无图片" :img-src="picData[SuspensionData.personId]" />
          </template>
          <div v-if="SuspensionData.similarity" class="similarity">{{Math.floor(SuspensionData.similarity * 10000) / 100}}%</div>
          <img-show width="48px" height="48px" txt="暂无图片" :img-src="SuspensionData.snapImgPath" />
        </div>
      </div>
      <!-- 人行记录 -->
      <div v-else-if="passRecord" class="pic-box">
        <img-show class="pic" width="48px" height="48px" text="暂无照片" :img-src="SuspensionData.snapImgPath" />
        <span class="similarity" v-if="SuspensionData.similarity">{{SuspensionData.similarity | percentage}}%</span>
        <span v-else style="color:#a5a5a5">未知</span>
        <identity-image class="pic" width="48px" height="48px" :personId="SuspensionData.personId" />
      </div>
      <img-show v-else class="pic" :width="width" :height="height" text="暂无照片" :img-src="SuspensionData.imgShow || SuspensionData.snapImgPath" />
      <div slot="content" class="btns">
        <el-button size="mini" @click="onFaceUser(SuspensionData.personId || SuspensionData.id)">人物画像</el-button>
        <em/>
        <!-- <el-button size="mini" @click="onPictureDialog(SuspensionData.snapImgPath, 'togetherAnalysis', true)">同行分析</el-button><em/> -->
        <el-button size="mini" @click="onPictureDialog(SuspensionData.imgShow || SuspensionData.snapImgPath, 'togetherAnalysis', true)" v-if="SuspensionData.imgShow || SuspensionData.snapImgPath">同行分析</el-button>
        <em/>
        <span v-if="!faceTrackAnalysis">
          <el-button size="mini" @click="onPictureDialog(SuspensionData.imgShow || SuspensionData.snapImgPath, 'faceTrackAnalysis', false)" v-if="SuspensionData.imgShow || SuspensionData.snapImgPath">轨迹分析</el-button>
          <em/>
        </span>
        <el-button size="mini" @click="onPictureDialog(SuspensionData.imgShow || SuspensionData.snapImgPath, 'foothold', false)" v-if="SuspensionData.imgShow || SuspensionData.snapImgPath">落脚点分析</el-button>
        <em/>
        <el-button size="mini" @click="onPlayVideo(SuspensionData)" v-if="SuspensionData.isReqVideo || SuspensionData.videoUrl || SuspensionData.shiLianCloudPlayUrl">抓拍视频</el-button>
      </div>
    </el-tooltip>
    <!-- 以图搜图 - 弹窗 -->
    <picture-layer :is-open.sync="isPictureDialog" :data="trackAnalysis" :single="single" :jumpData="jumpData" />

    <video-play :is-open.sync="isVideoDialog" ref="videoPlay" :videoData="videoData" :type="1" :watting="isWaiting" />
  </div>
</template>

<script>
import { getReqVideo, getPlayVideo } from "@/api/video";

export default {
  props: {
    SuspensionData: {
      type: Object,
      required: false
    },
    faceTrackAnalysis: {
      type: Boolean,
      default: false
    },
    passRecord: {
      type: Boolean,
      default: false
    },
    picData: {
      type: Object,
    },
    width: {
      default: "48px",
      type: String
    },
    height: {
      default: "48px",
      type: String
    },
  },
  data() {
    return {
      isPictureDialog: false,
      trackAnalysis: null,
      single: false,
      isSuspensionMenu: false,
      jumpData: {
        jump: false,
        jumpUrl: String
      },
      isBgDialog: false, // 控制背景图显示

      // 视频
      isVideoDialog: false,
      videoData: null,
      isWaiting: 0, //0：初始化请求视频 1：请求中视频 2：该页面请求后  播放视频

    };
  },
  methods: {

    //轨迹 落脚点 分析
    onPictureDialog(url, strUrl, boolean) {
      this.trackAnalysis = {
        keyword: "",
        imgBase64: url,
        threshold: 0.6,
        top: 10,
        libraryNums: null
      };
      this.jumpData = {
        jump: true,
        jumpUrl: strUrl
      }
      this.single = boolean;
      this.isPictureDialog = true;
      this.$emit('isDialog', false)
    },
    // 人脸抓拍
    // onFaceSnap(name) {
    //   if (name) {
    //     this.$router.push({
    //       name: "faceSnapping",
    //       params: { data: name }
    //     });
    //     this.isDetailsDialog = false;
    //   }
    // },
    // 人物画像
    onFaceUser(id) {
      if (id) {
        this.$router.push({
          path: "/faceUser",
          query: { queryId: id }
        });
      }
      this.$emit('isDialog', false)
    },
    // 视频
    onPlayVideo(data) {
      this.videoData = data;
      if (this.videoData.shiLianCloudPlayFlag === 1 || this.videoData.snapId) {
        getPlayVideo(this.videoData.refObjId || this.videoData.snapId, true).then(res => {
          if (res.data.ret === 0 && res.data.url) {
            this.$set(this.videoData, "videoUrl", res.data.url);
            this.isVideoDialog = true;
          }
        });
      } else {
        this.isVideoDialog = true;
        this.isWaiting = 1;
        this.onReqVideo();
      }
    },
    async onReqVideo() {
      await this.init(false);
      if (this.isWaiting !== 2) {
        await this.waitRequest();
      }
    },
    waitRequest() {
      setTimeout(() => {
        this.init(true);
      }, 3000)
    },
    init(val) {
      getReqVideo(this.videoData.refObjId).then(res => {
        if (res.data.ret === -1) {
          this.$notify({
            title: "提示",
            dangerouslyUseHTMLString: true,
            message: '视频请求失败，请联系管理员',
            type: "error",
            duration: 5000
          });
          this.isWaiting = 0
        } else if (res.data.ret === 0 && res.data.url) {
          this.isWaiting = 1;
          if (val) {
            this.isWaiting = 0;
          }
        } else if (res.data.ret === 1) {
          getPlayVideo(this.videoData.refObjId).then(res => {
            if (res.data.ret === 0 && res.data.url) {
              this.$set(this.videoData, "videoUrl", res.data.url);
              this.$refs.videoPlay.playVideo();
              this.isWaiting = 2;
            }
          });
        }
      })
    },
    //同行跳转
    // onTogetherAnalysis(id) {
    //   this.isDetailsDialog = false;
    //   this.$router.push({
    //     path: "/application/togetherAnalysis",
    //     query: {
    //       personId: id
    //     }
    //   });
    // },
  },
};
</script>
<style lang="scss">
.picCenter {
  text-align: center;
  .tooltip {
    margin: 0 auto;
    border: 0;
    .pic {
      position: relative;
      width: auto;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
      img {
        display: block;
      }
    }
  }
  .pic-box {
    display: flex;
    justify-content: space-around;
    .similarity {
      display: inline-block;
      min-width: 55px;
      line-height: 48px;
      vertical-align: top;
    }
  }
}
.shadowTooltip {
  box-shadow: 0 0 8px rgba($color: #000000, $alpha: 0.2);
  border: none !important;
  .popper__arrow {
    border: none !important;
  }
}
</style>