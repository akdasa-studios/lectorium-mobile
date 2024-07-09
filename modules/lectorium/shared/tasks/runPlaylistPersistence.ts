import { watch } from "vue"
import { useAudioPlayer } from "../composables"
import { useUserData } from "@lectorium/library";

export async function runPlaylistPersistence() {
  const audioPlayer = useAudioPlayer()
  const data = useUserData()

  watch(audioPlayer.state, async (current, previous) => {
    if (current.trackId !== previous.trackId) {
      if (!previous.trackId) { return }
      data.playlistItems.setPlayedTime(previous.trackId, previous.position)
      console.log('Track has changed', previous.trackId, previous.position)
    } else if (current.trackId === previous.trackId && !current.playing) {
      if (!current.trackId) { return }
      data.playlistItems.setPlayedTime(current.trackId, current.position)
      console.log('Track is paused', current.trackId, current.position)
    }
  })
}
