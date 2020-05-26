<template>
  <div class="main">
    <web-view :src="url"></web-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      url: '',
    }
  },
  methods: {},
  onLoad() {
    this.title = this.$root.$mp.query.title
    mpvue.setNavigationBarTitle({ title: this.title })
  },
  onShow() {
    this.url = wx.getStorageSync('currentUrl')
  },
  onReachBottom() {},
  onShareAppMessage() {},
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
