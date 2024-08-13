import { ref } from 'vue'
import { Database } from '@core/persistence'
import { createGlobalState } from '@vueuse/core'
import { useConfig } from './useConfig'

type SyncTaskParams = {
  enabled: boolean
}

interface SyncParams {
  dictionaryData?: SyncTaskParams
  trackInfos?: SyncTaskParams
  trackTranscripts?: {
    trackIds: string[]
  } & SyncTaskParams
  searchIndex?: SyncTaskParams
}

export type SyncProgress = {
  task: string
  documentsPending: number
}

export const useSync = createGlobalState(() => {

  // ── Dependencies ────────────────────────────────────────────────────
  const config     = useConfig()

  // ── State ───────────────────────────────────────────────────────────
  const collectionName = 'library'
  const inProgress = ref(false)
  const context = {
    local:  new Database({ name: collectionName }),
    remote: new Database({ name: config.serverBaseUrl.value + "/" + collectionName }),

    localLibraryIndex:  new Database({ name: "library-v0001-index" }),
    remoteLibraryIndex: new Database({ name: config.serverBaseUrl.value + "/library-v0001-index" }),
  }

  // ── Helpers ─────────────────────────────────────────────────────────
  async function execute(
    params: SyncParams,
    progress?: (value: SyncProgress) => void,
  ) {
    console.log('Syncing data...', params)
    try {
      inProgress.value = true

      // Replicate dictionary data
      if (params?.dictionaryData?.enabled) {
        await context.local.replicateFrom(
          context.remote, {
            filter: 'library/dictionaryData',
            onChange(v) {
              progress && progress({ task: 'dictionary', documentsPending: v.documentsPending })
            }
          },
        )
      }

      // Replicate track infos data
      if (params?.trackInfos?.enabled) {
        await context.local.replicateFrom(
          context.remote, {
            filter: 'library/trackInfos',
            onChange(v) {
              progress && progress({ task: 'tracks', documentsPending: v.documentsPending })
            }
          },
        )
      }

      // Replicate track transcripts data
      if (params?.trackTranscripts?.enabled) {
        await context.local.replicateFrom(
          context.remote, {
            filter: 'library/trackTranscripts',
            query_params: { trackIds: params.trackTranscripts.trackIds },
            onChange(v) {
              progress && progress({ task: 'transcripts', documentsPending: v.documentsPending })
            }
          },
        )
      }

      // Replicate Library Index database
      if (params?.searchIndex?.enabled) {
        await context.localLibraryIndex.replicateFrom(
          context.remoteLibraryIndex, {
            onChange(v) {
              progress && progress({ task: 'index', documentsPending: v.documentsPending })
            }
          }
        )
      }

      config.lastSyncedAt.value = Date.now()
    } catch (error) {
      console.error("Unable to sync data", error)
    } finally {
      console.log("Sync complete...")
      inProgress.value = false
    }
  }

  // ── Interface ─────────────────────────────────────────────────────────
  return { execute, inProgress }
})
