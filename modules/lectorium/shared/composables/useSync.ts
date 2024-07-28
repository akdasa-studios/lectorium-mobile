import { ref } from 'vue'
import { Database } from '@core/persistence'
import { createGlobalState } from '@vueuse/core'

interface SyncParams {
  trackIds: string[]
}

export const useSync = createGlobalState(() => {
  const inProgress = ref(false)
  const context = {
    local:  new Database({ name: 'library' }),
    remote: new Database({ name: 'http://localhost:5984/library' })
  }

  /**
   * Executes the synchronization process.
   * @param params The synchronization parameters.
   */
  async function execute(
    params: SyncParams
  ) {
    try {
      inProgress.value = true

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
    } finally {
      inProgress.value = false
    }
  }

  return {
    execute,
    inProgress
  }
})
