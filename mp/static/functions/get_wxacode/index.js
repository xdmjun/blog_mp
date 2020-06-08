const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  try {
    console.log(event)
    const page = event.page
    const result = await cloud.openapi.wxacode.get({
      path: page,
      isHyaline: true,
    })

    const upload = await cloud.uploadFile({
      cloudPath: 'wxacode.png',
      fileContent: result.buffer,
    })
    let wxacodefileID = upload.fileID
    return wxacodefileID
  } catch (err) {
    return err
  }
}
