<template>
  <div class="main">
    <div v-if="tags.length==0" class="empty-data">暂无数据</div>
    <i-tag
      v-for="tag in tags"
      :key="index"
      i-class="tag"
      class="i-tags"
      :name="tag.title"
      :color="tag.color"
    >{{tag.title}}</i-tag>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tags: [],
    }
  },
  methods: {
    init() {
      wx.cloud
        .callFunction({
          name: 'tags',
          data: {},
        })
        .then(res => {
          let rs = JSON.parse(res.result)
          rs.data.map(tag => {
            tag.color = this.color()
          })
          this.tags = rs.data
        })
    },
    getList() {},
    color() {
      // 标签button颜色
      let colors = ['blue', 'green', 'red', 'yellow', 'default']
      return colors[parseInt(Math.random() * colors.length)]
    },
  },
  onShow() {},
  onLoad() {
    this.init()
  },
  mounted() {
    wx.showShareMenu()
  },
  onReachBottom() {},
  onUnload() {},
}
</script>

<style lang="less" scoped>
page {
  background: #f7f4f7;
}
.main {
  /deep/ .tag {
    margin: 5px 12px 5px 5px;
  }
}
</style>
