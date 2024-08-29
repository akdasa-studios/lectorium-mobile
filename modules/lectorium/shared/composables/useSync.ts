import { createGlobalState } from '@vueuse/core'
import { SyncService } from '@lectorium/shared'
import { useDatabase } from './useDatabase'

export const useSync = createGlobalState(() => {
  const database = useDatabase()

  return new SyncService({
    local: {
      tracks: database.local.tracks,
      transcripts: database.local.transcripts,
      dictionary: database.local.dictionary,
      index: database.local.index
    },
    remote: {
      tracks: database.remote.tracks,
      transcripts: database.remote.transcripts,
      dictionary: database.remote.dictionary,
      index: database.remote.index
    }
  })
})