import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useGlobalAudioPlayer = createGlobalState(
  () => {
    const trackId = ref('')
    const playing = ref(false)
    const url = ref('')
    const position = ref(0)

    return { playing, url, position, trackId }
  }
)
