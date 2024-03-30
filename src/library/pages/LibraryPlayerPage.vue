<template>
  <PageWithHeader title="Library">
    {{ lecture }}
  </PageWithHeader>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { onIonViewWillEnter } from '@ionic/vue'
import { PageWithHeader } from '@/shared/components'
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

