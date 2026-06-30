import nodemailer from 'nodemailer';
import { emailConfig } from '../config.js';

const transporter = nodemailer.createTransport(emailConfig);

export const sendEmailCode = async (to, code, type) => {
    try {
        // 根据类型设置不同的邮件主题
        const subject = type === 'verify'
            ? '邮箱验证 - 校园失物招领系统'
            : type === 'forget'
                ? '找回密码 - 校园失物招领系统'
                : '邮箱绑定 - 校园失物招领系统';
        const actionText = type === 'verify'
            ? '邮箱验证'
            : type === 'forget'
                ? '找回密码'
                : '邮箱绑定';
        
        await transporter.sendMail({
            from: `"校园失物招领系统"<${emailConfig.auth.user}>`,
            to,
            subject,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            },
            html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                <h2 style="color: #333; text-align: center;">校园失物招领系统</h2>
                <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                    <p style="color: #666; font-size: 14px;">您好，您正在进行${actionText}操作，以下是您的验证码：</p>
                    <div style="margin-top: 16px; text-align: center;">
                        <span style="font-size: 32px; font-weight: bold; color: #409eff;">${code}</span>
                    </div>
                    <p style="margin-top: 16px; color: #999; font-size: 12px;">该验证码仅在5分钟内有效，请及时输入。</p>
                    <p style="margin-top: 8px; color: #999; font-size: 12px;">如果不是您本人操作，请忽略此邮件。</p>
                </div>
                <p style="margin-top: 20px; color: #999; font-size: 12px; text-align: center;">© 2024 校园失物招领系统</p>
            </div>
            `
        });
        console.log(`[邮件发送成功] 目标邮箱：${to}，类型：${type}`);
    } catch (error) {
        console.error(`[邮件发送失败] 目标邮箱：${to}，错误信息：`, error.message);
        throw new Error(`邮件发送失败：${error.message}`);
    }
}