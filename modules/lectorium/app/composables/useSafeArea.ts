import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useSafeArea = createGlobalState(() => {
  const top = ref(0)
  const left = ref(0)
  const right = ref(0)
  const bottom = ref(0)

  return { top, left, right, bottom }
})
