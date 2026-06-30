<script setup></script>
<template>
  <div class="user-claim-container">
    <!-- 二级路由出口 -->
    <router-view></router-view>
  </div>
</template>
<style scoped lang="scss">
.user-claim-container {
  background: #fff;
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  max-width: 1240px;
}
</style>
