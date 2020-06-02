module.exports = {
  base_html_path: '', // 博客编译后的html目录路径
  base_path: '', // 博客编译后dist目录路径

  tokenUrl: '', // 微信全局access_token获取接口地址
  batchgetMaterialUrl: '', // 批量获取公众号素材地址
  appid: '', // 公众号appid
  appsecret: '', // 公众号appsecret

  mpAppid: '', // 小程序appid
  mpAppsecret: '', // 小程序appsecret
  
  type: '', // 素材类型 图片（image）、视频（video）、语音 （voice）、图文（news）
  offset: '', // 从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
  count: '', // 返回素材的数量，取值在1到20之间
}
