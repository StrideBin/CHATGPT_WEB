import express from 'express'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'

const app = express()// 创建 Express 应用程序实例。
const router = express.Router()// 创建路由器实例。

app.use(express.static('public'))// 使用静态文件托管中间件来服务 public 目录下的静态资源。
app.use(express.json())// 使用 bodyParser 中间件来解析请求体。

// 使用 app.all() 设置跨域访问的响应头信息。
app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

// 定义 '/chat-process' 路由，使用 [auth, limiter] 中间件对请求进行身份验证和限流，并使用 async/await 来处理异步请求，并返回 Promise 的二进制数据类型。
router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

// 定义 '/config' 路由，使用 auth 中间件验证身份，并使用 async/await 处理异步请求，并返回 Promise 的 JSON 数据类型。
router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

// 定义 '/session' 路由，处理异步请求，并返回一个包含当前机器人模型和认证信息的 JSON 响应。
router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

// 定义 '/verify' 路由，处理异步请求，并返回一个 JSON 响应，指示传递的令牌是否有效。
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})
// 使用 app.use() 和 router 实例将路由器挂载到路径 '' 上和路径 '/api' 上。
app.use('', router)
app.use('/api', router)

// 设置服务器信任代理以解析访问者IP。
app.set('trust proxy', 1)

// 启动服务器并监听端口号 3002。
app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
