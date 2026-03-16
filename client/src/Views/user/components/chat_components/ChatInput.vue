<script setup>
// 导入发送消息的接口
import { sendMessage } from '@/api/chat'
import { ref, defineProps, defineEmits, computed } from 'vue'

// 获取父组件传递的session_id
const props = defineProps({
  sessionId: {
    type: Number,
    default: null
  }
})

// 定义emit事件(子组件通知父组件：我这边已经发送了消息你那边该更新消息列表了)
const emit = defineEmits(['send-success'])

// 定义formRef对象 用来提供发送消息的表单对象
const messageRef = ref({
  content: ''
})

// 定义编辑器引用对象
const editorRef = ref(null);
// 定义发送消息的函数
const handleInput = () => {
  // 从编辑器获取消息内容
  messageRef.value.content = editorRef.value.innerText;
}

//  定义发送消息的功能函数
//  点击发送时候，使用emit通知父组件MessageList组件，刷新消息列表
const handleSendMessage = async () => {

  const trimmedContent = messageRef.value.content.trim();


  if(!props.sessionId) {
    console.error('会话ID不能为空');
    return;
  }

  // 检查消息内容是否为空（包括trimmedContent）
  if(!messageRef.value.content || !trimmedContent) {
    console.error('消息内容不能为空');
    return;
  }

  const res = await sendMessage({
    session_id: props.sessionId,
    content: messageRef.value.content,
  })

  // 通知父组件，消息发送成功，传消息内容给父组件，父组件需要刷新消息列表
  emit('send-success', messageRef.value.content)

  console.log('发送消息成功，当前会话内容是:', res);

  // 清空输入框
  messageRef.value.content = '';
  // 清空编辑器内容
  editorRef.value.innerText = '';

  // 聚焦到编辑器，方便用户继续输入
  editorRef.value.focus()
}

// 定义发送按钮是否禁用的计算属性 trim()是关键, 不然空格也会被认为是内容
const isDisabled = computed(() => {
  return !messageRef.value.content.trim()
})

</script>
<template>
  <div class="chat-input">
    <!-- 聊天输入框 -->
    <div class="editor"
    contenteditable="true"
    ref="editorRef"
    @input="handleInput"
    @keyup.enter.exact.prevent="handleSendMessage"
    >
    </div>
    <!-- 发送按钮 -->
    <button class="send-btn"
    @click="handleSendMessage"
    :disabled="isDisabled"
    >发送</button>
  </div>
</template>
<style scoped lang="scss">
.chat-input {
  position: relative;
  .editor {
  min-height: 150px;
  max-height: 300px;
  padding: 8px;
  border-top: 1px solid #ddd;
  border-radius: 6px;
  overflow-y: auto;
  outline: none;
}

// 输入框为空时显示 placeholder
.editor:empty::before {
  content: '请输入消息...';
  color: #999;
}

button {
  position: absolute;
  right: 20px;
  bottom: 10px;
  width: 80px;
  height: 36px;
  background: #12B7F5;
  border: none;
  border-radius: 15px;
  cursor: pointer;
}
}
</style>

