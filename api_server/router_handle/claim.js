import db from "../db/index.js";

// 申请认领的处理函数
export const applyClaimHandler = async (req,res)=>{
    try{

        const itemId = req.params.id
        const applicantId = req.auth.id

        const [items] = await db.query(
        `
        SELECT id,user_id,status
        FROM items
        WHERE id = ?
        AND is_deleted = 0
        `,
        [itemId]
        )

        if(items.length !== 1){
            return res.cc('物品已被对方删除')
        }

        const item = items[0]

        const receiverId = item.user_id

        if(receiverId === applicantId){
            return res.cc('不能认领自己的物品')
        }

        const [exist] = await db.query(
        `
        SELECT id
        FROM claims
        WHERE item_id = ?
        AND applicant_id = ?
        AND status = 'pending'
        `,
        [itemId, applicantId]
        )

        if(exist.length > 0){
            return res.cc('您已提交过申请')
        }

        const [result] = await db.query(
        `
        INSERT INTO claims
        (
            item_id,
            applicant_id,
            receiver_id,
            status
        )
        VALUES
        (
            ?,
            ?,
            ?,
            'pending'
        )
        `,
        [
            itemId,
            applicantId,
            receiverId
        ]
        )

        if(result.affectedRows !== 1){
            return res.cc('申请失败')
        }

        res.send({
            status:0,
            message:'认领申请已发送'
        })

    }catch(err){
        res.cc(err)
    }
}

// 同意认领的处理函数
export const agreeClaimHandler = async (req,res)=>{
    try{

        const claimId = req.params.id

        // 当前登录用户
        const receiverId = req.auth.id

        // 查询申请记录
        const [claims] = await db.query(
            `
            SELECT *
            FROM claims
            WHERE id = ?
            `,
            [claimId]
        )

        if(claims.length !== 1){
            return res.cc('认领申请不存在')
        }

        const claim = claims[0]

        // 只能处理发给自己的申请
        if(claim.receiver_id !== receiverId){
            return res.cc('无权操作')
        }

        // 已处理过
        if(claim.status !== 'pending'){
            return res.cc('该申请已处理')
        }

        // 开启事务
        const connection = await db.getConnection()

        try{

            await connection.beginTransaction()

            // 修改申请状态
            await connection.query(
                `
                UPDATE claims
                SET status='approved'
                WHERE id=?
                `,
                [claimId]
            )

            // 2同一物品其它申请全部自动拒绝
            await connection.query(
            `
            UPDATE claims
            SET status = 'rejected'
            WHERE item_id = ?
            AND id <> ?
            AND status = 'pending'
            `,
            [
                claim.item_id,
                claimId
            ]
            )

            // 修改物品状态
            await connection.query(
                `
                UPDATE items
                SET status='claimed'
                WHERE id=?
                `,
                [claim.item_id]
            )

            await connection.commit()

            res.send({
                status:0,
                message:'认领成功'
            })

        }catch(err){

            await connection.rollback()
            throw err

        }finally{
            connection.release()
        }

    }catch(err){
        res.cc(err)
    }
}

// 拒绝认领的处理函数
export const rejectClaimHandler = async (req,res)=>{
    try{

        const claimId = req.params.id
        const receiverId = req.auth.id

        const [claims] = await db.query(
            `
            SELECT *
            FROM claims
            WHERE id = ?
            `,
            [claimId]
        )

        if(claims.length !== 1){
            return res.cc('认领申请不存在')
        }

        const claim = claims[0]

        if(claim.receiver_id !== receiverId){
            return res.cc('无权操作')
        }

        if(claim.status !== 'pending'){
            return res.cc('该申请已处理')
        }

        const [result] = await db.query(
            `
            UPDATE claims
            SET status='rejected'
            WHERE id=?
            `,
            [claimId]
        )

        if(result.affectedRows !== 1){
            return res.cc('拒绝失败')
        }

        res.send({
            status:0,
            message:'已拒绝认领申请'
        })

    }catch(err){
        res.cc(err)
    }
}

// 获取认领申请列表的处理函数
export const getPendingClaimsHandler = async (req, res) => {
  try {
    const receiverId = req.auth.id

    // 分页参数
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const offset = (page - 1) * pageSize

    // 查询总数
    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM claims
      WHERE receiver_id = ?
      AND status = 'pending'
      `,
      [receiverId]
    )

    const total = countRows[0].total

    // 查询当前页数据
    const [rows] = await db.query(
      `
      SELECT
          c.id,
          c.item_id,
          c.status,
          c.created_at,

          i.title,
          i.picture,
          i.status AS item_status,

          u.id AS applicant_id,
          u.username

      FROM claims c

      LEFT JOIN items i
      ON c.item_id = i.id

      LEFT JOIN users u
      ON c.applicant_id = u.id

      WHERE c.receiver_id = ?
      AND c.status = 'pending'

      ORDER BY c.created_at DESC

      LIMIT ?, ?
      `,
      [
        receiverId,
        offset,
        pageSize
      ]
    )

    res.send({
      status: 0,
      message: '获取待处理认领申请成功',
      data: {
        list: rows,
        total,
        page,
        pageSize
      }
    })

  } catch (err) {
    res.cc(err)
  }
}

// 获取认领历史记录
export const getClaimHistoryHandler = async (req,res)=>{
    try{

        const receiverId = req.auth.id

        // 分页参数
        const page = Number(req.query.page) || 1
        const pageSize = Number(req.query.pageSize) || 10
        const offset = (page - 1) * pageSize

        // 查询总数
        const [countRows] = await db.query(
          `
          SELECT COUNT(*) AS total
          FROM claims
          WHERE receiver_id = ?
          AND status IN ('approved','rejected')
          `,
          [receiverId]
        )

        const total = countRows[0].total
        const [rows] = await db.query(`
            SELECT
                c.id,
                c.item_id,
                c.status,
                c.created_at,
                c.updated_at,

                i.title,
                i.description,
                i.picture,

                u.username AS applicant_name

            FROM claims c

            LEFT JOIN items i
            ON c.item_id = i.id

            LEFT JOIN users u
            ON c.applicant_id = u.id

            WHERE c.receiver_id = ?
            AND c.status IN ('approved','rejected','cancelled')

            ORDER BY c.updated_at DESC

            LIMIT ?, ?
        `,[receiverId,offset,pageSize])

        res.send({
            status:0,
            message:'获取历史记录成功',
            data: {
                list: rows,
                total,
                page,
                pageSize
            }
        })

    }catch(err){
        res.cc(err)
    }
}

// 我的认领申请
export const getMyClaimsHandler = async (req, res) => {
    try {

        const applicantId = req.auth.id

        // 分页参数
        const page = Number(req.query.page) || 1
        const pageSize = Number(req.query.pageSize) || 10
        const offset = (page - 1) * pageSize

        // 查询总数
        const [countRows] = await db.query(
          `
          SELECT COUNT(*) AS total
          FROM claims
          WHERE applicant_id = ?
          AND status IN ('pending','approved','rejected')
          `,
          [applicantId]
        )

        const total = countRows[0].total

        const [rows] = await db.query(
            `SELECT
                c.id,
                c.item_id,
                c.status,
                c.created_at,

                i.title,
                i.description,
                i.type,
                i.status AS item_status,
                i.picture

            FROM claims c
            LEFT JOIN items i
            ON c.item_id = i.id

            WHERE c.applicant_id = ?
            ORDER BY c.created_at DESC
            LIMIT ?, ?
            `,
            [applicantId,offset,pageSize]
        )

        res.send({
            status: 0,
            message: '获取我的认领申请成功',
            data: {
                list: rows,
                total,
                page,
                pageSize
            }
        })

    } catch (err) {
        res.cc(err)
    }
}