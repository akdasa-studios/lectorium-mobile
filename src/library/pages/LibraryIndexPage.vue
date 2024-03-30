<template>
  <PageWithHeader title="Home">
    <LecturesList
      :lectures="lectures"
      @click="onLectureClicked"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { onIonViewWillEnter } from '@ionic/vue'
import { PageWithHeader } from '@/shared/components'
import { LecturesList, LectureViewModel } from '@/library/components'
import { useLibraryService } from '@/library/composables'
import { lecturesToViewModel } from '@/library/helpers/mappers'

// ── Dependencies ────────────────────────────────────────────────────
const libraryService = useLibraryService()

// ── State ───────────────────────────────────────────────────────────
const lectures = ref<LectureViewModel[]>([])

// ── Hooks ───────────────────────────────────────────────────────────
onIonViewWillEnter(onEnter)

// ── Handlers ────────────────────────────────────────────────────────
async function onEnter() {
  lectures.value = lecturesToViewModel(
    await libraryService.getLecturesList()
  )
}

function onLectureClicked(lectureId: string) {
  console.log('Lecture clicked:', lectureId)
}
</script>

