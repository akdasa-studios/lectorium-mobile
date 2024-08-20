import { CollectionsService, MediaService, PlaylistService } from '@lectorium/shared'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useUserData = createGlobalState(() => {
  const PLAYLIST_ITEMS_REPOSITORY = new PlaylistService()
  const COLLECTIONS_REPOSITORY = new CollectionsService()
  const MEDIA_SERVICE = new MediaService()

  const playlistItemsChangedAt = ref<number>(0)
  const collectionsChangedAt = ref<number>(0)
  const mediaItemsChangedAt = ref<number>(0)

  PLAYLIST_ITEMS_REPOSITORY.onChange(() => { playlistItemsChangedAt.value = Date.now() })
  COLLECTIONS_REPOSITORY.onChange(() => { collectionsChangedAt.value = Date.now() })
  MEDIA_SERVICE.subscribe(() => { mediaItemsChangedAt.value = Date.now() })

  return {
    playlistItems: {
      service: PLAYLIST_ITEMS_REPOSITORY,
      changedAt: playlistItemsChangedAt,
    },
    collections: {
      service: COLLECTIONS_REPOSITORY,
      changedAt: collectionsChangedAt,
    },
    media: MEDIA_SERVICE
  }
})
