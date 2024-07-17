import { CollectionsRepository, PlaylistItemsRepository } from '@lectorium/playlist/services'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

const PLAYLIST_ITEMS_REPOSITORY = new PlaylistItemsRepository()
const COLLECTIONS_REPOSITORY = new CollectionsRepository()

export const useUserData = createGlobalState(() => {
  const playlistItemsChangedAt = ref<number>(0)
  const collectionsChangedAt = ref<number>(0)

  PLAYLIST_ITEMS_REPOSITORY.onChange(() => { playlistItemsChangedAt.value = Date.now() })
  COLLECTIONS_REPOSITORY.onChange(() => { collectionsChangedAt.value = Date.now() })

  return {
    playlistItems: {
      service: PLAYLIST_ITEMS_REPOSITORY,
      changedAt: playlistItemsChangedAt,
    },
    collections: {
      service: COLLECTIONS_REPOSITORY,
      changedAt: collectionsChangedAt,
    }
  }
})
