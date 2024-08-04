<template>
  <audio ref="audioRef" />
</template>

<script setup lang="ts">
import { useLibrary } from '@lectorium/library'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { ref, watch } from 'vue'
import { useMediaControls } from '@vueuse/core'
import { useUserData } from '@lectorium/playlist'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { AudioPlayer } from '@core/plugins'

// ── Dependencies ────────────────────────────────────────────────────
const audioPlayer = useAudioPlayer()
const library = useLibrary()
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
const url = ref<string>("")
const audioRef = ref()
const { playing, waiting, duration, currentTime } = useMediaControls(audioRef, { src: url })

// ── Hooks ───────────────────────────────────────────────────────────
watch(audioPlayer.state, async (current, previous) => {
  if (current.trackId !== previous.trackId) {
    if (previous.trackId) { await onPreviousTrackUnload(previous.trackId) }
    await onTrackChanged(current.trackId, current.position)
  }
  if (current.position !== previous.position) {
    onRewindRequested(current.position)
  }
})

watch(waiting, (current, previous) => {
  if (!current) {
    playing.value = audioPlayer.state.value.playing
    audioPlayer.state.value.duration = duration.value
    audioPlayer.state.value.loading = false
  }
})

watch(currentTime, (current) => {
  audioPlayer.state.value.position = current
})

watch(() => audioPlayer.state.value.playing, (current) => {
  if (waiting.value || !url.value) { return }
  playing.value = current
})

// ── Handlers ────────────────────────────────────────────────────────
async function onPreviousTrackUnload(trackId: string) {
  try {
    await AudioPlayer.stop({ audioId: trackId })
    await AudioPlayer.destroy({ audioId: trackId })
  } catch (error) {
    // @ts-ignore
    console.error("Error onPreviousTrackUnload", error.message)
  }
}

async function onTrackChanged(
  trackId: string | undefined,
  position: number
) {
  try {
  if (trackId) {
    const track = await library.tracks.get(trackId)
    const media = await userData.media.service.getByUrl(track.url)

    if (media?.state === "downloaded") {
      const finalPath = (await Filesystem.getUri({
        directory: Directory.Data,
        path: media.localPath
      })).uri

      await AudioPlayer.create({
        audioId: track.id,
        useForNotification: true,
        audioSource: finalPath,
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

    } else {
      // url.value = track.url
    }

    console.log("playing", url.value)
    currentTime.value = position
  }
  } catch (error) {
    // @ts-ignore
    console.error("Error onTrackChanged", error.message)
  }
}

function onRewindRequested(position: number) {
  currentTime.value = position
}
</script>
