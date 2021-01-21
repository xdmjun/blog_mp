<template>
  <div class="main">
    <div class="tip">{{ useAuth == 1 ? '您正在授权登录网站' : '您已成功登录' }}</div>
    <i-button v-if="useAuth == 1" open-type="getUserInfo" @getuserinfo="getUserInfo" type="success" shape="circle">{{
      authed == 1 ? '已成功登录' : '授权'
    }}</i-button>
    <i-button v-else type="info" shape="circle" @click="know">知道了</i-button>
    <navigator v-if="authed == 1" class="exit" open-type="exit" target="miniProgram">退出</navigator>
  </div>
</template>

<script>
export default {
  data() {
    return {
      useAuth: 0,
      openid: '',
      uuid: '',
      authed: 0,
    }
  },
  methods: {
    doLogin(userInfo) {
      wx.cloud
        .callFunction({
          name: 'openid_login',
          data: {
            uuid: this.uuid,
            userInfo: userInfo,
          },
        })
        .then(res => {
          this.authed = 1
        })
    },
    know() {
      mpvue.switchTab({
        url: '/pages/index/main',
      })
    },
    getUserInfo(e) {
      const userInfo = e.target.userInfo
      this.doLogin(userInfo)
    },
  },
  onShow() {},
  onReachBottom() {},
  onShareAppMessage() {},
  onShareTimeline() {},
  mounted() {},
  onLoad(options) {
    let params = []
    if (options.scene) {
      params = decodeURIComponent(options.scene).split('&')
      this.uuid = params[0].split('=')[1]
      this.useAuth = params[1].split('=')[1]
    } else {
      this.uuid = options.uuid
      this.useAuth = options.useAuth
    }

    if (+this.useAuth === 0) {
      wx.cloud.callFunction({
        name: 'openid_login',
        data: {
          uuid: this.uuid,
        },
      })
    }
  },
}
</script>

<style lang="less" scoped>
page {
  background: #efefef;
  height: 100vh;
}
.main {
  padding-top: 150px;
  text-align: center;
  .tip {
    color: #757575;
    margin-bottom: 50px;
  }
  .exit {
    border-radius: 44px;
    color: #fff;
    background: #2db7f5;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    white-space: nowrap;
    user-select: none;
    font-size: 14px;
    border: 0 !important;
    height: 44px;
    line-height: 44px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    margin: 0 13px;
  }
}
</style>
