// 导入express模块
import express from 'express';
// 导入管理员中间件
import { adminMiddleware } from '../../middlewares/admin.middleware.js'

// 创建路由模块
const router = express.Router()
// 使用管理员中间件
router.use(adminMiddleware)

// 导入公告列表处理函数
import { addAnnouncementHandler } from '../../router_handle/admin/annoucement.js'
import { getAnnouncementListHandler } from '../../router_handle/admin/annoucement.js'
import { updateAnnouncementHandler } from '../../router_handle/admin/annoucement.js'
import { deleteAnnouncementHandler } from '../../router_handle/admin/annoucement.js'
import { topAnnouncementHandler } from '../../router_handle/admin/annoucement.js'
import { hideAnnouncementHandler } from '../../router_handle/admin/annoucement.js'

// 新增公告
router.post('/add', addAnnouncementHandler)
// 获取公告列表
router.get('/list', getAnnouncementListHandler)
// 修改公告
router.put('/update', updateAnnouncementHandler)
// 删除公告
router.delete('/delete/:id', deleteAnnouncementHandler)
// 置顶公告
router.put('/top/:id', topAnnouncementHandler)
// 隐藏公告
router.put('/hide/:id', hideAnnouncementHandler)


export default router
