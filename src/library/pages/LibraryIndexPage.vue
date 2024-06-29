<template>
  <PageWithHeader
    title="Library"
    :loading="false /* TODO: on first sync */"
    :header-border="false"
  >
    <template v-slot:header>
      <IonSearchbar v-model="searchQuery" :debounce="150" />
    </template>

    <TracksList
      v-if="!isLibraryEmpty"
      :items="tracks"
      @click="onTrackClicked"
    />
  </PageWithHeader>
</template>


<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { PlayingStatus, TrackViewModel, TracksList } from '@/library/components'
import { useLibraryRepository } from '@/library/composables'
import { lecturesToViewModel } from '@/library/helpers/mappers'
import { usePlaylist, useAudioPlayer } from '@/shared/composables'
import { PageWithHeader } from '@/shared/components'
import { IonSearchbar } from '@ionic/vue'
import { Lecture } from '../services'

// ── Dependencies ────────────────────────────────────────────────────
const libraryRepository = useLibraryRepository()
const playlist = usePlaylist()
const audioPlayer = useAudioPlayer()

// ── State ───────────────────────────────────────────────────────────
const searchQuery = ref('')
const isLibraryEmpty = computed(() => state.value.length === 0)
const tracks = ref<TrackViewModel[]>([])
const { state, execute } = useAsyncState<Lecture[], [string], true>(
  (p) => libraryRepository.getLecturesList(p), [], { resetOnExecute: false }
)

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
