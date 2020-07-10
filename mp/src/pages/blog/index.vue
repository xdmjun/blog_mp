<template>
  <div class="main">
    <i-notice-bar icon="systemprompt" loop>更多内容请移步web端博客(xuedingmiao.com)</i-notice-bar>
    <official-account></official-account>
    <i-alert v-if="showVideoTip" type="warning">文章包含外链视频，个人小程序不支持播放。如需观看，请移步Web端查看</i-alert>
    <div class="title">{{title}}</div>
    <i-load-more v-if="loading" :loading="loading" />
    <div class="content">
      <wemark :md="content" link highlight type="wemark"></wemark>
    </div>
    <div>
      <view>
        <view class="posterBtn" @click="showSheet">分享</view>
        <view class="imagePathBox" :hidden="maskHidden == false">
          <image class="closeThis" src="/static/images/delete.png" @click="closeThisPostBtn" />
          <image :src="imagePath" class="shengcheng" />
          <button class="save" @click="save">保存相册</button>
          <button open-type="share" class="zfbtn">微信分享</button>
        </view>
        <view :hidden="maskHidden == false" class="mask"></view>
        <view class="canvas-box">
          <canvas
            style="width: 375px;height: 667px;position:fixed;top:9999px"
            canvas-id="mycanvas"
          />
        </view>
      </view>
    </div>
    <van-action-sheet
      :show="visible1"
      :actions="actions1"
      cancel-text="取消"
      @getuserinfo="getUser"
      @cancel="handleCancel1"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      name: '',
      content: '',
      qrcode: '',
      showVideoTip: false,
      userInfo: {},
      maskHidden: false,
      cardCode: '',
      avatarUrl: '',
      imagePath: '',
      currentTab: 0,
      cardImgSrc: '/static/images/card-tp02.jpg', // 背景图
      cardArr: [
        {
          id: '01',
          img: '/static/images/card-tp02.jpg',
        },
      ],
      visible1: false,
      actions1: [
        {
          name: '分享到朋友圈',
          openType: 'getUserInfo',
        },
        {
          name: '分享给朋友',
          icon: 'share',
          openType: 'share',
        },
      ],
      xcxCodeUrl: '',
      loading: true,
    }
  },
  methods: {
    getUser(e) {
      this.userInfo = e.mp.detail.userInfo
      this.formSubmit()
      this.visible1 = false
    },
    showSheet() {
      this.visible1 = true
    },
    handleCancel1() {
      this.visible1 = false
    },
    // 将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
    createNewImg() {
      var that = this
      var context = wx.createCanvasContext('mycanvas')
      context.setFillStyle('#ffffff') // 填充整体的色调#697fde  ffe200
      // 设置上部的图片 /images/gobg.png
      context.fillRect(0, 0, 375, 667)
      var path = that.cardImgSrc
      var path1 = that.cardCode
      // that.userInfo['avatarUrl']
      var path2 = that.userInfo['avatarUrl']

      context.drawImage(path, 48, 20, 280, 460)

      context.drawImage(path1, 230, 490, 100, 100)

      context.save()
      context.beginPath()
      context.arc(280, 541, 20, 0, 2 * Math.PI)
      context.clip()
      context.drawImage(path2, 260, 522, 40, 40)
      context.restore()

      // 绘制标语
      context.setFontSize(17)
      context.setFillStyle('red')
      context.fillText(that.userInfo['nickName'], 54, 530)
      context.stroke()

      // 绘制标语
      context.setFontSize(16)
      context.setFillStyle('#333333')
      context.fillText('邀请你阅读精彩文章', 54, 560)
      context.stroke()

      // 绘制提醒
      context.setFontSize(14)
      context.setFillStyle('#333333')
      context.setTextAlign('center')
      context.fillText('长按识别二维码', 185, 650)
      context.stroke()

      context.draw()
      // 将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function(res) {
            var tempFilePath = res.tempFilePath
            that.imagePath = tempFilePath
            that.canvasHidden = true
          },
          fail: function(res) {
            console.log(res)
          },
        })
      }, 200)
    },
    // 点击保存到相册
    save() {
      var that = this
      wx.saveImageToPhotosAlbum({
        filePath: that.imagePath,
        success(res) {
          wx.showModal({
            content: '图片已保存到相册，赶紧晒一下吧~',
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#333',
            success: function(res) {
              if (res.confirm) {
                that.maskHidden = false
              }
            },
            fail: function(res) {
              console.log(res)
            },
          })
        },
      })
    },
    // 点击生成
    formSubmit() {
      var that = this
      this.maskHidden = false
      wx.showToast({
        title: '生成中...',
        icon: 'loading',
        duration: 1000,
      })
      setTimeout(function() {
        wx.hideToast()
        wx.cloud.downloadFile({
          fileID: that.xcxCodeUrl,
          success(res) {
            that.cardCode = res.tempFilePath
            that.createNewImg()
          },
        })
        wx.vibrateLong()
        that.maskHidden = true
      }, 1000)
    },
    // 点击关闭生成的海报
    closeThisPostBtn() {
      console.log('关闭海报')
      this.maskHidden = false
    },
  },
  onLoad(options) {
    if (options.scene && options.scene.indexOf('md') !== -1) {
      this.name = decodeURIComponent(options.scene)
    } else {
      this.name = this.$root.$mp.query.name
    }
    wx.cloud
      .callFunction({
        name: 'blog',
        data: { name: this.name },
      })
      .then(res => {
        let rs = JSON.parse(res.result)
        this.title = rs.data.title
        mpvue.setNavigationBarTitle({ title: this.title })
        this.content = rs.data.content.replace(/[\\]/g, '')
        if (this.content.indexOf('iframe') !== -1) {
          this.showVideoTip = true
        }
        this.loading = false
      })

    wx.cloud
      .callFunction({
        name: 'get_wxacode',
        data: { page: 'pages/blog/main?name=' + this.name },
      })
      .then(res => {
        this.xcxCodeUrl = res.result
      })
  },
  onShow() {},
  onReachBottom() {},
  onShareAppMessage() {
    return {
      title: this.title,
      path: '/pages/blog/main?name=' + this.name,
      imageUrl: this.imagePath || '',
    }
  },
  onShareTimeline() {
    return {
      title: this.title,
      path: '/pages/blog/main?name=' + this.name,
      imageUrl: this.imagePath || '',
    }
  },
  mounted() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data())
  },
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  .title {
    font-size: 16px;
    color: #4a4a4a;
    border-bottom: 1px solid #efefef;
    padding: 8px 0;
    text-align: center;
  }
  .content {
    padding: 0 15px;
  }
}

.bgImg {
  display: block;
  width: 100%;
  height: 366rpx;
}
.mine {
  display: block;
  text-align: center;
  color: #333;
  margin-top: 44rpx;
}
.code {
  display: block;
  text-align: center;
  color: #333;
  font-size: 76rpx;
  font-weight: bold;
  margin-top: 30rpx;
}
.who {
  display: block;
  margin-top: 80rpx;
  font-size: 32rpx;
  color: #333;
  text-align: center;
}
.inputBox {
  text-align: center;
  margin-top: 44rpx;
}
.input {
  text-align: center;
  width: 440rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #f5f5f5;
  font-size: 32rpx;
  display: inline-block;
}
.btn {
  width: 160rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(90deg, rgba(255, 226, 0, 1), rgba(255, 200, 11, 1));
  box-shadow: 0px 4px 8px 0px rgba(255, 200, 11, 0.5);
  color: #333;
  font-size: 32rpx;
  display: inline-block;
  line-height: 88rpx;
  margin-left: 40rpx;
}
button[class='btn']::after {
  border: 0;
}
.tishi {
  display: block;
  text-align: center;
  color: #999;
  margin-top: 30rpx;
  font-size: 20rpx;
}
.shareText {
  display: block;
  text-align: center;
  color: #333;
  font-size: 28rpx;
  margin-top: 100rpx;
}
.imgBox {
  text-align: center;
  width: 100%;
  margin-top: 60rpx;
  padding-bottom: 120rpx;
}
.img {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.m_l {
  margin-left: 180rpx;
}

.zfbtn,
.save {
  display: block;
  width: 218rpx;
  height: 78rpx;
  border-radius: 20rpx;
  border: solid 1px #647adb;
  padding: 0;
  margin: 0 auto;
  line-height: 78rpx;
  text-align: center;
  position: fixed;
  bottom: 50rpx;
  background-color: #ffffff;
  color: #647adb;
  font-size: 28rpx;
}
.save {
  left: 10%;
}
.zfbtn {
  right: 10%;
}
.invite-modle {
  width: 100%;
  height: 240rpx;
  background-color: #fff;
  box-shadow: 0, 0, 0 rgba(170, 170, 170, 0.38);
  padding: 48rpx 0 0 28rpx;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
}
.poster-mod {
  width: 100%;
  height: 150rpx;
  overflow: hidden;
  background: #fff;
  white-space: nowrap;
}
.poster-item {
  height: 144rpx;
  background-color: #f0f0f0;
  border-radius: 6rpx;
  border: 1.5px solid transparent;
  display: inline-block;
  overflow: hidden;
  margin: 0 50rpx 0 20rpx;
}
.poster-item.cur {
  border-color: #e94579;
}
.poster-item .img {
  width: 144rpx;
  height: 144rpx;
}
.imagePathBox {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
/* 海报上的关闭按钮 */
.closeThis {
  width: 45rpx;
  height: 45rpx;
  border-radius: 50%;
  position: absolute;
  top: 38rpx;
  right: 78rpx;
  z-index: 1005;
}
.shengcheng {
  width: 75vw;
  height: 82vh;
  position: fixed;
  top: 50rpx;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 100;
}

.album {
  width: 100rpx;
  height: 100rpx;
  background-color: orange;
  border-radius: 50%;
  font-family: MicrosoftYaHei;
  font-size: 28rpx;
  line-height: 100rpx;
  text-align: center;
  position: fixed;
  bottom: 300rpx;
  left: 20rpx;
  color: #fff;
  animation: rotatesImg infinite 10s linear;
  -webkit-animation: rotatesImg infinite 10s linear; /* Safari and Chrome */
}

/* 新样式 */
.bgImgNew {
  width: 750rpx;
  height: 1043rpx;
  margin-top: 11rpx;
}
.posterBtn {
  width: 100rpx;
  height: 100rpx;
  background-color: orange;
  border-radius: 50%;
  font-family: MicrosoftYaHei;
  font-size: 28rpx;
  line-height: 100rpx;
  text-align: center;
  position: fixed;
  bottom: 300rpx;
  right: 20rpx;
  color: #fff;
  animation: rotates infinite 10s linear;
  -webkit-animation: rotates infinite 10s linear; /* Safari and Chrome */
}
@keyframes rotates {
  to {
    transform: rotate(360deg);
  }
  from {
    transform: rotate(0deg);
  }
}
@-webkit-keyframes rotates {
  to {
    transform: rotate(360deg);
  }
  from {
    transform: rotate(0deg);
  }
}
@keyframes rotatesImg {
  to {
    transform: rotate(0deg);
  }
  from {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes rotatesImg {
  to {
    transform: rotate(0deg);
  }
  from {
    transform: rotate(360deg);
  }
}
</style>
