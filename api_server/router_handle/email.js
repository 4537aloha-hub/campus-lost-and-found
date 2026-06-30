import { sendEmailCodeService, bindEmailService, verifyEmailCodeService } from '../services/email.service.js'

// 发送验证码
export const sendEmailCodeHandler = async (req, res) => {
    const { email, type } = req.body

    if(!email) return res.cc('请输入邮箱')

    try {
        await sendEmailCodeService(email, type)
        res.send(
            {
                code: 0,
                msg: '发送成功' 
            })
    } catch (error) {
        console.error('发送验证码失败:', error.message)
        res.cc('发送失败，请稍后重试')
    }
}

// 绑定邮箱
export const bindEmailHandler = async (req, res) => {
    const {email, code} = req.body
    const userId = req.auth.id

    await bindEmailService(userId, email, code)
    res.send({msg: '绑定成功'})
}

// 验证邮箱验证码
export const verifyEmailCodeHandler = async (req, res) => {
    const {email, code, type} = req.body

    const valid = await verifyEmailCodeService(email, code, type)
    if(!valid) return res.cc('验证码错误或过期')
    
    res.send(
        {
            code: 0,
            msg: '验证成功' 
        }
    )
}

// 修改邮箱
export const updateEmailHandler = async (req, res) => {
    const {newEmail, code} = req.body
    const userId = req.auth.id

    if(!req.session.emailVerified) return res.cc('请先验证邮箱')

    await updateEmailService(userId, newEmail, code)
    res.send({msg: '修改成功'})
}