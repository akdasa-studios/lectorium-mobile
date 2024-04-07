import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useAudioPlayer = createGlobalState(
  () => {
    const playing = ref(false)
    const url = ref('')
    const position = ref(0)

    function play(uri: string) {
      url.value = uri
      setTimeout(() => playing.value = true, 100)
    }

    return { playing, url, position, play }
  }
)
