# blog_mp
个人博客小程序(薛定喵君)

### 前端
- mp文件夹下的代码为小程序前端代码，使用mpvue框架开发
- 接口使用的云函数请求第三方服务器数据

### 后端
- api文件夹下的代码为后端，基于koa框架开发
- 直接读取的本地文件，没有采用数据库存储，是与vuepress构建的[web端博客](http://xuedingmiao.com)配套而写的一套接口，读取构建后的博客目录及博客标签云数据返回给前端展示

### 使用到的技术
- mpvue框架
- 小程序云开发
- 小程序markdown内容渲染
- iview、vantUI库
- koa框架
- 部署采用的pm2管理
- vuepress(博客内容来源于vuepress构建)

### 扫码体验
<img src="/xcx_qrcode.jpg" height="330" width="330">

### 更新日志
- 2020/05/21：初版更新，略丑