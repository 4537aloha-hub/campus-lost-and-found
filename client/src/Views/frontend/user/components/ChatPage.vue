<script setup>
// 导入聊天列表组件
import ChatList from '@/Views/frontend/user/components/chat_components/ChatList.vue'
import ChatWindow from '@/Views/frontend/user/components/chat_components/ChatWindow.vue'
import {ref, computed} from 'vue'
import { useUserStore } from '@/stores/modules/userstore'

const userStore = useUserStore()
// 当ChatList组件触发handleSelectSession事件时，将session对象的值传递给父组件(ChatPage.vue)

// 子组件(ChatWindow.vue)又绑定了currentSession属性，当父组件(ChatPage.vue)的currentSession值发生变化时，子组件(ChatWindow.vue)也会更新
const currentSession = ref(null)

// session值来自子组件ChatList点击事件传过来的item值
const handleSelectSession = (session) => {
  console.log('会话被选中', session);
  // 将ChatList组件触发的session对象传递给currentSession属性，从而更新ChatWindow组件的会话信息
  currentSession.value = session
}

// 删除会话事件 子传父
const handleDeleteSession = (session_id) => {
  console.log('会话被删除', session_id);
}

</script>
<template>
  <div  v-if="!userStore.token" class="empty-box">
    <el-empty description="请先登录后再使用聊天功能" />
  </div>

  <div v-else class="chat-container">
    <div class="chat-header">
      <div class="header-title"></div>
      <div class="header-actions">
      </div>
    </div>
    <div class="chat-body">
    <!-- 聊天列表组件区域 -->
     <!-- ChatList 子组件 -->

    <ChatList @select-session="handleSelectSession" @delete-session="handleDeleteSession" />
    <!-- 聊天窗口组件区域 -->
    <ChatWindow :current-session="currentSession" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-container {
  width: 100%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;

  .chat-header {
    height: 38px;
    background:#fff;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    .header-title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
    }
  }

  .chat-body {
    flex: 1;
    display: flex;
    overflow: hidden;

  }
}
.empty-box {
  width: 100%;
  max-height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 480px) {
  .chat-container {
    min-height: calc(100vh - 210px);
    .chat-body {
      position: relative;
    }
  }
}
</style>
