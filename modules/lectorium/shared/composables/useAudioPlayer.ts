import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useAudioPlayer = createGlobalState(() => {
  const currentTrackId = ref<string>()
  const position = ref(0)
  const duration = ref(0)
  const playing = ref(false)
  const loading = ref(false)

  return { currentTrackId, position, duration, playing, loading }
})
