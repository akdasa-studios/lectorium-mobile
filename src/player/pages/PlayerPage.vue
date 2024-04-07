<template>
  <PageWithHeader title="Library">
    {{ lecture }}
    <LecturePlayer 
      style="height: 100%;" 
      v-model:playing="globalAudioPlayer.playing.value"
      v-model:position="globalAudioPlayer.position.value"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { onIonViewWillEnter } from '@ionic/vue'
import { PageWithHeader } from '@/shared/components'
import { LecturePlayer } from '@/player/components'
import { useLibraryService } from '@/library/composables'
import { lectureToViewModel } from '@/library/helpers/mappers'
import { useGlobalAudioPlayer } from '@/shared/composables'

// ── Dependencies ────────────────────────────────────────────────────
const libraryService = useLibraryService()
const globalAudioPlayer = useGlobalAudioPlayer()

// ── State ───────────────────────────────────────────────────────────
const lecture = ref<LectureViewModel|undefined>(undefined)

onIonViewWillEnter(onEnter)

// ── Handlers ────────────────────────────────────────────────────────
async function onEnter() {
  lecture.value = lectureToViewModel(
    await libraryService.getLecture(globalAudioPlayer.trackId)
  )
}
</script>

