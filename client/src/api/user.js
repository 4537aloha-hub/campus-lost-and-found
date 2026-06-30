import request from '@/utils/request'

// 登录
export const postLogin = (data) =>
  request.post('/api/login', data)
// 注册
export const postRegister = (data) => request.post('/api/register', data)

// 发送邮箱验证码(注册)
export const sendRegisterEmailCode = (data) => request.post('/api/sendRegisterEmailCode', data)

// 验证邮箱验证码(注册邮箱)
export const verifyRegisterEmailCode = (data) => request.post('/api/verifyRegisterEmailCode', data)
// 忘记密码接口
export const checkStudentId = (data) => request.post('/api/checkStudentId', data)
export const sendForgetEmailCode = (data) => request.post('/api/forgetpassword/sendCode', data)
export const verifyForgetEmailCode = (data) => request.post('/api/forgetpassword/verifyCode', data)
export const resetPassword = (data) => request.post('/api/forgetpassword/resetPassword', data)
// 获取用户信息
// 注意：此接口后端地址不在/api前缀下，因此必须覆盖全局baseURL，
// 否则会发往 /api/my/userinfo 导致 404。
export const getUserInfo = () => request.get('/my/userinfo')

// 根据登录token(用户)获取对应用户的物品信息

//1. 查询lost物品列表
export const getItemListByUserIdLost = (params) => request.get('/my/getItemListByUserIdLost', {params})

// 2. 查询found物品列表
export const getItemListByUserIdFound = (params) => request.get('/my/getItemListByUserIdFound', {params})

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

// 发送邮箱验证码(修改原有邮箱 需要重新验证一遍原邮箱 需要用户登录权限)
export const sendEmailCode = (data) => request.post('/email/sendCode', data)

// 验证邮箱验证码(修改邮箱)
export const verifyEmailCode = (data) => request.post('/email/verifyEmailCode', data)

// 申请认领物品
export const applyClaim = (id) => request.post(`/claim/apply/${id}`)

// 通过认领申请
export const approveClaim = (id) => request.post(`/claim/approve/${id}`)

// 拒绝认领申请
export const rejectClaim = (id) => request.post(`/claim/reject/${id}`)

// 获取待处理认领申请
export const getPendingClaims = () => request.get('/claim/pending')
// 获取认领历史记录
export const getClaimHistory = () => request.get('/claim/history')
// 获取我的认领申请
export const getMyClaims = () => request.get('/claim/myclaims')
