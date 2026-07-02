// 导入express模块
import express from 'express'
// 导入CORS模块 负责处理跨域请求
import cors from 'cors'
// 导入Joi模块 负责数据验证 错误处理
import joi from 'joi'
// 导入全局express-jwt中间件 用于解析token
import { expressjwt } from 'express-jwt';
// 导入全局配置文件
import config from './config.js';
// 导入文件系统模块
import fs from 'fs';
// 导入https模块
import https from 'https';

// 全局注册中间件
const app = express()

// 使用中间件
// 配置CORS中间件 解决跨域问题
app.use(cors())
// 配置JSON解析中间件 解析请求体中的JSON数据
app.use(express.json())
// 配置URL编码解析中间件 解析请求体中的URL编码数据
app.use(express.urlencoded({ extended: true }))

// 响应数据的中间件（必须在JWT中间件之前）
app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 配置JWT验证中间件 用于解析请求头中的token
app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//, /^\/item\//, /^\/category\//, /^\/subCategory\//, /^\/uploads\//, /^\/notice\//, /^\/banner\//] }))

// 导入用户端路由模块
import userRouter from './router/user.js'
import userinfoRouter from './router/userinfo.js'
import itemRouter from './router/item.js'
import iteminfoRouter from './router/iteminfo.js'
import categoryRouter from './router/category.js'
import uploadRouter from './router/upload.js'
import chatRouter from './router/chat.js'
import emailRouter from './router/email.js'
import noticeRouter from './router/notice.js'
import claimRouter from './router/claim.js'
import bannerRouter from './router/banner.js'

// 导入管理员端路由模块
import adminRouter from './router/admin/user.js'
import adminItemRouter from './router/admin/item.js'
import adminCategoryRouter from './router/admin/cateogory.js'
import adminAuditRouter from './router/admin/audit.js'
import adminAnnouncementRouter from './router/admin/annoucement.js'
import adminActivityRouter from './router/admin/activity.js'
import adminStatisticsRouter from './router/admin/statistics.js'
import adminBannerRouter from './router/admin/banner.js'

// 使用路由模块

// 用户端路由
// 用户路由
app.use('/api', userRouter)
// 用户信息路由
app.use('/my', userinfoRouter)
// 物品路由
app.use('/my', itemRouter)
// 物品信息路由
app.use('/item', iteminfoRouter)
// 获取物品分类树列表路由
app.use('/category', categoryRouter)
// 上传图片路由
app.use('/upload', uploadRouter)
// 图片静态资源访问
app.use('/uploads', express.static(path.resolve('uploads')))
// 聊天路由
app.use('/chat', chatRouter)
// 邮箱路由
app.use('/email', emailRouter)
// 公告路由
app.use('/notice', noticeRouter)
// 认领物品路由
app.use('/claim', claimRouter)
// 轮播图路由
app.use('/banner', bannerRouter)

// 管理员路由
app.use('/admin', adminRouter)
// 管理员物品数据路由
app.use('/admin/item', adminItemRouter)
// 管理员分类数据路由
app.use('/admin/category', adminCategoryRouter)
// 管理员审核数据路由
app.use('/admin/audit', adminAuditRouter)
// 管理员公告数据路由
app.use('/admin/announcement', adminAnnouncementRouter)
// 管理员活动数据路由
app.use('/admin/activity', adminActivityRouter)
// 管理员统计数据路由
app.use('/admin/statistics', adminStatisticsRouter)
// 管理员轮播图数据路由
app.use('/admin/banner', adminBannerRouter)

// // 创建服务器
// app.listen(3000, () => {
//   console.log('服务器已启动,请访问：http://localhost:3000');
// })

// 错误级别中间件
app.use(function (err, req, res, next) { 
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
});

const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/naruseshiroha.top/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/naruseshiroha.top/fullchain.pem"),
};

https.createServer(options, app).listen(3000, () => {
    console.log("HTTPS服务器启动");
});