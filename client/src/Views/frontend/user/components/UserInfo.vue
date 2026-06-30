<script setup>
import { useUserStore } from '@/stores/modules/userstore'
import defaultAvatar from '@/assets/imgs/avatar.jpg'
import { ref, computed } from 'vue'

const userStore = useUserStore()

// 定义loading状态
const loading = computed(() => !userStore.userInfo)
</script>
<template>
  <div class="container">
    <div class="user-info-container" v-if="userStore.userInfo">
      <!-- 顶部头像区 -->
      <div class="top" @click="handleEditAvatar">
        <img
          :src="
            userStore.userInfo?.avatar === '/default-avatar.png'
              ? defaultAvatar
              : userStore.userInfo?.avatar
          "
        />
      </div>
      <!-- 底部用户信息区 -->
      <div class="bottom">
        <div class="item">
          <span class="label">用户名:</span>
          <span class="value">{{ userStore.userInfo.username }}</span>
        </div>

        <div class="item">
          <span class="label">学号:</span>
          <span class="value">{{ userStore.userInfo.student_id }}</span>
        </div>

        <div class="item">
          <span class="label">年级:</span>
          <span class="value">{{ userStore.userInfo.grade || '未填写' }}</span>
        </div>

        <div class="item">
          <span class="label">专业:</span>
          <span class="value">{{ userStore.userInfo.major || '未填写' }}</span>
        </div>
      </div>
    </div>
    <div class="empty-box" v-else>
      <el-empty description="请先登录" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background: #fff;
  display: flex;
  position: relative;
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
        width: 200px;
        height: 200px;
        border-radius: 140px;
      }
    }

    .bottom {
      width: fit-content;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin-top: 15px;

      .item {
        display: flex;
        align-items: center;
        font-size: 20px;
      }

      // 左边字段
      .label {
        width: 80px;
        color: #909399;
        font-weight: 600;
      }

      // 右边内容
      .value {
        color: #303133;
        font-weight: 500;
      }
    }
  }

  .button-container {
    position: absolute;
    right: 0;
    top: 5px;
    display: flex;
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

  .empty-box {
    width: 100%;
    max-height: 100%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
