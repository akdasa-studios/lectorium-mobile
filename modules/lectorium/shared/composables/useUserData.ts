import { CollectionsService, MediaService, PlaylistService } from '@lectorium/shared'
import { createGlobalState } from '@vueuse/core'
import { useDatabase } from './useDatabase'

export const useUserData = createGlobalState(() => {
  const database = useDatabase()

  const PLAYLIST_ITEMS_REPOSITORY = new PlaylistService(database.local.userData)
  const COLLECTIONS_REPOSITORY = new CollectionsService(database.local.userData)
  const MEDIA_SERVICE = new MediaService(database.local.userData)

  return {
    playlist: PLAYLIST_ITEMS_REPOSITORY,
    collections: COLLECTIONS_REPOSITORY,
    media: MEDIA_SERVICE
  }
})
