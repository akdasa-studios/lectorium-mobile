import { watch } from "vue"
import { useAudioPlayer } from "../composables"
import { useUserData } from "@lectorium/playlist"

export async function runPlaylistPersistence() {
  const audioPlayer = useAudioPlayer()
  const data = useUserData()

  watch([
    audioPlayer.trackId,
    audioPlayer.playing,
    audioPlayer.position,
  ], async (current, previous) => {
    const c = { trackId: current[0], playing: current[1], position: current[2] }
    const p = { trackId: previous[0], playing: previous[1], position: previous[2] }

    if (c.trackId !== p.trackId && p.trackId) {
      await data.playlistItems.service.setPlayedTime(p.trackId, p.position)
      console.log('Track has changed', p.trackId, p.position)
    }
    if (c.trackId === p.trackId && !c.playing && c.trackId) {
      await data.playlistItems.service.setPlayedTime(c.trackId, c.position)
      console.log('Track is paused', c.trackId, c.position)
    }
  })
}
