<script setup>
// 导入所需要的组合式API
import { defineProps, onMounted, watch, ref, nextTick } from 'vue'

// 接收来自父组件ChatWindow.vue传递过来的message列表值
const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})

// 消息列表DOM元素引用
const chatBodyRef = ref(null);

// 消息列表滚动到最底部
const scrollToBottom = async() => {
  // 等待DOM更新完成
  await nextTick();
  // 获取到当前消息列表的DOM元素
  const el = chatBodyRef.value;
  // 如果元素存在，将滚动条滚动到最底部 避免空值错误
  if(el) {
    // 滚动条滚动到最底部 将当前DOM元素的值设置为滚动高度
    el.scrollTop = el.scrollHeight;
  }
}

watch(
  // 第一个监听 监听messages数组长度变化
  () => props.messages.length,

  // 第二个监听 当messages数组长度变化时，调用scrollToBottom函数 确保滚动到最底部
  () => {
    scrollToBottom();
  }
)

onMounted(() => {
  console.log('message的值:', props.messages);
})
</script>
<template>
  <div class="chat-window">

    <div class="chat-body" ref="chatBodyRef">

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="msg.isMine ? 'mine' : 'other'"
      >

        <!-- 对方 -->
        <template v-if="!msg.isMine">
          <img class="avatar" :src="msg.avatar" />

          <div class="msg-content">
            <div class="username">{{ msg.username }}</div>

            <div class="bubble">
              {{ msg.content }}
            </div>
          </div>
        </template>

        <!-- 自己 -->
        <template v-else>

          <div class="msg-content mine-content">
            <div class="username">{{ msg.username }}</div>

            <div class="bubble">
              {{ msg.content }}
            </div>
          </div>

          <img class="avatar" :src="msg.avatar" />
        </template>

      </div>

    </div>

  </div>
</template>
<style scoped lang="scss">
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #fff;

  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
}

/* 滚动条 */
.chat-body::-webkit-scrollbar {
  width: 6px;
}

.chat-body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

/* 消息行 */
.message {
  display: flex;
  margin-bottom: 18px;
}

/* 对方 */
.message.other {
  justify-content: flex-start;
}

/* 自己 */
.message.mine {
  justify-content: flex-end;
}

/* 头像 */
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

/* 内容区 */
.msg-content {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
}

/* 自己消息内容 */
.mine-content {
  align-items: flex-end;
}

/* 用户名 */
.username {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

/* 气泡 */
.bubble {
  position: relative;
  max-width: 260px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  word-break: break-word;
}

/* 对方气泡 */
.other .bubble {
  background: white;
  border: 1px solid #e4e4e4;
}

/* 自己气泡 */
.mine .bubble {
  background: #12B7F5;
  color: white;
}
</style>
