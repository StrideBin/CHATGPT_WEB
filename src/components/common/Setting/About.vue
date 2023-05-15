<script setup lang='ts'>
// import { computed, onMounted, ref } from 'vue'
import { onMounted, ref } from 'vue'
import { fetchChatConfig } from '@/api'
import imageSrc from '@/assets/2.jpeg'

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}

// const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>()

// const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  finally {
    loading.value = false
  }
}
// const canvas = document.createElement('canvas')
// const ctx = canvas.getContext('2d')
//
// QRCode.toCanvas(canvas, 'https://www.example.com', (error: any) => {
//   if (error) {
//     console.error(error)
//   }
//   else {
//     const base64 = canvas.toDataURL('image/png')
//     console.log(base64)
//   }
// })
onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <!--  <NSpin :show="loading"> -->
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-bold">
      Version - 4.0
    </h2>
    <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
      <p>
        如果你觉得此项目对你有帮助，请给予一点赞助，谢谢!
      </p>
      <!-- 或者使用 import 引入图片 -->
      <img
        :src="imageSrc" alt="Image" style="max-width: 60%; max-height: 60%;"
      >
    </div>

    <!--      <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700"> -->
    <!--        <p> -->
    <!--          此项目开源于 -->
    <!--          <a -->
    <!--            class="text-blue-600 dark:text-blue-500" -->
    <!--            href="https://github.com/Chanzhaoyu/chatgpt-web" -->
    <!--            target="_blank" -->
    <!--          > -->
    <!--            GitHub -->
    <!--          </a> -->
    <!--          ，免费且基于 MIT 协议，没有任何形式的付费行为！ -->
    <!--        </p> -->
    <!--        <p> -->
    <!--          如果你觉得此项目对你有帮助，请在 GitHub 帮我点个 Star 或者给予一点赞助，谢谢！ -->
    <!--        </p> -->
    <!--      </div> -->

    <!--      <p>{{ $t("setting.api") }}：{{ config?.apiModel ?? '-' }}</p> -->
    <!--      <p v-if="isChatGPTAPI"> -->
    <!--        {{ $t("setting.monthlyUsage") }}：{{ config?.usage ?? '-' }} -->
    <!--      </p> -->
    <!--      <p v-if="!isChatGPTAPI"> -->
    <!--        {{ $t("setting.reverseProxy") }}：{{ config?.reverseProxy ?? '-' }} -->
    <!--      </p> -->
    <!--      <p>{{ $t("setting.timeout") }}：{{ config?.timeoutMs ?? '-' }}</p> -->
    <!--      <p>{{ $t("setting.socks") }}：{{ config?.socksProxy ?? '-' }}</p> -->
    <!--      <p>{{ $t("setting.httpsProxy") }}：{{ config?.httpsProxy ?? '-' }}</p> -->
  </div>
<!--  </NSpin> -->
</template>
