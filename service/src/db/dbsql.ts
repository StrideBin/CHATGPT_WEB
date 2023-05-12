import db from './db'

export function queryUUid(uuid) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT uuid,valid_until FROM uuid where uuid = '${uuid}'`, (err, result) => {
      if (err)
        return reject(err)
      resolve(result)
    })
  })
}
export function insertUUid(uuid, ip) {
  return new Promise((resolve, reject) => {
    const currentTime = new Date()
    currentTime.setMinutes(currentTime.getMinutes() + 10)
    db.query('INSERT INTO uuid(uuid,ip,valid_until) VALUES (?, ?, ?)',
      [uuid, ip, currentTime], (err, result) => {
        if (err)
          return reject(err)
        resolve(result)
      })
  })
}
