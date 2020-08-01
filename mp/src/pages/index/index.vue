<template>
  <div class="main">
    <official-account></official-account>
    <div class="search-box">
      <l-search-bar
        shape="circle"
        @linfocus="toSearch"
        ref="input"
        placeholder="小程序开发 Saas 教育新零售"
        :show-cancel="false"
      />
    </div>
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
    <div class="experts-box">
      <div class="section-info">
        <div class="title">精选文章</div>
      </div>
      <div class="experts-list">
        <div class="item" @click="navTo(5)">
          <div class="title">博主推荐</div>
          <div class="extra-info">反编译专题</div>
        </div>
        <div class="item" @click="toDetail('2b_product_trap.md')">
          <div class="title">产品见解</div>
          <div class="extra-info">2B产品销售驱动陷阱</div>
        </div>
      </div>
    </div>
    <div class="blogs-box">
      <div class="title">最新博客</div>
      <div class="card">
        <div class="left-blog">
          <div class="blog" v-for="(blog,index) in leftBlogs" :key="index">
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
        </div>
        <div class="right-blog">
          <div class="blog" v-for="(blog,index) in rightBlogs" :key="index">
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
        </div>
      </div>
    </div>
    <i-load-more :tip="haveMore?'':'没了没了，别划了'" :loading="loading" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      blogs: [],
      leftBlogs: [],
      rightBlogs: [],
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
        case 5:
          url = '/pages/search_blog/main?key=' + encodeURIComponent('反编译')
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
            let left = []
            let right = []
            rs.data.map((blog, i) => {
              if (blog.img.indexOf('xxx.jpg') !== -1) {
                blog.img = ''
              }
              if (blog.img !== '' && blog.img.indexOf('http') === -1) {
                blog.img = 'http://tiaocaoer.com' + blog.img
              }
              if ((i + 1) % 2 !== 0) {
                left.push(blog)
              } else {
                right.push(blog)
              }
            })
            this.leftBlogs = this.leftBlogs.concat(...left)
            this.rightBlogs = this.rightBlogs.concat(...right)
          }
        })
    },
    toSearch() {
      mpvue.navigateTo({
        url: '/pages/search_key/main',
      })
    },
  },
  onShareAppMessage() {},
  onShareTimeline() {},
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
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
  },
  onShow() {},
}
</script>
<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  .search-box {
    margin-bottom: 10px;
  }
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

  .experts-box {
    padding: 14px 16px 5px 16px;
    background: #fff;
    .section-info {
      display: flex;
      justify-content: center;
      align-content: center;
      font-size: 14px;
      align-items: center;
      .title {
        font-size: 18px;
        color: #404040;
        font-weight: bold;
      }
    }
    .experts-list {
      margin-top: 20px;
      display: flex;
      align-content: flex-start;
      .item {
        color: #fff;
        font-size: 14px;
        padding: 18px 0 16px 12px;
        flex: 1;
        .title {
          font-size: 16px;
        }
        .extra-info {
          margin-top: 4px;
        }
        &:nth-child(1) {
          background: linear-gradient(315deg, rgba(28, 206, 175, 1) 0%, rgba(0, 141, 152, 1) 100%);
          margin-right: 15px;
        }
        &:nth-child(2) {
          background: linear-gradient(48deg, rgba(255, 205, 80, 1) 0%, rgba(244, 166, 0, 1) 100%);
        }
      }
    }
  }

  .blogs-box {
    padding: 5px;
    .title {
      font-size: 18px;
      color: #404040;
      text-align: center;
      font-weight: bold;
      padding: 7px 15px 18px 15px;
    }
    .card {
      display: flex;
      .left-blog,
      .right-blog {
        width: 50%;
        flex-direction: column;
        .blog {
          margin-bottom: 15px;
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
    }
  }
}
</style>
