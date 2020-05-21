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
    </div>
  </div>
</template>

<script>
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
    }
  },
  methods: {},
  onShow() {},
  onReachBottom() {},
  onShareAppMessage() {
    return {
      title: '薛定喵君的博客',
      path: '/pages/index/index',
      imageUrl: 'http://cdn.skyvow.cn/logo.png',
    }
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
