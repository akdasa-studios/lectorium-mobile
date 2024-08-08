<script setup lang="ts">
import { useLibrary } from '@lectorium/library'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { watch } from 'vue'
import { useUserData } from '@lectorium/playlist'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { AudioPlayer } from '@core/plugins'
import { Capacitor } from '@capacitor/core'

// ── Dependencies ────────────────────────────────────────────────────
const audioPlayer = useAudioPlayer()
const library = useLibrary()
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
let currentTrackId = ""
let positionRefreshTimer: NodeJS.Timeout | null = null

// ── Hooks ───────────────────────────────────────────────────────────
watch(() => audioPlayer.playing.value, async (current) => await play(current))
audioPlayer.bus.rewind.on(async ({ position }) => await rewind(position))
audioPlayer.bus.open.on(async ({ trackId, position }) => await open(trackId, position))
audioPlayer.bus.close.on(async () => await closeCurrentTrack())

// ── Handlers ────────────────────────────────────────────────────────
/**
 * Open track in the player. Close the current track if needed.
 * @param trackId Track ID to open.
 * @param position Position to seek in seconds.
 */
async function open(
  trackId: string,
  position?: number
) {
  if (currentTrackId && trackId !== currentTrackId) {
    await closeCurrentTrack()
  }
  currentTrackId = await loadTrack(trackId, position)
}

/**
 * Close current track in the player.
 */
async function closeCurrentTrack() {
  await unloadTrack(currentTrackId)
  currentTrackId = ""
}

/**
 * Set playing state of the player.
 * @param playing Playing state.
 */
async function play(
  playing: boolean
) {
  if (!currentTrackId) { return }
  if (playing) {
    await AudioPlayer.play({ audioId: currentTrackId })
  } else {
    await AudioPlayer.pause({ audioId: currentTrackId })
  }
}

/**
 * Seek to the position in the current track.
 * @param position Position in seconds.
 */
async function rewind(
  position: number
) {
  if (!currentTrackId) { return }
  await AudioPlayer.seek({
    audioId: currentTrackId,
    position: position
  })
}

/**
 * Load track into the player.
 * @param trackId Track ID to load.
 * @param position Seek position in seconds.
 */
async function loadTrack(
  trackId: string,
  position?: number
): Promise<string> {
  // Gets information about the track. Skip it if the track is not found
  // or not downloaded.
  const track = await library.tracks.get(trackId)
  const media = await userData.media.service.getByUrl(track.url)
  if (!media || media.state !== "downloaded") { return "" }

  // Get path to the media file according to the platform.
  const isWeb = Capacitor.getPlatform() === "web"
  const audioSource = isWeb
    ? media.remoteUrl
    : (await Filesystem.getUri({
        directory: Directory.Data,
        path: media.localPath
      })).uri

  // Initialize track in the player.
  await AudioPlayer.create({
    audioId: track.id,
    audioSource: audioSource,
  })
  await AudioPlayer.onProgressChanged({
    audioId: track.id
  }, (v) => {
    audioPlayer.position.value = v.position
    audioPlayer.duration.value = v.duration
  })

  // Play the track and seek to the position if needed.
  await AudioPlayer.play({
    audioId: track.id,
  })
  if (position) {
    await AudioPlayer.seek({
      audioId: track.id,
      position: position
    })
  }

  return track.id
}

/**
 * Unload track from the player.
 * @param trackId Track ID
 */
async function unloadTrack(
  trackId: string
) {
  await AudioPlayer.stop({ audioId: trackId })
}
</script>
