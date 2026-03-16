// 导入express模块
import express from 'express';
// 导入Router路由模块
const Router = express.Router();
// 导入验证表单数据的中间件
import expressJoi from '@escook/express-joi';
// 导入express-jwt中间件
import { expressjwt } from 'express-jwt';

// 导入用户路由处理函数模块
import { getUserInfoHandler } from '../router_handle/userinfo.js';
import { updateUserInfoHandler } from '../router_handle/userinfo.js';
import {  updatePasswordHandler } from '../router_handle/userinfo.js';
// 导入验证规则对象
import { edit_schema } from '../schema/user.js';


// 获取用户信息路由
Router.get('/userinfo', getUserInfoHandler)

// 更新用户信息路由
Router.put('/editUserInfo', expressJoi(edit_schema), updateUserInfoHandler )

// 修改用户密码路由
Router.post('/updatePassword', updatePasswordHandler)
export default Router;