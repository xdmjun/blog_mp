<template>
  <div class="main">
    <div class="container">
      <div class="userinfo" data-clipboard="userInfo.url" bindtap="clipboard">
        <image class="userinfo-avatar" :src="userInfo.avatarUrl" background-size="cover" />
        <text class="userinfo-nickname">{{ userInfo.nickname }}</text>
        <div class="desc">{{ userInfo.desc }}</div>
      </div>
    </div>
    <i-cell @click="toDetail" title="关于我" is-link>
      <i-icon type="mine" size="24" color="#80848f" slot="icon" />
    </i-cell>
    <i-cell @click="subscribe" :title="subscribed?'已订阅':'订阅更新'" is-link>
      <i-icon type="like" size="24" color="#80848f" slot="icon" />
    </i-cell>
    <i-cell title=" " is-link>
      <i-icon type="group" size="24" color="#80848f" slot="icon" />
      <button class="my-btn" open-type="contact">前端交流群</button>
    </i-cell>
    <i-cell title=" " is-link>
      <i-icon type="interactive" size="24" color="#80848f" slot="icon" />
      <button class="my-btn" open-type="contact">微信公众号</button>
    </i-cell>
    <i-toast id="toast" />
  </div>
</template>

<script>
import { $Toast } from '../../../static/iview/base/index'
export default {
  data() {
    return {
      userInfo: {
        avatarUrl: 'http://tiaocaoer.com/images/site_icon.png',
        nickname: '薛定喵君',
        desc: '会说日语的前端开发者',
        url: 'https://github.com/xuedingmiaojun',
      },
      wxghUrl: '/static/images/qrcode_for_xdmj.jpg',
      subscribed: 0,
    }
  },
  methods: {
    toDetail() {
      wx.setStorageSync(
        'currentUrl',
        'http://mp.weixin.qq.com/s?__biz=MzI3OTA0NDQ3NQ==&mid=100000261&idx=1&sn=6340b8190b28c062c574a93b35801442&chksm=6b4c8a115c3b030708296e071fe89a3045ba1e88418b3dccd9cf1bfbd36627708225cedb631a#rd',
      )
      mpvue.navigateTo({
        url: '/pages/article_detail/main?title=' + encodeURI('关于我'),
      })
    },
    subscribe() {
      let that = this
      if (that.subscribed) {
        return
      }
      let tmplIds = ['BW2SWdM8-9Et4q0gdncZUdQlnZ0Ai4Ikhwdp4rNJ9AY']
      wx.requestSubscribeMessage({
        tmplIds: tmplIds,
        success(res) {
          if (res['BW2SWdM8-9Et4q0gdncZUdQlnZ0Ai4Ikhwdp4rNJ9AY'] !== 'reject') {
            wx.cloud
              .callFunction({
                name: 'subscribe',
                data: {
                  templateId: tmplIds[0],
                },
              })
              .then(() => {
                that.subscribed = 1
                $Toast({
                  content: '订阅成功',
                  type: 'success',
                })
              })
              .catch(() => {
                that.subscribed = 0
                $Toast({
                  content: '订阅失败',
                  type: 'error',
                })
              })
          }
        },
      })
    },
  },
  onShow() {},
  onReachBottom() {},
  onShareAppMessage() {},
  mounted() {
    wx.showShareMenu()
  },
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.my-btn {
  color: inherit;
  line-height: 24px;
  font-size: inherit;
  text-align: inherit;
  background-color: transparent;
  padding-left: 0;
  &::after {
    display: none;
  }
}
.main {
  padding: 0 10px;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 60rpx 0;
    box-sizing: border-box;
    text-align: center;

    .userinfo {
      display: flex;
      flex-direction: column;
      align-items: center;
      .userinfo-avatar {
        width: 138rpx;
        height: 138rpx;
        margin: 20rpx;
        border-radius: 50%;
      }
      .userinfo-nickname {
        color: rgba(0, 0, 0, 0.85);
      }
    }
    .desc {
      color: rgba(0, 0, 0, 0.45);
    }
    .item {
      margin-top: 20rpx;
      text-align: center;
      .title-box {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        .title {
          color: #4a4a4a;
          font-size: 28rpx;
          .icon {
            margin-right: 5px;
          }
        }
      }
    }
  }

  .wx-info {
    margin-top: 10px;
    .wxgh {
      width: 168px;
      height: 168px;
    }
  }
}
</style>
