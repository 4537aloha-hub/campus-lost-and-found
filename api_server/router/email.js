import express from 'express';
const router = express.Router();

// 导入邮箱路由处理函数
import { sendEmailCodeHandler, bindEmailHandler, verifyEmailCodeHandler} from '../router_handle/email.js'

router.post('/sendCode', sendEmailCodeHandler)
router.post('/bindEmail', bindEmailHandler)
router.post('/verifyEmailCode', verifyEmailCodeHandler)

export default router