import db from './db'

export function queryDemo() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM demo', (err, result) => {
      if (err)
        return reject(err)
      resolve(result)
    })
  })
}
