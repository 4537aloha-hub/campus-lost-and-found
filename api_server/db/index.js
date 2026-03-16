// 导入数据库模块mysql2
import mysql from 'mysql2/promise'

// 连接数据库
const db = await mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'campus_lost_and_found'
})


// 导出数据库对象 ES6模块化语法
export default db