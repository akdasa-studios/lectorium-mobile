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
        :playing="audioPlayer.state.value.playing"
        :loading="audioPlayer.state.value.loading"
        :position="audioPlayer.state.value.position"
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
import { useLibrarySync } from './library/composables/useLibrarySync'

// ── Dependencies ────────────────────────────────────────────────────
const appLayout   = useAppLayout()
const audioPlayer = useAudioPlayer()
const library     = useLibrary()
const librarySync = useLibrarySync()

// ── State ───────────────────────────────────────────────────────────
const refPlayerSection  = ref<InstanceType<typeof PlayerSection>>()
const currentTrack      = ref<Track|undefined>()
const currentTranscript = ref<TrackTranscript|undefined>()
const percentPlayed     = computed(() => audioPlayer.state.value.position / audioPlayer.state.value.duration * 100)


librarySync.sync() // TODO: move somewhere else

// ── State ───────────────────────────────────────────────────────────
watch(() => audioPlayer.state.value.trackId, async (value) => {
  // TODO: change language for transcript
  currentTrack.value      = value ? await library.tracks.get(value) : currentTrack.value
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