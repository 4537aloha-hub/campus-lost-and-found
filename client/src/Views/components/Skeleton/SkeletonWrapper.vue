<!-- 骨架屏包裹组件 -->
<script setup>
defineProps({
  loading: Boolean
})
</script>

<template>
  <slot v-if="!loading"></slot>

  <template v-else>
    <slot name="skeleton"></slot>
  </template>
</template>
