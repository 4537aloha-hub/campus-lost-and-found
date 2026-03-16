// 导入数据库模块
import db from "../db/index.js";
// 发布物品遗失/招领的处理函数
export const publishItemHandler = async (req, res) => { 
    try {
        // 检查用户是否已认证
        if (!req.auth || !req.auth.id)
            return res.cc('请先登录');
        
        // 获取token中存放的用户id
        const userId = req.auth.id;
        
        // 验证用户是否存在
        const [userExists] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (userExists.length === 0)
            return res.cc('用户不存在或已被删除');
        
        // 从请求体中获取需要获取的物品信息
        const {
            title,
            description,
            picture,
            category_id,
            sub_category_id,
            location,
            contact,
            type
        } = req.body;

        // 验证物品信息是否完整步骤 已经在schemama中完成定义，路由处理函数这里无需再次定义

        // 检查物品分类ID是否存在
        if(category_id){
            const [cate] = await db.query(`select id from categories where id = ?`, [category_id])

            if(cate.length === 0)
            return res.cc('分类ID不存在');
        }

        console.log('发送出去的请求体数据是:', req.body)
        

        // 插入物品信息到数据库
        const [result] = await db.query (`insert into items (user_id, title, description, picture, category_id, sub_category_id, location, contact, type) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [
            userId, 
            title, 
            description ?? null, 
            picture ?? null, 
            category_id ?? null, 
            sub_category_id ?? null, 
            location ?? null, 
            contact ?? null, 
            type
        ]
    )
        // 4. 检查物品ID是否存在
        const itemId = result.insertId;

        // 5. 如果有图片，插入物品图片到数据库
        if(picture){
            // 6. 插入物品图片到数据库
            await db.query(`insert into item_images (item_id, image_url, is_cover) values (?, ?, 1)`, [itemId, picture])
        }


        // 2. 检查插入操作是否成功
        if(result.affectedRows !== 1)
            return res.send({
                status: 1,
                message: '发布物品失败'
            });
        // 3. 发布物品成功
        res.send({

            status: 0,
            message: '发布物品成功'
        });
    }catch (error) {
            return res.cc(error);
    }
}

// 删除物品的处理函数
export const deleteItemHandler = async (req, res) => {
    try{
        // 获取物品ID
        const itemId = req.params.id;
        // 获取用户ID
        const userId = req.auth.id;

        // 查询物品是否存在且属于当前用户
        const [item] = await db.query(`select id from items where id = ? and user_id = ? and is_deleted = 0`, [itemId, userId])

        console.log(item)

        // 如果物品不存在 则返回错误
        if(item.length === 0)
            return res.cc('物品不存在或无权删除');

        // 标记删除
        const [result] = await db.query(`update items set is_deleted = 1, deleted_at = now() where id = ?`, [itemId])

        // 检查删除操作是否成功
        if(result.affectedRows !== 1)
            return res.cc('删除物品失败');

        // 删除图片记录
        await db.query(`delete from item_images where item_id = ?`, [itemId])

        // 删除成功
        res.send({
            status: 0,
            message: '删除物品成功'
        })

    }catch(err){
        res.cc(err);
    }
}

// 编辑物品的处理函数
export const editItemHandler = async (req, res) => {
    try{
        // 获取物品id
        const itemId = req.params.id;
        // 获取用户ID
        const userId = req.auth.id;

        // 判断物品是否存在
        const [item] = await db.query(
            `select id from items where id = ? and user_id = ? and is_deleted = 0`,
            [itemId, userId]
        )

        // 如果物品不存在 则返回错误
        if(item.length === 0){
            return res.cc('物品不存在或无权限修改')
        }

        // 获取更新数据
        const updateData = req.body;

        const [result] = await  db.query(`update items set ? where id = ? and user_id = ? and is_deleted = 0`, [updateData, itemId, userId])

        // 检查更新操作是否成功
        if(result.affectedRows !== 1)
            return res.cc('更新物品失败');

        // 更新成功
        res.send({
            status: 0,
            message: '更新物品成功'
        })
    }catch(err){
        res.cc(err);
    }
}

// 根据用户ID查询物品列表的处理函数
export const getItemListByUserIdHandler = async (req,res) => {
    try{
        // 当前登录用户的ID
        const userId = req.auth.id;

        // 查询参数
        const { type } = req.query;

        // 只查询未删除的物品
        let sql = `select * from items where user_id = ? and is_deleted = 0`
        const params = [userId]
    
        if(type){
            sql += ` and type = ?`
            params.push(type)
        }

        const  [results] = await db.query(sql, params)
        // 返回物品列表
        res.send({
            status: 0,
            message: '获取物品列表成功',
            data: results
        })
    }catch(err){
        res.cc(err);
    }
}