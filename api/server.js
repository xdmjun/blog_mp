const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const fg = require('fast-glob')
const fs = require('fs')
const request = require('request')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
let config = require('./config.js')
const blog_html_path = config.base_path + 'blog/*.html',
  blog_md_path = config.base_path + 'blog/*.md',
  tag_path = config.base_html_path + 'tag/*.html',
  tokenUrl = config.tokenUrl,
  batchgetMaterialUrl = config.batchgetMaterialUrl,
  appid = config.appid,
  appsecret = config.appsecret,
  type = config.type,
  offset = config.offset,
  count = config.count

// user agent
const { userAgent } = require('koa-useragent')
app.use(userAgent)

// 全局异常处理
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = {
      code: -1,
      data: ctx.data,
      message: ctx.msg || err.message || '服务开小差了，请稍后再试',
      etime: Date.now(),
    }
  }
})

// pretty json result
app.use(async (ctx, next) => {
  await next()
  ctx.set('Content-Type', 'application/json')
  ctx.body = {
    code: ctx.code || 0,
    data: ctx.data,
    message: ctx.msg || 'success',
    etime: Date.now(),
  }
})

router.get('/', async (ctx, next) => {
  ctx.data = 'blog api'
  await next()
})

// 获取公众号全局token
router.get('/getToken', async (ctx, next) => {
  let tokenInfo = fs.existsSync('token_info.json')
    ? JSON.parse(fs.readFileSync('token_info.json', 'utf-8'))
    : null
  let expires_time = tokenInfo ? tokenInfo.expires_time : ''
  let cache_access_token =
    tokenInfo && tokenInfo.access_token ? tokenInfo.access_token : ''
  if (
    parseInt(Date.now() / 1000) > expires_time + 3600 ||
    tokenInfo == null ||
    cache_access_token == ''
  ) {
    let tokenInfoNew = await new Promise(function (resolve, reject) {
      request.get(
        `${tokenUrl}?grant_type=client_credential&appid=${appid}&secret=${appsecret}`,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve(body)
          }
          reject(error)
        }
      )
    })
    tokenInfoNew = JSON.parse(tokenInfoNew)
    cache_access_token = tokenInfoNew.access_token
    expires_time = parseInt(Date.now() / 1000)
    fs.writeFileSync(
      'token_info.json',
      JSON.stringify({
        access_token: cache_access_token,
        expires_time: expires_time,
      })
    )
    ctx.data = { token: cache_access_token, expires_time: expires_time }
  } else {
    ctx.data = {
      token: tokenInfo.access_token,
      expires_time: tokenInfo.expires_time,
    }
  }
  await next()
})

// 获取公众号文章素材列表
router.get('/wxarticles', async (ctx, next) => {
  let page = ctx.request.query.page || 1,
    access_token = ctx.request.header.token || ''
  let data = {
    type: type,
    offset: offset,
    count: count,
  }
  // 获取素材列表
  const res = await new Promise(function (resolve, reject) {
    request.post(
      {
        url: `${batchgetMaterialUrl}?access_token=${access_token}`,
        form: JSON.stringify(data),
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body)
        }
        reject(error)
      }
    )
  })
  let blogs = [],
    medias = JSON.parse(res)
  if (medias.item) {
    medias.item.map((blog) => {
      blogs.push({
        title: blog.content.news_item[0].title,
        digest: blog.content.news_item[0].digest,
        thumb_media_id: blog.content.news_item[0].thumb_media_id,
        url: blog.content.news_item[0].url,
      })
    })
  }
  ctx.data = blogs
  await next()
})

// 生成博客列表json
router.get('/blogs/init', async (ctx, next) => {
  // 拉取最新博客markdown文件
  const { stdout, stderr } = await exec(
    'cd ' + config.base_path + ' && cd ../ && git pull'
  )
  if (stderr == '') {
    // 读取md文件列表
    let blog_routes = await fg(blog_md_path, {
      onlyFiles: true,
      cwd: __dirname,
      deep: 1,
    })
    ctx.data = '博客仓库更新成功->' + stdout + (await initTitle(blog_routes))
  } else {
    ctx.data = stderr
  }
  await next()
})

// 获取博客列表
router.get('/blogs', async (ctx, next) => {
  let allblogs = await getTitleFromJson()
  let pagesize = 30
  let page = ctx.request.query.page || 1
  let total = allblogs.length
  let maxpage = 1
  if (total % pagesize === 0) {
    maxpage = parseInt(total / pagesize)
  } else {
    maxpage = parseInt(total / pagesize) + 1
  }
  if (page > maxpage) {
    page = maxpage
  }
  let first = (page - 1) * pagesize
  let blogList = JSON.parse(allblogs).slice(first, first + pagesize)
  ctx.data = blogList
  await next()
})

// 获取推荐博客列表
router.get('/recblogs', async (ctx, next) => {
  let allblogs = await getTitleFromJson(),
    recblogs = []
  JSON.parse(allblogs).map((blog) => {
    if (blog.recommend === 1) {
      recblogs.push(blog)
    }
  })
  let pagesize = 30
  let page = ctx.request.query.page || 1
  let total = recblogs.length
  let maxpage = 1
  if (total % pagesize === 0) {
    maxpage = parseInt(total / pagesize)
  } else {
    maxpage = parseInt(total / pagesize) + 1
  }
  if (page > maxpage) {
    page = maxpage
  }
  let first = (page - 1) * pagesize
  let blogList = recblogs.slice(first, first + pagesize)
  ctx.data = blogList
  await next()
})

// 获取博客内容
router.get('/blog/:name', async (ctx, next) => {
  ctx.data = await getContent(ctx.params.name)
  await next()
})

// 获取标签列表
router.get('/tags', async (ctx, next) => {
  let blog_routes = await fg(tag_path, {
    onlyFiles: true,
    cwd: __dirname,
    deep: 1,
  })
  let blog_array = []
  blog_routes.forEach((row) => {
    let blog_file_name = row.substr(row.lastIndexOf('/') + 1)
    let title = blog_file_name.substring(0, blog_file_name.lastIndexOf('.'))
    blog_array.push({ title: title, file_name: blog_file_name })
  })
  ctx.data = blog_array
  await next()
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)

// 生成博客标题json数据
async function initTitle(blog_routes) {
  let blog_array = []
  blog_routes.forEach((row) => {
    let blog_file_name = row.substr(row.lastIndexOf('/') + 1)
    var data = fs.readFileSync(row, 'utf-8')
    let title = data.substring(
      data.indexOf('title:') + 7,
      data.indexOf('date:') - 1
    )
    let date = data.substring(
      data.indexOf('date:') + 6,
      data.indexOf('type:') - 1
    )
    let tmpDesc = data.substring(
        data.indexOf('---') + 3,
        data.indexOf('<!-- more -->') - 1
      ),
      more = tmpDesc.substring(tmpDesc.lastIndexOf('---') + 4).trim()
    let desc = data
      .substr(data.indexOf('<!-- more -->') + 14, 60)
      .replace('[[toc]]', '')
      .replace(/[\n]/g, '')
      .replace('###', '')
      .replace('<a data-fancybox', '')
    let recommend = data.indexOf('recommend:') != -1 ? 1 : 0
    blog_array.push({
      title: title,
      more: more,
      desc: desc,
      date: date,
      recommend: recommend,
      file_name: blog_file_name,
    })
  })
  blog_array.sort(function (a, b) {
    return b.date > a.date ? 1 : -1
  })
  fs.writeFileSync('blogs.json', JSON.stringify(blog_array))
  return '生成' + blog_array.length + '条记录'
}

// 从json文件获取博客标题
async function getTitleFromJson() {
  let blogs = fs.readFileSync('blogs.json', 'utf-8')
  return blogs
}

// 获取博客标题
async function getTitle(blog_routes) {
  let blog_array = []
  blog_routes.forEach((row) => {
    let blog_file_name = row.substr(row.lastIndexOf('/') + 1)
    var data = fs.readFileSync(row, 'utf-8')
    let title = data.substring(
      data.indexOf('title:') + 7,
      data.indexOf('date:') - 1
    )
    let date = data.substring(
      data.indexOf('date:') + 6,
      data.indexOf('type:') - 1
    )
    let recommend = data.indexOf('recommend:') != -1 ? 1 : 0
    blog_array.push({
      title: title,
      date: date,
      recommend: recommend,
      file_name: blog_file_name,
    })
  })
  blog_array.sort(function (a, b) {
    return b.date > a.date ? 1 : -1
  })
  return blog_array
}

// 获取博客内容
async function getContent(blog_name) {
  var data = fs.readFileSync(config.base_path + 'blog/' + blog_name, 'utf-8')
  let blogCont = {}
  blogCont.title = data.substring(
    data.indexOf('title:') + 7,
    data.indexOf('date:') - 1
  )
  let imgReg = /<img.*?(?:>|\/>)/gi //匹配img标签
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
  let altReg = /alt=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片的alt

  let cnt = data.substring(data.indexOf('<!-- more -->') + 14)
  let arr = cnt.match(imgReg) //筛选出所有的img

  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      let src = arr[i].match(srcReg)
      let alt = arr[i].match(altReg)
      let imgMdStr =
        '![' +
        (alt != null ? alt : '图片') +
        '](' +
        'http://xuedingmiao.com' +
        src[1] +
        ')'
      cnt = cnt.replace(arr[i], 'img' + i).replace('img' + i, imgMdStr)
    }
  }

  blogCont.content = cnt.replace('[[toc]]', '')
  return blogCont
}
