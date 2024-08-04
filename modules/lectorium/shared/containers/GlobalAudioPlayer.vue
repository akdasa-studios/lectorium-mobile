<template>
</template>

<script setup lang="ts">
import { useLibrary } from '@lectorium/library'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { ref, watch } from 'vue'
import { useUserData } from '@lectorium/playlist'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { AudioPlayer } from '@core/plugins'

// ── Dependencies ────────────────────────────────────────────────────
const audioPlayer = useAudioPlayer()
const library = useLibrary()
const userData = useUserData()

// ── State ───────────────────────────────────────────────────────────
const trackId = ref<string>("")

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


watch(() => audioPlayer.state.value.playing, (current) => {
  if (!trackId.value) { return }
  if (current) {
    AudioPlayer.play({ audioId: trackId.value })
  } else {
    AudioPlayer.pause({ audioId: trackId.value })
  }
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
  if (trackId) {
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
      audioSource: finalPath,
      friendlyTitle: track.title,
      isBackgroundMusic: true,
      loop: false
    })
    await AudioPlayer.initialize({
      audioId: track.id,
    })
    audioPlayer.duration.value = (await AudioPlayer.getDuration({
      audioId: track.id
    })).duration
    await AudioPlayer.seek({
      audioId: track.id,
      timeInSeconds: position
    })
    await AudioPlayer.play({
      audioId: track.id,
    })
  }
}

async function onRewindRequested(
  position: number
) {
  await AudioPlayer.seek({
    audioId: trackId.value,
    timeInSeconds: position
  })
}

setInterval(async () => {
  if (trackId.value) {
    audioPlayer.position.value = (await AudioPlayer.getCurrentTime({ audioId: trackId.value })).currentTime
  }
}, 1000)
</script>
