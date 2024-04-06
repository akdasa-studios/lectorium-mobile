<template>
  <PageWithHeader title="Library">
    <LecturePlayer 
      style="height: 100%;" 
      url="http://localhost:8080/SP_BG_01-04_London_1973-07-10_Everything_Even--etc.mp3"
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

// ── Interface ───────────────────────────────────────────────────────
const props = defineProps<{
  lectureId: string
}>()

// ── Dependencies ────────────────────────────────────────────────────
const libraryService = useLibraryService()

// ── State ───────────────────────────────────────────────────────────
const lecture = ref<LectureViewModel>()

// ── Hooks ───────────────────────────────────────────────────────────
onIonViewWillEnter(onEnter)

// ── Handlers ────────────────────────────────────────────────────────
async function onEnter() {
  lecture.value = lectureToViewModel(
    await libraryService.getLecture(props.lectureId)
  )
}
</script>

