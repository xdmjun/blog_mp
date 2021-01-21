const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    let openid = wxContext.OPENID
    // 防止重复存储
    let uuids = await db
      .collection('uuids')
      .where({
        uuid: event.uuid,
      })
      .get()

    if (uuids.data.length) {
      await db
        .collection('uuids')
        .doc(uuids.data[0]._id)
        .update({
          data: {
            openid: openid,
          },
        })
      return uuids
    }

    const result = await db.collection('uuids').add({
      data: {
        ...event,
        uuid: event.uuid,
        openid: openid,
      },
    })
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
