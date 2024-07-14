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
        :position="audioPlayer.state.value.position"
        :percentPlayed="percentPlayed"
        :track="currentTrack"
        @play-clicked="audioPlayer.togglePause()"
        @rewind="(to) => audioPlayer.rewindTo(to)"
        @click="onPlayerClicked"
      />
    </template>
  </AppLayout>
</template>


<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Track } from '@core/models'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { useLibrary } from '@lectorium/library/composables'
import { MainSection, PlayerSection, useAppLayout } from '@lectorium/app'
import { AppLayout } from '@lectorium/app'

// ── Dependencies ────────────────────────────────────────────────────
const appLayout   = useAppLayout()
const audioPlayer = useAudioPlayer()
const library     = useLibrary()

// ── State ───────────────────────────────────────────────────────────
const refPlayerSection   = ref<InstanceType<typeof PlayerSection>>()
const currentTrack  = ref<Track|undefined>()
const percentPlayed = computed(() => audioPlayer.state.value.position / audioPlayer.state.value.duration * 100)



// ── State ───────────────────────────────────────────────────────────
watch(() => audioPlayer.state.value.trackId, async (value) => {
  currentTrack.value = value ? await library.tracks.getLecture(value) : currentTrack.value
}, { immediate: true })

watch(appLayout.layoutState, (value) => {
  if (value === 'closed') { audioPlayer.stop() }
})

// ── Handlers ────────────────────────────────────────────────────────
function onPlayerClicked() {
  appLayout.layoutState.value = 'open'
}
</script>