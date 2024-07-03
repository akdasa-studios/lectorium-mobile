<template>
  <PageWithDrawer ref="page">
    <template v-slot:drawer>
      <TracksSearchInput v-model="searchQuery" />
      <CollectionsList
        v-if="isCollectionsVisible"
        :items=collections
      />
    </template>

    <TracksList
      :items="tracks"
      @click="onTrackClicked"
    />

    <CollectionsCreateDialog
      v-model:isOpen="isCreateDialogOpen"
    />
  </PageWithDrawer>
</template>


<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { PlayingStatus, TrackViewModel, TracksList, CollectionsList, TracksSearchInput, CollectionsCreateDialog } from '@lectorium/library/components'
import { useCollectionsRepository, useLibraryRepository } from '@lectorium/library/composables'
import { lecturesToViewModel } from '@lectorium/library/helpers/mappers'
import { PageWithDrawer } from '@lectorium/shared/components'
import { usePlaylist, useAudioPlayer } from '@lectorium/shared/composables'
import { Track } from '@core/models'

// ── Dependencies ────────────────────────────────────────────────────
const libraryRepository = useLibraryRepository()
const collectionsRepository = useCollectionsRepository()
const playlist = usePlaylist()
const audioPlayer = useAudioPlayer()
const page = ref(null)

// ── State ───────────────────────────────────────────────────────────
const searchQuery = ref('')
const isLibraryEmpty = computed(() => state.value.length === 0)
const tracks = ref<TrackViewModel[]>([])

const { state, execute } = useAsyncState<Track[], [string], true>(
  (p) => libraryRepository.getLecturesList(p), [], { resetOnExecute: false }
)
const { state: collections } = useAsyncState(() => collectionsRepository.getAll(), [])

const isCollectionsVisible = ref(true)
const isCreateDialogOpen = ref(true)

// ── Hooks ───────────────────────────────────────────────────────────
watch([
  state,
  playlist.trackIds.value,  /* When playlist changes */
  playlist.currentTrackId,  /* When track changes */
  audioPlayer.playing,      /* When audio player state changes */
  audioPlayer.loading,      /* When audio player state changes */
], () => {
  tracks.value = lecturesToViewModel(state.value)
  for (const track of tracks.value) {
    if (track.id === playlist.currentTrackId.value) {
      track.playingStatus =
        audioPlayer.loading.value
          ? PlayingStatus.Loading
          : audioPlayer.playing.value
            ? PlayingStatus.Playing
            : PlayingStatus.Paused
    } else if (playlist.trackIds.value.includes(track.id)) {
      track.playingStatus = PlayingStatus.InQueue
    } else {
      track.playingStatus = PlayingStatus.None
    }
  }
})

watch(searchQuery, async (value) => {
  await execute(0, value)
  isCollectionsVisible.value = value === ''
})

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(trackId: string) {
  if (playlist.currentTrackId.value === trackId) {
    audioPlayer.togglePlaying()
  } else {
    // If the playlist is empty, set playing to true. This will start the audio
    // once it is downloaded. Enqueue the trackId to the playlist.
    if (playlist.isEmpty()) { audioPlayer.play() }
    playlist.enqueue(trackId)
  }
}
</script>
