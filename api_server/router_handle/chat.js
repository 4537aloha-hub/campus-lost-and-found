import db from '../db/index.js'
// 导入WebSocket服务器模块
import onlineUsers from '../websocket/wsServer.js'

// 点击认领 创建会话 的处理函数
export const createSession = async (req, res) => {
    try{
        // 1. 从请求体中获取需要获取的会话信息
        const {item_id, target_user_id} = req.body

        // 2.从认证信息中获取当前用户ID
        const user_id = req.auth.id

        // 查询当前会话是否存在

        // 条件1：当前用户是user1，目标用户是user2
        // 条件2：当前用户是user2，目标用户是user1
        const [rows] = await db.query(`select id from chat_sessions where item_id   = ? and (
            user1_id = ? and user2_id = ?
            or
            user1_id = ? and user2_id = ?
            )`, [item_id, user_id, target_user_id, target_user_id, user_id])

        // 3. 如果会话存在，返回会话ID
        if(rows.length > 0){
            return res.send({
                status: 0,
                message: '获取会话成功',
                session_id: rows[0].id
            })
        }
        // 4. 如果会话不存在，创建新会话
        // 会话中包含item_id, user_id, target_user_id 物品信息 用户信息 目标用户信息
        const [results] = await db.query(`insert into chat_sessions (item_id,   user1_id, user2_id) values(?, ?, ?)`, [item_id, user_id, target_user_id])

        // 创建会话成功，返回会话ID
        return res.send({
            status: 0,
            message: '创建会话成功',
            session_id: results.insertId
        })
    }
    catch(err){
        return res.cc(err)
    }
}

// 获取会话列表的处理函数
export const getSessionList = async (req, res) => {
    try{
        // 1. 从认证信息中获取当前用户ID
        const user_id = req.auth.id
        // 2. 查询当前用户所有的会话列表
        const [rows] = await db.query(`select * from chat_session_view where user1_id = ? or user2_id = ? order by ifnull(last_message, last_time) desc`, [user_id, user_id])

        // 3. 返回会话列表
        return res.send({
            status: 0,
            message: '获取会话列表成功',
            data: rows
        })
    }catch(err){
        return res.cc(err)
    }
}

// 获取消息的处理函数
export const getMessage = async (req, res) => {
    try{
        // 1. 从请求体中获取需要获取的会话信息
        const {session_id} = req.query
        // 2. 查询会话中的所有消息
       const [rows] = await db.query(`select * from chat_message_full_view where session_id = ? order by created_at asc`, [session_id])

        // 参数校验已在schema中chat.js中完成

        // 4. 返回消息列表
        return res.send({
            status: 0,
            message: '获取消息成功',
            data: rows
        })

    }catch(err){
        return res.cc(err)
    }
}

// 发送消息的处理函数
export const senderMessageHandler = async (req, res) => {
    try{
        // 从token中获取当前用户ID
        const sender_id = req.auth.id;

        // 1.从请求体中获取到需要的值
        // 1.1 session_id 会话id
        // 1.2 content 消息内容
        const {session_id, content} = req.body;

        // 2. 查询会话信息
        const [session] = await db.query(`select * from chat_sessions where id = ?`, [session_id])

        // 3. 检查会话是否存在
        if(!session)
            return res.cc('会话不存在');


        // 参数校验已在schema中chat.js中完成


        // 4. 插入消息到数据库
        const [result] = await db.query(`insert into chat_messages (session_id, sender_id, content) values (?, ?, ?)`, [session_id, sender_id, content])

        // 5. 找到对方Id
        const receiver_id = session.user1_id === sender_id ? session.user2_id : session.user1_id;


        // 如果对方在线，通过WebSocket推送消息
        if(onlineUsers[receiver_id]) {
            onlineUsers[receiver_id].send(
                JSON.stringify({
                    type: 'new_message',
                    session_id,
                    sender_id,
                    content,
                    avatar: onlineUsers[sender_id].avatar,
                    username: onlineUsers[sender_id].username,
                })
            )
        }

        // 5. 返回消息ID
        return res.send({
            status: 0,
            message: '发送消息成功',
            data: {
                id: result.insertId,
                session_id,
                sender_id,
                content,
            }
        })

    }catch(err){
        return res.cc(err)

        return res.send({
            status: 1,
            message: '发送消息失败',
        })
    }
}