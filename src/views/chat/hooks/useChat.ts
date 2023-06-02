import { useChatStore } from '@/store'
export function useChat() {
  const chatStore = useChatStore()

  const getChatByUuidAndIndex = (uuid: number, index: number) => {
    return chatStore.getChatByUuidAndIndex(uuid, index)
  }
  // function getCookie(cname: string): string {
  //   const name = `${cname}=`
  //   const decodedCookie = decodeURIComponent(document.cookie)
  //   const ca = decodedCookie.split(';')
  //   for (let i = 0; i < ca.length; i++) {
  //     let c = ca[i]
  //     while (c.charAt(0) == ' ')
  //       c = c.substring(1)
  //
  //     if (c.indexOf(name) == 0)
  //       return c.substring(name.length, c.length)
  //   }
  //   return ''
  // }

  const addChat = (uuid: number, chat: Chat.Chat) => {
    // const user = getCookie('uuid')
    // console.log(`请登录uuid:${user}`)
    // if (user == null)
    //   return '请登录'

    chatStore.addChatByUuid(uuid, chat)

    // const data: string = localStorage.getItem('chatStorage') || '{}'
    // // 将对象转化为 JSON 字符串
    // const jsonString = JSON.stringify(data)
    // console.log(jsonString)
    //
    // addStore('wx_id', jsonString)
  }

  const updateChat = (uuid: number, index: number, chat: Chat.Chat) => {
    chatStore.updateChatByUuid(uuid, index, chat)
  }

  const updateChatSome = (uuid: number, index: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatSomeByUuid(uuid, index, chat)
  }

  return {
    addChat,
    updateChat,
    updateChatSome,
    getChatByUuidAndIndex,
  }
}
