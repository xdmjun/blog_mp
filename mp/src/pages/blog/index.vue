<template>
  <div class="main">
    <i-notice-bar icon="systemprompt" loop>更多内容请移步web端博客(xuedingmiao.com)</i-notice-bar>
    <i-alert v-if="showVideoTip" type="warning">文章包含外链视频，个人小程序不支持播放。如需观看，请移步Web端查看</i-alert>
    <div class="title">{{title}}</div>
    <div class="content">
      <wemark :md="content" link highlight type="wemark"></wemark>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      name: '',
      content: '',
      showVideoTip: false,
    }
  },
  methods: {},
  onLoad() {
    this.name = this.$root.$mp.query.name
    wx.cloud
      .callFunction({
        name: 'blog',
        data: { name: this.name },
      })
      .then(res => {
        let rs = JSON.parse(res.result)
        this.title = rs.data.title
        mpvue.setNavigationBarTitle({ title: this.title })
        this.content = rs.data.content.replace(/[\\]/g, '')
        if (this.content.indexOf('iframe') !== -1) {
          this.showVideoTip = true
        }
      })
  },
  onShow() {},
  onReachBottom() {},
  onShareAppMessage() {
    return {
      title: this.title,
      path: '/pages/blog/main?name=' + this.name,
      imageUrl: '',
    }
  },
  mounted() {
    wx.showShareMenu()
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data())
  },
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  .title {
    font-size: 16px;
    color: #4a4a4a;
    border-bottom: 1px solid #efefef;
    padding: 3px;
    text-align: center;
  }
  .content {
    padding: 0 15px;
  }
}
</style>
