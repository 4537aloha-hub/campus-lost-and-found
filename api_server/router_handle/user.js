import db from "../db/index.js";

// 导入密码加密模块
import bcrypt from 'bcryptjs';
// 导入JWT模块
import jwt from 'jsonwebtoken';
// 导入全局配置文件
import config from '../config.js';
// 导入用于将客户端发送过来的JWT字符串进行解析还原成JSON对象的包
import expressJwt from 'express-jwt';


// 注册新用户的处理函数
export const registerHandler = async (req, res) => {
    try {
        const { student_id,
                username, 
                password,
                phone,
                email,
                college,
                major,
                grade
            } = req.body;

        if (!student_id || !username || !password)
            return res.cc('学号、用户名和密码不能为空');

        const [rows] = await db.query(
            'select * from users where student_id=?',
            [student_id]
        );

        if (rows.length > 0)
            return res.cc('该学号已被注册');

        const hashedPassword = bcrypt.hashSync(password, 10);

        const [result] = await db.query(
            `insert into users (student_id, username, password, phone, email, college, major, grade) values (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student_id, 
                username, 
                hashedPassword, 
                phone || null, 
                email || null, 
                college || null, 
                major || null, 
                grade || null
            ]
        );

        if (result.affectedRows !== 1)
            return res.cc('注册失败');

        res.cc('注册成功', 0);

    } catch (err) {
        res.cc(err);
    }
};

// 登录的处理函数
export const loginHandler = async (req, res) => {
    try {
        const {student_id, password} = req.body;

        // 验证学号和密码是否为空
        if(!student_id || !password)
            return res.cc('学号和密码不能为空');

        // 查询是否存在该学号的用户
        const [rows] = await db.query(
            'select * from users where student_id= ?',
            [student_id]
        ) 
        if (rows.length !== 1)
            return res.cc('该学号未被注册');

        // 验证密码是否正确
        const compareResult = bcrypt.compareSync(password, rows[0].password);
        if (!compareResult)
            return res.cc('密码错误');
        

        // 生成JWT字符串
        // 剔除密码和头像等敏感信息 确保JWT不超过4kb大小
        const user = {...rows[0], password: '', user_pic:''};

        // 调用jwt.sign()方法生成JWT的Token字符串
        // 参数1：用户信息对象
        // 参数2：加密的密钥字符串  
        // 参数3：配置对象，可以配置当前Token的有效期
        const tokenStr = jwt.sign({id:user.id}, config.jwtSecretKey, {expiresIn: config.expiresIn});

        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr,
            userInfo: user,
        });

    } catch (err) {
        res.cc(err);
    }
}

