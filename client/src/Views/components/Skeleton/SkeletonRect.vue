<script setup>
defineProps({
  w: { type: String, default: '100%' },
  h: { type: String, default: '160px' },
  radius: { type: Number, default: 8 },
  circle: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="skeleton-rect"
    :style="{
      width: w,
      height: h,
      borderRadius: circle ? '50%' : radius + 'px',
    }"
  ></div>
</template>

<style scoped>
.skeleton-rect {
  background: linear-gradient(90deg, #f2f2f2 25%, #eaeaea 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: flow 1.2s infinite linear;
}

@keyframes flow {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
