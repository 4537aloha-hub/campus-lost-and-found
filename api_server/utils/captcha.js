import dayjs from 'dayjs';
import db from '../db/index.js'

export const generateCaptcha = () => {
    return Math.random().toString().slice(2, 8)
}

// 保存验证码
export const saveCode = async (email, code, type) => {
    await db.query(
        `INSERT INTO email_codes (email, code, type, expire_time) VALUES (?, ?, ?, ?)`,
        [email, code, type, dayjs().add(5, 'minute').format('YYYY-MM-DD HH:mm:ss')]
    )
}

// 校验验证码
export const verifyCode = async (email, code, type) => {
    const [rows] = await db.query(
        `SELECT * FROM email_codes WHERE email = ? AND code = ? AND type = ? AND is_used = 0 ORDER BY id DESC LIMIT 1`, [email, code, type]
    )

    if(!rows.length) return

    const record = rows[0]

    // 校验过期时间
    if(dayjs().isAfter(record.expire_time)) return

    // 校验通过，更新状态为已使用
    await db.query(
        `UPDATE email_codes SET is_used = 1 WHERE id = ?`, [record.id]
    )

    return true
}

// 校验验证码但不消耗，用于忘记密码验证码校验后再重置密码
export const verifyCodeWithoutConsume = async (email, code, type) => {
    const [rows] = await db.query(
        `SELECT * FROM email_codes WHERE email = ? AND code = ? AND type = ? AND is_used = 0 ORDER BY id DESC LIMIT 1`, [email, code, type]
    )

    if(!rows.length) return

    const record = rows[0]

    if(dayjs().isAfter(record.expire_time)) return

    return true
}