import joi from 'joi'

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 字符串的最小长度
 * max(length) 字符串的最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 注册和登录的验证规则
const student_id = joi.string().alphanum().min(3).max(10).required()
const username = joi.string().min(3).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const phone = joi.string().pattern(/^1[3-9]\d{9}$/)
const email = joi.string().email()
const college = joi.string().max(50)
const major = joi.string().max(50)
const grade = joi.string().max(20)

export const reg_schema = {
    body: {
        student_id,
        username,
        password,
        phone,
        email,
        college,
        major,
        grade
    }
}

export const login_schema = {
    body: {
        student_id,
        password
    }
}

// 编辑用户信息的验证规则
const editAvatar = joi.string().allow('', null)
const editUsername = joi.string().min(1).max(10).allow('', null)
const editPhone = joi.string().pattern(/^1[3-9]\d{9}$/).allow('', null)
const editEmail = joi.string().email().allow('', null)
const editCollege = joi.string().max(50).allow('', null)
const editMajor = joi.string().max(50).allow('', null)
const editGrade = joi.string().max(20).allow('', null)

export const edit_schema = {
    body: {
        avatar: editAvatar,
        username: editUsername,
        phone: editPhone,
        email: editEmail,
        college: editCollege,
        major: editMajor,
        grade: editGrade
    }
}

// 修改密码的验证规则
export const updatePassword_schema = {
    body: {
        oldPwd: password,
        // 与旧密码进行对比,不能与旧密码一样
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
        // 确认两次输入的新密码是否一致
        confirmPwd: joi.valid(joi.ref('newPwd')).required()
    }
}
