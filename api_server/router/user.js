// 导入express模块
import express from 'express';
// 导入Router路由模块
const Router = express.Router();
// 导入验证表单数据的中间件
import expressJoi from '@escook/express-joi';

// 导入用户路由处理函数模块
import { registerHandler } from '../router_handle/user.js';
import { loginHandler } from '../router_handle/user.js';

// 导入验证规则对象
import { reg_schema, login_schema} from '../schema/user.js';

// 注册新用户
Router.post('/register', expressJoi(reg_schema), registerHandler )
// 登录用户
Router.post('/login', expressJoi(login_schema), loginHandler )


export default Router