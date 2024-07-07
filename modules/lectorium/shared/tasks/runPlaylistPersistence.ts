import { watch } from "vue"
import { useAudioPlayer } from "../composables"
import { useUserData } from "@lectorium/library";

export async function runPlaylistPersistence() {
  const audioPlayer = useAudioPlayer()
  const data = useUserData()

  // Track has changed. Save the previous track's position.
  watch([
    audioPlayer.currentTrackId,
    audioPlayer.position
  ], async (
    [currentTrackId],
    [previousTrackId, previousTrackPosition]
  ) => {
    if (!previousTrackId) return;
    if (currentTrackId !== previousTrackId) {
      console.log(`[1] Track ${previousTrackId} is at position ${previousTrackPosition}`);
      data.playlistItems.setPlayedTime(previousTrackId, previousTrackPosition)
    }
  })

  // Track is paused. Save the current track's position.
  watch([
    audioPlayer.currentTrackId,
    audioPlayer.playing,
    audioPlayer.position
  ], async (
    [curTrackId, curPlaying, curPosition],
    [prevTrackId, prevPlaying, prevPosition]
  ) => {
    if (!prevTrackId) return
    if (curTrackId === prevTrackId && prevPlaying && !curPlaying) {
      console.log(`[2] Track ${prevTrackId} is at position ${prevPosition}`);
      data.playlistItems.setPlayedTime(prevTrackId, prevPosition)
    }
  })
}
