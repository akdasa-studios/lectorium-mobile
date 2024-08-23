import { createGlobalState } from '@vueuse/core'
import { useConfig } from './useConfig'
import { useMetrics, useSync } from '@lectorium/shared'
import { useUserData } from '@lectorium/shared'


export const useFullSync = createGlobalState(() => {
  const config = useConfig()
  const sync = useSync()
  const metrics = useMetrics()
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

    // Start the sync and measure the time it takes.
    const startTime = Date.now()
    await sync.execute(options)
    const endTime = Date.now()

    // If this is the first sync, we want to track the full sync duration.
    if (!config.lastSyncedAt.value) {
      metrics.distribution(
        "sync.full.duration", endTime - startTime,
        { unit: "millisecond" }
      )
    }

    // Update the last sync time.
    config.lastSyncedAt.value = Date.now()
  }

  return { execute, progress: sync.progress }
})
