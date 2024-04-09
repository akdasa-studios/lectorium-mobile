import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useAudioPlayer = createGlobalState(
  () => {
    const url = ref('')
    const position = ref(0)
    const playing = ref(false)
    const loading = ref(false)

    function play(uri: string) {
      playing.value = false
      url.value = uri
      setTimeout(() => { playing.value = true; loading.value = false; }, 10)
    }

    function startLoading() {
      loading.value = true
    }

    function togglePlaying() {
      playing.value = !playing.value
    }

    return { url, position, play, stop, togglePlaying, playing, loading, startLoading }
  }
)
