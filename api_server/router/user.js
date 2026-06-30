// 导入express模块
import express from 'express';
// 导入Router路由模块
const Router = express.Router();
// 导入验证表单数据的中间件
import expressJoi from '@escook/express-joi';

// 导入用户路由处理函数模块
import { registerHandler } from '../router_handle/user.js';
import { loginHandler } from '../router_handle/user.js';
import {
  checkStudentIdHandler,
  sendForgetEmailCodeHandler,
  verifyForgetEmailCodeHandler,
  resetPasswordHandler
} from '../router_handle/user.js';
import { sendEmailCodeHandler } from '../router_handle/email.js';
import { verifyEmailCodeHandler } from '../router_handle/email.js';
// 导入验证规则对象
import {
  reg_schema,
  login_schema,
  forget_check_student_schema,
  forget_verify_email_schema,
  forget_verify_code_schema,
  forget_reset_password_schema
} from '../schema/user.js';

// 注册新用户
Router.post('/register', expressJoi(reg_schema), registerHandler )
// 登录用户
Router.post('/login', expressJoi(login_schema), loginHandler )
// 发送邮箱验证码
Router.post('/sendRegisterEmailCode', sendEmailCodeHandler )
// 验证邮箱验证码(注册邮箱)
Router.post('/verifyRegisterEmailCode', verifyEmailCodeHandler )
// 忘记密码学号校验
Router.post('/checkStudentId', expressJoi(forget_check_student_schema), checkStudentIdHandler)
// 忘记密码邮箱校验并发送验证码
Router.post('/forgetpassword/sendCode', expressJoi(forget_verify_email_schema), sendForgetEmailCodeHandler)
// 忘记密码验证码校验
Router.post('/forgetpassword/verifyCode', expressJoi(forget_verify_code_schema), verifyForgetEmailCodeHandler)
// 忘记密码重置密码
Router.post('/forgetpassword/resetPassword', expressJoi(forget_reset_password_schema), resetPasswordHandler)

export default Router