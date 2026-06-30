// 导入express模块
import express from 'express';
// 导入管理员中间件
import { adminMiddleware } from '../../middlewares/admin.middleware.js'

// 导入Router路由模块
const Router = express.Router();

// 挂载管理员中间件
Router.use(adminMiddleware)

// 导入获取物品数据的处理函数
import { getItemDataHandler, deleteItemHandler, restoreItemHandler } from '../../router_handle/admin/item.js'

// 定义路由
Router.get('/itemData', getItemDataHandler)
// 删除物品（管理员）
Router.delete('/delete/:id', deleteItemHandler)
// 恢复物品（管理员）
Router.post('/restore/:id', restoreItemHandler)
export default Router