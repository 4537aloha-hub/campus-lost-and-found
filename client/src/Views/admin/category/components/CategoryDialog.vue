<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import {
  updateCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory
} from '@/api/category'

const emit = defineEmits(['success'])

const dialogVisible = ref(false)

const loading = ref(false)

// 是否编辑主分类
const category = reactive({
  id: null,
  name: '',
  children: []
})

// 新增副分类

const newSubName = ref('')

// 当前编辑副分类

const editingId = ref(null)

const editingName = ref('')

// 打开窗口（父组件调用）

const open = (row = null) => {

  dialogVisible.value = true

  editingId.value = null

  editingName.value = ''

  newSubName.value = ''

  if (row) {

    category.id = row.id

    category.name = row.name

    category.children = row.children
      ? JSON.parse(JSON.stringify(row.children))
      : []

  } else {

    category.id = null

    category.name = ''

    category.children = []

  }

}

// 保存主分类

const saveCategory = async () => {

  if (!category.name.trim()) {

    return ElMessage.warning('请输入分类名称')

  }

  loading.value = true

  try {

    const res = await updateCategory(category.id, {

      name: category.name

    })

    if (res.status === 0) {

      ElMessage.success('保存成功')

      dialogVisible.value = false

      emit('success')

    }

  } finally {

    loading.value = false

  }

}

// 新增副分类

const addSub = async () => {

  if (!newSubName.value.trim()) {

    return ElMessage.warning('请输入副分类')

  }

  const res = await addSubCategory({

    categoryId: category.id,

    name: newSubName.value

  })

  if (res.status === 0) {

    ElMessage.success('新增成功')

    // 不关闭窗口

    category.children.push({

      id: res.data.id,

      name: newSubName.value

    })

    newSubName.value = ''

    emit('success')

  }

}

//============================
// 编辑
//============================

const editSub = (item) => {

  editingId.value = item.id

  editingName.value = item.name

}

//============================
// 保存编辑
//============================

const saveSub = async () => {

  if (!editingName.value.trim()) {

    return ElMessage.warning('请输入名称')

  }

  const res = await updateSubCategory(

    editingId.value,

    {

      name: editingName.value

    }

  )

  if (res.status === 0) {

    ElMessage.success('修改成功')

    const index = category.children.findIndex(

      item => item.id === editingId.value

    )

    if (index !== -1) {

      category.children[index].name = editingName.value

    }

    editingId.value = null

    editingName.value = ''

    emit('success')

  }

}

//============================
// 删除
//============================

const removeSub = async (id) => {

  await ElMessageBox.confirm(

    '确定删除该副分类？',

    '提示',

    {

      type: 'warning'

    }

  )

  const res = await deleteSubCategory(id)

  if (res.status === 0) {

    ElMessage.success('删除成功')

    category.children = category.children.filter(

      item => item.id !== id

    )

    emit('success')

  }

}

//============================
// 取消编辑
//============================

const cancelEdit = () => {

  editingId.value = null

  editingName.value = ''

}

//============================

defineExpose({

  open

})

</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑分类"
    width="650px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-form label-width="90px">

      <!-- 主分类 -->
      <el-form-item label="主分类">
        <el-input
          v-model="category.name"
          placeholder="请输入主分类名称"
        />
      </el-form-item>

      <!-- 副分类 -->
      <el-form-item label="副分类">

        <div class="sub-wrapper">

          <!-- 已有副分类 -->
          <div
            class="sub-item"
            v-for="item in category.children"
            :key="item.id"
          >

            <!-- 编辑状态 -->
            <template v-if="editingId === item.id">

              <el-input
                class="sub-input"
                v-model="editingName"
                @keyup.enter="saveSub"
              />

              <div class="btn-group">

                <el-button
                  size="small"
                  type="success"
                  @click="saveSub"
                >
                  保存
                </el-button>

                <el-button
                  size="small"
                  @click="cancelEdit"
                >
                  取消
                </el-button>

              </div>

            </template>

            <!-- 普通状态 -->
            <template v-else>

              <span class="sub-name">
                {{ item.name }}
              </span>

              <div class="btn-group">

                <el-button
                  link
                  type="primary"
                  @click="editSub(item)"
                >
                  编辑
                </el-button>

                <el-button
                  link
                  type="danger"
                  @click="removeSub(item.id)"
                >
                  删除
                </el-button>

              </div>

            </template>

          </div>

          <!-- 新增副分类 -->
          <div class="add-box">

            <el-input
              v-model="newSubName"
              placeholder="请输入副分类"
              clearable
              @keyup.enter="addSub"
            >

              <template #append>

                <el-button
                  type="primary"
                  @click="addSub"
                >
                  新增
                </el-button>

              </template>

            </el-input>

          </div>

        </div>

      </el-form-item>

    </el-form>

    <template #footer>

      <el-button @click="dialogVisible=false">
        取消
      </el-button>

      <el-button
        type="primary"
        :loading="loading"
        @click="saveCategory"
      >
        保存分类
      </el-button>

    </template>

  </el-dialog>
</template>

<style scoped lang="scss">
.sub-wrapper {
  width: 100%;
}

/* 副分类列表 */

.sub-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 16px;

  margin-bottom: 12px;

  border: 1px solid #ebeef5;

  border-radius: 10px;

  background: #fafafa;

  transition: .25s;
}

.sub-item:hover {

  background: #f5f7fa;

  border-color: #409EFF;

}

/* 名称 */

.sub-name {

  flex: 1;

  font-size: 14px;

  color: #303133;

  font-weight: 500;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

}

/* 编辑输入框 */

.sub-input{

  flex:1;

  margin-right:12px;

}

/* 按钮 */

.btn-group{

  display:flex;

  align-items:center;

  gap:8px;

}

/* 新增 */

.add-box{

  margin-top:18px;

}

/* Dialog */

:deep(.el-dialog){

  border-radius:16px;

}

:deep(.el-dialog__header){

  border-bottom:1px solid #ebeef5;

  padding:20px 24px;

}

:deep(.el-dialog__title){

  font-size:18px;

  font-weight:600;

}

:deep(.el-dialog__body){

  padding:24px;

}

:deep(.el-dialog__footer){

  border-top:1px solid #ebeef5;

  padding:18px 24px;

}

/* 表单 */

:deep(.el-form-item__label){

  font-weight:600;

  color:#303133;

}

/* 滚动 */

.sub-wrapper{

  max-height:420px;

  overflow:auto;

  padding-right:4px;

}

.sub-wrapper::-webkit-scrollbar{

  width:6px;

}

.sub-wrapper::-webkit-scrollbar-thumb{

  background:#dcdfe6;

  border-radius:20px;

}

.sub-wrapper::-webkit-scrollbar-thumb:hover{

  background:#c0c4cc;

}

/* 响应式 */

@media (max-width:768px){

  .sub-item{

    flex-direction:column;

    align-items:flex-start;

    gap:12px;

  }

  .btn-group{

    width:100%;

    justify-content:flex-end;

  }

}
</style>
