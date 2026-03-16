<script setup>
// 引入socket.js中的connectSocket方法
import { connectSocket } from './utils/socket';
// 引入用户仓库
import {  useUserStore } from '@/stores/modules/userstore'

// 调用用户仓库
const userStore = useUserStore();

// 判断用户是否登录 如果登录了 获取用户id 创建socket连接
if(userStore.userInfo) {
  // 创建socket连接
  connectSocket(userStore.userInfo);
}
</script>

<template>
  <!-- 一级路由挂载点 -->
  <router-view></router-view>
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
}
</style>

<style scoped></style>
