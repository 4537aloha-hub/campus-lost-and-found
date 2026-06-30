// 全局配置文件

export default {
    // 加密和解密Token的密钥
    jwtSecretKey: 'user_token',
    expiresIn: '24h'
}

// 邮箱配置
export const emailConfig = {
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: '357492240@qq.com',
        pass: 'sduuzlebbtajbhei', // 邮箱授权码 (服务器用)
    },
}