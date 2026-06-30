export const adminMiddleware = (req, res, next) => {

  // JWT 已经过 express-jwt 解析
  if (!req.auth) {
    return res.cc('请先登录')
  }

  if (req.auth.role !== 'admin') {
    return res.cc('权限不足')
  }

  next()
}