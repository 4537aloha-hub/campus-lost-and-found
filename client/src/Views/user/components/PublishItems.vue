<script setup>
// 发布物品接口的导入
import { ref, onMounted, defineEmits } from 'vue'
import { publishItem } from '@/api/user'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
// 获取物品详细 用于对弹窗的数据回显(编辑功能)
import { getItemDetail } from '@/api/home'
// 导入编辑/更新物品信息接口
import { editItem } from '@/api/user'
// 导入分类仓库
import { useCategoryStore } from '@/stores/modules/categorydata'
// 导入用户仓库
import { useUserStore } from '@/stores/modules/userstore'

const categoryStore = useCategoryStore()
const userStore = useUserStore()

// 从分类仓库解构需要需要的数据
const {
  categories,
  subCategories
}= storeToRefs(categoryStore)

// 从分类仓库解构需要的方法
const {
  getCategories,
} = categoryStore

// 定义emit 用于子组件发布成功后通知父组件刷新数据
const emit = defineEmits(['success'])

// 提供一个分类列表
const categoryValue = ref()

// 图片上传
const uploadUrl = 'http://localhost:3000/upload'

// 本地图片回显
const previewImg = ref('')
const onSelectFile = (file) => {
  // 避免内存泄露 及时释放资源
  if (previewImg.value) {
    URL.revokeObjectURL(previewImg.value)
  }
  // 创建图片地址
  previewImg.value = URL.createObjectURL(file.raw)
}
// 处理图片上传成功
const handleAvatarSuccess = (res) => {
  console.log('token的值:',userStore.token);

  console.log('上传图片成功返回', res);
  form.value.picture = res.url
}

// 提供表单数据
const form = ref({
  title: '',
  description: '',
  contact: '',
  picture: '',
  location: '',
  type: '', //found lost
  category_id: '',
  sub_category_id: '',
})

// 给formRef赋值(这个值是formRef.value)
const formRef = ref()
//
const submitForm = async() => {

    console.log('点击发布')
    console.log('表单:', form.value)

  // 赋值分类id和子分类id

  if(!categoryValue.value || categoryValue.value.length !== 2){
    ElMessage.warning('请选择完整分类')
    return
  }

  // 分类id的值存在 进行赋值
  form.value.category_id = categoryValue.value[0]
  form.value.sub_category_id = categoryValue.value[1]

  // 如果存在物品id 则是编辑功能
  if(form.value.id){
    try {
      // 调用编辑/更新物品信息接口 更新物品信息 传入当前物品id和表单数据到接口中
      const res = await editItem(form.value.id, form.value)

      // 如果状态码不是0 则发布失败 返回错误信息
      if(res.status !== 0){
        ElMessage.error(res.message)
        return
      }
      // 更新物品信息成功 关闭弹窗 刷新物品列表
      ElMessage.success('更新成功')
      dialogVisible.value = false

      // 通知父组件刷新物品列表
      emit('success', 'edit')

    }catch (error){
      console.error('更新物品失败:', error)
      ElMessage.error('更新失败')
    }

  }else{
      try {
        // 调用发布物品接口 发布物品
        const res =  await publishItem(form.value)

        console.log('接口返回:', res)
        console.log('提交数据:', JSON.stringify(form.value))

        // 如果状态码不是0 则发布失败 返回错误信息
        if(res.status !== 0){
          ElMessage.error(res.message)
          return
        }
        // 发布成功 关闭弹窗 刷新物品列表
        ElMessage.success('发布成功')
        dialogVisible.value = false

        // 通知父组件刷新物品列表
        emit('success', 'add')
      } catch (error) {
          console.error('发布物品失败:', error)
          ElMessage.error('发布失败')
      }
  }




  // 清空表单数据
  form.value = {
    title: '',
    description: '',
    contact: '',
    picture: '',
    location: '',
    type: '', //found lost
    category_id: '',
    sub_category_id: '',
  }
  // 清空本地图片回显列表
  previewImg.value = ''
}

// 取消按钮功能
const cancelForm = () => {
  // 清空表单数据
  form.value = {
    title: '',
    description: '',
    contact: '',
    picture: '',
    location: '',
    type: '', //found lost
    category_id: '',
    sub_category_id: '',
  }
  // 清空本地图片回显列表
  previewImg.value = ''
  // 关闭弹窗
  dialogVisible.value = false
}


// 定义弹窗显示状态 初始值为false
const dialogVisible = ref(false)
// 定义open方法 (用于给父组件(FoundItem/LostItem)调用 负责弹窗的关闭和打开)
const open = async (row) => {
  dialogVisible.value = true
  // 获取row的信息
  if(row){
    console.log(row);
  }
  if(row.id){
    // 获取物品详细
    const res = await getItemDetail(row.id)
    console.log('物品详细:', res)
    // 赋值给表单
    form.value = res
    // 赋值给图片回显
    previewImg.value = res.picture

  }else{
    // 添加物品功能 初始化表单数据

    // 重置表单数据
    formRef.value = form.value

  }

}

// 暴露open方法
defineExpose(
  { open }
  )

onMounted(() => {
  getCategories()
})
</script>
<template>
  <!-- 弹窗组件区域 -->
  <el-dialog
    v-model="dialogVisible"
  >
    <!-- 表单组件区域 -->
    <el-form
    :model="form"
    ref="formRef"
    label-width="100px"
    style="display: flex; flex-direction: column; align-items: center;"
    >
      <el-form-item label="物品名称" style="width: 400px;">
        <el-input v-model="form.title" placeholder="请输入物品名称" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="物品描述" style="width: 400px;">
        <el-input v-model="form.description" placeholder="请输入物品描述" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" style="width: 400px;">
        <el-input v-model="form.contact" placeholder="请输入联系方式" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="物品图片" style="width: 400px;">
        <div style="display: flex; justify-content: center;">
          <el-upload
          class="item_img-uploader"
          multiple
          list-type="picture-card"
          :action="uploadUrl"
          :show-file-list="false"
          :on-change="onSelectFile"
          :on-success="handleAvatarSuccess"
          :headers="{
            Authorization: userStore.token,
          }
          "
          style="width: 148px; height: 148px;"
          >
          <img v-if="previewImg" :src="previewImg" class="avatar"></img>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="丢失地点" style="width: 400px;">
        <el-input v-model="form.location" placeholder="请输入丢失地点" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="物品分类" style="width: 400px;">
        <el-cascader
        v-model="categoryValue"
        :options="categories"
        :props="{
          value: 'id',
          label: 'name',
          children: 'children',
          // 开启严格模式 必须选择子分类
          checkStrictly: false
        }"
        placeholder="请选择物品分类"
        style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="物品类型" style="width: 400px;">
        <el-select v-model="form.type" placeholder="请选择物品类型" style="width: 100%;">
          <el-option label="物品招领" value="found">物品招领</el-option>
          <el-option label="物品丢失" value="lost">物品丢失</el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="submitForm">发布{{ categoryValue }}</el-button>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.item_img-uploader {
  :deep() {
    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
  }
}
</style>
