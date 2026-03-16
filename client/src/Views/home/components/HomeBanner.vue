<script setup>
import { getBanners } from '@/api/home';
import { onMounted, ref } from 'vue';
const bannerData = ref([]);
const getbannerData = async () => {
  const res = await getBanners();
  console.log('轮播图数据', res);
  bannerData.value = res.data;
}
onMounted(()=>{
  getbannerData();
})
</script>
<template>
  <div class="home-banner">
    <div class="arrow-width">
      <el-carousel height="500px">
        <el-carousel-item v-for="item in bannerData" :key="item.id">
          <img :src="item.imgUrl" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<style scoped lang="scss">
.home-banner {
  width: 100%;
  height: 500px;
  margin: 0 auto;
  background: rgba(0, 0, 0,0.05);
  position: relative;

  .arrow-width {
    height: 500px;
    max-width: 1240px;
    height: 500px;
    margin: 0 auto;
  }

}
.home-banner img {
  display: block;
  width: 100%;
  height: 500px;
  object-fit: cover;
}
</style>
