import db from "../db/index.js";

// 导入密码加密模块
import bcrypt from 'bcryptjs';
// 导入JWT模块
import jwt from 'jsonwebtoken';
// 导入全局配置文件
import config from '../config.js';
// 导入用于将客户端发送过来的JWT字符串进行解析还原成JSON对象的包
import expressJwt from 'express-jwt';
import { sendEmailCodeService, verifyEmailCodeService, verifyEmailCodeNoConsumeService } from '../services/email.service.js';


// 注册新用户的处理函数
export const registerHandler = async (req,res)=>{
    console.log(req.body)
    try{

        const {
            student_id,
            username,
            password,
            email,
            code,
            phone,
            college,
            major,
            grade
        } = req.body

        if(
            !student_id ||
            !username ||
            !password ||
            !email ||
            !code
        ){
            return res.cc('请填写完整信息')
        }

        // 验证学号是否存在
        const [userRows] = await db.query(
            'select id from users where student_id=?',
            [student_id]
        )

        if(userRows.length > 0){
            return res.cc('该学号已注册')
        }

        // 验证邮箱验证码
        const [codeRows] = await db.query(
            `select * from email_codes
             where email = ?
             and code = ?
             and expire_time > NOW()`,
            [email,code]
        )

        if(codeRows.length !== 1){
            return res.cc('验证码错误或已过期')
        }

        // 加密密码
        const hashedPassword = bcrypt.hashSync(password,10)

        // 注册用户
        const [result] = await db.query(
            `insert into users
            (
                student_id,
                username,
                password,
                phone,
                email,
                college,
                major,
                grade
            )
            values(?,?,?,?,?,?,?,?)`,
            [
                student_id,
                username,
                hashedPassword,
                phone || null,
                email,
                college || null,
                major || null,
                grade || null
            ]
        )

        if(result.affectedRows !== 1){
            return res.cc('注册失败')
        }

        // 注册成功后删除验证码
        await db.query(
            'delete from email_codes where email=?',
            [email]
        )

        res.cc('注册成功',0)

    }catch(err){
        res.cc(err)
    }
}
// 忘记密码：校验学号是否存在
export const checkStudentIdHandler = async (req, res) => {
    try {
        const { student_id } = req.body;

        if (!student_id) return res.cc('请输入学号');

        const [rows] = await db.query(
            'SELECT id, email FROM users WHERE student_id = ?',
            [student_id]
        );

        if (rows.length !== 1) return res.cc('该学号不存在');

        const email = rows[0].email;
        if (!email) return res.cc('该账号未绑定邮箱，无法找回密码');

        const maskedEmail = email.replace(/(^.{2})(.*)(@.*$)/, (_, a, b, c) => {
            return a + b.replace(/./g, '*') + c;
        });

        res.send({
            status: 0,
            message: '学号校验通过',
            data: {
                email: maskedEmail,
            },
        });
    } catch (err) {
        res.cc(err);
    }
}

// 忘记密码：邮箱校验并发送验证码
export const sendForgetEmailCodeHandler = async (req, res) => {
    try {
        const { student_id, email } = req.body;

        if (!student_id || !email) return res.cc('请输入学号和邮箱');

        const [rows] = await db.query(
            'SELECT id, email FROM users WHERE student_id = ?',
            [student_id]
        );

        if (rows.length !== 1) return res.cc('该学号不存在');
        if (rows[0].email !== email) return res.cc('该邮箱不是该账号绑定的邮箱');

        await sendEmailCodeService(email, 'forget');

        res.send({
            status: 0,
            message: '验证码已发送至绑定邮箱'
        });
    } catch (err) {
        res.cc(err);
    }
}

// 忘记密码：验证码校验（不消耗验证码）
export const verifyForgetEmailCodeHandler = async (req, res) => {
    try {
        const { student_id, email, code } = req.body;

        if (!student_id || !email || !code) return res.cc('请输入完整信息');

        const [rows] = await db.query(
            'SELECT id, email FROM users WHERE student_id = ?',
            [student_id]
        );

        if (rows.length !== 1) return res.cc('该学号不存在');
        if (rows[0].email !== email) return res.cc('该邮箱不是该账号绑定的邮箱');

        const valid = await verifyEmailCodeNoConsumeService(email, code, 'forget');
        if (!valid) return res.cc('验证码错误或已过期');

        res.send({
            status: 0,
            message: '验证码校验通过'
        });
    } catch (err) {
        res.cc(err);
    }
}

// 忘记密码：重置密码
export const resetPasswordHandler = async (req, res) => {
    try {
        const { student_id, email, code, password } = req.body;

        if (!student_id || !email || !code || !password) return res.cc('请输入完整信息');

        const [rows] = await db.query(
            'SELECT id, email FROM users WHERE student_id = ?',
            [student_id]
        );

        if (rows.length !== 1) return res.cc('该学号不存在');
        const user = rows[0];
        if (user.email !== email) return res.cc('该邮箱不是该账号绑定的邮箱');

        const valid = await verifyEmailCodeService(email, code, 'forget');
        if (!valid) return res.cc('验证码错误或已过期');

        const hashedPassword = bcrypt.hashSync(password, 10);
        const [result] = await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, user.id]
        );

        if (result.affectedRows !== 1) return res.cc('密码修改失败');

        res.send({
            status: 0,
            message: '密码修改成功'
        });
    } catch (err) {
        res.cc(err);
    }
}
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

        if(rows[0].status !== 1)
            return res.cc('该用户已被禁用');

        // 生成JWT字符串
        // 剔除密码和头像等敏感信息 确保JWT不超过4kb大小
        const user = {...rows[0], password: '', user_pic:''};

        // 调用jwt.sign()方法生成JWT的Token字符串
        // 参数1：用户信息对象
        // 参数2：加密的密钥字符串  
        // 参数3：配置对象，可以配置当前Token的有效期
        const tokenStr = jwt.sign(
            {   id:user.id,
                role:user.role
            }, 
            config.jwtSecretKey, {expiresIn: config.expiresIn});

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