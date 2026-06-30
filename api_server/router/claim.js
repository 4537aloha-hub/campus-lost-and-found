import express from 'express';
const router = express.Router();

// 引入处理函数
import { applyClaimHandler, agreeClaimHandler, rejectClaimHandler, getPendingClaimsHandler, getClaimHistoryHandler, getMyClaimsHandler } from '../router_handle/claim.js'

// 申请认领物品的路由
router.post('/apply/:id', applyClaimHandler)
// 同意认领物品的路由
router.post('/approve/:id', agreeClaimHandler)
// 拒绝认领物品的路由
router.post('/reject/:id', rejectClaimHandler)
// 获取待处理认领申请的路由
router.get('/pending', getPendingClaimsHandler)
// 获取认领历史记录的路由
router.get('/history', getClaimHistoryHandler)
// 获取我的认领申请的路由
router.get('/myclaims', getMyClaimsHandler)
export default router
