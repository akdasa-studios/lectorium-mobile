<template>
  <audio ref="audioRef" />
</template>

<script setup lang="ts">
import { useLibrary } from '@lectorium/library'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { ref, watch } from 'vue'
import { useMediaControls } from '@vueuse/core'
import { useUserData } from '@lectorium/playlist'

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
async function onTrackChanged(
  trackId: string | undefined,
  position: number
) {
  if (trackId) {
    const track = await library.tracks.get(trackId)
    const media = await userData.media.service.getByUrl(track.url)

    if (media?.state === "downloaded") {
      url.value = media.path
    } else {
      url.value = track.url
    }

    console.log("playing", url.value)
    currentTime.value = position
  }
}

function onRewindRequested(position: number) {
  currentTime.value = position
}
</script>
