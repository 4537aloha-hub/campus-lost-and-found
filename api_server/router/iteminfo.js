// 导入验证表单数据的中间件
import expressJoi from '@escook/express-joi';
// 导入express模块
import express from 'express';
// 导入Router路由模块
const Router = express.Router();
// 导入物品路由处理函数模块
import { getItemListHandler } from '../router_handle/iteminfo.js'
import { getItemInfoByIdHandler } from '../router_handle/iteminfo.js'
import { getItemCategoryInfoHandler } from '../router_handle/iteminfo.js'
import { searchItemHandler } from '../router_handle/iteminfo.js'

// 导入验证规则对象
import { searchItem_schema } from '../schema/item.js';

// 获取物品信息的路由
Router.get('/getItemList', getItemListHandler)

// 根据物品ID查询物品详细信息的路由(用于前端的物品详情页)
Router.get('/getItemInfoById/:id', getItemInfoByIdHandler)

// 根据物品分类树获取物品列表路由
Router.get('/getItemsByCategoryId', getItemCategoryInfoHandler)

// 搜索物品的路由
Router.get('/searchItem', expressJoi(searchItem_schema), searchItemHandler)
export default Router;