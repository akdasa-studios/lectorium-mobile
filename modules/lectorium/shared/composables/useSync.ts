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
  inProgress: boolean
}

export const useSync = createGlobalState(() => {

  // ── Dependencies ────────────────────────────────────────────────────
  const config = useConfig()

  // ── State ───────────────────────────────────────────────────────────
  const context = {
    local: {
      tracks:      new Database({ name: 'library-tracks-v0001' }),
      transcripts: new Database({ name: 'library-transcripts-v0001' }),
      dictionary:  new Database({ name: 'library-dictionary-v0001' }),
      index:       new Database({ name: 'library-index-v0001' }),
    },
    remote: {
      tracks:      new Database({ name: config.serverBaseUrl.value + '/library-tracks-v0001' }),
      transcripts: new Database({ name: config.serverBaseUrl.value + '/library-transcripts-v0001' }),
      dictionary:  new Database({ name: config.serverBaseUrl.value + '/library-dictionary-v0001' }),
      index:       new Database({ name: config.serverBaseUrl.value + '/library-index-v0001' }),
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────
  async function execute(
    params: SyncParams,
    progress?: (value: SyncProgress) => void,
  ) {
    console.log('Syncing data...', params)
    try {
      // Replicate dictionary data
      if (params?.dictionaryData?.enabled) {
        await context.local.dictionary.replicateFrom(
          context.remote.dictionary, {
            filter: function(doc) {
              return !doc._id.startsWith('_design/');
            },
            onChange(v) {
              progress && progress({ task: 'dictionary', documentsPending: v.documentsPending, inProgress: true })
            }
          },
        )
      }

      // Replicate track infos data
      if (params?.trackInfos?.enabled) {
        await context.local.tracks.replicateFrom(
          context.remote.tracks, {
            filter: function(doc) {
              return !doc._id.startsWith('_design/');
            },
            onChange(v) {
              progress && progress({ task: 'tracks', documentsPending: v.documentsPending, inProgress: true })
            }
          },
        )
      }

      // Replicate track transcripts data
      if (params?.trackTranscripts?.enabled) {
        await context.local.transcripts.replicateFrom(
          context.remote.transcripts, {
            filter: 'library/by_id',
            query_params: { ids: params.trackTranscripts.trackIds },
            onChange(v) {
              progress && progress({ task: 'transcripts', documentsPending: v.documentsPending, inProgress: true })
            }
          },
        )
      }

      // Replicate Library Index database
      if (params?.searchIndex?.enabled) {
        await context.local.index.replicateFrom(
          context.remote.index, {
            filter: function(doc) {
              return !doc._id.startsWith('_design/');
            },
            onChange(v) {
              progress && progress({ task: 'index', documentsPending: v.documentsPending, inProgress: true })
            }
          }
        )
      }

      config.lastSyncedAt.value = Date.now()
      progress && progress({ task: '', documentsPending: 0, inProgress: false })
    } catch (error) {
      console.error("Unable to sync data", error)
    } finally {
      console.log("Sync complete...")
      progress && progress({ task: '', documentsPending: 0, inProgress: false })
    }
  }

  // ── Interface ─────────────────────────────────────────────────────────
  return { execute }
})
