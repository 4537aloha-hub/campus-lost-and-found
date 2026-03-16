import express from 'express'
const Router = express.Router()
// 导入路由处理函数模块
import { uploadImage } from '../router_handle/upload.js'
import { uploadAvatar } from '../router_handle/upload.js'

// 上传物品图片的路由
Router.post('/', uploadImage)
Router.post('/uploadAvatar', uploadAvatar)
export default Router