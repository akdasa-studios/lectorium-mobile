import { CollectionsRepository } from '@lectorium/playlist/services'
import { MediaService, PlaylistService } from '@lectorium/shared'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

const PLAYLIST_ITEMS_REPOSITORY = new PlaylistService()
const COLLECTIONS_REPOSITORY = new CollectionsRepository()
const MEDIA_SERVICE = new MediaService()

export const useUserData = createGlobalState(() => {
  const playlistItemsChangedAt = ref<number>(0)
  const collectionsChangedAt = ref<number>(0)
  const mediaItemsChangedAt = ref<number>(0)

  PLAYLIST_ITEMS_REPOSITORY.onChange(() => { playlistItemsChangedAt.value = Date.now() })
  COLLECTIONS_REPOSITORY.onChange(() => { collectionsChangedAt.value = Date.now() })
  MEDIA_SERVICE.onChange(() => { mediaItemsChangedAt.value = Date.now() })

  return {
    playlistItems: {
      service: PLAYLIST_ITEMS_REPOSITORY,
      changedAt: playlistItemsChangedAt,
    },
    collections: {
      service: COLLECTIONS_REPOSITORY,
      changedAt: collectionsChangedAt,
    },
    media: {
      service: MEDIA_SERVICE,
      changedAt: mediaItemsChangedAt,
    }
  }
})
