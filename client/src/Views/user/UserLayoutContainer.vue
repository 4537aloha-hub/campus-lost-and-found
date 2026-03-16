<script setup>
import { useUserStore } from '@/stores/modules/userstore';
import { onMounted } from 'vue';
import defaultAvatar from '@/assets/imgs/avatar.jpg';
import { useRouter, useRoute } from 'vue-router';
// 导入路由
const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
// 解构函数方法
const { FetUserInfo } = userStore;

onMounted(() => {
  FetUserInfo()
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
          <img :src="userStore.userInfo && userStore.userInfo.avatar ? userStore.userInfo.avatar : defaultAvatar" alt="">
        </div>
        <!-- 后续添加v-if 和 v-else效果 -->
        <div class="left" v-if="userStore.userInfo">
          <!-- 用户名 -->
          <div  class="name">
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
            <router-link to="/login?redirect=/userlayoutcontainer/userinfo">请先登录</router-link>
          </div>
        </div>
       </div>
      <!-- 我发布的物品招领 -->
      <el-menu-item index="/userlayoutcontainer/founditem">
        <span>我发布的</span>
      </el-menu-item>
      <!-- 我发布的物品遗失 -->
       <el-menu-item index="/userlayoutcontainer/lostitem">
        <span>我丢失的</span>
       </el-menu-item>
       <!-- 发起的会话 -->
       <el-menu-item index="/userlayoutcontainer/chatpage">
        <span>发起的会话</span>
       </el-menu-item>
      <el-menu-item index="/userlayoutcontainer/userinfo">
        <span>个人资料</span>
      </el-menu-item>
    </el-menu>
    </el-aside>
    <!-- 右侧内容区域 三级路由出口 -->
    <router-view></router-view>
  </el-container>
</template>
<style lang="scss" scoped>
.userlayout-container {
  box-sizing: border-box;
  max-width: 1240px;
  width: 100%;
  padding: 20px 0;
  margin: 0 auto;
  height: 100vh;
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
    }
    .num {
      font-size: 12px;
      color: rgb(96, 89, 89);
    }
  }
}
</style>
