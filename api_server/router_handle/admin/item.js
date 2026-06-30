import db from "../../db/index.js"

// 获取物品列表（管理员）
export const getItemDataHandler = async (req, res) => {
  try {

    const {
      page = 1,
      size = 10,
      type,
      status,
      keyword,
      is_deleted,
      audit_status,
    } = req.query

    const offset = (page - 1) * size

    let where = 'where 1=1'
    const params = []

    // 类型筛选
    if(type){
      where += ' and type = ?'
      params.push(type)
    }

    // 删除筛选
    if (is_deleted !== undefined) {
      where += ' and is_deleted = ?'
      params.push(Number(is_deleted))
    } else {
      // 默认只查询未删除
      where += ' and is_deleted = 0'
    }

    // 状态筛选
    if(status){
      where += ' and status = ?'
      params.push(status)
    }

    // 关键词搜索
    if(keyword){
      where += ' and title like ?'
      params.push(`%${keyword}%`)
    }

    // 审核状态筛选
    if(audit_status !== undefined && audit_status !== null){
      where += ' and audit_status = ?'
      params.push(Number(audit_status))
    }

    // 查询总数
    const [countResult] = await db.query(
      `select count(*) as total
       from v_items_user
       ${where}`,
      params
    )

    const total = countResult[0].total

    // 查询当前页
    const [result] = await db.query(
      `select *
       from v_items_user
       ${where}
       order by created_at desc
       limit ?, ?`,
      [...params, Number(offset), Number(size)]
    )

    res.send({
      status: 0,
      message: '获取物品列表成功',
      data: {
        list: result,
        total
      }
    })

  } catch(err){
    console.error('获取物品数据失败：', err)

    res.send({
        status: 1,
        message: err.message
    })
}
}

// 删除物品（管理员）
export const deleteItemHandler = async (req, res) => {
  try {
    const { id } = req.params

    // 查询物品
    const [rows] = await db.query(
      `select id,status,is_deleted
       from items
       where id=?`,
      [id]
    )

    if (rows.length === 0) {
      return res.cc('物品不存在')
    }

    const item = rows[0]

    // 已删除
    if (item.is_deleted === 1) {
      return res.cc('该物品已删除')
    }

    // 已认领、已完成禁止删除
    if (
      item.status === 'claimed' ||
      item.status === 'completed'
    ) {
      return res.cc('已认领或已完成的物品不能删除')
    }

    // 逻辑删除
    const [result] = await db.query(
      `update items
       set
         is_deleted = 1,
         deleted_at = now()
       where id=?`,
      [id]
    )

    if (result.affectedRows !== 1) {
      return res.cc('删除失败')
    }

    res.cc('删除成功', 0)

  } catch (err) {
    res.cc(err)
  }
}

// 恢复物品（管理员）
export const restoreItemHandler = async (req, res) => {
  try {
    const { id } = req.params

    // 查询物品
    const [rows] = await db.query(
      `select id,status,is_deleted
       from items
       where id=?`,
      [id]
    )

    if (rows.length === 0) {
      return res.cc('物品不存在')
    }

    const item = rows[0]

    // 已恢复
    if (item.is_deleted === 0) {
      return res.cc('该物品已恢复')
    }

    // 逻辑恢复
    const [result] = await db.query(
      `update items
       set
         is_deleted = 0,
         deleted_at = now()
       where id=?`,
      [id]
    )

    if (result.affectedRows !== 1) {
      return res.cc('恢复失败')
    }

    res.cc('恢复成功', 0)

  } catch (err) {
    res.cc(err)
  }
}