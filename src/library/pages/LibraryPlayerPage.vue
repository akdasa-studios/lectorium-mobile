<template>
  <PageWithHeader title="Library">
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
import { LecturePlayer } from '@/library/components'
import { useLibraryService } from '@/library/composables'
import { lectureToViewModel } from '@/library/helpers/mappers'
import { useGlobalAudioPlayer } from '@/shared/composables'

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  lectureId: string
}>()

// ── Dependencies ────────────────────────────────────────────────────
const libraryService = useLibraryService()
const globalAudioPlayer = useGlobalAudioPlayer()

// ── State ───────────────────────────────────────────────────────────
const lecture = ref<LectureViewModel>()

// ── Hooks ───────────────────────────────────────────────────────────
onIonViewWillEnter(onEnter)

// ── Handlers ────────────────────────────────────────────────────────
async function onEnter() {
  lecture.value = lectureToViewModel(
    await libraryService.getLecture(props.lectureId)
  )
  // globalAudioPlayer.playing.value = true;
  globalAudioPlayer.url.value = "https://audio.iskcondesiretree.com/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-01_London_1973-07-07_The_Material_World_Means--etc.mp3"
}
</script>

