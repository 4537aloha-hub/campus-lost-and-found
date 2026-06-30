// 导入express模块
import express from 'express';
// 导入管理员中间件
import { adminMiddleware } from '../../middlewares/admin.middleware.js'

// 创建路由模块
const router = express.Router()
// 使用管理员中间件
router.use(adminMiddleware)

// 导入轮播图处理函数
import { addBannerHandler, getBannerListHandler, updateBannerHandler, deleteBannerHandler, updateBannerStatusHandler } from '../../router_handle/admin/banner.js'

// 定义路由

// 新增轮播图图片
router.post('/add', addBannerHandler)
// 获取轮播图图片列表
router.get('/list', getBannerListHandler)
// 更新轮播图图片
router.post('/update/:id', updateBannerHandler)
// 删除轮播图图片
router.post('/delete/:id', deleteBannerHandler)
// 更新轮播图图片状态
router.post('/updateStatus/:id', updateBannerStatusHandler)

export default router