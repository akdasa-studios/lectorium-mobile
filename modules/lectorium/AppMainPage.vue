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
        :author="currentAuthorName"
        :title="currentTrackTitle"
        :playing="audioPlayer.playing.value"
        :loading="false"
        :position="audioPlayer.position.value"
        :percentPlayed="percentPlayed"
        :transcript="currentTranscript"
        @play-clicked="audioPlayer.togglePause()"
        @rewind="(to) => audioPlayer.seek(to)"
        @click="onPlayerClicked"
      />
    </template>
  </AppLayout>
</template>


<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { TrackTranscript } from '@core/models'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { useLibrary } from '@lectorium/library'
import { MainSection, PlayerSection, useAppLayout } from '@lectorium/app'
import { AppLayout } from '@lectorium/app'
import { useConfig } from '@lectorium/shared'

// ── Dependencies ────────────────────────────────────────────────────
const appLayout   = useAppLayout()
const audioPlayer = useAudioPlayer()
const library     = useLibrary()
const config      = useConfig()

// ── State ───────────────────────────────────────────────────────────
const refPlayerSection  = ref<InstanceType<typeof PlayerSection>>()
const currentTrackTitle = ref<string>("")
const currentAuthorName = ref<string>("")
const currentTranscript = ref<TrackTranscript|undefined>()
const percentPlayed     = computed(() => audioPlayer.position.value / audioPlayer.duration.value * 100)

// ── State ───────────────────────────────────────────────────────────
watch(audioPlayer.trackId, async (value) => {
  if (!value) {
    currentTranscript.value = undefined
    return
  }

  const currentTrack = await library.tracks.getOne(value)
  if (!currentTrack) { return }

  // TODO: Get author name using app language from config
  //       https://github.com/akdasa-studios/lectorium-mobile/issues/35
  currentAuthorName.value = (await library.authors.getOne(currentTrack.author)).getName('ru', 'full'),
  currentTrackTitle.value = currentTrack.getTitle(config.locale.value)

  // TODO: Get transcrupt using app language from config
  //       https://github.com/akdasa-studios/lectorium-mobile/issues/31
  const transcriptLanguages = currentTrack.languages
    .filter(x => x.source === 'transcript')
    .map(x => x.language)
  const transcriptLanguage = transcriptLanguages.includes(config.locale.value)
    ? config.locale.value
    : transcriptLanguages[0]
  currentTranscript.value = await library.transcripts.getTranscript(value, transcriptLanguage)

}, { immediate: true })

watch(appLayout.layoutState, (value) => {
  if (value === 'closed') { audioPlayer.stop() }
})

// ── Handlers ────────────────────────────────────────────────────────
function onPlayerClicked() {
  appLayout.layoutState.value = 'open'
}
</script>
