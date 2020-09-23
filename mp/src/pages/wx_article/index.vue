<template>
  <div class="main">
    <i-cell-group>
      <i-cell
        v-for="(article,index) in wxarticles"
        :key="index"
        :title="article.title"
        is-link
        @click="toDetail(article)"
      ></i-cell>
    </i-cell-group>
    <i-load-more :loading="loading" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      name: '',
      loading: true,
      wxarticles: [],
    }
  },
  methods: {
    toDetail(article) {
      wx.setStorageSync('currentUrl', article.url)
      mpvue.navigateTo({
        url: '/pages/article_detail/main?title=' + article.title,
      })
    },
  },
  onLoad() {
    wx.cloud
      .callFunction({
        name: 'get_wx_token',
        data: {},
      })
      .then(res => {
        let data = JSON.parse(res.result)
        wx.cloud
          .callFunction({
            name: 'get_wxarticles',
            data: { token: data.data.token },
          })
          .then(res => {
            this.loading = false
            this.wxarticles = JSON.parse(res.result).data
          })
      })
  },
  onShow() {},
  onReachBottom() {},
  onShareAppMessage() {
    return {
      title: '极客之路最近的文章',
      path: '/pages/wx_article/main',
    }
  },
  onShareTimeline() {
    return {
      title: '极客之路最近的文章'
    }
  },
  mounted() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
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
