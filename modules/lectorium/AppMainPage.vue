<template>
  <AppLayout
    v-model:player-section-state="appLayout.layoutState"
    :open-handle="refPlayerSection?.handleTopRef?.$el"
    :close-hanle="refPlayerSection?.handleBottomRef?.$el"
  >
    <template #main="props">
      <MainSection
        :shrink-size="props.shrink"
    />
    </template>

    <template #player>
      <PlayerSection
        ref="refPlayerSection"
        :playing="audioPlayer.playing.value"
        :loading="false"
        :position="audioPlayer.position.value"
        :percentPlayed="percentPlayed"
        :track="currentTrack"
        :transcript="currentTranscript"
        @play-clicked="audioPlayer.togglePause()"
        @rewind="(to) => audioPlayer.rewindTo(to)"
        @click="onPlayerClicked"
      />
    </template>
  </AppLayout>
</template>


<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Track, TrackTranscript } from '@core/models'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { useLibrary } from '@lectorium/library'
import { MainSection, PlayerSection, useAppLayout } from '@lectorium/app'
import { AppLayout } from '@lectorium/app'

// ── Dependencies ────────────────────────────────────────────────────
const appLayout   = useAppLayout()
const audioPlayer = useAudioPlayer()
const library     = useLibrary()

// ── State ───────────────────────────────────────────────────────────
const refPlayerSection  = ref<InstanceType<typeof PlayerSection>>()
const currentTrack      = ref<Track|undefined>()
const currentTranscript = ref<TrackTranscript|undefined>()
const percentPlayed     = computed(() => audioPlayer.position.value / audioPlayer.duration.value * 100)

// ── State ───────────────────────────────────────────────────────────
watch(audioPlayer.trackId, async (value) => {
  // TODO: https://github.com/akdasa-studios/lectorium-mobile/issues/31
  currentTrack.value      = value ? await library.tracks.getTrack(value) : currentTrack.value
  currentTranscript.value = value ? await library.tracks.getTranscript(value, 'ru') : currentTranscript.value
}, { immediate: true })

watch(appLayout.layoutState, (value) => {
  if (value === 'closed') { audioPlayer.stop() }
})

// ── Handlers ────────────────────────────────────────────────────────
function onPlayerClicked() {
  appLayout.layoutState.value = 'open'
}
</script>