import db from './db'

/**
 * USERS
 */
// 通过微信ID或者手机号查询用户
export function getUser(wechat_id: string, phone_number: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE wechat_id = ? or phone_number=? ', [wechat_id, phone_number], (error, results, fields) => {
      if (error)
        reject(error)
      else resolve(results)
    })
  })
}
// 用户注册，通过手机号或者微信号
export function insertUser(user_id: string, wechat_id: string, phone_number: string, ip: string) {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO users (user_id, wechat_id, phone_number, ip) VALUES (?,?,?,?)', [user_id, wechat_id, phone_number, ip], (error, results, fields) => {
      if (error)
        reject(error)
      else resolve(results)
    })
  })
}
// 微信用户绑定手机或手机用户绑定微信
export function updateUser(user_id: string, wechat_id: string, phone_number: string) {
  return new Promise((resolve, reject) => {
    db.query('UPDATE users SET wechat_id = ?, phone_number = ? WHERE user_id = ?', [wechat_id, phone_number, user_id], (error, results, fields) => {
      if (error)
        reject(error)
      else resolve(results)
    })
  })
}
// 记录用户的聊天记录
export function addStore(user_id: string, store: string) {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO store (user_id, store) VALUES (?,?)', [user_id, store], (error, results, fields) => {
      if (error)
        reject(error)
      else resolve(results)
    })
  })
}
// 根据用户id查询用户历史聊天记录
export function getStore(user_id: string) {
  return new Promise((resolve, reject) => {
    db.query('SELECT text FROM store WHERE user_id = ?', [user_id], (error, results, fields) => {
      if (error)
        reject(error)
      else resolve(results)
    })
  })
}
// 微信用户绑定手机或手机用户绑定微信
export function updateStore(user_id: string, text: string) {
  return new Promise((resolve, reject) => {
    db.query('UPDATE store SET text = ? WHERE user_id = ?', [text, user_id], (error, results, fields) => {
      if (error)
        reject(error)
      else resolve(results)
    })
  })
}
// 发送验证码的短信，存放于phone表中
export function insertMessage(phone_number: string, code: number) {
  const currentTime = new Date()
  currentTime.setMinutes(currentTime.getMinutes() + 5)
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO phone (phone_number, code, valid_time) VALUES (?,?,?)', [phone_number, code, currentTime], (error, results, fields) => {
      if (error)
        reject(error)
      else resolve(results)
    })
  })
}

export function checkMessage(phone_number: string, code: number) {
  const currentTime = new Date()
  return new Promise((resolve, reject) => {
    db.query('SELECT count(*) as cn FROM phone WHERE phone_number = ? and code = ? and valid_time>?', [phone_number, code, currentTime], (error, results, fields) => {
      if (error)
        reject(error)
      else resolve(results)
    })
  })
}
