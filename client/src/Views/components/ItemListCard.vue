<script setup>
import defaultImg from '@/assets/imgs/noItemImg.jpg'
// 引入日期格式化函数
import timeFormat from '@/utils/deteFormat.js'


defineProps({
  item:{
    type:Object,
    default:() => ({})
  }
})

</script>

<template>

  <RouterLink
    :to="`/detail/${item.type}/${item.id}`"
    class="item-card"
  >

    <img :src="item.picture || defaultImg" alt="">

  <div class="info">

    <p class="title">
    {{ item.title }}
    </p>

    <p class="row">
      <span class="label">日期:</span>
      <span class="value">{{ timeFormat(item.created_at) }}</span>
    </p>

    <p class="row">
      <span class="label">地点:</span>
      <span class="value">{{ item.location }}</span>
    </p>

    <p class="row">
      <span class="label">联系:</span>
      <span class="value">{{ item.contact }}</span>
    </p>

  </div>

  </RouterLink>

</template>

<style scoped>

.item-card{
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px;
  background:#fff;
  border-radius:6px;
  transition:.2s;
  text-decoration:none;
  box-shadow:0 1px 4px rgba(0,0,0,.08);
}

.item-card:hover{
  transform:translateY(-3px);
  box-shadow:0 6px 14px rgba(0,0,0,.15);
}

img{
  width:120px;
  height:120px;
  object-fit:cover;
  border-radius:4px;
}

.info{
  flex:1;
}

.title{
  font-size:16px;
  font-weight:600;
  color:#222;
}

.row{
  font-size:13px;
  color:#666;
}

.label{
  margin-right:6px;
  font-weight:600;
}

</style>
