import { CollectionsService, MediaService, PlaylistService } from '@lectorium/shared'
import { createGlobalState } from '@vueuse/core'

export const useUserData = createGlobalState(() => {
  const PLAYLIST_ITEMS_REPOSITORY = new PlaylistService()
  const COLLECTIONS_REPOSITORY = new CollectionsService()
  const MEDIA_SERVICE = new MediaService()

  return {
    playlist: PLAYLIST_ITEMS_REPOSITORY,
    collections: COLLECTIONS_REPOSITORY,
    media: MEDIA_SERVICE
  }
})
