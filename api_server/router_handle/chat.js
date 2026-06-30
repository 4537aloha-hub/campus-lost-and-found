import db from '../db/index.js'
// 导入WebSocket服务器模块
import onlineUsers from '../websocket/wsServer.js'

// 点击认领 创建会话 的处理函数
export const createSession = async (req, res) => {
  try {
    const { item_id, target_user_id } = req.body
    const user_id = req.auth.id

    if (user_id === target_user_id) {
      return res.cc('不能对自己发布的物品进行操作')
    }

    // 1. 查询是否已有会话
    const [rows] = await db.query(
      `select * from chat_sessions 
       where item_id = ? 
       and (
         (user1_id = ? and user2_id = ?)
         or
         (user1_id = ? and user2_id = ?)
       )`,
      [item_id, user_id, target_user_id, target_user_id, user_id]
    )

    // 2. 如果存在 → 处理恢复逻辑
    if (rows.length > 0) {
      const session = rows[0]

      const needRecover =
        (session.user1_id === user_id && session.deleted_by_user1 === 1) ||
        (session.user2_id === user_id && session.deleted_by_user2 === 1)

      if (needRecover) {
        if (session.user1_id === user_id) {
          await db.query(
            `update chat_sessions set deleted_by_user1 = 0 where id = ?`,
            [session.id]
          )
        } else {
          await db.query(
            `update chat_sessions set deleted_by_user2 = 0 where id = ?`,
            [session.id]
          )
        }
      }

      return res.send({
        status: 0,
        message: '获取会话成功',
        session_id: session.id
      })
    }

    // 3. 不存在 → 创建新会话
    const [results] = await db.query(
      `insert into chat_sessions (item_id, user1_id, user2_id) 
       values (?, ?, ?)`,
      [item_id, user_id, target_user_id]
    )

    return res.send({
      status: 0,
      message: '创建会话成功',
      session_id: results.insertId
    })

  } catch (err) {
    return res.cc(err)
  }
}

// 获取会话列表的处理函数
export const getSessionList = async (req, res) => {
    try{
        // 1. 从认证信息中获取当前用户ID
        const user_id = req.auth.id
        // 2. 查询当前用户所有的会话列表
        const [rows] = await db.query(`select * from chat_session_view where ( user1_id = ? and deleted_by_user1 = 0 ) or ( user2_id = ? and deleted_by_user2 = 0 ) order by ifnull(last_message, last_time) desc`, [user_id, user_id])

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

// 删除会话列表的处理函数
export const deleteSession = async (req, res) => {

  try {
    const { session_id } = req.params;
    const user_id = req.auth.id;

    // 1. 查询会话
    const [[session]] = await db.query(`select * from chat_sessions where id = ?`, [session_id])

    // 2. 检查会话是否存在
    if(!session)
        return res.cc('会话不存在');

    // 3. 权限校验

    if(session.user1_id !== user_id && session.user2_id !== user_id)
        return res.cc('无权限删除该会话');
    
    // 4. 标记删除
    if(session.user1_id === user_id){
        await db.query(`update chat_sessions set deleted_by_user1 = 1 where id = ?`, [session_id])
    } else {
        await db.query(`update chat_sessions set deleted_by_user2 = 1 where id = ?`, [session_id])
    }

    // 5. 真删除 如果双方都删除了会话
    await db.query(`
      delete from chat_sessions where id = ?
      and deleted_by_user1 = 1
      and deleted_by_user2 = 1
    `, [session_id])


    // 5. 返回删除成功
    res.send({
      status: 0,
      message: '删除成功',
    });

  } catch (err) {
    res.cc(err);
  }
}; 