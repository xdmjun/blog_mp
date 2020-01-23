const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const fg = require("fast-glob");
const fs = require("fs");
let config = require("./config.js"),
  blog_path = config.base_path + "blog/*.html",
  tag_path = config.base_path + "tag/*.html";

// user agent
const { userAgent } = require("koa-useragent");
app.use(userAgent);

// 全局异常处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = {
      code: -1,
      data: ctx.data,
      message: ctx.msg || err.message || "服务开小差了，请稍后再试",
      etime: Date.now()
    };
  }
});

// pretty json result
app.use(async (ctx, next) => {
  await next();
  ctx.set("Content-Type", "application/json");
  ctx.body = {
    code: ctx.code || 0,
    data: ctx.data,
    message: ctx.msg || "success",
    etime: Date.now()
  };
});

router.get("/", async (ctx, next) => {
  ctx.body = "blog api";
});

// 获取博客列表
router.get("/blogs", async (ctx, next) => {
  let blog_routes = await fg(blog_path, {
    onlyFiles: true,
    cwd: __dirname,
    deep: 1
  });
  ctx.data = await getTitle(blog_routes);
  await next();
});

// 获取标签列表
router.get("/tags", async (ctx, next) => {
  let blog_routes = await fg(tag_path, {
    onlyFiles: true,
    cwd: __dirname,
    deep: 1
  });
  let blog_array = [];
  blog_routes.forEach(row => {
    let blog_file_name = row.substr(row.lastIndexOf("/") + 1);
    let title = blog_file_name.substring(0, blog_file_name.lastIndexOf("."));
    blog_array.push({ title: title, file_name: blog_file_name });
  });
  ctx.data = blog_array;
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);

// 获取博客标题
async function getTitle(blog_routes) {
  let blog_array = [];
  blog_routes.forEach(row => {
    let blog_file_name = row.substr(row.lastIndexOf("/") + 1);
    var data = fs.readFileSync(row, "utf-8");
    let title = data.substring(
      data.indexOf("<title>") + 7,
      data.indexOf("</title>") - 7
    );
    blog_array.push({ title: title, file_name: blog_file_name });
  });
  return blog_array;
}
