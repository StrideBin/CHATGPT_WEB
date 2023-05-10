import type { Connection } from 'mysql'
import { createConnection } from 'mysql'

const db: Connection = createConnection({
  host: '',
  user: '',
  password: '',
  database: '',
  // port: 12345 如果是3306就不需要配置
})

// 连接数据库
db.connect((err) => {
  if (err) {
    console.error('error connecting to MySQL database')
    return
  }
  // eslint-disable-next-line no-console
  console.log('connected to MySQL database')
})

export default db
