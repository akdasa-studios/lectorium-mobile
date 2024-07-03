import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useConfig = createGlobalState(() => {
  const currentTrackId = ref<string | undefined>(undefined)
  const tracksQueue = ref<string[]>([])
  const currentTrackPosition = ref(0)

  return { currentTrackId, tracksQueue, currentTrackPosition }
})
