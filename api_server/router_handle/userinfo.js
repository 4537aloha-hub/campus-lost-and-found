// 导入数据库模块
import db from '../db/index.js';
// 导入bcryptjs模块
import bcrypt from 'bcryptjs';

// 获取用户信息的处理函数
export const getUserInfoHandler = async (req, res) => {

    console.log('进入接口了');

    if (!req.auth || !req.auth.id) {
        return res.cc('身份验证失败，未获取到用户 ID！');
    }

    const sql = `
        select id, student_id, username, phone, email,avatar, college, major, grade 
        from users 
        where id = ?
    `

    console.log('token解析结果:', req.auth);

    try {
        const [results] = await db.query(sql, [req.auth.id]);
        
        console.log('数据库查询成功:', results);

        if (results.length !== 1) {
            return res.cc('获取用户信息失败！');
        }

        res.send({
            status: 0,
            message: '获取用户基本信息成功',
            data: results[0]
        });
    } catch (err) {
        console.log('数据库错误:', err);
        return res.cc(err);
    }
}

// 更新用户资料的处理函数
export const updateUserInfoHandler = async (req, res) => {
    try{
        // 查询用户id信息
        const userId = req.auth.id;

        // 要更新的数据
        const updateData = req.body;

        // 防止空更新
        if(Object.keys(updateData).length === 0)
            return res.cc('没有更新的数据');

        // 查询该用户是否存在
        const [user] = await db.query(`select * from users where id= ?`, [userId]);

        // 如果用户不存在 则返回错误
        if(user.length === 0)
            return res.cc('用户不存在');

        // 执行更新操作
        const [result] = await db.query(`update users set ? where id= ?`, [updateData, userId]);

        // 检查更新操作是否成功
        if(result.affectedRows !== 1)
            return res.cc('更新用户资料失败');

        // 返回更新成功
        res.send({
            status: 0,
            message: '更新用户资料成功'
        })
        
    }catch(err){
        res.cc(err);
    }
}

// 修改用户密码的处理函数
export const updatePasswordHandler = async (req, res) => {
    try{
        // 查询用户id
        const userId = req.auth.id;

        // 查询该用户是否存在
        const [user] = await db.query(`select * from users where id= ?`, [userId]);

        // 如果用户不存在 则返回错误
        if(user.length === 0)
            return res.cc('用户不存在');
        
        // 判断旧密码是否正确
        const CompareResult = bcrypt.compareSync(req.body.oldPwd, user[0].password);

        // 如果旧密码不正确 则返回错误
        if(!CompareResult)
            return res.cc('旧密码错误,请重新输入');

        // 如果旧密码正确 则进行密码更新 并对新密码进行哈希值加密
        const [result] = await db.query(`update users set password= ? where id= ?`, [bcrypt.hashSync(req.body.newPwd, 10), userId]);

        // 检查更新操作是否成功
        if(result.affectedRows !== 1)
            return res.cc('更新密码失败');

        // 返回更新成功
        res.send({
            status: 0,
            message: '更新密码成功'
        })

    }catch(err){
        res.cc(err)
    } 
}
