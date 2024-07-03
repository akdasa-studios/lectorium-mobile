<template>
  <PageWithHeader
    title="Library"
    :loading="false"
  >
    <AudioPlayerControls
      style="height: 100%;"
      v-model:playing="audioPlayer.playing.value"
      v-model:position="audioPlayer.position.value"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { PageWithHeader } from '@lectorium/shared/components'
import { AudioPlayerControls } from '@lectorium/player/components'
import { useAudioPlayer } from '@lectorium/shared/composables'

// ── Dependencies ────────────────────────────────────────────────────
const audioPlayer = useAudioPlayer()
</script>

