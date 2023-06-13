<script setup lang='ts'>
import { computed, ref } from 'vue'
import {NButton, NInput, NModal, NTabPane, NTabs} from 'naive-ui'
import { login,sendMessage } from '@/api'
import { useUserStore } from '@/store'
import {SvgIcon} from "@/components/common";
import { useMessage } from 'naive-ui'
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const userStore = useUserStore()
const message = useMessage()


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


const phoneNumber = ref('')
const code = ref()
const verifyText = ref('获取验证码')
const isValidPhoneNumber = (phoneNumber: string) => {
  const regex = /^1[3-9]\d{9}$/
  return regex.test(phoneNumber)
}


const isCounting = ref(false)
const remainingSeconds = ref(60)

function startCountdown() {
	if (!isCounting.value) {
		isCounting.value = true
		remainingSeconds.value = 60
		const intervalId = setInterval(() => {
			remainingSeconds.value--
			verifyText.value=remainingSeconds.value.toString()+'S'
			if (remainingSeconds.value === 0) {
				clearInterval(intervalId)
				isCounting.value = false
			}
		}, 1000)
	}
}
const handleButtonClick = () => {
  if (!isValidPhoneNumber(phoneNumber.value)) {
		message.warning('请输入正确的手机号!')
  }
  else {
		sendMessage(phoneNumber.value)
    // 执行获取验证码的操作
		startCountdown()
		message.success('获取验证码成功!')
  }
}
const toLogin = async () => {
  try {
    const response = await login(phoneNumber.value, code.value)
    const data = response.data
    const msg = response.message
    if (data.code === 200) {
			message.success('登录成功!')
      show.value = false
      userStore.userInfo.name = phoneNumber.value
    }
    else {
			message.error(msg || '登录失败!')
    }
  }
  catch (error: any) {
		message.error(error.message || '服务异常')
  }
}



</script>
<template>
  <NModal v-model:show="show" style="width: 50%; max-width: 420px;height: 50%;min-height: 400px;max-height: 400px" preset="card">

		<NTabs default-value="phone" size="large" justify-content="space-evenly" type="line" >
			<NTabPane name="phone" tab="手机登录" class="mt-4">
				<NInput v-model:value="phoneNumber" class="mt-4" style="width: 100%;" size="large" placeholder="请输入手机号" >
					<template #prefix>
						<SvgIcon class="text-lg" icon="fluent:phone-16-regular" />
					</template>
				</NInput>
				<NInput v-model:value="code" class="mt-4" style="width: 65%;" size="large" placeholder="请输入验证码" >
				<template #prefix>
					<SvgIcon class="text-lg" icon="ic:baseline-domain-verification" />
				</template>
				</NInput>
				<NButton name="verifyCode" :disabled="isCounting"
					class="mt-4" size="large" style="width: 30%;margin-left: 5%;text-align: center;" @click="handleButtonClick"
				>

					{{verifyText}}
				</NButton>
				<NButton  class="mt-4" style="width: 100%;margin-top: 10%" type="primary" size="large"  @click="toLogin">
					登录
				</NButton>
			</NTabPane>
			<NTabPane name="wechat" tab="微信登录" class="mt-4">
				<img src="/path/to/your/wechat/qrcode.jpg" alt="微信登录">
			</NTabPane>
		</NTabs>



  </NModal>
</template>
