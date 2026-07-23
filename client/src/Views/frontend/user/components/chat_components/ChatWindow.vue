<script setup>
// 导入消息列表组件
import MessageList from './MessageList.vue'
// 导入聊天输入组件
import ChatInput from './ChatInput.vue'
import { ref, watch, defineProps, onMounted, onUnmounted } from 'vue'
// 调用获取聊天记录的接口
import {  getMessage } from '@/api/chat'
// 调用用户仓库
import { useUserStore } from '@/stores/modules/userstore'
// 导入socket.js
import { getSocket } from '@/utils/socket'
// 调用认领物品接口
import { applyClaim } from '@/api/user'
// 引入element-plus的message组件
import { ElMessage, ElMessageBox } from 'element-plus'
import defaultItem from '@/assets/imgs/noItemImg.jpg'
// 引入 等待WebSocket连接建立
import { waitSocket } from '@/utils/socket'

const userStore = useUserStore()
// 获取当前登录的用户id
const currentUserId = userStore.userInfo.id
// 定义一个空消息列表 负责接收消息
const messages = ref([])

// 接收来自父组件(ChatPage.vue)的currentSession
const props = defineProps({
  currentSession: {
    // 类型对象
    type: Object,
    // 默认为空对象
    default: () => null
  }
})

// 接收来自子组件emit提交过来的消息
// const handleSendSuccess = (content) => {
//   messages.value.push({
//     sender_id: currentUserId,
//     content: content,
//     avatar: userStore.userInfo.avatar,
//     isMine: true,
//   })
// }

// 认领物品
const handleClaim = async () => {
  try {
    await ElMessageBox.confirm('经过双方确认，是否要申请认领物品吗？', '认领物品', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await applyClaim(props.currentSession.item_id)
    ElMessage.success('认领物品成功')
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message || '认领失败')
    }
  }
}

// watch监听currentSession的变化，当currentSession值发生变化时，执行回调函数
watch(() => props.currentSession, async (newSession) => {
  if(!newSession) {
    messages.value = []
    return
  }
  console.log('currentSession 变化了', newSession);

  const res = await getMessage({
    // 将ChatPage.vue传递的session_id值传递给getMessage接口
    session_id: newSession.session_id,
  })

  // 将接口返回的消息列表赋值给message
  messages.value = res.data.map(msg => ({
    ...msg,
    // 添加一个isMine属性，判断消息是发送方还是接收方
    isMine: msg.sender_id === currentUserId,
  }))
  },
  // 开启立即执行模式
  {
    immediate: true,
  }
)

//
let handler = null
// Websocket服务器推送
const webSocketMessagePush = () => {

  const ws = getSocket()

  if(!ws){
    console.log('WebSocket未连接')
    return
  }


  handler = (event)=>{

    console.log('收到WebSocket消息');
    console.log(event.data);

    const data = JSON.parse(event.data)


    // 判断是不是聊天消息
    if(data.type === 'new_message'){

          console.log("当前session:", props.currentSession?.session_id);
          console.log("收到session:", data.session_id);


      // 判断是不是当前聊天窗口
      if(
        props.currentSession &&
        data.session_id === props.currentSession.session_id
      ){

        console.log("开始更新消息列表");

        messages.value.push({

          sender_id:data.sender_id,

          content:data.content,

          avatar:data.avatar,

          username:data.username,

          isMine:data.sender_id === currentUserId

        })

      }

    }

  }


  ws.addEventListener(
    'message',
    handler
  )
}

// 移除监听 当离开一个聊天窗口时候 销毁离开聊天窗口的监听
// 避免一个消息触发多次 使用场景:(如果用户多次切换聊天窗口)
const removeWebSocketListener = () => {
  const ws = getSocket()
  // 移除监听服务器推送的消息
  ws.removeEventListener('message', handler)
}

// 生命周期 页面加载时监听
onMounted(async () => {
  // 页面加载时，调用webSocketMessagePush函数 接收消息
  const ws = await waitSocket()

  console.log('WebSocket连接已建立，开始监听消息推送', ws);

  webSocketMessagePush(ws)
})

// 生命周期 离开页面时移除监听
onUnmounted(() => {
  // 页面卸载时，调用removeWebSocketListener函数 移除监听
  removeWebSocketListener()
})
</script>
<template>
      <!-- 聊天窗口 -->
      <div class="chat-window">
        <!-- 聊天窗口头部展示物品的信息 -->
        <template v-if="currentSession">
          <div class="chat-item-info">
            <img :src="currentSession.item_picture || defaultItem" alt="" />
            <div class="item-title">
              {{ currentSession.item_title }}
            </div>
            <button @click="handleClaim" class="claim-btn">认领物品</button>
          </div>
        </template>
        <template v-else>
          <div class="chat-item-info">
            <div class="item-title">
              暂无物品信息
            </div>
          </div>
        </template>

      <!-- 消息列表 -->
      <MessageList
      :messages="messages"
      />
      <!-- 聊天输入框 -->
      <ChatInput
      :session-id="currentSession?.session_id"
      />
      </div>
</template>
<style scoped lang="scss">
    .chat-window {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #fff;

      .chat-item-info {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 20px;
        border-bottom: 1px solid #e4e7ed;
          img {
          width: 40px;
          height: 40px;
        }
        .item-title {
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
        .claim-btn {
          border: none;
          background-color: transparent;
          color: #303133;
          margin-left: auto;
          cursor: pointer;
        }
        .claim-btn:hover {
          color: #409eff;
        }
      }
    }

</style>
