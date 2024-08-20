import { createGlobalState } from '@vueuse/core'
import { useConfig } from './useConfig'
import { SyncService } from '@lectorium/shared'

export const useSync = createGlobalState(() => {
  const config = useConfig()
  return new SyncService(config.serverBaseUrl.value)
})