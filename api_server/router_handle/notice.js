import db from '../db/index.js';

// 获取公告数据
export const getNoticeListHandler = async (req, res) => {
  try {
    const [list] = await db.query(
      `SELECT * FROM announcements WHERE status = 1`
    );
    res.send({
      status: 0,
      message: '获取公告列表成功',
      data: list
    });
  } catch (err) {
    res.cc(err);
  }
}
