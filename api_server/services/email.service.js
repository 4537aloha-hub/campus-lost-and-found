import { generateCaptcha, verifyCode, saveCode, verifyCodeWithoutConsume } from '../utils/captcha.js'
import { sendEmailCode } from '../utils/mailer.js'
import db from '../db/index.js'

// 发送验证码
export const sendEmailCodeService = async (email, type) => {

    // 生成验证码
    const code = generateCaptcha()
    
    await saveCode(email, code, type)
    await sendEmailCode(email, code, type)

}

// 验证验证码并消耗
export const verifyEmailCodeService = async (email, code, type) => {
    return verifyCode(email, code, type)
}

// 验证验证码但不消耗，用于忘记密码校验后继续重置密码
export const verifyEmailCodeNoConsumeService = async (email, code, type) => {
    return verifyCodeWithoutConsume(email, code, type)
}

// 绑定邮箱
export const bindEmailService = async (userId, email, code) => {
    const valid = await verifyCode(email, code, 'bind')
    if(!valid) throw new Error('验证码错误或过期')
    
    // 绑定用户邮箱
    await db.query(
        `UPDATE users SET email = ? WHERE id = ?`, [email, userId]
    )
}