// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if (event.Content === '1' || event.Content === '2') {
    console.log(event)
    let type = parseInt(event.Content)
    let titles = ['', '加入前端交流群', '关注公众号']
    let descs = ['', '一起聊聊web前端、小程序开发、产品', '探讨小程序反编译、玩玩nodejs']
    let pic = ['', 'fe-qun.png', 'qrcode_for_xdmj.jpg']
    await cloud.openapi.customerServiceMessage.send({
      touser: wxContext.OPENID,
      msgtype: 'link',
      link: {
        title: '薛定喵君邀你' + titles[type],
        description: descs[type],
        url: 'http://xuedingmiao.com/images/' + pic[type],
      },
    })
  } else {
    await cloud.openapi.customerServiceMessage.send({
      touser: wxContext.OPENID,
      msgtype: 'text',
      text: {
        content: '您好,很高兴为您服务。\n回复1:加入前端交流群\n回复2:关注公众号获取礼包',
      },
    })
  }
  console.log(event)

  return 'success'
}
