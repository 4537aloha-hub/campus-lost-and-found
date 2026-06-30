<script setup>

defineProps({
  title:String
})

</script>

<template>

  <div class="home-panel">
    <div class="panel-header">
      <h2>{{ title }}</h2>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

.home-panel{
  margin:40px auto;
  max-width:1200px;
}

.panel-header{
  margin-bottom:20px;
}

.panel-header h2{
  font-size:22px;
  font-weight:600;
}

.panel-body{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:20px;
}

</style>
