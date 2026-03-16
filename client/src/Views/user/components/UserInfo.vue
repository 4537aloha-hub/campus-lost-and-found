<script setup>
import { useUserStore } from '@/stores/modules/userstore';
import defaultAvatar from '@/assets/imgs/avatar.jpg';

const userStore = useUserStore();

</script>
<template>
  <div class="container">
    <div class="user-info-container" v-if="userStore.userInfo">
    <!-- 顶部头像区 -->
    <div class="top" @click="handleEditAvatar">
      <img :src="userStore.userInfo.avatar || defaultAvatar" alt="用户头像">
      <!-- 顶部用户名区 -->
      <div class="name">
        <span>用户名:</span>
        <span>{{ userStore.userInfo.username }}</span>
      </div>
    </div>
    <!-- 底部用户信息区 -->
    <div class="bottom">
      <div class="userinfo-box">
      <div class="num">
        <span>学号:</span>
        <span>{{ userStore.userInfo.student_id }}</span>
      </div>
      <div class="grade">
        <span>年级:</span>
        <span>{{ userStore.userInfo.grade }}</span>
      </div>
      <div class="major">
        <span>专业:</span>
        <span>{{ userStore.userInfo.major }}</span>
      </div>
      </div>
    </div>
  </div>
  <div class="user-info-container" v-else>
    <div class="bottom">
      <div class="name">
        <span>请先登录</span>
      </div>
    </div>
  </div>
    <!-- 按钮区 -->
     <!-- 修改密码 -->
    <div class="buttons">
      <RouterLink to="updatepassword" class="button">修改密码</RouterLink>
    </div>
    <!-- 修改资料 -->
    <div class="buttons">
      <RouterLink to="edituserinfo" class="button">修改资料</RouterLink>
    </div>
</div>
</template>
<style lang="scss" scoped>
.container {
  background: #fff;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1240px;
   .user-info-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 500px;
      margin: 0 auto;
      padding: 20px;

      .top {
        text-align: center;
        margin-bottom: 20px;
        img {
          width: 100px;
          height: 100px;
          border-radius: 140px;
        }

        .name {
          margin-top: 10px;
          font-size: 16px;
          font-weight: bold;
        }
      }

      .bottom {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .userinfo-box {
          // 用户信息左侧对齐
          justify-content: flex-start;

        .num {
          margin-bottom: 20px;
          font-size: 14px;
          color: #666;
        }
        .grade {
          margin-bottom: 20px;
          font-size: 14px;
          color: #666;
        }
        .major {
          margin-bottom: 20px;
          font-size: 14px;
          color: #666;
        }
        }
      }
    }

  .buttons {
    margin-right: 10px;
      .button {
        font-size: 12px;
        background-color: #fff;
        text-decoration: none;
        color: #000;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      &:hover {
        color: #85afd2;
      }
    }
  }
}
</style>

