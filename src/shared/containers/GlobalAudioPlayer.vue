<template>
  <AudioPlayer
    v-model:url="audioPlayer.url.value"
    v-model:playing="audioPlayer.playing.value"
    v-model:position="audioPlayer.position.value"
  />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { AudioPlayer } from '@/shared/components'
import { usePlaylist, useAudioPlayer } from '@/shared/composables'
import { useLibraryRepository } from '@/library/composables'

// ── Dependencies ────────────────────────────────────────────────────
const playlist = usePlaylist()
const audioPlayer = useAudioPlayer()
const libraryService = useLibraryRepository()

// ── Hooks ───────────────────────────────────────────────────────────
watch(playlist.currentTrackId, onTrackChanged, { immediate: true })

// ── Handlers ────────────────────────────────────────────────────────
async function onTrackChanged(trackId: string|undefined) {
  if (!trackId) { return }

  audioPlayer.loading.value = true
  const response = await libraryService.getLecture(trackId)

  if (response?.url) {
    audioPlayer.url.value = response.url
    audioPlayer.loading.value = false
  }
}
</script>
