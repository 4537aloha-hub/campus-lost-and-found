import request from "@/utils/request";


// 获取物品的主分类和子分类
// 公开接口：获取物品的主分类和子分类（非管理员）
export const getCategoryTree = () => request.get('/category/getCategoryTree')

// 新增主分类
export const addCategory = (data) => request.post('/admin/category/addCategory',data)

// 修改主分类
export const updateCategory = (id) => request.put(`/admin/category/updateCategory/${id}`)

// 删除主分类
export const deleteCategory = (id) => request.delete(`/admin/category/deleteCategory/${id}`)

// 新增子分类
export const addSubCategory = (data) => request.post('/admin/category/addSubCategory',data)

// 修改子分类
export const updateSubCategory = (id,data) => request.put(`/admin/category/updateSubCategory/${id}`,data)

// 删除子分类
export const deleteSubCategory = (id) => request.delete(`/admin/category/deleteSubCategory/${id}`)
