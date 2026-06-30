import db from "../../db/index.js"

// 获取活动记录列表
export const getActivityListHandler = async (req, res) => {
    try {
        const [rows] = await db.query(
            `select * from v_activities_user`
        )
        
        res.send({
            status: 0,
            message: '获取活动记录列表成功',
            data: rows
        })
    } catch (err) {
        res.cc(err)
    }
}