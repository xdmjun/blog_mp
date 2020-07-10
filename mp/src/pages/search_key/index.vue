<template>
  <div class="main">
    <div class="search-box">
      <l-search-bar
        shape="circle"
        :value="key"
        @linconfirm="toDetail"
        placeholder=" "
        :show-cancel="false"
      />
    </div>
    <div class="search-cont-box" v-if="searchHistory.length">
      <div class="title-box">
        <span>最近搜索</span>
        <i-icon type="delete" size="20" @click="clearHistory" color="#80848f" />
      </div>
      <div class="sale-button-box">
        <div class="seconds-kill-li" v-for="(keyword,index) in searchHistory" :key="index">
          <div @click="goSearch(keyword)" class="recent-button">{{keyword}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: '',
      searchHistory: [],
    }
  },
  methods: {
    toDetail(e) {
      let key = e.mp.detail.value
      this.searchHistory.push(key)
      mpvue.setStorageSync('searchHistory', this.searchHistory)
      mpvue.navigateTo({
        url: '/pages/search_blog/main?key=' + encodeURI(key),
      })
    },
    clearHistory() {
      this.searchHistory = []
      mpvue.removeStorageSync('searchHistory')
    },
    goSearch(key) {
      mpvue.navigateTo({
        url: '/pages/search_blog/main?key=' + encodeURI(key),
      })
    },
  },
  onShow() {
    this.searchHistory = mpvue.getStorageSync('searchHistory') || []
  },
  onReachBottom() {},
  onShareAppMessage() {},
  onShareTimeline() {},
  mounted() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
  },
  created() {},
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  padding: 0 10px;
  .search-box {
    margin-bottom: 10px;
  }
  .search-cont-box {
    padding: 0 10px;
    .title-box {
      font-size: 12px;
      padding: 15px 0 10px 0;
      color: #777;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sale-button-box {
      padding: 10px 0;
      overflow: hidden;
      .seconds-kill-li {
        width: 30%;
        float: left;
        margin-right: 2%;
        .recent-button {
          background: #fff;
          padding: 10rpx;
          border-radius: 50px;
          justify-content: center;
          text-align: center;
          font-size: 14px;
          color: #757575;
          border: 1px solid #eee;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          height: 30rpx;
          line-height: 30rpx;
        }
      }
    }
  }
}
</style>
