import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useAppLayout = createGlobalState(() => {
  const layoutState = ref<'open'|'semi-open'|'closed'>('closed')

  return { layoutState }
})
