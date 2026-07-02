let ws = null

export const connectSocket = (userInfo) => {
  if (!userInfo) return

  if (ws) ws.close()

  const WS_URL = import.meta.env.VITE_WS_URL

  ws = new WebSocket(WS_URL)

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: 'login',
      userId: userInfo.id,
      avatar: userInfo.avatar,
      username: userInfo.username
    }))
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('收到消息', data)
  }
}

export const getSocket = () => ws
