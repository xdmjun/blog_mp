<template>
  <div class="main">{{content}}</div>
</template>

<script>

export default {
  data() {
    return {
      name: '',
      content: ''
    }
  },
  methods: {

  },
  onLoad() {
    this.name = this.$root.$mp.query.name
    wx.cloud
      .callFunction({
        name: 'blog',
        data: { name: this.name }
      })
      .then(res => {
        let rs = JSON.parse(res.result)
        this.content = rs.data
      })
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
}
</style>
