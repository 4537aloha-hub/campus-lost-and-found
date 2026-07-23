<script setup>
import { useUserStore } from '@/stores/modules/userstore';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import defaultAvatar from '@/assets/imgs/avatar.jpg';
import { useRouter } from 'vue-router';

console.log(defaultAvatar);


const userStore = useUserStore();
// 解构函数方法
const { FetUserInfo } = userStore;

const router = useRouter();

// 将路由实例传递给函数，以便在函数中使用 跳转到对应页面
const onClaimCommand = (command) => {
  if (!command) return;
  router.push(command);
}

const onProfileCommand = (command) => {
  if (!command) return;
  router.push(command);
}

// 是否为移动端
const isMobile = ref(false);
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 480;
}

// 我的认领 下拉菜单是否可见
const claimVisible = ref(false);
// 个人中心 下拉菜单是否可见
const profileVisible = ref(false);

// 我的认领 下拉菜单可见性变化事件
const onClaimVisibleChange = (val) => { claimVisible.value = val }
// 个人中心 下拉菜单可见性变化事件
const onProfileVisibleChange = (val) => { profileVisible.value = val }

onMounted(async () => {
  // 初始化时 更新是否为移动端
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);

  // 初始化时 获取用户信息
  if (userStore.token && !userStore.userInfo) {
    try {
      await FetUserInfo()
    } catch (err) {
      console.error('UserLayoutContainer 获取用户信息失败:', err.message || err)
    }
  }
})

// 组件卸载时 移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile);
})

</script>
<template>
  <el-container class="userlayout-container">
    <!-- 侧边栏宽度 -->
    <el-aside width="200px">
    <!-- 菜单容器 -->
    <el-menu
    :default-active="$route.path"
    background-color="#F5FAFF"
    active-text-color="#4A6FA5"
    router
    >
      <!-- 用户基本信息 -->
       <div class="user-info-container">
        <div class="right">
          <!-- 查看userinfo是否有用户头像 有则显示 无则显示默认头像 -->
          <img
            :src="userStore.userInfo?.avatar === '/default-avatar.png' ? defaultAvatar
                : userStore.userInfo?.avatar"
          />
        </div>
        <!-- 后续添加v-if 和 v-else效果 -->
        <div class="left" v-if="userStore.userInfo">
          <!-- 用户名 -->
          <div class="name">
            <span>{{ userStore.userInfo.username }}</span>
          </div>
          <!-- 学号 -->
           <div class="num">
            <span>账号:</span>
            <span>{{ userStore.userInfo.student_id }}</span>
          </div>
        </div>
        <div class="left" v-else>
          <div class="name">
            <!-- 重定向回来时 携带token -->
            <router-link to="/login?redirect=/user/profile">
              点我去登录
            </router-link>
          </div>
        </div>
       </div>
      <!-- 我发布的物品招领 -->
      <el-menu-item index="/user/found">
        <span>我发布的</span>
      </el-menu-item>
      <!-- 我发布的物品遗失 -->
      <el-menu-item index="/user/lost">
       <span>我丢失的</span>
      </el-menu-item>
       <!-- 发起的会话 -->
      <el-menu-item index="/user/chats">
       <span>发起的会话</span>
      </el-menu-item>
      <template v-if="isMobile">
        <!-- 我的认领（下拉） -->
        <el-dropdown
        @command="onClaimCommand"
        trigger="click"
        placement="bottom-start"
        :teleported="true"
        @visible-change="onClaimVisibleChange"
        >
          <span class="el-dropdown-link">
            <span>我的认领</span>
            <el-icon style="margin-left:8px">
              <component :is="claimVisible ? 'ArrowUp' : 'ArrowDown'"></component>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="/user/claims/pending">待处理认领</el-dropdown-item>
              <el-dropdown-item command="/user/claims/history">历史记录</el-dropdown-item>
              <el-dropdown-item command="/user/claims/myclaims">我的认领</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 个人中心（下拉） -->
        <el-dropdown
        @command="onProfileCommand"
        trigger="click"
        placement="bottom-start"
        :teleported="true"
        @visible-change="onProfileVisibleChange"
        >
          <span class="el-dropdown-link">
            <span>个人中心</span>
            <el-icon style="margin-left:8px">
              <component :is="profileVisible ? 'ArrowUp' : 'ArrowDown'"></component>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="/user/profile">基本资料</el-dropdown-item>
              <el-dropdown-item command="/user/security">安全中心</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

      <template v-else>
        <el-sub-menu>
          <template #title>
            <span>我的认领</span>
          </template>
          <el-menu-item index="/user/claims/pending">
            <span>待处理认领</span>
          </el-menu-item>
          <el-menu-item index="/user/claims/history">
            <span>历史记录</span>
          </el-menu-item>
          <el-menu-item index="/user/claims/myclaims">
            <span>我的认领</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu>
          <template #title>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/security">
            <span>安全中心</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
    </el-aside>
    <!-- 右侧内容区域 三级路由出口 -->
      <main class="user-route-content">
        <router-view />
      </main>
  </el-container>
</template>
<style lang="scss" scoped>
.userlayout-container {
  box-sizing: border-box;
  max-width: 1240px;
  width: 100%;
  padding: 20px 0;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
  height: auto;
  display: flex;
}
.user-route-content {
  flex: 1;
  min-width: 0;
  display: flex;
}
// 侧边栏高度设置
:deep(.el-aside) {
  height: 100%;
}

:deep(.el-menu) {
  height: 100%;
}
// 侧边顶部用户样式调整
.user-info-container {
  display: flex;
  margin: 0 auto;
  padding: 5px 0;
  width: 200px;
  background:#ECF7FF;
  // 右侧头像大小调整
  .right{
    padding-left: 15px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 30px;
    }
  }
  // 左侧用户信息样式调整
  .left {
    display: flex;
    // 调整flex排列方向 垂直居中
    flex-direction: column;
    width: 120px;
    padding-left: 10px;
    margin: 0 auto;
    justify-content: center;
    gap: 2px;
    .name {
      font-size: 13px;
      color: #3b3a3a;
      font-weight: 600;
      a {
        color: #1d1717;
        text-decoration: none;
      }
    }
    .num {
      font-size: 12px;
      color: rgb(96, 89, 89);
    }
  }
}

@media (max-width: 768px) {
  .userlayout-container {
    padding: 16px;
  }

  :deep(.el-aside) {
    width: 180px !important;
  }

  .user-info-container {
    width: 180px;
    .right { padding-left: 10px; }
    .left { padding-left: 8px; }
  }

  .user-route-content :deep(.page-container) {
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .userlayout-container {
    flex-direction: column;
    padding: 10px;
    gap: 10px;
  }

  :deep(.el-aside) {
    width: 100% !important;
    height: auto;
    overflow-x: auto;
  }

  :deep(.el-menu) {
    display: flex;
    width: max-content;
    min-width: 100%;
    height: auto;
  }

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    padding: 0 12px;
  }

  .user-info-container {
    display: none;
  }

  .user-route-content {
    width: 100%;
  }

  .user-route-content :deep(.container),
  .user-route-content :deep(.user-claim-container),
  .user-route-content :deep(.chat-container),
  .user-route-content :deep(.page-container) {
    width: 100%;
    min-width: 0;
  }

  .user-route-content :deep(.user-info-container) {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
  }

  .user-route-content :deep(.user-info-container .top img) {
    width: 120px;
    height: 120px;
  }

  .user-route-content :deep(.user-info-container .bottom .item) {
    font-size: 16px;
  }

  .user-route-content :deep(.security) {
    width: 100%;
    margin: 12px;
  }

  .user-route-content :deep(.security-card) {
    padding: 16px;
  }

  .user-route-content :deep(.set-email) {
    width: 100%;
    padding: 32px 20px 48px;
    box-sizing: border-box;
  }

  .user-route-content :deep(.set-email-title) {
    margin-top: 28px;
    font-size: 20px;
  }

  .user-route-content :deep(.breadcrumb-container) {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .user-route-content :deep(.form),
  .user-route-content :deep(.el-form) {
    max-width: 100%;
    box-sizing: border-box;
  }

  .user-route-content :deep(.form .el-form-item),
  .user-route-content :deep(.el-form .el-form-item) {
    width: 100%;
    margin-right: 0;
  }

  .user-route-content :deep(.el-form .el-input) {
    width: 100% !important;
  }

  .el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 12px 20px;
  }
}
</style>
