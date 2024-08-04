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
watch(() => audioPlayer.playing.value, async (current) => await onPlaying(current))
audioPlayer.bus.rewind.on(async ({ position }) => await onRewind(position))
audioPlayer.bus.open.on(async ({ trackId, position }) => await open(trackId, position))
audioPlayer.bus.close.on(async ({ trackId }) => await close(trackId))

// ── Handlers ────────────────────────────────────────────────────────
async function close(trackId: string) {
  await onPreviousTrackUnload(trackId)
  currentTrackId = ""
}

async function open(trackId: string, position?: number) {
  if (trackId !== currentTrackId) {
    await onPreviousTrackUnload(currentTrackId)
  }
  currentTrackId = trackId
  await onTrackChanged(trackId, position)
}

async function onPlaying(playing: boolean) {
  if (playing) {
    AudioPlayer.play({ audioId: currentTrackId })
  } else {
    AudioPlayer.pause({ audioId: currentTrackId })
  }
}

async function onRewind(position: number) {
  await AudioPlayer.seek({
    audioId: currentTrackId,
    position: position
  })
}

async function onPreviousTrackUnload(trackId: string) {
  await AudioPlayer.stop({ audioId: trackId })
  await AudioPlayer.destroy({ audioId: trackId })
}

async function onTrackChanged(
  trackId: string,
  position?: number
) {
  const track = await library.tracks.get(trackId)
  const media = await userData.media.service.getByUrl(track.url)
  if (!media || media.state !== "downloaded") { return }

  const finalPath = (await Filesystem.getUri({
    directory: Directory.Data,
    path: media.localPath
  })).uri

  await AudioPlayer.create({
    audioId: track.id,
    useForNotification: true,
    audioSource: Capacitor.getPlatform() === "web" ? media.remoteUrl : finalPath,
    friendlyTitle: track.title,
    isBackgroundMusic: true,
    loop: false
  })
  await AudioPlayer.initialize({
    audioId: track.id,
  })
  await AudioPlayer.play({
    audioId: track.id,
  })
  if (position) {
    await AudioPlayer.seek({
      audioId: track.id,
      position: position
    })
  }
}


function startPositionRefreshTimer() {
  positionRefreshTimer = setInterval(async () => {
    if (!currentTrackId) { return }
    if (audioPlayer.playing.value === false) { return }

    const res = await AudioPlayer.getCurrentTime({ audioId: currentTrackId })
    const dur = await AudioPlayer.getDuration({ audioId: currentTrackId })
    audioPlayer.position.value = res.currentTime
    audioPlayer.duration.value = dur.duration
  }, 500)
}

startPositionRefreshTimer()
</script>
