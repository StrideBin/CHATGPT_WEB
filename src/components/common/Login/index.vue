<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal } from 'naive-ui'
import { login, sendMessage } from '@/api'
import { useUserStore } from '@/store'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const userStore = useUserStore()
interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const show = computed({
  get: () => props.visible,
  set: (visible: boolean) => emit('update:visible', visible),
})

// 新增登录方式状态
const loginType = ref('phone')

const phoneNumber = ref('')
const code = ref()
const allMessage = ref('')

const isValidPhoneNumber = (phoneNumber: string) => {
  // console.log('111111111')
  const regex = /^1[3-9]\d{9}$/
  return regex.test(phoneNumber)
}

const handleButtonClick = () => {
  if (!isValidPhoneNumber(phoneNumber.value)) {
    allMessage.value = '请输入正确的手机号!'
    setTimeout(() => {
      allMessage.value = ''
    }, 2000)
  }
  else {
    // 执行获取验证码的操作
    allMessage.value = '获取验证码成功!'
    setTimeout(() => {
      allMessage.value = ''
    }, 2000)
    sendMessage(phoneNumber.value)
  }
}
const toLogin = async () => {
  // eslint-disable-next-line no-console
  console.log('toLogin')
  try {
    const response = await login(phoneNumber.value, code.value)
    const data = response.data
    const message = response.message
    if (data.code === 200) {
      allMessage.value = '登录成功!'
      setTimeout(() => {
        allMessage.value = ''
      }, 2000)
      show.value = false
      userStore.userInfo.name = phoneNumber.value
    }
    else {
      allMessage.value = message || ''
      setTimeout(() => {
        allMessage.value = ''
      }, 2000)
    }
  }
  catch (error: any) {
    allMessage.value = error.message || '服务异常'
    setTimeout(() => {
      allMessage.value = ''
    }, 2000)
  }
}
</script>

<template>
  <NModal v-model:show="show" style="width: 60%; max-width: 400px;" preset="card">
    <div class="flex justify-between" style="background-color: #f0f0f0">
      <h2
        :style="{ backgroundColor: loginType === 'phone' ? '#000000' : '#f0f0f0', color: 'darkgray' }"
        style="flex: 1; text-align: center; padding: 10px; cursor: pointer"
        @click="loginType = 'phone'"
      >
        手机登录
      </h2>
      <h2
        :style="{ backgroundColor: loginType === 'wechat' ? '#000000' : '#f0f0f0', color: 'darkgray' }"
        style="flex: 1; text-align: center; padding: 10px; cursor: pointer"
        @click="loginType = 'wechat'"
      >
        微信登录
      </h2>
    </div>
    <div v-if="loginType === 'phone'" class="mt-4">
      <NInput v-model:value="phoneNumber" class="mt-4" style="width: 100%;height: 20%" placeholder="请输入手机号" />
      <NInput v-model:value="code" class="mt-4" style="width: 65%;height: 20%" placeholder="请输入验证码" />
      <NButton
        class="mt-4" style="width: 30%;margin-left: 5%;text-align: center;" @click="handleButtonClick"
      >
        获取验证码
      </NButton>
      <div
        v-if="allMessage"
        style="width:12%;height:5%;position: fixed; top: 5%; left: 50%; transform: translateX(-50%); background-color: white;  text-align: center;padding-top: 10px; z-index: 999;border-radius: 5px;"
      >
        {{ allMessage }}
      </div>

      <NButton class="mt-4" style="width: 100%;margin-top: 20px" @click="toLogin">
        登录
      </NButton>
    </div>
    <div v-else class="mt-4">
      <img src="/path/to/your/wechat/qrcode.jpg" alt="微信登录">
    </div>
  </NModal>
</template>
