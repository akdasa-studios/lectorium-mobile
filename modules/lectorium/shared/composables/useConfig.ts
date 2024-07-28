import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'
import { ENVIRONMENT } from '@core/env'

export const useConfig = createGlobalState(() => {
  const serverBaseUrl        = ref(ENVIRONMENT.databaseUrl)
  const currentTrackId       = ref<string | undefined>(undefined)
  const tracksQueue          = ref<string[]>([])
  const currentTrackPosition = ref(0)

  return { currentTrackId, tracksQueue, currentTrackPosition, serverBaseUrl }
})
