<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getHomeBanner,
  deleteBanner,
  updateBannerStatus,
} from '@/api/admin'
import BannerDialog from './componenets/BannerDialog.vue'

const linkUrl = {
  null: '无链接',
}

const BannerDialogVisible = ref()

const banners = ref([])

const  previewImage = ref('')

const previewVisible = ref(false)

const loadBanners = async () => {
  const res = await getHomeBanner()

  if (res.status === 0) {
    banners.value = res.data
  }
}

const openAddDialog = () => {
  BannerDialogVisible.value.open()
}

const openEditDialog = (item) => {
  BannerDialogVisible.value.open(item)
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除该轮播图吗？', '提示')

  await deleteBanner(id)

  ElMessage.success('删除成功')

  loadBanners()
}

const handleStatusChange = async (item) => {
  await updateBannerStatus(item.id, item.status)

  ElMessage.success('状态修改成功')
}

const preview = (url) => {
  previewImage.value = url

  previewVisible.value = true
}

const onBannerSuccess = () => {
  loadBanners()
}

onMounted(loadBanners)
</script>

<template>
  <div class="banner-page">
    <div class="header">
      <div>
        <h2>轮播图管理</h2>

        <p>首页轮播图配置</p>
      </div>

      <el-button type="primary" @click="openAddDialog"> 新增轮播图 </el-button>
    </div>

    <div class="banner-list">
      <div class="banner-card" v-for="item in banners" :key="item.id">
        <div class="image-box">
          <img :src="item.image_url" @click="preview(item.image_url)" />

          <div class="mask">
            <el-button size="small" @click="preview(item.image_url)"> 查看 </el-button>
          </div>
        </div>

        <div class="content">
          <h3>{{ item.title }}</h3>

          <div class="info">
            <span> 排序：{{ item.sort }} </span>

            <el-tag :type="item.status ? 'success' : 'info'">
              {{ item.status ? '显示' : '隐藏' }}
            </el-tag>
          </div>

          <div class="link">
            {{ linkUrl[item.link_url] }}
          </div>

          <div class="footer">
            <el-switch
              v-model="item.status"
              :active-value="1"
              :inactive-value="0"
              @change="() => handleStatusChange(item)"
            />

            <div>
              <el-button type="primary" plain @click="openEditDialog(item)"> 编辑 </el-button>

              <el-button type="danger" plain @click="handleDelete(item.id)"> 删除 </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 轮播图弹窗 -->
  <BannerDialog
  ref="BannerDialogVisible"
  @success="onBannerSuccess"
  />
<!-- 图片预览弹窗 -->
<el-dialog v-model="previewVisible" width="900">
  <img :src="previewImage" style="width: 100%" />
</el-dialog>
</template>

<style scoped lang="scss">
.banner-page {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;

  h2 {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    color: #303133;
  }

  p {
    margin-top: 8px;
    color: #909399;
    font-size: 14px;
  }
}

.banner-list {
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));

  gap: 26px;

  align-items: start;
}

.banner-card {
  background: #fff;

  border-radius: 14px;

  overflow: hidden;

  border: 1px solid #ebeef5;

  transition: all 0.3s;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  display: flex;

  flex-direction: column;
}

.banner-card:hover {
  transform: translateY(-6px);

  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.12);
}

.image-box {
  position: relative;

  width: 100%;

  aspect-ratio: 16 / 9;

  overflow: hidden;

  background: #f5f7fa;
}

.image-box img {
  width: 100%;

  height: 100%;

  object-fit: cover;

  transition: 0.45s;

  cursor: pointer;
}

.banner-card:hover img {
  transform: scale(1.08);
}

.mask {
  position: absolute;

  inset: 0;

  display: flex;

  justify-content: center;

  align-items: center;

  background: rgba(0, 0, 0, 0.35);

  opacity: 0;

  transition: 0.3s;
}

.banner-card:hover .mask {
  opacity: 1;
}

.mask .el-button {
  border-radius: 18px;
}

.content {
  padding: 18px;

  display: flex;

  flex-direction: column;
}

.content h3 {
  margin: 0 0 14px;

  font-size: 18px;

  font-weight: 600;

  color: #303133;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;
}

.info {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 14px;

  font-size: 14px;

  color: #606266;
}

.link {
  color: #909399;

  font-size: 13px;

  margin-bottom: 20px;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

  min-height: 20px;
}

.footer {
  margin-top: auto;

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 12px;
}

.footer > div {
  display: flex;

  gap: 8px;
}

.footer .el-button {
  border-radius: 8px;

  padding: 8px 18px;
}

:deep(.el-dialog__body img) {
  border-radius: 10px;
}

@media (max-width: 1200px) {
  .banner-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .banner-page {
    padding: 16px;
  }

  .header {
    flex-direction: column;

    align-items: flex-start;

    gap: 16px;
  }

  .banner-list {
    grid-template-columns: 1fr;
  }
}
</style>
