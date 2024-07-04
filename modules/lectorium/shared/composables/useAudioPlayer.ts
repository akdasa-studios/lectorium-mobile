import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useAudioPlayer = createGlobalState(
  () => {
    const url = ref('')
    const position = ref(0)
    const duration = ref(0)
    const playing = ref(false)
    const loading = ref(false)

    function play() {
      playing.value = true
    }

    function startLoading() {
      loading.value = true
    }

    function togglePlaying() {
      playing.value = !playing.value
    }

    function stop() {
      playing.value = false
    }

    return { url, position, play, stop, togglePlaying, playing, loading, startLoading, duration }
  }
)
