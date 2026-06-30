import db from "../../db/index.js"

// 审核通过
export const auditPassHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query(
            'update items set audit_status = ? where id = ?',
            [1, id]
        )
        if(result.affectedRows === 0){
            return res.cc('审核通过失败')
        }

        res.send({
            status: 0,
            message: '审核通过成功'
        })
    } catch(err){
        res.cc(err)
    }
}

// 审核拒绝
export const auditRejectHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query(
            'update items set audit_status = ? where id = ?',
            [2, id]
        )
        if(result.affectedRows === 0){
            return res.cc('审核拒绝失败')
        }
        res.send({
            status: 0,
            message: '审核拒绝成功'
        })
    } catch(err){
        res.cc(err)
    }
}
