<script setup>
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutNav from './components/LayoutNav.vue'
</script>

<template>

  <!-- 顶部用户栏 -->
  <LayoutNav />

  <!-- 主导航 -->
  <LayoutHeader />

  <!-- 页面内容 -->
  <main class="layout-main">
    <router-view />
  </main>

</template>

<style scoped lang="scss">

.layout-main {
  width: 100%;
}

</style>
