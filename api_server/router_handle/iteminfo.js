import db from '../db/index.js';

// 获取物品列表的处理函数
export const getItemListHandler = async (req, res) => {
    try {
        // 获取物品列表
        const [results] = await db.query(`select * from items where is_deleted = 0 and audit_status = 1 order by id desc`)

        // 返回物品列表
            res.send({
                status: 0,
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
            status: 0,
            message: '查询成功',
            data: results[0]
        })
    }catch(err){
        res.cc(err);
    }
}


// 根据物品分类树获取物品列表路由处理函数

// 获取丢失物品分类树列表路由处理函数
export const getLostItemCategoryInfoHandler = async (req, res) => {
  try {
    const {
      categoryId,
      subCategoryId,
      pageNum = 1,
      pageSize = 5
    } = req.query

    const offset = (Number(pageNum) - 1) * Number(pageSize)

    // 基础条件：只查未删除 + lost
    let where = `WHERE is_deleted = 0 AND type = 'lost'`
    const params = []

    if (categoryId) {
      where += ' AND category_id = ?'
      params.push(categoryId)
    }

    if (subCategoryId) {
      where += ' AND sub_category_id = ?'
      params.push(subCategoryId)
    }

    // 总数
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM items ${where}`,
      params
    )

    // 分页数据
    const [list] = await db.query(
      `SELECT * FROM items ${where} ORDER BY id DESC LIMIT ?, ?`,
      [...params, offset, Number(pageSize)]
    )

    res.send({
      status: 0,
      message: '获取 lost 物品列表成功',
      data: {
        list,
        total
      }
    })

  } catch (err) {
    res.cc(err)
  }
}

// 获取物品招领分类树列表路由处理函数
export const getPublishItemCategoryInfoHandler = async (req, res) => {
  try {
    const {
      categoryId,
      subCategoryId,
      pageNum = 1,
      pageSize = 5
    } = req.query

    const offset = (Number(pageNum) - 1) * Number(pageSize)

    // 基础条件：只查未删除 + found
    let where = `WHERE is_deleted = 0 AND type = 'found'`
    const params = []

    if (categoryId) {
      where += ' AND category_id = ?'
      params.push(categoryId)
    }

    if (subCategoryId) {
      where += ' AND sub_category_id = ?'
      params.push(subCategoryId)
    }

    // 总数
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM items ${where}`,
      params
    )

    // 分页数据
    const [list] = await db.query(
      `SELECT * FROM items ${where} ORDER BY id DESC LIMIT ?, ?`,
      [...params, offset, Number(pageSize)]
    )

    res.send({
      status: 0,
      message: '获取 lost 物品列表成功',
      data: {
        list,
        total
      }
    })

  } catch (err) {
    res.cc(err)
  }
}

// 全局搜索物品名称路由处理函数
export const searchItemHandler = async (req, res) => {

     // 从请求体中获取物品名称
    const itemName = req.query.title;

    if(!itemName || itemName.trim() === '')
        return res.cc('请输入搜索内容')

    if(/\s/.test(itemName))
        return res.cc('搜索内容不能包含空白字符')

    // [`%${itemName}%`] 表示模糊查询 物品名称中包含itemName的物品
    const [results] = await db.query(`select * from items where title like ? and is_deleted = 0`, [`%${itemName}%`])

    res.send({
        status: 0,
        message: '搜索成功',
        data: results
    })
}