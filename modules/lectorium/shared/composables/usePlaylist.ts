import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const usePlaylist = createGlobalState(
  () => {
    const trackIds = ref<string[]>([])
    const currentTrackId = ref<string|undefined>()

    function enqueue(trackId: string) {
      if (!trackIds.value.includes(trackId)) {
        trackIds.value.push(trackId)
      }
      if (!currentTrackId.value) {
        currentTrackId.value = trackId
      }
    }

    function isEmpty() {
      return trackIds.value.length === 0
    }

    return { enqueue, isEmpty, trackIds, currentTrackId }
  }
)

