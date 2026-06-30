// 导入express模块
import express from 'express';
// 导入管理员中间件
import { adminMiddleware } from '../../middlewares/admin.middleware.js'

// 创建路由模块
const router = express.Router()
// 使用管理员中间件
router.use(adminMiddleware)

// 获取分类和副分类数据
import { getCategoryTreeHandler } from '../../router_handle/admin/cateogry.js'
// 新增主分类
import { addCategoryHandler } from '../../router_handle/admin/cateogry.js'
// 修改主分类
import { updateCategoryHandler } from '../../router_handle/admin/cateogry.js'
// 删除主分类
import { deleteCategoryHandler } from '../../router_handle/admin/cateogry.js'
// 新增子分类
import { addSubCategoryHandler } from '../../router_handle/admin/cateogry.js'
// 修改子分类
import { updateSubCategoryHandler } from '../../router_handle/admin/cateogry.js'
// 删除子分类
import { deleteSubCategoryHandler } from '../../router_handle/admin/cateogry.js'



// 定义路由
router.get('/getCategoryTree', getCategoryTreeHandler)
// 新增主分类
router.post('/addCategory', addCategoryHandler)
// 修改主分类
router.put('/updateCategory/:id', updateCategoryHandler)
// 删除主分类
router.delete('/deleteCategory/:id', deleteCategoryHandler)

// 新增子分类
router.post('/addSubCategory', addSubCategoryHandler)
// 修改子分类
router.put('/updateSubCategory/:id', updateSubCategoryHandler)
// 删除子分类
router.delete('/deleteSubCategory/:id', deleteSubCategoryHandler)

export default router
