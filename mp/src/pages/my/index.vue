<template>
  <div class="main">
    <div class="container">
      <div class="userinfo" data-clipboard="userInfo.url" bindtap="clipboard">
        <image class="userinfo-avatar" :src="userInfo.avatarUrl" background-size="cover" />
        <text class="userinfo-nickname">{{ userInfo.nickname }}</text>
        <div class="desc">{{ userInfo.desc }}</div>
      </div>
      <div class="desc">https://github.com/xuedingmiaojun/blog_mp</div>
      <div class="wx-info">
        <div class="desc">⬇微信公众号⬇</div>
        <image class="wxgh" :src="wxghUrl" background-size="cover" />
      </div>
      <div class="item" @tap="subscribe">
        <div class="title-box">
          <div class="title">
            <van-icon name="exchange" color="#409bff" class="icon" />
            {{subscribed?'已订阅':'订阅更新'}}
          </div>
        </div>
      </div>
    </div>
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
