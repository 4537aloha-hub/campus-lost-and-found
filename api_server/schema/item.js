import joi from 'joi'

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 字符串的最小长度
 * max(length) 字符串的最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */


// 定义发布物品的验证规则
const title = joi.string().min(1).max(30).required()
const type = joi.string().valid('lost', 'found').required()
const description = joi.string()
// 图片可以为空 必须为jpg或png格式
const picture = joi.string().allow('', null).pattern(/\.(jpg|png)$/)
const category_id = joi.number()
const sub_category_id = joi.number()
const location = joi.string()
// 防止xxs注入攻击 联系方式长度必须在1-40之间 必填项
const contact = joi.string().min(1).max(40).required()
export const publishItem_schema = {
    body: {
        title,
        type,
        description,
        picture,
        category_id,
        sub_category_id,
        location,
        contact
    }
}

// 定义根据用户id获取物品列表的验证规则
const id = joi.number().integer().min(1).required()
export const getItemListByUserId_schema = {
    params: {
        id
    }
}

// 定义编辑物品的验证规则
const editTitle = joi.string().min(2).max(30)
const editType = joi.string().valid('lost', 'found')
const editDescription = joi.string()
// 图片可以为空
const editPicture = joi.string().allow('', null)
const editCategory_id = joi.number()
const editSub_category_id = joi.number()
const editLocation = joi.string()
const editContact = joi.string()
export const editItem_schema = {
    body: {
        title: editTitle,
        type: editType,
        description: editDescription,
        picture: editPicture,
        category_id: editCategory_id,
        sub_category_id: editSub_category_id,
        location: editLocation,
        contact: editContact
    }
}

// 定义全局搜索物品名称的验证规则
export const searchItem_schema = {
    body: {
        title
    }
}