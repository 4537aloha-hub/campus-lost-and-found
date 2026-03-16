import joi from 'joi'

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 字符串的最小长度
 * max(length) 字符串的最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */


const session_id = joi.number().integer().min(1).required()
const content = joi.string().min(1).max(255).required().trim()

// 获取消息的校验规则
export const getMessage_schema = {
  query: {
    session_id
  }
}

// 发送消息的校验规则
export const createSession_schema = {
  body: {
    session_id,
    content
  }
}