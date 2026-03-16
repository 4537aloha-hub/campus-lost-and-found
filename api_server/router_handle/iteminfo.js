import db from '../db/index.js';

// 获取物品列表的处理函数
export const getItemListHandler = async (req, res) => { 
    try { 
        // 获取物品列表
        const [results] = await db.query(`select * from items`)
        res.send({
            status: 200,
            message: '获取物品列表成功',
            data: results
        })
    }
    catch (err) {
        res.cc(err);
    }
}

// 根据物品ID查询物品详细信息的处理函数（用于前端的物品详情页）
export const getItemInfoByIdHandler = async(req,res) => {
    try{
        // 获取物品IO
        const itemId = req.params.id;
        // 查询物品信息
        const [results] = await db.query(`select * from items where id = ?` ,[itemId])
        // 如果物品不存在
        if(results.length === 0)
            return res.cc('物品不存在');
        // 返回物品信息
        res.send({
            status: 200,
            message: '查询成功',
            data: results[0]
        })
    }catch(err){
        res.cc(err);
    }
}


// 根据物品分类树获取物品列表路由处理函数
export const getItemCategoryInfoHandler = async (req, res) => {
    try{
        // 从查询参数中获取分类ID和子分类ID
        const { categoryId, subCategoryId } = req.query;

        // 构建SQL查询语句
        let sql = `select * from items where is_deleted = 0`
        // 构建查询参数数组
        const params = [];

        // 构建分类ID条件 如果一级分类id存在 则添加一级分类id条件到sql语句中
        if(categoryId) {
            sql += ' and category_id = ?'
            params.push(categoryId)   
        }
        // 构建子分类ID条件 如果二级分类id存在 则添加二级分类id条件到sql语句中
        if(subCategoryId) {
            sql += 'and sub_category_id = ?'
            params.push(subCategoryId)
        }

        const [results] = await db.query(sql, params);

        res.send({
            status: 0,
            message: '获取物品列表成功',
            data: results
        })
    }catch(err){
        res.cc(err)
    }
}

// 全局搜索物品名称路由处理函数
export const searchItemHandler = async (req, res) => {

     // 从请求体中获取物品名称
    const itemName = req.query.title;
    
    if(!itemName)
        return res.cc('该物品不存在')

    // [`%${itemName}%`] 表示模糊查询 物品名称中包含itemName的物品
    const [results] = await db.query(`select * from items where title like ? and is_deleted = 0`, [`%${itemName}%`])

    res.send({
        status: 0,
        message: '搜索成功',
        data: results
    })
}