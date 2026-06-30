<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/userstore'
import { addBanner, updateBanner } from '@/api/admin'
import request from '@/utils/request'

const emit = defineEmits(['success'])

const userStore = useUserStore()

const dialogVisible = ref(false)

// 用于存储本地上传的图片文件
const imageFile = ref(null)

const uploadBannerImageUrl = 'http://localhost:3000/upload/banner'

const defaultForm = {
  id: null,
  title: '',
  image_url: '',
  link_url: '',
  sort: 0,
  status: 1,
}

const formData = ref({ ...defaultForm })

const previewImg = ref('')

const resetForm = () => {
  formData.value = { ...defaultForm }
  previewImg.value = ''
  imageFile.value = null
}

const open = (row = {}) => {
  resetForm()

  if (row.id) {
    formData.value = {
      ...defaultForm,
      ...row,
    }

    previewImg.value = row.image_url
  }

  dialogVisible.value = true
}

defineExpose({
  open,
})

const onSelectBannerImageFile = (file) => {
  imageFile.value = file.raw

  if (previewImg.value && previewImg.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewImg.value)
  }

  previewImg.value = URL.createObjectURL(file.raw)
}

// 上传轮播图图片
const uploadBannerImage = async () => {
  if (!imageFile.value) {
    return formData.value.image_url
  }

  const formDataUpload = new FormData()

  formDataUpload.append('file', imageFile.value)

  const res = await request.post(uploadBannerImageUrl, formDataUpload, {
    headers: {
      Authorization: userStore.token,
      'Content-Type': 'multipart/form-data',
    },
  })

  if (res.status !== 0) {
    throw new Error(res.message)
  }

  return res.url
}

const submitForm = async () => {
  if (!formData.value.title.trim()) {
    return ElMessage.warning('请输入标题')
  }

  try {
    // 如果重新选择了图片，这里才上传
    if (imageFile.value) {
      formData.value.image_url = await uploadBannerImage()
    }

    if (!formData.value.image_url) {
      return ElMessage.warning('请上传图片')
    }

    if (formData.value.id) {
      await updateBanner(formData.value.id, formData.value)
      ElMessage.success('修改成功')
    } else {
      await addBanner(formData.value)
      ElMessage.success('新增成功')
    }

    dialogVisible.value = false

    emit('success')
  } catch (e) {
    ElMessage.error(e.message || '上传失败')
  }
}
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="formData.id ? '编辑轮播图' : '新增轮播图'" width="600">
    <el-form :model="formData" label-width="90">
      <el-form-item label="标题">
        <el-input v-model="formData.title" />
      </el-form-item>

      <el-form-item label="图片">
        <el-upload
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onSelectBannerImageFile"
        >
          <el-button type="primary"> 上传图片 </el-button>
        </el-upload>

        <img v-if="previewImg" :src="previewImg" class="upload-preview" />
      </el-form-item>

      <el-form-item label="链接">
        <el-input v-model="formData.link_url" />
      </el-form-item>

      <el-form-item label="排序">
        <el-input-number v-model="formData.sort" />
      </el-form-item>

      <el-form-item label="状态">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false"> 取消 </el-button>

      <el-button type="primary" @click="submitForm"> 保存 </el-button>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.upload-preview {
  width: 100%;
  margin-top: 12px;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  max-height: 220px;
  object-fit: cover;
}
</style>
