import { watch } from "vue"
import { useAudioPlayer } from "@lectorium/shared/composables"
import { useUserData } from "@lectorium/playlist"

/**
 * Saves the position when the track is changed or paused.
 */
export async function runPlaylistPersistence() {
  const audioPlayer = useAudioPlayer()
  const data = useUserData()

  watch([
    audioPlayer.trackId,
    audioPlayer.playing,
    audioPlayer.position,
  ], async (current, previous) => {
    const cur  = { trackId: current[0],  playing: current[1],  position: current[2] }
    const prev = { trackId: previous[0], playing: previous[1], position: previous[2] }

    const isTrackChanged = cur.trackId !== prev.trackId
    const isCurentTrackPaused = cur.trackId && !cur.playing

    if (isTrackChanged && prev.trackId) {
      // Track has changed. Save the position of the previous track.
      await data.playlistItems.service.setPlayedTime(prev.trackId, prev.position)
    } else if (!isTrackChanged && isCurentTrackPaused) {
      // Track is paused. Save the position of the current track.
      await data.playlistItems.service.setPlayedTime(cur.trackId!, cur.position)
    }
  })
}
