<template>
  <PageWithHeader title="Library">
    <AudioPlayerControls 
      style="height: 100%;" 
      v-model:playing="audioPlayer.playing.value"
      v-model:position="audioPlayer.position.value"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { PageWithHeader } from '@/shared/components'
import { AudioPlayerControls } from '@/player/components'
import { useAudioPlayer } from '@/shared/composables'

// ── Dependencies ────────────────────────────────────────────────────
const audioPlayer = useAudioPlayer()
</script>

