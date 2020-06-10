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

    let name = page.substr(page.indexOf('=') + 1)
    const upload = await cloud.uploadFile({
      cloudPath: name + '.png',
      fileContent: result.buffer,
    })
    let wxacodefileID = upload.fileID
    return wxacodefileID
  } catch (err) {
    return err
  }
}
