<script setup>
import { ref, onMounted } from "vue";
// 导入路由
import { useRouter, useRoute } from "vue-router";
import { getItemDetail } from "@/api/home";
// 导入创建聊天 session 接口
import { createSession } from '@/api/chat'
// 注册路由
const route = useRoute();
const router = useRouter()
// 物品详情数据
const item = ref(null)

// 点击认领/联系失主按钮 创建会话的点击事件
const handleSessio = async () => {
  const res = await createSession({
    item_id: route.params.id,
    target_user_id: item.value.user_id,
  })
  console.log('会话创建结果:',res);
  // 创建成功后跳转到聊天页面
  if(res.status === 0){
    // 如果会话原本存在 则直接跳转到对应物品的聊天窗口
    // 如果会话不存在则 创建会话 并跳转到对应物品的聊天窗口
    router.push({
      path: '/userlayoutcontainer/chatpage',
      query: {
        session_id: res.session_id,
      }
    })
  }
}

const getItemData = async () => {
  const res = await getItemDetail(route.params.id)
  console.log('详情数据', res)
  item.value = res
}

onMounted(() => {
  getItemData()
})

</script>
<template>
  <div class="detail-page">
    <div class="detail-container">
      <!-- 如果物品不存在，显示错误信息 -->
      <div v-if="!item" class="error-message">
        <h2>物品不存在</h2>
        <p>抱歉，您查找的物品信息不存在。</p>
        <router-link to="/home">返回首页</router-link>
      </div>

      <!-- 物品存在时显示详情 -->
      <div v-else>
        <!-- 失物招领详情页 -->
         <!-- 物品详细描述 补充信息 -->
        <div class="detail-main">
          <!-- 左半部分 图片区域 -->
           <div class="left">
            <img :src="item.picture">
           </div>
           <div class="right">
            <!-- 丢失物品名称 -->
            <h1 class="title" :title="item.title">{{ item.title }}</h1>
            <div class="item-container">
              <!-- 丢失物品 或 物品遗失 -->
              <div class="tags">
                <span class="lost">{{ item?.type === 'found' ? '失物招领' : '物品遗失' }}</span>
              </div>
              <!-- 物品是否已经被认领的状态 -->
              <div class="item-status" v-if="isFound">
                <span class="status">{{ FoundItems.status === 'claimed' ? '已被认领' : '未被认领' }}</span>
              </div>
            </div>
            <!-- 丢失物品信息 -->
            <div class="info">
              <p>📍 丢失地点: {{ item?.location || '未指定' }}</p>
              <p>🕒 丢失时间: {{ item?.date }}</p>
            </div>
            <!-- 联系方式 -->
             <div class="contact">
              <p>📞 联系方式：{{ item?.contact }}</p>
             </div>
            <!-- 物品描述 -->
            <div class="desc">
              <h4>物品描述：</h4>
              <p>{{ item?.description }}</p>
            </div>
            <!-- 在线联系 -->
             <div class="actions" v-if="isFound">
              <el-button type="primary">我要认领</el-button>
             </div>
             <div class="actions" v-else>
              <el-button type="primary" @click="handleSessio">{{ item?.type === 'found' ? '点击认领' : '联系失主' }}</el-button>
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.detail-page {
  background:#f5f7fa;
  padding: 30px 0;
}

.detail-container {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;

  .error-message {
    text-align: center;
    padding: 50px 20px;
    background: #fff;
    border-radius: 8px;

    h2 {
      color: #666;
      margin-bottom: 20px;
    }

    p {
      color: #999;
      margin-bottom: 30px;
    }

    a {
      color: #409eff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .detail-main {
    display: flex;
    background: #fff;
    padding: 20px;
    border-radius: 8px;

  // 左半部分
  .left {
    width:420px;
    height:420px;
    background: rgb(224, 225, 224, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    // 图片自适应
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  // 右半部分
  .right {
    flex: 1;
    padding-top: 39.98px;
    padding-left: 100px;
    position: relative;

    // 标题样式
    .title {
        font-size: 20px;
        margin-bottom: 10px;
      }

    .item-container {
      display: flex;
      // 标签样式
      .tags {
        // tags span样式
        span {
          display: inline-block;
          padding:4px 10px;
          margin-right: 8px;
          border-radius: 12px;
          font-size: 12px;
        }

      // 状态标签样式
      .lost {
          background:#fde2e2;
          color: #f56c6c;
        }
      }
      .item-status {
        span {
          display: inline-block;
          padding:4px 10px;
          margin-right: 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .status {
          background-color: #bcf2ca;
          color: #52859b;
        }
      }
    }

    // 物品描述样式
    .desc {
      position: absolute;
      bottom: 40px;
    }

    // 交互按钮样式
    .actions {
        position: absolute;
        bottom: 0;
        right: 10px;
      }
    }
  }
}
</style>
