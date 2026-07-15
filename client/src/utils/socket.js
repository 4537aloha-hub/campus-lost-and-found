let ws = null

// 等待WebSocket连接建立
export const waitSocket = () => {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        clearInterval(timer)

        resolve(ws)
      }
    }, 100)
  })
}

// 创建WebSocket连接
export const connectSocket = (userInfo) => {
  if (!userInfo) return

  if (ws) {
    ws.close()
  }

  const WS_URL = import.meta.env.VITE_WS_URL

  ws = new WebSocket(WS_URL)

  ws.onopen = () => {
    console.log('WebSocket连接成功')

    ws.send(
      JSON.stringify({
        type: 'login',

        userId: userInfo.id,

        avatar: userInfo.avatar,

        username: userInfo.username,
      }),
    )
  }

  ws.onerror = (err) => {
    console.error('WebSocket错误', err)
  }

  ws.onclose = () => {
    console.log('WebSocket关闭')

    ws = null
  }
}

export const getSocket = () => ws
