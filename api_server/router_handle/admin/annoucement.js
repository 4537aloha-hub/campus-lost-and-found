import db from "../../db/index.js"

// 新增公告
export const addAnnouncementHandler = async (req, res) => {
  try {
    // 从请求体中获取公告内容
    const {
      title,
      content,
      priority,
      status = 1, // 1: 正常 0: 已删除
      is_top = 1, // 1: 置顶 0: 不置顶
    } = req.body;

    // 插入公告到数据库
    await db.query(
      `INSERT INTO announcements (title, content, status, is_top) VALUES (?, ?, ?, ?)`,
      [title, content, status, is_top]
    );

    res.send({
      status: 0,
      message: '新增公告成功'
    });
  } catch (err) {
    res.cc(err);
  }
}

// 获取公告列表 支持分页
export const getAnnouncementListHandler = async (req, res) => {
  try {
    // 分页参数
    const { pageNum = 1, pageSize = 10 } = req.query;
    const offset = (Number(pageNum) - 1) * Number(pageSize);

    // 基础条件：未删除
    let where = `WHERE status = 1`;

    // 查询总数
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM announcements ${where}`
    );

    // 查询分页列表
    const [list] = await db.query(
      `SELECT * FROM announcements ${where} ORDER BY id DESC LIMIT ?, ?`,
      [offset, Number(pageSize)]
    );

    res.send({
      status: 0,
      message: '获取公告列表成功',
      data: {
        list,
        total
      }
    });
  } catch (err) {
    res.cc(err);
  }
}

// 修改公告
export const updateAnnouncementHandler = async (req, res) => {
  try {
    // 从请求体中获取公告内容
    const {
      id,
      title,
      content,
      priority,
      status = 1, // 1: 正常 0: 已删除
      is_top = 1, // 1: 置顶 0: 不置顶
    } = req.body;

    // 更新公告到数据库
    await db.query(
      `UPDATE announcements SET title = ?, content = ?, priority = ?, status = ?, is_top = ? WHERE id = ?`,
      [title, content, priority, status, is_top, id]
    );

    res.send({
      status: 0,
      message: '修改公告成功'
    });
  } catch (err) {
    res.cc(err);
  }
}

// 删除公告
export const deleteAnnouncementHandler = async (req, res) => {
  try {
    // 从请求参数中获取公告ID
    const { id } = req.params;

    // 更新公告状态为已删除
    await db.query(
      `UPDATE announcements SET status = 0 WHERE id = ?`,
      [id]
    );

    res.send({
      status: 0,
      message: '删除公告成功'
    });
  } catch (err) {
    res.cc(err);
  }
}

// 置顶公告
export const topAnnouncementHandler = async (req, res) => {
  try {
    // 从请求参数中获取公告ID
    const { id } = req.params;

    // 更新公告状态为置顶
    await db.query(
      `UPDATE announcements SET is_top = 1 WHERE id = ?`,
      [id]
    );

    res.send({
      status: 0,
      message: '置顶公告成功'
    });
  } catch (err) {
    res.cc(err);
  }
}

// 隐藏公告
export const hideAnnouncementHandler = async (req, res) => {
  try {
    // 从请求参数中获取公告ID
    const { id } = req.params;

    // 更新公告状态为隐藏
    await db.query(
      `UPDATE announcements SET status = 0 WHERE id = ?`,
      [id]
    );

    res.send({
      status: 0,
      message: '隐藏公告成功'
    });
  } catch (err) {
    res.cc(err);
  }
}