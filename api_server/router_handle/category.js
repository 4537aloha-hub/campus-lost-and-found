import db from "../db/index.js"

// 获取物品一级分类列表和二级分类列表并封装成一个分类对象数组(分类树)

export const getCategoryTreeHandler = async (req, res) => {
    try{
        // 查询一级分类
        const [categories] = await db.query(`select id,name,sort from categories       order by sort`)
        
        // 查询二级分类
        const [subCategories] = await db.query(`select id,name,category_id from        sub_categories`)
        
        // 组装分类树
        const categoryTree = categories.map(category => {
            const children = subCategories.filter(sub => sub.category_id ===       category.id)
            return {
                ...category,
                children
            }
        })
        // 返回分类树
        return res.send({
            status: 0,
            message: '获取分类树成功',
            data: categoryTree
        })
    }catch(err){
        res.cc(err)
    }
}