import db from '../db/index.js'

// 获取物品二级分类列表路由处理函数
export const getSubCategoryListHandler = async (req, res) => {
    try{
        const { category_id } = req.params

        const [results] = await db.query(`select * from sub_categories where category_id = ?`, [category_id])

        // 查询成功返回
        res.send({
            status: 0,
            message: '获取物品二级分类列表成功',
            data: results
        })
    }catch(err){
        res.cc(err)
    }
}