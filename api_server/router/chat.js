import express from 'express'
const Router = express.Router()
import expressJoi from '@escook/express-joi';
// 导入路由处理函数模块
// 导入创建会话路由处理函数
import { createSession } from '../router_handle/chat.js'
import { getSessionList } from '../router_handle/chat.js'
import { getMessage } from '../router_handle/chat.js'
import { senderMessageHandler } from '../router_handle/chat.js'

// 导入joy校验规则
import { createSession_schema, getMessage_schema } from '../schema/chat.js'
// 点击认领 创建会话路由
Router.post('/session', createSession)

// 获取会话列表路由
Router.get('/sessionList', getSessionList)
export default Router

// 获取聊天记录路由
Router.get('/getMessage', expressJoi(getMessage_schema), getMessage)

// 发送消息路由
Router.post('/sendMessage', expressJoi(createSession_schema), senderMessageHandler)
