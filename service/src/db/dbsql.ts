import db from './db'

/**
 * USERS
 */
// 插入用户
export function insertUser(user_id: string, wechat_id: string, phone_number: string, ip: string) {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO users (user_id, wechat_id, phone_number, ip) VALUES (?,?,?,?)', [user_id, wechat_id, phone_number, ip], (error, results, fields) => {
      if (error)
        reject(error)
      else resolve(results)
    })
  })
}
//
// // 删除用户
// export function deleteUser(user_id: string) {
//   return new Promise((resolve, reject) => {
//     db.query('DELETE FROM users WHERE user_id = ?', [user_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// // 更新用户
// export function updateUser(user_id: string, wechat_id: string, phone_number: string) {
//   return new Promise((resolve, reject) => {
//     db.query('UPDATE users SET wechat_id = ?, phone_number = ? WHERE user_id = ?', [wechat_id, phone_number, user_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// // 查询用户
// export function getUser(user_id: string) {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// /**
//  * SESSIONS
//  */
// // 插入会话
// export function insertSession(user_id: string, session_name: string) {
//   return new Promise((resolve, reject) => {
//     db.query('INSERT INTO sessions (user_id, session_name) VALUES (?, ?)', [user_id, session_name], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// // 删除会话
// export function deleteSession(session_id: number) {
//   return new Promise((resolve, reject) => {
//     db.query('DELETE FROM sessions WHERE session_id = ?', [session_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// // 更新会话
// export function updateSession(session_id: number, user_id: string, session_name: string) {
//   return new Promise((resolve, reject) => {
//     db.query('UPDATE sessions SET user_id = ?, session_name = ? WHERE session_id = ?', [user_id, session_name, session_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// // 查询会话
// export function getSession(session_id: number) {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT * FROM sessions WHERE session_id = ?', [session_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// /**
//  * MESSAGES
//  */
// // 插入消息
// export function insertMessage(session_id: number, message_text: string, sender_id: number, receiver_id: number) {
//   return new Promise((resolve, reject) => {
//     db.query('INSERT INTO messages (session_id, message_text, sender_id, receiver_id) VALUES (?, ?, ?, ?)', [session_id, message_text, sender_id, receiver_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// // 删除消息
// export function deleteMessage(message_id: number) {
//   return new Promise((resolve, reject) => {
//     db.query('DELETE FROM messages WHERE message_id = ?', [message_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// // 更新消息
// export function updateMessage(message_id: number, session_id: number, message_text: string, sender_id: number, receiver_id: number) {
//   return new Promise((resolve, reject) => {
//     db.query('UPDATE messages SET session_id = ?, message_text = ?, sender_id = ?, receiver_id = ? WHERE message_id = ?', [session_id, message_text, sender_id, receiver_id, message_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
//
// // 查询消息
// export function getMessage(message_id: number) {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT * FROM messages WHERE message_id = ?', [message_id], (error, results, fields) => {
//       if (error)
//         reject(error)
//       else resolve(results)
//     })
//   })
// }
