<script setup lang='ts'>
import { computed } from 'vue'
import { NButton, NModal } from 'naive-ui'
import imageSrc from '@/assets/img.png'

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const show = computed({
  get: () => props.visible,
  set: (visible: boolean) => emit('update:visible', visible),
})
</script>

<template>
  <NModal v-model:show="show" style="width: 90%; max-width: 900px;" preset="card">
    <div class="text-center mt-4">
      <h2 class="text-lg font-bold mb-2">
        OpenAI交流群,联系我加群↓↓↓
      </h2>
    </div>

    <div class="text-center my-8">
      <div style="display: flex; justify-content: center; align-items: center; height: 50vh;">
        <img
          :src="imageSrc" alt="Image" style="max-width: 100%;max-height: 100%;"
        >
      </div>
    </div>

    <div class="text-center">
      <NButton @click="show = false">
        好的
      </NButton>
    </div>
  </NModal>
</template>
