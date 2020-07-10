<template>
  <div class="main">
    <div class="blog" v-for="(blog,index) in blogs" :key="index">
      <l-card
        type="primary"
        :l-class="blog.recommend?'rec-card':''"
        :image="blog.img!=''?'http://xuedingmiao.com'+blog.img:''"
        :title="blog.title"
        :position="index%2==0?'right':'left'"
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
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
  },
  onShareAppMessage() {
    return {
      title: '薛定喵君给您推荐了一批博客文章',
      path: '/pages/rec_blog/main',
      imageUrl: 'http://tiaocaoer.com/images/site_icon.png',
    }
  },
  onShareTimeline() {
    return {
      title: '薛定喵君给您推荐了一批博客文章',
      path: '/pages/rec_blog/main',
      imageUrl: 'http://tiaocaoer.com/images/site_icon.png',
    }
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
