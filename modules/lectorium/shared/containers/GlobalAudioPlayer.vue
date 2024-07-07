<template>
  <AudioPlayer
    v-model:url="url"
    v-model:playing="audioPlayer.playing.value"
    v-model:position="audioPlayer.position.value"
    v-model:duration="audioPlayer.duration.value"
  />
</template>

<script setup lang="ts">
import { useLibrary } from '@lectorium/library/composables'
import { AudioPlayer } from '@lectorium/shared/components'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { ref, watch } from 'vue'

// ── Dependencies ────────────────────────────────────────────────────
const audioPlayer = useAudioPlayer()
const library = useLibrary()

// ── State ───────────────────────────────────────────────────────────
const url = ref<string>("")

// ── Hooks ───────────────────────────────────────────────────────────
watch(audioPlayer.currentTrackId, onTrackChanged, { immediate: true })

// ── Handlers ────────────────────────────────────────────────────────
async function onTrackChanged(
  trackId: string|undefined
) {
  if (!trackId) { return }

  const track = await library.tracks.get(trackId)
  url.value = track.url
  // audioPlayer.loading.value = true
  // audioPlayer.loading.value = false
}
</script>
