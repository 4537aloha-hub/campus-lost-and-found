// 导入express模块
import express from 'express';
// 导入管理员中间件
import { adminMiddleware } from '../../middlewares/admin.middleware.js'

// 创建路由模块
const router = express.Router()
// 使用管理员中间件
router.use(adminMiddleware)
// 导入获取活动记录列表的处理函数
import { getActivityListHandler } from '../../router_handle/admin/activity.js'

// 定义路由
router.get('/activityList', getActivityListHandler)

// 导出路由模块
export default router
