<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NButton, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import {useAppStore, useChatStore} from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { AiTalk, Login, PromptStore } from '@/components/common'
// const userStore = useUserStore()

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const show = ref(false)
const showAiTalk = ref(true)
const showLogin = ref(false)

// const isLogin = ref(userStore.userInfo.isLogin)

const collapsed = computed(() => appStore.siderCollapsed)

function handleAdd() {
  chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
 function redirectToAITools() {
	 window.open('https://tools.yunjieguimeng.com', '_blank');
}

function redirectToCard() {
	window.open('https://card.yunjieguimeng.com', '_blank');
}

</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            {{ $t('chat.newChatButton') }}
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
        <div class="p-4">
          <NButton block @click="show = true">
            {{ $t('store.siderButton') }}
          </NButton>
          <div style="height: 10px;" /> <!-- 添加一个10像素宽度的空元素 -->
          <NButton block @click="showAiTalk = true">
            {{ $t('store.aiTalk') }}
          </NButton>
                    <div style="height: 10px;" /> <!-- 添加一个10像素宽度的空元素 -->
<!--                    <NButton v-if="!isLogin" block @click="showLogin = true">-->
<!--                      {{ $t('store.showLogin') }}-->
<!--                    </NButton>-->

					<NButton  block @click="redirectToAITools">
						AI工具集
					</NButton>
					<div style="height: 10px;" /> <!-- 添加一个10像素宽度的空元素 -->
					<NButton  block @click="redirectToCard">
						GPT独享账号
					</NButton>
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <PromptStore v-model:visible="show" />

  <AiTalk v-model:visible="showAiTalk" />

  <Login v-model:visible="showLogin" />
</template>
