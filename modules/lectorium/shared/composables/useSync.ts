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
    remote: new Database({ name: config.serverBaseUrl.value + "/" + collectionName })
  }

  // ── Helpers ─────────────────────────────────────────────────────────
  async function execute(
    params: SyncParams
  ) {
    console.log('Syncing data...', params)
    try {
      inProgress.value = true

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
