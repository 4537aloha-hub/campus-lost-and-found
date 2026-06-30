// 导入express模块
import express from 'express';
// 导入管理员中间件
import { adminMiddleware } from '../../middlewares/admin.middleware.js'

// 导入Router路由模块
const Router = express.Router();

// 挂载管理员中间件
Router.use(adminMiddleware)

// 导入获取统计信息的处理函数
import { getStatisticsHandler } from '../../router_handle/admin/statistics.js'
import { get7DayStatisticsHandler } from '../../router_handle/admin/statistics.js'
// 挂载获取统计信息的路由
Router.get('/statistics', getStatisticsHandler)
Router.get('/7day', get7DayStatisticsHandler)

export default Router