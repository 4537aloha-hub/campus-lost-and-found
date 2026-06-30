import express from 'express'
const Router = express.Router()

// 导入路由处理函数
import { getNoticeListHandler } from '../router_handle/notice.js'

// 获取公告列表
Router.get('/noticeList', getNoticeListHandler)

export default Router