<template>
  <AudioPlayer
    v-model:url="audioPlayer.url.value"
    v-model:playing="audioPlayer.playing.value"
    v-model:position="audioPlayer.position.value"
  />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { AudioPlayer } from '@lectorium/shared/components'
import { usePlaylist, useAudioPlayer } from '@lectorium/shared/composables'
import { useLibrary } from '@lectorium/library/composables'

// ── Dependencies ────────────────────────────────────────────────────
const playlist = usePlaylist()
const audioPlayer = useAudioPlayer()
const library = useLibrary()

// ── Hooks ───────────────────────────────────────────────────────────
watch(playlist.currentTrackId, onTrackChanged, { immediate: true })

// ── Handlers ────────────────────────────────────────────────────────
async function onTrackChanged(trackId: string|undefined) {
  if (!trackId) { return }

  audioPlayer.loading.value = true
  const response = await library.tracks.getLecture(trackId)

  if (response?.url) {
    audioPlayer.url.value = response.url
    audioPlayer.loading.value = false
  }
}
</script>
