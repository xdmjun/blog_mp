// 云函数入口文件
const got = require('got')

// 云函数入口函数
exports.main = async (event, context) => {
  let token = event.token
  let res = await got('http://tiaocaoer.com:11171/wxarticles', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  })
  console.log(res.body)
  return res.body
}
