import { CollectionsRepository, PlaylistItemsRepository } from '@lectorium/library/services'

const PLAYLIST_ITEMS_REPOSITORY = new PlaylistItemsRepository()
const COLLECTIONS_REPOSITORY = new CollectionsRepository()

export function useUserData() {
  return {
    playlistItems: PLAYLIST_ITEMS_REPOSITORY,
    collections: COLLECTIONS_REPOSITORY,
  }
}
