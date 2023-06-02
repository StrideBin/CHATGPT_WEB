import type { Connection } from 'mysql2'
import { createConnection } from 'mysql2'

const db: Connection = createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Mysql2022!',
  database: 'c-web',
  // port: 12345 如果是3306就不需要配置
})

// 连接数据库
db.connect((err) => {
  if (err) {
    console.error(`${err}error connecting to MySQL database`)
    return
  }
  // eslint-disable-next-line no-console
  console.log('connected to MySQL database')
})

export default db
