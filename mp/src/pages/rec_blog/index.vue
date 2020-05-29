<template>
  <div class="main">
    <i-cell-group>
      <i-cell
        v-for="(blog,index) in blogs"
        :key="index"
        :title="blog.title"
        is-link
        @click="toDetail(blog.file_name)"
      >
        <image
          v-if="blog.recommend"
          class="rec"
          src="/static/images/recommend.png"
          mode="aspectFit"
          slot="icon"
        />
      </i-cell>
    </i-cell-group>
    <i-load-more :loading="loading" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      blogs: [],
    }
  },
  methods: {
    toDetail(name) {
      mpvue.navigateTo({
        url: '/pages/blog/main?name=' + name,
      })
    },
    getList() {
      this.loading = true
      wx.cloud
        .callFunction({
          name: 'recblogs',
          data: {},
        })
        .then(res => {
          this.loading = false
          let rs = JSON.parse(res.result)
          if (rs.data.length === 0) {
            this.haveMore = false
          } else {
            this.blogs = this.blogs.concat(...rs.data)
          }
        })
    },
  },
  onShow() {},
  onLoad() {
    this.getList()
  },
  mounted() {
    wx.showShareMenu()
  },
  onReachBottom() {},
  onUnload() {},
}
</script>

<style lang="less" scoped>
page {
  background: #f7f4f7;
}
.main {
  .rec {
    width: 14px;
    height: 15px;
    margin-bottom: -2px;
  }
}
</style>
