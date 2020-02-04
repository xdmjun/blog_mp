<template>
  <div class="main">
    <i-cell-group>
      <i-cell
        v-for="blog in blogs"
        :key="index"
        :title="blog.title"
        @click="toDetail(blog.file_name)"
      ></i-cell>
    </i-cell-group>
  </div>
</template>

<script>
// import { userOrg, getMyInvite, getInvite } from '@/api/api'
export default {
  data() {
    return {
      blogs: []
    }
  },
  methods: {
    toDetail(name) {
      mpvue.navigateTo({
        url: '/pages/blog/main?name=' + name
      })
    },
  },
  onShareAppMessage() {

  },
  onLoad() {
    wx.cloud
      .callFunction({
        name: 'blogs',
        data: {}
      })
      .then(res => {
        let rs = JSON.parse(res.result)
        this.blogs = rs.data
      })
  },
  mounted() {
    wx.showShareMenu()
  },
  onShow() {
  },
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  padding: 0 5px;
}
</style>
