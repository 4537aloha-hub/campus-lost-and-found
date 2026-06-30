import request from '@/utils/request'

// 创建聊天 session
export const createSession = (data) => request.post('/chat/session', data)

// 获取聊天列表
export const getSessionList = () => request.get('/chat/sessionList')

// 获取聊天记录
export const getMessage = (params) => request.get('/chat/getMessage', { params })

// 发送消息
export const sendMessage = (data) => request.post('/chat/sendMessage', data)

// 删除会话聊天
export const deleteSession = (session_id) => request.delete(`/chat/deleteSession/${session_id}` ,
  {
    params: { session_id }
})
