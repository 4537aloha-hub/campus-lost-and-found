import request from '@/utils/request'

// 登录
export const postLogin = (data) =>
  request.post('/api/login', data)
// 注册
export const postRegister = (data) => request.post('/api/register', data)

// 获取用户信息
// 注意：此接口后端地址不在/api前缀下，因此必须覆盖全局baseURL，
// 否则会发往 /api/my/userinfo 导致 404。
export const getUserInfo = () => request.get('/my/userinfo')

// 根据登录token(用户)获取对应用户的物品信息
export const getItemByUserId = (params) => request.get('/my/getItemListByUserId', {params})

//发布物品(发布招领/失物)
export const publishItem = (data) => request.post('/my/publishItem', data)

// 删除物品
export const deleteItem = (id) => request.delete(`/my/deleteItem/${id}`, {
  params: {
    id
  }
})
export const getItemDetail = (id) => request.get(`/my/getItemDetail/${id}`)
// 编辑/更新物品信息
export const editItem = (id, data) => request.put(`/my/editItem/${id}`, data)

// 更新用户信息
export const updateUserInfo = (data) => request.put('/my/editUserInfo', data)

// 上传用户头像
export const uploadAvatar = (data) => request.post('/upload/uploadAvatar', data)

// 更新用户密码
export const updatePassword = (data) => request.post('/my/updatePassword', data)
