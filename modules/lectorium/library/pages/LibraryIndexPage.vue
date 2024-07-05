<template>
  <PageWithDrawer ref="page">
  <!-- Top drawer -->
    <template v-slot:drawer>
      <Searchbar v-model="searchQuery" />
      <CollectionsList
        v-if="isCollectionsVisible"
        :items=collections
        @add="isCreateDialogOpen = true"
      />
    </template>

    <TracksList
      :items="tracks"
      @click="onTrackClicked"
    />

    <ion-tab-bar class="bar">
        <ion-tab-button tab="library" href="/app/library">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="player" href="/app/player">
          <ion-icon aria-hidden="true" :icon="playOutline" />
          <ion-label>Player</ion-label>
        </ion-tab-button>
      </ion-tab-bar>

    <CollectionsCreateDialog
      v-model:isOpen="isCreateDialogOpen"
    />
  </PageWithDrawer>
</template>


<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { Track } from '@core/models'
import { PlayingStatus, TrackViewModel, TracksList, CollectionsList, CollectionsCreateDialog } from '@lectorium/library/components'
import { Searchbar } from '@lectorium/shared/components'
import { useLibrary } from '@lectorium/library/composables'
import { lecturesToViewModel } from '@lectorium/library/helpers/mappers'
import { PageWithDrawer } from '@lectorium/shared/components'
import { usePlaylist, useAudioPlayer } from '@lectorium/shared/composables'

import {
  IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon,
  IonPage, IonRouterOutlet
} from '@ionic/vue'
import { homeOutline, playOutline } from 'ionicons/icons'


// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()
const playlist = usePlaylist()
const audioPlayer = useAudioPlayer()
const page = ref(null)

// ── State ───────────────────────────────────────────────────────────
const searchQuery = ref('')
const isLibraryEmpty = computed(() => state.value.length === 0)
const tracks = ref<TrackViewModel[]>([])

const { state, execute } = useAsyncState<Track[], [string], true>(
  (p) => library.tracks.getLecturesList(p), [], { resetOnExecute: false }
)
const { state: collections } = useAsyncState(() => library.collections.getAll(), [])

const isCollectionsVisible = ref(true)
const isCreateDialogOpen = ref(false)

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


<style scoped>
.bar {
  position: sticky;
  bottom: 0;
  width: 100%;
}
</style>