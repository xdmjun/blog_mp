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
        <swiper-item @click="jump(item.name)">
          <image :src="item.src" lazy-load="true" class="slide-image" mode="aspectFit" />
        </swiper-item>
      </div>
    </swiper>
    <div class="quick-nav-box">
      <div class="nav-item" @click="navTo(1)">
        <image class="nav-icon" src="/static/images/cloud.png" mode="aspectFit" />
        <div class="nav-name">标签云</div>
      </div>
      <div class="nav-item" @click="navTo(2)">
        <image class="nav-icon" src="/static/images/fire.png" mode="aspectFit" />
        <div class="nav-name">热门文章</div>
      </div>
      <div class="nav-item" @click="navTo(3)">
        <image class="nav-icon" src="/static/images/mygzh.png" mode="aspectFit" />
        <div class="nav-name">公号文章</div>
      </div>
      <div class="nav-item" @click="navTo(4)">
        <image class="nav-icon" src="/static/images/p-note.png" mode="aspectFit" />
        <div class="nav-name">产品笔记</div>
      </div>
    </div>
    <div class="blogs-box">
      <div class="title">最新博客</div>
      <i-cell-group>
        <i-cell
          v-for="(blog,index) in blogs"
          :key="index"
          :title="blog.title"
          :label="blog.desc"
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
          <!-- <div>{{blog.desc}}</div> -->
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
      bannerList: [{ src: 'http://xuedingmiao.com/images/gitcmd.png', name: '' }],
    }
  },
  methods: {
    navTo(id) {
      var url = ''
      switch (id) {
        case 1:
          url = '/pages/tags/main'
          break
        case 2:
          url = '/pages/rec_blog/main'
          break
        case 3:
          url = '/pages/wx_article/main'
          break
        case 4:
          url = '/pages/search_blog/main?key=' + encodeURIComponent('产品')
          break
        default:
      }
      mpvue.navigateTo({
        url: url,
      })
    },
    jump(name) {
      if (name !== '') {
        mpvue.navigateTo({
          url: '/pages/blog/main?name=' + name,
        })
      }
    },
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
    wx.cloud
      .callFunction({
        name: 'banner',
      })
      .then(res => {
        this.bannerList = res.result
      })
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
  .quick-nav-box {
    display: flex;
    justify-content: center;
    align-content: center;
    padding: 10px 40px 15px 40px;
    border-bottom: 1px solid #efefef;
    .nav-item {
      flex: 1;
      text-align: center;
      .nav-icon {
        width: 40px;
        height: 40px;
      }
      .nav-name {
        margin-top: 2px;
        text-align: center;
        color: #757575;
        font-size: 13px;
      }
      &:first-child {
        .nav-icon {
          width: 57px;
        }
      }
    }
  }

  .blogs-box {
    padding: 5px;
    .title {
      font-size: 16px;
      font-weight: bold;
      padding: 7px 15px 5px 15px;
    }
    .rec {
      width: 14px;
      height: 15px;
      position: relative;
      top: -12px;
    }
  }
}
</style>
