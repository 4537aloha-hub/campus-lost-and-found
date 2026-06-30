<script setup>
import { useRouter } from "vue-router";
import { createSession } from "@/api/chat";
import { useUserStore } from "@/stores/modules/userstore";
import { computed } from "vue";
import defaultImg from '@/assets/imgs/noItemImg.jpg'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const userStore = useUserStore();

const isOwnItem = computed(() => props.item.user_id === userStore.userInfo?.id);

// 联系按钮
const handleSession = async () => {

  if (!userStore.token) {
    ElMessage.warning('请先登录, 在进行操作');
    return;
  }

  if (isOwnItem.value) {
    ElMessage.warning("不能对自己发布的物品进行操作");
    return;
  }
  const res = await createSession({
    item_id: props.item.id,
    target_user_id: props.item.user_id,
  });

  if (res.status === 0) {
    router.push({
      name: 'chatpage',
      query: { session_id: res.session_id },
    });
  }
};
</script>

<template>
  <div class="detail-page">
    <div class="detail-container">

      <div class="detail-main">

        <!-- 左侧图片 -->
        <div class="left">
          <img :src="item.picture || defaultImg"  alt="" />
        </div>

        <!-- 右侧 -->
        <div class="right">

          <h1 class="title">{{ item.title }}</h1>

          <div class="item-container">
            <div class="tags">
              <span class="lost">
                {{ item.type === "found" ? "失物招领" : "物品遗失" }}
              </span>
            </div>
          </div>

          <div class="info">
            <p>📍 丢失地点: {{ item.location || "未指定" }}</p>
            <p>🕒 丢失时间: {{ item.date }}</p>
          </div>

          <div class="contact">
            <p>📞 联系方式：{{ item.contact }}</p>
          </div>

          <div class="desc">
            <span>物品描述：</span>
            <span>{{ item.description }}</span>
          </div>

          <div class="actions">
            <el-button type="primary" @click="handleSession">
              {{ item.type === "found" ? "点击认领" : "联系失主" }}
            </el-button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-page {
  background: #f5f7fa;
  padding: 30px 0;
}

.detail-container {
  max-width: 1240px;
  margin: 0 auto;
}

.detail-main {
  display: flex;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.left {
  width: 420px;
  height: 420px;
  background: rgba(224, 225, 224, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.right {
  flex: 1;
  padding-top: 40px;
  padding-left: 100px;
  position: relative;
}

.title {
  font-size: 20px;
  margin-bottom: 10px;
}

.item-container {
  display: flex;

  .tags span {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
  }

  .lost {
    background: #fde2e2;
    color: #f56c6c;
  }
}

.desc {
  position: absolute;
  bottom: 40px;
  display: flex;
  flex-direction: column;

  :first-child {
    font-weight: 600;
    margin-bottom: 6px;
  }
}

.actions {
  position: absolute;
  bottom: 0;
  right: 10px;
}
</style>
