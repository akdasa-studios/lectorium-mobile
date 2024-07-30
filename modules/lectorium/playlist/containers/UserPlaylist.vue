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
import { PlaylistEmpty, PlayingStatus, TrackViewModel, TracksList, useUserData } from '@lectorium/playlist'
import { useAudioPlayer } from '@lectorium/shared/composables'
import { useAsyncState } from '@vueuse/core'
import { useLibrary } from '@lectorium/library'

// ── Dependencies ────────────────────────────────────────────────────
const library = useLibrary()
const userData = useUserData()
const audioPlayer = useAudioPlayer()

// ── Interface ───────────────────────────────────────────────────────
const emit = defineEmits<{
  click: [trackId: string]
}>()

// ── State ───────────────────────────────────────────────────────────
const { state: items, isReady, execute: refresh } = useAsyncState<TrackViewModel[]>(
  async () => await fetchData(), [])
const playlistEmpty = computed(() => items.value.length === 0)

// ── Hooks ───────────────────────────────────────────────────────────
watch([
  () => audioPlayer.state.value.playing,
  () => audioPlayer.state.value.trackId,
], async () => {
  /** Refresh playlist if current track or it's state has changed. */
  // TODO: There is no reason to fetch whole playlist items, just
  //       update playing status of the current track and previous one
  //       if it was changed.
  items.value = await fetchData()
}, { immediate: true })


watch(userData.playlistItems.changedAt, async () => {
  await refresh()
})

// ── Handlers ────────────────────────────────────────────────────────
function onTrackClicked(playlistItem: TrackViewModel) {
  emit('click', playlistItem.trackId)
}

async function fetchData(): Promise<TrackViewModel[]> {
  // Fetch playlist items
  const playlistItems = await userData.playlistItems.service.getAll()

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
  return await Promise.all(playlistItems
    .sort((a, b) => a.order - b.order)
    .map(async i => ({
      order: i.order,
      trackId: tracks[i.trackId].id,
      references: await Promise.all(
        tracks[i.trackId].references.map(
          async x => await library.sources.getLocalizedReference(x, 'ru'))),
      title: tracks[i.trackId].title,
      playingStatus: audioPlayer.state.value.trackId === i.trackId
        ? audioPlayer.state.value.playing ? PlayingStatus.Playing : PlayingStatus.Paused
        : PlayingStatus.None,
    })))
}
</script>
