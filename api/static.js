const Koa = require('koa')
const staticServ = new Koa()
const path = require('path')

// 静态资源
staticServ.use(require('koa-static')(path.join(__dirname) + '/public'))
staticServ.use(async (ctx) => {
  ctx.body = 'static file server'
})
staticServ.listen(3001, () => {
  console.log('build success')
})
