import express from 'express'
import cookieParser from 'cookie-parser'
import type { ChatMessage } from 'chatgpt'
import { v4 as uuidv4 } from 'uuid'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import type { RequestProps } from './types'
import {addStore, checkMessage, getStore, getUser, insertMessage, insertUser, updateStore} from './db/dbsql'
//阿里云sms
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525'
import OpenApi, * as $OpenApi from '@alicloud/openapi-client'
import Util, * as $Util from '@alicloud/tea-util'



const app = express()// 创建 Express 应用程序实例。
const router = express.Router()// 创建路由器实例。
app.use(express.static('public'))// 使用静态文件托管中间件来服务 public 目录下的静态资源。
app.use(express.json())// 使用 bodyParser 中间件来解析请求体。
app.use(cookieParser())

// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
export default class Client {

  // 使用AK&SK初始化账号Client
  // @param accessKeyId
  // @param accessKeySecret
  // @return Client
  // @throws Exception

static createClient(accessKeyId: string, accessKeySecret: string): Dysmsapi20170525 {
  const config = new $OpenApi.Config({
    // 必填，您的 AccessKey ID
    accessKeyId:accessKeyId,
    // 必填，您的 AccessKey Secret
    accessKeySecret:accessKeySecret,
  })
  // 访问的域名
  config.endpoint = 'dysmsapi.aliyuncs.com'
  return new Dysmsapi20170525(config)
}

  static async sendMessage(phoneNumber: string): Promise<void> {

    const client = Client.createClient(process.env.ACCESS_KEY_ID, process.env.ACCESS_KEY_SECRET)
    const randomNum = Math.floor(100000 + Math.random() * 900000)

    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      signName: '人工智能ChatPlus',
      templateCode: 'SMS_461005317',
      phoneNumbers: phoneNumber,
      templateParam: `{"code":"${randomNum}"}`,
    })
    const runtime = new $Util.RuntimeOptions({ })
    try {
      // 复制代码运行请自行打印 API 的返回值
      const rs = await client.sendSmsWithOptions(sendSmsRequest, runtime)
      if (rs.body.code !== 'OK')
        console.error(rs.body.message)
      else
        await insertMessage(phoneNumber, randomNum)
    }
    catch (error) {
			console.error(error.message)
    }
  }
}

// 使用 app.all() 设置跨域访问的响应头信息。
app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})
function createChatMessagePromise(msg): Promise<any> {
  return new Promise((resolve, reject) => {
    const chatMessage = {
      text: msg,
      status: 'Success',
    }
    resolve(chatMessage)
  })
}

// 定义 '/chat-process' 路由，使用 [auth, limiter] 中间件对请求进行身份验证和限流，并使用 async/await 来处理异步请求，并返回 Promise 的二进制数据类型。
router.post('/chat-process', [auth, limiter], async (req, res) => {
  const uuid = req.cookies?.uuid
	// console.log('cookies'+req.cookies)
	const ip = req.headers['x-real-ip'] as string|| req.headers['x-forwarded-for']  as string|| req.connection.remoteAddress;
	if(!uuid){
		console.log(ip)
			res.setHeader('Content-type', 'application/octet-stream')
			res.write(JSON.stringify('非法访问'))
			res.end()

	}else{
	//如果未登录
  // if (uuid == null) {
	// 	const countMap = new Map<string, any>();
	// 	let useCount:number=0;
	// 	countMap.set(ip, useCount++);
	//
	// 	if(countMap.get(ip)>10){
	// 		res.setHeader('Content-type', 'application/octet-stream')
	// 		res.write(JSON.stringify('为避免恶意访问，未登录的情况下免费使用次数为10次，请登录后继续使用'))
	// 		res.end()
	// 	}
	//
  // }


  // 获取 cookies 中名为 uuid 的值
  // const uuid = req.cookies.uuid
  // queryUUid(uuid)
  //   .then(async (result) => {
  //     console.log('111')
  //     // 获取查询结果中第一条记录的 valid_until 属性值
  //     const validUntil = result[0].valid_until
  //     // 将 valid_until 转换为 Unix 时间戳
  //     const validUntilUnixTime = new Date(validUntil).getTime()
  //     // 获取当前时间的 Unix 时间戳
  //     const currentTimeUnixTime = new Date().getTime()
  //     const formatter = new Intl.DateTimeFormat('zh-CN', {
  //       year: 'numeric',
  //       month: '2-digit',
  //       day: '2-digit',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       second: '2-digit',
  //     })
  //     const chineseDateString = formatter.format(validUntil)
  //     const chatMessage = await createChatMessagePromise(`您的账号已经过期。您的秘钥:${uuid},到期时间:${chineseDateString}。以下两种方式可以继续免费使用：1.加入Q群118078759联系群主。2.打开头像旁边的设置，在公告处扫码捐赠任意金额。注：如需要多平台（或浏览器）登录，请在设置中输入有效的秘钥，即可使用。`)
  //     // 比较 valid_until 和当前时间是否相等
  //     if (validUntilUnixTime < currentTimeUnixTime) {
  //       console.log('222')
  //       res.setHeader('Content-type', 'application/octet-stream')
  //       res.write(JSON.stringify(chatMessage))
  //       res.end()
  //     }
  //     // 处理查询结果
  //   })
  //   .catch((err) => {
  //     // 处理错误
  //     console.error(err)
  //   })

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
		const user_id=uuidv4();
		res.cookie('uuid', user_id)
		const wechat_id='';
		const phone_number='';
		const ip = req.headers['x-real-ip'] as string|| req.headers['x-forwarded-for']  as string|| req.connection.remoteAddress;
		await insertUser(user_id, wechat_id, phone_number, ip);
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
// 定义 '/login' 路由，处理异步请求，并返回一个包含当前机器人模型和认证信息的 JSON 响应。
router.post('/login', async (req, res) => {
  try {
    const phone_number = req.body.phoneNumber
    const code = req.body.code
    const msg = await checkMessage(phone_number, code)
    const values = Object.values(msg)
    if (values[0].cn > 0) {
      const usr = await getUser('', phone_number)
      // const uuid: string = uuidv4() // uuid
      const uuid = ''
      const ip = req.connection.remoteAddress
      if (usr.length !== 0) {
        // 更新uuid为数据库的uuid
        res.cookie('uuid', usr[0].user_id)
        res.send({ status: 'Success', message: '登录成功', data: { code: 200 } })
      }
      else {
        await insertUser(uuid, '', phone_number, ip)
        // 更新uuid为数据库的uuid
        res.cookie('uuid', uuid)
        res.send({ status: 'Success', message: '用户不存在，自动注册新用户。', data: { code: 200 } })
      }
    }
    else {
      res.send({ status: 'Success', message: '验证码不正确', data: { code: 400 } })
    }
  }

  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: { code: 400 } })
  }
})
// 定义 '/addstore' 路由，处理异步请求，并返回一个包含当前机器人模型和认证信息的 JSON 响应。
router.post('/addStore', async (req, res) => {
  const user_id = req.body.user_id
  const text = req.body.text
  const users = getStore(user_id)
  if (users == null)
    await addStore(user_id, text)
  else
    updateStore(user_id, text)

  res.send({ status: 'Success', message: '', data: { msg: '' } })
})
router.post('/sendMessage', async (req, res) => {
  const phoneNumber = req.body.phoneNumber

  await Client.sendMessage(phoneNumber)

  res.send({ status: 'Success', message: '', data: { msg: '' } })
})
router.post('/checkMessage', async (req, res) => {
  const phoneNumber = req.body.phoneNumber
  const code = req.body.code

  const rs = await checkMessage(phoneNumber, code)

  if (rs > 0)
    res.send({ status: 'Success', message: '', data: { code: 200 } })
  else
    res.send({ status: 'false', message: '', data: { code: 400 } })
})

// 更新 store
router.post('/updateStore', async (req, res) => {
  const user_id = req.body.user_id

  const json = fetchAndParseStore(user_id)

  // localStorage.setItem('chatStorage', JSON.stringify(json))

  res.send({ status: 'Success', message: '', data: { msg: '' } })
})

// 更新Store
async function fetchAndParseStore(user_id: string) {
  try {
    const user = await getStore(user_id)
    const json = JSON.parse(user[0].text)
    console.log(json)
  }
  catch (err) {
    console.error(err)
  }
}

// 使用 app.use() 和 router 实例将路由器挂载到路径 '' 上和路径 '/api' 上。
app.use('', router)
app.use('/api', router)

// 设置服务器信任代理以解析访问者IP。
app.set('trust proxy', 1)

// 启动服务器并监听端口号 3002。
app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
