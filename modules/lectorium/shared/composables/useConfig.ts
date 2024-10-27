import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'
import { ENVIRONMENT } from '@core/env'

export const useConfig = createGlobalState(() => {
  const serverBaseUrl        = ref(ENVIRONMENT.baseUrl)
  const currentTrackId       = ref<string | undefined>(undefined)
  const tracksQueue          = ref<string[]>([])
  const currentTrackPosition = ref(0)
  const lastSyncedAt         = ref(0)
  const prebuiltDbInstalled  = ref<'installed' | 'not-installed' | 'failed'>('not-installed')
  const locale               = ref('ru')

  return {
    currentTrackId,
    tracksQueue,
    currentTrackPosition,
    serverBaseUrl,
    lastSyncedAt,
    prebuiltDbInstalled,
    locale,
  }
})
