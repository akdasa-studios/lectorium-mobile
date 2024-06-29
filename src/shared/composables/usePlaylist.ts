import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const usePlaylist = createGlobalState(
  () => {
    const trackIds = ref<string[]>([])
    const currentTrackId = ref<string|undefined>()

    function enqueue(trackId: string) {
      if (currentTrackId.value === undefined && trackIds.value.length === 0) {
        currentTrackId.value = trackId
      }

      if (!trackIds.value.includes(trackId)) {
        trackIds.value.push(trackId)
      }
    }

    return { enqueue, trackIds, currentTrackId }
  }
)

