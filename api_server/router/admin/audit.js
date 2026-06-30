// 导入express模块
import express from 'express';
// 导入管理员中间件
import { adminMiddleware } from '../../middlewares/admin.middleware.js'

// 创建路由模块
const router = express.Router()
// 使用管理员中间件
router.use(adminMiddleware)

// 审核通过
import { auditPassHandler } from '../../router_handle/admin/audit.js'
// 审核拒绝
import { auditRejectHandler } from '../../router_handle/admin/audit.js'

// 定义路由
router.put('/auditPass/:id', auditPassHandler)
router.put('/auditReject/:id', auditRejectHandler)

// 导出路由模块
export default router
