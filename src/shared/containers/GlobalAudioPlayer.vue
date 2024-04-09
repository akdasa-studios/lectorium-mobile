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
import { useLibraryService } from '@/library/composables'

// ── Dependencies ────────────────────────────────────────────────────
const playlist = usePlaylist()
const audioPlayer = useAudioPlayer()
const libraryService = useLibraryService()

// ── Hooks ───────────────────────────────────────────────────────────
watch(playlist.currentTrackId, onTrackChanged)

// ── Handlers ────────────────────────────────────────────────────────
async function onTrackChanged(trackId: string|undefined) {
  if (!trackId) { return }
  audioPlayer.startLoading()
  const response = await libraryService.getLecture(trackId)
  if (response?.url) { 
    audioPlayer.play(response.url) 
  } else { 
    audioPlayer.stop() 
  }
}
</script>
