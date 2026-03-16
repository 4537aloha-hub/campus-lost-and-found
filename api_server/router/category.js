// 导入express模块
import express from 'express';
// 导入Router路由模块
const Router = express.Router();

// 导入路由处理函数模块
import { getCategoryTreeHandler } from '../router_handle/category.js';
// 导入路由
Router.get('/getCategoryTree', getCategoryTreeHandler);
// 导出路由
export default Router;