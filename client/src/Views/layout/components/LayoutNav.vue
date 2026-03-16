<script setup>
import { useUserStore } from '@/stores/modules/userstore'
import defaultAvatar from '@/assets/imgs/avatar.jpg'
import { onMounted } from 'vue'

const userStore = useUserStore()

const { FetUserInfo } = userStore

onMounted(() => {
  FetUserInfo()
})
</script>

<template>
  <nav class="top-nav">
    <div class="container">

      <ul class="user-area">

        <template v-if="userStore.userInfo">

          <li class="avatar">
            <img
              :src="userStore.userInfo.avatar ? userStore.userInfo.avatar : defaultAvatar"
              alt=""
            />
          </li>

          <li>
            <a href="">{{ userStore.userInfo.username }}</a>
          </li>

          <li>
            <a href="" @click.prevent="userStore.loginOut()">退出登录</a>
          </li>

        </template>

        <template v-else>

          <li>
            <a href="" @click.prevent="$router.push('/login')">登录</a>
          </li>

          <li>
            <a href="" @click.prevent="$router.push('/register')">注册</a>
          </li>

        </template>

      </ul>

    </div>
  </nav>
</template>

<style scoped lang="scss">
.top-nav {
  width: 100%;
  height: 50px;
  background: #2c3e50;

  .container {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;

    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
  }

  .user-area {
    display: flex;
    align-items: center;
    gap: 16px;

    li {
      list-style: none;
      display: flex;
      align-items: center;
    }

    a {
      color: #ecf0f1;
      text-decoration: none;
      font-size: 14px;

      &:hover {
        color: #00aeec;
      }
    }
  }

  .avatar img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>
