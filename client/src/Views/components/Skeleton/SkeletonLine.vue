<script setup>
defineProps({
  w: { type: String, default: '100%' },
  h: { type: String, default: '14px' },
  radius: { type: Number, default: 4 },
})
</script>

<template>
  <div
    class="skeleton-line"
    :style="{
      width: w,
      height: h,
      borderRadius: radius + 'px',
    }"
   ></div>
</template>

<style scoped>
.skeleton-line {
  background: linear-gradient(90deg, #f2f2f2 25%, #eaeaea 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: flow 1.2s infinite linear;
}

@keyframes flow {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
