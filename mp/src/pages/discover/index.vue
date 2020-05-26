<template>
  <div class="main">
    <div class="nav-box">
      <div class="module flex" @click="navTo(1)">
        <image class="module-pic" src="/static/images/cloud.png" mode="aspectFit" />
        <div class="info">
          <div class="title">标签云</div>
          <div class="desc">博客网站标签云</div>
        </div>
      </div>
      <div class="module flex" @click="navTo(2)">
        <image class="module-pic" src="/static/images/mygzh.png" mode="aspectFit" />
        <div class="info">
          <div class="title">公众号文章</div>
          <div class="desc">同步极客公众号历史文章</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    navTo(id) {
      var url = ''
      switch (id) {
        case 1:
          url = '/pages/tags/main'
          break
        case 2:
          url = '/pages/wx_article/main'
          break
        default:
      }
      mpvue.navigateTo({
        url: url,
      })
    },
  },
  onShow() {},
  onReachBottom() {},
  onShareAppMessage() {},
  mounted() {
    wx.showShareMenu()
  },
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  padding: 0 10px;
  .nav-box {
    margin-top: 30rpx;
    .module {
      margin: 0 40rpx 40rpx 40rpx;
      box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, 0.1);
      border-radius: 16rpx;
      align-content: flex-start;
      padding: 40rpx;
      .module-pic {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
      }
      .info {
        font-size: 24rpx;
        color: #757575;
        margin-left: 30rpx;
        .title {
          color: #212121;
          font-size: 28rpx;
          font-weight: bold;
          margin-bottom: 25rpx;
        }
      }
    }
  }
}
</style>
