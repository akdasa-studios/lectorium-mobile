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
import { onIonViewWillEnter, useIonRouter } from '@ionic/vue'
import { PageWithHeader } from '@/shared/components'
import { LecturesList, LectureViewModel } from '@/library/components'
import { useLibraryService } from '@/library/composables'
import { lecturesToViewModel } from '@/library/helpers/mappers'
import { useGlobalAudioPlayer } from '@/shared/composables'

// ── Dependencies ────────────────────────────────────────────────────
const libraryService = useLibraryService()
const globalAudioPlayer = useGlobalAudioPlayer()
const router = useIonRouter()

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
  globalAudioPlayer.trackId.value = lectureId
  globalAudioPlayer.url.value = "https://audio.iskcondesiretree.com/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-01_London_1973-07-07_The_Material_World_Means--etc.mp3";
  globalAudioPlayer.playing.value = true;
  router.push({ name: 'player' })

}
</script>

