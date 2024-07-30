import { ref } from 'vue'
import { Database } from '@core/persistence'
import { createGlobalState } from '@vueuse/core'
import { useConfig } from './useConfig'

interface SyncParams {
  trackIds: string[]
}

export const useSync = createGlobalState(() => {

  // ── Dependencies ────────────────────────────────────────────────────
  const config     = useConfig()

  // ── State ───────────────────────────────────────────────────────────
  const collectionName = 'library'
  const inProgress = ref(false)
  const context = {
    local:  new Database({ name: collectionName }),
    remote: new Database({ name: config.serverBaseUrl.value + "/" + collectionName })
  }

  // ── Helpers ─────────────────────────────────────────────────────────
  async function execute(
    params: SyncParams
  ) {
    try {
      inProgress.value = true

      // Replicate dictionary data from remote database
      await context.local.replicateFrom(
        context.remote, { filter: 'library/dictionaryData' })

      // Replicate track information documents from remote database
      await context.local.replicateFrom(
        context.remote, { filter: 'library/trackInfos' })

      // Replicate transcripts for tracks added to playlist
      await context.local.replicateFrom(
        context.remote,
        {
          filter: 'library/trackTranscripts',
          query_params: {
            trackIds: params.trackIds
          }
        }
      )
      config.lastSyncedAt.value = Date.now()
    } finally {
      inProgress.value = false
    }
  }

  // ── Interface ─────────────────────────────────────────────────────────
  return { execute, inProgress }
})
