import { PlaylistItemsRepository } from '@lectorium/library/services'

const PLAYLIST_ITEMS_REPOSITORY = new PlaylistItemsRepository()

export function useUserData() {
  return {
    playlistItems: PLAYLIST_ITEMS_REPOSITORY
  }
}
