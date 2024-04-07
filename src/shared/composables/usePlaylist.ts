import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const usePlaylist = createGlobalState(
  () => {
    const trackIds = ref<string[]>([])
    const currentTrackId = ref<string|undefined>()

    function enqueue(trackId: string) {
      currentTrackId.value = trackId
      // trackIds.value.push(trackId)
    }

    return { enqueue, currentTrackId }
  }
)

