import request from '@/utils/request'

// 获取用户列表
export const getUserList = () => request.get('/admin/userList')

// 封禁/解封用户
export const forbidUser = (userId, status) => request.put(`/admin/forbidUser/${userId}`, { status })

// 获取物品数据
export const getItemData = (params) => request.get('/admin/item/itemData', { params })

// 删除物品（管理员）
export const deleteItem = (id) => request.delete(`/admin/item/delete/${id}`)

// 恢复物品（管理员）
export const restoreItem = (id) => request.post(`/admin/item/restore/${id}`)

// 获取活动记录列表
export const getActivityList = () => request.get('/admin/activity/activityList')

// 获取统计信息
export const getStatistics = () => request.get('/admin/statistics/statistics')

// 获取7天数据信息 用于图表展示
export const get7DayStatistics = () => request.get('/admin/statistics/7day')

// 获取轮播图图片列表
export const getHomeBanner = () => request.get('/admin/banner/list')

// 更新轮播图状态
export const updateBannerStatus = (id, status) => request.post(`/admin/banner/updateStatus/${id}`, { status })

// 删除轮播图图片
export const deleteBanner = (id) => request.post(`/admin/banner/delete/${id}`)

// 新增轮播图图片
export const addBanner = (data) => request.post('/admin/banner/add', data)

// 编辑轮播图
export const updateBanner = (id, data) => request.post(`/admin/banner/update/${id}`, data)

