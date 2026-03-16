let ws = null

// 前端连接WebSocket服务器
export const connectSocket = (userInfo) => {

  if(!userInfo) {
    console.log('userInfo为空 无法连接socket');
    return;
  }

  // 关闭已有的连接 防止重复连接
  if(ws) {
    ws.close();
  }
  ws = new WebSocket('ws://localhost:3001')

  ws.onopen = () => {
    console.log('Websocket连接成功');

    // 向服务器发送登录消息 事件类型为login登录事件 记录用户id
    ws.send(JSON.stringify({
      type: 'login',
      userId: userInfo.id,
      avatar: userInfo.avatar,
      username: userInfo.username
    }))
  }

  // 监听服务器发送的消息
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('收到消息', data);
  }
}

// 导出ws对象
export const getSocket = () => ws
