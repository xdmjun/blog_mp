<template>
  <div class="main">
    <wemark :md="content" link highlight type="wemark"></wemark>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      content: '',
    }
  },
  methods: {},
  onLoad() {
    this.name = this.$root.$mp.query.name
    wx.cloud
      .callFunction({
        name: 'blog',
        data: { name: this.name },
      })
      .then(res => {
        let rs = JSON.parse(res.result)
        mpvue.setNavigationBarTitle({ title: rs.data.title })
        this.content = rs.data.content.replace(/[\\]/g, '')
      })
  },
  onShow() {},
  onReachBottom() {},
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  padding: 0 15px;
}
</style>
