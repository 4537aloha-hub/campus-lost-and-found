// 导入express模块
import express from 'express';
// 导入管理员中间件
import { adminMiddleware } from '../../middlewares/admin.middleware.js'

// 导入Router路由模块
const Router = express.Router();

// 导入获取用户列表的处理函数
import { getUserListHandler, forbidUserHandler } from '../../router_handle/admin/user.js'
// 挂载管理员中间件
Router.use(adminMiddleware)

// 定义路由
Router.get('/userList',  getUserListHandler)
Router.put('/forbidUser/:id', forbidUserHandler)

// 导出路由模块
export default Router
