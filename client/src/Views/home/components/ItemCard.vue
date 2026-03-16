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

  <div class="tag">
    {{ item.typeText }}
  </div>

  <img :src="item.picture || defaultImg" alt="">

<div class="content">

  <p class="row">
    <span class="label">物品：</span>
    <span class="value">{{ item.title }}</span>
  </p>

  <p class="row">
    <span class="label">描述：</span>
    <span class="value desc">
      {{ item.description }}
    </span>
  </p>

  <p class="row">
    <span class="label">地点：</span>
    <span class="value">{{ item.location }}</span>
  </p>

  <p class="row">
    <span class="label">日期：</span>
    <span class="value">{{ timeFormat(item.created_at) }}</span>
  </p>

  <p class="row">
    <span class="label">联系：</span>
    <span class="value">{{ item.contact }}</span>
  </p>

  <p class="row">
    <span class="label">状态：</span>
    <span class="status">
      {{ item.statusText }}
    </span>
  </p>

</div>

</RouterLink>

</template>

<style scoped lang="scss">

.item-card{

  position:relative;
  display:block;
  border-radius:6px;
  overflow:hidden;
  background:#fff;
  transition:.25s;
  text-decoration:none;
  box-shadow:0 1px 4px rgba(0,0,0,.08);

  &:hover{
    transform:translateY(-4px);
    box-shadow:0 6px 16px rgba(0,0,0,.15);
}

}

.tag{

  position:absolute;
  top:8px;
  left:8px;
  background:rgba(156,64,64,.9);
  color:#fff;
  font-size:12px;
  padding:4px 10px;
  border-radius:4px;
}

img{

  width:100%;
  height:220px;
  object-fit:cover;
}

.content{
  padding:12px;
}

.row{
  display:flex;
  margin-bottom:6px;
  font-size:14px;
}

.label{
  width:70px;
  font-weight:600;
  color:#333;
  flex-shrink:0;
}

.value{
  flex:1;
  color:#555;
}

.status{
  flex:1;
  color:#d62828;
  font-weight:600;
}

.desc{
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

</style>
