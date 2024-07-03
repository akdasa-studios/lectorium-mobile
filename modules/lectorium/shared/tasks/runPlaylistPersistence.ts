import { useAudioPlayer, useConfig, usePlaylist } from '@lectorium/shared/composables'
import { syncRef } from '@vueuse/core'
import { watch } from 'vue'

export async function runPlaylistPersistence() {
  // --- Dependencies -----------------------------------
  const config = useConfig()
  const playlist = usePlaylist()
  const player = useAudioPlayer()

  // --- Initialization ---------------------------------
  syncRef(playlist.currentTrackId, config.currentTrackId, { immediate: true })
  syncRef(playlist.trackIds, config.tracksQueue, { direction: 'both', deep: true })
  syncRef(player.position, config.currentTrackPosition, { direction: 'both', immediate: true })
}
