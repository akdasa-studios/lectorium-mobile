<template>
  <PageWithHeader title="Home">
    <TracksList
      :items="tracks"
      @click="onTrackClicked"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { onIonViewWillEnter } from '@ionic/vue'
import { PageWithHeader } from '@/shared/components'
import { TracksList, TrackViewModel } from '@/library/components'
import { useLibraryService } from '@/library/composables'
import { lecturesToViewModel } from '@/library/helpers/mappers'
import { usePlaylist } from '@/shared/composables'

// ── Dependencies ────────────────────────────────────────────────────
const libraryService = useLibraryService()
const playlist = usePlaylist()

// ── State ───────────────────────────────────────────────────────────
const tracks = ref<TrackViewModel[]>([])

// ── Hooks ───────────────────────────────────────────────────────────
onIonViewWillEnter(onEnter)

// ── Handlers ────────────────────────────────────────────────────────
async function onEnter() {
  const response = await libraryService.getLecturesList()
  tracks.value = lecturesToViewModel(response)
}

function onTrackClicked(trackId: string) {
  playlist.enqueue(trackId)
}
</script>

