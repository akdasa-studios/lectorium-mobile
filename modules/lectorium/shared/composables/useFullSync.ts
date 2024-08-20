import { createGlobalState } from '@vueuse/core'
import { useConfig } from './useConfig'
import { useSync } from '@lectorium/shared'
import { useUserData } from '@lectorium/shared'


export const useFullSync = createGlobalState(() => {
  const config = useConfig()
  const sync = useSync()
  const { playlist } = useUserData()

  async function execute() {
    const options = {
      dictionaryData: { enabled: true },
      trackInfos: { enabled: true },
      searchIndex: { enabled: true },
      trackTranscripts: {
        enabled: true,
        trackIds: await playlist.getTrackIds()
      },
    }

    console.log('Full sync started...', options)
    await sync.execute(options)
    config.lastSyncedAt.value = Date.now()
  }

  return { execute, progress: sync.progress }
})
