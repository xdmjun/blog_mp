<template>
  <div class="main">
    <div class="container">
      <div class="userinfo" data-clipboard="userInfo.url" bindtap="clipboard">
        <image class="userinfo-avatar" :src="userInfo.avatarUrl" background-size="cover" />
        <text class="userinfo-nickname">{{ userInfo.nickname }}</text>
        <div class="userinfo-desc">{{ userInfo.desc }}</div>
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
      }
    }
  },
  methods: {

  },
  onShow() {

  },
  onReachBottom() {

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
        width: 128rpx;
        height: 128rpx;
        margin: 20rpx;
        border-radius: 50%;
      }

      .userinfo-nickname {
        color: rgba(0, 0, 0, 0.85);
      }

      .userinfo-desc {
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}
</style>
