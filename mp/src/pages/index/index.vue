<template>
  <div class="main">
    <swiper
      class="banner"
      indicator-dots="true"
      autoplay="true"
      interval="5000"
      duration="300"
      circular="true"
    >
      <div v-for="(item,i) in bannerList" :key="i">
        <swiper-item>
          <image :src="item" lazy-load="true" class="slide-image" mode="aspectFit" />
        </swiper-item>
      </div>
    </swiper>
    <div class="blogs-box">
      <div class="title">最新博客</div>
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
          <!-- <i-icon v-if="blog.recommend" color="red" type="praise_fill" slot="icon" /> -->
        </i-cell>
      </i-cell-group>
    </div>
    <i-load-more :tip="haveMore?'':'没了没了，别划了'" :loading="loading" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      blogs: [],
      page: 1,
      haveMore: true,
      loading: false,
      bannerList: [
        'http://xuedingmiao.com/images/gitcmd.png',
        'http://xuedingmiao.com/images/bm1.png',
        'http://xuedingmiao.com/images/dau-value.png',
        'http://xuedingmiao.com/images/product-dev-rule.png',
        'http://xuedingmiao.com/images/company-change.png',
      ],
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
          name: 'blogs',
          data: { page: this.page },
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
  onShareAppMessage() {},
  onLoad() {
    this.getList()
  },
  onReachBottom() {
    // 下拉加载
    this.page++
    this.getList()
  },
  mounted() {
    wx.showShareMenu()
  },
  onShow() {},
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  .banner {
    width: 100%;
    margin-bottom: 5px;
    .slide-image {
      width: 100%;
    }
  }
  .blogs-box {
    padding: 0 5px;
    .title {
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #efefef;
      padding: 5px 15px;
    }
    .rec {
      width: 14px;
      height: 15px;
    }
  }
}
</style>
