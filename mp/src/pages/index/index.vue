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
          <i-icon v-if="blog.recommend" color="red" type="praise_fill" slot="icon" />
        </i-cell>
      </i-cell-group>
    </div>
  </div>
</template>

<script>
// import { userOrg, getMyInvite, getInvite } from '@/api/api'
export default {
  data() {
    return {
      blogs: [],
      bannerList: [
        'http://xuedingmiao.com/images/bm1.png',
        'http://xuedingmiao.com/images/dau-value.png',
        'http://xuedingmiao.com/images/gitcmd.png',
      ],
    }
  },
  methods: {
    toDetail(name) {
      mpvue.navigateTo({
        url: '/pages/blog/main?name=' + name,
      })
    },
  },
  onShareAppMessage() {},
  onLoad() {
    wx.cloud
      .callFunction({
        name: 'blogs',
        data: {},
      })
      .then(res => {
        let rs = JSON.parse(res.result)
        this.blogs = rs.data
      })
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
      border-bottom: 1px solid #efefef;
      padding: 5px 15px;
    }
  }
}
</style>
