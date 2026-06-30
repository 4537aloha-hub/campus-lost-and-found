<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import {
  getCategoryTree,
  addCategory,
  deleteCategory
} from '@/api/category'

import CategoryCard from './components/CategoryCard.vue'
import CategoryDialog from './components/CategoryDialog.vue'

const categories = ref([])

const dialogRef = ref()

// 新增分类弹窗
const addDialogVisible = ref(false)

const newCategoryName = ref('')

/* 加载分类 */
const loadCategories = async () => {
  try {

    const res = await getCategoryTree()

    if (res.status === 0) {

      categories.value = res.data

    }

  } catch (err) {

    console.log(err)

  }
}

/* 新增主分类 */
const addMainCategory = async () => {

  if (!newCategoryName.value.trim()) {

    return ElMessage.warning('请输入分类名称')

  }

  try {

    const res = await addCategory({

      name: newCategoryName.value.trim()

    })

    if (res.status === 0) {

      ElMessage.success('新增成功')

      newCategoryName.value = ''

      addDialogVisible.value = false

      loadCategories()

    }

  } catch (err) {

    console.log(err)

  }

}

/* 编辑 */

const editMainCategory = (category) => {

  dialogRef.value.open(category)

}

/* 删除 */

const deleteCategoryItem = async (id) => {

  try {

    await ElMessageBox.confirm(

      '确定删除该分类吗？',

      '提示',

      {

        type: 'warning'

      }

    )

    const res = await deleteCategory(id)

    if (res.status === 0) {

      ElMessage.success('删除成功')

      loadCategories()

    }

  } catch (err) {

    console.log(err)

  }

}

/* 编辑成功 */

const onDialogSuccess = () => {

  loadCategories()

}

onMounted(loadCategories)
</script>

<template>

<div class="admin-page">

    <!-- header -->

    <div class="page-header">

        <div>

            <h2>分类管理</h2>

            <p>

                管理失物招领平台分类及副分类

            </p>

        </div>

        <el-button

            type="primary"

            @click="addDialogVisible=true"

        >

            新增分类

        </el-button>

    </div>

    <!-- 分类 -->

    <div class="category-list">

        <CategoryCard

            v-for="item in categories"

            :key="item.id"

            :category="item"

            @edit="editMainCategory"

            @delete="deleteCategoryItem"

        />

    </div>

    <!-- 新增 -->

    <el-dialog

        v-model="addDialogVisible"

        title="新增分类"

        width="420"

        destroy-on-close

    >

        <el-form>

            <el-form-item

                label="分类名称"

            >

                <el-input

                    v-model="newCategoryName"

                    placeholder="请输入分类名称"

                    @keyup.enter="addMainCategory"

                />

            </el-form-item>

        </el-form>

        <template #footer>

            <el-button

                @click="addDialogVisible=false"

            >

                取消

            </el-button>

            <el-button

                type="primary"

                @click="addMainCategory"

            >

                确定

            </el-button>

        </template>

    </el-dialog>

    <!-- 编辑 -->

    <CategoryDialog

        ref="dialogRef"

        @success="onDialogSuccess"

    />

</div>

</template>

<style scoped lang="scss">

.admin-page{

    padding:24px;

    background:#f5f7fb;

    min-height:100vh;

}

.page-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:28px;

}

.page-header h2{

    margin:0;

    font-size:28px;

    font-weight:700;

    color:#303133;

}

.page-header p{

    margin-top:8px;

    color:#909399;

}

.category-list{

    display:grid;

    grid-template-columns:repeat(auto-fill,minmax(320px,1fr));

    gap:22px;

}

@media(max-width:768px){

.page-header{

    flex-direction:column;

    align-items:flex-start;

    gap:16px;

}

.category-list{

    grid-template-columns:1fr;

}

}

</style>
