<script setup>
import { onMounted, ref, defineEmits } from 'vue'
// 导入获取聊天列表的接口
import { getSessionList, deleteSession } from '@/api/chat'
// 导入用户仓库
import { useUserStore } from '@/stores/modules/userstore';
// 导入路由
import { useRoute, useRouter } from 'vue-router'
// 使用路由
const router = useRouter()
const route = useRoute()
// 使用用户仓库
const userStore = useUserStore();

// 会话列表的值
let sessionList = ref([])
// 当前选中的会话
let selectedSessionId = ref('')

// 定义选择会话的点击事件 子传父
const emit = defineEmits(['select-session', 'delete-session'])

// 定义删除会话的点击事件 子传父

// 当前用户id
const currentUserId = userStore.userInfo.id



console.log('当前用户id', currentUserId);

// 点击事件 子传父 下方会话列表绑定该点击事件 一旦被点击就会触发该点击事件 然后传给父组件 ChatPage.vue
const handleClick = (item) => {
  // 设置当前选中的会话id
  selectedSessionId.value = item.session_id

  // 点击聊天列表的时候 同步更新URL
  router.replace({
    query:{
      session_id: item.session_id
    }
  })

  // 触发选择会话事件 并将选中的会话对象传递给父组件
  emit('select-session', item)
}

// 删除会话事件 子传父
const handleDelete = async (item) => {
  if (!item || !item.session_id) return

  try {
    await deleteSession(item.session_id)

    // 本地移除
    sessionList.value = sessionList.value.filter(session => session.session_id !== item.session_id)

    // 检查是否删除的是当前选中的会话
    let newSelected = null
    if (selectedSessionId.value === item.session_id) {
      const index = sessionList.value.findIndex(s => s.session_id === item.session_id)

      // 如果删除的是第一个会话 则将选中的会话设置为第二个会话
      // 如果删除的是最后一个会话 则将选中的会话设置为倒数第二个会话
      if (index > 0) {
        newSelected = sessionList.value[index - 1]
      } else if (index < sessionList.value.length - 1) {
        newSelected = sessionList.value[index + 1]
      }
      selectedSessionId.value = newSelected ? newSelected.session_id : ''

      // 更新URL
      if (newSelected) {
        router.replace({
          query: {
            session_id: newSelected.session_id
          }
        })
      } else {
        router.replace({
          query: {}
        })
      }
    }

    // 通知父组件更新当前会话
    emit('select-session', newSelected)

  } catch (err) {
    console.error('删除会话失败', err);
  }
}



// 获取会话列表
const fetcheSessionList = async () => {
  const res = await getSessionList();
  console.log('会话列表获取成功', res);
  sessionList.value = res.data

  // 获取从detail页面传递过来的session_id
  const sessionId = route.query.session_id

  // 如果sessionId存在
  if(sessionId) {
    // 则将sessionId设置给selectedSessionId
    selectedSessionId.value = Number(sessionId)

    // 1.查找sessionList中被选中(selectedSessionId)的会话并返回给session
    // 2. 而selectedSessionId的值由sessionId决定
    // 3. sessionId由detail页面传递过来的query参数(session_id)决定
    const session = sessionList.value.find(item => item.session_id === Number(sessionId))

    // 如果session存在 则触发select-session事件 通知父组件进行会话点击事件 并将session值传递给父组件
    if(session) {
      // 触发选择会话事件 并将选中的会话对象传递给父组件
      emit('select-session', session)
      // 触发删除会话事件 并将选中的会话对象传递给父组件
      emit('delete-session', session)
    }

  }
}

// 记录右键位置
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  session: null,
})

// 当前选中的会话对象
const handleRightClick = (e, item) => {
  contextMenu.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    session: item,
  }
}

// 点击空白区域 关闭右键菜单
window.addEventListener('click', () => {
  contextMenu.value.visible = false
})

onMounted(async() => {
  // 获取会话列表
  await fetcheSessionList();
})
</script>
<template>
        <!-- 聊天列表 -->
      <div class="chat-list" v-if="sessionList && sessionList.length > 0">
        <!-- 会话列表 -->
        <div v-for="item in sessionList" :key="item.session_id"
        @click="handleClick(item)"
        @contextmenu.prevent="handleRightClick($event, item)"
        >
          <div class="chat-item" :class="{ active: selectedSessionId === item.session_id}">
            <div class="avatar">
              <img :src="item.user1_id === currentUserId ? item.user2_avatar : item.user1_avatar" alt="">
            </div>
            <div class="info">
              <div class="user_name">{{ item.user1_id === currentUserId ? item.user2_name : item.user1_name }}</div>
              <div class="item_name">{{ item.item_title }}</div>
              <div class="last-message">{{ item.last_message }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-list" v-else>
        <div class="empty-chat-list">
          暂无聊天记录
        </div>
      </div>

      <!-- 右键菜单 -->
       <div
       v-if="contextMenu.visible"
       class="menu"
       :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
       >
        <div @click="handleDelete(contextMenu.session)">
          从消息列表中移除
        </div>
       </div>

</template>
<style scoped lang="scss">
.chat-list {
  width: 260px;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
  height: 100%;

  .empty-chat-list {
    padding: 40px 20px;
    text-align: center;
    color: #909399;
    font-size: 14px;
  }

  .chat-item {
    display: flex;
    padding: 15px 20px;
    cursor: pointer;
    border-bottom: 1px solid #f0f2f5;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 12px;

    &:hover {
      background-color: #f5f7fa;
    }

    &.active {
      background-color: #E5F2FF
    }

    .avatar {
      display: flex;
      align-items: center;
      gap: 10px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }

      span {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }
    }

    .info {
      flex: 1;
      min-width: 0;

      .item_name {
        font-size: 11px;
        font-weight: 400;
        color: #303133;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .last-message {
        font-size: 12px;
        color: #909399;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.menu {
  position: absolute;
  background-color: rgb(255, 255, 255, 0.7);
  border-radius: 4px;
  padding: 8px 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
