import db from "../../db/index.js"

// 获取用户列表
export const getUserListHandler = async (req, res) => {
    try {
        // 查询用户列表
        const [users] = await db.query(`select student_id as id,username,email,status,create_time from users where role = 'student'`)
        // 返回用户列表
        return res.send({
            status: 0,
            message: '获取用户列表成功',
            data: users
        })
    } catch(err) {
        res.cc('获取用户列表失败',err)
    }
}

// 封禁用户
export const forbidUserHandler = async (req, res) => {
    try {
        const userId = req.params.id
        const status = Number(req.body.status)

        if (![0, 1].includes(status)) {
            return res.cc('状态参数错误')
        }

        const [result] = await db.query(
            'update users set status = ? where id = ?',
            [status, userId]
        )

        if (result.affectedRows !== 1) {
            return res.cc('用户不存在')
        }

        res.send({
            status: 0,
            message: status === 0 ? '封禁成功' : '解封成功'
        })

    } catch (err) {
        console.error(err)
        res.cc(err)
    }
}

