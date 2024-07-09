<template>
  <PlaylistEmpty
    v-if="playlistEmpty && isReady"
  />
  <TracksList
    v-else
    :items="items"
    @click="onTrackClicked"
  />
</template>


<script setup lang="ts">
import { computed, watch } from 'vue'
import { Track } from '@core/models'
import { PlaylistEmpty } from '@lectorium/library'
import { PlayingStatus, TrackViewModel, TracksList } from '@lectorium/library/components'
import { useLibrary } from '@lectorium/library/composables'
import { useUserData } from '@lectorium/library'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { useAsyncState } from '@vueuse/core'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()
const userData = useUserData()
const audioPlayer = useAudioPlayer()

// ── Interface ───────────────────────────────────────────────────────
const emit = defineEmits<{
  click: [trackId: string]
}>()

// ── State ───────────────────────────────────────────────────────────
const { state: items, isReady } = useAsyncState<TrackViewModel[]>(
  async () => await fetchData(), [])
const playlistEmpty = computed(() => items.value.length === 0)

// ── Hooks ───────────────────────────────────────────────────────────
watch([
  () => audioPlayer.state.value.playing,
  () =>audioPlayer.state.value.trackId,
], async () => {
  /** Refresh playlist if current track or it's state has changed. */
  // TODO: There is no reason to fetch whole playlist items, just
  //       update playing status of the current track and previous one
  //       if it was changed.
  items.value = await fetchData()
}, { immediate: true })

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(playlistItem: TrackViewModel) {
  emit('click', playlistItem.trackId)
}

// ── Helpers ─────────────────────────────────────────────────────────
async function fetchData(): Promise<TrackViewModel[]> {
  // Fetch playlist items
  const playlistItems = await userData.playlistItems.getAll()

  // Load all related tracks
  const tracks =
    (await Promise.all(
      playlistItems
        .map(i => i.trackId)
        .map(i => library.tracks.get(i))
      )).reduce((acc, track) => {
        acc[track.id] = track
        return acc
      }, {} as Record<string, Track>)

  // Map playlist items to view models
  return playlistItems
    .sort((a, b) => a.order - b.order)
    .map(i => ({
      order: i.order,
      trackId: tracks[i.trackId].id,
      location: tracks[i.trackId].location,
      references: tracks[i.trackId].references,
      title: tracks[i.trackId].title,
      playingStatus: audioPlayer.state.value.trackId === i.trackId
        ? audioPlayer.state.value.playing ? PlayingStatus.Playing : PlayingStatus.Paused
        : PlayingStatus.None,
    }))
}
</script>
