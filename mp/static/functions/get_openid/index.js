const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    let data = {
      openid: wxContext.OPENID,
    }
    console.log(JSON.stringify(event))
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}
