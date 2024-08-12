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
  const documentsPendingToSync = ref(0)
  const context = {
    local:  new Database({ name: collectionName }),
    remote: new Database({ name: config.serverBaseUrl.value + "/" + collectionName }),

    localLibraryIndex:  new Database({ name: "library-v0001-index" }),
    remoteLibraryIndex: new Database({ name: config.serverBaseUrl.value + "/library-v0001-index" }),
  }

  // ── Helpers ─────────────────────────────────────────────────────────
  async function execute(
    params: SyncParams
  ) {
    console.log('Syncing data...', params)
    try {
      inProgress.value = true

      // Replicate Library database
      await context.local.replicateFrom(
        context.remote,
        {
          filter: 'library/sync',
          style: 'main_only',
          query_params: { trackIds: params.trackIds },
          onChange(v) {
            documentsPendingToSync.value = v.documentsPending
          }
        },
      )

      // Replicate Library Index database
      await context.localLibraryIndex.replicateFrom(
          context.remoteLibraryIndex
      )

      config.lastSyncedAt.value = Date.now()
    } catch (error) {
      console.error("Unable to sync data", error)
    } finally {
      inProgress.value = false
    }
  }

  // ── Interface ─────────────────────────────────────────────────────────
  return { execute, inProgress, documentsPendingToSync }
})
