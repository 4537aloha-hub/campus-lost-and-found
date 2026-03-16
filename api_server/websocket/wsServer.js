import { WebSocketServer } from 'ws';

// 创建WebSocket服务器 端口3001
const wss = new WebSocketServer({ port: 3001 });
console.log('WebSocket服务器已启动端口为3001');

// 保存在线用户 一个对象
const onlineUsers = {};

wss.on('connection', (ws) => {
    console.log('客户端连接成功');
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // 用户上线
        if(data.type === 'login') {

            // 获取服务层 已登录用户的头像信息和用户名
            onlineUsers[data.userId] = {
                ws: ws,
                avatar: data.avatar,
                username: data.username,
            }
            console.log('用户上线', data.userId);
        }
    })
    ws.on('close', () => {

          // 检查用户是否在在线用户列表中 不在则清理
          for (const userId in onlineUsers) {
            if (onlineUsers[userId].ws === ws) {
                delete onlineUsers[userId]
            }
        }
        console.log('用户下线');
    })
})

export default {
    wss,
    onlineUsers,
}
