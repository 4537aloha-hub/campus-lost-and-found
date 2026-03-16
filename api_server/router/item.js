// 导入express模块
import express from 'express';
// 导入Router路由模块
const Router = express.Router();
// 导入验证表单数据的中间件
import expressJoi from '@escook/express-joi';

// 导入用户路由处理函数模块

// 发布物物品遗失/招领的路由 
import { publishItemHandler } from '../router_handle/item.js'
// 根据用户ID查询用户发布的物品列表的路由处理函数
import { getItemListByUserIdHandler } from '../router_handle/item.js'
// 删除物品的路由
import { deleteItemHandler } from '../router_handle/item.js'
// 编辑/更新物品信息的路由
import { editItemHandler } from '../router_handle/item.js'

// 导入验证规则对象
import { publishItem_schema, editItem_schema } from '../schema/item.js';

// 发布物品遗失/招领的路由
Router.post('/publishItem', expressJoi(publishItem_schema), publishItemHandler)

// 删除物品的路由
Router.delete('/deleteItem/:id', deleteItemHandler)

// 根据用户ID获取物品列表的路由
Router.get('/getItemListByUserId', getItemListByUserIdHandler)

// 编辑/更新物品信息的路由
Router.put('/editItem/:id', expressJoi(editItem_schema), editItemHandler)

export default Router
