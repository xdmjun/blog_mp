<template>
  <div class="main">
    <div class="blog" v-for="(blog,index) in blogs" :key="index">
      <l-card
        type="cover"
        :l-class="blog.recommend?'rec-card':''"
        :image="blog.img!=''?blog.img:''"
        :title="blog.title"
        :plaintext="blog.img==''"
        @click="toDetail(blog.file_name)"
      >
        <view class="content">{{blog.desc}}</view>
      </l-card>
    </div>
    <i-load-more v-if="loading" :loading="loading" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      loading: true,
      key: '',
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
          name: 'search',
          data: { key: encodeURIComponent(this.key), page: this.page },
        })
        .then(res => {
          this.loading = false
          let rs = JSON.parse(res.result)
          if (rs.data.length === 0) {
            this.haveMore = false
          } else {
            rs.data.map((blog, i) => {
              if (blog.img.indexOf('xxx.jpg') !== -1) {
                blog.img = ''
              }
              if (blog.img !== '' && blog.img.indexOf('http') === -1) {
                blog.img = 'http://xuedingmiao.com' + blog.img
              }
            })
            this.blogs = this.blogs.concat(...rs.data)
          }
        })
    },
  },
  onShow() {},
  onLoad(options) {
    this.key = decodeURIComponent(options.key || '产品')
    mpvue.setNavigationBarTitle({ title: this.key + '笔记' })
    this.getList()
  },
  mounted() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
  },
  onShareAppMessage() {
    return {
      title: '薛定喵君的' + this.key + '笔记',
      path: '/pages/search_blog/main?key=' + encodeURIComponent(this.key),
      imageUrl: 'http://tiaocaoer.com/images/site_icon.png',
    }
  },
  onShareTimeline() {
    return {
      title: '薛定喵君的' + this.key + '笔记',
      path: '/pages/search_blog/main?key=' + encodeURIComponent(this.key),
      imageUrl: 'http://tiaocaoer.com/images/site_icon.png',
    }
  },
  onReachBottom() {
    // this.page++
    // this.getList()
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data())
  },
}
</script>

<style lang="less" scoped>
page {
  background: #f7f4f7;
}
.main {
  padding-top: 10px;
  .rec {
    width: 14px;
    height: 15px;
    margin-bottom: -2px;
  }
  .blog {
    margin-bottom: 10px;
    .content {
      word-break: break-all;
      font-size: 28rpx;
      color: #999;
    }
    /deep/ .rec-card {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      &::after {
        position: absolute;
        left: -14px;
        top: -14px;
        content: '荐';
        display: inline-block;
        transform: rotate(-45deg);
        background: red;
        width: 60rpx;
        height: 60rpx;
        color: #fff;
        font-size: 12px;
        line-height: 45px;
        text-align: center;
      }
    }
  }
}
</style>
