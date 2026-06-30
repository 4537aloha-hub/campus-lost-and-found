import request from '@/utils/request'

// 新增公告
export const addAnnouncement = (data) => request.post('/admin/announcement/add', data)

// 获取公告列表
export const getAnnouncementList = () => request.get('/admin/announcement/list')

// 修改公告
export const updateAnnouncement = (data) => request.put('/admin/announcement/update', data)

// 删除公告
export const deleteAnnouncement = (id) => request.delete(`/admin/announcement/delete/${id}`)

// 置顶公告
export const topAnnouncement = (id) => request.put(`/admin/announcement/top/${id}`)

// 隐藏公告
export const hideAnnouncement = (id) => request.put(`/admin/announcement/hide/${id}`)
